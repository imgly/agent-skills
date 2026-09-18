# Test plan: starterkit-export-options

Version 5, 5 Sep 2026. Status: implemented. 92 unit and headless tests and 20 browser tests run in `npm run ci` (exit 0). Known issues 1, 2, 3 and 7 are fixed. Merged coverage is lines 99.88 %, branches 99.04 %, functions 100 %.

## 1. Purpose

Verify that the Export Options starter kit works as shipped: the editor loads with the export panel, and every export setting produces the file the user asked for.

## 2. Scope

In scope

- The export panel: format, pages, quality, resolution, custom size, export button
- The Export button in the navigation bar
- Editor start-up with the demo scene
- The kit's own code under `src/imgly/` and `src/index.ts`

Out of scope

- Core editor features used through this kit (text editing, undo, asset library). Covered by the core editor suite.
- The demo site around the kit (cards, tags, links, platform toggles). Covered by the `cesdk_web_demos` suite. Qase 598, 599, 600, 601, 602, 617, 626, 2421.

## 3. Test environment

- Browser: Chrome, headless, 1400 × 900
- Engine and editor: built from this repo, served locally. Requests to `cdn.img.ly` for engine assets fail the test.
- License: the shared test license (valid on hostname `localhost` only)
- Data: the kit's own `public/assets/example-1.scene`. 2 pages, 1080 × 1080 px.
- Downloads: captured by Playwright and checked by file type, pixel size, and PDF page count

## 4. Approach

| Kind     | Tool                          | What it checks                                                                  | Run                 |
| -------- | ----------------------------- | ------------------------------------------------------------------------------- | ------------------- |
| Static   | tsc, eslint, convention check | Types, deprecated APIs, kit folder shape                                        | `npm run check:all` |
| Unit     | Vitest                        | Page-range parser, the range message, size text and the kit's config, no engine | `npm run test:unit` |
| Headless | Vitest + `@cesdk/node`        | `exportDesignBlobs` against a real engine, no browser                           | `npm run test:unit` |
| Browser  | Playwright                    | The test cases in section 5                                                     | `npm run test:e2e`  |

All three run in the kit's existing `ci` script. Browser tests use role and label locators only.

## 5. Test cases

Format: ID, Qase id, title. Then precondition, steps, expected result.
Common precondition for all cases: the kit is open in the browser and the scene has finished loading.

### 5.1 Start-up and panel

**EO-01 · Qase 642, 598 · Editor loads with the export panel**
Steps: open the kit.
Expected: two pages on the canvas. Export Design panel open on the right. No console errors. No engine asset loaded from the CDN. Screenshot matches baseline.

**EO-02 · Qase 4659 · Export button toggles the panel**
Steps: click Export in the navigation bar. Click it again.
Expected: panel closes on the first click, opens on the second.

### 5.2 Default settings per format

**EO-03 · Qase 643, 644, 645, 646, 647 · JPEG defaults**
Steps: none, read the panel.
Expected: JPEG selected. Text below the formats reads "Shareable web format". Pages: All. Quality: High. Resolution: Original. Size text reads "1080 x 1080 px".

**EO-04 · Qase 650, 651, 652, 653, 654 · PNG defaults**
Steps: click PNG.
Expected: PNG selected. Text reads "Complex Images with Transparency". Pages All, Quality High, Resolution Original.

**EO-05 · Qase 659, 660 · PDF defaults**
Steps: click PDF.
Expected: PDF selected. Text reads "Best for Printing". Quality and Resolution controls are not shown.

### 5.3 Export JPEG

**EO-06 · Qase 615 · Export with defaults**
Steps: click Export Design.
Expected: two downloads, one per page. Each is a JPEG of 1080 × 1080 px.

**EO-07 · Qase 616 · Export a page range**
Steps: click Range. Type `2` into Page Range. Click Export Design.
Expected: one download, page 2 only.

