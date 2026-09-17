# Test plan: starterkit-advanced-design-editor

Version 4, 7 Sep 2026. Status: implemented. 11 unit and headless tests, 3 browser tests, `npm run ci` green. Merged coverage: lines 100 %, branches 100 %, functions 100 %.

## 1. Purpose

Verify that the Advanced Design Editor starter kit works as shipped: the editor starts with the advanced configuration, which differs from the design editor kit in three visible ways, and the marketing template loads.

## 2. Scope

In scope

- `src/index.ts`: engine config, the `window.cesdk` hook, the scene it loads
- `src/imgly/index.ts`: `AdvancedEditorConfig`, the asset source plugins, the navigation bar actions dropdown, the background removal plugin
- `src/index.ts`: `DEMO_ASSETS_BASE_URL` and the scene it loads from it

Out of scope

- What `AdvancedEditorConfig` puts in the dock, navigation bar, features and settings. That is `packages/cesdk-core-configs-web`. See section 10, gap 1.
- Core editor and engine behaviour reached through this kit.
- The demo site around the kit. All 8 Qase cases of this kit are demo site: 23, 24, 25, 26, 27, 44, 2372, 3698.

No Qase case maps to a plan case. Every case below is new coverage.

## 3. Test environment

- Browser: Chrome, headless, 1400 x 900
- Engine and editor: built from this repo, served locally
- License: the shared test license (valid on hostname `localhost` only)
- Data: the kit loads `${DEMO_ASSETS_BASE_URL}/assets/9-16-marketing-ad-fragrance/scene.scene`, 1 page, mirrored into `packages/cesdk-web-examples-data/data/starterkit-advanced-design-editor/`. In dev the local CDN daemon serves it; in static mode the baked `staticimgly.com` URL applies, which the network guard allows. Measured on a real boot: the kit requests the scene, two fonts and two images, and nothing from `cdn.img.ly`.
- Hook: `window.cesdk`
- Background removal downloads its model from `staticimgly.com` on first use. No case runs it.

## 4. Approach

| Kind    | Tool                          | What it checks                                | Run                 |
| ------- | ----------------------------- | --------------------------------------------- | ------------------- |
| Static  | tsc, eslint, convention check | Types, deprecated APIs, kit folder shape      | `npm run check:all` |
| Unit    | Vitest                        | `initAdvancedEditor` against a recording stub | `npm run test:unit` |
| Browser | Playwright                    | The cases in section 5                        | `npm run test:e2e`  |

Browser tests use role and label locators. Everything inside the editor goes through the harness helpers, `actionsMenu` for the navigation bar's actions dropdown and `editorPanel(id)` for a panel, so the editor's own attributes appear in one place rather than in every kit; a case that scopes to the editor uses the kit's own `#cesdk_container`. The pilot kit justifies the same for its builder Select and NumberInput controls.

## 5. Test cases

Format: ID, level, title. Then steps and expected result.
Common precondition for browser cases: the kit is open and the scene has finished loading.

### 5.1 Start-up

**ADE-01 · browser · Editor loads with the advanced layout**
Steps: open the kit.
Expected: one page on the canvas. The seven dock buttons carry an accessible name but no visible text, which is what tells this configuration apart from the design editor kit's. No console errors.
Note: the first run showed `page/title/show` is true in both kits, so the page title is not a difference. The expected result above was corrected.

**ADE-02 · browser · Inspector opens on the right**
Steps: select a block on the canvas.
Expected: the inspector panel is on the right side of the canvas, not the left. This is the difference from the design editor kit, which puts it on the left.

**ADE-03 · browser · Actions dropdown carries the six kit entries**
Steps: open the actions dropdown at the end of the navigation bar.
Expected: a Save button next to the dropdown, and inside the dropdown Export Images, Export PDF, Export Design, Export Archive, Import. In that order.
Note: the first run showed that `ly.img.saveScene.navigationBar` renders as its own button rather than a dropdown entry, and that the editor's own labels differ from the plan's wording. The expected result above was corrected.

### 5.2 Unit tests (no browser)

**ADE-U1 · unit · `initAdvancedEditor` adds the documented plugins**
Call `initAdvancedEditor` with a stub whose `addPlugin` and `ui.insertOrderComponent` record their arguments.
Expected: `AdvancedEditorConfig` first, then the fifteen asset source plugins, then the background removal plugin. The fifteen are all in flight before the first one settles, so they register concurrently.

