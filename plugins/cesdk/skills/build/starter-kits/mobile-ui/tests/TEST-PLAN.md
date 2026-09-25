# Test plan: starterkit-mobile-ui

Version 6, 5 Sep 2026. Status: implemented and green. 22 browser tests, 9 headless, 113 component, 35 unit; `npm run ci` exits 0, no expected failures in the browser suite. Merged coverage: lines 99.83 %, branches 99.53 %, functions 99.34 %. Section 11 lists every line, branch and function that is still uncovered and why.

**Coverage pass (version 4).** The component level was widened from prop-only components to the whole editor: `@cesdk/engine` is replaced with a concrete fake, the real `EditorProvider` mounts over it, and the tests drive the shipped screens. That is what MB-C10 to MB-C22 are. Nothing in `src/**` changed.

**Dead code removed in this pass.** `getImageSize` in `src/imgly/creative-engine-utils.ts` had no caller. `FontSelect`'s scroll-into-view effect sat behind a `SCROLL_INTO_VIEW_ENABLED = false` constant, so the effect, the `activeFont` memo and the per-typeface `createRef` went with it. `StickerAdjustmentBar` kept selection state and two memos for an adjustment list that is empty, and is now the panel and the inspector bar it actually renders. `setProperty` and `useProperty` branched on `Array.isArray` over a rest parameter, which is always an array, so the two dead `else` branches are gone.

**Coverage pass (version 6).** MB-C38 to MB-C45 close the last branch arms the earlier suites left: the entry point with its root container present, the colour picker's hex string next to a palette colour, a typeface with no regular font, an inspector entry that carries its own handler, an asset with no label, the panel headline fallback, and the property setter before the engine is up. `EditorContext` now holds the engine it created in a ref, so the unmount really disposes it (known issue 13); MB-C45 proves it.

**The kit now names its controls.** Every icon-only control carries an `aria-label` with the kit's own wording — the add bar (Text, Image, Sticker, Shape), the top bar (Canvas size, Undo, Redo), the adjustment bars (Font, Alignment, Color, Crop, Replace, Delete), the alignment options, the colour swatches (their `#rrggbbaa` value), the asset thumbnails (the asset's own label), the sticker group select, the modal close and the panel collapse. Nothing changed visually. MB-02 to MB-14 and MB-19 are therefore implemented, the positional page object is gone, and MB-A11Y now asserts the names instead of pinning their absence.

## 1. Purpose

Verify that the Mobile UI starter kit works as shipped: the social-media scene loads into a phone-shaped editor, the bottom bar switches with the selection, the slide-up panels add and adjust text, images, shapes and stickers, the canvas-size modal resizes the design, and the download button exports a PNG.

## 2. Scope

In scope

- Start-up: the four asset sources the kit registers, the upload source, and `public/social-media.scene`
- The selection-driven bottom bar and the slide-up panel, including the padding it feeds back to the canvas focus
- Add text, image, shape and sticker; the sticker group filter; upload
- The adjustment bars: font, alignment, colour, crop, replace, delete
- The canvas-size modal and the four presets
- Undo, redo and export
- The kit's own code under `src/imgly/` and `src/app/`

Out of scope

- What the engine does with a colour, a font, a crop, a content-aware resize or an export option. Engine behaviour; see section 10.
- The demo site around the kit (cards, tags, links, platform toggles). Covered by the `cesdk_web_demos` suite. Qase 45, 46, 47, 48, 49, 66, 312.
- The mobile-app layer (iOS and Android simulators, install-by-QR, the mobile documentation links). Not part of this web kit. Qase 67, 69, 70, 72, 73, 74, 4388, 4389.

## 3. Test environment

- Browser: Chrome, headless, 1400 × 900. Above 650 px the kit renders inside a fixed 350 × 640 phone frame, so the viewport size does not change what is tested; see known issue 1.
- Engine: `@cesdk/engine` built from this repo, served locally. Requests to `cdn.img.ly` fail the test.
- License: the shared test license (valid on hostname `localhost` only)
- Data: the kit's own `public/social-media.scene` — one page, 1080 × 1920 px, pixel design unit, 300 dpi. Images, shapes, stickers and typefaces all come from the bundled asset packs through `engine.getBaseURL()`, so this kit needs no demo-asset host and no secret. No `cdnAllowlist`. The scene's four Manrope font URIs are relative to the engine's `baseURL`, so the suite runs with the CDN guard at its default.
- Headless: `@cesdk/node` through the shared harness engine helper. Node, no DOM. The `src/imgly/index.ts` barrel is importable now that `upload.ts` builds its input lazily. Asset sources are read from `apps/cesdk_web/build/assets`, the pack the browser is served; the shared test engine's own base URL points at the repository's versioned `assets/`, which carries no `ly.img.image` source.
- Component: Vitest with `// @vitest-environment jsdom`, React Testing Library, the kit's own Vite plugins. See open question 1.
- Downloads: captured by Playwright and checked by file type and decoded pixel size

