# Test plan: starterkit-postcard-ui

Version 6, 7 Sep 2026. Status: implemented and green. `KIT_TEST_COVERAGE=1 npm run ci` exits 0 with 57 unit, 15 headless, 130 component and 35 browser tests, no expected failures. The four templates no longer reference `cdn.img.ly`, so the kit carries **no allowlist at all**. Merged coverage is lines 99.1 %, branches 97.74 %, functions 100 %, measured twice with the same result. The Vitest gate is 96.88 / 96.88 / 98.97 / 97.6.

## 1. Purpose

Verify that the Postcard UI starter kit works as shipped: the Style step offers four templates, the Design step edits the front page, the Write step edits the back page through name-addressed blocks, and Export produces a two-page PDF.

## 2. Scope

In scope

- The three steps (Style, Design, Write) and how the process navigation locks and unlocks them
- The four templates in `src/imgly/postcard-catalog.ts` and the scene each one loads
- The six actions the kit registers on the engine's Actions API (`src/imgly/config/actions.ts`)
- The front toolbar (Accent, Background) and the back toolbar (Font, Color, Size), which drive blocks by name
- The dock (Text, Image, Shape, Sticker), the adjustment bars, upload, delete, undo and redo
- Export
- The kit's own code under `src/imgly/` and `src/app/`

Out of scope

- What the engine does with a colour, a font, a text size or an export option. Engine behaviour; see section 10.
- The demo site around the kit (cards, tags, links, platform toggles). Covered by the `cesdk_web_demos` suite. Qase 247, 248, 249, 250, 251, 262, 316.
- The mobile-app layer (iOS and Android simulators, install-by-QR, the mobile documentation links). Not part of this web kit. Qase 263, 264, 265, 266, 267, 268, 4384, 4385.

## 3. Test environment

- Browser: Chrome, headless, 1400 × 900
- Engine: `@cesdk/engine` built from this repo, served locally. Requests to `cdn.img.ly` fail the test.
- No allowlist of any kind. Known issue 17 is fixed: the four templates now name the bundled `.woff2` faces by a root-relative path, so every font and the emoji fallback come from the local asset host.
- License: the shared test license (valid on hostname `localhost` only)
- Data: the kit ships no `public/` directory. Templates and previews come from `DEMO_ASSETS_BASE_URL`; the in-repo copy is `packages/cesdk-web-examples-data/data/starterkit-postcard-ui/` — four `.scene` files, four `.png` previews and `ColorPicker.png`. The dev server injects `VITE_DEMO_ASSETS_BASE_URL` for it automatically. The files are git-LFS and fetch-excluded, so a fresh checkout needs `git lfs pull -X '' -I 'packages/cesdk-web-examples-data/data/starterkit-postcard-ui/**'`; the headless suite fails loudly with that command when they are missing.
- **No live Unsplash traffic.** The image bar is uploads plus an Unsplash query built from the chosen template's `keyword`, and applying a photo calls the tracked-download endpoint. Every browser case mocks `https://api.img.ly/unsplashProxy/**` from a fixture whose photo URLs are a 1x1 `data:image/png` URI.
- Headless: `@cesdk/node` through the shared harness engine helper. Node, no DOM.
- Component: Vitest with `// @vitest-environment jsdom`, React Testing Library, the kit's own Vite plugins. See open question 1.
- Downloads: captured by Playwright and checked by file type and PDF page count

## 4. Approach

| Kind      | Tool                          | What it checks                                                               | Run                 |
| --------- | ----------------------------- | ---------------------------------------------------------------------------- | ------------------- |
| Static    | tsc, eslint, convention check | Types, deprecated APIs, kit folder shape                                     | `npm run check:all` |
| Unit      | Vitest                        | The catalogue, colour conversion, Unsplash mapping, selection reconciliation | `npm run test:unit` |
| Headless  | Vitest + `@cesdk/node`        | The six registered actions and the asset-source helpers                      | `npm run test:unit` |
| Component | Vitest + jsdom + RTL          | The kit's prop-only components                                               | `npm run test:unit` |
| Browser   | Playwright                    | The test cases in section 5.1                                                | `npm run test:e2e`  |

All five run in the kit's `ci` script. This kit is the one in the batch with a real engine-only seam: every mutation goes through `engine.actions.run(...)`, so most of its behaviour is reachable headlessly and the browser keeps one proof per feature. Browser tests use role and label locators; undo, redo and the colour swatches carry no accessible name (known issue 6), so they are reached by position — undo and redo are the first two buttons on the page, and the swatch row is the ancestor of the picker's `Pick color` trigger. The `kit` fixture is not used: the Style step loads no scene, so every case takes `{ page }`, navigates and picks a template first.

## 5. Test cases

Format: ID, level, Qase id, title. Then steps and expected result.
Common precondition for all browser cases: the Unsplash proxy route is mocked and the kit is open on the Style step.

### 5.1 Browser

