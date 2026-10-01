# Test plan: starterkit-photo-editor

Version 4, 7 Sep 2026. Status: implemented. 13 unit and headless tests and 7 browser tests run in `npm run ci`. Merged coverage: lines 100 %, branches 100 %, functions 100 %.

## 1. Purpose

Verify that the Photo Editor starter kit works as shipped: it wires `@cesdk/core-configs-web`'s photo-editor configuration to twelve asset sources, adds background removal to the dock, adds an Export Image button to the navigation bar, and loads its demo scene.

## 2. Scope

In scope

- `initPhotoEditor`: the `PhotoEditorConfig` plugin, the twelve asset-source plugins, the `actions.export.image` translation, the Export Image navigation-bar button, the background-removal plugin and its dock placement after the Effects entry
- The scene URL the kit loads
- The kit's own code under `src/imgly/` and `src/index.ts`

Out of scope

- The photo-editor UI itself — the Crop, Adjust, Filter and Effects dock entries, the feature set, the engine settings, the inspector, the canvas menu and the default actions. All of that lives in `packages/cesdk-core-configs-web/src/photo-editor/`, which owns those decisions; see section 10.
- What background removal produces. The plugin decides that; see section 10.
- The demo site around the kit (cards, tags, platform support, links, the desktop and mobile switch). Covered by the `cesdk_web_demos` suite. Qase 3, 4, 5, 2154, 2155, 2174, 2183, 2374, 2376, 2381, 2384, 4021, and 2466, which asks whether edits survive the demo site's device toggle and is a property of that site's iframe handling, not of the kit. The `starterkit-unsplash-asset-source` plan puts the same case (2471) out of scope for the same reason.
- The iOS and Android app pages. Qase 4015, 4016, 4017, 4018, 4019, 4020.

## 3. Test environment

- Browser: Chrome, headless, 1400 × 900
- Engine and editor: built from this repo, served locally. Requests to `cdn.img.ly` fail the test.
- License: the shared test license (valid on hostname `localhost` only)
- Data: the fashion-ad scene, mirrored into `packages/cesdk-web-examples-data/data/starterkit-photo-editor/assets/16-9-fashion-ad/` (scene plus the 30 fonts and 2 images it names) and loaded through `DEMO_ASSETS_BASE_URL`. A boot makes zero `cdn.img.ly` requests (verified with a Playwright request log).
- Network: `@imgly/background-removal@1.7.0` downloads its ONNX models from `staticimgly.com/@imgly/background-removal-data/`, which the guard allows. The download is about 40 MB, so the one end-to-end case gets a 180 s timeout.
- Downloads: captured by Playwright and checked by file type and pixel size

## 4. Approach

| Kind    | Tool                          | What it checks                                            | Run                 |
| ------- | ----------------------------- | --------------------------------------------------------- | ------------------- |
| Static  | tsc, eslint, convention check | Types, deprecated APIs, kit folder shape                  | `npm run check:all` |
| Unit    | Vitest                        | Plugin order, translation, navigation button, dock insert | `npm run test:unit` |
| Browser | Playwright                    | The test cases in section 5                               | `npm run test:e2e`  |

All three run in the kit's `ci` script. Browser tests use role and label locators; anything inside the editor goes through the harness helpers. This kit is configuration only: `src/imgly/index.ts` is 135 lines with no branches, so most of it is covered by unit cases with a spy `CreativeEditorSDK` and the browser suite keeps one proof per kit decision. There are no headless cases: nothing in the kit runs without the editor.

## 5. Test cases

Format: ID, level, Qase id, title. Then steps and expected result.
Common precondition for all browser cases: the kit is open in the browser and the scene has finished loading.

### 5.1 Start-up

**PE-01 · browser · Editor loads with the photo-editor dock**
Steps: open the kit.
Expected: one page on the canvas showing the demo scene. The dock lists Crop, Adjust, Filter, Effects, BG Removal, a separator, then Text, Shapes and Stickers. An Export Image button is in the navigation bar. No console errors. No request to `cdn.img.ly`.
Note from the run: `dock/hideLabels` and `dock/iconSize` are not reflected engine settings, so the case asserts the rendered dock entries instead. The navigation-bar order also carries documentSettings, title and preview, but none of the three renders in this kit; only the kit's own Export Image button is asserted.

**PE-02 · browser · Qase 2160 · Background removal has its own dock entry**
Steps: read the dock.
Expected: a BG Removal entry sits directly after Effects. The kit inserts `@imgly/plugin-background-removal-web.dock` with `after: { key: 'ly.img.effects' }`; the plugin is installed with no `ui.locations`, so this insert is the only reason it appears anywhere.

