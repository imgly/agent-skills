# Test plan: starterkit-photobook-ui

Version 6, 7 Sep 2026. Status: implemented and green. 26 browser tests, 10 headless, 133 component and 91 unit; `npm run ci` exits 0, no expected failures. Merged coverage is **lines 99.33 %, branches 98.9 %, functions 100 %** (Vitest 99.32 / 98.89 / 100), which clears the gate both threshold files hold. Section 11 lists every line and branch that is still uncovered and why.

**The kit now names its controls.** The page previews are `Page 1` to `Page N`, the rail's order and trash buttons are `Move page up`, `Move page down` and `Delete page`, the top bar's history buttons are `Undo` and `Redo`, and each colour swatch carries its own `#rrggbbaa` value. Nothing changed visually. PB-13, PB-16, PB-17, PB-18, PB-27 and PB-28 are therefore implemented, and PB-A11Y asserts the names instead of pinning their absence. The ten time-boxed cases — PB-02 to PB-06, PB-09, PB-10, PB-14, PB-20 and PB-30 — are implemented too. The layout transfer, the content-JSON loading and the failure paths still carry their weight headlessly (PB-H1 to PB-H9).

**Coverage pass (version 4).** The kit's own modules are now covered from Vitest rather than only through the browser, because the merge script takes function and branch coverage from the Vitest report alone — a browser test cannot move either metric. The three `src/imgly` modules that the browser exercised but nothing asserted (`image-colors-source.ts`, `unsplash-source.ts`, `engine-utils.ts`) have unit suites; every React screen has a component suite that mounts the kit's real providers over a fake engine (`tests/component/support/`). Three source changes came out of it, all listed in section 7.

Still **not** implemented: **PB-08, PB-21, PB-22, PB-25, PB-23 and PB-24** need canvas gestures (drag, rotate, duplicate, typing in text mode), and the scope assertions they were going to make are engine state rather than kit decisions.

## 1. Purpose

Verify that the Photobook UI starter kit works as shipped: the photobook scene loads one spread at a time, the page rail adds, reorders and deletes pages, applying a layout rearranges the page while carrying its photos and text across, themes and background colours restyle it, and Export produces a PDF of the whole book.

## 2. Scope

In scope

- Start-up: the asset sources the kit registers, the two content catalogues it ships (`photobook-layouts.ts`, `photobook-stickers.ts`), and the placeholder pass it runs after the scene loads
- `createApplyLayoutAsset` — the layout transfer, which is the kit's central decision
- `loadAssetSourceFromContentJSON` — the `{{base_url}}` substitution the two catalogues depend on
- The page rail: select, add, move up, move down, delete, and the per-page previews
- The theme bar, the background colour bar, and the text, image and sticker adjustment bars
- Crop (Done and Reset), delete, undo, redo, upload, replace
- Export
- The kit's own code under `src/imgly/` and `src/app/`

Out of scope

- What the engine does with a colour, a font, a crop or an export option, and what `loadFromString` produces from a scene string. Engine behaviour; see section 10.
- The demo site around the kit (cards, tags, links, platform toggles). Covered by the `cesdk_web_demos` suite. Qase 174, 175, 176, 177, 178, 195, 315.

This kit has no `mobile-app` Qase cases.

## 3. Test environment

- Browser: Chrome, headless, 1400 × 900
- Engine: `@cesdk/engine` built from this repo, served locally. Requests to `cdn.img.ly` fail the test.
- License: the shared test license (valid on hostname `localhost` only)
- Data: the kit ships no `public/` directory. `photobook.scene`, the four layout templates and thumbnails, the six stickers, the four theme backgrounds and the fonts all come from `DEMO_ASSETS_BASE_URL`, whose in-repo copy is `packages/cesdk-web-examples-data/data/starterkit-photobook-ui/`. Browser cases point `VITE_DEMO_ASSETS_BASE_URL` there so the CDN guard stays meaningful.
- **No live Unsplash traffic.** The image bar is uploads plus an Unsplash query fixed to `Disneyland`, and applying a photo calls the tracked-download endpoint. Every browser case mocks `https://api.img.ly/unsplashProxy/**` from a fixture.
- Headless: `@cesdk/node` through the shared harness engine helper. Node, no DOM. `createApplyLayoutAsset` fetches the layout scene, so headless cases stub `globalThis.fetch` to read the template file from the in-repo demo data.
- Component: Vitest with `// @vitest-environment jsdom`, React Testing Library, the kit's own Vite plugins.
- Requests to `cdn.img.ly` fail the test, with one allowlist entry: `photobook.scene` and the theme typefaces store absolute `cdn.img.ly/assets/v3/ly.img.typeface/fonts/` URIs for the four faces the book uses. The scene's photos come from `firebasestorage` and `images.unsplash.com`, which the guard does not cover.
- Downloads: captured by Playwright and checked by file type and PDF page count

## 4. Approach

