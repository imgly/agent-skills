# Test plan: starterkit-print-ready-pdf-editor

Version 6, 21 Sep 2026. Status: implemented. 104 Vitest cases (unit and headless) and 11 browser cases run in `KIT_TEST_COVERAGE=1 npm run ci`. Merged coverage is lines 100 %, branches 100 %, functions 100 %.

## 1. Purpose

Verify that the Print-Ready PDF starter kit works as shipped: the Export button opens the kit's own panel, the panel's defaults are the ones the README promises, and each setting reaches `engine.block.export` and `convertToPDFX` as the user chose it.

## 2. Scope

In scope

- The `ExportPrintReadyPDFPanelPlugin`: its navigation-bar button, its panel, the five state values and their defaults, and the panel's own translations
- The export function: page-range parsing, bleed-margin application, hiding pages outside the range, the PDF export call, the options it hands `convertToPDFX`, and the download
- The navigation-bar order that replaces the actions dropdown with the kit's Export button
- Feature and engine-setting configuration under `src/imgly/config/`
- Editor start-up with `public/assets/example-1.scene`
- The kit's own code under `src/imgly/` and `src/index.ts`

Out of scope

- PDF/X conversion itself — Ghostscript, ICC embedding, XMP metadata, transparency handling and conformance. `@imgly/plugin-print-ready-pdfs-web` decides those and covers them; see section 10.
- Core editor features reached through this kit (text, images, shapes, templates, multi-page editing). Covered by the core editor suite.
- The demo site around the kit (cards, tags, platform support, links, device toggles). Covered by the `cesdk_web_demos` suite. Qase 4095, 4096, 4097, 4098, 4099, 4114, 4123, 4150.

## 3. Test environment

- Browser: Chrome, headless, 1400 × 900
- Engine and editor: built from this repo, served locally. Requests to `cdn.img.ly` fail the test. No `cdnAllowlist`. The demo scene's seven Manrope font URIs are relative to the engine's `baseURL`, the same as the pilot's copy of the same scene file (the two kits ship a byte-identical `example-1.scene`).
- License: the shared test license (valid on hostname `localhost` only)
- Data: the kit's own `public/assets/example-1.scene`. 2 pages, `instagram-photo` format, 1080 × 1080 px at 300 dpi, design unit Pixel. Page titles are shown (the kit sets `page/title/show` true).
- Headless: `@cesdk/node` with the same scene, aliased in the Vitest config. The conversion module is mocked: what Ghostscript produces is the plugin's decision and is covered by its own suite, so the headless cases assert the options handed to it. The one real conversion is PRP-05 in the browser.
- Downloads: captured by Playwright and checked by file type, page count, and the `/GTS_PDFXVersion` marker

## 4. Approach

| Kind     | Tool                          | What it checks                                                   | Run                 |
| -------- | ----------------------------- | ---------------------------------------------------------------- | ------------------- |
| Static   | tsc, eslint, convention check | Types, deprecated APIs, kit folder shape                         | `npm run check:all` |
| Unit     | Vitest                        | Page-range parsing, panel state defaults                         | `npm run test:unit` |
| Headless | Vitest + `@cesdk/node`        | Bleed margins, page hiding, and the options handed to conversion | `npm run test:unit` |
| Browser  | Playwright                    | The test cases in section 5                                      | `npm run test:e2e`  |

All four run in the kit's `ci` script. Browser tests use role and label locators only. This is the one kit in the batch with real export logic, so the unit and headless cases carry the matrix and the browser suite keeps one decoded-PDF proof. Both need an S4 extraction — see open question 1.

## 5. Test cases

Format: ID, level, Qase id, title. Then steps and expected result.
Common precondition for all browser cases: the kit is open in the browser and the scene has finished loading.

### 5.1 The panel

**PRP-01 · browser · Qase 4151 · The export panel is closed on start-up**
Steps: open the kit.
Expected: two pages on the canvas, 1080 × 1080 px each, with page titles. The navigation bar shows an accent Export button in place of the usual actions dropdown. No export panel. No console errors. No request to `cdn.img.ly`.

**PRP-02 · browser · Qase 4167 · The Export button toggles the panel**
Steps: click Export. Click it again.
Expected: the panel titled "Export Print-Ready PDF" opens on the right on the first click and closes on the second.

**PRP-03 · browser · Qase 4159, 4662, 4663 · Panel defaults**
Steps: open the panel and read it.
Expected: PDF/X Standard is "PDF/X-4 (recommended)". Colour Profile is "ISO Coated v2 (ECI) (CMYK)". Include Bleed is checked and Bleed Margin (mm) shows 3. Pages is All, and no Page Range field is shown.

