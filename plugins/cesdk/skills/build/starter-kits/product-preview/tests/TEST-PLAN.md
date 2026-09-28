# Test plan: starterkit-product-preview

Version 6, 7 Sep 2026. Status: implemented and green. 62 unit, 12 headless, 33 component and 16 browser cases run in `KIT_TEST_COVERAGE=1 npm run ci`. Merged coverage is **lines 100 %, branches 96.73 %, functions 100 %**. The component level is new in version 5: it mounts `App`, the sidebar, the preview panel, the mockup modal and `useMockupRenderer` over a stand-in editor, which is what takes the React tree from untested to fully covered. Every branch that is still open is listed in the coverage residue below.

## 1. Purpose

Verify that the Product Preview starter kit works as shipped: the design editor opens on the postcard, a second headless engine renders every design page into the product's mockup scene, edits reach the mockup preview, the preview can be expanded, downloaded and edited in its own editor, and the design exports as PDF and image.

## 2. Scope

In scope

- `src/imgly/mockup.ts`: placeholder replacement, clearing unused slots, the returned scene string and blob URLs, engine reuse and disposal
- The five-product catalogue and its scene URL helpers
- `useMockupRenderer`: building placeholders from the design pages, the debounced re-render on a history update, the immediate render on a product change
- The mockup preview panel: fullscreen, Escape, download
- The mockup editor modal: a second CE.SDK instance in Adopter role, its Back and Save entries, and the saved scene feeding the next render
- The kit's editor configuration under `src/imgly/config/`

Out of scope

- Core editor features reached through this kit (text editing, asset library, crop, undo, inspector, templates). Covered by the core editor suite.
- The demo site around the kit (cards, tags, links, platform toggles, Back to Showcases). Covered by the `cesdk_web_demos` suite. Qase 1068, 1069, 1070, 1071, 1072, 1087, 1096, 2450.

## 3. Test environment

- Browser: Chrome, headless, 1400 × 900
- Engine and editor: built from this repo, served locally. Requests to `cdn.img.ly` for engine assets fail the test.
- License: the shared test license (valid on hostname `localhost` only)
- Data: the kit's own `public/` — five design scenes and five mockup scenes, plus `icons/`. Nothing is fetched from a CDN, so this kit needs no demo-data redirect.
- Hook: `App.handleEditorInit` sets `window.cesdk` to the **design** editor. The mockup modal creates a second CE.SDK instance that the hook never points at; it is driven through the DOM only.
- Two engines: the design editor plus the headless mockup renderer, and a third while the modal is open. Browser cases allow the extra WASM instances.
- No `cdnAllowlist`. The committed demo scenes' font URIs are relative to the engine's `baseURL`, so the suite runs with the CDN guard at its default and no console line is tolerated.
- Headless: Vitest + `@cesdk/node` (`@cesdk/engine` aliased to it). `renderMockup` is exercised with **string** placeholders pointing at `file://` fixtures. The `Blob` branch creates `blob:` URLs the Node engine cannot fetch, and `block.export` on a block whose resource never loads does not reject, it waits — so a Blob placeholder would hang the run to its timeout. The Blob path is covered in the browser instead.
- Downloads: captured by Playwright and checked by file type, pixel size and PDF page count.

## 4. Approach

| Kind     | Tool                          | What it checks                                                   | Run                 |
| -------- | ----------------------------- | ---------------------------------------------------------------- | ------------------- |
| Static   | tsc, eslint, convention check | Types, deprecated APIs, kit folder shape                         | `npm run check:all` |
| Unit     | Vitest                        | URL helpers, catalogue, placeholder naming, editor configuration | `npm run test:unit` |
| Headless | Vitest + `@cesdk/node`        | `renderMockup` end to end against the kit's own mockup scenes    | `npm run test:unit` |
| Browser  | Playwright                    | The test cases in section 5                                      | `npm run test:e2e`  |

All four run in the kit's `ci` script. Browser tests use role and label locators only.