**EO-08 · Qase 648 · Change quality**
Steps: set Quality to Low, export. Set Quality to Maximum, export.
Expected: the kit calls the engine export with `jpegQuality` 0.2, then 1. (That a lower value yields a smaller file is engine behaviour, covered by the engine's JPEG quality matrix test.)

**EO-09 · Qase 649 · Change size**
Steps: set Resolution to Small, export. Set Huge, export. Set Custom, type width 500, export.
Expected: the kit calls the engine export with target size 540 × 540, then 2160 × 2160, then 500 × 500. The size text updates for Small and Huge. (Pixel output for a target size is engine behaviour, covered by the engine export tests; EO-06 keeps one decoded-file check as the end-to-end proof.)

**EO-09b · Change size, Custom**
Steps: set Resolution to Custom, type width 500.
Expected: the size text reads "500 x 500 px". Currently fails, see known issue 4; the test is marked as an expected failure and flips when the kit is fixed.

### 5.4 Export PNG

**EO-10 · Qase 655 · Export with defaults**
Same as EO-06 with PNG selected. Expected: two PNG files of 1080 × 1080 px.

**EO-11 · Qase 656 · Export a page range**
Same as EO-07 with PNG selected.

**EO-12 · Qase 657 · Change quality**
Same as EO-08 with PNG selected. Expected: `pngCompressionLevel` 9 for Low, 1 for Maximum.

**EO-13 · Qase 658 · Change size**
Same as EO-09 with PNG selected.

### 5.5 Export PDF

**EO-14 · Qase 664 · Export with defaults**
Steps: click PDF. Click Export Design.
Expected: one PDF download with 2 pages.

**EO-15 · Qase 665 · Export a page range**
Steps: click PDF. Click Range. Type `1`. Click Export Design.
Expected: page 2 is hidden while the export runs and visible again afterwards; the download is one PDF with 1 page. (That a hidden page is left out of a PDF is engine behaviour; see boundary review, gap 1.)
Samples the engine state at the moment of the export through `spyExport`'s `onCall` hook instead of patching `block.export` in the spec.

### 5.6 Input validation (no Qase case yet)

**EO-16 · Invalid page range**
Steps: click Range. Type `abc`. Click Export Design.
Expected: the hint below the field shows "Invalid page range", it still shows it after the click, and the kit calls no engine export.

**EO-16b · Page range beyond the page count**
Steps: click Range. Type `3` on the 2-page scene. Click Export Design.
Expected: the hint reads "No page in that range" and the kit calls no engine export.

**EO-16c · A range typed under Range does not apply to All**
Steps: click Range. Type `1`. Click All. Click Export Design.
Expected: two exports, one per page. The range only applies while Range is selected.

**EO-17 · Custom size above the limit**
Steps: set Resolution to Custom. Type height 5000 and press Enter.
Expected: the committed value clamps to 4000, so the derived width reads 4000, Export Design stays enabled and no export exceeds 4000 px. The height field keeps the typed draft while it holds the focus.

### 5.7 Unit tests (no browser)

**EO-U1 · Page-range parser**
Inputs and expected outputs on a 2-page scene:
``(empty) → both pages.`1`→ page 1.`1-2`→ both.`1,2`→ both.`2,1`→ both.`1, 2`→ both (currently fails, see known issue 1).`3`→ no pages.`a`, `1-`, `,1`, `1--2` → error "Invalid page range".

**EO-U3 · Page range message**
On a 2-page scene: ``, `1`, `1-2`, `1,2`→ no message.`a`, `1-`, `,1`→ "Invalid page range".`3`, `5-9` → "No page in that range".

**EO-U4 · Registered actions**
`setupActions` registers `saveScene`, `exportDesign`, `importScene` and `exportScene`, and no action the kit has no UI for.

**EO-U2 · Size text**
1080 × 1080 px scene: scale 1 → "1080 x 1080 px", 0.5 → "540 x 540 px", 2 → "2160 x 2160 px". Millimeter and Inch scenes convert at 300 dpi.

**EO-U12 · unit · `initExportOptionsEditor`**
The entry adds the design editor configuration plugin first and the asset sources after it, and limits uploads and demo assets to images. A double that answers every `addPlugin` with a promise the test settles by hand proves every asset source is in flight before any of them settles.

**EO-U11 · removed.** `resolveAssetPath` is gone; `src/imgly/demo-assets.ts` derives the URL from `VITE_DEMO_ASSETS_BASE_URL` or the kit's own URL.

**KB-01 · unit · Keyboard catalog predicates**

`tests/unit/keyboard-catalog.test.ts` runs every `run` and `when` of `src/imgly/config/keyboard/catalogs/us-ansi.ts` against 1620 editor states (5 edit modes, 9 selections, 3 roles, features on and off, 3 vector states, page and no page) and asserts that none throws, that every shortcut activates in at least one state, and that every function `run` reaches `cesdk.actions.run`. Kit-owned: the kit decides which key does what and when it is live. The catalog measures 100 % lines, branches and functions.

## 6. Entry and exit criteria

Entry: engine and editor built; test license available; the shared kit test harness exists (boot helper, download helper, console and network guards).

Exit: every case in section 5 passes locally and in CI. `npm run ci` passes. The published kit contains no test files. A release run reports results to the Qase ids above.

## 7. Known issues found while writing this plan

Confirm each with a test before fixing.

1. A page range with a space after the first comma (`1, 2, 3`) is rejected. The README documents `1, 3-5, 7` as valid.
   Fixed: the parser now strips every whitespace character, not only the first. EO-U1.
2. An invalid range at export time does nothing. No message.
   Fixed: the message below the input is derived from the range on every render, and Export Design exports nothing while it shows. EO-16, EO-U3.
3. A range beyond the page count exports nothing. No message.
   Fixed: such a range now reads "No page in that range" and blocks the export the same way. EO-16b, EO-U3.
   The same fix ends a related defect: a range typed under Range no longer applies after switching back to All. EO-16c.
4. **Fixed.** In Custom resolution the size text disappeared, because the description was only built from the preset scale table. The custom scale feeds it now; EO-09b pins it.
5. PDF export ignores quality and resolution. Matches the README; the panel does not say so. Open.
6. Start-up logs one 404: the kit ships no favicon. Same in every kit. Open; the harness stubs that one URL so the console guard stays meaningful.
7. The custom width and height inputs clamp at 4000, so the kit's own "size above the limit" error branch is dead code.
   Fixed: the clamp stays and the unreachable error text, its two state flags and the disabled Export button are gone. EO-17.
8. The kit registered an `exportImage` action at 1080 × 1080 that nothing can reach: the navigation bar entry that would run it is not in this kit, and the built-in entry runs `exportDesign` instead.
   Fixed: the registration is deleted. EO-U4.

### Coverage residue

The `Custom` arm of the resolution description is reached by EO-09b since the fix to known issue 4.

## 8. Open questions

1. Split the export function from the download step so exports can also be tested without a browser (about 1 s per case instead of 8 s). Done: `exportDesignBlobs` takes the engine and is covered by the headless cases.
2. Issues 1, 2, 3: fix in this pilot or record as expected. Done: all three fixed.
3. Keep `window.cesdk` as the standard test hook for all kits. Yes. The harness also accepts `window.imgly.cesdk` and a kit that publishes a bare engine.
4. Issue 7: delete the dead error branch and keep the clamp, or lift the clamp and keep the message. Done: the branch is deleted.

## 9. Estimate

20 browser cases at about 8 s each: under 3 minutes on one worker. 61 unit cases: under 1 s. 6 headless cases: about 4 s.

## 10. Boundary review

Rule used: the code that makes a decision owns the test for it. The kit decides formats, defaults, the quality and size mappings, page-range parsing, and the hide-pages strategy for PDF. The engine decides what an export option produces. The editor decides how builder controls render and how panels open.

Core behaviour this plan leans on, and where it is covered today:

| Behaviour                                                             | Owner  | Covered by                                                  |
| --------------------------------------------------------------------- | ------ | ----------------------------------------------------------- |
| `jpegQuality` changes file size                                       | engine | `engine/lib/test/api/ExportAPITest.cpp` JPEG quality matrix |
| `pngCompressionLevel` applied                                         | engine | same file, PNG compression matrix                           |
| `targetWidth`/`targetHeight` set output pixels                        | engine | same file, export with options                              |
| PDF export of a scene contains all pages; a single page exports alone | engine | same file, PDF all-pages and single-page tests              |
| Builder NumberInput, TextInput, Tabs render and update                | editor | `apps/cesdk_web/packages/ui/builder/*.test.tsx`             |

Core coverage gaps found (candidates to add in the core suites, not in this kit):

1. Engine: PDF export of a scene skips pages whose visibility is off. The kit relies on it for Range. Closed on this branch: `engine/lib/test/api/ExportAPITest.cpp` gained `ExportToBuffer_PDF_SceneSkipsHiddenPages` and `ExportToBuffer_PDF_HiddenPageExportedDirectlyStillRenders`.
2. Editor: builder `ButtonGroup` active state, `Select` value and change, and `registerPanel` open, close, `isPanelOpen`, and `setPanelPosition`. No Vitest found for these. Qase 643, 650, 659 and 4659 exercise them through this kit. Suggested home: `apps/cesdk_web/packages/ui/builder/`.

Until the gaps are closed, EO-06, EO-14 and EO-15 keep one decoded-file assertion each as the end-to-end proof.

## 11. Coverage pass

Cases added to close the merged-coverage gaps:

- **EO-U5 · unit · The actions the kit registers — every handler `setupActions` registers is invoked: `saveScene` downloads the saved scene as text, `exportDesign` downloads what `cesdk.utils.export` returned, `importScene` opens the picker for `.imgly,.scene,.zip`, revokes the blob URL on the success and on the failure path and then runs `zoom.toPage`, `exportScene` writes a JSON scene by default and a zip archive for `{ format: 'archive' }`, and `uploadFile` returns what `cesdk.utils.localUpload` returned**
- **EO-U6 · unit · DesignEditorConfig — `initialize` resets the editor, then pins the editor compatibility version to the CE.SDK version once, as the very next call, and applies features, UI, actions, shortcuts, translations and engine settings; with no `cesdk` in the context it touches the engine not at all**
- **EO-U7 · unit · Video timeline scaffold — `setupVideoTimeline` makes no editor call, so the kit ships the timeline example unapplied**
- **EO-U8 · unit · the export panel — the three formats, the page modes, the range hint and both range errors, the custom-resolution aspect ratio, one image export per page, one PDF for a range with the other pages hidden and restored, no export while the range is invalid, and no export without a scene**
- **EO-U9 · unit · the navigation bar export button — opens the panel when it is closed and closes it when it is open**
- **EO-U10 · unit · `src/index.ts` — with `@cesdk/cesdk-js`, the kit barrel and the demo lifecycle beacon mocked: a successful create publishes `window.cesdk`, configures the editor, loads the demo scene and reports `created` then `ready`; a rejected create reports `failed`, logs `Failed to initialize CE.SDK:` and leaves no unhandled rejection**

Residue, measured and classified:

- `src/imgly/plugins/export-design-panel.ts:529-530`. That arm reads `customScaleState` when the resolution is Custom, but it sits inside `if (scale != null)` and `RESOLUTION_SCALE` has no `Custom` entry, so `scale` is `undefined` exactly when the condition holds. Unreachable by construction; it is known issue 4 seen from the other side.

Residue: none from the asset base; `src/imgly/demo-assets.ts` is covered by the shared `tests/unit/demo-assets.test.ts`.
