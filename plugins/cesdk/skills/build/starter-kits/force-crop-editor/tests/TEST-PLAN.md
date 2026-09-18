# Test plan: starterkit-force-crop-editor

Version 5, 7 Sep 2026. Status: implemented. 66 Vitest cases (unit and component) and 10 browser cases run in `npm run ci` (exit 0); merged coverage is lines 99.87 %, branches 100 %, functions 100 %.

## 1. Purpose

Verify that the Force Crop starter kit works as shipped: the selection screen offers three images, three crop presets and three crop modes, and opening the editor applies the chosen preset to the page with the chosen mode while restricting editing to Crop, Adjust, Filter and Shapes.

## 2. Scope

In scope

- The React selection screen: image, preset and mode choice, their defaults, and the Open Editor button
- `initForceCropEditor`: `createFromImage`, the page scopes and settings it locks, the preset it registers in `ly.img.page.presets`, and the `applyForceCrop` call
- The three crop presets and three sample images the kit defines, and the `DEMO_ASSETS_BASE_URL` override
- The custom dock the kit builds — Crop, Adjust, Filter, Shapes — and the panel and edit-mode behaviour behind each entry
- The two feature predicates that hide the canvas menu and the inspector bar for the page
- The kit's own code under `src/app/`, `src/imgly/` and `src/index.tsx`

Out of scope

- What `applyForceCrop` does in each mode. The editor decides that and covers it; see section 10.
- Core editor features reached through this kit (crop handles, adjustment sliders, filter library). Covered by the core editor suite.
- The demo site around the kit (cards, tags, platform support, links, device toggles). Covered by the `cesdk_web_demos` suite. Qase 3724, 3725, 3726, 3727, 3728, 3743, 3752, 3761.

## 3. Test environment

- Browser: Chrome, headless, 1400 × 900
- Engine and editor: built from this repo, served locally. Requests to `cdn.img.ly` fail the test.
- License: the shared test license (valid on hostname `localhost` only)
- Data: the kit's three sample images and six preset icons. The tests set `VITE_DEMO_ASSETS_BASE_URL` to the in-repo copy at `packages/cesdk-web-examples-data/data/starterkit-force-crop-editor/`, which already holds `image-1.png` (800 × 1200), `image-2.png` (1200 × 800), `image-3.png` (1200 × 1200) and the six logo and thumb files. This follows the P6 decision to serve demo assets from the in-repo data package.
- **Editor start-up differs from every other kit in this batch.** The page opens on the selection screen and no editor exists yet; `window.cesdk` is set inside `handleEditorInit`, after Open Editor is clicked. Every browser case therefore starts by choosing on the selection screen, clicking Open Editor, and waiting for the harness hook.
- Downloads: captured by Playwright and checked by file type and pixel size

## 4. Approach

| Kind    | Tool                          | What it checks                                                  | Run                 |
| ------- | ----------------------------- | --------------------------------------------------------------- | ------------------- |
| Static  | tsc, eslint, convention check | Types, deprecated APIs, kit folder shape                        | `npm run check:all` |
| Unit    | Vitest                        | Presets, images, dock behaviour, feature predicates, init calls | `npm run test:unit` |
| Browser | Playwright                    | The test cases in section 5                                     | `npm run test:e2e`  |

All three run in the kit's `ci` script. Browser tests use role and label locators only. There are **no headless cases**: `initForceCropEditor` calls `cesdk.createFromImage` and `cesdk.ui.applyForceCrop`, both of which live on `CreativeEditorSDK` and not on `@cesdk/node`, so the module cannot run under the node engine. Its decisions are covered instead by unit cases with a spy `cesdk` that record the scopes, settings, asset-source writes and `applyForceCrop` arguments.

## 5. Test cases

Format: ID, level, Qase id, title. Then steps and expected result.
Common precondition for the editor cases: a selection has been made on the selection screen, Open Editor has been clicked, and the editor has finished loading.

### 5.1 The selection screen

**FCE-01 · browser · Qase 4681 · Defaults on the selection screen**
Steps: open the kit.
Expected: three cards — Select Image, Select Crop Preset, Select Mode. The first image is highlighted. Portrait Post is selected and labelled "Portrait Post (4:5)". The Always tab is selected and its description reads "This mode opens the Crop Mode always."
Note from the run: the first image is **not** rendered taller — `styles.tall` does not exist, see known issue 8 — so the case asserts the selection state only. No console errors. No request to `cdn.img.ly`.

