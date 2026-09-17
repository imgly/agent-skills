# Test plan: starterkit-form-based-template-adoption

Version 7, 7 Sep 2026. Status: implemented. 65 unit, 8 headless, 30 component and 14 browser cases run in `npm run ci` (exit 0). Known issue 7 is fixed. Version 5 raised the kit to **Vitest 100 % lines, branches and functions**; the merged report now reads **100 % lines, branches and functions** too, see section 5.8.

## 1. Purpose

Verify that the Form-Based Template Adoption starter kit works as shipped: the editor opens with a locked-down canvas and an Edit Template panel, the panel lists exactly the image, text and color properties the template exposes, and editing a form field changes the design.

## 2. Scope

In scope

- The template traversal in `src/imgly/plugins/form-based-template-adoption.ts`: which blocks become image, text and color properties, how they are grouped and ordered
- The Edit Template panel: image replace, text input and text area, color inputs
- The locked-down UI: no dock, no inspector bar, no canvas bar, no selection, no zoom or scroll
- Editor start-up with the demo scene archive
- The kit's own code under `src/imgly/` and `src/index.ts`

Out of scope

- Core editor features reached through this kit (color picker internals, undo, export dialog). Covered by the core editor suite.
- The demo site around the kit (cards, tags, links, platform toggles). Covered by the `cesdk_web_demos` suite. Qase 2628, 2629, 2630, 2631, 2645, 2654, 2662, 2663.

## 3. Test environment

- Browser: Chrome, headless, 1400 × 900
- Engine and editor: built from this repo, served locally. Requests to `cdn.img.ly` for engine assets fail the test.
- License: the shared test license (valid on hostname `localhost` only)
- Data: the demo scene, served from the in-repo copy at `packages/cesdk-web-examples-data/data/starterkit-form-based-template-adoption/cases/form-based-template-adoption/scene/scene.scene` via `VITE_DEMO_ASSETS_BASE_URL`. Never from the CDN.
- Headless: `@cesdk/node`, scenes built in the test itself. No archive, no network.
- Readiness hook: `window.cesdk`, set in `src/index.ts` before the scene loads. Wait for the panel heading, not for the hook alone.
- Console allowlist: none. Every case must produce a clean console.

## 4. Approach

| Kind     | Tool                          | What it checks                           | Run                 |
| -------- | ----------------------------- | ---------------------------------------- | ------------------- |
| Static   | tsc, eslint, convention check | Types, deprecated APIs, kit folder shape | `npm run check:all` |
| Unit     | Vitest                        | Block grouping and ordering, no engine   | `npm run test:unit` |
| Headless | Vitest + `@cesdk/node`        | Traversal against a real engine scene    | `npm run test:unit` |
| Browser  | Playwright                    | The test cases in section 5              | `npm run test:e2e`  |

The traversal helpers now live in `src/imgly/plugins/template-properties.ts` and `uploadFile` builds its file input on first use, so the headless cases import the traversal directly and the plugin module loads outside a browser.

## 5. Test cases

Format: ID, Qase id, title. Then steps and expected result.
Common precondition for browser cases: the kit is open and the Edit Template panel is visible.

### 5.1 Start-up and locked-down UI

**FTA-01 · Qase 2628 · Editor loads with the Edit Template panel**
Steps: open the kit.
Expected: the template is on the canvas. A panel titled "Edit Template" is open with sections Image, Text and Color. No dock, no inspector bar, no canvas bar. No console errors. No engine asset from the CDN.

**FTA-02 · Qase 2658 · The canvas cannot be edited directly**
Steps: click a text block on the canvas. Double-click it.
Expected: nothing is selected (`editor/select` is denied), no text cursor appears, the panel does not change.

**FTA-03 · Panel cannot be closed** (no Qase case yet)
Steps: look for a close control on the panel. Press Escape.
Expected: the panel has no close button and stays open. The kit opens it with `closableByUser: false`. See boundary review, gap 1.

**FTA-04 · Zoom and scroll are off** (no Qase case yet)
Steps: scroll the mouse wheel over the canvas. Pinch-zoom.
Expected: the zoom level does not change. `engine.scene.getZoomLevel()` is the same before and after.

### 5.2 Image section

**FTA-05 · Qase 2668, 2669, 2670 · Every template image appears once and can only be replaced**
Steps: read the Image section.
Expected: one preview per image **property** — the kit groups blocks by name, so two blocks sharing a name are one entry — and the only control per entry is the replace action. No delete, no add.
Note: corrected after the run — the demo template has two qualifying image blocks under one name, so the panel shows one preview. The case counts name groups, which is the kit's decision.

