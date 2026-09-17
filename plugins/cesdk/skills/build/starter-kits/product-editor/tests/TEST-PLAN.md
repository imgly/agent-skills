# Test plan: starterkit-product-editor

Version 7, 7 Sep 2026. Status: implemented. 108 unit, component and headless tests and 13 browser tests run in `npm run ci` (exit 0). Merged coverage is lines 99.92 %, branches 98.68 %, functions 100 %.

## 1. Purpose

Verify that the Product Editor starter kit works as shipped: the editor opens on the default product, the six-product catalogue drives the scene, each area gets a page clipped to its printable shape with the matching mockup behind it, colour swatches swap the mockup, design content survives a product switch, and the download link produces one PDF and one thumbnail per area plus the scene archive.

## 2. Scope

In scope

- The `ProductBackdrop` plugin: `product.setupScene`, `product.switchArea`, `product.getVisibleAreaId`, `product.applyVariables`
- Page creation, sizing, stroke, clipping and the optional `vector_path` page shape
- Backdrop geometry, `{{key}}` substitution in mockup image URIs, and the backdrop config stored on page metadata
- The React sidebar: product grid, colour picker, download link
- The registered `product-area-select` canvas-bar component
- The kit's editor configuration under `src/imgly/config/`
- The download bundle produced by `downloadProductAssets`

Out of scope

- Core editor features reached through this kit (text editing, asset library, crop, undo, inspector). Covered by the core editor suite.
- The demo site around the kit (cards, tags, links, platform toggles, Back to Demos). Covered by the `cesdk_web_demos` suite. Qase 4029, 4030, 4031, 4032, 4033, 4034, 4041, 4044, 4045.
- The iOS and Android showcase apps reached from the demo site's platform switch. They are not this kit; a separate mobile suite owns them. Qase 4035, 4036, 4037, 4038, 4039, 4040, 4245, 4246.

## 3. Test environment

- Browser: Chrome, headless, 1400 × 900
- Engine and editor: built from this repo, served locally. Requests to `cdn.img.ly` for engine assets fail the test.
- License: the shared test license (valid on hostname `localhost` only)
- Data: the kit has no `public/` and no scene file — `ProductBackdrop` builds the scene from `src/app/product-catalog.ts`. Mockup PNGs and product thumbnails come from `VITE_DEMO_ASSETS_BASE_URL`, pointed at the in-repo copy `packages/cesdk-web-examples-data/data/starterkit-product-editor/`, so no test reaches `staticimgly.com`.
- Hook: `src/index.tsx` already sets `window.cesdk`. Browser cases read engine state through it.
- Headless: Vitest + `@cesdk/node` (`@cesdk/engine` aliased to it). Backdrop images are `file://` URIs into the same in-repo demo data, so a headless run makes no network request.
- Downloads: captured by Playwright and checked by file type and PDF page count.

## 4. Approach

| Kind     | Tool                          | What it checks                                                      | Run                 |
| -------- | ----------------------------- | ------------------------------------------------------------------- | ------------------- |
| Static   | tsc, eslint, convention check | Types, deprecated APIs, kit folder shape                            | `npm run check:all` |
| Unit     | Vitest                        | Pure backdrop maths, catalogue invariants, editor configuration     | `npm run test:unit` |
| Headless | Vitest + `@cesdk/node`        | Scene setup, page shape, backdrop geometry, variables, export files | `npm run test:unit` |
| Browser  | Playwright                    | The test cases in section 5                                         | `npm run test:e2e`  |

All four run in the kit's `ci` script. Browser tests use role and label locators only.

