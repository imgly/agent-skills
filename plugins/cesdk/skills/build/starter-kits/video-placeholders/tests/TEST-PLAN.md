# Test plan: starterkit-video-placeholders

Version 6, 7 Sep 2026. Status: implemented. 63 unit cases, 13 component cases and 14 browser cases run green in `npm run ci`. Known issue 6 is fixed and the kit now carries no `cdnAllowlist`. Version 5 adds the component cases VPL-C1 to VPL-C3, the unit case VPL-U15 and the browser cases VPL-11 to VPL-14. Vitest coverage is 100 % on all four metrics and merged coverage is 100 % lines, 100 % branches, 100 % functions, see section 5.6.

## 1. Purpose

Verify that the Video Placeholders starter kit works as shipped: it opens in Creator mode with the advanced dark editor and the placeholder controls, switching to Adopter gives the light restricted editor with the Creator's edits intact, and neither role can export.

## 2. Scope

In scope

- `src/imgly/index.ts`: the two init functions — which config plugin, which theme, which engine role, which asset-source plugins each adds
- `src/app/App.tsx`: the role state, the scene snapshot taken before a switch and restored after, the editor remount, the `zoom.toPage` call
- `src/app/RoleSwitcher/RoleSwitcher.tsx`: the two-button segmented control
- `src/imgly/config/video-editor/**` and `src/imgly/config/advanced-video-editor/**`: the kit's own copies of the two shared configurations
- `src/index.tsx` and `src/imgly/demo-assets.ts`: the engine config, the `window.cesdk` hook, the scene path

Out of scope

- What a placeholder does: which controls the placeholder inspector shows, how a placeholder-restricted block behaves for an Adopter, how the timeline draws one. Editor and engine behaviour, see section 10.
- The asset-source plugins' own behaviour. Each ships its own test in `packages/cesdk-core-plugins-web`.
- The demo site around the kit (cards, tags, links, platform toggles, documentation and GitHub links). Covered by the `cesdk_web_demos` suite. Qase 2309, 2310, 2311, 2312, 2313, 2314, 2315 and 2392.

## 3. Test environment

- Browser: Chrome, headless, 1400 × 900
- Engine and editor: built from this repo, served locally. Requests to `cdn.img.ly` fail the test.
- License: the shared test license (valid on hostname `localhost` only)
- Data: the kit's own `public/cases/placeholders-video/example.scene`. One page, **1080 × 1080 px, 15.35 s**, one track, twelve graphics, six texts, one audio block. **Seven of the twelve graphics already have `isPlaceholderEnabled` true in the saved file** — the plan's first version said none did. VPL-04 and VPL-07 therefore work on a graphic that starts `false`.
- No `cdnAllowlist`. The scene's font URIs are relative to the engine's `baseURL`, so the whole suite runs with the CDN guard at its default. Verified: the only Manrope requests a boot makes are `http://localhost:5199/local/cesdk-js/assets/ly.img.typeface/fonts/Manrope/Manrope-{Regular,Bold}.woff2`.
- The editor mounts on load, so the `kit` fixture works. **After a role switch the `CreativeEditor` remounts** — `App` bumps `editorKey` — so the fixture's editor handle is stale and every case that switches roles must re-acquire it with `getEditor(page)`.
- Unit cases stub `@cesdk/cesdk-js/plugins` with classes that capture their constructor config and drive the two init functions and the `setup*` functions with a `createApiSpy()`. No DOM, no engine.

## 4. Approach

| Kind      | Tool                          | What it checks                                          | Run                 |
| --------- | ----------------------------- | ------------------------------------------------------- | ------------------- |
| Static    | tsc, eslint, convention check | Types, deprecated APIs, kit folder shape                | `npm run check:all` |
| Unit      | Vitest                        | Per-role config, theme, role, plugin list, config drift | `npm run test:unit` |
| Component | Vitest + jsdom + RTL          | `RoleSwitcher`                                          | `npm run test:unit` |
| Browser   | Playwright                    | The test cases in section 5                             | `npm run test:e2e`  |

All three run in the kit's `ci` script. Browser tests use role and label locators only. There are no headless cases: everything the kit decides needs either an editor or nothing at all.

## 5. Test cases

Format: ID, level, Qase id, title. Then steps and expected result.
Common precondition for all browser cases: the kit is open in the browser and the scene has finished loading.

### 5.1 Start-up in Creator mode

**VPL-01 · browser · Qase 2474 · Creator is selected by default**
Steps: open the kit.
Expected: the role switcher shows Creator and Adopter, Creator is the active button, `engine.editor.getRole()` is `Creator`. One page on the canvas. No console errors. No request to `cdn.img.ly`.

