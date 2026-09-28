# Test plan: starterkit-design-validation

Version 7, 7 Sep 2026. Status: implemented. 62 unit, component and headless tests and 8 browser tests run in `npm run ci` (exit 0). Merged coverage is lines 100 %, branches 99.33 %, functions 100 %.

## 1. Purpose

Verify that the Design Validation starter kit works as shipped: the four checks find the right blocks in the demo design, the sidebar lists them, selecting a result selects the block, and fixing a problem removes its entry.

## 2. Scope

In scope

- `src/imgly/validation.ts` — the four checks and the state each assigns
- `src/imgly/utils.ts` — overlap maths, page lookup, layer order, image quality
- `src/app/Sidebar/Sidebar.tsx` — the validation list, the re-run on history change, block selection
- `src/app/ResultItem/ResultItem.tsx` — icon and label presentation
- The editor config (`src/imgly/config/`) and its export actions

Out of scope

- Bounding boxes, boolean shape operations, scopes, export output. Engine behaviour; see section 10.
- The editor UI itself. Covered by the core editor suite.
- The demo site around the kit. Covered by the `cesdk_web_demos` suite. Qase 1393, 1394, 1395, 1396, 1397, 1412, 1421, 2455.

## 3. Test environment

- Headless: `@cesdk/node` through the shared harness engine helper. Node, no DOM. The validators now take a `CreativeEngine` directly (open question 2), and `validateLowResolution` takes an image-size probe (open question 1); the headless tests pass a `sharp`-based probe for the shipped scene and fixed sizes for the threshold cases.
- Browser: Chrome, headless, 1400 × 900. Requests to `cdn.img.ly` fail the test.
- License: the shared test license (valid on hostname `localhost` only)
- Data: `public/assets/example.scene`. One page holding a background graphic, three text blocks and a `TrashHand` image; three findings.
- No `cdnAllowlist`. The scene's TrashHand font URI is relative to the engine's `baseURL`, so the suite runs with the CDN guard at its default.
- Downloads: captured by Playwright and checked by file type and PDF page count

## 4. Approach

| Kind     | Tool                          | What it checks                                              | Run                 |
| -------- | ----------------------------- | ----------------------------------------------------------- | ------------------- |
| Static   | tsc, eslint, convention check | Types, deprecated APIs, kit folder shape                    | `npm run check:all` |
| Unit     | Vitest                        | Overlap maths and presentation, no engine                   | `npm run test:unit` |
| Headless | Vitest + `@cesdk/node`        | The four checks against a real engine and the shipped scene | `npm run test:unit` |
| Browser  | Playwright                    | The test cases in section 5.1                               | `npm run test:e2e`  |

All four run in the kit's `ci` script. Browser tests use role and label locators only.

## 5. Test cases

Format: ID, Qase ids, title. Then steps and expected result.

### 5.1 Browser

Common precondition: the kit is open and the sidebar header reads "Check performed".

**DV-01 · Qase 1437 · Default state**
Steps: open the kit.
Expected: the sidebar shows "Check performed" and "3 results" with three Select buttons, one of them a Low resolution row and no Text partially hidden row. No console errors. No engine asset from the CDN.
Note from the run: the first pass used to read bounding boxes before the images and fonts had loaded, so this case asserted only the sum of the two labels. Since the fix to known issue 10 it asserts the split: one _Outside of page_ and one _Protrudes from page_.

**DV-02 · Qase 1439 · Outside of page**
Steps: click Select on a Protrudes from page row, then move the selected block far off the page and commit the edit.
Expected: exactly that block is selected. The sidebar re-runs on its own and reports two Outside of page rows and no protruding row, still three findings in total.
Note from the run: the shipped scene has no Outside of page row on load, so the case creates one instead of clearing one.

**DV-03 · Qase 1442 · Protrudes from page**
Steps: click Select on the Protrudes from page row, then shrink the block and move it fully inside the page.
Expected: no protruding row is left, one Outside of page row remains and the header reads "2 results".

