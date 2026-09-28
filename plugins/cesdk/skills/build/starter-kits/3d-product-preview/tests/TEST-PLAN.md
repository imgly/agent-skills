# Test plan: starterkit-3d-product-preview

Version 6, 7 Sep 2026. Status: implemented and green. 64 unit, 11 headless, 33 component and 12 browser cases run in `KIT_TEST_COVERAGE=1 npm run ci`. Merged coverage is **lines 100 %, branches 96.1 %, functions 100 %**. The component level is new in version 5: it mounts `App`, `Mockup3DPreview` and `useMockupRenderer` over a stand-in editor, which is what takes the React tree from untested to fully covered. Every branch that is still open is listed in the coverage residue below.

## 1. Purpose

Verify that the 3D Product Preview starter kit works as shipped: the design editor opens on the apparel design, a second headless engine renders the design pages into the product's texture scene, the rendered texture is applied to the right material of the glTF model, the three products load their own model and camera framing, the preview can be expanded, and the design exports as PDF and image.

## 2. Scope

In scope

- `src/imgly/mockup.ts`: placeholder replacement, clearing unused slots, crop reset, PNG export, the returned scene string, engine reuse and disposal
- The three-product catalogue and its design, texture and model URL helpers
- `useMockupRenderer`: building placeholders from the design pages at 1048 × 1048, the debounced re-render on a history update, the immediate render on a product change
- `Mockup3DPreview`: the `<model-viewer>` `src` and `camera-orbit`, applying the rendered texture to `materials[baseColorTextureIndex]`, fullscreen and Escape
- The kit's editor configuration under `src/imgly/config/`

Out of scope

- Core editor features reached through this kit (text editing, asset library, crop, undo, inspector). Covered by the core editor suite.
- 3D rendering, orbit interaction, lighting and the glTF loader. These belong to `@google/model-viewer`, a third-party dependency. The kit decides only the `src`, the `camera-orbit`, the `camera-controls` attribute and the material index; the rest is the library's.
- The demo site around the kit (cards, tags, links, platform toggles, Back to Showcases). Covered by the `cesdk_web_demos` suite. Qase 1570, 1571, 1572, 1573, 1574, 1589, 1598, 2449.

## 3. Test environment

- Browser: Chrome, headless, 1400 × 900. `<model-viewer>` needs WebGL; the harness runs Chromium through `channel: 'chrome'`, which has it. Confirmed by the run: the model loads, `createTexture` resolves, and a drag moves the live camera.
- Engine and editor: built from this repo, served locally. Requests to `cdn.img.ly` for engine assets fail the test.
- License: the shared test license (valid on hostname `localhost` only)
- Data: this kit has **no `public/` directory**. Design scenes, texture scenes, glTF models with their `.bin` and textures, and the four SVG icons all come from `DEMO_ASSETS_BASE_URL`. Tests point `VITE_DEMO_ASSETS_BASE_URL` at the in-repo copy `packages/cesdk-web-examples-data/data/starterkit-3d-product-preview/`, which holds all three product folders and `icons/`, so no test reaches `staticimgly.com`.
- Hook: `App.handleEditorInit` sets `window.cesdk` to the design editor. The 3D preview is driven through the DOM.
- Two engines run in the tab: the design editor and the headless mockup renderer. The console guard has no allowlist entries — the one `console.error` in this kit, in `applyTexture`, sits on a failure path. No `cdnAllowlist`. The demo design scenes' font URIs are relative to the engine's `baseURL`, so the suite runs with the CDN guard at its default.
- Headless: Vitest + `@cesdk/node` (`@cesdk/engine` aliased to it). `renderMockup` is exercised with **string** placeholders pointing at `file://` fixtures inside the in-repo demo data. The `Blob` branch creates `blob:` URLs the Node engine cannot fetch, and `block.export` on a block whose resource never loads waits rather than rejecting, so a Blob placeholder would hang the run to its timeout. The Blob path is covered in the browser instead.
- Downloads: captured by Playwright and checked by file type, pixel size and PDF page count.

## 4. Approach

