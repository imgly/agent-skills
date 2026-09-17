# Test plan: starterkit-video-player

Version 3, 5 Sep 2026. Status: implemented. 5 unit and headless tests and 8 browser tests, all green (`npm run ci` exit 0). Merged coverage: lines 100 %, branches 100 %, functions 100 %.

## 1. Purpose

Verify that the Player starter kit works as shipped: the editor starts in playback-only mode with the demo scene fitted to the viewport, playback and zoom work, and none of the editing surface is reachable.

## 2. Scope

In scope

- `src/imgly/index.ts`: the kit adds `PlayerConfig` and nothing else
- `src/index.ts`: the engine config, the `window.cesdk` hook, the scene URL, the `zoom.toPage` call and its arguments, the start-up error path
- That the read-only promise holds: no dock, no inspector, no export, no editing gizmos

Out of scope

- The player UI itself. `PlayerConfig` comes from `@cesdk/core-configs-web`, a shared package. The kit does not own its feature list. See section 10.
- Playback correctness (frame timing, seeking accuracy, audio sync). Engine behaviour.
- The demo site around the kit. Covered by the `cesdk_web_demos` suite.

This kit has **no Qase cases**. The cases below come from the kit's code.

## 3. Test environment

- Browser: Chrome, headless, 1400 × 900
- Engine and editor: built from this repo, served locally.
- License: the shared test license (valid on hostname `localhost` only)
- Data: `${DEMO_ASSETS_BASE_URL}/assets/video-fashion-portfolio/scene.scene`. S4 mirrored the scene and the 15 media and font files it names into `packages/cesdk-web-examples-data/data/starterkit-video-player/` (32 MB), so a boot makes zero `cdn.img.ly` requests and the kit needs no `cdnAllowlist` entry. Known issue 1 is fixed.
- Unit cases stub `@cesdk/core-configs-web/player-editor` with a class that captures its constructor config, then call `initVideoPlayer` with a `createApiSpy()`. No DOM, no engine.

## 4. Approach

| Kind    | Tool                          | What it checks                           | Run                 |
| ------- | ----------------------------- | ---------------------------------------- | ------------------- |
| Static  | tsc, eslint, convention check | Types, deprecated APIs, kit folder shape | `npm run check:all` |
| Unit    | Vitest                        | The two calls the init function makes    | `npm run test:unit` |
| Browser | Playwright                    | The test cases in section 5              | `npm run test:e2e`  |

All three run in the kit's `ci` script. Browser tests use role and label locators only. There are no headless cases: the kit has no module that runs without an editor.

## 5. Test cases

Format: ID, level, title. Then steps and expected result.
Common precondition for all browser cases: the kit is open in the browser and the scene has finished loading.

### 5.1 Start-up

**VPY-01 · browser · Player loads the demo scene**
Steps: open the kit.
Expected: `engine.scene.getMode()` is `Video`. One page on the canvas with video content. No console errors. No `cdn.img.ly` request other than the allowlisted scene URL.

**VPY-02 · browser · The scene is fitted to the viewport**
Steps: read the zoom level after start-up, set it to 2, run the kit's own `zoom.toPage` call again, read it again.
Expected: the start-up zoom is not 1, and re-running `zoom.toPage` with `{ page: 'first', autoFit: true, padding: 24 }` returns to it.
Run correction: the fitted zoom depends on the timeline's height as well as the padding (0.579 for the shipped scene), so an absolute number would be brittle; reproducing it from the kit's own arguments is what proves the start-up call ran with them.

**VPY-03 · browser · The debug hook is on the window**
Steps: read `window.cesdk`.
Expected: it is the editor instance and its `engine` and `ui` are usable.

### 5.2 Playback

**VPY-04 · browser · Play and pause**
Steps: click Play, wait, click Pause.
Expected: `engine.block.isPlaying(page)` is true after the first click and false after the second, and the playback time advanced between them.

**VPY-05 · browser · The playback controls the player config leaves on**
Steps: read the timeline controls.
Expected: Play, the loop toggle, Fit Video to Timeline and the two timeline-scale buttons are enabled.
Run correction: the timeline exposes no slider or scrub element with a role, so there is no role locator for a seek; VPY-04 covers that the playback time advances. This case pins that the player config left the controls enabled, which is the kit-owned part.

### 5.3 The read-only promise

**VPY-06 · browser · Selecting and adding blocks are denied**
Steps: read the global scopes.
Expected: `editor/select` and `editor/add` are both `Deny`.

**VPY-07 · browser · No editing surface**
Steps: read the UI after start-up.
Expected: the dock, the navigation bar, the canvas menu, the inspector bar and both canvas bars have zero components.
Run correction: `engine.asset.findAllSources()` is **not** empty — the editor registers `ly.img.animations`, `ly.img.scene.colors` and `ly.img.transitions` itself. Which sources the editor registers is its own decision, so the case asserts instead that none of the twenty ids the sibling video kits' asset-source plugins register is present.

**VPY-08 · browser · A block cannot be selected**
Steps: click a block on the canvas.
Expected: `engine.block.findAllSelected()` stays empty. Per open question 2 the drag is not performed: a drag that is supposed to do nothing is a slow way to assert nothing.

