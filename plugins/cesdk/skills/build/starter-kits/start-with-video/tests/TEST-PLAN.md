# Test plan: starterkit-start-with-video

Version 5, 7 Sep 2026. Status: implemented. 6 browser cases and 42 unit cases pass; `KIT_TEST_COVERAGE=1 npm run ci` is green. Merged coverage is lines 100 %, branches 100 %, functions 100 %.

## 1. Purpose

Verify that the Start With Video starter kit works as shipped: the editor appears only after a video is chosen from the sidebar, the video becomes a one-page video scene with a timeline, and the export action carries the kit's bitrate setting.

## 2. Scope

In scope

- `src/index.tsx` and `src/app/**`: the video sidebar, the selection state, the editor remount on a new selection
- `src/app/video-catalog.ts`: the three demo videos and the demo asset base URL
- `src/imgly/index.ts`: the configuration plugin, the asset source plugins, `scene.createFromVideo`, the zoom call
- `src/imgly/config/**`: features, settings, actions, and the UI configuration

Out of scope

- Core editor and engine behaviour reached through this kit: video decoding, playback, trimming, transitions, MP4 encoding, the timeline UI. See section 10.
- The demo site around the kit. Qase 1957, 1958, 1959, 1960, 1961, 1976, 1985, 2394.

## 3. Test environment

- Browser: Chrome, headless, 1400 x 900
- Engine and editor: built from this repo, served locally. No request may reach `cdn.img.ly`.
- License: the shared test license (valid on hostname `localhost` only)
- Data: three MP4 files and their PNG thumbnails from `staticimgly.com/imgly/cesdk-web-examples-data/1.82.0/starterkit-start-with-video`, allowed by the network guard. `VITE_DEMO_ASSETS_BASE_URL` overrides the host. The dev wrapper points that variable at the repo's local CDN mirror, which answers a range request with the whole file, and the engine's MP4 reader needs real ranges — so `tests/e2e/fixtures.ts` routes that prefix back to the published bucket. See known issue 8.
- Hook: `window.cesdk` is set inside the editor `init` callback, so it exists only after a thumbnail is clicked. Choosing another video bumps the React key, unmounts the editor and mounts a new one, so the hook is replaced. Every browser case must wait for the editor after the click, not before it.
- Video decoding needs a real browser. Nothing in this kit runs headless without one.

## 4. Approach

| Kind    | Tool                          | What it checks                                  | Run                 |
| ------- | ----------------------------- | ----------------------------------------------- | ------------------- |
| Static  | tsc, eslint, convention check | Types, deprecated APIs, kit folder shape        | `npm run check:all` |
| Unit    | Vitest                        | The catalogue and the config modules, no engine | `npm run test:unit` |
| Browser | Playwright                    | The cases in section 5                          | `npm run test:e2e`  |

No case runs a real MP4 encode. The export case replaces `window.cesdk.utils.export` before clicking, and asserts the options the kit passes. Encoding itself belongs to the engine, see section 10. Browser tests use role and label locators only.

## 5. Test cases

Format: ID, level, Qase id, title. Then steps and expected result.

### 5.1 Video selection

**SWV-01 · browser · Qase 4643 · No editor before a video is chosen**
Steps: open the kit.
Expected: the sidebar shows the heading "Select Video" and three thumbnail buttons whose titles are the three alt texts. No editor canvas, and `window.cesdk` is undefined. No console errors.

**SWV-02 · browser · Qase 1990 · The chosen video becomes the scene**
Steps: click the first thumbnail and wait for the editor.
Expected: one page of 960 x 720, holding one track with one graphic block whose fill is a video fill pointing at the chosen file. The page duration equals the clip duration. The video timeline region is visible.
Note: the draft expected `scene.getMode()` to be `Video`. That getter is deprecated and returns `null` after `createFromVideo`, so the case asserts the scene's structure instead.

