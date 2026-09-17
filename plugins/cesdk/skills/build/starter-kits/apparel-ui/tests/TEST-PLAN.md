# Test plan: starterkit-apparel-ui

Version 5, 5 Sep 2026. Status: implemented and green. `KIT_TEST_COVERAGE=1 npm run ci` exits 0 with 60 unit, 10 headless, 98 component and 22 browser tests, no expected failures. Merged coverage is lines 98.93 %, branches 97.77 %, functions 100 %, measured twice with the same result. The Vitest gate is 97.58 / 97.58 / 98.83 / 97.77.

## 1. Purpose

Verify that the Apparel UI starter kit works as shipped: the kiosk scene loads into a custom mobile-shaped editor, the dock adds text, images, shapes and stickers to the t-shirt, the adjustment bars change colour, font and alignment, Preview shows the garment, and Export produces a PDF.

## 2. Scope

In scope

- Start-up: engine config, the asset sources the kit registers, the sticker filter that keeps only emoticons, and `public/kiosk.scene`
- The Edit and Preview steps and what each does to the engine
- The dock (Text, Image, Shape, Sticker) and every adjustment bar
- Upload, replace, delete, undo and redo
- Export
- The kit's own code under `src/imgly/` and `src/app/`

Out of scope

- What the engine does with a colour, a font, an alignment enum or an export option. Engine behaviour; see section 10.
- The demo site around the kit (cards, tags, links, platform toggles). Covered by the `cesdk_web_demos` suite. Qase 317, 318, 319, 320, 321, 332, 344.
- The mobile-app layer (iOS and Android simulators, install-by-QR, the mobile documentation links). Not part of this web kit. Qase 333, 334, 335, 336, 337, 338, 4386, 4387.
- **Qase 2276-2288, 2382, 3699-3707, 4171, 4235, 4236 and 4617-4621** — the whole "Editor UI Configurations / Apparel Editor UI" suite. It describes `starterkit-t-shirt-designer`, not this kit, and its plan maps those ids. Resolved: this plan drops them.

## 3. Test environment

- Browser: Chrome, headless, 1400 × 900
- Engine: `@cesdk/engine` built from this repo, served locally. Any request to `cdn.img.ly` fails the test, and the kit needs none: `public/kiosk.scene` names the Oswald face and the emoji fallback font by root-relative paths into the bundled asset pack, so `tests/playwright.config.ts` carries no allowlist.
- License: the shared test license (valid on hostname `localhost` only)
- Data: the kit's own `public/kiosk.scene` — one page, one stack, three graphics (two image fills, one of them the garment backdrop), one text block, one ellipse and two rects.
- **No live Unsplash traffic.** The image bar is `uploads + Unsplash("Skateboard")`, and applying an Unsplash asset also calls the tracked-download endpoint. Every browser case installs a `page.route` on `https://api.img.ly/unsplashProxy/**` and answers from a fixture whose photo URLs are a 1x1 `data:image/png` URI, so applying an asset needs no network at all.
- Headless: `@cesdk/node` through the shared harness engine helper. Node, no DOM.
- Component: Vitest with `// @vitest-environment jsdom`, React Testing Library, the kit's own Vite plugins. See open question 2.
- Downloads: captured by Playwright and checked by file type and PDF page count

## 4. Approach

| Kind      | Tool                          | What it checks                                          | Run                 |
| --------- | ----------------------------- | ------------------------------------------------------- | ------------------- |
| Static    | tsc, eslint, convention check | Types, deprecated APIs, kit folder shape                | `npm run check:all` |
| Unit      | Vitest                        | Colour conversion, Unsplash response mapping            | `npm run test:unit` |
| Headless  | Vitest + `@cesdk/node`        | The image-colours source and the block-placement helper | `npm run test:unit` |
| Component | Vitest + jsdom + RTL          | The kit's prop-only components                          | `npm run test:unit` |
| Browser   | Playwright                    | The test cases in section 5.1                           | `npm run test:e2e`  |

All five run in the kit's `ci` script. Browser tests use role, label and text locators where a name exists. Undo, redo and the colour swatches have none (known issue 1), so they are reached by position: undo and redo are the first two buttons on the page, and the swatch row is the ancestor of the one named control in it, the picker's `Pick color` trigger. Open question 3 is still open, so no `aria-label` was added.

## 5. Test cases

Format: ID, level, Qase id, title. Then steps and expected result.
Common precondition for all browser cases: the Unsplash proxy route is mocked, the kit is open, and the scene has finished loading.

### 5.1 Browser