**FTA-06 · Qase 2669 · Replacing an image updates the block fill**
Steps: click the replace action, choose a local PNG through the file chooser.
Expected: the block's image source set points at a `blob:` URL for the picked file.

### 5.3 Text section

**FTA-07 · Qase 2633 · Every editable text block appears with its sample text**
Steps: read the Text section.
Expected: one field per editable text block, named after the block, pre-filled with the block's current text.

**FTA-08 · Qase 2634 · Single-line fields can be edited**
Steps: type into the Headline field.
Expected: the canvas text changes to the typed value.

**FTA-09 · Qase 2672, 2674, 2675 · The Body field is a text area, takes multiple lines and stays one when emptied**
Steps: read the field for the block whose text contains a line break. Type two lines into it, then clear it.
Expected: it is a `textarea`, both lines reach the canvas block, and it is still a `textarea` after being emptied — the kit decides input vs text area once, when the scene loads.
Note: FTA-10 and FTA-11 of version 1 are one case here; they share a field and a set-up.

**FTA-10 · Qase 2635, 2673 · Emoji reach the canvas**
Steps: type an emoji into a single-line field.
Expected: the emoji is stored in the block text.

### 5.4 Color section

**FTA-11 · Qase 2636 · Each color is a separate input**
Steps: read the Color section.
Expected: more than one color input, labelled `Color 1`, `Color 2`, … with no gap, and each showing its hex value.
Note: corrected after the run — the case no longer restates which blocks form a group. That is the kit's traversal and FTA-H3 covers it against a real engine; here the question is that each group renders as its own numbered input. The hex is rendered with a leading space, so the case matches it inside the label rather than as the whole text.

Qase 2637, 2638 and 2655 ask whether the picker's saturation field, hue slider and RGB fields change the color. Those are editor controls, not kit code, and FTA-12 already proves the kit's `setValue` applies whatever the picker returns. They are marked core in section 10 and are not repeated here.

**FTA-12 · Qase 2652, 2649 · A color applies to its whole group and leaves the alpha alone**
Steps: open Color 1 and type a hex value.
Expected: the blocks of that group take the new RGB, and every block keeps the alpha it came with. The kit reads every color as fully opaque and writes back the block's original alpha, so opacity cannot be changed from the panel. Current behaviour; see known issue 2 and open question 2.

### 5.5 Export

**FTA-13 · Qase 2644 · Export image**
Steps: click Export Images in the navigation bar.
Expected: at least one PNG download.
Note: corrected after the run — the first child of the actions group renders as its own navigation-bar button, so Export Images is not inside the menu.
Asserts the options the kit passes to `engine.block.export` and that a file of the declared type downloaded; the exported pixel size belongs to `engine/lib/test/api/ExportAPITest.cpp`.

**FTA-14 · Qase 2643 · Export PDF**
Steps: open the actions menu, click Export PDF.
Expected: one PDF download.
Asserts the options the kit passes to `engine.block.export` and that a file of the declared type downloaded; the exported pixel size belongs to `engine/lib/test/api/ExportAPITest.cpp`.

### 5.6 Unit tests (no engine)

**FTA-U1 · Grouping blocks into editable properties**
Inputs to `BlocksToEditableProperties`, given a stub that returns fixed names:
two blocks named `Headline` → one property with both blocks. Two blocks with different names → two properties, input order preserved. A block with no name → one property whose name is the block id as a string. An empty list → an empty result.

**FTA-U2 · Ordering by distance to the top left**
`orderBlocksByDistanceToTopLeft` with a stub returning fixed positions: `(300,0)`, `(0,0)`, `(100,100)` → `(0,0)`, `(100,100)`, `(300,0)`. Two blocks at the same distance keep their input order. An empty list → an empty result.

Note from the 1.82 run: the kit's panel is a `complementary` landmark named Edit Template. It used to be a `region` named after the panel id, `form-based-adaption`. The canvas locator also needs `exact: true`, because the two canvas bars are regions whose names contain Canvas.

**FTA-U3 · Editor configuration**
`initFormBasedTemplateAdoption` against a fake `cesdk`: role is `Creator`, theme is `light`, `ly.img.dock` and `ly.img.page.resize` are disabled, the inspector bar, dock and canvas bar orders are empty, the navigation bar holds undo/redo, a spacer and an actions group with the image and PDF export buttons, and `editor/select` is denied. The fourteen asset sources go in through one `Promise.all`: a case holds every `addPlugin` open and checks all fourteen were requested before any of them resolved and before the adoption plugin was reached.

