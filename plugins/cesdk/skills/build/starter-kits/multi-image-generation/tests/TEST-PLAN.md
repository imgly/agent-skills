# Test plan: starterkit-multi-image-generation

Version 5, 5 Sep 2026. Status: implemented. 140 Vitest cases (unit, component and headless) and 11 browser cases run in `npm run ci` (exit 0); merged coverage is lines 100 %, branches 100 %, functions 100 %.

## 1. Purpose

Verify that the Multi-Image Generation starter kit works as shipped: picking a restaurant fills three templates with that brand's images, text, rating and colours, and each generated card can be edited on its own.

## 2. Scope

In scope

- `src/imgly/generation.ts` — `fillTemplate`, `applyRestaurantColors`, `generateAssets`, `renderSceneToImage`
- `src/imgly/utils.ts` — `hexToRgba`, `replaceImageByName`, `exportSceneAsImage`
- `src/app/restaurant-catalog.ts`, `src/app/template-catalog.ts`, `src/app/scenes.json`
- The two editor configs (`design-editor` for Adopter, `advanced-design-editor` for Creator) and the modal that picks between them
- The demo app: restaurant selector, asset grid, edit flow

Out of scope

- What a colour or visibility change renders, what an export contains. Engine behaviour; see section 10.
- The editor UI the modal renders. Covered by the core editor suite.
- The demo site around the kit. Covered by the `cesdk_web_demos` suite. Qase 1297, 1298, 1299, 1300, 1301, 1302, 1303, 2452.

## 3. Test environment

- Headless: `@cesdk/node` through the shared harness engine helper. Node, no DOM. The tests create the engine themselves; the kit's own `initMultiImageGenerationHeadlessEngine` cannot run on Node (see known issue 8).
- Browser: Chrome, headless, 1400 × 900. Requests to `cdn.img.ly` fail the test. No `cdnAllowlist`. The three demo scenes' typeface font URIs are relative to the engine's `baseURL`, and all demo images are served locally.
- License: the shared test license (valid on hostname `localhost` only)
- Engine assets (headless): the flat bundle the dev server serves, `apps/cesdk_web/build/assets` or `@cesdk/node`'s own `assets/` once `build:assets` has run. The versioned `assets/` tree does not work: the scenes reference `/ly.img.filter.lut/...` by root-relative path, and the fixture fails loudly with a build hint when no bundle carries it.
- Data: `src/app/scenes.json` with the keys `square`, `portrait`, `landscape`. The square scene carries the blocks `RestaurantPhoto`, `RestaurantLogo`, `RestaurantName`, `Price`, `ReviewCount` and `Rating1` to `Rating5`, and the variables `Name`, `$$` and `Count`. The restaurant photos and logos load from `staticimgly.com` at run time, and the same files are in the repo at `packages/cesdk-web-examples-data/data/starterkit-multi-image-generation/images/`. Headless cases use that directory over `file://`; in dev mode `cesdk-js-dev` injects `VITE_DEMO_ASSETS_BASE_URL` automatically, pointing at the local CDN daemon that serves it, so the CDN guard stays meaningful. The files are git-LFS; materialize them with `git lfs pull -X '' -I 'packages/cesdk-web-examples-data/data/starterkit-multi-image-generation/**'` or the headless fixture fails with that hint.

## 4. Approach

| Kind     | Tool                          | What it checks                                        | Run                 |
| -------- | ----------------------------- | ----------------------------------------------------- | ------------------- |
| Static   | tsc, eslint, convention check | Types, deprecated APIs, kit folder shape              | `npm run check:all` |
| Unit     | Vitest                        | Colour conversion and the two catalogs, no engine     | `npm run test:unit` |
| Headless | Vitest + `@cesdk/node`        | Template filling and generation against a real engine | `npm run test:unit` |
| Browser  | Playwright                    | The test cases in section 5.1                         | `npm run test:e2e`  |

All four run in the kit's `ci` script. Browser tests use role and label locators only.

## 5. Test cases

Format: ID, Qase ids, title. Then steps and expected result.

### 5.1 Browser

Common precondition: the kit is open and the three empty asset cards are shown.

**MIG-01 · Qase 1311 · Default state**
Steps: open the kit.
Expected: the Select Restaurant section shows three buttons, all `aria-pressed="false"`. The asset grid shows three cards labelled Square, Portrait and Landscape, each still on its `placeholder-N.png` preview. No console errors. No engine asset from the CDN.