| Kind     | Tool                          | What it checks                                                   | Run                 |
| -------- | ----------------------------- | ---------------------------------------------------------------- | ------------------- |
| Static   | tsc, eslint, convention check | Types, deprecated APIs, kit folder shape                         | `npm run check:all` |
| Unit     | Vitest                        | URL helpers, catalogue, placeholder naming, editor configuration | `npm run test:unit` |
| Headless | Vitest + `@cesdk/node`        | `renderMockup` against the kit's own texture scenes              | `npm run test:unit` |
| Browser  | Playwright                    | The test cases in section 5                                      | `npm run test:e2e`  |

All four run in the kit's `ci` script. Browser tests use role and label locators only.

`src/imgly/mockup.ts` runs headless as it stands. One extraction landed, the same as the product-preview kit's: `buildPlaceholders` lived inside `useMockupRenderer` as a `useCallback`, so its "N pages, then `CLEAR_IMAGE` up to `DEFAULT_MAX_PLACEHOLDERS`" rule was only reachable through React. It is now `buildPlaceholders(engine, maxPlaceholders, size)` in `src/app/utils.ts`.

## 5. Test cases

Format: ID, level, Qase id, title. Then steps and expected result.
Common precondition for all browser cases: the kit is open in the browser, the design editor has loaded its scene, and the first texture has been applied.

### 5.1 Start-up and product switching

**P3D-01 · browser · Qase 1604 · Apparel is selected and its model is textured**
Steps: open the kit.
Expected: Apparel is the active button in the top bar, the design canvas shows the apparel design scene, `<model-viewer>` has fired `load`, and its `src` ends in `t-shirt/scene.gltf`. The preview spinner has cleared. No console errors. No request to `cdn.img.ly`.

**P3D-02 · browser · Qase 1603 · Three product controls**
Steps: read the top bar.
Expected: Business Card, Baseball Cap, Apparel in catalogue order, with Apparel active. Every button is disabled while a switch is in flight and enabled again afterwards.

**P3D-03 · browser · Qase 1735, 1739, 1742 · Each product loads its own model and framing**
One test per product, so each starts from a fresh page. Run note: looping the three inside one test left the last product's buttons disabled past 90 s, which a fresh page never reproduced.
Steps: select the product.
Expected: `<model-viewer>`'s `src` is `<base>/<assetsFolderName>/scene.gltf`, its `camera-orbit` attribute is the catalogue value (`0deg 90deg` for apparel, `160deg 90deg` for the other two), the design editor has loaded that product's `design.scene`, and the `load` event fires without a console error.

### 5.2 The 3D preview

**P3D-04 · browser · Qase 1634 · An edit in the design reaches the 3D texture**
Steps: add a text block to the design, wait for the debounce.
Expected: `createTexture` is called on the model viewer with a new `blob:` URL and `setTexture` on `materials[1]`, apparel being the start product. Asserted by instrumenting the `<model-viewer>` element from the test, not by reading pixels. Run note: the test calls `editor.addUndoStep()` after adding the block, because the renderer listens on `onHistoryUpdatedWithKind` and an engine API mutation alone does not touch the history.

**P3D-05 · browser · Qase 1635, 1738 · Fullscreen and exit**
Steps: click the fullscreen button, then click it again; repeat and press Escape instead.
Expected: the preview grows to fill the row and the button's title reads "Exit fullscreen"; both the second click and Escape restore the split view. Run note: the editor is hidden with `visibility: hidden`, which the CE.SDK canvas overrides on its own element, so the case measures the preview's width instead.

**P3D-06 · browser · Qase 1736, 1737 · The kit hands orbit control to model-viewer**
Steps: read the live camera through `getCameraOrbit()`, drag across the model, read it again.
Expected: `<model-viewer>` carries `camera-controls`, and the drag changes the live orbit. The orbit maths belongs to `@google/model-viewer`; this case proves only that the kit enables the control and does not overwrite the orbit on a re-render. Run note: the `cameraOrbit` property mirrors the attribute the kit sets and never moves with a drag — only `getCameraOrbit()` does.

**P3D-07 · browser · Switching product re-frames the camera**
Steps: from Apparel select Business Card.
Expected: `cameraOrbit` becomes `160deg 90deg` and `jumpCameraToGoal` is called, so the new product is shown from its catalogue angle rather than the angle the user left the previous one at.

