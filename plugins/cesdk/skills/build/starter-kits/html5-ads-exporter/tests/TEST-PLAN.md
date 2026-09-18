# Test plan: starterkit-html5-ads-exporter

Version 4, 5 Sep 2026. Status: implemented. 49 Vitest cases and 9 browser cases run in `KIT_TEST_COVERAGE=1 npm run ci`. Merged coverage is lines 100 %, branches 100 %, functions 100 %. Known issue 1 is fixed on the download path.

## 1. Purpose

Verify that the HTML5 Ads Exporter starter kit works as shipped: the editor loads with the animated banner scene, the Export HTML5 panel offers format, text mode and page, and the two actions produce a live preview tab and a ZIP download.

## 2. Scope

In scope

- The Export button in the navigation bar and the panel it toggles
- The panel controls: format button group, text mode button group, the description under each, the page number input on a multi-page scene
- The two actions: Export & Preview, Download ZIP, including which options each passes to `exportHtml`
- Editor start-up with the demo banner scene
- The kit's own code under `src/imgly/` and `src/index.ts`

Out of scope

- What `exportHtml` produces — markup, CSS, GSAP timelines, asset extraction, text rendering. That is `@imgly/html-exporter`'s decision, covered by `packages/html5-exporter/test/html-export/`.
- Core editor features reached through this kit (timeline, animation inspector, asset library). Covered by the core editor suite.
- The demo site around the kit. Covered by the `cesdk_web_demos` suite. Qase 4516, 4517, 4519, 4520, 4533, 4542, 4567, 4745.

## 3. Test environment

- Browser: Chrome, headless, 1400 × 900. Pop-ups allowed: the preview action calls `window.open`, and the test captures the new page with `context.waitForEvent('page')`.
- Engine and editor: built from this repo, served locally. Requests to `cdn.img.ly` for engine assets fail the test.
- License: the shared test license (valid on hostname `localhost` only)
- Data: `html5-banner.zip`, served from the in-repo copy at `packages/cesdk-web-examples-data/data/starterkit-html5-ads-exporter/assets/` via `VITE_DEMO_ASSETS_BASE_URL`. Never from the CDN. It is a single-page animated banner.
- Readiness hook: `window.cesdk`, set in `src/index.ts` before the scene loads.
- Console allowlist: none needed for a normal export. The kit writes every exporter message with `console.log`, and the guard only fails on `console.error`. The failure branches log with `console.error`, but they are unit cases, not browser cases.

## 4. Approach

| Kind    | Tool                          | What it checks                                         | Run                 |
| ------- | ----------------------------- | ------------------------------------------------------ | ------------------- |
| Static  | tsc, eslint, convention check | Types, deprecated APIs, kit folder shape               | `npm run check:all` |
| Unit    | Vitest                        | Panel structure and the options passed to `exportHtml` | `npm run test:unit` |
| Browser | Playwright                    | The test cases in section 5                            | `npm run test:e2e`  |

`exportHtml` is a bundled import, not something on `window.cesdk`, so a browser test cannot see the options the kit passes it. The option mapping is checked at unit level with `@imgly/html-exporter` mocked; the browser cases check the two visible outcomes, the preview tab and the ZIP.

## 5. Test cases

Format: ID, Qase id, title. Then steps and expected result.
Common precondition for browser cases: the kit is open and the banner scene has finished loading.

### 5.1 Start-up and panel

**H5-01 · Editor loads with the banner scene** (no Qase case yet)
Steps: open the kit.
Expected: the video editor with a timeline and one page. An Export button at the end of the navigation bar. No panel open. No console errors. No engine asset from the CDN.

**H5-02 · Qase 4548 · Export opens the panel on the right**
Steps: click Export.
Expected: a panel titled "Export HTML5" opens on the right of the editor.

**H5-03 · Qase 4750 · Export closes the panel again**
Steps: click Export a second time.
Expected: the panel closes.

**H5-04 · Qase 4746, 4747 · Defaults and toggling**
Steps: open the panel. Read the two button groups. Click External, then Embedded. Click Vector, then HTML Text.
Expected: Format defaults to Embedded, Text Mode to HTML Text. Each click makes the clicked button active and the other inactive, in both directions.

