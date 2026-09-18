# Test plan: starterkit-unsplash-asset-source

Version 5, 7 Sep 2026. Status: implemented. 9 browser cases and 55 unit cases; `KIT_TEST_COVERAGE=1 npm run ci` green. Merged coverage is lines 99.85 %, branches 98.41 %, functions 100 %. The paging off-by-one is fixed.

## 1. Purpose

Verify that the Unsplash starter kit works as shipped: the editor replaces its Images library with Unsplash, the asset source builds the right request, maps the response to CE.SDK assets with attribution, and Replace on an image offers Unsplash.

## 2. Scope

In scope

- The Unsplash asset source: request building, paging, response mapping, credits, licence, UTM parameters
- The dock entry that replaces `ly.img.image`, the asset library entry, and the Replace override
- The proxy URL the kit reads from `VITE_UNSPLASH_API_URL` and its fallback
- Editor start-up with the demo scene
- The kit's own code under `src/imgly/` and `src/index.ts`

Out of scope

- Core editor features used through this kit (asset panel rendering, search box, infinite scroll, Replace UI). Covered by the core editor suite.
- The demo site around the kit (cards, tags, links, platform toggles, the desktop and mobile switch). Covered by the `cesdk_web_demos` suite. Qase 800, 801, 802, 803, 804, 819, 828, 2424, 2425, 2426, 2428, and 2471, which asks whether edits survive the demo site's device toggle and is a property of that site's iframe handling, not of the kit.

## 3. Test environment

- Browser: Chrome, headless, 1400 × 900
- Engine and editor: built from this repo, served locally. Requests to `cdn.img.ly` for engine assets fail the test.
- License: the shared test license (valid on hostname `localhost` only)
- Data: the kit's own `public/assets/unsplash.scene`, 1 page with 3 image blocks and 1 text block
- **No live Unsplash traffic.** The kit's `tests/playwright.config.ts` starts the dev server with `VITE_UNSPLASH_API_URL=https://unsplash-proxy.test`, so the demo proxy is never contacted even if a route mock were missing. Every browser case installs a `page.route` on `https://unsplash-proxy.test/**` and answers from a fixture. The mock returns `access-control-allow-origin` and `access-control-expose-headers: x-total, x-per-page`, because `unsplash-js` reads the paging headers and the mocked proxy is a different origin; without them the source throws `expected x-total header to exist`.
- UNS-07 runs in its own `chrome-proxy-errors` project. The kit's source rejects on an API error by design, so the engine logs `findAssets callback threw`; that message and Chrome's own `Failed to load resource: … 500`, anchored to the kit's own proxy host, are the only allowlist entries, and only that project carries them.
- Unit cases stub `globalThis.fetch` and call the exported `createUnsplashAssetSource` directly; no browser, no engine.
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
Common precondition for all browser cases: the proxy route is mocked, the kit is open in the browser, and the scene has finished loading.

### 5.1 Start-up and the library

**UNS-01 · browser · Editor loads with Unsplash in the dock**
Steps: open the kit.
Expected: the scene is on the canvas. The dock entry that would be Images is labelled "Unsplash". There is no separate Images entry left. No console errors. No engine asset from `cdn.img.ly`.

**UNS-02 · browser · The Unsplash panel lists assets**
Steps: click Unsplash in the dock.
Expected: the panel requests `/photos` on the proxy with `order_by=popular`, `page` and `per_page`. It shows the fixture's photos in a 2-column grid, and the footer credits Unsplash with a link to `https://unsplash.com/`.

**UNS-03 · browser · Search sends the query**
Steps: type `mountains` in the panel's search field.
Expected: the panel requests `/search/photos` with `query=mountains`, and the results are the fixture's search results, not the popular list.

**UNS-04 · browser · Scrolling requests the next page**
Steps: scroll the grid to the end.
Expected: the first query asks Unsplash for page 1 and the first scroll asks for page 2; once every photo has been fetched, no further request is made.
Note: this case pins the fix for known issue 1. Before the fix the sequence was page 0 then page 1.

**UNS-05 · browser · Apply a photo to the canvas**
Steps: click a photo in the panel.
Expected: a new graphic is added whose image fill URI is the fixture's `urls.full`, and the block carries the photographer's name as credits.

