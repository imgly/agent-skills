# Test plan: starterkit-batch-image-generation

Version 5, 5 Sep 2026. Status: implemented. 133 Vitest cases (unit, component and headless) and 10 browser cases run in `KIT_TEST_COVERAGE=1 npm run ci` (exit 0). Merged coverage is lines 100 %, branches 100 %, functions 100 %. One `test.fail()` pin remains (BIG-03b, known issue 10).

## 1. Purpose

Verify that the Batch Image Generation starter kit works as shipped: `batchRender` turns one template plus a list of records into one personalised image per record, and the demo app selects templates, edits the template and edits single cards.

## 2. Scope

In scope

- `src/imgly/batch-renderer.ts` — engine lifecycle, image replacement, variable substitution, export, disposal
- `src/app/constants.ts`, `src/app/templates.ts` — the employee records and the two templates
- The two editor configs (`advanced-editor` for the template, `design-editor` for a card) and the modal that uses them
- The demo app: template selector, card grid, edit flows

Out of scope

- What an export produces, what a variable substitution renders, image fill replacement. Engine behaviour; see section 10.
- The editor UI the modal renders. Covered by the core editor suite.
- The demo site around the kit. Covered by the `cesdk_web_demos` suite. Qase 1316, 1317, 1318, 1319, 1320, 1335, 1344, 2453.

## 3. Test environment

- Headless: `@cesdk/node` through the shared harness engine helper. Node, no DOM.
- Browser: Chrome, headless, 1400 × 900. Requests to `cdn.img.ly` fail the test.
- License: the shared test license (valid on hostname `localhost` only)
- Data: `public/scenes.json`, which holds the portrait and landscape scene strings. The portrait template carries the blocks `Photo`, `FirstName`, `LastName`, `Department`, `Background`, `LogoSmall` and the variables `FirstName`, `LastName`, `Department`. Photos come from `public/images/`.
- Downloads: captured by Playwright and checked by file name and size
- No `cdnAllowlist`. Both shipped scenes' Space Grotesk font URIs are relative to the engine's `baseURL`, so the suite runs with the CDN guard at its default.

## 4. Approach

| Kind     | Tool                          | What it checks                           | Run                 |
| -------- | ----------------------------- | ---------------------------------------- | ------------------- |
| Static   | tsc, eslint, convention check | Types, deprecated APIs, kit folder shape | `npm run check:all` |
| Unit     | Vitest                        | Record and template data, no engine      | `npm run test:unit` |
| Headless | Vitest + `@cesdk/node`        | `batchRender` against a real engine      | `npm run test:unit` |
| Browser  | Playwright                    | The test cases in section 5.1            | `npm run test:e2e`  |

All four run in the kit's `ci` script. Browser tests use role and label locators only.

## 5. Test cases

Format: ID, Qase ids, title. Then steps and expected result.

### 5.1 Browser

Common precondition: the kit is open and the six cards have finished their first render.

**BIG-01 · Qase 1360, 1361 · Default state**
Steps: open the kit.
Expected: two template buttons, Portrait selected and the only one offering Edit. Six card images, one per employee, each labelled with that employee's first and last name. Seven Edit buttons in total. The loading overlay is gone. No console errors. No request to `cdn.img.ly`.
Note: the department appears only inside the rendered picture, not in the DOM, so it is asserted headless instead.

**BIG-02 · Switch template**
Steps: click Landscape.
Expected: Landscape becomes the selected template, the card box changes from 180 × 240 to 260 × 150, and the six card images all change.

**BIG-03 · Qase 1362 · Edit the template**
Steps: click Edit on the selected template.
Expected: the modal opens in the `Creator` role with the dark theme and a close button at the start of the navigation bar. The variables `FirstName`, `LastName` and `Department` hold the placeholders Firstname, Lastname, Department.
Note: the title half is held separately as **BIG-03b**.

**BIG-04 · Qase 1388 · Save a template edit** and **BIG-04b · Qase 1389 · Discard one**
Steps: in the template editor recolour the `Background` block through the engine, then Save. Separately, recolour and close without saving.
Expected: after Save the modal closes and every one of the six card images changes. After the discarded edit all six are byte-identical.
Note: cards are compared by SHA-256 of their rendered bytes, not by screenshot. The recolour stands in for a user's edit; what the edit renders is engine behaviour.

**BIG-05 · Qase 1390 · Edit one card**
Steps: click Edit on the third card.
Expected: the modal opens in the `Adopter` role with the light theme, and the variables hold Daniel, Hauschildt, Co-Founder rather than the placeholders.
Note: the title is not rendered here either (known issue 10). What the Adopter role then permits is engine behaviour and is not re-tested here.