**H5-05 · Qase 4748 · The description follows the selection**
Steps: toggle each button group and read the text below it.
Expected: Embedded → "Single self-contained HTML file with base64-embedded assets". External → "HTML file with separate image and font asset files". HTML Text → "Selectable and searchable text with CSS styling". Vector → "Pixel-perfect vectorized text (not selectable)".

**H5-06 · The page input is hidden on a single-page scene** (no Qase case yet)
Steps: read the panel with the banner scene loaded.
Expected: no page number input and no "Page 1 of 1" text. The kit shows them only when the scene has more than one page.

### 5.2 Export and preview

**H5-07 · Qase 4584, 4586 · Export & Preview opens an animating tab**
Steps: click Export & Preview.
Expected: a new tab opens with a self-contained HTML document that carries the GSAP player and starts playing on load. The tab's document contains no `<img src="images/...">` reference, because the preview is always exported embedded.
Note: corrected after the run — the loading-state assertion moved to H5-U5. The export finishes faster than Playwright's first poll, so the disabled window is not observable in the browser; H5-U5 pins it deterministically.

**H5-08 · Qase 4749 · A newly added element reaches the preview**
Steps: add a text block with a known string to the page. Click Export & Preview.
Expected: the new string is in the preview document. The kit exports the live engine state, not the loaded file.

**H5-09 · Qase 4587 · Download ZIP produces a ZIP archive**
Steps: click Download ZIP.
Expected: one download named `html5-export.zip` whose bytes start with `PK`, and both buttons are usable again afterwards.
Note: the entry list moved to `packages/html5-exporter`, which now asserts it — boundary review gap 1 is closed. The kit owns the filename and the options it passes, not the archive's shape.

Qase 4589 asks whether every element in the exported banner appears with the right timing and animation. That is the exporter's output, marked core in section 10. The kit's part is passing `animated: true`, which H5-U3 asserts, and H5-07 proves the preview plays.

### 5.3 Unit tests

**H5-U1 · Panel structure**
The render function captured from `registerPanel`, driven with a fake builder and a fake `state`:
a format button group with Embedded and External in that order, a text mode group with HTML Text and Vector, a description text under each whose content key follows the current selection, and an export section with an Export & Preview button and a Download ZIP button.

**H5-U2 · The page section depends on the page count**
One page → no page section. Three pages → a number input with `min: 1`, `max: 3`, `step: 1`, showing `pageIndex + 1`, and the text "Page 1 of 3". Setting it to 5 clamps the stored index to 2; setting it to 0 clamps it to 0.

**H5-U3 · Options passed to `exportHtml`**
With `@imgly/html-exporter` mocked:
Download ZIP passes the format the button group is on. Export & Preview always passes `format: 'embedded'`, because the preview is a single blob tab and an external export references asset files a blob page cannot resolve — that is the kit's decision, not an oversight.
Both pass the selected `textMode`, the selected `pageIndex` and `animated: true`.

**H5-U4 · Preview output handling**
`exportHtml` returns a file map without `index.html` → the action throws "Export did not produce an HTML file" and the loading state clears. `index.html` as a `Uint8Array` → it is decoded as UTF-8 before `injectGsapPlayer`. `injectGsapPlayer` is called with `{ autoplay: true }`.

**H5-U5 · Loading state**
While Export & Preview runs, both buttons are disabled and only the preview button shows the spinner. Same for Download ZIP with the roles swapped. After either resolves or rejects, both are usable again.

**H5-U6 · Translations and placement**
The plugin registers the eight `html5-export.*` keys plus the panel title, registers `ly.img.html5-export.navigationBar`, sets the panel position to `right`, and inserts the component at the end of the navigation bar.

**H5-U7 · Editor configuration**
`initHtml5ExporterEditor` against a recording double: the video editor config plugin, then the HTML5 export panel plugin, then the asset source plugins, with the upload source limited to `ly.img.image.upload`, the demo sources to `ly.img.image.*`, `ly.img.audio.*` and `ly.img.video.*`, and the premium templates to `ly.img.templates.premium.*`. A second double answers every `addPlugin` with a promise the test settles by hand, which proves the two configuration plugins are awaited one at a time and every asset source is in flight before any of them settles.

