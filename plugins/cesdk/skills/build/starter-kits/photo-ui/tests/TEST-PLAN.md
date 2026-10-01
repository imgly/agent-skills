# Test plan: starterkit-photo-ui

Version 4, 5 Sep 2026. Status: implemented and green. 17 browser tests, 8 headless, 92 component, 45 unit; `npm run ci` exits 0. Merged coverage: lines 99.79 %, branches 99.47 %, functions 100 %. See section 11 for every line and branch that is still uncovered and why.

## 1. Purpose

Verify that the Photo UI starter kit works as shipped: the kit builds a one-page scene whose page fill is the photo, and its own crop, adjust and filter bars write the right engine properties, keep or discard changes when the photo is swapped, and export the result.

## 2. Scope

In scope

- The scene the kit builds itself (`setupPhotoScene`) and the image it picks at start-up
- The three demo photos and the swap flow, including the unsaved-changes modal
- Crop: straighten, scale, flip, rotate, reset
- Adjust: the 12 entries in `src/app/AdjustSecondary/Adjustments.json` and how they map onto the engine's `adjustments` effect
- Filter: the 61 LUT entries in `src/app/FilterSecondary/FilterManifest.json`, `None`, and the intensity slider
- Export Image and the download it produces
- The kit's own React components and the `src/imgly/` modules

Out of scope

- What an adjustment or LUT value does to the rendered pixels, what an export of a given mime type contains, what `resetCrop` or `flipCropHorizontal` do to a block. Engine behaviour; see section 10.
- The demo site around the kit (cards, tags, links, platform toggles). Covered by the `cesdk_web_demos` suite. Qase 158, 159, 160, 161, 162, 163, 314.

This kit has no `mobile-app` Qase cases.

## 3. Test environment

- Browser: Chrome, headless, 1400 × 900
- Engine: `@cesdk/engine` built from this repo, served locally. Requests to `cdn.img.ly` fail the test.
- License: the shared test license (valid on hostname `localhost` only)
- Data: the kit ships no `public/` directory. The three photos and the `None` thumbnail come from `DEMO_ASSETS_BASE_URL`, whose in-repo copy is `packages/cesdk-web-examples-data/data/starterkit-photo-ui/images/`. Browser cases point `VITE_DEMO_ASSETS_BASE_URL` there so the CDN guard stays meaningful. LUT images and their thumbnails come from the bundled asset pack through `engine.editor.defaultURIResolver`.
- The start-up photo depends on the viewport: `window.innerWidth / window.innerHeight > 1` picks `mountains.jpg`. At 1400 × 900 that is always the landscape branch.
- Headless: `@cesdk/node` through the shared harness engine helper. Node, no DOM.
- Component: Vitest with `// @vitest-environment jsdom` per file, React Testing Library, the kit's own Vite plugins. See open question 1.
- Downloads: captured by Playwright and checked by file type and decoded pixel size

## 4. Approach

| Kind      | Tool                          | What it checks                               | Run                 |
| --------- | ----------------------------- | -------------------------------------------- | ------------------- |
| Static    | tsc, eslint, convention check | Types, deprecated APIs, kit folder shape     | `npm run check:all` |
| Unit      | Vitest                        | The two shipped manifests as data, crop math | `npm run test:unit` |
| Headless  | Vitest + `@cesdk/node`        | Every manifest key against a real engine     | `npm run test:unit` |
| Component | Vitest + jsdom + RTL          | The kit's prop-only components               | `npm run test:unit` |
| Browser   | Playwright                    | The test cases in section 5.1                | `npm run test:e2e`  |

All five run in the kit's `ci` script. Browser tests use role, label and text locators; the kit gives several controls a stable `id` (`export-button`, `flip-button`, `rotate-left-button`, `reset-button`), which the tests use only where no accessible name exists. See known issue 1.

## 5. Test cases

Format: ID, level, Qase id, title. Then steps and expected result.
Common precondition for all browser cases: the kit is open and the photo has rendered.

### 5.1 Browser

**PH-01 · browser · Editor loads with the landscape photo**
Steps: open the kit.
Expected: one page whose fill URI ends in `mountains.jpg`. The page size equals the image's natural size. Three thumbnails under "Select Image". Crop, Adjust and Filter tabs. No console errors. No engine asset from `cdn.img.ly`.