**UNS-06 · browser · Qase 829 · Replace a sample image keeps the placeholder UI**
Steps: select one of the three images on the page, use Replace.
Expected: the Replace panel offers Unsplash and nothing else. After picking a photo the fill changes and the placeholder overlay and button are still shown on the block.

**UNS-07 · browser · The proxy fails**
Steps: answer the route with HTTP 500, then open the panel.
Expected: the panel shows "Cannot connect to asset source", and the editor stays usable.
Note: the run proved the plan's wording wrong. The source rejects rather than returning an empty result, so the engine reports the rejected callback on the console and the panel shows the broken-source state, not the empty one.

### 5.2 Export

**UNS-08 · browser · Qase 818 · Export image**
Steps: open the actions menu in the navigation bar, click Export Image.
Expected: one PNG download of 1819 × 1311 px, the demo scene's own page size.
Note: the run proved the plan wrong. `ly.img.exportImage.navigationBar` runs `exportDesign`, which sends no target size, so the kit's 1080 × 1080 `exportImage` action was never reached. That registration is deleted in this wave, and UNS-U8 keeps it deleted.
Asserts the options the kit passes to `engine.block.export` and that a file of the declared type downloaded; the exported pixel size belongs to `engine/lib/test/api/ExportAPITest.cpp`.

**UNS-09 · browser · Qase 817 · Export PDF**
Steps: open the actions menu, click Export PDF.
Expected: one PDF download with 1 page.
Asserts the options the kit passes to `engine.block.export` and that a file of the declared type downloaded; the exported pixel size belongs to `engine/lib/test/api/ExportAPITest.cpp`.

### 5.3 Unit cases (no browser, no engine)

Subject: `src/imgly/plugins/unsplash.ts`, through the exported `createUnsplashAssetSource`.

**UNS-U1 · unit · Photo mapping**
A photo with a description, tags and a user maps to an `AssetResult` with the photo id, `meta.uri` from `urls.full`, `meta.thumbUri` from `urls.thumb`, `meta.width` and `meta.height`, `mimeType` `image/jpeg`, credits with the user's name and profile URL, and UTM `source: 'CE.SDK Demo'`, `medium: 'referral'`.

**UNS-U2 · unit · Missing fields**
`description` null falls back to `alt_description`; both null leaves the label undefined. No tags leaves `tags` undefined. No user name leaves `credits` undefined and does not throw.

**UNS-U3 · unit · Paging without a query**
`findAssets({ page: 0, perPage: 20 })` calls the popular list with `page=1`, `order_by=popular`, and answers `currentPage: 0`. With 100 results in total, `nextPage` is 1; once every photo has been fetched it is undefined. This case pins the fix for known issue 1.

**UNS-U4 · unit · Paging with a query**
`findAssets({ query: 'x', page: 0, perPage: 20 })` calls the search endpoint and derives `nextPage` from `total_pages`, undefined on the last page.

**UNS-U5 · unit · API error**
A response of type `error` rejects with the first error message. The panel's own handling of that rejection is editor behaviour.

**UNS-U6 · unit · Source identity**
The source id is `unsplash`, its credits are Unsplash with `https://unsplash.com/`, and its licence is the Unsplash licence with `https://unsplash.com/license`.

**UNS-U8 · unit · Registered actions**
`setupActions` on a spy `cesdk` registers the actions the kit's UI reaches.

**UNS-U7 · unit · Editor configuration**
`setupDock` and `setupFeatures` on a spy `cesdk`: the dock order matches `config/`, and `setupFeatures` enables exactly the list `config/features.ts` names, in that order. `initUnsplashEditor` adds the configuration plugin, then Unsplash, then the fifteen asset-source plugins in one concurrent batch; it passes `apiUrl` to the plugin only when `unsplashApiUrl` is set, and passes no `apiUrl` when it is empty.

**UNS-U10 · unit · Panel placement and `setupUI`**
`setupPanels` docks the inspector and the asset library on the left and leaves neither floating. `setupUI` positions the panels before it sets any component order, and it orders exactly the dock, the navigation bar, the canvas bar, the canvas menu and the inspector bar — the video timeline stays at the editor default.

