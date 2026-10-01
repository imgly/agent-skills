# Test plan: starterkit-ai-editor

Version 4, 5 Sep 2026. Status: implemented. 21 browser, 40 component, 12 headless and 190 unit tests; `KIT_TEST_COVERAGE=1 npm run ci` exits 0. Merged coverage is lines 99.56 %, branches 97.71 %, functions 100 %, measured twice with the same result. The Vitest gate is 98.95 / 98.95 / 100 / 97.7.

## 1. Purpose

Verify that the AI Editor starter kit works as shipped: it checks its gateway credentials before mounting the editor, opens in Design mode with the design archive loaded, switches to Photo and Video mode with the right configuration and content, builds its provider map from the curated models merged with the gateway catalogue, lets the sidebar change which models are active, and wires the Photo mode's in-place AI edit into the current page's image fill.

## 2. Scope

In scope

- The credential preflight (`probeAiCredentials`) and the three onboarding states
- `resolveAiToken`, the `ly.img.ai.getToken` action registration and `getGatewayUrl`
- The mode selector, the `?mode=` URL parameter and the editor remount it triggers
- `createAIProviders`, `CURATED_MODELS`, `capabilitiesForMode` and `instantiateGatewayProvider`
- The AI Models sidebar: initial state, catalogue merge, selection, Apply Changes
- `AiAppsConfig`: the dock entry, the canvas-menu entries and the AI history added to asset libraries
- `AiPhotoEditConfig`: the schema-panel property order, the auto-supplied `image_urls`, the apply-to-photo middleware and the dedicated dock button
- The three editor configurations under `src/imgly/config/{design,photo,video}-editor/`
- Scene and photo sources, and the export entries each mode offers

Out of scope

- **AI generation behaviour itself.** Prompt panels, input switching, format and duration controls, the generated-items grid, cancellation and its confirmation dialog, quick actions on text and images, and voice generation are all decided by the `@imgly/plugin-ai-*` packages. This kit decides only which providers are registered, which gateway they talk to, where the entry points sit, and what happens to the result in Photo mode. Section 10 lists those 102 Qase ids against their owning package with the coverage that exists today.
- The demo site around the kit (cards, tags, links, platform toggles, Back to Demos). Covered by the `cesdk_web_demos` suite. Qase 3062, 3063, 3064, 3065, 3066, 3067, 3068, 3069.
- Defaults that come from the gateway's model schema, not from any code in this repo: Qase 3326, 4296, 4297 — the voice defaulting to "Rachel", the video Format defaulting to Landscape 16:9 and the Duration to 8. They change when the remote model changes; a test in this repo would pin someone else's data.

**No live AI traffic.** Every browser case installs a `page.route` on `https://gateway.img.ly/**` and answers from fixtures. A request to any unmocked path under that host fails the test.

## 3. Test environment