| Kind      | Tool                          | What it checks                                                      | Run                 |
| --------- | ----------------------------- | ------------------------------------------------------------------- | ------------------- |
| Static    | tsc, eslint, convention check | Types, deprecated APIs, kit folder shape                            | `npm run check:all` |
| Unit      | Vitest                        | The two catalogues, colour helpers, deep equality, Unsplash mapping | `npm run test:unit` |
| Headless  | Vitest + `@cesdk/node`        | Layout transfer, content-JSON loading, the image-colours source     | `npm run test:unit` |
| Component | Vitest + jsdom + RTL          | The kit's prop-only components                                      | `npm run test:unit` |
| Browser   | Playwright                    | The test cases in section 5.1                                       | `npm run test:e2e`  |

All five run in the kit's `ci` script. The layout transfer is the highest-value target in the kit and is engine-only, so it is covered headlessly and the browser keeps one proof.

## 5. Test cases

Format: ID, level, Qase id, title. Then steps and expected result.
Common precondition for all browser cases: the Unsplash proxy route is mocked, the kit is open, and the scene has finished loading.

### 5.1 Browser

**PB-01 · browser · Editor loads with the photobook** _(implemented)_
Steps: open the kit.
Expected: the first page is on the canvas and every other page is hidden. The page rail lists one preview per page under the heading "Pages", with an Add Page button. The dock offers Theme, Layout, Color and Sticker. No console errors. No engine asset from `cdn.img.ly`.

**PB-02 · browser · Qase 204 · Placeholders on the first page and the rest** _(implemented)_
Steps: read the placeholder state of every image block after load.
Expected: an image whose placeholder-controls overlay is off has had its placeholder disabled by the kit's start-up pass, so exactly the intended images still show the placeholder UI. On the first page one image is a placeholder; on later pages all of them are.
Note from the run: on the first page exactly one of the six images is a placeholder, and the two flags agree for every image once the pass has run.

**PB-03 · browser · Qase 179 · Replace an image with a pre-loaded one** _(implemented)_
Steps: select an image, click Replace, click a thumbnail.
Expected: `applyToBlock` is called with the selected block, the fill URI changes and no new block is created. The list is uploads plus the Unsplash `Disneyland` fixture.

**PB-04 · browser · Qase 206 · Replace an image with an uploaded one** _(implemented)_
Steps: as PB-03 with an uploaded PNG.
Expected: the fill URI is the uploaded blob URL.

**PB-05 · browser · Qase 348 · Replacing a sample image clears the placeholder UI** _(implemented)_
Steps: select a placeholder image, replace it.
Expected: the placeholder overlay and button are gone and Crop becomes enabled.
Note from the run: only `placeholder/enabled` is cleared. The engine's controls-overlay flag stays on, and Crop is gated on `placeholder/enabled`, so the observable change is the enabled Crop button.

**PB-06 · browser · Qase 216 · The same image twice on one page** _(implemented)_
Steps: replace two images on the same page with the same asset.
Expected: both fills carry that URI, both blocks stay distinct, and the image-colours source reports one group for the two of them.
Note from the run: only a placeholder opens the Replace bar by itself, so the second block is reached through the Replace button. The image-colours grouping is asserted headlessly in PB-H10.

**PB-07 · browser · Qase 180 · Images can only be replaced, never added** _(implemented)_
Steps: read the dock.
Expected: the dock offers Theme, Layout, Color and Sticker only. There is no add-image entry, and there is no add-text or add-shape entry either. This is a UI omission, not an engine scope; see known issue 1.

**PB-08 · browser · Qase 196 · An image cannot be moved** _(not implemented, see section 1)_
Steps: select an image and drag it.
Expected: the block's position does not change. Assert `block.isScopeEnabled(block, 'layer/move')` on the loaded scene, so the test states which mechanism it is testing. See known issue 1.

**PB-09 · browser · Qase 189 · Crop and confirm** _(implemented)_
Steps: select an image, click Crop, change the crop, click Done.
Expected: edit mode returns to `Transform` and the crop values persist.

**PB-10 · browser · Qase 205 · Crop and reset** _(implemented)_
Steps: as PB-09 but click Reset.
Expected: `resetCrop` runs for every selected block and the crop returns to its default. No undo step is added, unlike every other mutation in the kit; see known issue 2.
Note from the run: Crop is offered only after the block stops being a placeholder, so both crop cases replace the image first.

**PB-11 · browser · Qase 191 · Apply a layout** _(implemented)_
Steps: open Layout, click the second thumbnail.
Expected: the page id and the page count are unchanged, the page has children again, every image on it carries a URI that was on the page before, and one undo step is added. Ordering, placeholders and crop reset are asserted headlessly in PB-H2 and PB-H4.
Note from the run: block ids are reused after a destroy, so "no child survives by id" is not a usable assertion.

**PB-12 · browser · Qase 185 · Change the theme** _(implemented)_
Steps: open Theme, click each of the four themes.
Expected: the four themes are offered as `<name> Theme`; picking castle sets the `BG Dark` and `BG Light` blocks to `themes/castle-bg-dark.svg` and `themes/castle-bg-light.svg`, and every text block on the page ends up on the theme's typeface. One undo step.
Note from the run: the page itself has **no fill**, so the "page `fill/solid/color` becomes the theme's background" expectation is wrong — reading it throws `BLOCK.FILL_MISSING`.

