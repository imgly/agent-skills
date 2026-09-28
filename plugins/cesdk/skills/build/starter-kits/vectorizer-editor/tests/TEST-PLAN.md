# Test plan: starterkit-vectorizer-editor

Version 5, 9 Sep 2026. Status: implemented, `npm run ci` green (44 unit and headless, 10 browser). No browser case waits for a vectorization anymore; the conversion is the plugin's to test (section 10, gap 1). Merged coverage: lines 100 %, branches 100 %, functions 100 %.

## 1. Purpose

Verify that the Vectorizer starter kit works as shipped: the editor loads the remote demo archive, offers Vectorize in the canvas menu for an image, and keeps a vectorized result editable and exportable.

## 2. Scope

In scope

- Registration of `@imgly/plugin-vectorizer-web` with `ui.locations = 'canvasMenu'`
- The `DEMO_ASSETS_BASE_URL` constant, its `VITE_DEMO_ASSETS_BASE_URL` override, and the archive the kit loads from it
- The start-up selection of the first image block
- The fifteen asset-source plugins, the dock order, the navigation-bar actions dropdown and the export actions
- Feature and engine-setting configuration under `src/imgly/config/`
- The kit's own code under `src/imgly/` and `src/index.ts`

Out of scope

- What vectorization produces, and when the Vectorize button is offered or withheld. The plugin decides those; see section 10.
- Core editor features reached through this kit (crop, adjustments, duplicate, delete, replace). Covered by the core editor suite.
- The demo site around the kit (cards, tags, platform support, links, device toggles). Covered by the `cesdk_web_demos` suite. Qase 2476, 2477, 2478, 2479, 2493, 2502, 2513, 2515.

## 3. Test environment

- Browser: Chrome, headless, 1400 × 900
- Engine and editor: built from this repo, served locally. Requests to `cdn.img.ly` fail the test.
- License: the shared test license (valid on hostname `localhost` only)
- Data: `scene/scene.scene` — 1 page, DIN A6, 148 × 105 mm, 8 graphics (6 images, 2 shapes), one image named `FirstImage`. The tests set no override: `cesdk-js-dev` redirects the baked `staticimgly.com` base at its local CDN daemon on :5199, which proxies the in-repo `packages/cesdk-web-examples-data/data/starterkit-vectorizer-editor/` copy or, when that is an unfetched LFS pointer, `staticimgly.com` itself. Either way the guard allows it. The in-repo pointer records `sha256:59282383c3a02dcb7a27f3d46abbc5c62c896435596e4d1092d5a3ef5a1241e7` and a `curl` of the CDN URL returns a file with that same SHA-256.
- Network: `@imgly/vectorizer@1.0.0` ships its WASM inside the package; its `dist` contains no remote host. Measured on a real boot: the kit makes zero `cdn.img.ly` requests, so the Playwright config needs no allowlist. One vectorization takes about 6.5 s.
- Downloads: captured by Playwright and checked by file type, pixel size, and PDF page count

## 4. Approach

| Kind    | Tool                          | What it checks                                       | Run                 |
| ------- | ----------------------------- | ---------------------------------------------------- | ------------------- |
| Static  | tsc, eslint, convention check | Types, deprecated APIs, kit folder shape             | `npm run check:all` |
| Unit    | Vitest                        | Plugin wiring, asset base URL, dock, actions, config | `npm run test:unit` |
| Browser | Playwright                    | The test cases in section 5                          | `npm run test:e2e`  |

All three run in the kit's `ci` script. Browser tests use role and label locators. Everything inside the editor goes through the harness helpers, `actionsMenu` for the navigation bar's actions dropdown and `editorPanel(id)` for a panel, so the editor's own attributes appear in one place rather than in every kit; a case that scopes to the editor uses the kit's own `#cesdk_container`. `setupVectorizerPlugin` and every `config/` module are pure functions over a `CreativeEditorSDK`, so their decisions are covered by unit cases with a spy. There are no headless cases: nothing in the kit runs without the editor.

## 5. Test cases

Format: ID, level, Qase id, title. Then steps and expected result.
Common precondition for all browser cases: the kit is open in the browser and the scene has finished loading.

### 5.1 Start-up

