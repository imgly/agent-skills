# Test plan: starterkit-content-moderation

Version 5, 5 Sep 2026. Status: implemented. 41 unit and headless tests and 8 browser tests run in `npm run ci` (exit 0). Merged coverage is lines 100 %, branches 100 %, functions 100 %.

## 1. Purpose

Verify that the Content Moderation starter kit works as shipped: Validate Content collects every image in the design, asks the moderation service about each one, and turns the answer into a list the user can act on.

## 2. Scope

In scope

- `src/app/moderation.ts` — collecting image blocks, calling the service, mapping the response to four categories
- `src/app/utils.ts` — `percentageToState`, `getImageUrl`, `selectBlocks`
- `src/app/components/Sidebar/` — the Validate button, the result list, the tooltip, block selection
- The editor config (`src/imgly/config/`) and its export actions

Out of scope

- The moderation service itself. Every test stubs it; no test calls the live proxy.
- Fills, source sets, scopes, selection, export output. Engine behaviour; see section 10.
- The editor UI itself. Covered by the core editor suite.
- The demo site around the kit. Covered by the `cesdk_web_demos` suite. Qase 1446, 1447, 1448, 1449, 1450, 1465, 1474, 2456.

## 3. Test environment

- Headless: `@cesdk/node` through the shared harness engine helper. Node, no DOM. `fetch` is replaced per test.
- Browser: Chrome, headless, 1400 × 900. Requests to `cdn.img.ly` fail the test. Requests to the moderation proxy are answered by `page.route`.
- License: the shared test license (valid on hostname `localhost` only)
- Data: `public/assets/example.scene`. One page with text, a line and **four** image blocks, so a flagged category produces four rows, not one. The browser cases derive their expected counts from `block.findByKind('image')` rather than hard-coding it.
- The scene stores absolute `cdn.img.ly` URIs for its Rasa and Roboto fonts, so that path is on the kit's `cdnAllowlist`.
- Downloads: captured by Playwright and checked by file type and PDF page count

## 4. Approach

| Kind     | Tool                          | What it checks                                                  | Run                 |
| -------- | ----------------------------- | --------------------------------------------------------------- | ------------------- |
| Static   | tsc, eslint, convention check | Types, deprecated APIs, kit folder shape                        | `npm run check:all` |
| Unit     | Vitest                        | Threshold mapping and presentation, no engine                   | `npm run test:unit` |
| Headless | Vitest + `@cesdk/node`        | Image collection and the moderation pass with a stubbed service | `npm run test:unit` |
| Browser  | Playwright                    | The test cases in section 5.1                                   | `npm run test:e2e`  |

All four run in the kit's `ci` script. Browser tests use role and label locators only.

## 5. Test cases

Format: ID, Qase ids, title. Then steps and expected result.

### 5.1 Browser

Common precondition: the kit is open, the scene has loaded, and the moderation proxy is stubbed.

**CM-01 · Qase 1479 · Default state**
Steps: open the kit.
Expected: the sidebar shows an enabled "Validate Content" button, "0 results" and the text "No check has been performed yet." No moderation request has been sent. No console errors. No engine asset from the CDN.

**CM-02 · Qase 1480, 1482 · Validate with findings**
Steps: stub the proxy with `weapon: 0.9`, `alcohol: 0.1`, `drugs: 0.5`, `nudity: { safe: 0.95 }`. Click Validate Content.
Expected: the list shows a Weapons row and a Drugs row per image and the header reads twice the image count. Alcohol and Nudity are not listed.
Note from the run: the "Checking..." state is too short to observe reliably against a stubbed proxy, so the case asserts the button is back to "Validate Content" instead.

**CM-03 · Qase 1480, 1482 · Category tooltips**
Steps: hover the info icon on the Weapons row, then on the Drugs row.
Expected: a tooltip appears with that category's description ("Handguns, rifles, machine guns, threatening knives..." and "Cannabis, syringes, glass pipes, bongs, pills..."), and it disappears on mouse-out.

**CM-04 · Qase 1481, 1485 · Select a flagged block**
Steps: click Select on the Weapons row, then on the Drugs row.
Expected: each click selects the reported image on the canvas and deselects everything else. The rows are grouped per image, so rows 1 and 2 both point at image one and row 3 at image two.

**CM-05 · A clean design**
Steps: stub the proxy with every score below 0.4 and click Validate Content.
Expected: the list shows "No content violations found." and the invitation to add offensive content, and the header reads "0 results".

**CM-06 · A failing service**
Steps: stub the proxy with a 500 and click Validate Content.
Expected: the button returns to its normal state, the previous results are kept and the page does not break. Today this is a console line only; see known issue 4.

**CM-07a · Qase 1464 · Export an image**
Steps: click "Export Images" in the navigation bar.
Expected: a PNG downloads whose aspect ratio matches the page.
Note from the run: `ly.img.exportImage.navigationBar` is hoisted out of the Actions dropdown into the bar, and it runs `exportDesign` with no target size, so the file comes out at the page's own size. Split from CM-07b because the editor's export progress dialog covers the navigation bar until it closes.
Asserts the options the kit passes to `engine.block.export` and that a file of the declared type downloaded; the exported pixel size belongs to `engine/lib/test/api/ExportAPITest.cpp`.