**SWV-03 · browser · Qase 4644 · The chosen video appears in the video uploads**
Steps: with the editor loaded, read `ly.img.video.upload`, then open the Videos dock entry.
Expected: the source holds exactly the chosen video, and its `thumbUri` is empty — known issue 1, pinned as current behaviour. The Videos library shows a Video Uploads section.
Note: the draft also clicked the upload card to add a second clip. What an asset library card does when clicked is editor and engine behaviour, so the case stops at what the kit decides.

**SWV-04 · browser · Choosing another video replaces the editor**
Steps: click the second thumbnail.
Expected: the second thumbnail is marked selected, the first is not, and the new scene's video fill points at the second file. The case must re-read `window.cesdk`.

### 5.2 The editor the kit builds

**SWV-05 · browser · Dock and navigation bar**
Steps: with a video loaded, read the dock and the navigation bar.
Expected: dock shows Templates, a separator, Elements, Uploads, Images, Videos, Audio, Text, Shapes, Stickers. Export Video is the only action, so the editor renders it as a plain button and no actions dropdown appears.
Note: the rendered dock also carries a Captions entry that `setupDock` does not name — it comes from the caption plugin. SWV-U6 pins the order the kit itself sets.

### 5.3 Export

**SWV-06 · browser · Qase 2259 · Export video passes the kit's bitrate**
Steps: install the harness's `spyExportVideo(page, { intercept: true })`, then click Export Video.
Expected: `engine.block.exportVideo` is called once with `videoBitrate: 'Auto'` and the MP4 mime type, and the browser receives one `.mp4` download. What the engine writes into the MP4 is engine behaviour, see section 10.
Note: the draft replaced `utils.export`. The harness gained `spyExportVideo` while this plan was written, which records the same decision one layer lower and skips the encode.

### 5.4 Unit tests (no browser)

**SWV-U1 · unit · Video catalogue**
Expected: three entries, each with an `.mp4` full URL, a `.png` thumbnail, an alt text and a Pexels author name and URL. All URLs start with `DEMO_ASSETS_BASE_URL`, and that constant falls back to the `staticimgly.com` path when `VITE_DEMO_ASSETS_BASE_URL` is empty.

**SWV-U2 · unit · `initStartWithVideoEditor` adds the documented plugins and creates the scene**
Call it with a stub whose `addPlugin`, `engine.scene.createFromVideo` and `actions.run` record their arguments.
Expected: `VideoEditorConfig` first, then Blur, CaptionPresets, ImageColors, ColorPalette, CropPresets, Upload, Demo, Effects, Filters, PagePresets, Sticker, Text, TextComponent, Typeface, VectorShape; then `createFromVideo` with the URL passed in; then `zoom.toPage` with `autoFit: true`.

**SWV-U3 · unit · Asset source include lists**
Expected: `UploadAssetSources` includes the image, video and audio upload sources. `DemoAssetSources` includes `ly.img.templates.video.*`, `ly.img.image.*`, `ly.img.audio.*`, `ly.img.video.*`. `PagePresetsAssetSource` includes the eight social and video preset groups.

**SWV-U4 · unit · Enabled features**
Expected: `feature.enable` is called with the documented ids, including `ly.img.video.timeline.clips`, `ly.img.video.caption`, `ly.img.volume`, `ly.img.playbackSpeed`, `ly.img.animations`, `ly.img.transitions` and `ly.img.trim`. Every id is a leaf: the list names no umbrella group whose children it also enables, so a CE.SDK upgrade that adds a child cannot enable it behind the kit's back.

**SWV-U5 · unit · Engine settings**
Expected: `timeline/trackVisibility` is `all`, `colorPicker/colorMode` is `RGB`, `page/title/show` is false, and `doubleClickToCropEnabled` is true.

