# Test plan: starterkit-single-page-editor

Version 5, 7 Sep 2026. Status: implemented. 46 unit and headless tests and 8 browser tests run in `npm run ci`. Merged coverage: lines 100 %, branches 100 %, functions 100 %.

## 1. Purpose

Verify that the Single Page Editor starter kit works as shipped: single-page mode hides every page but one, and the kit's own page-select component in the canvas bar switches between the pages of a multi-page template.

## 2. Scope

In scope

- `src/index.ts`: `featureFlags.singlePageMode`, the demo archive it loads, the `window.cesdk` hook
- `src/imgly/index.ts`: the configuration plugin and the asset source plugins
- `src/imgly/config/**`: features, settings, i18n, actions, and the UI configuration
- The `page-select` component and its icon set in `src/imgly/config/ui/components.ts`

Out of scope

- Core editor and engine behaviour reached through this kit: page visibility in single-page mode, export, asset libraries, text editing. See section 10.
- The demo site around the kit. Qase 506, 507, 509, 510, 525, 534, 2413, 2415, 2418, 2419. Qase 2470 is filed as kit behaviour but the Desktop/Mobile toggle it uses is the demo site's iframe switch, so it belongs there too.

## 3. Test environment

- Browser: Chrome, headless, 1400 x 900
- Engine and editor: built from this repo, served locally
- License: the shared test license (valid on hostname `localhost` only)
- Data: `${DEMO_ASSETS_BASE_URL}/assets/ig-post/scene.scene`. Verified: 4 pages, fonts and images referenced next to the scene file. In dev the local CDN daemon serves it; in static mode the baked `staticimgly.com` URL applies, which the network guard allows. Measured on a real boot: no `cdn.img.ly` request at all.
- Hook: `window.cesdk`

## 4. Approach

| Kind    | Tool                          | What it checks                                                      | Run                 |
| ------- | ----------------------------- | ------------------------------------------------------------------- | ------------------- |
| Static  | tsc, eslint, convention check | Types, deprecated APIs, kit folder shape                            | `npm run check:all` |
| Unit    | Vitest                        | The config modules and the `page-select` render function, no engine | `npm run test:unit` |
| Browser | Playwright                    | The cases in section 5                                              | `npm run test:e2e`  |

The `page-select` render function is captured from a stub `cesdk.ui.registerComponent` and called with a recording `builder` and a stub `engine` that answers `scene.getPages`, `scene.getCurrentPage`, `block.getName` and `block.isValid`. Everything the component decides is therefore a unit test. Browser tests use role and label locators, with documented exceptions: the previous and next page buttons, the page dropdown and the inspector toggle carry an icon and a tooltip but no accessible name, so those four are located by the `name` attribute the builder emits (`CanvasBarBuilder-Button-prevPage`, `CanvasBarBuilder-Button-nextPage`, `CanvasBarBuilder-Dropdown-pageSelect`, `InspectorBarBuilder-Button-inspectorToggle`). The actions dropdown and a panel go through the harness helpers `actionsMenu` and `editorPanel(id)`, so the editor's own attributes appear in one place rather than in every kit; a case that scopes to the editor uses the kit's own `#cesdk_container`. The pilot kit justifies the same for its builder Select and NumberInput controls.

## 5. Test cases

Format: ID, level, Qase id, title. Then steps and expected result.
Common precondition for browser cases: the kit is open and the archive has finished loading.

### 5.1 Start-up

**SPE-01 · browser · Editor loads in single-page mode**
Steps: open the kit.
Expected: four pages in the scene, exactly one of them visible, `features/singlePageModeEnabled` true. The canvas bar shows the page-select control reading `Page 1 / 4` next to the add-page button. Dock shows Templates, Elements, Uploads, Images, Text, Shapes, Stickers. No console errors.
Note: this case absorbed SPE-U10 — see section 5.4.

