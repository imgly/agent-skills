> This is one page of the CE.SDK Electron `@cesdk/engine` API reference. For a complete overview, see the [Electron Documentation Index](https://img.ly/docs/cesdk/electron.md) or the [engine API Index](./api/engine.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

Map of all available settings with their types.
This provides type-safe access to all editor settings.

The settings are organized by type:

- Boolean settings control various on/off features in the editor
- String settings configure paths and textual values
- Float settings define numerical thresholds and limits
- Integer settings specify whole number limits
- Color settings control the visual appearance
- Enum settings provide predefined choice options

## Properties

| Property | Type | Description |
| ------ | ------ | ------ |
|  `controlGizmo/showCropHandles` | `boolean` | Whether to show handles for adjusting the crop area during crop mode. |
|  `controlGizmo/showCropScaleHandles` | `boolean` | Whether to display the outer handles that scale the full image during crop. |
|  `controlGizmo/showMoveHandles` | `boolean` | Whether to show the move handles. |
|  `controlGizmo/dynamicMoveHandleVisibility` | `boolean` | Whether the move handle visibility is dynamic based on block size. Set to false to always show. |
|  `controlGizmo/showResizeHandles` | `boolean` | Whether to display the non-proportional resize handles (edge handles). |
|  `controlGizmo/showRotateHandles` | `boolean` | Whether to show the rotation handles. |
|  `controlGizmo/showScaleHandles` | `boolean` | Whether to display the proportional scale handles (corner handles). |
|  `doubleClickToCropEnabled` | `boolean` | Enable double-click to enter crop mode. |
|  `features/singlePageModeEnabled` | `boolean` | Enable single page mode where only one page is shown at a time. |
|  `features/fileSystemUsageEnabled` | `boolean` | Enable file system usage, that allows the engine to use the file system to store files for local uploads. |
|  `features/pageCarouselEnabled` | `boolean` | Enable the page carousel for navigating between pages. |
|  `features/transformEditsRetainCoverMode` | `boolean` | Whether transform edits should retain the cover mode of the content. |
|  `features/clampTextBlockWidthToPageDimensionsDuringEditing` | `boolean` | Whether auto-sized text blocks should be clamped to page boundaries during editing. |
|  `mouse/enableScroll` | `boolean` | Whether the engine processes mouse scroll events. |
|  `mouse/enableZoom` | `boolean` | Whether the engine processes mouse zoom events. |
|  `page/allowCropInteraction` | `boolean` | Whether crop interaction (by handles and gestures) should be possible. |
|  `page/allowMoveInteraction` | `boolean` | Whether move interaction should be possible when page layout is not controlled by the scene. |
|  `page/marqueeSelectOnBodyDrag` | `boolean` | When enabled, a click+drag that starts on the page body performs a marquee selection of the blocks inside the page instead of moving the page. The page can still be moved by dragging its title (when visible in free layout) or by holding the command key (macOS) / control key (Windows/Linux) while clicking and dragging on the page body. Has no effect when the page is not movable (see `page/allowMoveInteraction` and scene layout constraints). |
|  `page/restrictPageSelectionToBorderAndTitle` | `boolean` | When enabled, the page can only be selected by clicking on its title (when shown in free layout) or near its border. Clicks inside the page body no longer select the page; the click falls through to whatever block sits underneath. Independent of `page/marqueeSelectOnBodyDrag`. |
|  `page/allowResizeInteraction` | `boolean` | Whether resize interaction (by handles and gestures) should be possible. |
|  `page/allowRotateInteraction` | `boolean` | Whether rotation interaction should be possible when page layout is not controlled by the scene. |
|  `page/allowShapeChange` | `boolean` | Whether pages support non-rectangular shapes. When false, supportsShape returns false for pages. |
|  `page/dimOutOfPageAreas` | `boolean` | Whether the opacity of the region outside of all pages should be reduced. |
|  `page/restrictResizeInteractionToFixedAspectRatio` | `boolean` | Whether resize interaction should be restricted to fixed aspect ratio. |
|  `page/moveChildrenWhenCroppingFill` | `boolean` | Whether children of the page should be transformed to match their old position when cropping. |
|  `page/title/appendPageName` | `boolean` | Whether to append the page name to the title even if not specified in the template. |
|  `page/title/canEdit` | `boolean` | Whether double-clicking a page title enters text edit mode to rename the page. |
|  `page/title/show` | `boolean` | Whether to show titles above each page. |
|  `page/title/showOnSinglePage` | `boolean` | Whether to hide the page title when only a single page exists. |
|  `page/title/showPageTitleTemplate` | `boolean` | Whether to include the default page title from page.titleTemplate. |
|  `placeholderControls/showButton` | `boolean` | Whether to show the placeholder button. |
|  `placeholderControls/showOverlay` | `boolean` | Whether to show the overlay pattern for placeholders. |
|  `blockAnimations/enabled` | `boolean` | Whether animations should be enabled or not. |
|  `playback/showAllBlocks` | `boolean` | When enabled, every block stays visible regardless of the current playback time, instead of being culled outside its time offset/duration. No effect on export. |
|  `grid/enabled` | `boolean` | Whether the background grid is shown on pages. |
|  `grid/snapEnabled` | `boolean` | Whether elements should snap to grid lines when dragged. |
|  `showBuildVersion` | `boolean` | Whether to display the build version in the UI. |
|  `touch/dragStartCanSelect` | `boolean` | Whether drag start can select elements. |
|  `touch/singlePointPanning` | `boolean` | Whether single-point panning is enabled for touch interactions. |
|  `useSystemFontFallback` | `boolean` | Whether to use system font as fallback for missing glyphs. |
|  `forceSystemEmojis` | `boolean` | Whether to force the use of system emojis instead of custom emoji fonts. |
|  `page/selectWhenNoBlocksSelected` | `boolean` | Whether to select the page when a block is deselected and no other blocks are selected. |
|  `page/highlightWhenCropping` | `boolean` | Whether highlighting should be automatically enabled on the current page when entering crop mode. |
|  `page/highlightDropTarget` | `boolean` | Whether to highlight the page under a dragged element as a drop target. |
|  `page/reparentBlocksToSceneWhenOutOfPage` | `boolean` | Whether blocks should be reparented to the scene when dragged outside all pages, and reparented back to a page when dragged over one. |
|  `clampThumbnailTextureSizes` | `boolean` | Clamp thumbnail texture sizes to the platform's GPU texture limit. |
|  `dock/hideLabels` | `boolean` | Toggle the dock components visibility |
|  `basePath` | `string` | The root directory for resolving relative paths and `bundle://` URIs. Also used as the base URL for loading font fallback files and the default emoji font (when self-hosting assets). If empty, defaults to `https://cdn.img.ly/assets/v4` for font/emoji assets. |
|  `defaultEmojiFontFileUri` | `string` | The URI for the default emoji font file. |
|  `defaultFontFileUri` | `string` | The URI for the default font file. |
|  `license` | `string` | The license key for the SDK. |
|  `page/title/fontFileUri` | `string` | The font file URI for page titles. |
|  `page/title/separator` | `string` | The separator between page number and page name in titles. |
|  `fallbackFontUri` | `string` | The URI for the fallback font used when glyphs are missing. |
|  `upload/supportedMimeTypes` | `string` | The supported MIME types for file uploads. |
|  `web/fetchCredentials` | `"omit"` | `"same-origin"` | `"include"` | Web-only: Credentials mode for cross-origin fetch requests. - "omit": Never send cookies - "same-origin": Send cookies only for same-origin requests (default) - "include": Always send cookies, even for cross-origin requests Note: Only affects web platform. Ignored on native platforms. |
|  `controlGizmo/blockScaleDownLimit` | `number` | Scale-down limit for blocks in screen pixels when scaling with gizmos or touch gestures. |
|  `listIndentPerLevel` | `number` | The width of each list indentation level, in EM units. |
|  `positionSnappingThreshold` | `number` | The threshold distance in pixels for position snapping. |
|  `rotationSnappingThreshold` | `number` | The threshold angle in degrees for rotation snapping. |
|  `grid/spacingX` | `number` | Horizontal spacing between vertical grid lines in design units. |
|  `grid/spacingY` | `number` | Vertical spacing between horizontal grid lines in design units. |
|  `maxImageSize` | `number` | The maximum size (width or height) in pixels for images. |
|  `maxPreviewResolution` | `number` | The maximum dimension (width or height) in physical pixels for preview rendering. When greater than 0, the scene is rendered at reduced resolution and upscaled for improved performance. Does not affect exports. Set to -1 to disable (default). |
|  `borderOutlineColor` | [`Color`](./api/engine/type-aliases/color.md) | The color of the border outline for selected elements. |
|  `clearColor` | [`Color`](./api/engine/type-aliases/color.md) | The background clear color. |
|  `colorMaskingSettings/maskColor` | [`Color`](./api/engine/type-aliases/color.md) | The color used for color masking effects. |
|  `cropOverlayColor` | [`Color`](./api/engine/type-aliases/color.md) | The color of the crop overlay. |
|  `errorStateColor` | [`Color`](./api/engine/type-aliases/color.md) | The color indicating an error state. |
|  `highlightColor` | [`Color`](./api/engine/type-aliases/color.md) | The highlight color for selected or active elements. |
|  `page/innerBorderColor` | [`Color`](./api/engine/type-aliases/color.md) | The color of the inner frame around the page. |
|  `page/marginFillColor` | [`Color`](./api/engine/type-aliases/color.md) | The color filled into the bleed margins of pages. |
|  `page/marginFrameColor` | [`Color`](./api/engine/type-aliases/color.md) | The color of the frame around the bleed margin area. |
|  `page/outerBorderColor` | [`Color`](./api/engine/type-aliases/color.md) | The color of the outer frame around the page. |
|  `page/title/color` | [`Color`](./api/engine/type-aliases/color.md) | The color of page titles visible in preview mode. |
|  `pageHighlightColor` | [`Color`](./api/engine/type-aliases/color.md) | Color of the outline of each page |
|  `placeholderHighlightColor` | [`Color`](./api/engine/type-aliases/color.md) | The highlight color for placeholder elements. |
|  `progressColor` | [`Color`](./api/engine/type-aliases/color.md) | The color indicating progress or loading states. |
|  `rotationSnappingGuideColor` | [`Color`](./api/engine/type-aliases/color.md) | The color of rotation snapping guide lines. |
|  `ruleOfThirdsLineColor` | [`Color`](./api/engine/type-aliases/color.md) | The color of rule of thirds guide lines. |
|  `snappingGuideColor` | [`Color`](./api/engine/type-aliases/color.md) | The color of snapping guide lines. |
|  `textVariableHighlightColor` | [`Color`](./api/engine/type-aliases/color.md) | The highlight color for text variables. |
|  `handleFillColor` | [`Color`](./api/engine/type-aliases/color.md) | The fill color for handles. |
|  `grid/color` | [`Color`](./api/engine/type-aliases/color.md) | Color of the grid lines. |
|  `doubleClickSelectionMode` | `"Direct"` | `"Hierarchical"` | The selection mode for double-click: Direct selects the clicked element, Hierarchical traverses the hierarchy. |
|  `touch/pinchAction` | `"Auto"` | `"None"` | `"Zoom"` | `"Scale"` | `"Dynamic"` | The action performed for pinch gestures: None, Zoom, Scale, Auto, or Dynamic. |
|  `touch/rotateAction` | `"None"` | `"Rotate"` | The action performed for rotate gestures: None or Rotate. |
|  `camera/clamping/overshootMode` | `"Center"` | `"Reverse"` | Controls behavior when clamp area is smaller than viewport: Center or Reverse. |
|  `dock/iconSize` | `"normal"` | `"large"` | Controls the icon size of the dock components |
|  `colorPicker/colorMode` | `"CMYK"` | `"RGB"` | `"Any"` | Controls the color mode of the color picker. When set to 'RGB' or 'CMYK', only colors matching this mode are fully editable. Defaults to 'Any'. |
|  `timeline/trackVisibility` | `"all"` | `"active"` | Controls which timeline tracks are visible. 'all' shows all tracks, 'active' shows only the track containing the active block. Defaults to 'all'. |


---

## More Resources

- **[Electron Documentation Index](https://img.ly/docs/cesdk/electron.md)** - Browse all Electron documentation
- **[engine API Reference](./api/engine.md)** - Full engine API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./electron.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support