**AP-01 · browser · Editor loads with the kiosk scene**
Steps: open the kit.
Expected: the garment page is on the canvas. Top bar with undo, redo and Export. The Edit and Preview steps, Edit selected. A dock with Text, Image, Shape and Sticker. No console errors. No engine asset from `cdn.img.ly`.

**AP-02 · browser · Qase 357 · Edit and Preview**
Steps: click Preview, then Edit.
Expected: in Preview the kit deselects everything, sets edit mode `Transform`, zooms to the backdrop graphic, turns `page/dimOutOfPageAreas` off, clips the page and disables its fill, and hides the dock. Back in Edit all five are reversed and the dock is shown again.

**AP-03 · browser · Qase 358 · Undo and redo start disabled**
Steps: read the top bar, then add a text block, then read it again.
Expected: both buttons are disabled at start. After the first change undo is enabled and redo stays disabled. After undo, redo is enabled.

**AP-04 · browser · Qase 324 · Add a text block**
Steps: open Text in the dock, pick a typeface.
Expected: a new text block is added to the page with font size 40, centre alignment, `Auto` height mode and half the page width, positioned by `autoPlaceBlockOnPage` and selected. The text adjustment bar appears with Color, Font and Align.
Note: the run disproved "no undo step is added" — `autoPlaceBlockOnPage` ends with `addUndoStep`, so undo becomes available. Known issue 2 is corrected.

**AP-05 · browser · Qase 325 · Edit the text**
Steps: double-click the new block, type a word, leave text mode.
Expected: `text/text` holds the typed value and the canvas re-zooms to the page when text mode ends.

**AP-06 · browser · Qase 326 · Emoji in text**
Steps: type an emoji into a text block.
Expected: it is stored in `text/text`. The fallback font is fetched from the bundled emoji path; the test asserts the stored value, not the glyph, because there are no screenshot assertions in this wave.

**AP-07 · browser · Qase 359 · Text colour from the palette**
Steps: select the text block, open Color, click the third swatch.
Expected: `fill/solid/color` on the block equals the palette entry (`#ff3333`) and one undo step is added. The palette is the six colours the kit hardcodes in `getColorPalette`.

**AP-08 · browser · Qase 360 · Change the text font**
Steps: select the text block, open Font, pick another typeface.
Expected: `setFont` is called for the selected block with that typeface's normal font, and the picker marks it active.

**AP-09 · browser · Qase 361 · Change the text alignment**
Steps: select the text block, open Align, click Left then Right.
Expected: `text/horizontalAlignment` is `Left`, then `Right`, one undo step each.

**AP-10 · browser · Qase 322 · Add a pre-loaded image**
Steps: open Image in the dock, click a thumbnail.
Expected: the kit queries the `unsplash` source with `query=Skateboard` and calls the tracked-download endpoint, and applying the asset adds one graphic to the page whose image fill is the URL that endpoint returned, not the asset's `meta.uri`.

**AP-11 · browser · Qase 323 · Upload an image**
Steps: open Image, click Upload, choose a PNG.
Expected: both files are added to `ly.img.image.upload`, and the refreshed list leads with the newest one, because the kit reverses the uploads.
Note: applying an upload selects the new block, which swaps the dock for the image adjustment bar, so the case re-opens the list through Replace rather than through the dock.

**AP-12 · browser · Qase 339 · Replace an image with a pre-loaded one**
Steps: select the design image on the garment, click a thumbnail.
Expected: the fill URI becomes the tracked-download URL and the page keeps its three children.
Note: the image on the page is a placeholder, so the kit opens the Replace bar by itself; clicking Replace first would close it again.

**AP-13 · browser · Qase 350 · Replace an image with an uploaded one**
Steps: as AP-12, but pick the uploaded file.
Expected: the fill URI is the uploaded blob URL.

**AP-14 · browser · Qase 345 · Replacing a sample image clears the placeholder UI**
Steps: select the placeholder image, replace it.
Expected: the placeholder overlay and its button are gone from the block afterwards, and Crop becomes enabled.

**AP-15 · browser · Qase 327 · Add a shape**
Steps: open Shape, click a shape.
Expected: a graphic with that vector shape is added and selected. The list comes from `ly.img.vector.shape` filtered to `ly.img.vector.shape.filled.*`, so only filled shapes are offered.

**AP-16 · browser · Qase 328 · Change the shape colour**
Steps: with the shape selected, open Color, click a swatch, then open the custom picker and enter a hex value.
Expected: `fill/solid/color` follows both, with one undo step each. A malformed hex is ignored rather than written.

