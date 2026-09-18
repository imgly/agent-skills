# Test plan: starterkit-layouts-asset-source

Version 6, 7 Sep 2026. Status: implemented. 60 unit and headless tests and 8 browser tests, `npm run ci` green (exit 0). No expected failures remain. Merged coverage: lines 100 %, branches 100 %, functions 100 %.

## 1. Purpose

Verify that the Layouts starter kit works as shipped: the editor loads with a Layouts library in the dock, and applying a layout swaps the page structure while keeping the text and images that were on the page.

## 2. Scope

In scope

- The custom layouts asset source: the 12 entries in `custom-layouts.json`, their thumbnails, and the base URL they resolve against
- The apply middleware: layout applied to the current page, content copied over, undo step added
- The dock and asset library entry the plugin registers
- Editor start-up with the demo scene
- The kit's own code under `src/imgly/` and `src/index.ts`

Out of scope

- Core editor features used through this kit (text editing, undo UI, templates library). Covered by the core editor suite.
- The demo site around the kit (cards, tags, links, platform toggles). Covered by the `cesdk_web_demos` suite. Qase 719, 720, 721, 722, 723, 738, 747, 2422.

## 3. Test environment

- Browser: Chrome, headless, 1400 × 900
- Engine and editor: built from this repo, served locally. Requests to `cdn.img.ly` for engine assets fail the test.
- License: the shared test license (valid on hostname `localhost` only)
- Data: the kit loads its scene, layout scenes, thumbnails and dock icons from `VITE_DEMO_ASSETS_BASE_URL`, default `https://staticimgly.com/imgly/cesdk-web-examples-data/1.83.0-rc.0/starterkit-layouts-asset-source`. The kit has no `public/` folder.
- In dev mode the `cesdk-js-dev` local CDN daemon on port 5199 answers those URLs from the in-repo `packages/cesdk-web-examples-data/`, so the browser cases need no network. In static mode they would reach the real host, which the guard allows.
- The demo scene and the layout scenes store absolute `cdn.img.ly` font URIs from the CE.SDK version they were authored with, so the kit's `tests/playwright.config.ts` allows exactly `cdn.img.ly/packages/imgly/cesdk-js/<version>/assets/ly.img.typeface/fonts/`.
- Downloads: captured by Playwright and checked by file type and PDF page count
- Headless: Vitest with `@cesdk/node`, no browser. Needs the extraction in open question 1.

## 4. Approach

| Kind     | Tool                          | What it checks                                                      | Run                 |
| -------- | ----------------------------- | ------------------------------------------------------------------- | ------------------- |
| Static   | tsc, eslint, convention check | Types, deprecated APIs, kit folder shape                            | `npm run check:all` |
| Unit     | Vitest                        | `custom-layouts.json` shape, block sorting, dock and feature config | `npm run test:unit` |
| Headless | Vitest + `@cesdk/node`        | Layout application against a real engine, no UI                     | `npm run test:unit` |
| Browser  | Playwright                    | The test cases in section 5                                         | `npm run test:e2e`  |

All four run in the kit's `ci` script. Browser tests use role and label locators only.

## 5. Test cases

Format: ID, level, Qase id, title. Then steps and expected result.
Common precondition for all browser cases: the kit is open in the browser and the scene has finished loading.

### 5.1 Start-up and library

**LAY-01 · browser · Editor loads with Layouts in the dock**
Steps: open the kit.
Expected: the scene is on the canvas. The first dock entry is labelled "Layouts" and uses the kit's own icon. A separator follows it, and there is no Templates entry in the order or in the rendered dock. No console errors. No engine asset from `cdn.img.ly`.

**LAY-02 · browser · Qase 734 · Layout thumbnails render**
Steps: click Layouts in the dock.
Expected: the panel lists 12 entries. Every thumbnail request goes to `<demo assets base>/assets/thumbnail-<n>.png` and returns 200.
Note: the grid loads thumbnails lazily and the browser serves repeats from its own cache, so counting requests is unreliable. The case asserts instead that every tile the grid has loaded points at that path and decoded.

### 5.2 Applying a layout

**LAY-03 · browser · Qase 735 · Apply a layout**
Steps: note the text of the page's text block and the image fill URI of its first image. Click Layouts, click the entry "layout with 2 images".
Expected: the page keeps its identity (`scene.getCurrentPage()` is unchanged) and the page count is unchanged. The layout brings two image slots, and every text and image the new page holds came from the old one.
Note: the layout's slots are filled in visual order, not in child order, so the case asserts that the new content is a subset of the old rather than matching positions. The demo scene's images carry a source set, not a plain `fill/image/imageFileURI`, so the case reads the first source-set URI.