**PB-13 · browser · Qase 210 · Background colour from the palette** _(implemented)_
Steps: open Color, click a swatch.
Expected: the page's `fill/solid/color` follows. The palette is the six colours the kit hardcodes for the example photobook.

**PB-14 · browser · Qase 211 · Background colour from the picker** _(implemented)_
Steps: open Color, use the picker, enter a hex value.
Expected: the colour follows, and exactly one undo step is added when the panel closes — the kit suppresses per-change undo steps and emits one on unmount.
Note from the run: the hex field of the picker is the only textbox in the bar, and the undo step appears only after the bar unmounts — PB-30 closes it before undoing.

**PB-15 · browser · Qase 212 · Add a page** _(implemented)_
Steps: click Add Page.
Expected: the kit fetches `template-0.scene`, loads it with `loadFromString`, appends the page to the pages' parent, grants it `lifecycle/destroy`, makes it the current page and re-zooms. The rail gains one preview.

**PB-16 · browser · Qase 213 · Delete a page** _(implemented)_
Steps: with a page added, click the trash button.
Expected: the kit moves to the previous page first, then destroys the page. The button is only shown when more than one page exists and the current page allows `lifecycle/destroy`, so it is present on the added page and absent on a scene page the file does not allow deleting.
Note from the run: the scene's own pages allow `lifecycle/destroy` too, so the button is shown from the start; only the page count gates it.

**PB-17 · browser · Qase 214 · Move a page up** _(implemented)_
Steps: select the second page, click the up button.
Expected: `insertChild` places it at index 0 and the rail order follows. On the first page the button is a silent no-op and is not disabled; see known issue 3.

**PB-18 · browser · Qase 215 · Move a page down** _(implemented)_
Steps: select the first page, click the down button.
Expected: it moves to index 1. On the last page the button is a silent no-op.

**PB-19 · browser · Qase 190 · Add a sticker** _(implemented)_
Steps: open Sticker, click one.
Expected: a graphic with that sticker's image fill is added and selected. The six entries come from the kit's own `PHOTOBOOK_STICKERS` catalogue, whose `{{base_url}}` has been substituted with the demo-assets base.

**PB-20 · browser · Qase 203 · Delete a sticker** _(implemented)_
Steps: select the sticker, click Delete.
Expected: the block is destroyed and one undo step is added.

**PB-21 · browser · Qase 209 · Move and rotate a sticker** _(not implemented, see section 1)_
Steps: drag the sticker, then rotate it with the handle.
Expected: its position and rotation change. Assert `layer/move` is enabled on it, so the case says which mechanism it relies on.

**PB-22 · browser · Qase 200 · A sticker cannot be duplicated** _(not implemented, see section 1)_
Steps: select the sticker and try to duplicate it (context menu, keyboard).
Expected: no second block appears. Assert `block.isScopeEnabled(sticker, 'lifecycle/duplicate')` on the loaded scene; the kit itself has no duplicate affordance and sets no such scope. See known issue 1.

**PB-23 · browser · Qase 183 · Edit a text block** _(not implemented, see section 1)_
Steps: double-click a text block, type, leave text mode.
Expected: `text/text` holds the typed value and the canvas re-zooms to the page when text mode ends.

**PB-24 · browser · Qase 184 · Emoji in text** _(not implemented, see section 1)_
Steps: type an emoji.
Expected: it is stored in `text/text` and rendered from the emoji fallback font.

**PB-25 · browser · Qase 207 · A text block cannot be moved** _(not implemented, see section 1)_
Steps: select a text block and drag it.
Expected: the position does not change. Assert `layer/move` on that block.

**PB-26 · browser · Qase 182 · Align a text block** _(implemented)_
Steps: select the text block, open Align, click Left then Right.
Expected: `text/horizontalAlignment` is `Left`, then `Right`. The bar offers exactly Left, Center and Right.

**PB-27 · browser · Qase 198 · Text colour from the palette** _(implemented)_
Steps: select the text block, open Color, click a swatch.
Expected: `fill/solid/color` follows, one undo step.

**PB-28 · browser · Qase 208 · Text colour from the picker** _(implemented)_
Steps: as PB-27 through the picker. A malformed hex is ignored rather than written.

**PB-29 · browser · Qase 201 · Change the text font** _(implemented)_
Steps: select the text block, open Font, pick Caveat.
Expected: `text/fontFileUri` changes and ends on a Caveat face. The picker offers exactly Aleo, Caveat, Coiny, Elsie Swash Caps, Nunito, Source Serif Pro and **TrashHand** — which is why the savanna theme's `Trash Hand` can never match it (known issue 17).

**PB-30 · browser · Undo and redo** _(implemented)_
Steps: change the background colour, click undo, then redo.
Expected: the colour reverts and returns. Switching pages in between clears the history; see known issue 4.
Note from the run: the background bar has to be closed first, because it emits its single undo step on unmount.

**PB-31 · browser · Qase 193 · Export PDF** _(implemented)_
Steps: click Export.
Expected: the kit makes every page visible, sets `scene/dpi` to 72, exports the scene as `application/pdf`, then restores dpi and per-page visibility. One PDF downloads with as many pages as the book.
Notes from the run: the page rail also calls `engine.block.export` once per page for its JPEG thumbnails, so the case filters the recorded calls by mime type. Visibility **is** restored to one page, and the hardcoded 300 dpi the kit writes back happens to be the scene's own value, so that half of known issue 5 is not observable here.

