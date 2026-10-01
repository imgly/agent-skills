# Test plan: starterkit-video-export-options

Version 5, 9 Sep 2026. Status: implemented. 37 unit and headless tests and 12 browser tests run in `npm run ci` (exit 0); two unit cases are expected failures that pin known issues 3 and 5. Merged coverage is lines 100 %, branches 98.57 %, functions 100 %.

## 1. Purpose

Verify that the Video Export Options starter kit works as shipped: the editor opens with the export panel, the panel offers the resolutions that fit the page's aspect ratio, and every resolution and frame-rate choice reaches the engine as the export option the user asked for.

## 2. Scope

In scope

- `src/imgly/plugins/export-video-panel.ts`: the resolution and FPS lists, the aspect-ratio filter, the default selection, the custom width and height inputs and their linkage, the validation messages, the export button and the options it passes, the panel position and the navigation-bar button
- `src/imgly/config/**`: the kit's own copy of the video-editor configuration
- `src/index.ts` and `src/imgly/demo-assets.ts`: the engine config, the `window.cesdk` hook, the demo scene path, opening the panel on start-up

Out of scope

- What the engine produces for a given `targetWidth`, `targetHeight`, `framerate` or `videoBitrate`. Engine behaviour, see section 10.
- How builder `Select`, `NumberInput`, `Section` and `Button` render. Editor behaviour.
- The demo site around the kit (cards, tags, links, platform toggles, documentation and GitHub links). Covered by the `cesdk_web_demos` suite. Qase 1888, 1889, 1890, 1891, 1892, 1907, 1916 and 2393.

## 3. Test environment