## 4. Approach

| Kind      | Tool                          | What it checks                                               | Run                 |
| --------- | ----------------------------- | ------------------------------------------------------------ | ------------------- |
| Static    | tsc, eslint, convention check | Types, deprecated APIs, kit folder shape                     | `npm run check:all` |
| Unit      | Vitest                        | Colour conversion, the size presets, the debounce hook       | `npm run test:unit` |
| Headless  | Vitest + `@cesdk/node`        | The block-placement helper and the kit's source set-up       | `npm run test:unit` |
| Component | Vitest + jsdom + RTL          | The kit's components and the whole editor over a fake engine | `npm run test:unit` |
| Browser   | Playwright                    | The test cases in section 5.1                                | `npm run test:e2e`  |

All five run in the kit's `ci` script. This kit is the thinnest of the batch on the engine side: almost every decision it makes is a React one, so component cases carry more weight here than headless ones.

## 5. Test cases

Format: ID, level, Qase id, title. Then steps and expected result.
Common precondition for all browser cases: the kit is open and the scene has finished loading.

### 5.1 Browser

**MB-01 · browser · Editor loads with the social-media scene** _(implemented)_
Steps: open the kit.
Expected: one 1080 × 1920 page on the canvas inside the phone frame. A top bar with the size, undo, redo and download buttons, and a bottom bar offering add text, image, sticker and shape. No console errors. No engine asset from `cdn.img.ly`.

**MB-02 · browser · Qase 53 · Add a text block** _(implemented)_
Steps: open the add-text panel, pick a typeface.
Expected: a text block is added with font size 40, `Center` alignment, `Auto` height mode and half the page width, placed by `autoPlaceBlockOnPage` and selected. The bottom bar switches to the text bar.

**MB-03 · browser · Qase 54 · Edit the text** _(implemented)_
Steps: double-click the block, type a word, leave text mode.
Expected: `text/text` holds the typed value and the canvas re-zooms to the page when text mode ends.
Note from the run: the case writes through `replaceText` rather than the canvas, because typing needs a canvas gesture; what the kit decides here is nothing, so the engine value is the whole assertion.

**MB-04 · browser · Qase 55 · Emoji in text** _(implemented)_
Steps: type an emoji.
Expected: it is stored in `text/text` and rendered from the emoji fallback font.
Note from the run: written through `replaceText`, as MB-03. The emoji font is not fetched, so the kit needs no allowlist for it.

**MB-05 · browser · Qase 1818 · Change the text font** _(implemented)_
Steps: select the text block, open the font panel, pick another typeface.
Expected: `setFont` is called for every selected block with that typeface's font. Exactly six typefaces are offered — Caveat, Courier Prime, Roboto, Oswald, Parisienne and Manrope — because the kit filters the bundled typeface source against its own list. Each is previewed live in its own face, not from `public/font-previews/`; see known issue 2.

**MB-06 · browser · Text alignment and colour** _(implemented)_
Steps: with the text block selected, set alignment to Left, then pick a colour swatch.
Expected: `text/horizontalAlignment` becomes `Left` with one undo step, and `fill/solid/color` becomes the swatch colour. Colour changes are suppressed while dragging and a single undo step is added 200 ms after the last change.

**MB-07 · browser · Qase 51 · Add a pre-loaded image** _(implemented)_
Steps: open the add-image panel, click a thumbnail.
Expected: the list comes from the bundled `ly.img.image` source filtered to `ly.img.image.*`, and applying an asset adds a graphic with that image fill, selected.

**MB-08 · browser · Qase 52 · Upload an image** _(implemented)_
Steps: open the add-image panel, click Upload, choose a PNG.
Expected: the file is measured, added to the `ly.img.image` source and applied. The `ly.img.image.upload` source the kit also registers stays empty; see known issue 3.

**MB-09 · browser · Replace an image** _(implemented)_
Steps: select an image, open Replace, click a library thumbnail.
Expected: `applyToBlock` is called with the selected block, the crop is reset and the panel closes. Replacing by upload instead does none of those three; see known issue 4.
Note from the run: asserted through the block's fill URI, the unchanged child list and the closed panel; the upload half is MB-08.

**MB-10 · browser · Crop an image** _(implemented)_
Steps: select an image, open Crop, drag Scale, drag Straighten, click Reset, click Done.
Expected: Scale writes `setCropScaleRatio` then `adjustCropToFillFrame` over 100–400; Straighten writes `crop/rotation` over −45° to 45° and re-fills the frame; Reset calls `resetCrop`; Done returns edit mode to `Transform`.
Note from the run: the two sliders are driven with the arrow keys, which is what a role-and-name locator can do to a `react-slider` thumb.

**MB-11 · browser · Qase 56 · Add a shape** _(implemented)_
Steps: open the add-shape panel, click one.
Expected: a graphic with that vector shape is added and selected. The list is `ly.img.vector.shape` filtered to `ly.img.vector.shape.filled.*`.

