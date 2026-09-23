# Test plan: starterkit-automatic-design-generation

Version 6, 21 Sep 2026. Status: implemented and green. 15 browser, 14 headless and 146 unit and component tests run in `npm run ci` (exit 0). Merged coverage: **lines 100 %, branches 100 %, functions 100 %**, also on a browser without an H.264 encoder. `tests/coverage-thresholds.json` gates the Vitest run at lines 89.56, statements 89.56, functions 100, branches 100 — the line figure is low because `src/app/**` is covered by the browser lane, which the Vitest gate cannot see. `tests/coverage-thresholds.merged.json` gates the merged report at 100 / 100 / 100. No expected failures remain, and nothing of `src/**` is left uncovered.

## 1. Purpose

Verify that the Automatic Design Generation starter kit works as shipped: a podcast plus a few customization choices produce the right set of image or video assets, and the three-step workflow around it behaves.

## 2. Scope

In scope

- `src/imgly/generation.ts` — `generateAsset`: load, fill, export, save
- `src/app/api/transformer.ts` — sizes, template URL naming, the podcast fill callback, theme choice
- `src/app/api/podcast.ts` — iTunes search and dominant colour extraction
- The three-step workflow: search, customize, generated assets
- The two editor configs (`design`, `video`) and the edit modal

Out of scope

- What an export produces, what a variable substitution renders, video encoding. Engine behaviour; see section 10.
- The editor UI the modal renders. Covered by the core editor suite.
- The demo site around the kit. Covered by the `cesdk_web_demos` suite. Qase 1246, 1247, 1248, 1249, 1250, 1265, 1274, 2451.
- Video generation in headless tests. `@cesdk/node` throws on `block.exportVideo` by design, so every video case is a browser case.

## 3. Test environment

- Headless: `@cesdk/node` through the shared harness engine helper. Node, no DOM. Templates load from `public/` over `file://`.
- Browser: Chrome, headless, 1400 × 900. Requests to `cdn.img.ly` fail the test, except the Manrope typeface: the shipped templates store absolute `cdn.img.ly/assets/v3/ly.img.typeface/fonts/Manrope/` URIs, so that one prefix is allowlisted in `tests/playwright.config.ts`.
- License: the shared test license (valid on hostname `localhost` only)
- Data: the six scenes in `public/`. The image templates carry the blocks `PodcastCover`, `PodcastBadge` and `Message & Name` and the variables `Message` and `PodcastName`.
- Network: the iTunes Search API and the podcast artwork host are stubbed with `page.route` in every browser case. No test calls iTunes for real.

## 4. Approach

| Kind     | Tool                          | What it checks                                              | Run                 |
| -------- | ----------------------------- | ----------------------------------------------------------- | ------------------- |
| Static   | tsc, eslint, convention check | Types, deprecated APIs, kit folder shape                    | `npm run check:all` |
| Unit     | Vitest                        | Option builders, colour and theme maths, no engine          | `npm run test:unit` |
| Headless | Vitest + `@cesdk/node`        | `generateAsset` and the fill callback against a real engine | `npm run test:unit` |
| Browser  | Playwright                    | The test cases in section 5.1                               | `npm run test:e2e`  |

All four run in the kit's `ci` script. Browser tests use role and label locators only.

## 5. Test cases

Format: ID, Qase ids, title. Then steps and expected result.

### 5.1 Browser

Common precondition: the kit is open, iTunes is stubbed, and the first preview has rendered.

**ADG-01 · Qase 4690, 2845 · Step 1 default state**
Steps: open the kit.
Expected: only the Select Podcast panel is shown. The search field is empty and shows the placeholder `e.g. "Conan O Brien Needs A Friend"`. Five disabled placeholder cards, no podcast selected. No console errors. No engine asset from the CDN.

**ADG-02 · Qase 2847, 2848, 2849, 2852 · Search**
Steps: type a query. Hover a result. Clear the field.
Expected: after the 300 ms debounce the stubbed results replace the placeholders, each with artwork, title and author. Hovering highlights without selecting. Clearing the field brings the placeholders back.