**H5-U8 · unit · `setupFeatures`**
The kit enables exactly the video ad feature list, asserted whole, including the timeline tracks and controls, animations and transitions. It enables no export feature of its own, because the export panel owns the export.

**H5-U9 · unit · Panel placement and `setupUI`**
`setupPanels` docks the inspector and the asset library on the left. `setupUI` positions the panels before it sets any component order and orders every bar the kit owns, the video timeline controls included.

**H5-U10 · unit · `setupDock`**
The dock shows large labelled icons and lists the combined elements entry, uploads, then the image, text, shape and sticker libraries in that order.

**H5-U11 · unit · The canvas bar, the canvas menus, the inspector bar and the navigation bar**
`setupCanvas` puts the add-page button in a bottom canvas bar; the Transform menu offers delete, the Text menu the formatting controls, the Vector menu is empty. The Transform inspector bar carries the animation and trim controls; the Trim, Crop and Vector bars carry only their own. The navigation bar holds undo, zoom and preview and no export entry.

**H5-U12 · unit · The timeline controls, the engine settings and the empty setups**
`setupVideoTimeline` keeps split, playback and zoom in the controls bar. `setupSettings` shows every timeline track, hides the page title and enables double-click cropping. `setupComponents` and `setupTranslations` make no call; `setupKeyboardShortcuts` installs the US ANSI catalog object itself.

**H5-U13 · unit · `setupActions`**
The kit overrides exactly one action, `exportDesign`. It exports at `videoBitrate: 'Auto'` by default, lets the caller override that, and downloads the first blob.

**H5-U14 · unit · `VideoEditorConfig`**
The plugin is named `cesdk-video-editor` and carries `CreativeEditorSDK.version`. `initialize` resets the editor first, pins the editor compatibility version to that same version once, as the very next call, runs the whole setup, and finishes with `editor.checkBrowserSupport` at `videoDecode: 'block'`, `videoEncode: 'warn'`. Without a `cesdk` in the context it touches neither the editor nor the engine.

**H5-U15 · unit · Exporter messages and the engine-only host**
Both export actions log every message the exporter returns. `Html5ExportPanelPlugin.initialize` registers nothing when the context carries no `cesdk`.

**H5-U16 · unit · `src/index.ts`**
The entry creates the editor with the kit's user id, initialises the HTML5 exporter, loads the banner archive from the published demo assets, publishes the editor on `window` and reports the `created` and `ready` demo phases. A failed start-up reports the `failed` phase instead of leaving an unhandled rejection.

**KB-01 · unit · Keyboard catalog predicates**

`tests/unit/keyboard-catalog.test.ts` runs every `run` and `when` of `src/imgly/config/keyboard/catalogs/us-ansi.ts` against 1620 editor states (5 edit modes, 9 selections, 3 roles, features on and off, 3 vector states, page and no page) and asserts that none throws, that every shortcut activates in at least one state, and that every function `run` reaches `cesdk.actions.run`. Kit-owned: the kit decides which key does what and when it is live. The catalog measures 100 % lines, branches and functions.

## 6. Entry and exit criteria

Entry: engine and editor built; test license available; the shared kit test harness exists (boot helper, download helper, pop-up helper, console and network guards).

Exit: every case in section 5 passes locally and in CI. `npm run ci` passes. The published kit contains no test files. A release run reports results to the Qase ids above.

## 7. Known issues found while writing this plan

Confirm each with a test before fixing.

1. The Format button group has no effect. Export & Preview hard-codes `format: 'embedded'` and Download ZIP hard-codes `format: 'external'`, so the choice the user makes is ignored on both paths.
   **Fixed on the download path**: Download ZIP now passes the selected format, pinned by H5-U3. Export & Preview stays embedded by design, and the source says why: the preview is one blob tab, and an external export writes `images/` and `fonts/` files a blob page cannot resolve.
