# Test plan: starterkit-video-animations

Version 6, 7 Sep 2026. Status: implemented. 55 Vitest cases (unit and headless) and 7 browser cases run green in `KIT_TEST_COVERAGE=1 npm run ci`. Merged coverage is lines 100 %, branches 100 %, functions 100 %. Known issue 3 is fixed.

## 1. Purpose

Verify that the Video Animations starter kit works as shipped: the editor opens the Lunar template with the animation panel already on a background clip, the kit's two example scenes and seven audio tracks are in the libraries, and switching an example template loads it and records the choice in the URL.

## 2. Scope

In scope

- `src/imgly/index.ts`: the scene and audio asset definitions, the `{{base_url}}` substitution, the custom `ly.img.video.scene` source with its apply callback, `openAnimationPanel`, and the plugin list
- `src/imgly/config/**`: the kit's own copy of the video-editor configuration — the feature set, the dock with the Example Templates entry, the panel positions, the navigation bar, the i18n overrides
- `src/index.ts`: the engine config, the `window.cesdk` hook, the scene URL, the animation panel opening on start-up and on every scene change

Out of scope

- The animation inspector itself: how an animation renders, how it is highlighted when applied, how the timeline draws its icon. Editor and engine behaviour, see section 10.
- The asset-source plugins' own behaviour. Each ships its own test in `packages/cesdk-core-plugins-web`.
- The demo site around the kit (cards, tags, links, platform toggles, documentation and GitHub links). Covered by the `cesdk_web_demos` suite. Qase 2802, 2803, 2805, 2806, 2807, 2811, 2814 and 4372.

## 3. Test environment

- Browser: Chrome, headless, 1400 × 900
- Engine and editor: built from this repo, served locally. Requests to `cdn.img.ly` fail the test.
- License: the shared test license (valid on hostname `localhost` only)
- Data: `${DEMO_ASSETS_BASE_URL}` on `staticimgly.com`, which the network guard allows: the `lunar-video-default/scene.scene` start-up template, the two example scenes, their thumbnails, the dock icon SVG and the seven MP3s
- No `cdnAllowlist`. The two demo scenes' Caveat and Manrope font URIs are relative to the engine's `baseURL`, so the suite runs with the CDN guard at its default.
- The headless engine runs no render loop, so `isVisibleAtCurrentPlaybackTime` keeps its initial value until an update happens. VAN-H1 drives one with an 8 x 8 export.
- Unit cases stub `@cesdk/cesdk-js/plugins` with classes that capture their constructor config and drive `initVideoAnimationsEditor` and the `setup*` functions with a `createApiSpy()`. No DOM, no engine.
- The headless case builds its own video scene in `@cesdk/node`; it does not download the demo template.

## 4. Approach

| Kind     | Tool                          | What it checks                                               | Run                 |
| -------- | ----------------------------- | ------------------------------------------------------------ | ------------------- |
| Static   | tsc, eslint, convention check | Types, deprecated APIs, kit folder shape                     | `npm run check:all` |
| Unit     | Vitest                        | Asset definitions, base-url substitution, config, dock, i18n | `npm run test:unit` |
| Headless | Vitest + `@cesdk/node`        | `openAnimationPanel`'s block selection against a real engine | `npm run test:unit` |
| Browser  | Playwright                    | The test cases in section 5                                  | `npm run test:e2e`  |

All run in the kit's `ci` script. Browser tests use role and label locators only.

## 5. Test cases

Format: ID, level, Qase id, title. Then steps and expected result.
Common precondition for all browser cases: the kit is open in the browser and the scene has finished loading.

### 5.1 Start-up

**VAN-01 · browser · Qase 2817 · The Lunar template opens with animations applied**
Steps: open the kit.
Expected: `engine.scene.getMode()` is `Video`. One page on the canvas. At least one block in the scene has an animation. No console errors. No request to `cdn.img.ly`.

**VAN-02 · browser · Qase 2816 · The animation panel is open on a background clip**
Steps: read the UI after start-up.
Expected: the Animations panel is on screen, the selected block is a child of the always-on-bottom track, and it is visible at the current playback time. The panel is on the right — the kit moves the inspector there. That the panel then renders animation presets is editor behaviour; see section 10.
_Run note: `cesdk.ui.isPanelOpen('//ly.img.panel/inspector/animation')` returns `false` while the panel is visibly open, so the case asserts the rendered panel instead. The editor renders a panel as a complementary landmark named by its title, so the locator is the title, not the panel id._

