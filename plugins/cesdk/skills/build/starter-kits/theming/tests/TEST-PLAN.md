# Test plan: starterkit-theming

Version 6, 7 Sep 2026. Status: implemented. 70 unit cases, 18 component cases and 17 browser cases. The Vitest suites pass. The 17 browser cases pass against the dev server and against a static build; merged coverage is lines 100 %, branches 99.19 %, functions 100 %.

## 1. Purpose

Verify that the Theming starter kit works as shipped: the sidebar switches the built-in theme and the UI scale, and the four colour pickers turn a chosen colour into the CE.SDK design tokens that the editor renders with.

## 2. Scope

In scope

- `src/imgly/color.ts`: the five token generators
- `src/app/ThemingSidebar.tsx`: the theme and scale state, `THEME_COLORS`, `COLOR_PRESETS`, and the `#cesdk-custom-theme` style element it writes and removes
- `src/app/ThemeControl.tsx`, `src/app/ScaleControl.tsx`, `src/app/ColorPicker/**`
- `src/imgly/index.ts`: the configuration plugin, the asset sources, `setRole`, the initial theme and scale
- `src/imgly/config/**` and the scene the kit loads

Out of scope

- What each design token changes in the rendered editor. That is the editor's stylesheet. The cases assert the token values on `.ubq-public`, not pixels.
- Core editor and engine behaviour reached through this kit. See section 10.
- The demo site around the kit. Qase 397, 398, 399, 400, 401, 418, 427, 2404.

## 3. Test environment

- Browser: Chrome, headless, 1400 x 900
- Engine and editor: built from this repo, served locally
- License: the shared test license (valid on hostname `localhost` only)
- Data: `packages/cesdk-web-examples-data/data/starterkit-theming/assets/example-1.scene`, 2 pages, loaded through `DEMO_ASSETS_BASE_URL`. Its Manrope fonts and its images were mirrored into the same folder and the scene's URIs rewritten, so no request reaches `cdn.img.ly` or the Firebase bucket. In dev mode the kit's `tests/e2e/fixtures.ts` serves that published prefix from the repo's local CDN mirror.
- Hook: `window.cesdk`, set in the editor `init` callback
- Screenshot comparison is out of scope for the first wave. Theme cases read `window.cesdk.ui.getTheme()`, `getScale()` and the computed CSS custom properties on `.ubq-public`.

## 4. Approach

| Kind    | Tool                          | What it checks                                                           | Run                 |
| ------- | ----------------------------- | ------------------------------------------------------------------------ | ------------------- |
| Static  | tsc, eslint, convention check | Types, deprecated APIs, kit folder shape                                 | `npm run check:all` |
| Unit    | Vitest                        | `color.ts`, the sidebar constants, the config modules; no engine, no DOM | `npm run test:unit` |
| Browser | Playwright                    | The cases in section 5                                                   | `npm run test:e2e`  |

`color.ts` is pure and is the cheapest place to pin every token value. The browser cases then only have to prove that the generated tokens reach `.ubq-public`. Browser tests use role and label locators only.

## 5. Test cases

Format: ID, level, Qase id, title. Then steps and expected result.
Common precondition for browser cases: the kit is open and the scene has finished loading.

### 5.1 Start-up

**TH-01 · browser · Editor loads dark, at normal scale, with the sidebar, and reports its lifecycle**
Steps: open the kit.
Expected: two pages on the canvas with their page titles shown. `window.cesdk.ui.getTheme()` is `dark` and `getScale()` is `normal`. The kit has marked the demo lifecycle phases `created` then `ready` for the host that embeds it. The sidebar shows UI Scaling, Theme, and the four colour rows Surface Background, Canvas Background, Active, Accent, each with five preset swatches. No console errors.

### 5.2 Theme and scale

**TH-02 · browser · Qase 432 · Light theme**
Steps: click Light.
Expected: `ui.getTheme()` is `light`, the Light button is the active one, and any `#cesdk-custom-theme` style element is gone.

**TH-03 · browser · Qase 431 · Dark theme**
Steps: click Light, then Dark.
Expected: `ui.getTheme()` is `dark` and the Dark button is active.

**TH-04 · browser · Qase 429 · Normal scaling**
Steps: click Large, then Normal.
Expected: `ui.getScale()` is `normal` and the Normal button is active.

**TH-05 · browser · Qase 430 · Large scaling**
Steps: click Large.
Expected: `ui.getScale()` is `large` and the Large button is active.

### 5.3 Colours

**TH-06 · browser · Qase 482 · Surface background from a preset**
Steps: click the second Surface Background swatch, `#230D38`.
Expected: a `#cesdk-custom-theme` style element exists, and the computed `--ubq-elevation-1` on `.ubq-public` equals `generateColorAbstractionTokensSurface('#230D38')['--ubq-elevation-1']`.
Note: the browser normalises a custom property to its own colour notation, so the case compares both values after resolving them through the CSS engine rather than as strings.

