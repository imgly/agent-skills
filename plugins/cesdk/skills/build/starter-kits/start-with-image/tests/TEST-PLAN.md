# Test plan: starterkit-start-with-image

Version 5, 7 Sep 2026. Status: implemented. 10 browser cases and 81 unit cases pass; `KIT_TEST_COVERAGE=1 npm run ci` is green. Merged coverage is lines 99.85 %, branches 100 %, functions 100 %.

## 1. Purpose

Verify that the Start With Image starter kit works as shipped: the editor appears only after a picture is chosen from the sidebar, the picture fills the page, and the dock offers the four photo tools and the three overlay libraries and nothing else.

## 2. Scope

In scope

- `src/index.tsx` and `src/app/**`: the image sidebar, the selection state, the editor remount on a new selection
- `src/app/image-catalog.ts`: the three bundled images and their thumbnails
- `src/imgly/index.ts`: the configuration plugin, the asset source plugins, `createFromImage`
- `src/imgly/config/**`: features, settings, translations, actions, and the UI configuration including the four photo-tool dock entries

Out of scope

- Core editor and engine behaviour reached through this kit: what crop, adjustments, filters and effects do to pixels, what an export produces, how a panel renders. See section 10.
- The demo site around the kit. Qase 552, 553, 554, 555, 556, 571, 580, 2420.

## 3. Test environment

- Browser: Chrome, headless, 1400 x 900
- Engine and editor: built from this repo, served locally. No request may reach `cdn.img.ly`.
- License: the shared test license (valid on hostname `localhost` only)
- Data: the kit's own `public/assets/images/{mountain,sea,surf}-{300,1200}.jpg`. No remote demo data.
- Hook: `window.cesdk` is set inside the editor `init` callback, so it exists only after a thumbnail is clicked. Choosing another picture bumps the React key, unmounts the editor and mounts a new one, so the hook is replaced. Every browser case must wait for the editor after the click, not before it.
- `src/app/image-catalog.ts` builds its image URLs from `src/imgly/demo-assets.ts` while the module loads, which reads `location`; the harness's Node lane provides it.

## 4. Approach

| Kind    | Tool                          | What it checks                                            | Run                 |
| ------- | ----------------------------- | --------------------------------------------------------- | ------------------- |
| Static  | tsc, eslint, convention check | Types, deprecated APIs, kit folder shape                  | `npm run check:all` |
| Unit    | Vitest                        | The config modules and the dock entry handlers, no engine | `npm run test:unit` |
| Browser | Playwright                    | The cases in section 5                                    | `npm run test:e2e`  |

The dock entries are captured from a stub `ui.setComponentOrder`, then each entry's `onClick` and `isSelected` is called with a stub `engine` and `ui`. What each photo tool does to the edit mode and the panels is therefore a unit test, and the browser keeps one case per tool as the end-to-end proof. Browser tests use role and label locators only.

## 5. Test cases

Format: ID, level, Qase id, title. Then steps and expected result.

### 5.1 Image selection

**SWI-01 · browser · Qase 4678 · No editor before a picture is chosen**
Steps: open the kit.
Expected: the sidebar shows the heading "Select Image" and three thumbnail buttons with the alt texts Mountain landscape, Sea view, Surfer riding a wave. No editor canvas, and `window.cesdk` is undefined. No console errors.

**SWI-02 · browser · Qase 596 · The chosen picture fills the page**
Steps: click the first thumbnail and wait for the editor.
Expected: the editor appears. `window.cesdk.engine.scene.getPages()` returns one page, and the page size in pixels equals the source picture size, 1080 x 720 for the mountain. The picture is the page fill, so `engine.block.getFill(page)` is an image fill whose file URI is the kit's `mountain-1200.jpg`.
Note: the draft said "1200 px on its long edge". The three `-1200.jpg` files are 1080x720, 1080x1440 and 1200x1233, so only the surf picture is 1200 wide. The case asserts each picture's own size.

**SWI-03 · browser · Choosing another picture replaces the editor**
Steps: click the second thumbnail.
Expected: the second thumbnail is marked active, the first is not, and the new page carries `sea-1200.jpg`. The old editor is gone; the case must re-read `window.cesdk`.