**ADG-03 · Qase 2850, 2851, 2856 · Select a podcast**
Steps: click a result. Go back to step 1 and click a different result.
Expected: the clicked card is marked selected and the view moves to Customize Design. The background colour becomes the artwork's dominant colour and the preview regenerates with that podcast's cover and name. Selecting a different podcast updates both panels.

**ADG-04 · Qase 2853, 4691 · Step 2 defaults**
Steps: from step 1 press Next without selecting anything. Then search, select nothing, press Next.
Expected: the preview shows the sample asset, Message reads "Don't miss the latest episode", Background Color is `#9933FF`, all three sizes are checked, Image is the selected type. No podcast is placed in the preview.

**ADG-05 · Qase 2846, 2854, 2855, 2857, 2858 · Customize**
Steps: edit Message. Type an emoji. Clear the field. Click a preset colour, then pick one from the colour picker.
Expected: after each 300 ms debounce the preview and the generated assets show the new message and colour. The emoji renders. Clearing the field restores `DEFAULT_MESSAGE` in the design (fixed in this wave). A preset colour above the luminance threshold flips the badge to the black variant and one below it flips back.
Note: the test asserts the design the kit produced, read from the headless engine the kit already exposes as `window.engine`, rather than the rendered pixels. It waits for the Type control to re-enable — the kit's own loading indicator — before each step, because acting during a regeneration hits known issue 5.

**ADG-06 · Qase 2859, 2866 · Toggle sizes**
Steps: uncheck Instagram Story. Go to step 3. Return and check it again.
Expected: unchecking removes that asset from Generated Assets and there is nothing to download for it. Checking it again regenerates it, back in the Sizes order.
Note: known issue 6 was proved not to reach the UI — `GeneratedAssets` sorts by `id` before rendering, so a re-added size returns to its place. The out-of-order append survives only in the `finalAssets` array.

**ADG-07 · Qase 2860 · Switch to video**
Steps: click the Video type.
Expected: the assets regenerate from the `video-*` templates and render as `video` elements that play. The Type control is disabled while the regeneration is in flight.
Note: reduced to one selected size so the case exercises the video path without encoding three clips. The "browser does not support video export" branch is not reachable in Chrome and is left uncovered.

**ADG-08 · Qase 2861, 2862, 2864 · Generated assets**
Steps: go to step 3. Download each asset.
Expected: three cards labelled "Instagram Story", "Instagram Post", "Facebook / X Post". Each shows the podcast and the customization from step 2. Each Download produces one file.

**ADG-09 · Qase 2865, 2968, 2969, 2970, 2971, 2972, 2973 · Edit an image asset**
Steps: click Edit on each of the three cards in turn. On the first, change the text and Save. On the second, close without saving. Export an image from the editor.
Expected: every card offers Edit and opens the modal in the design editor (light theme, page title hidden) on that asset's scene, named after the size. Save updates only that card and leaves the other two byte-identical. The discarded edit changes nothing. The Actions dropdown offers Export Images.
Note: the Edit button sits in an overlay that only accepts pointer events while its card is hovered, so the tests force the hover first.

**ADG-10 · Qase 2867, 2868, 4396 · Edit a video asset**
Steps: with Video selected, edit a card, change a clip, Save; edit another and close without saving; export a video.
Expected: the modal opens in the video editor on that asset's scene, with the timeline the design config does not ship.
Note: reduced. Save, discard and MP4 export are covered on the image path (ADG-09), which shares the same modal, save action and Actions dropdown; repeating them on video costs a full encode per assertion. Qase 4397 (export the video) and 2974 (discard unsaved video changes) are therefore **deferred to the nightly extension** and are not automated today; 4395 is automated on the image path by ADG-09.

**ADG-11 · browser · no Qase case · Back returns to the step before**
Steps: open the kit, click Next, then Back.
Expected: step 1 is shown again and its search field is visible; Back is still offered on step 1 but disabled, because there is nothing before it.

### 5.2 Headless

