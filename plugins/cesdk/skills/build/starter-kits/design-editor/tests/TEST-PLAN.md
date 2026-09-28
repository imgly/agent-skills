# Test plan: starterkit-design-editor

Version 4, 7 Sep 2026. Status: implemented. 11 unit and headless tests, 3 browser tests, `npm run ci` green. Merged coverage: lines 100 %, branches 100 %, functions 100 %.

## 1. Purpose

Verify that the Design Editor starter kit works as shipped: the editor starts with the design editor configuration, the documented asset libraries and the documented actions dropdown, and the marketing template loads.

## 2. Scope

In scope

- `src/index.ts`: engine config, the `window.cesdk` hook, the scene it loads
- `src/imgly/index.ts`: which configuration plugin, which asset source plugins, the navigation bar actions dropdown, the background removal plugin
- `src/index.ts`: `DEMO_ASSETS_BASE_URL` and the scene it loads from it

Out of scope

- What `DesignEditorConfig` puts in the dock, navigation bar, features and settings. That is `packages/cesdk-core-configs-web`. See section 10, gap 1.
- Core editor and engine behaviour reached through this kit (text editing, undo, asset library, export). Covered by the core suites.
- The demo site around the kit. Qase 1, 2, 22, 310, 2328, 2369, 2330, 2371, 2383, 4012, 4013, 4014. Qase 2465 is filed as kit behaviour but the Desktop/Mobile toggle it uses is the demo site's iframe switch, so it belongs there too.
- The mobile app store pages. Qase 2459, 2460, 2461, 2462, 2463, 2464.

No Qase case maps to a plan case. Every case below is new coverage.

## 3. Test environment

- Browser: Chrome, headless, 1400 x 900
- Engine and editor: built from this repo, served locally
- License: the shared test license (valid on hostname `localhost` only)
- Data: the kit loads `${DEMO_ASSETS_BASE_URL}/assets/4-5-marketing-ad/scene.scene`, 1 page, mirrored into `packages/cesdk-web-examples-data/data/starterkit-design-editor/`. In dev the local CDN daemon serves it; in static mode the baked `staticimgly.com` URL applies, which the network guard allows. Measured on a real boot: the kit requests the scene, two fonts and two images, and nothing from `cdn.img.ly`.
- Hook: `window.cesdk`, set before `initDesignEditor` runs
- Background removal downloads its model from `staticimgly.com` on first use. No case runs it.

## 4. Approach

| Kind    | Tool                          | What it checks                              | Run                 |
| ------- | ----------------------------- | ------------------------------------------- | ------------------- |
| Static  | tsc, eslint, convention check | Types, deprecated APIs, kit folder shape    | `npm run check:all` |
| Unit    | Vitest                        | `initDesignEditor` against a recording stub | `npm run test:unit` |
| Browser | Playwright                    | The cases in section 5                      | `npm run test:e2e`  |

Browser tests use role and label locators. The navigation bar's actions dropdown is reached through the harness helper `actionsMenu`, so the editor's own attributes appear in one place rather than in every kit; a case that scopes to the editor uses the kit's own `#cesdk_container`. The pilot kit justifies the same for its builder Select and NumberInput controls.

## 5. Test cases

Format: ID, level, title. Then steps and expected result.
Common precondition for browser cases: the kit is open and the scene has finished loading.

### 5.1 Start-up

**DE-01 · browser · Editor loads with the design editor layout**
Steps: open the kit.
Expected: one page on the canvas. Dock shows Templates, Elements, Uploads, Images, Text, Shapes, Stickers with labels. Navigation bar shows the document settings button, undo/redo and the zoom controls. No console errors.
Note: the canvas exposes one `Edit: <type>` button per block, so the document settings button is matched exactly.
Note: the first run showed no preview button — `ly.img.preview.navigationBar` is not part of the design editor configuration's navigation bar. The expected result above was corrected.

**DE-02 · browser · Actions dropdown carries the six kit entries**
Steps: open the actions dropdown at the end of the navigation bar.
Expected: a Save button next to the dropdown, and inside the dropdown Export Images, Export PDF, Export Design, Export Archive, Import. In that order.
Note: the first run showed that `ly.img.saveScene.navigationBar` renders as its own button rather than a dropdown entry, and that the editor's own labels differ from the plan's wording. The expected result above was corrected.

**DE-03 · browser · Background removal is offered on an image block**
Steps: select the image block on the canvas. Open the canvas menu.
Expected: the background removal entry is present. The case does not click it.

### 5.2 Unit tests (no browser)

**DE-U1 · unit · `initDesignEditor` adds the documented plugins**
Call `initDesignEditor` with a stub whose `addPlugin` records its argument and whose `ui.insertOrderComponent` records its arguments.
Expected: `DesignEditorConfig` first, then Blur, ImageColors, ColorPalette, CropPresets, Upload, Demo, Effects, Filters, PagePresets, Sticker, Text, TextComponent, Typeface, VectorShape, PremiumTemplates, then the background removal plugin. The fifteen asset sources are all in flight before the first one settles, so they register concurrently.

