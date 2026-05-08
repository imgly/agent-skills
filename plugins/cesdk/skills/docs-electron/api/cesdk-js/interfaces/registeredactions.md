> This is one page of the CE.SDK Electron `@cesdk/cesdk-js` API reference. For a complete overview, see the [Electron Documentation Index](https://img.ly/docs/cesdk/electron.md) or the [cesdk-js API Index](./api/cesdk-js.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

Represents a collection of action functions used throughout the application.
Each property corresponds to a specific UI action or event that can be customized.

## Properties

| Property | Type | Description |
| ------ | ------ | ------ |
|  `saveScene` | [`SaveSceneAction`](./api/cesdk-js/type-aliases/savesceneaction.md) | Action invoked to handle scene saving. |
|  `shareScene` | [`ShareSceneAction`](./api/cesdk-js/type-aliases/sharesceneaction.md) | Action invoked to handle scene sharing. |
|  `exportDesign` | [`ExportAction`](./api/cesdk-js/type-aliases/exportaction.md) | Action invoked to handle export actions. |
|  `importScene` | [`ImportSceneAction`](./api/cesdk-js/type-aliases/importsceneaction.md) | Action invoked to handle import actions. |
|  `exportScene` | [`ExportSceneAction`](./api/cesdk-js/type-aliases/exportsceneaction.md) | Action invoked to handle scene export actions. |
|  `uploadFile` | [`UploadAction`](./api/cesdk-js/type-aliases/uploadaction.md) | Action invoked to handle file uploads. |
|  `onUnsupportedBrowser` | [`OnUnsupportedBrowserAction`](./api/cesdk-js/type-aliases/onunsupportedbrowseraction.md) | Action invoked when an unsupported browser is detected. |
|  `addClip` | `VoidFunction` | Action invoked when the add clip button is pressed in the video timeline |
|  `zoom.toBlock` | [`ZoomToBlockAction`](./api/cesdk-js/type-aliases/zoomtoblockaction.md) | Action for zooming to a specific block |
|  `zoom.toPage` | [`ZoomToPageAction`](./api/cesdk-js/type-aliases/zoomtopageaction.md) | Action for zooming to a page (current, first, last, or by index) with optional padding |
|  `zoom.toSelection` | [`ZoomToSelectionAction`](./api/cesdk-js/type-aliases/zoomtoselectionaction.md) | Action for zooming to the current selection |
|  `zoom.in` | [`ZoomInAction`](./api/cesdk-js/type-aliases/zoominaction.md) | Action for zooming in by one step |
|  `zoom.out` | [`ZoomOutAction`](./api/cesdk-js/type-aliases/zoomoutaction.md) | Action for zooming out by one step |
|  `zoom.toLevel` | [`ZoomToLevelAction`](./api/cesdk-js/type-aliases/zoomtolevelaction.md) | Action for setting zoom to a specific level |
|  `scroll.toPage` | [`ScrollToPageAction`](./api/cesdk-js/type-aliases/scrolltopageaction.md) | Action for scrolling to a specific page |
|  `scroll.toBlock` | [`ScrollToBlockAction`](./api/cesdk-js/type-aliases/scrolltoblockaction.md) | Action for scrolling to a specific block |
|  `timeline.zoom.in` | [`TimelineZoomInAction`](./api/cesdk-js/type-aliases/timelinezoominaction.md) | Action for zooming in the video timeline |
|  `timeline.zoom.out` | [`TimelineZoomOutAction`](./api/cesdk-js/type-aliases/timelinezoomoutaction.md) | Action for zooming out the video timeline |
|  `timeline.zoom.fit` | [`TimelineZoomToFitAction`](./api/cesdk-js/type-aliases/timelinezoomtofitaction.md) | Action for fitting the video timeline to show all content |
|  `timeline.zoom.toLevel` | [`TimelineZoomToLevelAction`](./api/cesdk-js/type-aliases/timelinezoomtolevelaction.md) | Action for setting the video timeline zoom to a specific level |
|  `timeline.zoom.reset` | [`TimelineZoomResetAction`](./api/cesdk-js/type-aliases/timelinezoomresetaction.md) | Action for resetting the video timeline zoom to default |
|  `timeline.expand` | [`TimelineExpandAction`](./api/cesdk-js/type-aliases/timelineexpandaction.md) | Action for expanding the video timeline |
|  `timeline.collapse` | [`TimelineCollapseAction`](./api/cesdk-js/type-aliases/timelinecollapseaction.md) | Action for collapsing the video timeline |
|  `copy` | [`CopyAction`](./api/cesdk-js/type-aliases/copyaction.md) | Action for copying selected blocks to the clipboard |
|  `paste` | [`PasteAction`](./api/cesdk-js/type-aliases/pasteaction.md) | Action for pasting blocks from the clipboard |
|  `video.decode.checkSupport` | [`VideoDecodeCheckSupportAction`](./api/cesdk-js/type-aliases/videodecodechecksupportaction.md) | Action for checking video decoding/playback support |
|  `video.encode.checkSupport` | [`VideoEncodeCheckSupportAction`](./api/cesdk-js/type-aliases/videoencodechecksupportaction.md) | Action for checking video encoding/export support |
|  `editor.checkBrowserSupport` | [`EditorCheckBrowserSupportAction`](./api/cesdk-js/type-aliases/editorcheckbrowsersupportaction.md) | Action for checking browser capabilities at editor startup |
|  `scene.create` | [`SceneCreateAction`](./api/cesdk-js/type-aliases/scenecreateaction.md) | Action for creating a new scene with configurable mode and page sizes |
|  `asset.delete` | [`DeleteAssetAction`](./api/cesdk-js/type-aliases/deleteassetaction.md) | Action invoked when the user deletes an asset from an asset source via the asset library card. |


---

## More Resources

- **[Electron Documentation Index](https://img.ly/docs/cesdk/electron.md)** - Browse all Electron documentation
- **[cesdk-js API Reference](./api/cesdk-js.md)** - Full cesdk-js API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./electron.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support