### 5.7 Headless tests (`@cesdk/node`, scene built in the test)

**FTA-H1 · Which blocks become image properties**
Scene: a graphic with an image fill and `fill/change` enabled; a graphic with an image fill and `fill/change` disabled; a graphic with a color fill; a text block.
Expected: only the first is returned.

**FTA-H2 · Which blocks become text properties**
Scene: a text block with `text/edit` enabled; a text block with `text/edit` disabled; a graphic.
Expected: only the first is returned.

**FTA-H3 · Color grouping**
Scene: two graphics with the same fill color at different alphas; one graphic with a stroke in a third color; one text block with a single text color; one text block with two text colors; one graphic with an image fill.
Expected: the two fills form one group with `initialOpacity` per block and `a: 1` on the group color. The stroke is its own group. The single-color text is its own group. The two-color text block and the image fill produce no group. A text block never appears in the fill-color list.

**FTA-H4 · Text area vs text input** — dropped as a headless case. The `expanded` predicate is an inline callback inside the plugin's scene handler, not an exported function, so a headless test would have to restate it. FTA-09 covers the behaviour where it is visible.

**FTA-H5 · Relocating transient resources**
Scene: a buffer made with `engine.editor.createBuffer`, filled with `setBufferData` and referenced by an image fill, so it shows up in `findAllTransientResources()`.
Expected: after `relocateResourcesToBlobURLs` the buffer is no longer transient and the fill's URI is a `blob:` URL. A scene with no transient resource is left untouched.
Note: corrected after the run — a bare buffer is not transient until a block references it, and a relocated resource drops out of `findAllTransientResources()` rather than appearing there as a `blob:` URL. The bundle-skip branch cannot be built through the public API, so it stays a unit case: a fake `engine.editor` returning one `bundle://ly.img.cesdk/…` resource and one other, asserting `relocateResource` runs only for the second.

**FTA-U9 to FTA-U13 · The editor configuration**
Each `setup*` module against a recording spy, asserting what the kit decides rather than what CE.SDK then does. FTA-U9 features: one `feature.enable` call, no `feature.disable`, and exactly the 109 ids of `features.ts` asserted as the whole array, each navigation and text control named on its own (`ly.img.navigation.bar`, `ly.img.text.edit`) rather than through the `ly.img.navigation` or `ly.img.text` parent, and no video feature. FTA-U10 settings: `placeholderControls/showOverlay` and `showButton` on, which is what the form drives, plus the seven other written settings. FTA-U11 `setupUI`: panels left and docked and set before any bar, the preview button in the navigation bar, the canvas bar at the bottom, Transform, Text and Vector each with their own canvas menu, the dock listing templates, text and upload, the transform inspector bar ending with the inspector toggle, and no custom component. FTA-U11 also pins that the kit configures no video timeline and does not re-export `setupVideoTimeline`. FTA-U12 one shortcut catalog and no kit translation. FTA-U13 `DesignEditorConfig.initialize`: `resetEditor` first, the editor compatibility version pinned to `CreativeEditorSDK.version` second, every setup step reached, and nothing at all without a `cesdk`.

These exist because merged **function** coverage is decided by the Vitest lane alone, so no browser case can reach a `setup*` function.

**FTA-U26 · The actions the kit registers**
The five handlers `setupActions` installs, driven through a recording spy: `saveScene` downloads plain text, `exportDesign` passes the caller's options straight through, `importScene` offers one picker for `.imgly,.scene,.zip` and releases its object URL, `exportScene` picks the zip or the text path by format, and `uploadFile` goes through the SDK's local upload helper.

**FTA-U14 to FTA-U16 · Colours and loading (`tests/unit/color-properties.test.ts`)**
`readCurrentColor` for each of the three sources and for a spot colour it cannot read; `getAllColors` grouping fill, stroke and text sources of one colour together, keeping each block's own opacity, skipping non-RGBA colours and a text block whose runs disagree, and never reading a text block as a fill source; `waitUntilLoaded` forcing the whole scene to load.

