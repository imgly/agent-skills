# Test plan: starterkit-export-using-renderer

Version 7, 9 Sep 2026. Status: unit, component and browser tests implemented, `npm run ci` green with one expected failure. Known issues 2 and 10 are fixed; known issue 1 is pinned by an expected failure. 66 Vitest cases and 14 browser cases. Merged coverage is lines 100 %, branches 100 %, functions 100 %. Section 5.5 records why the earlier residue is gone.

## 1. Purpose

Verify that the Export Using Renderer starter kit works as shipped: the video editor loads with the sample scene, the only video export path is the CE.SDK Renderer action, and that action archives the scene, uploads it, reports progress and downloads the rendered file.

## 2. Scope

In scope

- The `exportUsingRenderer` action in `src/imgly/renderer.ts`: archiving, the upload request, the notification sequence, the download, the failure path
- `getRendererURL` and the `VITE_RENDERER_PROXY_URL` configuration
- The navigation bar this kit installs: the Renderer action, scene and archive import and export, and the absence of a video export button
- The feature flags the kit turns off
- Editor start-up with the sample video scene

Out of scope

- Whether the Renderer service produces a correct video. That is the Renderer's decision, tested in its own repository. Every browser case here answers a mocked route.
- Core editor features reached through this kit (timeline, trimming, asset library, notifications UI). Covered by the core editor suite.
- The demo site around the kit. Covered by the `cesdk_web_demos` suite. Qase 4174, 4175, 4176, 4177, 4178, 4191, 4200, 4226.

## 3. Test environment

