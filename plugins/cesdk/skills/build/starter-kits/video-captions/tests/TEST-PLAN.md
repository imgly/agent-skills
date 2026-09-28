# Test plan: starterkit-video-captions

Version 9, 7 Sep 2026. Status: implemented. 43 unit cases, 18 component cases and 14 browser cases run green in `npm run ci`, with no allowlist of any kind — known issue 10 is fixed in core. VCA-07 is dropped, see section 5.2. VCA-03b is merged into VCA-03, see section 5.1. The Vitest lane and the merged report are both at 100 % lines, branches and functions; see section 5.7.

## 1. Purpose

Verify that the Video Captions starter kit works as shipped: the four demo options each open the editor they promise with the right scene and the caption panel already open, the autocaption plugin is wired to the configured proxy, and closing an editor returns to the option list.

## 2. Scope

In scope

- `src/app/App.tsx`: the four mode cards, the mode state, which init function and which scene each mode uses, the playback-time reset, the caption panel opening, the pre-captioned selection, the Close entry and the overlay dismissal, the SRT download button
- `src/imgly/index.ts`: the four init functions — which config plugin, which asset-source plugins, and that only the autocaption mode adds the autocaption plugin
- `src/imgly/plugins/auto-caption.ts`: the proxy URL the kit reads and the provider it constructs
- `src/imgly/config/**`: the kit's own copy of the video-editor configuration
- `src/index.tsx`: the engine config and the `window.cesdk` hook

Out of scope

- Caption editing itself: adding, splitting, merging, styling, resizing, moving and trimming captions, and importing an SRT or VTT file. Editor behaviour, see section 10.
- The autocaption plugin's own UI and transcription: the checkbox groups, Select All, the Generate and Cancel buttons, the notifications, the SRT conversion and the fal.ai provider. Plugin behaviour, owned by `apps/cesdk_web_plugins/packages/plugin-autocaption-web`, see section 10.
- The demo site around the kit (cards, tags, links, platform toggles, documentation and GitHub links). Covered by the `cesdk_web_demos` suite. Qase 3842, 3843, 3844, 3845, 3846, 3847, 3851 and 3854.

## 3. Test environment

- Browser: Chrome, headless, 1400 × 900
- Engine and editor: built from this repo, served locally. Requests to `cdn.img.ly` fail the test.
- License: the shared test license (valid on hostname `localhost` only)
- Data: `${DEMO_ASSETS_BASE_URL}` on `staticimgly.com`, which the network guard allows: the four preview images, `autocaption/scene.scene`, `captions/scene.scene`, `captions-pre-captioned/scene.scene` and `captions.srt`
- **React gate.** The editor mounts only after a mode card is clicked, so the `kit` fixture — which waits for an editor at `/` — times out. Every browser case takes `{ page }` and calls `openMode()` from `tests/e2e/modes.ts`, which deletes `window.cesdk`, clicks the card and waits. Deleting the global matters: after a Close the disposed instance is still published, and `waitForEditorReady` would return against it. The `key={editorMode}` on `CreativeEditor` also means a new instance per mode, so the handle is re-acquired after every mode change.
- **No live fal.ai traffic.** Verified in both serving shapes: the same VCA-06 passes with `VITE_AUTOCAPTION_PROXY_URL` set to the same-origin `/__fal` path (dev) and to the baked `https://proxy.img.ly/api/proxy/falai` (what a static bundle carries), so the cross-origin CORS preflight the `x-fal-target-url` header triggers is answered too. `tests/e2e/fal-mock.ts` installs `page.route` on the proxy URL and answers from fixtures. The kit's own `tests/playwright.config.ts` passes `VITE_AUTOCAPTION_PROXY_URL=http://localhost:<port>/__fal` to the dev server, so the mock is same-origin; the route also matches `proxy.img.ly`, the built-in default a static bundle carries, and answers `OPTIONS` with CORS headers for that case. The contract is confirmed against `@fal-ai/client` in this repository: a `POST` to the proxy with `x-fal-target-url: https://rest.alpha.fal.ai/storage/upload/initiate?storage_type=fal-cdn-v3` answered with `{ upload_url, file_url }`, a direct `PUT` of the audio to `upload_url`, then a `POST` to the proxy with `x-fal-target-url: https://fal.run/fal-ai/elevenlabs/speech-to-text/scribe-v2` answered with `{ text, language_code, language_probability, words }`.
- Unit cases stub `@cesdk/cesdk-js/plugins`, `@imgly/plugin-autocaption-web` and its `fal-ai` entry with classes and functions that capture their arguments, then drive the four init functions and the `setup*` functions with a `createApiSpy()`. No DOM, no engine.

