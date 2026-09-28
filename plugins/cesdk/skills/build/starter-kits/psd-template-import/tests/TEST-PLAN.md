# Test plan: starterkit-psd-template-import

Version 7, 7 Sep 2026. Status: implemented. 37 unit, 64 component and 15 browser cases run in `npm run ci`. The Vitest lane and the merged report both read 100 % lines, branches and functions; see section 11.

## 1. Purpose

Verify that the Photoshop Template Import starter kit works as shipped: a `.psd` file picked, dropped or chosen from the examples is handed to `@imgly/psd-importer`, the result is shown next to the original, and the imported scene opens in the editor and can be downloaded as an archive.

## 2. Scope

In scope

- File intake: the upload zone (picker and drag-and-drop), the accepted extensions, the three example files
- The processing state machine in `src/app/FileProcessingContext/`: status, progress message, timing, error handling, reset
- The glue in `src/imgly/plugins/psd-importer.ts`: which parser is used, which options are passed, what is returned, engine clean-up
- The result screen: side-by-side preview, warning and error badges, Edit, Download CE.SDK Archive, New File
- The editor configuration in `src/imgly/`

Out of scope

- What the importer produces from a `.psd` file — layers, text, effects, colour. That is `@imgly/psd-importer`'s decision, covered by `packages/psd-importer/src/test/regression.test.ts` against a corpus that already contains this kit's demo files (see section 10).
- Core editor features reached after Edit (asset library, inspector, export dialog). Covered by the core editor suite.
- The demo site around the kit. Covered by the `cesdk_web_demos` suite. Qase 2520, 2521, 2522, 2523, 2538, 2547, 2560, 2561.

## 3. Test environment

- Browser: Chrome, headless, 1400 × 900
- Engine and editor: built from this repo, served locally. Requests to `cdn.img.ly` for engine assets fail the test.
- License: the shared test license (valid on hostname `localhost` only)
- Data: `showcase-file-1.psd`, `-2`, `-3` and the icons, served from the in-repo copy at `packages/cesdk-web-examples-data/data/starterkit-psd-template-import/` via `VITE_DEMO_ASSETS_BASE_URL`. Never from the CDN.
- Google Fonts: the importer calls `addGfontsAssetLibrary`, which fetches from `staticimgly.com`. That host is allowed by the network guard; `cdn.img.ly` is not.
- Upload fixtures: `showcase-file-1.psd` from the same directory, `packages/psd-importer/src/test/examples/freepik/empty/empty.psb` for the `.psb` case, plus a 1 KB `not-a-psd.txt` written by the test.
- Readiness hook: the kit has no editor until Edit is clicked. Wait for the upload zone for the first screens and for `window.cesdk` only inside the editor.
- Console allowlist: `Failed to process PSD file:` in PSD-08 only, where the test forces a parser failure. Everywhere else the console must be clean.

## 4. Approach

| Kind      | Tool                                                             | What it checks                                              | Run                 |
| --------- | ---------------------------------------------------------------- | ----------------------------------------------------------- | ------------------- |
| Static    | tsc, eslint, convention check                                    | Types, deprecated APIs, kit folder shape                    | `npm run check:all` |
| Unit      | Vitest (node)                                                    | Import options, failure paths, editor configuration         | `npm run test:unit` |
| Component | Vitest + jsdom + RTL through `@imgly/kit-test-harness/component` | Upload filter, state machine, badge grouping, download name | `npm run test:unit` |
| Browser   | Playwright                                                       | The test cases in section 5                                 | `npm run test:e2e`  |

Browser cases reach the editor controls through the `Navigation Bar` landmark, because the editor's root region carries no label.

No headless case. `importPsdFile` calls `createWebEncodeBufferToPNG()`, which needs a browser canvas, so the import cannot run under `@cesdk/node`.

## 5. Test cases

Format: ID, Qase id, title. Then steps and expected result.

### 5.1 File selection screen

**PSD-01 · Qase 2552 · Nothing is pre-rendered on start-up**
Steps: open the kit.
Expected: the upload zone, the notice "Supports .psd and .psb Formats" and three example thumbnails. No preview, no editor, no engine started. No console errors. No engine asset from the CDN.