**VAN-03 · browser · The animation panel reopens on a scene change**
Steps: load a different scene through `engine.scene.load`.
Expected: the animation panel is open again on a background clip of the new scene. The kit subscribes to `onActiveChanged` for this.

### 5.2 The example-template library

**VAN-04 · browser · The Example Templates dock entry lists both scenes**
Steps: click the first dock entry.
Expected: the entry is labelled "Example Templates" and the panel shows both assets: "Lunar Cosmetics · Landscape Example" and "Surf School · Portrait Example".
_Run note: the icon is fetched while the dock renders, before the case can start, so VAN-U5 asserts the icon URL instead._

**VAN-05 · browser · Applying an example template loads it, fits it and records it in the URL**
Steps: click "Surf School · Portrait Example".
Expected: the scene is replaced (the page size changes to portrait) and the URL query gains `template=surf-school`. Nothing reads that query parameter back — see known issue 1.
_Run note: the auto-fit and the stop-before-load are not asserted; neither leaves a state a role locator or the engine API can read after the load._

### 5.3 The audio library

**VAN-06 · browser · The custom audio source replaces the demo audio**
Steps: open the Soundstripe library.
Expected: both the dock button and the panel heading read "Soundstripe", and `ly.img.audio` holds exactly the kit's seven tracks, each with its label and an `.mp3` URI under the demo host.
_Run note: the plan expected "Audio" here because the override was inert. Known issue 3 is fixed and the case asserts the renamed strings._

### 5.4 Export

**VAN-07 · browser · Export Video passes the kit's options**
Steps: install the export spy in intercept mode, open the actions menu in the navigation bar, click Export Video.
Expected: exactly one `engine.block.exportVideo` call, on the current page, with `mimeType: 'video/mp4'` and `videoBitrate: 'Auto'`, and no `targetWidth`, `targetHeight` or `framerate`. The encode itself does not run — see known issue 6.

### 5.5 Unit cases (no browser, no engine)

Subject: `src/imgly/index.ts` and `src/imgly/config/**`, driven with `createApiSpy()`.

**VAN-U1 · unit · Scene assets get their base URL substituted**
`initVideoAnimationsEditor` calls `asset.addAssetToSource('ly.img.video.scene', …)` twice. Each asset's `meta.uri` and `meta.thumbUri` point at `${DEMO_ASSETS_BASE_URL}/assets/templates/…`, with no `{{base_url}}` left, and `blockType` is `//ly.img.ubq/scene`. The originals in `VIDEO_SCENES_ASSETS` are untouched — the kit clones with `structuredClone`, and this case is what keeps that.

**VAN-U2 · unit · Audio assets are handed to the engine loader with a base path**
`asset.addLocalAssetSourceFromJSONString` is called once with a JSON string holding seven assets under source id `ly.img.audio`, and with the base path `${DEMO_ASSETS_BASE_URL}/assets/audio`. The `{{base_url}}` placeholders stay in the JSON — the engine substitutes them, this kit does not.

**VAN-U3 · unit · The custom scene source is local and has an apply callback**
`asset.addLocalSource` is called with `ly.img.video.scene`, no application id, and a function.

**VAN-U4 · unit · Plugin list and include globs**
`addPlugin` is called with the kit's `VideoEditorConfig` first, then the fifteen asset-source plugins. `DemoAssetSources` gets `ly.img.templates.video.*`, `ly.img.image.*`, `ly.img.video.*` and **not** `ly.img.audio.*`, because the kit ships its own audio. `PagePresetsAssetSource` gets the eight platform globs. No `PremiumTemplatesAssetSource` and no background-removal plugin — unlike the sibling video kits.

**VAN-U5 · unit · Dock order**
`setupDock` adds the `ly.img.video.scene` library entry with two grid columns, then sets a dock order whose first entry is the Example Templates one, followed by a separator, a combined Elements entry, Uploads, and six single-type entries. `dock/hideLabels` is false and `dock/iconSize` is `large`.

**VAN-U6 · unit · Panels and view**
`setupPanel` sets the view to `default`, puts the inspector on the right and the settings panel on the right and floating. The shared config puts the inspector on the left; this kit deliberately differs, and VAN-02 depends on it.

**VAN-U7 · unit · Features**
`setupFeatures` enables animations, transitions, keyboard shortcuts, captions, the timeline clip track and the timeline ruler, which stays on because `timeline/trackVisibility` shows every track; nothing is disabled. Every id is a leaf: the list names no umbrella group whose children it also enables, so a CE.SDK upgrade that adds a child cannot enable it behind the kit's back. Known issue 4 is fixed.