**MIG-02 · Qase 1312, 1313, 1314 · Generate for each restaurant**
Steps: click "Bean there Bean good". Then "Scoop there it is". Then "BUN intended".
Expected: each click sets `aria-pressed="true"` on that button and `false` on the other two, and replaces all three cards with freshly rendered `blob:` images. The nine renders are all distinct, so no restaurant reuses another's asset.
Expected corrected: which photo, logo, name, rating and colour end up in the picture is asserted headless (MIG-H1, MIG-H2, MIG-H4), not in the browser — the browser can only see an opaque JPEG. The kit's selection wiring is what this case proves.

**MIG-02b · Buttons are disabled while generating**
Steps: select a restaurant and watch the three buttons.
Expected: all three are disabled during the run and enabled again when the last card lands.

**MIG-03 · Deselecting a restaurant**
Steps: click the selected restaurant again.
Expected: it is deselected and the three cards return to empty.

**MIG-04 · Qase 3688 · Edit one card**
Steps: with a restaurant selected, hover the Portrait card and click Edit.
Expected: the modal opens in the design (Adopter) editor with the light theme, one page, the `Name` variable set to the selected restaurant, and a Back and a Save button. The kit sets `common.title` to "<restaurant> - Portrait".
Expected corrected: the navigation bar renders no visible title even though `ly.img.title.navigationBar` is in the order and the translation is set, so the title is asserted through `i18n.translate('common.title')`. Recorded as known issue 12.

**MIG-05 · Qase 3689 · Save a card edit**
Steps: open the Portrait card, change the `RestaurantName` text, click Save.
Expected: the modal closes, the kit clears `window.cesdk`, the Portrait card re-renders and the Square and Landscape cards keep their exact previous `src`.

**MIG-05b · Qase 3690 · Discard a card edit**
Steps: open the Landscape card, change the text, press Escape.
Expected: the modal closes and all three card sources are unchanged.

**MIG-06 · Qase 4398 · Export the edited card**
Steps: open the Portrait card, change the text, open the actions dropdown and run Export Images.
Expected: exactly one PNG download with a decodable pixel size.
Note: the actions dropdown trigger carries no accessible name, so this case uses its builder `data-cy` hook — the same escape hatch the pilot documents for the builder's Select controls. Recorded as known issue 13.

**MIG-07 · no Qase case · Creator mode**
Steps: open a template card without selecting a restaurant.
Expected: the modal opens in the advanced (Creator) editor with the dark theme, one page, a Back and a Save button, and the template's own label as `common.title`. The view style is not asserted here: the kit resets it, see known issue 14.

**MIG-08 · no Qase case · The Creator editor's template tools**
Steps: open a template in Creator mode and read the feature flags.
Expected: `ly.img.placeholder`, `ly.img.vectorEdit`, `ly.img.shape.edit` and `ly.img.rulers` are all enabled, which is what separates Creator from Adopter mode.

**MIG-09 · no Qase case · Leaving the Creator editor**
Steps: open a template in Creator mode, then click Back.
Expected: the modal closes and the three cards keep their sources.

### 5.2 Headless

**MIG-H1 · Qase 1312 · fillTemplate fills a scene**
Steps: call `fillTemplate(engine, SCENES, 'square', beanThere)`.
Expected: the variables `Name`, `$$` and `Count` hold "Bean there Bean good", "$$" and "281". The `RestaurantPhoto` and `RestaurantLogo` fill URIs are the restaurant's paths, their crop is reset and their content fill mode is Cover.

**MIG-H2 · Qase 1312, 1313, 1314 · Rating stars**
Steps: fill with ratings 1, 5, 3 and 0.
Expected: `Rating1` visible and `Rating2` to `Rating5` hidden; then all five visible; then the first three; then none. A rating of 7 saturates all five and −1 hides all five, both without complaint. The correct-behaviour case (a range check that rejects) is written as an expected failure against known issue 5.

**MIG-H3 · An unknown scene key**
Steps: call `fillTemplate` with `sceneKey: 'nope'`.
Expected: rejects with "Scene not found: nope" and the scene that was already loaded is untouched.
Expected corrected: the plan said "no scene is loaded"; `fillTemplate` throws before `scene.load`, so whatever was loaded before stays loaded. The test asserts the saved scene string is byte-identical across the failed call.

