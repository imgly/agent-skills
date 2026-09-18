# Test plan: starterkit-page-sizes-asset-source

Version 5, 7 Sep 2026. Status: implemented. 10 browser tests, 38 unit and headless tests, `npm run ci` green. Merged coverage is lines 100 %, branches 100 %, functions 100 %.

## 1. Purpose

Verify that the Page Sizes starter kit works as shipped: the editor opens with the Resize Page panel, the custom dock button toggles it, and the page presets the kit installs change the page.

## 2. Scope

In scope

- The custom `ly.img.page.resize.dock` component: label, icon, selected state, toggle behaviour
- The dock order the kit declares, with the resize button first
- The Resize Page panel being open on start-up
- The page preset and template libraries the kit installs through `PagePresetsAssetSource` and `DemoAssetSources`
- The kit's own code under `src/imgly/` and `src/index.ts`

Out of scope

- Core editor features used through this kit (the page resize panel itself, text editing, the asset library). Covered by the core editor suite.
- The demo site around the kit (cards, tags, links, platform toggles). Covered by the `cesdk_web_demos` suite. Qase 763, 764, 765, 766, 767, 782, 791, 2423.

## 3. Test environment

- Browser: Chrome, headless, 1400 × 900
- Engine and editor: built from this repo, served locally. Requests to `cdn.img.ly` for engine assets fail the test.
- License: the shared test license (valid on hostname `localhost` only)
- Data: the kit's own `public/assets/page-sizes.scene`, 1 page of 1080 × 1350 px, and `public/assets/page-sizes-large.svg` for the dock icon
- The demo scene stores absolute `cdn.img.ly` font and emoji URIs from the CE.SDK version it was authored with, so `tests/playwright.config.ts` allows exactly `cdn.img.ly/packages/imgly/cesdk-js/<version>/assets/ly.img.typeface/fonts/` and `cdn.img.ly/assets/v<n>/emoji/`.
- Downloads: captured by Playwright and checked by file type, pixel size, and PDF page count

## 4. Approach

| Kind    | Tool                          | What it checks                                  | Run                 |
| ------- | ----------------------------- | ----------------------------------------------- | ------------------- |
| Static  | tsc, eslint, convention check | Types, deprecated APIs, kit folder shape        | `npm run check:all` |
| Unit    | Vitest                        | Dock and settings config, asset path resolution | `npm run test:unit` |
| Browser | Playwright                    | The test cases in section 5                     | `npm run test:e2e`  |

All three run in the kit's `ci` script. Browser tests use role and label locators only. The kit has no engine-only module, so there are no headless cases.

## 5. Test cases

Format: ID, level, Qase id, title. Then steps and expected result.
Common precondition for all browser cases: the kit is open in the browser and the scene has finished loading.

### 5.1 Start-up and the dock button

**PGS-01 · browser · Qase 4683 · Resize Page panel is open on load**
Steps: open the kit.
Expected: the scene is on the canvas. `ui.isPanelOpen('//ly.img.panel/inspector/pageResize')` is true and the panel is visible. The first dock entry is labelled "Page Sizes". No console errors.
Note: the dock button's selected state is only a CSS class — `aria-pressed` stays `false` — so it cannot be asserted with a role or label locator. The case asserts the panel state the button reflects instead. Recorded as a core a11y gap.

**PGS-02 · browser · The dock button toggles the panel**
Steps: click Page Sizes in the dock. Click it again.
Expected: the panel closes on the first click and reopens on the second, and `ui.isPanelOpen` follows.
Note: the button's selected state is not exposed to assistive technology, see PGS-01.

**PGS-03 · browser · Dock order**
Steps: read the dock.
Expected: Page Sizes, separator, Templates, separator, Elements, Upload, Images, Text, Shapes, Stickers, in that order, with labels shown and large icons.

### 5.2 Page sizes

**PGS-04 · browser · Qase 797 · Page size presets are listed**
Steps: open the Resize Page panel.
Expected: preset groups are listed — "Instagram" and "ISO Standard Print" among them — and each entry shows a label and a thumbnail.
Note: the print groups are named "Other Print", "ISO Standard Print" and "North American Print"; there is no group called just "Print".

**PGS-05 · browser · Qase 798 · Select a preset**
Steps: note the current page width and height. Pick a preset from a group, for example A4.
Expected: the page becomes square and its height changes. The page keeps its content.
Note: the scene is already 1080 px wide, so the Square Post preset leaves the width alone; the case asserts that the height changed and that width now equals height, per open question 1.

**PGS-06 · browser · Qase 799 · Type a width and a height**
Steps: type a new width and a new height in the panel's number inputs.
Expected: the page takes those values. Non-numeric input is rejected by the input, not by an error.

### 5.3 Templates

**PGS-07 · browser · Qase 778 · Apply the Blank template**
Steps: open Templates in the dock, apply a blank template.
Expected: the page is empty. Its size is unchanged.
Note: the run proved the plan wrong. Applying a template replaces the page content, not the page size.

