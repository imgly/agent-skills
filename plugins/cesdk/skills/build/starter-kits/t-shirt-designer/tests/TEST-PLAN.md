# Test plan: starterkit-t-shirt-designer

Version 6, 7 Sep 2026. Status: implemented. 93 Vitest cases (unit, component and headless) and 13 browser cases run in `KIT_TEST_COVERAGE=1 npm run ci`. Merged coverage is lines 100 %, branches 100 %, functions 100 %. Known issue 1 is fixed, so no case is an expected failure any more.

## 1. Purpose

Verify that the T-Shirt Designer starter kit works as shipped: the editor opens on the t-shirt front with the white mockup behind the printable area, the sidebar switches decoration areas and colours, the size and quantity inputs drive the price and the cart button, and the download link produces one PDF and one thumbnail per area plus the scene archive.

## 2. Scope

In scope

- The `ProductBackdrop` plugin: `product.setupScene`, `product.switchArea`, `product.getVisibleAreaId`, `product.applyVariables`
- Page creation, sizing, stroke and clipping, and the destruction of pages that are no longer areas
- Backdrop geometry and `{{key}}` substitution in mockup image URIs
- The React sidebar: area selector with its print-details card, colour picker, size and quantity inputs, price, Add to Cart, download link
- The kit's editor configuration under `src/imgly/config/`
- The download bundle produced by `downloadProductAssets`

Out of scope

- Core editor features reached through this kit (text editing, asset library, crop, undo, inspector, page add). Covered by the core editor suite.
- The demo site around the kit (cards, tags, links, platform toggles, Back to Demos). Covered by the `cesdk_web_demos` suite. Qase 2276, 2277, 2278, 2279, 2280, 2281, 2288, 2382.
- The iOS and Android showcase apps reached from the demo site's platform switch. They are not this kit; a separate mobile suite owns them. Qase 2282, 2283, 2284, 2285, 2286, 2287.

**Where this kit's Qase cases live.** The export's `kit` column has zero rows for `starterkit-t-shirt-designer`, which is a misattribution, not an absence. The demo site serves this kit under the card `apparel-editor-ui`, titled "Apparel Editor UI" (`apps/cesdk_web_demos/src/demos.json`), and the classifier read that title as `starterkit-apparel-ui`. The 31 cases under the Qase suite "Apparel Editor UI" describe this kit and nothing else: the Apparel Essentials header, Front/Back decorations with Left and Right disabled, the XS-XL quantity inputs, Add to Cart, and the "here" download link. They are mapped below. The other 33 cases classified as `starterkit-apparel-ui`, under the suite "Custom Apparel UI", belong to the separate `starterkit-apparel-ui` kit and are that plan's to map.

## 3. Test environment

- Browser: Chrome, headless, 1400 × 900
- Engine and editor: built from this repo, served locally. Requests to `cdn.img.ly` for engine assets fail the test.
- License: the shared test license (valid on hostname `localhost` only)
- Data: the kit has no `public/` and no scene file — `ProductBackdrop` builds the scene from `src/app/product-catalog.ts`. Mockup PNGs come from `VITE_DEMO_ASSETS_BASE_URL`, pointed at the in-repo copy `packages/cesdk-web-examples-data/data/starterkit-t-shirt-designer/`, so no test reaches `staticimgly.com`.
- Hook: `src/index.tsx` already sets `window.cesdk`. Browser cases read engine state through it.
- Dialogs: Add to Cart calls `window.alert`. Every browser case installs a `page.on('dialog')` handler; TSD-11 asserts the message and the others dismiss.
- Headless: Vitest + `@cesdk/node` (`@cesdk/engine` aliased to it). Backdrop images are `file://` URIs into the same in-repo demo data.
- Downloads: captured by Playwright and checked by file type and PDF page count.
- Vitest setup: `tests/setup/css-supports.ts` gives the run a `CSS.supports`. Neither jsdom nor Node has a `CSS` object, `css.escape` creates one carrying only `escape`, and the editor bundle probes `CSS.supports` while it loads.