**FCE-02 · browser · Qase 3888 · Changing the image keeps the preset and the mode**
Steps: select Profile Photo and the If Needed mode, then click the third image.
Expected: the third image is highlighted, Profile Photo stays selected, and the If Needed tab stays selected with its own description.

### 5.2 Opening the editor

**FCE-03 · browser · Qase 3757, 3884 · The image fills the page in the chosen ratio**
Steps: keep the defaults, click Open Editor.
Expected: the editor opens over the selection screen. The scene has one page whose aspect ratio is 4:5, the selected image is its fill, `contentFillMode` is Cover, and the page is clipped. The editor opens in Crop mode with the crop panel showing.

**FCE-04 · browser · Qase 3883 · Only Always and If Needed open Crop mode**
Steps: open the editor with Always on a 1200 × 800 image. Close, choose Silent, reopen. Close, choose If Needed with Profile Photo (1:1) on the 1200 × 1200 image, reopen.
Expected: Always opens in Crop mode. Silent applies the preset and stays in Transform mode. If Needed stays in Transform mode when the image already matches the ratio. The mode itself is editor behaviour (section 10); this case asserts the kit passes the mode the user picked.
Note from the run: closing and reopening re-runs `initForceCropEditor` with the current selection, so the three combinations run in one page. `window.cesdk` from the previous open is cleared first, or the wait returns the stale instance.

**FCE-05 · browser · Qase 3887 · Every preset works for every image**
Steps: for each of the three presets and each of the three images, open the editor and read the page ratio, then close. Silent mode, so no combination waits for a crop interaction.
Expected: nine combinations, each producing a page of the preset's ratio — 4:5, 1:1 and 1.91:1 — with the chosen image as the fill. Measured: 17.6 s for all nine.

**FCE-06 · browser · Qase 3886 · Only the chosen preset is offered in the Crop panel**
Steps: open the editor with Profile Photo, open the Crop panel's preset list. The panel is the `complementary` landmark titled "Crop".
Expected: exactly one preset, "Profile Photo (1:1)". The kit creates `ly.img.page.presets` itself and adds one asset to it, and installs no `PagePresetsAssetSource`, so the source holds only that preset. The editor resolves the crop-preset library to `ly.img.page.presets` when a page is selected, which is why the page-presets source is the right one here.

### 5.3 Editing

**FCE-07 · browser · Qase 3889 · The dock offers only Crop, Adjust, Filter and Shapes**
Steps: open the editor and read the dock.
Expected: a spacer, then four entries labelled Crop, Adjust, Filter and Shapes, with labels shown and large icons. Nothing else. Selecting the page shows no inspector bar and no canvas menu, because the kit's feature predicates return false when a page is selected.

**FCE-08 · browser · Qase 3730, 3737, 3760 · Crop, Adjust and Filter from the dock**
Steps: click Crop, then click it again. Click Adjust, change a slider, click Adjust again. Click Filter, pick a filter, click Filter again.
Expected: Crop toggles the edit mode between Crop and Transform. Adjust and Filter each close every other panel, select the page, set Transform mode, and open their floating inspector panel; a second click closes it. Each entry shows as selected while its panel is open. The slider and the filter change the page fill.

**FCE-09 · browser · Qase 3729 · The image cannot be replaced**
Steps: select the page and look for Replace, and for a fill-type or stroke change.
Expected: none is offered. The kit disables the `fill/change`, `fill/changeType` and `stroke/change` scopes on the page.

### 5.4 Export

**FCE-10 · browser · Qase 3742 · Export image**
Steps: open the actions dropdown in the navigation bar, click Export Image.
Expected: one download whose pixel dimensions match the page ratio of the chosen preset, and `spyExport` records one `image/png` call.
Note from the run: FCE-05 reads the page ratio right after `waitForEditorReady`, which returns before `applyForceCrop` has resized the page. It failed once that way and now polls the ratio instead of reading it once; the assertion is unchanged.

Note from the run: `ly.img.actions.navigationBar` has one child, so the editor renders it as its own navigation-bar button labelled "Export Images" rather than as a dropdown. The single-entry list is asserted in FCE-U5.

### 5.5 Unit cases (no browser, no engine)

Subject: `src/app/crop-presets.ts`, `src/app/sample-images.ts`, `src/imgly/index.ts` and `src/imgly/config/**`, the last two called with a spy `CreativeEditorSDK`.

