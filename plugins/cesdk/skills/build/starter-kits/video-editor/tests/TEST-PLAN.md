# Test plan: starterkit-video-editor

Version 4, 7 Sep 2026. Status: implemented. 12 unit and headless tests and 7 browser tests, all green (`npm run ci` exit 0). Merged coverage: lines 100 %, branches 100 %, functions 100 %.

## 1. Purpose

Verify that the Video Editor starter kit works as shipped: the editor starts in video mode with the demo template, the asset libraries the kit asks for are the ones that appear, the Export Video button is in the navigation bar, and export runs with the options the kit passes.

## 2. Scope

In scope

- `src/imgly/index.ts`: which plugins the kit adds, in which order, with which `include` globs
- The Export Video entry the kit inserts into the navigation bar
- The background-removal plugin configuration
- `src/index.ts`: the engine config, the `window.cesdk` hook, the demo scene URL, the start-up error path

Out of scope

- The editor UI itself. `VideoEditorConfig` comes from `@cesdk/core-configs-web`, a shared package. The kit does not own its feature list, dock order, timeline, or panels. See section 10.
- The asset-source plugins' own behaviour. Each ships its own test in `packages/cesdk-core-plugins-web`. The kit owns only the choice and the globs.
- The demo site around the kit (cards, tags, links, platform toggles, the mobile QR codes and simulator steps). Covered by the `cesdk_web_demos` suite and by the mobile app suites. **Every one of this kit's 17 Qase cases falls here**: 2316, 2317, 2318, 2319, 2320, 2321, 2325, 2373 and 2380 are demo-site cases; 2322, 2323, 2324, 4022, 4023, 4024, 4237 and 4238 are the iOS and Android app suites. 2380 ("Desktop device option cannot be changed") is labelled kit-behaviour in the export but is a property of the demo site's platform toggle, not of this kit — same call P1 made for 2471–2473.

No Qase case maps to a case in section 5. The cases below come from the kit's code.

## 3. Test environment

- Browser: Chrome, headless, 1400 × 900
- Engine and editor: built from this repo, served locally. Requests to `cdn.img.ly` fail the test.
- License: the shared test license (valid on hostname `localhost` only)
- Data: `${DEMO_ASSETS_BASE_URL}/assets/templates/lunar-video-default/scene.scene` and the fonts, images, audio and video files next to it, mirrored into `packages/cesdk-web-examples-data/data/starterkit-video-editor/`. The files are git-LFS. While the mp4s are unmaterialized stubs the local CDN proxies them to `staticimgly.com`, and that path answers one request with a 416 the console guard reports; the cases pass once the files are on disk. Materialise them with `git lfs pull -X '' -I 'packages/cesdk-web-examples-data/data/starterkit-video-editor/**'`.
- Unit cases stub `@cesdk/cesdk-js/plugins` and `@cesdk/core-configs-web/video-editor` with classes that capture their constructor config, then call `initVideoEditor` with a `createApiSpy()`. No DOM, no engine.

## 4. Approach

| Kind    | Tool                          | What it checks                                                 | Run                 |
| ------- | ----------------------------- | -------------------------------------------------------------- | ------------------- |
| Static  | tsc, eslint, convention check | Types, deprecated APIs, kit folder shape                       | `npm run check:all` |
| Unit    | Vitest                        | Plugin list and order, include globs, navigation bar, BG entry | `npm run test:unit` |
| Browser | Playwright                    | The test cases in section 5                                    | `npm run test:e2e`  |

All three run in the kit's `ci` script. Browser tests use role and label locators only. There are no headless cases: the kit has no module that runs without an editor.

## 5. Test cases

Format: ID, level, title. Then steps and expected result.
Common precondition for all browser cases: the kit is open in the browser and the scene has finished loading.

### 5.1 Start-up

**VED-01 · browser · Editor loads in video mode with the demo template**
Steps: open the kit.
Expected: `engine.scene.getMode()` is `Video`. One page on the canvas. The video timeline is visible. No console errors. No request to `cdn.img.ly`.

**VED-02 · browser · The debug hook is on the window**
Steps: read `window.cesdk`.
Expected: it is the editor instance and its `engine` and `ui` are usable. The whole harness depends on this.

### 5.2 Libraries the kit asks for

**VED-03 · browser · The dock lists the configured libraries**
Steps: click each dock library entry.
Expected: Templates, Elements, Uploads, Images, Videos, Audio, Text, Shapes and Stickers each open `//ly.img.panel/assetLibrary`. Which entries exist is `VideoEditorConfig`'s decision; this case proves the kit's plugin list produced sources for them, not that the order is right.
Run correction: the dock also carries a Captions entry, which opens `//ly.img.panel/inspector/caption` rather than the asset library, so the case covers the nine library entries only.