### 5.3 Export

**P3D-08 · browser · Qase 1638 · Export PDF**
Steps: open the actions menu in the design editor's navigation bar, click Export PDF.
Expected: one PDF download with one page per design page. Run note: the first child of `ly.img.actions.navigationBar` renders as its own button (Export Images) and the dropdown next to it holds Export PDF.
Asserts the options the kit passes to `engine.block.export` and that a file of the declared type downloaded; the exported pixel size belongs to `engine/lib/test/api/ExportAPITest.cpp`.

**P3D-09 · browser · Qase 1639 · Export image**
Steps: open the actions menu, click Export Image.
Expected: one PNG download whose pixel size is the page's own size, read through `window.cesdk`. The navigation-bar entry runs `exportDesign` with `mimeType: 'image/png'` and no target size (`apps/cesdk_web/packages/ui/components/actions/NavigationBarActionExportImage.tsx:55`), so the kit's own `exportImage` action and its 1080 × 1080 are never reached — known issue below.
Asserts the options the kit passes to `engine.block.export` and that a file of the declared type downloaded; the exported pixel size belongs to `engine/lib/test/api/ExportAPITest.cpp`.

### 5.4 Failure path

**P3D-10 · browser · A failed texture render reports itself**
Steps: answer the texture scene with a body the engine cannot load, then switch product.
Expected: the spinner clears and the preview panel shows "The texture could not be rendered." with the engine's own message. Resolves known issue 2; `renderMockup` also revokes the object URLs a failed run created.

### 5.5 Headless cases (engine, no browser)

Subject: `src/imgly/mockup.ts`, run against `t-shirt/textures/Material_baseColor.scene` from the in-repo demo data through `file://` URLs. One engine per file; `disposeMockupRenderer()` in `afterAll`.

**P3D-H1 · headless · Named placeholders are replaced and their crop is reset**
Steps: `renderMockup(config, 'file://…/Material_baseColor.scene', { 'Image 1': 'file://…/fixture.png' })`.
Expected: every block named `Image 1` has its image fill's `fill/image/imageFileURI` set to the fixture URL **and** its crop reset — this copy of `renderMockup` calls `resetCrop`, the product-preview copy does not. The result carries a non-empty `sceneString` and a `blob:` `mockupUrl`.

**P3D-H2 · headless · The export defaults to PNG**
Steps: render with no options, then with `{ exportMimeType: 'image/jpeg' }`.
Expected: `image/png` by default (this kit's `DEFAULT_EXPORT_MIME_TYPE`, unlike product-preview's JPEG), `image/jpeg` when asked, read back from the blob URL. PNG matters because the blob becomes a glTF base-colour texture.

Run note for the whole headless lane: `renderMockup` forwards only `license`, `userId` and `baseURL`, and the engine resolves its wasm core against `baseURL`, so the tests point `baseURL` at the Node engine's own asset directory. They also delete the bare `window` the Vitest config installs for the editor imports, because it makes the engine take its browser path and read a `window.location` the process has not got. The texture scenes and the fixture come from `packages/cesdk-web-examples-data/data/starterkit-3d-product-preview/`, which needs `git lfs pull` on a fresh checkout.

**P3D-H3 · headless · Clearing a slot**
Steps: render with `Image 1` supplied and the other nine set to `CLEAR_IMAGE`.
Expected: the render succeeds, because the t-shirt texture scene carries no block by those names. A second case clears `Image 1`, which the scene does carry, and asserts the render still succeeds with that slot's fill switched off. A cleared slot now renders as the block's shape with no fill, where the old 1x1 data URI rendered a white pixel. P3D-H5 adds the reverse: supplying a slot a previous render cleared turns its fill back on.

**P3D-H4 · headless · A name with no match is a no-op**
Steps: render with `{ 'Image 99': 'file://…/fixture.png' }`.
Expected: no throw, and the export still succeeds.

**P3D-H5 · headless · The returned scene string round-trips**
Steps: render once, then render again with `{ sceneString: result.sceneString }` and a different fixture.
Expected: the second render starts from the first result and the new fixture replaces `Image 1`.