**PH-02 · browser · Qase 164 · Crop mask can be adjusted**
Steps: open Crop. Drag the Straighten slider, then the Scale slider.
Expected: the kit sets `crop/rotation` on the page and calls `adjustCropToFillFrame` once per written value. The value text next to each slider follows the drag.
Note from the run: the kit adds **one undo step per written value plus one when the drag stops**, not one per drag — `useProperty` commits on every change. A drag therefore fills the undo stack.

**PH-03 · browser · Qase 4645 · Straighten**
Steps: open Crop, select Straighten, drag to the left end and to the right end.
Expected: the rotation the kit writes stays inside −44° to 45°; the label shows the degree value with a `°` suffix.

**PH-04 · browser · Qase 4646 · Scale**
Steps: open Crop, select Scale, drag.
Expected: the kit reads `getCropScaleRatio`, writes `setCropScaleRatio`, then calls `adjustCropToFillFrame`. The label shows a percentage, and every ratio the kit writes is finite and above 0.
Note from the run: the browser path never reaches a ratio of 0, so known issue 2 is not observable here. It is pinned in PH-U3 with `it.fails` instead.

**PH-05 · browser · Qase 4647 · Flip**
Steps: open Crop, click the Flip button.
Expected: `flipCropHorizontal` is called once on the page and one undo step is added.

**PH-06 · browser · Qase 4648 · Rotate**
Steps: open Crop, click Rotate counterclockwise four times.
Expected: the kit writes `crop/rotation` as `(degrees − 90) mod 360` in radians each time, and after four clicks the rotation is back where it started.
Waits for each rotation to land instead of pacing the clicks.

**PH-07 · browser · Qase 165 · Reset the crop**
Steps: open Crop, straighten and scale, click Reset.
Expected: the page width and height are back to the image's natural size, `resetCrop` is called, rotation is 0, and the canvas re-zooms to the page.

**PH-08 · browser · Qase 166 · Apply adjustments**
Steps: open Adjust. Select Brightness, drag the slider. Select Contrast, drag.
Expected: exactly one `//ly.img.ubq/effect/adjustments` effect is appended to the page for the whole session. `adjustments/brightness` and `adjustments/contrast` hold the dragged values in −1…1. One undo step per change.

**PH-09 · browser · Qase 167 · Reset an adjustment**
Steps: continue from PH-08, click Reset on the Brightness slider.
Expected: `adjustments/brightness` is 0 and `adjustments/contrast` is unchanged. Reset resets one property, not the effect.

**PH-10 · browser · Qase 168 · Apply a filter**
Steps: open Filter, click a named filter.
Expected: one `//ly.img.ubq/effect/lut_filter` effect on the page with `lutFileURI` resolved from the manifest entry, `horizontalTileCount` and `verticalTileCount` from the same entry, and `intensity` 1. The clicked thumbnail is marked active.

**PH-11 · browser · Qase 169 · Reset the filter**
Steps: continue from PH-10. Drag the intensity slider down, click Reset, then click `None`.
Expected: Reset puts `intensity` back to 1. `None` destroys the LUT effect and leaves the page with no filter effect.
The second `None` click is PH-11b, a separate `test.fail` case pinning known issue 3.

**PH-12 · browser · Qase 170 · Cancel a photo swap**
Steps: change something (drag Brightness), click another thumbnail, click Cancel.
Expected: the modal closes, the photo is unchanged and the adjustment is still applied.

**PH-13 · browser · Qase 171 · Discard changes on a photo swap**
Steps: as PH-12, click Discard Changes.
Expected: the new photo is loaded, the scene is rebuilt, and the page carries no effects.

**PH-14 · browser · Qase 172 · Keep changes on a photo swap**
Steps: apply an adjustment, a filter and a crop rotation. Click another thumbnail, click Apply Changes.
Expected: the new photo is loaded, the adjustments and the LUT effect are still on the page, and the crop is reset — the kit's `setImageSource` calls `resetCrop` and resizes the page. This matches the Qase title, which expects only Adjustment and Filter to survive.

**PH-15 · browser · No modal on a clean swap**
Steps: open the kit and click another thumbnail without editing.
Expected: no modal, the photo changes at once. The modal is gated on `editor.canUndo()`.

