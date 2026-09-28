# Test plan: starterkit-getty-asset-source

Version 5, 7 Sep 2026. Status: implemented. 11 browser cases and 52 unit cases; `KIT_TEST_COVERAGE=1 npm run ci` green. Merged coverage is lines 100 %, branches 100 %, functions 100 %.

## 1. Purpose

Verify that the Getty Images starter kit works as shipped: the editor replaces its Images library with Getty Images, the asset source calls the configured proxy with the right parameters, passes the proxy's results to the panel, and tells the user when no proxy is configured.

## 2. Scope

In scope

- The Getty Images asset source: proxy URL handling, request parameters, the default query, error handling, credits and licence
- The unconfigured path: the alert and the console message when no proxy URL is set
- The dock entry that replaces `ly.img.image`, the asset library entry, and the Replace override
- The proxy URL the kit reads from `VITE_GETTY_IMAGES_PROXY_URL`
- Editor start-up with the demo scene
- The kit's own code under `src/imgly/` and `src/index.ts`

Out of scope

- Core editor features used through this kit (asset panel rendering, search box, infinite scroll, Replace UI). Covered by the core editor suite.
- The demo site around the kit (cards, tags, links, platform toggles, the desktop and mobile switch). Covered by the `cesdk_web_demos` suite. Qase 905, 906, 907, 908, 909, 924, 933, 2440, 2441, 2442, 2444, and 2473, which asks whether edits survive the demo site's device toggle and is a property of that site's iframe handling, not of the kit.
- The proxy server itself. The kit does not ship one; the README only states the response shape it expects.

## 3. Test environment

- Browser: Chrome, headless, 1400 × 900
- Engine and editor: built from this repo, served locally. Requests to `cdn.img.ly` for engine assets fail the test.
- License: the shared test license (valid on hostname `localhost` only)
- Data: the kit's own `public/assets/getty-images.scene`, 1 page with 3 image blocks and 1 text block
- **No live Getty traffic and no real proxy.** The kit is started with `VITE_GETTY_IMAGES_PROXY_URL=https://getty-proxy.test/api`, and every browser case installs a `page.route` on that URL that answers with a fixture in `AssetsQueryResult` shape. Image URIs in the fixture point at the kit's own `public/assets/`, so nothing leaves the machine. A test that reaches a real host fails on the network guard.
- GET-08 covers the unconfigured path. The proxy URL is baked in at start-up, so the kit's `tests/playwright.config.ts` runs a **second dev server** on the kit's port + 700 with `VITE_GETTY_IMAGES_PROXY_URL` empty, and a `chrome-unconfigured` project that only matches `unconfigured.spec.ts`. That project is the only one allowed to see the `console.error`; the allowlist entry is a regular expression matching the exact message `Getty Images proxy URL not configured. Please set VITE_GETTY_IMAGES_PROXY_URL environment variable.`
- GET-07 runs in its own `chrome-proxy-errors` project, whose allowlist carries `Getty Images API error:` (the line the kit logs when it swallows a proxy failure) and Chrome's own `Failed to load resource: … 502`, anchored to the kit's own proxy host so the host is part of the entry. No other project may see either.
- Unit cases stub `globalThis.fetch` and call the asset source factory directly; no browser, no engine. Needs the export in open question 1.
- Downloads: captured by Playwright and checked by file type, pixel size, and PDF page count

## 4. Approach

| Kind    | Tool                          | What it checks                                               | Run                 |
| ------- | ----------------------------- | ------------------------------------------------------------ | ------------------- |
| Static  | tsc, eslint, convention check | Types, deprecated APIs, kit folder shape                     | `npm run check:all` |
| Unit    | Vitest                        | Proxy request building, error paths, dock and feature config | `npm run test:unit` |
| Browser | Playwright                    | The test cases in section 5                                  | `npm run test:e2e`  |

All three run in the kit's `ci` script. Browser tests use role and label locators only. The asset source needs neither a DOM nor an engine, so its logic is covered by unit cases and the browser keeps one end-to-end proof per feature. There are no headless cases.

## 5. Test cases

Format: ID, level, Qase id, title. Then steps and expected result.
Common precondition for all browser cases except GET-08: the proxy route is mocked, the proxy URL is set, the kit is open, and the scene has finished loading.

### 5.1 Start-up and the library

**GET-01 · browser · Editor loads with Getty Images in the dock**
Steps: open the kit.
Expected: the scene is on the canvas. The dock entry that would be Images is labelled "Getty Images". No console errors. No engine asset from `cdn.img.ly`.

