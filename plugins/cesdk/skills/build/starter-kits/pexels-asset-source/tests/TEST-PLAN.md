# Test plan: starterkit-pexels-asset-source

Version 5, 7 Sep 2026. Status: implemented. 10 browser cases and 55 unit cases; `KIT_TEST_COVERAGE=1 npm run ci` green. Merged coverage is lines 100 %, branches 100 %, functions 100 %.

## 1. Purpose

Verify that the Pexels starter kit works as shipped: the editor replaces its Images library with Pexels, the asset source builds the right request with the API key, maps the response to CE.SDK assets with attribution, and tells the user when no key is configured.

## 2. Scope

In scope

- The Pexels asset source: request building, the `Authorization` header, paging, response mapping, credits, licence, UTM parameters
- The unconfigured path: the alert and the console message when no API key is set
- The dock entry that replaces `ly.img.image`, the asset library entry, and the Replace override
- The API key the kit reads from `VITE_PEXELS_API_KEY`
- Editor start-up with the demo scene
- The kit's own code under `src/imgly/` and `src/index.ts`

Out of scope

- Core editor features used through this kit (asset panel rendering, search box, infinite scroll, Replace UI). Covered by the core editor suite.
- The demo site around the kit (cards, tags, links, platform toggles, the desktop and mobile switch). Covered by the `cesdk_web_demos` suite. Qase 837, 838, 839, 840, 841, 856, 865, 2432, 2433, 2434, 2436, and 2472, which asks whether edits survive the demo site's device toggle and is a property of that site's iframe handling, not of the kit.

## 3. Test environment

- Browser: Chrome, headless, 1400 × 900
- Engine and editor: built from this repo, served locally. Requests to `cdn.img.ly` for engine assets fail the test.
- License: the shared test license (valid on hostname `localhost` only)
- Data: the kit's own `public/assets/pexels.scene`, 1 page with 3 image blocks and 1 text block
- **No live Pexels traffic and no real API key.** The kit is started with `VITE_PEXELS_API_KEY` set to a fixed test string, and every browser case installs a `page.route` on `https://api.pexels.com/v1/**` that answers from a fixture and asserts the `Authorization` header. A test that reaches the real host fails on the network guard.
- PEX-08 covers the unconfigured path. The key is baked in at start-up, so the kit's `tests/playwright.config.ts` runs a **second dev server** on the kit's port + 700 with `VITE_PEXELS_API_KEY` empty, and a `chrome-unconfigured` project that only matches `unconfigured.spec.ts`. That project is the only one allowed to see the `console.error`; the allowlist entry is a regular expression matching the exact message `Pexels API key not configured. Please set VITE_PEXELS_API_KEY environment variable.`
- PEX-07 runs in its own `chrome-api-errors` project, whose allowlist carries `Pexels API error:` and Chrome's own `Failed to load resource: … 429`, anchored to the kit's own API host so the host is part of the entry.
- Unit cases stub `globalThis.fetch` and call the asset source factory directly; no browser, no engine. Needs the export in open question 1.
- Downloads: captured by Playwright and checked by file type, pixel size, and PDF page count

## 4. Approach

| Kind    | Tool                          | What it checks                                                      | Run                 |
| ------- | ----------------------------- | ------------------------------------------------------------------- | ------------------- |
| Static  | tsc, eslint, convention check | Types, deprecated APIs, kit folder shape                            | `npm run check:all` |
| Unit    | Vitest                        | Request building, paging, response mapping, dock and feature config | `npm run test:unit` |
| Browser | Playwright                    | The test cases in section 5                                         | `npm run test:e2e`  |

All three run in the kit's `ci` script. Browser tests use role and label locators only. The asset source needs neither a DOM nor an engine, so the mapping is covered by unit cases and the browser keeps one end-to-end proof per feature. There are no headless cases.

## 5. Test cases

Format: ID, level, Qase id, title. Then steps and expected result.
Common precondition for all browser cases except PEX-08: the API route is mocked, the key is set, the kit is open, and the scene has finished loading.

### 5.1 Start-up and the library

**PEX-01 · browser · Editor loads with Pexels in the dock**
Steps: open the kit.
Expected: the scene is on the canvas. The dock entry that would be Images is labelled "Pexels". No console errors. No engine asset from `cdn.img.ly`.

**PEX-02 · browser · The Pexels panel lists assets**
Steps: click Pexels in the dock.
Expected: the panel requests `https://api.pexels.com/v1/curated` with `page=1` and a positive `per_page` (30 in practice), and the `Authorization` header carries the configured key. The fixture's photos are shown.
Note: the source's `credits` are not rendered as text in the panel, so the footer claim was dropped after the run. The mapped assets carry no `label`, so their tiles have no accessible name (known issue 8) and the browser cases locate them by position within the panel.