**PRP-04 · browser · Qase 4664, 4665 · Bleed controls**
Steps: change Bleed Margin to 5. Then uncheck Include Bleed.
Expected: the number input accepts 5 and unchecking Include Bleed hides it. The 0-to-25 range and the 0.5 step are asserted in PRP-U2, where the control's options are readable; the browser cannot see them.

### 5.2 Export

**PRP-05 · browser · Qase 4148 · Export with the defaults**
Steps: open the panel, click Export PDF.
Expected: the button shows a loading state, then one PDF download with 2 pages carrying a `/GTS_PDFXVersion` marker. This is the kit's one decoded-file proof; conformance is the plugin's decision (section 10).

**PRP-06 · browser · Qase 4149 · Export a page range**
Steps: click Custom, type `1`, click Export PDF.
Expected: the hint under the field reads "e.g.: 1,1-2" while the input is valid, and the download is one PDF with 1 page with both pages visible again afterwards. That page 2 is hidden _while_ the export runs is asserted headless (PRP-H2), where the export call can be intercepted.

**PRP-07 · browser · Qase 4666 · A changed bleed margin reaches the export**
Steps: set Bleed Margin to 5, export. Then read the pages.
Expected: `page/margin/top` is 5 / 25.4 × 300 = 59.06 at the moment `engine.block.export` is called — 5 mm on a 300 dpi pixel scene — and the pages carry the margins they had before once the export finishes. Both known issues 2 and 3 are fixed.
Samples the engine state at the moment of the export through `spyExport`'s `onCall` hook instead of patching `block.export` in the spec.

**PRP-08 · browser · Qase 4160, 4161, 4667 · GRACoL 2006**
Steps: pick "GRACoL 2006 (CMYK)", export with the defaults.
Expected: one PDF download of 2 pages carrying `/GTS_PDFXVersion`. That the profile reaches `convertToPDFX` is asserted headless (PRP-H5) for all three profiles and both standards; the browser keeps one real Ghostscript run per profile rather than three, because the range and the bleed are already covered by their own cases.

**PRP-09 · browser · Qase 4162, 4163, 4668 · sRGB**
Same, with "sRGB (RGB)".

**PRP-10 · browser · Qase 4164, 4165, 4166 · The design renders in the export**
Steps: add a text block to page 1, export with the defaults.
Expected: the download is a PDF with 2 pages carrying `/GTS_PDFXVersion`.
Note from the run: the text string itself is not asserted. Open question 3 asked whether it survives Ghostscript; it does not appear as literal bytes, so the case keeps the page count and the marker, as that question recommended.

**PRP-11 · browser · An invalid page range is reported instead of exporting nothing**
Steps: click Custom, type `abc`, click Export PDF.
Expected: the hint under the field reads "Invalid page range", and clicking Export PDF shows a notification saying the same instead of the button spinning once and stopping. Known issue 5, fixed.

### 5.3 Unit cases (no browser, no engine)

Subject: `getPagesFromRange` from `src/imgly/plugins/export-print-ready-pdf.ts`, which S4 must export (open question 1).

**PRP-U1 · unit · Page-range parsing**
On a 2-page scene, with the input on the left and the pages returned on the right. Empty string → both pages. `1` → page 1. `2` → page 2. `1-2` → both. `1,2` → both. `2,1` → both. `1-1` → page 1. `3` → no pages. `a`, `1-`, `,1`, `1--2`, `1,` and `-1` → throws "Invalid page range".
Note from the run: known issue 4 is narrower than the plan said. `1, 2` **is** accepted — the single-character strip removes its one space. The pinned case (`it.fails`) is `1, 2, 3`, which has two.

**PRP-U2 · unit · Panel state defaults**
Rendering the panel's builder function against a recording builder gives the five state values with their defaults: `bleedEnabled` true, `bleedMargin` 3, `standard` PDF/X-4, `colorProfile` fogra39, `pages` All. The Page Range input and its hint appear only while `pages` is `custom`, and the Bleed Margin input only while `bleedEnabled` is true. Also: the panel registers itself at `//ly.img.panel/export-print-ready-pdf` on the right, its five translations, the bleed input's 0-to-25 range in 0.5 steps, the three colour profiles and the two standards, and that the hint carries the parse error when there is one.
The builder is hand-written rather than the harness `createApiSpy`: the spy answers every call with a proxy, so the `children` callbacks never run and `state.value` never takes the branch a case is about.