**MIG-H4 · Brand colours**
Steps: build a scene with a pure white text block, a pure black text block, a mid-grey text block, a pure white colour fill and an image fill. Call `applyRestaurantColors`.
Expected: white text becomes the secondary colour, black text the primary colour, grey text is untouched, the white colour fill becomes secondary, and the image fill is untouched.

**MIG-H5 · Qase 1312 · generateAssets**
Steps: call `generateAssets` with the three templates and a recording callback.
Expected: called three times, in template order, with the index and an asset carrying the template label, a non-null `src` and a `sceneString` that loads again.

**MIG-H6 · generateAssets survives one failure**
Steps: pass a template list whose middle entry has an unknown `sceneKey`.
Expected: three callbacks. The middle one reports `src: null`, `sceneString: null` and the correct label; the third still succeeds.

**MIG-H7 · renderSceneToImage**
Steps: call with a valid scene string, with no mime type, then with garbage.
Expected: a blob URL that resolves to a non-empty PNG; a JPEG by default; then `null` with one console line.

**MIG-H8 · replaceImageByName edge cases**
Steps: replace a real image block, then call with an unknown block name, with the name of a text block, and with a block whose fill is a colour fill. Also call `exportSceneAsImage` with no scene loaded.
Expected: the image block takes the new URI and the Cover fill mode; the other three calls neither throw nor change anything; `exportSceneAsImage` returns `null`.

### 5.4 Component (jsdom)

**MIG-C1 · Asset grid**
Expected: one card per template on its placeholder preview, a generated `src` replacing it, the loading marker only on the card that is rendering, and Edit reporting the template and its index.

**MIG-C2 · Restaurant selector**
Expected: one unpressed button per restaurant, exactly one pressed at a time, a second click on the pressed one deselecting, and every button disabled while a generation runs.

**MIG-C3 · Editor modal**
Expected: nothing rendered while closed or without a template; the page locked behind the open modal; Escape closing only while open; the same shell for a generated card of a restaurant; and the kit closing itself and logging once when the editor cannot start.

### 5.3 Unit

**MIG-U1 · Colour conversion**
`hexToRgba('#050087')`, `'050087'` (no hash) and `'#EB11D5'` in upper case all give the expected 0-to-1 channel values with alpha 1. A short form (`'#abc'`), an empty string and a non-hex string all give opaque black. (The short form silently produces black; see known issue 9.)

**MIG-U2 · Catalogs**
`RESTAURANTS` has three entries with the ratings 1, 5, 3, the prices `$$`, `$`, `$$$`, the review counts 281, 114, 65 and valid six-digit hex colours. `TEMPLATES` has the keys Square, Portrait, Landscape whose `sceneKey` values (`square`, `portrait`, `landscape`) all exist in `scenes.json`, with `image/png` output and the documented sizes.

**MIG-U3 · Editor configs**
Steps: call `setupFeatures`, `setupActions` and `setupNavigationBar` of both configs with a recording double.
Expected: each config enables its own feature list, asserted whole; only the advanced one carries vector edit, path edit, rulers and the placeholder controls; and both register the documented action ids.

**MIG-U4 · Engine settings**
Steps: call `setupSettings` of both configs with a recording engine double.
Expected: both write the documented interaction, page, placeholder and colour-picker settings; only the design editor allows a page title to be renamed.

**MIG-U5 · UI setup**
Steps: call `setupUI` of both configs.
Expected: both dock the inspector and the asset library, put the canvas bar at the bottom and give the inspector bar a Crop-mode order; only the advanced config moves the inspector to the right and leads its dock with Templates. One case pins known issue 14 with `it.fails`.

**MIG-U6 · Configuration plugins**
Steps: run `DesignEditorConfig.initialize` and `AdvancedEditorConfig.initialize` against a recording double, with and without a `cesdk`.
Expected: each resets the editor first, pins the editor compatibility version to the CE.SDK version once, as the very next call, then sets its role and theme and runs all six setup steps. Without a `cesdk` neither touches anything.

**MIG-U7 · Translations and shortcuts**
Expected: neither config overrides a label, and both install the US ANSI shortcut catalog.

**MIG-U8 · Action handlers**
Steps: invoke every handler both configs register.
Expected: `saveScene` writes a text file, `exportDesign` forwards the caller's options, `exportScene` writes an archive only for `format: 'archive'`, `uploadFile` forwards the file and its context, and `importScene` loads the picked file and then fits the first page.