## 4. Approach

| Kind      | Tool                          | What it checks                                                      | Run                 |
| --------- | ----------------------------- | ------------------------------------------------------------------- | ------------------- |
| Static    | tsc, eslint, convention check | Types, deprecated APIs, kit folder shape                            | `npm run check:all` |
| Unit      | Vitest                        | Backdrop maths, catalogue invariants, editor config                 | `npm run test:unit` |
| Component | Vitest + jsdom + RTL          | The sidebar's cart maths and the area preview URI                   | `npm run test:unit` |
| Headless  | Vitest + `@cesdk/node`        | Scene setup, page destruction, backdrop geometry, variables, export | `npm run test:unit` |
| Browser   | Playwright                    | The test cases in section 5                                         | `npm run test:e2e`  |

All four run in the kit's `ci` script. Browser tests use role and label locators. The editor root is reached through the harness helper `editorRoot`, so the editor's own attributes appear in one place rather than in every kit.

Extraction landed, in the same shape as the product-editor kit's: moved `calculateBlockLayout`, `applyVariables`, `createPage`, `setupPage`, `applyPageShape`, `createBackdropBlock` and a new `setupScene(engine, options)` out of `src/imgly/plugins/product-backdrop.ts` into a sibling `src/imgly/plugins/product-scene.ts` that imports only types from `@cesdk/cesdk-js`. `product.switchArea` and `product.getVisibleAreaId` stay in the plugin, because they call `cesdk.unstable_switchPage` and `cesdk.actions.run('zoom.toBlock')`. `src/app/utils/product.ts` is split the same way: `exportProductAssets(engine)` returns the blobs and `downloadProductAssets(engine)` triggers the downloads. The two kits share one extraction shape, so a fix lands in both; the destroy-stale-pages branch is the single line that differs. A headless caller must set `page/allowShapeChange` itself, which the plugin does in `initialize`.

## 5. Test cases

Format: ID, level, Qase id, title. Ids come from the Qase suite "Apparel Editor UI"; see the note in section 2.
Common precondition for all browser cases: the kit is open in the browser and the scene has finished loading.

### 5.1 Start-up and the sidebar

**TSD-01 · browser · Qase 3701, 4619, 4618 · Editor opens on the t-shirt front in white**
Steps: open the kit.
Expected: Front is the active area button, the white swatch is active, the visible backdrop is `Backdrop-front` with a URI ending in `white_front.png`, and the page is 20 × 20 in `Inch`. The header reads "Mens T-Shirt" and "From 19,99 €". No console errors. No request to `cdn.img.ly`.

**TSD-02 · browser · Qase 4236 · The area selector shows all four decorations, two of them disabled**
Steps: read the Decorations section.
Expected: four buttons — Front, Back, Left, Right. Left and Right are disabled. The print-details card shows the white front mockup, "Width 249mm", "Height 265mm" and "Digital Printing".

**TSD-03 · browser · Qase 3699 · Switching to Back**
Steps: click Back.
Expected: Back becomes the active button, the current page is named `back`, the visible backdrop is `Backdrop-back`, and the card preview switches to the back mockup.

**TSD-04 · browser · Qase 4236 · A disabled decoration cannot be selected**
Steps: click Left with `force`, because the button is disabled.
Expected: nothing changes — the current page is still `front` and the visible backdrop is `Backdrop-front`.

**TSD-05 · browser · Qase 3700, 3702 · Colour swatches**
Steps: read the Color section, then click the Blue swatch.
Expected: ten swatches in catalogue order, each with its `colorHex` as background. After the click the visible backdrop URI ends in `blue_front.png`, the card preview switches to the blue front image, and the scene's `color` metadata parses to the blue entry. Run note: each swatch's accessible name is its colour id capitalised (Black, Gray, White, …), and the active state is a CSS-module class, so the case asserts the engine and metadata effect rather than the class.