**MB-12 · browser · Qase 58 · Change the shape colour** _(implemented)_
Steps: with the shape selected, open Color, click a swatch, then use the picker.
Expected: `fill/solid/color` follows both. The palette is the six colours the kit hardcodes.

**MB-13 · browser · Qase 61 · Add a sticker** _(implemented)_
Steps: open the add-sticker panel, click one.
Expected: a graphic with that sticker's image fill is added and selected.

**MB-14 · browser · Qase 78 · All stickers render, and the group filter works** _(implemented)_
Steps: open the add-sticker panel, read the list, then pick each group in the dropdown.
Expected: every entry shows its thumbnail from the bundled source. The dropdown lists All first, then the groups the source reports, labelled from the kit's own map — Doodle, Emoji, Emoticons, Craft, 3D Grain, Florals, Hands, Stickers — with an unmapped group falling back to its capitalised id. Selecting a group narrows the list. Currently the dropdown does not reflect the selected group as a controlled value; see known issue 5.
Note from the run: the source reports seven groups, in the order Emoji, Emoticons, Craft, 3D Grain, Hands, Doodle, Florals — `stickers` is not among them. Each sticker is named by its own label, so the filter is asserted by name.

**MB-15 · browser · Qase 79 · Change the design size** _(implemented)_
Steps: open the size modal, read the four options, click Full HD.
Expected: the modal shows IG Post 1200x1200, IG Story 1080x1920, Full HD 1920x1080 and 4K 3840x2160. Clicking one calls `resizeContentAware` on every page with those dimensions and re-zooms. The page is then 1920 × 1080. No undo step is added; see known issue 6. MB-U4 pins the 3840 value.

**MB-16 · browser · Delete a block** _(implemented — the delete button is reachable, it is the last control of the image bar)_
Steps: select the shape, click the delete button.
Expected: the block is destroyed and one undo step is added. The button is only rendered for text, image, shape and sticker kinds. Its intended "Delete" label does not render; see known issue 8.

**MB-17 · browser · Undo and redo** _(implemented)_
Steps: add a text block, click undo, then redo.
Expected: the block disappears and returns, and the canvas re-zooms each time. Both buttons are disabled when there is nothing to undo or redo, and while the editor is in crop mode.

**MB-18 · browser · Qase 65 · Export the design** _(implemented)_
Steps: click the download button.
Expected: the kit calls `engine.block.export` on the current page with `mimeType: 'image/png'`, and one file downloads whose decoded size is the page size.
Note from the run: the kit passes `my-design` with no extension and Chrome appends `.png` from the blob type, so the downloaded file is `my-design.png`. The "no extension" half of known issue 9 is therefore not user-visible in Chrome; the missing `try`/`catch` still is.

**MB-19 · browser · The panel pushes the canvas up** _(implemented)_
Steps: open a slide-up panel and expand it.
Expected: the panel's height is fed into the focus padding, so the page stays fully visible above it, and collapsing restores the padding.
Note from the run: asserted as the page's screen-space bottom edge sitting above the panel, and returning to its old value on collapse.

**MB-20 · browser · Selection drives the bottom bar** _(implemented, for the image bar)_
Steps: select a text block, then an image, then a sticker, then click empty canvas.
Expected: the bar is the text bar, the image bar, the sticker bar (delete only), then the add bar. Selecting a second block also falls back to the add bar, because the kit only routes single selections.

### 5.2 Headless (no browser, real engine)

**MB-H1 · headless · `autoPlaceBlockOnPage`**
With `Math.random` stubbed to 0, place a block on a 1080 × 1920 page. Expected: appended to the page, both position modes `Absolute`, x is 270, and **y is 480**. Split into two cases: the placement and the modes pass; the y assertion is `it.fails`, because the helper reads the page width twice and the block lands at 270. Known issue 10.

**MB-H2 · headless · Deselect before placing**
With two blocks selected, place a third. Expected: the previous selection is cleared, only the new block is selected, and one undo step is added.

**MB-H3 · headless · The kit's asset sources**
Reproduce the four `addLocalAssetSourceFromJSONURI` calls and the `addLocalSource` call the kit makes. Expected: `ly.img.typeface`, `ly.img.vector.shape` (filled only), `ly.img.sticker`, `ly.img.image` (`ly.img.image.*` only) and `ly.img.image.upload` are all registered; the shape and image matchers exclude everything else; the sticker source reports the groups the filter map names.

**MB-H4 · headless · The font subset**
Query `ly.img.typeface` and filter it against the kit's six names. Expected: all six resolve to a typeface in the bundled source, so no entry in the picker is silently dropped.

**MB-H5 · headless · The four size presets are usable**
For each preset, `resizeContentAware` the page to those dimensions. Expected: each call succeeds and the page reports the requested size. The 4K preset is 3840 wide since 6b.

### 5.3 Component (jsdom, React Testing Library)

