> This is one page of the CE.SDK Electron `@cesdk/engine` API reference. For a complete overview, see the [Electron Documentation Index](https://img.ly/docs/cesdk/electron.md) or the [engine API Index](./api/engine.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

```ts
type SettingBoolPropertyName = 
  | "alwaysHighlightPlaceholders"
  | "doubleClickToCropEnabled"
  | "showBuildVersion"
  | "placeholderControls/showButton"
  | "placeholderControls/showOverlay"
  | "blockAnimations/enabled"
  | "playback/showAllBlocks"
  | "renderTextCursorAndSelectionInEngine"
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
  | "page/title/canEdit"
  | "page/title/show"
  | "page/title/showPageTitleTemplate"
  | "page/title/appendPageName"
  | "page/title/showOnSinglePage"
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
  | "page/highlightDropTarget"
  | "page/reparentBlocksToSceneWhenOutOfPage"
  | "colorMaskingSettings/secondPass"
  | "clampThumbnailTextureSizes"
  | "useSystemFontFallback"
  | "forceSystemEmojis"
  | "features/textEditModeTransformHandlesEnabled"
  | "features/videoStreamingEnabled"
  | "grid/enabled"
  | "grid/snapEnabled"
  | "features/enableAutomaticEnumerations"
  | "features/transparentClickThroughEnabled"
  | "features/fontLineGapEnabled"
  | string & object;
```


---

## More Resources

- **[Electron Documentation Index](https://img.ly/docs/cesdk/electron.md)** - Browse all Electron documentation
- **[engine API Reference](./api/engine.md)** - Full engine API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./electron.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support