### 5.2 Headless (no browser, real engine)

Subject: `src/imgly/apply-layout.ts`, `src/imgly/loadAssetSourceFromContentJSON.ts` and `src/imgly/image-colors-source.ts` against a `@cesdk/node` engine holding `photobook.scene` from the in-repo demo data, with `fetch` stubbed to read the template files from the same directory.

**PB-H1 · headless · A layout replaces the page content**
Apply `template-1.scene` to a page. Expected: the page's children are the layout's children, the page id is unchanged, and neither the duplicated old page nor the loaded layout page survives. `lifecycle/destroy` is back to the value it had before the call.

**PB-H2 · headless · Photos and text are carried across**
A page with two images and one text block, applied onto a layout with two image frames and one text frame. Expected: each target image gets the source `fill/image/imageFileURI` and source set in visual order, the target text gets the source string, colour and font, placeholder behaviour is carried across, and every transferred image has its crop reset.

**PB-H3 · headless · Fewer or more frames than sources**
Apply a three-frame layout onto a two-image page, then a one-frame layout onto a three-image page. Expected: the transfer stops at the shorter list; no frame is left with a broken fill and no source is applied twice.

**PB-H4 · headless · Visual ordering**
Build a page whose three photos sit out of DOM order, apply a layout, and read the target frames back in visual order. Expected: top-left, then top-right, then bottom. Verified by mutation — reversing the expected order fails the case.

**PB-H5 · headless · A failing layout fetch leaves the scene destroyable**
Stub `fetch` to reject, then stub it to return a string that is not a scene. Expected: the global `lifecycle/destroy` scope is back to what it was, and no duplicated page is left behind. Known issue 6 is **fixed**, so both cases pass.

**PB-H6 · headless · A text block the engine cannot resolve a typeface for**
Apply a layout while `engine.block.getTypeface` fails for the source text block. Expected: the target keeps its own font and the transfer continues, which is the error the kit catches deliberately. The engine answers with its default typeface for every text block, so a bare text block no longer reaches that guard and the lookup has to be made to fail.

**PB-H7 · headless · `loadAssetSourceFromContentJSON` substitutes the base URL**
Load `PHOTOBOOK_STICKERS` with a base URL. Expected: a local source with the catalogue's id, six assets, and every `meta.uri` and `meta.thumbUri` resolved against the base. `payload.sourceSet` URIs are substituted too.

**PB-H8 · headless · Loading the same catalogue twice**
Call it again with a different base URL. Expected: the second call produces the **second** base URL, and the shared catalogue constant still carries its `{{base_url}}` placeholder. Known issue 7 is **fixed**.

**PB-H9 · headless · The layouts source applies through the kit's handler**
Register `PHOTOBOOK_LAYOUTS` with `createApplyLayoutAsset` as its apply function and apply one asset through `engine.asset.apply`. Expected: the page is rearranged as in PB-H1, and the source reports four assets with the labels Layout 1 to Layout 4.

**PB-H10 · headless · The image-colours source**
Groups per image block, up to five deduped sRGB colours each, group and query filters, and the 250 ms palette cache. Two blocks sharing an image collapse into one group.

**PB-H11 · headless · Unsplash apply**
With `fetch` stubbed, apply a fixture photo through the source's `applyAsset`. Expected: `defaultApplyAsset` receives `meta.uri` replaced by the tracked-download URL and `meta.previewUri` from `thumbUri`. A photo without `meta.uri` rejects with the kit's own message.

### 5.3 Component (jsdom, React Testing Library)

Every case mounts the kit's own providers — `EngineProvider`, `SinglePageModeProvider`, `PagePreviewProvider`, `EditorProvider`, `SelectionProvider` — over a fake `CreativeEngine` (`tests/component/support/fake-engine.ts`), through `renderWithProviders` (`tests/component/support/render.tsx`). `@cesdk/engine` is mocked so the real `EngineProvider` stays in the tree. The harness's recording proxy is not usable here: the kit does arithmetic on what the getters return.

**PB-C1 to PB-C6 · the prop-only components** — unchanged from version 3.

**PB-C10 to PB-C15 · the photobook shell**
The scene loads from `DEMO_ASSETS_BASE_URL`, the canvas node stays mounted and only its visibility flips, the page rail lists one button per page, switching pages hides the other page and starts a fresh history, Add Page loads `template-0.scene` and grants it `lifecycle/destroy`, move up and down clamp at the ends, delete falls back to the neighbour and hides itself when the page may not be destroyed, undo and redo mirror the engine, Export writes the whole scene as a PDF at 72 dpi and restores 300, and each page preview is a half-quality JPEG that is re-rendered when the history changes.

**PB-C20 to PB-C27 · the add bar**
Four buttons — Theme, Layout, Color, Sticker — each opening and closing its own secondary bar, with the colour button painted from the current page background. The theme bar applies the background colour, the typeface and both artwork layers, and leaves the fonts alone when the typeface is not installed. The layout bar applies through `ly.img.layouts`. The colour bar offers the six template colours plus the picker, writes without its own undo step and emits one when it closes, marks the matching swatch, and ignores a hex the picker cannot parse.

