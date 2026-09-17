# Test plan: starterkit-translation-internationalization

Version 6, 7 Sep 2026. Status: implemented. 51 Vitest cases (unit and component) and 9 browser cases. The Vitest suites pass. The 9 browser cases pass against the dev server and against a static build; merged coverage is lines 100 %, branches 100 %, functions 100 %.

## 1. Purpose

Verify that the Translation and Internationalization starter kit works as shipped: the English and German controls sit above the editor, and choosing one switches the editor language at run time without recreating the editor.

## 2. Scope

In scope

- `src/app/LocaleSwitcher.tsx`: the two locale options and which one is marked active
- `src/app/App.tsx`: the initial locale, the `i18n.setLocale` call on a switch, the scene it loads
- `src/imgly/index.ts`: the configuration plugin, the asset sources, the `setLocale('en')` call
- `src/imgly/config/**`

Out of scope

- The German translations themselves. The kit adds none; the German UI text comes from the editor's own `de` locale bundle. See section 10.
- Core editor and engine behaviour reached through this kit.
- The demo site around the kit. Qase 448, 449, 450, 451, 452, 467, 476, 2405, 2406, 2407, 2409. Qase 2469 is filed as kit behaviour but the Desktop/Mobile toggle it uses is the demo site's iframe switch, so it belongs there too.

## 3. Test environment

- Browser: Chrome, headless, 1400 x 900. One case runs with the browser locale set to `de-DE`.
- Engine and editor: built from this repo, served locally
- License: the shared test license (valid on hostname `localhost` only)
- Data: `packages/cesdk-web-examples-data/data/starterkit-translation-internationalization/assets/example-1.scene`, 2 pages, loaded through `DEMO_ASSETS_BASE_URL`. Its Manrope fonts and its images were mirrored into the same folder and the scene's URIs rewritten, so no request reaches `cdn.img.ly` or the Firebase bucket. In dev mode the kit's `tests/e2e/fixtures.ts` serves that published prefix from the repo's local CDN mirror.
- Hook: `window.cesdk`, set in the editor `init` callback

## 4. Approach

| Kind    | Tool                          | What it checks                                    | Run                 |
| ------- | ----------------------------- | ------------------------------------------------- | ------------------- |
| Static  | tsc, eslint, convention check | Types, deprecated APIs, kit folder shape          | `npm run check:all` |
| Unit    | Vitest                        | The locale list and the config modules, no engine | `npm run test:unit` |
| Browser | Playwright                    | The cases in section 5                            | `npm run test:e2e`  |

Browser tests use role and label locators only. Translated text is asserted once, on a single label, as proof that the switch reached the editor. Coverage of the German bundle belongs to the editor suite, see section 10.

## 5. Test cases

Format: ID, level, Qase id, title. Then steps and expected result.
Common precondition for browser cases: the kit is open and the scene has finished loading.

### 5.1 Start-up

**TI-01 · browser · Qase 491 · The English and German controls are shown**
Steps: open the kit.
Expected: two buttons above the editor, English and German. Two pages on the canvas with their page titles shown. The kit has marked the demo lifecycle phases `created` then `ready` for the host that embeds it. No console errors.

**TI-02 · browser · Qase 1114 · English is the active control**
Steps: read which button is active and read `window.cesdk.i18n.getLocale()`.
Expected: English is active and the locale is `en`.

**TI-03 · browser · German browser starts in German**
Steps: run with the browser locale `de-DE`.
Expected: the editor locale is `de` and the German button is the active one.
Note: known issue 2 is fixed by applying the browser locale after the editor setup, which defaults to English.

### 5.2 Locale switching

**TI-04 · browser · Qase 493 · German**
Steps: click German.
Expected: `window.cesdk.i18n.getLocale()` is `de`, the German button is active, and the dock entry labelled Images in English now reads Bilder. The editor is not recreated: the `window.cesdk` object is the same one as before the click.

**TI-05 · browser · Qase 492 · Back to English**
Steps: click German, then English.
Expected: the locale is `en` again, the English button is active, and the same dock entry reads Images.

**TI-06 · browser · Switching keeps the document**
Steps: make an edit, then switch to German.
Expected: the scene still holds the edit and the same block stays selected. The kit uses the i18n runtime API, so nothing is reloaded.

### 5.3 Export

**TI-07 · browser · Qase 466 · Export image**
Steps: open the actions dropdown, click Export image.
Expected: one PNG download holding the current page.
Asserts the options the kit passes to `engine.block.export` and that a file of the declared type downloaded; the exported pixel size belongs to `engine/lib/test/api/ExportAPITest.cpp`.

**TI-08 · browser · Qase 465 · Export PDF**
Steps: open the actions dropdown, click Export PDF.
Expected: one PDF download with two pages.
Asserts the options the kit passes to `engine.block.export` and that a file of the declared type downloaded; the exported pixel size belongs to `engine/lib/test/api/ExportAPITest.cpp`.

