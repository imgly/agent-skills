# Test plan: starterkit-placeholders

Version 7, 7 Sep 2026. Status: implemented. 54 unit, 9 component and 5 headless cases plus 9 browser cases run in `npm run ci` (exit 0); Vitest coverage is 100 % on all four metrics. Version 5 adds the component cases PLC-C1 to PLC-C3, the unit case PLC-U14 and the browser case PH-07. Merged coverage is 100 % on lines, branches and functions too, see section 5.5. The browser suite was also run in static mode (`KIT_TEST_BASE_URL_ROOT`) and passes there, see open question 1.

## 1. Purpose

Verify that the Placeholders starter kit works as shipped: the Creator role can define placeholders on a template, the Adopter role can change only what those placeholders allow, and switching roles keeps the design.

## 2. Scope

In scope

- `src/imgly/index.ts` — the two init functions: role, theme, config plugin, asset sources
- `src/imgly/config/advanced-design-editor/` and `config/design-editor/` — the feature sets that differ between the roles
- `src/app/App.tsx` — role switching and the in-memory scene snapshot
- `src/app/RoleSwitcher/` — the segmented control
- `public/example.scene` — the shipped template and its placeholder configuration

Out of scope

- What a role and a placeholder flag allow. Engine behaviour; see section 10.
- The editor UI itself, including the placeholder controls in the inspector. Covered by the core editor suite.
- The demo site around the kit. Covered by the `cesdk_web_demos` suite. Qase 939, 940, 941, 942, 943, 958, 967, 2447.

## 3. Test environment

- Headless: `@cesdk/node` through the shared harness engine helper. Node, no DOM. The scene loads from `public/` over `file://`.
- Browser: Chrome, headless, 1400 × 900. Requests to `cdn.img.ly` fail the test.
- License: the shared test license (valid on hostname `localhost` only)
- Data: `public/example.scene`. One page **named** `Background` holding `Image 1`, an unnamed shape, an unnamed text block, `Image 2` and `Image 3`. (Corrected on the first run: `Background` is the page itself, not a child block.)
- No `cdnAllowlist`. The template's Notable typeface and emoji font URIs are relative to the engine's `baseURL`, so the suite runs with the CDN guard at its default.
- Downloads: captured by Playwright and checked by file type and PDF page count

## 4. Approach

| Kind     | Tool                          | What it checks                                                                       | Run                 |
| -------- | ----------------------------- | ------------------------------------------------------------------------------------ | ------------------- |
| Static   | tsc, eslint, convention check | Types, deprecated APIs, kit folder shape                                             | `npm run check:all` |
| Unit     | Vitest                        | The two editor configs, no engine                                                    | `npm run test:unit` |
| Headless | Vitest + `@cesdk/node`        | The shipped template's placeholder configuration and the role difference it produces | `npm run test:unit` |
| Browser  | Playwright                    | The test cases in section 5.1                                                        | `npm run test:e2e`  |

All four run in the kit's `ci` script. Browser tests use role and label locators only.

## 5. Test cases

Format: ID, Qase ids, title. Then steps and expected result.

### 5.1 Browser

Common precondition: the kit is open and the scene has loaded and auto-fitted.

**PH-01 · Qase 983, 1115 · Default state**
Steps: open the kit.
Expected: a Creator and an Adopter button above the editor, Creator active. The editor uses the dark theme and `editor.getRole()` returns `Creator`. The navigation bar shows undo/redo, zoom, an "Export Images" button and the Actions dropdown. No console errors. No engine asset from the CDN.
Note from the run: the navigation bar carries no page-resize button — `ly.img.page.resize` is not among the enabled features — and `ly.img.exportImage.navigationBar` is rendered directly in the bar rather than inside the dropdown.

**PH-02 · Qase 4684 · An element with no placeholder**
Steps: in Creator, add a shape to the canvas. Switch to Adopter.
Expected: the shape is still on the canvas after the switch, and the Adopter is allowed none of `editor/select`, `layer/move`, `fill/change`, `lifecycle/destroy` on it.

**PH-03 · Qase 4685 · An element marked as a placeholder**
Steps: in Creator, add a shape, mark it as a placeholder and allow its fill to change. Switch to Adopter.
Expected: the Adopter is allowed `editor/select` on it and nothing else from the probed set, and `setSelected` puts exactly that block in the selection.
Note from the run: a colour-filled shape does not gain `fill/change` from the placeholder flag; the image blocks in the shipped template do. `editor/select` is the scope the flag adds for every block kind, and it is what "cannot be selected" in Qase 4684 means.