**DE-U2 · unit · Asset source include lists**
Expected: `UploadAssetSources` includes `ly.img.image.upload` only. `DemoAssetSources` includes `ly.img.templates.blank.*`, `ly.img.templates.presentation.*`, `ly.img.templates.print.*`, `ly.img.templates.social.*`, `ly.img.image.*`. `PremiumTemplatesAssetSource` includes `ly.img.templates.premium.*`.

**DE-U3 · unit · Actions dropdown order**
Expected: `insertOrderComponent` is called with `{ in: 'ly.img.navigation.bar', position: 'end' }` and the six children of DE-02.

**DE-U4 · unit · Background removal options**
Expected: `ui.locations` is `['canvasMenu']` and `provider.type` is `@imgly/background-removal`.

DE-U5 was dropped: `src/imgly/resolveAssetPath.ts` was dead code (known issue 2) and reading the Vite `BASE_URL` env value is forbidden for a kit that resolves assets through `packages/cesdk-web-examples-data`, so the module was deleted.

## 6. Entry and exit criteria

Entry: engine and editor built; test license available; the shared kit test harness exists. For the browser cases the mirrored demo data must be on disk — `data/**` is git-LFS and excluded from the default checkout, so a fresh clone needs `git lfs pull -X '' -I 'packages/cesdk-web-examples-data/data/**'`, and static mode needs the CDN deploy.

Exit: every case passes locally and in CI. `npm run ci` passes. The published kit contains no test files.

## 7. Known issues found while writing this plan

Fixed: 1 (the scene and the files it references are mirrored into `packages/cesdk-web-examples-data/data/starterkit-design-editor/` and loaded through `DEMO_ASSETS_BASE_URL`; a boot now makes no `cdn.img.ly` request at all). 2 (the dead `resolveAssetPath.ts` was deleted).

Open:

3. `public/assets/remove-bg.png` is never referenced.
4. The README lists `cesdk.createFromImage` and `cesdk.load` as loading options but the kit ships only `cesdk.load`. No defect, only an untested claim.
5. **Fixed.** The mirrored scene no longer names `cdn.img.ly` anywhere. Every font URI is relative to the engine's `baseURL`, and `defaultEmojiFontFileUri` is empty.

## 8. Open questions

1. Resolved: mirrored into `packages/cesdk-web-examples-data/data/starterkit-design-editor/`.
2. Resolved: DE-U1 asserts the full asset source order plus the two that matter (`DesignEditorConfig` first, background removal last).

## 9. Estimate

Measured: 3 browser cases in 9.7 s, 7 unit cases in under 1 s.

## 10. Boundary review

Rule used: the code that makes a decision owns the test for it. This kit decides which configuration plugin and which asset sources to add, the actions dropdown contents, the background removal placement, and the scene it loads. Everything visible in the dock, inspector and canvas is decided by `@cesdk/core-configs-web` or by the editor.

| Behaviour                                                               | Owner  | Covered by                                                              |
| ----------------------------------------------------------------------- | ------ | ----------------------------------------------------------------------- |
| `ui.setComponentOrder` / `insertOrderComponent` apply and merge         | editor | `apps/cesdk_web/packages/api/ui/UserInterfaceAPI.test.ts`               |
| `feature.enable` gating                                                 | editor | `apps/cesdk_web/packages/api/features/FeatureAPI.test.ts`               |
| `ly.img.exportImage.navigationBar` runs `exportDesign` with `image/png` | editor | `apps/cesdk_web/packages/cesdk/registerNavigationBarComponents.test.ts` |
| `utils.export` and `utils.downloadFile`                                 | editor | `apps/cesdk_web/packages/api/utils/UtilsAPI.test.ts`                    |
| Scene load from a URL                                                   | engine | `engine/lib/test/api/SceneAPITest.cpp`                                  |

Core coverage gaps found:

1. `DesignEditorConfig` decides the dock, navigation bar, features, settings and panel positions of this kit, the advanced kit and the viewer kit; `packages/cesdk-core-configs-web/src/editorConfigs.test.ts` asserts them with the same recording-stub shape as DE-U1.

## 11. Coverage pass

Cases added to close the merged-coverage gaps:

- **DE-U5 · unit · src/index.ts, with `@cesdk/cesdk-js` and the kit barrel mocked: the demo base URL falls back to the published data when `VITE_DEMO_ASSETS_BASE_URL` is unset and is taken when it is set, a successful create publishes `window.cesdk`, configures the editor, loads the scene from that base URL and reports the `created` and `ready` demo phases, and a rejected create reports `failed`, logs `Failed to initialize CE.SDK:` and leaves no unhandled rejection**

No uncovered line, branch or function remains.