**PE-03 · browser · Qase 2159 · The dock has no Apps panel**
Steps: read the dock and look for an Apps entry with a search field.
Expected: none. `PhotoEditorConfig` builds the dock from Crop, Adjust, Filter, Effects, Text, Shapes and Stickers, and the kit adds only BG Removal. Qase 2159, 2160 and 2161 describe an Apps panel that this kit no longer has; see open question 2. This case pins the current dock so the discrepancy is visible in a run rather than in a manual pass.

### 5.2 Background removal

**PE-04 · browser · Qase 2161 · Remove the background of the demo image**
Steps: select the image on the page, open the BG Removal dock entry, run it, wait for processing.
Expected: the block's image fill URI changes to a new blob or object URL. Model files are requested from `staticimgly.com`. Timeout 180 s. This is the kit's one end-to-end proof; the quality of the mask is the plugin's decision (section 10, gap 2).

### 5.3 Editing through the shared configuration

**PE-05 · browser · Qase 2190, 2191, 2192, 4616 · The page image is editable but not replaceable**
Steps: select the page. Look for Replace. Then use Adjust, Filter and Effects from the dock.
Expected: Replace is not offered, and the Adjust, Filter and Effects panels each open and change the page fill. All four are `PhotoEditorConfig` decisions (section 10, gap 1); this case is the kit's proof that the configuration it registers is in force.

### 5.4 Export

**PE-07 · browser · Qase 2173 · Export image**
Steps: click the accent Export Image button in the navigation bar.
Expected: the button is labelled "Export Image" — the kit's own translation for `actions.export.image` — and one PNG download follows. `spyExport` records one call with `mimeType: 'image/png'` and no target size, and the PNG's pixel size is the page's own.

### 5.5 Unit cases (no browser, no engine)

Subject: `src/imgly/index.ts`, called with a spy `CreativeEditorSDK`.

**PE-U1 · unit · Plugin order**
`initPhotoEditor` adds `PhotoEditorConfig` first, then the twelve asset-source plugins — Blur, ImageColors, ColorPalette, CropPresets, Effects, Filters, PagePresets, Sticker, Text, TextComponent, Typeface, VectorShape — then `BackgroundRemovalPlugin`. The twelve are all in flight before the first one settles, so they register concurrently. It installs no upload, demo or premium-template source, and sets neither the role nor the theme.

**PE-U2 · unit · Translation and export button**
`setTranslations` is called with `{ en: { 'actions.export.image': 'Export Image' } }`. `insertOrderComponent` puts an `ly.img.action.navigationBar` at the end of `ly.img.navigation.bar` with key and label `actions.export.image`, colour `accent`, icon `@imgly/Image`, and an `onClick` that runs `exportDesign` with `mimeType: 'image/png'` and no target size.

**PE-U3 · unit · Background-removal install and dock insert**
`BackgroundRemovalPlugin` is added last. `insertOrderComponent` then places `@imgly/plugin-background-removal-web.dock` in `ly.img.dock` after `{ key: 'ly.img.effects' }`.
Note from the run: the plugin factory returns only `{ name, version, initialize }`, so the options object it was called with is not observable from the spy; the case asserts the install order and the dock insert instead. Plugins are identified by their own `name` — the class names are minified in the built bundle.

## 6. Entry and exit criteria

Entry: engine and editor built; test license available; the shared kit test harness exists; the demo scene mirrored into the data package; the kit's `test:unit` and `test:e2e` scripts replaced with the real commands.

Exit: every case in section 5 passes locally and in CI. `npm run ci` passes. No test contacts `cdn.img.ly`. The published kit contains no test files. A release run reports results to the Qase ids above.

## 7. Known issues found while writing this plan

Confirm each with a test before fixing.

1. **Fixed.** `src/index.ts` loaded its scene from `cdn.img.ly`. The scene and its 32 referenced files are now mirrored into `packages/cesdk-web-examples-data/data/starterkit-photo-editor/` and read through a `DEMO_ASSETS_BASE_URL` constant with a `VITE_DEMO_ASSETS_BASE_URL` override.
2. **Fixed.** `src/imgly/resolveAssetPath.ts` was dead and is deleted; `check-kit-conventions.mjs` forbids it fleet-wide.
3. `public/assets/remove-bg.png` is unreferenced. The same unused file also ships in the background-removal and print-ready-pdf kits.
4. **Fixed.** The README's Architecture tree described six files that do not exist and named the root `starterkit-photo-editor-ts-web/`. It now describes the two files the kit has and says where the photo-editor UI comes from.
5. Qase 2159, 2160 and 2161 describe an Apps panel with a search field that offers Remove Background. The kit's dock has no Apps entry; background removal is its own dock button.

