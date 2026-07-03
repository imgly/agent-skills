> This is one page of the CE.SDK Vue `@cesdk/cesdk-js` API reference. For a complete overview, see the [Vue Documentation Index](https://img.ly/docs/cesdk/vue.md) or the [cesdk-js API Index](./api/cesdk-js.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

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
|  `zoom.toFit` | [`ZoomToFitAction`](./api/cesdk-js/type-aliases/zoomtofitaction.md) | Action for zooming to fit the current page in the viewport |
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
|  `selection.split` | [`SelectionSplitAction`](./api/cesdk-js/type-aliases/selectionsplitaction.md) | Action for splitting the first selected clip at the playhead |
|  `video.decode.checkSupport` | [`VideoDecodeCheckSupportAction`](./api/cesdk-js/type-aliases/videodecodechecksupportaction.md) | Action for checking video decoding/playback support |
|  `video.encode.checkSupport` | [`VideoEncodeCheckSupportAction`](./api/cesdk-js/type-aliases/videoencodechecksupportaction.md) | Action for checking video encoding/export support |
|  `editor.checkBrowserSupport` | [`EditorCheckBrowserSupportAction`](./api/cesdk-js/type-aliases/editorcheckbrowsersupportaction.md) | Action for checking browser capabilities at editor startup |
|  `scene.create` | [`SceneCreateAction`](./api/cesdk-js/type-aliases/scenecreateaction.md) | Action for creating a new scene with configurable mode and page sizes |
|  `asset.delete` | [`DeleteAssetAction`](./api/cesdk-js/type-aliases/deleteassetaction.md) | Action invoked when the user deletes an asset from an asset source via the asset library card. |
|  `selection.all` | [`SelectionAllAction`](./api/cesdk-js/type-aliases/selectionallaction.md) | Select every block on the current page. |
|  `selection.delete` | [`SelectionDeleteAction`](./api/cesdk-js/type-aliases/selectiondeleteaction.md) | Delete the selected blocks. |
|  `vectorPath.deleteNodeOrPoint` | [`VectorPathDeleteNodeOrPointAction`](./api/cesdk-js/type-aliases/vectorpathdeletenodeorpointaction.md) | Delete the selected vector node or control point. |
|  `selection.duplicate` | [`SelectionDuplicateAction`](./api/cesdk-js/type-aliases/selectionduplicateaction.md) | Duplicate the selected blocks. |
|  `selection.group` | [`SelectionGroupAction`](./api/cesdk-js/type-aliases/selectiongroupaction.md) | Group the selected blocks. |
|  `selection.ungroup` | [`SelectionUngroupAction`](./api/cesdk-js/type-aliases/selectionungroupaction.md) | Ungroup any selected group block. |
|  `text.toggleBold` | [`TextToggleBoldAction`](./api/cesdk-js/type-aliases/texttoggleboldaction.md) | Toggle bold on the selected text. |
|  `text.toggleItalic` | [`TextToggleItalicAction`](./api/cesdk-js/type-aliases/texttoggleitalicaction.md) | Toggle italic on the selected text. |
|  `text.toggleUnderline` | [`TextToggleUnderlineAction`](./api/cesdk-js/type-aliases/texttoggleunderlineaction.md) | Toggle underline on the selected text. |
|  `text.toggleStrikethrough` | [`TextToggleStrikethroughAction`](./api/cesdk-js/type-aliases/texttogglestrikethroughaction.md) | Toggle strikethrough on the selected text. |
|  `video.playPause` | [`VideoPlayPauseAction`](./api/cesdk-js/type-aliases/videoplaypauseaction.md) | Toggle play/pause on the current page. |
|  `history.undo` | [`HistoryUndoAction`](./api/cesdk-js/type-aliases/historyundoaction.md) | Undo the last editor operation. |
|  `history.redo` | [`HistoryRedoAction`](./api/cesdk-js/type-aliases/historyredoaction.md) | Redo the last undone editor operation. |
|  `selection.nudgeUp` | [`NudgeAction`](./api/cesdk-js/type-aliases/nudgeaction.md) | Nudge the selection up by one step. |
|  `selection.nudgeDown` | [`NudgeAction`](./api/cesdk-js/type-aliases/nudgeaction.md) | Nudge the selection down by one step. |
|  `selection.nudgeLeft` | [`NudgeAction`](./api/cesdk-js/type-aliases/nudgeaction.md) | Nudge the selection left by one step. |
|  `selection.nudgeRight` | [`NudgeAction`](./api/cesdk-js/type-aliases/nudgeaction.md) | Nudge the selection right by one step. |
|  `selection.nudgeUpExtended` | [`NudgeAction`](./api/cesdk-js/type-aliases/nudgeaction.md) | Nudge the selection up by one extended step. |
|  `selection.nudgeDownExtended` | [`NudgeAction`](./api/cesdk-js/type-aliases/nudgeaction.md) | Nudge the selection down by one extended step. |
|  `selection.nudgeLeftExtended` | [`NudgeAction`](./api/cesdk-js/type-aliases/nudgeaction.md) | Nudge the selection left by one extended step. |
|  `selection.nudgeRightExtended` | [`NudgeAction`](./api/cesdk-js/type-aliases/nudgeaction.md) | Nudge the selection right by one extended step. |
|  `group.enterOrExit` | [`GroupEnterOrExitAction`](./api/cesdk-js/type-aliases/groupenterorexitaction.md) | Enter the selected group, or exit the current group when no group is selected. |
|  `selection.parentOrDeselect` | [`SelectionParentOrDeselectAction`](./api/cesdk-js/type-aliases/selectionparentordeselectaction.md) | Select the parent group of the current selection, or deselect when none. |
|  `page.selectNext` | [`PageSelectNextAction`](./api/cesdk-js/type-aliases/pageselectnextaction.md) | Select the next page. |
|  `page.selectPrevious` | [`PageSelectPreviousAction`](./api/cesdk-js/type-aliases/pageselectpreviousaction.md) | Select the previous page. |
|  `toggleUserInterfaceVisibility` | [`ToggleUserInterfaceVisibilityAction`](./api/cesdk-js/type-aliases/toggleuserinterfacevisibilityaction.md) | Toggle the editor's user interface visibility. |


---

## More Resources

- **[Vue Documentation Index](https://img.ly/docs/cesdk/vue.md)** - Browse all Vue documentation
- **[cesdk-js API Reference](./api/cesdk-js.md)** - Full cesdk-js API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./vue.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support