**SPE-02 · browser · Inspector and assets panels open on the left**
Steps: open the Images dock entry, then select a text block and open the inspector from the inspector bar.
Expected: both panels dock to the left of the canvas.
Note: the first run showed the inspector panel is closed until the inspector-bar toggle is clicked.

**SPE-03 · browser · Navigation bar carries the two export entries only**
Steps: read the navigation bar, then open the actions dropdown at its end.
Expected: an Export Images button next to the dropdown, and Export PDF inside the dropdown, nothing else.
Note: the first run showed that `ly.img.exportImage.navigationBar` renders as its own button rather than a dropdown entry. The expected result above was corrected.

### 5.2 Page navigation

**SPE-04 · browser · Qase 540 · Previous and next page buttons**
Steps: with four pages, click the next-page button, then the previous-page button. Read `window.cesdk.engine.scene.getCurrentPage()` after each click.
Expected: the current page moves forward and back by one. The previous button is disabled on the first page and the next button on the last.

**SPE-05 · browser · Qase 541 · Selecting a page from the dropdown**
Steps: open the page dropdown in the canvas bar, click the third entry.
Expected: the dropdown lists `Page 1` to `Page 4`, the current page becomes the third page, only the third page is visible, and the dropdown label reads `Page 3 / 4`.

**SPE-06 · browser · Qase 3020, 3021 · Adding a page**
Steps: click the add-page button in the canvas bar. Open the page dropdown.
Expected: the dropdown lists five pages and its label counter reads `/ 5`. The new page is the visible one.

### 5.3 Export

**SPE-07 · browser · Qase 524 · Export image**
Steps: open the actions dropdown, click Export image.
Expected: one PNG download. It contains the page that is currently visible, not the whole archive. `utils.export` exports the selected or current page for image mime types.

**SPE-08 · browser · Qase 523 · Export PDF**
Steps: open the actions dropdown, click Export PDF.
Expected: one PDF download holding one page, the visible one. Confirmed on the first run: a four-page archive exports as a single-page PDF. The case pins that behaviour until the product question in known issue 3 is decided.

### 5.4 Unit tests (no browser)

**SPE-U1 · unit · Qase 541 · `page-select` with three pages or fewer**
Call the captured render function with two pages, the first current.
Expected: one `ButtonGroup('pages')` with one button per page, the current one active, and the label from `block.getName` when set, otherwise `Page 1` and `Page 2`.

**SPE-U2 · unit · Qase 540, 3021 · `page-select` with four pages or more**
Call the render function with four pages, the second current.
Expected: a `ButtonGroup('pagesControls')` with `prevPage`, a `Dropdown('pageSelect')` labelled `Page 2 / 4`, and `nextPage`. With the first page current, `prevPage` is disabled. With the last page current, `nextPage` is disabled. Clicking a dropdown entry calls `unstable_switchPage` and then `block.select` with that page, and closes the dropdown.

**SPE-U3 · unit · `page-select` with one page renders nothing**
Expected: the builder records no call.

**SPE-U4 · unit · `page-select` recovers when the current page is deleted**
Call the render function with four pages and the third current, then again with the third page removed and `getCurrentPage` returning an id that is no longer in the list.
Expected: the component switches to the page that took the deleted index, and selects it. This branch is only reachable through the unit test.

**SPE-U5 · unit · Enabled features**
Expected: `feature.enable` is called once with one explicit leaf list of 109 feature ids, asserted in full, and `feature.disable` is not called. No `ly.img.video.*` and no `ly.img.placeholder.*` id is in the list.

**SPE-U6 · unit · Engine settings**
Expected: `page/title/show` is false, `page/title/showOnSinglePage` is true, `doubleClickToCropEnabled` is true, `page/selectWhenNoBlocksSelected` is false, `colorPicker/colorMode` is `Any`.

**SPE-U7 · unit · Dock, navigation bar, canvas bar and panel order**
Expected: `dock/hideLabels` false and `dock/iconSize` large; the dock order is the seven library entries and the separator, with the separator after Templates; the canvas bar at `bottom` is settings, spacer, `page-select`, add page, spacer; the navigation bar ends with the actions dropdown holding Export image and Export PDF; the inspector and assets panels are set to `left` and non-floating.