**VAN-U9 · unit · The navigation bar**
`setupNavigationBar` ends the component order with an `ly.img.actions.navigationBar` entry whose only child is `ly.img.exportVideo.navigationBar`. With one child the editor renders it as a plain Export Video button, which is what VAN-07 clicks.

**VAN-U8 · unit · Translations**
`setupTranslations` sets exactly two English keys: `libraries.ly.img.audio.label` to "Soundstripe" and `libraries.ly.img.video.scene.label` to "Example Templates".

**VAN-U10 · unit · `setupUI` orders the bars the kit owns**
`setupUI` positions the panels before it sets any component order, and the set of ordered slots is exactly the dock, the navigation bar, the canvas bar, the canvas menu, the inspector bar and the video timeline controls bar.

**VAN-U11 · unit · The canvas bar and the canvas menus**
`setupCanvas` centres `ly.img.page.add.canvasBar` in a bottom canvas bar. The Transform canvas menu offers text editing, duplicate and delete; the Text menu offers the formatting controls; the Vector menu is deliberately empty.

**VAN-U12 · unit · The inspector bar per edit mode**
`setupInspectorBar` puts `ly.img.animations.inspectorBar` and `ly.img.transitions.inspectorBar` in the Transform bar and groups adjustment, filter, effect and blur under `ly.img.appearance.inspectorBar`. The Trim and Crop bars carry only their own controls; the Vector bar ends with `ly.img.vectorEdit.done.inspectorBar`.

**VAN-U13 · unit · The video timeline controls**
`setupVideoTimeline` sets the nine timeline control entries in order, split before playback and zoom before the toggle.

**VAN-U14 · unit · Components and keyboard shortcuts**
`setupComponents` registers nothing. `setupKeyboardShortcuts` calls `shortcuts.set` once with the US ANSI catalog object itself, so a catalog edit reaches the editor unfiltered.

**VAN-U15 · unit · The `exportDesign` action**
`setupActions` registers exactly one action. Its handler exports with `videoBitrate: 'Auto'` when the caller passes nothing, lets the caller's options win over that default, and downloads the first blob under the returned mime type.

**VAN-U16 · unit · `VideoEditorConfig`**
The plugin is named `cesdk-video-editor` and carries `CreativeEditorSDK.version`. `initialize` resets the editor first, pins the editor compatibility version to `CreativeEditorSDK.version`, then runs the feature, UI, action, shortcut, translation and engine-setting setup, and finishes with `editor.checkBrowserSupport` at `videoDecode: 'block'`, `videoEncode: 'warn'`. Without a `cesdk` in the context it touches neither the editor nor the engine.

**VAN-U17 · unit · Applying an example template**
The `applyAsset` callback of `ly.img.video.scene` stops the playing page, loads the asset's `meta.uri`, runs `zoom.toPage` with `autoFit`, and pushes a URL that adds `template=<asset id>` while keeping the query parameters that were already there. An asset with no `meta.uri`, and one with no `meta` at all, reject with "Asset does not have a uri" instead of loading an empty scene.

**VAN-U18 · unit · `src/index.ts`**
The entry creates the editor, loads `assets/templates/lunar-video-default/scene.scene` from the published demo assets, opens the animation panel once and again on every scene change, and publishes the editor on `window`. It reports the demo lifecycle phases `created` then `ready`. A failed start-up reports `failed` instead of leaving an unhandled rejection.

**VAN-U19 · unit · Asset source registration is concurrent**
With an `addPlugin` that resolves only on demand, `initVideoAnimationsEditor` issues the configuration plugin, waits for it, and then issues all fifteen asset-source plugins together. A sequential registration would stall after the first one.

### 5.6 Headless case (engine, no browser)

**VAN-H1 · headless · `openAnimationPanel` selects the first visible background clip**
Build a video scene in `@cesdk/node` with an always-on-bottom track holding two clips, the first ending before the current playback time and the second covering it. Call `openAnimationPanel` with the real engine and a stubbed `ui`.
Expected: the second clip is selected and `ui.openPanel` is called once with `//ly.img.panel/inspector/animation`. With no always-on-bottom track, nothing is selected and no panel is opened. This is the kit's only module that needs an engine but no DOM.

**KB-01 · unit · Keyboard catalog predicates**

