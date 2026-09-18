# Test plan: starterkit-indesign-template-import

Version 7, 7 Sep 2026. Status: implemented. 37 unit, 62 component and 15 browser cases run in `npm run ci`. The Vitest lane and the merged report both read 100 % lines, branches and functions; see section 11.

## 1. Purpose

Verify that the InDesign Template Import starter kit works as shipped: an `.idml` file picked, dropped or chosen from the examples is handed to `@imgly/idml-importer` with the embedded PDF importer registered, the result is shown next to the original, and the imported scene opens in the editor and can be downloaded as an archive.

## 2. Scope

In scope

- File intake: the upload zone (picker and drag-and-drop), the accepted extension, the three example files
- The processing state machine in `src/app/FileProcessingContext/`: status, progress message, timing, error handling, reset
- The glue in `src/imgly/plugins/idml-importer.ts`: the XML parser it supplies, the embedded PDF importer it registers, which options are passed, what is returned, engine clean-up
- The result screen: side-by-side preview, warning and error badges, Edit, Download CE.SDK Archive, New File
- The editor configuration in `src/imgly/`

Out of scope

- What the importer produces from an `.idml` file — text frames, leading, colours, embedded PDF and `.ai` content. That is `@imgly/idml-importer`'s decision, covered by `packages/idml-importer/src/test/regression.test.ts` and the unit suite under `src/lib/idml-parser/`, against a corpus that contains all three of this kit's demo files byte for byte.
- Core editor features reached after Edit. Covered by the core editor suite.
- The demo site around the kit. Covered by the `cesdk_web_demos` suite. Qase 1745, 1746, 1747, 1748, 1763, 1772, 2457, 4234.

## 3. Test environment

- Browser: Chrome, headless, 1400 × 900
- Engine and editor: built from this repo, served locally. Requests to `cdn.img.ly` for engine assets fail the test.
- License: the shared test license (valid on hostname `localhost` only)
- Data: `postcard.idml`, `poster.idml`, `socialmedia.idml` and the icons, served from the in-repo copy at `packages/cesdk-web-examples-data/data/starterkit-indesign-template-import/` via `VITE_DEMO_ASSETS_BASE_URL`. Never from the CDN.
- Google Fonts: the importer calls `addGfontsAssetLibrary`, which fetches from `staticimgly.com`. That host is allowed by the network guard; `cdn.img.ly` is not.
- Upload fixtures: `socialmedia.idml` from the same directory, plus a 1 KB `not-an-idml.txt` written by the test.
- Readiness hook: the kit has no editor until Edit is clicked. Wait for the upload zone for the first screens and for `window.cesdk` only inside the editor.
- Console allowlist: `Failed to process IDML file:` in IDML-08 only. Everywhere else the console must be clean.

## 4. Approach

| Kind      | Tool                                                             | What it checks                                              | Run                 |
| --------- | ---------------------------------------------------------------- | ----------------------------------------------------------- | ------------------- |
| Static    | tsc, eslint, convention check                                    | Types, deprecated APIs, kit folder shape                    | `npm run check:all` |
| Unit      | Vitest (node)                                                    | Import options, failure paths, editor configuration         | `npm run test:unit` |
| Component | Vitest + jsdom + RTL through `@imgly/kit-test-harness/component` | Upload filter, state machine, badge grouping, download name | `npm run test:unit` |
| Browser   | Playwright                                                       | The test cases in section 5                                 | `npm run test:e2e`  |

Browser cases reach the editor controls through the `Navigation Bar` landmark, because the editor's root region carries no label.

No headless case. `importIdmlFile` builds its XML parser from the browser `DOMParser`, so the import cannot run under `@cesdk/node`.

## 5. Test cases

Format: ID, Qase id, title. Then steps and expected result.

### 5.1 File selection screen

**IDML-01 · Qase 1777 · Nothing is pre-rendered on start-up**
Steps: open the kit.
Expected: the upload zone, the notice "Supports .idml Format" and three example thumbnails. No preview, no editor, no engine started. No console errors. No engine asset from the CDN.

