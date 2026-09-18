# Test plan: starterkit-cutout-lines-editor

Version 5, 7 Sep 2026. Status: implemented, `npm run ci` green (40 unit and headless, 7 browser). Merged coverage is lines 100 %, branches 100 %, functions 100 %.

## 1. Purpose

Verify that the Cutout Lines starter kit works as shipped: the editor loads the demo scene, puts the Cutout library first in the dock, offers Create Cutout in the canvas menu with the kit's own parameters, and exports a PDF that carries the cutout lines.

## 2. Scope

In scope

- Registration of `@imgly/plugin-cutout-library-web` with `ui.locations = ['canvasMenu']` and the kit's own `createCutoutFromBlocks` arguments
- The Cutout dock entry the kit prepends, and the filter it applies to the rest of the dock
- Feature configuration that makes cutout editing possible (`ly.img.cutout`, the four `ly.img.combine.*` operations, the `ly.img.page.*` controls)
- The PDF-only navigation-bar actions dropdown
- Editor start-up with `public/assets/example.scene`
- The kit's own code under `src/imgly/` and `src/index.ts`

Out of scope

- What `createCutoutFromBlocks` produces, how a cutout renders, and how the Combine operations work. The engine decides those; see section 10.
- The cutout asset source, its library entry and the panel that lists Square and Circle. The plugin decides those; see section 10.
- The demo site around the kit (cards, tags, platform support, links, the desktop and mobile switch). Covered by the `cesdk_web_demos` suite. Qase 668, 669, 670, 671, 672, 687, 696, 2396, 2397, 2398, 2400, and 2468, which asks whether edits survive the demo site's device toggle and is a property of that site's iframe handling, not of the kit. The `starterkit-unsplash-asset-source` plan puts the same case (2471) out of scope for the same reason.

## 3. Test environment

- Browser: Chrome, headless, 1400 × 900
- Engine and editor: built from this repo, served locally. Requests to `cdn.img.ly` fail the test.
- License: the shared test license (valid on hostname `localhost` only)
- Data: the kit's own `public/assets/example.scene`. 1 page, DIN A6, 148 × 105 mm, containing graphics, text, a group and two `//ly.img.ubq/cutout` blocks — the "sample cutouts" the Qase cases refer to.
- Network: the plugin's asset base defaults to `https://staticimgly.com/imgly/plugin-cutout-library-web/<version>/dist/assets`, which the guard allows. The kit passes no `assetBaseUri`.
- Network: the demo scene stores absolute `cdn.img.ly` URIs for three fonts and one emoji sticker (known issue 7), so `tests/playwright.config.ts` allows `cdn.img.ly/packages/imgly/cesdk-js/<version>/assets/ly.img.typeface/fonts/` and `cdn.img.ly/assets/v1/ly.img.sticker/`. Nothing else reaches the CDN.
- Timing: the plugin registers `ly.img.cutout` from an unawaited fetch inside its `initialize` (known issue 1), so the source is absent for a moment after the editor is ready. Every case that touches the Cutout panel waits for `engine.asset.findAllSources()` to list it first.
- Downloads: captured by Playwright and checked by file type and PDF page count

## 4. Approach

| Kind    | Tool                          | What it checks                                      | Run                 |
| ------- | ----------------------------- | --------------------------------------------------- | ------------------- |
| Static  | tsc, eslint, convention check | Types, deprecated APIs, kit folder shape            | `npm run check:all` |
| Unit    | Vitest                        | Cutout dock entry, plugin arguments, config modules | `npm run test:unit` |
| Browser | Playwright                    | The test cases in section 5                         | `npm run test:e2e`  |

All three run in the kit's `ci` script. Browser tests use role and label locators only, scoped to the editor's own landmarks: Left Dock, Navigation Bar, and the asset library, which is a `complementary` named after the open dock entry. The editor stopped exposing a `region` named CE.SDK in 1.82, so nothing scopes through that any more. `setupCutoutLibraryPlugin` and every `config/` module are pure functions over a `CreativeEditorSDK`, so their decisions are covered by unit cases with a spy. There are no headless cases: nothing in the kit runs without the editor.