**ADE-U2 · unit · Asset source include lists**
Expected: same lists as the design editor kit. `UploadAssetSources` includes `ly.img.image.upload` only; `DemoAssetSources` includes the four template groups plus `ly.img.image.*`; `PremiumTemplatesAssetSource` includes `ly.img.templates.premium.*`.

**ADE-U3 · unit · Actions dropdown order**
Expected: `insertOrderComponent` is called with `{ in: 'ly.img.navigation.bar', position: 'end' }` and the six children of ADE-03.

**ADE-U4 · unit · Background removal options**
Expected: `ui.locations` is `['canvasMenu']` and `provider.type` is `@imgly/background-removal`.

ADE-U5 was dropped: `src/imgly/resolveAssetPath.ts` was dead code (known issue 3) and reading the Vite `BASE_URL` env value is forbidden for a kit that resolves assets through `packages/cesdk-web-examples-data`, so the module was deleted.

## 6. Entry and exit criteria

Entry: engine and editor built; test license available; the shared kit test harness exists. For the browser cases the mirrored demo data must be on disk — `data/**` is git-LFS and excluded from the default checkout, so a fresh clone needs `git lfs pull -X '' -I 'packages/cesdk-web-examples-data/data/**'`, and static mode needs the CDN deploy.

Exit: every case passes locally and in CI. `npm run ci` passes. The published kit contains no test files.

## 7. Known issues found while writing this plan

Fixed: 1 (the scene and the files it references are mirrored into `packages/cesdk-web-examples-data/data/starterkit-advanced-design-editor/` and loaded through `DEMO_ASSETS_BASE_URL`; a boot now makes no `cdn.img.ly` request at all). 3 (the dead `resolveAssetPath.ts` was deleted).

Open:

2. The README says the kit has a layers panel. `AdvancedEditorConfig` registers none, and neither does the kit. The only advanced traits in the config are the right-side inspector, unlabelled normal-size dock icons and the visible page title.
3. `public/assets/remove-bg.png` is never referenced.
4. `src/imgly/index.ts` is a copy of the design editor kit's file with the configuration class swapped. Only that one line differs in behaviour.
5. The mirrored scene still names `cdn.img.ly/assets/v4/…` in the variant lists of the typefaces it does not use and in the `defaultEmojiFontFileUri` setting. Those URIs are metadata: a boot fetches none of them.

## 8. Open questions

1. Issue 2: correct the README, or add a layers panel to the advanced configuration. Recommended: correct the README.

## 9. Estimate

Measured: 3 browser cases in 10.0 s, 7 unit cases in under 1 s.

## 10. Boundary review

Rule used: the code that makes a decision owns the test for it. This kit decides which configuration plugin and asset sources to add, the actions dropdown contents, the background removal placement, and the scene it loads. Everything else visible on screen is decided by `@cesdk/core-configs-web` or by the editor.

| Behaviour                                                       | Owner  | Covered by                                                |
| --------------------------------------------------------------- | ------ | --------------------------------------------------------- |
| `ui.setComponentOrder` / `insertOrderComponent` apply and merge | editor | `apps/cesdk_web/packages/api/ui/UserInterfaceAPI.test.ts` |
| `setPanelPosition` and `setPanelFloating`                       | editor | `apps/cesdk_web/packages/api/ui/UserInterfaceAPI.test.ts` |
| `feature.enable` gating                                         | editor | `apps/cesdk_web/packages/api/features/FeatureAPI.test.ts` |
| Scene load from a URL                                           | engine | `engine/lib/test/api/SceneAPITest.cpp`                    |

Core coverage gaps found:

1. `AdvancedEditorConfig` decides everything ADE-01 and ADE-02 observe; `packages/cesdk-core-configs-web/src/editorConfigs.test.ts` asserts it.

## 11. Coverage pass

Cases added to close the merged-coverage gaps:

- **ADE-U5 · unit · src/index.ts, with `@cesdk/cesdk-js` and the kit barrel mocked: the demo base URL falls back to the published data when `VITE_DEMO_ASSETS_BASE_URL` is unset and is taken when it is set, a successful create publishes `window.cesdk`, configures the editor, loads the scene from that base URL and reports the `created` and `ready` demo phases, and a rejected create reports `failed`, logs `Failed to initialize CE.SDK:` and leaves no unhandled rejection**

No uncovered line, branch or function remains.
