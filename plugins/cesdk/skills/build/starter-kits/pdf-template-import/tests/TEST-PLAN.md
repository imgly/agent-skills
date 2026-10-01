# Test plan: starterkit-pdf-template-import

Version 7, 7 Sep 2026. Status: implemented. 36 unit, 62 component, 1 headless and 15 browser cases run in `npm run ci`. The Vitest lane and the merged report both read 100 % lines, branches and functions; see section 11.

## 1. Purpose

Verify that the PDF Template Import starter kit works as shipped: a `.pdf` file picked, dropped or chosen from the examples is handed to `@imgly/pdf-importer`, the result is shown next to the original, and the imported scene opens in the editor and can be downloaded as an archive.

## 2. Scope

In scope

- File intake: the upload zone (picker and drag-and-drop), the accepted extension, the three example files
- The processing state machine in `src/app/FileProcessingContext/`: status, progress message, timing, error handling, reset
- The glue in `src/imgly/plugins/pdf-importer.ts`: which parser is used, which options are passed, what is returned, engine clean-up
- The result screen: side-by-side preview, warning and error badges, Edit, Download CE.SDK Archive, New File
- The editor configuration in `src/imgly/`

Out of scope

- What the importer produces from a `.pdf` file — vector paths, text, masks, blend modes. That is `@imgly/pdf-importer`'s decision, covered by `packages/pdf-importer/src/test/regression.test.ts` and the unit suite under `src/test/unit/`.
- Core editor features reached after Edit. Covered by the core editor suite.
- The demo site around the kit. Covered by the `cesdk_web_demos` suite. Qase 4694, 4695, 4696, 4697, 4712, 4721, 4733, 4734.

## 3. Test environment

- Browser: Chrome, headless, 1400 × 900
- Engine and editor: built from this repo, served locally. Requests to `cdn.img.ly` for engine assets fail the test.
- License: the shared test license (valid on hostname `localhost` only)
- Data: `postcard.pdf`, `poster.pdf`, `socialmedia.pdf` and the icons, served from the in-repo copy at `packages/cesdk-web-examples-data/data/starterkit-pdf-template-import/` via `VITE_DEMO_ASSETS_BASE_URL`. Never from the CDN.
- Google Fonts: the importer calls `addGfontsAssetLibrary`, which fetches from `staticimgly.com`. That host is allowed by the network guard; `cdn.img.ly` is not.
- Upload fixtures: `postcard.pdf` from the same directory, plus a 1 KB `not-a-pdf.txt` written by the test.
- Headless: `@cesdk/node` through the vitest alias, importing the kit's own demo file.
- Importer: `@imgly/pdf-importer` is now `workspace:*`, so the tests exercise the build this repository produces. Known issue 1 is fixed.
- Readiness hook: the kit has no editor until Edit is clicked. Wait for the upload zone for the first screens and for `window.cesdk` only inside the editor.
- Console allowlist: `Failed to process PDF file:` in PDF-08 only. Everywhere else the console must be clean.

## 4. Approach

| Kind      | Tool                                                             | What it checks                                              | Run                 |
| --------- | ---------------------------------------------------------------- | ----------------------------------------------------------- | ------------------- |
| Static    | tsc, eslint, convention check                                    | Types, deprecated APIs, kit folder shape                    | `npm run check:all` |
| Unit      | Vitest (node)                                                    | Import options, failure paths, editor configuration         | `npm run test:unit` |
| Component | Vitest + jsdom + RTL through `@imgly/kit-test-harness/component` | Upload filter, state machine, badge grouping, download name | `npm run test:unit` |
| Headless  | Vitest + `@cesdk/node`                                           | `importPdfFile` end to end without a browser                | `npm run test:unit` |
| Browser   | Playwright                                                       | The test cases in section 5                                 | `npm run test:e2e`  |

Browser cases reach the editor controls through the `Navigation Bar` landmark, because the editor's root region carries no label.

Confirmed by the run: `importPdfFile` runs under `@cesdk/node` through the package's `node` export condition. The test has to `delete globalThis.window` first, because the shared Vitest config stubs a bare `window` for the unit tests and the engine picks its browser code path from `typeof window`.

## 5. Test cases

Format: ID, Qase id, title. Then steps and expected result.

### 5.1 File selection screen