**ADG-H1 · Qase 2853 · generateAsset produces an asset**
Steps: call `generateAsset` with `static-instagram-post-template.scene`, a no-op fill, `outputType: 'image'`, 320 × 200.
Expected: resolves with `isLoading: false`, the given `id`, `label`, `width`, `height`, `type: 'image'`, a `src` blob URL that resolves to a non-empty PNG, and a `sceneString` that loads again. The call passes `{ mimeType: 'image/png', targetWidth, targetHeight }` on to `block.export`.
Note: the run proved the original "exports at the requested pixel size" wording wrong — the engine fits the export inside the target box and keeps the page aspect ratio, so 320 × 200 of a square page yields 320 × 320. What the target size produces is engine behaviour (`ExportAPITest.cpp`); the kit owns only which options it sends. A second case renders the Instagram Story preset, whose template matches its 1080 × 1920 aspect ratio, as the end-to-end proof.

**ADG-H2 · The fill callback runs against the loaded page**
Steps: pass a fill that records its arguments and sets the page colour.
Expected: called once, after the template has loaded, with the engine and the page id from `findByKind('page')`. The exported asset carries the colour the fill set.

**ADG-H3 · saveSceneString and zoomToPage**
Steps: call with `saveSceneString: false`, then with `zoomToPage: true` and again without it.
Expected: the first returns `sceneString: null`. The zoom does not change the exported image: both runs decode to the same size.
Note: reworded after the run, for the same reason as ADG-H1 — the assertion is that `zoomToPage` is export-neutral, not that a target box is honoured verbatim.

**ADG-H4 · Qase 2846, 2856 · The podcast fill**
Steps: build the fill with `createFillCallback` through `createAssetOptions`, using a `file://` resolver for the badge (see open question 1). Run it on the loaded template.
Expected: the page fill colour equals the converted hex; the `PodcastCover` fill URI is the artwork URL; the `PodcastBadge` fill URI is the black badge for a light background and the white badge for a dark one; the variables `Message` and `PodcastName` hold the given values; the `Message & Name` block's two text colours are the theme pair.

**ADG-H5 · Qase 2855 · An empty message**
Steps: run the fill with `message: ''`.
Expected: the `Message` variable holds `DEFAULT_MESSAGE`. Fixed in this wave; see the Fixed line in section 7.

**ADG-H6 · A missing template**
Steps: call `generateAsset` with a URL that does not exist.
Expected: rejects. Nothing is left half-loaded: a following `generateAsset` with a valid template still succeeds.

### 5.3 Unit

**ADG-U1 · Sizes and option builders**
`SIZES` has three entries: Instagram Story 1080 × 1920, Instagram Post 1080 × 1080, Facebook / X Post 1300 × 740. `createAssetOptions(i, 'image', …)` returns `templateUrl` ending in `static-instagram-story-template.scene`, `static-instagram-post-template.scene`, `static-facebook-x-post-template.scene`, with matching `width`, `height`, `label`, `id: i` and `saveSceneString: true`. With `'video'` the same three names with the `video-` prefix. `createPreviewOptions` returns `id: -1`, `label: 'Preview'`, 800 × 800, `zoomToPage: true`, `saveSceneString: false`.

**ADG-U2 · Colour and theme maths**
Hex to RGBA: `#9933FF`, `#93F` (short form), and a value without `#`. Theme: a luminance above 0.38 gives `light`, below gives `dark`, and the exact boundary gives `dark`. These are module-private today; they are reached through `createAssetOptions(...).fill` run against a fake engine that records the calls.

**ADG-U3 · Constants and defaults**
`PRESET_COLORS` has eight unique valid hex values including `DEFAULT_BACKGROUND_COLOR`. `DEFAULT_MESSAGE` matches the input placeholder in `CustomizationPanel`.

**ADG-U4 · Editor configs**
Steps: call `setupFeatures`, `setupActions` and `setupNavigationBar` of both the `design` and the `video` config with a recording double.
Expected: each config enables its own feature list, asserted whole; only the video one carries the timeline, animation and transition features, and only it orders a timeline. Both register the documented action ids.

**ADG-U12, ADG-U13 · unit · The configuration plugins and the editor asset sources**
Each plugin resets the editor first, pins the editor compatibility version to the CE.SDK version once, as the very next call, and runs the whole setup; only the video one checks the browser codecs. Each entry point adds its own configuration plugin first, and only the video editor gets the caption and audio sources. A double that answers every `addPlugin` with a promise the test settles by hand proves the configuration plugin is awaited on its own and every asset source is in flight before any of them settles.