**TH-07 · browser · Qase 434 · Surface background from the colour field**
Steps: open the Surface Background picker, type `#3B0A45` into the hex field.
Expected: the same token equals the generator's output for that colour. The case types into the hex input; it does not drag the colour area.

**TH-08 · browser · Qase 4676 · Canvas background from a preset**
Steps: click the third Canvas Background swatch, `#242623`.
Expected: `--ubq-canvas` on `.ubq-public` equals `generateColorAbstractionTokensCanvas('#242623')['--ubq-canvas']`.

**TH-09 · browser · Qase 4677 · Canvas background from the colour field**
Steps: open the Canvas Background picker, type a hex value.
Expected: `--ubq-canvas` follows it.

**TH-10 · browser · Qase 484 · Active colour from a preset**
Steps: click the first Active swatch, `#5D6266`.
Expected: `--ubq-interactive-active-default` equals the generator's output.

**TH-11 · browser · Qase 485 · Active colour from the colour field**
Steps: open the Active picker, type a hex value.
Expected: the same token follows it.

**TH-12 · browser · Qase 437 · Accent colour from a preset**
Steps: click the second Accent swatch, `#66D3EB`.
Expected: `--ubq-interactive-accent-default` equals the generator's output.

**TH-13 · browser · Qase 487 · Accent colour from the colour field**
Steps: open the Accent picker, type a hex value.
Expected: the same token follows it.

**TH-14 · browser · Switching theme clears the custom colours**
Steps: pick a Surface preset, then click Light.
Expected: the `#cesdk-custom-theme` element is removed, and the four sidebar swatches show the light theme defaults `#D6DBE1`, `#D6DBE1`, `#4E545A`, `#4260F5`.

**TH-15 · browser · Only one picker is open at a time**
Steps: open the Accent picker, then the Surface picker.
Expected: the Accent picker closes. Clicking outside closes the open one.
Note: the order is reversed from the draft. An open picker covers the rows below it, so the second click has to land on a row above the first.

### 5.4 Export

**TH-16 · browser · Qase 417 · Export image**
Steps: open the actions dropdown, click Export image.
Expected: one PNG download holding the current page.
Asserts the options the kit passes to `engine.block.export` and that a file of the declared type downloaded; the exported pixel size belongs to `engine/lib/test/api/ExportAPITest.cpp`.

**TH-17 · browser · Qase 416 · Export PDF**
Steps: open the actions dropdown, click Export PDF.
Expected: one PDF download with two pages.
Asserts the options the kit passes to `engine.block.export` and that a file of the declared type downloaded; the exported pixel size belongs to `engine/lib/test/api/ExportAPITest.cpp`.

### 5.5 Unit tests (no browser)

**TH-U1 · unit · Surface tokens**
`generateColorAbstractionTokensSurface('#121A21')` returns the 20 documented keys. Pin the exact values for a dark input and a light input, and assert that the foreground tokens flip between white and black at the luminance boundary of 0.5.
Note: `--ubq-input-default` and `--ubq-input-hover` both clamp to `hsl(0,0%,0%)` on a dark surface, so the "input darker than the surface" assertion runs against the light theme and the clamp is pinned separately.

**TH-U2 · unit · Canvas tokens**
Returns exactly `--ubq-canvas`, in `hsl()` form, for a hex, an `rgb()` and a named colour input.

**TH-U3 · unit · Active tokens**
Returns the six documented keys. `--ubq-interactive-active-hover` is lighter and `--ubq-interactive-active-pressed` darker than `--ubq-interactive-active-default`.

**TH-U4 · unit · Accent tokens**
Returns the eight documented keys. The four notice colours keep their own hue while taking chroma and lightness from the accent colour, so `--ubq-notice-error` for a dark accent differs from the one for a light accent.

**TH-U5 · unit · Static tokens**
`generateStaticTokens()` returns the eight fixed values and does not depend on any input.

**TH-U6 · unit · Theme defaults and presets**
`THEME_COLORS` has a light and a dark entry, each with the four colours. `COLOR_PRESETS` has five entries per colour type and every value is a valid hex colour.

**TH-U7 · unit · Enabled features and settings**
`feature.enable` is called once with exactly the list `config/features.ts` names, in that order, and `feature.disable` is not called. `page/title/show` is true, which is the difference from the single page kit, and `colorPicker/colorMode` is `Any`.

**TH-U8 · unit · Dock, navigation bar, canvas bar and panels**
The seven library entries and the separator in the documented order; `dock/hideLabels` false, `dock/iconSize` large; the navigation bar ends with an actions dropdown holding Export image and Export PDF; the canvas bar has no page-select entry; the inspector and assets panels are `left` and non-floating.