**VPL-02 · browser · Qase 4315 · Creator mode is dark**
Steps: read the theme after start-up.
Expected: `cesdk.ui.getTheme()` is `dark`.
_Run note: the theme class assertion is dropped — a CSS class is not a role or label locator, and `getTheme()` is the kit's own decision._

**VPL-03 · browser · Qase 4635 · Creator mode offers the Design and Placeholder inspector views**
Steps: select a graphic block on the canvas, read the inspector.
Expected: the inspector shows both the Design and the Placeholder view and both are selectable. The advanced config enables `ly.img.placeholder`; the plain one does not. What the Placeholder view then contains is editor behaviour, see section 10.

**VPL-04 · browser · Qase 4638 · A Creator can turn a placeholder on**
Steps: select a graphic block, open the Placeholder view, enable one entry.
Expected: `engine.block.isPlaceholderEnabled` goes from false to true for that block.
_Run note: ticking "Allow to Move" flips `isPlaceholderEnabled`; `isPlaceholderControlsButtonEnabled` stays false, so it is not part of the expectation. The tab is asserted selected before the checkbox is clicked — a click into a still-rendering panel does not take._

### 5.2 Switching to Adopter

**VPL-05 · browser · Qase 4636 · Adopter mode is light**
Steps: click Adopter.
Expected: the editor remounts, `engine.editor.getRole()` is `Adopter` and `cesdk.ui.getTheme()` is `light`.
_Run note: the test deletes `window.cesdk` before clicking, or `waitForEditorReady` returns against the instance being disposed and every later call throws._

**VPL-06 · browser · Qase 2475 · Edits made as Creator survive the switch**
Steps: as Creator, change a text block's content. Click Adopter.
Expected: the new text is on the canvas after the remount. `App` calls `scene.saveToString()` before the switch and `scene.load` with that string after; the scene is not re-fetched from `sceneUrl`.

**VPL-07 · browser · Qase 4638 · Placeholder scope set as Creator applies as Adopter**
Steps: as Creator, enable the placeholder on one graphic and leave a second graphic without one. Click Adopter.
Expected: after the remount the block the Creator enabled still reports `isPlaceholderEnabled` true, and a graphic that was left alone still reports false.
_Run note: the overlay is not asserted; it is editor behaviour, see section 10._

**VPL-08 · browser · Qase 4637 · An Adopter cannot add elements**
Steps: as Adopter, read the dock and try to add a block through the asset library.
Expected: the dock's asset library entries (Templates, Elements, Uploads, Images, Videos) are **disabled** for the Adopter role, and `engine.block.findAll().length` is unchanged. The gating is the editor's `Adopter` role behaviour; this case is the kit's proof that it set the role. See section 10.
_Run note: the entries stay in the dock and are disabled — the plan's "or absent" branch does not happen._

**VPL-09 · browser · Switching back to Creator keeps the edits**
Steps: from Adopter, click Creator.
Expected: the theme is dark again, the role is `Creator`, and the scene still holds the edits from VPL-06. The snapshot path runs in both directions.

### 5.3 Export

**VPL-10 · browser · Qase 1974 · Export is not available in either role**
Steps: read the navigation bar as Creator, then as Adopter.
Expected: no Export Video, Export Design, Export Scene, Export Archive or Save entry in either role, and no `engine.block.exportVideo` call.
_Run note: the spy covers the Creator instance only. `spyExportVideo` refuses a second install on the same page, and the role switch builds a new engine, so the Adopter half is a UI-absence assertion; VPL-U6 covers both navigation bars directly._

### 5.4 Unit cases (no browser, no engine)

Subject: `src/imgly/index.ts` and `src/imgly/config/**`, driven with `createApiSpy()`.

**VPL-U1 · unit · Creator wiring**
`initVideoPlaceholdersCreatorEditor` adds `AdvancedVideoEditorConfig` first, calls `ui.setTheme('dark')`, adds the fifteen asset-source plugins, and ends with `engine.editor.setRole('Creator')`. The role is set last, after every plugin has registered.

**VPL-U2 · unit · Adopter wiring**
`initVideoPlaceholdersAdopterEditor` adds `VideoEditorConfig` first, calls `ui.setTheme('light')`, adds the same fifteen plugins with the same options, and ends with `engine.editor.setRole('Adopter')`.

**VPL-U3 · unit · The two roles differ in exactly three things**
Config plugin, theme, engine role. The plugin list, the include globs and their order are identical. Pinning that is what stops the two functions — 90 duplicated lines — drifting apart silently.