**KB-01 · unit · Keyboard catalog predicates**

`tests/unit/keyboard-catalog.test.ts` runs every `run` and `when` of `src/imgly/config/design/keyboard/catalogs/us-ansi.ts`, `src/imgly/config/video/keyboard/catalogs/us-ansi.ts` against 1620 editor states (5 edit modes, 9 selections, 3 roles, features on and off, 3 vector states, page and no page) and asserts that none throws, that every shortcut activates in at least one state, and that every function `run` reaches `cesdk.actions.run`. Kit-owned: the kit decides which key does what and when it is live. The catalog measures 100 % lines, branches and functions.

## 6. Entry and exit criteria

Entry: engine and editor built; test license available; the shared kit test harness exists (headless engine helper, browser boot helper, network stub helper, download helper, console and network guards); a `window.cesdk` hook reachable while the edit modal is open.

Exit: met. `npm run ci` exits 0 with 130 unit and component, 14 headless and 15 browser tests and no expected failures. Merged coverage is lines 100 %, branches 100 %, functions 100 %; both gates hold the measured values. `tests/` stays out of the published kit through `STARTERKIT_EXCLUDES`.

### 5.4 Added in the coverage pass

**ADG-H8 · headless · The video output asks for a bounded MP4**
Steps: run `generateAsset` with `outputType: 'video'` against an intercepted `exportVideo`.
Expected: exactly one call with `mimeType: 'video/mp4'`, `videoBitrate: 'Auto'` and the requested size, and an asset of type `video` with a blob source. The encode itself is the engine's and is intercepted, which keeps the case off a minute-long export.

**ADG-U8 to ADG-U15 · unit**
`setupSettings`, `setupUI`, `setupTranslations`, `setupKeyboardShortcuts` and `setupVideoTimeline` of both configs; every action handler both configs register; both configuration plugins, including the codec check the video plugin runs and the design one does not; the asset-source list each editor installs; and `searchPodcasts` / `getMainColor`, including the empty query, the iTunes request shape and the colour fallback when no canvas is available.

**ADG-C1 to ADG-C7 · component (jsdom)**
`Button`, `Spinner`, `CaretBottom`, `StepIndicator`, `AssetCard`, `useOnClickOutside` and `CustomizationPanel` — the step bar's active, complete and inactive states and its Back/Next gating; the asset card's loading, image and video shapes and its empty-source fallback; and the panel's presets, sizes, colour picker, type switch and the warning it shows when video is unsupported.

### 5.5 Added in the second coverage pass

**ADG-C11 · component · `useOnClickOutside` on a trusted click**
The hook acts on a click outside its element and leaves one inside alone. jsdom defines `isTrusted` as a non-configurable getter, so the test captures the listener the hook registered and calls it with the shape a browser delivers.

**ADG-C12 · component · The colour picker closes itself**
An open picker closes on a trusted click outside; a click outside while it is already closed changes nothing.

**ADG-C13 · component · `useEngine`**
The engine is reported ready with the debug handle published; a browser that cannot export video is reported; unmounting disposes the engine; and an engine that arrives after the unmount is disposed instead of kept.

**ADG-C14 · component · `usePodcastSearch`**
Two keystrokes debounce into one iTunes request whose results are published; a failed request is logged and stops the spinner; choosing a podcast remembers it and answers with the artwork colour.

**ADG-C15 · component · `EditorModal`**
An image asset opens on the design editor, re-applies its variables, names its scene and refits the page; a scene the engine does not report is left unnamed; an asset with no scene string configures nothing; Save exports a PNG at the asset size for an image asset and an `Auto`-bitrate MP4 for a video one, and hands both back as a blob URL; the inserted navigation-bar button closes the modal; the modal reports the `created` and `ready` demo phases and hands the wrapper the demo loading-state reporter; and it locks the page scroll while it is open.

**ADG-C16 · component · The entry point**
The app mounts into the `#root` container the page ships, and the entry fails loudly when there is none.