`src/imgly/mockup.ts` runs headless as it stands — it imports `@cesdk/engine` and touches no DOM beyond `URL.createObjectURL`, which Node 22 provides. One extraction landed for the unit lane: `buildPlaceholders` lived inside `useMockupRenderer` as a `useCallback`, so its "N pages, then `CLEAR_IMAGE` up to `DEFAULT_MAX_PLACEHOLDERS`" rule was only reachable through React. It is now `buildPlaceholders(engine, maxPlaceholders, size)` in `src/app/utils.ts`, and the hook calls it.

## 5. Test cases

Format: ID, level, Qase id, title. Then steps and expected result.
Common precondition for all browser cases: the kit is open in the browser, the design editor has loaded its scene, and the first mockup has rendered.

### 5.1 Start-up and product switching

**PP-01 · browser · Qase 1113, 1116 · The postcard is selected and its mockup is rendered**
Steps: open the kit.
Expected: Post Card is the active button in the top bar, the design canvas shows `postcard.scene`, and the preview panel shows an image whose `src` is a `blob:` URL and whose natural size is non-zero. No console errors. No request to `cdn.img.ly`.

**PP-02 · browser · Qase 1112 · Five product controls**
Steps: read the top bar.
Expected: Business Card, Poster, Social Media, Post Card, Apparel in catalogue order. Selecting Poster loads `poster.scene` into the editor, which has one page, and re-renders the preview against `poster-mockup.scene`.

**PP-03 · browser · The controls are disabled while a product loads**
Steps: hold the `apparel.scene` response with `page.route`, click Apparel, read the top bar, then release the response.
Expected: every product button is disabled while the switch is in flight and enabled again afterwards; the spinner is shown in the preview panel.

### 5.2 The mockup preview

**PP-04 · browser · Qase 1117, 1145, 1175, 1205, 1233 · An edit in the design reaches the mockup**
One test per product, so each starts from a fresh page. Run note: looping the five inside one test left the fourth product's buttons disabled past 60 s, which a fresh page never reproduced.
Steps: select the product, note the preview image's `src`, add a text block to the design, wait for the debounce.
Expected: the preview `src` changes to a new `blob:` URL (the debounce is 1500 ms). Run note: the renderer listens on `onHistoryUpdatedWithKind`, and an engine API mutation alone does not touch the history — the test calls `editor.addUndoStep()` after adding the block, as the editor UI does.

**PP-05 · browser · Qase 1118 · Fullscreen**
Steps: click the fullscreen button, then press Escape.
Expected: the preview grows to fill the row and the button's title changes to "Exit fullscreen"; Escape restores the split view. Run note: the editor is hidden with `visibility: hidden`, which the CE.SDK canvas overrides on its own element, so the case measures the preview's width instead of asserting the canvas is hidden.

**PP-06 · browser · Qase 1119 · Download the mockup**
Steps: click the download button.
Expected: one download named `post-card-mockup.jpg`, decodable as a JPEG. The name is built from the product label, so Business Card gives `business-card-mockup.jpg`.

### 5.3 The mockup editor modal

**PP-07 · browser · Qase 1120 · Edit the mockup scene**
Steps: click Edit, wait for the modal editor, move a block, open the actions menu and click Save.
Expected: the modal opens a second editor whose title is "Post Card Mockup" and whose navigation bar starts with a Back button. Save closes the modal and the preview re-renders from the edited scene. The modal editor is in Adopter role, so the dock offers no template library.

**PP-08 · browser · Qase 1241 · An edited mockup survives further design edits**
Steps: after PP-07, add a text block to the design and wait for the re-render.
Expected: the new preview still shows the edited mockup layout — the kit re-renders from the saved scene string, not from the product's mockup scene URL. Switching product afterwards discards the edit; see known issue 4.

**PP-09 · browser · Back leaves the mockup unchanged**
Steps: click Edit, move a block, click Back.
Expected: the modal closes, no re-render is triggered, and the preview image `src` is unchanged.

### 5.4 Export