**MIG-U9 · Editor and headless asset sources**
Each editor entry point adds its own configuration plugin first, both give the editors the same asset sources, and the headless registration leaves out the editor-only ones. A double that answers every `addPlugin` with a promise the test settles by hand proves the configuration plugin is awaited on its own and every asset source is in flight before any of them settles.

**MIG-U10 · Video timeline**
Expected: `setupVideoTimeline` of both configs makes no call. This is a design kit and the helper ships unwired.

**MIG-U11 · unit · `src/index.tsx`**
The entry boots the headless engine, registers its asset sources, publishes the engine on `window` and renders the app into `#root`. A start-up that fails — including a page that ships no root container — is reported instead of leaving an unhandled rejection.

**MIG-U12 · unit · `applyRestaurantColors` on a text block with no colour**
A text block the engine reports no colour for keeps the colour it has.

**KB-01 · unit · Keyboard catalog predicates**

`tests/unit/keyboard-catalog.test.ts` runs every `run` and `when` of `src/imgly/config/advanced-design-editor/keyboard/catalogs/us-ansi.ts`, `src/imgly/config/design-editor/keyboard/catalogs/us-ansi.ts` against 1620 editor states (5 edit modes, 9 selections, 3 roles, features on and off, 3 vector states, page and no page) and asserts that none throws, that every shortcut activates in at least one state, and that every function `run` reaches `cesdk.actions.run`. Kit-owned: the kit decides which key does what and when it is live. The catalog measures 100 % lines, branches and functions.

## 6. Entry and exit criteria

Entry: engine and editor built; test license available; the shared kit test harness exists (headless engine helper, browser boot helper, download helper, console and network guards); a `window.cesdk` hook reachable while the modal is open. The kit already exposes `window.engine` for the headless engine.

Exit: every case in section 5 passes locally and in CI. `npm run ci` passes. The published kit contains no test files. A release run reports results to the Qase ids above.

Measured on 5 Sep 2026: `npm run ci` exits 0 with 137 Vitest tests (unit, component and headless) and 11 browser tests. Merged coverage over `src/**` is lines 99.71 %, branches 99.26 %, functions 100 %, reproduced on three consecutive runs. `tests/coverage-thresholds.json` gates the Vitest run at lines 88, statements 88, functions 98, branches 99; `tests/coverage-thresholds.merged.json` gates the merged report at lines 99, branches 99, functions 100. Both are the measurement rounded down.

Not covered, and why: `src/index.tsx` lines 56–57 (`throw` when `#root` is absent — `index.html` always ships it) and 65–66 (the boot failure handler), and the `textColors.length === 0` guard in `applyRestaurantColors` — a text block always reports at least one colour, measured on an empty text block, which returned one.

## 7. Known issues found while writing this plan

Confirmed by reading the code. Confirm each with a test before fixing.

1. `applyBrandColors` walks every block with `findAll()` and compares colours for exact equality with pure white and pure black. A template using a near-white or near-black value is silently left alone, and the rule is not documented in the README.
2. `applyTextColor` reads only `getTextColors(block)[0]`. A text block whose first run is a different colour keeps all of its colours, including the white or black runs after it.
3. `applyRestaurantColors` is declared `async` and contains no `await`.
4. `generateAssets` turns every failure into one console line and a card with `src: null`. A missing scene key, an unreachable image and a failed export are indistinguishable, and the user sees an empty card with no message.
5. **Fixed in 6b.** `fillTemplate` applies `restaurant.rating` to `Rating1` to `Rating5` with no range check. A value above 5 or below 0 is accepted.
6. `exportSceneAsImage` and `renderSceneToImage` create blob URLs and nothing revokes them. Every restaurant selection leaks three.
7. `src/index.tsx` assigns the engine to `window.engine` under a "remove in production" comment and ships that way, and the config object holds two dead comment blocks.
8. ~~`initMultiImageGenerationHeadlessEngine` calls `engine.addPlugin`, which `@cesdk/node` does not implement.~~
9. **Fixed in 6b.** `hexToRgba` accepts only the six-digit form. `'#abc'` falls through to opaque black rather than expanding, which is the shape the sibling automatic-design-generation kit does support.
10. ~~`check:lint` globs `**/*.{ts,js}`; the kit's five `.tsx` files are not linted.~~
11. `src/app/App.tsx` has an `import type { Configuration }` statement in the middle of the file, after executable code.
12. **Fixed in 6b.** The navigation bar rendered no title: the kit wrote `common.title` into the translations, which the title component never reads. It titles the `ly.img.title.navigationBar` order entry now; MIG-04 asserts the heading.
13. **Fixed in 6b.** `src/imgly/config/advanced-design-editor/ui/index.ts` calls `cesdk.ui.setView('default')`, three lines after `plugin.ts` set `'advanced'`. Creator mode therefore opens in the default view. Traced in the browser: the only three `setView` calls are `resetEditor` → `'default'`, the plugin → `'advanced'`, `setupUI` → `'default'`. The line is a copy of the design config's, where it is correct. Pinned by MIG-U5 with `it.fails`.
14. The actions dropdown trigger has no accessible name, so a browser test cannot reach Export Images by role and name (MIG-06). Editor-layer gap; recorded for the core suite, not worked around in the kit beyond the `data-cy` hook.