## 4. Approach

| Kind      | Tool                          | What it checks                                    | Run                 |
| --------- | ----------------------------- | ------------------------------------------------- | ------------------- |
| Static    | tsc, eslint, convention check | Types, deprecated APIs, kit folder shape          | `npm run check:all` |
| Unit      | Vitest                        | Per-mode wiring, the proxy URL, the configuration | `npm run test:unit` |
| Component | Vitest + jsdom + RTL          | The mode card table, the editor configuration     | `npm run test:unit` |
| Browser   | Playwright                    | The test cases in section 5                       | `npm run test:e2e`  |

All four run in the kit's `ci` script. Browser tests use role and label locators only. There are no headless cases: everything the kit decides needs either an editor or nothing at all.

## 5. Test cases

Format: ID, level, Qase id, title. Then steps and expected result.
Common precondition for all browser cases: the kit is open at `/` and the four mode cards are on the page.

### 5.1 The demo option list

**VCA-01 · browser · Qase 3856 · Four demo options are offered**
Steps: open the kit.
Expected: four cards — AI Auto Captions, Blank Video Editor, Caption Import, Pre-captioned Video — each with its preview image, its description and an Open Editor button. The Caption Import card additionally has a Download .srt File button. No console errors. No request to `cdn.img.ly`.

**VCA-02 · browser · Qase 3858 · The sample SRT can be downloaded**
Steps: click Download .srt File.
Expected: a download named `captions.srt` arrives.
_Run note: known issue 1 reproduces once the demo data is materialized. The local CDN maps `.srt` to `text/plain`, which Chrome renders inline, so no download event fires. The case passes while the file stays an unmaterialized LFS pointer, because the CDN then proxies to `staticimgly.com`, which sends `application/x-subrip`. The cross-origin `download` attribute is ignored in both modes, so a pass depends on the served content type, not on the kit._

**VCA-03 · browser · Close and overlay both return to the option list**
Steps: open any mode, click Close in the navigation bar, reopen the same mode, then dismiss the reopened editor by clicking the overlay outside it.
Expected: the four cards come back after each dismissal, the reopened editor mounts a fresh single-page scene with the caption panel on screen, and nothing is thrown.
_Run note: **VCA-03b is folded into this case.** Two facts from the runs forced the merge. First, the plan's claim that dismissing the **first** editor is clean was a timing accident: Close reproduces the same page error as the overlay. Second, split across two cases the Close-only variant was a coin flip, because the preceding cases change how far the boot scroll animation has run. Merged, the case keeps every assertion both cases made. The `Engine has been disposed.` page error the merge was written around is fixed in core; the case now runs with no allowlist. See known issue 10._

### 5.2 AI Auto Captions

**VCA-04 · browser · Qase 4444, 4445 · The mode opens the sample video with no captions**
Steps: open AI Auto Captions.
Expected: the mode's scene is loaded, the page's playback time is 0, `engine.block.findByType('captionTrack')` is empty, and the `//ly.img.panel/inspector/caption` region is on screen with the heading "Add Captions".
_Run note: `cesdk.ui.isPanelOpen` returns false for open sub-panels, so every panel case asserts the rendered region._