**DV-04 · Qase 1443 · Low resolution**
Steps: click Select on the Low resolution row, then scale the image down until it fits its source resolution.
Expected: the Low resolution row disappears.

**DV-05 · Qase 1444 · New problems appear**
Steps: drop a rectangle on top of an existing text block and commit the edit.
Expected: a Text partially hidden row appears without any manual refresh and the header reads "4 results".
Note from the run: a text block added by a test carries no typeface, and the check's intersection fails on it, so the case covers an existing text instead of a new one.

**DV-06 · Qase 1445 · A clean design**
Steps: fix or delete every reported block.
Expected: the list is replaced by "No design errors found." and "Move elements around to see a different result.", and the header reads "0 results".

**DV-07a · Qase 1410 · Export an image**
Steps: click "Export Images" in the navigation bar.
Expected: a PNG downloads whose aspect ratio matches the page.
Note from the run: `ly.img.exportImage.navigationBar` is hoisted out of the Actions dropdown into the bar, and it runs `exportDesign` with no target size, so the file comes out at the page's own size. Split from DV-07b because the editor's export progress dialog covers the navigation bar until it closes.
Asserts the options the kit passes to `engine.block.export` and that a file of the declared type downloaded; the exported pixel size belongs to `engine/lib/test/api/ExportAPITest.cpp`.

**DV-07b · Qase 1411 · Export a PDF**
Steps: open the Actions dropdown and run Export PDF.
Expected: the dropdown holds exactly one entry, Export PDF, and it downloads a one-page PDF.
Asserts the options the kit passes to `engine.block.export` and that a file of the declared type downloaded; the exported pixel size belongs to `engine/lib/test/api/ExportAPITest.cpp`.

### 5.2 Headless

**DV-H1 · Qase 1437 · The shipped scene**
Steps: load `public/assets/example.scene`, run all four checks with a `sharp`-based image probe, then run them twice more.
Expected: one Outside of page (`failed`), one Protrudes from page (`warning`) and one Low resolution (`warning`), identical across the two later runs.
Note from the run: before the resources have loaded, a pass reports two protruding blocks and no outside block. The case loads them with `forceLoadResources` before asserting, as the sidebar does. See known issue 10.

**DV-H2 · Qase 1439 · Outside of page**
Steps: build a one-page scene with a block inside the page, one straddling the edge and one entirely beyond it. Run `validateOutsideBlocks`.
Expected: only the third block, with state `failed` and the block's kind.

**DV-H3 · Qase 1442 · Protrudes from page**
Steps: same scene. Run `validateProtrudingBlocks`.
Expected: only the straddling block, with state `warning`. A block covering 100 % of the page is not reported; one hanging 2 % over the edge is.

**DV-H4 · Text partially hidden**
Steps: on the shipped scene, put a rectangle over one of its text blocks; then a rectangle far away; then a group over the text.
Expected: the text is reported once, for the overlapping rectangle. The rectangle beside it and the group do not cause a report.
Note from the run: the case must build on the shipped scene's text. A text block created through the API carries no typeface, so `block.combine` fails with `BLOCK.TEXT_NO_TYPEFACE` rather than returning an empty shape.

**DV-H5 · The check leaves no residue**
Steps: count the blocks in the scene, run `validatePartiallyHiddenTexts`, count again.
Expected: the same count and the same block ids. Nothing is left selected.

**DV-H6 · Qase 1443 · Low resolution**
Steps: with an injected image-size probe, run `getImageBlockQuality` and `validateLowResolution` on a 100 px frame whose source is 50, 85 and 120 px.
Expected: quality 0.5, 0.85 and 1.2, reading as `failed`, `warning` and `success`.

**DV-H7 · Image quality fallbacks**
Steps: call `getImageBlockQuality` on a block with no image URI, and on a block whose image cannot be measured.
Expected: 1 in both cases, so neither is reported (see known issue 6).

**DV-H8 · An empty page**
Steps: run all four checks on a scene with one empty page.
Expected: every check returns an empty array and none of them throws.

### 5.3 Unit