**PC-01 · browser · Qase 274 · The four templates open**
Steps: open the kit. For each of the four tiles, click it and read the canvas.
Expected: four tiles named "Choose Thank you Template", "Choose Merry Christmas Template", "Choose Bonjour Paris Template" and "Choose Wish you were here Template". Clicking one loads that template's scene, moves to Design and shows two pages named `Background` and `Back`, of which only the front is visible.

**PC-02 · browser · Qase 283 · Style is reachable again**
Steps: pick a template, then click Style.
Expected: the template grid is shown again and the Export button is gone.
Note: "Design and Write are disabled until a template is chosen" is wrong — on the Style step `PostcardUI` renders the grid alone, so the whole navigation is absent. The case asserts that instead.

**PC-02b · browser · The steps lock while the editor is cropping**
Steps: select the front image, replace it so Crop is enabled, click Crop.
Expected: all three step buttons are disabled while the edit mode is `Crop`, and enabled again after leaving it. Split out of PC-02.

**PC-03 · browser · Qase 279 · Accent colour from the template palette**
Steps: on Design, open Accent, click the third swatch.
Expected: every block named `Accent` gets that fill, and its stroke too when it supports stroke. The swatches are the chosen template's five colours plus the picker.

**PC-04 · browser · Qase 280 · Accent colour from the picker**
Steps: open Accent, use the colour picker, enter a hex value.
Expected: the same action runs with the picked colour. A malformed hex is ignored rather than written.

**PC-05 · browser · Qase 281 · Background colour from the template palette**
Steps: open Background, click a swatch.
Expected: `setColorByBlockName('Background', <colour>)` runs and the page background follows.

**PC-06 · browser · Qase 282 · Background colour from the picker**
Steps: as PC-04 on the Background dropdown.

**PC-07 · browser · Qase 252 · Add a pre-loaded image**
Steps: open Image in the dock, click a thumbnail.
Expected: the kit queries the `unsplash` source with `query=Thank you flowers` and calls the tracked-download endpoint, and applying the asset adds one graphic to the front page whose image fill is the URL that endpoint returned.

**PC-08 · browser · Qase 253 · Upload an image**
Steps: open Image, click Upload, choose a PNG.
Expected: both files are added to `ly.img.image.upload`, and the refreshed list leads with the newest one.
Note: applying an upload selects the new block, which swaps the dock for the image adjustment bar, so the case re-opens the list through Replace.

**PC-09 · browser · Qase 275 · Replace a sample image with a pre-loaded one**
Steps: select the image on the front page, click a thumbnail.
Expected: the fill URI changes and the page keeps its child count.
Note: the block is a placeholder, so the kit opens the Replace bar by itself; clicking Replace first would close it.

**PC-10 · browser · Qase 276 · Replace a sample image with an uploaded one**
Steps: as PC-09 with the uploaded file.

**PC-11 · browser · Qase 349 · Replacing a sample image clears the placeholder UI**
Steps: select a placeholder image, replace it.
Expected: the placeholder overlay and button are gone and Crop becomes enabled.

**PC-12 · browser · Qase 257 · Add a shape**
Steps: open Shape, click one.
Expected: a graphic of kind `shape` with a vector shape is added to the front page and selected, and every id in `ly.img.vector.shape` starts with `ly.img.vector.shape.filled.`.

**PC-13 · browser · Qase 258 · Shape colour from the palette**
Steps: with the shape selected, open Color, click a swatch.
Expected: `fill/solid/color` follows and one undo step is added.

**PC-14 · browser · Qase 289 · Shape colour from the picker**
Steps: as PC-13 through the picker.

**PC-15 · browser · Qase 260 · Add a sticker**
Steps: open Sticker, click one.
Expected: a graphic of kind `sticker` with an image fill is added and selected, and the `emoticons` query returns only that group.
Note: unlike the apparel kit, this one does not strip the other sticker groups from the source; it queries by group instead, so `ly.img.sticker` still holds them all.

**PC-16 · browser · Qase 254 · Add a text block**
Steps: open Text, pick a typeface.
Expected: a text block is added to the front page with font size 40, centre alignment, `Auto` height mode, half the page width, both position modes `Absolute`, and it is selected.

**PC-17 · browser · Qase 255 · Edit the text**
Steps: double-click the block, type a word, leave text mode.
Expected: `text/text` holds the typed value and the canvas re-zooms to the page when text mode ends.

**PC-18 · browser · Qase 256 · Emoji in text**
Steps: type an emoji.
Expected: it is stored in `text/text` and rendered from the emoji fallback font.

**PC-19 · browser · Qase 284 · Text colour from the palette**
Steps: select the text block, open Color, click a swatch.
Expected: `fill/solid/color` follows, one undo step.

**PC-20 · browser · Qase 285 · Text colour from the picker**
Steps: as PC-19 through the picker.

**PC-21 · browser · Qase 286 · Change the text font**
Steps: select the text block, open Font, pick another typeface.
Expected: the selected text block gets that typeface and undo becomes available.
Note: the dock replaces itself with the text adjustment bar after the first block, so a second one cannot be added from the UI. The multi-selection half of `replaceFontOnSelection` is asserted headlessly in PC-H2.