**FCE-U1 · unit · Crop presets**
`DEFAULT_CROP_PRESETS` has three entries with ids `custom-portrait-post`, `custom-profile-photo` and `custom-shared-image`, ratios 4:5, 1:1 and 1.91:1, `type: 'FixedAspectRatio'`, `designUnit: 'Pixel'`, group `custom-ratio`, and icon and thumb URLs built from `DEMO_ASSETS_BASE_URL`.

**FCE-U2 · unit · Sample images and the asset base URL**
`SAMPLE_IMAGES` has three entries with the documented sizes and alt texts, each served from `DEMO_ASSETS_BASE_URL`. `DEMO_ASSETS_BASE_URL` falls back to the `staticimgly.com/.../starterkit-force-crop-editor` constant.
Note from the run: the `VITE_DEMO_ASSETS_BASE_URL` branch is not unit-tested — the module reads `import.meta.env` at import time, and re-importing it under a stubbed env would test Vite's env replacement rather than the kit. The dev server sets the variable, and every browser case proves the override works.

**FCE-U3 · unit · Editor initialization**
`initForceCropEditor` adds `PhotoEditorConfig` first, then the eight asset-source plugins, handed to `addPlugin` in one batch rather than one after another. It then calls `createFromImage` with the chosen image's `full` URL, sets `contentFillMode` Cover on the page, disables the `fill/change`, `fill/changeType` and `stroke/change` scopes, sets `page/moveChildrenWhenCroppingFill` true, clips the page and selects it. It calls `addLocalSource('ly.img.page.presets')`, adds the preset, and calls `applyForceCrop(page, { mode, presetId: preset.id, sourceId: 'ly.img.page.presets' })`. With no `mode` given, `always` is used. When `getCurrentPage` returns null the function returns before touching the asset source.

**FCE-U4 · unit · Dock entries and their handlers**
`setupDock` orders a spacer plus the four entries with keys `ly.img.crop`, `ly.img.adjustment`, `ly.img.filter` and `ly.img.vector.shape`. Invoking each `onClick` against a spy engine and UI: Crop toggles between Crop and Transform edit mode; Adjust and Filter close the panel when it is open, and otherwise call `closePanel('*')`, `setEditMode('Transform')`, `select(page)` and `openPanel(id, { floating: true })`. Each `isSelected` reads `isPanelOpen` for its own panel id. Every handler returns early when `getCurrentPage` is null.

**FCE-U5 · unit · Feature predicates**
`setupFeatures` sets predicates for `ly.img.canvas.menu` and `ly.img.inspector.bar`, and for nothing else, that return false when any selected block is a page and true otherwise, and enables exactly the ids in `features.ts`. `setupNavigationBar` puts an actions entry whose only child is `ly.img.exportImage.navigationBar`. `setupTranslations` sets the three library labels.
**FCE-U6 · unit · Engine settings**
`setupSettings` writes the documented interaction, page and placeholder settings, hides the page title (this kit shows one image and no page list) and leaves the colour picker unrestricted.

**FCE-U7 · unit · Actions**
`setupActions` overrides `exportDesign` and nothing else. Running the handler exports with the caller's options and downloads the first blob under the returned mime type.

**FCE-U8 · unit · UI orchestration**
`setupUI` docks the inspector and the asset library on the left and anchors both, puts the canvas bar at the bottom with the page controls only, gives the inspector bar a Crop-mode order of its own, and groups the photo effects under one appearance entry in Transform mode.

**FCE-U9 · unit · Keyboard and the unwired timeline**
`setupKeyboardShortcuts` installs the US ANSI catalog. `setupVideoTimeline` makes no call: this kit has no video mode and the helper ships unwired.

**FCE-U10 · unit · The configuration plugin**
`PhotoEditorConfig.initialize` resets the editor first, pins the compatibility version to the SDK version, then runs features, UI, actions, shortcuts, translations and settings, and registers one reset handler that runs without a subscription to drop. Without a `cesdk` it touches nothing.

**FCE-U11 · unit · `src/index.tsx`**
The entry mounts the app into `#root`, and fails loudly with `Root container not found` when the page ships no such element.

### 5.6 Component cases (jsdom)

**FCE-C1 · component · Selection screen**
`SelectionUI` renders the three cards, the three images and the three presets, prints a square preset as 1:1 and the others as their pixel ratio, marks only the current image, preset and mode, describes the chosen mode, and reports every choice the user makes.