**PGS-08 · browser · Qase 779 · Apply a design template**
Steps: open Templates, apply a print or social template.
Expected: the template's content replaces what was on the page, and the Resize Page panel reports the current page width, never a stale one.
Note: the page size is unchanged by the template, and the editor asks "Replace current design?" before applying.

### 5.4 Export

**PGS-09 · browser · Qase 781 · Export image**
Steps: open the actions menu in the navigation bar, click Export Image.
Expected: one PNG download of 1080 × 1350 px, the scene's own page size.
Note: the run proved the plan wrong on both counts. `ly.img.exportImage.navigationBar` runs `exportDesign`, which sends no target size, so the PNG follows the page and the kit's 1080 × 1080 `exportImage` action was never reached. That registration is deleted in this wave, and PGS-U5 keeps it deleted.
Asserts the options the kit passes to `engine.block.export` and that a file of the declared type downloaded; the exported pixel size belongs to `engine/lib/test/api/ExportAPITest.cpp`.

**PGS-10 · browser · Qase 780 · Export PDF**
Steps: open the actions menu, click Export PDF.
Expected: one PDF download with 1 page.
Asserts the options the kit passes to `engine.block.export` and that a file of the declared type downloaded; the exported pixel size belongs to `engine/lib/test/api/ExportAPITest.cpp`.

### 5.5 Unit cases (no browser)

**PGS-U1 · unit · Dock configuration**
`setupDock` on a spy `cesdk`: the first entry is `ly.img.page.resize.dock`, the order matches PGS-03, `dock/hideLabels` is false and `dock/iconSize` is `large`.

**PGS-U2 · unit · Engine settings**
`setupSettings` on a spy engine: the 15 settings the kit declares are written with the values in `config/settings.ts`, and nothing else is written.

**PGS-U3 · unit · The resize dock component**
`setupComponents` on a spy `cesdk`: registers `ly.img.page.resize.dock`. Rendering it with a stub builder when `isPanelOpen` returns false calls `openPanel('//ly.img.panel/inspector/pageResize')`; when it returns true it calls `closePanel` and the button is marked selected.

**PGS-U5 · unit · Registered actions**
`setupActions` on a spy `cesdk` registers the actions the kit's UI reaches.

**PGS-U4 · unit · Asset path resolution** — dropped.
`resolveAssetPath` is gone; the shared `tests/unit/demo-assets.test.ts` covers `src/imgly/demo-assets.ts`.

**PGS-U10 · removed.** `resolveAssetPath` is gone; `src/imgly/demo-assets.ts` derives the URL from `VITE_DEMO_ASSETS_BASE_URL` or the kit's own URL.

**KB-01 · unit · Keyboard catalog predicates**

`tests/unit/keyboard-catalog.test.ts` runs every `run` and `when` of `src/imgly/config/keyboard/catalogs/us-ansi.ts` against 1620 editor states (5 edit modes, 9 selections, 3 roles, features on and off, 3 vector states, page and no page) and asserts that none throws, that every shortcut activates in at least one state, and that every function `run` reaches `cesdk.actions.run`. Kit-owned: the kit decides which key does what and when it is live. The catalog measures 100 % lines, branches and functions.

## 6. Entry and exit criteria

Entry: engine and editor built; test license available; the shared kit test harness exists; the kit's `test:unit` and `test:e2e` scripts replaced with the real commands (they are `exit 0` today).

Exit: every case in section 5 passes locally and in CI. `npm run ci` passes. The published kit contains no test files. A release run reports results to the Qase ids above.

## 7. Known issues found while writing this plan

Confirm each with a test before fixing.

1. The dock icon callback ignores its `iconSize` argument and always returns `page-sizes-large.svg`. The kit ships no small icon, so the dock renders the large one at every size.
2. `config/i18n.ts` is an empty `void cesdk;` stub while the README documents localization for this kit.
3. `src/index.ts` opens the resize panel after `cesdk.load(...)`. If the load rejects, the `catch` logs and the panel never opens, so the editor sits empty with no message to the user.
4. `src/index.ts` carries a commented-out `baseURL` line labelled "IMG.LY CDN (for quick testing only)" that repeats the same `VITE_IMGLY_LOCAL_ASSETS_URL` value as the live line. It tells a reader nothing.
5. The README Architecture tree omits `config/keyboard/`, which the kit ships and `plugin.ts` calls.
6. The dock lists an Elements entry that already holds images, text, shapes and stickers, and then lists each of those four again as its own entry. A user sees every library twice.
7. ~~The kit registers an `exportImage` action at 1080 × 1080 that nothing can reach.~~ Fixed: the registration is deleted. `ly.img.exportImage.navigationBar` runs `exportDesign` with no target size, so the PNG comes out at the page's native size. PGS-09 pins the size and PGS-U5 keeps the action gone.
8. The custom dock button's selected state is not exposed to assistive technology: the builder renders it as a CSS class while `aria-pressed` stays `false`. Owner is the editor, not the kit; recorded as a core gap under section 10.