**PEX-03 · browser · Search sends the query**
Steps: type `forest` in the panel's search field.
Expected: the panel requests `https://api.pexels.com/v1/search` with `query=forest`, not `curated`.

**PEX-04 · browser · Scrolling requests the next page**
Steps: scroll the grid to the end.
Expected: a second request with `page=2` while the fixture reports a `next_page`; when the fixture omits `next_page`, no further request is made.

**PEX-05 · browser · Apply a photo to the canvas**
Steps: click a photo in the panel.
Expected: a new graphic is added whose image fill URI is the fixture's `src.original`, and the block carries the photographer's name as credits.

**PEX-06 · browser · Qase 866 · Replace a sample image keeps the placeholder UI**
Steps: select one of the three images on the page, use Replace.
Expected: the Replace panel offers Pexels and nothing else. After picking a photo the fill changes and the placeholder overlay and button are still shown on the block.

**PEX-07 · browser · The API fails**
Steps: answer the route with HTTP 429, then open the panel.
Expected: the panel shows its empty state, the editor stays usable, and the failure is logged once and swallowed by the source, not surfaced as an unhandled rejection.

**PEX-08 · browser · No API key configured**
Steps: start the kit with `VITE_PEXELS_API_KEY` unset, open the Pexels panel.
Expected: one `alert` naming `VITE_PEXELS_API_KEY` and the free-key URL, the panel shows its empty state, and no request goes to `api.pexels.com`. Opening the panel a second time in the same session logs the console message instead of alerting again.

### 5.2 Export

**PEX-09 · browser · Qase 855 · Export image**
Steps: open the actions menu in the navigation bar, click Export Image.
Expected: one PNG download of 1819 × 1311 px, the demo scene's own page size.
Note: the run proved the plan wrong. `ly.img.exportImage.navigationBar` runs `exportDesign`, which sends no target size, so the kit's 1080 × 1080 `exportImage` action was never reached. That registration is deleted in this wave, and PEX-U8 keeps it deleted.
Asserts the options the kit passes to `engine.block.export` and that a file of the declared type downloaded; the exported pixel size belongs to `engine/lib/test/api/ExportAPITest.cpp`.

**PEX-10 · browser · Qase 854 · Export PDF**
Steps: open the actions menu, click Export PDF.
Expected: one PDF download with 1 page.
Asserts the options the kit passes to `engine.block.export` and that a file of the declared type downloaded; the exported pixel size belongs to `engine/lib/test/api/ExportAPITest.cpp`.

### 5.3 Unit cases (no browser, no engine)

Subject: `src/imgly/plugins/pexels.ts`, through the asset source factory.

All seven unit groups are implemented. `PEX-U5` lives in its own file, `tests/unit/no-api-key.test.ts`, because the warning latch is module state and Vitest isolates modules per file.

**PEX-U1 · unit · Photo mapping**
A Pexels photo maps to an `AssetResult` with the id as a string, `meta.uri` from `src.original`, `meta.thumbUri` from `src.medium`, width and height, `blockType` `//ly.img.ubq/graphic`, `fillType` `//ly.img.ubq/fill/image`, `kind` `image`, credits with the photographer and their URL, and UTM `source: 'CE.SDK Demo'`, `medium: 'referral'`.

**PEX-U2 · unit · Request building**
`findAssets({ page: 0, perPage: 20 })` calls `curated` with `page=1`; with a query it calls `search` with the query and the same 1-based page. The `Authorization` header is the key, and the key never appears in the URL.

**PEX-U3 · unit · Paging**
`next_page` present gives `nextPage = queryData.page + 1`; absent gives undefined; an empty `photos` array gives undefined even when `next_page` is present.

**PEX-U4 · unit · HTTP and network errors**
A non-2xx response and a rejected `fetch` both resolve to the empty result and log once. The empty result reports `currentPage: 0` even when page 3 was asked for, see known issue 3.

**PEX-U5 · unit · No API key**
The first call alerts and returns the empty result; the second call logs and returns the empty result. The warning latch is module state, so the test must reset the module between cases, see known issue 2.

**PEX-U6 · unit · Source identity**
The source id is `pexels`, its credits are Pexels with `https://www.pexels.com/`, and its licence is the Pexels licence with `https://www.pexels.com/license/`.

**PEX-U8 · unit · Registered actions**
`setupActions` on a spy `cesdk` registers the actions the kit's UI reaches.