**GET-02 · browser · The Getty Images panel lists assets**
Steps: click Getty Images in the dock.
Expected: the panel requests the proxy with `query=business`, `page=1` and a positive `perPage` (30 in practice), and shows the fixture's assets.
Note: the source's `credits` are not rendered as text in the panel, so the footer claim was dropped after the run.

**GET-03 · browser · Search sends the query**
Steps: type `office` in the panel's search field.
Expected: the request carries `query=office`. The default `business` is used only when the search field is empty, see known issue 3.

**GET-04 · browser · Scrolling requests the next page**
Steps: scroll the grid to the end.
Expected: a second request with `page=2` while the fixture reports a `nextPage`; when the fixture sets `nextPage` to undefined, no further request is made.

**GET-05 · browser · Apply an asset to the canvas**
Steps: click an asset in the panel.
Expected: a new graphic is added whose image fill URI is the fixture's `meta.uri`, and the block carries the fixture's credits.

**GET-06 · browser · Qase 934 · Replace a sample image keeps the placeholder UI**
Steps: select one of the three images on the page, use Replace.
Expected: the Replace panel offers Getty Images and nothing else. After picking an asset the fill changes and the placeholder overlay and button are still shown on the block.

**GET-07 · browser · The proxy fails or answers with the wrong shape**
Steps: answer the route with HTTP 502; then answer it with `200` and a body that is not an `AssetsQueryResult`.
Expected: in both cases the editor stays usable and the failure is reported once, on the console only.
Note: the two bodies land in different states. A 502 makes the source return its empty result, and the panel shows "No Elements". A body with no `assets` field is handed to the engine unchecked (known issue 4), the engine rejects the query, and the panel shows "Cannot connect to asset source" while the rejection is logged.

**GET-08 · browser · No proxy URL configured**
Steps: start the kit with `VITE_GETTY_IMAGES_PROXY_URL` unset, open the Getty Images panel.
Expected: one `alert` naming the proxy requirement, the panel shows its empty state, and no request leaves the page. Opening the panel a second time in the same session logs the console message instead of alerting again.

### 5.2 Export

**GET-09 · browser · Qase 922 · Export image**
Steps: open the actions menu in the navigation bar, click Export Image.
Expected: one PNG download of 1819 × 1311 px, the demo scene's own page size.
Note: the run proved the plan wrong. `ly.img.exportImage.navigationBar` runs `exportDesign`, which sends no target size, so the kit's 1080 × 1080 `exportImage` action was never reached. That registration is deleted in this wave, and GET-U7 keeps it deleted.
Asserts the options the kit passes to `engine.block.export` and that a file of the declared type downloaded; the exported pixel size belongs to `engine/lib/test/api/ExportAPITest.cpp`.

**GET-10 · browser · Qase 4806 · Export PDF**
Steps: open the actions menu, click Export PDF.
Expected: one PDF download with 1 page.
Asserts the options the kit passes to `engine.block.export` and that a file of the declared type downloaded; the exported pixel size belongs to `engine/lib/test/api/ExportAPITest.cpp`.

### 5.3 Unit cases (no browser, no engine)

Subject: `src/imgly/plugins/getty-images.ts`, through the asset source factory.

All six unit groups are implemented. `GET-U4` lives in its own file, `tests/unit/no-proxy-url.test.ts`, because the warning latch is module state and Vitest isolates modules per file.

**GET-U1 · unit · Request building**
`findAssets({ page: 0, perPage: 20 })` requests `<proxy>?query=business&page=1&perPage=20`. With a query it sends that query instead. The page number sent is always 1-based.

**GET-U2 · unit · Pass-through of the proxy result**
The proxy's JSON body is returned to the caller unchanged, including `total`, `currentPage` and `nextPage`.

**GET-U3 · unit · HTTP and network errors**
A non-2xx response and a rejected `fetch` both resolve to the empty result and log once. The empty result reports `currentPage: 0` even when page 3 was asked for, see known issue 5.

**GET-U4 · unit · No proxy URL**
The first call alerts and returns the empty result; the second call logs and returns the empty result. The warning latch is module state, so the test must reset the module between cases, see known issue 2.

**GET-U5 · unit · Source identity**
The source id is `gettyImagesImageAssets`, its credits are Getty Images with `https://www.gettyimages.com/`, and its licence is the Getty Images Content License Agreement with `https://www.gettyimages.com/eula`.

**GET-U7 · unit · Registered actions**
`setupActions` on a spy `cesdk` registers the actions the kit's UI reaches.

**GET-U6 · unit · Editor configuration**
`setupDock` and `setupFeatures` on a spy `cesdk`: the dock order matches `config/`, and `setupFeatures` enables exactly the list `config/features.ts` names, in that order. `initGettyImagesEditor` adds the configuration plugin on its own, then the fifteen asset-source plugins in one concurrent batch, then Getty Images last; it passes the proxy URL through to the plugin, and the plugin falls back to an empty string when none is given.