**AP-17 · browser · Qase 330 · Add a sticker**
Steps: open Sticker, click one.
Expected: a graphic with that sticker's image fill is added and selected.

**AP-18 · browser · Qase 342 · Only emoticon stickers are offered**
Steps: open Sticker and read the list.
Expected: every entry is from the `emoticons` group. The kit removes every other sticker from `ly.img.sticker` at start-up, so nothing else can appear.

**AP-19 · browser · Delete a block**
Steps: add a shape, click Delete.
Expected: the block is destroyed and undo becomes available.
Note: the second clause is dropped. The only block that denies `lifecycle/destroy` is the garment backdrop, and it denies selection too (`engine.block.setSelected` throws `BLOCK.SELECTION_DISABLED`), so no adjustment bar can render for it.

**AP-20 · browser · Qase 331 · Export PDF**
Steps: click Export.
Expected: the kit calls `engine.block.export` once, on the scene, with `mimeType: 'application/pdf'`, then restores `scene/dpi` to 300 and the page's visibility. One PDF downloads with 1 page, named `my-t-shirt-design.pdf`.
Note: the kit passes no extension, but Chrome derives `.pdf` from the blob's type, so the missing extension in known issue 3 is not observable.

**AP-15b · browser · Only filled shapes are offered**
Steps: read `ly.img.vector.shape`, then open Shape.
Expected: every asset id starts with `ly.img.vector.shape.filled.`, and the bar shows exactly one button per asset. Split out of AP-15 so the shape list is asserted once.

**AP-21 · browser · Undoing an added block leaves the adjustment bar alive** _(implemented)_
Steps: add a shape, click undo.
Expected: the dock returns and no page error is logged.
Note from the run: the crash was not in `CurrentColorIcon`. `UseSelection`'s deferred correction re-selected the block the undo had destroyed, 200 ms after the fact, and `setSelected` threw "Block N is unknown"; the stale selection also kept the shape bar on screen. The correction now takes the engine's own selection when the one it remembers is gone.

### 5.2 Headless (no browser, real engine)

**AP-H1 · headless · The image-colours source groups by image block**
Steps: build a scene with two graphics carrying different image fills and one with a colour fill. Register `createImageColorsSource` and query it.
Expected: `getGroups()` returns one group per image block, named after the block or `Image N` when unnamed. `findAssets` returns up to five colour assets per group, deduped at three decimal places, each with `payload.color` in sRGB.

**AP-H2 · headless · Duplicate images collapse into one group**
Steps: two graphics with the same `fill/image/imageFileURI`.
Expected: one group. The source keys on image identity — URI, then source set, then external reference.

**AP-H3 · headless · Group and query filters**
Steps: query with `groups: [<one group>]`, then with a hex string, then with a group word, then with a word that matches nothing.
Expected: the group filter narrows to that group; a hex query matches by colour token with and without the leading `#`; a group word matches; an unmatched word returns an empty result with `total: 0`.

**AP-H4 · headless · The palette cache**
Steps: call `getGroups` and `findAssets` back to back, then add an image block and call again inside 250 ms, then again after.
Expected: the second call inside the window reports the old palette, and the call after the window reports the new one. This pins the TTL the source documents.

**AP-H5 · headless · `autoPlaceBlockOnPage`**
Steps: with `Math.random` stubbed to 0, place blocks on a 1000 × 1000 and a 1000 × 2000 page.
Expected: the block is appended to the page, both position modes are `Absolute`, x is 250, the block is selected and any previous selection is cleared. A third case asserts y is 500 on the 1000 × 2000 page and is an `it.fails`: the helper reads the page width twice, so it places at 250. Pins known issue 4.
Note: the undo step the helper records is asserted in the browser (AP-04), not here — the headless engine never ticks, so `canUndo()` stays false.

**AP-H6 · headless · Unsplash apply**
Steps: with `fetch` stubbed, apply a fixture photo through the source's `applyAsset`.
Expected: `defaultApplyAsset` receives `meta.uri` replaced by the tracked-download URL and `meta.previewUri` set from `thumbUri`, and a graphic with an image fill is created. A photo without `meta.uri` rejects with the kit's own message rather than calling the endpoint.

### 5.3 Component (jsdom, React Testing Library)

**AP-C1 · component · SegmentedControl**
Two options render their labels. Clicking the inactive one calls `onChange`; clicking the already active one does not. `label` renders only when non-empty, which is why the process navigation shows none. A disabled option is disabled.