**PB-C30 to PB-C34 · the block bar**
Text, Image, Shape and Sticker. Text lists only the seven curated typefaces and creates a centred, half-page-wide block; Image shows the uploads, queries Unsplash only when that source is registered, and disables a thumbnail while its asset is applied; upload registers the file with the upload source and reports a file the browser cannot decode; Shape and Sticker each query their own source.

**PB-C40 to PB-C44 · the adjustment bars**
The selection decides the bar: text, image, shape, sticker, or the add bar for none and for several. Colour, font and alignment write to the selected block; replace applies to the block; crop enters and leaves; reset resets every selected image; a placeholder opens the replace bar by itself and blocks cropping; delete leaves crop mode, destroys the selection and hides itself when the scope forbids it.

**PB-C50 to PB-C52 · the entry point**
`injectFonts` declares the four IBM Plex Sans weights once, the entry point mounts into `#root` and fails loudly without it, and `App` renders the whole stack while merging the caller's feature flags over `preventScrolling`.

**PB-C60 to PB-C68 · the contexts and hooks**
Every `use*` refuses to run outside its provider. Refocus zooms to the page on a canvas resize and on a visual-viewport resize, to the selected block in crop mode once that is enabled, and to the text cursor in text mode. The toolbar height feeds the bottom padding. The debounced picker callback fires once. The outside-click hook ignores a scripted click. `useProperty` reads nothing without a block, survives a property the block does not carry and a setter the engine refuses, and ignores an event that destroys the block.

**PB-C77 · component · The demo lifecycle beacon**
The provider stack reports `created` once the engine exists and `ready` once the scene is up. The scene effect settles twice and the beacon keeps only the first mark per phase, so the case compares the distinct phases in order.

**PB-C76 · component · The colour the picker reports**
`ColorSelect` over a stand-in picker: a hex the kit can parse reaches `onClick` as an RGBA colour, and one it cannot is dropped. The bundled picker emits only three- and six-digit hex, both of which parse, so the guard needs a stand-in to be reached at all.

**PB-C70 to PB-C87 · the defensive paths**
The engine provider takes the local asset base URL when the kit runs against a local build and disposes an engine whose provider unmounted first. The picker renders its own trigger, label and presets. The preview loop releases a deleted page's object URL, rethrows an export failure for a page that is still there and swallows one for a page that has gone. The selection correction re-selects, deselects and narrows to one block. The guards that skip a missing canvas element, a bar with no element, a destroyed page and an empty selection are all exercised.

### 5.4 Unit (no browser, no engine)

**PB-U1 to PB-U4** — the two catalogues, the colour helpers and `isEqual`. Unchanged from version 3.

**PB-U5** — dropped, as in version 3.

**PB-U10 and PB-U11 · the image-colours source**
`createImageColorsSource` against a fake engine: one group per image block, named by the block name, its metadata fallback or `Image N`, disambiguated when two blocks share a name; a duplicate image dropped whichever property identifies it; a block with no image fill skipped; a colour the same image reports twice dropped at three decimals; a decode failure warned about and skipped. Filtering by group, by hex with and without the hash, and by group name requiring every word. The 250 ms palette cache collapses the `getGroups` and `findAssets` pair into one scene traversal and expires.

**PB-U20 · the image-colours source keeps a block whose fill it can no longer read**
`readImageIdentity` reads the fill a second time, after `hasImageFill` has already read it. A fill that goes away between the two reads leaves the block without an identity, and its colours are still collected.

**PB-U12 to PB-U15 · the Unsplash source**
The credits and licence the kit must show, the proxy URL, search and list paging with the page offset, the error and aborted shapes, the photo-to-asset mapping including tags, credits and the description fallback, and the tracked download on both apply paths.

**PB-U16 to PB-U19 · the canvas helpers**
`pixelToCanvasUnit` and `zoomToSelectedText` ship in both `src/imgly/engine-utils.ts` and `src/app/contexts/utils.ts`, so one parameterised suite pins both: the device-pixel-ratio and zoom division, millimetres and inches through the scene dpi, the camera move when the cursor leaves the visible page area above or below, the keyboard overlap, and the cases that do nothing. `autoPlaceBlockOnPage` deselects, appends, places and selects; `getImageSize` resolves the natural size and rejects on a load failure.

**PB-U20 and PB-U21 · setting the editor up**
`initPhotobookEditor` registers the seven bundled sources from the engine base URL with the filled-shape matcher, the three upload sources with their mime types, both catalogues against the demo base URL with the layout handler on the layout source only, the image-colours and Unsplash sources, and defers `lifecycle/destroy`. `loadAssetSourceFromContentJSON` substitutes `{{base_url}}` in the meta and in a source set, and leaves an asset with neither alone.

### 5.5 What stays uncovered

25 lines and 8 branches on the merged report, every one a defensive branch unreachable by construction. They are enumerated with their proofs in section 11.