**GET-U10 · unit · Panel placement and `setupUI`**
`setupPanels` docks the inspector and the asset library on the left and leaves neither floating. `setupUI` positions the panels before it sets any component order, and it orders exactly the dock, the navigation bar, the canvas bar, the canvas menu and the inspector bar — the video timeline stays at the editor default.

**GET-U11 · unit · The canvas bar, the canvas menus and the inspector bar**
`setupCanvas` puts the add-page button in a bottom canvas bar; the Transform menu offers duplicate and delete, the Text menu the formatting controls, and the Vector menu is empty. The Transform inspector bar carries crop, fill and the inspector toggle; the Crop bar carries only the crop controls; the Vector bar ends with `ly.img.vectorEdit.done.inspectorBar`.

**GET-U12 · unit · The navigation bar and the engine settings**
`setupNavigationBar` offers image and PDF export from one actions entry. `setupSettings` writes the crop, page and page-title settings the kit relies on.

**GET-U13 · unit · The setups the kit leaves empty**
`setupComponents` and `setupVideoTimeline` make no call. `setupKeyboardShortcuts` calls `shortcuts.set` once with the US ANSI catalog object itself.

**GET-U14 · unit · `DesignEditorConfig`**
The plugin is named `cesdk-design-editor` and carries `CreativeEditorSDK.version`. `initialize` resets the editor first, declares the editor compatibility version it was written for, then runs the feature, UI, action, shortcut, translation and engine-setting setup. Without a `cesdk` in the context it touches neither the editor nor the engine.

**GET-U15 · unit · The action handlers**
`saveScene` downloads the scene as `text/plain;charset=UTF-8`. `exportDesign` forwards the caller's options unchanged. `importScene` picks a `.imgly,.scene,.zip` object URL, loads it, revokes the URL — including when the load rejects — and then fits the first page. `exportScene` writes text by default and a `application/zip` archive for `format: 'archive'`. `uploadFile` forwards the file and the context to `utils.localUpload`.

**GET-U20 · unit · The plugin without an editor**
`GettyImagesAssetSourcePlugin.initialize` registers nothing when the context carries no `cesdk`, so an engine-only host stays untouched.

**GET-U21 · unit · `src/index.ts`**
The entry creates the editor with the kit's user id, initialises Getty Images and loads the demo scene and publishes the editor on `window`. It reports the demo lifecycle to the host that embeds it: `created` then `ready`, and `failed` alone when the create rejects. A failed start-up is reported instead of leaving an unhandled rejection.

**GET-U22 · removed.** `resolveAssetPath` is gone; `src/imgly/demo-assets.ts` derives the URL from `VITE_DEMO_ASSETS_BASE_URL` or the kit's own URL.

**KB-01 · unit · Keyboard catalog predicates**

`tests/unit/keyboard-catalog.test.ts` runs every `run` and `when` of `src/imgly/config/keyboard/catalogs/us-ansi.ts` against 1620 editor states (5 edit modes, 9 selections, 3 roles, features on and off, 3 vector states, page and no page) and asserts that none throws, that every shortcut activates in at least one state, and that every function `run` reaches `cesdk.actions.run`. Kit-owned: the kit decides which key does what and when it is live. The catalog measures 100 % lines, branches and functions.

## 6. Entry and exit criteria

Entry: engine and editor built; test license available; the shared kit test harness exists, including the mocked-route helper and the per-case console allowlist; `createGettyImagesAssetSource` exported per open question 1; the kit's `test:unit` and `test:e2e` scripts replaced with the real commands (they are `exit 0` today).

Exit: every case in section 5 passes locally and in CI. `npm run ci` passes. No test contacts a real proxy and no secret is needed. The published kit contains no test files. A release run reports results to the Qase ids above.

## 7. Known issues found while writing this plan

Confirm each with a test before fixing.

Fixed in this wave: issue 1 (`.env.example` placeholder now empty) and issue 6 (`createGettyImagesAssetSource` is exported, and its duplicated doc comment removed).