**TSD-06 · browser · Colour change keeps the current area** (no Qase case yet)
Steps: switch to Back, then pick red.
Expected: the current page is still `back` and the visible backdrop is `Backdrop-back` with a `red_back.png` URI.

### 5.2 Design content

**TSD-07 · browser · Qase 3707, 4617 · Design content stays on its own area**
Steps: add a text block on Front, switch to Back, add a second text block, switch to Front.
Expected: each block is a child of the page it was added on, and only the front block is on the canvas when Front is active.

**TSD-08 · browser · Design content survives a colour change** (no Qase case yet)
Steps: add a text block on Front, then pick black.
Expected: the block is still on the `front` page in the same position, and only the backdrop image changed.

### 5.3 Sizes, price and cart

**TSD-09 · browser · Qase 4621, 3706, 3704 · Default quantities and price**
Steps: read the Size & Quantity and cart sections.
Expected: five size columns XS, S, M, L, XL; M and L are 1, the rest 0; the cart button reads `39,98 € • Add to Cart` and is enabled.

**TSD-10 · browser · Qase 3703, 4620 · Quantity changes drive the price**
Steps: set XL to 3, then set M and L and XL to 0.
Expected: after the first change the button reads `99,95 €`; after the second every quantity is 0 and the button is disabled. Qase 4620 words the second half as "total becomes 0.00 €"; the kit renders `0,00 € • Add to Cart`.

**TSD-11 · browser · Qase 3705 · Add to Cart reports the selection**
Steps: with the defaults and the blue colour selected, click Add to Cart.
Expected: an alert whose text names 2 Mens T-Shirt(s), the colour `blue` and a total. Known issue 3: the sidebar prices in euro and the alert prints the same number with a dollar sign.

### 5.4 Download

**TSD-12 · browser · Qase 4235, 4171 · The "here" link downloads the bundle**
Steps: click "here" in the sidebar.
Expected: five downloads — `scene-<ts>-front.pdf`, `scene-<ts>-back.pdf`, two `scene-thumbnail-<ts>-*.png` of 200 × 200 px, and `scene-<ts>.imgly`. Each PDF has one page. Qase 4235 calls the third file a "ZIP (with a scene)"; the kit downloads it as `.imgly`, which is that archive with the current extension. The navigation bar keeps no export entry of its own (Qase 4171): it holds undo/redo, the title, zoom and preview.

**TSD-13 · browser · The canvas bar offers no page-add button** (no Qase case yet)
Steps: read the canvas bar.
Expected: it holds the document-settings button and nothing else. `ly.img.page.add.canvasBar` was removed: the kit's model is one page per decoration area, and a page added that way had no backdrop, no area button, and still landed in the download bundle. Resolves known issue 2.

### 5.5 Headless cases (engine, no browser)

Subject: the extracted `src/imgly/plugins/product-scene.ts` and `exportProductAssets`.

**TSD-H1 · headless · Setup creates one page per enabled area**
Steps: run `setupScene` with the catalogue's t-shirt options.
Expected: two pages named `front` and `back` (the two disabled areas are filtered out before the plugin sees them), design unit `Inch`, each page 20 × 20, clipped, stroke enabled at `20 * 0.005`, `editor/select` off, transparent fill.

**TSD-H2 · headless · Backdrop geometry follows the printable area**
Steps: run `setupScene` for the front.
Expected: one hidden graphic of kind `backdrop_image` named `Backdrop-front`, with an image fill whose source set is the substituted image, and width, height, x and y equal to `calculateBlockLayout(20, config)` for the catalogue numbers. Run note: the mockup images are 815 × 948 and the printable area is 360 × 360 at x 227.5, y 194 — not the 814 × 947 / y 134 this plan first stated. Both backdrops are inserted at index 0, so they occupy the scene's first two child slots rather than one being "the first child".

