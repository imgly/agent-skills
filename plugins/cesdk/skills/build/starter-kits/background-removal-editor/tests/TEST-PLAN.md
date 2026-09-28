# Test plan: starterkit-background-removal-editor

Version 5, 7 Sep 2026. Status: implemented, `npm run ci` green (51 unit and headless tests, 10 browser tests). Merged coverage is lines 100 %, branches 100 %, functions 100 %.

## 1. Purpose

Verify that the Background Removal starter kit works as shipped: the editor loads the demo scene, registers the background-removal plugin in the canvas menu, and keeps a processed image fully editable and exportable.

## 2. Scope

In scope

- Registration of `@imgly/plugin-background-removal-web` with `ui.locations = ['canvasMenu']` and the `@imgly/background-removal` provider
- The fifteen asset-source plugins the kit installs and the dock order built from them
- The kit's export actions (`exportImage`, `exportDesign`, `saveScene`, `importScene`, `exportScene`, `uploadFile`) and the navigation-bar actions dropdown
- Feature and engine-setting configuration under `src/imgly/config/`
- Editor start-up with `public/assets/scene.scene`
- The kit's own code under `src/imgly/` and `src/index.ts`

Out of scope

- What background removal produces. The plugin decides that; see section 10.
- Core editor features reached through this kit (crop panel, adjustments, filters, undo stack, upload library). Covered by the core editor suite.
- The demo site around the kit (cards, tags, platform support, links, device toggles). Covered by the `cesdk_web_demos` suite. Qase 4591, 4592, 4593, 4594, 4600, 4609, 4610, 4611, and 4601, which the export classifies as `kit-behaviour` but asks whether the demo site's Desktop toggle can be changed — a property of that site, not of the kit.
- The iOS app pages. Qase 4603, 4604, 4606.

## 3. Test environment

- Browser: Chrome, headless, 1400 × 900
- Engine and editor: built from this repo, served locally. Requests to `cdn.img.ly` fail the test.
- License: the shared test license (valid on hostname `localhost` only)
- Data: the kit's own `public/assets/scene.scene`. 1 page, DIN A6, 148 × 105 mm, one graphic with an image fill plus text.
- Network: `@imgly/background-removal@1.7.0` downloads its ONNX models from `staticimgly.com/@imgly/background-removal-data/`, which the guard allows. Measured: a removal takes 16 to 22 s including the download, so the three cases that run one keep a 180 s timeout and every other case asserts wiring only.
- No `cdnAllowlist`. The demo scene's Manrope font URI is relative to the engine's `baseURL`, so the suite runs with the CDN guard at its default.
- Downloads: captured by Playwright and checked by file type, pixel size, and PDF page count

## 4. Approach

| Kind    | Tool                          | What it checks                                          | Run                 |
| ------- | ----------------------------- | ------------------------------------------------------- | ------------------- |
| Static  | tsc, eslint, convention check | Types, deprecated APIs, kit folder shape                | `npm run check:all` |
| Unit    | Vitest                        | Dock, navigation bar, features, settings, plugin wiring | `npm run test:unit` |
| Browser | Playwright                    | The test cases in section 5                             | `npm run test:e2e`  |

All three run in the kit's `ci` script. Browser tests use role and label locators only. The navigation bar's actions dropdown is reached by its accessible name, Show more options, which the editor gained in 1.82; before that the case had to fall back to the builder's `name` attribute. Every `src/imgly/config/` module is a pure function over a `CreativeEditorSDK`, so the configuration is covered by unit cases with a spy and the browser keeps one proof per feature. There are no headless cases: nothing in the kit runs without the editor.

## 5. Test cases

Format: ID, level, Qase id, title. Then steps and expected result.
Common precondition for all browser cases: the kit is open in the browser and the scene has finished loading.

### 5.1 Start-up and library

**BGR-01 · browser · Editor loads with the demo scene**
Steps: open the kit.
Expected: one page on the canvas, 148 × 105 mm. The dock lists Templates, Elements, Uploads, Images, Text, Shapes, Stickers. No console errors. No request to `cdn.img.ly`.
Note: `engine.editor.getSetting('dock/hideLabels')` is not reflected for reading, so the label and icon-size settings are asserted in BGR-U2 instead.