**LAY-04 · browser · Undo returns to the previous layout**
Steps: apply a layout, then press Undo.
Expected: the page shows the children it had before. One undo step, not several.

**LAY-05 · browser · Qase 748 · Replace a sample image keeps the placeholder UI**
Steps: select an image on the page, use Replace, pick an image from the library.
Expected: the fill changes and the block's placeholder behaviour is unchanged.
Note: the Replace panel here offers the default Images library, so the case picks the "Mountains" demo asset by name.

**LAY-06 · browser · Applying a second layout replaces the first**
Steps: apply the two-image layout, then apply the three-image layout.
Expected: the page content changes again, so a layout is not a one-shot operation.
Note: this case used to be "a template replaces the applied layout" (Qase 4689). Known issue 2 is now fixed with `config/ui/dock.ts` as the source of truth, so the kit ships no Templates dock entry and that path cannot be driven from the UI. The Qase wrapper is dropped rather than left on a case testing something else. Child count alone does not distinguish the two layouts, so the case compares the page's texts and image URIs.

### 5.3 Export

**LAY-07 · browser · Qase 737 · Export image**
Steps: open the actions menu in the navigation bar, click Export Image.
Expected: one PNG download at the demo scene's own page size, 1500 × 1500 px. The navigation bar entry runs `exportDesign` with no target size, so the page's own pixel size decides — see known issue 6.
Asserts the options the kit passes to `engine.block.export` and that a file of the declared type downloaded; the exported pixel size belongs to `engine/lib/test/api/ExportAPITest.cpp`.

**LAY-08 · browser · Qase 736 · Export PDF**
Steps: open the actions menu, click Export PDF.
Expected: one PDF download with 1 page.
Asserts the options the kit passes to `engine.block.export` and that a file of the declared type downloaded; the exported pixel size belongs to `engine/lib/test/api/ExportAPITest.cpp`.

### 5.4 Headless cases (no browser)

Run against `@cesdk/node` with a scene built in the test, calling the extracted `applyLayoutToPage` directly.

**LAY-H1 · headless · Content is carried over**
A page with 2 text blocks and 2 images, a layout with 2 text slots and 2 image slots.
Expected: both texts and both image URIs land on the layout blocks, matched top to bottom and left to right.

**LAY-H2 · headless · Slot count mismatch**
Layout with 1 image slot and a page with 3 images, then the reverse.
Expected: the shorter list wins, no error, no empty fill written over an existing one.

**LAY-H3 · headless · No leftover blocks and the scope is restored**
Expected: after the call, `lifecycle/destroy` holds the value it had before, the scene still holds exactly the one page, and its children are the layout's own.

**LAY-H4 · headless · The layout scene fails to load**
`fetch` rejects, then returns a body that is not a scene, with `lifecycle/destroy` set to `Deny` first.
Expected: the call rejects and `lifecycle/destroy` is still `Deny`. Both cases run with `it.fails` and pin known issue 1.
Note: a bad body rejects inside `loadFromString`, before the page is duplicated, so no duplicated page is left behind. The scope leak is the whole of issue 1.

**LAY-H5 · headless · `addUndoStep: false`**
Expected: `engine.editor.addUndoStep` is called once with the default and not at all when the flag is off.
Note: `engine.editor.canUndo()` stays false under `@cesdk/node` even after a real change, so the case spies on the call instead.

**LAY-H7 · headless · The font of a text slot cannot be read**
`engine.block.getTypeface` throws for the source text block.
Expected: the call still finishes and the text lands on the layout slot. Only the font is dropped.

### 5.5 Unit cases (no engine)

**LAY-U1 · unit · Layout catalogue**
`custom-layouts.json`: source id `ly.img.layouts`, 12 assets, ids unique, every asset has a `meta.uri` and a `meta.thumbUri` that both start with `{{base_url}}/`, and `blockType` `acme.layouts`.

**LAY-U2 · unit · Visual block order**
`visuallySortBlocks` with a fake engine: blocks sort by rounded Y, then by X. Equal Y keeps left-to-right. Sub-pixel differences that round to the same value are treated as one row.

**LAY-U4 · unit · Registered actions**
`setupActions` on a spy `cesdk` registers the actions the kit's UI reaches.

**LAY-U3 · unit · Dock and feature configuration**
`setupDock` on a spy `cesdk`: the dock order is the 8 entries the kit declares, `dock/hideLabels` is false and `dock/iconSize` is `large`. `setupFeatures` enables exactly the list `config/features.ts` names, in that order. The plugin then prepends the Layouts entry and a separator, registers the catalogue against the base URL it was given, and adds the library entry. The resulting dock carries no templates entry, which pins the fix for known issue 2.