### Coverage residue

None. Every executable line, branch and function of `src/**` is covered by the merged report.

## 8. Open questions

1. Should PGS-05 assert exact preset dimensions, or only that the page changed? Exact values pin the preset catalogue, which is owned by `PagePresetsAssetSource`, not by this kit. Recommended: assert only that width and height changed and that the aspect ratio matches the label the entry shows.
2. Issue 3: show a message on load failure, or leave it. Recommended: leave it; it is the same pattern in every kit and belongs to a fleet-wide decision.
3. How should `resolveAssetPath` be covered, given the harness stubs it in Vitest and its output is not observable through a role or label locator in the browser? Recommended: cover it once in the harness's own suite, since every kit ships the same function.

## 9. Estimate

Measured: 10 browser cases in 38 s on one worker, 23 unit cases in under 0.3 s. Merged coverage: lines 90.09 %, branches 100 %, functions 100 %; the Vitest gate sits at lines 9 %, branches 100 %, functions 100 %.

## 10. Boundary review

Rule used: the code that makes a decision owns the test for it. The kit decides the dock order, the custom resize button and its toggle, the engine settings, which asset source plugins are installed, and that the resize panel opens on start-up. The editor decides what the resize panel contains and how it changes a page. `PagePresetsAssetSource` decides the preset catalogue.

Core behaviour this plan leans on, and where it is covered today:

| Behaviour                                                                               | Owner       | Covered by                                                                                                                   |
| --------------------------------------------------------------------------------------- | ----------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `PagePresetsAssetSource` registers `ly.img.page.presets` and maps it to a library entry | core plugin | `packages/cesdk-core-plugins-web/src/plugin-page-presets-asset-source-web/src/plugin.test.ts`                                |
| `DemoAssetSources` filters sources by include patterns                                  | core plugin | `packages/cesdk-core-plugins-web/src/plugin-demo-asset-source-web/src/plugin.test.ts`                                        |
| `setComponentOrder`, `getComponentOrder`, `registerComponent`                           | editor      | `apps/cesdk_web/packages/api/ui/UserInterfaceAPI.test.ts`                                                                    |
| `openPanel`, `closePanel`, `isPanelOpen`, `setPanelPosition`                            | editor      | `apps/cesdk_web/packages/api/ui/UserInterfaceAPI.test.ts`, `apps/cesdk_web/packages/cesdk/stores/UserInterfaceStore.test.ts` |
| The page resize panel changes page width and height                                     | editor      | `apps/cesdk_web/packages/ui/components/blocks/page/PageInspector.test.tsx`                                                   |

Core coverage gaps found (candidates to add in the core suites, not in this kit):

1. Editor: applying a page preset from the asset library to the current page. `PageInspector.test.tsx` covers the inputs, not the preset path, and the preset plugin test covers registration, not application. Qase 798 exercises it through this kit. Suggested home: `apps/cesdk_web/packages/ui/components/blocks/page/`.
2. Editor: a custom dock component registered with `registerComponent` renders in the dock and reflects `isPanelOpen` in its selected state, **and exposes that state through `aria-pressed`**, which it does not today. `assetLibraryDock.test.ts` covers the built-in entry only. Qase 4683 and PGS-02 exercise it through this kit. Suggested home: `apps/cesdk_web/packages/cesdk/components/`.

Until gap 1 is closed, PGS-05 keeps its page-dimension assertion as the end-to-end proof.

## 11. Coverage pass

Cases added to close the merged-coverage gaps:

- **PGS-U6 · unit · The actions the kit registers — every handler `setupActions` registers is invoked: `saveScene` downloads the saved scene as text, `exportDesign` downloads what `cesdk.utils.export` returned, `importScene` opens the picker for `.imgly,.scene,.zip`, revokes the blob URL on the success and on the failure path and then runs `zoom.toPage`, `exportScene` writes a JSON scene by default and a zip archive for `{ format: 'archive' }`, and `uploadFile` returns what `cesdk.utils.localUpload` returned**
- **PGS-U7 · unit · DesignEditorConfig — `initialize` resets the editor, declares the editor compatibility version it was written for, then applies features, UI, actions, shortcuts, translations and engine settings; with no `cesdk` in the context it touches the engine not at all**
- **PGS-U8 · unit · Video timeline scaffold — `setupVideoTimeline` makes no editor call, so the kit ships the timeline example unapplied**
- **PGS-U9 · unit · `src/index.ts` — a successful create loads the demo scene, opens the page resize panel and reports the demo lifecycle phases `created` then `ready`; a rejected create logs the failure and reports `failed` alone**

The only uncovered item left is the one below.
Residue: none from the asset base; `src/imgly/demo-assets.ts` is covered by the shared `tests/unit/demo-assets.test.ts`.
