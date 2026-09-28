# Test plan: starterkit-qr-code-editor

Version 5, 7 Sep 2026. Status: implemented, `npm run ci` green (45 unit and headless, 11 browser). Merged coverage is lines 100 %, branches 100 %, functions 100 %.

## 1. Purpose

Verify that the QR Code starter kit works as shipped: the editor loads the demo archive, puts the QR Code generator at the bottom of the dock, offers Edit in the canvas menu for a QR block, and exports the design.

## 2. Scope

In scope

- Registration of `@imgly/plugin-qr-code-web` with its default configuration, which creates QR blocks as shapes
- The dock entry the kit appends after a spacer
- The start-up selection of the first block carrying the plugin's metadata
- The fifteen asset-source plugins, the dock order, the navigation-bar actions dropdown and the export actions
- Feature and engine-setting configuration under `src/imgly/config/`
- Editor start-up with `public/assets/scene.archive`
- The kit's own code under `src/imgly/` and `src/index.ts`

Out of scope

- QR generation itself, the Generate and Update panels, URL validation, and which features the plugin disables on a QR block. The plugin decides all of those; see section 10.
- Whether a rendered QR code still scans after a colour, fill, stroke, shadow or effect change. That is a property of the plugin's encoder and the engine's renderer, not of the kit; see section 10.
- Core editor features reached through this kit (duplicate, delete, colour picker, stroke and shadow controls). Covered by the core editor suite.
- The demo site around the kit (cards, tags, platform support, links, the desktop and mobile switch). Covered by the `cesdk_web_demos` suite. Qase 2564, 2565, 2566, 2567, 2581, 2590, 2599, 2605, 2606, 2607, 2609, and 2612, which asks whether edits survive the demo site's device toggle and is a property of that site's iframe handling, not of the kit. The `starterkit-unsplash-asset-source` plan puts the same case (2471) out of scope for the same reason.

## 3. Test environment

- Browser: Chrome, headless, 1400 × 900
- Engine and editor: built from this repo, served locally. Requests to `cdn.img.ly` fail the test.
- License: the shared test license (valid on hostname `localhost` only)
- Data: the kit's own `public/assets/scene.archive`. It bundles a 1-page scene, DIN A6, 148 × 105 mm, with 4 graphics, 7 fonts and 1 image. Two of the graphics carry `@imgly/plugin-qr-code-web` metadata: `{"url":"img.ly","color":"#000000","type":"shape"}` and `{"url":"https://img.ly/","color":"#000000","type":"shape"}`. No block in the archive has a name.
- Network: measured on a real boot, the kit makes zero `cdn.img.ly` requests, so the Playwright config needs no allowlist.
- Downloads: captured by Playwright and checked by file type, pixel size, and PDF page count

## 4. Approach

| Kind    | Tool                          | What it checks                             | Run                 |
| ------- | ----------------------------- | ------------------------------------------ | ------------------- |
| Static  | tsc, eslint, convention check | Types, deprecated APIs, kit folder shape   | `npm run check:all` |
| Unit    | Vitest                        | Plugin wiring, dock append, config modules | `npm run test:unit` |
| Browser | Playwright                    | The test cases in section 5                | `npm run test:e2e`  |

All three run in the kit's `ci` script. Browser tests use role and label locators. Everything inside the editor goes through the harness helpers, `actionsMenu` for the navigation bar's actions dropdown and `editorPanel(id)` for a panel, so the editor's own attributes appear in one place rather than in every kit; a case that scopes to the editor uses the kit's own `#cesdk_container`. The plugin's URL field is a builder `TextInput`, which commits on Enter rather than on every keystroke, so the tests type and press Enter. `setupQRCodePlugin` and every `config/` module are pure functions over a `CreativeEditorSDK`, so their decisions are covered by unit cases with a spy. There are no headless cases: nothing in the kit runs without the editor.

## 5. Test cases

Format: ID, level, Qase id, title. Then steps and expected result.
Common precondition for all browser cases: the kit is open in the browser and the scene has finished loading.

### 5.1 Start-up and the dock

**QR-01 · browser · Editor loads with the QR Code entry at the bottom of the dock**
Steps: open the kit.
Expected: one page on the canvas, 148 × 105 mm, with two QR graphics on it. The dock order ends with `ly.img.spacer` and `ly.img.generate-qr.dock`, and a QR Code button is visible. No console errors. No request to `cdn.img.ly`.

**QR-02 · browser · Start-up selects a QR block**
Steps: open the kit, read the selection.
Expected: exactly one block is selected and it is the first block carrying QR metadata.
Note: fixed. The kit now finds the block by the plugin's metadata key instead of the dead `findByName('QR Code 1')`.