**VCA-05 · browser · Qase 4446 · Generate Automatically is offered at the top of the create view**
Steps: read the caption panel.
Expected: the plugin's Generate Automatically button is the first entry, before the panel's own create and import entries. The kit's only decision here is adding the plugin; the button and its placement are the plugin's.

**VCA-06 · browser · Qase 4451 · Generating captions with the mocked provider adds a caption track**
Steps: mock the proxy, click Generate Automatically, leave every checkbox selected, click Generate Captions.
Expected: the mock answers the fal storage initiate, the upload PUT and the model run; a caption track appears holding the fixture's cue text; the panel switches to its edit view. This is the kit's one end-to-end proof that the plugin is wired to a working provider.
_Run note: the case deselects every media entry and re-selects Voiceover only, so one audio export and one transcription run instead of four._

**VCA-07 · dropped.** A provider failure surfacing as a notification is the plugin's behaviour, not the kit's; the plugin package now carries its own tests. Qase 4454 moves to the plugin-owned table in section 10.

### 5.3 Blank Video Editor

**VCA-08 · browser · Qase 3857, 4378 · The mode opens an empty 1280 × 720 scene**
Steps: open Blank Video Editor.
Expected: a scene created by `scene.create` with one page of 1280 × 720 px, no video and no caption track, the caption panel on screen, and an Export Video button in the navigation bar — the kit sets `actions.export.video` for this mode only.

**VCA-09 · browser · Qase 4377 · Export passes the kit's options**
Steps: install the export spy in intercept mode, open the actions menu, click Export Video.
Expected: one `engine.block.exportVideo` call on the current page with `mimeType: 'video/mp4'` and `videoBitrate: 'Auto'` and no size or frame-rate override. The encode itself does not run — see known issue 6.
_Run note: the recorded options also carry an `abortSignal`, which the editor adds._

**VCA-10 · browser · Qase 4376 · Close does not export**
Steps: click Close with the export spy installed.
Expected: no `exportVideo` call, and the option list is back.

### 5.4 Caption Import

**VCA-11 · browser · Qase 3859 · The mode opens the sample video with no captions**
Steps: open Caption Import.
Expected: `captions/scene.scene` is loaded, the page's playback time is 0, there is video content, `findByType('captionTrack')` is empty, and the caption panel is on screen with its Import File entry.

**VCA-12 · browser · Qase 4382 · Export passes the kit's options**
Same as VCA-09 in this mode.

**VCA-13 · browser · Qase 4381 · Close does not export**
Same as VCA-10 in this mode.

### 5.5 Pre-captioned Video

**VCA-14 · browser · Qase 3860 · The mode opens a video that already has captions, with the first one selected**
Steps: open Pre-captioned Video.
Expected: `captions-pre-captioned/scene.scene` is loaded, the page's playback time is 0, exactly one caption track exists with children, and exactly one block is selected: the track's first child. The kit deselects everything else first.

**VCA-15 · browser · Qase 3862 · The panel opens in its edit view because captions exist**
Steps: read the caption panel.
Expected: the panel shows its Content / Style tabs rather than the create view, and offers no Import File entry. Which view the panel picks is editor behaviour; the kit's decision is loading a scene that already has a caption track and selecting into it.

### 5.6 Unit cases (no browser, no engine)

Subject: `src/imgly/index.ts`, `src/imgly/plugins/auto-caption.ts`, `src/imgly/config/**` and the mode table in `src/app/App.tsx`, driven with `createApiSpy()`.

**VCA-U1 · unit · Each mode adds the same fifteen asset-source plugins after the config plugin**
All four init functions call `addPlugin` with the kit's `VideoEditorConfig` first, then the same fifteen asset sources with the same options, in the same order. The four functions are copy-paste — see known issue 2 — and this is what stops them drifting.