**PP-10 · browser · Qase 1085 · Export PDF**
Steps: open the actions menu in the design editor's navigation bar, click Export PDF.
Expected: one PDF download with one page per design page. Run note: the first child of `ly.img.actions.navigationBar` renders as its own button (Export Images) and the dropdown next to it holds Export PDF; the postcard design has two pages, so the PDF has two.

**PP-11 · browser · Qase 1086 · Export image**
Steps: open the actions menu, click Export Image.
Expected: one PNG download whose aspect ratio is the page's own, read through `window.cesdk`, and never 1080 × 1080. `spyExport` shows exactly one `block.export` call without a target size — the navigation bar's; every call the mockup renderer makes carries the 512 × 512 placeholder size. The navigation-bar entry runs `exportDesign` with `mimeType: 'image/png'` and no target size (`apps/cesdk_web/packages/ui/components/actions/NavigationBarActionExportImage.tsx:55`), so the kit's own `exportImage` action and its 1080 × 1080 were never reached; the action is now deleted.

### 5.5 Failure path

**PP-12 · browser · A failed mockup render reports itself**
Steps: answer `**/apparel-mockup.scene` with a body the engine cannot load, then select Apparel.
Expected: the spinner clears and the preview panel shows "The mockup could not be rendered." with the engine's own message. Resolves known issue 2; `renderMockup` also revokes the object URLs a failed run created.

### 5.6 Headless cases (engine, no browser)

Subject: `src/imgly/mockup.ts`, run against the kit's own `public/*-mockup.scene` files through `file://` URLs. One engine per file; `disposeMockupRenderer()` in `afterAll`.

**PP-H1 · headless · Named placeholders are replaced**
Steps: `renderMockup(config, 'file://…/postcard-mockup.scene', { 'Image 1': 'file://…/fixture.png' })`.
Expected: every block named `Image 1` has its image fill's `fill/image/imageFileURI` set to the fixture URL, the result carries a non-empty `sceneString`, and `mockupUrl` is a `blob:` URL whose blob decodes as a JPEG.

**PP-H2 · headless · Clearing a slot**
Steps: render with `Image 1` supplied and `Image 3` … `Image 10` set to `CLEAR_IMAGE`, then render with `Image 2` set to `CLEAR_IMAGE`.
Expected: both renders succeed. The first is a no-op, because no block carries those names; the second switches the slot's fill off, and the returned scene string reports `isFillEnabled` false for it. A cleared slot now renders as the block's shape with no fill, where the old 1x1 data URI rendered a white pixel. PP-H4 adds the reverse: supplying a slot a previous render cleared turns its fill back on.

**PP-H3 · headless · A name with no match is a no-op**
Steps: render with `{ 'Image 99': 'file://…/fixture.png' }`.
Expected: no throw, and the export still succeeds.

**PP-H4 · headless · The returned scene string round-trips**
Steps: render once, then render again with `{ sceneString: result.sceneString }` and a different fixture.
Expected: the second render starts from the first result — the substituted URIs from run one are still in the scene — and the new fixture replaces `Image 1`.

**PP-H5 · headless · Export mime type**
Steps: render with no options, then with `{ exportMimeType: 'image/png' }`.
Expected: `image/jpeg` by default, `image/png` when asked, read back from the blob URL.

Run note for the whole headless lane: `renderMockup` forwards only `license`, `userId` and `baseURL`, and the engine resolves its wasm core against `baseURL`, so the tests point `baseURL` at the Node engine's own asset directory. They also delete the bare `window` the Vitest config installs for the editor imports, because it makes the engine take its browser path and read a `window.location` the process has not got.

**PP-H6 · headless · Engine reuse and disposal**
Steps: render twice, then `disposeMockupRenderer()`, then render again.
Expected: the first two calls share one engine; after the dispose a new engine is created and the render still succeeds. A second call made with a different `config` reuses the first engine and ignores the new licence and baseURL — known issue 1, pinned here.

