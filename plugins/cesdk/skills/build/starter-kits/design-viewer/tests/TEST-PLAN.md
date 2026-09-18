# Test plan: starterkit-design-viewer

Version 3, 5 Sep 2026. Status: implemented. 6 unit tests and 4 browser tests, `npm run ci` green. Merged coverage: lines 100 %, branches 100 %, functions 100 %.

## 1. Purpose

Verify that the Design Viewer starter kit works as shipped: a read-only editor with zoom controls only, a three-page design loaded, and the first page fitted to the view.

## 2. Scope

In scope

- `src/index.ts`: engine config, the `window.cesdk` hook, the scene it loads, the `zoom.toPage` call and its arguments
- `src/imgly/index.ts`: the `ViewerConfig` plugin

Out of scope

- What `ViewerConfig` denies and enables. That is `packages/cesdk-core-configs-web`. See section 10, gap 1.
- Core editor and engine behaviour reached through this kit.
- The demo site around the kit.

This kit has no Qase suite. The plan is written from the README and the code.

## 3. Test environment

- Browser: Chrome, headless, 1400 x 900
- Engine and editor: built from this repo, served locally
- License: the shared test license (valid on hostname `localhost` only)
- Data: the kit loads `${DEMO_ASSETS_BASE_URL}/assets/1-1-marketing-multipost/scene.scene`, 3 pages, mirrored into `packages/cesdk-web-examples-data/data/starterkit-design-viewer/`. In dev the local CDN daemon serves it; in static mode the baked `staticimgly.com` URL applies, which the network guard allows. Measured on a real boot: the kit requests the scene, four fonts and two images, and nothing from `cdn.img.ly`.
- Hook: `window.cesdk`

## 4. Approach

| Kind    | Tool                          | What it checks                              | Run                 |
| ------- | ----------------------------- | ------------------------------------------- | ------------------- |
| Static  | tsc, eslint, convention check | Types, deprecated APIs, kit folder shape    | `npm run check:all` |
| Unit    | Vitest                        | `initDesignViewer` against a recording stub | `npm run test:unit` |
| Browser | Playwright                    | The cases in section 5                      | `npm run test:e2e`  |

Browser tests use role and label locators only.

## 5. Test cases

Format: ID, level, title. Then steps and expected result.
Common precondition for browser cases: the kit is open and the scene has finished loading.

### 5.1 Start-up and read-only surface

**DV-01 · browser · Viewer loads with three pages and zoom controls only**
Steps: open the kit.
Expected: three pages on the canvas. The navigation bar shows the zoom controls and nothing else. There is no dock, no inspector, no canvas bar. No console errors.

**DV-02 · browser · The first page is fitted after load**
Steps: read `window.cesdk.engine.scene.getCurrentPage()` and the zoom level.
Expected: the current page is the first page, and the whole page is inside the viewport.

**DV-03 · browser · A block cannot be selected**
Steps: click the middle of the first page.
Expected: `window.cesdk.engine.block.findAllSelected()` stays empty and no inspector opens. The kit relies on the `editor/select` global scope being denied by `ViewerConfig`.

**DV-04 · browser · Nothing can be added**
Steps: read the global scopes and look for an add affordance.
Expected: `editor/add` and `editor/select` are both `Deny`, and neither the Add Page button nor the dock is present.
Note: the first run proved the original expected result wrong — `engine.block.create('text')` succeeds even with `editor/add` denied, because the global scopes gate editor interactions and not the engine API. The case now observes the read-only surface the kit ships. The scopes themselves are `ViewerConfig`'s decision; see section 10, gap 1.

### 5.2 Unit tests (no browser)

**DV-U1 · unit · `initDesignViewer` adds only the viewer configuration**
Call `initDesignViewer` with a stub whose `addPlugin` records its argument.
Expected: exactly one plugin, `ViewerConfig`. No asset sources, no theme or locale call.