**QR-03 · browser · Qase 2676 · The demo QR codes point at img.ly**
Steps: select each of the two QR blocks in turn and open the QR panel.
Expected: the metadata of the two blocks holds `img.ly` and `https://img.ly/`, and the Update QR Code panel shows each value in its URL field. Note the first value has no scheme; whether a scanner opens it is the encoder's contract, not the kit's (section 10).

### 5.2 Generating a QR code

**QR-04 · browser · Qase 2624, 2625 · Generate a QR code from the dock panel**
Steps: click QR Code in the dock. Read the Generate button with the URL field empty. Type a URL, pick a foreground colour, click Generate QR Code.
Expected: the panel is headed Generate QR Code and offers a URL field and a Foreground Color control. The Generate button is disabled while the URL is empty. After generating, a new block is added and selected, it carries QR metadata whose `type` is `shape` — the plugin's default and the one the kit does not override — and the panel closes.

**QR-05 · browser · Qase 2626 · Change the URL of a newly created QR code**
Steps: after QR-04, keep the new block selected, open the QR panel from the canvas menu, type a different URL.
Expected: the block metadata updates and its `shape/vector_path/path` changes.

### 5.3 Editing an existing QR code

**QR-06 · browser · Qase 2613, 2623 · Edit and clear the URL of a demo QR code**
Steps: select a QR block. Open Edit from the canvas menu. Type a new URL. Then clear the field.
Expected: the canvas menu offers an Edit button for a block that carries QR metadata and none for an image block — this asserts the kit's install reached the canvas-menu order. Typing rewrites the block metadata. Clearing the field leaves the last value in place, which is the plugin's answer for an empty URL; the kit passes no configuration that would change it.
Note: the comparison is against an image block, not the text block: a text block has its own Edit button for text editing, so the label is not unique to the plugin.

**QR-07 · browser · Qase 2614, 2615, 2619 · Change colour, fill and image**
Steps: select a QR block and read the inspector bar and the canvas menu. Then select an image block and read them again.
Expected: the QR block gets a Color control but no Crop, Style or Image entry and no Replace Image button; the image block gets Crop. The plugin disables `ly.img.replace`, `ly.img.crop`, `ly.img.adjustment` and `ly.img.shape.options` for QR blocks, and the kit enables all four globally, so this proves the plugin's predicate wins over the kit's feature list.
Note: the Update QR Code panel has no colour input, so the colour is changed in the inspector bar; the case asserts the affordances rather than driving the colour picker.

**QR-08 · browser · Qase 2616, 2617, 2618 · Stroke, shadow and appearance**
Steps: with a QR block selected, enable the stroke colour, then enable the shadow.
Expected: `isStrokeEnabled` and `isDropShadowEnabled` both become true — the kit enables `ly.img.stroke` and `ly.img.shadow` and the plugin does not disable them. Adjustments is not offered, which QR-07 asserts. Whether the code still scans afterwards is out of scope (section 10).
Note: the stroke control carries its colour as its accessible name (`#ABABAB`), so the case opens it by that name.

**QR-09 · browser · Qase 2620, 2621, 2622 · Duplicate, edit the copy, delete**
Steps: select a QR block, Duplicate. Change the copy's URL. Read the original. Then Delete the copy.
Expected: the duplicate carries its own copy of the metadata; changing its URL leaves the original's metadata and rendered shape untouched. Delete removes it. The kit enables `ly.img.duplicate` and `ly.img.delete`.

### 5.4 Export

**QR-10 · browser · Qase 2580 · Export image**
Steps: open the actions dropdown, click Export Image.
Expected: one PNG download at the page's own resolution, and one `engine.block.export` call with `image/png` and no target size.
Note: the run proved the kit's `exportImage` action unreachable — `ly.img.exportImage.navigationBar` runs `exportDesign` with the mime type only. The dead action was deleted, so 1080 × 1080 never applied.

**QR-11 · browser · Qase 2579 · Export PDF**
Steps: open the actions dropdown, click Export PDF.
Expected: one PDF download with 1 page.

### 5.5 Unit cases (no browser, no engine)

Subject: `src/imgly/plugins/qr-code.ts`, `src/index.ts` and `src/imgly/config/**`, called with a spy `CreativeEditorSDK`.

**QR-U1 · unit · Plugin arguments and dock append**
`setupQRCodePlugin` adds `QRCodePlugin()` with no configuration, so `createdBlockType` stays `shape` and no As-Shape checkbox is added. It then sets the dock order to the previous order followed by `ly.img.spacer` and `ly.img.generate-qr.dock`.