**VCA-U2 · unit · Only the autocaption mode adds the autocaption plugin**
`initVideoCaptionsAutocaptionEditor` ends with `createAutocaptionPlugin()`; the blank, import and pre-captioned functions do not add it.

**VCA-U3 · unit · Include globs**
`UploadAssetSources` gets the three upload ids. `DemoAssetSources` gets `ly.img.templates.video.*`, `ly.img.image.*`, `ly.img.audio.*`, `ly.img.video.*`. `PagePresetsAssetSource` gets exactly the eight platform globs. No `PremiumTemplatesAssetSource` and no background-removal plugin.

**VCA-U4 · unit · The provider reads the configured proxy URL**
With `VITE_AUTOCAPTION_PROXY_URL` set, `createAutocaptionPlugin()` constructs `ElevenLabsScribeV2` with that value; with it unset the kit falls back to `https://proxy.img.ly/api/proxy/falai`. Both branches are asserted. The fallback used to sit in a `//START_HIDDEN_BLOCK` that the publish script strips; this wave moved it out, so the published kit keeps it. Known issue 3 is fixed.

**VCA-U5 · component · The mode table**
`CAPTION_MODES` is not exported, so the case renders `<App>` in jsdom with `src/imgly` and `@cesdk/cesdk-js/react` stubbed: four cards in the order autocaption, blank, import, pre-captioned, each with its preview image under `${DEMO_ASSETS_BASE_URL}/assets/`, four Open Editor buttons and one Download .srt File button.

**VCA-U6 · unit · Features and settings**
`setupFeatures` enables captions, the timeline clip track, the timeline ruler, text editing and keyboard shortcuts and disables nothing; every id is a leaf, so the list names no umbrella group whose children it also enables and a CE.SDK upgrade that adds a child cannot enable it behind the kit's back; `setupSettings` writes `timeline/trackVisibility` `all`. Known issue 5 is fixed.

**VCA-U7 · unit · The navigation bar**
`setupNavigationBar` ends the component order with an `ly.img.actions.navigationBar` entry whose only child is `ly.img.exportVideo.navigationBar`. Nothing inserts a Close entry: `App.tsx` does that per mode, at the start of the bar.

**VCA-U8 · component · The editor configuration**
`editorConfig` sets a `userId` and `featureFlags.archiveSceneEnabled: true`. `src/index.tsx` mounts React at import time, so the case runs in jsdom with `react-dom/client` and `./app/App` stubbed; `baseURL` comes from the env and is not asserted. The flag is dead in this kit — see known issue 4.

**VCA-U10 to VCA-U13 · unit · The editor configuration**
Each `setup*` module against a recording spy, asserting what the kit decides rather than what CE.SDK then does. VCA-U10 `setupUI`: panels left and docked and set before any bar, the caption control in the transform inspector bar, separate Trim and Crop bars, the canvas bar at the bottom, split and loop in the timeline controls, the video asset libraries in the dock, and no custom component. VCA-U11 `setupActions`: `exportDesign` is the only override, and its handler defaults `videoBitrate` to `'Auto'` while letting the caller override it. VCA-U12 one shortcut catalog and no kit translation. VCA-U13 `VideoEditorConfig.initialize`: `resetEditor` first, then the editor compatibility version pinned to `CreativeEditorSDK.version`, every setup step reached, `editor.checkBrowserSupport` with `videoDecode: 'block'` and `videoEncode: 'warn'`, and nothing at all without a `cesdk`.

These exist because merged **function** coverage is decided by the Vitest lane alone, so no browser case can reach a `setup*` function.