**ADG-U16, ADG-U17 · unit · `getMainColor`**
The colour is read out of a one-pixel draw of the artwork, and a piece of artwork that cannot be loaded falls back to the brand purple.

### 5.6 Video output without a browser encoder

The CI browser has no H.264 encoder, so ADG-07 and ADG-10 skip there and the video path went unmeasured: the merged gate failed every nightly from 17 Sep. These cases cover the path in Vitest, so the merged number no longer depends on the browser.

**ADG-C17 · component · The preview of a generated asset**
Video output renders a muted, looping, autoplaying `video`; image output renders an `img` labelled with the asset. Either one gets an empty source until the asset has one, and neither renders while the asset is loading.

**ADG-C18 · component · Switching the output type**
`useGenerationWorkflow`'s `onTypeChange` stores the new type and regenerates every selected size in it. Before the engine is up it stores the type and generates nothing.

**ADG-U18 · unit · `downloadAsset`**
An image downloads as `<label>.png` and a video as `<label>.mp4`, with the label lower-cased and its spaces turned into dashes. An asset without a source downloads nothing.

`App` passed the type change on through a wrapper that only called the hook, so the wrapper was removed and `onTypeChange` goes to the panel directly.

## 7. Known issues

Confirmed by reading the code, then by the run. Numbering follows version 1.

**Fixed in this wave**

1. Clearing Message wrote an empty string into the design. `createFillCallback` now falls back to `DEFAULT_MESSAGE`, which is what Qase 2855 and the input's own placeholder imply. Covered by ADG-H5, an ADG-U2 case and ADG-05. This changes shipped output, not only tests.

**Still open**

2. `getTemplateUrl` builds a file name from the size label with three chained `replace` calls, each replacing the first occurrence only. A label with two slashes or two double spaces maps silently to a missing scene file. ADG-U1 pins the mapping for the three shipped labels.
3. `getMainColor` sets `img.src` before `img.crossOrigin`. The load can start without the CORS attribute, which makes the dominant-colour result depend on load timing. Not reproducible on demand; the browser cases stub the artwork host with an explicit `access-control-allow-origin`.
4. `generateAsset` creates a blob URL for every asset and nothing revokes them. Each debounced regeneration produces four more.
5. The debounced regenerations have no cancellation and share one engine. Confirmed twice during this work, from two different entry points: selecting a podcast while the generation started on load was still running left `PodcastName` empty and the background at the default, and a second edit landing mid-generation produced the page error `Could not load scene from …/static-instagram-post-template.scene`. It is timing-dependent, so no test pins it — a `test.fail()` would flake in both directions. Every browser case instead waits for the Type control to re-enable before acting, which is why they are stable.
6. `onSizeToggle` appends a re-added asset to the end of `finalAssets`. **Does not reach the UI:** `GeneratedAssets` sorts by `id` before rendering, so the cards stay in Sizes order. ADG-06 asserts the rendered order.
7. `searchPodcasts` returns `data.results` without checking it. A failed iTunes response throws inside the debounced callback and is only logged.
8. `useEngine` returns `engineRef.current`, still `null` on the render that flips `isReady`. The first generation therefore depends on a later render happening.
9. `tsconfig.json` sets `strict: false` and `noImplicitAny: false`, so the null-versus-non-null mismatch between `usePodcastSearch`'s `Podcast | null` and `useGenerationWorkflow`'s `Podcast` compiles.
10. ~~Opening a generated asset for editing shows the raw `{{Message}}` and `{{PodcastName}}` placeholders.~~ **Fixed in v3.** A scene string carries the variable references but not their values, so `GeneratedAsset` now carries a `variables` snapshot that `generateAsset` takes after the fill and `EditorModal` re-applies after `cesdk.load()`. Saving in the modal re-snapshots them. ADG-09 (Qase 2972) asserts the variable, not the block text, which always holds the reference; ADG-H7 asserts the snapshot.
11. ~~`window.cesdk` has two writers, the kit's modal and a `VITE_ADD_CESDK_GLOBALS` wrapper.~~ Not a defect: that variable publishes nothing, and the `{ kind, engine, cesdk }` shape is the harness's own `getEditor` return value.