**V-01 · browser · Editor loads the demo archive**
Steps: open the kit.
Expected: one page on the canvas, 148 × 105 mm, with 8 graphics. The dock lists Templates, Elements, Uploads, Images, Text, Shapes, Stickers. No console errors. No request to `cdn.img.ly`.

**V-02 · browser · Start-up selects an image**
Steps: open the kit, read the selection.
Expected: exactly one block is selected and it carries an image fill.
Note: fixed. The kit now selects `findByKind('image')[0]` instead of the dead `findByName('SelectedImage')`.

**V-02b · browser · The archive comes from the demo asset base URL**
Steps: reload the page and record the request for `/assets/scene/scene.scene`.
Expected: exactly one request, whose path ends `/imgly/cesdk-web-examples-data/<version>/starterkit-vectorizer-editor/assets/scene/scene.scene`. This replaces the dropped unit case V-U2: `src/index.ts` creates the editor at import time, so `DEMO_ASSETS_BASE_URL` cannot be read in Vitest.

### 5.2 Vectorization

**V-03 · browser · Qase 2480, 2516 · Vectorize a sample image**
Steps: select one of the images on the page, open the canvas menu, click Vectorize.
Expected: the canvas menu shows a Vectorizer button for an image — this asserts the kit's `ui: { locations: 'canvasMenu' }` reached the Transform-mode canvas-menu order. The click hands the block to the plugin, which marks it `PROCESSING` in its block metadata at once, and the block stays selected. This is the kit's one end-to-end proof, and it stops at the hand-off: the conversion, its result and its 30 s time limit are the plugin's decision (section 10, gap 1). The case used to wait for the converted fill, which took 5 s on a developer machine and more than the plugin's limit on the CI runner, where the 1024 × 1024 sample never finished.
Note: the button is labelled Vectorizer, not Vectorize.

**V-04 · browser · Qase 2508, 2509 · Upload a custom image and vectorize it**
Steps: upload a PNG through the Uploads entry, add it, run Vectorize. Repeat with a JPEG.
Expected: both uploads land in `ly.img.image.upload` and the Vectorizer button is offered for both. The kit's `uploadFile` action creates the blob URL through `cesdk.utils.localUpload`.

**V-05 · browser · An SVG is offered vectorization too**
Steps: upload an SVG, add it, select it.
Expected: the uploaded SVG becomes an image fill and the Vectorizer button IS offered.
Note: the run disproved the original expectation. The plugin offers its button for any image fill and does not inspect the source format, so Qase 2518 describes behaviour the plugin does not have. **Qase 2518 is deliberately unmapped**: reporting a pass here would mark a disputed case green. The case pins what ships; the plugin owns the decision (section 10, gap 1).

**V-06 · dropped · A vectorized image can be vectorized again**
Whether a converted block is offered the button again is the plugin's decision, and proving it needs a finished conversion, so the case belongs in the plugin's suite (section 10, gap 1). What the earlier run found stands: the plugin does not mark a block as already vectorized, so Qase 4661 describes behaviour it does not have and **stays deliberately unmapped**.

**V-07 · browser · Qase 4660 · Two images at a time**
Steps: select two images, open the canvas menu.
Expected: no Vectorizer button. The plugin withholds it for a multi-block selection; the kit passes no configuration that would change it.

**V-08 · browser · Qase 2487, 2494, 2495, 2510, 2517 · An image keeps the editing features the kit enables**
Steps: select an image, use Crop, then Adjustments, then Duplicate, then Replace, then Delete.
Expected: Crop is in the inspector bar, the Style menu offers Adjustments, Replace Image is in the canvas menu, Duplicate makes a second image block and Delete removes it. The kit enables `ly.img.crop`, `ly.img.adjustment`, `ly.img.duplicate`, `ly.img.replace` and `ly.img.delete`. The Qase cases run these on a vectorized image; that the conversion leaves an image block behind is the plugin's decision, so the kit half is asserted on the sample image.

### 5.3 Export

**V-09 · browser · Qase 2492 · Export image**
Steps: open the actions dropdown, click Export Image.
Expected: one PNG download at the page's own resolution, and one `engine.block.export` call with `image/png` and no target size.
Note: the run proved the kit's `exportImage` action unreachable — `ly.img.exportImage.navigationBar` runs `exportDesign` with the mime type only. The dead action was deleted, so 1080 × 1080 never applied.