**TH-U9 · unit · `initThemingEditor` adds the documented plugins and sets the initial appearance**
`DesignEditorConfig` first, then the fifteen asset source plugins in one concurrent batch. `engine.editor.setRole('Creator')`, `ui.setTheme('dark')` and `ui.setScale('normal')` are all called.

**TH-U10 · unit · Panel placement and `setupUI`**
`setupPanels` docks the inspector and the asset library on the left and leaves neither floating. `setupUI` positions the panels before it sets any component order and orders exactly the dock, the navigation bar, the canvas bar, the canvas menu and the inspector bar.

**TH-U11 · unit · The canvas bar, the canvas menus and the inspector bar**
`setupCanvas` puts the add-page button in a bottom canvas bar; the Transform menu offers duplicate and delete, the Text menu the formatting controls, the Vector menu is empty. The Transform inspector bar carries crop, fill and the inspector toggle; the Crop bar carries only the crop controls; the Vector bar ends with `ly.img.vectorEdit.done.inspectorBar`.

**TH-U12 · unit · The navigation bar and the engine settings**
The navigation bar carries undo, zoom and an actions entry. `setupSettings` writes the crop and page settings the kit relies on and leaves the page title visible.

**TH-U13 · unit · The setups the kit leaves empty**
`setupComponents` and `setupVideoTimeline` make no call. `setupKeyboardShortcuts` calls `shortcuts.set` once with the US ANSI catalog object itself.

**TH-U14 · unit · `DesignEditorConfig`**
The plugin is named `cesdk-design-editor` and carries `CreativeEditorSDK.version`. `initialize` resets the editor first, declares the editor compatibility version it was written for, then runs the feature, UI, action, shortcut, translation and engine-setting setup. Without a `cesdk` in the context it touches neither the editor nor the engine.

**TH-U15 · unit · The action handlers**
`saveScene` downloads the scene as `text/plain;charset=UTF-8`. `exportDesign` forwards the caller's options unchanged. `importScene` picks a `.imgly,.scene,.zip` object URL, loads it, revokes the URL — including when the load rejects — and then fits the first page. `exportScene` writes text by default and a `application/zip` archive for `format: 'archive'`. `uploadFile` forwards the file and the context to `utils.localUpload`.

### 5.x Component cases (jsdom, no editor)

**TH-C1 · component · `ColorPicker`**
The picker opens and closes from its trigger, labels its trigger and its presets from the name when no label is given, renders a caller-supplied trigger instead of the default one, reports a preset colour and fires the debounced callback 500 ms later, and works when the caller passes no debounced callback. A click outside that a test dispatches is untrusted and is ignored on purpose.

**TH-C2 · component · `ThemingSidebar`**
The sidebar starts dark at normal scale, hands the theme and the scale to `cesdk.ui.setTheme` / `setScale`, and does neither when the editor is not ready. Picking a colour in any of the four pickers writes a `.ubq-public` custom-theme stylesheet; switching the theme removes it again. Until a colour is picked the swatches show the theme defaults. Only one picker is open at a time, and a second click on the open picker's own trigger closes it.

**KB-01 · unit · Keyboard catalog predicates**

`tests/unit/keyboard-catalog.test.ts` runs every `run` and `when` of `src/imgly/config/keyboard/catalogs/us-ansi.ts` against 1620 editor states (5 edit modes, 9 selections, 3 roles, features on and off, 3 vector states, page and no page) and asserts that none throws, that every shortcut activates in at least one state, and that every function `run` reaches `cesdk.actions.run`. Kit-owned: the kit decides which key does what and when it is live. The catalog measures 100 % lines, branches and functions.

## 6. Entry and exit criteria

Entry: engine and editor built; test license available; the shared kit test harness exists; known issue 1 answered, or the network guard is given a documented exception for this kit.

Exit: every case passes locally and in CI. `npm run ci` passes. The published kit contains no test files. A release run reports TH-02 to TH-17 to their Qase ids.

## 7. Known issues found while writing this plan

Fixed in the S6 fleet sweep: the unreachable `exportImage` action, which no UI reached because `ly.img.exportImage.navigationBar` runs `exportDesign`, was deleted, and `setupPanels` now uses the editor's real asset library panel id `//ly.img.panel/assetLibrary` in place of `//ly.img.panel/assets`. TH-U10 covers the first.