**IDML-02 · Qase 1778 · Upload a file through the picker**
Steps: set `socialmedia.idml` on the file input.
Expected: the loading screen shows "Processing IDML file..." with a running stopwatch, then the result screen shows the imported preview. The original column shows "No Preview Available" for an uploaded file.

**IDML-03 · Qase 1779 · Open a pre-loaded example**
Steps: click the first example thumbnail.
Expected: "Loading IDML file..." then "Processing IDML file...", then the result screen with the original PNG preview on the left and the imported preview on the right.

**IDML-04 · Drag and drop a file** (no Qase case yet)
Steps: drop `socialmedia.idml` on the upload zone.
Expected: the zone highlights while dragging and the file is processed as in IDML-02.

**IDML-05 · Drag and drop a rejected file type** (no Qase case yet)
Steps: drop `not-an-idml.txt` on the upload zone.
Expected: nothing happens, with no message. Current behaviour; see known issue 1.

**IDML-06 · Qase 4419 · All three examples import**
Steps: for each example, click it, wait for the result, then click New File.
Expected: each produces a preview and an archive. Fidelity is not asserted here; that is the importer suite's job.

### 5.2 Result screen

**IDML-07 · Qase 1778, 1779 · Both files are shown side by side**
Steps: import an example.
Expected: two columns, headed "InDesign File" and "Imported Result", each with a preview image, and buttons Edit and Download CE.SDK Archive.

**IDML-08 · Warnings and errors from the parser** (no Qase case yet)
Steps: import a file the parser warns about.
Expected: no warning and no error badge. **Corrected after the run**: none of the three demo files makes the parser report anything, so the badge itself is covered by the component case IDML-U7 and this browser case asserts the clean state.

**IDML-09 · Qase 1815 · The archive can be downloaded**
Steps: click Download CE.SDK Archive.
Expected: one download named `socialmedia.imgly`.

**IDML-10 · Qase 1813 · New File returns to the start**
Steps: click New File.
Expected: the selection screen is shown and the previous result is gone. That the two object URLs are revoked is not observable from the browser; it is asserted in the unit case below.

### 5.3 Editor

**IDML-11 · Qase 1780 · The imported file opens in the editor**
Steps: click Edit.
Expected: the editor fills the screen with the imported scene loaded and zoomed to the page. A close button is the first item in the navigation bar. `window.cesdk` is set.

**IDML-12 · Qase 1780 · The editor can be closed**
Steps: click the close button.
Expected: the editor closes and the result screen is shown unchanged.

**IDML-13 · Qase 1762 · Export image from the editor**
Steps: in the editor, open the actions menu, click Export Image, confirm.
Expected: one PNG download. **Corrected after the run**: Export Images exports the scene once, not once per page, and it comes back at the page's own size (420 x 298 for `postcard.idml`).

**IDML-14 · Qase 1761 · Export PDF from the editor**
Steps: in the editor, open the actions menu, click Export PDF, confirm.
Expected: one PDF, with one page per page of the imported scene (read from the engine in the test).

### 5.4 Unit tests

**IDML-U1 · Upload zone accepts only the listed extension**
Drop handler with `accept = ['.idml']`: `a.idml` → forwarded. `a.IDML` → forwarded, matching is case-insensitive. `a.indd` → not forwarded. `a.txt` → not forwarded. A file with no extension → not forwarded. An empty drop → not forwarded.
A file named `a.` and a dialog dismissed without a file are both ignored, and `dragover` keeps the zone highlighted. The picker handler had a second `if (!file) return;` after its own `files.length === 0` check; it was unreachable and was deleted.
The picker handler forwards any file the browser lets through, without checking the extension. Current behaviour; see known issue 1.

**IDML-U2 · Status messages and the processing flag**
`idle` → empty message, not processing. `init`, `fetching`, `processing` → their message, processing. `done` → empty message, not processing. `error` → "Error: Failed to process IDML file", not processing.