### 5.2 The dock the kit builds

**SWI-04 · browser · Qase 4680, 4679 · No image library and no upload entry**
Steps: with a picture loaded, read the dock.
Expected: the dock offers Crop, Adjust, Filter, Effects, then Text, Shapes, Stickers. There is no image library entry and no Uploads entry, so a second picture cannot be added and the loaded picture cannot be replaced from a library. Selecting the page shows no canvas menu and no inspector bar, which is the kit's own `feature.set` rule for pages. Stroke is no longer part of that rule: the kit enables the stroke controls unconditionally.

**SWI-05 · browser · Qase 565 · Crop**
Steps: click Crop in the dock.
Expected: the edit mode becomes `Crop` and the crop controls appear in the inspector bar. Click Crop again and the edit mode returns to `Transform`.

**SWI-06 · browser · Qase 558 · Adjust**
Steps: click Adjust in the dock.
Expected: the floating adjustments panel opens, the page is selected, and the Adjust entry is marked selected. Click Adjust again and the panel closes.

**SWI-07 · browser · Qase 557 · Filter**
Steps: click Filter in the dock.
Expected: the floating filters panel opens and the Filter entry is marked selected. Click again to close.

**SWI-08 · browser · Qase 572 · Effects**
Steps: click Effects in the dock.
Expected: the floating effects panel opens and the Effects entry is marked selected. Click again to close.

### 5.3 Export

**SWI-09 · browser · Qase 570 · Export image**
Steps: open the actions dropdown in the navigation bar, click Export image.
Expected: one PNG download at the page size.
Asserts the options the kit passes to `engine.block.export` and that a file of the declared type downloaded; the exported pixel size belongs to `engine/lib/test/api/ExportAPITest.cpp`.

**SWI-10 · browser · Qase 569 · Export PDF**
Steps: open the actions dropdown, click Export PDF.
Expected: one PDF download with one page.
Asserts the options the kit passes to `engine.block.export` and that a file of the declared type downloaded; the exported pixel size belongs to `engine/lib/test/api/ExportAPITest.cpp`.

### 5.4 Unit tests (no browser)

**SWI-U1 · unit · Image catalog**
Expected: three entries, each with a `-1200.jpg` full path, a `-300.jpg` thumbnail and a non-empty alt text, all under the kit's own base path.

**SWI-U2 · unit · Qase 4680 · Dock entry keys and order**
Expected: `setComponentOrder` for `ly.img.dock` yields spacer, Crop, Adjust, Filter, Effects, separator, Text, Shapes, Stickers, spacer. `dock/hideLabels` is false and `dock/iconSize` is large. No entry names an image or upload library.

**SWI-U3 · unit · Qase 565 · Crop entry handler**
Call the Crop entry's `onClick` with the edit mode at `Transform`, then at `Crop`.
Expected: the first call closes every panel, selects the current page and sets the edit mode to `Crop`; the second sets it back to `Transform`. `isSelected` reads `ui.isPanelOpen('//ly.img.panel/inspector/crop')`. With no current page the handler returns without touching the edit mode.

**SWI-U4 · unit · Qase 558, 557, 572 · Adjust, Filter and Effects entry handlers**
For each of the three entries, call `onClick` with the panel closed, then with it open.
Expected: closed means close every panel, set the edit mode to `Transform`, select the current page and open `//ly.img.panel/inspector/adjustments`, `/filters` or `/effects` floating. Open means close only that panel. `isSelected` reads the matching panel id.

**SWI-U5 · unit · Overlay library entries**
For Text, Shapes and Stickers, call `onClick` with the library closed and with it open.
Expected: it opens `//ly.img.panel/assetLibrary` with the matching `entries` and `title` payload, or closes it when already open with that payload.

**SWI-U6 · unit · Enabled features**
Expected: `feature.enable` is called once, with exactly the 90 ids the kit's `features.ts` lists, and `feature.disable` is never called. The list is flat and explicit: it names the children of `ly.img.crop`, `ly.img.stroke` and `ly.img.text` rather than those group ids, and holds no `ly.img.page.resize` and no video id.