**BIG-06 · Qase 1391 · Save a card edit** and **BIG-06b · Qase 1392 · Discard one**
Steps: recolour the `Background` block on the third card and Save. Then edit another card and close without saving.
Expected: after Save only the third card's bytes change; the other five are byte-identical. The discarded edit changes nothing.

**BIG-07 · Qase 4399 · Export from the card editor**
Steps: edit a card, open the Actions dropdown and run Export Images.
Expected: one non-empty `.png` download.
Note: the Actions dropdown is the one locator that is not role+name — the builder renders it as an icon-only button with no accessible name, so it is reached by its `data-cy`. The dropdown holds Export Images only; Save is a top-level button.

### 5.2 Headless

**BIG-H1 · Qase 1361 · One result per item**
Steps: call `batchRender(portraitScene, [itemA, itemB])`.
Expected: two results in item order, each with a non-empty blob and a scene string that loads again.

**BIG-H2 · Variables are applied per item**
Steps: render two items with different `FirstName`, `LastName`, `Department`.
Expected: each item renders the same bytes as a single-item batch of that item, and the two differ.
Note: the plan expected the values to travel in the scene string. They do not — the variable store is engine state, not scene state (a reloaded result keeps whatever the engine currently holds), so per-item application is proved against a single-item render instead. A separate case pins that the scene string carries the `{{FirstName}}` reference rather than the value.

**BIG-H3 · Images are replaced by block name**
Steps: render one item with `images: { Photo: <file url> }`.
Expected: the `Photo` block's fill URI in the saved scene is that URL. An unknown block name is a no-op, not an error.

**BIG-H4 · The output format is honoured**
Steps: render with `mimeType: 'image/jpeg'`, then with the default.
Expected: blob types `image/jpeg` and `image/png`.

**BIG-H5 · An empty item list**
Steps: call with `items: []`.
Expected: resolves with an empty array. A second call still succeeds, which shows the engine from the first call was disposed.

**BIG-H6 · An item with no data** (expected failure, known issue 9)
Steps: call with `items: [item, {}]`.
Expected: the blank item renders the template's own placeholders, so its bytes differ from the preceding item's.
Note: this fails today — `batchRender` never clears the variable store between items, so the blank item inherits the previous item's values and renders byte-identical output. Held as `it.fails`. A second case pins that a blank item still produces a result.

**BIG-H7 · A scene with no page**
Steps: call with a scene string that has no page.
Expected: rejects with "No pages found in scene", and a following call still succeeds.

**BIG-H8 · Only the first page is exported**
Steps: call with a two-page scene, built by duplicating the portrait page.
Expected: one blob, the same pixel size as the single-page render. This pins today's behaviour, now stated in the `batchRender` doc comment; see known issue 2.

### 5.3 Unit

**BIG-U1 · Employee records**
`EMPLOYEES` has six entries with unique ids, a non-empty first name, last name and department, and an `imagePath` that is a bare `.png` file name with no leading slash.

**BIG-U2 · Templates**
Steps: stub `fetch` to return the shipped `scenes.json`, call `loadTemplates`.
Expected: keys `portrait` and `landscape`. Portrait: 180 × 240, `image/jpeg`, preview `images/empty_portrait.png`. Landscape: 260 × 150, `image/png`, preview `images/empty_landscape.png`. Both scene strings are non-empty.

**BIG-U3 · Editor configs**
Steps: call the two init functions with a recording double, and `setupFeatures` / `setupActions` / `setupNavigationBar` of both configs. `@cesdk/cesdk-js` and `@cesdk/cesdk-js/plugins` are `vi.mock`ed, because both read `window` at import time and `src/imgly/index.ts` imports them as values.
Expected: the template editor sets role `Creator` and the dark theme; the card editor sets role `Adopter` and sets no theme. The advanced config adds the crop-preset, effects, filters, blur, page-preset and text-component sources that the design config omits. Both register `saveScene`, `exportDesign`, `exportScene`, `importScene` and `uploadFile` — and no `exportImage`, which the fleet sweep deleted as unreachable — and both put Save Scene and Export Image under the Actions dropdown.
A double that answers every `addPlugin` with a promise the test settles by hand proves each entry point awaits its configuration plugin on its own and then puts every asset source in flight before any of them settles.
Note: the plan named five extra asset sources; there are six, because `TextComponentAssetSource` was missing from the list. Each feature list is asserted whole, and the two differ, which the plan did not say: only the template editor enables vector editing, shape editing, rulers and the placeholder controls, and only the card editor enables the document-settings button. See known issue 11.