**PSD-02 · Qase 2553 · Upload a file through the picker**
Steps: set `showcase-file-1.psd` on the file input.
Expected: the loading screen shows "Processing PSD file..." with a running stopwatch, then the result screen shows the imported preview. The original column shows "No Preview Available" for an uploaded file.

**PSD-03 · Qase 2554 · Open a pre-loaded example**
Steps: click the first example thumbnail.
Expected: the loading screen shows "Loading PSD file..." then "Processing PSD file...", then the result screen shows the original PNG preview on the left and the imported preview on the right.

**PSD-04 · Drag and drop a file** (no Qase case yet)
Steps: drop `showcase-file-1.psd` on the upload zone.
Expected: the zone highlights while dragging and the file is processed as in PSD-02.

**PSD-05 · Drag and drop a rejected file type** (no Qase case yet)
Steps: drop `not-a-psd.txt` on the upload zone.
Expected: nothing happens. The kit stays on the selection screen and gives no message. Current behaviour; see known issue 2.

**PSD-06 · Qase 4421 · All three examples import**
Steps: for each of the three examples, click it, wait for the result, then click New File.
Expected: each produces a preview and an archive. Fidelity of the import is not asserted here; see section 10.

### 5.2 Result screen

**PSD-07 · Qase 2553, 2554 · Both files are shown side by side**
Steps: import an example.
Expected: two columns, headed "Photoshop File" and "Imported Result", each with a preview image, and buttons Edit and Download CE.SDK Archive.

**PSD-08 · Warnings and errors from the parser** (no Qase case yet)
Steps: import a file the parser warns about.
Expected: no warning and no error badge. **Corrected after the run**: none of the three demo files makes the parser report anything, so the badge itself is covered by the component case PSD-U7 and this browser case asserts the clean state.

**PSD-09 · Qase 2563 · The archive can be downloaded**
Steps: click Download CE.SDK Archive.
Expected: one download named `showcase-file-1.imgly`. The `.psd` extension is stripped.

**PSD-10 · A `.psb` upload keeps its extension in the download name** — moved to PSD-U6.
The corpus copy of `empty.psb` is an unmaterialised git-LFS stub, and the name is pure string work, so the case is a component assertion (`it.fails`, known issue 1) instead of a browser import.

**PSD-11 · Qase 2556 · New File returns to the start**
Steps: click New File.
Expected: the selection screen is shown and the previous result is gone. That the two object URLs are revoked is not observable from the browser; it is asserted in the unit case below.

### 5.3 Editor

**PSD-12 · Qase 2555 · The imported file opens in the editor**
Steps: click Edit.
Expected: the editor fills the screen with the imported scene loaded and zoomed to the page. A close button is the first item in the navigation bar. `window.cesdk` is set.

**PSD-13 · Qase 2555 · The editor can be closed**
Steps: click the close button.
Expected: the editor closes and the result screen is shown unchanged.

**PSD-14 · Qase 2537 · Export image from the editor**
Steps: in the editor, open the actions menu, click Export Image, confirm.
Expected: one PNG download. **Corrected after the run**: the export comes back at the document's own size, so the case asserts the file, not the size. See known issue 8.

**PSD-15 · Qase 2536 · Export PDF from the editor**
Steps: in the editor, open the actions menu, click Export PDF, confirm.
Expected: one PDF, with one page per page of the imported scene (read from the engine in the test).

### 5.4 Unit tests

**PSD-U1 · Upload zone accepts only the listed extensions** (component)
Drop handler with `accept = ['.psd', '.psb']`: `a.psd` → forwarded. `a.PSD` → forwarded, matching is case-insensitive. `a.psb` → forwarded. `a.txt` → not forwarded. A file with no extension → not forwarded. An empty drop → not forwarded.
A file named `a.` and a dialog dismissed without a file are both ignored, and `dragover` keeps the zone highlighted. The picker handler had a second `if (!file) return;` after its own `files.length === 0` check; it was unreachable and was deleted.
The picker handler forwards any file the browser lets through, without checking the extension. Current behaviour; see known issue 2.