**PP-H7 · headless · No scene loaded**
Steps: call `renderMockup` with a scene source that loads nothing.
Expected: it throws `No scene loaded` rather than exporting an empty blob.

### 5.7 Unit cases (no engine, no browser)

**PP-U1 · unit · `getPlaceholderName`**
`0 → 'Image 1'`, `9 → 'Image 10'`.

**PP-U2 · unit · Scene URL helpers**
`getDesignSceneUrl('poster')` and `getMockupSceneUrl('poster')` resolve `poster.scene` and `poster-mockup.scene` against `DEMO_ASSETS_BASE_URL`, the kit's own URL in the test; an unknown key throws `Unknown product key: x`.

**PP-U3 · unit · `downloadMockup` filename**
`Business Card → business-card-mockup.jpg`, `Social Media → social-media-mockup.jpg`.

**PP-U4 · unit · `buildPlaceholders`**
With three pages and `DEFAULT_MAX_PLACEHOLDERS` of 10: `Image 1` … `Image 3` are the exported page blobs at 512 × 512, `Image 4` … `Image 10` are `CLEAR_IMAGE`. With no pages every slot is `CLEAR_IMAGE`. With more pages than slots no `CLEAR_IMAGE` entry is written.

**PP-U5 · unit · Catalogue invariants**
Five products in catalogue order, each with a `label`, a `scenePath` and a `mockupScenePath`, and both files exist under `public/`. `getDefaultProductKey()` returning `businesscard` while `App` starts on `postcard` is asserted in PP-U2 — known issue 5, pinned there.

**PP-U6 · unit · Editor configuration**
On a spy `cesdk`: `initProductPreviewDesignEditor` installs fifteen plugins starting with the kit's config plugin, `UploadAssetSources` with `ly.img.image.upload`, `DemoAssetSources` with the five image and template globs, the light theme and the `Creator` role. `initProductPreviewSceneEditor` installs the same plugins in the same order and differs in exactly two ways — `DemoAssetSources` limited to `ly.img.image.*`, and the `Adopter` role. `setupFeatures`, `setupActions`, `setupSettings`, the dock order, the navigation bar with its two export children, and the panel positions match the files under `config/`. Both editors hand their fourteen asset sources to `addPlugin` in one batch rather than one after another. Run notes: the plugins are identified by their own `name` field, because the published bundle minifies the class names; and `setupPanels` docks the inspector **left**, not right as this plan first stated.

**PP-U10 to PP-U15 · unit · The editor configuration**
Panel placement, `setupUI`'s bar set, the canvas bar and menus, the inspector bar per edit mode, the navigation bar, the engine settings, the empty setups, `DesignEditorConfig` (which resets the editor and then pins the compatibility version to the SDK version) and the five action handlers — driven with `createApiSpy`.

**PP-U16 · removed.** `resolveAssetPath` is gone; `src/imgly/demo-assets.ts` derives the URL from `VITE_DEMO_ASSETS_BASE_URL` or the kit's own URL.

**PP-H6 · headless · A placeholder handed over as a `Blob`**
`renderMockup` turns the blob into an object URL, writes that URL into the slot, and returns it in `blobUrls` so the caller can revoke it.

### 5.8 Component cases (jsdom, no engine)

The component level mounts the kit's React tree over a stand-in `CreativeEditorSDK` and a mocked `src/imgly`, so the mockup renderer, the preview panel and the modal are driven without booting an engine.

**PP-C1 · component · Start-up**
The app configures the design editor, loads the default product's scene, refits the camera, publishes the debug handle and shows the first mockup; it reports the demo phases `created` then `ready`; unmounting disposes the mockup engine.

**PP-C2 · component · Switching product**
A product click loads that product's design scene, refits the camera and re-renders the mockup from that product's mockup scene; a click on the product that is already open does nothing.

**PP-C3 · component · A product picked while the editor is still starting up**
The product buttons unlock as soon as `isInitializing` clears, which is before the start-up zoom and the first render have finished. A switch in that window wins, and the start-up render is dropped.