**SWV-U6 · unit · Dock, navigation bar and canvas bar order**
Expected: the nine library entries and the separator in the documented order, with the separator after Templates; `dock/hideLabels` false, `dock/iconSize` large; the navigation bar ends with an actions dropdown holding only Export video; the canvas bar at `bottom` is settings, spacer, add page, spacer, with no page-select entry.

**SWV-U7 · unit · Qase 2259 · The export action adds the bitrate**
Call the registered `exportDesign` with `{ mimeType: 'video/mp4' }` against a stub `utils`.
Expected: `utils.export` receives `videoBitrate: 'Auto'` merged before the caller's options, so a caller-supplied bitrate wins.

**SWV-U8 · unit · Panel placement**
`setupPanels` docks the inspector and the asset library on the left and leaves neither floating.

**SWV-U9 · unit · `setupUI` orders the bars the kit owns**
`setupUI` positions the panels before it sets any component order, and the set of ordered slots is exactly the dock, the navigation bar, the canvas bar, the canvas menu, the inspector bar and the video timeline controls bar.

**SWV-U10 · unit · The inspector bar per edit mode**
The Transform bar carries trim, volume, playback speed and captions. The Trim and Crop bars carry only their own controls; the Vector bar ends with `ly.img.vectorEdit.done.inspectorBar`.

**SWV-U11 · unit · The video timeline controls**
`setupVideoTimeline` sets the nine timeline control entries in order. This is what disproved known issue 2.

**SWV-U12 · unit · Components, translations and shortcuts**
`setupComponents` and `setupTranslations` make no call — the kit takes the editor defaults. `setupKeyboardShortcuts` calls `shortcuts.set` once with the US ANSI catalog object itself.

**SWV-U13 · unit · `VideoEditorConfig`**
The plugin is named `cesdk-video-editor` and carries `CreativeEditorSDK.version`. `initialize` resets the editor first, pins the editor compatibility version to `CreativeEditorSDK.version`, then runs the feature, UI, action, shortcut, translation and engine-setting setup, and finishes with `editor.checkBrowserSupport` at `videoDecode: 'block'`, `videoEncode: 'warn'`. Without a `cesdk` in the context it touches neither the editor nor the engine.

**SWV-U14 · unit · `src/index.tsx`**
The entry mounts the app into `#root`, and fails loudly with `Root container not found` when the page ships no such element.

**SWV-U15 · unit · Asset source registration is concurrent**
With an `addPlugin` that resolves only on demand, `initStartWithVideoEditor` issues the configuration plugin, waits for it, and then issues all fifteen asset-source plugins together. A sequential registration would stall after the first one.

**KB-01 · unit · Keyboard catalog predicates**

`tests/unit/keyboard-catalog.test.ts` runs every `run` and `when` of `src/imgly/config/keyboard/catalogs/us-ansi.ts` against 1620 editor states (5 edit modes, 9 selections, 3 roles, features on and off, 3 vector states, page and no page) and asserts that none throws, that every shortcut activates in at least one state, and that every function `run` reaches `cesdk.actions.run`. Kit-owned: the kit decides which key does what and when it is live. The catalog measures 100 % lines, branches and functions.

## 6. Entry and exit criteria

Entry: engine and editor built; test license available; the shared kit test harness exists; the demo videos reachable, or `VITE_DEMO_ASSETS_BASE_URL` pointing at a local copy.

Exit: every case passes locally and in CI. `npm run ci` passes. The published kit contains no test files. A release run reports the cases above to their Qase ids.

## 7. Known issues found while writing this plan

Confirm each with a test before fixing.