**MB-C1 · component · IconButton drops its children**
Two cases: a passing one asserting that only the icon renders today, and an `it.fails` one asserting the children render — the case to delete once the button is fixed. Three more cases cover the active class, the icon colour, the size and theme variants, and the prop spread.
Note from the run: the "every inspector label" half of known issue 8 is wrong. No adjustment in this kit sets `label`, so `Delete` is the only text the fix would reveal.

**MB-C2 · component · InspectorBar**
With `hasDeleteButton` false: entries are partitioned into left, middle and right by their `align`, defaulting to middle; clicking the active entry toggles it off; the active entry is marked.

**MB-C3 · component · CanvasSizeModal presets**
Four buttons with the names IG Post, IG Story, Full HD and 4K and the dimension texts `1200x1200`, `1080x1920`, `1920x1080` and `3840x2160`. Each preview keeps the preset's aspect ratio. Clicking one passes those dimensions up.

**MB-C4 · component · Modal and Card**
`Modal` renders its title as a heading and fires `onClose`. `Card` renders its background image only when one is given, uses `ariaLabel` as the image's alt text and is a `type="button"` button.

**MB-C5 · component · AlignmentSelect and Select**
`AlignmentSelect` offers three options and emits exactly `Left`, `Center` and `Right`. `Select` calls `onChange` with the chosen value, not the event.

**MB-C6 · component · Slider and SliderLabel**
`Slider` forwards its react-slider props and strips `trackStartValue`, which nothing uses. `SliderLabel` renders its label next to the control. The label is a `span`, not a `label`, so it is not associated with the slider; see known issue 11.

**MB-C7 · component · FontPreview**
Picks the normal/normal font, falls back to the first font, emits an `@font-face` rule with the font URI and renders the typeface name when no text is given.

**MB-C8 · component · `useDebounceCallback`**
Fires once after the delay, uses the latest callback, and resets the timer on a repeat call. This is what turns a colour drag into one undo step.

The cases below mount the whole kit through `EditorProvider` with `@cesdk/engine` replaced by `tests/component/support/fakeEngine.ts`, a concrete stand-in whose getters answer with the shapes the kit destructures and whose setters record. They assert what the kit passes to the engine, never what the engine does with it.

**MB-C10 · component · The editor boots through `EditorProvider`**
The spinner gives way to the top bar; the four JSON asset sources are registered in order against `engine.getBaseURL()`, the shape source with the `ly.img.vector.shape.filled.*` matcher, the upload source with the kit's mime list; the scene URL ends in `/social-media.scene`; the three mobile settings are written; the engine canvas is appended into `#cesdk`.

**MB-C11 · component · The provider mirrors engine state into React**
An engine event switches the bottom bar to the selected block's kind; an empty event batch changes nothing; a state change into `Crop` disables the top bar; `canUndo`/`canRedo` drive the two history buttons; the engine is published on `window.cesdk`.

**MB-C12 · component · Single-page focus**
Once the pages are known the current page is zoomed to with the kit's 8 px padding on all four sides. A multi-page scene shows only the current page; a single-page scene is left alone. Leaving text edit mode refocuses.

**MB-C13 · component · The top bar**
Undo and redo reach the engine. Download exports the current page as `image/png` and hands the blob to an anchor. The size modal resizes every page with the preset's dimensions and closes; closing it without a choice resizes nothing.

**MB-C14 · component · The add-block bar**
Offers exactly Text, Image, Sticker and Shape, opens the matching panel and collapses it again.

**MB-C15 · component · Adding an image**
The panel lists what the source reports, named by the asset's own label and falling back to its id. Selecting one applies it through the asset's own source id. Upload accepts the four mime types, turns the file into an asset carrying the measured dimensions, adds it to `ly.img.image` and applies it.

**MB-C16 · component · Adding a shape and a sticker**
Each is applied through its own source. The group filter lists the groups the source reports under the kit's labels and re-queries with `groups: ['emoji']`.

**MB-C17 · component · Adding text**
Only the six typefaces in the kit subset are offered. Choosing one creates a text block in the regular face at 40 pt, centred, auto height, half the page width, appended to the current page and selected, with one undo step.

**MB-C18 · component · FontPreview**
Renders in the declared face, falls back to the typeface name when no text is given, and to the first font when the requested weight is not offered.

**MB-C19 · component · The bar follows the selected block kind**
Text, image, shape and sticker each get their own headline and controls. Delete is offered for those four kinds and withheld for any other; it destroys the selection with one undo step and leaves crop mode first.

**MB-C20 · component · Text adjustments**
Alignment and colour are written on the selected block — the fill is only what the change subscription listens to. A palette colour adds no undo step of its own. The font is set on every selected block. An engine that cannot report a typeface still renders the list. The collapse control closes the panel.

**MB-C21 · component · Shape colour**
Writes the fill colour and marks the swatch matching the current fill.

**MB-C22 · component · Image crop and replace**
Crop puts the engine into crop mode and opens the panel; Reset resets the crop of every selected block; the scale slider writes the ratio and refills the frame at the ratio the engine reports; the straighten slider converts degrees to radians; Done returns to `Transform`. Replace applies the chosen image to the selected block and resets its crop, and an upload replaces without adding a new asset.