## 5. Test cases

Format: ID, level, Qase id, title. Then steps and expected result.
Common precondition for all browser cases: the kit is open in the browser and the scene has finished loading.

### 5.1 Start-up and the dock

**CL-01 · browser · Editor loads with Cutout first in the dock**
Steps: open the kit.
Expected: one page on the canvas, 148 × 105 mm. The dock starts with a Cutout entry, then a separator, then Elements, Uploads, Images, Text, Shapes, Stickers. There is no Templates entry. No console errors. No request to `cdn.img.ly` beyond the allowed fonts and sticker.

**CL-02 · browser · Qase 683, 684 · The Cutout panel adds a rectangle and a circle**
Steps: click Cutout in the dock. Click the Cutout Rectangle asset. Re-open the panel and click the Cutout Circle asset.
Expected: the panel is headed Cutout and lists Generate from Selection, Cutout Rectangle and Cutout Circle. Each click adds a `//ly.img.ubq/cutout` block to the page and selects it.
Note: the assets are labelled Cutout Rectangle and Cutout Circle, not Square and Circle, and adding one closes the panel, so each add needs its own open.

### 5.2 Editing a cutout

**CL-03 · browser · Qase 715, 716, 717, 718 · A selected cutout exposes type, offset and smoothing**
Steps: select one of the scene's sample cutouts. Read the inspector bar. Change the type from Cut to Perforated, change Offset, change Smoothing, then drag a corner handle.
Expected: the inspector bar shows the cutout type, offset and smoothing controls, because the kit enables `ly.img.cutout` and lists `ly.img.cutout.type.inspectorBar`, `ly.img.cutout.offset.inspectorBar` and `ly.img.cutout.smoothing.inspectorBar`. Picking Perforated writes `cutout/type`, and the Increase buttons raise `cutout/offset` and `cutout/smoothing`. What each property does to the rendered line is engine behaviour (section 10).
Note: the UI label Perforated maps to the engine enum value `Dashed`. Committing a value clears the selection, so each control is opened on a freshly selected block. The drag step was dropped: resizing is the editor's gizmo.

**CL-04 · browser · Qase 712 · Generate from Selection**
Steps: select a graphic on the page, open the canvas menu, click Cutout.
Expected: a new cutout block is created from that graphic's shape and is selected. The kit calls `engine.block.createCutoutFromBlocks(ids, 0, 2, true)`, so `useExistingShapeInformation` is `true` — the plugin's own default is `false`.
Note: the plugin withholds its canvas-menu button on a cutout block, so the "cutout from a cutout" notification is not reachable from the canvas menu; the case asserts the button is absent instead. The kit's arguments are asserted in CL-U1.

**CL-05 · browser · Qase 4653, 4654, 4655, 4656 · Combine two cutouts**
Steps: select two cutouts, open Combine, run Union. Undo. Repeat with Subtract, Intersect and Exclude.
Expected: the Combine dropdown is offered in the inspector bar — the kit enables all four `ly.img.combine.*` operations — and each of Union, Subtract, Intersect and Exclude turns the two cutouts into one, with Undo restoring both. The resulting geometry is engine behaviour (section 10).
Note: Combine lives in the inspector bar, not the canvas menu.

**CL-06 · browser · Qase 1569 · A cutout survives a document format change**
Steps: select the page, open Resize and pick DIN A4 Portrait. Select the cutout again.
Expected: the cutout block is still present, still selectable, and still exposes its inspector controls. The kit enables `ly.img.page`, which brings the resize control with it.

### 5.3 Export