**BIG-U4 · unit · Both editor configuration trees**
Run through `describe.each` over the advanced and the design tree, so a change made to one and not the other fails. Each tree docks the asset library on the left and its inspector on its own side (advanced right, design left), positions the panels before it orders any component, orders the same five bars, puts the add-page button in a bottom canvas bar, offers the same canvas-menu and inspector-bar entries, sets its own dock label style (advanced hides labels, design shows them), writes the same crop and page settings, registers no custom component, translation or timeline control, and installs its own US ANSI catalog object. Each `initialize` resets the editor first, pins the editor compatibility version to the CE.SDK version once, as the very next call, and does nothing at all without a `cesdk`.

**BIG-U5 · unit · The action handlers of both trees**
`saveScene`, `exportDesign`, `importScene` (including the object-URL release), `exportScene` (text by default, zip on request) and `uploadFile`, asserted per tree.

**BIG-U6 · removed.** `resolveAssetPath` is gone; `src/imgly/demo-assets.ts` derives the URL from `VITE_DEMO_ASSETS_BASE_URL` or the kit's own URL.

**BIG-C1 · component · `TemplateSelector`**
Selects another template by click and by the Enter key, reports nothing for the template already selected, and opens the editor from the selected template only.

**BIG-C2 · component · `App`**
Renders one card per employee once the templates arrive and reports the demo `shell` phase, since no editor mounts until the visitor acts; reports templates it cannot load and stops the loading overlay, and drops templates that arrive after it unmounts.

**BIG-U7 · unit · `src/index.tsx`**
The entry mounts the app into `#root`, and fails loudly with `Root container not found` when the page ships no such element.

**BIG-U8 · unit · `batchRender` and the engine it owns**
Boots its own engine when the caller hands it none and disposes it again, including when the scene has no page; leaves an engine the caller owns alone.

**KB-01 · unit · Keyboard catalog predicates**

`tests/unit/keyboard-catalog.test.ts` runs every `run` and `when` of `src/imgly/config/advanced-editor/keyboard/catalogs/us-ansi.ts`, `src/imgly/config/design-editor/keyboard/catalogs/us-ansi.ts` against 1620 editor states (5 edit modes, 9 selections, 3 roles, features on and off, 3 vector states, page and no page) and asserts that none throws, that every shortcut activates in at least one state, and that every function `run` reaches `cesdk.actions.run`. Kit-owned: the kit decides which key does what and when it is live. The catalog measures 100 % lines, branches and functions.

## 6. Entry and exit criteria

Entry: engine and editor built; test license available; the shared kit test harness exists (headless engine helper, browser boot helper, download helper, console and network guards); a `window.cesdk` hook reachable while the modal is open.

Exit: every case in section 5 passes locally and in CI. `npm run ci` passes. The published kit contains no test files. A release run reports results to the Qase ids above.

Measured at version 2: `npm run ci` exits 0 with 82 Vitest tests (67 unit, 15 headless; BIG-H6 is an expected failure) and 10 Playwright tests (BIG-03b is an expected failure). Vitest coverage of `src/**` is lines 47.97, statements 47.97, functions 13.09, branches 91.17, and `tests/coverage-thresholds.json` gates at those values rounded down. The merged Vitest-plus-browser line reported by `merge-coverage.mjs` is lines 71.23, branches 92.31, functions 13.10.

## 7. Known issues found while writing this plan

Confirmed by reading the code. Confirm each with a test before fixing.