**VCA-U14 · component · Opening and closing an editor**
`App` with the editor component reduced to a stub that hands the kit's `init` back to the test, and a concrete fake `cesdk`. Each of the four modes runs its own `init*` function, loads its own scene under `assets/<mode>/scene.scene` (the blank mode creates a 1280 x 720 scene instead and adds the Export Video label), resets the playback time when the scene has a current page and skips it when it does not, opens the caption inspector, and publishes the instance on `window.cesdk`. The pre-captioned mode clears the current selection and selects the first caption, and leaves the selection alone when the caption track is empty. The Close control the kit inserts at the start of the navigation bar returns to the option list, asserted for all four modes. The mounted shell reports the demo phase `shell`, opening a mode reports `created` then `ready`, and the editor gets `reportDemoLoadingState` as its loading-state handler.

**VCA-U15 · component · The overlay and the SRT download**
A click on the overlay itself closes the editor; a click inside the editor wrapper does not. The SRT button builds a link to `assets/captions.srt` with the `captions.srt` filename and clicks it, without putting the link in the document.

**VCA-U16 · unit · Asset source registration is concurrent**
With an `addPlugin` that resolves only on demand, each of the four init functions issues the configuration plugin, waits for it, and then issues all fifteen asset-source plugins together. A sequential registration would stall after the first one.

### 5.7 Coverage remainder

`npm run ci` reports 100 % lines, 100 % branches and 100 % functions in the Vitest lane and the same three figures in the merged report.

The residue this section carried in version 8 is gone. `merge-coverage.mjs` now sums every browser dump instead of keeping the alphabetically last one, so the autocaption, blank and import branches of `src/app/App.tsx` and the `exportDesign` handler of `src/imgly/config/actions.ts` are credited to VCA-04 to VCA-13, which run them. It also takes the line denominator from the Vitest statement map, so comment and blank lines no longer enter the report. Nothing here was a dead-code or unreachable-branch remainder.

**KB-01 · unit · Keyboard catalog predicates**

`tests/unit/keyboard-catalog.test.ts` runs every `run` and `when` of `src/imgly/config/keyboard/catalogs/us-ansi.ts` against 1620 editor states (5 edit modes, 9 selections, 3 roles, features on and off, 3 vector states, page and no page) and asserts that none throws, that every shortcut activates in at least one state, and that every function `run` reaches `cesdk.actions.run`. Kit-owned: the kit decides which key does what and when it is live. The catalog measures 100 % lines, branches and functions.

## 6. Entry and exit criteria

Entry: all met. The scripts are the real commands, `npm run check:format` passes, and the harness has everything the plan asked for:

1. `spyExportVideo(page, { intercept })`. It installs once per page, so each export case opens exactly one mode.
2. A fal.ai proxy mock. It lives in the kit at `tests/e2e/fal-mock.ts` rather than in the harness, because only this kit needs it. The contract, read from `@fal-ai/client` in this repository: every request goes to the proxy URL with the real destination in an `x-fal-target-url` header. `storage.upload` first POSTs with `x-fal-target-url: https://rest.alpha.fal.ai/storage/upload/initiate?storage_type=fal-cdn-v3` and expects `{ upload_url, file_url }`; it then PUTs the file to `upload_url`, which the mock also owns. `client.run` then POSTs with `x-fal-target-url: https://fal.run/fal-ai/elevenlabs/speech-to-text/scribe-v2` and expects `{ text, language_code, language_probability, words }`. Files under 10 MB take the single-part path, which the kit's short clips do.
3. The `env` passthrough in `defineKitPlaywrightConfig`, which the kit's config uses to set `VITE_AUTOCAPTION_PROXY_URL` for the dev-server mode, so the mock is same-origin and the built-in proxy host is never reached.

Exit: every case in section 5 passes locally and in CI. `npm run ci` passes. No test contacts fal.ai or `proxy.img.ly`. The published kit contains no test files. A release run reports results to the Qase ids above.

## 7. Known issues found while writing this plan

Confirm each with a test before fixing.