Fixed in this wave: 8 (the headless entry point is split, so `@cesdk/node` runs it), 10 (`check:lint` now globs `.tsx`, from the conventions work).

### Coverage residue

None. Every executable line, branch and function of `src/**` is covered by the merged report.

## 8. Open questions

1. Resolved: split. `src/imgly/headless-engine.ts` holds `initMultiImageGenerationHeadlessEngine` and imports nothing from the editor; `src/imgly/asset-sources.ts` holds `registerMultiImageGenerationAssetSources`, which `src/index.tsx` calls straight after. The headless tests now boot the shipped entry point. Its options widened from `{license, baseURL}` to `Partial<Configuration>` so a caller can also set `core.baseURL`, which self-hosting needs and the tests use.
2. Resolved: keep the exact match. The rule is now documented under "Brand colors" in the README.
3. Issue 4: should `generateAssets` surface the error to the caller? Recommended: add an `error` field to `GeneratedAsset` so the app can show a message. The console line is invisible to the user.

## 9. Estimate

Measured: 8 browser cases in 40 s on one worker; 33 headless assertions across four engine boots in about 5 s; 47 unit tests in under 1 s.

## 10. Boundary review

Rule used: the code that makes a decision owns the test for it. The kit decides the scene catalogue, which block names carry which content, the white-to-secondary and black-to-primary colour rule, the rating-to-visibility mapping, the failure handling and the two editor roles. The engine decides what those changes render.

Core behaviour this plan leans on, and where it is covered today:

| Behaviour                                     | Owner  | Covered by                                                                    |
| --------------------------------------------- | ------ | ----------------------------------------------------------------------------- |
| `block.findAll`, `findByName`, `getType`      | engine | `engine/lib/test/api/CoreAPITest.cpp`, `HierarchyAPITest.cpp`                 |
| `getTextColors` / `setTextColor`              | engine | `engine/lib/test/api/BlockTextTest.cpp`, `TextDeepAPITest.cpp`                |
| `getColor` / `setColor` on `fill/color/value` | engine | `engine/lib/test/api/BlockPropertiesTest.cpp`, `PropertyRoundTripAPITest.cpp` |
| `setVisible` hides a block from the export    | engine | `engine/lib/test/api/BlockAppearanceTest.cpp`, `ExportAPITest.cpp`            |
| `resetCrop` and `setContentFillMode('Cover')` | engine | `engine/lib/test/api/CropAPITest.cpp`                                         |
| `editor.setRole` changes the effective scopes | engine | `engine/lib/test/api/EditorAPITest.cpp`, `ScopesAPITest.cpp`                  |
| `ui.setTheme`, `ui.setComponentOrder`         | editor | `apps/cesdk_web/packages/api/ui/UserInterfaceAPI.test.ts`                     |

Core coverage gap found, and closed on this branch:

1. Engine: setting a text variable changes what the text block renders. `engine/lib/test/api/VariablesMetadataAPITest.cpp` gained `setVariableStringRendersSubstitutedTextLine`, `setVariableStringUpdateReRendersTextLine` and `setVariableStringLeavesRawTextTemplated`. Shared with automatic-design-generation and batch-image-generation.

MIG-H1 keeps a decoded-export assertion as this kit's end-to-end proof that `Name`, `$$` and `Count` reached the picture.