Extraction landed: `src/imgly/plugins/product-backdrop.ts` mixed engine-only scene building with editor-only navigation. Moved `calculateBlockLayout`, `applyVariables`, `createPage`, `setupPage`, `applyPageShape`, `createBackdropBlock` and a new `setupScene(engine, options)` into a sibling `src/imgly/plugins/product-scene.ts` that imports only types from `@cesdk/cesdk-js`; the plugin class registers `product.setupScene` and `product.applyVariables` as one-line delegates (`applyBackdropVariables` is the engine-only half of the latter). A headless caller must set `page/allowShapeChange` itself, which the plugin does in `initialize`. `product.switchArea` and `product.getVisibleAreaId` stay in the plugin — they call `cesdk.unstable_switchPage` and `cesdk.actions.run('zoom.toBlock')`, which `@cesdk/node` does not have, so their cases are browser. Same split for `src/app/utils/product.ts`: the export loop is now `exportProductAssets(engine)` returning the blobs, `downloadProductAssets(engine)` triggers the downloads, and `storeProductMetadata` / `readProductFromMetadata` take an engine rather than the editor.

## 5. Test cases

Format: ID, level, Qase id, title. Then steps and expected result.
Common precondition for all browser cases: the kit is open in the browser and the first product has finished loading.

### 5.1 Start-up and the sidebar

**PE-01 · browser · Qase 4089 · Editor opens on the default product**
Steps: open the kit.
Expected: Mens T-Shirt is the active product button, the white swatch is the active colour, Front is the active button in the canvas bar, and the visible backdrop block is `Backdrop-front` with a `{{color}}`-free URI ending in `white_front.png`. No console errors. No request to `cdn.img.ly`.

**PE-02 · browser · Qase 4078 · Six products are offered**
Steps: read the Product section.
Expected: six buttons, titled Mens T-Shirt, Baseball Cap, Arrow Sign, Coffee Mug, Phone Case, Tote Bag, each with a thumbnail image that loaded.

**PE-03 · browser · Qase 4079, 4081 · Colour swatches**
Steps: read the Color section, then click the black swatch.
Expected: six swatches for the t-shirt, each with the catalogue's `colorHex` as its background. After the click black is the only active swatch and the visible backdrop URI ends in `black_front.png`.

**PE-04 · browser · Qase 4088 · The product section sits right of the editor**
Steps: read the layout.
Expected: the sidebar's bounding box starts to the right of the editor's, and both are inside the viewport.

**PE-05 · browser · Qase 4090 · Area buttons appear only for two-area products**
Steps: select each of the six products in turn.
Expected: Front and Back buttons for Mens T-Shirt and Baseball Cap; no area button group for Arrow Sign, Coffee Mug, Phone Case, Tote Bag.

**PE-06 · browser · Qase 4172 · The whole product is in view after a switch**
Steps: select Coffee Mug.
Expected: the visible backdrop block's bounding box lies inside the canvas viewport on both axes. (Zoom-to-block with `autoFit` is engine and editor behaviour; this case only proves the kit asked for it on the backdrop, not the page.)

### 5.2 Areas and product switching

**PE-07 · browser · Qase 4092 · Design content survives a product switch**
Steps: add a text block on the T-Shirt front, then select Tote Bag.
Expected: the block is still a child of the page named `front` and is rendered on the tote bag.

**PE-08 · browser · Qase 4093 · Back content is not shown on a one-area product**
Steps: on the T-Shirt switch to Back, add a text block, then select Coffee Mug.
Expected: no area button group, the current page is named `front`, and the block added on `back` is not on the canvas. Known issue 2: the `back` page itself is still in the scene.

**PE-09 · browser · Qase 4094, 4173 · Back content carries over to the Baseball Cap**
Steps: from the state of PE-08, select Baseball Cap and click Back.
Expected: Front and Back buttons are both present, the block added in PE-08 is on the cap's back page, and switching to Front and back to Back keeps it.

**PE-10 · browser · Qase 4168 · Colour resets when the product changes**
Steps: select black on the T-Shirt, then select Baseball Cap.
Expected: white is the active swatch again and the cap backdrop URI ends in `white_front.png`.

**PE-11 · browser · Qase 4091 · The Arrow Sign page is clipped to its silhouette**
Steps: select Arrow Sign.
Expected: the page's shape block is of type `//ly.img.ubq/shape/vector_path`, its `shape/vector_path/path` equals the catalogue's `pageShape`, and its width and height equal the area's `printableAreaPx`. Selecting Coffee Mug afterwards leaves a `rect` shape and no orphaned `vector_path` block in the scene.

### 5.3 Download