**TSD-H3 · headless · Setup destroys pages that are no longer areas**
Steps: run `setupScene` with both areas, add a page by hand, then run `setupScene` again.
Expected: the hand-added page is destroyed; `front` and `back` survive with their content. This is where the kit differs from `starterkit-product-editor`, whose copy of the plugin keeps every page.

**TSD-H4 · headless · Variables are substituted at setup and by `applyVariables`**
Steps: run `setupScene` with `{ color: 'green' }`, then apply `{ color: 'purple' }`.
Expected: after setup both backdrops end in `green_front.png` and `green_back.png` with no `{{` left, and the page metadata `backdrop_config` parses to the substituted images. After the apply both end in `purple_*`, and the blocks' width, height, x, y and crop are unchanged.

**TSD-H5 · headless · No page shape is applied**
Steps: run `setupScene` twice.
Expected: every page carries a `rect` shape, since no t-shirt area declares a `pageShape`, and there is no `vector_path` block anywhere. Run note: the orphan check compares the rect count before and after the second run, because a `findByType` sweep also counts blocks left by earlier tests in the same engine.

**TSD-H6 · headless · The export bundle**
Steps: run `exportProductAssets` on a set-up scene.
Expected: one `application/pdf` and one `image/png` per page, keyed by page name, plus the archive; the page stroke is enabled again afterwards. A second case asserts the stroke is restored when an export fails, which the `try`/`finally` added for known issue 1 now guarantees.

### 5.6 Unit cases (no engine, no browser)

**TSD-U1 · unit · `applyVariables`**
Multiple keys in one URI; a token repeated in one URI replaced everywhere; an unknown key leaves its token; an empty map returns the URIs unchanged; `width` and `height` carried over; the input array is not mutated.

**TSD-U2 · unit · `calculateBlockLayout`**
For the t-shirt front the scale is `pageWidth / 360` and width, height, x and y follow it. An empty `images` array throws `Backdrop configuration must include images`.

**TSD-U3 · unit · `setupSceneOptions`**
The two disabled areas are dropped, leaving `front` and `back`; `designUnit` is `Inch`; `variables.color` is the colour id; each mapped area carries only `id`, `pageSize` and `mockup`.

**TSD-U4 · unit · Catalogue invariants**
One product; ten colours with unique ids and exactly one `isDefault`; five sizes; `unitPrice` set; the two enabled areas have a `mockup` with one image whose URI contains `{{color}}` and starts with `ASSETS_BASE`; the two disabled areas have no `mockup`.

**TSD-U5 · component · Cart maths**
Rendered through `Sidebar` under jsdom: the initial map is M = 1, L = 1 and the rest 0 and the button reads `39,98 € • Add to Cart`; three XL makes it `99,95 €`; clearing every field disables it at `0,00 €`; a click reports the totals and the per-size map to the caller. Run note: typing `-4` leaves `4` in a `type=number` input, because the minus sign is not accepted keystroke by keystroke — the clamp itself is not reachable from the keyboard.

**TSD-U6 · component · Area preview URI**
Rendered through `AreaSelector` under jsdom: it substitutes `{{color}}` in the selected area's first image; an area with no mockup yields `undefined` and renders an image with no `src`, and the two disabled decorations render as disabled buttons. Known issue 4.

**TSD-U7 · unit · Editor configuration**
On a spy `cesdk`: `setupFeatures` enables exactly the 103 ids in `features.ts`, naming each child rather than its group, and disables none; the plugin pins the editor compatibility version to `CreativeEditorSDK.version` in the call right after `resetEditor`; the dock order is the six entries of `dock.ts`; the navigation bar holds undo/redo, spacers, title, zoom and preview and no actions entry; the canvas bar holds `ly.img.settings.canvasBar` and a spacer, and no page-add entry; `setupPanels` docks the inspector right and the assets panel left, both non-floating; `setupSettings` applies the eight non-commented engine settings; `setupComponents` registers nothing.