### 5.4 Unit tests (no browser)

**TI-U1 · unit · Qase 491 · The locale list**
`LOCALES` holds exactly `{ value: 'en', label: 'English' }` and `{ value: 'de', label: 'German' }`, in that order.

**TI-U2 · removed.** The browser-locale helper is private to the app component; TI-03 covers it in the browser.

**TI-U3 · unit · Qase 492, 493 · `initTranslationInternationalizationEditor`**
Call it with a stub whose `addPlugin` and `i18n.setLocale` record their arguments.
Expected: `DesignEditorConfig` first, then `i18n.setLocale('en')`, then the fifteen asset source plugins in one concurrent batch.

**TI-U4 · unit · The kit registers no translations of its own**
`setupTranslations` calls nothing on `cesdk.i18n`. The German UI comes from the editor's bundle, which is what the kit demonstrates.

**TI-U5 · unit · Enabled features and settings**
`feature.enable` is called once with exactly the list `config/features.ts` names, in that order, and `feature.disable` is not called. `page/title/show` is true, `colorPicker/colorMode` is `Any`, `doubleClickToCropEnabled` is true.

**TI-U6 · unit · Dock, navigation bar, canvas bar and panels**
The seven library entries and the separator in the documented order; `dock/hideLabels` false, `dock/iconSize` large; the navigation bar ends with an actions dropdown holding Export image and Export PDF; the canvas bar has no page-select entry; the inspector and assets panels are `left` and non-floating.

**TI-U7 · browser · The engine config**
`window.cesdk.config.featureFlags` is `{ archiveSceneEnabled: true }`.
Note: moved from unit to browser. `src/index.tsx` calls `createRoot` while it loads, so `editorConfig` cannot be imported under Node, and the editor does not publish `userId`, so only the flag is observable.

**TI-U8 · unit · `setupUI` orders the bars the kit owns**
`setupUI` positions the panels before it sets any component order, and it orders exactly the dock, the navigation bar, the canvas bar, the canvas menu and the inspector bar — the video timeline is deliberately left at the editor default.

**TI-U9 · unit · The inspector bar per edit mode**
The Transform bar carries the typeface and font-size controls, which are what a reader checks a translated editor against. The Crop bar carries only the crop controls; the Vector bar ends with `ly.img.vectorEdit.done.inspectorBar`.

**TI-U10 · unit · The setups the kit leaves empty**
`setupComponents` and `setupVideoTimeline` make no call. `setupKeyboardShortcuts` calls `shortcuts.set` once with the US ANSI catalog object itself.

**TI-U11 · unit · `DesignEditorConfig`**
The plugin is named `cesdk-design-editor` and carries `CreativeEditorSDK.version`. `initialize` resets the editor first, declares the editor compatibility version it was written for, then runs the feature, UI, action, shortcut, translation and engine-setting setup. Without a `cesdk` in the context it touches neither the editor nor the engine.

**TI-U12 · unit · The action handlers**
`saveScene` downloads the scene as `text/plain;charset=UTF-8`. `exportDesign` forwards the caller's options unchanged. `importScene` picks a `.imgly,.scene,.zip` object URL, loads it, revokes the URL — including when the load rejects — and then fits the first page. `exportScene` writes text by default and a `application/zip` archive for `format: 'archive'`. `uploadFile` forwards the file and the context to `utils.localUpload`.

**TI-U13 · unit · `src/index.tsx`**
The entry mounts the app into `#root`, and fails loudly with `Root element not found` when the page ships no such element.

### 5.5 Component cases (jsdom, no editor)

**TI-C1 · component · `LocaleSwitcher`**
The switcher renders one button per entry of `LOCALES` — English and German, in that order — marks only the selected one active, and reports the clicked value, including a click on the locale that is already selected.

**TI-C2 · component · `App` switches the locale without recreating the editor**
With `@cesdk/cesdk-js/react` stubbed so the test drives the `init` callback itself: `init` runs the kit configuration and loads `assets/example-1.scene`. Clicking German then calls `i18n.setLocale('de')` and adds no plugin, which is the kit's point — the runtime API changes the locale in place. Clicking German before `init` has run still moves the selection and calls nothing on the editor.

**KB-01 · unit · Keyboard catalog predicates**

`tests/unit/keyboard-catalog.test.ts` runs every `run` and `when` of `src/imgly/config/keyboard/catalogs/us-ansi.ts` against 1620 editor states (5 edit modes, 9 selections, 3 roles, features on and off, 3 vector states, page and no page) and asserts that none throws, that every shortcut activates in at least one state, and that every function `run` reaches `cesdk.actions.run`. Kit-owned: the kit decides which key does what and when it is live. The catalog measures 100 % lines, branches and functions.

## 6. Entry and exit criteria

Entry: engine and editor built; test license available; the shared kit test harness exists; known issue 1 answered, or the network guard is given a documented exception for this kit.