**PP-C4 · component · The mockup preview panel**
The spinner while a render is in flight, the message of the last failed render, the fullscreen control and the Escape key, a key the panel ignores, the download of the rendered mockup, and the download button doing nothing while there is no mockup.

**PP-C5 · component · The mockup scene editor modal**
The modal opens on the rendered mockup scene, sets the product title and refits the page; Save re-renders the mockup from the saved scene string and closes the modal; with no rendered mockup yet it opens on the product's mockup scene URL instead; Back closes without saving; the modal reports its own demo phases `created` then `ready`; and a save the engine refuses is logged rather than treated as a save.

**PP-C6 · component · The entry point**
The app mounts into the `#root` container the page ships, and the entry fails loudly when there is none.

**PP-C7 to PP-C11 · component · The mockup renderer hook**
Rendering from the product mockup scene URL and from an edited scene string, the reset back to the URL, a failed render reported by message and a rejection that is not an `Error` by its string form, the release of the previous render's object URLs, the no-editor guard, overlapping renders, the debounced auto-refresh on a design change, a queued render dropped when the editor goes away, and the unmount that drops the subscription and releases the URLs.

**PP-U16 · unit · `renderMockup` when the scene is gone**
Reports the missing scene and releases the placeholder URLs it had created.

**PP-U17 · unit · `renderMockup` when the export fails**
Releases the placeholder URLs and passes the engine's error on.

**KB-01 · unit · Keyboard catalog predicates**

`tests/unit/keyboard-catalog.test.ts` runs every `run` and `when` of `src/imgly/config/keyboard/catalogs/us-ansi.ts` against 1620 editor states (5 edit modes, 9 selections, 3 roles, features on and off, 3 vector states, page and no page) and asserts that none throws, that every shortcut activates in at least one state, and that every function `run` reaches `cesdk.actions.run`. Kit-owned: the kit decides which key does what and when it is live. The catalog measures 100 % lines, branches and functions.

## 6. Entry and exit criteria

Entry: engine and editor built; test license available; the shared kit test harness exists; the `buildPlaceholders` extraction has landed; the kit's `test:unit` and `test:e2e` scripts replaced with the real commands. All met.

Exit: every case in section 5 passes locally and in CI. `npm run ci` passes. The published kit contains no test files. A release run reports results to the Qase ids above.

## 7. Known issues found while writing this plan

Fixed in this batch: issue 2 — a failed render now shows a message and `renderMockup` revokes the object URLs it created before it threw; issue 10 — the unreachable `exportImage` action is deleted.

Fixed, found by the headless lane: `saveToString` refuses a `data:` resource URL, so the old 1x1-pixel `CLEAR_IMAGE` made the whole render fail whenever it reached a slot the mockup scene actually carries. `CLEAR_IMAGE` is now a sentinel that switches the slot's fill off; see PP-H2.

The rest are confirmed and still open.

1. `renderMockup` creates its engine on the first call and keeps it in a module-level variable. Every later call ignores the `config` it is handed, so a licence or `baseURL` change after the first render has no effect.
2. Fixed. `executeRender` had a `finally` that cleared `isLoading` but no `catch`, so a failed render left the previous mockup on screen with no message and leaked the blob URLs of the failed run.
3. `MockupModal` builds a new `config` object literal on every render and passes it to `<CreativeEditor config>`. Whether that re-initialises the second engine depends on the React wrapper, which has no test of its own (gap 5). Confirm with a test before treating it as a defect.
4. Switching product calls `resetMockupScene()`, so a mockup the user edited in the modal is silently discarded. Qase 1241 asks the same question for a design edit, where the scene _is_ kept.
5. `getDefaultProductKey()` returns `businesscard`, `App` hardcodes `INITIAL_PRODUCT_KEY = 'postcard'`, and nothing calls the helper.
6. `public/1x1-ffffffff.png` and `public/icons/fullscreen-exit.svg` are not referenced by any source file. `Icon`'s `name` union also lists `edit` and `download` variants that exist and `fullscreen-exit` that does not get used.
7. The last mockup blob URL is revoked only when the App unmounts, so the browser holds one decoded JPEG per session beyond the current one.
8. `config/i18n.ts` is an empty `void cesdk;` stub while the README documents localization.
9. The README's Architecture tree omits `config/keyboard/`, which the kit ships and `plugin.ts` calls.
10. Fixed. `actions.ts` registered an `exportImage` action at 1080 × 1080 that no UI reached: `ly.img.exportImage.navigationBar` runs `exportDesign` with `mimeType: 'image/png'` and no target size (`apps/cesdk_web/packages/ui/components/actions/NavigationBarActionExportImage.tsx:55`). PP-11 asserts the PNG comes out at the page's own size.