**SWI-U7 · unit · Page rules**
Expected: `feature.set` is called for `ly.img.canvas.menu` and `ly.img.inspector.bar` with a predicate that returns false when a selected block is a page and true otherwise.

**SWI-U8 · unit · Engine settings**
Expected: `doubleClickToCropEnabled` is false, `page/allowCropInteraction` true, `page/moveChildrenWhenCroppingFill` true, `page/selectWhenNoBlocksSelected` true, `page/highlightWhenCropping` true, `page/title/show` false.

**SWI-U9 · unit · Translations**
Expected: `i18n.setTranslations` is called with English labels Stickers, Shapes and Text for the three library ids.

**SWI-U10 · unit · `initStartWithImageEditor` adds the documented plugins and creates the scene**
Expected: `PhotoEditorConfig` first, then the fifteen asset source plugins, registered concurrently so all fifteen start before the first one finishes, then `createFromImage` with the URL that was passed in, and the bundled mountain image when none was passed. One case pins known issue 1: `setSelected` runs only when the engine reports an image block, and after `createFromImage` it never does.

**SWI-U11 · unit · Navigation bar and panels**
Expected: the navigation bar ends with an actions dropdown holding Export image and Export PDF; the inspector and assets panels are `left` and non-floating.

**SWI-U12 · unit · `setupUI` orders the bars the kit owns**
`setupUI` positions the panels before it sets any component order, and it orders exactly the dock, the navigation bar, the canvas bar, the canvas menu and the inspector bar.

**SWI-U13 · unit · The canvas bar and the canvas menus**
`setupCanvas` keeps the page settings and the add-page button in a bottom canvas bar. The Transform menu offers the overlay controls, the Text menu the formatting controls, and no Vector menu is set at all — that mode keeps the editor default.

**SWI-U14 · unit · The inspector bar per edit mode**
The Transform bar carries crop, fill and the inspector toggle. The Trim and Crop bars carry only their own controls; the Vector bar ends with `ly.img.vectorEdit.done.inspectorBar`.

**SWI-U15 · unit · The setups the kit leaves empty**
`setupComponents` and `setupVideoTimeline` make no call. `setupKeyboardShortcuts` calls `shortcuts.set` once with the US ANSI catalog object itself.

**SWI-U16 · unit · `setupActions`**
The kit overrides exactly one action, `exportDesign`. Its handler forwards the caller's options to `utils.export` unchanged and downloads the first blob under the returned mime type.

**SWI-U17 · unit · `PhotoEditorConfig`**
The plugin is named `cesdk-photo-editor` and carries `CreativeEditorSDK.version`. `initialize` resets the editor first, then pins the editor compatibility version to `CreativeEditorSDK.version`, then runs the feature, UI, action, shortcut, translation and engine-setting setup and registers one `onReset` handler; running that handler drops the subscription list. Without a `cesdk` in the context it touches neither the editor nor the engine.

**SWI-U18 · removed.** `resolveAssetPath` is gone; `src/imgly/demo-assets.ts` derives the URL from `VITE_DEMO_ASSETS_BASE_URL` or the kit's own URL.

**KB-01 · unit · Keyboard catalog predicates**

`tests/unit/keyboard-catalog.test.ts` runs every `run` and `when` of `src/imgly/config/keyboard/catalogs/us-ansi.ts` against 1620 editor states (5 edit modes, 9 selections, 3 roles, features on and off, 3 vector states, page and no page) and asserts that none throws, that every shortcut activates in at least one state, and that every function `run` reaches `cesdk.actions.run`. Kit-owned: the kit decides which key does what and when it is live. The catalog measures 100 % lines, branches and functions.

## 6. Entry and exit criteria

Entry: engine and editor built; test license available; the shared kit test harness exists.

Exit: every case passes locally and in CI. `npm run ci` passes. The published kit contains no test files. A release run reports the cases above to their Qase ids.

## 7. Known issues found while writing this plan

Confirm each with a test before fixing.