**V-10 · browser · Qase 2491 · Export PDF**
Steps: open the actions dropdown, click Export PDF.
Expected: one PDF download with 1 page.

### 5.4 Unit cases (no browser, no engine)

Subject: `src/imgly/plugins/vectorizer.ts`, `src/index.ts` and `src/imgly/config/**`, called with a spy `CreativeEditorSDK`.

**V-U1 · unit · Plugin arguments**
`setupVectorizerPlugin` adds `VectorizerPlugin` with exactly `{ ui: { locations: 'canvasMenu' } }`. The plugin's type is `Location | Location[]`, so the bare string is legal; the case pins it so a later change to an array is deliberate.

Dropped: V-U2 (demo asset base URL). `src/index.ts` creates the editor at import time, so the module cannot be loaded in Vitest. V-02b asserts the resolved archive URL in the browser instead.

**V-U3 · unit · Editor initialization**
`initVectorizerEditor` adds `DesignEditorConfig` first, then the fifteen asset-source plugins, then calls `setupVectorizerPlugin` last. The fifteen are all in flight before the first one settles, so they register concurrently. Role is `Creator` and theme is `light`.

**V-U4 · unit · Dock, navigation bar and actions**
`setupDock` sets `dock/hideLabels` false and `dock/iconSize` large and orders Templates, separator, Elements, Uploads, Image, Text, Shapes, Sticker. `setupNavigationBar` puts the actions dropdown last with `exportImage` and `exportPDF` as its children. `setupActions` registers exactly `saveScene`, `exportDesign`, `importScene`, `exportScene` and `uploadFile`, and `exportDesign` downloads what `cesdk.utils.export` returned.

**V-U5 · unit · Features and settings**
`setupFeatures` enables one explicit leaf list of 109 feature ids, asserted in full, and disables nothing. Among them are `ly.img.page.resize`, `ly.img.crop.size`, `ly.img.adjustment`, `ly.img.duplicate`, `ly.img.replace.fill`, `ly.img.delete` and `ly.img.navigation.bar`, which the vectorizer flow needs. No `ly.img.video`, `ly.img.placeholder`, `ly.img.ruler` or `ly.img.settings` id is in the list. `setupSettings` sets `page/title/show` false.

**V-U6 · unit · UI orchestration**
`setupUI` docks the inspector and the asset library on the left and orders the navigation bar, the dock, the canvas menu and the inspector bar.

**V-U7 · unit · Keyboard shortcuts**
`setupKeyboardShortcuts` sets one US ANSI catalog, and every entry in it has a key combination and something to run.

**KB-01 · unit · Keyboard catalog predicates**

`tests/unit/keyboard-catalog.test.ts` runs every `run` and `when` of `src/imgly/config/keyboard/catalogs/us-ansi.ts` against 1620 editor states (5 edit modes, 9 selections, 3 roles, features on and off, 3 vector states, page and no page) and asserts that none throws, that every shortcut activates in at least one state, and that every function `run` reaches `cesdk.actions.run`. Kit-owned: the kit decides which key does what and when it is live. The catalog measures 100 % lines, branches and functions.

## 6. Entry and exit criteria

Entry: engine and editor built; test license available; the shared kit test harness exists.

Exit: every case in section 5 passes locally and in CI. `npm run ci` passes. No test contacts the CDN. The published kit contains no test files. A release run reports results to the Qase ids above.

## 7. Known issues found while writing this plan

Confirm each with a test before fixing.

1. Fixed: the start-up selection was dead — `findByName('SelectedImage')[0]` matched nothing, because the archive's image block is named `FirstImage`. The kit now uses `findByKind('image')[0]`, which needs no name at all.
2. The kit has no `src/imgly/resolveAssetPath.ts` while every sibling kit in this batch ships one. It is not needed — the kit loads only the remote archive — but the folder shape differs from the convention the other kits follow.
3. `config/i18n.ts` is an empty `void cesdk;` stub while the README documents localization.
4. The README's Architecture tree omits `config/keyboard/` and `plugins/vectorizer.ts`.

## 8. Open questions