**AP-C2 · component · IconButton**
The label span renders only when children are given. The active class is applied only when `isActive`. `iconColor` reaches the inline style. A remaining prop (`title`) reaches the button.
Note: `disabled` reaches the button too, but `IconButtonProps` extends `HTMLAttributes` rather than `ButtonHTMLAttributes`, so it does not type check — the kit passes it with a `@ts-expect-error`. New known issue 17.

**AP-C3 · component · BlockBar and BlockBarContext**
Selecting an item renders that item's component and only that one. Clicking the selected item again deselects. Children are cloned with `isActive` true while nothing is selected. `useBlockBar` outside the provider throws.

**AP-C4 · component · FontPreview**
Picks the normal/normal font, falls back to the first font. Emits an `@font-face` rule with the font's URI. Renders the typeface name when no text is given.

**AP-C5 · component · ColorPicker**
The trigger opens the panel and stops propagation. A preset click calls `onChange`. `onChangeDebounced` fires once, 500 ms after the last change. Closing on an outside click is not covered here; see known issue 5.

**AP-C6 · component · AddBlockBar**
Renders four entries labelled Text, Image, Shape and Sticker.
Note: the toggle half is dropped. Selecting an entry _does_ render its panel, and every panel calls `useEngine`, so the case cannot run without the provider. AP-C3 covers the selection behaviour on a provider-free `BlockBar`.

The cases below mount the kit's own provider stack — `EngineProvider`,
`SinglePageModeProvider`, `EditorProvider`, `SelectionProvider` — over a concrete
fake engine (`tests/component/support/`), the same nesting `App` uses. Nothing is
stubbed out of the tree, so the providers and hooks under test run unchanged.

**AP-C10 · component · the apparel shell**
`ApparelUI` loads `/kiosk.scene`, keeps the engine canvas in `#cesdk` throughout,
hides it until the scene is ready, and then shows the dock with Text, Image,
Shape and Sticker.

**AP-C11 · component · the edit and preview steps**
Edit leaves the page interactive, unclipped and dimmed outside; Preview zooms to
the backdrop graphic, clears the selection, clips the page and turns pointer
events off, and hides the bottom controls. A scene with no backdrop graphic fails
with `Backdrop image not found`.

**AP-C12 · component · the top bar**
Undo and redo stay disabled until the engine reports a history step, then undo
reaches `editor.undo`. Export writes `scene/dpi` 72, exports the scene as
`application/pdf`, restores 300 and clicks a download anchor.

**AP-C13 · component · the bottom controls follow the selection**
A text block shows the text bar, an image block the image bar, and a multi-block
selection keeps the add bar.

**AP-C20 · component · the add bar**
Adding text creates the block, sets its font, size, alignment and auto height,
sizes it to half the page and places it on the current page. Shape and sticker
apply from their own sources. The image bar lists uploads plus Unsplash, shows a
spinner while it is empty, applies the image clicked, and skips Unsplash when the
source is not registered.

**AP-C21 · component · the image adjustment bar**
Replace opens and closes. Crop enters and leaves crop mode through the engine.
The engine reporting crop mode opens the crop bar, whose Reset resets the crop of
every selected block. A placeholder opens Replace and disables Crop.
`ChangeImageFileSecondary` applies to the selected block.

**AP-C22 · component · leaving crop mode**
Done returns the editor to `Transform`.

**AP-C23 · component · the text adjustment bar**
Colour, alignment and font each reach the engine for the selected block, the
current alignment and the current font are marked active, and a block whose
typeface the engine refuses to name shows none active.

**AP-C24 · component · the shape and sticker adjustment bars**
The shape bar writes the colour and paints the current one on its icon. The
sticker bar deletes the selection, leaving crop mode first, and hides its Delete
button when the block may not be destroyed.

**AP-C25 · component · the colour picker inside the colour bar**
A hex typed into the picker reaches the engine; an incomplete one does not.

**AP-C30 · component · every context refuses to be used outside its provider**
`useEditor`, `useEngine`, `useSinglePageMode`, `useSelection` and `useBlockBar`.

**AP-C31 · component · refocusing the canvas**
A canvas resize, a visual-viewport resize and a scene-tree event all re-zoom to
the current page. Crop mode zooms to the selected block once refocus-in-crop is
on, and does nothing when that block is gone. Text mode scrolls to the cursor. A
scene with no page zooms nothing. The page change starts a fresh history.

**AP-C32 · component · the toolbar height**
The measured bar height plus the 12 px gap is added to the bottom padding.

**AP-C33 · component · closing the picker on an outside click**
A trusted click outside closes it, one inside does not, and an untrusted one is
ignored. The handler is captured from `document.addEventListener`, because jsdom
makes `isTrusted` non-configurable on a real event.

