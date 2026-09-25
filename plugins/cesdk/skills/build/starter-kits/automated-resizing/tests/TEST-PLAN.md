# Test plan: starterkit-automated-resizing

Version 5, 5 Sep 2026. Status: implemented. 132 Vitest cases (unit and component) and 11 browser cases run in `KIT_TEST_COVERAGE=1 npm run ci` (exit 0). Merged coverage is lines 100 %, branches 100 %, functions 100 %.

## 1. Purpose

Verify that the Automated Resizing starter kit works as shipped: `resize()` turns one template into one correctly sized variant per preset, and the demo app around it selects templates, generates, edits and downloads.

## 2. Scope

In scope

- `src/imgly/resizing.ts` — the resize loop, progress callback, scene restore
- `src/imgly/sizes.ts` — the shipped size presets
- `src/app/utils.ts` — size lookup and platform icon helpers
- The two editor configs (`config/design-editor`, `config/advanced-editor`) and the modal that uses them
- The demo app: template grid, Generate, variant grid, download

Out of scope

- Content-aware resizing itself, export pixel output, scene round-trip. Engine behaviour; see section 10.
- The editor UI the modal renders (panels, inspector, asset library). Covered by the core editor suite.
- The demo site around the kit. Covered by the `cesdk_web_demos` suite. Qase 2010, 2011, 2012, 2013, 2014, 2027, 2036, 2454.

## 3. Test environment

- Headless: `@cesdk/node` through the shared harness engine helper. Node, no DOM.
- Browser: Chrome, headless, 1400 × 900. Requests to `cdn.img.ly` fail the test.
- License: the shared test license (valid on hostname `localhost` only)
- Data: the kit ships no scene of its own — every template loads from `staticimgly.com`. The same files are in the repo at `packages/cesdk-web-examples-data/data/starterkit-automated-resizing/` (`example-1.scene` to `example-3.scene`, the previews and the platform icons). Headless cases build their own 1080 × 1080 scene in the engine; AR-H7 loads `example-1.scene` from that directory. In dev mode `cesdk-js-dev` injects `VITE_DEMO_ASSETS_BASE_URL` automatically, pointing at the local CDN daemon that serves that directory, so no test reaches a CDN for demo assets and the guard stays meaningful. The files are git-LFS; materialize them with `git lfs pull -X '' -I 'packages/cesdk-web-examples-data/data/starterkit-automated-resizing/**'` or the headless fixture fails with that hint.
- Downloads: captured by Playwright and checked by file name and decoded pixel size
- No `cdnAllowlist`. The demo templates' Barlow Condensed and Manrope font URIs are relative to the engine's `baseURL`, so the suite runs with the CDN guard at its default.
- Engine-ready signal: the kit shows none, so `open()` waits for the response that carries `example-1.scene`, which the headless engine fetches on boot. Without it `Generate` is a silent no-op (known issue 4).

## 4. Approach

| Kind     | Tool                          | What it checks                           | Run                 |
| -------- | ----------------------------- | ---------------------------------------- | ------------------- |
| Static   | tsc, eslint, convention check | Types, deprecated APIs, kit folder shape | `npm run check:all` |
| Unit     | Vitest                        | Size presets and app helpers, no engine  | `npm run test:unit` |
| Headless | Vitest + `@cesdk/node`        | `resize()` against a real engine         | `npm run test:unit` |
| Browser  | Playwright                    | The test cases in section 5.1            | `npm run test:e2e`  |

All four run in the kit's `ci` script. Browser tests use role and label locators only.

## 5. Test cases

Format: ID, Qase ids, title. Then steps and expected result.

### 5.1 Browser

Common precondition: the kit is open and the first template preview has rendered.

**AR-01 · Qase 2042, 4692 · Default state**
Steps: open the kit.
Expected: three template cards, the first marked selected. Four variant cards, one per preset, each empty and with no Download button. No console errors. No engine asset from the CDN.