**PEX-U7 · unit · Editor configuration**
`setupDock` and `setupFeatures` on a spy `cesdk`: the dock order matches `config/`, and `setupFeatures` enables exactly the list `config/features.ts` names, in that order. `initPexelsImageEditor` adds the configuration plugin on its own, then the fifteen asset-source plugins in one concurrent batch, then Pexels last; it passes the key through to the plugin, and the plugin falls back to an empty string when no key is given.

**PEX-U10 · unit · Panel placement and `setupUI`**
`setupPanels` docks the inspector and the asset library on the left and leaves neither floating. `setupUI` positions the panels before it sets any component order, and it orders exactly the dock, the navigation bar, the canvas bar, the canvas menu and the inspector bar — the video timeline stays at the editor default.

**PEX-U11 · unit · The canvas bar, the canvas menus and the inspector bar**
`setupCanvas` puts the add-page button in a bottom canvas bar; the Transform menu offers duplicate and delete, the Text menu the formatting controls, and the Vector menu is empty. The Transform inspector bar carries crop, fill and the inspector toggle; the Crop bar carries only the crop controls; the Vector bar ends with `ly.img.vectorEdit.done.inspectorBar`.

**PEX-U12 · unit · The navigation bar and the engine settings**
`setupNavigationBar` offers image and PDF export from one actions entry. `setupSettings` writes the crop, page and page-title settings the kit relies on.

**PEX-U13 · unit · The setups the kit leaves empty**
`setupComponents` and `setupVideoTimeline` make no call. `setupKeyboardShortcuts` calls `shortcuts.set` once with the US ANSI catalog object itself.

**PEX-U14 · unit · `DesignEditorConfig`**
The plugin is named `cesdk-design-editor` and carries `CreativeEditorSDK.version`. `initialize` resets the editor first, declares the editor compatibility version it was written for, then runs the feature, UI, action, shortcut, translation and engine-setting setup. Without a `cesdk` in the context it touches neither the editor nor the engine.

**PEX-U15 · unit · The action handlers**
`saveScene` downloads the scene as `text/plain;charset=UTF-8`. `exportDesign` forwards the caller's options unchanged. `importScene` picks a `.imgly,.scene,.zip` object URL, loads it, revokes the URL — including when the load rejects — and then fits the first page. `exportScene` writes text by default and a `application/zip` archive for `format: 'archive'`. `uploadFile` forwards the file and the context to `utils.localUpload`.

**PEX-U20 · unit · The plugin without an editor**
`PexelsAssetSourcePlugin.initialize` registers nothing when the context carries no `cesdk`, so an engine-only host stays untouched.

**PEX-U21 · unit · `src/index.ts`**
The entry creates the editor with the kit's user id, initialises Pexels and loads the demo scene and publishes the editor on `window`. It reports the demo lifecycle to the host that embeds it: `created` then `ready`, and `failed` alone when the create rejects. A failed start-up is reported instead of leaving an unhandled rejection.

**PEX-U22 · removed.** `resolveAssetPath` is gone; `src/imgly/demo-assets.ts` derives the URL from `VITE_DEMO_ASSETS_BASE_URL` or the kit's own URL.

**KB-01 · unit · Keyboard catalog predicates**

`tests/unit/keyboard-catalog.test.ts` runs every `run` and `when` of `src/imgly/config/keyboard/catalogs/us-ansi.ts` against 1620 editor states (5 edit modes, 9 selections, 3 roles, features on and off, 3 vector states, page and no page) and asserts that none throws, that every shortcut activates in at least one state, and that every function `run` reaches `cesdk.actions.run`. Kit-owned: the kit decides which key does what and when it is live. The catalog measures 100 % lines, branches and functions.

## 6. Entry and exit criteria

Entry: engine and editor built; test license available; the shared kit test harness exists, including the mocked-route helper and the per-case console allowlist; `createPexelsAssetSource` exported per open question 1; the kit's `test:unit` and `test:e2e` scripts replaced with the real commands (they are `exit 0` today).

Exit: every case in section 5 passes locally and in CI. `npm run ci` passes. No test contacts `api.pexels.com` and no real key is needed. The published kit contains no test files. A release run reports results to the Qase ids above.

## 7. Known issues found while writing this plan

Confirm each with a test before fixing.

Fixed in this wave: the `export` half of issue 1, and the `.env.example` placeholder (new issue 9).