**PRP-U19 · unit · `src/index.ts`**
The entry creates the editor with the kit's user id, initialises the print-ready editor, loads the example scene, publishes the editor on `window` and reports the `created` and `ready` demo phases. A failed start-up reports the `failed` phase instead of leaving an unhandled rejection.

**PRP-U21 · unit · `initPrintReadyPdfEditor`**
The entry adds the design editor configuration plugin and then the export panel plugin, adds the asset sources after them, and limits uploads and demo assets to images. A double that answers every `addPlugin` with a promise the test settles by hand proves every asset source is in flight before any of them settles.

**PRP-U22 · unit · The navigation bar export button**
The registered navigation bar component builds one accent `common.export` button. Pressing it opens `//ly.img.panel/export-print-ready-pdf` while the panel is closed and closes it while it is open, and never does both.

**PRP-U23 · unit · The exclusion area plugin**
Run `ExclusionAreaAssetSource.initialize` against recording stubs. It registers `exclusion-areas.json` with the base path `${DEMO_ASSETS_BASE_URL}/assets`, enables only `ly.img.page.printMarks.exclusionArea`, adds the `ly.img.exclusionArea` library entry and puts its dock button before `ly.img.spacer.layers`. When the source is already registered it does nothing, and without an editor it registers the source and nothing else.

**PRP-U20 · removed.** `resolveAssetPath` is gone; `src/imgly/demo-assets.ts` derives the URL from `VITE_DEMO_ASSETS_BASE_URL` or the kit's own URL.

### 5.4 Headless cases (`@cesdk/node`, no browser)

Subject: `exportPrintReadyPDF`, which S4 must split from `localDownload` and export (open question 1).

**PRP-H1 · headless · Bleed margins are converted and then restored**
With `bleedEnabled` true and `bleedMargin` 3, every page in the range carries 3 / 25.4 × 300 = 35.43 on all four `page/margin/*` properties at the moment `engine.block.export` is called — the millimetre value expressed in the scene's own design unit. The same 3 mm is 3 on a Millimeter scene and 0.118 on an Inch scene. With `bleedEnabled` false or `bleedMargin` 0 the margins are the scene's own. After every call the scene carries exactly the margins and the `page/marginEnabled` flags it had before. Known issues 2 and 3, fixed.

**PRP-H2 · headless · Pages outside the range are hidden and restored**
With the range `1` on a 2-page scene, page 2 is invisible at the moment `engine.block.export` is called and visible again after the call returns.

**PRP-H3 · headless · An empty range exports every page**
Both pages are visible at the moment `engine.block.export` is called. The panel now passes `rangeInputState.value` only while Pages is Custom, so a range typed and then abandoned no longer reaches the export. Known issue 1, fixed; PRP-U2 asserts the input only exists under Custom.

**PRP-H4 · headless · An invalid range rejects**
With `pageRange` `abc`, `exportPrintReadyPDF` rejects with "Invalid page range", nothing is handed to the conversion, and the scene's margins and page visibility are untouched. Known issue 5, fixed; PRP-11 asserts the message the user sees.

**PRP-H5 · headless · Conversion options**
Each of the three profiles and the two standards reaches `convertToPDFX` as `{ outputProfile, outputStandard, title: 'Print-Ready Export' }`. The PDF handed to it is the result of `engine.block.export(scene, { mimeType: 'application/pdf' })` — the kit passes no other export option — and the function returns what the conversion produced.

**PRP-U7 · unit · `exportPrintReadyPDF`**
Against a stub engine and a stubbed `convertToPDFX`: the scene is exported once as `application/pdf` and handed to the converter with the chosen profile, standard and the fixed title. Without a scene the call rejects with "No scene to export". Pages outside the range are hidden and shown again — including when the conversion rejects. The bleed is written in the scene's own design unit (millimetres as given, inches divided by 25.4, and a pixel scene multiplied by `scene/dpi`), and the original margins are restored afterwards. A bleed of 0 writes no margin at all.

**PRP-U8 · unit · The panel controls that write state**
The Pages button group switches between all and custom. The page-range input stores what was typed, clears the error for a range that parses, and records the parser's message for one that does not.

**PRP-U9 · unit · The export button**
An export that fails is reported as an error notification and the loading state is released. The panel passes the custom range, the selected profile and the selected standard.

**PRP-U10 · unit · A successful export**
The converted document is downloaded through a temporary anchor named `my-design-print-ready`, and the loading state is released.