**PE-12 · browser · Qase 1854 · No Export in the navigation bar; the "here" link downloads the bundle**
Steps: read the navigation bar, then click "here" in the Product section with the T-Shirt selected.
Expected: the navigation bar shows undo/redo, the title and zoom only — no actions dropdown and no export button. The click produces five downloads: `scene-<ts>-front.pdf`, `scene-<ts>-back.pdf`, two `scene-thumbnail-<ts>-*.png` of 200 × 200 px, and `scene-<ts>.imgly`. Each PDF has one page.

**PE-13 · browser · A one-area product downloads three files**
Steps: select Coffee Mug, click "here".
Expected: one PDF, one PNG 200 px wide, one `.imgly`. Known issue 2 means the archive still contains the pages of previously selected products. Run note: `targetWidth`/`targetHeight` bound the export rather than forcing it, so the mug's 9 × 11.58 page comes out 200 × 257; only a square page gives 200 × 200.

### 5.4 Headless cases (engine, no browser)

Subject: the extracted `src/imgly/plugins/product-scene.ts` and `exportProductAssets`.

**PE-H1 · headless · Setup creates one page per enabled area**
Steps: run `setupScene` with the T-Shirt options.
Expected: two pages named `front` and `back`, the scene design unit is `Inch`, each page is its catalogue `pageSize`, its stroke is enabled and `width * 0.005` wide, it is clipped, `editor/select` is off for it, and its fill colour is fully transparent. Run note: the t-shirt page is 12 × 12, not the 20 × 20 this plan first stated — that is the sibling t-shirt kit's size.

**PE-H2 · headless · Backdrop geometry follows the printable area**
Steps: run `setupScene` for the T-Shirt front.
Expected: one graphic of kind `backdrop_image` named `Backdrop-front`, hidden, with an image fill whose source set is the substituted image, and width, height, x and y equal to `calculateBlockLayout(pageWidth, config)` for the catalogue's numbers. Run note: every backdrop is inserted at index 0, so the two of them occupy the scene's first two child slots and the _last_ one created is first; the case asserts the pair, not one block.

**PE-H3 · headless · Page shape follows the area**
Steps: run `setupScene` for Arrow Sign, then for Coffee Mug on the same engine.
Expected: the Arrow Sign page carries a `vector_path` shape with the catalogue path and the `printableAreaPx` size; the Coffee Mug page carries a `rect`. After the second run the block count for `vector_path` shapes is zero — the old shape is destroyed, not orphaned.

**PE-H4 · headless · Variables are substituted at setup**
Steps: run `setupScene` with `variables: { color: 'black' }`.
Expected: the backdrop's source-set URI contains `black_front.png` and no `{{`; the page's `backdrop_config` metadata parses to the substituted images plus the `printableAreaPx`.

**PE-H5 · headless · Re-running setup rebuilds backdrops and reuses pages**
Steps: run `setupScene` for the T-Shirt, add a graphic to the `front` page, then run `setupScene` for the Coffee Mug.
Expected: the added graphic is still on the `front` page, exactly one block of kind `backdrop_image` exists, and the `back` page is still in the scene (known issue 2 — the sibling t-shirt kit destroys it).

**PE-H6 · headless · `applyVariables` swaps the backdrop image only**
Steps: after PE-H2, apply `{ color: 'red' }`.
Expected: the backdrop's source-set URI ends in `red_front.png`; its width, height, x, y and crop are unchanged. An area with no mockup, and an area whose backdrop block is missing, are skipped without throwing.

**PE-H7 · headless · The export bundle**
Steps: run `exportProductAssets` on a T-Shirt scene that also carries a stale `sleeve` page from a previous product.
Expected: one `application/pdf` blob and one `image/png` blob per enabled area, keyed by area id, plus the archive; pages whose name is not an enabled area id are skipped; the page stroke is enabled again afterwards. A third case asserts the stroke is restored when an export fails, which the `try`/`finally` added for known issue 1 now guarantees.

### 5.5 Unit cases (no engine, no browser)