### 5.4 Unit cases (no browser, no engine)

Subject: `initVideoPlayer` from `src/imgly/index.ts`, driven with `createApiSpy()`.

**VPY-U1 · unit · The init function adds exactly one plugin**
`addPlugin` is called once, with `PlayerConfig`, and nothing else is called — no `setTheme`, no `setLocale`, no asset source, no order component. This is the whole kit; the case fails the moment it grows a second responsibility.

**VPY-U2 · unit · The module re-exports `PlayerConfig`**
`src/imgly/index.ts` re-exports it so a customer can compose the config without the init function. The README documents the module as the entry point.

## 6. Entry and exit criteria

Entry: engine and editor built; test license available; the kit's `test:unit` and `test:e2e` scripts replaced with the real commands (they are `exit 0` today); a decision on open question 1, because the browser cases cannot run without one.

Exit: every case in section 5 passes locally and in CI. `npm run ci` passes. The published kit contains no test files.

## 7. Known issues found while writing this plan

Confirm each with a test before fixing.

1. **Fixed in S4.** The scene was a hardcoded `cdn.img.ly` link into `plugin-marketing-asset-source-web@1.0.0`. It is now mirrored into `packages/cesdk-web-examples-data/data/starterkit-video-player/` and read through a `DEMO_ASSETS_BASE_URL` constant with a `VITE_DEMO_ASSETS_BASE_URL` override, as every sibling video kit does.
2. The README's Architecture tree shows `src/imgly/config/` with seven files. It does not exist — the kit has two source files and takes its configuration from `@cesdk/core-configs-web`.
3. The README's Loading Content section shows `cesdk.load('https://example.com/video.zip')` and a `zoom.toPage` snippet, but never mentions that the shipped scene comes from a URL the customer cannot change without editing `src/index.ts`.
4. **Fixed in S4.** `.env.example` and the README now document `VITE_DEMO_ASSETS_BASE_URL`.
5. `src/index.ts` carries the same commented-out `baseURL` line whose value repeats the live line above it, and the same orphaned "Local assets for development" comment as the other video kits.
6. Start-up failures are reported only through `console.error`. A customer copying the kit gets a blank page and a console line.

## 8. Open questions

1. **Resolved:** the scene moved behind `DEMO_ASSETS_BASE_URL` and the kit needs no allowlist entry. The mirror is 32 MB, the largest in the fleet, because the scene carries seven MP4s and an audio track.
2. **Resolved as recommended:** VPY-08 asserts `engine.block.findAllSelected()` stays empty after the click and performs no drag.

## 9. Estimate

Measured: 8 browser cases in 21 s on one worker; 2 unit cases in 0.3 s.

## 10. Boundary review

Rule used: the code that makes a decision owns the test for it. This kit decides to add `PlayerConfig`, which scene to load, and to fit the first page with 24 px padding. `@cesdk/core-configs-web` decides which features a player has. The engine decides playback.

Core behaviour this plan leans on, and where it is covered today:

| Behaviour                                                                              | Owner  | Covered by                                                                                                                                                                                                                                                       |
| -------------------------------------------------------------------------------------- | ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `zoom.toPage` resolves `page: 'first'` to the first page and calls `scene.zoomToBlock` | editor | `apps/cesdk_web/packages/cesdk/registerDefaultActions.test.ts` "zoom.toPage resolves first page". **Partly**: the options are asserted as `expect.any(Object)`, so nothing pins that `autoFit` and `padding` reach the engine. VPY-02 asserts the result instead |
| A disabled feature removes its UI                                                      | editor | `apps/cesdk_web/packages/api/features/FeatureAPI.test.ts`                                                                                                                                                                                                        |
| Playing, pausing and seeking a page                                                    | engine | `engine/lib/test/api/VideoPlaybackAPITest.cpp`, `engine/lib/test/api/UBQVideoAudioDeepAPITest.cpp`                                                                                                                                                               |
| Loading a scene from a URL                                                             | engine | `engine/lib/test/api/LoadSceneAPITest.cpp`, `engine/lib/test/api/SceneAPITest.cpp`                                                                                                                                                                               |
| A video decoder reports width, height and duration                                     | engine | `engine/lib/test/api/CodecAPITest.cpp`                                                                                                                                                                                                                           |

Core coverage gaps found (candidates to add in the core suites, not in this kit):

1. `@cesdk/core-configs-web` had no tests at all. Closed on this branch: `packages/cesdk-core-configs-web/src/editorConfigs.test.ts` covers the player in `player-editor denies selection and adding globally` and `the player keeps only the playback controls`. VPY-07 and VPY-08 stay as this kit's proof through the running editor.

## 11. Coverage pass

Cases added to close the merged-coverage gaps:

- **VPY-U3 · unit · src/index.ts, with `@cesdk/cesdk-js` and the kit barrel mocked: the demo base URL falls back to the published data when `VITE_DEMO_ASSETS_BASE_URL` is unset and is taken when it is set, a successful create publishes `window.cesdk`, configures the editor and loads the scene from that base URL, and a rejected create logs `Failed to initialize CE.SDK:` and leaves no unhandled rejection**

No uncovered line, branch or function remains.