**PH-04 · Qase 4686 · Changing a placeholder scope**
Steps: switch back to Creator, allow a further operation on the same element, switch to Adopter.
Expected: the newly allowed operation (`layer/move`) is available and the previously blocked ones (`lifecycle/destroy`) stay blocked.

**PH-05 · The role switch keeps the design**
Steps: make an edit in Creator, switch to Adopter, switch back.
Expected: the edit survives both switches. The editor is remounted each time, in the light theme for Adopter and the dark theme for Creator.

**PH-06a · Qase 4687, 957 · Export an image from Adopter**
Steps: in Adopter, click "Export Images" in the navigation bar.
Expected: a PNG downloads whose aspect ratio matches the page.
Note from the run: split from PH-06b because the editor's export progress dialog covers the navigation bar until it closes. `ly.img.exportImage.navigationBar` runs `exportDesign` with no target size, so the file comes out at the page's own size.

**PH-06b · Qase 4687, 956 · Export a PDF from Adopter**
Steps: in Adopter, open the Actions dropdown and run Export PDF.
Expected: the dropdown holds exactly one entry, Export PDF, and it downloads a one-page PDF.

### 5.2 Headless

**PH-H1 · The shipped template loads**
Steps: load `public/example.scene`.
Expected: one page named `Background` whose children are, in order, `Image 1` (image), an unnamed shape, an unnamed text, `Image 2` and `Image 3`.

**PH-H2 · Qase 4685 · The template's placeholder configuration**
Steps: read `isPlaceholderEnabled` for every block on the page.
Expected: every block on the page is a placeholder, and so is the page itself. This pins the kit's data, which the whole Adopter story depends on.
Note from the run: the plan expected `Background` not to be a placeholder. `Background` is the page, and it carries the flag as well, so PH-H3 turns the flag off on one image to get a non-placeholder block to compare against.

**PH-H3 · Qase 4684, 4685 · The two roles differ on the shipped template**
Steps: with the scene loaded, set the role to `Creator` and record `isAllowedByScope` for the placeholder blocks and for `Background`. Repeat for `Adopter`.
Expected: Creator allows the same operations on both. Adopter allows the placeholder block `editor/select` and `fill/change`, and the block whose flag was turned off only `fill/change`. (The rule itself is engine behaviour; this case pins that the shipped scene actually exercises it. See section 10, gap 1.)

**PH-H4 · The snapshot round-trip**
Steps: save the scene to a string, load it back (the harness engine is a process-wide singleton, so the reload runs on the same engine), read the placeholder flags again.
Expected: identical to PH-H2. This is the path the role switch uses.

**PH-H5 · Qase 4686 · Changing a placeholder flag survives the round-trip**
Steps: turn `isPlaceholderEnabled` off on `Image 1`, save to a string, reload.
Expected: `Image 1` is no longer a placeholder and the other two still are.

### 5.3 Unit

**PH-U1 · The two init functions**
Steps: call `initPlaceholdersCreatorEditor` and `initPlaceholdersAdopterEditor` with a recording double. `@cesdk/cesdk-js` and `@cesdk/cesdk-js/plugins` are replaced with stubs, because both reach `window` at import time.
Expected: the Creator path adds `AdvancedEditorConfig`, sets the dark theme and sets the role to `Creator`; the Adopter path adds `DesignEditorConfig`, sets the light theme and sets the role to `Adopter`. Both add the same asset sources with the same nine page-preset includes. The asset sources go in through one `Promise.all`: a case holds every `addPlugin` open and checks all of them were requested before any of them resolved.

**PH-U2 · The feature difference**
Steps: call `setupFeatures` of both configs with a recording double.
Expected: both lists are asserted whole, 129 ids for the advanced config and 100 for the design config. The advanced config enables the `ly.img.placeholder.*` options, the Act as Placeholder and Edit Text ones among them; the design config enables no `ly.img.placeholder` id at all. This is the kit's central decision and the only feature-level difference the two roles rely on.

**PH-U3 · The navigation bars**
Steps: call `setupNavigationBar` of both configs.
Expected: both produce the same order, ending in an Actions dropdown whose children are exactly `ly.img.exportImage.navigationBar` and `ly.img.exportPDF.navigationBar` (see known issue 6).

**PH-U4 · The export actions**
Steps: call `setupActions` of both configs with a recording double.
Expected: both register `saveScene`, `exportDesign`, `importScene`, `exportScene` and `uploadFile`, and neither registers `exportImage` — the navigation bar never reached it (see PH-06a), so the fleet sweep deleted it.