**PRP-U11 · unit · The plugin outside an editor, and a failure that is not an `Error`**
`initialize` registers nothing when the context carries no `cesdk`. A rejection that is not an `Error` is reported as "Print-ready PDF export failed."

**PRP-U12 · unit · A scene that disappears mid-export**
`millimetresInDesignUnit` falls back to the raw millimetre value rather than guessing a design unit.

**PRP-U13 to PRP-U18 · unit · The editor configuration**
Panel placement, `setupUI`'s bar set, the canvas bar and menus, the inspector bar per edit mode, the navigation bar (which ends with the kit's own export button and carries no built-in PDF export), the engine settings, the empty setups, `DesignEditorConfig`, which pins the editor compatibility version to the CE.SDK version once, as the call right after the reset, and the five action handlers — the same shape as the sibling design kits.

**KB-01 · unit · Keyboard catalog predicates**

`tests/unit/keyboard-catalog.test.ts` runs every `run` and `when` of `src/imgly/config/keyboard/catalogs/us-ansi.ts` against 1620 editor states (5 edit modes, 9 selections, 3 roles, features on and off, 3 vector states, page and no page) and asserts that none throws, that every shortcut activates in at least one state, and that every function `run` reaches `cesdk.actions.run`. Kit-owned: the kit decides which key does what and when it is live. The catalog measures 100 % lines, branches and functions.

## 6. Entry and exit criteria

Entry: engine and editor built; `@cesdk/node` built; test license available; the shared kit test harness exists; `exportPrintReadyPDF` and `getPagesFromRange` exported from a module that does not touch the DOM; the kit's `test:unit` and `test:e2e` scripts replaced with the real commands.

Exit: every case in section 5 passes locally and in CI. `npm run ci` passes. The published kit contains no test files. A release run reports results to the Qase ids above.

## 7. Known issues found while writing this plan

Fixed in the S6 fleet sweep: the unreachable `exportImage` action, which no UI reached because `ly.img.exportImage.navigationBar` runs `exportDesign`, was deleted, and `setupPanels` now uses the editor's real asset library panel id `//ly.img.panel/assetLibrary` in place of `//ly.img.panel/assets`. PRP-U3 covers the first.

Confirm each with a test before fixing.

1. **Fixed.** The page range was applied even when Pages was All. The Export button now passes the range only while `pagesState.value` is Custom.
2. **Fixed.** Bleed margins were never restored. `exportPrintReadyPDF` now snapshots every page's four margins and its `page/marginEnabled` flag before the export and restores them in a `finally`, together with the page visibility.
3. **Fixed.** The millimetre conversion assumed 1 design unit = 1 point, so the default 3 mm became 8.5 px = 0.72 mm on a 300 dpi pixel scene. It now goes through `engine.scene.getDesignUnit()` and `scene/dpi`, so 3 mm is 3 mm on paper for a Pixel, Millimeter or Inch scene. **This changes exported geometry** — a customer's existing export now carries the bleed the label promises.
4. **Fixed in 6b.** A page range with more than one space is rejected. `pageRange.replace(/\s/, '')` has no `g` flag, so it strips only the first whitespace character: `1, 2` works, `1, 2, 3` does not. Pinned by PRP-U1 (`it.fails`), not fixed — it was not in the decided set.
5. **Fixed.** An invalid range at export time did nothing — the function swallowed the parse error and returned. It now rejects, and the panel shows the message as a notification.
6. `rangePageState` is dead. The Page Range input writes it from `getPagesFromRange([], newValue)` — an empty page list, so the result is always `[]` — and nothing ever reads it. Only the thrown error, which sets `rangeInputErrorState`, has an effect.
7. The download has no extension. `localDownload` sets `download` to `my-design-print-ready`, so the file arrives without `.pdf`. Not fixed — it was not in the decided set. PRP-05 asserts the bytes, not the name.
8. `localDownload` calls `window.URL.createObjectURL` and never revokes it, so every export leaks the blob for the lifetime of the page.
9. `initPrintReadyPdfEditor`'s doc comment lists "Background removal plugin" among the things it configures. The kit installs no such plugin. `public/assets/remove-bg.png` is also unreferenced.
10. The Qase suite paths all say "PDF / X-3", but PDF/X-4 has been the default since the standard selector was added. The nine cases under those suites exercise the X-4 path.
11. `config/i18n.ts` is an empty `void cesdk;` stub while the README documents localization, even though the export plugin sets its own translations.

### Coverage residue

None. The page-range input's `'Invalid range'` fallback was unreachable, because `getPagesFromRange` throws only `Error('Invalid page range')`, so the input now sets that message directly.