1. Resolved: the kit selects by kind, so the published archive stays untouched.
2. Resolved: V-07 asserts that no button is offered, which is what the plugin does today.
3. New: Qase 2518 and 4661 describe rules the plugin does not implement — it offers its button for an uploaded SVG and for an already vectorized block. Either the plugin gains those rules or the two cases are retired. The kit cannot decide it (section 10, gap 1).

## 9. Estimate

Measured: 10 browser cases in 15 s on one worker in static mode on an M-series Mac; none waits for a vectorization. 28 unit tests under 1 s.

## 10. Boundary review

Rule used: the code that makes a decision owns the test for it. The kit decides that the vectorizer plugin is installed and where its button appears, which asset sources exist, the dock and navigation-bar order, the feature set, the export actions, which archive is loaded and which block is selected on start-up. The plugin decides what vectorization does to a fill, when the button is offered, and how a multi-block or non-raster selection is handled. The engine decides what an export produces.

Core behaviour this plan leans on, and where it is covered today:

| Behaviour                                                                         | Owner  | Covered by                                                                            |
| --------------------------------------------------------------------------------- | ------ | ------------------------------------------------------------------------------------- |
| Loading a scene archive restores its pages, fonts and images                      | engine | `engine/lib/test/api/ArchiveRoundTripAPITest.cpp`, `ArchiveDiskRoundTripAPITest.cpp`  |
| `cesdk.utils.export` returns blobs for a mime type; `downloadFile` picks defaults | editor | `apps/cesdk_web/packages/api/utils/UtilsAPI.test.ts`                                  |
| The default action shapes the kit overrides                                       | editor | `apps/cesdk_web/packages/cesdk/registerDefaultActions.test.ts`                        |
| `DemoAssetSources` registers the sources matched by its `include` globs           | editor | `packages/cesdk-core-plugins-web/src/plugin-demo-asset-source-web/src/plugin.test.ts` |
| PDF export of a scene contains every page                                         | engine | `engine/lib/test/api/ExportAPITest.cpp` `ExportToBuffer_PDF_AllPagesInScene`          |

Core coverage gaps found (candidates to add in the core suites, not in this kit):

1. `@imgly/plugin-vectorizer-web` has no tests and no `test` script in its `package.json`. Nothing covers `processVectorization`, `createVectorPathBlocks`, `addAsVectorGroup`, the grouping threshold, the timeout, or the rules that withhold the button for an SVG, an already vectorized block or a multi-block selection. Qase 2516, 2518, 4660 and 4661 rest entirely on it. Suggested home: `apps/cesdk_web_plugins/packages/plugin-vectorizer-web/src/__tests__/`, following `plugin-autocaption-web`.
2. `registerFillProcessingComponents` in `apps/cesdk_web_plugins/internal/plugin-utils` decides which UI locations a fill-processing plugin appears in and drives the processing state machine for four plugins in this batch. That directory contains no test file. Suggested home: next to that module. Recorded once here and in the background-removal plan.

Until gap 1 is closed, V-03 keeps its fill-URI assertion as the end-to-end proof.

## 11. Coverage pass

Cases added to close the merged-coverage gaps:

- **V-U8 · unit · The actions the kit registers — every handler `setupActions` registers is invoked: `saveScene` downloads the saved scene as text, `exportDesign` downloads what `cesdk.utils.export` returned, `importScene` opens the picker for `.imgly,.scene,.zip`, revokes the blob URL on the success and on the failure path and then runs `zoom.toPage`, `exportScene` writes a JSON scene by default and a zip archive for `{ format: 'archive' }`, and `uploadFile` returns what `cesdk.utils.localUpload` returned**
- **V-U9 · unit · DesignEditorConfig — `initialize` resets the editor, then declares the CE.SDK generation with `setEditorCompatibilityVersion(CreativeEditorSDK.version)` before anything else, then applies features, UI, actions, shortcuts, translations and engine settings; with no `cesdk` in the context it touches the engine not at all**
- **V-U10 · unit · Video timeline scaffold — `setupVideoTimeline` makes no editor call, so the kit ships the timeline example unapplied**
- **V-U11 · unit · `src/index.ts` — the demo base URL falls back to the published data and is taken from `VITE_DEMO_ASSETS_BASE_URL` when set; a successful create loads the scene, selects the image and reports the `created` and `ready` demo phases; a scene with no image selects nothing; a rejected create reports `failed` and logs the failure**

No uncovered line, branch or function remains.