**VPL-U4 · unit · Include globs**
`UploadAssetSources` gets the three upload ids. `DemoAssetSources` gets `ly.img.templates.video.*`, `ly.img.image.*`, `ly.img.audio.*`, `ly.img.video.*`. `PagePresetsAssetSource` gets exactly the eight platform globs. Neither role adds `PremiumTemplatesAssetSource` or the background-removal plugin.

**VPL-U5 · unit · Placeholder features per role**
The advanced config's `setupFeatures` enables the twenty-four `ly.img.placeholder.*` options, among them the two `actAsPlaceholder` toggles; the plain one enables none of them. Both lists name every feature on its own, enabling no umbrella group whose children they also list. VPL-03 depends on this.

**VPL-U6 · unit · Neither navigation bar carries an export entry**
Both `setupNavigationBar` functions set a component order ending in `ly.img.zoom.navigationBar` and `ly.img.preview.navigationBar`, with no `ly.img.exportVideo.navigationBar`, `ly.img.actions.navigationBar`, `ly.img.saveScene.navigationBar` or `ly.img.exportScene.navigationBar`. This is the cheap half of Qase 1974; VPL-10 is the proof.

**VPL-U7 · unit · Dock settings per role**
The advanced config sets `dock/hideLabels` true and `dock/iconSize` `normal`; the shared advanced config leaves both commented out. This is a deliberate deviation, not drift, and the case exists so it stays deliberate.

**VPL-U8 · component · RoleSwitcher**
Rendering `RoleSwitcher` with `value: 'Creator'` gives two buttons, Creator carrying the active class; clicking Adopter calls `onChange('Adopter')` exactly once; clicking the already-active button still calls `onChange`. Runs under `tests/component/` in jsdom, through `@imgly/kit-test-harness/component` — open question 2 is resolved.

**VPL-U10 to VPL-U14 · The two editor configuration trees**
Both trees are asserted with the same cases, so a change to one that is not made to the other shows up. VPL-U10 `setupUI`: the video editor docks the inspector left and the advanced tree docks it right, both dock the asset library left, panels are set before any bar, the timeline controls offer split and loop, the transform inspector bar offers trim, the canvas bar sits at the bottom, and the dock lists video, audio and upload. VPL-U11: neither tree registers a custom component or adds a translation, both install one shortcut catalog, and the video tree turns captions on with every timeline track visible. VPL-U12 `initialize`: `resetEditor` first, then the editor compatibility version pinned to `CreativeEditorSDK.version`, every setup step reached, `editor.checkBrowserSupport` with `videoDecode: 'block'` and `videoEncode: 'warn'`, `ui.setView('advanced')` in the advanced tree only, and nothing at all without a `cesdk`. VPL-U13 the video tree registers only `exportDesign`, which defaults `videoBitrate` to `'Auto'` and lets the caller override it. VPL-U14 the advanced tree's six actions: the import picker narrows to `.imgly,.scene` or `.imgly,.zip` when a format is named, `exportVideo` is pinned to MP4, and `exportScene` picks the zip or the text path by format.

These exist because merged **function** coverage is decided by the Vitest lane alone, so no browser case can reach a `setup*` function.

### 5.5 Component cases (jsdom, editor mocked at the component boundary)

**VPL-C1 · The first mount**
`App` hands the instance to the role's init function and loads the scene from the URL, then auto-fits the page. It starts in Creator, so only the Creator configuration runs. It reports the demo phases `created` then `ready` and gives the editor `reportDemoLoadingState` as its loading-state handler.

**VPL-C2 · Switching role**
The kit saves the design to a string before it remounts and restores it on the new instance. Three failure and repeat paths: a snapshot that will not load falls back to the URL scene; a design that cannot be saved is dropped and the switch still happens; the snapshot is consumed once, so a second switch saves again.

**VPL-C3 · The entry point**
`src/index.tsx` names the user, takes the license and base URL from the environment, and mounts once. With no `#root` in the document it throws `Root container not found`.

**VPL-U15 · removed.** `resolveAssetPath` is gone; `src/imgly/demo-assets.ts` derives the URL from `VITE_DEMO_ASSETS_BASE_URL` or the kit's own URL.

**VPL-U16 · unit · Asset source registration is concurrent**
With an `addPlugin` that resolves only on demand, each role's init function issues the configuration plugin, waits for it, and then issues all fifteen asset-source plugins together. A sequential registration would stall after the first one.

### 5.6 The registered actions, and the coverage remainder

Neither role puts an Import or Export control in its navigation bar (VPL-10), so VPL-11 to VPL-14 reach the registered actions the way an integrator would, through `window.cesdk`.