**PSD-U2 · Status messages and the processing flag** (component)
`idle` → empty message, not processing. `init`, `fetching`, `processing` → their message, processing. `done` → empty message, not processing. `error` → "Error: Failed to process PSD file", not processing.

**PSD-U3 · Import options passed to the engine**
`importPsdFile` with a mocked `@imgly/psd-importer` and a mocked `CreativeEngine`:
with a license and a base URL, both reach `CreativeEngine.init`. **Corrected after the run**: with neither, `init` still receives `baseURL: VITE_IMGLY_LOCAL_ASSETS_URL`, which is the kit's fallback. `previewWidth` and `previewHeight` default to 1000 and reach `block.export`. The parser's messages are returned. `engine.dispose()` runs on the success path.

**PSD-U4 · Import failure paths**
Parser throws → the error propagates and `engine.dispose()` still runs. The scene has no page → the error is "No pages found in PSD file" and `engine.dispose()` still runs.

**PSD-U5 · Reset and error state** (component)
Reset with a result in state: `URL.revokeObjectURL` is called once for the preview URL and once for the archive URL, and the status returns to `idle`.

The context's `processFile` with a rejecting import: `error` is set, then the outer catch sets the status back to `idle`, so `STATUS_MESSAGES.error` is never shown and `currentFile` stays set. The screen ends up blank. Current behaviour; see known issue 3.

An uploaded file whose import fails takes the same outer catch: the status returns to `idle` and the error is recorded. A rejection that is not an `Error` is wrapped as `Unknown error`.

**PSD-U6 · Download name and the result columns** (component)
`showcase-file-1.psd` → `showcase-file-1.imgly`. `A.PSD` → `A.imgly`. `noextension` → `noextension.imgly`. `a.psb` → `a.imgly` is written as the correct behaviour and marked `it.fails` (known issue 1). The screen also closes the editor when the editor asks it to, and falls back to "the file" when there is no current file to name.

**PSD-U7 · Badge grouping** (component)
Three messages, two of them identical → two rows, counts 2 and 1, nouns "occurrences" and "occurrence". An empty list → no badge. A click outside the popover closes it.

**PSD-U8 · Editor configuration**
`initPsdTemplateImportEditor` against a recording spy: the advanced editor config plugin plus the fifteen asset source plugins are added in order, the upload source is limited to `ly.img.image.upload`, the demo sources to `ly.img.image.*` and the premium templates to `ly.img.templates.premium.*`, and no other source is restricted. A third case hands `addPlugin` a promise the test controls and proves every asset source is in flight before the first one settles, which is what the kit's `Promise.all` buys over sequential awaits. A second block drives `AdvancedEditorConfig.initialize` and pins the view, the full feature list, the CE.SDK generation it declares right after the reset, the registered actions and the navigation bar order.

**PSD-U9 · Actions the kit registers**
`setupActions` against a recording editor: exactly `saveScene`, `exportDesign`, `exportScene`, `importScene` and `uploadFile` are registered, in that order, and every handler is then run. `saveScene` downloads the scene JSON as `text/plain;charset=UTF-8`. `exportDesign` forwards its options to `cesdk.utils.export` and downloads the first blob under the mime type the export **returned**, not the one asked for. `exportScene` writes `text/plain;charset=UTF-8` by default and `application/zip` for `format: 'archive'`. `importScene` opens one picker for `.imgly,.scene,.zip`, loads the object URL and revokes it, including when the load rejects, then refits the first page. `uploadFile` forwards the file and the context to `cesdk.utils.localUpload` and ignores the progress callback.

**PSD-U10 · The editor view hands the kit configuration to CE.SDK** (component)
`CreativeEditor` with `@cesdk/cesdk-js/react` and `src/imgly` mocked: the kit configuration and a full-size container reach the wrapper. Its `init` runs `initPsdTemplateImportEditor` before `cesdk.load(sceneArchiveUrl)`, then `zoom.toPage` with `autoFit`, inserts `ly.img.close.navigationBar` at the start of the navigation bar wired to `closeEditor`, and sets `window.cesdk`. With the shared `demo-preview/lifecycle` module mocked it also reports `created` before the init and `ready` after the scene is fitted, and hands the wrapper `reportDemoLoadingState`. `onError` closes the editor.