**PDF-01 · Qase 4726 · Nothing is pre-rendered on start-up**
Steps: open the kit.
Expected: the upload zone, the notice "Supports .pdf Format" and three example thumbnails. No preview, no editor, no engine started. No console errors. No engine asset from the CDN.

**PDF-02 · Qase 4727 · Upload a file through the picker**
Steps: set `postcard.pdf` on the file input.
Expected: the loading screen shows "Processing PDF file..." with a running stopwatch, then the result screen shows the imported preview. The original column shows "No Preview Available" for an uploaded file.

**PDF-03 · Qase 4728 · Open a pre-loaded example**
Steps: click the first example thumbnail.
Expected: "Loading PDF file..." then "Processing PDF file...", then the result screen with the original PNG preview on the left and the imported preview on the right.

**PDF-04 · Drag and drop a file** (no Qase case yet)
Steps: drop `postcard.pdf` on the upload zone.
Expected: the zone highlights while dragging and the file is processed as in PDF-02.

**PDF-05 · Drag and drop a rejected file type** (no Qase case yet)
Steps: drop `not-a-pdf.txt` on the upload zone.
Expected: nothing happens, with no message. Current behaviour; see known issue 2.

**PDF-06 · Qase 4743 · All three examples import**
Steps: for each example, click it, wait for the result, then click New File.
Expected: each produces a preview and an archive. Fidelity is not asserted here; see section 10, gap 1.

### 5.2 Result screen

**PDF-07 · Qase 4727, 4728 · Both files are shown side by side**
Steps: import an example.
Expected: two columns, headed "PDF File" and "Imported Result", each with a preview image, and buttons Edit and Download CE.SDK Archive.

**PDF-08 · Warnings and errors from the parser** (no Qase case yet)
Steps: import a file the parser warns about.
Expected: a warning badge and no error badge, and each row in the list ends with its occurrence count and the right singular or plural noun. `postcard.pdf` reports three text-overflow warnings, so this is the one kit of the four whose demo data exercises the badge.

**PDF-09 · The archive can be downloaded** (no Qase case yet)
Steps: click Download CE.SDK Archive.
Expected: one download named `postcard.imgly`. The sibling kits have a Qase case for this; the PDF suite does not.

**PDF-10 · Qase 4730 · New File returns to the start**
Steps: click New File.
Expected: the selection screen is shown and the previous result is gone. That the two object URLs are revoked is not observable from the browser; it is asserted in the unit case below.

### 5.3 Editor

**PDF-11 · Qase 4729 · The imported file opens in the editor**
Steps: click Edit.
Expected: the editor fills the screen with the imported scene loaded and zoomed to the page. A close button is the first item in the navigation bar. `window.cesdk` is set.

**PDF-12 · Qase 4729 · The editor can be closed**
Steps: click the close button.
Expected: the editor closes and the result screen is shown unchanged.

**PDF-13 · Qase 4711 · Export image from the editor**
Steps: in the editor, open the actions menu, click Export Image, confirm.
Expected: one PNG download. **Corrected after the run**: Export Images exports the scene once, not once per page, and it comes back at the page's own size, so the case asserts the file, not the size.

**PDF-14 · Qase 4710 · Export PDF from the editor**
Steps: in the editor, open the actions menu, click Export PDF, confirm.
Expected: one PDF, with one page per page of the imported scene (read from the engine in the test).

### 5.4 Unit tests

**PDF-U1 · Upload zone accepts only the listed extension**
Drop handler with `accept = ['.pdf']`: `a.pdf` → forwarded. `a.PDF` → forwarded, matching is case-insensitive. `a.txt` → not forwarded. A file with no extension → not forwarded. An empty drop → not forwarded.
A file named `a.` and a dialog dismissed without a file are both ignored, and `dragover` keeps the zone highlighted. The picker handler had a second `if (!file) return;` after its own `files.length === 0` check; it was unreachable and was deleted.
The picker handler forwards any file the browser lets through, without checking the extension. Current behaviour; see known issue 2.

**PDF-U2 · Status messages and the processing flag**
`idle` → empty message, not processing. `init`, `fetching`, `processing` → their message, processing. `done` → empty message, not processing. `error` → "Error: Failed to process PDF file", not processing.