1. `batchRender` boots and disposes a whole engine on every call. Saving one card re-boots the engine for a single render, and switching template re-boots it for six. **Partly fixed:** `BatchRenderOptions.engine` now lets a caller supply one, and `batchRender` disposes only an engine it created. The demo app still passes none, so its own behaviour is unchanged.
2. `batchRender` exports `pages[0]` only. A template with more than one page silently loses the rest and the result says nothing about it. **Documented** in the function's doc comment; pinned by BIG-H8. Multi-page export stays a follow-up.
3. `renderAllEmployees` is an unguarded async function. A template switch while a render is in flight leaves two runs writing `teamImages`, and the last one to finish wins regardless of which template is selected.
4. **Fixed** (conventions work, not this plan): `check:lint` now globs `**/*.{ts,tsx,js}`, so the kit's seven `.tsx` files are linted.
5. `MimeType` in `batch-renderer.ts` allows `image/webp`, but `Template.outputFormat` allows only PNG and JPEG, so the app can never reach that branch.
6. `handleSaveTemplate` puts a blob URL into `previewImagePath` and nothing revokes it. Each template save leaks one, and the card placeholders then point at it.
7. `loadTemplates` does not check the response status. A failed `scenes.json` fetch is caught, logged once and leaves the page with no templates and no message.
8. `src/index.tsx` contains an empty `// Local assets for development` comment followed by a blank line inside the config object, left over from generation.
9. ~~`batchRender` never clears the variable store between items.~~ **Fixed in v3.** `batchRender` snapshots the variable store once, resets to that snapshot before every item, and restores it before returning, so a reused engine is handed back unchanged. The engine's own five default variables survive. BIG-H6 asserts it, plus two new cases for the ordering and for the reused engine.
10. **Fixed.** Neither editor rendered a title: `EditorModal` passed the title as `{ payload: { title } }`, while an order entry carries its payload as its own fields (`{ id, title }`). BIG-03b pins the title.
11. The two editor configs enable different feature sets, and the split looks inverted for the placeholder group: only the template editor (Creator) enables `ly.img.placeholder.*`, while the card editor (Adopter) — the role those features govern — does not. Pinned by a unit case rather than fixed.

### Coverage residue

None. Every executable line, branch and function of `src/**` is covered by the merged report.

## 8. Open questions

1. **Resolved: yes.** `BatchRenderOptions.engine` is optional; `batchRender` disposes only an engine it created. The documented call is unchanged, and the headless suite now shares one engine across all fifteen cases.
2. **Resolved: document page one now.** Stated in the `batchRender` doc comment. Multi-page export is a follow-up.
3. **Resolved** by the conventions work: `check:lint` globs `.tsx` too.
4. New: should `batchRender` reset the variable store between items (issue 9)? Recommended: yes — clear the keys an earlier item set, so items are independent. Not done here; it changes shipped behaviour.
5. New: the placeholder-feature split between the two configs (issue 11) looks inverted. Needs a product decision, not a test.

## 9. Estimate

Measured: 10 browser cases in 49 s on one worker, 15 headless cases in 2.8 s (one shared engine), 67 unit tests in under 20 ms. The whole `npm run ci` takes about 90 s.

## 10. Boundary review

Rule used: the code that makes a decision owns the test for it. The kit decides the engine lifecycle, the per-item apply order, which page it exports, the record and template data, and the two editor roles. The engine decides what a variable substitution renders and what an export contains.

Core behaviour this plan leans on, and where it is covered today:

| Behaviour                                            | Owner  | Covered by                                                                    |
| ---------------------------------------------------- | ------ | ----------------------------------------------------------------------------- |
| `block.findByName` and `block.findByType('page')`    | engine | `engine/lib/test/api/CoreAPITest.cpp`, `HierarchyAPITest.cpp`                 |
| `fill/image/imageFileURI` set and read back          | engine | `engine/lib/test/api/BlockPropertiesTest.cpp`, `PropertyRoundTripAPITest.cpp` |
| `block.export` honours `mimeType`                    | engine | `engine/lib/test/api/ExportAPITest.cpp`                                       |
| `scene.saveToString` / `scene.load` round-trip       | engine | `engine/lib/test/api/LoadSceneAPITest.cpp` (`sceneStringRoundTrips`)          |
| `editor.setRole` changes the effective scopes        | engine | `engine/lib/test/api/EditorAPITest.cpp`, `ScopesAPITest.cpp`                  |
| `resetEditor` re-applies the current role            | editor | `apps/cesdk_web/packages/cesdk/resetEditor.test.ts`                           |
| `ui.insertOrderComponent`, `ui.updateOrderComponent` | editor | `apps/cesdk_web/packages/api/ui/UserInterfaceAPI.test.ts`                     |
| `actions.register` overrides a built-in action       | editor | `apps/cesdk_web/packages/cesdk/registerDefaultActions.test.ts`                |

Core coverage gap found, and closed on this branch:

1. Engine: setting a text variable changes what the text block renders. `engine/lib/test/api/VariablesMetadataAPITest.cpp` gained `setVariableStringRendersSubstitutedTextLine`, `setVariableStringUpdateReRendersTextLine` and `setVariableStringLeavesRawTextTemplated`, which is the substitution this kit is built on.

BIG-H2 keeps a decoded-export assertion as this kit's end-to-end proof that the variable reached the picture.