**SPE-U8 · unit · Registered actions**
Expected: `actions.register` is called for `saveScene`, `exportDesign`, `importScene`, `exportScene` and `uploadFile`, in that order. `exportDesign` forwards its options to `utils.export` and downloads `blobs[0]` with the returned mime type.
Note: the unreachable `exportImage` action was deleted (known issue 1), so it is no longer expected.

**SPE-U9 · unit · Icon set**
Expected: `ui.addIconSet` is called with `@imgly/custom` and the markup defines `@imgly/custom/icon/ArrowLeft` and `@imgly/custom/icon/ArrowRight`, the two ids `page-select` uses.

SPE-U10 was dropped as a unit case: the config object is not exported and `src/index.ts` creates the editor at import time, so it cannot be read without a browser. SPE-01 asserts the observable result instead — `features/singlePageModeEnabled` is true and one of four pages is visible.

**KB-01 · unit · Keyboard catalog predicates**

`tests/unit/keyboard-catalog.test.ts` runs every `run` and `when` of `src/imgly/config/keyboard/catalogs/us-ansi.ts` against 1620 editor states (5 edit modes, 9 selections, 3 roles, features on and off, 3 vector states, page and no page) and asserts that none throws, that every shortcut activates in at least one state, and that every function `run` reaches `cesdk.actions.run`. Kit-owned: the kit decides which key does what and when it is live. The catalog measures 100 % lines, branches and functions.

## 6. Entry and exit criteria

Entry: engine and editor built; test license available; the shared kit test harness exists.

Exit: every case passes locally and in CI. `npm run ci` passes. The published kit contains no test files. A release run reports SPE-04 to SPE-08 and SPE-U1, SPE-U2 to their Qase ids.

## 7. Known issues found while writing this plan

Confirm each with a test before fixing.