**DV-U1 · Overlap maths**
Through the exported validators with a fake engine returning fixed bounding boxes: disjoint boxes give no report; identical boxes give full overlap; a box half over the page is reported as protruding; a zero-area block is not reported (division guard).

**DV-U2 · Presentation** — _dropped for this wave._ `getBlockDisplayName` stays module-private (open question 3 was not decided), so exporting it purely for a test would be a test hook in shipped code. DV-01 covers the labels it produces through the rendered list instead.

**DV-U3 · Editor config**
Steps: call `setupFeatures`, `setupActions` and `setupNavigationBar` with a recording double.
Expected: the navigation bar order is undo/redo, page resize, spacer, title, spacer, zoom, preview, and an Actions dropdown whose children are exactly `ly.img.exportImage.navigationBar` and `ly.img.exportPDF.navigationBar`. `setupActions` registers `saveScene`, `exportDesign`, `importScene`, `exportScene` and `uploadFile`, and registers no `exportImage` — the fleet sweep deleted that unreachable action. `setupFeatures` enables one flat list of 100 ids, asserted as the whole array: each control is named on its own (`ly.img.navigation.bar`, `ly.img.page.add`, `ly.img.text.edit`), never the `ly.img.navigation`, `ly.img.page` or `ly.img.text` parents, and no video feature. `initDesignValidationEditor` adds the configuration, then the fifteen asset sources through one `Promise.all`, which a case proves by holding every `addPlugin` open and checking all fifteen were requested before any of them resolved.

**DV-U9 · unit · `getPartiallyHiddenTexts` and the engine's empty-shape error**
Against a stand-in engine whose `combine` fails: the catalog empty-shape code reads as "the two blocks do not intersect", and any other failure is rethrown.

**DV-U10 · unit · `getImageBlockQuality` without a scene**
Reports full quality and measures no image when the engine holds no scene.

**DV-U11 · removed.** `resolveAssetPath` is gone; `src/imgly/demo-assets.ts` derives the URL from `VITE_DEMO_ASSETS_BASE_URL` or the kit's own URL.

**KB-01 · unit · Keyboard catalog predicates**

`tests/unit/keyboard-catalog.test.ts` runs every `run` and `when` of `src/imgly/config/keyboard/catalogs/us-ansi.ts` against 1620 editor states (5 edit modes, 9 selections, 3 roles, features on and off, 3 vector states, page and no page) and asserts that none throws, that every shortcut activates in at least one state, and that every function `run` reaches `cesdk.actions.run`. Kit-owned: the kit decides which key does what and when it is live. The catalog measures 100 % lines, branches and functions.

## 6. Entry and exit criteria

Entry: engine and editor built; test license available; the shared kit test harness exists (headless engine helper, browser boot helper, download helper, console and network guards). The kit already sets `window.cesdk`.

Exit: every case in section 5 passes locally and in CI. `npm run ci` passes. The published kit contains no test files. A release run reports results to the Qase ids above.

## 7. Known issues found while writing this plan

Confirmed by reading the code. Confirm each with a test before fixing.

1. `getBlockIdsAbove` takes `findByType('page')[0]` rather than the block's own page. On a scene with more than one page every text block is compared against page one's child order, so the hidden-text check is wrong from page two on.
2. `getProtrudingBlocks` measures against `findByType('page')[0]` too, while `getOutsideBlocks` walks up to the block's real parent page with `findParentPage`. The two checks disagree on a multi-page scene.
3. **Fixed.** `getPartiallyHiddenTexts` now branches on `error.code === 'BLOCK.RESULT_EMPTY_SHAPE'` instead of matching the message text, which differs between the internal and the customer engine build.
4. `getPartiallyHiddenTexts` mutates the scene during what reads as a read-only pass: it duplicates two blocks per candidate pair, combines them and destroys the result. It works today only because those calls record no undo step; if the kit ever wrapped validation in `editor.addUndoStep`, the sidebar's `onHistoryUpdated` subscription would re-enter it.
5. `resolutionCache` is a module-level map keyed by URL, never evicted and never invalidated. Replacing an image at the same URL keeps the old resolution for the life of the page.
6. The browser probe now rejects with a real `Error`, but `getImageBlockQuality` still catches it and returns 1, so a broken or unreachable image is reported as perfect quality. DV-H7 pins that.
7. The sidebar re-runs all four checks on every history update, and `validateLowResolution` awaits an image measurement per image block. On a large design every edit costs a full pass.
8. The kit ships two byte-identical `resolveAssetPath.ts` files, one under `src/imgly/` and one under `src/app/`.
9. **Fixed.** `validation.ts` and `utils.ts` now take a `CreativeEngine`, and `Sidebar.tsx` passes `cesdk.engine`.