**FCE-C2 · component · App state**
`App` starts on the first image, the first preset and Always; reports the `shell` demo phase, which is where this demo's automatic load ends; shows no editor until Open Editor is clicked; paints the container one animation frame before it mounts the editor; and keeps the preset and the mode when the image changes.

These cases use a hand-written `CreativeEditorSDK` mock (`tests/unit/editor-mock.ts`) rather than the harness `createApiSpy`: the spy answers every call with a proxy, so `getCurrentPage()`, `getEditMode()` and `isPanelOpen()` cannot take the branch a case is about.

**KB-01 · unit · Keyboard catalog predicates**

`tests/unit/keyboard-catalog.test.ts` runs every `run` and `when` of `src/imgly/config/keyboard/catalogs/us-ansi.ts` against 1620 editor states (5 edit modes, 9 selections, 3 roles, features on and off, 3 vector states, page and no page) and asserts that none throws, that every shortcut activates in at least one state, and that every function `run` reaches `cesdk.actions.run`. Kit-owned: the kit decides which key does what and when it is live. The catalog measures 100 % lines, branches and functions.

## 6. Entry and exit criteria

Entry: engine and editor built; test license available; the shared kit test harness exists; the kit's `test:unit` and `test:e2e` scripts replaced with the real commands. Browser cases take the `page` fixture rather than `kit`, because the editor exists only after Open Editor; they call the harness's exported `waitForEditorReady(page)` and `getEditor(page)`.

Exit: every case in section 5 passes locally and in CI. `npm run ci` passes. No test contacts the CDN. The published kit contains no test files. A release run reports results to the Qase ids above.

## 7. Known issues found while writing this plan

Confirm each with a test before fixing.

1. The README is the photo-editor kit's README. Its title is "Photo Editor Starter Kit", its hero alt text says "Photo Editor starter kit", and its Key Capabilities list promises "Background Removal – AI-powered, runs entirely in browser". This kit installs no background-removal plugin and its subject is force crop.
2. The comment above the force-crop block says "Remove all existing crop presets and add our custom one". The code removes nothing. The outcome is right — the kit installs no page-presets plugin, so `addLocalSource` creates an empty source — but the comment describes a call that is not there.
3. `src/index.tsx` sets no `window.cesdk`; `App.tsx` sets it inside `handleEditorInit`. That is correct for this kit, but it means the fleet's standard boot hook is absent until the user clicks Open Editor, and it is never cleared on close, so a reopen has to be waited for explicitly. Handled in the tests, not changed in the kit.
4. `src/index.tsx` has an empty comment block — "// Local assets for monorepo development" followed by a blank line with trailing whitespace — left from a removed line.
5. `handleEditorInit` is a `useCallback` over `selectedPreset`, `selectedMode` and `selectedImage`, but the selection screen stays mounted under the editor overlay. Changing a selection while the editor is open produces a new callback that `CreativeEditor` does not re-run, so the editor keeps the old configuration with no sign that the selection changed.
6. The kit has no `src/imgly/resolveAssetPath.ts` while every sibling kit in this batch ships one. It is not needed — the kit loads no local asset — but the folder shape differs from the convention.
7. The README's Architecture tree omits `config/keyboard/`.
8. `SelectionUI.tsx` asks for `styles.tall` on the first image, and `SelectionUI.module.css` has no `.tall` rule. `classNames` therefore writes the literal class `undefined`, and the first image renders the same size as the other two. Found by reading the rendered class list in FCE-01.
9. `PhotoEditorConfig` builds a `subscriptions` array, passes it to `setupOnReset` and never appends to it, so the `unsubscribe()` in the reset handler cannot run. It is scaffolding for a config that subscribes to engine events; this kit subscribes to none.
10. The image and preset cards on the selection screen are bare `div`s with an `onClick` and no role, so they are not keyboard-reachable and a test can only find them through the `<img>` they wrap. FCE-01, FCE-02, FCE-04 and FCE-05 therefore locate the card as the image's ancestor. The mode tabs are real `<button>`s and need none of this.

### Coverage residue

One line of `src/**` is left: the body of `subscriptions.forEach` in `setupOnReset` (`src/imgly/config/plugin.ts:127`). Unreachable by construction — nothing anywhere pushes into `subscriptions`, which the kit ships as the shape a customer fills in when their own setup registers a listener.