**AP-C34 · component · reading and writing a block property**
No block reads and writes nothing. A property the block does not carry, and a
setter the engine refuses, are both survived with a log. A `Destroyed` event does
not update the value.

**AP-C35 · component · the canvas element**
The wrapper takes the engine canvas back when it unmounts.

**AP-C36 · component · redo**
Redo reaches `editor.redo` once the engine allows it.

**AP-C40 · component · the engine provider**
An engine that arrives after the provider unmounts is disposed. A local build
points `baseURL` at the local asset host. `configure` runs before the children
render.

**AP-C41 · component · correcting the selection the engine reports**
An unchanged selection re-renders nothing. A destroyed block is dropped. A
leftover block is deselected when the engine ends up with nothing, and only the
newly selected block survives when the engine still holds another.

**AP-C42 · component · the single-page mode before it is switched on**
`refocus` does nothing while the mode is off, in either the page or the crop
path. Once the scene carries several pages, only the current one stays visible.

**AP-C43 · component · the standalone colour picker**
Without a child it renders its own trigger and label. The debounced follow-up
fires once after the delay, and the default no-op stands in when none is given.

**AP-C44 · component · the block bar with a plain child**
A text child passes through uncloned.

**AP-C45 · component · the font list scrolls the active font into view**

**AP-C46 · component · uploading an image**
A picked file is measured, added to the upload source and applied, and the bar
reloads. A picker that reports no files rejects with `No files selected`.

**AP-C47 · component · the canvas wrapper before the engine is ready**
An engine with no canvas element mounts nothing.

**AP-C48 · component · the toolbar height without a bar to measure**
An unattached ref keeps the assumed height; a bar that is gone measures nothing.

**AP-C49 · component · the font list without a regular weight**
Falls back to the first font the typeface ships.

**AP-C50 · component · an image the browser cannot decode**
The upload is dropped instead of adding a sizeless asset.

### 5.4 Unit (no browser, no engine)

**AP-U1 · unit · `hexToRgba`**
`#ffffff` → 1,1,1,1. `#00000080` → alpha 0.502. `#abc` expands to `#aabbcc`. A string of any other length throws with the kit's message. The one-character `#f` branch expands to six repeats.

**AP-U2 · unit · `rgbaToHex`**
Round-trips `hexToRgba` for the six palette colours and always emits the 9-character `#rrggbbaa` form.

**AP-U3 · unit · `isColorEqual`**
True inside the 0.001 default precision, false outside, and honours an explicit precision.

**AP-U4 · unit · Unsplash response mapping**
With `fetch` stubbed: a photo maps to an `AssetResult` with the photo id, `meta.uri` from `links.download_location`, `meta.thumbUri` from `urls.thumb`, `blockType` graphic, `kind` image, `fillType` image, the pixel size, credits from the user, and UTM `CE.SDK Demo` / `referral`. `description` falls back to `alt_description`, then to undefined. A response of type `error` rejects with the first message.

**AP-U5 · unit · Unsplash paging**
`page: 0` asks Unsplash for page 1, `page: 1` asks for page 2, `page: 3` asks for page 4 and reports no next page. `currentPage` and `nextPage` are both in CE.SDK's numbering. The unqueried listing pages the same way. Known issue 6 is **fixed**.

**AP-C4 · component · `LoadingSpinner` and `ImageBarButton`**
The spinner renders the element the image button falls back to. The button disables itself and shows the spinner while its click is in flight, and frees itself again when the click resolves.

**AP-U6 · unit · `pixelToCanvasUnit`**
Divides by the device pixel ratio and the zoom in a pixel scene, and scales a
millimetre and an inch scene by the scene dpi.

**AP-U7 · unit · `zoomToSelectedText`**
Does nothing while the cursor position is unknown or more than one block is
selected. Moves the camera when the cursor sits below the visible area or above
the top padding, and leaves it alone while the cursor is already in view.

**AP-U8 · unit · `getImageSize`**
Resolves with the natural size once the image loads, rejects when it cannot.

**AP-U9 · unit · which blocks contribute colours**
A block with no fill support, a switched-off fill, one the engine refuses to
answer about, and one whose fill is not an image are all skipped. A block whose
colours cannot be extracted is warned about and left out.

**AP-U10 · unit · how a repeated image is recognised**
Two blocks sharing an image file URI, a source set or an external reference
collapse into one group. A block with no identity at all is kept, and empty
values do not count as one.