**PE-U1 · unit · `applyVariables`**
Multiple keys substituted in one URI; a token repeated in one URI replaced everywhere; an unknown key leaves its token untouched; an empty map returns the URIs unchanged; `width` and `height` are carried over; the input array is not mutated.

**PE-U2 · unit · `calculateBlockLayout`**
For the T-Shirt front the scale is `pageWidth / printableAreaPx.width` and width, height, x and y follow it. An empty `images` array throws `Backdrop configuration must include images`. Run note: the printable area is `centeredPrintArea(814, 947, 360, 360, -100)`, so x is 227 and y is 193.5 — not the 227.5 / 134 this plan first stated. The case computes the expected values from the catalogue instead of restating them.

**PE-U3 · unit · `setupSceneOptions`**
Disabled areas are dropped; `designUnit` is passed through; `variables.color` is the colour id; each mapped area carries only `id`, `pageSize` and `mockup`.

**PE-U4 · unit · Catalogue invariants**
Six products with unique ids; every product has exactly one colour marked `isDefault`; every enabled area has a `mockup` with at least one image and a `printableAreaPx`; every mockup URI contains `{{color}}` and starts with `ASSETS_BASE`; `designUnit` is a valid `SceneDesignUnit`; the Arrow Sign is the only product with a `pageShape`.

**PE-U5 · unit · Editor configuration**
On a spy `cesdk`: `setupFeatures` enables exactly the 103 ids listed in `features.ts`, asserted as the whole array, with no page or video feature and each control named on its own (`ly.img.navigation.bar`, `ly.img.text.edit`, `ly.img.crop.size`, `ly.img.inspector.bar`) rather than through a `ly.img.navigation`, `ly.img.text`, `ly.img.crop` or `ly.img.inspector` parent; `initProductEditor` adds the configuration, then the backdrop plugin, then the fourteen asset sources through one `Promise.all`, which a case in `tests/unit/asset-sources.test.ts` proves by holding every `addPlugin` open and checking all fourteen were requested before any of them resolved. That case keeps its own file because the plugin build and the backdrop plugin are stubbed there, which would otherwise pull the backdrop into the Vitest coverage graph; `setupActions` registers `saveScene`, `exportDesign`, `importScene` and `exportScene` and no `exportImage`; the dock order is the six entries of `dock.ts` in order, with labels shown at the large icon size; the navigation bar order is undo/redo, title and zoom and contains no `ly.img.actions.navigationBar` (this is what Qase 1854 asserts through the UI); the canvas bar is `spacer, product-area-select, spacer` at the bottom; `setupComponents` registers only `product-area-select`; `setupPanels` docks the inspector right and the assets panel left, both non-floating; `setupSettings` applies the engine settings of `settings.ts`.

**PE-U6 · unit · Product metadata round trip**
`storeProductMetadata` then `readProductFromMetadata` on a fake engine returns an equal product and stores the colour too; with no scene both are no-ops and the read returns `null`; with a scene but no `product` key the read returns `null`.

**PE-U13 · unit · `src/index.tsx`**
The entry renders the editor, hands the created instance to the app and publishes it on `window`, posts the demo lifecycle beacon `created`, and gives the editor the beacon's own `onLoadingStateChange` handler; it fails loudly with `Root container not found` when the page ships no such element.

**PE-U14 · unit · `setupScene` guard**
Fails loudly with `No page block found for area: front` when the engine cannot find the page it just named.

**KB-01 · unit · Keyboard catalog predicates**

`tests/unit/keyboard-catalog.test.ts` runs every `run` and `when` of `src/imgly/config/keyboard/catalogs/us-ansi.ts` against 1620 editor states (5 edit modes, 9 selections, 3 roles, features on and off, 3 vector states, page and no page) and asserts that none throws, that every shortcut activates in at least one state, and that every function `run` reaches `cesdk.actions.run`. Kit-owned: the kit decides which key does what and when it is live. The catalog measures 100 % lines, branches and functions.

## 6. Entry and exit criteria

Entry: engine and editor built; test license available; the shared kit test harness exists; the demo data resolves from the in-repo package in both dev and static mode; the extraction in section 4 has landed; the kit's `test:unit` and `test:e2e` scripts replaced with the real commands. All met.