**DV-U2 · unit · The kit exports `ViewerConfig`**
Expected: `src/imgly/index.ts` re-exports `ViewerConfig`, so an integrator can add it without the kit's init function.

**DV-U3 · unit · `src/index.ts`**
With `@cesdk/cesdk-js` and the kit barrel mocked: `DEMO_ASSETS_BASE_URL` falls back to the published demo data when `VITE_DEMO_ASSETS_BASE_URL` is unset and takes it when it is set; a successful create publishes `window.cesdk`, configures the viewer, loads the scene from that base URL and fits the first page; a rejected create logs `Failed to initialize CE.SDK:` and leaves no unhandled rejection.

Coverage: `npm run ci` with `KIT_TEST_COVERAGE=1` measures lines 100 %, branches 100 %, functions 100 % merged.

## 6. Entry and exit criteria

Entry: engine and editor built; test license available; the shared kit test harness exists. For the browser cases the mirrored demo data must be on disk — `data/**` is git-LFS and excluded from the default checkout, so a fresh clone needs `git lfs pull -X '' -I 'packages/cesdk-web-examples-data/data/**'`, and static mode needs the CDN deploy.

Exit: every case passes locally and in CI. `npm run ci` passes. The published kit contains no test files.

## 7. Known issues found while writing this plan

Fixed: 1 (the scene and the files it references are mirrored into `packages/cesdk-web-examples-data/data/starterkit-design-viewer/` and loaded through `DEMO_ASSETS_BASE_URL`; a boot now makes no `cdn.img.ly` request at all, and no request to the Vercel preview host either).

Open:

2. The README Architecture section shows a `src/imgly/config/` tree with `plugin.ts`, `actions.ts`, `features.ts`, `settings.ts`, `i18n.ts` and `ui/`. None of those files exist in this kit. The whole configuration comes from `@cesdk/core-configs-web/viewer-editor`.
3. The kit calls `cesdk.actions.run('zoom.toPage', …)` without awaiting it, after an awaited `cesdk.load`. If the action becomes asynchronous, the fit would race the load.
4. `src/index.ts` sets `window.cesdk` and the comment says to remove it in production, as in every kit. The harness depends on it.
5. The mirrored scene still names `cdn.img.ly/assets/v4/…` in the variant lists of the typefaces it does not use and in the `defaultEmojiFontFileUri` setting. Those URIs are metadata: a boot fetches none of them.

## 8. Open questions

1. Resolved: mirrored into `packages/cesdk-web-examples-data/data/starterkit-design-viewer/`.
2. Resolved, and the recommendation was wrong: `block.create` is not gated by `editor/add`. DV-04 asserts the scopes and the absent add affordances instead.

## 9. Estimate

Measured: 4 browser cases in 9.9 s, 3 unit cases in under 1 s.

## 10. Boundary review

Rule used: the code that makes a decision owns the test for it. This kit decides to add `ViewerConfig`, which scene to load, and to fit the first page. Read-only behaviour itself is decided by `ViewerConfig` and enforced by the engine.

| Behaviour                                                           | Owner  | Covered by                                                     |
| ------------------------------------------------------------------- | ------ | -------------------------------------------------------------- |
| `editor/add` and `editor/select` denied blocks adding and selecting | engine | `engine/lib/test/api/ScopeMatrixAPITest.cpp`                   |
| `ui.setComponentOrder` for the navigation bar                       | editor | `apps/cesdk_web/packages/api/ui/UserInterfaceAPI.test.ts`      |
| Scene load from a URL                                               | engine | `engine/lib/test/api/SceneAPITest.cpp`                         |
| `zoom.toPage` action                                                | editor | `apps/cesdk_web/packages/cesdk/registerDefaultActions.test.ts` |

Core coverage gaps found:

1. `ViewerConfig` is the whole viewer: two denied scopes, three enabled features, a two-item navigation bar and five engine settings; `packages/cesdk-core-configs-web/src/editorConfigs.test.ts` asserts them.