**P3D-H6 · headless · Engine reuse and disposal**
Steps: render twice, then `disposeMockupRenderer()`, then render again.
Expected: the first two calls share one engine; after the dispose a new engine is created and the render succeeds. A second call made with a different `config` reuses the first engine and ignores the new licence and baseURL — known issue 1, pinned here.

**P3D-H7 · headless · No scene loaded**
Steps: call `renderMockup` with a scene source that loads nothing.
Expected: it throws `No scene loaded` rather than exporting an empty blob.

### 5.6 Unit cases (no engine, no browser)

**P3D-U1 · unit · `getPlaceholderName`**
`0 → 'Image 1'`, `9 → 'Image 10'`.

**P3D-U2 · unit · URL helpers**
`getDesignSceneUrl`, `getMockupSceneUrl` and `getModelUrl` build `<base>/<assetsFolderName>/design.scene`, `/textures/Material_baseColor.scene` and `/scene.gltf`; each throws `Unknown product key: x` for an unknown key. `DEMO_ASSETS_BASE_URL` prefers `VITE_DEMO_ASSETS_BASE_URL` and falls back to the CDN constant.

**P3D-U3 · unit · Catalogue invariants**
Three products with unique keys; each has a `label`, an `assetsFolderName`, a `baseColorTextureIndex` and a `cameraOrbit` in the `<n>deg <n>deg` shape; every referenced asset folder exists in the in-repo demo data. Apparel is the only product whose texture index is not 0.

**P3D-U4 · unit · `buildPlaceholders`**
With three pages and `DEFAULT_MAX_PLACEHOLDERS` of 10: `Image 1` … `Image 3` are page blobs exported at 1048 × 1048, `Image 4` … `Image 10` are `CLEAR_IMAGE`. With no pages every slot is `CLEAR_IMAGE`.

**P3D-U5 · unit · Dead exports**
`downloadMockup` and `getDefaultProductKey` in `src/app/utils.ts` are exported and called by nothing; `getDefaultProductKey()` returns `businesscard` while `App` starts on `apparel`, and the preview has no download button at all. Known issue 3, pinned here so the next reader sees it.

**P3D-U6 · unit · Editor configuration**
On a spy `cesdk`: `init3dProductPreviewEditor` installs fifteen plugins starting with the kit's config plugin, `UploadAssetSources` with `ly.img.image.upload`, `DemoAssetSources` with `ly.img.image.*` only, the light theme and the `Creator` role, and it hands the fourteen asset sources to `addPlugin` in one batch rather than one after another. `setupFeatures` enables exactly the ids in `features.ts`; the dock order, the navigation bar with its two export children and its `removeOrderComponent` of the document-settings entry, the canvas bar and the panel positions match the files under `config/`; `setupComponents` registers nothing. Run notes: the plugins are identified by their own `name` field, because the published bundle minifies the class names; and `setupPanels` docks the inspector **left**, not right.

**P3D-U7 · unit · `downloadMockup`**
The download names the file after the product label, lower-cased and hyphenated, and clicks a temporary anchor that is added to and removed from the document.

**P3D-U10 to P3D-U15 · unit · The editor configuration**
Panel placement, `setupUI`'s bar set, the canvas bar and menus, the inspector bar per edit mode, the navigation bar (which drops the document-settings entry and offers image and PDF export), the engine settings, the empty setups, `DesignEditorConfig` (which resets the editor and then pins the compatibility version to the SDK version) and the five action handlers.

**P3D-H6 · headless · A placeholder handed over as a `Blob`**
`renderMockup` turns the blob into an object URL, writes that URL into the slot, and returns it in `blobUrls` so the caller can revoke it.

### 5.7 Component cases (jsdom, no engine)

The component level mounts the kit's React tree over a stand-in `CreativeEditorSDK` and a mocked `src/imgly`, so the mockup renderer, the 3D panel and the app shell are driven without booting an engine.

**P3D-C1 · component · The 3D preview panel**
The spinner while a render is in flight, the message of the last failed render once it is idle, the camera orbit written onto the element, the fullscreen control and the Escape key, and a key the panel ignores.

**P3D-C2 · component · Applying the rendered texture**
The texture is created from the mockup URL and set on the product material once the model fires `load`; a URL already applied is not applied twice; a material with no base colour texture is skipped; a texture that cannot be created is logged, not thrown; and nothing is created while there is no mockup image.