**IDML-U3 · Import options passed to the parser and the engine**
`importIdmlFile` with a mocked `@imgly/idml-importer`, a mocked `@imgly/pdf-importer` and a mocked `CreativeEngine`:
`IDMLParser.fromFile` receives the Blob unchanged, not an ArrayBuffer; it receives an XML parser function that turns a string into an XML document; and its `embeddedImporters` holds exactly one entry, built from `PDFParser`. License and base URL reach `CreativeEngine.init` when given. **Corrected after the run**: with neither, `init` still receives `baseURL: VITE_IMGLY_LOCAL_ASSETS_URL`, which is the kit's fallback. The XML parser is asserted through a `DOMParser` stub, because `DOMParser` is a browser API. `previewWidth` and `previewHeight` default to 1000 and reach `block.export`. The parser's messages are returned. `engine.dispose()` runs.

**IDML-U4 · Import failure paths**
Parser throws → the error propagates and `engine.dispose()` still runs. The scene has no page → the error is "No pages found in IDML file" and `engine.dispose()` still runs.

**IDML-U5 · Reset and error state**
Reset with a result in state: `URL.revokeObjectURL` is called once for the preview URL and once for the archive URL, and the status returns to `idle`.

`processFile` with a rejecting import: `error` is set, then the outer catch sets the status back to `idle`, so the error message is never shown and `currentFile` stays set. The screen ends up blank. Current behaviour; see known issue 2.

An uploaded file whose import fails takes the same outer catch: the status returns to `idle` and the error is recorded. A rejection that is not an `Error` is wrapped as `Unknown error`.

**IDML-U6 · Download name and the result columns**
`socialmedia.idml` → `socialmedia.imgly`. `A.IDML` → `A.imgly`. `noextension` → `noextension.imgly`. The screen also closes the editor when the editor asks it to, and falls back to "the file" when there is no current file to name.

**IDML-U7 · Badge grouping**
Three messages, two of them identical → two rows, counts 2 and 1, nouns "occurrences" and "occurrence". An empty list → no badge. A click outside the popover closes it.

**IDML-U8 · Editor configuration**
`initInDesignTemplateImportEditor` against a recording spy: the advanced editor config plugin plus the fifteen asset source plugins are added in order, with the upload source limited to `ly.img.image.upload`, the demo sources to `ly.img.image.*` and the premium templates to `ly.img.templates.premium.*`, and no other source restricted. A third case hands `addPlugin` a promise the test controls and proves every asset source is in flight before the first one settles, which is what the kit's `Promise.all` buys over sequential awaits. A second block drives `AdvancedEditorConfig.initialize` and pins the view, the full feature list, the CE.SDK generation it declares right after the reset, the registered actions and the navigation bar order.

**IDML-U9 · Actions the kit registers**
`setupActions` against a recording editor: exactly `saveScene`, `exportDesign`, `exportScene`, `importScene` and `uploadFile` are registered, in that order, and every handler is then run. `saveScene` downloads the scene JSON as `text/plain;charset=UTF-8`. `exportDesign` forwards its options to `cesdk.utils.export` and downloads the first blob under the mime type the export **returned**, not the one asked for. `exportScene` writes `text/plain;charset=UTF-8` by default and `application/zip` for `format: 'archive'`. `importScene` opens one picker for `.imgly,.scene,.zip`, loads the object URL and revokes it, including when the load rejects, then refits the first page. `uploadFile` forwards the file and the context to `cesdk.utils.localUpload` and ignores the progress callback.

**IDML-U10 · The editor view hands the kit configuration to CE.SDK** (component)
`CreativeEditor` with `@cesdk/cesdk-js/react` and `src/imgly` mocked: the kit configuration and a full-size container reach the wrapper. Its `init` runs `initInDesignTemplateImportEditor` before `cesdk.load(sceneArchiveUrl)`, then `zoom.toPage` with `autoFit`, inserts `ly.img.close.navigationBar` at the start of the navigation bar wired to `closeEditor`, and sets `window.cesdk`. With the shared `demo-preview/lifecycle` module mocked it also reports `created` before the init and `ready` after the scene is fitted, and hands the wrapper `reportDemoLoadingState`. `onError` closes the editor.