**QR-U2 · unit · Editor initialization**
`initQRCodeEditor` adds `DesignEditorConfig` first, then the fifteen asset-source plugins, then calls `setupQRCodePlugin` last. The fifteen are all in flight before the first one settles, so they register concurrently. Role is `Creator` and theme is `light`.

**QR-U3 · unit · Dock, navigation bar and actions**
`setupDock` sets `dock/hideLabels` false and `dock/iconSize` large and orders Templates, separator, Elements, Uploads, Image, Text, Shapes, Sticker. `setupNavigationBar` puts the actions dropdown last with `exportImage` and `exportPDF` as its children. `setupActions` registers exactly `saveScene`, `exportDesign`, `importScene`, `exportScene` and `uploadFile`, and `exportDesign` downloads what `cesdk.utils.export` returned.

**QR-U4 · unit · Features and settings**
`setupFeatures` enables one explicit leaf list of 109 feature ids, asserted in full, and disables nothing. Among them are `ly.img.page.resize`, `ly.img.stroke.width`, `ly.img.shadow.blur`, `ly.img.duplicate`, `ly.img.delete` and `ly.img.navigation.bar`, which the QR flow needs. No `ly.img.video`, `ly.img.placeholder`, `ly.img.ruler` or `ly.img.settings` id is in the list. `setupSettings` sets `page/title/show` false.

**QR-U6 · unit · UI orchestration**
`setupUI` docks the inspector and the asset library on the left and orders the navigation bar, the dock, the canvas menu and the inspector bar.

**QR-U7 · unit · Keyboard shortcuts**
`setupKeyboardShortcuts` sets one US ANSI catalog, and every entry in it has a key combination and something to run.

Dropped: QR-U5 (asset path resolution). `resolveAssetPath` is gone; the shared `tests/unit/demo-assets.test.ts` covers `src/imgly/demo-assets.ts`.

**QR-U12 · removed.** `resolveAssetPath` is gone; `src/imgly/demo-assets.ts` derives the URL from `VITE_DEMO_ASSETS_BASE_URL` or the kit's own URL.

**KB-01 · unit · Keyboard catalog predicates**

`tests/unit/keyboard-catalog.test.ts` runs every `run` and `when` of `src/imgly/config/keyboard/catalogs/us-ansi.ts` against 1620 editor states (5 edit modes, 9 selections, 3 roles, features on and off, 3 vector states, page and no page) and asserts that none throws, that every shortcut activates in at least one state, and that every function `run` reaches `cesdk.actions.run`. Kit-owned: the kit decides which key does what and when it is live. The catalog measures 100 % lines, branches and functions.

## 6. Entry and exit criteria

Entry: engine and editor built; test license available; the shared kit test harness exists.

Exit: every case in section 5 passes locally and in CI. `npm run ci` passes. The published kit contains no test files. A release run reports results to the Qase ids above.

## 7. Known issues found while writing this plan

Confirm each with a test before fixing.

1. Fixed: the start-up selection was dead — `findByName('QR Code 1')[0]` matched nothing, because no block in the archive has a name. The kit now selects the first block carrying the plugin's `@imgly/plugin-qr-code-web` metadata. Selecting by kind was not possible: the archive holds three `shape` blocks and only two of them are QR codes.
2. The two demo QR codes encode different URL forms for the same destination: `img.ly` without a scheme and `https://img.ly/` with one. Qase 2676 expects both to lead to the img.ly website; a scanner given a bare `img.ly` may treat it as plain text.
3. `config/i18n.ts` is an empty `void cesdk;` stub while the README documents localization.
4. The README's Architecture tree omits `config/keyboard/` and `plugins/qr-code.ts`.

### Coverage residue

None. Every executable line, branch and function of `src/**` is covered by the merged report.

## 8. Open questions

1. Resolved: the kit selects by metadata, so the published archive stays untouched.
2. Open: normalise the first demo QR to `https://img.ly/`. This means re-saving the archive. QR-03 records the current pair of values.
3. Resolved: QR-06 pins that clearing the URL keeps the last value. That decision belongs to the plugin, which already disables the Generate button for an empty value in its own panel.

## 9. Estimate

Measured: 11 browser cases in 30 s on one worker. 28 unit tests under 1 s.

## 10. Boundary review

Rule used: the code that makes a decision owns the test for it. The kit decides that the QR plugin is installed with its default configuration, that its dock entry is pushed to the bottom by a spacer, which asset sources exist, the dock and navigation-bar order, the feature set, the export actions, which archive is loaded and which block is selected on start-up. The plugin decides QR encoding, both panels, the metadata format, the canvas-menu Edit button and the four features it disables on a QR block. The engine decides how a shape renders and what an export produces.