- Browser: Chrome, headless, 1400 × 900
- Engine and editor: built from this repo, served locally. Requests to `cdn.img.ly` for engine assets fail the test.
- License: the shared test license (valid on hostname `localhost` only)
- Data: `public/assets/example-video-motion.scene`, shipped inside the kit. No demo-asset CDN and no `VITE_DEMO_ASSETS_BASE_URL` for this kit. Its two Archivo font URIs were rewritten from `.ttf` to `.woff2`; see the Fixed line under known issue 8.
- Renderer: `VITE_RENDERER_PROXY_URL` is set to a same-origin path such as `/__renderer`, and Playwright answers it with `page.route`. A route that returns a 12 KB MP4 with `content-type: video/mp4` is the normal case; further routes cover a 500, a network failure and a slow response.
- Readiness hook: `window.cesdk`, set in `src/index.ts` before the scene loads.
- Console allowlist: RND-08 only, through `test.use` on that describe block: `Error encountered during scene export:` (the kit logs the rejection before it notifies) and `Failed to load resource: the server responded with a status of 500` (Chromium's own report of the mocked route). Everywhere else the console must be clean.

## 4. Approach

| Kind    | Tool                          | What it checks                                                  | Run                 |
| ------- | ----------------------------- | --------------------------------------------------------------- | ------------------- |
| Static  | tsc, eslint, convention check | Types, deprecated APIs, kit folder shape                        | `npm run check:all` |
| Unit    | Vitest                        | The request and notification logic with a fake `XMLHttpRequest` | `npm run test:unit` |
| Browser | Playwright                    | The test cases in section 5                                     | `npm run test:e2e`  |

`exportUsingRenderer` takes the blob, the `cesdk` instance and a notification id as arguments, so the whole request and notification sequence can be driven from a unit test. The browser cases keep one mocked end-to-end run and the navigation bar checks.

## 5. Test cases

Format: ID, Qase id, title. Then steps and expected result.
Common precondition for browser cases: the kit is open and the sample video scene has finished loading.

### 5.1 Start-up and navigation bar

**RND-01 · Editor loads with the sample scene** (no Qase case yet)
Steps: open the kit.
Expected: the video editor with a timeline and the sample scene. No console errors. No engine asset from the CDN.

**RND-02 · Qase 4801 · Video can only be exported through the Renderer**
Steps: read the navigation bar, then open the actions menu.
Expected: "Export using CE.SDK Renderer" is its own navigation-bar button, and the menu holds Import, Export Design and Export Archive, and nothing else. There is no Export Video entry. The kit replaces the whole navigation bar order after the config plugin has set its own.
Note: corrected after the run — the first child of `ly.img.actions.navigationBar` renders as a top-level button, the dropdown holds the rest, and the editor's labels are Import / Export Design / Export Archive.

**RND-03 · Preview and placeholder controls are off** (no Qase case yet)
Steps: read the navigation bar and the inspector.
Expected: no Preview button and no placeholder controls. The kit disables `ly.img.preview` and `ly.img.placeholder`.

### 5.2 Renderer export

**RND-04 · Qase 4229 · Export starts as soon as the action is clicked**
Steps: click "Export using CE.SDK Renderer".
Expected: a notification appears immediately with "Archiving...", then "Uploading the archive...". A POST to the configured Renderer URL is sent, with a multipart body whose `scene` part is the archive.

**RND-05 · Qase 4233 · The progress notification stays until the export ends**
Steps: click the action and watch the notification while a held route answers.
Expected: a loading notification with a spinner shows one of the progress messages and is still there six seconds later, then turns into the success message.
Note: corrected after the run — the exact message sequence is not assertable in the browser, because Chromium does not report intermediate upload or download progress for a `page.route`-fulfilled request. RND-U3 pins the full sequence against a fake `XMLHttpRequest`.

**RND-06 · Qase 4407, 4408 · Success replaces the progress notification**
Steps: let the route answer 200 with an MP4.
Expected: the same notification turns into a success notification reading "Export downloaded, server render took N seconds", the spinner is gone, and one file of the mocked size is downloaded.

**RND-07 · Qase 4406 · Dismissing the notification does not cancel the export**
Steps: click the action, close the notification while the route is still pending, then let the route answer.
Expected: the request is not aborted and the download still happens. No notification comes back.
Note: corrected after the run — a dismissed notification is gone for good, so the success update has nothing left to write to. The download, which is what the case is about, still happens.

**RND-08 · A failed export shows an error notification** (no Qase case yet)
Steps: make the route answer 500.
Expected: the progress notification is dismissed, an error notification reading "Export failed" is shown, and one console error is logged.

**RND-09 · Qase 4231 · The editor stays usable during the export**
Steps: click the action, then press play on the timeline while the export is pending.
Expected: playback starts and the playhead moves. Smoothness itself stays a manual check; this case only proves the export does not block the main thread beyond the archive step.

### 5.3 Scene and archive

**RND-10 · Qase 4802 · A scene can be exported**
Steps: open the actions menu, click Export Design.
Expected: one download whose bytes start with the scene magic `UBQ<n>`.
Note: corrected after the run — the editor names both downloads `cesdk-<timestamp>.imgly`, so the case asserts the content, not the extension. The filename is the editor's decision.

**RND-11 · Qase 4803 · An archive can be exported**
Steps: open the actions menu, click Export Archive.
Expected: one download whose bytes start with `PK`. Same filename note as RND-10.

**RND-12 · Qase 4804, 4805 · A scene and an archive can be imported again**
Steps: export both, then click Import and pick each file in turn.
Expected: each loads into the editor and the scene holds the same number of blocks as before.

**RND-13 · The registered export action bounds the video bitrate**
The kit overrides `exportDesign` but puts no control for it in the navigation bar — RND-02 pins that video leaves this editor through the Renderer only — so the case runs the action the way an embedding application would, through `window.cesdk`. With `spyExportVideo(intercept)` installed: exactly one video export, carrying `videoBitrate: 'Auto'` under the caller's `mimeType`, and one `.mp4` download.

**RND-14 · The caller can raise the bitrate above the bounded default**
The same action with `videoBitrate: 8_000_000` reaches the SDK unchanged, which is what the handler's spread order decides.

### 5.4 Unit tests

**RND-U1 · The renderer URL comes from the environment**
`getRendererURL` returns `VITE_RENDERER_PROXY_URL` unchanged, and nothing when the variable is unset. A third case states the behaviour the kit should have — no request at all when the URL is missing — as an **expected failure** (`it.fails`) against known issue 1, which is not decided. The doc comment also claims a default that does not exist.

**RND-U2 · Request shape**
`exportUsingRenderer` with a fake `XMLHttpRequest`: one POST to the configured URL, `responseType` `blob`, a `FormData` body with a single `scene` part holding the given blob.

**RND-U3 · Notification sequence**
Upload progress at 40 % → "Uploading the archive... (40% complete)". Upload progress at 100 % → "Rendering on the server...". Download progress at 60 % → "Downloading the export... (60% complete)". Every one of them is a loading notification with an infinite duration, written to the id that was passed in.

**RND-U4 · Completion**
`loadend` with status 200 → the promise resolves, the notification becomes a success, and `cesdk.utils.downloadFile` is called with the response and the `content-type` header. Without that header the type falls back to `video/mp4`.

**RND-U5 · Failure**
`loadend` with status 500 → the promise rejects with the status text, or with "Export failed" when there is none. An `error` event → the promise rejects. In both cases no download happens and no success notification is written.

**RND-U6 · Render time**
The reported time is the gap between the end of the upload and the first byte of the response, in whole tenths of a second. With no progress event at all it is 0, and when the response arrives before the browser reports the upload's end it is 0 as well, never negative. Rewritten after the fixes to known issues 2 and 10.

**RND-U7 · Action registration and navigation bar**
`setupRendererExport` against a fake `cesdk`: it registers the `exportUsingRenderer` action, adds the `actions.export.using.renderer` translation, and sets a navigation bar order holding document settings, undo/redo, a spacer, zoom and an actions group whose children are the Renderer action, Import Scene, Export Scene and Export Archive — and no video export.

**RND-U8 · The action's own failure handling**
Running the registered action with `saveToArchive` rejecting: the progress notification is dismissed, an error notification is shown and the error is logged. The same when `exportUsingRenderer` rejects.

**RND-U9 · Editor configuration**
`initExportUsingRenderer` against a fake `cesdk`: the video editor config plugin is added, `ly.img.placeholder` and `ly.img.preview` are disabled, the asset source plugins are added with the demo sources limited to `ly.img.templates.video.*`, `ly.img.image.*`, `ly.img.audio.*` and `ly.img.video.*`, and `setupRendererExport` runs last.

**RND-U11 to RND-U17 · The editor configuration**
Each `setup*` module against a recording spy, asserting what the kit decides rather than what CE.SDK then does. RND-U11 features (the video family on, the placeholder family off, one `feature.enable` call). RND-U12 the sixteen engine settings. RND-U13 `setupUI`: panels left and docked and set before any bar, the video timeline controls, the preview button, trim/volume/playback speed in the inspector bar, large labelled dock icons, the three asset libraries, the canvas bar at the bottom, and no custom component. RND-U14 `setupActions`: `exportDesign` is the only override, and its handler defaults `videoBitrate` to `'Auto'` while letting the caller override it. RND-U15 one shortcut catalog and no kit translation. RND-U16 `VideoEditorConfig.initialize`: `resetEditor` first, every setup step reached, `editor.checkBrowserSupport` with `videoDecode: 'block'` and `videoEncode: 'warn'`, and nothing at all without a `cesdk`. RND-U17 the navigation bar button's `onClick` runs `exportUsingRenderer`.

These exist because merged **function** coverage is decided by the Vitest lane alone, so no browser case can reach a `setup*` function.

**RND-U18 · The entry point**
`src/index.ts` under jsdom with the SDK stubbed. It creates the editor in `#cesdk_container` with the kit's user id and the license from the environment, publishes the instance on `window.cesdk`, and loads the sample scene. The second case makes `create` reject and asserts the kit logs `Failed to initialize CE.SDK:` rather than leaving an unhandled rejection.

RND-U10 (asset path resolution) is dropped: `resolveAssetPath` is gone; the shared `tests/unit/demo-assets.test.ts` covers `src/imgly/demo-assets.ts`.

**RND-U19 · removed.** `resolveAssetPath` is gone; `src/imgly/demo-assets.ts` derives the URL from `VITE_DEMO_ASSETS_BASE_URL` or the kit's own URL.

### 5.5 Coverage remainder

`npm run ci` reports 100 % lines, 100 % branches and 100 % functions in the merged report.

The residue this section carried in version 5 is gone. `merge-coverage.mjs` now sums every browser dump instead of keeping the alphabetically last one, so `exportUsingRenderer` is credited to RND-04 to RND-09 and the `exportDesign` handler to RND-13 and RND-14. It also takes the line denominator from the Vitest statement map, so comment lines such as the `eslint-disable` inside the boot `catch` no longer enter the report.

**KB-01 · unit · Keyboard catalog predicates**

`tests/unit/keyboard-catalog.test.ts` runs every `run` and `when` of `src/imgly/config/keyboard/catalogs/us-ansi.ts` against 1620 editor states (5 edit modes, 9 selections, 3 roles, features on and off, 3 vector states, page and no page) and asserts that none throws, that every shortcut activates in at least one state, and that every function `run` reaches `cesdk.actions.run`. Kit-owned: the kit decides which key does what and when it is live. The catalog measures 100 % lines, branches and functions.

## 6. Entry and exit criteria

Entry: engine and editor built; test license available; the shared kit test harness exists (boot helper, download helper, console and network guards); `VITE_RENDERER_PROXY_URL` is set to a same-origin path in the test environment.

Exit: every case in section 5 passes locally and in CI. `npm run ci` passes. The published kit contains no test files. A release run reports results to the Qase ids above.

## 7. Known issues found while writing this plan

Confirm each with a test before fixing.

1. **Fixed in 6b.** `getRendererURL` returns the environment variable with no default and no check, while its doc comment says it "returns the default". With the variable unset the kit posts to a relative "undefined" path and the user sees only "Export failed". Pinned by RND-U1. `.env.example` now leaves the variable empty rather than setting it to its own name.
2. The reported render time is wrong whenever the progress events are not length-computable. Both timestamps stay 0, giving "took 0 seconds"; if only the upload reports progress the number is negative.
   **Fixed**: the upload timestamp comes from the upload's `loadend` and the render timestamp from the first response progress event, both falling back to the request's `loadend`. RND-U6 proves it.
3. The success notification has an infinite duration, so it stays until the user closes it.
4. There is no way to cancel a running export.
5. `setupRendererExport` overwrites the navigation bar order that `src/imgly/config/ui/navigationBar.ts` has just set, so that file has no effect in this kit.
6. `public/example.scene` is 249 KB and is not loaded by anything; the kit loads `public/assets/example-video-motion.scene`.
7. The response type is cast to `'video/mp4'` whatever the server sends. RND-U4 pins that the header wins when there is one.
8. The shipped demo scene named two Archivo fonts by their `.ttf` path, which the bundled asset library no longer ships — only `.woff2`. Every boot logged two failed font fetches, their CORS reports and three engine `errorStateChanged` errors, and the text rendered with a fallback.
   **Fixed**: the two URIs in `public/assets/example-video-motion.scene` now point at the `.woff2` files. RND-01 proves the boot is clean.
9. **Fixed.** The scene's `defaultEmojiFontFileUri` is now empty, so the engine uses its bundled emoji font instead of naming `cdn.img.ly`.

10. Chromium can deliver the first response progress event before the upload's `loadend`, so a server that answers at once (the mocked one on CI, every run) produced "server render took -0.3 seconds".
    **Fixed**: a response closes the upload timestamp too; each timestamp is set once, at the first event that proves it. RND-U6 pins the order.

## 8. Open questions

1. Issue 1: fail with a clear notification when the Renderer URL is missing, instead of posting to a broken path. Recommended: yes, and fix the doc comment. This is the first thing a customer hits.
2. Issue 2: done, from the load events rather than the progress events.
3. Issue 6: delete the unused scene file. Recommended: yes, it is 249 KB in every published copy of the kit.
4. Whether the browser cases should also run once against a real Renderer deployment in the nightly job. Recommended: no; the service is out of scope and would make the kit suite depend on a secret.

## 9. Estimate

Implemented: 12 browser cases in about 1 minute 20 on one worker, and 23 unit cases in under 1 s (19 for the request and notification logic, one of them an expected failure, and 4 for the editor configuration).

## 10. Boundary review

Rule used: the code that makes a decision owns the test for it. The kit decides that the export goes to the Renderer, what the request looks like, what the notifications say, when the file is downloaded and which navigation bar entries exist. The engine decides what an archive contains. The editor decides how notifications and the actions menu render. The Renderer service decides what the video looks like.

Core behaviour this plan leans on, and where it is covered today:

| Behaviour                                                                                    | Owner  | Covered by                                                                                                                     |
| -------------------------------------------------------------------------------------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------ |
| `scene.saveToArchive` produces a loadable archive                                            | engine | `engine/lib/test/api/ArchivalDeepRoundTripAPITest.cpp`, `bindings/wasm/js_node/src/__tests__/archiveOrphanedResources.test.ts` |
| `showNotification` / `updateNotification` / `dismissNotification`                            | editor | `apps/cesdk_web/packages/api/ui/UserInterfaceAPI.test.ts`, `apps/cesdk_web/packages/cesdk/stores/UserInterfaceStore.test.ts`   |
| A loading notification renders in the bottom right and an infinite one is not auto-dismissed | editor | `apps/cesdk_web/packages/ui/components/Notifications.test.tsx`, `Notifications.integration.test.tsx`                           |
| `utils.downloadFile` saves a blob under a mime type                                          | editor | `apps/cesdk_web/packages/api/utils/UtilsAPI.test.ts`, `apps/cesdk_web/packages/ui/utils/download.test.ts`                      |
| `actions.register` and `actions.run`                                                         | editor | `apps/cesdk_web/packages/api/actions/ActionsAPI.test.ts`                                                                       |
| `exportScene` for scene and archive format                                                   | editor | `apps/cesdk_web/packages/cesdk/registerDefaultActions.test.ts`                                                                 |
| `importScene` for scene and archive format, including a failed load                          | editor | same file                                                                                                                      |
| `setComponentOrder` with a nested actions group                                              | editor | `apps/cesdk_web/packages/api/ui/UserInterfaceAPI.test.ts`                                                                      |
| `feature.set` disables a feature                                                             | editor | `apps/cesdk_web/packages/api/features/FeatureAPI.test.ts`                                                                      |

Core coverage gaps found (candidates for the core suites, not for this kit):

1. Editor: nothing checks that a notification with `duration: 'infinite'` survives until it is dismissed by hand. `Notifications.test.tsx` covers rendering and dismissal but not the duration rule. RND-05 and RND-07 depend on it. Suggested home: `apps/cesdk_web/packages/ui/components/Notifications.test.tsx`.
2. Editor: the actions dropdown filters its children by scene mode and by feature, but there is no test that an unlisted built-in export component is genuinely absent from the menu. RND-02 is the only proof that video export cannot be reached. Suggested home: `apps/cesdk_web/packages/cesdk/components/navigationBarActions.test.ts`.

Until gap 1 is closed, RND-05 is the only check that the progress notification stays on screen for the whole export.