1. **Fixed in 6b.** `initStartWithImageEditor` ends with `findByKind('image')` and selects the first result, but `createSceneFromImage` builds a page with an image fill and creates no image block (`engine/src/ubq/scene/SceneActions.cpp`). The list is always empty, so the "select the image block for immediate editing" step never runs.
2. `src/imgly/config/plugin.ts` line 10 carries a stray `type CreativeEditorSDK = InstanceType<typeof CreativeEditorSDK>;` inside the opening doc comment. It is inert but it ships to customers. The same line is in `starterkit-ai-editor`, `starterkit-automated-resizing` and `starterkit-force-crop-editor`.
3. The README lists "Background Removal - AI-powered background removal" as a capability. The kit adds no background removal plugin and has no such dependency. `public/assets/remove-bg.png` is left over and unreferenced.
4. `createSceneFromImage` registers the loaded picture in the `ly.img.image.upload` asset source, but the kit's dock has no Uploads entry, so it is never visible.
5. `ly.img.replace.canvasMenu` is in the Transform canvas menu and `ly.img.replace` is enabled, but the kit registers no image library, so Replace on an overlay would open an empty library.
6. `engine/lib/test/api/SceneAPITest.cpp` skips the `CreateSceneFromImage` cases under Emscripten, so the kit's central engine call is covered on native targets only.

### Coverage residue

One line of `src/**` is left: the body of `subscriptions.forEach` in `setupOnReset` (`src/imgly/config/plugin.ts:127`). Unreachable by construction — nothing anywhere pushes into `subscriptions`, which the kit ships as the shape a customer fills in when their own setup registers a listener.

## 8. Open questions

1. **Fixed in 6b.** Issue 1: delete the dead selection code, or select the page instead so the inspector opens on load. Recommended: select the page, which is what the code intended. Not decided, so SWI-U10 pins the current behaviour.
2. Issue 3: add the background removal plugin as in the design editor kit, or correct the README and delete `remove-bg.png`. Recommended: correct the README.

## 9. Estimate

10 browser cases at about 8 s each, plus two exports at about 12 s: about 2 minutes on one worker. 11 unit cases: under 1 s.

## 10. Boundary review

Rule used: the code that makes a decision owns the test for it. This kit decides the picture catalogue, the selection flow, `createFromImage`, the four photo-tool dock entries and what each does to the edit mode and the panels, the page feature rules, the settings and the translations. The engine decides what crop, adjustments, filters, effects and export produce. The editor decides how panels and libraries render.

| Behaviour                                                         | Owner  | Covered by                                                                     |
| ----------------------------------------------------------------- | ------ | ------------------------------------------------------------------------------ |
| `scene.createFromImage` builds a page sized to the picture        | engine | `engine/lib/test/api/SceneAPITest.cpp` (native only, skipped under Emscripten) |
| `ui.openPanel`, `closePanel`, `isPanelOpen`, `setPanelPosition`   | editor | `apps/cesdk_web/packages/api/ui/UserInterfaceAPI.test.ts`                      |
| `ui.setComponentOrder` for the dock                               | editor | `apps/cesdk_web/packages/api/ui/UserInterfaceAPI.test.ts`                      |
| `feature.enable` and `feature.set` predicates                     | editor | `apps/cesdk_web/packages/api/features/FeatureAPI.test.ts`                      |
| `i18n.setTranslations`                                            | editor | `apps/cesdk_web/packages/api/i18n/I18nAPI.test.ts`                             |
| `utils.export` and `utils.downloadFile`                           | editor | `apps/cesdk_web/packages/api/utils/UtilsAPI.test.ts`                           |
| Crop, adjustments, filters and effects change the rendered pixels | engine | `engine/lib/test/api/CropAPITest.cpp`, `EffectsAPITest.cpp`                    |

Core coverage gaps found:

1. Engine: `createSceneFromImage` and `createSceneFromVideo` are skipped under Emscripten, so the Wasm target, which is the only one the web kits run on, has no coverage for them. Suggested home: a buffer-URI variant in `SceneAPITest.cpp` that runs in the Node.js Wasm runner, or a `bindings/wasm/js_node` test.
2. Editor: `CreativeEditorSDK.createFromImage`, which wraps the engine call with `waitForCanvas` and `zoom.toPage`, has no test. Suggested home: `apps/cesdk_web/packages/cesdk/`.