**FTA-U17 to FTA-U24 · The plugin (`tests/component/adoption-plugin.test.ts`)**
The plugin is driven against a fake editor, which is what makes every branch reachable without a browser. FTA-U17 the lock-down: scroll, zoom and page title off, the inspector bar, dock and canvas bar emptied, only image and PDF export left in the navigation bar, selection denied, the panel title translated in English and German, the panel opened and not closable, and nothing at all without a `cesdk`. FTA-U18 the resize observer zooms the scene to fit and disconnects once the engine has no scene. FTA-U19 the scene is prepared exactly once: everything deselected, a fresh history so the setup is not undoable. FTA-U20 the form: an Image, a Text and a Color section in that order, the image action named after the block, the image URI fallback when a block carries no source set, a text area for a multi-line block, an edited value written to every block sharing the name, and nothing at all when the scene has no page. FTA-U21 a colour change written through `setColor`, `setStrokeColor` or `setTextColor` by source type, each at that block's own opacity. FTA-U22 `uploadFile`: one hidden picker limited to the given types, reused across calls, and rejecting when the picker reports no files. FTA-U23 replacing an image clears the old fill before adding the chosen file, and reports a failure instead of leaving the preview loading. FTA-U24 a single-line block gets a text input.

**FTA-U25 · The entry point (`tests/component/entry.test.ts`)**
The kit creates the editor on `#cesdk_container`, configures it, loads `cases/form-based-template-adoption/scene/scene.scene` from `DEMO_ASSETS_BASE_URL`, posts the demo lifecycle beacon `created` then `ready`, falls back to the published demo assets when the environment names none, and logs a failed start-up and posts `failed` instead of leaving an unhandled rejection.

### 5.8 Coverage remainder

`npm run ci` reports 100 % lines, branches and functions in the Vitest lane and the same three figures in the merged report.

The residue this section carried in version 6 is gone. `merge-coverage.mjs` now takes the line denominator from the Vitest statement map wherever Vitest measured a file, so the comment and blank lines it listed no longer enter the merged report, and it sums every browser dump instead of keeping the alphabetically last one, which credits `uploadFile` to FTA-06.

One entry from that list stands as a product observation rather than a coverage question. Nothing in this kit reaches Import: the plugin replaces the navigation bar with export-only, and the shipped shortcut catalog maps only `saveScene` and `exportScene`. The `importScene` registration is not dead. It is the shared configuration a customer wires back in, so it is kept, and FTA-U26 covers the handler.

**`src/imgly/config/ui/videoTimeline.ts` is kept, not deleted.** Nothing in the kit imports it — `ui/index.ts` carries the import and the call commented out — so it looked like dead code and was deleted, then restored. It is not kit-authored: `packages/cesdk-core-configs-web/src/design-editor/ui/videoTimeline.ts` ships the identical file with the identical commented-out import, and 37 starter-kit config trees vendor it. Dropping it is a fleet decision for whoever owns the preset. FTA-U11 covers its three lines and pins that a design kit configures no video timeline.

**KB-01 · unit · Keyboard catalog predicates**

`tests/unit/keyboard-catalog.test.ts` runs every `run` and `when` of `src/imgly/config/keyboard/catalogs/us-ansi.ts` against 1620 editor states (5 edit modes, 9 selections, 3 roles, features on and off, 3 vector states, page and no page) and asserts that none throws, that every shortcut activates in at least one state, and that every function `run` reaches `cesdk.actions.run`. Kit-owned: the kit decides which key does what and when it is live. The catalog measures 100 % lines, branches and functions.

## 6. Entry and exit criteria

Entry: engine and editor built; test license available; the shared kit test harness exists (boot helper, file-chooser helper, console and network guards); the traversal helpers are importable without a DOM (done, open question 1).

Exit: every case in section 5 passes locally and in CI. `npm run ci` passes. The published kit contains no test files. A release run reports results to the Qase ids above.

## 7. Known issues found while writing this plan

Fixed in the S6 fleet sweep: the unreachable `exportImage` action, which no UI reached because `ly.img.exportImage.navigationBar` runs `exportDesign`, was deleted, and `setupPanels` now uses the editor's real asset library panel id `//ly.img.panel/assetLibrary` in place of `//ly.img.panel/assets`. FTA-U3 gained a case for the first.

Confirm each with a test before fixing.

1. The replace action never shows its loading state. `uploadState` is set to `false` after the upload finishes but never to `true` before it starts.
2. The color picker's opacity slider does nothing. `readCurrentColor` forces `a: 1` and `setValue` writes back `initialOpacity`, so Qase 2649 as written cannot pass.
3. The panel is built once, when the scene first becomes active. `hasInitialized` blocks a second run, so loading another scene leaves the form describing the old one.
4. A text block with no name is labelled with its numeric block id.
5. The Color section is rendered even when the template has no color, giving an empty section.
6. `uploadFile` opens a multi-select file chooser but uses only the first file.
7. The plugin module creates a DOM input element at import time, so it cannot be imported outside a browser.
   **Fixed**: `uploadFile` builds the input on first use, and the traversal helpers moved to `src/imgly/plugins/template-properties.ts`. FTA-U3 and the headless cases import both.