**PH-16 · browser · Qase 173 · Export the photo**
Steps: click Export Image.
Expected: the kit calls `engine.block.export` on the scene with `mimeType: 'image/jpeg'`, and one file downloads whose decoded size equals the page size.
Note from the run: the kit passes `my-photo` with no extension, and Chrome appends `.jpeg` from the blob's mime type, so the downloaded file is `my-photo.jpeg`. Known issue 4's first half is therefore not user-visible in Chrome; the object URL is still never revoked.

### 5.2 Headless (no browser, real engine)

**PH-H1 · headless · Every adjustment key is a real engine property**
Steps: create a scene with a graphic, append an `adjustments` effect, and for each of the 12 keys in `Adjustments.json` read `getPropertyType('adjustments/<key>')` and write a value.
Expected: all 12 resolve and round-trip. This is the case that would have caught a typo in the kit's own manifest, which the UI currently swallows into `console.error` (known issue 5).

**PH-H2 · headless · Every LUT entry is loadable**
Steps: append a `lut_filter` effect. For each of the 61 manifest entries write `effect/lut_filter/lutFileURI` from `defaultURIResolver('ly.img.filter.lut/' + lutImage)`, plus the entry's tile counts.
Expected: every URI resolves to a file that exists in the bundled asset pack, and every write succeeds. Tile counts are only 5 × 5 or 8 × 8.

**PH-H4 · headless · `initPhotoEditor`**
Steps: call `initPhotoEditor(engine, photo, size)` against `@cesdk/node`.
Expected: `mouse/enableScroll`, `mouse/enableZoom` and `page/title/show` are all off, and the page is sized to the photo.

**PH-H3 · headless · The kit's scene shape**
Steps: reproduce `setupPhotoScene` against `@cesdk/node`: scene in `Pixel` design unit, one page, an image fill on the page, `page/marginEnabled` false, page not clipped.
Expected: the shape matches, a second call replaces the scene rather than adding a page, and `design/arrange` is left denied. `setupPhotoScene` now lives in `src/imgly/photo-scene.ts` and takes the photo size, so the case needs no DOM.

### 5.3 Component (jsdom, React Testing Library)

PH-C1 to PH-C6 and PH-C18 are the kit's prop-only components; none of them touch the engine. PH-C7 to PH-C17 mount the real `EditorProvider` over a concrete fake engine (`tests/component/fake-engine.ts`), so the kit's own contexts, hooks and screens are exercised as the app assembles them. The fake is a plain object with realistic getters, not a recording proxy: the React tree does arithmetic on what it returns.

Three jsdom facts the runs established, all handled in the test files and none of them kit bugs:

- jsdom evaluates no `@media` rule, so every breakpoint-guarded block keeps its `display: none` default. `Export Image`, `Reset` and the whole `Select Image` column therefore carry no accessible name; those controls are located by their own text or by the `alt` the kit gives them.
- jsdom defines no `visualViewport`, and `useSinglePageFocus` reads it as a bare global, so an unstubbed render throws `ReferenceError`. The kit only ever runs in a browser, so this is a test-side stub, not a fix.
- `ResizeObserver` and `Element.prototype.scrollIntoView` need stubbing for the same reason.

**PH-C1 · component · Modal**
`open` false renders nothing. `open` true renders the children and, when `title` is given, the title text. `maxWidth` and `maxHeight` reach the inline style.

**PH-C2 · component · UnsavedChangesModal**
Three buttons: Cancel, Discard Changes, Apply Changes. Cancel calls `onClose` and never `changeImage`. Discard calls `changeImage(url, false)`, Apply calls `changeImage(url, true)`, both followed by `onClose`.

**PH-C3 · component · SliderBar and ResetButton**
Reset is disabled when `resetEnabled` is false. The label is the rounded current value. `onReset`, `onStart` and `onStop` fire.

**PH-C4 · component · TickMarkSvg**
`max − min + 1` marks. Every fifth mark is the large variant. The svg width is `(max − min) × distanceBetweenMarkers + 2`. An even `deadzone` is treated as the next odd number. A tick sitting exactly on the current value does not produce a non-finite opacity.

**PH-C5 · component · FilterButton and ImageSelection**
`FilterButton` renders the thumbnail with the entry id as its `alt` and marks the active entry.
Note from the run: `ImageSelection` is dropped as a component case — it reads the editor context and its three buttons are already asserted end to end by PH-12 to PH-15. The filter thumbnails do carry the entry id as their `alt`, so the filter list is distinguishable; the three photos are `Image 0/1/2`, which is not.