**UNS-U11 · unit · The canvas bar, the canvas menus and the inspector bar**
`setupCanvas` puts the add-page button in a bottom canvas bar; the Transform menu offers duplicate and delete, the Text menu the formatting controls, and the Vector menu is empty. The Transform inspector bar carries crop, fill and the inspector toggle; the Crop bar carries only the crop controls; the Vector bar ends with `ly.img.vectorEdit.done.inspectorBar`.

**UNS-U12 · unit · The navigation bar and the engine settings**
`setupNavigationBar` offers image and PDF export from one actions entry. `setupSettings` writes the crop, page and page-title settings the kit relies on.

**UNS-U13 · unit · The setups the kit leaves empty**
`setupComponents` and `setupVideoTimeline` make no call. `setupKeyboardShortcuts` calls `shortcuts.set` once with the US ANSI catalog object itself.

**UNS-U14 · unit · `DesignEditorConfig`**
The plugin is named `cesdk-design-editor` and carries `CreativeEditorSDK.version`. `initialize` resets the editor first, declares the editor compatibility version it was written for, then runs the feature, UI, action, shortcut, translation and engine-setting setup. Without a `cesdk` in the context it touches neither the editor nor the engine.

**UNS-U15 · unit · The action handlers**
`saveScene` downloads the scene as `text/plain;charset=UTF-8`. `exportDesign` forwards the caller's options unchanged. `importScene` picks a `.imgly,.scene,.zip` object URL, loads it, revokes the URL — including when the load rejects — and then fits the first page. `exportScene` writes text by default and a `application/zip` archive for `format: 'archive'`. `uploadFile` forwards the file and the context to `utils.localUpload`.

**UNS-U9 · unit · A failed search**
A search that comes back as an error rejects with the first error message, the same way the popular-photos listing already did.

**UNS-U10 · unit · The plugin without an editor, and without a proxy URL**
`UnsplashAssetSourcePlugin.initialize` registers nothing when the context carries no `cesdk`. With an editor but no configured proxy URL it still registers the `unsplash` source, against the public IMG.LY proxy.

**UNS-U16 · unit · `src/index.ts`**
The entry creates the editor with the kit's user id, initialises the Unsplash editor with the options read from the environment, loads the demo scene and publishes the editor on `window`. It reports the demo lifecycle to the host that embeds it: `created` then `ready`, and `failed` alone when the create rejects. A failed start-up is reported instead of leaving an unhandled rejection.

**UNS-U17 · removed.** `resolveAssetPath` is gone; `src/imgly/demo-assets.ts` derives the URL from `VITE_DEMO_ASSETS_BASE_URL` or the kit's own URL.

**KB-01 · unit · Keyboard catalog predicates**

`tests/unit/keyboard-catalog.test.ts` runs every `run` and `when` of `src/imgly/config/keyboard/catalogs/us-ansi.ts` against 1620 editor states (5 edit modes, 9 selections, 3 roles, features on and off, 3 vector states, page and no page) and asserts that none throws, that every shortcut activates in at least one state, and that every function `run` reaches `cesdk.actions.run`. Kit-owned: the kit decides which key does what and when it is live. The catalog measures 100 % lines, branches and functions.

## 6. Entry and exit criteria

Entry: engine and editor built; test license available; the shared kit test harness exists, including the mocked-route helper; the kit's `test:unit` and `test:e2e` scripts replaced with the real commands (they are `exit 0` today).

Exit: every case in section 5 passes locally and in CI. `npm run ci` passes. No test contacts Unsplash or the demo proxy. The published kit contains no test files. A release run reports results to the Qase ids above.

## 7. Known issues found while writing this plan

Confirm each with a test before fixing.

Fixed in this wave: issues 1, 2 and 3.