**AR-02 · Qase 2043 · Selecting another template**
Steps: click the second template card.
Expected: the second card is selected, the first is not. The variant grid stays empty.

**AR-03 · Qase 2044 · Edit opens the advanced editor**
Steps: hover the selected template card, click Edit.
Expected: the modal opens with the dark theme. The navigation bar shows close, undo/redo, zoom, the Save button and the Actions dropdown.
Note (run, v2): the Expected was wrong. The advanced config leaves `ly.img.navigation.documentSettings` commented out in `features.ts`, so there is no document settings button; the test now asserts it is absent.

**AR-04 · Qase 2071, 2073 · Generate**
Steps: click Generate.
Expected: all four cards show a spinner, then an image. Card headers read "Instagram Story", "Instagram Post 4:5", "X (Twitter) Post", "Facebook Post", each above its "1080 × 1920 px" style size line. Each card gains a Download and an Edit button.
Note (run, v2): the label and the size are two separate elements, not one heading. Split into AR-04 (cards and buttons) and AR-02b (the size text).

**AR-05 · Qase 2073 · Download a variant**
Steps: after AR-04, click Download on the Instagram Story card.
Expected: one download named `Instagram Story.png`, a PNG of 1080 × 1920 px. AR-05b repeats it for the other three presets.
Note (run, v2): the kit asks for `${label}.png`, and Chrome replaces the colon in "Instagram Post 4:5", so that file arrives as `Instagram Post 4_5.png`. Browser behaviour, not the kit's.

**AR-06 · Qase 2069, 2070, 2072 · Edit the template, save or discard**
Steps: open the template editor, change the first text block through the kit's own editor instance, click Save, then Generate. Repeat, but close the modal without saving, then Generate.
Expected: after Save the generated variants carry the new text, read back by opening a variant's editor. After the discarded edit they still carry the saved text.
Note (run, v2): the text is changed through `engine.block.replaceText` on the kit's instance rather than by typing on the canvas. What is under test is the kit's save-and-discard wiring; the text tool belongs to the editor suite. The assertion reads the variant scene rather than comparing pixels, because this wave takes no screenshots.

**AR-07 · Qase 2151, 2152, 2153 · Edit one variant**
Steps: after AR-04, click Edit on the Instagram Story card, change the text, Save. Then edit the Facebook Post card and close without saving.
Expected: the modal opens in the light theme with that variant's scene. After Save only the Instagram Story card changes. The discarded edit changes nothing.

**AR-08 · Qase 4402, 4403, 4404 · Actions in the template editor**
Steps: open the template editor. From the Actions dropdown run Export Scene, then Import Scene with the exported file, then Import Scene with a `.zip` archive.
Expected: the dropdown holds "Export Design" and "Import"; Save sits next to it as the primary button. "Export Design" downloads a scene file (its bytes start with `UBQ`). Importing that file, and then a `.zip` archive of the same scene, restores the exported text.
Note (run, v2): the Expected named the components (`exportScene`, `importScene`); their visible labels are "Export Design" and "Import", and the builder hoists the first child of the dropdown out as a primary button, so Save is not inside it. Known issue 9 is sharper than written: the dropdown does offer a command labelled "Export Design", but it downloads a scene file, not an image.

### 5.2 Headless

**AR-H1 · Qase 2071 · One variant per size**
Steps: load a 1080 × 1080 scene, call `resize` with `DEFAULT_SIZES`.
Expected: four results in preset order. Each has a non-empty blob and a scene string that loads again.

**AR-H2 · Qase 2071 · Each variant has the requested page size**
Steps: as AR-H1, then load each result's `sceneString` and read the page frame.
Expected: 1080 × 1920, 1080 × 1350, 1200 × 675, 1200 × 630.