2. An export failure is only logged. The panel gives no message and no notification is shown.
3. Every exporter message is written to the console with `console.log`, including warnings, so a failing export is easy to miss in a browser log.
4. `Download ZIP` always writes `html5-export.zip`, whatever the page or the scene is called.
5. The ZIP is exported without the GSAP player, so an unzipped `index.html` does not animate the way the preview does. The README does not say so.
6. The panel's page input is the only place the page index can be changed; the exported page does not follow the page the user is looking at.

### Coverage residue

None. Every executable line, branch and function of `src/**` is covered by the merged report.

## 8. Open questions

1. Issue 1: done for the download. Whether the preview should also honour External — which needs the kit to resolve the external asset files to blob URLs — is open.
2. Issue 2: show a notification on failure, as the export-using-renderer kit does. Recommended: yes.
3. Issue 5: inject the GSAP player into the ZIP too, or say in the README that the ZIP is for embedding into a page that supplies GSAP. Recommended: say it in the README; the ZIP is meant for an ad server.

## 9. Estimate

Implemented: 9 browser cases in about 40 s on one worker, and 23 unit cases in under 1.5 s (19 for the panel, 4 for the editor configuration).

## 10. Boundary review

Rule used: the code that makes a decision owns the test for it. The kit decides the panel layout, the defaults, the labels and descriptions, which options each action passes, that the preview gets a GSAP player and the ZIP does not, and what the download is called. `@imgly/html-exporter` decides what the exported HTML contains. The editor decides how builder controls and panels render.

Core behaviour this plan leans on, and where it is covered today:

| Behaviour                                                           | Owner                  | Covered by                                                                                             |
| ------------------------------------------------------------------- | ---------------------- | ------------------------------------------------------------------------------------------------------ |
| `exportHtml` with `format: 'embedded'` inlines assets               | `@imgly/html-exporter` | `packages/html5-exporter/test/html-export/two-phase-api.test.ts`, `e2e-output.test.ts`                 |
| `exportHtml` with `format: 'external'` writes separate assets       | `@imgly/html-exporter` | same files                                                                                             |
| `textMode` changes how text is emitted                              | `@imgly/html-exporter` | `packages/html5-exporter/test/html-export/e2e-output.test.ts`                                          |
| Animations are emitted with the right timing and easing (Qase 4589) | `@imgly/html-exporter` | `packages/html5-exporter/test/html-export/animation/` (about 20 files)                                 |
| `injectGsapPlayer` adds a working player                            | `@imgly/html-exporter` | `packages/html5-exporter/test/html-export/video-timeline.test.ts`, `animation/animation-test-utils.ts` |
| `files.toZip()` returns a valid ZIP                                 | `@imgly/html-exporter` | `packages/html5-exporter/test/html-export/two-phase-api.test.ts`                                       |
| `openPanel` / `closePanel` / `isPanelOpen` / `setPanelPosition`     | editor                 | `apps/cesdk_web/packages/api/ui/UserInterfaceAPI.test.ts`                                              |
| `insertOrderComponent` at the end of the navigation bar             | editor                 | same file                                                                                              |
| Builder `NumberInput` renders and clamps                            | editor                 | `apps/cesdk_web/packages/ui/builder/PanelBuilderNumberInput.test.tsx`                                  |
| `ButtonGroup` active state                                          | editor                 | `apps/cesdk_web/packages/ui/design-system/components/ButtonGroup/ButtonGroup.test.tsx`                 |

Core coverage gaps found (candidates for the core suites, not for this kit):

1. `@imgly/html-exporter`: the ZIP for an external export is only checked for its `PK` signature and its size. Nothing asserts that it holds `index.html` plus an `images/` and a `fonts/` folder, which is exactly what Qase 4587 asks for. Suggested home: `packages/html5-exporter/test/html-export/two-phase-api.test.ts`, in `describe('toZip() creates valid ZIP archives')`. **Closed in S5**: `packages/html5-exporter/test/html-export/zip-shape.test.ts`.
2. Editor: builder `Section` and `Text` have no render test. Suggested home: `apps/cesdk_web/packages/ui/builder/`.

Gap 1 is closed, so H5-09 only has to prove the kit produces a ZIP under the name it promises.