**PC-22 · browser · Qase 273 · Edit the postcard text on the Write page**
Steps: click Write, double-click the greeting, type, leave text mode.
Expected: Write shows the back page only, the dock is hidden, and `text/text` on the block named `Greeting` holds the typed value.

**PC-23 · browser · Qase 301 · Emoji on the Write page**
Steps: type an emoji into the greeting.
Expected: as PC-18.

**PC-24 · browser · Qase 302 · Change the greeting font**
Steps: on Write, open the Font dropdown, pick a typeface.
Expected: `setFontByBlockName('Greeting', <typeface>)` runs, edit mode is forced to `Transform` first, the normal/normal font of that typeface is used, and one undo step is added.

**PC-25 · browser · Qase 303 · Greeting colour from the palette**
Steps: on Write, open Color, click a swatch.
Expected: the `Greeting` block already carries `#263BAA` on load, because `PageSettingsContext` applies its own default over the template's authored colour (known issue 1, pinned). Clicking the third swatch of the kit's hardcoded blue ramp then sets `#001346`.

**PC-26 · browser · Qase 304 · Greeting colour from the picker**
Steps: as PC-25 through the picker.

**PC-27 · browser · Qase 305 · Change the greeting size**
Steps: read the loaded size, open Size, click S, then L.
Expected: the block starts at 22, because `PageSettingsContext` applies its own default (known issue 1, pinned); S gives 14 and L gives 22.

**PC-28 · browser · Qase 306 · The size dropdown marks the chosen option**
Steps: open Size, choose M, open it again.
Expected: the three options are S, M and L, and the chosen one carries the active class.
Note: "the trigger shows the selected option" is wrong — `Dropdown` renders a static icon plus the literal label "Size". Only the list marks the choice.

**PC-29 · browser · Qase 307 · Edit the address text**
Steps: on Write, select the address text block on the canvas, type into it.
Expected: `text/text` on that block holds the typed value. It is edited directly on the canvas, not through the toolbar, which addresses only the `Greeting` block.

**PC-30 · browser · Qase 308 · Emoji in the address text**
Steps: as PC-23 on the address block.

**PC-31 · browser · Qase 261 · Export from the Design page**
Steps: on Design, click Export.
Expected: `engine.block.export` is called once, on the scene, with `mimeType: 'application/pdf'`; afterwards `scene/dpi` is 300 again and only the front page is visible. One PDF downloads with 2 pages, named `my-postcard.pdf`.
Note: the kit passes no extension, but Chrome derives `.pdf` from the blob type, so that half of known issue 2 is not observable.

**PC-32 · browser · Qase 309 · Export from the Write page**
Steps: on Write, click Export.
Expected: the same two-page PDF, and afterwards only the back page is visible again.

**PC-33 · browser · Delete a block**
Steps: select the added shape, click Delete.
Expected: the block is destroyed and one undo step is added. Delete is not shown for a block the scene forbids destroying.

**PC-34 · browser · Undo and redo**
Steps: change the accent colour, click undo, then redo.
Expected: the colour reverts and returns.
Note: undo is already **enabled on load**, because `PageSettingsContext` runs four style actions as soon as the scene is there and each records an undo step (known issue 1). The case asserts that rather than a clean history.

### 5.2 Headless (no browser, real engine)

Subject: `setupActions` from `src/imgly/config/actions.ts` and the query helpers in `src/imgly/utils.ts`, on a `@cesdk/node` engine holding a template scene loaded from the in-repo demo data.
Note: `initPostcardEditor` itself is **not** exercised headlessly. It builds every source URL from `engine.getBaseURL()`, and the harness engine's base is the repository's `assets/` root, which has no flat `ly.img.*` layout (the libraries live under `assets/v8/`). The headless cases register the sources they need directly; PC-01 proves `initPostcardEditor` in the browser.

**PC-H1 · headless · `addText`**
Runs with a page id, a font and a typeface. Expected: a text block with font size 40, `Center` alignment, `Auto` height mode, half the page width, appended to that page and selected.
Note: `engine.actions.run` returns a promise, so the block id has to be awaited. The undo step is not asserted here — the headless engine never ticks, so `canUndo()` stays false; PC-34 covers it in the browser.

**PC-H2 · headless · `replaceFontOnSelection`**
With two text blocks selected. Expected: both get the given typeface.

**PC-H3 · headless · `setColorByBlockName`**
Expected: every block with that name gets the colour on `fill/solid/color`, and a stroke colour too when the block supports stroke. Alpha is forced to 1 regardless of the input. An unknown name is a no-op that does not throw.

**PC-H4 · headless · `setTextSizeByBlockName`**
Expected: `text/fontSize` on every block with that name equals the value.

**PC-H5 · headless · `setFontByBlockName`**
Expected: edit mode is set to `Transform` first, the typeface's normal/normal font is chosen and the first font used as the fallback, and every block with that name gets it.

**PC-H6 · headless · `exportToPdf` restores the scene**
Expected: on success the returned blob is `application/pdf` and non-empty, and afterwards `scene/dpi` is 300 and only the page whose id was passed is visible. A second case replaces `engine.block.export` with a rejecting stub and asserts the `finally` still restores dpi and visibility.