Fixed: issue 1. The scene, its seven Manrope fonts and its sixteen images now live in `packages/cesdk-web-examples-data/data/starterkit-theming/assets/`, the scene is an archive-part scene (`isPartOfArchive: true`) whose font and image URIs use `{{scene_root}}`, so the engine resolves them next to wherever the scene is served from (the local CDN daemon, CI's `/demo-data/` copy, or `staticimgly.com` once deployed), and `src/imgly/resolveAssetPath.ts` was replaced by `src/imgly/demo-assets.ts`.

Confirm each with a test before fixing.

1. ~~`public/assets/example-1.scene` sets `fontFileUri` to `cdn.img.ly/assets/v3/ly.img.typeface/fonts/Manrope/*` on every text block, and its four `imageFileURI` values point at a Firebase Storage bucket.~~ Fixed, see above.
2. ~~`check:format` globs `**/*.{ts,js,json,html}` while every React file in this kit is `.tsx` and the four CSS modules are `.css`.~~ Fixed: `check:format` and `fix:format` now glob `{ts,tsx,js,json,html,css}`, and the one file the wider glob caught (`src/app/App.module.css`) is formatted. The same fix landed in the translation and force-crop kits.
3. `src/app/App.tsx` imported `useRef` without using it. Fixed while this plan was written, and the widened lint glob would now catch it.
4. The README documents `cesdk.ui.setTheme('dark')` with `'light' | 'dark' | 'system'`, but the sidebar offers Light and Dark only.
5. The custom tokens are written to a document-level `<style>` selecting `.ubq-public`, so they apply to every editor instance on the page, not to this one.
6. `initThemingEditor` calls `engine.editor.setRole('Creator')`. That is unrelated to theming and is documented nowhere in the kit.
7. The dark default lives in two places: `ui.setTheme('dark')` in `initThemingEditor` and `useState<Theme>('dark')` in the sidebar. Changing one leaves the other stale.
8. `THEME_COLORS` are display values for the swatches. Until a custom colour is chosen, no token is written, so a swatch can differ from the colour the built-in theme actually renders.
9. The Templates dock entry lists the `ly.img.templates` library while `DemoAssetSources` is included with `ly.img.image.*` only, so that library holds premium templates only. Same as the single page and translation kits.
10. The README Key Capabilities section is the generic design editor list and says nothing about theming.

### Coverage residue

One branch of `src/**` is left: in `ThemingSidebar.handlePickerOpenChange`, `prev === type ? null : prev` keeps a picker open when a _different_ picker reports that it closed. Unreachable by construction — a picker only reports a close from its own trigger (`useOnClickOutside` fires only while that picker is open), and the trigger of an inactive picker opens it. `UseOnClickOutside`'s `e.isTrusted` guard is exercised from the untrusted side only, because jsdom marks `isTrusted` non-configurable; the browser suite drives the trusted side.

## 8. Open questions

1. ~~Issue 1~~ Decided and done: mirrored into `packages/cesdk-web-examples-data` and the scene's URIs rewritten.
2. New: the five preset swatches, the picker trigger and the hex field carried no accessible name, so the cases could not use role or label locators. `aria-label` was added to all three in `ColorPicker.tsx`.
3. TH-06 to TH-13 compare a computed CSS value against the generator's output, so the browser case and the unit test share a source of truth. Alternative: hardcode the expected token strings in the browser cases. Recommended: keep the shared source, and let TH-U1 to TH-U5 pin the strings.

## 9. Estimate

17 browser cases at about 8 s each, plus two exports at about 12 s: about 2.5 minutes on one worker. 9 unit cases: under 1 s.

## 10. Boundary review

Rule used: the code that makes a decision owns the test for it. This kit decides the sidebar, the theme and scale defaults, the preset colours, every token formula in `color.ts`, and how the tokens reach the page. The editor decides what `setTheme` and `setScale` do and what each token means.

| Behaviour                                                      | Owner  | Covered by                                                |
| -------------------------------------------------------------- | ------ | --------------------------------------------------------- |
| `ui.setTheme`, `getTheme`, including the `system` resolution   | editor | `apps/cesdk_web/packages/api/ui/UserInterfaceAPI.test.ts` |
| `ui.setScale`, `getScale`, including the function form         | editor | `apps/cesdk_web/packages/api/ui/UserInterfaceAPI.test.ts` |
| `ui.setComponentOrder`, `setPanelPosition`, `setPanelFloating` | editor | `apps/cesdk_web/packages/api/ui/UserInterfaceAPI.test.ts` |
| `feature.enable` gating                                        | editor | `apps/cesdk_web/packages/api/features/FeatureAPI.test.ts` |
| `utils.export` and `utils.downloadFile`                        | editor | `apps/cesdk_web/packages/api/utils/UtilsAPI.test.ts`      |
| Scene load from a URL                                          | engine | `engine/lib/test/api/SceneAPITest.cpp`                    |
| `editor.setRole`                                               | engine | `engine/lib/test/api/EditorAPITest.cpp`                   |

Core coverage gaps found:

1. Editor: no test asserts which `--ubq-*` custom properties the editor stylesheet actually reads. This kit generates 43 of them and a renamed token would break it silently while every test above still passed. Suggested home: a Vitest check in `apps/cesdk_web/packages/ui` that the documented token list matches the stylesheet.