Core behaviour this plan leans on, and where it is covered today:

| Behaviour                                                                        | Owner  | Covered by                                                                                                |
| -------------------------------------------------------------------------------- | ------ | --------------------------------------------------------------------------------------------------------- |
| Loading a scene archive restores its pages, fonts and images                     | engine | `engine/lib/test/api/ArchiveRoundTripAPITest.cpp`, `ArchiveDiskRoundTripAPITest.cpp`                      |
| Block metadata is stored and read back                                           | engine | `engine/lib/test/api/MiscAPITest.cpp` `HasMetadata_False`, `HasMetadata_True`, `HasMetadata_InvalidBlock` |
| A later feature predicate chains onto the earlier one through `isPreviousEnable` | editor | `apps/cesdk_web/packages/api/features/FeatureAPI.test.ts` `describe('isPreviousEnabled() callback')`      |
| `cesdk.utils.export` and `downloadFile`                                          | editor | `apps/cesdk_web/packages/api/utils/UtilsAPI.test.ts`                                                      |
| The default action shapes the kit overrides                                      | editor | `apps/cesdk_web/packages/cesdk/registerDefaultActions.test.ts`                                            |
| PDF export of a scene contains every page                                        | engine | `engine/lib/test/api/ExportAPITest.cpp` `ExportToBuffer_PDF_AllPagesInScene`                              |

Core coverage gaps found (candidates to add in the core suites, not in this kit):

1. `@imgly/plugin-qr-code-web` has no tests and no `test` script in its `package.json`. Nothing covers `generateQr`, `createQRBlock`, `updateQR`, the metadata shape, the shape-versus-fill branch, the four disabling feature predicates, or the selection listener that closes the Update panel. Qase 2613, 2614, 2615, 2616, 2617, 2618, 2619, 2622, 2623, 2624, 2625 and 2626 rest entirely on it. `src/lib/qrcodegen.ts` is a vendored encoder with no test of its own. Suggested home: `apps/cesdk_web_plugins/packages/plugin-qr-code-web/src/__tests__/`, following `plugin-autocaption-web`.
2. Nothing anywhere decodes a rendered QR code. Seven Qase cases (2614–2619) ask whether the code still scans after an appearance change, which is the encoder's error-correction level meeting the renderer's output. Suggested home: the plugin suite from gap 1, decoding an exported PNG, so a single test covers the encoder and the renderer together.
3. `@imgly/plugin-qr-code-web` inserts its canvas-menu component with the deprecated `cesdk.ui.setCanvasMenuOrder`. That is not broken — `UserInterfaceStore.setCanvasMenuOrder` defaults its context to `{ editMode: 'Transform' }`, the same slot `setComponentOrder({ in: 'ly.img.canvas.menu', when: { editMode: 'Transform' } })` writes — but the deprecation lint the static gates are about to make non-vacuous will flag it. Suggested home: the plugin, not this kit.

Until gap 1 is closed, QR-04 and QR-06 keep their metadata assertions as the end-to-end proof.

## 11. Coverage pass

Cases added to close the merged-coverage gaps:

- **QR-U8 · unit · The actions the kit registers — every handler `setupActions` registers is invoked: `saveScene` downloads the saved scene as text, `exportDesign` downloads what `cesdk.utils.export` returned, `importScene` opens the picker for `.imgly,.scene,.zip`, revokes the blob URL on the success and on the failure path and then runs `zoom.toPage`, `exportScene` writes a JSON scene by default and a zip archive for `{ format: 'archive' }`, and `uploadFile` returns what `cesdk.utils.localUpload` returned**
- **QR-U9 · unit · DesignEditorConfig — `initialize` resets the editor, then declares the CE.SDK generation with `setEditorCompatibilityVersion(CreativeEditorSDK.version)` before anything else, then applies features, UI, actions, shortcuts, translations and engine settings; with no `cesdk` in the context it touches the engine not at all**
- **QR-U10 · unit · Video timeline scaffold — `setupVideoTimeline` makes no editor call, so the kit ships the timeline example unapplied**
- **QR-U11 · unit · `src/index.ts` — a successful create loads the demo archive, selects the block carrying the `@imgly/plugin-qr-code-web` metadata and reports the `created` and `ready` demo phases; a scene with no such block selects nothing; a rejected create reports `failed` and logs the failure**

The only uncovered item left is the one below.
Residue: none from the asset base; `src/imgly/demo-assets.ts` is covered by the shared `tests/unit/demo-assets.test.ts`.