1. ~~Paging is off by one.~~ Fixed: the source converts with `queryData.page + 1` like its Getty and Pexels siblings, answers `currentPage` in CE.SDK numbering, and derives `nextPage` from `total_pages` (search) or the number fetched so far (popular). The three byte-identical copies in `starterkit-apparel-editor`, `starterkit-photobook-ui` and `starterkit-postcard-ui` still carry the bug; batch P7b owns them.
2. ~~`queryData.page ?? 1` and `queryData.perPage ?? 20` are dead.~~ Fixed: both fallbacks are gone.
3. ~~`.env.example` sets `VITE_UNSPLASH_API_URL=VITE_UNSPLASH_API_URL_HERE`.~~ Fixed: the value is empty, so the documented demo-proxy fallback runs.
4. `scripts/setup-secrets.sh` overwrites `.env` with only `VITE_CESDK_LICENSE`, so running `npm run secrets` deletes any Unsplash proxy URL the user had set.
5. The README's Configuration section imports `setupUnsplashAssetSource` from `./imgly/plugins/unsplash`. That symbol does not exist; the module exports `UnsplashAssetSourcePlugin`, `unsplashAssetSource` and `createUnsplashAssetSource`.
6. `unsplashAssetSource` is created at module load from the demo proxy constant, so importing the module builds an API client nobody asked for. Nothing in the kit uses that export.
7. `config/i18n.ts` is an empty `void cesdk;` stub while the README documents localization with an Unsplash example.
8. The README Architecture tree omits `config/keyboard/`, which the kit ships and `plugin.ts` calls.

### Coverage residue

One line and one branch of `src/**` are left: the `return undefined` after the response switch in `src/imgly/plugins/unsplash.ts:192-194`. Unreachable by construction — `unsplash-js` types the response as the union `'success' | 'error'` and both arms are covered.

## 8. Open questions

1. ~~Issue 1: fix the paging here.~~ Done in this wave; UNS-U3 and UNS-04 assert the 1-based number.
2. ~~Should UNS-04 run before issue 1 is fixed?~~ Moot; it passes.
3. ~~`.env.example` placeholders.~~ Done in this wave for both this kit and the Getty kit.

## 9. Estimate

Measured: 9 browser cases in 1.1 minutes on one worker, 24 unit cases in under 0.4 s. Merged coverage: lines 90.59 %, branches 89.47 %, functions 16.09 %; the Vitest gate sits at lines 60 %, branches 89 %, functions 16 %.

## 10. Boundary review

Rule used: the code that makes a decision owns the test for it. The kit decides the proxy URL, the request it builds, how a photo maps to an `AssetResult`, the credits and UTM parameters, the dock entry, the library entry and the Replace override. The editor decides how a source is rendered in a panel, how search and infinite scroll call `findAssets`, and how Replace opens. The engine decides what applying an asset does to a block.

Core behaviour this plan leans on, and where it is covered today:

| Behaviour                                                                                                                                  | Owner  | Covered by                                                                                                                                         |
| ------------------------------------------------------------------------------------------------------------------------------------------ | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| A custom asset source registered with `addSource` is queried through `findAssetSourceAssets`                                               | engine | `engine/lib/test/api/AssetAPITest.cpp` `AddCustomAssetSource`, `FindAssetSourceAssets`; `bindings/wasm/js_node/src/__tests__/shared-tests.test.ts` |
| Applying an image asset creates a graphic with an image fill                                                                               | engine | `engine/lib/test/api/UBQApplyAssetCreationDeepAPITest.cpp`, `engine/lib/test/api/AssetSourceAPITest.cpp` default apply tests                       |
| `addAssetLibraryEntry`, `updateOrderComponent` with a key match, `setReplaceAssetLibraryEntries`                                           | editor | `apps/cesdk_web/packages/api/ui/UserInterfaceAPI.test.ts`                                                                                          |
| Replace picks library entries from the selected block's fill type                                                                          | editor | `apps/cesdk_web/packages/ui/components/assets/getReplaceLibraryEntries.test.ts`                                                                    |
| Legacy `//ly.img.ubq/image` blocks in the demo scene load as graphic plus image fill, so the fill type the Replace override keys on exists | engine | `engine/src/ubq/editor/SceneSerializer.cpp` conversion pass; exercised by the frozen scene corpus in `engine/test/resources/serialization/scenes/` |

Core coverage gaps found (candidates to add in the core suites, not in this kit):

1. Editor: the asset panel's paging contract. Nothing asserts which `page` value the panel sends for the first query, or that it follows `nextPage` from the previous result. Every custom asset source in the fleet has to guess it, which is how issue 1 shipped. Suggested home: `apps/cesdk_web/packages/ui/components/assets/`.
2. Editor: `credits` and `license` on an asset source are rendered in the library footer. `UserInterfaceAPI.test.ts` covers entries, not the footer. Suggested home: `apps/cesdk_web/packages/ui/components/assets/`.

Until gap 1 is closed, UNS-04 keeps its request assertion as the end-to-end proof.