**PSD-U11 · The loading screen reports how long the import runs** (component)
Under fake timers: the step message is shown, the stopwatch starts at `0.00s` and reads `1.50s` after 1.5 s, a previous run time is shown beside it as `1.00s / 2.50s`, and the interval is cleared on unmount.

**PSD-U12 · The screen follows the import state** (component)
`App` with its real provider with a mocked importer: the selection screen first, the loading screen while the import is in flight, the result screen once it resolves.

**PSD-U13 · Both ways to pick a file reach the importer** (component)
Clicking an example fetches its URL and imports it under the example's name. A file dropped on the upload zone is imported without any fetch.

**PSD-U14 · The context outside its provider** (component)
`useFileProcessing` rendered without the provider throws, naming the provider the caller forgot to mount.

**PSD-U16 · The processing screen reports the previous run time** (component)
`FileProcessing` with the context hook mocked: while an import runs it shows the step message and only the current stopwatch on the first import, and `1.00s / 2.50s` once a previous run has been measured. The editor UI has no route to a second import — New File resets the timer — so the branch is reached through the context, not through a click.

**PSD-U17 · The entry point configures the editor and mounts the app** (component)
`src/index.tsx` with `react-dom/client` mocked: `editorConfig` is exactly `baseURL`, `userId` and `license` read from the environment, and the app is mounted into `#root` once.

**PSD-U18 · The demo lifecycle beacon** (component)
With the shared `demo-preview/lifecycle` module mocked: mounting `App` reports `shell` exactly once, which is the end of this demo's automatic load.

**PSD-U15 · The video timeline the kit ships is inert**
`setupVideoTimeline` against a recording spy makes no call. This kit imports still designs, and `setupUI` leaves the timeline commented out.

**KB-01 · unit · Keyboard catalog predicates**

`tests/unit/keyboard-catalog.test.ts` runs every `run` and `when` of `src/imgly/config/keyboard/catalogs/us-ansi.ts` against 1620 editor states (5 edit modes, 9 selections, 3 roles, features on and off, 3 vector states, page and no page) and asserts that none throws, that every shortcut activates in at least one state, and that every function `run` reaches `cesdk.actions.run`. Kit-owned: the kit decides which key does what and when it is live. The catalog measures 100 % lines, branches and functions.

## 6. Entry and exit criteria

Entry: engine and editor built; test license available; the shared kit test harness exists (boot helper, download helper, console and network guards); `@testing-library/react` and a jsdom environment are available for the React parts (open question 1).

Exit: every case in section 5 passes locally and in CI. `npm run ci` passes. The published kit contains no test files. A release run reports results to the Qase ids above.

## 7. Known issues found while writing this plan

Confirm each with a test before fixing.

1. **Fixed in 6b.** The archive download name strips only `.psd`, so a `.psb` upload becomes `name.psb.imgly`.
2. **Fixed** for the drop: the zone now says which extensions it takes, and the message clears once a file is accepted. The picker path filters through `accept`; a file the OS dialog lets through is still sent to the parser.
3. **Fixed in 6b.** A failed import is invisible. `processPSDBlob` sets the error state, the caller's `catch` immediately sets the status back to `idle`, and `currentFile` is left set, so the app shows nothing at all. The `error` status and its message are unreachable. The sibling PDF kit clears `currentFile` in the same place; this kit does not.
4. `importPsdFile` uses the deprecated `block.export(handle, mimeType, options)` signature. It will fail `check:lint` once the deprecation rule is non-vacuous.
5. `processPSDBlob` reads `editorConfig.license` but lists only `editorConfig.baseURL` in its dependency array.
6. `CreativeEditor` closes itself on any editor error and only logs it.
7. The upload zone's `<input id="file-input">` id is fixed, so two upload zones on one page would collide.
8. ~~The navigation bar's Export Images runs the kit's `exportImage` action.~~ It never did: `ly.img.exportImage.navigationBar` runs `exportDesign` with `{ mimeType: 'image/png' }` and no target size, so every export comes back at the document's own size. The 1080 x 1080 measured here is `showcase-file-3.psd`'s own size. The unreachable action was deleted.