**PC-H7 · headless · The asset-source helpers**
`findShapes`, `findStickers(['emoticons'])`, `findTypefaces(FONT_SUBSET)` and `findAllAssets` against sources registered from `assets/v8/`. Expected: shapes are only the filled ones, the emoticon query is a strict subset of all stickers, typefaces are only names in `FONT_SUBSET`, and `findAllAssets` pages a source whose first page reports `nextPage: 1` until the total is reached.

**PC-H8 · headless · `canDeleteSelection` and `getSelectedTypeface`**
Expected: `canDeleteSelection` is false when any selected block is denied `lifecycle/destroy`. `getSelectedTypeface` returns undefined with nothing selected and for a selected page, where `getTypeface` throws, and returns the block's typeface for a text block. A fresh text block now reports the engine default, Inter, so it no longer reaches the undefined path.

**PC-H9 · headless · The image-colours source**
Groups per image block, sRGB colour payloads, the group filter, an unmatched query returning `total: 0`, and two graphics with the same URI collapsing into one group. The source is registered by `initPostcardEditor` but no UI queries it; see known issue 5.

### 5.3 Component (jsdom, React Testing Library)

**PC-C1 · component · ChooseTemplateStep**
Four tiles in catalogue order, each with the alt text "Choose &lt;name&gt; Template" and the `data-cy` id. Clicking one sets the template id and moves to Design.

**PC-C2 · component · ProcessNavigation**
Three step buttons in the order Style, Design, Write. Design and Write are disabled while no template is chosen; all three are disabled while `disabled` is set; the active one is marked by class only, with no `aria-current`.
Note: `.buttonText` is `display: none` below a 450 px viewport and jsdom applies no media query, so the labels have no accessible name here and the buttons are read in render order.

**PC-C3 · component · TextSizeDropdown and ColorDropdown**
The size dropdown offers S, M and L mapping to 14, 18 and 22 and reports the active one. The colour dropdown renders the palette it is given, marks the active swatch and passes the clicked colour up.

**PC-C4 · component · AlignmentSelect and IconButton**
Three alignment options labelled Left, Center and Right, emitting exactly those values. `IconButton` renders its label only when children are given and applies the active class only when `isActive`.

**PC-C5 · component · BlockBar and BlockBarContext**
Selecting an item renders that item's component and only that one; selecting it again deselects. `useBlockBar` outside the provider throws.

**PC-C6 · component · FontPreview and ImageBarButton**
`FontPreview` picks the normal/normal font, falls back to the first font and emits an `@font-face` rule with the font URI. `ImageBarButton` disables itself and shows the spinner while its async click is pending, and re-enables after.

**PC-C7 · component · ColorPicker** — dropped. The kit's `ColorPicker` is byte-identical to the apparel kit's, and `AP-C5` covers it there. `PC-C3` exercises it through `ColorDropdown` instead.

The cases below mount the kit's own provider stack — `EngineProvider`,
`SinglePageModeProvider`, `EditorProvider`, `PageSettingsProvider`,
`SelectionProvider` — over a concrete fake engine (`tests/component/support/`),
the same nesting `App` uses, with the kit's actions registered on it the way
`initPostcardEditor` does. Nothing is stubbed out of the tree.

**PC-C10 · component · the style step**
Four templates, canvas hidden, no scene load until one is picked; picking one
loads its scene and reveals the canvas; a scene that will not load is reported.

**PC-C11 · component · the process navigation**
The step buttons only exist past the style step, Write shows the back page and
hides the front, and cropping locks the navigation.

**PC-C12 · component · the front page toolbar**
The template's first two colours reach the accent and background blocks through
`setColorByBlockName`, including the stroke; a swatch the user picks reaches the
same action.

**PC-C13 · component · the back page toolbar**
The greeting typeface is read out of the scene; the size and the font the user
picks reach `setTextSizeByBlockName` and `setFontByBlockName`.

**PC-C14 · component · exporting the postcard**
Both pages are shown, the scene exports as `application/pdf` at 72 dpi, 300 is
restored and a download anchor is clicked.

**PC-C20 · component · the add bar**
Text goes through the `addText` action onto the current page. Shape and sticker
apply from their own sources. The image bar lists uploads plus Unsplash, shows a
spinner while empty, applies the image clicked, and skips Unsplash when the
source is not registered.

**PC-C21 · component · the image adjustment bar**
Replace opens and closes; Crop enters and leaves through `crop.enter` and
`editmode.exit`; the engine reporting crop mode opens the crop bar, whose Reset
resets the crop; a placeholder opens Replace and disables Crop;
`ChangeImageFileSecondary` applies to the selected block.

**PC-C22 · component · leaving crop mode**

**PC-C23 · component · the text adjustment bar**
Colour, alignment and font each reach the engine for the selected block, and a
block whose typeface the engine refuses to name shows none active.

**PC-C24 · component · the shape and sticker adjustment bars**
The shape bar writes the colour and paints the current one on its icon. The
sticker bar deletes through `selection.delete`, leaving crop mode first, and
hides its Delete button when the block may not be destroyed.