- Browser: Chrome, headless, 1400 × 900
- Engine and editor: built from this repo, served locally. Requests to `cdn.img.ly` fail the test.
- License: the shared test license (valid on hostname `localhost` only)
- Data: the kit's own `public/assets/example-video-motion.scene`. One page, **1920 × 1080 px, 9.7 s** — both confirmed in S4 against the real engine (VEO-H1) and in the browser. Every expected value below is derived from those numbers.
- No console-error allowlist. The scene used to name Archivo as `.ttf`, which the v1.82 asset set no longer ships (it carries `.woff2` only), so two text blocks sat in an error state on every boot. The scene now names the `.woff2` files (the same fix as PR #17163), and every console error fails the run.
- Unit cases call `ExportVideoPanelPlugin({ fpsOptions, resolutionOptions })` with **freshly built option arrays**, never the module defaults, and drive `initialize` and the captured panel function with a `createApiSpy()` plus a fake `builder`, `engine` and `state`. The defaults are mutated in place at runtime — see known issue 2 — so shared arrays would leak between cases.
- The headless case loads the real scene in `@cesdk/node` and drives the captured panel function against the real engine. No DOM.

## 4. Approach

| Kind     | Tool                          | What it checks                                                        | Run                 |
| -------- | ----------------------------- | --------------------------------------------------------------------- | ------------------- |
| Static   | tsc, eslint, convention check | Types, deprecated APIs, kit folder shape                              | `npm run check:all` |
| Unit     | Vitest                        | Resolution filter, defaults, custom-size linkage, validation, options | `npm run test:unit` |
| Headless | Vitest + `@cesdk/node`        | The filter against the real demo scene                                | `npm run test:unit` |
| Browser  | Playwright                    | The test cases in section 5                                           | `npm run test:e2e`  |

All run in the kit's `ci` script. Browser tests use role and label locators only. The panel's logic is a pure function of the page size and the option arrays, so most of it is covered by unit cases and the browser keeps one proof per behaviour.

## 5. Test cases

Format: ID, level, Qase id, title. Then steps and expected result.
Common precondition for all browser cases: the kit is open in the browser and the scene has finished loading.

### 5.1 Start-up and the panel toggle

**VEO-01 · browser · Qase 1922 · The export panel is open on the right at start-up**
Steps: open the kit.
Expected: `//ly.img.panel/video-export` is open and positioned right, titled "Export Video". No console errors. No request to `cdn.img.ly`. This case also settles the start-up race in known issue 1.

**VEO-02 · browser · Qase 4658, 1927 · The Export Video button toggles the panel**
Steps: click Export Video in the navigation bar. Click it again.
Expected: the panel closes on the first click and opens on the second. The button is the accent action at the end of the bar.

**VEO-03 · browser · Qase 1923 · The format note is shown**
Steps: read the top of the panel.
Expected: "Videos are exported as MP4 with H.264 Codec", left aligned.

### 5.2 Defaults for this scene

**VEO-04 · browser · Qase 1926 · Full HD is selected by default**
Steps: read the Resolution control.
Expected: "Full HD (FHD)" is selected, and the list offers exactly High Definition (HD), Full HD (FHD), Quad HD (2K), Ultra HD (4K) and Custom. Standard Definition is absent: 640 × 480 is 4:3 and the page is 16:9.

**VEO-05 · browser · Qase 1925, 1943 · 30 FPS is selected by default and the control has a tooltip**
Steps: read the Frames per Second control, then hover it.
Expected: "30 FPS" is selected; the list offers 24, 30, 60 and 120; hovering shows the tooltip about smoothness, file size and export time.

### 5.3 Export with the chosen options

**VEO-06 · browser · Qase 1905 · Export with the defaults**
Steps: install the export spy in intercept mode, click Export Video inside the panel.
Expected: one `engine.block.exportVideo` call on the current page with `mimeType: 'video/mp4'`, `videoBitrate: 'Auto'`, `targetWidth: 1920`, `targetHeight: 1080`, `framerate: 30`, and the button is enabled again afterwards.
Run correction: the intercepted stub resolves before the loading state is observable, so the pending state is pinned by VEO-U8 instead. The editor also opens an "Export complete" `alertdialog` that covers the panel until it is closed, so every export case closes it before the next interaction.

**VEO-07 · browser · Qase 1906 · Change the frame rate**
Steps: set Frames per Second to 24, export. Repeat with 120.
Expected: `framerate` is 24, then 120; every other option is unchanged.

**VEO-08 · browser · Qase 1928 · Change the resolution**
Steps: set Resolution to High Definition (HD), export. Repeat with Ultra HD (4K).
Expected: `targetWidth`/`targetHeight` are 1280 × 720, then 3840 × 2160.

**VEO-09 · browser · A real export produces a playable MP4**
Steps: trim the page to 2 s (9.7 s does not encode inside the test timeout), set Resolution to Custom, type height 180 (width follows to 320), set Frames per Second to 24, install the export spy **without** intercept, click Export Video.
Expected: one MP4 download; `mp4Info` reports 320 × 180 and the duration the case set. This is the kit's single end-to-end proof that the recorded options are the ones that reach the encoder.
Platform: the CI runner's Chrome on Linux has no H.264 encoder (`kit.videoExportSupported` is false there), so a real encode cannot run. On such a browser the case installs the spy **with** intercept, like VEO-06 to VEO-08, and asserts only that 320 × 180 at 24 fps reaches `exportVideo`; the decoded-file assertions run wherever an encoder exists, which includes every developer machine.

### 5.4 Custom resolution

**VEO-10 · browser · Custom size fields appear and stay in ratio**
Steps: set Resolution to Custom.
Expected: Height and Width inputs appear, pre-filled with 1080 and 1920. Typing 720 into Height sets Width to 1280; typing 640 into Width sets Height to 360.

**VEO-11 · browser · Custom size above the limit is rejected**
Steps: with Custom selected, set Height to 4000.
Expected: Width follows to 7111, which is above the 4000 limit, so "Height or width can't be greater than 4000" appears and Export Video is disabled. The Height input clamps at 4000; the derived Width does not — see known issue 3.
Since 6b the derived dimension is rounded to a whole pixel.

**VEO-12 · browser · Custom size below the limit is rejected**
Steps: with Custom selected, set Width to 16.
Expected: Height follows to 9, below the 16 minimum, so "Height and width must be at least 16" appears and Export Video is disabled.

### 5.5 Unit cases (no browser, no engine)

Subject: `ExportVideoPanelPlugin` from `src/imgly/plugins/export-video-panel.ts`. `initialize` is called with a `createApiSpy()`; the panel function passed to `ui.registerPanel` is captured from the spy and called directly with a fake `builder`, a fake `engine` whose `getFrameWidth`/`getFrameHeight` return the case's page size, and a `state` implementation backed by a plain map.

**VEO-U1 · unit · Registration**
`initialize` sets the translations, registers `ly.img.export-options.navigationBar`, registers `//ly.img.panel/video-export`, sets its position to `right`, inserts the navigation-bar component at the end of `ly.img.navigation.bar`, and subscribes to `scene.onActiveChanged`. It resolves without doing anything when `cesdk` is null — the only observable of the early return, since a null editor gives the case nothing to assert against. A third case drives the registered navigation-bar component: its accent button opens the panel when it is closed and closes it when it is open.

**VEO-U2 · unit · The aspect-ratio filter**
Parametrised over the page size: 1920 × 1080 gives HD, FHD, 2K, 4K and Custom with FHD selected; 1080 × 1920 gives Custom only; 1080 × 1080 gives Custom only. The filter compares `width / height` for exact float equality, which is why the four 16:9 presets all pass — see known issue 4.

**VEO-U3 · unit · The default when no preset matches**
On a 1000 × 500 page the only option is Custom, and it is selected with the page's own size, not its declared 1000 × 1000 default.

**VEO-U4 · unit · Resolution falls back to Custom when the page changes**
Start on 1920 × 1080 with 2K selected, then render again with a 1080 × 1920 page. The selection becomes Custom.

**VEO-U5 · unit · Custom width and height stay in the page's ratio**
On 1920 × 1080: setting height 720 sets width 1280; setting width 640 sets height 360. A third case asserts the correct behaviour — that setting height 100 gives a whole-pixel width of 178 — and is an expected failure; a fourth pins the 177.77777777777777 the kit produces today. See known issue 3.

**VEO-U6 · unit · Validation**
Height 4001 or width 4001 pushes the max message; height 15 or width 15 pushes the min message. Each renders as its own `builder.Text`, and the export button is disabled while either is present; a size inside the limits leaves it enabled.
Run correction: **both messages at once is unreachable.** The two dimensions are always derived from one another in the page's ratio, so a page would have to be wider than 250:1 for one to exceed 4000 while the other stays under 16. The case pins that only one ever appears.

**VEO-U7 · unit · Export options**
Clicking the export button calls `cesdk.utils.export` with exactly `{ mimeType: 'video/mp4', videoBitrate: 'Auto', targetWidth, targetHeight, framerate }` from the current state, then calls `onExport` with the first blob. The default `onExport` calls `cesdk.utils.downloadFile(blob, 'video/mp4')`; a supplied `onExport` replaces it and no download happens.

**VEO-U8 · unit · The export button's busy state**
`isExporting` is true while the export promise is pending and false again after it rejects, not only after it resolves. The kit uses `finally` for this.

**VEO-U9 · unit · Custom option arrays**
`ExportVideoPanelPlugin({ fpsOptions: [{ id: '25', label: 'x', value: 25 }] })` uses that single option. A second case asserts the correct behaviour — that a frame rate is selected — and is an expected failure, because the default is hardcoded as `fpsOptions[1]`; see known issue 5.
Run correction: known issue 2, the shared `ALL_RESOLUTIONS` mutation, has **no test**. Every render rewrites the Custom entry from the current page size, so two plugin instances always converge and the leak produces no observable difference through the panel's own surface. The fix is still worth making; it cannot be driven from a test.

**VEO-U10 · unit · The panel closes on a scene change**
Firing the `scene.onActiveChanged` callback captured in VEO-U1 calls `ui.closePanel('//ly.img.panel/video-export')`.

### 5.6 Headless case (engine, no browser)

**VEO-H1 · headless · The filter agrees with the real demo scene**
Load `public/assets/example-video-motion.scene` in `@cesdk/node`, read the current page, and call the captured panel function with the real engine.
Expected: the page is 1920 × 1080, the available resolutions are HD, FHD, 2K, 4K and Custom, and FHD is selected. This is the one case that proves the fixture and the logic agree; `exportVideo` throws on `@cesdk/node`, so no headless case exports.

**KB-01 · unit · Keyboard catalog predicates**

`tests/unit/keyboard-catalog.test.ts` runs every `run` and `when` of `src/imgly/config/keyboard/catalogs/us-ansi.ts` against 1620 editor states (5 edit modes, 9 selections, 3 roles, features on and off, 3 vector states, page and no page) and asserts that none throws, that every shortcut activates in at least one state, and that every function `run` reaches `cesdk.actions.run`. Kit-owned: the kit decides which key does what and when it is live. The catalog measures 100 % lines, branches and functions.

## 6. Entry and exit criteria

Entry: engine and editor built; `@cesdk/node` built with its assets; test license available; the kit's `test:unit` and `test:e2e` scripts replaced with the real commands (they are `exit 0` today); `npm run check:format` passing — it fails today, see known issue 6. The harness needs two additions this plan depends on and which do not exist yet:

1. `spyExportVideo(page, { intercept })` — `spyExport` today patches `engine.block.export` and calls through. This kit exports video, and VEO-06 to VEO-08 must record the options without running six encodes. Intercept mode records and resolves a stub `Blob`; VEO-09 runs with intercept off.
2. `mp4Info(buffer)` — pixel size and duration from the `tkhd` and `mvhd` boxes, in plain JavaScript. No ffprobe: a missing external tool would have to fail the test loudly, and a pure box walk removes the dependency.

Exit: every case in section 5 passes locally and in CI. `npm run ci` passes. The published kit contains no test files. A release run reports results to the Qase ids above.

## 7. Known issues found while writing this plan

Confirm each with a test before fixing.

1. Start-up ordering is a race the code does not settle. `initVideoExportOptionsEditor` subscribes to `scene.onActiveChanged` with a `closePanel`; `src/index.ts` then calls `cesdk.load(...)`, which fires it, and only afterwards calls `openPanel`. If that subscription ever delivers asynchronously the panel is closed on start-up and Qase 1922 fails. VEO-01 pins the current behaviour.
2. The Custom option object is module state and is mutated in place. `resolutionState.value.value.width = widthState.value` writes into the shared `ALL_RESOLUTIONS` entry, so the declared 1000 × 1000 default is overwritten by the first page the panel ever sees, for every editor instance in the process and for every later scene.
3. **Fixed in 6b.** Derived dimensions are neither rounded nor clamped. `NumberInput` clamps the field the user types in to 16…4000, but the other dimension is computed and written straight through: height 4000 gives width 7111, width 16 gives height 9. That is what makes the two validation messages reachable at all (VEO-11, VEO-12), and it also means a non-integer can reach the engine — height 100 sends `targetWidth: 177.77777777777777`. The pilot found the opposite in `starterkit-export-options`, whose equivalent error branch is dead because both of its inputs are typed and clamped (its known issue 7); here only one input is typed, so the branch is live.
4. `resolutionHasSameAspectRatio` compares `width / height` with `===`. It works for the shipped presets because 1280/720, 1920/1080, 2560/1440 and 3840/2160 are the same double, but any page whose ratio is a different rounding of 16:9 drops every preset and leaves only Custom.
5. **Fixed in 6b.** `state('fps', fpsOptions[1])` hardcodes the second entry as the default. A caller passing one FPS option gets `undefined` as the initial value and the select renders empty.
6. **Fixed before S4.** `npm run check:format` passes.
7. The README title is "Video Editor Starter Kit", its Key Capabilities list is the generic video-editor one, and its Architecture tree omits `src/resolveAssetPath.ts`. Its opening line advertises "SD, HD, FHD, 2K, 4K, or define custom quality"; SD is never offered for the shipped 16:9 scene, and the panel gives no hint that a resolution was filtered out.
8. **Fixed in S4.** `src/imgly/config/**` was resynced with `@cesdk/core-configs-web/video-editor` file by file. The delta was four files: an outdated `@see` URL in `actions.ts`; a keyboard-shortcuts block in the wrong place plus stale comments in `features.ts`; and in `settings.ts` a `features/videoCaptionsEnabled` line (gone from both since `resetEditor()` no longer switches captions off) and `timeline/trackVisibility: 'all'` where the shared config now sets `'active'`. The ruler is commented out like in the shared package, since compact mode shows only the active track (VEO-U17 pins it). The remaining delta is comment wording in the text-path entries.
9. `cesdk.ui.setPanelPosition('//ly.img.panel/video-export', 'right' as 'left' | 'right')` casts a string literal to its own type. The cast is a no-op left over from an older signature.

### Coverage residue

One branch of `src/**` is left: the `Custom` fallback of the resolution `find` in `src/imgly/plugins/export-video-panel.ts:225`. Unreachable by construction — the `find` in the left arm of the `??` runs the predicate the enclosing `if` has just proven falsy, so the fallback always wins.

## 8. Open questions

1. Issue 3: round the derived dimension, or leave it? Recommended: round it. A fractional `targetWidth` reaching the encoder is a real defect, and rounding does not weaken VEO-11 or VEO-12, which stay reachable because the derived value is still unclamped. Not decided, so VEO-U5 carries an expected failure against the rounded value.
2. Issue 2: make the Custom option per-instance. Recommended: yes; it is a two-line change and the kit is copied as-is by customers. But a test cannot pin it — see the VEO-U9 run correction — so the change would land uncovered.
3. VEO-09 is the only real encode in the batch. Recommended: keep exactly one, here, because this is the kit whose whole purpose is the export options. It runs the encode on every browser with an H.264 encoder and degrades to the options assertion on the CI runner, which has none.
4. Issue 5: default to `fpsOptions.find(o => o.value === 30) ?? fpsOptions[0]`. Recommended: yes. Not decided, so VEO-U9 carries an expected failure against a defined default.

## 9. Estimate

Measured: 41 unit cases in 20 ms, 2 headless cases in 0.5 s, 12 browser cases in 48 s in dev mode on an M-series Mac, VEO-09's real encode included.

## 10. Boundary review

Rule used: the code that makes a decision owns the test for it. This kit decides the resolution and FPS lists, the aspect-ratio filter, the default selection, the width and height linkage, the validation limits, and the exact option object it hands to `cesdk.utils.export`. The editor decides how a builder control renders and how a panel opens. The engine decides what those options produce.

Core behaviour this plan leans on, and where it is covered today:

| Behaviour                                                                                                                                                        | Owner  | Covered by                                                                                                                          |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ | ----------------------------------------------------------------------------------------------------------------------------------- |
| `cesdk.utils.export` with a video mime type calls `engine.block.exportVideo` on the current page, disables solo playback, reports progress and surfaces failures | editor | `apps/cesdk_web/packages/api/utils/UtilsAPI.test.ts` "export (video path)"                                                          |
| A caller's `targetWidth`, `targetHeight` and `framerate` reach the engine                                                                                        | editor | **Partly.** The same file asserts `exportVideo` was called with `expect.any(Object)`. Gap 1                                         |
| `videoBitrate: 'Auto'` maps to the `-1` engine sentinel                                                                                                          | engine | `bindings/wasm/js_web/src/resolveVideoBitrate.test.ts`                                                                              |
| A video page exports to a non-empty MP4                                                                                                                          | engine | `engine/lib/test/api/ExportAPITest.cpp` `ExportVideoToBuffer`; `engine/lib/test/api/CodecAPITest.cpp` `exportVideoToBufferEndToEnd` |
| `exportVideo` rejects a non-page block, an invalid block and a non-MP4 mime type                                                                                 | engine | `engine/lib/test/api/ExportAPITest.cpp` `ExportValidationAPITest`                                                                   |
| `ui.registerPanel`, `ui.openPanel`, `ui.closePanel`, `ui.isPanelOpen`, `ui.setPanelPosition`                                                                     | editor | `apps/cesdk_web/packages/api/ui/UserInterfaceAPI.test.ts`, `apps/cesdk_web/packages/cesdk/stores/UserInterfaceStore.test.ts`        |
| `engine.block.getFrameWidth`/`getFrameHeight` return the laid-out page size                                                                                      | engine | `engine/lib/test/api/BlockLayoutTest.cpp`                                                                                           |
| `cesdk.utils.downloadFile` produces a download with the given mime type                                                                                          | editor | `apps/cesdk_web/packages/api/utils/UtilsAPI.test.ts`                                                                                |

Core coverage gaps found (candidates to add in the core suites, not in this kit):

1. Nothing pins that video export options reach the engine. `UtilsAPI.test.ts` asserts the call happened with some object; the js_web `BlockAPI.exportVideo` marshalling of `targetWidth`, `targetHeight`, `framerate` and `videoBitrate` has no test at all. This kit exists to set exactly those four, and so do the mobile export kits. Suggested home: `apps/cesdk_web/packages/api/utils/UtilsAPI.test.ts` for the pass-through, `bindings/wasm/js_web/src/` for the marshalling.
2. No engine test asserts that `targetWidth`/`targetHeight` change the encoded video's pixel size or that `framerate` changes its frame count. `ExportAPITest.cpp` `ExportVideoToBuffer` and `CodecAPITest.cpp` `exportVideoToBufferEndToEnd` both assert only "more than 8 bytes", and both `GTEST_SKIP` when the codec backend is unavailable — so on a runner without an encoder there is no video-export coverage at all. VEO-09 is the only assertion in this repository that a requested video resolution is the one produced. Suggested home: `engine/lib/test/api/ExportAPITest.cpp`, next to the existing static-export target-size test.
3. Builder `Select` and `NumberInput` with `min`/`max`/`step`: nothing asserts the clamp behaviour this kit's validation depends on. Suggested home: `apps/cesdk_web/packages/ui/builder/`. Already raised by the export-options pilot for `ButtonGroup` and `Select`; `NumberInput` clamping is the addition.
4. `@cesdk/core-configs-web` now has `src/editorConfigs.test.ts`, and this kit ships a copy of one of its configs (known issue 8), so the new suite does not cover the copy. Raised in full in the video-editor plan.

Until gaps 1 and 2 are closed, VEO-09 keeps its decoded-file assertion as the end-to-end proof.

## 11. Coverage pass

Cases added to close the merged-coverage gaps:

- **VEO-U11 · removed.** `resolveAssetPath` is gone; the shared `tests/unit/demo-assets.test.ts` covers `src/imgly/demo-assets.ts`.
- **VEO-U12 · unit · `setupActions` — the kit registers `exportDesign` only; it exports with `videoBitrate: 'Auto'` by default, lets the caller override the bitrate, and downloads the result**
- **VEO-U13 · unit · VideoEditorConfig — `initialize` resets the editor, pins the editor compatibility version to the plugin's CE.SDK version, then applies features, UI, actions, shortcuts, translations and engine settings; with no `cesdk` in the context it touches the engine not at all**
- **VEO-U14 · unit · `setupVideoTimeline` — the kit does order the timeline controls bar**
- **VEO-U15 · unit · the panel without a page — renders nothing while the scene has no current page**
- **VEO-U16 · unit · `src/index.ts` — a successful create loads the demo scene, opens the export panel and reports the demo phases `created` then `ready`; a rejected create reports `failed` and logs `Failed to initialize CE.SDK:`**
- **VEO-U17 · unit · `setupFeatures` — enables the timeline clip track, the playback controls, animations and transitions, and names every feature on its own, enabling no umbrella group whose children it also lists**

Residue, measured and classified:

- `src/imgly/plugins/export-video-panel.ts:225`. The `find` in the left arm of the `??` runs the same predicate the enclosing `if` has just proven falsy, so the `Custom` fallback always wins.