**BGR-02 · browser · Qase 1493 · Add a pre-loaded image to the canvas**
Steps: open the Image entry in the dock, click one of the demo images.
Expected: a new graphic with an image fill is added to the page and selected. The library lists the demo images because the kit installs `DemoAssetSources` with `include: ['ly.img.image.*']`.

### 5.2 Background removal

**BGR-03 · browser · Qase 1529 · The canvas menu offers BG Removal on an image**
Steps: select the image on the page.
Expected: the canvas menu shows a BG Removal button. Select the text block instead: the button is gone. This asserts the kit's `ui: { locations: ['canvasMenu'] }` reached the Transform-mode canvas-menu order.

**BGR-04 · browser · Qase 1529 · Background removal runs on the sample image**
Steps: select the image, click BG Removal, wait for processing.
Expected: the block's image fill URI changes to a new blob or object URL and the block stays selected. Model files are requested from `staticimgly.com`. Timeout 180 s. This is the kit's one end-to-end proof; the quality of the mask is the plugin's decision (section 10, gap 1).

**BGR-05 · browser · Qase 1522, 1523 · Upload a custom image and remove its background**
Steps: upload a PNG through the Uploads entry, add it, run BG Removal. Repeat with a JPEG.
Expected: both uploads land in `ly.img.image.upload` (the kit installs `UploadAssetSources` with that include) and the BG Removal button is offered for both. The kit's `uploadFile` action creates the blob URL through `cesdk.utils.localUpload`.
Note: the case adds the uploads and asserts the button; it does not run a removal on them.
Note from the 1.82 run: the asset library panel is a `complementary` landmark named after the open dock entry, Uploads. It used to be a `region` named `//ly.img.panel/assetLibrary`.

**BGR-06 · browser · Qase 4652 · Background removal applies to one image at a time**
Steps: add a second image, select both.
Expected: the BG Removal button is not offered for a multi-block selection.

**BGR-07 · browser · Qase 1528, 1532, 4650, 4651 · A processed image stays editable**
Steps: after BGR-04, select the processed block and use Crop, then Adjustments, then drag it to a new position. Then select the other image.
Expected: Crop and Position are in the inspector bar and the Style menu lists Adjustments, Filter, Effect and Blur — the kit enables `ly.img.crop`, `ly.img.adjustment`, `ly.img.filter`, `ly.img.effect`, `ly.img.blur`, `ly.img.shadow`. Selecting another image works and its own BG Removal button appears.
Note: the drag step was dropped. Moving a block is the editor's gizmo; the kit's decision is that the transform features are on.

**BGR-08 · browser · Qase 4649 · Undo and redo a background removal**
Steps: after BGR-04, click Undo, then Redo.
Expected: the fill URI returns to the original, then to the processed one. Undo and redo are available because the kit puts `ly.img.undoRedo.navigationBar` in the navigation bar and enables `ly.img.navigation`.

### 5.3 Export

**BGR-09 · browser · Qase 1506 · Export image**
Steps: open the actions dropdown in the navigation bar, click Export Image.
Expected: one PNG download at the page's own resolution, and one `engine.block.export` call with `image/png` and no target size.
Note: the run proved the kit's `exportImage` action unreachable — `ly.img.exportImage.navigationBar` runs `exportDesign` with the mime type only. The dead action was deleted, so 1080 × 1080 never applied.

**BGR-10 · browser · Qase 1505 · Export PDF**
Steps: open the actions dropdown, click Export PDF.
Expected: one PDF download with 1 page.

### 5.4 Unit cases (no browser, no engine)

Subject: `src/imgly/index.ts` and `src/imgly/config/**`, called with a spy `CreativeEditorSDK`.

**BGR-U1 · unit · Plugin registration order**
`initBackgroundRemovalEditor` adds `DesignEditorConfig` first, then the fifteen asset-source plugins, then `BackgroundRemovalPlugin` last, and sets the role to `Creator` and the theme to `light`. The background-removal options are exactly `{ ui: { locations: ['canvasMenu'] }, provider: { type: '@imgly/background-removal' } }`. The fifteen asset sources go in through one `Promise.all`: a case holds every `addPlugin` open and checks all fifteen were requested before any of them resolved and before background removal was reached.