**MB-C23 · component · The two context guards**
`useEditor` outside `EditorProvider` and `useSlideUp` outside a slide-up panel each throw with the kit's own message.

**MB-C24 · component · The provider drops an engine it no longer needs**
An editor unmounted before `CreativeEngine.init` resolves disposes the engine it gets back.

**MB-C25 · component · Property access without a block**
`useProperty(undefined, …)` hands back a null value and a no-op setter. A read the engine rejects is logged and swallowed; so is a write.

**MB-C26 · component · The inspector bar without a deletable selection**
A selection whose kind the kit does not delete gets no delete button.

**MB-C27 · component · The asset grids filter by group**
`ImageSelect` and `ShapeSelect` pass `groups: [group]` to their own source when one is given.

**MB-C28 · component · The alignment icon**
Each of the three alignments renders a different icon, and an alignment the kit does not know falls back to the centre one.

**MB-C29 · component · Collapsing each panel**
The text, image and sticker add panels and the shape colour panel each close from their collapse control.

**MB-C30 · component · The file picker and the image measurement**
The picker rejects when it reports no files. `getImageDimensions` resolves with the decoded size and rejects on the error event.

**MB-C31 · component · Single-page focus in text edit mode**
In text edit mode with a laid-out cursor the kit scrolls the camera to the cursor instead of zooming to the page.

**MB-C32 · component · The bars render nothing before the engine is up**
The top bar and the bottom bar render empty while `engineIsLoaded` is false.

**MB-C33 · component · Refocus on a viewport resize**
A `resize` on the visual viewport refocuses. A second state change in text mode drives the cursor subscription.

**MB-C34 · component · The entry point**
A missing `#root` is reported through `console.error` rather than failing silently.

**MB-C35 · component · The focus hook before it is enabled**
`refocus()` does nothing while the hook is switched off.

**MB-C36 · component · The crop refocus option the kit leaves off**
With `setRefocusCropModeEnabled(true)` the hook zooms to the selected block in crop mode instead of to the page, does nothing when nothing is selected, and honours padding set after mount. The kit itself never enables this, so these paths exist only through the hook's own API.

**MB-C37 · component · The page zoom guards**
A page block the engine no longer reports as valid is skipped. `setCurrentPageIndex` moves the zoom and the visibility to the chosen page.

**MB-21 · browser · Text edit mode leaves the camera alone until a cursor exists** _(implemented)_
Steps: select the text block, put the engine into `Text` edit mode.
Expected: the kit stays in text edit mode, `getTextCursorPositionInScreenSpaceY()` is 0 and the camera does not move. Only a canvas gesture lays a cursor out; see known issue 12.

**MB-C38 · component · The entry point renders the app**
With a `#root` container in the page, importing `src/index.tsx` mounts the editor into it and logs no start-up failure. MB-C34 is the missing-container half of the same entry point.

**MB-C39 · component · The colour palette and the colour picker**
A palette swatch reaches `onClick` as an engine colour; the picker reaches it as a hex string the kit converts first.

**MB-C40 · component · The font list falls back**
A typeface that ships no `normal`/`normal` font selects its first font instead.

**MB-C41 · component · An inspector entry that carries its own handler**
The entry's `onClick` runs and the bar closes the panel instead of opening it. Known issue 16 is the precedence this pins.

**MB-C42 · component · An asset with no label**
A shape card and a sticker card fall back to the asset id for their accessible name.

**MB-C43 · component · The panel headline**
A header with no `headline` of its own shows the panel's `defaultHeadline`.

**MB-C44 · component · The property setter before the engine is up**
`useProperty` hands out a setter as soon as it has a block; calling it while the provider still reports no engine does nothing instead of throwing.

**MB-C45 · component · The provider disposes the engine it created**
Unmounting after the editor has loaded disposes the engine. MB-C24 is the in-flight half.

### 5.4 Unit (no browser, no engine)

**MB-U1 · unit · `hexToRgba`**
`#ffffff` → 1,1,1,1. `#00000080` → alpha 0.502. `#abc` expands to `#aabbcc`. Any other length throws with the kit's message. The one-character `#f` branch expands to six repeats.

**MB-U2 · unit · `rgbaToHex`**
Round-trips `hexToRgba` for the six palette colours and always emits the 9-character `#rrggbbaa` form. The colour picker is fed that 8-digit value directly; MB-C6 and MB-12 are what prove it is accepted.

**MB-U3 · unit · `isColorEqual`**
True inside the 0.001 default precision, false outside, and honours an explicit precision.

**MB-U8 · unit · `pixelToCanvasUnit`**
The identity for a pixel scene at zoom 1; divides by the device pixel ratio and the zoom level; converts through the scene dpi for a millimetre and an inch scene.