1. `handleDownloadSrt` builds an anchor with a cross-origin `href` and a `download` attribute. Browsers ignore `download` on a cross-origin URL, so the click navigates away from the kit instead of downloading, unless the demo host sends `Content-Disposition`. Qase 3858 is the case that would catch it.
2. The four init functions are 60 lines of copy-paste each, differing in one statement: the autocaption one adds one more plugin. A plugin added to one and not the others changes one mode silently.
3. **Fixed.** `VITE_AUTOCAPTION_PROXY_URL` was documented nowhere and its default lived in a `//START_HIDDEN_BLOCK` that the publish script strips, so a published kit got `proxyUrl: ''`. The fallback is now a plain `const` in `src/imgly/plugins/auto-caption.ts`, and the variable is documented in `.env.example` and in a README section that says the demo proxy is rate limited and not for production.
4. `featureFlags: { archiveSceneEnabled: true }` in `editorConfig` is dead. It is read only by `migrateActionsToNavigationOrder`, which runs on the legacy `ui.elements.navigation.action.export` path; this kit configures neither `ui.elements` nor callbacks.
5. **Fixed.** The `'features/videoCaptionsEnabled'` line is gone: the setting is internal, and `resetEditor()` no longer switches captions off. The ruler stays enabled because the kit shows every timeline track; a feature that should be off is left commented out, never enabled and then disabled. VCA-U6 pins both.
6. A real MP4 export is not planned as a case. The three demo scenes live on the demo CDN, so their durations cannot be read from this repository, and the budget for a real export is about 30 s. The blank mode is the cheapest candidate — an empty 1280 × 720 scene with one caption — so measure that in S4 and add one real export there if it fits.
7. **Fixed** before this wave started: `npm run check:format` passes.
8. The README title is "Video Editor Starter Kit", its Key Capabilities list is the generic video-editor one, and its Troubleshooting table has no row for a failing autocaption proxy. Its Demo Assets section points at `src/app/App.tsx` for the base URL, which is correct, but the Architecture tree omits `config/keyboard/`.
9. `App.tsx` repeats the same six-line `insertOrderComponent` Close block four times, once per mode, inside a `switch` whose four arms are otherwise near-identical.
10. ~~**Unmounting the editor while its boot scroll animation is still in flight logs `Engine has been disposed.`**~~ **Fixed in core, in three places.** Any unmount — Close or the overlay — raised `Cannot read properties of null (reading 'setPositionX')` and `Engine has been disposed.`; every frame of both stacks was in `apps/cesdk_web`, the engine bundle or React, none in this kit. `registerDefaultActions.ts` now stops the camera animation once `engine.block` is null; `EngineActions.dispose()` marks its own rejection handled; and `ActionsAPI.run` returns the engine promise instead of re-wrapping it, so awaiting it no longer creates a second promise that rejects unobserved. The kit's `consoleErrorAllowlist` is deleted and VCA-03 passes on its own assertions.

## 8. Open questions

1. **Resolved.** Done as recommended, plus the fallback moved out of the hidden block so the published kit works.
2. **Resolved, narrower than recommended.** VCA-06 is the only case that mocks fal.ai; VCA-07 was dropped as plugin behaviour.
3. Should the four init functions be collapsed into one with a flag (issue 2)? Recommended: yes, and let VCA-U1 assert the four calls are identical — but that is a source change and this plan does not own `src/`.

## 9. Estimate

Measured: 14 browser cases in 1 minute on one worker, 25 unit and component cases in 1.6 s. `npm run ci` takes about 1.5 minutes.

## 10. Boundary review

Rule used: the code that makes a decision owns the test for it. This kit decides the four modes, which scene and which init function each uses, which plugins each adds, the proxy URL for the transcription provider, when the caption panel opens, and which caption is selected in the pre-captioned mode. The **plugin** decides the auto-generate view: its checkboxes, its Select All, its Generate and Cancel buttons, its notifications. The **editor** decides the caption panel: adding, importing, styling, timing. The **engine** decides what a caption block is.

This kit has 48 Qase cases, more than any other in the batch, and most of them are not the kit's. The three tables below place every one of them.