**TSD-U9 · unit · The printable area of the t-shirt**
`printableAreaPx` centres the print area horizontally and lifts it 100 px, which is what the `printX` / `printY` getters compute. The catalogue used to inline that arithmetic and leave the getters unused; it now reads them, so the documented rule is the one that ships.

**TSD-U10 · unit · `storeProductMetadata`**
The product and the colour are written onto the scene as JSON. Without a scene nothing is written.

**TSD-U11 · unit · `downloadProductAssets`**
One PDF and one 200x200 PNG per page plus the scene archive are downloaded, each through its own temporary anchor.

**TSD-U12 · component · The controls the sidebar reports from**
A click on an enabled decoration reports its id. A colour swatch reports the colour object. A negative quantity is clamped to zero instead of discounting the cart.

**TSD-U13 to TSD-U17 · unit · `setupUI`, the inspector bar, the empty setups, `DesignEditorConfig` and the five action handlers**
The parts of the configuration `kit-config.test.ts` did not already own.

**TSD-H7 · headless · An area that declares a page shape**
`setupScene` replaces the page's rect shape with the vector path and leaves the old shape behind for the engine to collect.

**TSD-C2 · component · `Sidebar` without a price or a size list**
A catalogue entry that omits `unitPrice` and `sizes` renders a cart priced at zero with no size inputs.

**TSD-C3 · component · `App` without a default colour**
A catalogue whose first product marks no colour as the default starts on that product's first colour.

**TSD-U18 · unit · `src/index.tsx`**
The entry renders the editor, hands the created instance to the app and publishes it on `window`; it fails loudly with `Root container not found` when the page ships no such element.

**TSD-U19 · unit · `setupScene` guards**
Creates the scene when the engine holds none, reuses the page an area already has, substitutes the backdrop variables, writes an empty backdrop when the mockup names no image, skips an area with no mockup, and fails loudly when the engine cannot find the page it just named.

**TSD-U20 · unit · `applyBackdropVariables`**
Replaces the source set of the backdrop it finds, and leaves an area alone when it has no mockup images or the scene holds no backdrop for it.

**TSD-U21 · unit · `product.getVisibleAreaId`**
Names the page the editor currently shows, reports no area while it shows none, and registers nothing without an editor.

**KB-01 · unit · Keyboard catalog predicates**

`tests/unit/keyboard-catalog.test.ts` runs every `run` and `when` of `src/imgly/config/keyboard/catalogs/us-ansi.ts` against 1620 editor states (5 edit modes, 9 selections, 3 roles, features on and off, 3 vector states, page and no page) and asserts that none throws, that every shortcut activates in at least one state, and that every function `run` reaches `cesdk.actions.run`. Kit-owned: the kit decides which key does what and when it is live. The catalog measures 100 % lines, branches and functions.

## 6. Entry and exit criteria

Entry: engine and editor built; test license available; the shared kit test harness exists; the demo data resolves from the in-repo package in both dev and static mode; the extraction in section 4 has landed; the kit's `test:unit` and `test:e2e` scripts replaced with the real commands. All met.

Exit: every case in section 5 passes locally and in CI. `npm run ci` passes. The published kit contains no test files. A release run reports results to the Qase ids above, and the "Apparel Editor UI" suite is re-pointed at this kit so the ids stop reading as `starterkit-apparel-ui`. The four cases marked "no Qase case yet" get new ids.

## 7. Known issues found while writing this plan

Fixed in this batch: issue 2 — the add-page entry is gone from the canvas bar, and TSD-13 and TSD-U7 assert it; issue 9 — the unreachable `exportImage` action is deleted; issue 11 — `product-catalog.ts` inlined `815 / 2 - 360 / 2` at both `printableAreaPx` sites while the `TSHIRT.printX` / `printY` getters that document the rule were unused, so the two now read the getters and TSD-U9 pins the result.

The rest are confirmed and still open.