**VPL-11 · Creator imports a scene**
`importScene` opens one picker and loads the file; the block count returns to what it was.

**VPL-12 · Creator exports video**
`exportVideo` asks the engine for `video/mp4` with `videoBitrate: 'Auto'`.

**VPL-13 · Adopter exports the design with no format named**
The engine is asked for `image/png`. Note: the handler sets `videoBitrate: 'Auto'` but the default export of this scene is an image, so the bitrate has no effect until the caller names a video format.

**VPL-14 · Adopter names a video format**
`exportDesign` with `mimeType: 'video/mp4'` carries the bounded bitrate through to the video export.

`npm run ci` reports 100 % lines, 100 % branches and 100 % functions in the Vitest lane and the same three figures in the merged report.

The residue this section carried in version 5 is gone. `merge-coverage.mjs` now sums every browser dump instead of keeping the alphabetically last one, so the `importScene` handler of `advanced-video-editor/actions.ts` and the `exportDesign` handler of `video-editor/actions.ts` are credited to VPL-11 to VPL-14, which run them. It also takes the line denominator from the Vitest statement map, so comment and blank lines no longer enter the report.

**KB-01 · unit · Keyboard catalog predicates**

`tests/unit/keyboard-catalog.test.ts` runs every `run` and `when` of `src/imgly/config/advanced-video-editor/keyboard/catalogs/us-ansi.ts`, `src/imgly/config/video-editor/keyboard/catalogs/us-ansi.ts` against 1620 editor states (5 edit modes, 9 selections, 3 roles, features on and off, 3 vector states, page and no page) and asserts that none throws, that every shortcut activates in at least one state, and that every function `run` reaches `cesdk.actions.run`. Kit-owned: the kit decides which key does what and when it is live. The catalog measures 100 % lines, branches and functions.

## 6. Entry and exit criteria

Entry: engine and editor built; test license available. All met: the scripts are the real commands, the harness has `spyExportVideo(page, { intercept })`, and its component lane covers VPL-U8.

Exit: every case in section 5 passes locally and in CI. `npm run ci` passes. The published kit contains no test files. A release run reports results to the Qase ids above.

## 7. Known issues found while writing this plan

Confirm each with a test before fixing.

1. The role snapshot silently falls back to the shipped scene. `handleRoleChange` wraps `saveToString()` in a `try`/`catch` that sets the snapshot to null, and `handleInit` wraps `scene.load(savedScene)` in a `try`/`catch` that reloads `sceneUrl`. Either failure discards the Creator's work with no message. VPL-06 covers the happy path; nothing today would notice the fallback firing.
2. The two init functions are 90 lines of copy-paste that differ in three statements. A plugin added to one and not the other changes what an Adopter sees without changing what a Creator sees.
3. **Fixed.** Both vendored configs are resynced with `@cesdk/core-configs-web`: the `video-editor` copy dropped `features/videoCaptionsEnabled` altogether (the ruler stays enabled in both copies, since both show every timeline track), and the `advanced-video-editor` copy's `importScene` takes the `format` parameter again. `cesdk.reapplyLegacyUserConfiguration()` stays in both copies, with the deprecation lint suppressed on that line as the package suppresses it.
4. `App.tsx` writes `(window as any).cesdk` with an `as any` cast while `src/index.tsx` and the sibling kits use the typed form.
5. The README title is "Video Editor Starter Kit", its Key Capabilities list is the generic video-editor one, and its Architecture tree describes `config/video-editor/` only as "Same structure as advanced-video-editor/" without saying which role uses which.
6. **Fixed.** `example.scene` stored absolute `cdn.img.ly/packages/imgly/cesdk-js/…/…` (pinned to 1.68.0) URIs for all seven Manrope faces — in the typeface object and in each text block's `font` field — plus `cdn.img.ly/assets/v4/emoji/NotoColorEmoji.ttf` as the scene's `defaultEmojiFontFileUri`. All of them now name the bundled pack relatively (`ly.img.typeface/fonts/Manrope/Manrope-*.woff2`, `emoji/NotoColorEmoji.ttf`), which is the same family and the same seven weights. The decoded scene contains no `cdn.img.ly` string at all, and the `cdnAllowlist` is gone.
7. `editorKey` remounts the whole editor on every role switch. That is the kit's chosen mechanism, but it means a role switch re-runs every `addPlugin` and re-downloads nothing only because the engine assets are cached. Worth a comment in the kit; a customer will copy it.

## 8. Open questions