1. ~~`.env.example` sets `VITE_GETTY_IMAGES_PROXY_URL=VITE_GETTY_IMAGES_PROXY_URL_HERE`.~~ Fixed: the value is empty, so copying the file runs the kit's own alert.
2. `hasShownProxyUrlWarning` is module-level state. Two editors on one page share it, so the second one never warns, and a test suite has to reset the module to exercise both branches.
3. With an empty search the kit queries `business`. Nothing in the README or the panel says so, so an integrator sees a curated-looking default that is really a hardcoded search term.
4. The proxy body is cast to `AssetsQueryResult` and returned without any check. A proxy that answers with an error object, an array, or a missing `assets` field hands that straight to the panel.
5. `EMPTY_RESULT` is a single shared object returned on every error path, with `currentPage: 0` regardless of the page that was asked for. A consumer that mutates it corrupts every later error result.
6. ~~`createGettyImagesAssetSource` is not exported.~~ Fixed: it is exported and the duplicated doc comment is gone.
7. The README's Configuration section imports `setupGettyImagesAssetSource` from `./imgly/plugins/getty-images`. That symbol does not exist; the module exports `GettyImagesAssetSourcePlugin`.
8. `scripts/setup-secrets.sh` overwrites `.env` with only `VITE_CESDK_LICENSE`, so running `npm run secrets` deletes the proxy URL the user had set.
9. `config/i18n.ts` is an empty `void cesdk;` stub, and the README Architecture tree omits `config/keyboard/`, which the kit ships and `plugin.ts` calls.

### Coverage residue

None. Every executable line, branch and function of `src/**` is covered by the merged report.

## 8. Open questions

1. ~~Export `createGettyImagesAssetSource`.~~ Done in this wave.
2. Issue 4: validate the proxy body before returning it, or keep the cast. Recommended: check that `assets` is an array and fail to the empty result otherwise. The kit is the only thing standing between an integrator's proxy and the panel.
3. Issue 3: document the `business` default in the README, or drop it and send an empty query. Recommended: document it; the proxy contract in the README does not say whether an empty query is allowed.

## 9. Estimate

Measured: 11 browser cases in 1.5 minutes on one worker (two dev servers), 23 unit cases in under 0.4 s. Merged coverage: lines 90.47 %, branches 96.77 %, functions 14.12 %; the Vitest gate sits at lines 60 %, branches 96 %, functions 14 %.

## 10. Boundary review

Rule used: the code that makes a decision owns the test for it. The kit decides the proxy URL handling, the request parameters, the default query, what happens on an error, the credits and licence, the dock entry, the library entry and the Replace override. The editor decides how a source is rendered in a panel, how search and infinite scroll call `findAssets`, and how Replace opens. The engine decides what applying an asset does to a block.

Core behaviour this plan leans on, and where it is covered today:

| Behaviour                                                                                                                                  | Owner  | Covered by                                                                                                                                         |
| ------------------------------------------------------------------------------------------------------------------------------------------ | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| A custom asset source registered with `addSource` is queried through `findAssetSourceAssets`                                               | engine | `engine/lib/test/api/AssetAPITest.cpp` `AddCustomAssetSource`, `FindAssetSourceAssets`; `bindings/wasm/js_node/src/__tests__/shared-tests.test.ts` |
| Applying an image asset creates a graphic with an image fill                                                                               | engine | `engine/lib/test/api/UBQApplyAssetCreationDeepAPITest.cpp`, `engine/lib/test/api/AssetSourceAPITest.cpp` default apply tests                       |
| An asset with a missing `meta.uri` is rejected rather than applied                                                                         | engine | `engine/lib/test/api/UBQApplyAssetCreationDeepAPITest.cpp` `applyAssetToBlockMissingUriRejected`                                                   |
| `addAssetLibraryEntry`, `getDockOrder`, `setDockOrder`, `setReplaceAssetLibraryEntries`                                                    | editor | `apps/cesdk_web/packages/api/ui/UserInterfaceAPI.test.ts`, `apps/cesdk_web/packages/cesdk/stores/UserInterfaceStore.test.ts`                       |
| Replace picks library entries from the selected block's fill type                                                                          | editor | `apps/cesdk_web/packages/ui/components/assets/getReplaceLibraryEntries.test.ts`                                                                    |
| Legacy `//ly.img.ubq/image` blocks in the demo scene load as graphic plus image fill, so the fill type the Replace override keys on exists | engine | `engine/src/ubq/editor/SceneSerializer.cpp` conversion pass; exercised by the frozen scene corpus in `engine/test/resources/serialization/scenes/` |

Core coverage gaps found (candidates to add in the core suites, not in this kit):

1. Editor: the asset panel's paging contract. Nothing asserts which `page` value the panel sends for the first query, or that it follows `nextPage` from the previous result. Every custom asset source in the fleet has to guess it. Suggested home: `apps/cesdk_web/packages/ui/components/assets/`.
2. Editor: what a panel does when `findAssets` resolves to a value that is not an `AssetsQueryResult`. GET-07 depends on it and there is no test. The engine already rejects an asset with no `meta.uri`, so the gap is only in the panel. Suggested home: `apps/cesdk_web/packages/ui/components/assets/`.

Until gap 1 is closed, GET-04 keeps its request assertion as the end-to-end proof.