1. ~~`exportProductAssets` disables the page stroke, exports, then re-enables it, with no `try`/`finally`.~~ Fixed: the two exports run inside a `try` whose `finally` re-enables the stroke. TSD-H6's third case now passes.
2. Fixed. The canvas bar offered add-page while the kit's model is one page per decoration area. A page added that way had no backdrop, no area button, and still landed in the download bundle with an empty area id in its filename. `ly.img.page.add.canvasBar` is removed.
3. The sidebar and the cart button print euro; the Add to Cart alert prints the same number with a dollar sign. The catalogue names no currency.
4. `AreaSelector` renders the disabled Left and Right buttons and computes a preview `src` from `selectedArea?.mockup?.images?.[0]`. Those areas have no mockup, so if one ever became selectable the card would render an `<img>` with no `src`.
5. The print-details card hardcodes "Width 249mm" and "Height 265mm" while the catalogue's printable area is 360 × 360 px inside a 20 inch page. The two numbers cannot both be right.
6. `Sidebar` seeds its quantities from `product.sizes` once, in a `useState` initialiser. It is a single-product kit today, so nothing re-seeds it, but the pattern breaks the moment a second product is added.
7. The dock lists a combined Elements entry and then Image, Text, Shapes and Stickers again, so each of those libraries appears twice.
8. `config/i18n.ts` is an empty `void cesdk;` stub while the README's Localization section documents `i18n.setTranslations` with a worked example.
9. **Fixed.** The printable-area origin was written twice as raw arithmetic instead of through the `TSHIRT.printX` / `printY` getters, so a change to the documented rule would not have reached the catalogue. Both sites read the getters now.
10. Fixed for `exportImage`, which is deleted. `exportScene`, `saveScene` and `importScene` stay: the navigation bar has no actions dropdown, so none of them is reachable today, but a customer wiring the dropdown back in expects them.
11. `createPage` reads the page's fill and immediately assigns the same fill back. The `setFill` call does nothing.
12. The README's Architecture tree lists `imgly/backdrop.ts`, `imgly/constants.ts`, `imgly/mask.ts` and `imgly/page.ts`, none of which exist, and omits `plugins/product-backdrop.ts` and `config/keyboard/`. It is the same wrong tree the product-editor kit ships.
13. The `pageShape` doc comment in this copy of the plugin reads "Optional SVG path Coordinates are expected in the `printableAreaPx` box" — a sentence lost in an edit. The product-editor copy has the full text.

### Coverage residue

None. Every executable line, branch and function of `src/**` is covered by the merged report.

## 8. Open questions

1. Resolved: both behaviours stay, and each kit tests its own. The extraction gives both kits the same `product-scene.ts` shape, so the difference is the destroy branch in `setupScene`.
2. Resolved: the add-page entry is removed. TSD-13 asserts the button is gone.
3. Issue 3 and issue 5: which currency and which print dimensions are correct? Product question, not a test question.

## 9. Estimate

13 browser cases at about 8 s each: under 2 minutes on one worker. 6 headless cases sharing one engine: about 20 s. Unit tests under 1 s.

## 10. Boundary review

Rule used: the code that makes a decision owns the test for it. The kit decides the catalogue, the page-per-area model, the backdrop geometry and its `{{key}}` substitution, which pages survive a re-setup, the cart maths, the dock and navigation bar composition, and the contents of the download bundle. The engine decides what `resizeContentAware` does, what a source-set swap renders, and what an export produces. The editor decides how the canvas bar renders and how `zoom.toBlock` frames a block.

Core behaviour this plan leans on, and where it is covered today:

| Behaviour                                                                 | Owner  | Covered by                                                                                                                                 |
| ------------------------------------------------------------------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `setSourceSet` / `getSourceSet` round trip and overwrite on an image fill | engine | `bindings/shared/ts/src/tests/block-placeholder.test.ts:404`; `engine/lib/test/api/BlockPropertiesTest.cpp:366`                            |
| `createShape` + `setShape`                                                | engine | `bindings/shared/ts/src/tests/block-effects.test.ts:154, 184`; `engine/lib/test/api/EffectsAPITest.cpp:806`                                |
| `resizeContentAware`                                                      | engine | `bindings/shared/ts/src/tests/block-crop-frame.test.ts:526`; guard arms in `engine/lib/test/api/MiscCoreAPITest.cpp:671`                   |
| `findByName` / `findByKind` / `findByType`, and `block.destroy`           | engine | `engine/lib/test/api/BlockLifecycleTest.cpp:299, 313, 329`; `bindings/shared/ts/src/tests/block-find-identity-visibility.test.ts:20`       |
| `block.export` to PDF and to PNG                                          | engine | `engine/lib/test/api/ExportAPITest.cpp` PDF matrix from `:417`; `bindings/shared/ts/src/tests/block-export.test.ts:33`                     |
| `scene.saveToArchive` / `saveToString` and reload                         | engine | `engine/lib/test/api/ArchiveRoundTripAPITest.cpp:153`; `bindings/shared/ts/src/tests/scene-extended.test.ts:296`                           |
| `scene.setDesignUnit`, `scene.getCurrentPage`                             | engine | `engine/lib/test/api/BlockLayoutTest.cpp:558`; `bindings/shared/ts/src/tests/scene-viewport.test.ts:288, 226`                              |
| `editor.setSelectionEnabled`                                              | engine | `engine/lib/test/api/SelectionInteractionAPITest.cpp:155`                                                                                  |
| `featureFlags.singlePageMode` hides the other pages                       | editor | `apps/cesdk_web/packages/cesdk/stores/ConfigurationStore.test.ts:86, 91`; `apps/cesdk_web/packages/engine/engine/page/manager.test.ts:295` |
| `ui.setComponentOrder` for the dock, navigation bar and canvas bar        | editor | `apps/cesdk_web/packages/api/ui/UserInterfaceAPI.test.ts:72, 1027`                                                                         |
| `actions.register` / `run`, and `zoom.toBlock` with `autoFit`             | editor | `apps/cesdk_web/packages/api/actions/ActionsAPI.test.ts:41`; `apps/cesdk_web/packages/cesdk/registerDefaultActions.test.ts:519, 737`       |
| `feature.enable` with a list of ids                                       | editor | `apps/cesdk_web/packages/api/features/FeatureAPI.test.ts:66`                                                                               |

Core coverage gaps found (candidates to add in the core suites, not in this kit):

1. Editor: `cesdk.unstable_switchPage` has no test anywhere — its only occurrence outside the two product kits is its definition at `apps/cesdk_web/packages/cesdk/index.tsx:789`. Every area switch in this kit goes through it. Suggested home: `apps/cesdk_web/packages/cesdk/`. Same gap as product-editor gap 6.
2. Engine: `setScopeEnabled(block, 'editor/select', false)` is never asserted to prevent selection; `ScopeMatrixAPITest.cpp:217` only lists the scope name in a sweep. The kit applies it to every page and every backdrop. Suggested home: `engine/lib/test/api/SelectionInteractionAPITest.cpp`.
3. Engine: metadata round trip on the **scene** block. `block-metadata.test.ts:24` and `AppearanceRoundTripAPITest.cpp:279` both use a graphic; this kit stores the colour there. Suggested home: `bindings/shared/ts/src/tests/block-metadata.test.ts`.
4. Engine: `targetWidth` / `targetHeight` on the JS `block.export` options object, covered in gtest (`ExportAPITest.cpp:137`) but not from JS. The 200 × 200 thumbnail depends on it. Suggested home: `bindings/shared/ts/src/tests/block-export.test.ts`.
5. Editor: the React wrapper `@cesdk/cesdk-js/react` (`packages/cesdk-react/`) has no test file — not the `init` callback, not re-mount on a `key` change, not disposal. Suggested home: `packages/cesdk-react/`.

Gaps 1 to 5 are the same as the product-editor kit's; both kits are built from one plugin and one React shell, so closing them once covers both.