**PH-C6 · component · SmallButton and IconButton**
`disabled` reaches the DOM node. Extra props are spread, which is how Flip and Rotate get their `title`. The active class is applied only when `isActive`.

**PH-C7 · component · The photo screen boots**
`initPhotoEditor` runs once with the picked photo, the three thumbnails and the Crop/Adjust/Filter tools render, the engine canvas is appended into `#cesdk`, and the page is made visible.

**PH-C8 · component · Adjust**
The 12 adjustments render; picking one and resetting writes `adjustments/<key>` as a fraction. A page with no `adjustments` effect gets one created and appended. The tool stays in `Transform` mode, and clicking the open tool again closes the bar.

**PH-C9 · component · Filter**
`None` plus all 61 entries render, each thumbnail resolved through `defaultURIResolver`. Selecting one writes the LUT uri, both tile counts and the intensity. `None` destroys the LUT effect. A page with no LUT effect starts with no active filter.

**PH-C10 · component · Crop**
Entering Crop selects the page, sets `Crop` edit mode, allows `design/arrange` and paints the highlight colour; leaving restores the canvas colour, denies the scope and returns to `Transform`. Straighten and Scale swap the slider. Flip, Rotate and Reset write through the engine.
Note from the run: picking another tool while cropping **leaves** Crop mode. `BottomControls` forces `Transform` for any non-Crop tool, so the crop bar closes; the plan had assumed it stayed open.

**PH-C11 · component · Export**
Clicking Export Image calls `block.export(scene, { mimeType: 'image/jpeg' })` and clicks an anchor whose `download` is `my-photo` and whose `href` is the object URL (known issue 4: no extension, never revoked).

**PH-C12 · component · Swapping the photo**
With no undo history the swap runs straight away through `setImageSource`. With one, the modal opens first; Cancel writes nothing, Discard rebuilds the scene through `setupPhotoScene`, Apply keeps the edits through `setImageSource`.

**PH-C13 · component · `useProperty`**
Reads through the type-specific getter, returns `undefined` without an engine or a block, writes and adds one undo step unless the caller opts out, routes `Bool`/`String`/`Color` to their own setters, reports an engine error into `console.error` instead of throwing (known issue 5), and refreshes on a block event but not on a `Destroyed` one.

**PH-C14 · component · `useSelectedProperty`**
Pins the block that was selected when the hook mounted, and has nothing to read without an engine.

**PH-C15 · component · `useSinglePageFocus`**
Inert until enabled and given an engine. Tracks the scene pages, zooms the current one with all four paddings, re-reads the order when the scene emits, shows only the current page in a multi-page scene, scrolls to the text cursor in `Text` mode, zooms the selected block in `Crop` mode when asked to, and refocuses on a visual-viewport resize.

**PH-C16 · component · Dragging a slider**
A straighten drag writes `crop/rotation` and one undo step and restores canvas interaction; a scale drag writes the crop scale ratio and refits to the frame; an adjustment drag and a filter drag both write their value as a fraction; the filter Reset writes full intensity.

**PH-C17 · component · Cropping with the pointer**
A drag that ends on the canvas recenters after the 400 ms settle. A drag that never started on the canvas changes nothing. A canvas click that returns the engine to `Transform` closes the open bar.

**PH-C19 · component · The bars before the engine is there**
`AdjustSliderBar`, `FilterSliderBar` and `CropModeSecondary` render with a null engine: every control is inert, nothing reaches the engine, and the crop sliders fall back to 0° and 0 %.
Note from the run: an adjustment the kit cannot read reaches the slider as `NaN` (known issue 5). The case pins that.

**PH-C20 · component · The Recenter button**
With `enableAutoRecenter` false and Crop mode, Recenter renders, is disabled until `canRecenter`, and calls `refocus`. With the shipped `ENABLE_AUTO_RECENTER` it never renders (known issue 9).

**PH-C21 · component · The crop drag settle timer**
A second canvas drag restarts the 400 ms settle instead of stacking a second one, and a canvas mousedown marks the wrapper as resizing until the drag ends.

**PH-C22 · component · Slider bounds and labels**
A value above the maximum or below the minimum clamps onto the end tick. Without a formatter the label is the rounded value, `>max` above the range and `<min` below it. With no value at all the internal state opens at the midpoint.

**PH-C23 · component · `useEditor` outside a provider**
Throws with the name of the provider that is missing.