**P3D-C3 · component · Rendering a product**
`renderMockupForProduct` renders from the product's mockup scene URL and publishes the URL, the scene string and the idle state; `updateMockupScene` renders from the edited scene string instead; `resetMockupScene` goes back to the URL; a failed render is reported by its message, and a rejection that is not an `Error` by its string form; the previous render's object URLs are released; and nothing happens while the design editor is not there.

**P3D-C4 · component · Renders that overlap**
A request that arrives while one is running is queued and runs once, after the debounce.

**P3D-C5 · component · Auto-refresh on a design change**
The history subscription is taken only once the engine reports it is ready and never without a design editor; two changes debounce into one render; a change during a render is queued; a queued render is dropped when the editor goes away first; and unmounting drops the subscription and releases the blob URLs.

**P3D-C6 · component · Start-up**
The app configures the editor, loads the default product's design scene, refits the camera, publishes the debug handle and renders the first mockup; it reports the demo phases `created` then `ready`; unmounting disposes the mockup engine.

**P3D-C7 · component · Switching product**
A product click loads that product's design scene, refits the camera and re-renders the mockup; a click on the product that is already open does nothing.

**P3D-C8 · component · The fullscreen toggle**
Fullscreen hides the editor pane and shows it again.

**P3D-C9 · component · A product picked while the editor is still starting up**
The product buttons unlock as soon as `isInitializing` clears, which is before the start-up zoom and the first render have finished. A switch in that window wins, and the start-up render is dropped.

**P3D-U16 · unit · `renderMockup` when the scene is gone**
Reports the missing scene and releases the placeholder URLs it had created.

**P3D-U17 · unit · `renderMockup` when the export fails**
Releases the placeholder URLs and passes the engine's error on.

**KB-01 · unit · Keyboard catalog predicates**

`tests/unit/keyboard-catalog.test.ts` runs every `run` and `when` of `src/imgly/config/keyboard/catalogs/us-ansi.ts` against 1620 editor states (5 edit modes, 9 selections, 3 roles, features on and off, 3 vector states, page and no page) and asserts that none throws, that every shortcut activates in at least one state, and that every function `run` reaches `cesdk.actions.run`. Kit-owned: the kit decides which key does what and when it is live. The catalog measures 100 % lines, branches and functions.

## 6. Entry and exit criteria

Entry: engine and editor built; test license available; the shared kit test harness exists; the demo data resolves from the in-repo package in both dev and static mode; the `buildPlaceholders` extraction has landed; the kit's `test:unit` and `test:e2e` scripts replaced with the real commands. All met.

Exit: every case in section 5 passes locally and in CI. `npm run ci` passes. The published kit contains no test files. A release run reports results to the Qase ids above.

## 7. Known issues found while writing this plan

Fixed in this batch: issue 2 — a failed render now shows a message and `renderMockup` revokes the object URLs it created before it threw; issue 11 — the unreachable `exportImage` action is deleted.

The rest are confirmed and still open.