**KB-01 · unit · Keyboard catalog predicates**

`tests/unit/keyboard-catalog.test.ts` runs every `run` and `when` of `src/imgly/config/keyboard/catalogs/us-ansi.ts` against 1620 editor states (5 edit modes, 9 selections, 3 roles, features on and off, 3 vector states, page and no page) and asserts that none throws, that every shortcut activates in at least one state, and that every function `run` reaches `cesdk.actions.run`. Kit-owned: the kit decides which key does what and when it is live. The catalog measures 100 % lines, branches and functions.

## 6. Entry and exit criteria

Entry: engine and editor built; `@cesdk/node` built with its assets; test license available; the shared kit test harness exists; `applyLayoutToPage` extracted per open question 1; the kit's `test:unit` and `test:e2e` scripts replaced with the real commands (they are `exit 0` today).

Exit: every case in section 5 passes locally and in CI. `npm run ci` passes. The published kit contains no test files. A release run reports results to the Qase ids above.

## 7. Known issues found while writing this plan

Confirm each with a test before fixing.

Fixed: issue 6, the dead `exportImage` registration, is deleted. Issues 1 and 2 are fixed in v3; LAY-H4 and LAY-U3 now assert the fixed behaviour.

1. ~~`applyLayoutToPage` sets `lifecycle/destroy` to `Allow` and only restores it on the success path.~~ **Fixed in v3.** The body runs in a `try`/`finally` that restores the scope and destroys the duplicated page and the loaded layout page on every exit, and an empty layout scene is rejected by name. LAY-H4 covers the four failure paths.
   The duplicated page is not left behind: a bad body rejects inside `loadFromString`, before the duplicate is made.
2. ~~The plugin removes the dock entry with key `ly.img.template`, but `config/ui/dock.ts` declares it as `ly.img.templates`.~~ **Fixed in v3, with `config/ui/dock.ts` as the single source of truth.** The Templates entry is deleted from the config and the plugin's dock filter is deleted with it, so nothing is declared and then stripped at runtime. The kit no longer offers a Templates dock entry at all. Coverage of that: `LAY-U3 setupDock` pins the declared order, `LAY-U3 LayoutsAssetSourcePlugin` pins that the resulting dock has no `ly.img.templates` entry, and LAY-01 asserts both in the browser. **Qase 4689** ("Verify template can be applied, previously selected layout is substituted with currently selected template") is therefore not covered in this kit and its wrapper is dropped: the case needs a template library the kit does not ship. LAY-06 keeps the half that is still reachable and is now "applying a second layout replaces the first".
3. `applyLayoutToPage` duplicates the current page to hold the old content. The duplicate is a real page in the scene until the end of the call, so anything watching the page count sees two pages mid-apply.
4. `copyAssets` calls `getChildrenTree(...).flat()`, but `getChildrenTree` already returns a flat array.
5. `layout-0` in `custom-layouts.json` has no `locale` field; the other 11 do.
6. ~~The kit registers an `exportImage` action at 1080 × 1080 that nothing can reach.~~ Fixed: the registration is deleted. `ly.img.exportImage.navigationBar` runs `exportDesign` with no target size (`apps/cesdk_web/packages/ui/components/actions/NavigationBarActionExportImage.tsx`), so the PNG comes out at the page's native size.
7. The README never mentions layouts. Its Configuration and Key Capabilities sections are the generic design editor text, and the Architecture tree omits `config/keyboard/`.

## 8. Open questions

1. ~~Move `applyLayoutToPage`, `copyAssets`, `getChildrenTree` and `visuallySortBlocks` into `src/imgly/plugins/layouts/applyLayout.ts`.~~ Done in this wave; `layout.ts` keeps the plugin class and imports the one entry point.
2. ~~Issues 1 and 2: fix in this kit or record as expected.~~ Both fixed in v3.
3. The kit has no `public/` folder and depends on `staticimgly.com` at runtime. Keep it, or copy the layout scenes into the kit so its tests are offline. Recommended: keep, and let the network guard allow `staticimgly.com` as decided for the fleet.

## 9. Estimate

Measured: 8 browser cases in 36 s on one worker, 7 headless cases in 0.6 s (one shared engine), 27 unit cases in under 0.3 s. Merged coverage: lines 89.91 %, branches 93.88 %, functions 92 %; the Vitest gate sits at lines 21 %, branches 93 %, functions 92 %.

## 10. Boundary review

Rule used: the code that makes a decision owns the test for it. The kit decides the layout catalogue, the base URL, the apply middleware and what it copies between pages, the dock entry and the asset library entry. The engine decides what `addLocalAssetSourceFromJSONString`, `loadFromString`, `duplicate` and `insertChild` do. The editor decides how a library panel renders a source and how Replace picks its entries.