## 8. Open questions

1. **Resolved: mirrored.** The scene lives in the data package and the kit reads it through `DEMO_ASSETS_BASE_URL`. The scene no longer names `cdn.img.ly` anywhere; every font URI is relative to the engine's `baseURL`, and `defaultEmojiFontFileUri` is empty.
2. Issue 5: the three Apps Qase cases no longer describe this kit. Options: retitle them against the BG Removal dock entry, or retire them. Recommendation: Elia decides; PE-02, PE-03 and PE-04 cover what the kit does today either way.
3. **Resolved:** the README's Architecture section is rewritten.

## 9. Estimate

Measured: 6 browser cases in 1.7 minutes on one worker, of which PE-04 is 1.2 minutes (the ONNX model download). 9 unit cases in under 1 s. Merged coverage 98.01 % lines, 100 % branches, 100 % functions.

## 10. Boundary review

Rule used: the code that makes a decision owns the test for it. The kit decides which configuration package is registered, which twelve asset sources exist, the Export Image button and its translation, that background removal is installed and where its dock entry sits, and which scene is loaded. `@cesdk/core-configs-web` decides the photo-editor UI — the dock, the features, the engine settings, the inspector, the canvas menu and the default actions. The background-removal plugin decides what it does to a fill. The engine decides what an export produces.

Core behaviour this plan leans on, and where it is covered today:

| Behaviour                                                                      | Owner  | Covered by                                                                                          |
| ------------------------------------------------------------------------------ | ------ | --------------------------------------------------------------------------------------------------- |
| `insertOrderComponent` places a component at a position or after a matched key | editor | `apps/cesdk_web/packages/api/ui/UserInterfaceAPI.test.ts`                                           |
| `cesdk.utils.export` and `downloadFile`                                        | editor | `apps/cesdk_web/packages/api/utils/UtilsAPI.test.ts`                                                |
| The default `exportDesign` action the kit's button runs                        | editor | `apps/cesdk_web/packages/cesdk/registerDefaultActions.test.ts` `exportDesign exports and downloads` |
| `i18n.setTranslations` merges a locale's keys                                  | editor | `apps/cesdk_web/packages/api/i18n/I18nAPI.test.ts`                                                  |

Core coverage gaps found (candidates to add in the core suites, not in this kit):

1. `@cesdk/core-configs-web` had **no tests and no `test` script**. `PhotoEditorConfig` — its dock, its feature list, its engine settings, its inspector bar and its three feature predicates — is what a customer sees when they run this kit, and it is shared by other kits. Qase 2190, 2191, 2192, 2193, 3708, 3709 and 4616 are all decided there. Closed in part on this branch: the package has a `test` script and `packages/cesdk-core-configs-web/src/editorConfigs.test.ts`, whose `photo-editor` block carries `leads its dock with the photo tools rather than an asset library`, `hides the canvas menu and inspector bar while the page is selected`, `selects the page when nothing is selected, and does not crop on double click` and `ships no template or upload library`. Still open there: the Replace predicate, and what the Adjust, Filter and Effects entries open.
2. `@imgly/plugin-background-removal-web` has no tests — its `package.json` sets `"test": "echo No tests"`. Qase 2161 rests on it. Recorded in full in the `starterkit-background-removal-editor` plan; not repeated here.

PE-05 is an interim, not a permanent kit test. PE-06 was deleted once its core coverage landed: `leads its dock with the photo tools rather than an asset library` pins the Crop dock entry and `selects the page when nothing is selected, and does not crop on double click` pins the crop settings, and the crop panel's own tabs are the editor's. PE-05 survives as the one wiring case, because no core test covers the Replace predicate or what the Adjust, Filter and Effects entries open.

## 11. Coverage pass

Cases added to close the merged-coverage gaps:

- **PE-U4 · unit · src/index.ts, with `@cesdk/cesdk-js` and the kit barrel mocked: the demo base URL falls back to the published data when `VITE_DEMO_ASSETS_BASE_URL` is unset and is taken when it is set, a successful create publishes `window.cesdk`, configures the editor, loads the scene from that base URL and reports the `created` and `ready` demo phases, and a rejected create reports `failed`, logs `Failed to initialize CE.SDK:` and leaves no unhandled rejection**

No uncovered line, branch or function remains.