## 8. Open questions

1. ~~React component tests need `@testing-library/react` and a jsdom environment.~~ Done: the harness exports both through `@imgly/kit-test-harness/component`.
2. Issues 2 and 3: fix in this wave or record as expected. Recommended: fix both. Issue 3 leaves the user on a blank screen.
3. ~~Whether PSD-08 should force a warning with a crafted file.~~ Answered by the run: no demo file warns, so PSD-08 asserts the clean state and PSD-U7 covers the badge.

## 9. Estimate

Measured: 15 browser cases in 1.5 minutes on one worker. An import takes 1 to 5 s, not the 20 to 40 s estimated. 22 unit and 34 component tests in under 2 s.

## 10. Boundary review

Rule used: the code that makes a decision owns the test for it. The kit decides which importer is used, which options are passed, how files are accepted, what the screens show and what the download is called. `@imgly/psd-importer` decides what a `.psd` file becomes. The engine decides what an export produces. The editor decides how panels, the navigation bar and the export dialog behave.

Core behaviour this plan leans on, and where it is covered today:

| Behaviour                                                | Owner                 | Covered by                                                                                                                     |
| -------------------------------------------------------- | --------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| A `.psd` file becomes the right blocks, text and colours | `@imgly/psd-importer` | `packages/psd-importer/src/test/regression.test.ts`, plus the unit tests under `src/lib/psd-parser/`                           |
| This kit's three demo files import correctly             | `@imgly/psd-importer` | partly: `showcase-file-1.psd` in the corpus is byte-identical to the kit's copy; `-2` and `-3` differ (see gap 1)              |
| The parser logger reports warnings and errors            | `@imgly/psd-importer` | `packages/psd-importer/src/test/regression.test.ts`                                                                            |
| `scene.saveToArchive` round-trips                        | engine                | `engine/lib/test/api/ArchivalDeepRoundTripAPITest.cpp`, `bindings/wasm/js_node/src/__tests__/archiveOrphanedResources.test.ts` |
| `block.export` produces a PNG at a target size           | engine                | `engine/lib/test/api/ExportAPITest.cpp`                                                                                        |
| `scene.load` from an archive URL                         | engine                | `engine/lib/test/api/ArchiveDiskRoundTripAPITest.cpp`                                                                          |
| `exportDesign` exports and downloads                     | editor                | `apps/cesdk_web/packages/cesdk/registerDefaultActions.test.ts`                                                                 |
| `insertOrderComponent` places the close button           | editor                | `apps/cesdk_web/packages/api/ui/UserInterfaceAPI.test.ts`                                                                      |
| `actions.run('zoom.toPage', { autoFit: true })`          | editor                | `apps/cesdk_web/packages/cesdk/registerDefaultActions.test.ts`                                                                 |

Core coverage gaps found (candidates for the core suites, not for this kit):

1. `@imgly/psd-importer`: `showcase-file-2.psd` and `showcase-file-3.psd` in `packages/psd-importer/src/test/examples/misc/` are not the files this kit ships, so two of the three demo imports have no regression baseline. Qase 4421 covers exactly those. Suggested fix: replace the corpus copies with the files from `packages/cesdk-web-examples-data/`, or add the kit's copies as their own fixtures.
2. Editor: builder `MediaPreview` and `Section` have no render test (shared with the other import kits and with the form kit). Suggested home: `apps/cesdk_web/packages/ui/builder/`.

Until gap 1 is closed, PSD-06 is the only check that the kit's own demo files import at all.

## 11. Coverage

`npm run ci` measures 100 % lines, branches and functions in the Vitest lane (`tests/coverage-thresholds.json`) and the same three figures in the merged report (`tests/coverage-thresholds.merged.json`).

The residue this section carried in version 6 is gone. `merge-coverage.mjs` now takes the line denominator from the Vitest statement map wherever Vitest measured a file, so the comment and blank lines of this kit's heavily commented `src/imgly/config/**` no longer enter the merged report, and it sums every browser dump instead of keeping the alphabetically last one.