**VED-04 · browser · The included asset sources are registered, the excluded ones are not**
Steps: read `engine.asset.findAllSources()`.
Expected: it contains `ly.img.image`, `ly.img.video`, `ly.img.audio`, the three upload sources, `ly.img.page.presets` and the premium templates source, plus the blur, caption-preset, colour, crop-preset, effect, filter, sticker, text, text-component, typeface and vector-shape sources the kit adds.
Run correction: `PagePresetsAssetSource` registers **one** source, `ly.img.page.presets`, not one per platform, so the eight `include` globs are pinned by VED-U2 instead.

### 5.3 Export

**VED-05 · browser · Export Video is in the navigation bar**
Steps: read the navigation-bar component order.
Expected: `ly.img.exportVideo.navigationBar` is the last entry and its button is enabled.
Run correction: the accent colour is not asserted in the browser — the fleet ships no screenshot assertions — so VED-U3 pins `color: 'accent'` instead.

**VED-06 · browser · Export passes the kit's options**
Steps: install the export spy in intercept mode, click Export Video.
Expected: exactly one `engine.block.exportVideo` call, on the current page, with `mimeType: 'video/mp4'` and `videoBitrate: 'Auto'`, and no `targetWidth`, `targetHeight` or `framerate`. `videoBitrate: 'Auto'` is the shared config's `exportDesign` default; that the kit inherits it unchanged is what this case pins. The encode itself does not run — see known issue 5.
Run correction: the recorded options also carry an `abortSignal` the editor adds, so the case asserts the two options it owns and the absence of the three target keys, not a deep equality.

### 5.4 Background removal

**VED-07 · browser · The background-removal entry appears in the canvas menu**
Steps: read the `ly.img.canvas.menu` component order.
Expected: it contains `@imgly/plugin-background-removal-web.canvasMenu`. **Do not click it.** The `@imgly/background-removal` provider downloads a model of tens of megabytes from a host the network guard has not been checked against.
Run correction: selecting the template's image graphic renders no background-removal button in the canvas menu, so the component order is what the case reads. Whether the button renders for a given selection is the plugin's decision, not the kit's.

### 5.5 Unit cases (no browser, no engine)

Subject: `initVideoEditor` from `src/imgly/index.ts`, driven with `createApiSpy()`.

**VED-U1 · unit · Plugin order**
`addPlugin` is called with `VideoEditorConfig` first, then the sixteen asset-source plugins, then the background-removal plugin. The config plugin must come first, because everything after it overrides its defaults. The sixteen are all in flight before the first one settles, so they register concurrently.

**VED-U2 · unit · Include globs**
`UploadAssetSources` gets the three upload ids. `DemoAssetSources` gets `ly.img.templates.video.*`, `ly.img.image.*`, `ly.img.audio.*`, `ly.img.video.*`. `PagePresetsAssetSource` gets exactly the eight platform globs. `PremiumTemplatesAssetSource` gets `ly.img.templates.premium.*`.

**VED-U3 · unit · Navigation bar insertion**
`ui.insertOrderComponent` is called once with `{ in: 'ly.img.navigation.bar', position: 'end' }` and `{ id: 'ly.img.exportVideo.navigationBar', color: 'accent' }`.

**VED-U4 · unit · Background-removal options**
The plugin is constructed with `ui.locations` `['canvasMenu']` and `provider.type` `'@imgly/background-removal'`.

**VED-U5 · unit · Nothing else is configured**
No `setTheme`, no `setLocale`, no `feature.enable`, no `setSetting` call. The theme and locale lines in the kit are commented out; this case fails the moment someone uncomments one without updating the README.

## 6. Entry and exit criteria

Entry: engine and editor built; test license available; the kit's `test:unit` and `test:e2e` scripts replaced with the real commands (they are `exit 0` today). The harness needs two additions this plan depends on and which do not exist yet:

1. `spyExportVideo(page, { intercept })` — `spyExport` today patches `engine.block.export` and calls through. Video needs `engine.block.exportVideo`, and an intercept mode that records the options and resolves a stub `Blob` without encoding.
2. `mp4Info(buffer)` — pixel size and duration from the `tkhd` and `mvhd` boxes, in plain JavaScript. No ffprobe: a missing external tool would have to fail the test loudly, and a pure box walk removes the dependency.

Exit: every case in section 5 passes locally and in CI. `npm run ci` passes. The published kit contains no test files.

## 7. Known issues found while writing this plan

Confirm each with a test before fixing.

1. The README's Architecture tree shows `src/imgly/config/` with seven files and `src/imgly/plugins/background-removal.ts`. Neither exists. The kit has two source files and takes its configuration from `@cesdk/core-configs-web`.
2. `src/index.ts` has a commented-out `baseURL` line labelled "IMG.LY CDN (for quick testing only)" whose value is the same `import.meta.env.VITE_IMGLY_LOCAL_ASSETS_URL` as the live line above it, followed by an orphaned "Local assets for development" comment.
3. The kit writes `(window as any).cesdk` with an `as any` cast, while the sibling kits use the typed `window as unknown as { cesdk: CreativeEditorSDK }` form.
4. Start-up failures are reported only through `console.error`. A customer copying the kit gets a blank page and a console line.
5. A real MP4 export is not a case. Measured in S4: the `lunar-video-default` page is 1920 x 1080 and 12.0 s long, so an encode would sit at the top of the 30 s budget for no assertion `starterkit-video-export-options` VEO-09 does not already make. VED-06's intercepted assertion stays the proof.