**PDF-U3 · Import options passed to the engine**
`importPdfFile` with a mocked `@imgly/pdf-importer` and a mocked `CreativeEngine`: license and base URL reach `CreativeEngine.init` when given and are absent when not; with neither, `init` is called with an empty object, so the engine falls back to the IMG.LY CDN — the sibling kits pass the local asset URL as a default and this one does not (known issue 3). `previewWidth` and `previewHeight` default to 1000 and reach `block.export` as `{ mimeType: 'image/png', targetWidth, targetHeight }`. The parser's messages are returned. `engine.dispose()` runs.

**PDF-U4 · Import failure paths**
Parser throws → the error propagates and `engine.dispose()` still runs. The scene has no page → the error is "No pages found in PDF file" and `engine.dispose()` still runs.

**PDF-U5 · Reset and error state**
Reset with a result in state: `URL.revokeObjectURL` is called once for the preview URL and once for the archive URL, and the status returns to `idle`.

`processFile` with a rejecting import: `error` is set, then the outer catch sets the status back to `idle` and clears `currentFile`, so the user is returned to the selection screen with no message and the error state is unreachable. Current behaviour; see known issue 4.

An uploaded file whose import fails takes the same outer catch: the status returns to `idle` and the error is recorded. A rejection that is not an `Error` is wrapped as `Unknown error`.

**PDF-U6 · Download name and the result columns**
`postcard.pdf` → `postcard.imgly`. `A.PDF` → `A.imgly`. `noextension` → `noextension.imgly`. The screen also closes the editor when the editor asks it to, and falls back to "the file" when there is no current file to name.

**PDF-U7 · Badge grouping**
Three messages, two of them identical → two rows, counts 2 and 1, nouns "occurrences" and "occurrence". An empty list → no badge. A click outside the popover closes it.

**PDF-U8 · Editor configuration**
`initPdfTemplateImportEditor` against a recording spy: the advanced editor config plugin plus thirteen asset source plugins are added in order, with the upload source limited to `ly.img.image.upload` and the demo sources to `ly.img.templates.*` plus `ly.img.image.*`. **Corrected after the run**: this kit adds neither `ImageColorsAssetSource` nor `PremiumTemplatesAssetSource`. A third case hands `addPlugin` a promise the test controls and proves every asset source is in flight before the first one settles, which is what the kit's `Promise.all` buys over sequential awaits. A second block drives `AdvancedEditorConfig.initialize` and pins the view, the full feature list, the CE.SDK generation it declares right after the reset, the registered actions and the navigation bar order.

### 5.5 Headless test

**PDF-H1 · A real import without a browser**
`importPdfFile` against a real `@cesdk/node` engine with the kit's own `postcard.pdf`.
Expected: a PNG preview, a ZIP archive, the parser's messages and the file name unchanged. **Corrected after the run**: 1000 × 1000 is the box the kit asks for and the engine keeps the page aspect ratio inside it, so one side comes back at 1000. Page fidelity is not asserted; that belongs to the importer suite.

**PDF-U9 · Actions the kit registers**
`setupActions` against a recording editor: exactly `saveScene`, `exportDesign`, `exportScene`, `importScene` and `uploadFile` are registered, in that order, and every handler is then run. `saveScene` downloads the scene JSON as `text/plain;charset=UTF-8`. `exportDesign` forwards its options to `cesdk.utils.export` and downloads the first blob under the mime type the export **returned**, not the one asked for. `exportScene` writes `text/plain;charset=UTF-8` by default and `application/zip` for `format: 'archive'`. `importScene` opens one picker for `.imgly,.scene,.zip`, loads the object URL and revokes it, including when the load rejects, then refits the first page. `uploadFile` forwards the file and the context to `cesdk.utils.localUpload` and ignores the progress callback.

**PDF-U10 · The editor view hands the kit configuration to CE.SDK** (component)
`CreativeEditor` with `@cesdk/cesdk-js/react` and `src/imgly` mocked: the kit configuration and a full-size container reach the wrapper. Its `init` runs `initPdfTemplateImportEditor` before `cesdk.load(sceneArchiveUrl)`, then `zoom.toPage` with `autoFit`, inserts `ly.img.close.navigationBar` at the start of the navigation bar wired to `closeEditor`, and sets `window.cesdk`. With the shared `demo-preview/lifecycle` module mocked it also reports `created` before the init and `ready` after the scene is fitted, and hands the wrapper `reportDemoLoadingState`. `onError` closes the editor.

