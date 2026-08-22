> This is one page of the CE.SDK React `@cesdk/cesdk-js` API reference. For a complete overview, see the [React Documentation Index](https://img.ly/docs/cesdk/react.md) or the [cesdk-js API Index](./api/cesdk-js.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

## Classes

| Class | Description |
| ------ | ------ |
| [ActionsAPI](./api/cesdk-js/classes/actionsapi.md) | ActionsAPI provides a centralized way to manage and customize actions for various user interactions in the Creative Engine SDK. |
| [CreativeEditorSDK](./api/cesdk-js/classes/creativeeditorsdk.md) | The main entry point for the Creative Editor SDK. |
| [FeatureAPI](./api/cesdk-js/classes/featureapi.md) | Controls the availability of features within the Creative Editor SDK. |
| [InternationalizationAPI](./api/cesdk-js/classes/internationalizationapi.md) | Manages localization and internationalization settings for the Creative Editor SDK. |
| [KeyboardShortcutsAPI](./api/cesdk-js/classes/keyboardshortcutsapi.md) | `cesdk.shortcuts` — the editor-facing keyboard shortcut API. |
| [UserInterfaceAPI](./api/cesdk-js/classes/userinterfaceapi.md) | Control the user interface and behavior of the Creative Editor SDK. |
| [UtilsAPI](./api/cesdk-js/classes/utilsapi.md) | UtilsAPI provides utility functions for common operations in the Creative Engine SDK. |

## Functions

| Function | Description |
| ------ | ------ |
| [isGlobPattern](./api/cesdk-js/functions/isglobpattern.md) | Checks if a string is a glob pattern (contains `*`). |
| [matchGlob](./api/cesdk-js/functions/matchglob.md) | Matches a value against a glob pattern. |
| [useOrderContext](./api/cesdk-js/functions/useordercontext.md) | Hook for reading and setting order context for a UI area. |

## Type Aliases

| Type Alias | Description |
| ------ | ------ |
| [ActionFunction](./api/cesdk-js/type-aliases/actionfunction.md) | Type helper for retrieving the correct action function type based on the action ID. Returns the strongly-typed action for known actions, or a custom action type for unknown IDs. |
| [ActionId](./api/cesdk-js/type-aliases/actionid.md) | Available action event types that can be registered with the ActionsAPI. These correspond to different UI actions that can be customized. Supports both predefined action types from the Actions interface and custom string identifiers. |
| [AnyUILocationOptions](./api/cesdk-js/type-aliases/anyuilocationoptions.md) | Union type for location options. Resolves to the appropriate options type based on area-specific requirements. |
| [AssetEntryId](./api/cesdk-js/type-aliases/assetentryid.md) | Asset library entry IDs that can be used with asset library APIs. Includes built-in entry IDs registered by the SDK, and allows custom entry IDs. |
| [AssetLibraryDockComponent](./api/cesdk-js/type-aliases/assetlibrarydockcomponent.md) | Represents an asset library dock component. |
| [AssetLibraryEntryInput](./api/cesdk-js/type-aliases/assetlibraryentryinput.md) | A reference to an asset library entry to display. Either an entry ID, or an object that names the entry plus source IDs to hide for this display only — for example a replace panel that shows a library with a non-applicable source hidden (the text "Styles" panel shows `ly.img.text` but hides its text-combinations source). This per-display `excludeSourceIds` is distinct from the entry's own `includeGroups`/`excludeGroups`, which apply wherever the entry is shown. |
| [AssetLibraryPanelPayload](./api/cesdk-js/type-aliases/assetlibrarypanelpayload.md) | Represents the payload for the asset library panel in the Creative Editor SDK. This interface defines the title, entries, and placement options for the asset library panel. |
| [BuilderRenderFunction](./api/cesdk-js/type-aliases/builderrenderfunction.md) | Function that defines a component with the help of the passed builder object. |
| [CanvasBarComponentId](./api/cesdk-js/type-aliases/canvasbarcomponentid.md) | Represents the ID of a canvas bar component. |
| [CanvasMenuComponentId](./api/cesdk-js/type-aliases/canvasmenucomponentid.md) | A list of the component IDs that can be used in the canvas menu. |
| [CanvasMenuComponents](./api/cesdk-js/type-aliases/canvasmenucomponents.md) | - |
| [CanvasMenuOrderComponent](./api/cesdk-js/type-aliases/canvasmenuordercomponent.md) | - |
| [CaptionPanelComponentId](./api/cesdk-js/type-aliases/captionpanelcomponentid.md) | Represents the ID of a caption panel component. |
| [ChildrenOrder](./api/cesdk-js/type-aliases/childrenorder.md) | Represents the order of children components in a dropdown. |
| [ClipContextMenuComponentId](./api/cesdk-js/type-aliases/clipcontextmenucomponentid.md) | Represents the ID of a video clip menu component. |
| [ComponentGlobPattern](./api/cesdk-js/type-aliases/componentglobpattern.md) | A glob pattern for matching component IDs. |
| [ComponentId](./api/cesdk-js/type-aliases/componentid.md) | Represents the ID of a component. |
| [ComponentIdFor](./api/cesdk-js/type-aliases/componentidfor.md) | Maps UI areas to their component ID types. |
| [ComponentMatcher](./api/cesdk-js/type-aliases/componentmatcher.md) | Unified component matcher type supporting all matching strategies. |
| [ComponentSpec](./api/cesdk-js/type-aliases/componentspec.md) | Specifies a component either by ID or as a full component object. |
| [ComponentSpecOrArray](./api/cesdk-js/type-aliases/componentspecorarray.md) | Specifies one or more components for insertion. |
| [Configuration](./api/cesdk-js/type-aliases/configuration.md) | Represents the user-provided configuration for the Creative Editor SDK. This type allows for partial configuration settings, making all properties optional. |
| [CopyAction](./api/cesdk-js/type-aliases/copyaction.md) | Action function for copying selected blocks to the clipboard |
| [CustomActionFunction](./api/cesdk-js/type-aliases/customactionfunction.md) | A generic action function type for custom actions. Supports both synchronous and asynchronous implementations with flexible parameters. |
| [CustomPanelMountFunction](./api/cesdk-js/type-aliases/custompanelmountfunction.md) | Represents a function that mounts a custom panel. |
| [DeleteAssetAction](./api/cesdk-js/type-aliases/deleteassetaction.md) | Action function for deleting an asset from an asset source. |
| [DialogAction](./api/cesdk-js/type-aliases/dialogaction.md) | Represents an action in the dialog. |
| [DialogBackdrop](./api/cesdk-js/type-aliases/dialogbackdrop.md) | Represents the backdrop style for the dialog. |
| [DialogContent](./api/cesdk-js/type-aliases/dialogcontent.md) | Represents the content of the dialog. |
| [DialogProgress](./api/cesdk-js/type-aliases/dialogprogress.md) | Represents the progress of the dialog. |
| [DialogSize](./api/cesdk-js/type-aliases/dialogsize.md) | Represents the size of the dialog. |
| [DialogType](./api/cesdk-js/type-aliases/dialogtype.md) | Represents the type of dialog. |
| [DockOrderComponent](./api/cesdk-js/type-aliases/dockordercomponent.md) | Represents a dock order component. |
| [DockOrderComponentId](./api/cesdk-js/type-aliases/dockordercomponentid.md) | Represents the ID of a dock order component. |
| [DockPosition](./api/cesdk-js/type-aliases/dockposition.md) | Valid positions for the dock: `'left'`, `'right'`, or `'bottom'`. |
| [EditorCheckBrowserSupportAction](./api/cesdk-js/type-aliases/editorcheckbrowsersupportaction.md) | Action for checking browser capabilities at editor startup. Idempotent: only runs checks once per editor lifetime. |
| [EditorPluginContext](./api/cesdk-js/type-aliases/editorplugincontext.md) | Represents the context for an editor plugin. This type extends the `EnginePluginContext` with an optional `cesdk` property. |
| [ExportAction](./api/cesdk-js/type-aliases/exportaction.md) | Action function for handling export operations. Can be called with or without options to customize the export behavior. Supports both standard and video export workflows through a generic type parameter. The return type is automatically inferred based on the input options type. |
| [ExportSceneAction](./api/cesdk-js/type-aliases/exportsceneaction.md) | Action function for handling scene export operations. |
| [FeatureId](./api/cesdk-js/type-aliases/featureid.md) | All built-in CE.SDK Feature Ids. |
| [FeaturePredicate](./api/cesdk-js/type-aliases/featurepredicate.md) | The feature predicate is used to enable or disable a feature based on the boolean or the return value of the function. |
| [FeaturePredicateContext](./api/cesdk-js/type-aliases/featurepredicatecontext.md) | Represents the context for enabling a feature. This type extends `IsEnabledFeatureContext` and includes a function to check the previous enable state and a function to get the default predicate. |
| [FileMimeType](./api/cesdk-js/type-aliases/filemimetype.md) | Represents the MIME types for files supported by the file operations in UtilsAPI. |
| [GetOrderOptions](./api/cesdk-js/type-aliases/getorderoptions.md) | Options for getting component order. Only single area queries are supported to ensure type-safe returns. |
| [GlobPattern](./api/cesdk-js/type-aliases/globpattern.md) | A glob pattern string for matching UI areas or component IDs. Supports `*` as a wildcard. |
| [GroupEnterOrExitAction](./api/cesdk-js/type-aliases/groupenterorexitaction.md) | Action function for entering or exiting the selected group. |
| [HistoryRedoAction](./api/cesdk-js/type-aliases/historyredoaction.md) | Action function for redoing the last undone editor operation. |
| [HistoryUndoAction](./api/cesdk-js/type-aliases/historyundoaction.md) | Action function for undoing the last editor operation. |
| [ImportSceneAction](./api/cesdk-js/type-aliases/importsceneaction.md) | Action function for handling scene import operations. |
| [InferComponentType](./api/cesdk-js/type-aliases/infercomponenttype.md) | Infers the component type from a UI area specifier. - Single area: returns area-specific component type - Array of areas: returns union of component types - Glob pattern: returns base OrderComponent (all IDs) |
| [InferOrderContext](./api/cesdk-js/type-aliases/inferordercontext.md) | Infers the order context type from a UI area specifier. - Single area: returns area-specific context type - Array of areas: returns union of context types - Glob pattern: returns base OrderContext (all areas) |
| [InsertComponentOptions](./api/cesdk-js/type-aliases/insertcomponentoptions.md) | Options for inserting a component into a UI area. Supports mutual exclusion: only one of `before`, `after`, or `position` can be specified. Positional areas (like canvas bar) require the `at` property to specify which slot. |
| [InsertOrderComponentLocation](./api/cesdk-js/type-aliases/insertordercomponentlocation.md) | Represents the location for inserting an order component. |
| [InspectorBarComponentId](./api/cesdk-js/type-aliases/inspectorbarcomponentid.md) | Represents the ID of an inspector bar component. |
| [IsEnabledFeatureContext](./api/cesdk-js/type-aliases/isenabledfeaturecontext.md) | Represents the context for determining if a feature is enabled. This type includes the `CreativeEngine` instance. |
| [KeyboardKey](./api/cesdk-js/type-aliases/keyboardkey.md) | W3C standard keyboard key values Reference: https://www.w3.org/TR/uievents-key/ |
| [KeyboardSequence](./api/cesdk-js/type-aliases/keyboardsequence.md) | Type alias for keyboard sequences (for backward compatibility) |
| [KeyboardShortcutContext](./api/cesdk-js/type-aliases/keyboardshortcutcontext.md) | Context passed to a shortcut's `run` and `when` callbacks. |
| [LoadingComponent](./api/cesdk-js/type-aliases/loadingcomponent.md) | Represents a loading indicator component. |
| [LoadingOrder](./api/cesdk-js/type-aliases/loadingorder.md) | Order type for loading indicator components. |
| [LocaleKey](./api/cesdk-js/type-aliases/localekey.md) | Represents the supported locale keys for the Creative Editor SDK. |
| [MultiAreaRemoveResult](./api/cesdk-js/type-aliases/multiarearemoveresult.md) | Result of a multi-area remove operation. |
| [MultiAreaUpdateResult](./api/cesdk-js/type-aliases/multiareaupdateresult.md) | Result of a multi-area update operation. |
| [NavigationBarComponentId](./api/cesdk-js/type-aliases/navigationbarcomponentid.md) | A list of the component IDs that can be used in the navigation bar. |
| [NavigationBarComponents](./api/cesdk-js/type-aliases/navigationbarcomponents.md) | - |
| [NavigationBarOrderComponent](./api/cesdk-js/type-aliases/navigationbarordercomponent.md) | - |
| [NotificationDuration](./api/cesdk-js/type-aliases/notificationduration.md) | Represents the duration of the notification. |
| [NotificationType](./api/cesdk-js/type-aliases/notificationtype.md) | Represents the type of notification. |
| [NudgeAction](./api/cesdk-js/type-aliases/nudgeaction.md) | Action function for nudging the current selection in one direction. |
| [OnExportOptions](./api/cesdk-js/type-aliases/onexportoptions.md) | This interface extends the base ExportOptions with additional information about the export, including which design blocks were exported and the mimeType. |
| [OnExportVideoOptions](./api/cesdk-js/type-aliases/onexportvideooptions.md) | This interface extends the base VideoExportOptions with additional information about the export, including which design blocks were exported and the mimeType. |
| [OnUnsupportedBrowserAction](./api/cesdk-js/type-aliases/onunsupportedbrowseraction.md) | Action function that is invoked when an unsupported browser is detected. This allows custom handling of unsupported browser scenarios. |
| [Optional](./api/cesdk-js/type-aliases/optional.md) | Turn value at K of T into a Partial |
| [OrderComponentFor](./api/cesdk-js/type-aliases/ordercomponentfor.md) | Maps UI areas to their order component types. |
| [OrderComponentMatcher](./api/cesdk-js/type-aliases/ordercomponentmatcher.md) | Represents a matcher for order components. |
| [OrderContextFor](./api/cesdk-js/type-aliases/ordercontextfor.md) | Maps a UI area to its appropriate order context type for public API usage. - Caption panel uses CaptionPanelOrderContext (adds view property) - Video clip menu uses VideoClipMenuOrderContext (adds clipType) - All other areas use OrderContext (editMode only) |
| [PageAssetReference](./api/cesdk-js/type-aliases/pageassetreference.md) | Reference to a page preset from an asset source. |
| [PageDimensions](./api/cesdk-js/type-aliases/pagedimensions.md) | Direct page dimensions specification. |
| [PageFormatDefinition](./api/cesdk-js/type-aliases/pageformatdefinition.md) | Represents the definition of a page format in the Creative Editor SDK. This interface defines the width, height, unit, and optional fixed orientation for a page format. |
| [PageResizePanelPayload](./api/cesdk-js/type-aliases/pageresizepanelpayload.md) | Represents the payload for the page resize panel in the Creative Editor SDK. |
| [PageSelectNextAction](./api/cesdk-js/type-aliases/pageselectnextaction.md) | Action function for selecting the next page. |
| [PageSelectPreviousAction](./api/cesdk-js/type-aliases/pageselectpreviousaction.md) | Action function for selecting the previous page. |
| [PageSpec](./api/cesdk-js/type-aliases/pagespec.md) | A page can be specified as direct dimensions, an asset source reference, or an asset object (e.g., from engine.asset.fetchAsset()). All variants optionally accept a `color` to set the page fill color. |
| [PanelDisposer](./api/cesdk-js/type-aliases/paneldisposer.md) | Represents a function that disposes of a panel. |
| [PanelId](./api/cesdk-js/type-aliases/panelid.md) | Represents a unique identifier for a panel in the Creative Editor SDK. This type defines specific panel IDs and allows for custom panel IDs. |
| [PanelOptions](./api/cesdk-js/type-aliases/paneloptions.md) | Represents the options for a panel in the Creative Editor SDK. This interface defines the options for a panel, including whether it is closable by the user, its position, whether it is floating, and its payload. |
| [PanelPayload](./api/cesdk-js/type-aliases/panelpayload.md) | Represents the payload for a panel in the Creative Editor SDK. This type defines the payload based on the panel ID. |
| [PanelPosition](./api/cesdk-js/type-aliases/panelposition.md) | This type is used to specify the position of various panels within the user interface, such as the inspector, settings, and asset library panels. |
| [PasteAction](./api/cesdk-js/type-aliases/pasteaction.md) | Action function for pasting blocks from the clipboard |
| [PositionalUIArea](./api/cesdk-js/type-aliases/positionaluiarea.md) | UI areas where `at` is required to specify a slot. |
| [PositionFor](./api/cesdk-js/type-aliases/positionfor.md) | Maps positional UI areas to their valid `at` values. |
| [PreviewType](./api/cesdk-js/type-aliases/previewtype.md) | Represents a preview, which can be either an image or a color. |
| [PreviewTypeColor](./api/cesdk-js/type-aliases/previewtypecolor.md) | Represents a color preview. |
| [PreviewTypeImage](./api/cesdk-js/type-aliases/previewtypeimage.md) | Represents an image preview. |
| [SaveSceneAction](./api/cesdk-js/type-aliases/savesceneaction.md) | Action function for handling scene saving operations. |
| [SceneCreateAction](./api/cesdk-js/type-aliases/scenecreateaction.md) | Action for creating a new scene with configurable mode and page sizes. Returns the scene block ID. |
| [SceneCreateOptions](./api/cesdk-js/type-aliases/scenecreateoptions.md) | Options for creating a new scene. |
| [ScrollToBlockAction](./api/cesdk-js/type-aliases/scrolltoblockaction.md) | Action function for scrolling to a specific block |
| [ScrollToPageAction](./api/cesdk-js/type-aliases/scrolltopageaction.md) | Action function for scrolling to a specific page |
| [SelectionAllAction](./api/cesdk-js/type-aliases/selectionallaction.md) | Action function for selecting all blocks on the current page. |
| [SelectionDeleteAction](./api/cesdk-js/type-aliases/selectiondeleteaction.md) | Action function for deleting every selected block. |
| [SelectionDuplicateAction](./api/cesdk-js/type-aliases/selectionduplicateaction.md) | Action function for duplicating every selected block. |
| [SelectionGroupAction](./api/cesdk-js/type-aliases/selectiongroupaction.md) | Action function for grouping selected blocks. |
| [SelectionParentOrDeselectAction](./api/cesdk-js/type-aliases/selectionparentordeselectaction.md) | Action function for selecting the parent group of the current selection, or deselecting and refocusing the document when no eligible parent exists. |
| [SelectionSplitAction](./api/cesdk-js/type-aliases/selectionsplitaction.md) | Action for splitting the first selected clip at the playhead |
| [SelectionUngroupAction](./api/cesdk-js/type-aliases/selectionungroupaction.md) | Action function for ungrouping any selected group block. |
| [SetOrderOptions](./api/cesdk-js/type-aliases/setorderoptions.md) | Options for setting component order. Single area only for type safety with area-specific component types. |
| [ShareSceneAction](./api/cesdk-js/type-aliases/sharesceneaction.md) | Action function for handling scene sharing operations. |
| [ShortcutScopeId](./api/cesdk-js/type-aliases/shortcutscopeid.md) | The active `uiScope` of a keyboard-shortcut keypress. Resolves to: |
| [Suffix](./api/cesdk-js/type-aliases/suffix.md) | Represents additional options for a button, which can be used as a suffix. |
| [TextToggleBoldAction](./api/cesdk-js/type-aliases/texttoggleboldaction.md) | Action function for toggling bold on selected text. Branches on the engine edit mode internally. |
| [TextToggleItalicAction](./api/cesdk-js/type-aliases/texttoggleitalicaction.md) | Action function for toggling italic on selected text. Branches on the engine edit mode internally. |
| [TextToggleStrikethroughAction](./api/cesdk-js/type-aliases/texttogglestrikethroughaction.md) | Action function for toggling strikethrough on selected text. |
| [TextToggleUnderlineAction](./api/cesdk-js/type-aliases/texttoggleunderlineaction.md) | Action function for toggling underline on selected text. |
| [TimelineCollapseAction](./api/cesdk-js/type-aliases/timelinecollapseaction.md) | Action function for collapsing the video timeline. |
| [TimelineExpandAction](./api/cesdk-js/type-aliases/timelineexpandaction.md) | Action function for expanding the video timeline. |
| [TimelineSetHeightAction](./api/cesdk-js/type-aliases/timelinesetheightaction.md) | Action function for setting the video timeline's height. |
| [TimelineZoomInAction](./api/cesdk-js/type-aliases/timelinezoominaction.md) | Action function for zooming in the video timeline by one step. |
| [TimelineZoomOutAction](./api/cesdk-js/type-aliases/timelinezoomoutaction.md) | Action function for zooming out the video timeline by one step. |
| [TimelineZoomResetAction](./api/cesdk-js/type-aliases/timelinezoomresetaction.md) | Action function for resetting the video timeline zoom to default level (1.0). |
| [TimelineZoomToFitAction](./api/cesdk-js/type-aliases/timelinezoomtofitaction.md) | Action function for fitting the video timeline to show all content. |
| [TimelineZoomToLevelAction](./api/cesdk-js/type-aliases/timelinezoomtolevelaction.md) | Action function for setting the video timeline zoom to a specific level. |
| [ToggleUserInterfaceVisibilityAction](./api/cesdk-js/type-aliases/toggleuserinterfacevisibilityaction.md) | Action function for toggling the editor's user interface visibility. |
| [UIArea](./api/cesdk-js/type-aliases/uiarea.md) | Represents a UI area where components can be ordered. |
| [UIAreaContext](./api/cesdk-js/type-aliases/uiareacontext.md) | UI area-specific context - excludes base OrderContext properties (like editMode) that are read-only and derived from the engine. |
| [UIAreaSpecifier](./api/cesdk-js/type-aliases/uiareaspecifier.md) | Specifies which UI area(s) to target. Can be a single area, an array of areas, or a glob pattern. |
| [UnknownPanelPayload](./api/cesdk-js/type-aliases/unknownpanelpayload.md) | Represents an unknown payload for a panel in the Creative Editor SDK. This type defines a generic payload with unknown keys and values. |
| [UnknownTranslations](./api/cesdk-js/type-aliases/unknowntranslations.md) | Allows for custom translation keys beyond the built-in ones. |
| [UnsupportedCapabilityBehavior](./api/cesdk-js/type-aliases/unsupportedcapabilitybehavior.md) | Behavior for a browser capability check at editor startup. - `'block'`: Show a blocking error dialog (no dismiss) - `'warn'`: Show a dismissible warning dialog - `'ignore'`: Skip the check entirely |
| [UpdateSpec](./api/cesdk-js/type-aliases/updatespec.md) | Specifies an update either as a new ID, partial update, or updater function. |
| [UploadAction](./api/cesdk-js/type-aliases/uploadaction.md) | Action function for uploading files to asset sources. |
| [VectorPathDeleteNodeOrPointAction](./api/cesdk-js/type-aliases/vectorpathdeletenodeorpointaction.md) | Action function for deleting the selected vector node or control point. |
| [VideoClipType](./api/cesdk-js/type-aliases/videocliptype.md) | The type of clip in the video timeline. - `'clip'` — clips on the main (background) track - `'overlay'` — clips on overlay tracks above the main track - `'caption'` — caption clips |
| [VideoDecodeCheckSupportAction](./api/cesdk-js/type-aliases/videodecodechecksupportaction.md) | Action function for checking video decoding/playback support. Returns true if WebCodecs APIs are available for video decoding and playback. Shows a blocking error dialog if not supported (unless dialog is disabled). |
| [VideoEncodeCheckSupportAction](./api/cesdk-js/type-aliases/videoencodechecksupportaction.md) | Action function for checking video encoding/export support. Returns true if H.264 video encoding and AAC audio encoding are supported. Shows a warning dialog if not supported (unless dialog is disabled). |
| [VideoPlayPauseAction](./api/cesdk-js/type-aliases/videoplaypauseaction.md) | Action function for toggling play/pause on the current page. |
| [VideoSupportDialogOptions](./api/cesdk-js/type-aliases/videosupportdialogoptions.md) | Dialog display options for video support check actions. Allows configuring whether and how the dialog is displayed. |
| [VideoTimelineControlsBarComponentId](./api/cesdk-js/type-aliases/videotimelinecontrolsbarcomponentid.md) | Represents the ID of a video timeline controls bar component. |
| [ViewStyle](./api/cesdk-js/type-aliases/viewstyle.md) | Represents the view style options in the Creative Editor SDK. This type defines the possible view styles, which are 'advanced' and 'default'. |
| [ZoomInAction](./api/cesdk-js/type-aliases/zoominaction.md) | Action function for zooming in by one step |
| [ZoomOutAction](./api/cesdk-js/type-aliases/zoomoutaction.md) | Action function for zooming out by one step |
| [ZoomToBlockAction](./api/cesdk-js/type-aliases/zoomtoblockaction.md) | Action function for zooming to a specific block |
| [ZoomToFitAction](./api/cesdk-js/type-aliases/zoomtofitaction.md) | Action function for zooming to fit the current page in the viewport. |
| [ZoomToLevelAction](./api/cesdk-js/type-aliases/zoomtolevelaction.md) | Action function for setting zoom to a specific level |
| [ZoomToPageAction](./api/cesdk-js/type-aliases/zoomtopageaction.md) | Action function for zooming to a page with optional padding |
| [ZoomToSelectionAction](./api/cesdk-js/type-aliases/zoomtoselectionaction.md) | Action function for zooming to the current selection |

## Interfaces

| Interface | Description |
| ------ | ------ |
| [AssetLibraryEntry](./api/cesdk-js/interfaces/assetlibraryentry.md) | Represents an entry in the asset library, combining data and view configurations. |
| [BaseInsertOptions](./api/cesdk-js/interfaces/baseinsertoptions.md) | Options for inserting components into a UI area. |
| [BasePositionalInsertOptions](./api/cesdk-js/interfaces/basepositionalinsertoptions.md) | Options for inserting components into a positional UI area (e.g., canvas bar). |
| [Builder](./api/cesdk-js/interfaces/builder.md) | Interface for all available builder. Depending on the context different implementation might be used. A "Button" in the canvas menu might render different component than a button in the topbar or a panel. |
| [BuilderRenderFunctionContext](./api/cesdk-js/interfaces/builderrenderfunctioncontext.md) | Represents the context for rendering a builder function. |
| [BuiltinTranslations](./api/cesdk-js/interfaces/builtintranslations.md) | Built-in translation keys provided by the Creative Editor SDK. |
| [ButtonGroupOptions](./api/cesdk-js/interfaces/buttongroupoptions.md) | Represents options for a button group. |
| [ButtonOptions](./api/cesdk-js/interfaces/buttonoptions.md) | Represents options for a button. |
| [CanvasBarLocationOptions](./api/cesdk-js/interfaces/canvasbarlocationoptions.md) | Location options specifically for the canvas bar, which requires a position. |
| [CanvasMenuActionButton](./api/cesdk-js/interfaces/canvasmenuactionbutton.md) | Base interface for action buttons in the canvas menu. Contains common properties shared across all canvas menu button types. |
| [CanvasMenuCustomActionButton](./api/cesdk-js/interfaces/canvasmenucustomactionbutton.md) | Interface representing a custom canvas menu action button. Note: This component requires a key and has a required label, unlike other action buttons. |
| [CanvasMenuOptionsComponent](./api/cesdk-js/interfaces/canvasmenuoptionscomponent.md) | Interface representing the canvas menu options dropdown component. This component can contain children components that are rendered in a dropdown menu. |
| [CaptionPanelOrderContext](./api/cesdk-js/interfaces/captionpanelordercontext.md) | Context for the caption panel which adds view-based filtering. |
| [CESDKConfiguration](./api/cesdk-js/interfaces/cesdkconfiguration.md) | Represents the configuration settings for the Creative Editor SDK. This interface defines various settings such as locale, theme, development mode, user interface, internationalization, accessibility, callbacks, feature flags, and logger. |
| [CheckboxOptions](./api/cesdk-js/interfaces/checkboxoptions.md) | Represents options for a checkbox. |
| [ClipContextMenuCustomAction](./api/cesdk-js/interfaces/clipcontextmenucustomaction.md) | Interface representing a generic custom action in the clip context menu. Requires a `key` to uniquely identify the action and a `label` for display. |
| [ColorInputOptions](./api/cesdk-js/interfaces/colorinputoptions.md) | Represents options for a color input. |
| [ComponentMatchOptions](./api/cesdk-js/interfaces/componentmatchoptions.md) | Options for update and remove operations. Supports multi-area operations via arrays or glob patterns. |
| [ComponentOptions](./api/cesdk-js/interfaces/componentoptions.md) | Represents options for a component. |
| [ComponentPayload](./api/cesdk-js/interfaces/componentpayload.md) | Represents the payload of a component. |
| [CustomDockComponent](./api/cesdk-js/interfaces/customdockcomponent.md) | Represents a custom dock component. |
| [Dialog](./api/cesdk-js/interfaces/dialog.md) | Represents a dialog configuration. |
| [DockLocationOptions](./api/cesdk-js/interfaces/docklocationoptions.md) | Location options specifically for the dock, which supports an optional position. |
| [DropdownChildrenContext](./api/cesdk-js/interfaces/dropdownchildrencontext.md) | Represents the context for the children of a dropdown. |
| [DropdownOptions](./api/cesdk-js/interfaces/dropdownoptions.md) | Represents options for a dropdown. |
| [EditorPlugin](./api/cesdk-js/interfaces/editorplugin.md) | Represents an editor plugin. This interface defines the structure of an editor plugin, including its name, version, and initialization function. |
| [EngineErrorMessage](./api/cesdk-js/interfaces/engineerrormessage.md) | Customer-facing copy resolved from a thrown engine error. |
| [ExportOptions](./api/cesdk-js/interfaces/exportoptions.md) | Specifies options for exporting design blocks to various formats. |
| [HeadingOptions](./api/cesdk-js/interfaces/headingoptions.md) | Represents options for a heading. |
| [InputOptions](./api/cesdk-js/interfaces/inputoptions.md) | Represents options for an input. |
| [InsertAfterOptions](./api/cesdk-js/interfaces/insertafteroptions.md) | Insert after a matched component. |
| [InsertAppendOptions](./api/cesdk-js/interfaces/insertappendoptions.md) | Append to end (default behavior). |
| [InsertAtPositionOptions](./api/cesdk-js/interfaces/insertatpositionoptions.md) | Insert at a specific position. |
| [InsertBeforeOptions](./api/cesdk-js/interfaces/insertbeforeoptions.md) | Insert before a matched component. |
| [InsertResult](./api/cesdk-js/interfaces/insertresult.md) | Result of an insert operation. |
| [KeyboardShortcut](./api/cesdk-js/interfaces/keyboardshortcut.md) | Unified keyboard shortcut definition |
| [LibraryOptions](./api/cesdk-js/interfaces/libraryoptions.md) | Represents options for a library. |
| [MediaPreviewOptions](./api/cesdk-js/interfaces/mediapreviewoptions.md) | Represents options for a media preview. |
| [NavigationBarActionButton](./api/cesdk-js/interfaces/navigationbaractionbutton.md) | Base interface for action buttons in the navigation bar. Contains common properties shared across all action button types. |
| [NavigationBarCustomActionButton](./api/cesdk-js/interfaces/navigationbarcustomactionbutton.md) | Interface representing a generic Action Button in the navigation bar component. Note: This component requires a key and has a required label, unlike other action buttons. |
| [Notification](./api/cesdk-js/interfaces/notification.md) | Represents a notification configuration. |
| [NumberInputOptions](./api/cesdk-js/interfaces/numberinputoptions.md) | Represents options for a number input. |
| [OrderComponent](./api/cesdk-js/interfaces/ordercomponent.md) | Represents an order component. |
| [OrderComponentWithChildren](./api/cesdk-js/interfaces/ordercomponentwithchildren.md) | Represents a custom dock component. |
| [OrderContext](./api/cesdk-js/interfaces/ordercontext.md) | Context for ordering components. Contains editMode which is used by most UI areas. |
| [PositionalInsertAfterOptions](./api/cesdk-js/interfaces/positionalinsertafteroptions.md) | Insert after a matched component (positional areas). |
| [PositionalInsertAppendOptions](./api/cesdk-js/interfaces/positionalinsertappendoptions.md) | Append to end (positional areas). |
| [PositionalInsertAtPositionOptions](./api/cesdk-js/interfaces/positionalinsertatpositionoptions.md) | Insert at a specific position (positional areas). |
| [PositionalInsertBeforeOptions](./api/cesdk-js/interfaces/positionalinsertbeforeoptions.md) | Insert before a matched component (positional areas). |
| [RegisteredActions](./api/cesdk-js/interfaces/registeredactions.md) | Represents a collection of action functions used throughout the application. Each property corresponds to a specific UI action or event that can be customized. |
| [RemoveResult](./api/cesdk-js/interfaces/removeresult.md) | Result of a remove operation on a single area. |
| [ReplaceAssetLibraryEntriesContext](./api/cesdk-js/interfaces/replaceassetlibraryentriescontext.md) | Provides context for replacing asset library entries, including the selected blocks and the default entries (each may carry per-entry source exclusions). |
| [SectionOptions](./api/cesdk-js/interfaces/sectionoptions.md) | Represents options for a section. |
| [SelectOptions](./api/cesdk-js/interfaces/selectoptions.md) | Options for a select input. |
| [SelectValue](./api/cesdk-js/interfaces/selectvalue.md) | Represents a value for a select input. |
| [SliderOptions](./api/cesdk-js/interfaces/slideroptions.md) | Represents options for a slider. |
| [SpinnerOptions](./api/cesdk-js/interfaces/spinneroptions.md) | Represents options for a loading spinner. |
| [TabOptions](./api/cesdk-js/interfaces/taboptions.md) | Represents a single tab of a tab bar. |
| [TabsOptions](./api/cesdk-js/interfaces/tabsoptions.md) | Represents options for a tab bar. |
| [TextAreaOptions](./api/cesdk-js/interfaces/textareaoptions.md) | Represents options for a text area. |
| [TextInputOptions](./api/cesdk-js/interfaces/textinputoptions.md) | Represents options for a text input. |
| [TextOptions](./api/cesdk-js/interfaces/textoptions.md) | Represents options for text. |
| [Translations](./api/cesdk-js/interfaces/translations.md) | Complete translation type that includes both built-in and custom translations. |
| [UILocationOptions](./api/cesdk-js/interfaces/uilocationoptions.md) | Location options for non-positional UI areas. |
| [UpdateResult](./api/cesdk-js/interfaces/updateresult.md) | Result of an update operation on a single area. |
| [UserInterface](./api/cesdk-js/interfaces/userinterface.md) | Specifies the configuration for the user interface of the Creative Editor SDK. |
| [VideoClipMenuOrderContext](./api/cesdk-js/interfaces/videoclipmenuordercontext.md) | Context for the clip context menu which adds clip type filtering. |

## Namespaces

| Namespace | Description |
| ------ | ------ |
| [ConfigTypes](./api/cesdk-js/documentation/namespaces/configtypes.md) | - |
| [ExperimentalBuilder](./api/cesdk-js/documentation/namespaces/experimentalbuilder.md) | Namespace containing experimental features for the builder. These features are subject to change and may not be stable for production use. |
| [ExperimentalUserInterfaceAPI](./api/cesdk-js/documentation/namespaces/experimentaluserinterfaceapi.md) | Provides experimental methods for controlling the UI of the Creative Editor SDK. |
| [UserInterfaceElements](./api/cesdk-js/documentation/namespaces/userinterfaceelements.md) | - |

## Variables

| Variable | Description |
| ------ | ------ |
| [AddImageOptions](./api/cesdk-js/variables/addimageoptions.md) | - |
| [CANVAS\_SHORTCUT\_SCOPE](./api/cesdk-js/variables/canvas_shortcut_scope.md) | - |
| [EDITOR\_SHORTCUT\_SCOPE](./api/cesdk-js/variables/editor_shortcut_scope.md) | - |
| [~~PanelPosition~~](./api/cesdk-js/variables/panelposition.md) | - |
| [VIDEO\_TIMELINE\_SHORTCUT\_SCOPE](./api/cesdk-js/variables/video_timeline_shortcut_scope.md) | - |


---

## More Resources

- **[React Documentation Index](https://img.ly/docs/cesdk/react.md)** - Browse all React documentation
- **[cesdk-js API Reference](./api/cesdk-js.md)** - Full cesdk-js API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./react.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support