**PC-C25 · component · the bottom controls follow the selection**

**PC-C26 · component · the colour picker inside the colour bar**

**PC-C30 · component · every context refuses to be used outside its provider**

**PC-C31 · component · refocusing the canvas**
Canvas resize, visual-viewport resize and a scene-tree event all re-zoom. Crop
mode zooms to the selected block, and does nothing when that block is gone. Text
mode scrolls to the cursor. A scene with no page zooms nothing. The page change
starts a fresh history, and only the current page stays visible.

**PC-C32 · component · the toolbar height**

**PC-C33 · component · the debounced picker callback**

**PC-C34 · component · closing the picker on an outside click**

**PC-C35 · component · reading and writing a block property**

**PC-C36 · component · the canvas element**

**PC-C37 · component · undo and redo**
Both run through `history.undo` and `history.redo`.

**PC-C40 · component · the engine provider**
An engine that arrives after the provider unmounts is disposed; a local build
points `baseURL` at the local asset host; `configure` runs before the children;
the demo beacon reports `created` and then `ready` as the engine comes up.

**PC-C41 · component · reducing a marquee selection to one block**
No engine, a single selection, an unchanged selection, a multi-selection reduced
outside a gesture, a gesture that reduces only on pointer-up, and a pointer-up
that never followed a pointer-down.

**PC-C42 · component · the single-page mode before it is switched on**

**PC-C43 · component · the standalone colour picker**

**PC-C44 · component · the colour dropdown**
A typed hex reaches the caller, an incomplete one does not, and the dropdown
closes on a canvas touch and on a click outside.

**PC-C45 · component · the block bar with a plain child**

**PC-C46 · component · the font list**
Scrolls the active font into view and falls back to the first weight.

**PC-C47 · component · the toolbar height without a bar to measure**

**PC-C48 · component · uploading an image**
The picked file is measured, added to the upload source and applied; a rejecting
upload handler is reported; a picker with no files rejects; an image the browser
cannot decode is dropped.

**PC-C49 · component · the editor before the scene exists**

**PC-C50 · component · the controls with nothing selected**

**PC-C51 · component · the page toolbars before a template exists**

**PC-C52 · component · adding text with no page to add it to**

**PC-C53 · component · the template keyword reaches the image search**

**PC-C54 · component · a selection the engine keeps changing**

**PC-C55 · component · the greeting font without a regular weight**

### 5.4 Unit (no browser, no engine)

**PC-U1 · unit · The postcard catalogue**
Four entries with the ids `thank_you`, `merry_christmas`, `bonjour_paris` and `wish_you_were_here`. Each has a name, five colours, a preview path, a scene path and a keyword. Every scene and preview path exists in the in-repo demo data.

**PC-U2 · unit · `hexToRgba`, `rgbaToHex`, `isColorEqual`**
`#ffffff` → 1,1,1,1; `#00000080` → alpha 0.502; `#abc` and `#f` expand; any other length throws with the kit's message. `rgbaToHex` round-trips every one of the twenty template colours and always emits `#rrggbbaa`. `isColorEqual` honours the default and an explicit precision.

**PC-U3 · unit · `pickBlockToKeep`**
The block added in the current gesture wins when it is still selected; otherwise the newest block not in the previous selection; otherwise the last selected id. This is the kit's own selection reconciliation and is pure.

**PC-U4 · unit · Unsplash response mapping**
With `fetch` stubbed: a photo maps to an `AssetResult` with `meta.uri` from `links.download_location`, `meta.thumbUri` from `urls.thumb`, graphic block type, image kind and fill, the pixel size, credits from the user and UTM `CE.SDK Demo` / `referral`. `description` falls back to `alt_description`, then to undefined. An error response rejects with the first message.

**PC-U5 · unit · Unsplash paging**
`page: 0` asks Unsplash for page 1, `page: 1` asks for page 2, `page: 3` asks for page 4 and reports no next page. `currentPage` and `nextPage` are in CE.SDK's numbering. Known issue 8 is **fixed**.

**PC-U6 · unit · `getProperty` and `setProperty`**
Against a recording engine stub: each of the seven property types dispatches to the matching getter and setter, and an unhandled type is a silent no-op that calls nothing.
Note: "a thrown engine error is swallowed" is wrong for these two functions — they have no `try`/`catch` and let it through. The swallowing lives in `useProperty`, one level up.

**PCU-U10 to PCU-U14 · component · The engine helpers in `imgly/utils.ts`**
`pixelToCanvasUnit` answers 0 while no scene is loaded and otherwise divides by the density factor of a millimetre, inch or pixel scene and by the zoom level. `zoomToSelectedText` does nothing without a canvas element, without a visual viewport, before the cursor has been laid out, or unless exactly one block is selected; it moves the camera when the cursor sits below the visible area and leaves it alone when the cursor is in view. `getImageSize` answers with the natural size and rejects on a load error. `downloadBlob` clicks a hidden anchor and revokes the object URL on the next tick. `findImageAssets` lists the newest upload first, appends the Unsplash matches for the template keyword, and lists only the uploads when Unsplash is not registered.