1. `createSceneFromVideo` registers the video in `ly.img.video.upload` with an empty `thumbPath` (`engine/src/ubq/scene/SceneActions.cpp`, marked `// TODO`), so the upload entry has no thumbnail. Qase 4644 does not say what the entry should look like.
2. **Not reproducible.** `setupVideoTimeline` sets the nine timeline control entries; SWV-U11 asserts them. The plan recorded an empty body, which the run disproved.
3. **Fixed.** `settings.ts` no longer sets `features/videoCaptionsEnabled`: the setting is internal, and `resetEditor()` no longer switches it off, so the engine default applies.
4. `CaptionPresetsAssetSource` is registered but no dock entry, timeline control or panel in this kit reaches captions.
5. The zoom call after `createFromVideo` is not awaited. If it becomes asynchronous, the fit races the scene creation.
6. The README title is "Video Editor Starter Kit" and lists trimming, transitions and audio as capabilities. Those come from the video editor configuration, not from this kit, which only chooses the starting video.
7. `engine/lib/test/api/SceneAPITest.cpp` skips the `CreateSceneFromVideo` happy-path case under Emscripten, so the kit's central engine call is covered on native targets only.
8. **Fixed.** The repo's local CDN mirror answered a `Range` request with `200` and the whole body, so the engine's MP4 reader failed and `pnpm dev` on this kit booted to "No scene found after editor creation". `packages/dev-server-core` now answers `206` with `Content-Range`.

9. The `Root container not found` guard in `src/index.tsx` cannot fire, because `index.html` ships the element. It stands as a product observation; it is no longer a coverage question. The merged report reads 100 % lines, 100 % branches and 100 % functions, because `merge-coverage.mjs` now takes the line denominator from the Vitest statement map wherever Vitest measured a file, so the comment lines of `config/actions.ts` no longer enter it.

## 8. Open questions

2. Issue 3 is fixed (the line is gone).
3. SWV-06 intercepts the encode. Should one real short encode stay as an end-to-end proof? It costs about a minute and is the most likely source of flake in this batch. Recommended: no, and rely on the engine's own MP4 export tests.

## 9. Estimate

6 browser cases at about 12 s each, video decoding included: about 90 s on one worker. 7 unit cases: under 1 s.

## 10. Boundary review

Rule used: the code that makes a decision owns the test for it. This kit decides the video catalogue, the selection flow, `createFromVideo`, the asset sources, the features, the settings, the dock and navigation bar, and the `videoBitrate: 'Auto'` default. The engine decides decoding, playback and MP4 encoding. The editor decides the timeline UI.

| Behaviour                                                                            | Owner  | Covered by                                                                              |
| ------------------------------------------------------------------------------------ | ------ | --------------------------------------------------------------------------------------- |
| `scene.createFromVideo` builds a video scene with a track and a video-filled graphic | engine | `engine/lib/test/api/SceneAPITest.cpp` (native only, skipped under Emscripten)          |
| MP4 export of a page                                                                 | engine | `engine/lib/test/api/ExportAPITest.cpp`, `ExportVideoToBuffer` and the validation cases |
| `utils.export` video path and its abort handling                                     | editor | `apps/cesdk_web/packages/api/utils/UtilsAPI.test.ts`                                    |
| `ui.setComponentOrder` for dock, navigation bar and canvas bar                       | editor | `apps/cesdk_web/packages/api/ui/UserInterfaceAPI.test.ts`                               |
| Video timeline controls bar and clip menu orders                                     | editor | `apps/cesdk_web/packages/api/ui/UserInterfaceAPI.test.ts`                               |
| `feature.enable` gating                                                              | editor | `apps/cesdk_web/packages/api/features/FeatureAPI.test.ts`                               |

Core coverage gaps found:

1. Engine: `createSceneFromVideo` is skipped under Emscripten, so the Wasm target has no coverage for it. Suggested home: a buffer-URI variant that runs in the Node.js Wasm runner, or a `bindings/wasm/js_node` test. Same gap as the start-with-image kit.
2. Engine: that `createSceneFromVideo` registers the video in the `ly.img.video.upload` asset source. Qase 4644 depends on it. Closed on this branch: `engine/lib/test/api/SceneAPITest.cpp` gained `CreateSceneFromVideo_RegistersUploadWithEmptyThumbUri`.