### Kit-owned (mapped to a case in section 5)

3856 → VCA-01. 3858 → VCA-02. 4444, 4445 → VCA-04. 4446 → VCA-05. 4451 → VCA-06. 3857, 4378 → VCA-08. 4377 → VCA-09. 4376 → VCA-10. 3859 → VCA-11. 4382 → VCA-12. 4381 → VCA-13. 3860 → VCA-14. 3862 → VCA-15.

### Plugin-owned — `apps/cesdk_web_plugins/packages/plugin-autocaption-web`

| Qase       | Title                                                          | Covered?                                                                                                                                                              |
| ---------- | -------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 4447, 4450 | Checkboxes default to selected; audio and video are grouped    | **No.** `src/plugin.ts` registers `ly.img.autocaption.audioCheckboxes` and `…videoCheckboxes` and derives the default from `isMuted`. It has no test file. Gap 1      |
| 4452, 4449 | Select All / Deselect All toggles; Generate becomes disabled   | **No.** Same file, `ly.img.autocaption.header` and `…actions`. Gap 1                                                                                                  |
| 4453       | Cancel returns to the Add Captions view                        | **No.** Same file, the `cancelGenerate` button aborts and sets the view back to `create`. Gap 1                                                                       |
| 4454       | A provider failure surfaces as a notification                  | Plugin-owned. VCA-07 was dropped for this reason; the plugin's own suite is the right home                                                                            |
| 4458       | Generate Automatically works again after deleting all captions | **No.** Same file. Gap 1                                                                                                                                              |
| 4463       | Selecting only Voiceover gives different captions than Answer  | **Partly.** `src/__tests__/autocaptionService.test.ts` covers per-block transcription, offset shifting and ordering; which words a real model returns is not testable |
| 4461       | The generated text matches the audio                           | **Not automatable.** A human judgement about a real transcription. Say so in Qase rather than leaving it "to be automated"                                            |

The plugin's transcription path **is** well covered and this plan cites it rather than repeating it: `src/__tests__/wordsToSrt.test.ts` (SRT structure, timestamps, line breaking, empty and no-speech inputs), `src/__tests__/ElevenLabsScribeV2.test.ts` (upload, model id, input mapping, abort, error propagation) and `src/__tests__/autocaptionService.test.ts` (per-block export and transcription, caption-track creation, timing offsets, mixed success and no-speech).

### Editor-owned — `apps/cesdk_web`

| Qase                   | Title                                      | Covered?                                                                                                                                                                                                              |
| ---------------------- | ------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 4639, 4374, 4379, 3864 | Captions can be added manually             | **Yes.** `apps/cesdk_web/packages/ui/components/panels/CaptionPanel/utils.test.ts` `addCaption` — duplicating after the current caption, filling the gap before the next sibling, creating the track when none exists |
| 4640, 4375, 4380, 4383 | An `.srt` or `.vtt` file can be imported   | **No.** `CaptionPanelImport.tsx` calls `engine.block.createCaptionsFromURI` and has no test. Gap 2                                                                                                                    |
| 4456, 3891             | Caption timing can be changed and trimmed  | **Yes.** `apps/cesdk_web/packages/ui/design-system/components/CaptionDragBounds/adjustTrack.test.ts` — trim start, trim end, clamping to siblings, move                                                               |
| 3890                   | Captions can be moved on the timeline      | **Yes.** Same file, the `moving` cases                                                                                                                                                                                |
| 4460                   | Generated captions can be edited           | **Partly.** `CaptionInput.test.tsx` covers the input; `utils.test.ts` covers merge and split. Nothing covers the row in context                                                                                       |
| 3876, 3881             | Caption style and style colours can change | **Partly.** `utils.test.ts` `setDefaultStyling` covers applying the preset source; `CaptionPresetLibrary.tsx` has no test. Gap 3                                                                                      |
| 3877                   | Captions can be resized on canvas          | **No.** Generic block resizing, engine-covered (`engine/lib/test/api/BlockLayoutTest.cpp`); the caption-specific constraint has no test                                                                               |
| 4642                   | A video with captions exports as expected  | **No.** Nothing renders a caption into an export. Gap 4                                                                                                                                                               |