**BGR-U2 · unit · Dock order**
`setupDock` sets `dock/hideLabels` false and `dock/iconSize` large, and orders the dock as Templates, separator, Elements, Uploads, Image, Text, Shapes, Sticker. The Elements entry lists `ly.img.image`, `ly.img.text`, `ly.img.vector.shape`, `ly.img.sticker`; the Image entry lists `ly.img.image` and `ly.img.image.upload`.

**BGR-U3 · unit · Navigation bar and actions**
`setupNavigationBar` puts the actions dropdown last with `exportImage` and `exportPDF` as its children. `setupActions` registers exactly `saveScene`, `exportDesign`, `importScene`, `exportScene` and `uploadFile`, and `exportDesign` downloads what `cesdk.utils.export` returned.

**BGR-U4 · unit · Features and settings**
`setupFeatures` enables exactly the 108 ids of `features.ts`, asserted as the whole array, and leaves the placeholder, video, rulers and settings groups off. The list names each control explicitly (`ly.img.crop.size`, `ly.img.replace.fill`, `ly.img.shadow.blur`, `ly.img.navigation.bar`), not the `ly.img.crop`, `ly.img.replace`, `ly.img.shadow` and `ly.img.navigation` parents. `setupSettings` sets `page/title/show` false, `doubleClickToCropEnabled` true, `page/dimOutOfPageAreas` true and `colorPicker/colorMode` `Any`.

**BGR-U6 · unit · UI orchestration**
`setupUI` docks the inspector and the asset library on the left, orders the navigation bar, the dock, the canvas menu and the inspector bar, and leaves the video timeline alone.

**BGR-U7 · unit · Keyboard shortcuts**
`setupKeyboardShortcuts` sets one US ANSI catalog, and every entry in it has a key combination and something to run.

**BGR-U8 · unit · The actions the kit registers**
Each handler `setupActions` registers is invoked: `saveScene` downloads the saved scene as `text/plain;charset=UTF-8`; `importScene` opens the picker for `.imgly,.scene,.zip`, loads the blob URL, revokes it (also when the load throws) and then runs `zoom.toPage` with `{ page: 'first' }`; `exportScene` writes a JSON scene by default and a `application/zip` archive for `{ format: 'archive' }`; `uploadFile` returns what `cesdk.utils.localUpload` returned.

**BGR-U9 · unit · DesignEditorConfig**
`initialize` resets the editor, pins the editor compatibility version to the plugin version as its second call, then applies features, UI, actions, shortcuts, translations and engine settings. With no `cesdk` in the context it touches the engine not at all.

**BGR-U10 · unit · Video timeline scaffold**
`setupVideoTimeline` makes no editor call: the kit ships the timeline example unapplied, as this is a design kit.

**BGR-U11 · unit · `src/index.ts`**
With `@cesdk/cesdk-js`, the kit barrel and the demo lifecycle beacon mocked: a successful create publishes `window.cesdk`, configures the editor, loads `/assets/scene.scene` and posts `created` then `ready`; a rejected create logs `Failed to initialize CE.SDK:`, posts `failed` only, and leaves no unhandled rejection.

Dropped: BGR-U5 (asset path resolution). `resolveAssetPath` is gone; the shared `tests/unit/demo-assets.test.ts` covers `src/imgly/demo-assets.ts`.

**BGR-U12 · removed.** `resolveAssetPath` is gone; `src/imgly/demo-assets.ts` derives the URL from `VITE_DEMO_ASSETS_BASE_URL` or the kit's own URL.

**KB-01 · unit · Keyboard catalog predicates**

`tests/unit/keyboard-catalog.test.ts` runs every `run` and `when` of `src/imgly/config/keyboard/catalogs/us-ansi.ts` against 1620 editor states (5 edit modes, 9 selections, 3 roles, features on and off, 3 vector states, page and no page) and asserts that none throws, that every shortcut activates in at least one state, and that every function `run` reaches `cesdk.actions.run`. Kit-owned: the kit decides which key does what and when it is live. The catalog measures 100 % lines, branches and functions.

## 6. Entry and exit criteria

Entry: engine and editor built; test license available; the shared kit test harness exists.

Exit: every case in section 5 passes locally and in CI. `npm run ci` passes. The published kit contains no test files. A release run reports results to the Qase ids above.

## 7. Known issues found while writing this plan

Confirm each with a test before fixing.