**PDF-U11 · The loading screen reports how long the import runs** (component)
Under fake timers: the step message is shown, the stopwatch starts at `0.00s` and reads `1.50s` after 1.5 s, a previous run time is shown beside it as `1.00s / 2.50s`, and the interval is cleared on unmount.

**PDF-U12 · The screen follows the import state** (component)
`App` with its real provider with a mocked importer: the selection screen first, the loading screen while the import is in flight, the result screen once it resolves.

**PDF-U13 · Both ways to pick a file reach the importer** (component)
Clicking an example fetches its URL and imports it under the example's name. A file dropped on the upload zone is imported without any fetch.

**PDF-U14 · The context outside its provider** (component)
`useFileProcessing` rendered without the provider throws, naming the provider the caller forgot to mount.

**PDF-U16 · The processing screen reports the previous run time** (component)
`FileProcessing` with the context hook mocked: while an import runs it shows the step message and only the current stopwatch on the first import, and `1.00s / 2.50s` once a previous run has been measured. The editor UI has no route to a second import — New File resets the timer — so the branch is reached through the context, not through a click.

**PDF-U17 · The entry point configures the editor and mounts the app** (component)
`src/index.tsx` with `react-dom/client` mocked: `editorConfig` is exactly `baseURL`, `userId` and `license` read from the environment, and the app is mounted into `#root` once.

**PDF-U18 · The demo lifecycle beacon** (component)
With the shared `demo-preview/lifecycle` module mocked: mounting `App` reports `shell` exactly once, which is the end of this demo's automatic load.

**PDF-U15 · The video timeline the kit ships is inert**
`setupVideoTimeline` against a recording spy makes no call. This kit imports still designs, and `setupUI` leaves the timeline commented out.

**KB-01 · unit · Keyboard catalog predicates**

`tests/unit/keyboard-catalog.test.ts` runs every `run` and `when` of `src/imgly/config/keyboard/catalogs/us-ansi.ts` against 1620 editor states (5 edit modes, 9 selections, 3 roles, features on and off, 3 vector states, page and no page) and asserts that none throws, that every shortcut activates in at least one state, and that every function `run` reaches `cesdk.actions.run`. Kit-owned: the kit decides which key does what and when it is live. The catalog measures 100 % lines, branches and functions.

## 6. Entry and exit criteria

Entry: engine and editor built; test license available; the shared kit test harness exists (boot helper, download helper, console and network guards); `@testing-library/react` and a jsdom environment are available for the React parts (open question 1).

Exit: every case in section 5 passes locally and in CI. `npm run ci` passes. The published kit contains no test files. A release run reports results to the Qase ids above.

## 7. Known issues found while writing this plan

Confirm each with a test before fixing.

1. This is the only import kit that does not depend on the workspace importer. `package.json` pins `"@imgly/pdf-importer": "0.2.0"` while the workspace package is at 0.2.4, so `pnpm-lock.yaml` resolves it from npm. The kit is not testing the importer this repo builds, and an importer fix does not reach it.
2. **Fixed.** A rejected drop gave no message; the zone now says which extensions it takes, and the message clears once a file is accepted. The picker path filters through `accept`.
3. **Fixed in 6b.** `importPdfFile` does not default `baseURL` to the local asset URL the way the PSD, PPTX and IDML kits do. With an empty `VITE_IMGLY_LOCAL_ASSETS_URL` the import engine loads its assets from the IMG.LY CDN.
4. **Fixed in 6b.** A failed import returns to the selection screen with no message. `processPDFBlob` sets the error state and the caller's `catch` immediately sets the status back to `idle`, so the `error` status and its message are unreachable.
5. `processPDFBlob` reads `editorConfig.license` but lists only `editorConfig.baseURL` in its dependency array.
6. `CreativeEditor` closes itself on any editor error and only logs it.
7. The upload zone's `<input id="file-input">` id is fixed, so two upload zones on one page would collide.
8. ~~The navigation bar's Export Images runs the kit's `exportImage` action.~~ It never did: `ly.img.exportImage.navigationBar` runs `exportDesign` with `{ mimeType: 'image/png' }` and no target size, so every export comes back at the page's own size. The unreachable action was deleted.
9. This kit registers neither `ImageColorsAssetSource` nor `PremiumTemplatesAssetSource`, unlike the Photoshop and InDesign kits.