Exit: every case passes locally and in CI. `npm run ci` passes. The published kit contains no test files. A release run reports TI-01 to TI-08 to their Qase ids.

## 7. Known issues found while writing this plan

Fixed in the S6 fleet sweep: the unreachable `exportImage` action, which no UI reached because `ly.img.exportImage.navigationBar` runs `exportDesign`, was deleted, and `setupPanels` now uses the editor's real asset library panel id `//ly.img.panel/assetLibrary` in place of `//ly.img.panel/assets`. TI-U8 covers the first.

Confirm each with a test before fixing.

Fixed: issues 1 and 2. The scene, its fonts and its images now live in `packages/cesdk-web-examples-data/data/starterkit-translation-internationalization/assets/` and the scene is an archive-part scene (`isPartOfArchive: true`) whose font and image URIs use `{{scene_root}}`, so the engine resolves them next to wherever the scene is served from; the initial `setLocale(getBrowserLocale())` call now runs after `initTranslationInternationalizationEditor`, which sets English as the default, so a German browser starts in German instead of being overridden.

1. ~~The demo scene reaches `cdn.img.ly` and a Firebase Storage bucket.~~ Fixed, see above.
2. ~~The browser-locale detection is dead.~~ Fixed, see above.
3. `check:format` globs `**/*.{ts,js,json,html}` while `src/index.tsx`, `src/app/App.tsx` and `src/app/LocaleSwitcher.tsx` are `.tsx` and the two CSS modules are `.css`, so five files are not format-checked. `check:lint` was widened to `{ts,tsx,js}` while this plan was written; the format glob was not. Agent C owns the fix.
4. `App.tsx` has two separate `import type` statements from `@cesdk/cesdk-js`, one for the default export and one for `Configuration`. Cosmetic.
5. `featureFlags.archiveSceneEnabled: true` is set in `src/index.tsx` and nothing in the kit uses archives. The navigation bar offers Export image and Export PDF only.
6. The Templates dock entry lists the `ly.img.templates` library while `DemoAssetSources` is included with `ly.img.image.*` only, so that library holds premium templates only. Same as the single page and theming kits.
7. The README says the kit "ships with English and German" and "supports translations for any language". The kit ships no translation table; both languages come from the editor.

### Coverage residue

None. Every executable line, branch and function of `src/**` is covered by the merged report.

## 8. Open questions

1. ~~Issue 2~~ Decided and done: always English, `getBrowserLocale` deleted.
2. ~~Issue 1~~ Decided and done: mirrored into `packages/cesdk-web-examples-data` and the scene's URIs rewritten.
3. TI-04 asserts one German dock label. Which label is the most stable choice against future copy changes? Recommended: the Images dock entry, whose key `libraries.ly.img.image.label` exists in both bundles today.

## 9. Estimate

8 browser cases at about 8 s each, plus two exports at about 12 s: about 90 s on one worker. 7 unit cases: under 1 s.

## 10. Boundary review

Rule used: the code that makes a decision owns the test for it. This kit decides which locales to offer, which one to start in, and that switching goes through the i18n runtime API rather than recreating the editor. The editor owns the locale bundles and the translation lookup.

| Behaviour                                                      | Owner  | Covered by                                                |
| -------------------------------------------------------------- | ------ | --------------------------------------------------------- |
| `i18n.setLocale` and `getLocale`                               | editor | `apps/cesdk_web/packages/api/i18n/I18nAPI.test.ts`        |
| `i18n.setTranslations` and `translate`                         | editor | `apps/cesdk_web/packages/api/i18n/I18nAPI.test.ts`        |
| The `de` bundle has the same keys as `en`                      | editor | `apps/cesdk_web/packages/api/i18n/locales.test.ts`        |
| i18n initialisation and the fallback locale                    | editor | `apps/cesdk_web/packages/api/i18n/initI18n.test.ts`       |
| `ui.setComponentOrder`, `setPanelPosition`, `setPanelFloating` | editor | `apps/cesdk_web/packages/api/ui/UserInterfaceAPI.test.ts` |
| `feature.enable` gating                                        | editor | `apps/cesdk_web/packages/api/features/FeatureAPI.test.ts` |
| `utils.export` and `utils.downloadFile`                        | editor | `apps/cesdk_web/packages/api/utils/UtilsAPI.test.ts`      |
| Scene load from a URL                                          | engine | `engine/lib/test/api/SceneAPITest.cpp`                    |

Core coverage gaps found:

1. Editor: no test asserts that a locale change re-renders the mounted UI. `locales.test.ts` proves key parity and `I18nAPI.test.ts` proves the API call, but nothing proves that a component already on screen picks up the new language, which is the whole point of this kit. Suggested home: a Vitest component test in `apps/cesdk_web/packages/ui`.
2. Editor: engine error messages are localised through `localizedEngineErrorMessage`, which has tests for `en` only. Suggested home: `apps/cesdk_web/packages/api/i18n/localizedEngineErrorMessage.test.ts`, one `de` case.