1. Issue 1: surface the snapshot failure. Recommended: yes — at minimum log through the editor's notification API instead of swallowing it, since losing a Creator's edits without a message is the worst outcome this kit can produce.
2. **Resolved.** The harness gained a component lane; VPL-U8 runs there.
3. Issue 2: extract the shared plugin list into one function the two roles call. Recommended: yes, and make VPL-U3 assert the two calls are identical, which is cheaper than diffing 90 lines by eye.

## 9. Estimate

Measured: 10 browser cases in 55 s on one worker, 22 unit and component cases in 1.5 s. `npm run ci` takes about 1.5 minutes.

## 10. Boundary review

Rule used: the code that makes a decision owns the test for it. This kit decides which configuration each role gets, which theme, which engine role, which plugins, and how a scene survives a role switch. The editor decides what an `Adopter` may do and what the placeholder inspector shows. The engine decides what a placeholder flag means.

Core behaviour this plan leans on, and where it is covered today:

| Behaviour                                                                                          | Owner  | Covered by                                                                                                                                                     |
| -------------------------------------------------------------------------------------------------- | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Placeholder flags: enabled, behaviour, controls overlay and button, and their invalid-block errors | engine | `engine/lib/test/api/PlaceholderAPITest.cpp` — 18 tests covering every setter and getter                                                                       |
| Placeholder-enabled fills and shapes                                                               | engine | `engine/lib/test/api/ShapeFillPlaceholderAPITest.cpp`                                                                                                          |
| The placeholder inspector's section list, entry toggling and page-level status                     | editor | `apps/cesdk_web/packages/ui/components/Inspector/Placeholder/utils.test.ts`                                                                                    |
| The `ly.img.placeholder` feature predicate needs exactly one selected block of an allowed type     | editor | `apps/cesdk_web/packages/cesdk/registerDefaultFeaturePredicates.test.ts`                                                                                       |
| Role state, preview role and the engine role subscription                                          | editor | `apps/cesdk_web/packages/api/configuration/RoleSettings.test.ts`                                                                                               |
| `engine.editor.setRole` and the scopes it applies                                                  | engine | `engine/lib/test/api/EditorAPITest.cpp`, `engine/lib/test/api/ScopesAPITest.cpp`, `engine/lib/test/api/ScopeMatrixAPITest.cpp`                                 |
| `ui.setTheme` updates the theme and resolves `system` through `matchMedia`                         | editor | `apps/cesdk_web/packages/api/ui/UserInterfaceAPI.test.ts`                                                                                                      |
| `scene.saveToString` and `scene.load` round-trip a scene                                           | engine | `engine/lib/test/api/SceneAPITest.cpp`, `engine/lib/test/api/UBQSaveLoadCornerAPITest.cpp`, the frozen corpus in `engine/test/resources/serialization/scenes/` |
| `zoom.toPage` resolves the page and calls `scene.zoomToBlock`                                      | editor | `apps/cesdk_web/packages/cesdk/registerDefaultActions.test.ts`                                                                                                 |

Qase cases owned by the core suites, not by this kit — none. Every kit-behaviour case of this kit maps to a case in section 5, because each has a kit decision at its centre: which config, which theme, which role, which navigation bar. What the editor then does with that role is core, and the two gaps below are where this plan leans on untested core code.

Core coverage gaps found (candidates to add in the core suites, not in this kit):

1. `InspectorPanel.tsx` has no test. It owns the Design / Placeholder view toggle that Qase 4635 is about, gated on the `ly.img.placeholder` feature and the `ui/placeholder` scope, and it owns the role-keyed remount. `utils.test.ts` covers the placeholder maths below it and `registerDefaultFeaturePredicates.test.ts` covers the predicate beside it; nothing covers the switch itself. Suggested home: `apps/cesdk_web/packages/ui/components/panels/`.
2. Nothing asserts that the `Adopter` role disables the dock's asset library entries — the whole point of Qase 4637. `RoleSettings.test.ts` covers role state, not the gating it drives, and `assetLibraryDock.ts` has no role assertion. VPL-08 is the only check in this repository that an Adopter cannot add elements, and it checks it through a kit. Suggested home: `apps/cesdk_web/packages/cesdk/components/assetLibraryDock.test.ts`.
3. `PlaceholderSettings.tsx` renders the inspector's placeholder view; only its `utils.ts` is tested. Suggested home: `apps/cesdk_web/packages/ui/components/Inspector/Placeholder/`.
4. `@cesdk/core-configs-web` now has `src/editorConfigs.test.ts`, and this kit ships copies of two of its configs (known issue 3), so the new suite does not cover the copies. Raised in full in the video-editor plan.

Until gaps 1 and 2 are closed, VPL-03 and VPL-08 keep their UI assertions as the end-to-end proof.