1. `renderMockup` creates its engine on the first call and keeps it in a module-level variable. Every later call ignores the `config` it is handed.
2. Fixed. `executeRender` had a `finally` that cleared `isLoading` but no `catch`, so a failed render left the model untextured with no message and leaked the blob URLs of the failed run.
3. `src/app/utils.ts` exports `downloadMockup` and `getDefaultProductKey`; nothing calls either. The 3D preview has no download button, and `getDefaultProductKey()` disagrees with `App`'s `DEFAULT_PRODUCT_KEY`.
4. `Icon`'s `name` union lists `edit` and `download`; the 3D preview renders only `fullscreen` and `fullscreen-leave`.
5. The kit has no `public/` directory, so every asset — scenes, models, textures and icons — is fetched from `staticimgly.com` at run time. Anyone cloning the kit gets a hard dependency on that host with no local fallback, which the README's "set it to `''` and place the files in `public/`" note does not make possible, because no `public/` exists to place them in.
6. `applyTexture` catches its error, logs it and leaves the model untextured with no user-visible state. **Fixed alongside it:** the panel passed `onLoad={handleModelLoad}` to `<model-viewer>`, and React 18 wires an `onLoad` prop only for a fixed set of tags (`img`, `image`, `link`), never for a custom element — measured, not assumed. The handler had therefore never run in any browser, so a model that finished loading after a mockup was already rendered stayed untextured. The panel now adds a real `load` listener to the element.
7. This copy of `renderMockup` calls `resetCrop` on each replaced block and defaults to PNG; the product-preview copy does neither. The two files have drifted with no note saying which behaviour is intended for which kit.
8. `config/i18n.ts` is an empty `void cesdk;` stub while the README documents localization.
9. The README's Architecture tree omits `config/keyboard/` and `src/app/constants.ts`, and shows `imgly/config/` without the keyboard folder the kit ships.
10. `check:lint` here is `node ../scripts/assert-cesdk-types.mjs && eslint --max-warnings 0 …` while most kits run a bare `eslint`. Fleet drift; agent C owns it.
11. Fixed. `actions.ts` registered an `exportImage` action at 1080 × 1080 that no UI reached: `ly.img.exportImage.navigationBar` runs `exportDesign` with `mimeType: 'image/png'` and no target size (`apps/cesdk_web/packages/ui/components/actions/NavigationBarActionExportImage.tsx:55`). P3D-09 asserts the PNG comes out at the page's own size.

### Coverage residue

`npm run ci` reports **lines 100 %, branches 96.1 %, functions 100 %**. Six branch arms of `src/**` are uncovered, all of them the `return` side of a defensive guard the app cannot produce.