**Fixed**: issue 1 — `package.json` now depends on `@imgly/pdf-importer: workspace:*`, so the kit and `packages/pdf-importer` share one build.

## 8. Open questions

1. ~~React component tests need `@testing-library/react` and a jsdom environment.~~ Done: the harness exports both through `@imgly/kit-test-harness/component`.
2. ~~Issue 1: switch the kit to `workspace:*`.~~ Done, per the P6 resolution. Flagged to Elia in the batch report: `pnpm install` has to run before the lockfile matches.
3. Issues 2, 3 and 4: fix in this wave or record as expected. Recommended: fix all three; the four import kits should behave the same.

## 9. Estimate

Measured: 15 browser cases (14 plan cases plus the expected-failure PDF-05b) in 2 minutes on one worker. An import takes 5 to 15 s, not the 20 to 40 s estimated. Headless case: 3 s. Unit and component tests: under 2 s.

## 10. Boundary review

Rule used: the code that makes a decision owns the test for it. The kit decides which importer is used, which options are passed, how files are accepted, what the screens show and what the download is called. `@imgly/pdf-importer` decides what a `.pdf` file becomes. The engine decides what an export produces. The editor decides how panels, the navigation bar and the export dialog behave.

Core behaviour this plan leans on, and where it is covered today:

| Behaviour                                             | Owner                 | Covered by                                                                                                                 |
| ----------------------------------------------------- | --------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| A `.pdf` file becomes the right paths, text and masks | `@imgly/pdf-importer` | `packages/pdf-importer/src/test/regression.test.ts`, `structural.test.ts`, plus about 20 unit tests under `src/test/unit/` |
| This kit's three demo files import correctly          | `@imgly/pdf-importer` | partly: `postcard.pdf` is in the corpus byte for byte; `poster.pdf` and `socialmedia.pdf` are not (see gap 1)              |
| The parser logger reports warnings and errors         | `@imgly/pdf-importer` | `packages/pdf-importer/src/test/regression.test.ts`                                                                        |
| `scene.saveToArchive` round-trips                     | engine                | `engine/lib/test/api/ArchivalDeepRoundTripAPITest.cpp`                                                                     |
| `block.export` produces a PNG at a target size        | engine                | `engine/lib/test/api/ExportAPITest.cpp`                                                                                    |
| `scene.load` from an archive URL                      | engine                | `engine/lib/test/api/ArchiveDiskRoundTripAPITest.cpp`                                                                      |
| `exportDesign` exports and downloads                  | editor                | `apps/cesdk_web/packages/cesdk/registerDefaultActions.test.ts`                                                             |
| `insertOrderComponent` places the close button        | editor                | `apps/cesdk_web/packages/api/ui/UserInterfaceAPI.test.ts`                                                                  |

Core coverage gaps found (candidates for the core suites, not for this kit):

1. `@imgly/pdf-importer`: `poster.pdf` and `socialmedia.pdf` are shipped as kit demo files but are not in `packages/pdf-importer/src/test/examples/`, so two of the three demo imports have no regression baseline. Qase 4743 covers exactly those. Suggested fix: add both from `packages/cesdk-web-examples-data/` as showcase fixtures.
2. Editor: `exportDesign` is covered only as "export and downloadFile were called". Which mime type each navigation-bar export button asks for is untested. PDF-13 and PDF-14 lean on it. Suggested home: `apps/cesdk_web/packages/cesdk/registerDefaultActions.test.ts`.
3. Editor: builder `MediaPreview` and `Section` have no render test (shared with the other import kits). Suggested home: `apps/cesdk_web/packages/ui/builder/`.

Until gap 1 is closed, PDF-06 is the only check that two of the kit's demo files import at all.

## 11. Coverage

`npm run ci` measures 100 % lines, branches and functions in the Vitest lane (`tests/coverage-thresholds.json`) and the same three figures in the merged report (`tests/coverage-thresholds.merged.json`).

The residue this section carried in version 6 is gone. `merge-coverage.mjs` now takes the line denominator from the Vitest statement map wherever Vitest measured a file, so the comment and blank lines of this kit's heavily commented `src/imgly/config/**` no longer enter the merged report, and it sums every browser dump instead of keeping the alphabetically last one.