## 8. Open questions

1. Should VED-04 pin the full source list, or only the eight page-preset globs? Recommended: the full list. It is the only assertion that catches a plugin being dropped from `initVideoEditor`.
2. `PremiumTemplatesAssetSource` needs credentials to return assets. VED-04 asserts the source is registered, not that it returns anything. Recommended: keep it that way.

## 9. Estimate

Measured: 7 browser cases in 1.3 min on one worker; 8 unit cases in 0.3 s.

## 10. Boundary review

Rule used: the code that makes a decision owns the test for it. This kit decides which plugins to add, with which globs, in which order, where the export button goes, how background removal is configured, and which scene to load. `@cesdk/core-configs-web` decides the UI. The engine decides what an export produces.

Core behaviour this plan leans on, and where it is covered today:

| Behaviour                                                                                                                               | Owner  | Covered by                                                                                                                          |
| --------------------------------------------------------------------------------------------------------------------------------------- | ------ | ----------------------------------------------------------------------------------------------------------------------------------- |
| Each asset-source plugin registers its sources and library entries                                                                      | editor | `packages/cesdk-core-plugins-web/src/plugin-*/src/plugin.test.ts` — one per plugin the kit adds, except premium (gap 2)             |
| `DemoAssetSources` resolves its base URL from `cesdk.getBaseURL()`, so nothing hits CDN                                                 | editor | `packages/cesdk-core-plugins-web/src/plugin-demo-asset-source-web/src/plugin.test.ts`                                               |
| The Export Video button runs `exportDesign` with `mimeType: 'video/mp4'`                                                                | editor | `apps/cesdk_web/packages/ui/components/actions/NavigationBarActionExportVideo.tsx` — no test (gap 3)                                |
| `cesdk.utils.export` with a video mime type calls `engine.block.exportVideo` on the page, disables solo playback, and surfaces failures | editor | `apps/cesdk_web/packages/api/utils/UtilsAPI.test.ts` "export (video path)"                                                          |
| `videoBitrate: 'Auto'` maps to the `-1` engine sentinel                                                                                 | engine | `bindings/wasm/js_web/src/resolveVideoBitrate.test.ts`                                                                              |
| A video page exports to a non-empty MP4                                                                                                 | engine | `engine/lib/test/api/ExportAPITest.cpp` `ExportVideoToBuffer`; `engine/lib/test/api/CodecAPITest.cpp` `exportVideoToBufferEndToEnd` |
| `ui.insertOrderComponent` places a component in a bar                                                                                   | editor | `apps/cesdk_web/packages/api/ui/orderComponent.test.ts`, `apps/cesdk_web/packages/api/ui/UserInterfaceAPI.test.ts`                  |

Core coverage gaps found (candidates to add in the core suites, not in this kit):

1. `@cesdk/core-configs-web` had no tests at all. Closed on this branch: the package has a `test` script and `packages/cesdk-core-configs-web/src/editorConfigs.test.ts`, which drives every one of the seven configurations through a spy. `the video editor shows only the active track, the advanced one shows all` and `both video editors ship the video and audio libraries` are the two cases this kit leans on. The feature array itself is still asserted only for the read-only configurations, so a change to `video-editor/features.ts` is still unguarded.
2. `plugin-premium-asset-source-web` is the only core asset-source plugin without a `plugin.test.ts`. This kit and the advanced kit both add it. Suggested home: next to its siblings.
3. `NavigationBarActionExportVideo` has no test: not that it runs `exportDesign` with `video/mp4`, not that it hides in Design mode, not the unsupported-encoder branch. Suggested home: `apps/cesdk_web/packages/ui/components/actions/`.
4. `UtilsAPI.test.ts` asserts `exportVideo` was called with `expect.any(Object)`. Nothing pins that a caller's `targetWidth`, `targetHeight` and `framerate` reach the engine. Every video-export kit depends on it. Suggested home: the same file.

Until gap 3 is closed, VED-06 keeps its recorded-options assertion as the end-to-end proof.

## 11. Coverage pass

Cases added to close the merged-coverage gaps:

- **VED-U6 · unit · src/index.ts, with `@cesdk/cesdk-js` and the kit barrel mocked: the demo base URL falls back to the published data when `VITE_DEMO_ASSETS_BASE_URL` is unset and is taken when it is set, a successful create publishes `window.cesdk`, configures the editor, loads the scene from that base URL and reports the `created` and `ready` demo phases, and a rejected create reports `failed`, logs `Failed to initialize CE.SDK:` and leaves no unhandled rejection**

No uncovered line, branch or function remains.