**CL-07 · browser · Qase 685 · Export PDF with cutouts**
Steps: open the actions dropdown in the navigation bar, click Export PDF.
Expected: the navigation bar shows an Export PDF button and no Export Images button. One PDF download with 1 page, from one `engine.block.export` call with `application/pdf`. That the cutout separation is emitted is engine behaviour (section 10); this case keeps one decoded-file assertion as the end-to-end proof.
Note: the actions dropdown has a single child, so the editor renders it as a plain navigation-bar button and draws no dropdown.

### 5.4 Unit cases (no browser, no engine)

Subject: `src/imgly/plugins/cutout-library.ts`, `src/imgly/index.ts` and `src/imgly/config/**`, called with a spy `CreativeEditorSDK`.

**CL-U1 · unit · Cutout plugin arguments**
`setupCutoutLibraryPlugin` adds the plugin with `ui: { locations: ['canvasMenu'] }` and a `createCutoutFromBlocks` that calls `engine.block.createCutoutFromBlocks(ids, 0, 2, true)`. It passes no `assetBaseUri`, so the plugin's `staticimgly.com` default applies.
Note: the canvas-menu button is labelled Cutout, not Create Cutout.

**CL-U2 · unit · Cutout dock entry**
The function reads `ly.img.cutout.entry` through `getAssetLibraryEntry`, prepends a dock entry labelled Cutout with that entry's icon and `entries: ['ly.img.cutout.entry']`, and keeps the existing order after it. This case also pins known issue 1: the `.filter(({ key }) => key !== 'ly.img.template')` removes nothing.

**CL-U3 · unit · Editor initialization**
`initCutoutLinesEditor` adds `DesignEditorConfig` first, then the fourteen asset-source plugins, then calls `setupCutoutLibraryPlugin` last. It does not install `PremiumTemplatesAssetSource`. Role is `Creator` and theme is `light`. The fourteen asset sources go in through one `Promise.all`: a case holds every `addPlugin` open and checks all fourteen were requested before any of them resolved and before the cutout library was reached.

**CL-U4 · unit · Dock, navigation bar and actions**
`setupDock` sets `dock/hideLabels` false and `dock/iconSize` large and orders the dock without a Templates entry. `setupNavigationBar` puts an actions dropdown whose only child is `ly.img.exportPDF.navigationBar`. `setupActions` registers exactly `saveScene`, `exportDesign`, `importScene`, `exportScene` and `uploadFile`.
Note: the dead `exportImage` action was deleted — nothing in the editor runs it, and this kit has no image export at all.

**CL-U6 · unit · UI orchestration**
`setupUI` docks the inspector and the asset library on the left and orders the navigation bar, the dock, the canvas menu and the inspector bar.

**CL-U7 · unit · Keyboard shortcuts**
`setupKeyboardShortcuts` sets one US ANSI catalog, and every entry in it has a key combination and something to run.

**CL-U5 · unit · Features and settings**
`setupFeatures` enables exactly the 109 ids of `features.ts`, asserted as the whole array: `ly.img.cutout`, the four `ly.img.combine.*` operations and the `ly.img.page.*` controls, `ly.img.page.move` among them. `setupSettings` sets `page/title/show` true.
Changed by the fleet feature-list rewrite: the kit used to leave `ly.img.page.move` off. It now ships the Move Up/Down/Left/Right buttons like every other design kit.

**CL-U12 · removed.** `resolveAssetPath` is gone; `src/imgly/demo-assets.ts` derives the URL from `VITE_DEMO_ASSETS_BASE_URL` or the kit's own URL.

**KB-01 · unit · Keyboard catalog predicates**

`tests/unit/keyboard-catalog.test.ts` runs every `run` and `when` of `src/imgly/config/keyboard/catalogs/us-ansi.ts` against 1620 editor states (5 edit modes, 9 selections, 3 roles, features on and off, 3 vector states, page and no page) and asserts that none throws, that every shortcut activates in at least one state, and that every function `run` reaches `cesdk.actions.run`. Kit-owned: the kit decides which key does what and when it is live. The catalog measures 100 % lines, branches and functions.