**AR-H3 · Qase 2071 · Progress callback**
Steps: as AR-H1 with an `onProgress` spy.
Expected: called four times with `completed` 1, 2, 3, 4, `total` 4, and the variant just produced.

**AR-H4 · The source scene is restored**
Steps: save the scene string before `resize`, run it, save again.
Expected: the loaded scene still has the source page size and children. Repeat with an `exportOptions` value the engine rejects (`pngCompressionLevel: 99`): `resize` rejects and the source scene is still loaded.
Note (run, v2): scene strings are not byte-stable across a save/load round trip, so the test compares the observable scene (page sizes and child types) rather than the two strings.

**AR-H5 · Empty size list**
Steps: call `resize` with `sizes: []`.
Expected: resolves with an empty array, `onProgress` never called, the scene unchanged.

**AR-H6 · Export options are forwarded**
Steps: call `resize` with `exportOptions: { mimeType: 'image/jpeg' }`.
Expected: every blob has type `image/jpeg`.

**AR-H7 · The shipped template resizes**
Steps: load `example-1.scene` from `packages/cesdk-web-examples-data/data/starterkit-automated-resizing/`, run `resize` with `DEFAULT_SIZES`.
Expected: four variants, each non-empty, each at the requested page size.

**AR-04b · Generate before the engine is ready** (added while implementing)
Steps: open the kit and click Generate without waiting for the engine.
Expected: nothing loads, no variant appears and no message is shown. Pins known issue 4.

### 5.3 Unit

**AR-U1 · Size presets**
Expected: `DEFAULT_SIZES` has four entries with unique ids, positive integer width and height, `designUnit` `Pixel`, and a platform from the declared union. (The README lists thirteen sizes; see known issue 1.)

**AR-U2 · App helpers**
`getSizesByPlatform(['instagram'], DEFAULT_SIZES)` → the two Instagram presets, in preset order. `getSizesByPlatform([], …)` → empty. `getSizeById('x-post', …)` → the X preset; an unknown id → `undefined`. `getPlatformIconFilename` maps each platform to its file and an unknown value to `custom.svg`.

**AR-U3 · Editor configs**
Steps: call `setupFeatures`, `setupNavigationBar` and `setupActions` with a recording double.
Expected: each config enables its documented feature list, asserted whole, and only the advanced one carries vector edit, path edit, rulers and the placeholder controls; the advanced config's navigation bar order matches the array in `ui/navigationBar.ts`; the advanced `setupActions` registers `saveScene`, `exportDesign`, `exportScene`, `importScene` and `uploadFile`, and the design one registers the same set in its own order without `importScene` in the dropdown. Neither registers `exportImage`: the fleet sweep deleted that unreachable action, and a case in each config keeps it deleted.

**AR-C1 to AR-C4 · component · The card components and the modal hook**
`EditOverlay` reports its click and keeps it off the card behind it, and swallows it when no handler was registered. `Spinner` renders. `TemplateCard` selects an unselected template and edits the selected one. `VariantCard` names the size and its pixel dimensions, offers editing only once a rendered image exists, and reports edit and download. `useEditorModal` opens on a scene and a mode and closes without forgetting them.

**AR-C5 · component · `useTemplates`**
The hook starts on the first bundled template, moves the selection, stores an edited scene on the template it belongs to without touching its neighbours, and replaces the preview only when a new one is handed over.

**AR-C6 · component · `useEngine`**
It boots one engine, hides the page title, loads the first template, disposes the engine on unmount, and throws away an engine that finished booting after the unmount.

**AR-C7 · component · `useVariants`**
It starts with one empty variant per size, does nothing while the engine is not ready, fetches the scene once and fills each variant as it completes, reuses a scene string the template already carries, clears the variants again when the resize fails, downloads only a variant that has an image, and replaces one variant after it was edited.

**AR-U4 · unit · `downloadFromUrl`**
The download clicks a temporary hidden anchor and removes it again.