**PH-C24 · component · Unmounting while the engine is still starting**
An engine that finishes `init`, or finishes its scene, after the provider has gone is disposed and never used.

**PH-C25 · component · Editing before the engine is there**
A photo swap requested while the engine is still starting reaches the engine not at all.

**PH-C18 · component · AdjustmentsBarButton**
Renders its label, forwards a ref onto the button, applies the active class only when `isActive`, and puts `iconColor` on the inline style. The component has no call site in the kit today.

### 5.4 Unit (no browser, no engine)

**PH-U1 · unit · The filter manifest as data**
61 assets, unique ids, every asset has `lutImage`, `thumbPath`, `name` and tile counts, tile counts are only 5 or 8, and every id listed in a category exists. Pins that `lomo` is in no category and that the six categories are unread by the kit.

**PH-U2 · unit · The adjustments manifest as data**
12 entries, unique keys, every entry has a label, and each `id` equals its key.

**PH-U4 to PH-U7 · unit · `src/imgly/engine-utils.ts`**
`pixelToCanvasUnit` folds the scene dpi in for `Millimeter` and `Inch` and not for `Pixel`. `zoomToSelectedText` does nothing unless exactly one block is selected, ignores a cursor that has not been laid out, and moves the camera only when the cursor leaves the visible page area. `autoPlaceBlockOnPage` clears the selection, appends, places absolutely and adds one undo step. `getImageSize` resolves with the natural size and rejects on an image error.

**PH-U8 · unit · `uploadFile`**
Builds one hidden input and reuses it across calls, sets `accept` from the mime types and `multiple` only when asked, resolves with the selected files and clears the input, and rejects when the change event carries no file list. The kit has no call site for it (known issue 11).

**PH-U9 / PH-U10 · unit · The entry point**
`src/index.tsx` mounts the app into `#root`, and logs `Failed to initialize application:` instead of throwing when the container is missing.

**PH-U11 · unit · `setImageSource` without a known size**
Measures the photo in the browser, sizes the page to it, writes the fill uri, and re-denies `design/arrange`. Given a size it measures nothing.

**PH-U3 · unit · Crop math**
`cropScaleRatioToZoomPercentage` and `zoomPercentageToCropScaleRatio` are inverses over 1…99 %, `radiansToDegree` and `degreesToRadians` round-trip, and `zoomPercentageToCropScaleRatio(100)` stays finite. `cropScaleRatioToZoomPercentage(0)` is pinned with `it.fails` (known issue 2). The same file pins that `pickInitialImagePath` picks the wide photo on a landscape viewport and that the two constants are named the wrong way round (known issue 10).

## 6. Entry and exit criteria

Entry: the engine built; test license available; the shared kit test harness extended for component tests (open question 1) and able to reach a kit that exposes the engine rather than a CE.SDK instance (known issue 6); the kit's `test:unit` and `test:e2e` scripts replaced with the real commands (they are `exit 0` today).

Exit: every case in section 5 passes locally and in CI. `npm run ci` passes. The published kit contains no test files. A release run reports results to the Qase ids above.

## 7. Known issues found while writing this plan

Confirm each with a test before fixing.

1. Nothing in the UI has a useful accessible name. The three photos are `alt="Image 0"`, `"Image 1"`, `"Image 2"`; every slider is a bare `<button>` whose name is its own value text, with no `role="slider"`, no `aria-valuenow` and no keyboard path; selection state is a CSS-module class, never `aria-pressed` or `aria-current`; the modal has no `role="dialog"`, no focus trap and no Escape. Flip and Rotate do get a name from their `title`.
   **Fixed in this plan's wording, not in the kit:** the `id` props the plan expected to use (`export-button`, `flip-button`, `rotate-left-button`, `reset-button`) never reach the DOM — `SmallButton` destructures `id` and passes it only as the React `key`. Every browser case therefore uses role and name locators, which all resolve. `ResetButton`'s label is `display: none` below 650 px, so it has no accessible name on a narrow viewport; the component test locates it by text for that reason.