**MB-U9 · unit · `zoomToSelectedText`**
Does nothing while the cursor has no laid-out position or when the selection is not exactly one block. Leaves the camera alone while the cursor is inside the visible area, and moves it when the cursor falls below the area or above the top padding. A shrunken visual viewport reduces the visible area.

**MB-U10 · unit · `getImageDimensions`**
Resolves with the image size once it loads and rejects on the error event.

**MB-U11 · unit · `caseAssetPath`**
Makes a kit-relative path absolute against the page and leaves an `http`/`https` URL alone.

**MB-U4 · unit · The size presets as data**
Four entries, unique names, positive integers, and the label text built as `${width}x${height}`. Pins the 3140 value so a fix is a deliberate change.

**MB-U5 · unit · The sticker group labels**
Every id in the kit's label map is lower-case and maps to a display string; an id outside the map falls back to its capitalised form.

## 6. Entry and exit criteria

Entry: the engine built; test license available; the shared kit test harness extended for component tests (open question 1) and able to wait on a kit that exposes the engine rather than a CE.SDK instance (known issue 12); the kit's `test:unit` and `test:e2e` scripts replaced with the real commands (they are `exit 0` today).

Exit: every case in section 5 passes locally and in CI. `npm run ci` passes. The published kit contains no test files. A release run reports results to the Qase ids above.

## 7. Known issues found while writing this plan

Confirm each with a test before fixing.

1. The README calls the layout responsive; above 650 px the kit is pinned to a fixed 350 × 640 phone frame. It also claims 44 × 44 px touch targets, while the icon buttons are about 40 px and the small variant about 32 px.
2. `public/font-previews/` holds 50 PNGs that nothing references. Font previews are rendered live from an injected `@font-face`, so a missing preview image shows nothing and an unreachable `font.uri` degrades silently to the system font with no error path. `public/assets/remove-bg.png` is orphaned too, and two exported constants point at a `public/images/` directory that does not exist.
3. `ly.img.image.upload` is registered with seven mime types and never written to; uploads go to `ly.img.image` with a different, shorter list that omits webp, bmp and apng. Two lists that disagree, one dead source.
4. Replacing an image from the library resets the crop and closes the panel; replacing by upload does neither, so the new image inherits the old crop and the panel stays open.
5. `StickerSelectFilter` declares a `currentGroup` prop and never reads it, so the `select` is uncontrolled and the value passed in is ignored. Its effect also omits `engine` from its dependencies.
6. The canvas-size change adds no undo step and its async handler is not awaited.
7. **Fixed in 6b.** The 4K preset is 3140 × 2160. It should be 3840 × 2160.
8. **Fixed in 6b.** `IconButton` drops `children`, because the rest spread carries them and the explicit JSX child wins. Still true, and still pinned by MB-C1 — but no component passes children to it any more, so nothing depends on it. **The accessible names were added as `aria-label` instead**, which is what MB-02 to MB-14 and MB-19 needed and what leaves the look unchanged. `InspectorBar` now feeds each adjustment's `label` to `aria-label` rather than to children.
9. The export has no `try`/`catch`: a failure leaves the button disabled forever. The file downloads as `my-design` with no `.png` extension, and `currentPageBlockId` may be undefined at that point.
10. **Fixed in 6b.** `autoPlaceBlockOnPage` computes the vertical base from `getWidth(page)`, so on this kit's 1080 × 1920 page every added block lands too high. The same line exists in the apparel, photobook and postcard kits.
11. Accessibility. **Mostly fixed.** Every control now has a name, each thumbnail is named by its own asset, the sticker select is labelled and the two crop sliders carry `ariaLabel`. What stands: `*:focus { outline: none }` is applied globally with no `:focus-visible` replacement, the modal has no dialog role, focus trap or Escape handler, and the slider labels are still spans rather than `label` elements (MB-C6).
12. ~~The kit publishes no test hook behind an env flag.~~ **Fixed.** The assignment sits in `//START_HIDDEN_BLOCK`, which the publish script strips, and the entry file's `Window` declaration is now `cesdk` rather than `engine`. The harness accepts a bare `CreativeEngine` since S2 (`kind: 'engine'`).
13. `CESDKCanvas` unmounts with `container.remove(canvas)`. `Element.remove()` takes no arguments, so this removes the wrapper and leaks the engine canvas. The `EditorContext` half is **fixed**: its cleanup closed over the first render's `engine`, which is always `null`, so an editor that finished loading leaked its engine on unmount. The provider now keeps the engine it created in a ref and disposes that. MB-C45 covers the loaded path, MB-C24 the in-flight one.
14. **Moot.** `UseSelection` deselected `currentSelection[0]` on every iteration instead of the block it was looking at, inside a `setState` updater with a 200 ms timer. The file is deleted; see issue 20. The same code still runs in the apparel and photobook kits.
15. ~~`useSelectedProperty` tests `Array.isArray` on a rest parameter, which is always true, so both `else` branches are dead.~~ **Fixed:** both dead branches are deleted. It still dispatches a `Double` property type that CE.SDK does not have.
16. `InspectorBar` builds its click handler as `(onClick && onClick()) || active === id ? … : …`, where `||` binds tighter than the conditional. It works today only because no adjustment defines an `onClick`.
17. `ChangeCropSecondary` and `ChangeImageFileSecondary` index `selectedBlocks[0]` with no guard, so clearing the selection while a panel is open throws.
18. `.env.example` now also documents `VITE_IMGLY_LOCAL_ASSETS_URL`. The rest stands: `VITE_IMGLY_LOCAL_ASSETS_URL`, which both the entry file and the editor context read, is undocumented, and it is only injected by the `cesdk-engine-dev` wrapper — `npm run build` and `npm run preview` are plain Vite. There is no license guard and `loadEditor()` is called with no `.catch`, so a missing license leaves the kit on the spinner with the failure only in the console. `npm run secrets` needs the 1Password CLI, internal tooling in a customer-facing kit.
19. `useSelectedProperty` read `UseSelection`'s selection while `BottomControls` read `EditorContext`'s, and the two disagreed for a whole tick after a selection change — selecting an image and then a text block rendered the text bar against the image block, `rgbaToHex(undefined)` threw and the bar died. **Fixed:** the kit has one selection source again (`EditorContext.selectedBlocks`) and `UseSelection.tsx` is gone. MB-20 pins it.
20. **A text cursor position needs a canvas gesture.** `engine.editor.setEditMode('Text')` puts the engine into text mode but lays no cursor out, so `getTextCursorPositionInScreenSpaceY()` stays 0 and `zoomToSelectedText` takes its early return. MB-21 pins that. The body past the guard is covered by MB-U9 and MB-C31 in jsdom; in the browser it needs a real double-tap on the canvas, which this suite does not do.