- Browser: Chrome, headless, 1400 × 900
- Engine and editor: built from this repo, served locally. Requests to `cdn.img.ly` for engine assets fail the test.
- License: the shared test license (valid on hostname `localhost` only)
- Data: the Design and Video scene archives come from `DEMO_ASSETS_BASE_URL`, pointed at the in-repo copy `packages/cesdk-web-examples-data/data/starterkit-ai-editor/`.
- Photo mode loads `DEFAULT_PHOTO_URL` from `images.unsplash.com`, which the network guard does not allow. Every Photo case routes that URL to a fixture JPEG in `tests/fixtures/`.
- **Credentials differ between the two serving modes, and both are set up:**
  - dev mode (`webServer` runs the kit's `dev` script): `getApiKey()` reads `import.meta.env.VITE_AI_API_KEY`, so `tests/playwright.config.ts` passes `VITE_AI_API_KEY=test-key` to the server.
  - static mode (`KIT_TEST_BASE_URL`): the bundle is built with `import.meta.env.PROD === true` and without the key, so `getUserApiKey()` reads `localStorage['imgly.ai-editor.apiKey']`. `tests/e2e/fixtures.ts` seeds it with `page.addInitScript` before the first navigation.
  - Note (run, not read): in dev mode the baked env key always resolves, so a browser case **cannot** reach the missing-credentials state. AIE-18 became the component case AIE-C1.
- **The gateway URL is baked in at build time.** `VITE_AI_GATEWAY_URL` is left unset, so the kit uses `https://gateway.img.ly` and `tests/e2e/gateway.ts` routes that host. The endpoints the fixtures answer, read from `plugin-ai-generation-web/src/gateway/createGatewayClient.ts`:
  - `GET /v1/models?groupBy=capability` — the kit's own preflight and catalogue source
  - `GET /v1/models/schema?model=<id>` — the provider's input schema, fetched when a panel opens
  - `POST /v1/uploads` — presigned upload for an image input
  - `POST /v1/responses` — generation, answered as an SSE `text/event-stream`
- Hook: `src/app/App.tsx` already sets `window.cesdk` in `handleInit`. It points at whichever editor instance mounted last, which after a mode switch is the new one.
- Console guard: no allowlist entries except in the four AIE-19 / AIE-20 cases, which deliberately answer the gateway with 401, 403, 500 or an aborted request. The browser reports each of those itself (`Failed to load resource: … 401 (Unauthorized)`, `net::ERR_FAILED`); the kit logs nothing. Each allowlist is scoped to its own `test.describe` with `test.use`. `App` logs one `console.warn` when the gateway is unreachable; warnings do not fail a case.
- Headless: Vitest + `@cesdk/node` (`@cesdk/engine` aliased to it), used only for the photo-edit middleware. Run, not assumed: the kit's modules **do** need a `window` at import time (`@cesdk/cesdk-js` reads it at module scope), so `tests/vitest.config.ts` passes `stubWindow: true`; the node engine then reads `window.location` and breaks, so the headless file deletes the stub again before `createTestEngine()`. The four `/gateway` factory imports load in Node unchanged — no mock needed for them; `CommonProperties.StyleTransfer` is mocked in the unit lane because it builds real asset sources.
- Downloads: captured by Playwright and checked by file type, pixel size and PDF page count. After every export the editor opens an "Export complete" alertdialog that covers the navigation bar, so a case that exports twice dismisses it in between.

## 4. Approach

| Kind      | Tool                          | What it checks                                                          | Run                 |
| --------- | ----------------------------- | ----------------------------------------------------------------------- | ------------------- |
| Static    | tsc, eslint, convention check | Types, deprecated APIs, kit folder shape                                | `npm run check:all` |
| Unit      | Vitest                        | Credentials, provider maps, sidebar state, plugin wiring, editor config | `npm run test:unit` |
| Component | Vitest + jsdom + RTL          | The kit's own React screens: onboarding, sidebar, mode selector         | `npm run test:unit` |
| Headless  | Vitest + `@cesdk/node`        | The apply-to-photo middleware against a real engine                     | `npm run test:unit` |
| Browser   | Playwright                    | The test cases in section 5, against a mocked gateway                   | `npm run test:e2e`  |

All five run in the kit's `ci` script. Browser tests use role and label locators only.

The unit lane carries most of this kit's weight, because most of what the kit decides is a pure mapping: mode to capabilities, capability to provider factory, catalogue payload to sidebar state, sidebar state to provider map. Extraction done: `customizeProviderForPhotoEdit`, `applyToPhotoMiddleware` and `getCurrentPageImageUri` are now exported from `ai-photo-edit.ts`, so AIE-U10 drives the first with a fake schema-panel provider and AIE-H1 to AIE-H3 drive the middleware with a fake `next` against a real `@cesdk/node` engine.

## 5. Test cases

Format: ID, level, Qase id, title. Then steps and expected result.
Common precondition for all browser cases: the gateway route is mocked, credentials are seeded for the serving mode in use, and the kit is open in the browser.

### 5.1 Boot and modes

**AIE-01 · browser · Qase 3197, 3190 · Design mode is the default and its scene loads**
Steps: open the kit with no `?mode=`.
Expected: the design archive is on the canvas, the theme is light, the dock offers the AI apps button, and the AI Models panel is present. The preflight sent exactly one `GET /v1/models?groupBy=capability` with an `Authorization: Bearer` header. No console errors. No request to `cdn.img.ly` and none to an unmocked gateway path.
Note (run): the navigation bar shows **no** Preview button, although `ly.img.preview.navigationBar` is in the order — same finding batch P2 recorded for the design-editor kit.

**AIE-02 · browser · Qase 3092 · Video mode loads the video scene**
Steps: click Video.
Expected: the editor remounts, the scene mode is `Video`, the dock offers Videos and Audio libraries, and the navigation bar shows Export Video with no dropdown beside it.
Note (run): the preflight is **not** repeated for the new mode — that is the fix to known issue 3, and the case asserts the request count stays at one.

**AIE-03 · browser · Photo mode creates a scene from the default photo** (no Qase case yet)
Steps: click Photo.
Expected: the editor remounts in the dark theme, a single page carries the routed fixture image as its fill, the dock offers the "AI Edit" sparkle button, and the navigation bar shows Export Images with no dropdown.
Note (run): `createFromImage` stores the photo as `fill/image/imageFileURI`, not as a source set — which is exactly the case AIE-H2 covers.

**AIE-04 · browser · Qase 3191, 3093 · Canvas content is selectable and editable in Design and Video**
Steps: in each mode, click a text block and a graphic block on the canvas.
Expected: each becomes selected. What a block can do once selected is core editor behaviour; this case proves only that the kit loads a scene whose blocks are selectable rather than a locked or empty one.

**AIE-05 · browser · The mode is carried in the URL** (no Qase case yet)
Steps: click Video, read the address bar, reload.
Expected: `?mode=Video` was written with `replaceState`, and the reload comes back in Video mode. An unknown `?mode=Nonsense` falls back to Design.

**AIE-06 · browser · Qase 3347, 4247, 3369 · A mode switch keeps the applied model selection**
Steps: untick the curated Image to Image model, Apply Changes, switch to Video, switch back to Design.
Expected: the AI history asset source is registered on the new editor each time, and the model is still unticked. Rewritten from "generated items survive a mode switch": whether the generation history persists across two editor instances is plugin behaviour, and known issue 3 — the reason a selection did not survive — is now fixed, so the kit's half of these ids is the selection carry-over plus the re-registered history source.

### 5.2 The AI Models sidebar

**AIE-07 · browser · Qase 3954, 3955, 3953 · The panel is on the right in all three modes**
Steps: read the layout in Design, Video and Photo mode.
Expected: the panel's left edge is at or right of the editor's right edge in each mode, and it is titled "AI Models".
Note (run): the editor has no accessible container of its own — it is the only element on the page hosting a shadow root, and the case measures that host.

**AIE-08 · browser · Qase 3935, 3940, 3947 · The model groups per mode**
Steps: read the group headings in each mode.
Expected: Design shows Text to Text, Text to Image, Image to Image. Video shows those three plus Text to Video, Image to Video, Text to Speech. Photo shows Image to Image only. Text to Sound never appears, because `CURATED_MODELS.text2sound` is empty; see known issue 5. Confirmed by the run in all three modes.

**AIE-09 · browser · Qase 3936, 3941, 3949 · Groups expand and collapse**
Steps: click each group heading twice.
Expected: every group starts collapsed (`aria-expanded="false"`), the first click reveals its model list, the second hides it again, and the groups are independent.
Note (run): the sidebar keeps its expanded groups across an editor remount, because only the editor is keyed — a later case has to treat "expand" as idempotent.

**AIE-10 · browser · Qase 3937, 3942, 3948, 3946, 3945, 3952, 3938, 3943, 3950 · Selection is local until Apply Changes**
Steps: read the Apply Changes button, expand Text to Image, tick a second model, read the button, click it.
Expected: Apply Changes starts disabled. Ticking makes it enabled and moves the group's own count from 1/2 to 2/2, which is the local state; unticking back disables it again. The click remounts the editor and leaves Apply Changes disabled. That a second model reaches the generation panel is asserted by AIE-14, which is the case that opens it.

**AIE-11 · browser · Qase 3939, 3944, 3951 · Deselecting every model removes the AI entry points**
Steps: untick every model in every group, click Apply Changes.
Expected: in Photo mode, unticking the one Image to Image model and applying removes the AI Edit dock button entirely, because `AiPhotoEditConfig.initialize` returns before it registers anything on an empty `image2image` list, while the photo tools stay. What the `plugin-ai-apps-web` dock entry does with an empty provider map in Design and Video is that plugin's decision, so it is not asserted here.

### 5.3 Photo mode's in-place AI edit

**AIE-12 · browser · Qase 3895, 3956, 3959, 3960, 4308 · The AI Edit panel's default state**
Steps: in Photo mode click the AI Edit dock button.
Expected: a panel opens. The Prompt field is empty. The Style picker shows "None". **Generate is enabled even with an empty prompt**, because the kit auto-supplies the current page image as `image_urls` rather than asking for a picker. The panel offers no Format, Aspect Ratio, Size or Width control — the kit strips those keys from the schema order so the output keeps the input's aspect. That the panel carries no generated-items grid follows from `output.history = false`, which AIE-U10 asserts directly.
Qase 3934 makes the same "Style defaults to None" assertion as 4308 but sits in the plugin's own sub-suite; the default is `CommonProperties.StyleTransfer`'s, so 3934 stays in section 10.2 while 4308 is asserted here as part of the panel the kit assembles.

**AIE-13 · browser · Qase 3961, 3965 · A photo edit replaces the image in place**
Steps: type a prompt, pick a style, click Generate with the gateway answering a fixture image URL.
Expected: when the SSE response arrives the page's `fill/image/sourceSet[0].uri` is the fixture URL, the page keeps its size and child count, an undo step was added, and the typed prompt is still in the field. The request carried the curated model id and the prompt. The pending shimmer is engine state that AIE-H1 pins directly.

**AIE-14 · browser · Qase 3969 · The provider select appears when two i2i models are active**
Steps: in the sidebar tick a second Image to Image model, Apply Changes, reopen AI Edit.
Expected: a provider Select is rendered above the prompt, carrying the curated model id as its value, and switching it changes which model the next `POST /v1/responses` names. The kit enables this itself with `feature.set('ly.img.plugin-ai-image-generation-web.providerSelect', true)`, because it bypasses the plugin that would otherwise enable it.

### 5.4 Export

**AIE-15 · browser · Qase 3192, 3194 · Design export**
Steps: in Design mode open the actions menu and click Export PDF, then Export Image.
Expected: one PNG and one PDF whose page count matches the archive's; the two `engine.block.export` calls carry `image/png` and `application/pdf` and no target size.
Note (run): `ly.img.actions.navigationBar` renders its first child as its own button (Export Images) and keeps the rest in a dropdown (Export PDF) — the same shape batch P2 recorded. Between the two exports the "Export complete" dialog has to be dismissed.

**AIE-16 · browser · Qase 4515 · Photo export image**
Steps: in Photo mode open the actions menu and click Export Image.
Expected: one PNG download whose pixel size is the page's own size, and no dropdown beside the button. The navigation-bar entry runs `exportDesign` with `mimeType: 'image/png'` and no target size. Known issue 10 is fixed: the kit's dead `exportImage` action is deleted.

**AIE-17 · browser · Qase 3196 · Video export**
Steps: in Video mode open the actions menu and click Export Video.
Expected: one `.mp4` download arrives and the recorded `engine.block.exportVideo` call carries `mimeType: 'video/mp4'`. The encode is intercepted with `spyExportVideo(page, { intercept: true })`, so the case costs seconds rather than a minute, and the case asserts `mp4Info` rejects the stub — a size assertion can never pass against harness data.

### 5.5 Credentials

**AIE-18 · dropped as a browser case; covered by AIE-C1 and AIE-U8** (no Qase case yet)
The dev server always bakes `VITE_AI_API_KEY`, so `getApiKey()` resolves and the missing-credentials state cannot be reached from a browser test in dev mode. That the probe returns `missing` without touching `fetch` is AIE-U8; that the screen then reads "Set up your IMG.LY API key" is the component case AIE-C1.

**AIE-19 · browser · A rejected key shows the invalid-key screen** (no Qase case yet)
Steps: answer `GET /v1/models` with HTTP 401, then with 403.
Expected: both give the "Your API key was rejected" card and no editor is mounted (`window.cesdk` stays undefined). Each status is its own `test.describe` with the browser's own resource error allowlisted.

**AIE-20 · browser · An unreachable gateway still boots the editor** (no Qase case yet)
Steps: answer `GET /v1/models` with HTTP 500, then abort the request entirely.
Expected: in both cases the editor mounts and the sidebar lists exactly the curated models — every group reads 1/1, where a merged catalogue would make Image to Image read 1/2. The `console.warn` naming the reason is a warning, so it does not fail a case. A generation against an unreachable gateway is the plugin's own error handling, so it is not driven here.

### 5.6 Headless cases (engine, no browser)

Subject: the exported `applyToPhotoMiddleware` and `getCurrentPageImageUri`, driven with a fake `next`.

**AIE-H1 · headless · The middleware writes the result into the page fill**
Steps: build a one-page scene whose page fill carries a source set, run the middleware with a `next` resolving `{ url: 'file://…/edited.png' }`.
Expected: `fill/image/sourceSet[0].uri` becomes the returned URL, its `width` and `height` are the ones the original entry carried, the page is `Pending` while `next` runs and `Ready` after, and an undo step was added.
Note (run): the engine records an undo step only after `engine.update()` has ticked, so the case ticks around the middleware.

**AIE-H2 · headless · A scene built from an image has no source set**
Steps: same, but with a page whose fill carries only `fill/image/imageFileURI`.
Expected: the middleware writes a new source-set entry whose `width` and `height` are the page's own dimensions, matching what `createFromImage` sized the page to.

**AIE-H3 · headless · Failure and non-image results**
Steps: run the middleware with a `next` that rejects; then with a `next` resolving an object that has no `url`; then with no current page.
Expected: the rejection propagates but the page's state is set back to `Ready` in the `finally`; the result with no `url` leaves the fill untouched; with no page the middleware forwards to `next` and touches nothing. `getCurrentPageImageUri` returns the source-set URI when present, falls back to `imageFileURI`, and returns `undefined` rather than throwing when the page has no image fill.

### 5.7 Component cases (jsdom, no engine)

**AIE-C1 · component · `OnboardingScreen`** (replaces browser AIE-18)
The missing variant heads "Set up your IMG.LY API key", carries the `VITE_AI_API_KEY=` snippet and links the dashboard; the invalid variant heads "Your API key was rejected"; the embedded variant points at the host's Clerk and gateway pairing and never mentions `.env`. Every variant offers Reload.

**AIE-C2 · component · `Sidebar`**
Groups start collapsed and show a selected/total count; opening one reveals its models; Apply Changes stays disabled until a flag differs and again once it is toggled back; applying hands the host the edited state; and a new `providers` prop resets the local edit.

**AIE-C3 · component · `Topbar`**
The current mode carries the active class, clicking it reports nothing, and clicking another reports that mode.

**AIE-C5 · component · the onboarding a deployed bundle shows**
A production bundle asks for the API key, saves a trimmed one, says a stored key
was rejected and offers to clear it, and links the dashboard and the gateway
guide.

**AIE-C6 · component · the credentials of an embedded preview**
The embedded mode is reported before anything is asked, the token comes from the
hosting frame, the gateway the host names in the query wins over the configured
one, a host that never answers is unreachable, a rejected session is invalid and
names the mode, and a bridge or a fetch that throws a bare value is reported by
its string.

**AIE-C7 · component · the bridge after it has settled**

**AIE-C8 · component · the boot flow**
Missing credentials and a rejected key each show the onboarding screen; a probe
that checks out mounts the editor; a probe that answers after unmount is dropped.

**AIE-C9 · component · the editor the boot flow initializes**
Each mode loads its own content, an unknown mode falls back to the design
editor, and the mode the user picks is remembered in the URL.

**AIE-C10 · component · a gateway that cannot be reached**

**AIE-C11 · component · switching mode before the editor exists**

### 5.8 Unit cases (no engine, no browser)

**AIE-C12 · component · the demo lifecycle beacon**
Initializing the editor reports the demo phases `created` then `ready`, and the
editor gets `reportDemoLoadingState` as its loading-state handler.

**AIE-U1 · unit · Capabilities per mode**
`capabilitiesForMode('Design')` is `['text2text','text2image','image2image']`, Photo is `['image2image']`, Video is the seven-entry list. The returned array is a copy — mutating it does not change the next call. This is the same fact Qase 3935, 3940 and 3947 assert through the UI.

**AIE-U2 · unit · `instantiateGatewayProvider`**
Each capability routes to its factory: `text2text` to the text gateway, `text2image` and `image2image` to the image gateway, `text2video` and `image2video` to the video gateway, `text2speech` and `text2sound` to the audio gateway. An unknown capability throws `Unknown capability: x`. A `gatewayUrl` option is forwarded verbatim; an empty string or `undefined` is omitted so the plugin default applies. Two files: the routing and the forwarded config are asserted against mocked `/gateway` factories (what a factory builds is plugin-owned), and a second, unmocked case proves each capability really does produce a provider factory.

**AIE-U3 · unit · `CURATED_MODELS` and `createAIProviders`**
Every capability except `text2sound` has exactly one model id in `vendor/model` form; `text2sound` is empty and is therefore absent from every provider map, so Video's map has six keys, not seven. `createAIProviders('Photo')` has the single key `image2image` whose model is `bfl/flux-2-edit`. Qase 3896 says the Photo provider defaults to "Gemini Flash Edit" — that title is stale and is left as recorded rather than tested.

**AIE-U4 · unit · `buildInitialSidebarState`**
For each mode the state has one entry per capability with a curated model, every provider starts `selected: true`, the display name falls back to the model id and the label to the vendor prefix, `supportedModes` comes from the capability table, and `gatewayUrl` reaches the lazy `provider()` factory.

**AIE-U5 · unit · `mergeCatalogIntoState`**
A catalogue entry that matches a curated model keeps its `selected` flag and takes the catalogue's `name` and `creator`. A catalogue-only model is added with `selected: false`. A curated model the catalogue does not echo is kept at the end of the list. A payload that is not an object, a capability whose value is not an array, and a model with no `id` are all ignored without throwing. Capabilities outside the mode never appear.

**AIE-U6 · unit · `getSelectedProviders`**
Only providers with `selected: true` are instantiated; a capability with none selected is absent from the map rather than present and empty; each entry is an array.

**AIE-U7 · unit · `deepCloneProviders` and `hasChanges`**
The clone is deep for the arrays and shallow for the `provider` function reference. `hasChanges` is false for an untouched clone, true after one toggle, and false again after toggling back. Note it compares by array index and would throw if the two states ever had different lengths — see known issue 6.

**AIE-U8 · unit · `probeAiCredentials`**
With a stubbed `fetch` and a stubbed key: no key gives `{ status: 'missing' }` and never calls `fetch`; 401 and 403 give `{ status: 'invalid', mode }`; a rejected `fetch` and a 500 both give `{ status: 'unreachable' }` with a message; 200 gives `{ status: 'ok' }` carrying the parsed body. The request goes to `<gateway>/v1/models?groupBy=capability` with `Authorization: Bearer <key>`.

**AIE-U9 · unit · Credential resolution**
`resolveAiToken` returns `{ dangerouslyExposeApiKey }` when a key is set and throws the "No AI credentials configured" message when not. `bearerFromTokenResult` collapses both shapes. `detectAiCredentialMode` is `apiKey` or `unconfigured`. `getUserApiKey` returns `undefined` outside a production build and survives a `localStorage` that throws. `getGatewayUrl` prefers `VITE_AI_GATEWAY_URL` and falls back to `https://gateway.img.ly`. `installAiCredentials` registers exactly the action id `ly.img.ai.getToken`.

**AIE-U10 · unit · `customizeProviderForPhotoEdit`**
On a fake schema panel: `panel.order` drops `format`, `aspect_ratio`, `image_size`, `size`, `width`, `height`, `num_images` and `num_outputs`, keeps `image_urls`, and inserts `style` immediately after `prompt` — or appends it when there is no `prompt`. `panel.userFlow` becomes `generation-only`. `renderCustomProperty` is redefined even though the original is a getter, and its `image_urls` renderer returns a getter with the current page URI and draws nothing. `output.history` becomes `false` and the apply middleware is prepended to any existing chain. A panel that is missing, or whose `type` is not `schema`, is left untouched.

**AIE-U11 · unit · `AiAppsConfig`**
On a spy `cesdk`: `ly.img.ai/apps.dock` is inserted at the start of the dock; the three canvas-menu entries are inserted at the start for `editMode: 'Transform'`; the AI Apps plugin is added with the provider map it was constructed with; `ly.img.image` gains `ly.img.ai.image-generation.history`; `ly.img.video` and `ly.img.audio` gain theirs **only** in Video mode.

**AIE-U12 · unit · The three editor configurations**
For each of `initAiDesignEditor`, `initAiPhotoEditor` and `initAiVideoEditor` on a spy `cesdk`: the matching config plugin, the theme (light, dark, light), the twelve asset-source plugins, the `UploadAssetSources` include list (image only, image only, image + video + audio), the `DemoAssetSources` include list, and the AI plugin each one ends with. Per mode, the dock order and the navigation bar's actions children match the files under `config/<mode>-editor/ui/`. Every enabled feature list is a leaf list: it names no umbrella group whose children it also enables, so a CE.SDK upgrade that adds a child cannot enable it behind the kit's back.

**AIE-U13 · unit · Constants**
`SCENE_URLS.Design` and `.Video` are built from `DEMO_ASSETS_BASE_URL`, which prefers `VITE_DEMO_ASSETS_BASE_URL` and otherwise falls back to this kit's published copy. `DEFAULT_PHOTO_URL` is an absolute URL. `getInitialMode` is module-private in `App.tsx`, so it is covered by AIE-05 instead.

**AIE-U14 · unit · `providersForMode`** (new)
The helper the preflight fix introduced. It merges the catalogue into the mode's curated defaults and carries the user's `selected` flag over from the previous mode's state, so a capability the previous mode did not offer keeps its curated default rather than arriving unselected. With no catalogue it yields the curated models.

**AIE-U15 · unit · The per-mode configuration modules** (new, part of AIE-U12)
Driven through the leaf `setup*` functions of `config/{design,photo,video}-editor`: the actions menu of each navigation bar, the dock's library keys, the panel positions, the enabled feature lists, the two `feature.set` predicates Photo uses to hide the canvas menu and the inspector bar while the page is selected, the engine settings each mode writes, and the translations Photo registers for its dock buttons while Design and Video register none.

**AIE-U16 · unit · The three editor configuration plugins**
Run through `describe.each` over the design, photo and video trees. Each installs its own US ANSI catalog object unchanged, registers its actions and forwards the caller's export options, is named for its mode, carries `CreativeEditorSDK.version`, resets the editor and then pins the editor compatibility version to that version before it configures anything, and does nothing without a `cesdk`. Only the video tree runs `editor.checkBrowserSupport`.

**AIE-U17 · unit · The video features and the photo editor reset**
The video tree enables animations, transitions and the thirteen `ly.img.video.timeline.*` leaves, and never the `ly.img.video.timeline` group itself. The photo tree registers an `onReset` handler that drops its subscriptions.

**AIE-C3, AIE-C4 · component · The embedded token bridge**
`hasEmbeddedParent` is true only inside a frame that carries `?demoPreview=true`. `requestTokenFromParent` posts a request to the parent, resolves with the token the host answers with, ignores an answer to a different request and any other message, rejects with the host's error, rejects an answer that carries neither a token nor an error, and gives up after ten seconds with a message naming the listener the host has to install.

**AIE-U17 · unit · the actions of the photo and video editors**
Each tree overrides `exportDesign` only, and it downloads the exported blob.

**AIE-U18 · unit · the actions of the design editor**
`saveScene`, `exportDesign`, `importScene`, `exportScene` and `uploadFile`:
the download mime types, the one import picker that accepts `.imgly`, `.scene`
and `.zip`, the zoom that follows an import, the archive and JSON formats and
the default, and the local-upload hand-off.

**AIE-U19 · unit · the photo dock**
Large labelled icons, the four photo tools in dock order, crop mode in and out,
each inspector panel opening and closing, and every button doing nothing while
the scene has no current page.

**AIE-U20 · unit · the timeline setup the design and photo editors ship unused**

**AIE-U21 · unit · the dock guards the builder contract**

**AIE-U22 · unit · the key a deployed bundle stores in the browser**
Round-trip through `localStorage`, an empty stored key treated as none, the
stored key preferred over the build-time one, and a storage that refuses to
write.

**AIE-U23 · unit · the probe when the token cannot be resolved**

**AIE-U24 · unit · the image URI the photo prompt starts from**
The source set wins, then the image file URI; no page, a refusing engine and a
fill with no image each report nothing.

**AIE-U25 · unit · cloning the provider state**

**AIE-U26 · unit · the catalogue merge at its edges**
A curated capability the catalogue does not mention, a capability the user has
emptied, a capability that is neither, and a model id that names no vendor.

**AIE-U27 · unit · flattening a state with a missing category**

**AIE-U28 · unit · the entry point without its container**

**AIE-U29 · unit · the AI photo-edit plugin**
No editor and no image-to-image provider each stop it; otherwise it enables the
provider select, registers the panel, the dock entry and its translations, skips
the panel when the provider renders none, and toggles the panel from the dock.

**AIE-U30 · unit · Asset source registration is concurrent**
With an `addPlugin` that resolves only on demand, each mode's init function issues the configuration plugin, then the twelve shared asset sources together, then upload and demo together, then its AI plugin. A sequential registration would stall after the first asset source.

**KB-01 · unit · Keyboard catalog predicates**

`tests/unit/keyboard-catalog.test.ts` runs every `run` and `when` of `src/imgly/config/design-editor/keyboard/catalogs/us-ansi.ts`, `src/imgly/config/photo-editor/keyboard/catalogs/us-ansi.ts`, `src/imgly/config/video-editor/keyboard/catalogs/us-ansi.ts` against 1620 editor states (5 edit modes, 9 selections, 3 roles, features on and off, 3 vector states, page and no page) and asserts that none throws, that every shortcut activates in at least one state, and that every function `run` reaches `cesdk.actions.run`. Kit-owned: the kit decides which key does what and when it is live. The catalog measures 100 % lines, branches and functions.

## 6. Entry and exit criteria

Entry: engine, editor and the AI plugin packages built; test license available; the shared kit test harness; the gateway routes in `tests/e2e/gateway.ts` and the two fixture images in `tests/fixtures/`; the three symbols named in section 4 exported from `ai-photo-edit.ts`; the kit's `test:unit`, `test:e2e`, `test:all` and `ci` scripts real rather than `exit 0`. The two scene archives are git-LFS and fetch-excluded, so a browser run needs `git lfs pull -X '' -I "packages/cesdk-web-examples-data/data/starterkit-ai-editor/**"` first.

Exit: met. Every case in section 5 passes locally; `npm run ci` exits 0. No test reaches `gateway.img.ly`, `images.unsplash.com` or `cdn.img.ly`. The published kit contains no test files. Still open: a release run reporting to the Qase ids above, and re-pointing the 102 ids in section 10 at the plugin suites.

## 7. Known issues

**Fixed in this batch:** 1 (`qa:local` deleted with the script rewrite), 2 (agent C added `.eslintrc.js`), 3 (the preflight now runs once per page load), 10 (the dead `exportImage` action deleted).

3. **Fixed.** The credential preflight effect depended on `currentMode`, so every mode switch re-ran the probe, refetched the catalogue and rebuilt the sidebar from `CURATED_MODELS`, silently discarding an applied selection and flashing an empty pane. The probe now runs once on mount, the catalogue is kept in the `ready` boot state, and `providersForMode` rebuilds the sidebar for the new mode while carrying the user's flags over. AIE-06 is the proof; AIE-U14 covers the helper.
4. `handleInit` depends on `boot`, so `setBoot` produces a new `init` function identity on every provider change. Whether that alone re-initialises the editor depends on the React wrapper, which has no test (section 10, gap 1). Confirm before treating it as a defect.
5. `CURATED_MODELS.text2sound` is empty, so the Text to Sound capability never reaches a provider map and never appears in the sidebar, while `CAPABILITIES_BY_MODE.Video` and `CAPABILITY_NAMES` both still list it. The comment says this is deliberate until the gateway exposes such a model; nothing tells a reader of the sidebar that a capability is missing.
6. `hasChanges` compares `localCategory.providers[index]` with `originalCategory.providers[index]` and would throw on a shorter original. Nothing produces different lengths today, because `deepCloneProviders` preserves them, but the function does not defend the case it iterates.
7. `AiPhotoEditConfig` registers about fifteen self-referential English translations (`None: 'None'`, `Anime: 'Anime'`, …) to work around a library that resolves a label key and then looks the result up again as a key. The workaround is documented in the file, but it also means a non-English locale shows English style names.
8. `config/design-editor/i18n.ts` and `config/video-editor/i18n.ts` are empty `void cesdk;` stubs; only the photo editor's sets translations.
9. `.env.example` leaves `VITE_AI_API_KEY` empty, which is the correct shape — unlike several sibling kits that ship a truthy placeholder. Noted so a fleet sweep does not "fix" it.
10. **Fixed.** `design-editor/actions.ts` registered an `exportImage` action at 1080 × 1080 that no UI reached: `ly.img.exportImage.navigationBar` runs `exportDesign` with `mimeType: 'image/png'` and no target size (`apps/cesdk_web/packages/ui/components/actions/NavigationBarActionExportImage.tsx:55`). It is deleted, per the fleet resolution. Correction to this plan's first version: only the **design** editor registered it — the photo and video copies were already commented out.
11. The README's Architecture tree describes a `imgly/plugins/ai-app/` folder holding `ai-apps.ts`, `ai-preflight.ts`, `ai-providers.ts` and `ai-token.ts`. The kit ships `imgly/plugins/{ai-apps,ai-photo-edit,ai-providers}.ts` and keeps the credential code in `app/ai-credentials/`. `ai-preflight.ts` and `ai-token.ts` do not exist, and `ai-photo-edit.ts` — the largest file in the kit — is not mentioned.
12. The README's AI Providers snippet pushes onto `text2image.providers`, a shape no module exports. Providers are built by `createAIProviders(mode)` from `CURATED_MODELS`, and the sidebar's catalogue is assembled by `app/ai-sidebar/catalog.ts`. Someone following the README edits nothing that runs.

### Coverage residue

Everything of `src/**` the merged report still misses. Every entry is
unreachable by construction; nothing here is a missing test.

1. **`src/app/App.tsx:189-195`** — the `providersForMode(...)` arm of
   `boot.phase === 'ready' ? boot.providers : …` inside `handleInit`.
   `handleInit` is only ever handed to `<CreativeEditor>`, which the app renders
   only in the `ready` phase, so the callback cannot run in any other one.
2. **`src/app/App.tsx:211-214`** — the `default` arm of the mode switch.
   `getInitialMode` validates the URL parameter against `EDITOR_MODES` and the
   topbar offers only those three, so `currentMode` is never anything else.
3. **`src/app/App.tsx:256`** — the `: current` arm of `handleProviderChange`.
   The sidebar that calls it renders only in the `ready` phase.
4. **`src/app/ai-credentials/OnboardingScreen.tsx:233`** — the `if (!canSave)
return` inside `handleSave`. The Save button carries `disabled={!canSave}`,
   so the handler cannot fire while that guard is true.
5. **`src/app/ai-credentials/ai-credentials.ts:75, 85, 95`** and
   **`ai-token-embedded.ts:17`** — the `typeof window === 'undefined'` guards.
   The kit is a browser bundle and its tests run under jsdom, so `window`
   always exists.
6. **`src/app/ai-credentials/ai-token-embedded.ts:58, 74`** — the two
   `if (settled) return` guards. Settling removes the message listener and
   clears the timeout in the same statement sequence, so neither path can be
   entered a second time.
7. **`src/imgly/config/photo-editor/plugin.ts:127`** — the
   `subscriptions.forEach((unsubscribe) => …)` inside `setupOnReset`. Nothing
   anywhere pushes into `subscriptions`, so the callback is unreachable.

## 8. Open questions

1. **Answered for now.** Qase 3896 names "Gemini Flash Edit" as the default Photo provider; the curated `image2image` model is `bfl/flux-2-edit`. The title is stale; it stays mapped as recorded and no test asserts a vendor name. → Elia (Qase owner).
2. **Resolved and implemented.** A mode switch preserves the applied selection; see known issue 3.
3. **Answered.** Qase 3326, 4296 and 4297 assert gateway-owned defaults and are left mapped as recorded, with no test in this repo.
4. **Answered.** The SSE fixture is hand-written in `tests/e2e/gateway.ts`, built from the event names `createGatewayClient.ts` parses, so a gateway change cannot silently rewrite the expectation.
5. **New.** The navigation bar's actions dropdown has no accessible name — only a `TriangleDown` icon — so the export cases reach it through the builder's `name` hook. Worth an editor-side label. → Elia (product).

## 9. Measured run

| Lane                                      | Files | Tests | Time  |
| ----------------------------------------- | ----- | ----- | ----- |
| Unit + component + headless (`test:unit`) | 12    | 147   | ~9 s  |
| Browser (`test:e2e`)                      | 5     | 21    | ~85 s |

`npm run ci` exits 0. Vitest coverage of `src/**`: 69.43 % lines, 91.2 % branches, 27.45 % functions — the floor in `tests/coverage-thresholds.json`. Merged with the Playwright dumps: 78.29 % lines, 91.34 % branches, 27.45 % functions — the floor in `tests/coverage-thresholds.merged.json`. The function number is held down by the two 1200-line keyboard-shortcut catalogs and the commented-out example actions, which nothing calls.

## 10. Boundary review

Rule used: the code that makes a decision owns the test for it. This kit is a shell around the AI plugin packages. It decides which providers are constructed and with which model ids, which gateway they talk to, how credentials are resolved, where the AI entry points sit in each of three editor configurations, and — in Photo mode only — how a generated image is applied to the canvas. The plugins decide every generation panel, every quick action, the history grid, cancellation and its dialog. The engine decides what a scene load and an export produce. The editor decides how a registered panel and dock component render.

### 10.1 Core behaviour this plan leans on, and where it is covered today

| Behaviour                                                              | Owner  | Covered by                                                                                                                                |
| ---------------------------------------------------------------------- | ------ | ----------------------------------------------------------------------------------------------------------------------------------------- |
| Gateway HTTP client: bearer header, token caching, 401 retry           | plugin | `plugin-ai-generation-web/src/__tests__/gateway-client-auth.test.ts:22, 33, 44, 63, 74`                                                   |
| Gateway HTTP client: typed errors, model id in the body, SSE parsing   | plugin | `.../__tests__/gateway-client-http-errors.test.ts:169`; `.../gateway-client-sse.test.ts`; `.../gateway-client-network-errors.test.ts`     |
| Generation error copy and `preventDefault`                             | plugin | `.../__tests__/handleGenerationError.test.ts`; `.../gateway-error-middleware.test.ts`                                                     |
| Middleware composition and ordering                                    | plugin | `.../__tests__/middleware.test.ts:31`                                                                                                     |
| Applying an image result to a block (source set vs `imageFileURI`)     | plugin | `.../__tests__/getApplyCallbacksForImage.test.ts:132, 150, 167, 176, 194`                                                                 |
| Provider-select feature-flag gating                                    | plugin | `.../providers/__tests__/providerSelection.test.ts:26, 42, 74`                                                                            |
| `ui.registerPanel`, `openPanel`, `closePanel`, `isPanelOpen`           | editor | `apps/cesdk_web/packages/api/ui/UserInterfaceAPI.test.ts:2554, 2351`                                                                      |
| `ui.insertOrderComponent` at `position: 'start'`, with a `when` clause | editor | `apps/cesdk_web/packages/api/ui/UserInterfaceAPI.test.ts:665, 674, 1027`                                                                  |
| `ui.updateAssetLibraryEntry` with the `sourceIds({ currentIds })` form | editor | `apps/cesdk_web/packages/api/ui/UserInterfaceAPI.test.ts:2665`; resolution in `ui/components/assets/resolveSourceIds.test.ts:44`          |
| `actions.register` / `run` / `get`                                     | editor | `apps/cesdk_web/packages/api/actions/ActionsAPI.test.ts:41, 53, 95`                                                                       |
| `feature.set` with a boolean                                           | editor | `apps/cesdk_web/packages/api/features/FeatureAPI.test.ts:203`                                                                             |
| `utils.export` for image, PDF and video, and `downloadFile`            | editor | `apps/cesdk_web/packages/api/utils/UtilsAPI.test.ts:288, 670, 192`                                                                        |
| `i18n.setTranslations`                                                 | editor | `apps/cesdk_web/packages/api/i18n/`                                                                                                       |
| `scene.load` from an archive, `block.export` to PNG and PDF            | engine | `engine/lib/test/api/ArchiveRoundTripAPITest.cpp`; `bindings/shared/ts/src/tests/block-export.test.ts:33`; `ExportAPITest.cpp` PDF matrix |
| `block.setSourceSet` / `getSourceSet`                                  | engine | `bindings/shared/ts/src/tests/block-placeholder.test.ts:404`; `engine/lib/test/api/BlockPropertiesTest.cpp:366`                           |
| `editor.addUndoStep`                                                   | engine | `engine/lib/test/api/HistoryAPITest.cpp`                                                                                                  |

### 10.2 Qase cases owned by the AI plugin packages

These 102 cases describe generation behaviour, not this kit. They are listed with their owning package and the coverage that exists there today, so S5 has a work list and so nobody re-tests them here. The kit's own cases above prove the entry points exist and are wired to the right provider; everything past the first click belongs to the package.

| Sub-suite                               | Qase ids                                                                                                                                                                     | Owning package                                                | Covered today                                                                                                                                                                                                                                                                                              |
| --------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Design / Image Generation               | 3348, 3349, 3356, 3359, 3363, 3364, 3365                                                                                                                                     | `plugin-ai-image-generation-web` + `plugin-ai-generation-web` | **Partly.** Cancel plumbing is covered (`handleGenerateFromPanel-placeholder.test.ts:103`); the panel itself, the generated-items grid and delete are not.                                                                                                                                                 |
| Design / Image Generation / Image input | 3367, 3368, 3375, 3370, 3371, 3372, 3373, 3376, 3378, 3379                                                                                                                   | same                                                          | **No.** No test drives the schema panel or the image picker.                                                                                                                                                                                                                                               |
| Design / Image Generation / Text input  | 3350, 3352, 3353, 3354, 3355, 3362, 3366, 3377, 4248, 4249                                                                                                                   | same                                                          | **No.**                                                                                                                                                                                                                                                                                                    |
| Design / Images / AI edit image         | 3380, 3381, 3382, 3383, 3384, 3385, 4250, 4251, 4252                                                                                                                         | `plugin-ai-image-generation-web`                              | **Barely.** `quickActions/__tests__/EditImage.test.ts` covers flag registration and i18n only; `CreateVariant`, `SwapBackground`, `StyleTransfer` and `ArtistTransfer` have no test file.                                                                                                                  |
| Design / Text / AI edit text            | 3387, 3388, 3389, 3390, 3391, 3392, 3393, 3394, 3395, 3396, 4253, 4254, 4255, 4256, 4257, 4258, 4259                                                                         | `plugin-ai-text-generation-web`                               | **Barely.** Only `quickActions/__tests__/Translate.test.ts`, and it registers a flag rather than running a generation. The before/after and accept/discard mechanics are covered generically in `plugin-ai-generation-web/src/__tests__/createConfirmationRenderFunction.test.ts:297, 342, 369, 426, 468`. |
| Photo / AI Edit (plugin-owned half)     | 3906, 3910, 3934, 3962                                                                                                                                                       | `plugin-ai-generation-web`                                    | **Partly.** Abort is covered; the confirm-before-cancel dialog in `ui/components/renderGenerationComponents.ts` has no test. `StyleTransfer` has none.                                                                                                                                                     |
| Video / AI Voice                        | 3312, 3318, 3319, 3322, 3323, 3324, 4307, 3313, 3314, 3315, 3316, 3317, 3321, 3328                                                                                           | `plugin-ai-audio-generation-web`                              | **No.** The package has zero test files.                                                                                                                                                                                                                                                                   |
| Video / Generate Image                  | 4264, 4275                                                                                                                                                                   | `plugin-ai-image-generation-web`                              | **No.**                                                                                                                                                                                                                                                                                                    |
| Video / Generate Video                  | 3241, 3242, 3249, 3252, 3256, 3257, 3258, 3260, 3261, 3262, 3268, 3263, 3264, 3265, 3266, 3269, 3271, 3272, 3243, 3246, 3247, 3248, 3255, 3259, 3270, 4298, 4299, 4300, 4301 | `plugin-ai-video-generation-web`                              | **No.** The package has zero test files.                                                                                                                                                                                                                                                                   |

### 10.3 Core coverage gaps found

Candidates to add in the core suites, not in this kit.

1. **The whole gateway provider layer is untested.** `createGatewayProvider`, `initializeProviders`, and the `cesdk.actions.run('ly.img.ai.getToken')` hop have no test — only the HTTP client beneath them does. This kit's entire credential story rides on that hop. Suggested home: `plugin-ai-generation-web/src/gateway/__tests__/` and `src/providers/__tests__/`.
2. **`plugin-ai-apps-web`, `plugin-ai-video-generation-web` and `plugin-ai-audio-generation-web` have no test files at all.** That covers the dock component `ly.img.ai/apps.dock`, the canvas-menu entries, and both the video and audio generation panels — 45 of the 102 Qase ids above. Suggested home: a `src/__tests__/` in each package.
3. **The generation history asset sources have no coverage of any kind** — `ly.img.ai.{image,video,audio}-generation.history`, their appearance in an asset library, and delete-from-history. `AiAppsConfig` adds all three. Suggested home: `plugin-ai-generation-web/src/assets/__tests__/`.
4. **The cancel-confirmation dialog is untested** (`plugin-ai-generation-web/src/ui/components/renderGenerationComponents.ts`), although the abort plumbing under it is well covered. Qase 3363, 3910, 3256 and 4275 all depend on it. Suggested home: alongside `createConfirmationRenderFunction.test.ts`.
5. **`CommonProperties.StyleTransfer` has no test.** This kit uses it directly to build the Photo mode prompt and style picker. Suggested home: `plugin-ai-generation-web/src/ui/common/`.
6. **Eleven of thirteen quick actions have no test file**, and the two that do assert only feature-flag registration and i18n. Suggested home: each package's `src/quickActions/__tests__/`.
7. **Editor: the React wrapper `@cesdk/cesdk-js/react` (`packages/cesdk-react/`) has no test file.** This kit remounts it by `key` on every mode change and every Apply Changes, and known issue 4 is a direct question about its `init` prop identity. Suggested home: `packages/cesdk-react/`.
8. **Editor: `cesdk.createFromImage(url)` has no happy-path test anywhere.** The only coverage is `bindings/shared/ts/src/tests/scene-extended.test.ts:31, 423`, which asserts it rejects for a bogus URL. Photo mode's entire scene comes from it. Suggested home: `bindings/shared/ts/src/tests/scene-extended.test.ts` and `apps/cesdk_web/packages/cesdk/`.
9. **Engine: `block.setState({ type: 'Pending' })` is never set in any test.** `BlockStateEventsAPITest.cpp:42` sets `ready` only, and the JS suites read state but never write it. The apply-to-photo middleware wraps every generation in `Pending` → `Ready`, and AIE-H1 to AIE-H3 are the only thing pinning it. Suggested home: `bindings/shared/ts/src/tests/block-properties.test.ts`, next to the `getState` cases.

Gaps 1 and 3 were closed while this batch ran: `plugin-ai-generation-web` gained `createGatewayProvider.test.ts` (27 cases) and `historyAssetSources.test.ts`, and the four AI packages that had no tests at all now have suites (S5-F). Gaps 7 and 9 are still open, so AIE-13 and the headless cases keep their engine-state assertions as the end-to-end proof.