**CM-07b · Qase 1463 · Export a PDF**
Steps: open the Actions dropdown and run Export PDF.
Expected: the dropdown holds exactly one entry, Export PDF, and it downloads a one-page PDF.
Asserts the options the kit passes to `engine.block.export` and that a file of the declared type downloaded; the exported pixel size belongs to `engine/lib/test/api/ExportAPITest.cpp`.

### 5.2 Headless

**CM-H1 · Image collection**
Steps: load the shipped scene, stub `fetch`, call `checkImageContent`.
Expected: one request per image block in the scene, each with the block's image URL encoded into the query. Text and shape blocks produce no request.

**CM-H2 · Four categories per image**
Steps: stub the proxy with `weapon: 0.9`, `alcohol: 0.1`, `drugs: 0.5`, `nudity: { safe: 0.2 }`.
Expected: four results for that block, in the order Weapons, Alcohol, Drugs, Nudity, with the states failed, success, warning, warning. Each carries the block's id, type, name and URL.
Note from the run: nudity is `1 - safe`, so 0.8, and `failed` needs a score strictly above 0.8. The plan said failed.

**CM-H3 · getImageUrl prefers the direct URI**
Steps: build blocks with an image fill URI, with only a source set, and with neither.
Expected: the URI, the first source-set entry as the engine orders it, and `null`. Blocks that yield `null` are dropped before any request is made.
Note from the run: the shipped scene's image blocks carry no `fill/image/imageFileURI` at all — they are source-set only — so the case sets both explicitly. The engine reorders a source set, so the first entry is asserted against `getSourceSet`, not against the order it was written in.

**CM-H4 · Several images**
Steps: a scene with three image blocks, the stub answering differently per URL.
Expected: three requests, twelve results, each result carrying the id of the block it describes.

**CM-H5 · selectBlocks**
Steps: select two blocks, then call `selectBlocks(engine, [third])`.
Expected: only the third block is selected afterwards. Calling with an empty array clears the selection.

**CM-H6 · A malformed response**
Steps: stub the proxy with `{}`.
Expected: the check rejects with "The moderation service returned no ... score". Fixed per the P5 resolution; the plan originally pinned the old behaviour, where a broken service reported a clean design.

**CM-H7 · A scene with no images**
Steps: run against a scene with only text.
Expected: no request is sent and the result is an empty array.

### 5.3 Unit

**CM-U1 · Threshold mapping**
`percentageToState`: 0.81 and 1 give `failed`; 0.8 and 0.41 give `warning`; 0.4, 0 and −1 give `success`. `NaN` still gives `success`, which is why `checkImageContentAPI` now validates the response before mapping it.

**CM-U2 · Category catalogue**
The four names and descriptions built by `checkImageContentAPI` match the strings the tooltip shows, Nudity is derived as `1 - nudity.safe`, and the image URL reaches the proxy encoded. A response with no scores, a missing `nudity`, or a non-numeric score rejects.

**CM-U3 · Editor config**
Steps: call `setupFeatures`, `setupActions` and `setupNavigationBar` with a recording double.
Expected: the navigation bar order is document settings, undo/redo, spacer, title, spacer, zoom, and an Actions dropdown whose children are exactly `ly.img.exportImage.navigationBar` and `ly.img.exportPDF.navigationBar`. `setupActions` registers `saveScene`, `exportDesign`, `importScene`, `exportScene` and `uploadFile`, and registers no `exportImage` — the fleet sweep deleted that unreachable action. `setupFeatures` enables the design features in one call, enables no `ly.img.video*` feature, and names every feature on its own, enabling no umbrella group whose children it also lists.

**CM-U8 · removed.** `resolveAssetPath` is gone; `src/imgly/demo-assets.ts` derives the URL from `VITE_DEMO_ASSETS_BASE_URL` or the kit's own URL.

**KB-01 · unit · Keyboard catalog predicates**

`tests/unit/keyboard-catalog.test.ts` runs every `run` and `when` of `src/imgly/config/keyboard/catalogs/us-ansi.ts` against 1620 editor states (5 edit modes, 9 selections, 3 roles, features on and off, 3 vector states, page and no page) and asserts that none throws, that every shortcut activates in at least one state, and that every function `run` reaches `cesdk.actions.run`. Kit-owned: the kit decides which key does what and when it is live. The catalog measures 100 % lines, branches and functions.

## 6. Entry and exit criteria

Entry: engine and editor built; test license available; the shared kit test harness exists (headless engine helper, browser boot helper, network stub helper, download helper, console and network guards). The kit already sets `window.cesdk`.

Exit: every case in section 5 passes locally and in CI. `npm run ci` passes. The published kit contains no test files. A release run reports results to the Qase ids above.

## 7. Known issues found while writing this plan

Confirmed by reading the code. Confirm each with a test before fixing.