**PLC-U10 to PLC-U13 · The two editor configuration trees**
Both trees are asserted with the same cases, so a change to one that is not made to the other shows up. PLC-U10 `setupUI`: the design editor docks the inspector left and the advanced editor docks it right, both dock the asset library left and neither floats, panels are set before any bar, the canvas bar sits at the bottom, Transform, Text and Vector each get their own canvas menu, the transform inspector bar ends with the inspector toggle, and the dock lists templates, text and upload. PLC-U11: neither tree registers a custom component, adds a translation or configures a video timeline, both install one shortcut catalog, and both turn `placeholderControls/showOverlay` and `showButton` on. PLC-U12 `initialize`: `resetEditor` first, the editor compatibility version pinned to the config's own version second, every setup step reached, `ui.setView('advanced')` in the advanced tree only, and nothing at all without a `cesdk`. PLC-U13 the five registered actions and their handlers, including that the import picker takes `.imgly,.scene,.zip` and releases its object URL even when the load throws.

These exist because merged **function** coverage is decided by the Vitest lane alone, so no browser case can reach a `setup*` function.

### 5.4 Component cases (jsdom, editor mocked at the component boundary)

**PLC-C1 · The first mount**
`App` hands the instance to the role's init function and loads the scene from the URL, then auto-fits the page and posts the demo lifecycle beacon `created` then `ready`; the editor's `onLoadingStateChange` is the beacon's own handler. It starts in Creator, so only the Creator configuration runs.

**PLC-C2 · Switching role**
The kit saves the design to a string before it remounts and restores it on the new instance, so a role switch keeps the work. Three failure and repeat paths: a snapshot that will not load falls back to the URL scene; a design that cannot be saved is dropped and the switch still happens; the snapshot is consumed once, so a second switch saves again.

**PLC-C3 · The entry point**
`src/index.tsx` names the user, takes the license and base URL from the environment, and mounts once. With no `#root` in the document it throws `Root container not found` rather than failing silently.

**PLC-U14 · removed.** `resolveAssetPath` is gone; `src/imgly/demo-assets.ts` derives the URL from `VITE_DEMO_ASSETS_BASE_URL` or the kit's own URL.

### 5.5 Coverage remainder

`npm run ci` reports 100 % lines, 100 % branches and 100 % functions in the Vitest lane and the same three figures in the merged report.

The residue this section carried in version 6 is gone. `merge-coverage.mjs` now sums every browser dump instead of keeping the alphabetically last one, so the `importScene` handler of each configuration tree is credited to PH-07, which runs both in the browser. It also takes the line denominator from the Vitest statement map, so comment and blank lines no longer enter the report.

**Carried, not deleted: `ui/videoTimeline.ts` in both trees.** Neither `ui/index.ts` imports or re-exports it and its body is `void cesdk`, so it looked like dead code — but the shared `@cesdk/core-configs-web` preset ships that exact file with the same commented-out import, and 48 kit config trees carry the identical orphan. Dropping it is a decision for whoever owns the shared preset, not for one kit; `scripts/check-kit-conventions.mjs` reports the divergence ("is missing ui/videoTimeline.ts") when a kit deletes it. Unreachable by construction, and covered in the Vitest lane by PLC-U11, which asserts it configures nothing.

**KB-01 · unit · Keyboard catalog predicates**

`tests/unit/keyboard-catalog.test.ts` runs every `run` and `when` of `src/imgly/config/advanced-design-editor/keyboard/catalogs/us-ansi.ts`, `src/imgly/config/design-editor/keyboard/catalogs/us-ansi.ts` against 1620 editor states (5 edit modes, 9 selections, 3 roles, features on and off, 3 vector states, page and no page) and asserts that none throws, that every shortcut activates in at least one state, and that every function `run` reaches `cesdk.actions.run`. Kit-owned: the kit decides which key does what and when it is live. The catalog measures 100 % lines, branches and functions.

## 6. Entry and exit criteria

Entry: engine and editor built; test license available; the shared kit test harness exists (headless engine helper, browser boot helper, download helper, console and network guards). The kit already sets `window.cesdk`, and re-sets it on every remount.

Exit: every case in section 5 passes locally and in CI. `npm run ci` passes. The published kit contains no test files. A release run reports results to the Qase ids above.

## 7. Known issues found while writing this plan

Confirmed by reading the code. Confirm each with a test before fixing.