**AR-U5, AR-U6 · unit · Both editor configuration trees and their action handlers**
The same `describe.each` shape as the sibling two-tree kits: panel side, bar set, canvas and inspector entries, dock label style, engine settings, the empty setups, both plugins with the editor compatibility version they pin once, as the call right after the reset, and the five action handlers per tree.

**AR-U7 · unit · The two editor entry points**
Each entry point adds its own configuration plugin first and then sets its theme (light for the design editor, dark for the advanced one), limits uploads and demo assets to images, and registers the same asset sources. A double that answers every `addPlugin` with a promise the test settles by hand proves the configuration plugin is awaited on its own and every asset source is in flight before any of them settles.

**AR-C8 · component · `App`**
Reports the demo `shell` phase, since no editor mounts until the visitor acts. Loads a template that carries no scene before opening the editor, writes the rendered preview back through the modal's save callback, reports a template it cannot load instead of opening an empty editor, edits a variant and stores its preview, skips a preview the engine cannot render, ignores an edit of a variant with no scene, does nothing until the headless engine is ready, and generates variants for the selected template.

**AR-C9 · component · `EditorModal`**
Renders nothing while closed; configures the advanced or the design editor by mode, loads the scene, publishes the debug handle, reports the `created` and `ready` demo phases and hands the wrapper the demo loading-state reporter; bubbles the serialized scene through the overridden save action, with and without a handler; and closes from the back button, the backdrop and the escape key, dropping the debug handle on unmount.

**AR-U8 · unit · `src/index.tsx`**
The entry mounts the app into `#root`, and fails loudly with `Root container not found` when the page ships no such element.

**AR-U9 · unit · `resize` without a scene**
Fails loudly with `No scene available for export` when the engine holds no scene after loading one.

**KB-01 · unit · Keyboard catalog predicates**

`tests/unit/keyboard-catalog.test.ts` runs every `run` and `when` of `src/imgly/config/advanced-editor/keyboard/catalogs/us-ansi.ts`, `src/imgly/config/design-editor/keyboard/catalogs/us-ansi.ts` against 1620 editor states (5 edit modes, 9 selections, 3 roles, features on and off, 3 vector states, page and no page) and asserts that none throws, that every shortcut activates in at least one state, and that every function `run` reaches `cesdk.actions.run`. Kit-owned: the kit decides which key does what and when it is live. The catalog measures 100 % lines, branches and functions.

## 6. Entry and exit criteria

Entry: engine and editor built; test license available; the shared kit test harness exists (headless engine helper, browser boot helper, download helper, console and network guards); a `window.cesdk` hook reachable while the modal is open (open question 2).

Exit: every case in section 5 passes locally and in CI. `npm run ci` passes. The published kit contains no test files. A release run reports results to the Qase ids above.

Met (v2). `npm run ci` exits 0: 39 unit and 10 headless tests, 11 browser tests. Merged coverage of `src/**` is lines 72.26 %, branches 82.09 %, functions 76.92 %. `tests/coverage-thresholds.json` gates the Vitest run only, at its measured numbers rounded down (lines 7, statements 7, functions 76, branches 79); the browser share of the merged number is not gated because the static CI mode collects no coverage.

## 7. Known issues found while writing this plan

Confirmed by reading the code. Confirm each with a test before fixing.

Fixed in this wave: 1 and 2, both README drift. The table now lists the four presets the kit ships and the two `resize()` examples pass `scene`.