`tests/unit/keyboard-catalog.test.ts` runs every `run` and `when` of `src/imgly/config/keyboard/catalogs/us-ansi.ts` against 1620 editor states (5 edit modes, 9 selections, 3 roles, features on and off, 3 vector states, page and no page) and asserts that none throws, that every shortcut activates in at least one state, and that every function `run` reaches `cesdk.actions.run`. Kit-owned: the kit decides which key does what and when it is live. The catalog measures 100 % lines, branches and functions.

## 6. Entry and exit criteria

Entry: engine and editor built; `@cesdk/node` built with its assets; test license available. All met: the scripts are the real commands, the harness has `spyExportVideo(page, { intercept })`, and `openAnimationPanel` now lives in `src/imgly/animation-panel.ts` (open question 2), so the headless case imports it without pulling the editor in. The unit cases stub `@cesdk/cesdk-js` and `@cesdk/cesdk-js/plugins` with `vi.mock`.

Exit: every case in section 5 passes locally and in CI. `npm run ci` passes. The published kit contains no test files. A release run reports results to the Qase ids above.

## 7. Known issues found while writing this plan

Confirm each with a test before fixing.

1. `persistSelectedTemplateToURL` writes `?template=<id>` and nothing ever reads it. The module's own doc comment advertises "Template switching via URL parameter"; opening the recorded URL still loads the Lunar default.
2. `src/imgly/config/ui/dock.ts` imports `DEMO_ASSETS_BASE_URL` from `../../index`, which imports `./config/plugin`, which imports `./ui`, which imports `dock.ts`. The cycle resolves only because the icon is a lazy callback. A customer moving the constant, or making the icon a plain string, gets an undefined value at module load.
3. **Fixed.** The override targeted `libraries.ly.img.audio.ly.img.audio.label`. `getTitleI18nKeys` (`apps/cesdk_web/packages/ui/components/assets/getTitle.ts`) only builds that `<entry>.<source>` form when a section is rendered for a named source, and this kit's dock entry lists asset-library **entries** (`ly.img.audio`, `ly.img.audio.upload`), so the panel titles itself from `libraries.<entry.id>.label` with no source id and the override never applied. The key is now `libraries.ly.img.audio.label`, which is also the key the dock entry already used for its button, so the rename reaches both. VAN-06 asserts it.
4. **Fixed.** `config/settings.ts` cast `'features/videoCaptionsEnabled' as any`; the line is gone, since the setting is internal and `resetEditor()` no longer switches captions off. The ruler stays enabled: the kit shows every timeline track, and a feature that should be off is left commented out, never enabled and then disabled. VAN-U7 pins the ruler.
5. `openAnimationPanel` runs twice at start-up: once explicitly from `src/index.ts` and once through the `onActiveChanged` subscription that `cesdk.load` fires. Each run does a 100 ms sleep and an `openPanel`.
6. A real MP4 export is still not a case. VAN-07 intercepts, per the batch decision that no video encode runs in this wave.
7. The README title is "Video Editor Starter Kit" and its Key Capabilities list ("Video Trimming", "Text Overlays", "Transitions") never mentions animations, the example templates or the audio library — the three things this kit exists to show.
8. The README's Architecture tree omits `config/keyboard/`, which the kit ships and `plugin.ts` calls.
9. **Fixed.** The merged report reads 100 % lines, 100 % branches and 100 % functions. The 16 comment and blank lines this issue counted as uncovered in version 5 are out of the report, because `merge-coverage.mjs` now takes the line denominator from the Vitest statement map wherever Vitest measured a file.

## 8. Open questions

1. Issue 1: make the kit read `?template=` on start-up, or drop `persistSelectedTemplateToURL`? Recommended: read it. Writing a parameter nobody reads is worse than not writing one, and the reader is four lines.
2. **Resolved.** `openAnimationPanel` moved into `src/imgly/animation-panel.ts` and is re-exported from `src/imgly/index.ts`, so `src/index.ts` is unchanged.
3. **Resolved for this kit.** The behavioural drift is resynced by hand. The drift check that would stop it recurring is still open; nothing on the branch compares a kit's config tree with `@cesdk/core-configs-web`.

## 9. Estimate

Measured: 7 browser cases in 1 m 20 s on one worker, 25 unit cases and 2 headless cases in 1.3 s. `npm run ci` takes about 2 minutes.

## 10. Boundary review

Rule used: the code that makes a decision owns the test for it. This kit decides the example scenes and audio tracks, the base-url substitution, the apply callback, the dock, the panel positions, the feature set, the translations, and when to open the animation panel. The editor decides how the animation inspector renders and how the timeline draws. The engine decides what an animation does.

