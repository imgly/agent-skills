# Test plan: starterkit-advanced-video-editor

Version 4, 7 Sep 2026. Status: implemented. 13 unit and headless tests and 9 browser tests; AVE-07 pins Save and Export Design. Merged coverage: lines 100 %, branches 100 %, functions 100 %.

## 1. Purpose

Verify that the Advanced Video Editor starter kit works as shipped: the editor starts with the multi-track timeline and the demo template, the asset libraries the kit asks for are the ones that appear, and the five-entry actions dropdown in the navigation bar saves, exports and imports.

## 2. Scope

In scope

- `src/imgly/index.ts`: which plugins the kit adds, in which order, with which `include` globs
- The `ly.img.actions.navigationBar` dropdown the kit inserts, and its five children
- The background-removal plugin configuration
- `src/index.ts`: the engine config, the `window.cesdk` hook, the demo scene URL, the start-up error path

Out of scope

- The editor UI itself. `AdvancedVideoEditorConfig` comes from `@cesdk/core-configs-web`, a shared package. The kit does not own its feature list, dock order, timeline or panels. See section 10.
- The asset-source plugins' own behaviour. Each ships its own test in `packages/cesdk-core-plugins-web`.
- The demo site around the kit. Covered by the `cesdk_web_demos` suite.

This kit has **no Qase cases**. The cases below come from the kit's code.

## 3. Test environment

- Browser: Chrome, headless, 1400 × 900
- Engine and editor: built from this repo, served locally. Requests to `cdn.img.ly` fail the test.
- License: the shared test license (valid on hostname `localhost` only)
- Data: `${DEMO_ASSETS_BASE_URL}/assets/templates/lunar-video-default/scene.scene` and the fonts, images, audio and video files next to it, mirrored into `packages/cesdk-web-examples-data/data/starterkit-advanced-video-editor/`. The files are git-LFS. While the mp4s are unmaterialized stubs the local CDN proxies them to `staticimgly.com`, and that path answers one request with a 416 the console guard reports; the cases pass once the files are on disk. Materialise them with `git lfs pull -X '' -I 'packages/cesdk-web-examples-data/data/starterkit-advanced-video-editor/**'`.
- Unit cases stub `@cesdk/cesdk-js/plugins` and `@cesdk/core-configs-web/advanced-video-editor` with classes that capture their constructor config, then call `initAdvancedVideoEditor` with a `createApiSpy()`. No DOM, no engine.

## 4. Approach

| Kind    | Tool                          | What it checks                                         | Run                 |
| ------- | ----------------------------- | ------------------------------------------------------ | ------------------- |
| Static  | tsc, eslint, convention check | Types, deprecated APIs, kit folder shape               | `npm run check:all` |
| Unit    | Vitest                        | Plugin list and order, include globs, actions dropdown | `npm run test:unit` |
| Browser | Playwright                    | The test cases in section 5                            | `npm run test:e2e`  |

All three run in the kit's `ci` script. Browser tests use role and label locators only. There are no headless cases: the kit has no module that runs without an editor.

## 5. Test cases

Format: ID, level, title. Then steps and expected result.
Common precondition for all browser cases: the kit is open in the browser and the scene has finished loading.

### 5.1 Start-up

**AVE-01 · browser · Editor loads in video mode with the demo template**
Steps: open the kit.
Expected: `engine.scene.getMode()` is `Video`. One page on the canvas. The Video Timeline region is visible. No console errors. No request to `cdn.img.ly`.
Run correction: `timeline/trackVisibility` is not readable through `engine.editor.getSetting` — it is intercepted by the editor and is not a reflected `UBQSettings` member, so the call throws `UTILS.REFLECTION_MEMBER_TYPE_NOT_REFLECTED`. It is also the shared config's decision, not the kit's, and `apps/cesdk_web/packages/cesdk/make_EditorAPI_setSetting.test.ts` already covers it.

**AVE-02 · browser · The debug hook is on the window**
Steps: read `window.cesdk`.
Expected: it is the editor instance and its `engine` and `ui` are usable.

### 5.2 Libraries the kit asks for

**AVE-03 · browser · The included asset sources are registered, the excluded ones are not**
Steps: read `engine.asset.findAllSources()`.
Expected: it contains `ly.img.image`, `ly.img.video`, `ly.img.audio`, the three upload sources, `ly.img.page.presets` and the premium templates source, plus the blur, caption-preset, colour, crop-preset, effect, filter, sticker, text, text-component, typeface and vector-shape sources the kit adds.
Run correction: `PagePresetsAssetSource` registers **one** source, `ly.img.page.presets`, not one per platform, so the eight `include` globs are pinned by AVE-U2 instead.

**AVE-04 · browser · Every dock entry opens its panel**
Steps: click each dock entry in turn.
Expected: the asset library panel opens with the entry's title and lists assets or its empty state. Which entries exist is `AdvancedVideoEditorConfig`'s decision; this case proves the kit's plugin list produced sources for them.