**AP-U11 · unit · the group names**
The block name wins, then its `fallback-name` metadata, then `Image N`. Repeated
names are numbered.

**AP-U12 · unit · querying the palette**
Colours are deduped per block. A single group, a list of groups and an empty list
each filter as documented. A hex with and without its hash, and a group name,
each match; a word that matches nothing returns nothing; punctuation alone is not
a query.

**AP-U13 · unit · what Unsplash cannot answer**
A failing listing rejects with its first error. An exhausted listing reports no
next page. The source offers no groups and refuses to add or remove an asset.
Tags are mapped and absent credits are omitted.

**AP-U14 · unit · the tracked download**
The tracked URL is applied to a new block and to an existing one. Every error the
endpoint returns is reported. An asset with no URI is refused before the endpoint
is called.

**AP-U15 · unit · the entry point**
Mounts the app into `#root`.

**AP-U16 · unit · the entry point without its container**
Fails loudly instead of mounting nothing.

## 6. Entry and exit criteria

Entry: the engine and its asset library built (`nx run @cesdk/engine:build:assets`, otherwise every asset source 404s against the local CDN); test license available; the shared harness's component wiring and its `{ kind, engine, cesdk }` editor handle in place.

Exit: **met.** `npm run ci` exits 0. No test contacts Unsplash or any host other than the kit's dev server and the local asset daemon. The published kit contains no test files.
Open: browser coverage is not merged into the kit's number — `merge-coverage.mjs` cannot map a `…svg?import` module, so `test:all` runs the browser step with `KIT_TEST_COVERAGE=0`. Recorded for the harness owner. **Trap while that stands:** a bare `npm run test:e2e` or `npx playwright test` still writes dumps to `apps/cesdk_web_examples/.test-output/<kit>/coverage/playwright/`, nothing clears them, and the next `npm run ci` then dies in the merge step. Delete that directory after running the browser tests by hand.

## 7. Known issues found while writing this plan

Confirm each with a test before fixing.

1. Confirmed. Undo, redo, every colour swatch and every colour-picker preset are icon-only or colour-only buttons with no text, `aria-label` or SVG title. The dock, the step buttons, Export, Delete, Replace, Crop, the font buttons (`Ag <name>`), the shape and sticker thumbnails (`Add shape 0`) and the image thumbnails (`sample asset`) all do have names, so only undo, redo and the swatches need positional locators. Active state is a CSS-module class, never `aria-pressed` or `aria-current`.
2. **Corrected by AP-04.** Adding a text block _does_ add an undo step: `autoPlaceBlockOnPage` ends with `addUndoStep`. Deleting a block and every property setter add one as well.
3. `ExportButton` has no `try`/`finally`. A failed export leaves the button disabled forever, `scene/dpi` at 72 and every page visible. It also restores dpi to a hardcoded 300 instead of the value it read, never revokes the object URL, and defaults `fileName` to `my-postcard` — a leftover from the postcard kit. The missing `.pdf` extension is **not** a defect: Chrome derives it from the blob type (AP-20).
4. **Fixed in 6b.** Confirmed by the `it.fails` in AP-H5. `autoPlaceBlockOnPage` computes `pageHeight` with `getWidth(page)`, so the vertical placement is wrong on any non-square page. The same line exists in the mobile and photobook kits; postcard's copy already uses `getHeight`.
5. `UseOnClickOutside` requires `e.isTrusted`, which is false for `fireEvent`, so the close-on-outside path cannot be covered in jsdom. Its `useEffect` also has no dependency array, so the listener is removed and re-added on every render.
6. **Fixed.** `findAssets` now maps CE.SDK page N to Unsplash page N+1 and reports `currentPage`/`nextPage` in CE.SDK's numbering, matching `starterkit-unsplash-asset-source`. Proven by AP-U5. The postcard copy carries the identical fix; photobook's still needs it.
7. **Fixed.** The kit now publishes `window.cesdk` — the bare `CreativeEngine` — from inside a `//START_HIDDEN_BLOCK`, after `configure` has awaited, and the harness handle reports `kind: 'engine'`. The `VITE_ADD_CESDK_GLOBALS` gate is gone.
8. `UseSelection` deselects `currentSelection[0]` on every iteration instead of the block it is looking at, and runs a 200 ms timer plus engine mutations inside a `setState` updater, which React 18 StrictMode invokes twice. Nothing cancels the timer on unmount.
9. `ImageAdjustmentBar` compares its adjustment id against `undefined` while the state is initialised to `null`, so Replace and Crop are never highlighted. The `replace` state is set when the placeholder overlay appears and never cleared when it goes.
10. **Fixed**, and the cause was elsewhere than the plan said: `UseSelection`'s 200 ms correction re-selected a block the undo had destroyed. Pinned by AP-21.
11. **Partly fixed.** The two dead `Array.isArray` `else` branches in `useSelectedProperty` are deleted; both call sites already spread the rest parameter, so behaviour is unchanged. Still open: `useImageUpload` does not await its `Promise.allSettled` and drops the rejections, and `uploadFile` appends a file input to `document.body` at module load.
12. **Fixed** by the static-gates agent: `npm run check:all` exits 0 today, verified before any test was written.
13. Not a problem under Vitest: `import.meta.env` exists there, and the headless tests import the barrel (`AP-H1`) as well as the modules directly.
14. **Partly fixed.** The kit now has an `.env.example` with an empty `VITE_CESDK_LICENSE` and the optional `VITE_UNSPLASH_API_URL`. Still open: the README never mentions a license, and `starterkit-apparel-ui-hidden-blocks.md` sits in the kit root.
15. The README's project tree lists four hooks under `src/imgly/` that live in `src/app/hooks/`, uses the old PascalCase module names, omits `image-colors-source.ts` and `resolveAssetPath.ts`, and advertises a product catalogue UI that does not exist.
16. `ColorPicker` carries Tailwind-style class names with no Tailwind dependency and no matching CSS, against a README that promises CSS modules and no external dependencies.
17. New. `IconButtonProps` extends `React.HTMLAttributes<HTMLButtonElement>`, which has no `disabled`, so `ImageAdjustmentBar` passes it behind a `@ts-expect-error` whose comment describes an unrelated cause. The fix is `ButtonHTMLAttributes`.
18. New. The `Delete` button in `StickerAdjustmentBar` is the only control in that bar; a sticker has no colour or replace affordance. Noted so nobody expects one.