## 8. Open questions

1. Issue 1: rewrite the README for this kit. Recommendation: yes; the title and the capability list are wrong for a customer reading it.
2. Issue 5: hide or disable the selection screen while the editor is open, or re-init the editor when the selection changes. Recommendation: hide it — re-initialising would discard the user's edits.
3. **Resolved:** all nine stay. Closing and reopening the editor in one page brings the case to 17.6 s, so the cost the question was about is gone.
4. Issue 8: add the `.tall` rule, or drop the class. Recommendation: drop it — the grid reads fine without it, and a rule nothing references is the smaller surface.
5. Issue 9: make the image and preset cards `<button>`s. Recommendation: yes — it is the same edit that makes them keyboard-reachable and locatable by role.

## 9. Estimate

Measured on 5 Sep 2026: `npm run ci` exits 0 with 62 Vitest tests (53 unit, 9 component) and 10 browser cases. Merged coverage 99.58 % lines, 100 % branches, 100 % functions, reproduced on three consecutive runs. `tests/coverage-thresholds.json` gates the Vitest run at lines 95, statements 95, functions 96, branches 100; `tests/coverage-thresholds.merged.json` gates the merged report at lines 99, branches 100, functions 100.

Not covered, and why: `src/index.tsx` lines 35–36, the `throw` for a missing `#root`, which `index.html` always ships; and `src/imgly/config/plugin.ts` line 127, the `unsubscribe()` inside `setupOnReset`'s loop — the kit never appends to `subscriptions`, so the loop body is unreachable as shipped (known issue 10).

## 10. Boundary review

Rule used: the code that makes a decision owns the test for it. The kit decides the three presets, the three modes it offers, the sample images, the scene it builds with `createFromImage`, the scopes and settings it locks on the page, the four dock entries and their handlers, and the three feature predicates. The editor decides what `applyForceCrop` does in each mode, how the crop panel renders, and how a floating inspector panel opens. The engine decides what an export produces.

Core behaviour this plan leans on, and where it is covered today:

| Behaviour                                                                               | Owner  | Covered by                                                                                                     |
| --------------------------------------------------------------------------------------- | ------ | -------------------------------------------------------------------------------------------------------------- |
| `applyForceCrop` in `silent`, `always` and `ifNeeded` mode, and its four error paths    | editor | `apps/cesdk_web/packages/api/ui/UserInterfaceAPI.test.ts:2992` `describe('UserInterfaceAPI - applyForceCrop')` |
| `applyForceCrop` restores `page/allowResizeInteraction` and disables `ly.img.crop.size` | editor | same block, `mode: silent` and `mode: always`                                                                  |
| `cesdk.utils.export` and `downloadFile`                                                 | editor | `apps/cesdk_web/packages/api/utils/UtilsAPI.test.ts`                                                           |
| A feature predicate registered with `feature.set` overrides an earlier `enable`         | editor | `apps/cesdk_web/packages/api/features/FeatureAPI.test.ts`                                                      |
| Applying an asset to a block                                                            | engine | `engine/lib/test/api/UBQApplyAssetCreationDeepAPITest.cpp`, `AssetSourceAPITest.cpp`                           |

Core coverage gaps found (candidates to add in the core suites, not in this kit):

1. Editor: `cesdk.createFromImage` has no test. It is the call that builds this kit's whole scene — a page sized to the image with the image as its fill — and it appears only in `apps/cesdk_web/packages/cesdk/index.tsx`. Qase 3757 depends on it. Suggested home: `apps/cesdk_web/packages/cesdk/`.
2. Editor: the crop-preset library's source resolution. `registerDefaultAssetLibraryEntries.ts` picks `ly.img.page.presets` for a page, an empty list for a non-rectangular shape, and `ly.img.crop.presets` otherwise. No test covers the three branches, and getting it wrong is invisible until a customer sees an empty crop panel. Qase 3886 depends on it. Suggested home: next to that module.
3. Editor: `@cesdk/core-configs-web` had no tests and no `test` script. Closed on this branch by `packages/cesdk-core-configs-web/src/editorConfigs.test.ts`. This kit uses its own copy of the photo-editor configuration rather than that package, so the new suite does not cover the copy; recorded once in the `starterkit-photo-editor` plan.

Until gaps 1 and 2 are closed, FCE-03 and FCE-06 keep their scene and panel assertions as the end-to-end proof.