1. ~~`Sidebar` keys the result rows by `result.blockId`.~~ **Fixed in v3**: the key is `${result.blockId}-${result.name}`, so the four rows one image can produce are distinct. The console allowlist entry that hid React's warning is gone, which is what proves it — React only warns in dev mode, so the production bundle never showed this.
2. **Fixed.** `checkImageContentAPI` now validates the four scores and throws a named error when one is missing or not a finite number, instead of mapping `NaN` to `success` and reporting a clean design. The sidebar's existing catch keeps the failure to a logged line (known issue 4).
3. `checkImageContent` uses `flatMap` with an async callback, which cannot flatten, and then calls `.flat()` on the awaited array. It works, but the `flatMap` is a `map` in disguise.
4. **Fixed.** A failed moderation request was logged and swallowed. The sidebar now shows "The moderation check failed. Try again." (CM-06) and keeps the previous results.
5. `checkImageContentAPI` sends `Content-Type: multipart/form-data;` on a GET request with no body.
6. The moderation endpoint is a hard-coded IMG.LY demo proxy in `moderation.ts` with only a comment saying to replace it. There is no environment variable for it, unlike the demo asset base URL in the sibling kits.
7. The moderation logic lives in `src/app/`, not `src/imgly/`, so the folder a customer is told to copy contains only the editor config and none of the moderation code the kit is about.
8. The empty-state text is rendered with `dangerouslySetInnerHTML` to get one `<br/>`.

### Coverage residue

None. Every executable line, branch and function of `src/**` is covered by the merged report.

## 8. Open questions

1. Issue 7: move `moderation.ts`, `utils.ts` and `types.ts` under `src/imgly/`, which is the folder the README and the kit conventions present as the copyable module. Recommended: yes. It is a move plus import updates, and it is what the other kits in this batch already do.
2. Issue 6: read the endpoint from `import.meta.env.VITE_MODERATION_API_URL` with the current proxy as the default, and add it to `.env.example`. Recommended: yes; the tests need an override anyway.
3. Issue 2: **decided and implemented** — a malformed response rejects. The sidebar still only logs it (issue 4), so the user sees no message; wiring that message into the UI is the remaining half.

## 9. Estimate

7 browser cases at about 10 s each: about 70 s on one worker. 7 headless cases at about 2 s: 14 s. Unit tests: under 1 s.

## 10. Boundary review

Rule used: the code that makes a decision owns the test for it. The kit decides which blocks are checked, the four categories, the 0.4 and 0.8 thresholds, the nudity inversion, the selection behaviour and the presentation. The engine decides what a fill holds and what selection means.

Core behaviour this plan leans on, and where it is covered today:

| Behaviour                                            | Owner  | Covered by                                                                                  |
| ---------------------------------------------------- | ------ | ------------------------------------------------------------------------------------------- |
| `block.findByKind('image')`                          | engine | `engine/lib/test/api/VariablesMetadataAPITest.cpp` (`findByKindGraphic`), `CoreAPITest.cpp` |
| `getFill` and `fill/image/imageFileURI`              | engine | `engine/lib/test/api/BlockPropertiesTest.cpp`, `PropertyRoundTripAPITest.cpp`               |
| `getSourceSet` returns the declared entries          | engine | `engine/lib/test/api/BlockPropertiesTest.cpp`, `PropertySweepAPITest.cpp`                   |
| `setSelected`, `findAllSelected`, `isAllowedByScope` | engine | `engine/lib/test/api/CoreAPITest.cpp`, `ScopesAPITest.cpp`                                  |
| `block.export` to PNG and PDF                        | engine | `engine/lib/test/api/ExportAPITest.cpp`                                                     |
| `ui.setComponentOrder`, Actions dropdown children    | editor | `apps/cesdk_web/packages/api/ui/UserInterfaceAPI.test.ts`                                   |
| `actions.register` overrides a built-in action       | editor | `apps/cesdk_web/packages/cesdk/registerDefaultActions.test.ts`                              |

No core coverage gap found for this kit.

## 11. Coverage pass

Cases added to close the merged-coverage gaps:

- **CM-U4 · unit · The actions the kit registers — every handler `setupActions` registers is invoked: `saveScene` downloads the saved scene as text, `exportDesign` downloads what `cesdk.utils.export` returned, `importScene` opens the picker for `.imgly,.scene,.zip`, revokes the blob URL on the success and on the failure path and then runs `zoom.toPage`, `exportScene` writes a JSON scene by default and a zip archive for `{ format: 'archive' }`, and `uploadFile` returns what `cesdk.utils.localUpload` returned**
- **CM-U5 · unit · DesignEditorConfig — `initialize` resets the editor, pins the editor compatibility version to the plugin's CE.SDK version, then applies features, UI, actions, shortcuts, translations and engine settings; with no `cesdk` in the context it touches the engine not at all**
- **CM-U6 · unit · Video timeline scaffold — `setupVideoTimeline` makes no editor call, so the kit ships the timeline example unapplied**
- **CM-U7 · removed.** `resolveAssetPath` is gone; the shared `tests/unit/demo-assets.test.ts` covers `src/imgly/demo-assets.ts`.

The only uncovered item left is the one below.
Residue: none from the asset base; `src/imgly/demo-assets.ts` is covered by the shared `tests/unit/demo-assets.test.ts`.