Core behaviour this plan leans on, and where it is covered today:

| Behaviour                                                             | Owner         | Covered by                                                                                                                                                               |
| --------------------------------------------------------------------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `addLocalAssetSourceFromJSONString` registers a source and its assets | engine        | `engine/lib/test/api/AssetSourceAPITest.cpp` `addLocalAssetSourceFromJSONStringValidMinimal`, `engine/lib/test/api/AssetAPITest.cpp` `AddLocalAssetSourceFromJSONString` |
| `registerApplyMiddleware` wraps and can skip the default apply        | editor facade | `apps/cesdk_web/packages/engine/engine/facade.test.ts` `constructor: registerApplyMiddleware`                                                                            |
| `addAssetLibraryEntry`, `setDockOrder`, `getDockOrder`                | editor        | `apps/cesdk_web/packages/api/ui/UserInterfaceAPI.test.ts`                                                                                                                |
| Replace picks library entries from the selected block                 | editor        | `apps/cesdk_web/packages/ui/components/assets/getReplaceLibraryEntries.test.ts`                                                                                          |
| Legacy `//ly.img.ubq/image` blocks load as graphic plus image fill    | engine        | `engine/src/ubq/editor/SceneSerializer.cpp` conversion pass; exercised by the frozen scene corpus in `engine/test/resources/serialization/scenes/`                       |

Core coverage gaps found (candidates to add in the core suites, not in this kit):

1. Engine: `addLocalAssetSourceFromJSONString` with a `basePath` must replace `{{base_url}}` in `meta.uri` and `meta.thumbUri`. The whole layouts catalogue depends on it. Closed on this branch: `engine/lib/test/api/AssetSourceAPITest.cpp` gained `addLocalAssetSourceFromJSONStringSubstitutesBaseUrlInMeta`, `addLocalAssetSourceFromJSONStringBasePathTrailingSlashDoesNotDouble`, `addLocalAssetSourceFromJSONStringWithoutBasePathUsesBasePathSetting` and `addLocalAssetSourceFromJSONStringSubstitutesBaseUrlInSourceSetAndTypeface`.
2. Editor: no test that an apply middleware which returns a block id instead of calling `apply` leaves the default apply unrun. `facade.test.ts` covers registration, not the skip path. Qase 735 exercises it through this kit. Suggested home: `apps/cesdk_web/packages/engine/engine/facade.test.ts`.

LAY-02 keeps its thumbnail-URL assertion as this kit's end-to-end proof.

## 11. Coverage pass

Cases added to close the merged-coverage gaps:

- **LAY-U5 · unit · The actions the kit registers — every handler `setupActions` registers is invoked: `saveScene` downloads the saved scene as text, `exportDesign` downloads what `cesdk.utils.export` returned, `importScene` opens the picker for `.imgly,.scene,.zip`, revokes the blob URL on the success and on the failure path and then runs `zoom.toPage`, `exportScene` writes a JSON scene by default and a zip archive for `{ format: 'archive' }`, and `uploadFile` returns what `cesdk.utils.localUpload` returned**
- **LAY-U6 · unit · DesignEditorConfig — `initialize` resets the editor, declares the editor compatibility version it was written for, then applies features, UI, actions, shortcuts, translations and engine settings; with no `cesdk` in the context it touches the engine not at all**
- **LAY-U7 · unit · Video timeline scaffold — `setupVideoTimeline` makes no editor call, so the kit ships the timeline example unapplied**
- **LAY-U8 · unit · the layout apply middleware — an asset from another source passes straight through to `apply`; a layout asset goes to `applyLayoutToPage` with an undo step by default and without one for `{ addUndoStep: false }`; `dispose` releases the middleware; and the plugin does nothing without an editor**
- **LAY-U9 · unit · `src/index.ts` — a successful create publishes `window.cesdk`, configures the editor, loads the layouts demo scene and reports the demo lifecycle phases `created` then `ready`; a rejected create logs `Failed to initialize CE.SDK:` and reports `failed` alone**
- **LAY-H5 · headless · `addUndoStep` (existing) and LAY-H6 · headless · placeholder behaviour, an `it.fails` case that asserts the correct behaviour and pins known issue 7**

Residue, measured and classified:

Fixed since version 4: the placeholder state of an image slot is now carried across a layout change. `applyLayout.ts` asked the graphic block whether it supports placeholder behaviour, but the engine keeps that state on the image fill, so the guard never passed; it now reads and writes the two fills it has already resolved. `LAY-H6` was an expected failure and is a passing case.

No uncovered line, branch or function remains.