**Deleted as dead code:** the two `Array.isArray(...)` `else` branches in `src/app/contexts/UseSelectedProperty.ts`. Both tested a rest parameter, which is always an array, so neither `else` could run; behaviour is unchanged and both call sites already spread. The two sibling kits that share this file had the same branches removed in the same pass.

**Fixed:** `DeleteSelectedButton` asked the engine for `isAllowedByScope` on every block in the selection without checking `isValid` first. The selection can still name a block the previous delete destroyed for one render, and the engine refuses to answer about it — the component case that destroys a selected block in Crop mode reproduced it as an uncaught `unknown block 21` thrown out of a render, which failed the whole Vitest run. It now skips blocks the engine no longer has, hiding the button for that one render instead of throwing. Same defect class as S6's AP-21 and MB-20.

## 6. Entry and exit criteria

Entry: the engine built; test license available; the shared kit test harness extended for component tests (open question 1) and able to wait on a kit that exposes the engine rather than a CE.SDK instance (known issue 11); the kit's test hook gated the way the fleet settles on (open question 2); the kit's `test:unit` and `test:e2e` scripts replaced with the real commands (they are `exit 0` today).

Exit: every case in section 5 passes locally and in CI. `npm run ci` passes. No test contacts Unsplash. The published kit contains no test files. A release run reports results to the Qase ids above.

## 7. Known issues found while writing this plan

Confirm each with a test before fixing.

1. The restrictions the Qase cases describe are three different mechanisms, and only one is in the kit's code. "Images can only be replaced" is a UI omission — the live dock has no add entry. "Text cannot be moved" and "a sticker cannot be duplicated" are not in the kit at all; if they hold they come from scopes baked into `photobook.scene` on the CDN, so PB-08, PB-21, PB-22 and PB-25 assert the scope on the loaded scene rather than the kit's code. Deletion is the one genuinely kit-driven case: `lifecycle/destroy` is `Defer` globally and granted explicitly on user-added pages.
2. The crop Reset does not call `addUndoStep`, unlike every other mutation in the kit, so it is not independently undoable.
3. Move up on the first page and move down on the last are silently clamped no-ops; the buttons are never disabled, so nothing distinguishes "moved" from "could not move".
4. `resetHistoryOnPageChange` destroys and recreates the history on every page change, so undo never crosses a page boundary.
5. `ExportButton` has no `try`/`finally`. A failed export leaves the button disabled forever, `scene/dpi` at 72 and every page visible. It restores dpi to a hardcoded 300 rather than the value it read, downloads without a `.pdf` extension, and defaults `fileName` to `my-postcard` — a leftover from the postcard kit.
6. ~~`createApplyLayoutAsset` sets the global `lifecycle/destroy` scope to `Allow` and restores it only on the success path.~~ **Fixed** in S4: the whole transfer runs inside a `try`, and the `finally` destroys the duplicate and the loaded layout page and restores the scope. Pinned by PB-H5. The page is still duplicated mid-apply, so the page count is briefly one higher.
7. ~~`loadAssetSourceFromContentJSON` mutates the catalogue object it is given.~~ **Fixed** in S4: the substitution builds a copy of the asset, so the module-level catalogues keep their `{{base_url}}` placeholder and a second call with a different base URL works. Pinned by PB-H8.
8. `UseOnClickOutside` requires `e.isTrusted`, false for `fireEvent`, and its `useEffect` has no dependency array, so the listener is removed and re-added on every render. PB-C64 covers it by calling the handler the hook registers, because jsdom makes `isTrusted` non-configurable on a real event.
9. `PHOTOBOOK_STICKERS` uses the id `ly.img.sticker`, the same id the engine's bundled sticker source uses. This kit does not register the bundled one, so nothing collides today, but the id is not the kit's to take.
10. ~~The Unsplash source maps CE.SDK page 0 to Unsplash page 1 but passes page 1 through unchanged.~~ **Fixed** in S4, with the shape the `starterkit-unsplash-asset-source` fix uses: `unsplashPage = page + 1` goes to the API, `currentPage` stays the CE.SDK page, and the popular list counts `page * perPage + results.length`. PB-U5 is dropped — the source needs a live proxy or a stubbed `unsplash-js` client, and the fix is now identical to the one the P1 kit tests.
11. ~~The kit's test hook is ungated.~~ **Fixed.** The assignment is inside `//START_HIDDEN_BLOCK`, which the publish script strips. The harness has accepted a bare `CreativeEngine` since S2 (`kind: 'engine'`).
12. `src/app/components/` and `src/app/ui/` overlap. `src/app/ui/AddBlockBar` is dead — its only reference is a default parameter that `PhotoBookUI` always overrides — and with it `ui/AddTextSecondary`, `ui/AddImageSecondary`, `ui/AddShapeSecondary` and `ui/ShapesBar`. `components/AddBlockBar/AddBlockBar.module.css` has no importer.
13. `CurrentColorIcon` destructures the value from `useSelectedProperty`, which is `null` with no selection and `undefined` when the getter threw. Either crashes the whole adjustment bar. `BackgroundColorIcon` gets the same case right with a default.
14. **Half fixed.** ~~`hexToRgba` exists twice (`src/app/contexts/color-utilities.ts` and inline in `EditorContext.tsx`).~~ The copy in `EditorContext.tsx` is deleted; it imports the shared one. `pixelToCanvasUnit` and `zoomToSelectedText` still exist twice (`src/imgly/engine-utils.ts` and `src/app/contexts/utils.ts`), and PB-U16 and PB-U17 run against both. `src/imgly/engine-utils.ts` and `src/imgly/apply-layout.ts` are untyped JavaScript in `.ts` files, which compiles only because the kit sets `strict: false` and `noImplicitAny: false`.
15. `App.tsx` reads `baseURL` from `VITE_IMGLY_LOCAL_ASSETS_URL`, which only the `cesdk-engine-dev` wrapper injects. `npm run build` and `npm run preview` are plain Vite, so a production build gets `baseURL: undefined`. The variable is absent from `.env.example`. `npm run secrets` truncates `.env`, deleting any `VITE_DEMO_ASSETS_BASE_URL` the README told the user to set. The demo-assets version `1.81.0` is hardcoded in three places that must move together.
16. `loadEngine()` is called with no `.catch` and there is no error boundary, so a bad license leaves the kit on "Loading..." forever with the failure only in the console. `capture:hero_image` spawns `npm run dev:local`, a script that does not exist.
17. The theme bar's savanna typeface is `Trash Hand` while the font picker's allow-list has `TrashHand`; one of the two cannot match. `ShapesAdjustmentBar` labels its item "Color" with the id `replace`.
18. **Mostly fixed.** Undo, redo, the three page-rail buttons, the page previews and every colour swatch now carry an `aria-label`. What stands: every layout thumbnail is still "Layout Preview" and every image tile "sample asset", selection is a CSS class rather than `aria-current` or `aria-pressed`, and `*:focus { outline: none }` is applied globally with no `:focus-visible` replacement.
19. The README advertises image upload and management, text editing, shape tools and Unsplash search. None of them are reachable: the live dock is Theme, Layout, Color and Sticker, Unsplash is only ever queried with the hardcoded `Disneyland`, and the components that would provide the rest are the dead `ui/AddBlockBar` subtree. It also says export produces page images; the export is a PDF of the whole scene.