| Where                                            | Guard                                                                     | Proof                                                                                                                                                                                                                                                               |
| ------------------------------------------------ | ------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/app/App.tsx` 59                             | `if (!designEngine \|\| productKey === currentProductKey)`                | `ProductSelector` already drops a click on the open product, so the second half never arrives here. The first half needs a product button that is enabled before `handleEditorInit` set the ref, and the buttons stay `disabled` for the whole of `isInitializing`. |
| `src/app/App.tsx` 69, 76                         | `if (sceneLoad !== sceneLoadRef.current)` in `handleProductChange`        | A second switch cannot start while one is in flight: the buttons carry `disabled={isProductSwitching \|\| isInitializing}` and `handleProductChange` sets `isProductSwitching` before its first `await`.                                                            |
| `src/app/App.tsx` 114                            | the first `if (sceneLoad !== sceneLoadRef.current)` in `handleEditorInit` | `handleProductChange` is the only other writer of `sceneLoadRef`, and it is unreachable until `setIsInitializing(false)` has re-rendered — which happens after this line runs. P3D-C9 covers the second guard (118), where the window is real.                      |
| `src/app/Mockup3DPreview/Mockup3DPreview.tsx` 54 | `if (!modelViewer \|\| !mockupImageUrl)` in `applyTexture`                | Both callers already test `mockupImageUrl`, and the `<model-viewer>` element is rendered unconditionally, so the ref is attached before any effect runs. The guard also narrows the ref for the `modelViewer.model` reads below it.                                 |
| `src/app/Mockup3DPreview/Mockup3DPreview.tsx` 98 | `if (!modelViewer)` in the camera-orbit effect                            | Same: the element is always rendered, so the ref is never null by the time an effect runs.                                                                                                                                                                          |

## 8. Open questions

1. Issue 5: should the kit ship a `public/` with at least one product so it runs offline? Recommendation: yes for the smallest product (business card); the t-shirt model and its textures are large. Elia decides — it changes the published kit's size.
2. Resolved: the panel shows the engine's message and the failed run's blob URLs are revoked, matching the product-preview kit. P3D-10 asserts the message.
3. Issue 7: the two `mockup.ts` copies. Recommendation: keep both behaviours but state in each file's header why (a glTF base-colour texture wants PNG and an uncropped fill), so the next sweep does not "fix" one into the other.

## 9. Estimate

10 browser cases, of which P3D-03 runs three times; each waits for a model load and a texture render, so about 18 s each: about 4 minutes on one worker. 7 headless cases sharing one engine: about 30 s. Unit tests under 1 s.

## 10. Boundary review

Rule used: the code that makes a decision owns the test for it. The kit decides the product catalogue, which glTF model and camera angle each product uses, which material index carries the base colour, the placeholder naming and the 1048 × 1048 page export, the PNG texture format, and the 1500 ms debounce. `@google/model-viewer` decides how the model is loaded, lit and rotated. The engine decides what loading a scene and exporting a block produce. The editor decides how the navigation bar renders.

Core behaviour this plan leans on, and where it is covered today:

| Behaviour                                                      | Owner                  | Covered by                                                                                                                         |
| -------------------------------------------------------------- | ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `scene.load` from a string and `saveToString` round trip       | engine                 | `bindings/shared/ts/src/tests/scene-extended.test.ts:97, 296`; `engine/lib/test/api/ArchiveRoundTripAPITest.cpp:153`               |
| `block.export` to PNG                                          | engine                 | `bindings/shared/ts/src/tests/block-export.test.ts:33, 88`; `engine/lib/test/api/ExportAPITest.cpp`                                |
| `block.export` to PDF                                          | engine                 | `engine/lib/test/api/ExportAPITest.cpp` PDF matrix from `:417`; `bindings/wasm/js_node/src/__tests__/PdfExportProgress.test.ts:38` |
| `block.resetCrop`                                              | engine                 | `engine/lib/test/api/CropAPITest.cpp`; `bindings/shared/ts/src/tests/block-crop-frame.test.ts`                                     |
| `findByName` and `findByKind`                                  | engine                 | `engine/lib/test/api/BlockLifecycleTest.cpp:313, 329`; `bindings/shared/ts/src/tests/block-find-identity-visibility.test.ts:32`    |
| `getFill` plus `setString(fill, 'fill/image/imageFileURI', …)` | engine                 | `engine/lib/test/api/BlockPropertiesTest.cpp:366`; property sweep in `PropertySweepAPITest.cpp:70`                                 |
| `editor.onHistoryUpdatedWithKind` fires on a design change     | engine                 | `bindings/wasm/js_node/src/EditorAPI.test.ts:74`                                                                                   |
| `editor.setRole('Creator')`                                    | editor                 | `apps/cesdk_web/packages/api/configuration/RoleSettings.test.ts:57`                                                                |
| `ui.setComponentOrder` for the navigation bar with children    | editor                 | `apps/cesdk_web/packages/api/ui/UserInterfaceAPI.test.ts:72, 1027`                                                                 |
| `actions.run('zoom.toPage', { page: 'first', autoFit: true })` | editor                 | `apps/cesdk_web/packages/cesdk/registerDefaultActions.test.ts:785, 861`                                                            |
| `utils.export` and `utils.downloadFile` behind `exportDesign`  | editor                 | `apps/cesdk_web/packages/api/utils/UtilsAPI.test.ts:288, 192`; `registerDefaultActions.test.ts:355`                                |
| glTF loading, orbit interaction, `createTexture`, `setTexture` | `@google/model-viewer` | Upstream. Not this repo's to test; P3D-06 asserts only that the kit enables the control and keeps the orbit it set.                |

Core coverage gaps found (candidates to add in the core suites, not in this kit):

1. Editor: the React wrapper `@cesdk/cesdk-js/react` (`packages/cesdk-react/`) has no test file at all. Suggested home: `packages/cesdk-react/`. Same gap as the product-preview kit's gap 1.
2. Engine: two engines in one process — nothing in the JS suites creates a second `CreativeEngine` while the first is alive, disposes one and keeps using the other. This kit does that on every page load. Suggested home: `bindings/wasm/js_node/src/__tests__/`.
3. Engine: `scene.load(url)` — the JS suites only exercise the string form; the gtest URL cases cover only an empty and an invalid URI. Every product switch loads a scene by URL. Suggested home: `bindings/shared/ts/src/tests/scene-extended.test.ts`.
4. Engine: `targetWidth` / `targetHeight` on the JS `block.export` options object, covered in gtest (`ExportAPITest.cpp:137`) but not from JS. Every placeholder here is a 1048 × 1048 page export. Suggested home: `bindings/shared/ts/src/tests/block-export.test.ts`.

Gaps 1 to 4 are shared with the product-preview kit, which is built from the same two files.