8. The `ResizeObserver` and the `onActiveChanged` subscription are never released.

## 8. Open questions

1. Done: the traversal helpers moved to `src/imgly/plugins/template-properties.ts` and `uploadFile` is lazy.
2. Issue 2: hide the opacity slider, or honour the picked alpha. Recommended: honour it, and drop `initialOpacity`.
3. Issues 1 and 3: fix in this wave. Recommended: yes, both are one line.

## 9. Estimate

Implemented: 14 browser cases in about 2 minutes 20 on one worker, 8 headless cases in under 1 s, and 17 unit cases in under 1.5 s.

## 10. Boundary review

Rule used: the code that makes a decision owns the test for it. The kit decides which blocks become form properties, how they are named, grouped and ordered, which control each gets, and what a form edit writes back. The engine decides what a block property change does. The editor decides how builder controls and panels render.

Core behaviour this plan leans on, and where it is covered today:

| Behaviour                                                       | Owner  | Covered by                                                                                                               |
| --------------------------------------------------------------- | ------ | ------------------------------------------------------------------------------------------------------------------------ |
| `editor/select` denied stops canvas selection                   | engine | `engine/lib/test/api/ScopesAPITest.cpp`, `ScopeMatrixAPITest.cpp`                                                        |
| `block.replaceText` writes the new text                         | engine | `engine/lib/test/api/BlockTextTest.cpp`, `TextEditFlowAPITest.cpp`                                                       |
| `getTextColors` / `setTextColor` round-trip                     | engine | `engine/lib/test/api/BlockTextTest.cpp`, `TextDeepAPITest.cpp`                                                           |
| `addImageFileURIToSourceSet` replaces an image fill             | engine | `engine/lib/test/api/BlockPropertiesTest.cpp`, `PropertyRoundTripAPITest.cpp`                                            |
| `relocateResource` / `findAllTransientResources`                | engine | `engine/lib/test/api/ResourceRegistryAPITest.cpp`, `MiscCoreAPITest.cpp`                                                 |
| `openPanel` / `closePanel` / `isPanelOpen` / `setPanelPosition` | editor | `apps/cesdk_web/packages/api/ui/UserInterfaceAPI.test.ts`                                                                |
| `registerPanel` accepts a render function                       | editor | same file, `describe('registerPanel')`                                                                                   |
| `feature.set` / `feature.enable`                                | editor | `apps/cesdk_web/packages/api/features/FeatureAPI.test.ts`                                                                |
| `setComponentOrder`                                             | editor | `apps/cesdk_web/packages/api/ui/UserInterfaceAPI.test.ts`                                                                |
| Builder `TextInput`, `TextArea` render and update               | editor | `apps/cesdk_web/packages/ui/builder/ControlledTextInput.test.tsx`, `ControlledTextArea.test.tsx`                         |
| Color picker saturation field changes the color (Qase 2637)     | editor | `apps/cesdk_web/packages/ui/design-system/components/SaturationBrightnessSelector/SaturationBrightnessSelector.test.tsx` |
| Color picker hue slider changes the color (Qase 2638)           | editor | `apps/cesdk_web/packages/ui/design-system/components/HueSlider/HueSlider.test.tsx`                                       |
| Color picker RGB fields change the color (Qase 2655)            | editor | `apps/cesdk_web/packages/ui/design-system/components/RGBControls/RGBControls.test.tsx`                                   |
| Color picker hex field changes the color (Qase 2652)            | editor | `apps/cesdk_web/packages/ui/design-system/components/HexColorInput/HexColorInput.test.tsx`                               |
| `exportDesign` exports and downloads                            | editor | `apps/cesdk_web/packages/cesdk/registerDefaultActions.test.ts`                                                           |

Core coverage gaps found (candidates for the core suites, not for this kit):

1. Editor: `openPanel(id, { closableByUser: false })`. `closableByUser` appears in `UserInterfaceStore.ts`, `panel.ts` and `Panel.tsx` and in no test. FTA-03 depends on it. Suggested home: `apps/cesdk_web/packages/api/ui/UserInterfaceAPI.test.ts`.
2. Editor: builder `ColorInput` and `MediaPreview`. `createBuilderDelegator.test.ts` names them but tests only the delegator; neither component has a render test. FTA-05, FTA-11 and FTA-12 exercise them through this kit. Suggested home: `apps/cesdk_web/packages/ui/builder/`.
3. Editor: builder `Section` has no test at all. Suggested home: same directory.

Until gap 1 is closed, FTA-03 is the only proof that the panel cannot be closed.