### 5.3 The actions dropdown

**AVE-05 · browser · The dropdown holds the five actions the kit lists**
Steps: read the Save button, then open the dropdown at the end of the navigation bar.
Expected: Save renders as its own navigation-bar button; the dropdown holds Export Video, Export Design, Export Archive and Import, in that order.
Run correction: the editor renders the **first** child of `ly.img.actions.navigationBar` as its own button and the rest inside the dropdown — the same shape P2a found in the design kits. The editor's label for `exportScene` is "Export Design", not "Export Scene".

**AVE-06 · browser · Export Video passes the kit's options**
Steps: install the export spy in intercept mode, open the actions menu, click Export Video.
Expected: exactly one `engine.block.exportVideo` call, on the current page, with `mimeType: 'video/mp4'` and `videoBitrate: 'Auto'`, and no `targetWidth`, `targetHeight` or `framerate`. The encode itself does not run — see known issue 4.
Run correction: the recorded options also carry an `abortSignal` the editor adds, so the case asserts the two options it owns and the absence of the three target keys, not a deep equality.

**AVE-07 · browser · Save and Export Design both download the same scene text**
Steps: click Save, then Export Design from the dropdown.
Expected (correct behaviour, not the current one): both produce one text download whose content starts with `UBQ1`.
Run correction: **neither downloads anything.** `scene.saveToString()` rejects the shipped demo scene with `Scene contains disallowed schemes in resource URLs: "buffer"`, which surfaces as an uncaught page error and no message to the user — new known issue 8. The case is `test.fail()` against the correct behaviour, per the S4 rule for a known issue that is not decided as a fix.

**AVE-08 · browser · Export Archive downloads a zip**
Steps: open the actions menu, click Export Archive.
Expected: one download that starts with the `PK` zip signature and contains a scene entry.

### 5.4 Background removal

**AVE-09 · browser · The background-removal entry appears in the canvas menu**
Steps: read the `ly.img.canvas.menu` component order.
Expected: it contains `@imgly/plugin-background-removal-web.canvasMenu`. **Do not click it.** The provider downloads a model of tens of megabytes from a host the network guard has not been checked against.
Run correction: selecting the template's image graphic renders no background-removal button, so the component order is what the case reads. Whether the button renders for a given selection is the plugin's decision.

### 5.5 Unit cases (no browser, no engine)

Subject: `initAdvancedVideoEditor` from `src/imgly/index.ts`, driven with `createApiSpy()`.

**AVE-U1 · unit · Plugin order**
`addPlugin` is called with `AdvancedVideoEditorConfig` first, then the sixteen asset-source plugins, then the background-removal plugin. The sixteen are all in flight before the first one settles, so they register concurrently.

**AVE-U2 · unit · Include globs**
`UploadAssetSources` gets the three upload ids. `DemoAssetSources` gets `ly.img.templates.video.*`, `ly.img.image.*`, `ly.img.audio.*`, `ly.img.video.*`. `PagePresetsAssetSource` gets exactly the eight platform globs. `PremiumTemplatesAssetSource` gets `ly.img.templates.premium.*`.

**AVE-U3 · unit · Actions dropdown**
`ui.insertOrderComponent` is called once with `{ in: 'ly.img.navigation.bar', position: 'end' }` and a component whose `id` is `ly.img.actions.navigationBar` and whose `children` are the five action ids in the order the kit lists them.

**AVE-U4 · unit · Nothing else is configured**
No `setTheme`, no `setLocale`, no `feature.enable`, no `setSetting` call.

**AVE-U4b · unit · Background-removal options**
The plugin is constructed with `ui.locations` `['canvasMenu']` and `provider.type` `'@imgly/background-removal'`.

**AVE-U5 · unit · This kit differs from the plain video editor in exactly two ways**
The case imports `starterkit-video-editor/src/imgly` under the same module mocks, drives both `init*` functions with their own spy, and compares the two call sequences entry by entry. Exactly two entries differ: the `addPlugin` of the configuration plugin, and the `ui.insertOrderComponent`. Pinning that keeps the pair from drifting silently.

## 6. Entry and exit criteria

Entry: engine and editor built; test license available; the kit's `test:unit` and `test:e2e` scripts replaced with the real commands (they are `exit 0` today). The harness needs `spyExportVideo(page, { intercept })` and `mp4Info(buffer)`, neither of which exists yet — see the video-editor plan, entry criteria, for what they must do.

Exit: every case in section 5 passes locally and in CI. `npm run ci` passes. The published kit contains no test files.

## 7. Known issues found while writing this plan

Confirm each with a test before fixing.