1. The role switch remounts the editor and restores the design only from `savedSceneStringRef`. If `scene.load` of that snapshot throws, the `catch` silently loads the original demo scene, so the user's work disappears with no message.
2. If `saveToString` throws while switching, `savedSceneStringRef` is set to `null` and the next mount loads the demo scene, again silently.
3. `handleRoleChange` awaits the save but the remount is a React state update. An engine operation still in flight at switch time is lost.
4. The `RoleSwitcher` buttons carry no `aria-pressed` and no `role="tab"`. The selected state is a CSS class only, so the control has no accessible state and browser tests must assert on the class.
5. `(window as any).cesdk = cesdk` is assigned on every init under a "remove in production" comment and ships that way.
6. Both roles use the same navigation bar, so an Adopter gets Page Resize and can change the template's page size, which the Creator/Adopter split is meant to prevent.
7. `resolveAssetPath.ts` sits at `src/`, outside both `src/app/` and `src/imgly/`, unlike every other kit in this batch.
8. `vite.config.ts` sets the `.scene` content type in a dev-server middleware only. The bundled output has no equivalent, so a static host that serves `.scene` as something else is not covered by the kit.

## 8. Open questions

1. **Answered.** `serve`, the static server CI runs, sends **no** `Content-Type` header at all for `.scene` (only `Content-Length`, `Content-Disposition: inline` and `ETag`). The whole browser suite was run against a built bundle served that way and all seven cases pass, so the engine does not depend on the header. The dev-server middleware in `vite.config.ts` is therefore not load-bearing and stays as it is; nothing moves into the build.
2. Issues 1 and 2: the silent fallback to the demo scene loses work. Recommended: keep the fallback but show a message, and keep the snapshot until the restore has succeeded.
3. Issue 6: should the Adopter navigation bar drop Page Resize? Recommended: yes, and make the two `navigationBar.ts` files differ, which is also what makes PH-U3 worth having. Not decided for S4; PH-U3 pins that both bars are identical and that `ly.img.pageResize.navigationBar` is in both. It never renders today, because `ly.img.page.resize` is not enabled in either config.

## 9. Estimate

6 browser cases at about 15 s each (two of them remount the editor twice): about 90 s on one worker. 5 headless cases at about 2 s: 10 s. Unit tests: under 1 s.

## 10. Boundary review

Rule used: the code that makes a decision owns the test for it. The kit decides which role each mode sets, which theme, which config, which features, the shipped template and its placeholder configuration, and how the design survives a role switch. The engine decides what a role and a placeholder flag allow.

Core behaviour this plan leans on, and where it is covered today:

| Behaviour                                                                   | Owner  | Covered by                                                                             |
| --------------------------------------------------------------------------- | ------ | -------------------------------------------------------------------------------------- |
| `setPlaceholderEnabled` / `isPlaceholderEnabled` round-trip and error cases | engine | `engine/lib/test/api/PlaceholderAPITest.cpp`                                           |
| Placeholder flags survive save and load                                     | engine | `engine/lib/test/api/AppearanceRoundTripAPITest.cpp`                                   |
| `editor.setRole` changes the effective scopes                               | engine | `engine/lib/test/api/EditorAPITest.cpp`, `ScopesAPITest.cpp`, `ScopeMatrixAPITest.cpp` |
| `isAllowedByScope` for a given scope and block                              | engine | `engine/lib/test/api/ScopesAPITest.cpp`, `ScopeMatrixAPITest.cpp`                      |
| `resetEditor` re-applies the current role                                   | editor | `apps/cesdk_web/packages/cesdk/resetEditor.test.ts`                                    |
| `feature.enable` with glob patterns                                         | editor | `apps/cesdk_web/packages/cesdk/stores/FeatureStore.test.ts`                            |
| `ui.setTheme`, `ui.setComponentOrder`                                       | editor | `apps/cesdk_web/packages/api/ui/UserInterfaceAPI.test.ts`                              |
| `block.export` to PNG and PDF                                               | engine | `engine/lib/test/api/ExportAPITest.cpp`                                                |

Core coverage gap found, and closed on this branch:

1. Engine: the Adopter role plus a placeholder flag is what actually gates editing. `engine/lib/test/api/PlaceholderAPITest.cpp` now owns the combination in `AdopterRoleGatesSelectionOnPlaceholderFlag`, `CreatorRoleAllowsSelectionRegardlessOfPlaceholderFlag` and `ClearingPlaceholderFlagRevokesAdopterSelection`, beside `SetPlaceholderEnabledInAdopterRoleDoesNotChangeBlockScope` and `SetRoleUnknownRoleIsRejected`.

PH-H3 keeps a direct scope comparison on the shipped scene as this kit's end-to-end proof, and PH-02 and PH-03 keep their canvas assertions.