Fixed: 1 (the unreachable `exportImage` action was deleted), 6 (the panel calls now use `//ly.img.panel/assetLibrary`, the editor's real asset library panel id).

Open:

2. The dock's Templates entry lists the `ly.img.templates` library, but `DemoAssetSources` is included with `ly.img.image.*` only. The only source feeding that library is `PremiumTemplatesAssetSource`, so the Templates library holds premium templates only. The README promises "Social Media Templates".
3. Export PDF gives the user one page, not the design. `exportDesign` passes the whole scene, but single-page mode has hidden the other three pages and a PDF export leaves hidden pages out, so a four-page template exports as a single page with no warning. The README lists "Export - PNG, JPEG, PDF with quality controls" and says nothing about it. The engine side is covered by `ExportToBuffer_PDF_SceneSkipsHiddenPages`; see section 10, gap 1.
4. The demo archive carries 19 absolute `cdn.img.ly/assets/v3/…` font URIs in the BarlowCondensed variant list. The used files are bundled in the archive and relocated, so loading is CDN-free, but changing the weight or style of that text block would fetch from `cdn.img.ly` and trip the network guard. No case does that.
5. `switchAndSelectPage` calls `cesdk.unstable_switchPage`, an experimental API. If it is renamed the kit breaks silently at run time; the type check catches it only while `@cesdk/cesdk-js` types are built.

## 8. Open questions

1. Resolved: the unreachable `exportImage` action was deleted.
2. Issue 2: include the demo template sources, or change the dock entry and the README. Recommended: include `ly.img.templates.social.*`, which is what the README claims.
3. Issue 3: should Export PDF in a single-page editor produce the visible page or the whole design? This is a product question, not a test question. Recommended: make all pages visible for the duration of the export, as the export-options kit does for its page range, and say so in the README. Open product question.

## 9. Estimate

Measured: 8 browser cases in 3.7 min on one worker on a loaded machine, the two exports dominating. 31 unit cases in under 1 s.

## 10. Boundary review

Rule used: the code that makes a decision owns the test for it. This kit decides the `singlePageMode` flag, the features, settings, dock, navigation bar, canvas bar, panels, actions and the whole `page-select` component. The editor decides what single-page mode does to page visibility; the engine decides what an export produces.

| Behaviour                                                                       | Owner  | Covered by                                                        |
| ------------------------------------------------------------------------------- | ------ | ----------------------------------------------------------------- |
| `singlePageMode` read from `featureFlags`                                       | editor | `apps/cesdk_web/packages/cesdk/stores/ConfigurationStore.test.ts` |
| Single-page visibility, next and previous page                                  | editor | `apps/cesdk_web/packages/engine/engine/page/manager.test.ts`      |
| `ui.setComponentOrder`, `setPanelPosition`, `setPanelFloating`                  | editor | `apps/cesdk_web/packages/api/ui/UserInterfaceAPI.test.ts`         |
| `ui.addIconSet`                                                                 | editor | `apps/cesdk_web/packages/cesdk/stores/UserInterfaceStore.test.ts` |
| `feature.enable` gating                                                         | editor | `apps/cesdk_web/packages/api/features/FeatureAPI.test.ts`         |
| `utils.export` exports the current page for image mime types, the scene for PDF | editor | `apps/cesdk_web/packages/api/utils/UtilsAPI.test.ts`              |
| Archive load from a URL                                                         | engine | `engine/lib/test/api/SceneAPITest.cpp`                            |

Core coverage gaps found:

1. Engine: whether a PDF export of a scene includes pages whose visibility is off. Single-page mode hides three of four pages and the kit exports the scene. Closed on this branch: `engine/lib/test/api/ExportAPITest.cpp` gained `ExportToBuffer_PDF_SceneSkipsHiddenPages` and `ExportToBuffer_PDF_HiddenPageExportedDirectlyStillRenders`. This is the same gap the export-options pilot recorded.
2. Editor: `CreativeEditorSDK.unstable_switchPage` has no test. `PageManager.setSinglePageVisibility` under it is covered, but the wrapper, which also runs the `scroll.toPage` action, is not. Suggested home: `apps/cesdk_web/packages/cesdk/`.

## 11. Coverage pass

Cases added to close the merged-coverage gaps:

- **SPE-U10 · unit · The actions the kit registers — every handler `setupActions` registers is invoked: `saveScene` downloads the saved scene as text, `exportDesign` downloads what `cesdk.utils.export` returned, `importScene` opens the picker for `.imgly,.scene,.zip`, revokes the blob URL on the success and on the failure path and then runs `zoom.toPage`, `exportScene` writes a JSON scene by default and a zip archive for `{ format: 'archive' }`, and `uploadFile` returns what `cesdk.utils.localUpload` returned**
- **SPE-U11 · unit · DesignEditorConfig — `initialize` resets the editor, then declares the CE.SDK generation with `setEditorCompatibilityVersion(CreativeEditorSDK.version)` before anything else, then applies features, UI, actions, shortcuts, translations and engine settings; with no `cesdk` in the context it touches the engine not at all**
- **SPE-U12 · unit · Video timeline scaffold — `setupVideoTimeline` makes no editor call, so the kit ships the timeline example unapplied**
- **SPE-U13 · unit · `src/index.ts` — with `@cesdk/cesdk-js` and the kit barrel mocked: a successful create publishes `window.cesdk`, configures the editor, loads the demo scene and reports the `created` and `ready` demo phases; a rejected create reports `failed`, logs `Failed to initialize CE.SDK:` and leaves no unhandled rejection**
- **SPE-U14 · unit · page-select edge cases — an unknown current page, a valid block that is not a page, the two fallbacks after a page is deleted, an empty scene, no current page, and the two-page buttons' switch and no-op clicks**
- **SPE-U15 · unit · `initSinglePageEditor` adds the configuration plugin before the fifteen asset sources, and the fifteen are all in flight before the first one settles, so they register concurrently**

No uncovered line, branch or function remains.