### Coverage residue

Everything of `src/**` the merged report still misses. Every entry is
unreachable by construction; nothing here is a missing test.

1. **`src/app/hooks/UseSelectedProperty.ts:30`** — the `if (!block) return` inside
   the setter. `useProperty` hands out a no-op setter when there is no block
   (line 71), so the only caller that ever holds the real setter has already
   proved `block` is truthy.
2. **`src/app/ui/ColorSelect/ColorSelect.tsx:53, 57`** — the `#NaNNaNNaN` guard and
   the `catch` around `hexToRgba`. `react-colorful` calls `onChange` only with a
   hex it has already validated, and the `#NaNNaNNaN` sentinel it emits from a
   zero-sized surface needs a pointer drag its jsdom build never dispatches.
3. **`src/imgly/image-colors-source.ts:91-93`** — the `catch` around `getFill` in
   `readImageIdentity`. It runs only after `hasImageFill` has already called
   `getFill` on the same block in the same pass.
4. **`src/imgly/image-colors-source.ts:256-267, 304-322`** — the `CMYK`,
   `SpotColor` and `default` arms of `dedupeKey` and `getSearchTokens`.
   `collectBlockPalette` destructures `{ r, g, b }` from every dominant colour and
   always builds `{ colorSpace: 'sRGB', … }`, so this source cannot emit another
   colour space. The `default` arms are `never` guards that make the compiler
   enforce a future one.
5. **`src/imgly/unsplash-source.ts:92-94, 116-118`** — the `else` after each
   `response.type` check. `unsplash-js` types the response as the union
   `'success' | 'error'` and both arms are covered, so the fallthrough cannot be
   produced.

## 8. Open questions

1. **Resolved.** The 31 "Apparel Editor UI" cases belong to `starterkit-t-shirt-designer`; this plan drops them and the t-shirt plan keeps them. Re-parenting the Qase suite is still Elia's/QA's to do.
2. **Resolved.** `defineKitVitestConfig` takes the kit's Vite plugins, includes `tests/component/**`, and hands back unscoped CSS-module class names. RTL comes from `@imgly/kit-test-harness/component`.
3. Issue 1: add accessible names to the icon-only controls in S4, or keep the tests on CSS-module selectors. Recommended: add `aria-label` to undo, redo and the swatches; it is a handful of lines and it is what the fleet's browser tests need everywhere.
4. **Resolved: fixed**, matching `starterkit-unsplash-asset-source`, and asserted in AP-U5.
5. New: browser coverage is disabled in `test:all` until `merge-coverage.mjs` can map a `?import` module. See the exit criteria.

## 9. Estimate

Measured: 22 browser tests in 1.0-1.3 min on one worker; 10 headless in about 5 s; 20 component and 17 unit under 1 s. `npm run ci` end to end is about 2 minutes.