## 8. Open questions

1. **Resolved.** `createAssetOptions` and `createPreviewOptions` now take an optional `resolve(path)` defaulting to the kit's demo-asset URL, so the podcast fill runs under Node. ADG-H4 and ADG-H5 pass their own `file://` resolver.
2. **Resolved.** An empty Message falls back to `DEFAULT_MESSAGE` (known issue 1).
3. Video cases are browser-only and slow. Both now run with a single selected size; the full video save, discard and MP4-export matrix is recorded as a nightly-only extension rather than dropped.
4. **New.** Known issue 10 is a behaviour question as well as a bug: should `EditorModal` re-apply the asset's variables after loading its scene, the way multi-image-generation does, or should the generated scene string carry them? Recommended: re-apply in the modal, which is a three-line change and matches the sibling kit.

## 8b. Coverage residue

None. `npm run ci` reports **lines 100 %, branches 100 %, functions 100 %** of `src/**`, with or without video support in the browser (section 5.6).

The six entries this section carried in version 4 are all closed. Four of them were closed by tests, not by a re-measure: `useEngine`'s unmount paths and `usePodcastSearch`'s error path by driving the hooks with `renderHook` over a mocked `@cesdk/engine` and a mocked podcast API (ADG-C13, ADG-C14); `EditorModal`'s `saveScene` closure, including the video half, by registering the action against a stand-in editor and calling it (ADG-C15); `getMainColor`'s image handlers by faking the 2D context jsdom does not ship (ADG-U16, ADG-U17); and the trusted-click branch by capturing the listener the hook registers, since jsdom refuses to redefine `isTrusted` (ADG-C11, ADG-C12). `src/index.tsx`'s missing-root `throw` is covered by ADG-C16, which mocks `./app/App` so the entry can be imported without booting an editor.

## 9. Estimate

Measured: 14 browser tests in 1.4 minutes on one worker, 12 headless tests in 13 s, 41 unit tests in under 1 s. `npm run ci` end to end is about 2 minutes.

## 10. Boundary review

Rule used: the code that makes a decision owns the test for it. The kit decides the size list, the template naming scheme, the fill (which blocks, which variables, which theme), the export sizes, the step flow and the debounce. The engine decides what a variable substitution renders and what an export contains.

Core behaviour this plan leans on, and where it is covered today:

| Behaviour                                         | Owner  | Covered by                                                                    |
| ------------------------------------------------- | ------ | ----------------------------------------------------------------------------- |
| `block.findByName` returns the named blocks       | engine | `engine/lib/test/api/CoreAPITest.cpp`, `HierarchyAPITest.cpp`                 |
| `fill/image/imageFileURI` set and read back       | engine | `engine/lib/test/api/BlockPropertiesTest.cpp`, `PropertyRoundTripAPITest.cpp` |
| `setTextColor` over a character range             | engine | `engine/lib/test/api/BlockTextTest.cpp`, `TextDeepAPITest.cpp`                |
| `block.export` honours `mimeType` and target size | engine | `engine/lib/test/api/ExportAPITest.cpp`                                       |
| `block.exportVideo` produces an MP4               | engine | `engine/lib/test/api/ExportAPITest.cpp` (video section)                       |
| Video editor timeline components                  | editor | `apps/cesdk_web/packages/cesdk/registerVideoTimelineComponents.test.ts`       |
| `ui.setTheme`, `ui.setComponentOrder`             | editor | `apps/cesdk_web/packages/api/ui/UserInterfaceAPI.test.ts`                     |

Core coverage gap found, and closed on this branch:

1. Engine: setting a text variable changes what the text block renders. `engine/lib/test/api/VariablesMetadataAPITest.cpp` gained `setVariableStringRendersSubstitutedTextLine`, `setVariableStringUpdateReRendersTextLine` and `setVariableStringLeavesRawTextTemplated`, which is the substitution this kit, batch-image-generation and multi-image-generation all depend on.

ADG-H4 keeps a decoded-export assertion as this kit's end-to-end proof that the fill reached the picture.