10. ~~The sidebar runs the checks as soon as the editor mounts, before the engine has finished laying the scene out.~~ **Fixed.** Bounding boxes are only final once every image and font has loaded, so `runValidationChecks` awaits `engine.block.forceLoadResources([scene])` before the checks read them. Reruns stay on history commits, as before.

### Coverage residue

One branch of `src/**` is left: the `!cesdk` guard in `runValidation` (`src/app/Sidebar/Sidebar.tsx:148`). Unreachable by construction — the effect that calls it returns earlier on the same condition, and the two engine listeners exist only while an editor does.

## 8. Open questions

1. **Decided and implemented.** `getImageBlockQuality(engine, imageId, measureImage?)` and `validateLowResolution(engine, measureImage?)` take an image-size probe that defaults to `measureImageInBrowser`, the previous DOM implementation. The URL cache stays inside that default, so an injected probe is never served a cached size.
2. **Decided and implemented.** The validators take `engine: CreativeEngine`.
3. `getBlockDisplayName` is module-private in `Sidebar.tsx`. Not decided, so it stays private and DV-U2 is dropped; DV-01 asserts the label it renders for the image row. Recommended still: export it, or move it beside the other presentation helpers.
4. **Decided and implemented.** The check matches `error.code === 'BLOCK.RESULT_EMPTY_SHAPE'`. The core gap in section 10 stays open.

## 9. Estimate

7 browser cases at about 12 s each: about 90 s on one worker. 8 headless cases at about 2 s: 16 s. Unit tests: under 1 s.

## 10. Boundary review

Rule used: the code that makes a decision owns the test for it. The kit decides which four checks run, what counts as outside, protruding or hidden, the 0.99 overlap threshold, the 0.7 and 1.0 quality thresholds, the state each finding gets, and the presentation. The engine decides bounding boxes, boolean shape results and scopes.

Core behaviour this plan leans on, and where it is covered today:

| Behaviour                                                     | Owner          | Covered by                                                                            |
| ------------------------------------------------------------- | -------------- | ------------------------------------------------------------------------------------- |
| `getGlobalBoundingBox{X,Y,Width,Height}`                      | engine         | `engine/lib/test/api/BlockLayoutTest.cpp`, `CropAPITest.cpp`                          |
| `block.combine(…, 'Intersection')` and its empty-result error | engine         | `engine/lib/test/api/UBQCombineShapeTypesAPITest.cpp`, `GroupingCombiningAPITest.cpp` |
| `block.duplicate` / `destroy` / `isValid`                     | engine         | `engine/lib/test/api/BlockLifecycleTest.cpp`                                          |
| `getParent`, `getChildren` child order                        | engine         | `engine/lib/test/api/HierarchyAPITest.cpp`                                            |
| `getCropScaleY`, `scene/designUnit`, `scene/dpi`              | engine         | `engine/lib/test/api/CropAPITest.cpp`, `BlockPropertiesTest.cpp`                      |
| `isAllowedByScope`, `setSelected`, `findAllSelected`          | engine         | `engine/lib/test/api/ScopesAPITest.cpp`, `CoreAPITest.cpp`                            |
| `editor.onHistoryUpdated` fires on a change                   | engine binding | `bindings/wasm/js_node/src/EditorAPI.test.ts`                                         |
| `ui.setComponentOrder`, Actions dropdown children             | editor         | `apps/cesdk_web/packages/api/ui/UserInterfaceAPI.test.ts`                             |
| `actions.register` overrides a built-in action                | editor         | `apps/cesdk_web/packages/cesdk/registerDefaultActions.test.ts`                        |