1. The README's Architecture tree shows `src/imgly/config/` with seven files and `src/imgly/plugins/background-removal.ts`. Neither exists.
2. The kit's `.env.example` and README are byte-identical to the video-editor kit's apart from the demo-asset URL, including the hero-image caption "showing a video editing interface with timeline".
3. `src/index.ts` carries the same commented-out `baseURL` line whose value repeats the live line above it, and the same orphaned "Local assets for development" comment.
4. A real MP4 export is not a case. Measured in S4: the page is 1920 x 1080 and 12.0 s long, so an encode would sit at the top of the 30 s budget for no assertion `starterkit-video-export-options` VEO-09 does not already make.
5. Save and Export Design are the same action twice. `saveScene` downloads `scene.saveToString()` as `text/plain`; `exportScene` with its default `format: 'scene'` does exactly the same. The dropdown offers both, so a user sees two entries that produce one file. This is the shared config's decision, but the kit is what puts both in the menu.
6. `Import` opens a file picker. AVE-05 asserts the entry exists; driving the picker needs a `page.setInputFiles` path that the harness does not have yet.
7. The shared config also registers a standalone `exportVideo` action that nothing in this kit reaches: the navigation-bar button runs `exportDesign`. Dead surface a customer will find and expect to be the live path.

8. **Gone.** Save and Export Design rejected the old `.imgly` archive (`buffer` scheme in a resource URL). The kit loads the per-asset `scene.scene` now, and both actions download the scene text; AVE-07 pins it.

## 8. Open questions

1. Should AVE-U5 exist, or is a cross-kit assertion too clever? Recommended: keep it. The two kits were copied from one another and the diff is two lines; a drift here is invisible in review.
2. Import is untested (issue 6). Recommended: add a harness `importFile` helper in S4 and cover it, since Import is one of the five advertised actions.
3. Issue 5 is moot until issue 8 is fixed: both entries reject before they can be compared. AVE-07 pins the correct behaviour and fails today; the duplicate question returns once saving works.

## 9. Estimate

Measured: 9 browser cases in about 3 min on one worker (AVE-08 downloads a 72 MB archive); 9 unit cases in 0.3 s.

## 10. Boundary review

Rule used: the code that makes a decision owns the test for it. This kit decides which plugins to add, with which globs, which five actions go in the dropdown, and which scene to load. `@cesdk/core-configs-web` decides the UI. The engine decides what an export produces.

Core behaviour this plan leans on, and where it is covered today:

| Behaviour                                                                                                      | Owner  | Covered by                                                                                                                         |
| -------------------------------------------------------------------------------------------------------------- | ------ | ---------------------------------------------------------------------------------------------------------------------------------- |
| Each asset-source plugin registers its sources and library entries                                             | editor | `packages/cesdk-core-plugins-web/src/plugin-*/src/plugin.test.ts` — one per plugin the kit adds, except premium                    |
| `timeline/trackVisibility` is intercepted and drives the timeline store                                        | editor | `apps/cesdk_web/packages/cesdk/make_EditorAPI_setSetting.test.ts`                                                                  |
| `cesdk.utils.export` with a video mime type calls `engine.block.exportVideo` on the page and surfaces failures | editor | `apps/cesdk_web/packages/api/utils/UtilsAPI.test.ts` "export (video path)"                                                         |
| `videoBitrate: 'Auto'` maps to the `-1` engine sentinel                                                        | engine | `bindings/wasm/js_web/src/resolveVideoBitrate.test.ts`                                                                             |
| A video page exports to a non-empty MP4; a scene saves and reloads; an archive round-trips                     | engine | `engine/lib/test/api/ExportAPITest.cpp`, `engine/lib/test/api/CodecAPITest.cpp`, `engine/lib/test/api/ArchiveRoundTripAPITest.cpp` |
| An order component with `children` renders as a dropdown                                                       | editor | `apps/cesdk_web/packages/api/ui/orderComponent.test.ts`                                                                            |

Core coverage gaps found (candidates to add in the core suites, not in this kit) — the same four as the video-editor plan, listed there in full: `@cesdk/core-configs-web` now has `src/editorConfigs.test.ts` (`the advanced editors use the compact dock, the plain ones the labelled one` and `only the advanced editor exposes vector editing and placeholders` cover this configuration), `plugin-premium-asset-source-web` has no `plugin.test.ts`, `NavigationBarActionExportVideo` has no test, and `UtilsAPI.test.ts` does not pin that export options reach the engine. This kit adds one more:

5. Nothing covers the advanced config's `importScene` action, which the kit exposes as the dropdown's Import entry. The kit's copy in the placeholders kit has already drifted from the shared one (it dropped the `format` parameter), which is what an untested shared action looks like. Suggested home: `packages/cesdk-core-configs-web/src/advanced-video-editor/`.

## 11. Coverage pass

Cases added to close the merged-coverage gaps:

- **AVE-U6 · unit · src/index.ts, with `@cesdk/cesdk-js` and the kit barrel mocked: the demo base URL falls back to the published data when `VITE_DEMO_ASSETS_BASE_URL` is unset and is taken when it is set, a successful create publishes `window.cesdk`, configures the editor, loads the scene from that base URL and reports the `created` and `ready` demo phases, and a rejected create reports `failed`, logs `Failed to initialize CE.SDK:` and leaves no unhandled rejection**

No uncovered line, branch or function remains.