**PC-U10 · unit · which blocks contribute colours**
A block with no fill support, a switched-off fill, one the engine refuses to
answer about, and one whose fill is not an image are all skipped. A block whose
colours cannot be extracted is warned about and left out.

**PC-U11 · unit · how a repeated image is recognised**
Two blocks sharing an image file URI, a source set or an external reference
collapse into one group. A block with no identity is kept; empty values do not
count as one.

**PC-U12 · unit · the group names**
The block name wins, then its `fallback-name` metadata, then `Image N`. Repeated
names are numbered.

**PC-U13 · unit · querying the palette**
Colours are deduped per block; group filters and query words each narrow as
documented.

**PC-U14 · unit · what Unsplash cannot answer**
A failing listing rejects with its first error, an exhausted listing reports no
next page, the source offers no groups and refuses to add or remove an asset,
and tags and absent credits are mapped.

**PC-U15 · unit · the tracked download**
The tracked URL is applied to a new block and to an existing one, every error the
endpoint returns is reported, and an asset with no URI is refused before the
endpoint is called.

**PC-U16 · unit · the entry point**
Mounts the app into `#root`.

**PC-U17 · unit · the entry point without its container**
Fails loudly instead of mounting nothing.

## 6. Entry and exit criteria

Entry: the engine and its asset library built (`nx run @cesdk/engine:build:assets`); the demo data materialised (`git lfs pull -X '' -I 'packages/cesdk-web-examples-data/data/starterkit-postcard-ui/**'`); test license available; the shared harness's component wiring and its `{ kind, engine, cesdk }` editor handle in place.

Exit: **met.** `npm run ci` exits 0. No test contacts Unsplash or any host other than the kit's dev server and the local asset CDN. The published kit contains no test files.
Open: browser coverage is not merged into the kit's number — `merge-coverage.mjs` cannot map a `…svg?import` module, so `test:all` runs the browser step with `KIT_TEST_COVERAGE=0`. Recorded for the harness owner. **Trap while that stands:** a bare `npm run test:e2e` or `npx playwright test` still writes dumps to `apps/cesdk_web_examples/.test-output/<kit>/coverage/playwright/`, nothing clears them, and the next `npm run ci` then dies in the merge step. Delete that directory after running the browser tests by hand.

## 7. Known issues found while writing this plan

Confirm each with a test before fixing.