**IDML-U11 · The loading screen reports how long the import runs** (component)
Under fake timers: the step message is shown, the stopwatch starts at `0.00s` and reads `1.50s` after 1.5 s, a previous run time is shown beside it as `1.00s / 2.50s`, and the interval is cleared on unmount.

**IDML-U12 · The screen follows the import state** (component)
`App` with its real provider with a mocked importer: the selection screen first, the loading screen while the import is in flight, the result screen once it resolves.

**IDML-U13 · Both ways to pick a file reach the importer** (component)
Clicking an example fetches its URL and imports it under the example's name. A file dropped on the upload zone is imported without any fetch.

**IDML-U14 · The context outside its provider** (component)
`useFileProcessing` rendered without the provider throws, naming the provider the caller forgot to mount.

**IDML-U16 · The processing screen reports the previous run time** (component)
`FileProcessing` with the context hook mocked: while an import runs it shows the step message and only the current stopwatch on the first import, and `1.00s / 2.50s` once a previous run has been measured. The editor UI has no route to a second import — New File resets the timer — so the branch is reached through the context, not through a click.

**IDML-U17 · The entry point configures the editor and mounts the app** (component)
`src/index.tsx` with `react-dom/client` mocked: `editorConfig` is exactly `baseURL`, `userId` and `license` read from the environment, and the app is mounted into `#root` once.

**IDML-U18 · The demo lifecycle beacon** (component)
With the shared `demo-preview/lifecycle` module mocked: mounting `App` reports `shell` exactly once, which is the end of this demo's automatic load.

**IDML-U15 · The video timeline the kit ships is inert**
`setupVideoTimeline` against a recording spy makes no call. This kit imports still designs, and `setupUI` leaves the timeline commented out.

**KB-01 · unit · Keyboard catalog predicates**

`tests/unit/keyboard-catalog.test.ts` runs every `run` and `when` of `src/imgly/config/keyboard/catalogs/us-ansi.ts` against 1620 editor states (5 edit modes, 9 selections, 3 roles, features on and off, 3 vector states, page and no page) and asserts that none throws, that every shortcut activates in at least one state, and that every function `run` reaches `cesdk.actions.run`. Kit-owned: the kit decides which key does what and when it is live. The catalog measures 100 % lines, branches and functions.

## 6. Entry and exit criteria

Entry: engine and editor built; test license available; the shared kit test harness exists (boot helper, download helper, console and network guards); `@testing-library/react` and a jsdom environment are available for the React parts (open question 1).

Exit: every case in section 5 passes locally and in CI. `npm run ci` passes. The published kit contains no test files. A release run reports results to the Qase ids above.

## 7. Known issues found while writing this plan

Confirm each with a test before fixing.

1. **Fixed.** A rejected drop gave no message; the zone now says which extensions it takes, and the message clears once a file is accepted. The picker path filters through `accept`.
2. **Fixed in 6b.** A failed import is invisible. `processIDMLBlob` sets the error state, the caller's `catch` immediately sets the status back to `idle`, and `currentFile` is left set, so the app shows nothing. The `error` status and its message are unreachable. The sibling PDF kit clears `currentFile` in the same place; this kit does not.
3. `importIdmlFile` uses the deprecated `block.export(handle, mimeType, options)` signature. It will fail `check:lint` once the deprecation rule is non-vacuous. The PPTX and PDF kits already use the current signature.
4. This kit depends on `@imgly/pdf-importer` as `workspace:*` while the PDF kit pins the published `0.2.0`, so the two kits embed different builds of the same importer.
5. `processIDMLBlob` reads `editorConfig.license` but lists only `editorConfig.baseURL` in its dependency array.
6. `CreativeEditor` closes itself on any editor error and only logs it.
7. The upload zone's `<input id="file-input">` id is fixed, so two upload zones on one page would collide.
8. ~~The navigation bar's Export Images runs the kit's `exportImage` action.~~ It never did: `ly.img.exportImage.navigationBar` runs `exportDesign` with `{ mimeType: 'image/png' }` and no target size, so every export comes back at the page's own size. The unreachable action was deleted.
9. `@imgly/idml-importer`'s embedded-importer slice expects the parser's messages to carry `severity`, while every importer's `Logger` emits `type`, so `sourceSeverity` was `undefined` for every forwarded PDF message. Found while building the packages; fixed in `packages/idml-importer` (see the batch report).