Exit: every case in section 5 passes locally and in CI. `npm run ci` passes. The published kit contains no test files. A release run reports results to the Qase ids above.

## 7. Known issues found while writing this plan

Fixed in this batch: issue 3 — the unreachable `exportImage` action is deleted.

The rest are confirmed and still open.

1. ~~`exportProductAssets` disables the page stroke, exports, then re-enables it, with no `try`/`finally`.~~ Fixed: the two exports run inside a `try` whose `finally` re-enables the stroke. PE-H7's third case now passes.
2. Pages of previously selected products are never removed. Switching T-Shirt → Coffee Mug leaves the `back` page in the scene and in the `.imgly` archive. The sibling t-shirt kit's copy of the same plugin destroys them, so the two kits disagree on the intended behaviour.
3. Fixed. `actions.ts` registered `exportImage`, `exportScene`, `saveScene` and `importScene`, none of them reachable, because the navigation bar has no actions dropdown, which Qase 1854 states is deliberate. `exportImage` is deleted; the other three stay because a customer wiring the dropdown back in expects them.
4. `createPage` reads the page's fill and immediately assigns the same fill back. The `setFill` call does nothing.
5. The area selector returns early on `product.areas.length <= 1`, counting disabled areas, then filters them when building the buttons. A product with one enabled and one disabled area would render a button group with a single button.
6. The dock lists a combined Elements entry and then Image, Text, Shapes and Stickers again, so each of those libraries appears twice.
7. `config/i18n.ts` is an empty `void cesdk;` stub while the README documents localization with a code sample.
8. The README's Architecture tree lists `backdrop.ts`, `constants.ts`, `mask.ts` and `page.ts`, none of which exist, and omits `plugins/product-backdrop.ts` and `config/keyboard/`. Its Configuration section points at `src/product-catalog.ts`; the file is `src/app/product-catalog.ts`.
9. `product.switchArea` returns silently when no page matches the area id, so a typo in a catalogue area id produces no message.

### Coverage residue

One line and two branch arms of `src/**` are left: the `readProductFromMetadata` fallback and the `!product` guard in `handleColorChange` (`src/app/App.tsx:111-113`). Unreachable by construction — `Sidebar` renders the colour picker only while the catalogue holds the current product id, so the lookup above the fallback always succeeds.

## 8. Open questions

1. Issue 2: destroy stale pages as the t-shirt kit does, or keep them so content survives a product switch back? Recommendation: keep them (Qase 4092 and 4173 depend on it) and exclude them from the archive as well as from the export, which `downloadProductAssets` already does for the export.
2. Issue 1: fixed with a `try`/`finally`.
3. Issue 3: resolved — `exportImage` deleted, matching the P2 resolution for the single-page-editor kit. PE-U5 keeps its "no actions dropdown" assertion.

## 9. Estimate

13 browser cases at about 9 s each (product switches reload backdrops): under 2.5 minutes on one worker. 7 headless cases sharing one engine: about 20 s. Unit tests under 1 s.

## 10. Boundary review

Rule used: the code that makes a decision owns the test for it. The kit decides the product catalogue, the page-per-area model, the backdrop geometry and its `{{key}}` substitution, which areas get a `vector_path` page shape, the colour-swap flow, the dock and navigation bar composition, and the contents of the download bundle. The engine decides what a `vector_path` shape clips, what `resizeContentAware` does, and what an export produces. The editor decides how a registered component renders in the canvas bar and how `zoom.toBlock` frames a block.

Core behaviour this plan leans on, and where it is covered today:

| Behaviour                                                                 | Owner  | Covered by                                                                                                                                   |
| ------------------------------------------------------------------------- | ------ | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `createShape` + `setShape` replaces a block's shape                       | engine | `bindings/shared/ts/src/tests/block-effects.test.ts:184` `setShape - replaces existing shape`; `engine/lib/test/api/EffectsAPITest.cpp:806`  |
| `setSourceSet` / `getSourceSet` round trip and overwrite on an image fill | engine | `bindings/shared/ts/src/tests/block-placeholder.test.ts:404`; `engine/lib/test/api/BlockPropertiesTest.cpp:366`                              |
| `resizeContentAware`                                                      | engine | `bindings/shared/ts/src/tests/block-crop-frame.test.ts:526`; guard arms in `engine/lib/test/api/MiscCoreAPITest.cpp:671`                     |
| `findByName` / `findByKind` / `findByType`                                | engine | `engine/lib/test/api/BlockLifecycleTest.cpp:299, 313, 329`; JS side `bindings/shared/ts/src/tests/block-find-identity-visibility.test.ts:20` |
| `block.export` to PDF and to PNG                                          | engine | `engine/lib/test/api/ExportAPITest.cpp` PDF matrix (about 20 cases from `:417`); `bindings/shared/ts/src/tests/block-export.test.ts:33`      |
| `scene.saveToArchive` / `saveToString` and reload                         | engine | `engine/lib/test/api/ArchiveRoundTripAPITest.cpp:153`; `bindings/shared/ts/src/tests/scene-extended.test.ts:296`                             |
| `scene.setDesignUnit`, `scene.getCurrentPage`                             | engine | `engine/lib/test/api/BlockLayoutTest.cpp:558`; `bindings/shared/ts/src/tests/scene-viewport.test.ts:288, 226`                                |
| `editor.setSelectionEnabled`                                              | engine | `engine/lib/test/api/SelectionInteractionAPITest.cpp:155`                                                                                    |
| `featureFlags.singlePageMode` hides the other pages                       | editor | `apps/cesdk_web/packages/cesdk/stores/ConfigurationStore.test.ts:86, 91`; `apps/cesdk_web/packages/engine/engine/page/manager.test.ts:295`   |
| `ui.registerComponent`, `ui.setComponentOrder`, panel position            | editor | `apps/cesdk_web/packages/api/ui/UserInterfaceAPI.test.ts:2578, 72, 2448`                                                                     |
| `actions.register` / `run`, and `zoom.toBlock` with `autoFit`             | editor | `apps/cesdk_web/packages/api/actions/ActionsAPI.test.ts:41`; `apps/cesdk_web/packages/cesdk/registerDefaultActions.test.ts:519, 737`         |
| `feature.enable` with a list of ids                                       | editor | `apps/cesdk_web/packages/api/features/FeatureAPI.test.ts:66`                                                                                 |

Core coverage gaps found (candidates to add in the core suites, not in this kit):

1. Engine: `setShape` does not destroy the shape it replaced, and no test says whether it should. `block-effects.test.ts:184` swaps rect for ellipse and never looks at the old block. The plugin destroys the old shape by hand on every product switch (`applyPageShape`), so PE-H3's "no orphaned `vector_path` block" assertion is the only thing pinning it. Suggested home: `bindings/shared/ts/src/tests/block-effects.test.ts`.
2. Engine: `page/allowShapeChange` has no test. The only two mentions in the test tree are fixture setup in `SVGExportTest.cpp:373` and a comment in `ShapeFillPlaceholderAPITest.cpp:155`. This plugin sets it to `true` in `initialize` and PE-11 depends on the gate. Suggested home: `engine/lib/test/api/BlockAppearanceTest.cpp`.
3. Engine: `setScopeEnabled(block, 'editor/select', false)` is never asserted to prevent selection. `ScopeMatrixAPITest.cpp:217` only lists the scope name in a sweep. The kit uses it on every page and every backdrop. Suggested home: `engine/lib/test/api/SelectionInteractionAPITest.cpp`, next to the `setSelectionEnabled` cases.
4. Engine: metadata round trip on the **scene** block. `block-metadata.test.ts:24` and `AppearanceRoundTripAPITest.cpp:279` both use a graphic. This kit stores the product and the colour on the scene block and reads them back after a reload. Suggested home: `bindings/shared/ts/src/tests/block-metadata.test.ts`.
5. Engine: `targetWidth` / `targetHeight` on the JS `block.export` options object. Covered in gtest (`ExportAPITest.cpp:137`) but not from JS. The 200 × 200 thumbnail in the download bundle depends on it. Suggested home: `bindings/shared/ts/src/tests/block-export.test.ts`.
6. Editor: `cesdk.unstable_switchPage` has no test anywhere — its only occurrence outside this kit is its definition at `apps/cesdk_web/packages/cesdk/index.tsx:789`. Every area switch in this kit and its t-shirt sibling goes through it. Suggested home: `apps/cesdk_web/packages/cesdk/`.
7. Editor: builder `ButtonGroup` and `Button` with `isActive`. The design-system `Button` has one `aria-pressed` test (`Button.test.tsx:49`), the design-system `ButtonGroup` has none, and no test drives them through `builder.ButtonGroup(...)`. The area selector is exactly that shape and Qase 4090 exercises it. Suggested home: `apps/cesdk_web/packages/ui/builder/`.
8. Editor: the React wrapper `@cesdk/cesdk-js/react` (`packages/cesdk-react/`) has no test file at all — not the `init` callback, not re-mount on a `key` change, not disposal. Every one of the 19 React starter kits mounts through it. Suggested home: `packages/cesdk-react/`.