3. `resize()` calls `engine.scene.saveToString()` before the loop. On an engine with no scene loaded it rejects before doing any work, and the error names serialization, not the missing scene.
4. `useEngine` returns `engineRef.current`, which is still `null` on the render that flips `isReady` to true. `useVariants.generate` guards on `!engine`, so Generate pressed on that render does nothing and says nothing. Confirmed and pinned by AR-04b: the kit publishes no ready state at all, so a click before the engine boots is dropped in silence. Every browser case has to wait for the template fetch to work around it.
5. `useEngine`'s effect depends on the `config` object identity. A consumer passing an inline object re-initialises the engine on every render.
6. Variant preview URLs created by `updateVariant` are pushed onto `urlsRef` but only revoked on the next `generate`. They leak on unmount.
7. `DEFAULT_SIZES` is re-exported through `app/constants.ts`, and `useVariants` imports it from there while the README documents the `./imgly` path.
8. The kit ships no scene in `public/`. Every template loads from `staticimgly.com` at run time, so the kit is blank without network access, even though the same files sit in the repo under `packages/cesdk-web-examples-data/data/starterkit-automated-resizing/`.
9. The advanced editor's Actions dropdown offers a command labelled "Export Design" that downloads a `.scene` text file, plus "Import". Save sits outside the dropdown as the primary button. Confirmed by AR-08; the label promises a design export and delivers a scene file.

### Coverage residue

None. Every executable line, branch and function of `src/**` is covered by the merged report.

## 8. Open questions

All three are settled.

1. Headless fixture — settled as recommended. AR-H1 to AR-H6 build a synthetic 1080 × 1080 scene in the engine; AR-H7 loads the in-repo `example-1.scene`, and fails with a `git lfs pull` hint when that file is still a pointer stub.
2. The `window.cesdk` hook — settled. `EditorModal` already set it in `handleInit`; it now clears it when the modal closes. The browser helper waits for the modal rather than for page load, because the harness `kit` fixture assumes an editor at page load and cannot be used here.
3. README drift — settled, corrected in this wave (issues 1 and 2).

Settled since v2: the kit was thought to race `VITE_ADD_CESDK_GLOBALS` for `window.cesdk`. That variable publishes nothing; the `{ kind, engine, cesdk }` shape is the harness's own `getEditor` return value. `waitForEditorReady` now waits for the editor's `ui`, so `tests/e2e/kit.ts` returns that handle and the tests read `handle.engine` and `handle.cesdk`.

## 9. Estimate

Measured: 11 browser tests in 56 s on one worker, 10 headless tests in 8 s, 39 unit tests in under 1 s. `npm run ci` end to end takes about 90 s.

## 10. Boundary review

Rule used: the code that makes a decision owns the test for it. The kit decides the preset list, the resize loop and its ordering, the restore-on-exit contract, the progress protocol, the two editor configs and the modal wiring. The engine decides what content-aware resizing produces and what an export contains.

Core behaviour this plan leans on, and where it is covered today:

| Behaviour                                                                       | Owner  | Covered by                                                                                         |
| ------------------------------------------------------------------------------- | ------ | -------------------------------------------------------------------------------------------------- |
| `resizeContentAware` reflows a page to a new size                               | engine | `engine/lib/test/api/BlockLayoutTest.cpp` (lines 209 onward, multi-page and aspect-ratio matrices) |
| `resizeContentAware` rejects an invalid block, an empty list, a non-finite size | engine | `engine/lib/test/api/MiscCoreAPITest.cpp`                                                          |
| `block.export` honours `mimeType` and target size                               | engine | `engine/lib/test/api/ExportAPITest.cpp`                                                            |
| `scene.saveToString` / `scene.load` round-trip                                  | engine | `engine/lib/test/api/LoadSceneAPITest.cpp` (`sceneStringRoundTrips`)                               |
| `ui.setTheme`, `ui.insertOrderComponent`, `ui.setComponentOrder`                | editor | `apps/cesdk_web/packages/api/ui/UserInterfaceAPI.test.ts`                                          |
| `actions.register` overrides a built-in action                                  | editor | `apps/cesdk_web/packages/cesdk/registerDefaultActions.test.ts`                                     |
| `feature.enable` with glob patterns                                             | editor | `apps/cesdk_web/packages/cesdk/stores/FeatureStore.test.ts`                                        |

No core coverage gap found for this kit.