Core coverage gap found (to add in the core suites, not in this kit):

1. Bindings: a failing `block.combine` rejects with an `EngineError` whose `code` is `BLOCK.RESULT_EMPTY_SHAPE`. The C++ side is covered by `UBQCombineShapeTypesAPITest.cpp`, but no JS test asserts the code that reaches a caller, and this kit branches on it. Suggested home: `bindings/wasm/js_node/src/__tests__/`, a new `combineErrors.test.ts`, asserting `code` rather than `message` so the internal and customer builds agree.

Until the gap is closed, DV-H4 keeps a direct assertion that a non-overlapping pair produces no finding, which is the behaviour the string match stands in for.

## 11. Coverage pass

Cases added to close the merged-coverage gaps:

- **DV-U4 · unit · The actions the kit registers — every handler `setupActions` registers is invoked: `saveScene` downloads the saved scene as text, `exportDesign` downloads what `cesdk.utils.export` returned, `importScene` opens the picker for `.imgly,.scene,.zip`, revokes the blob URL on the success and on the failure path and then runs `zoom.toPage`, `exportScene` writes a JSON scene by default and a zip archive for `{ format: 'archive' }`, and `uploadFile` returns what `cesdk.utils.localUpload` returned**
- **DV-U5 · unit · DesignEditorConfig — `initialize` resets the editor, pins the editor compatibility version to `CreativeEditorSDK.version` as its second call, then applies features, UI, actions, shortcuts, translations and engine settings; with no `cesdk` in the context it touches the engine not at all**
- **DV-U6 · unit · Video timeline scaffold — `setupVideoTimeline` makes no editor call, so the kit ships the timeline example unapplied**
- **DV-U7 · unit · `measureImageInBrowser` — reports the natural size of the loaded image, answers a second call for the same URL from its cache, and rejects when the image cannot be loaded**
- **DV-U8 · removed.** `resolveAssetPath` is gone; the shared `tests/unit/demo-assets.test.ts` covers `src/imgly/demo-assets.ts`.
- **DV-H9 · headless · design units and crop scale — a Millimeter and an Inch frame are measured in pixels, and a block that reports no crop scale falls back to 1**
- **DV-H10 · headless · a scene without a page — no hidden text, and the loose text reported as outside the page**

Residue, measured and classified:

- `src/imgly/utils.ts:152-154`, the rethrow for an error from `engine.block.combine` that is not the empty-shape catalog error. Reaching it needs the engine to fail differently, which no scene can be built to do.
- `src/imgly/utils.ts:230`, `if (!scene) return 1`. `getFrameWidth` runs four lines earlier and fails with `Block … is not attached to a scene`, so the function cannot reach line 230 with no scene. Measured: the case throws before the guard.
- `src/app/Sidebar/Sidebar.tsx:148`, the `!cesdk` guard inside `runValidation`. The effect that calls it returns earlier on the same condition, and the two engine listeners only exist while an editor does, so the guard cannot be reached.
- None from the asset base; `src/imgly/demo-assets.ts` is covered by the shared `tests/unit/demo-assets.test.ts`.

Cases added for the screens:

- **DV-C1 · component · the validation sidebar** — pending before the first run; a clean design once every check has run; every block kind named the way the panel decides, including the truncated text, the `Unknown` fallback and a layer name that beats the kind; a click that selects the block a result names and one that leaves a locked block alone; a re-run when the blocks settle and when history commits; a batch naming only destroyed blocks ignored; both subscriptions released on unmount; and no name and no selection once the editor is gone.
- **DV-C2 · component · the app shell** — `init` publishes `window.cesdk`, configures the editor, loads the demo scene and posts the demo lifecycle beacon `created` then `ready`; the editor's `onLoadingStateChange` is the beacon's own handler; `onError` logs the message and its cause.