### Coverage residue

`npm run ci` reports **lines 100 %, branches 96.73 %, functions 100 %**. Five branch arms of `src/**` are uncovered, all of them the `return` side of a defensive guard the app cannot produce.

| Where                                    | Guard                                                                     | Proof                                                                                                                                                                                                                                                               |
| ---------------------------------------- | ------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/app/App.tsx` 64                     | `if (!designEngine \|\| productKey === currentProductKey)`                | `ProductSelector` already drops a click on the open product, so the second half never arrives here. The first half needs a product button that is enabled before `handleEditorInit` set the ref, and the buttons stay `disabled` for the whole of `isInitializing`. |
| `src/app/App.tsx` 74, 81                 | `if (sceneLoad !== sceneLoadRef.current)` in `handleProductChange`        | A second switch cannot start while one is in flight: the buttons carry `disabled={isProductSwitching \|\| isInitializing}` and `handleProductChange` sets `isProductSwitching` before its first `await`.                                                            |
| `src/app/App.tsx` 129                    | the first `if (sceneLoad !== sceneLoadRef.current)` in `handleEditorInit` | `handleProductChange` is the only other writer of `sceneLoadRef`, and it is unreachable until `setIsInitializing(false)` has re-rendered — which happens after this line runs. PP-C3 covers the second guard (133), where the window is real.                       |
| `src/app/MockupModal/MockupModal.tsx` 60 | `if (!cesdk) return;` in `handleSave`                                     | `handleSave` reaches the UI only through the navigation-bar entry that `handleEditorInit` registers, and `handleEditorInit` sets `cesdkRef.current` on its first line.                                                                                              |

## 8. Open questions

1. Issue 1: should `renderMockup` re-create the engine when `config` changes, or should the config be passed once at module init? Recommendation: take the config in an explicit `initMockupRenderer(config)` and let `renderMockup` take only the scene and the placeholders. It also makes PP-H6 simpler.
2. Resolved: the panel shows the engine's message and the failed run's blob URLs are revoked. PP-12 asserts the message.
3. Issue 4: should an edited mockup scene survive a product switch? It cannot be reused as-is, since each product has its own mockup scene. Recommendation: keep one edited scene per product key rather than one global one.

## 9. Estimate

16 browser cases, of which PP-04 is five; each waits for at least one mockup render, so about 15 s each: about 4 minutes on one worker. 7 headless cases sharing one engine: about 30 s. Unit tests under 1 s.

## 10. Boundary review

Rule used: the code that makes a decision owns the test for it. The kit decides the product catalogue and its scene files, the placeholder naming convention and how many slots to clear, the 512 × 512 page export, the 1500 ms debounce, the two editor roles, the modal's Back and Save entries, and the download filename. The engine decides what loading a scene and exporting a block produce. The editor decides how the navigation bar renders and what a role hides.

Core behaviour this plan leans on, and where it is covered today:

| Behaviour                                                           | Owner  | Covered by                                                                                                                                       |
| ------------------------------------------------------------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `scene.load` from a string and `saveToString` round trip            | engine | `bindings/shared/ts/src/tests/scene-extended.test.ts:97, 296`; `engine/lib/test/api/ArchiveRoundTripAPITest.cpp:153`                             |
| `block.export` to PNG and JPEG                                      | engine | `bindings/shared/ts/src/tests/block-export.test.ts:33, 62, 88`; `engine/lib/test/api/ExportAPITest.cpp`                                          |
| `block.export` to PDF                                               | engine | `engine/lib/test/api/ExportAPITest.cpp` PDF matrix from `:417`; `bindings/wasm/js_node/src/__tests__/PdfExportProgress.test.ts:38`               |
| `findByName` and `findByKind`                                       | engine | `engine/lib/test/api/BlockLifecycleTest.cpp:313, 329`; `bindings/shared/ts/src/tests/block-find-identity-visibility.test.ts:32`                  |
| `getFill` plus `setString(fill, 'fill/image/imageFileURI', …)`      | engine | `engine/lib/test/api/BlockPropertiesTest.cpp:366` (`addImageFileURIToSourceSet`); property sweep in `PropertySweepAPITest.cpp:70`                |
| `editor.onHistoryUpdatedWithKind` fires on a design change          | engine | `bindings/wasm/js_node/src/EditorAPI.test.ts:74`. Note the plain `onHistoryUpdated` is the deprecated one; this kit already uses the current API |
| `editor.setRole('Creator')` / `('Adopter')`                         | editor | `apps/cesdk_web/packages/api/configuration/RoleSettings.test.ts:57, 70`; `apps/cesdk_web/packages/ui/utils/hooks/useRole.test.ts:36`             |
| `ui.insertOrderComponent` and `updateOrderComponent` with a matcher | editor | `apps/cesdk_web/packages/api/ui/UserInterfaceAPI.test.ts:665, 261`                                                                               |
| `i18n.setTranslations` overriding `editor.title`                    | editor | `apps/cesdk_web/packages/cesdk/` translation tests; `apps/cesdk_web/packages/api/i18n/`                                                          |
| `actions.run('zoom.toPage', { page: 'first', autoFit: true })`      | editor | `apps/cesdk_web/packages/cesdk/registerDefaultActions.test.ts:785, 797, 861`                                                                     |
| `utils.export` and `utils.downloadFile` behind `exportDesign`       | editor | `apps/cesdk_web/packages/api/utils/UtilsAPI.test.ts:288, 192`; `registerDefaultActions.test.ts:355`                                              |

Core coverage gaps found (candidates to add in the core suites, not in this kit):

1. Editor: the React wrapper `@cesdk/cesdk-js/react` (`packages/cesdk-react/`) has no test file at all. This kit mounts it twice — once for the design editor and once inside the modal — and known issue 3 is a direct question about it: does a new `config` object identity re-initialise the engine? Suggested home: `packages/cesdk-react/`.
2. Engine: two engines in one process. Nothing in the JS suites creates a second `CreativeEngine` while the first is alive, disposes one and keeps using the other. This kit does exactly that on every page load. Suggested home: `bindings/wasm/js_node/src/__tests__/`.
3. Engine: `scene.load(url)` — the JS suites only exercise the string form; the gtest URL cases (`ArchiveRoundTripAPITest.cpp:121, 127`) cover only an empty and an invalid URI. Every product switch here loads a scene by URL. Suggested home: `bindings/shared/ts/src/tests/scene-extended.test.ts`.
4. Engine: `targetWidth` / `targetHeight` on the JS `block.export` options object, covered in gtest (`ExportAPITest.cpp:137`) but not from JS. Every placeholder in this kit is a 512 × 512 page export. Suggested home: `bindings/shared/ts/src/tests/block-export.test.ts`.
5. Editor: what an `Adopter` role actually hides in the UI. `RoleSettings.test.ts` and `useRole.test.ts` assert the setter and the hook, not the resulting dock or inspector. PP-07 asserts the modal offers no template library, which is the only thing pinning it. Suggested home: `apps/cesdk_web/packages/ui/`.

Until gap 1 is closed, PP-07 and PP-09 keep their modal round trip as the end-to-end proof, and known issue 3 stays a question rather than a defect.