Core behaviour this plan leans on beyond the tables:

| Behaviour                                                                                               | Owner  | Covered by                                                                                                                                 |
| ------------------------------------------------------------------------------------------------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `createCaptionsFromURI` parses SRT and VTT, and rejects bad mime types, empty data and broken encodings | engine | `engine/lib/test/api/UBQCaptionsFromURIAPITest.cpp` — eight cases including UTF-16 BOM handling                                            |
| `exportAudio` on a block produces an AAC buffer                                                         | engine | `engine/lib/test/api/ExportAPITest.cpp` `ExportAudioToBuffer`, `CodecAPITest.cpp` `exportAudioToBufferEndToEnd`                            |
| The caption panel's create, edit and style view orders                                                  | editor | `apps/cesdk_web/packages/api/ui/captionPanelOrderDefaults.test.ts`, `apps/cesdk_web/packages/cesdk/registerCaptionPanelComponents.test.ts` |
| Caption blocks can be created after `resetEditor()`                                                     | editor | `apps/cesdk_web/packages/cesdk/resetEditor.test.ts` — the reset leaves `features/videoCaptionsEnabled` at the engine default               |
| `timeline/trackVisibility` is intercepted and drives the timeline store                                 | editor | `apps/cesdk_web/packages/cesdk/make_EditorAPI_setSetting.test.ts`                                                                          |
| `cesdk.utils.export` with a video mime type calls `engine.block.exportVideo`                            | editor | `apps/cesdk_web/packages/api/utils/UtilsAPI.test.ts` "export (video path)"                                                                 |
| Loading a scene archive                                                                                 | engine | `engine/lib/test/api/ArchiveRoundTripAPITest.cpp`, `ArchivalDeepRoundTripAPITest.cpp`                                                      |

Core coverage gaps found (candidates to add in the core suites, not in this kit):

1. **`plugin-autocaption-web/src/plugin.ts` has no test at all.** 506 lines registering six components, the selection state, the mute filtering, the block labelling, the abort handling and the notifications — and eight Qase cases (4447, 4449, 4450, 4452, 4453, 4458) that are about nothing else. The package already has a `vitest.config.ts` and three test files beside it, so the cost is low. Suggested home: `apps/cesdk_web_plugins/packages/plugin-autocaption-web/src/__tests__/plugin.test.ts`.
2. **`CaptionPanelImport.tsx` has no test.** Four Qase cases (4640, 4375, 4380, 4383) are about importing an SRT or VTT file, and this is the only code between the file input and `createCaptionsFromURI`. The engine side is fully covered. Suggested home: `apps/cesdk_web/packages/ui/components/panels/CaptionPanel/`.
3. **`CaptionPresetLibrary.tsx` and `CaptionRow.tsx` have no tests**, so caption styling (3876, 3881) and the row in context (4460) rest on `utils.test.ts` alone. Suggested home: the same directory.
4. **Nothing exports a scene containing captions.** Qase 4642 is the last mile of this whole kit, and no test at any layer renders a caption into an image or a video. Suggested home: `engine/lib/test/api/ExportAPITest.cpp`, a static export of one frame of a page with a caption track — cheaper and more portable than a video export, and it fails for the same reasons.
5. `@cesdk/core-configs-web` now has `src/editorConfigs.test.ts`, and this kit ships a copy of one of its configs (known issue 5), so the new suite does not cover the copy. Raised in full in the video-editor plan.

Until gap 1 is closed, VCA-05, VCA-06 and VCA-07 are the only checks in this repository that the autocaption view works at all — through a kit, which is exactly the wrong place for them.