20. **Fixed.** `ColorPicker` imported its caret as `./CaretBottom.svg?react`, the only `?react` specifier in the kit. The kit's own `vite.config.ts` sets `svgr({ include: '**/*.svg' })`, which does not match it, so the import resolved to a data-URI string and `<CaretBottom />` rendered an element named by that URI. It was latent because `ColorSelect` always passes its own trigger as children, so the picker's built-in trigger is never reached in the shipped UI. The specifier now matches the other 28 icons. PB-C71 covers the built-in trigger.

21. **Fixed.** `UseImageUpload` created its hidden `<input type="file">` and appended it to `document.body` at module-import time. It is built on first use now, so importing the module no longer changes the page.

22. **What stays uncovered, and why.** Moved to section 11, and one entry is gone: PB-U20 covers the `getFill` `catch` in `readImageIdentity`.

## 8. Open questions

1. ~~Component tests need a jsdom environment and the kit's Vite plugins.~~ **Done in S2.** `vite-plugin-svgr` needs `include: '**/*.svg'` in the kit's vitest config; `useToolbarHeight` needs a `ResizeObserver` stub, which the component file defines; and `AdjustmentsBar` reaches `useSinglePageMode`, which the component file mocks.
2. ~~This kit has no gated test hook.~~ **Done.** The fleet convention is an unconditional `window.cesdk` inside `//START_HIDDEN_BLOCK`, no env gate.
3. ~~Issue 6.~~ **Fixed.** The sibling `starterkit-layouts-asset-source` still has the same defect.
4. ~~Issue 7.~~ **Fixed** by copying.
5. Issue 12: delete the dead `ui/AddBlockBar` subtree, or wire it up. Recommended: delete; the README promises features it would provide, which is a separate product decision. → Elia.

## 9. Estimate

31 browser cases at about 8 s each: about 4.5 minutes on one worker. Headless about 60 s, dominated by the layout scene loads. Component and unit cases under 2 s.

## 10. Boundary review

Rule used: the code that makes a decision owns the test for it. This kit has no CE.SDK editor UI — it drives `@cesdk/engine` directly — so the boundary is only between the kit and the engine. The kit decides the layout transfer and its ordering, the two shipped catalogues and their `{{base_url}}` substitution, the four themes and what each one restyles, the palette, the page rail's add, move and delete rules, the placeholder pass at start-up, and the export settings. The engine decides what any of those calls produce.

Core behaviour this plan leans on, and where it is covered today:

| Behaviour                                                                                                                      | Owner  | Covered by                                                                                                                                                   |
| ------------------------------------------------------------------------------------------------------------------------------ | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `loadBlocksFromString` returns the blocks of a serialized scene, and rejects on invalid JSON                                   | engine | `engine/lib/test/api/UBQSaveLoadCornerAPITest.cpp` saveBlocksToString / loadBlocksFromString; `AsyncFlowAPITest.cpp` `loadBlocksFromStringInvalidJsonErrors` |
| `duplicate`, `destroy`, `insertChild`, `appendChild`, `getChildren`, `getParent`                                               | engine | `engine/lib/test/api/BlockLifecycleAPITest.cpp`, `BlockLifecycleTest.cpp`, `HierarchyAPITest.cpp`                                                            |
| `resetCrop` and the crop property set                                                                                          | engine | `engine/lib/test/api/CropAPITest.cpp`, `AppearanceRoundTripAPITest.cpp`                                                                                      |
| `setPlaceholderEnabled`, `isPlaceholderControlsOverlayEnabled`, `supportsPlaceholderBehavior`, `setPlaceholderBehaviorEnabled` | engine | `engine/lib/test/api/PlaceholderAPITest.cpp`                                                                                                                 |
| `lifecycle/destroy` global and per-block scopes, `isScopeEnabled`, `isAllowedByScope`                                          | engine | `engine/lib/test/api/ScopesAPITest.cpp`, `ScopeMatrixAPITest.cpp`                                                                                            |
| `getSourceSet` / `setSourceSet` and `fill/image/imageFileURI`                                                                  | engine | `engine/lib/test/api/ImageFillAPITest.cpp`, `UBQFillDeepAPITest.cpp`                                                                                         |
| `setFont` with a typeface, and emoji fallback                                                                                  | engine | `engine/lib/test/api/BundledTypefaceAPITest.cpp`; `bindings/wasm/js_node/src/__tests__/systemFontFallback.test.ts`                                           |
| `text/text`, `text/horizontalAlignment`, `fill/solid/color`                                                                    | engine | `engine/lib/test/api/BlockTextTest.cpp`, `BlockPropertiesTest.cpp`, `ColorAccessorAPITest.cpp`                                                               |
| `addLocalSource` with an apply handler, `addAssetToSource`, `defaultApplyAsset`                                                | engine | `engine/lib/test/api/AssetAPITest.cpp` `AddAndFindLocalAssetSource`, `AddAndRemoveAssetFromSource`, `DefaultApplyAsset`; `UBQAssetSourceDelegateAPITest.cpp` |
| `getDominantColors`                                                                                                            | engine | `engine/lib/test/api/DominantColorsAPITest.cpp`; `bindings/wasm/js_node/src/__tests__/DominantColors.test.ts`                                                |
| `createHistory`, `setActiveHistory`, `destroyHistory`, undo and redo                                                           | engine | `engine/lib/test/api/HistoryAPITest.cpp`, `HistoryExtrasAPITest.cpp`                                                                                         |
| PDF export of a multi-page scene                                                                                               | engine | `engine/lib/test/api/ExportAPITest.cpp` `ExportToBuffer_PDF_AllPagesInScene`                                                                                 |
| `getTypeface` on a text block with no typeface returns an error rather than a value                                            | engine | `engine/lib/test/api/BlockTextTest.cpp` (the `setTypeface / getTypeface / getTypefaces` block)                                                               |

Core coverage gaps found (candidates to add in the core suites, not in this kit):

1. Engine: `scene/dpi` and the size of a PDF exported from a Pixel-unit scene. Three kits in this batch drop the scene to 72 dpi for the export and restore it after. `ExportAPITest.cpp` sweeps the dpi of a millimeter scene to pin the source-set pick; nothing pins the page-size relationship the kits rely on. Suggested home: `ExportAPITest.cpp`.
2. Engine: applying an asset source's own `applyAsset` handler through `engine.asset.apply`, where the handler mutates the scene rather than creating a block. `UBQAssetSourceDelegateAPITest.cpp` covers delegate registration; nothing covers a handler that returns an existing block id. The layouts source depends on it, and so does the `starterkit-layouts-asset-source` kit. Suggested home: `UBQAssetSourceDelegateAPITest.cpp`.

Until gap 2 is closed, PB-11 keeps its browser assertion as the end-to-end proof.

## 11. Coverage residue

`npm run ci` reports **lines 99.33 %, branches 98.9 %, functions 100 %**. 25 lines and 8 branches of `src/**` are uncovered, all unreachable by construction.

| Where                                                                                         | What                                                                            | Proof                                                                                                                                                                                                                                                                                                                                |
| --------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `src/imgly/image-colors-source.ts` 257–267, 305–322 and branches 256, 262, 264, 304, 317, 321 | the `CMYK`, `SpotColor` and `default` arms of `dedupeKey` and `getSearchTokens` | `collectBlockPalette` is the only producer of an asset colour here and always builds `{ colorSpace: 'sRGB', … }` from `getDominantColors`; the source then reads back only the assets it produced. The `default` arms assign to a `never`, which is what makes the compiler demand the other arms, so they cannot be deleted either. |
| `src/imgly/image-colors-source.ts` branch 325                                                 | the `?? []` in `for (const group of asset.groups ?? [])`                        | `addColorAsset` gives every asset it builds a one-entry `groups` array, and `getSearchTokens` sees no other asset.                                                                                                                                                                                                                   |
| `src/app/contexts/UseSelectedProperty.ts` branch 30                                           | the `if (!block) return` inside the setter                                      | The hook returns a no-op setter while there is no block, so the real setter is only ever handed to a caller after `block` has been proved truthy in the same render.                                                                                                                                                                 |