1. Confirmed and **pinned as current behaviour** (Elia's call). The Write toolbar hardcodes a blue palette and ignores the chosen template's colours, while the Design toolbar uses them. `PageSettingsContext` applies its defaults — `#263BAA` and size 22 — to the `Greeting` block as soon as the scene loads, so every template's authored greeting colour and size are overwritten; PC-25 and PC-27 assert exactly that, and PC-34 records the side effect that undo is already enabled on load. The font dropdown offers six names while `FONT_SUBSET` has thirteen, so the Design and Write font pickers disagree.
2. `exportToPdf` restores `scene/dpi` to a hardcoded 300 instead of the value it read. `ExportButton` has a `try`/`finally` but no `catch`, and is called from an `onClick` that does not await it, so a failed export is an unhandled rejection with no message. `TopBar`'s `exportFileName` prop is never supplied. The missing `.pdf` extension is **not** a defect: Chrome derives it from the blob type (PC-31).
3. `resetHistoryOnPageChange` destroys and recreates the history on every page change, so undo never crosses the Design–Write boundary.
4. Confirmed by reading: `addText` records its undo step inside `autoPlaceBlockOnPage`, so it is not missing — but unlike the other five actions it does not call `addUndoStep` itself. No behavioural difference; the note stands as a readability finding only.
5. The image-colours source is registered but no UI queries it — a whole plugin with no consumer. It also swallows five errors in empty `catch` blocks.
6. Confirmed. Undo, redo, every colour swatch and every picker preset are icon-only or colour-only buttons with no accessible name; the step, swatch and dropdown states are CSS-module classes. Everything else the browser cases touch does have a name: the step buttons, Export, Accent, Background, Font, Color, Size, the dock, Replace, Crop, Delete, `Add shape N`, `Add sticker N`, `sample asset`, `Pick color` and `Choose <name> Template`.
7. `UseOnClickOutside` has no dependency array, so the listener is removed and re-added on every render, and it requires `e.isTrusted`, which is false for `fireEvent`.
8. **Fixed**, identically to the apparel copy and to `starterkit-unsplash-asset-source`: page N maps to Unsplash N+1 and `currentPage`/`nextPage` stay in CE.SDK's numbering. Photobook's copy still needs the same edit.
9. **Fixed.** The kit publishes `window.cesdk` — the bare `CreativeEngine` — from inside a `//START_HIDDEN_BLOCK`, after `configure` has awaited, and the harness handle reports `kind: 'engine'`. That also unblocks `scripts/capture-hero.mjs`, which waits for `window.cesdk`.
10. **Partly fixed.** `scripts/setup-secrets.sh` is restored (it was the only kit of 54 missing it), and `.env.example` now leaves `VITE_CESDK_LICENSE` empty. Still open: `EngineContext` calls `loadEngine()` with no `.catch`, so a bad license leaves the kit on the spinner with the failure only in the console.
11. `check:syntax` and `check:lint` are green today, verified before any test was written. Still open: `check:format` globs `{ts,js,json,html}`, so `.tsx` is never format-checked — including this kit's own test files, which were formatted by hand.
12. `App` calls `setEngine(engine)` before awaiting `initPostcardEditor`, so `SelectionProvider` can subscribe to an engine whose asset sources and custom actions are not registered yet.
13. `EditorContext` hardcodes the back page as `pages[1]`, which is undefined for a single-page scene, and nothing guards a second template being picked mid-load. A failed `scene.load` leaves the kit on the spinner forever.
14. `ImageAdjustmentBar` compares its adjustment id against `undefined` while the state is initialised to `null`, so Replace and Crop are never highlighted. `ShapesAdjustmentBar` labels its item "Color" with the id `replace`, a copy from the image bar.
15. `useImageUpload` appends a file input to `document.body` at module load, and its promise never settles when the user cancels the dialog. `getImageSize` in `utils.ts` is exported, unused and duplicates `getImageDimensions`.
16. The README documents a directory layout that does not exist (`src/imgly/contexts/`, `src/imgly/hooks/`, `src/imgly/actions/*`, `src/imgly/utils/`) and a `useEditorActions()` hook that exists nowhere in the repo. It documents `dev:local` and `build:local` scripts that are not in `package.json`. Its own "golden rule" — UI components never call `engine.*` to mutate — is broken in at least four components.
17. **Fixed.** All four templates carried `cdn.img.ly/packages/imgly/cesdk-js/…/...` (pinned to 1.68.0) font URIs and a `Quicksand-Regular.ttf` the asset library no longer ships. Every font URI — in the text blocks and in the typeface objects — and the emoji fallback now point at the bundled pack by a root-relative path, so both the `cdnAllowlist` and the `consoleErrorAllowlist` are gone and the console guard is back at full strength. The rewritten scenes must be deployed with `pnpm --filter @imgly/cesdk-web-examples-data deploy:cdn` before the static CI mode can pass.

### Coverage residue

Everything of `src/**` the merged report still misses. Every entry is
unreachable by construction; nothing here is a missing test.

1. **`src/app/components/ColorSelect/ColorSelect.tsx:47, 51` and
   `src/app/components/ColorDropdown/ColorDropdown.tsx:59, 63`** — the
   `#NaNNaNNaN` guard and the `catch` around `hexToRgba` in each picker.
   `react-colorful` calls `onChange` only with a hex it has already validated,
   and the `#NaNNaNNaN` sentinel it emits from a zero-sized surface needs a
   pointer drag its jsdom build never dispatches.
2. **`src/app/hooks/useSelectedProperty.ts:36`** — the `if (!block) return`
   inside the setter. `useProperty` hands out a no-op setter when there is no
   block, so the only caller that ever holds the real setter has already proved
   `block` is truthy.
3. **`src/app/layout/PageToolbar/PageToolbar.tsx:18`** — the `Fragment` arm of
   `currentStep ? PAGE_TOOLBARS[currentStep] : Fragment`. `currentStep` is a
   union of three literals initialised to `'Style'`, so it is never falsy.
4. **`src/imgly/plugins/image-colors.ts:90-92`** — the `catch` around `getFill`
   in `readImageIdentity`. It runs only after `hasImageFill` has already called
   `getFill` on the same block in the same pass.
5. **`src/imgly/plugins/image-colors.ts:255-266, 303-321`** — the `CMYK`,
   `SpotColor` and `default` arms of `dedupeKey` and `getSearchTokens`.
   `collectBlockPalette` destructures `{ r, g, b }` from every dominant colour
   and always builds `{ colorSpace: 'sRGB', … }`, so this source cannot emit
   another colour space. The `default` arms are `never` guards that make the
   compiler enforce a future one.
6. **`src/imgly/plugins/unsplash.ts:92-94, 116-118`** — the `else` after each
   `response.type` check. `unsplash-js` types the response as the union
   `'success' | 'error'` and both arms are covered, so the fallthrough cannot be
   produced.

## 8. Open questions

1. **Resolved.** `defineKitVitestConfig` takes the kit's Vite plugins, includes `tests/component/**`, and hands back unscoped CSS-module class names. This kit's config also appends the `@/` alias its sources import through, and its component tests stub `ResizeObserver`, which jsdom does not ship.
2. **Answered for now: pinned.** Elia's call is to keep the overwrite; PC-25 and PC-27 assert it. The recommendation stands for a later change: seed `PageSettingsContext` from the loaded scene and use the template palette on both toolbars.
3. **Resolved: fixed** in this kit and in the apparel copy, asserted by PC-U5. Photobook's copy is its owner's to apply.
4. The Unsplash and image-colours modules are byte-identical across the apparel, postcard and photobook kits. Recommended: keep them duplicated — starter kits are copied whole — but fix all three together whenever one changes. → Fable, once for the fleet.
5. New: `initPostcardEditor` cannot run headlessly, because the harness engine's `baseURL` is the repository `assets/` root rather than a flat asset library. A per-kit `baseURL` override on `createTestEngine` would let PC-H7 assert the real registration. → agent B.
6. New: browser coverage is disabled in `test:all` until `merge-coverage.mjs` can map a `?import` module. See the exit criteria.

## 9. Estimate

Measured: 35 browser tests in about 1.5 min on one worker; 15 headless in about 3 s; 14 component and 26 unit under 1 s. `npm run ci` end to end is about 2.5 minutes.

## 10. Boundary review

Rule used: the code that makes a decision owns the test for it. This kit has no CE.SDK editor UI — it drives `@cesdk/engine` directly — so the boundary is only between the kit and the engine. The kit decides the catalogue, the three steps and which page each shows, the six actions and what they do to blocks addressed by name, the palettes, the font subsets, the export settings and the Unsplash mapping. The engine decides what any of those values produce.

Core behaviour this plan leans on, and where it is covered today:

| Behaviour                                                                                                            | Owner  | Covered by                                                                                                             |
| -------------------------------------------------------------------------------------------------------------------- | ------ | ---------------------------------------------------------------------------------------------------------------------- |
| `engine.actions.register` and `run` dispatch to the registered function                                              | engine | `bindings/wasm/js_node/src/__tests__/EngineActions.test.ts`; `apps/cesdk_web/packages/api/actions/ActionsAPI.test.ts`  |
| The built-in actions `history.undo`, `history.redo`, `selection.delete`, `crop.enter`, `crop.reset`, `editmode.exit` | engine | `bindings/wasm/js_web/src/registerDefaultActions.ts`, exercised by `EngineActions.test.ts`                             |
| `findByName` returns every block with that name                                                                      | engine | `engine/lib/test/api/HierarchyAPITest.cpp`, `MiscAPITest.cpp`                                                          |
| `fill/solid/color` and `setStrokeColor` set and read back                                                            | engine | `engine/lib/test/api/BlockPropertiesTest.cpp`, `ColorAccessorAPITest.cpp`, `StrokeCapAndDashAPITest.cpp`               |
| `setFont` with a typeface, and emoji fallback                                                                        | engine | `engine/lib/test/api/BundledTypefaceAPITest.cpp`; `bindings/wasm/js_node/src/__tests__/systemFontFallback.test.ts`     |
| `text/text`, `text/fontSize`, `text/horizontalAlignment`, `Auto` height mode                                         | engine | `engine/lib/test/api/BlockTextTest.cpp`, `TextDeepAPITest.cpp`, `BlockLayoutTest.cpp`                                  |
| Placeholder overlay and button state on an image block                                                               | engine | `engine/lib/test/api/PlaceholderAPITest.cpp`                                                                           |
| `lifecycle/destroy` as a global scope and per block, and `isAllowedByScope`                                          | engine | `engine/lib/test/api/ScopesAPITest.cpp`                                                                                |
| Undo, redo, `createHistory`, `setActiveHistory`, `destroyHistory`                                                    | engine | `engine/lib/test/api/HistoryAPITest.cpp`, `HistoryExtrasAPITest.cpp`                                                   |
| PDF export of a two-page scene, and of a single page                                                                 | engine | `engine/lib/test/api/ExportAPITest.cpp` `ExportToBuffer_PDF_AllPagesInScene`, `ExportToBuffer_PDF_SinglePageFromScene` |
| `addLocalSource` plus `addAssetToSource`, `defaultApplyAsset`, `defaultApplyAssetToBlock`                            | engine | `engine/lib/test/api/AssetAPITest.cpp`                                                                                 |
| `getDominantColors`                                                                                                  | engine | `engine/lib/test/api/DominantColorsAPITest.cpp`; `bindings/wasm/js_node/src/__tests__/DominantColors.test.ts`          |
| `getTypeface` on a text block with no typeface returns an error rather than a value                                  | engine | `engine/lib/test/api/BlockTextTest.cpp` (the `setTypeface / getTypeface / getTypefaces` block)                         |

Core coverage gaps found (candidates to add in the core suites, not in this kit):

1. Engine: an action registered under a name that already exists, and `run` on an unregistered name. Several kits in the fleet register their own actions and none of them knows what either does. `EngineActions.test.ts` covers registration and dispatch only. Suggested home: `bindings/wasm/js_node/src/__tests__/EngineActions.test.ts`.
2. Engine: `scene/dpi` and the size of a PDF exported from a Pixel-unit scene. Three kits in this batch drop the scene to 72 dpi for the export and restore it after. `ExportAPITest.cpp` sweeps the dpi of a millimeter scene to pin the source-set pick; nothing pins the page-size relationship the kits rely on. Suggested home: `ExportAPITest.cpp`.

Until gap 2 is closed, PC-31 keeps its decoded-PDF page-count assertion as the end-to-end proof.