## 6. Entry and exit criteria

Entry: engine and editor built; test license available; the shared kit test harness exists.

Exit: every case in section 5 passes locally and in CI. `npm run ci` passes. The published kit contains no test files. A release run reports results to the Qase ids above.

## 7. Known issues found while writing this plan

Confirm each with a test before fixing.

1. The dock filter in `plugins/cutout-library.ts` is dead twice over. It drops entries whose key is `ly.img.template`, but the kit's own `config/ui/dock.ts` has no templates entry at all, and the key the shared config used was `ly.img.templates` in the plural. The line removes nothing in any configuration.
2. The Cutout dock entry uses `key: 'ly.img.assetLibrary.dock'` — the component id — while every other entry in the kit uses a semantic key such as `ly.img.image`. Anything that later matches the dock by key cannot address this entry.
3. The comment above `createCutoutFromBlocks` names the arguments "offset (0), miterLimit (2), dashOverride (true)". The real signature in `bindings/wasm/js_web/src/BlockAPI.ts:5953` is `(ids, vectorizeDistanceThreshold = 2, simplifyDistanceThreshold = 4, useExistingShapeInformation = true)`. All three names are wrong, and the third value is the one place the kit deliberately differs from the plugin default.
4. Removing the Templates dock entry left a separator as the first item of `config/ui/dock.ts`, so without the plugin's prepend the dock would open with a divider.
5. `config/i18n.ts` is an empty `void cesdk;` stub while the README documents localization.
6. The README's Architecture tree omits `config/keyboard/` and `plugins/cutout-library.ts`.
7. The demo scene stores absolute `cdn.img.ly` URIs: three fonts under `packages/imgly/cesdk-js/…/assets/ly.img.typeface/fonts/` (pinned to 1.68.0) (Manrope-Bold, Roboto-Light, imgly_font_nixie_one) and `assets/v1/ly.img.sticker/images/emoji/emoji_beer.svg`, all fetched on every load, plus `assets/v4/emoji/NotoColorEmoji.ttf` which is not. All four fetched URLs are allowlisted in the Playwright config; a customer running the kit still hits the production CDN for them.
8. The plugin registers its cutout asset source from an unawaited `fetch` inside a synchronous `initialize`, so opening the Cutout dock entry before that lands renders "No Elements" and never recovers. Reproduced by clicking the entry immediately after the editor is ready. The plugin owns this; recorded as a core gap in section 10.

### Coverage residue

None. Every executable line, branch and function of `src/**` is covered by the merged report.

## 8. Open questions

1. Issue 1: delete the filter, or fix it to `ly.img.templates` and restore a Templates entry. Recommendation: delete. The kit deliberately ships without templates.
2. Issue 3: the comment is wrong, but is the value intended? `useExistingShapeInformation: true` reuses the block's own shape instead of tracing its alpha, which is right for the vector shapes this kit ships and wrong for a photo. Recommendation: keep the value, fix the comment, and say why in one line.

## 9. Estimate

Measured: 7 browser cases in 45 s on one worker. 19 unit tests under 1 s.

## 10. Boundary review

Rule used: the code that makes a decision owns the test for it. The kit decides that the cutout plugin is installed, with which UI location and which `createCutoutFromBlocks` arguments, where the Cutout entry sits in the dock, which features are on, and that the only export is PDF. The plugin decides the cutout asset source, its library entry, the canvas-menu component and the notifications. The engine decides what a cutout block is, what `createCutoutFromBlocks` produces, what the Combine operations compute, and what a PDF export emits.

Core behaviour this plan leans on, and where it is covered today:

| Behaviour                                                                   | Owner  | Covered by                                                                                       |
| --------------------------------------------------------------------------- | ------ | ------------------------------------------------------------------------------------------------ |
| `createCutoutFromBlocks` produces a cutout block, and rejects an empty list | engine | `engine/lib/test/api/CutoutAPITest.cpp` `CreateCutoutFromBlocks`, `CreateCutoutFromBlocks_Empty` |
| A cutout carries a spot colour per cutout type, including the dashed type   | engine | same file, `SetAndGetSpotColorForCutoutType`, `GetSpotColorForCutoutType_Dashed`                 |
| A cutout can be built from a boolean operation on other blocks              | engine | same file, `CreateCutoutFromOperation`                                                           |
| PDF export of a scene contains every page                                   | engine | `engine/lib/test/api/ExportAPITest.cpp` `ExportToBuffer_PDF_AllPagesInScene`                     |
| `cesdk.utils.export` and `downloadFile`                                     | editor | `apps/cesdk_web/packages/api/utils/UtilsAPI.test.ts`                                             |
| The default action shapes the kit overrides                                 | editor | `apps/cesdk_web/packages/cesdk/registerDefaultActions.test.ts`                                   |

Core coverage gaps found (candidates to add in the core suites, not in this kit):

1. `@imgly/plugin-cutout-library-web` has no tests — its `package.json` sets `"test": "echo No tests"`. Nothing covers its asset source, its library entry, `generateCutoutFromSelection`, or the three notifications it raises for an empty selection, a selected cutout and blocks on different pages. Qase 683, 684 and 712 rest on it. Suggested home: `apps/cesdk_web_plugins/packages/plugin-cutout-library-web/src/__tests__/`.
   1a. The same plugin's `initialize` starts `addCutoutAssetSource` without awaiting it (`src/plugin.ts`), so `cesdk.addPlugin` resolves before the source exists. A user who opens the Cutout entry in that window sees an empty library. Suggested home: the plugin, together with gap 1.
2. Engine: the effect of `cutout/offset` and `cutout/smoothing` on the generated path, and of the Cut and Perforated types on the emitted PDF separation. `CutoutAPITest.cpp` covers creation and spot colours but asserts nothing about the geometry or the export. Qase 685, 715, 717 and 718 depend on it. Suggested home: `CutoutAPITest.cpp`, plus one PDF assertion next to the PDF tests in `ExportAPITest.cpp`.

Until gap 2 is closed, CL-07 keeps its decoded-PDF assertion as the end-to-end proof.

## 11. Coverage pass

Cases added to close the merged-coverage gaps:

- **CL-U8 · unit · The actions the kit registers — every handler `setupActions` registers is invoked: `saveScene` downloads the saved scene as text, `exportDesign` downloads what `cesdk.utils.export` returned, `importScene` opens the picker for `.imgly,.scene,.zip`, revokes the blob URL on the success and on the failure path and then runs `zoom.toPage`, `exportScene` writes a JSON scene by default and a zip archive for `{ format: 'archive' }`, and `uploadFile` returns what `cesdk.utils.localUpload` returned**
- **CL-U9 · unit · DesignEditorConfig — `initialize` resets the editor, pins the editor compatibility version to the plugin version as its second call, then applies features, UI, actions, shortcuts, translations and engine settings; with no `cesdk` in the context it touches the engine not at all**
- **CL-U10 · unit · Video timeline scaffold — `setupVideoTimeline` makes no editor call, so the kit ships the timeline example unapplied**
- **CL-U11 · unit · `src/index.ts` — with `@cesdk/cesdk-js`, the kit barrel and the demo lifecycle beacon mocked: a successful create publishes `window.cesdk`, configures the editor, loads the demo scene and posts `created` then `ready`; a rejected create logs `Failed to initialize CE.SDK:`, posts `failed` only, and leaves no unhandled rejection**

The only uncovered item left is the one below.
Residue: none from the asset base; `src/imgly/demo-assets.ts` is covered by the shared `tests/unit/demo-assets.test.ts`.