1. ~~`createPexelsAssetSource` has no `export` keyword.~~ Fixed: it is exported. The README is still wrong — it tells the reader to import `setupPexelsAssetSource` from `./imgly/asset-sources/pexels`, and neither the symbol nor the path exists.
2. `hasShownApiKeyWarning` is module-level state. Two editors on one page share it, so the second one never warns, and a test suite has to reset the module to exercise both branches.
3. `EMPTY_RESULT` is a single shared object returned on every error path, with `currentPage: 0` regardless of the page that was asked for. A consumer that mutates it corrupts every later error result.
4. The plugin's JSDoc says the API key "can also be set via `VITE_PEXELS_API_KEY` environment variable", but the plugin reads no environment variable; only `src/index.ts` does.
5. The key is sent from the browser, so it is visible to anyone using the deployed kit. The README says to consider a proxy but the kit ships the direct call. Worth stating in the panel or the README's first paragraph rather than a note halfway down.
6. `config/i18n.ts` is an empty `void cesdk;` stub while the README documents localization.
7. The README Architecture tree omits `config/keyboard/`, which the kit ships and `plugin.ts` calls.
8. The mapped `AssetResult` carries no `label`, so every Pexels tile in the panel renders without an accessible name. The sibling Getty and Unsplash kits both set one. A screen-reader user hears an unlabelled button, and a test cannot address a specific photo by name.
9. ~~`.env.example` set `VITE_PEXELS_API_KEY=YOUR_PEXELS_API_KEY_HERE`.~~ Fixed: the value is empty, so copying the file runs the kit's own alert rather than sending a placeholder key to Pexels. Same defect class as the Getty and Unsplash placeholders.

### Coverage residue

None. Every executable line, branch and function of `src/**` is covered by the merged report.

## 8. Open questions

1. Export `createPexelsAssetSource` so PEX-U1 to PEX-U6 can run as unit cases. Recommended: yes; the JSDoc already claims it is exported, and without it the mapping has to be proved through 6 more browser cases at about 8 s each.
2. Issue 2: replace the module latch with an instance field on the plugin. Recommended: yes, it is a two-line change and it makes the behaviour testable.
3. Is the browser-visible API key acceptable for a shipped starter kit, or should this kit move to a proxy like the Getty and Unsplash kits? Recommended: keep the direct call, since it is what the Pexels documentation shows, and make the warning louder. Needs a product decision.

## 9. Estimate

Measured: 10 browser cases in 47 s on one worker (two dev servers), 26 unit cases in under 0.4 s. Merged coverage: lines 90.71 %, branches 97.37 %, functions 16.09 %; the Vitest gate sits at lines 61 %, branches 97 %, functions 16 %.

## 10. Boundary review

Rule used: the code that makes a decision owns the test for it. The kit decides the endpoint, the key handling, the request parameters, how a photo maps to an `AssetResult`, the credits and UTM parameters, the dock entry, the library entry and the Replace override. The editor decides how a source is rendered in a panel, how search and infinite scroll call `findAssets`, and how Replace opens. The engine decides what applying an asset does to a block.

Core behaviour this plan leans on, and where it is covered today:

| Behaviour                                                                                                                                  | Owner  | Covered by                                                                                                                                         |
| ------------------------------------------------------------------------------------------------------------------------------------------ | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| A custom asset source registered with `addSource` is queried through `findAssetSourceAssets`                                               | engine | `engine/lib/test/api/AssetAPITest.cpp` `AddCustomAssetSource`, `FindAssetSourceAssets`; `bindings/wasm/js_node/src/__tests__/shared-tests.test.ts` |
| Applying an image asset creates a graphic with an image fill                                                                               | engine | `engine/lib/test/api/UBQApplyAssetCreationDeepAPITest.cpp`, `engine/lib/test/api/AssetSourceAPITest.cpp` default apply tests                       |
| `addAssetLibraryEntry`, `getComponentOrder`, `setComponentOrder`, `setReplaceAssetLibraryEntries`                                          | editor | `apps/cesdk_web/packages/api/ui/UserInterfaceAPI.test.ts`                                                                                          |
| Replace picks library entries from the selected block's fill type                                                                          | editor | `apps/cesdk_web/packages/ui/components/assets/getReplaceLibraryEntries.test.ts`                                                                    |
| Legacy `//ly.img.ubq/image` blocks in the demo scene load as graphic plus image fill, so the fill type the Replace override keys on exists | engine | `engine/src/ubq/editor/SceneSerializer.cpp` conversion pass; exercised by the frozen scene corpus in `engine/test/resources/serialization/scenes/` |

Core coverage gaps found (candidates to add in the core suites, not in this kit):

1. Editor: the asset panel's paging contract. Nothing asserts which `page` value the panel sends for the first query, or that it follows `nextPage` from the previous result. Every custom asset source in the fleet has to guess it. Suggested home: `apps/cesdk_web/packages/ui/components/assets/`.
2. Editor: what a panel shows when `findAssets` returns an empty result versus when it rejects. PEX-07 and PEX-08 both depend on it and there is no test for either state. Suggested home: `apps/cesdk_web/packages/ui/components/assets/`.

Until gap 1 is closed, PEX-04 keeps its request assertion as the end-to-end proof.