2. **Fixed in 6b.** `cropScaleRatioToZoomPercentage(0)` returns `-Infinity`, and `zoomPercentageToCropScaleRatio` clamps only the upper bound. A scale ratio of 0 puts a non-finite value into the slider.
3. **Fixed** for `None`: it no longer calls `engine.block.destroy(undefined)` when there is no LUT effect (PH-11b). Still open: Selecting a LUT whose URI is not in the manifest leaves `activeFilterId` undefined, so no button is highlighted and `document.getElementById(undefined)` runs.
4. The export downloads as `my-photo` with no `.jpg` extension, and the object URL is never revoked.
5. A wrong key in `Adjustments.json` fails silently: `useSelectedProperty` catches the engine error into `console.error`, the getter returns `undefined`, and `NaN` reaches the slider. A wrong filter property name throws instead. The two write paths disagree.
6. ~~The kit sets `window.cesdk = engineInstance` unconditionally, so the debug global ships in the published kit.~~ **Fixed.** The assignment and the `Window` declaration are inside `//START_HIDDEN_BLOCK`, which the publish script strips — the fleet convention settled in S2.
7. `CESDKCanvas` unmounts with `container.remove(canvas)`. `Element.remove()` takes no arguments, so this removes the wrapper and leaks the engine canvas.
8. The Adjust and Filter bars create and append an engine effect during render, not in an effect. Opening a tab mutates the scene as a render side effect.
9. The Recenter button is unreachable: `ENABLE_AUTO_RECENTER` is a hardcoded `true`, so its render condition is never met. `canRecenter` is threaded through three components for it.
10. ~~`INITIAL_IMAGE_PATH` is computed at module load from `window.innerWidth`, so the module cannot be imported outside a browser~~ **Fixed:** `pickInitialImagePath(width, height)` lives in `src/imgly/photo-scene.ts` and the viewport is read in the React layer. The choice still never follows an orientation change, and the two constants are still swapped: a landscape viewport picks the one named portrait. PH-U3 pins both.
11. The README claims image upload, undo and redo, a `public/images/` directory and a `dev:local` script. None of them exist: `uploadFile` has no call site, `editor.undo()` is never called, the photos come from the CDN, and the script is not in `package.json`. Seven icons are orphaned.
12. ~~`useSelectedProperty` uses rest parameters and then tests `Array.isArray`, which is always true, so both `else` branches are dead.~~ **Fixed:** both always-false `else` branches are deleted; the two call sites now spread the rest parameter directly. The hook is still exported from `src/imgly/index.ts` and used nowhere outside the kit's own bars.
13. ~~`src/imgly/index.ts` re-exports `upload.ts`, which calls `document.createElement` at module scope~~ **Fixed:** `uploadFile` builds its input on first use.

## 8. Open questions