## 8. Open questions

1. **Resolved: both done.** `getPagesFromRange` is exported, and `exportPrintReadyPDF` now takes an options object and returns the converted `Blob`; the panel's button calls `localDownload` on it. The kit's `@cesdk/cesdk-js` import also became type-only, so the module loads under `@cesdk/node`.
2. **Resolved: 1, 2, 3 and 5 are all fixed.** Issue 3 changes exported geometry and is flagged to Elia in the batch report.
3. **Resolved:** the text does not survive as literal bytes, so PRP-10 asserts the page count and the `/GTS_PDFXVersion` marker.

## 9. Estimate

Measured: 11 browser cases in 1.3 minutes on one worker (six of them a real Ghostscript conversion, 6 to 12 s each). 17 headless and 23 unit cases in about 12 s together. Merged coverage 90.20 % lines, 95.24 % branches, 88.57 % functions.

## 10. Boundary review

Rule used: the code that makes a decision owns the test for it. The kit decides the panel, its five settings and their defaults, how a page range is parsed, how a bleed margin is turned into page properties, which pages are hidden during the export, and which options reach `convertToPDFX`. The plugin decides what PDF/X conversion produces. The editor decides how builder controls render and how a registered panel opens. The engine decides what a PDF export contains.

Core behaviour this plan leans on, and where it is covered today:

| Behaviour                                                                               | Owner  | Covered by                                                                                                                                                                                                                                    |
| --------------------------------------------------------------------------------------- | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| PDF/X-3 and PDF/X-4 conversion, ICC embedding, metadata, transparency, silent operation | plugin | `apps/cesdk_web_plugins/packages/plugin-print-ready-pdfs-web/test/integration/{pdfx3-compliance,pdfx4-compliance,icc-embedding,metadata-validation,profile-conversion,transparency-scenarios,silent-conversion,content-preservation}.test.ts` |
| The Ghostscript argument list and the PDF/X definition file per standard                | plugin | same package, `test/unit/pdfx-args.test.ts`, `test/unit/pdfx-def.test.ts`                                                                                                                                                                     |
| PDF export of a scene contains every page, and a single page exports alone              | engine | `engine/lib/test/api/ExportAPITest.cpp` `ExportToBuffer_PDF_AllPagesInScene`, `ExportToBuffer_PDF_SinglePageFromScene`                                                                                                                        |
| `page/marginEnabled` and `page/margin/*` are settable and readable on a page            | engine | `engine/test/UBQAPITest.cpp:2381`, `engine/test/EditorTests.cpp:3482`                                                                                                                                                                         |
| `cesdk.utils.downloadFile`                                                              | editor | `apps/cesdk_web/packages/api/utils/UtilsAPI.test.ts` `describe('downloadFile')` — not used here, see known issue 7                                                                                                                            |

Core coverage gaps found (candidates to add in the core suites, not in this kit):

1. Engine: `page/marginEnabled` plus `page/margin/*` changing the geometry of an exported PDF. `ExportAPITest.cpp` asserts one `/MediaBox` per page dimension and nothing about bleed; no test anywhere checks that a margin produces a `/BleedBox`, a `/TrimBox` or a larger `/MediaBox`. The kit's whole bleed feature rests on it, and known issue 3 cannot be judged without it. Suggested home: `ExportAPITest.cpp`, next to `ExportToBuffer_PDF_AllPagesInScene`.
2. Engine: PDF export of a scene skips pages whose visibility is off. The kit relies on it for the page range, exactly as the pilot does. Closed on this branch by `ExportToBuffer_PDF_SceneSkipsHiddenPages` in `engine/lib/test/api/ExportAPITest.cpp`; recorded as gap 1 of `starterkit-export-options/tests/TEST-PLAN.md`.
3. Editor: the builder controls this panel is built from. `Select` value and change, `ButtonGroup` active state, `Checkbox` value and change, and `registerPanel` open, close, `isPanelOpen` and `setPanelPosition` have no Vitest. `NumberInput`, `TextInput`, `TextArea` and `Tabs` do (`apps/cesdk_web/packages/ui/builder/`). Qase 4151, 4159, 4167, 4662, 4663, 4664 and 4665 exercise the untested ones through this kit. The pilot recorded the same gap for `ButtonGroup`, `Select` and `registerPanel`; this plan adds `Checkbox`. Suggested home: `apps/cesdk_web/packages/ui/builder/`.

Until gaps 1 and 3 are closed, PRP-05 and PRP-07 keep their decoded-PDF and page-property assertions as the end-to-end proof.
