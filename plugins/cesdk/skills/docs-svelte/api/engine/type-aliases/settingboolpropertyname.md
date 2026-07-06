> This is one page of the CE.SDK Svelte `@cesdk/engine` API reference. For a complete overview, see the [Svelte Documentation Index](https://img.ly/docs/cesdk/svelte.md) or the [engine API Index](./api/engine.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

```ts
type SettingBoolPropertyName = 
  | "doubleClickToCropEnabled"
  | "showBuildVersion"
  | "placeholderControls/showButton"
  | "placeholderControls/showOverlay"
  | "blockAnimations/enabled"
  | "playback/showAllBlocks"
  | "grid/enabled"
  | "grid/snapEnabled"
  | "archival/bundleOnlyUsedFontVariants"
  | "touch/dragStartCanSelect"
  | "touch/singlePointPanning"
  | "mouse/enableZoom"
  | "mouse/enableScroll"
  | "controlGizmo/showCropHandles"
  | "controlGizmo/showMoveHandles"
  | "controlGizmo/dynamicMoveHandleVisibility"
  | "controlGizmo/showResizeHandles"
  | "controlGizmo/showScaleHandles"
  | "controlGizmo/showRotateHandles"
  | "controlGizmo/showCropScaleHandles"
  | "page/title/show"
  | "page/title/showPageTitleTemplate"
  | "page/title/appendPageName"
  | "page/title/showOnSinglePage"
  | "page/title/canEdit"
  | "page/dimOutOfPageAreas"
  | "page/allowCropInteraction"
  | "page/allowResizeInteraction"
  | "page/restrictResizeInteractionToFixedAspectRatio"
  | "page/allowRotateInteraction"
  | "page/allowMoveInteraction"
  | "page/marqueeSelectOnBodyDrag"
  | "page/restrictPageSelectionToBorderAndTitle"
  | "page/moveChildrenWhenCroppingFill"
  | "page/selectWhenNoBlocksSelected"
  | "page/highlightWhenCropping"
  | "page/allowShapeChange"
  | "page/highlightDropTarget"
  | "page/reparentBlocksToSceneWhenOutOfPage"
  | "page/flipDimensionsOn90DegreeCropRotation"
  | "clampThumbnailTextureSizes"
  | "useSystemFontFallback"
  | "forceSystemEmojis"
  | string & object;
```


---

## More Resources

- **[Svelte Documentation Index](https://img.ly/docs/cesdk/svelte.md)** - Browse all Svelte documentation
- **[engine API Reference](./api/engine.md)** - Full engine API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./svelte.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support