Until gaps 1, 2 and 6 are closed, PE-11 and PE-H3 keep their shape assertions and PE-09 keeps its area round trip as the end-to-end proof.

## 11. Coverage pass

Cases added to close the merged-coverage gaps:

- **PE-U7 · unit · The actions the kit registers — every handler `setupActions` registers is invoked: `saveScene` downloads the saved scene as text, `exportDesign` downloads what `cesdk.utils.export` returned, `importScene` opens the picker for `.imgly,.scene,.zip`, revokes the blob URL on the success and on the failure path and then runs `zoom.toPage`, `exportScene` writes a JSON scene by default and a zip archive for `{ format: 'archive' }`, and `uploadFile` returns what `cesdk.utils.localUpload` returned**
- **PE-U8 · unit · ProductEditorConfig — `initialize` resets the editor, pins the editor compatibility version to `CreativeEditorSDK.version` as its second call, then applies features, UI, actions, shortcuts, translations and engine settings; with no `cesdk` in the context it touches the engine not at all**
- **PE-U9 · unit · Video timeline scaffold — `setupVideoTimeline` makes no editor call, so the kit ships the timeline example unapplied**
- **PE-U10 · unit · `exportProductAssets` — exports a PDF and a thumbnail for every enabled area only, toggling the page stroke around each export, and exports nothing when the scene carries no product**
- **PE-U11 · unit · `downloadProductAssets` — downloads one PDF, one thumbnail and the archive under timestamped names and removes the anchors it created**
- **PE-U12 · unit · the area selector — one button per enabled area with the current one active, the first area when no page is current, nothing without a scene, without product metadata or for a single area, a click that switches the area, and a failed switch that is logged**
- **PE-H8 · headless · `setupScene` without a scene, without a mockup, and with a mockup that declares no images**

Residue, measured and classified:

- `src/index.tsx:64-66`, the guard for a missing `#root`. `index.html` always ships that element, so the branch is unreachable by construction.
- `src/imgly/plugins/product-scene.ts:259-261`, the guard for a page block that `findByName` cannot find. `setupPage` names that page two statements earlier in the same call, so the lookup always succeeds.
- `src/app/App.tsx:111-113`, the fallback to `readProductFromMetadata` and the `!product` guard in `handleColorChange`. That handler runs only from the colour picker, and `Sidebar` renders the picker only when `PRODUCT_SAMPLES` holds the current product id, so the lookup above it always succeeds.

Cases added for the screens:

- **PE-C1 · component · the product editor screen** — the products render before the editor arrives; the first product is set up with its fallback colour once it does, and that is when the demo lifecycle beacon posts `ready`; switching product takes that product's default colour and keeps the visible area, or falls back to its first area; clicking the product already shown changes nothing; a colour is applied to every enabled area and stored on the scene, falls back to the first area when the editor reports no visible one, and is not stored while there is no scene; the sidebar link downloads the product assets; and nothing happens without an editor. The catalogue is mocked so the two `find(isDefault) || colors[0]` fallbacks are exercised.