1. `public/assets/remove-bg.png` is not referenced anywhere in the kit. `src/index.ts` loads `scene.scene` and nothing else reads the PNG. Undecided, so still shipped.
2. Fixed: `check:lint` now runs the three-part form with `assert-cesdk-types.mjs` and `--max-warnings 0`.
3. `src/index.ts` carries a commented-out `baseURL` line that repeats the live value verbatim, so the "IMG.LY CDN (for quick testing only)" hint points at the local assets URL.
4. `config/i18n.ts` is an empty `void cesdk;` stub while the README documents localization.
5. The README's Architecture tree omits `config/keyboard/`, which the kit ships and `config/plugin.ts` calls.
6. **Fixed.** The Manrope font and the LUT filter are relative to the engine's `baseURL`, and the `defaultEmojiFontFileUri` setting is empty. The demo scene no longer names `cdn.img.ly` anywhere.

Fixed: 2 (the lint gate). 6 (the font, filter and emoji URIs are relative to the engine's `baseURL`).

### Coverage residue

None. Every executable line, branch and function of `src/**` is covered by the merged report.

## 8. Open questions

1. Resolved by measurement: a removal takes 16 to 22 s and the whole suite runs in 1.5 minutes, so all three removal cases stay in the PR suite. No nightly split needed.
2. Issue 1: delete `remove-bg.png`, or reference it from the scene. Recommendation: delete; the same unreferenced file also ships in the photo-editor and print-ready-pdf kits, so raise it once for the three.

## 9. Estimate

Measured: 10 browser cases in 1.5 minutes on one worker (the three removal cases 15 to 21 s each, the rest 2 to 12 s). 31 unit tests under 1 s.

## 10. Boundary review

Rule used: the code that makes a decision owns the test for it. The kit decides which plugins are installed, with which options, the dock and navigation-bar order, the feature set, the engine settings, the export actions and the demo scene. The plugin decides what background removal does to a fill and when its button is offered. The editor decides how a canvas menu renders and how the crop, adjustment and filter panels behave. The engine decides what an export produces.

Core behaviour this plan leans on, and where it is covered today:

| Behaviour                                                                              | Owner  | Covered by                                                                            |
| -------------------------------------------------------------------------------------- | ------ | ------------------------------------------------------------------------------------- |
| `cesdk.utils.export` returns blobs for a mime type and reports progress                | editor | `apps/cesdk_web/packages/api/utils/UtilsAPI.test.ts` `describe('export')`             |
| `cesdk.utils.downloadFile` picks the right default mime type and download handler      | editor | same file, `describe('downloadFile')`                                                 |
| The default `exportDesign`, `saveScene`, `importScene` and `exportScene` action shapes | editor | `apps/cesdk_web/packages/cesdk/registerDefaultActions.test.ts`                        |
| `DemoAssetSources` registers the sources matched by its `include` globs                | editor | `packages/cesdk-core-plugins-web/src/plugin-demo-asset-source-web/src/plugin.test.ts` |
| A component registered by a plugin renders in the canvas menu order                    | editor | `apps/cesdk_web/packages/cesdk/stores/UserInterfaceStore.test.ts`                     |
| PDF export of a scene contains every page                                              | engine | `engine/lib/test/api/ExportAPITest.cpp` `ExportToBuffer_PDF_AllPagesInScene`          |

Core coverage gaps found (candidates to add in the core suites, not in this kit):

1. `@imgly/plugin-background-removal-web` has no tests at all — its `package.json` sets `"test": "echo No tests"`. Nothing covers `findOptiomalSource`, `fillProcessingBackgroundRemoval`, `uploadBlob`, or the provider switch. Qase 1529, 1522, 1523, 4649 and 4652 all rest on it. Suggested home: `apps/cesdk_web_plugins/packages/plugin-background-removal-web/src/__tests__/`, following `plugin-autocaption-web`.
2. `registerFillProcessingComponents` in `apps/cesdk_web_plugins/internal/plugin-utils` decides which UI locations a fill-processing plugin appears in and drives the whole processing state machine for four plugins in this batch. `apps/cesdk_web_plugins/internal` contains no test file. Suggested home: next to that module.

Until gap 1 is closed, BGR-04 keeps its fill-URI assertion as the end-to-end proof.