1. ~~Component tests need a jsdom environment plus the kit's Vite plugins.~~ **Done in S2:** `defineKitVitestConfig({ kitDir, plugins })` includes `tests/component/**`, each file opts into jsdom with `// @vitest-environment jsdom`, and CSS-module class names arrive unscoped. `vite-plugin-svgr` needs `include: '**/*.svg'` in the kit's vitest config, matching the kit's own `vite.config.ts`; without it an SVG import is a data URL and React throws.
2. ~~Three small source changes this plan depends on.~~ **Done in S4.** The crop math is `src/imgly/crop-math.ts` (not exported from the component — see the S4 report), `setupPhotoScene`, `setImageSource`, `DEMO_ASSETS_BASE_URL` and `pickInitialImagePath` are `src/imgly/photo-scene.ts`, and `uploadFile` builds its input lazily. `src/imgly/index.ts` also gained `initPhotoEditor(engine, imageSrc, size?)`, the `init*` export the conventions script requires.
3. ~~Issue 3~~ Done: the `None` guard is in.
4. ~~Issue 6.~~ **Done.** The fleet convention is an unconditional `window.cesdk` inside `//START_HIDDEN_BLOCK`, with no env gate.

## 9. Estimate

16 browser cases at about 8 s each: about 2 minutes on one worker. Headless: PH-H2 writes 61 URIs against one engine, about 20 s. Component and unit cases under 2 s.

## 10. Boundary review

Rule used: the code that makes a decision owns the test for it. This kit has no CE.SDK editor UI — it drives `@cesdk/engine` directly — so the boundary is only between the kit and the engine. The kit decides the scene it builds, the three photos, the 12 adjustment keys, the 61 LUT entries and their tile counts, the slider ranges and their mapping onto engine values, the keep-or-discard swap behaviour, and the export mime type. The engine decides what those values do.

Core behaviour this plan leans on, and where it is covered today:

| Behaviour                                                                                                                                    | Owner  | Covered by                                                                                                                                |
| -------------------------------------------------------------------------------------------------------------------------------------------- | ------ | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `createEffect` / `appendEffect` / `removeEffect`, and the `adjustments` property set                                                         | engine | `engine/lib/test/api/EffectsAPITest.cpp` `createEffectAcceptsKnownType`, `appendEffectHappyPath`, `adjustments`                           |
| The `lut_filter` property set                                                                                                                | engine | `EffectsAPITest.cpp` `lutFilter`; `AnimationEffectPropertySweepAPITest.cpp` sweeps the same four properties                               |
| `getPropertyType` errors on an unknown property name                                                                                         | engine | `engine/lib/test/api/PropertyValidationMatrixAPITest.cpp`, `BlockPropertiesTest.cpp`                                                      |
| `crop/rotation`, `setCropScaleRatio`, `adjustCropToFillFrame`, `resetCrop`, `flipCropHorizontal`                                             | engine | `engine/lib/test/api/CropAPITest.cpp`; `AppearanceRoundTripAPITest.cpp` for the round trip                                                |
| `block.export` with `image/jpeg` produces a decodable file at the block's size                                                               | engine | `engine/lib/test/api/ExportAPITest.cpp` `ExportToBuffer_JPEG`, `ExportToBuffer_WithOptions`                                               |
| `editor.canUndo` and `addUndoStep`                                                                                                           | engine | `engine/lib/test/api/HistoryAPITest.cpp` `canUndoTrueAfterFirstCommit`, `canUndoRemainsTrueAcrossMultipleCommits`                         |
| `fill/image/imageFileURI` on a page fill drives what is rendered                                                                             | engine | `engine/lib/test/api/ImageFillAPITest.cpp`                                                                                                |
| `defaultURIResolver` maps a relative asset path onto the configured base                                                                     | engine | `engine/lib/test/api/AssetAPITest.cpp` `DefaultURIResolver`, `GetAbsoluteURI`                                                             |
| `block.destroy` against an invalid block id fails rather than corrupting the scene, and the binding rejects a non-integer id before the call | engine | `engine/lib/test/api/InvalidBlockMatrixAPITest.cpp` (`destroy` row); `bindings/wasm/js_web/src/BlockAPI.ts` `assert('id', id, integer())` |

Core coverage gaps found (candidates to add in the core suites, not in this kit):

1. Engine: the short property form. The kit writes `adjustments/brightness`, not `effect/adjustments/brightness`, and relies on the engine resolving the unqualified effect name through `getFullyQualifiedEffectType`. No test pins that alias — every property test uses the fully qualified name. Every kit that builds a property name by string concatenation depends on it, and PH-H1 would silently pass against the long form. Suggested home: `BlockPropertiesTest.cpp`, next to the existing property-name cases.

PH-11 keeps its "clicking None twice does nothing" assertion, which is a kit guard: the binding's `assert` on the block id throws before the engine sees the call, so the kit must not make it.

## 11. Coverage residue

`npm run ci` reports **lines 99.79 %, branches 99.47 %, functions 100 %**. Four lines and two branches of `src/**` are uncovered, all in one file, and all unreachable by construction.

| Where                                                                          | What                                                                             | Proof                                                                                                                                                                                                                                                                                                                                                                 |
| ------------------------------------------------------------------------------ | -------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/app/hooks/useSinglePageFocus.ts` 139, 140, 165, 166 and branches 138, 164 | the `!enabled \|\| !engine` guards inside `zoomToPage` and `zoomToSelectedBlock` | Neither callback is returned from the hook. Every call site — `refocus`, the `hideOtherPages` effect, the ResizeObserver callback and the visual-viewport listener — sits behind the identical guard in the same render, so the inner one can never be the one that fires. The guard also narrows `engine` from `CreativeEngine \| null`, so deleting it fails `tsc`. |

The residue this section carried in version 3 is gone. `merge-coverage.mjs` now takes the line denominator from the Vitest statement map wherever Vitest measured a file, so comment and blank lines no longer enter the merged report, and it sums every browser dump instead of keeping the alphabetically last one. That resolves the whole "not code" class and the `autoPlaceBlockOnPage`, `uploadFile`, `zoomToSelectedText`, `pixelToCanvasUnit` and `TopBar` entries. Known issue 11 (`autoPlaceBlockOnPage` and `uploadFile` have no call site) stands as a product observation; it is no longer a coverage question.