## 10. Boundary review

Rule used: the code that makes a decision owns the test for it. This kit has no CE.SDK editor UI — it drives `@cesdk/engine` directly — so the boundary is only between the kit and the engine. The kit decides which asset sources exist, that only emoticon stickers survive, the six-colour palette, the text defaults, where a new block lands, what Preview does to the scene, the Unsplash mapping and paging, the image-colours source, and the export settings. The engine decides what any of those values produce.

Core behaviour this plan leans on, and where it is covered today:

| Behaviour                                                                                                                                                  | Owner  | Covered by                                                                                                                                          |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| A custom asset source registered with `addSource` is queried through `findAssets`, and `addLocalSource` plus `addAssetToSource` behave as an upload source | engine | `engine/lib/test/api/AssetAPITest.cpp` `AddCustomAssetSource`, `FindAssetSourceAssets`, `AddAndFindLocalAssetSource`, `AddAndRemoveAssetFromSource` |
| `removeAssetFromSource` removes exactly one asset                                                                                                          | engine | `AssetAPITest.cpp` `AddAndRemoveAssetFromSource`, `RemoveAssetFromSource_NonExistent`                                                               |
| `defaultApplyAsset` and `defaultApplyAssetToBlock` create or update a graphic with an image fill                                                           | engine | `AssetAPITest.cpp` `DefaultApplyAsset`, `DefaultApplyAssetToBlock`; `engine/lib/test/api/UBQApplyAssetCreationDeepAPITest.cpp`                      |
| `getDominantColors` returns the requested number of sRGB colours and honours `ignoreWhite`                                                                 | engine | `engine/lib/test/api/DominantColorsAPITest.cpp`; `bindings/wasm/js_node/src/__tests__/DominantColors.test.ts`                                       |
| `setFont` with a typeface applies the face, and emoji fall back to the emoji font                                                                          | engine | `engine/lib/test/api/BundledTypefaceAPITest.cpp`; `bindings/wasm/js_node/src/__tests__/systemFontFallback.test.ts`                                  |
| `text/text`, `text/fontSize`, `text/horizontalAlignment`, `Auto` height mode                                                                               | engine | `engine/lib/test/api/BlockTextTest.cpp`, `TextDeepAPITest.cpp`, `BlockLayoutTest.cpp`                                                               |
| `fill/solid/color` set and read back                                                                                                                       | engine | `engine/lib/test/api/BlockPropertiesTest.cpp`, `ColorAccessorAPITest.cpp`                                                                           |
| Placeholder overlay and button state on an image block                                                                                                     | engine | `engine/lib/test/api/PlaceholderAPITest.cpp`                                                                                                        |
| `lifecycle/destroy` as a global scope and per block, and `isAllowedByScope`                                                                                | engine | `engine/lib/test/api/ScopesAPITest.cpp` `SetGlobalScope_Defer`, `SetAndGetScopeEnabled`, `IsAllowedByScope`                                         |
| Undo, redo, `canUndo`, `canRedo`, `addUndoStep`                                                                                                            | engine | `engine/lib/test/api/HistoryAPITest.cpp`                                                                                                            |
| `zoomToBlock` with padding, `setVisible`, `setClipped`                                                                                                     | engine | `engine/lib/test/api/SceneAPITest.cpp`, `EditorAPITest.cpp`, `BlockAppearanceTest.cpp`                                                              |
| PDF export of a scene with one page                                                                                                                        | engine | `engine/lib/test/api/ExportAPITest.cpp` `ExportToBuffer_PDF`, `ExportToBuffer_PDF_SinglePageFromScene`                                              |
| `getTypeface` on a text block with no typeface returns an error rather than a value                                                                        | engine | `engine/lib/test/api/BlockTextTest.cpp` (the `setTypeface / getTypeface / getTypefaces` block)                                                      |

Core coverage gaps found (candidates to add in the core suites, not in this kit):

1. Engine: `scene/dpi` and the size of a PDF exported from a Pixel-unit scene. The kit drops the scene from 300 to 72 dpi for the export and back afterwards, and three kits in this batch do the same. `ExportAPITest.cpp` has `ExportToBuffer_PDF_SourceSetHonorsSceneDpi`, which sweeps the dpi of a millimeter scene to pin which source-set entry is chosen; nothing pins the page-size relationship the kits rely on. Suggested home: `ExportAPITest.cpp`, next to that case.

Until gap 1 is closed, AP-20 keeps its decoded-PDF page-count assertion as the end-to-end proof.