21. `useProperty` subscribed through `engine.block.getFill(block)` for any `fill/` property, which throws `BLOCK.FILL_MISSING` on a text block. **Fixed** with a `supportsFill` guard.

22. The `Adjustment` interface is copy-pasted verbatim in five files, `ALL_ALIGNMENTS` in two, and `TextColorIcon` and `ShapeColorIcon` are byte-identical. `src/imgly/color-utilities.ts` and `src/imgly/creative-engine-utils.ts` are near-identical copies of the apparel kit's, differing only in comments and formatting.

## 8. Open questions

1. ~~Component tests need a jsdom environment and the kit's Vite plugins.~~ **Done in S2.** `vite-plugin-svgr` needs `include: '**/*.svg'` in the kit's vitest config, and `react-slider` needs a `ResizeObserver` stub, which the one component file that renders it defines.
2. ~~Issue 8, restated: naming the controls needs `aria-label` per control.~~ **Done.** The names are in, with no visual change, and the 13 browser cases they blocked are written. The `IconButton` children bug itself is untouched and no longer reachable from the kit.
3. **Fixed in 6b.** Issue 7: 4K should be 3840 × 2160. Not decided, so MB-U4 pins 3140 with a passing case and 3840 with `it.fails`. Recommended: fix, then delete the `it.fails` case.
4. ~~Issue 12.~~ **Done.** The fleet convention is an unconditional `window.cesdk` inside `//START_HIDDEN_BLOCK`, no env gate.
5. Issue 2: delete `public/font-previews/` and `public/assets/remove-bg.png`, or wire the previews into the font picker. Recommended: delete; 50 unused PNGs ship in every copy of the kit.

## 9. Estimate

20 browser cases at about 8 s each: about 3 minutes on one worker. Headless about 30 s. Component and unit cases under 2 s.

## 10. Boundary review

Rule used: the code that makes a decision owns the test for it. This kit has no CE.SDK editor UI — it drives `@cesdk/engine` directly — so the boundary is only between the kit and the engine. The kit decides which asset sources exist and how they are filtered, the six-name font subset, the sticker group labels, the six-colour palette, the text defaults, where a new block lands, the four size presets, which bar the selection shows, and the export mime type. The engine decides what any of those values produce.

Core behaviour this plan leans on, and where it is covered today:

| Behaviour                                                                                                  | Owner  | Covered by                                                                                                                                                                                                       |
| ---------------------------------------------------------------------------------------------------------- | ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `addLocalAssetSourceFromJSONURI` with a matcher registers only the matching assets                         | engine | `engine/lib/test/api/AssetAPITest.cpp` `AddLocalAssetSourceFromJSONString`, `AddLocalAssetSourceFromJSONURI_InvalidURI`; `AssetSourceAPITest.cpp`                                                                |
| `addLocalSource`, `addAssetToSource`, `getSupportedMimeTypes`, `getGroups`                                 | engine | `engine/lib/test/api/AssetAPITest.cpp` `AddAndFindLocalAssetSource`, `AddAndRemoveAssetFromSource`, `GetAssetSourceSupportedMimeTypes`, `GetAssetSourceGroups`                                                   |
| `asset.apply` and `applyToBlock` create or update a graphic with an image fill                             | engine | `AssetAPITest.cpp` `DefaultApplyAsset`, `DefaultApplyAssetToBlock`; `UBQApplyAssetCreationDeepAPITest.cpp`                                                                                                       |
| `setFont` with a typeface, and emoji fallback                                                              | engine | `engine/lib/test/api/BundledTypefaceAPITest.cpp`; `bindings/wasm/js_node/src/__tests__/systemFontFallback.test.ts`                                                                                               |
| `text/text`, `text/fontSize`, `text/horizontalAlignment`, `Auto` height mode                               | engine | `engine/lib/test/api/BlockTextTest.cpp`, `TextDeepAPITest.cpp`, `BlockLayoutTest.cpp`                                                                                                                            |
| `getTypeface` on a text block with no typeface returns an error rather than a value                        | engine | `engine/lib/test/api/BlockTextTest.cpp` (the `setTypeface / getTypeface / getTypefaces` block)                                                                                                                   |
| `fill/solid/color` set and read back                                                                       | engine | `engine/lib/test/api/BlockPropertiesTest.cpp`, `ColorAccessorAPITest.cpp`                                                                                                                                        |
| `setCropScaleRatio`, `crop/rotation`, `adjustCropToFillFrame`, `resetCrop`                                 | engine | `engine/lib/test/api/CropAPITest.cpp`, `AppearanceRoundTripAPITest.cpp`                                                                                                                                          |
| Undo, redo, `canUndo`, `canRedo`, `addUndoStep`                                                            | engine | `engine/lib/test/api/HistoryAPITest.cpp`                                                                                                                                                                         |
| `zoomToBlock` with padding, `setVisible`                                                                   | engine | `engine/lib/test/api/SceneAPITest.cpp`, `EditorAPITest.cpp`                                                                                                                                                      |
| `lifecycle/destroy` scope and `destroy`                                                                    | engine | `engine/lib/test/api/ScopesAPITest.cpp`, `BlockLifecycleAPITest.cpp`                                                                                                                                             |
| PNG export of a single page at the page's pixel size                                                       | engine | `engine/lib/test/api/ExportAPITest.cpp` `ExportToBuffer`, `ExportToBuffer_WithOptions`, `ExportToBuffer_PNG_CompressionMatrix`                                                                                   |
| `resizeContentAware` succeeds, rejects an invalid block, tolerates an empty list, and shifts sibling pages | engine | `engine/lib/test/api/BlockLayoutTest.cpp` `ResizeContentAware_HappyPath`; `MiscCoreAPITest.cpp` `resizeContentAwareEmptyListReachable`, `resizeContentAwareRejectsInvalidBlock`, and the sibling-page shift case |
| `event.subscribe` with an empty block array fires for any block                                            | engine | `engine/lib/test/api/EventSubscriptionDeepAPITest.cpp` `subscribeUnfilteredFiresOnAnyBlock`                                                                                                                      |

Core coverage gaps found (candidates to add in the core suites, not in this kit):

1. Engine: `resizeContentAware` does not assert the resulting size. `ResizeContentAware_HappyPath` checks only that the call succeeds, and the `MiscCoreAPITest.cpp` case checks the sibling page's shift, not the resized page's own width and height. Qase 79 is exactly "the page is now 1920 × 1080", and the kit cannot own that assertion. Suggested home: `BlockLayoutTest.cpp`, next to the existing case.

Until gap 1 is closed, MB-15 keeps its page-size assertion as the end-to-end proof.

## 11. Coverage residue

`npm run ci` reports **lines 99.83 %, branches 99.53 %, functions 99.34 %**. Four lines, two branches and one function of `src/**` are uncovered, all unreachable by construction.

| Where                                                                 | What                                                                             | Proof                                                                                                                                                                                                                                                                                                                                                                 |
| --------------------------------------------------------------------- | -------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/app/components/StickerAdjustmentBar/StickerAdjustmentBar.tsx` 11 | the `onAdjustmentChange` no-op the bar passes to `InspectorBar`                  | `InspectorBar` calls that prop only from the button it renders per adjustment, and the sticker bar passes an empty list, so no button exists to call it. The prop is required, so the no-op cannot be dropped.                                                                                                                                                        |
| `src/app/hooks/UseSinglePageFocus.ts` 130, 131 and branches 129, 155  | the `!enabled \|\| !engine` guards inside `zoomToPage` and `zoomToSelectedBlock` | Neither callback is returned from the hook. Every call site — `refocus`, the `hideOtherPages` effect, the ResizeObserver callback and the visual-viewport listener — sits behind the identical guard in the same render, so the inner one can never be the one that fires. The guard also narrows `engine` from `CreativeEngine \| null`, so deleting it fails `tsc`. |
| `src/app/hooks/UseSinglePageFocus.ts` 156, 157                        | the bodies of those two guards                                                   | Same proof.                                                                                                                                                                                                                                                                                                                                                           |