## 8. Open questions

1. ~~React component tests need `@testing-library/react` and a jsdom environment.~~ Done: the harness exports both through `@imgly/kit-test-harness/component`.
2. Issues 1, 2 and 3: fix in this wave or record as expected. Recommended: fix all three. Issue 3 breaks the static gate.
3. ~~Whether IDML-08 should force a warning.~~ Answered by the run: no demo file warns, so IDML-08 asserts the clean state and IDML-U7 covers the badge.

## 9. Estimate

Measured: 15 browser cases (14 plan cases plus the expected-failure IDML-05b) in 1.5 minutes on one worker. An import takes 2 to 4 s, not the 20 to 40 s estimated. Unit and component tests: under 2 s.

## 10. Boundary review

Rule used: the code that makes a decision owns the test for it. The kit decides which importer is used, which XML parser and embedded importers it supplies, how files are accepted, what the screens show and what the download is called. `@imgly/idml-importer` decides what an `.idml` file becomes. The engine decides what an export produces. The editor decides how panels, the navigation bar and the export dialog behave.

Core behaviour this plan leans on, and where it is covered today:

| Behaviour                                                  | Owner                  | Covered by                                                                                                |
| ---------------------------------------------------------- | ---------------------- | --------------------------------------------------------------------------------------------------------- |
| An `.idml` file becomes the right frames, text and colours | `@imgly/idml-importer` | `packages/idml-importer/src/test/regression.test.ts` plus the unit tests under `src/lib/idml-parser/`     |
| Embedded PDF and `.ai` content imports as editable blocks  | `@imgly/idml-importer` | `packages/idml-importer/src/lib/idml-parser/embedded-importers/pdf.test.ts`, `embedded-placement.test.ts` |
| This kit's three demo files import correctly               | `@imgly/idml-importer` | yes: `postcard`, `poster` and `socialmedia` in the corpus are byte-identical to the kit's copies          |
| The parser logger reports warnings and errors              | `@imgly/idml-importer` | `packages/idml-importer/src/test/regression.test.ts`                                                      |
| `scene.saveToArchive` round-trips                          | engine                 | `engine/lib/test/api/ArchivalDeepRoundTripAPITest.cpp`                                                    |
| `block.export` produces a PNG at a target size             | engine                 | `engine/lib/test/api/ExportAPITest.cpp`                                                                   |
| `scene.load` from an archive URL                           | engine                 | `engine/lib/test/api/ArchiveDiskRoundTripAPITest.cpp`                                                     |
| `exportDesign` exports and downloads                       | editor                 | `apps/cesdk_web/packages/cesdk/registerDefaultActions.test.ts`                                            |
| `insertOrderComponent` places the close button             | editor                 | `apps/cesdk_web/packages/api/ui/UserInterfaceAPI.test.ts`                                                 |

Core coverage gaps found (candidates for the core suites, not for this kit):

1. Editor: `exportDesign` is covered only as "export and downloadFile were called". Which mime type each navigation-bar export button asks for is untested. IDML-13 and IDML-14 lean on it. Suggested home: `apps/cesdk_web/packages/cesdk/registerDefaultActions.test.ts`.
2. Editor: builder `MediaPreview` and `Section` have no render test (shared with the other import kits). Suggested home: `apps/cesdk_web/packages/ui/builder/`.

## 11. Coverage

`npm run ci` measures 100 % lines, branches and functions in the Vitest lane (`tests/coverage-thresholds.json`) and the same three figures in the merged report (`tests/coverage-thresholds.merged.json`).

The residue this section carried in version 6 is gone. `merge-coverage.mjs` now takes the line denominator from the Vitest statement map wherever Vitest measured a file, so the comment and blank lines of this kit's heavily commented `src/imgly/config/**` no longer enter the merged report, and it sums every browser dump instead of keeping the alphabetically last one.