Core behaviour this plan leans on, and where it is covered today:

| Behaviour                                                                                         | Owner  | Covered by                                                                                                                   |
| ------------------------------------------------------------------------------------------------- | ------ | ---------------------------------------------------------------------------------------------------------------------------- |
| A local asset source registered with `addLocalSource` is queried and its apply callback is used   | engine | `engine/lib/test/api/AssetSourceAPITest.cpp`, `engine/lib/test/api/AssetAPITest.cpp` `AddCustomAssetSource`                  |
| `addLocalAssetSourceFromJSONString` with a base path substitutes `{{base_url}}` in the asset meta | engine | **Not covered** — see gap 1 below. VAN-U2 asserts only what the kit hands over                                               |
| Animations are applied, serialized and evaluated at a playback time                               | engine | `engine/lib/test/api/AnimationAPITest.cpp`, `AnimationScopeAPITest.cpp`, `AnimationEffectPropertySweepAPITest.cpp`           |
| The animation inspector lists presets and marks the applied one                                   | editor | `apps/cesdk_web/packages/ui/components/Inspector/AnimationSubInspector.tsx` — **no test** (gap 2)                            |
| An asset library entry's title falls back through `libraries.<entry>.<source>.label`              | editor | `apps/cesdk_web/packages/ui/components/assets/getTitle.test.ts`                                                              |
| `ui.setPanelPosition`, `ui.openPanel`, `ui.isPanelOpen`, `ui.addAssetLibraryEntry`                | editor | `apps/cesdk_web/packages/api/ui/UserInterfaceAPI.test.ts`, `apps/cesdk_web/packages/cesdk/stores/UserInterfaceStore.test.ts` |
| `scene.onActiveChanged` fires when a scene is replaced                                            | engine | `engine/lib/test/api/EventSubscriptionDeepAPITest.cpp`, `engine/lib/test/api/SceneLifecycleAPITest.cpp`                      |
| `cesdk.utils.export` with a video mime type calls `engine.block.exportVideo`                      | editor | `apps/cesdk_web/packages/api/utils/UtilsAPI.test.ts` "export (video path)"                                                   |

Qase cases owned by the core suites, not by this kit:

| Qase | Title                                                          | Owner  | Covered?                                                                                                                                            |
| ---- | -------------------------------------------------------------- | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2822 | Animations are highlighted as applied when selected            | editor | **No.** `AnimationSubInspector.tsx` has no test. Gap 2                                                                                              |
| 2823 | Add an element, apply an animation, see its timeline icon      | editor | **Partly.** The engine side is covered by `AnimationAPITest.cpp`; the timeline animation indicator has no test. Gap 3                               |
| 2824 | Change animation properties and see them applied               | engine | **Yes.** `engine/lib/test/api/AnimationEffectPropertySweepAPITest.cpp` and `UBQAnimationPropertyDispatchAPITest.cpp` sweep every animation property |
| 4368 | Exported video's animation playback matches the editor preview | engine | **No.** Nothing compares rendered preview frames against encoded output. Gap 4                                                                      |

Core coverage gaps found (candidates to add in the core suites, not in this kit):

1. `addLocalAssetSourceFromJSONString` with a non-null base path: nothing asserts that `{{base_url}}` in `meta.uri` and `meta.thumbUri` is replaced. Both `AssetSourceAPITest.cpp` and `AssetAPITest.cpp` pass `std::nullopt`, and the js_web test re-implements the replacement inside the test. This kit's whole audio library depends on it. Already raised by batch P1; repeated here because a second kit depends on it.
2. `AnimationSubInspector` has no test: not the preset list, not the applied-state highlight, not the property controls. Qase 2822. Suggested home: `apps/cesdk_web/packages/ui/components/Inspector/`.
3. The video timeline's animation indicator has no test. Qase 2823. Suggested home: `apps/cesdk_web/packages/ui/components/Video/`.
4. Nothing verifies that an exported video's animated frames match the preview. Qase 4368 is a human judgement today. Suggested home: `engine/lib/test/api/`, a render-and-compare of one animated frame against the same frame decoded from an export — the frozen-corpus machinery in `engine/test/resources/serialization/scenes/` is the closest precedent.
5. `@cesdk/core-configs-web` now has `src/editorConfigs.test.ts`, and this kit ships a copy of one of its configs (known issue 4), so the new suite does not cover the copy. Raised in full in the video-editor plan.

Until gaps 2 and 3 are closed, VAN-01 keeps its "at least one block carries an animation" assertion as the end-to-end proof.
