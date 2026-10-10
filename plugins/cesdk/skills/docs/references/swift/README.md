# CE.SDK Swift Documentation

## Platform and Module Scope

Determine the target from the request, active Xcode destination, Package.swift,
or project settings. If the answer materially changes and the target remains
unclear, ask whether it is iOS, macOS, or Mac Catalyst.

| Module surface | iOS | macOS | Mac Catalyst |
|---|---:|---:|---:|
| `IMGLYEngine` | Yes | Yes | Yes |
| `IMGLYCore`, `IMGLYCoreUI`, `IMGLYCamera`, `IMGLYEditor` | Yes | No | No |
| Prebuilt editor products and SwiftUI starter kits | Yes | No | No |

For macOS or Mac Catalyst editor-UI requests, explain that the prebuilt editor
UI is unavailable and offer an `IMGLYEngine`-backed custom UI instead.

## Source Priority

1. Prefer live Xcode symbol or documentation lookup, when available, for exact
   installed-SDK signatures, generic constraints, availability, and deprecations.
2. Use bundled API digests for discovery, planning, and portable lookup.
3. Use the guides on the docs site for integration recipes.
4. Use pretrained knowledge only when the installed SDK, the bundle, and the
   docs site do not answer.

If live Xcode symbols disagree with a bundled API digest, follow the installed
SDK and call out the version difference.

## Lookup Workflow

1. Resolve the target platform and module surface.
2. Search the guide index of the target (`ios.md`, `macos.md`, or
   `mac-catalyst.md` in this folder) and fetch the pages as described in
   Remote Documentation below.
3. For API lookup, use the module-qualified index and read
   `api/<Module>/<Type>.md`, for example
   `api/IMGLYEngine/AssetAPI.md`.
4. Cross-check exact callable signatures in live Xcode documentation when
   available.

## Remote Documentation

The guides are on the CE.SDK docs site, not in this bundle. The index files in
this folder list them:

- `ios.md` lists every page of https://img.ly/docs/cesdk/dev/ios/ with its title and link.
- `macos.md` lists every page of https://img.ly/docs/cesdk/dev/macos/ with its title and link.
- `mac-catalyst.md` lists every page of https://img.ly/docs/cesdk/dev/mac-catalyst/ with its title and link.

The links point to the docs of CE.SDK `1.85.0-nightly.20261010`, the version of this bundle,
under `https://img.ly/docs/cesdk/dev/`. The docs site keeps one copy per version, with the same
page paths:

| CE.SDK version | Docs root |
| --- | --- |
| Latest stable release | `https://img.ly/docs/cesdk/` |
| A stable release since 1.60 | `https://img.ly/docs/cesdk/archive/v<major>.<minor>/` |
| Latest release candidate | `https://img.ly/docs/cesdk/next/` |
| Latest nightly | `https://img.ly/docs/cesdk/dev/` |

1. **Check the version.** Read the CE.SDK version the project uses. If it is not
   `1.85.0-nightly.20261010`, replace `https://img.ly/docs/cesdk/dev/` in each link with the root of that
   version.
2. **Read the index** in this folder and pick the pages that match the query.
3. **Fetch each page as Markdown**: remove the trailing `/` from the link and add
   `.md`. For example, `https://img.ly/docs/cesdk/dev/ios/<path>-<id>/` becomes
   `https://img.ly/docs/cesdk/dev/ios/<path>-<id>.md`. Use WebFetch. If WebFetch is not
   available (for example in Codex), use `curl -sL --compressed <url>`. If a
   page returns 404, it does not exist in that version: read that version's
   index, `<root>ios.md`, instead.
4. **Answer from the fetched pages**, and cite their URLs. If neither a page nor
   the bundled API digests cover the request, say so instead of filling the gap
   with pre-trained knowledge.
5. **Full text, last resort**: `https://img.ly/docs/cesdk/ios/llms-full.txt` holds all pages
   of the latest stable release in one file of several MB. Search it with
   `curl -sL --compressed <url> | grep -n "<keyword>"`. Do not read it in full.

## API Index

<-- IMGLY-TYPES-MD-START -->
[CE.SDK Swift API Index]|root: ./api|

IMGLYCamera:{Camera,CameraConfiguration,CameraError,CameraLayoutMode,CameraMode,CameraResult,Capture,CaptureCount,CaptureType,IMGLYEngine,Photo,Recording,Swift}|platforms:{ios}
IMGLYCore:{EngineSettings,Foundation,IMGLY,IMGLYCompatible,PhotoRollAssetSource,PhotoRollAssetSourceMode,PhotoRollMediaType,TextAssetSource[deprecated]}|platforms:{ios}
IMGLYCoreUI:{AssetLibrary,AssetLibraryBuilder,AssetLibraryCategory,AssetLibraryContent,AssetLibraryGroup,AssetLibraryModifierError,AssetLibraryMoreTab,AssetLibrarySection,AssetLibrarySource,AssetLibraryTab,AssetLibraryTabView,AssetLibraryView,AssetLoader,AssetPreview,AudioGrid,AudioList,AudioPreview,AudioUploadButton,AudioUploadGrid,CategoryModifier,DefaultAssetLibrary[deprecated],ImageGrid,IMGLYCore,IMGLYEngine,MediaType,Message,nonNil(_:file:function:line:),PhotoRollAccessory,PhotoRollDestination,PhotoRollPreview,SectionModifier,ShapeGrid,StickerGrid,SwiftUICore,TextComponentGrid,TextGrid,TextList,TextPresetsGrid,TextPreview,UploadButton,UploadGrid}|platforms:{ios}
IMGLYEditor:{AdaptiveIconOnlyLabelStyle,ArrayBuilder,ArrayModifier,AssetLibraryButtonStyle,AssetLibraryConfiguration,BackgroundColorIcon,BottomPanel,CanvasMenu,CanvasMenuLabelStyle,CategoryModifications,DefaultTimelineComponent[deprecated],Dock,Editor,EditorComponent,EditorComponentID,EditorComponents,EditorConfiguration,EditorContext,EditorError,EditorEvent,EditorEventHandler,EditorEvents,EditorState,EditorViewMode,ExportProgress,FillStrokeIcon,ForceCropMode,ForceCropPreset,IMGLYCore,InspectorBar,NamedColor,NavigationBar,NavigationLabel,None,OnChanged,OnClose,OnCreate,OnError,OnExport,OnLoaded,OnUpload,SheetStyle,SheetType,SheetTypes,SwiftUI,Timeline,transitionIncomingClip(engine:outgoing:)}|platforms:{ios}
IMGLYEngine:{AnimationEasing,AnimationType,Asset,AssetAPI,AssetColor,AssetContext,AssetCredits,AssetDefinition,AssetFacetPath,AssetFacetValue,AssetFilter,AssetLicense,AssetPayload,AssetPlacement,AssetProperty,AssetQueryData,AssetQueryResult,AssetResult,AssetSource,AssetSpotColorRepresentation,AssetTransformPreset,AssetUTM,AudioExport,AudioExportOptions,AudioFromVideoOptions,AudioThumbnail,AudioTrackInfo,BlendMode,Blob,BlockAPI,BlockEvent,BlockEventType,BlockState,BlockStateError,BlurType,BooleanOperation,Canvas,char8_t,CharacterInkBox,CMYK,CMYKProfileInfo,Color,ColorRenderingIntent,ColorSpace,CompressionFormat,CompressionLevel,CompressionOptions,ContentFillMode,CursorType,CutoutOperation,CutoutType,DesignBlockID,DesignBlockType,DesignUnit,DominantColor,DominantColorsOptions,EditMode,EditorAPI,EffectType,Engine,EngineError,EngineErrorCode,EngineErrorDomain,EventAPI,ExportOptions,FetchAssetOptions,FillRule,FillType,Font,FontMetrics,FontStyle,FontUnit,FontWeight,GlobalScope,GradientColorStop,GradientType,Groups,H264Profile,HandleVisibility,History,HistoryUpdate,HorizontalBlockAlignment,HorizontalContentFillAlignment,HorizontalTextAlignment,LicenseError,ListStyle,Locale,MIMEType,MovementConstraintRule,MovementConstraintScope,ObjectType,PositionMode,PropertyType,ResolvedMovementConstraint,RGBA,SaveToArchiveOptions,SaveToStringOptions,SceneAPI,SceneLayout,SceneMode,ScriptStyle,SelectionBox,ShapeType,SizeMode,SortingOrder,SortKey,Source,SplitOptions,StrokeCap,StrokeCornerGeometry,StrokePosition,StrokeStyle,Subscription,TextCase,TextDecorationConfig,TextDecorationLine,TextDecorationStyle,TextRunInfo,TransitionType,Typeface,UBQ,VariableAPI,VerticalBlockAlignment,VerticalContentFillAlignment,VideoBitrate,VideoExport,VideoExportOptions,VideoThumbnail,ZoomAutoFitAxis}|platforms:{ios,macos,mac-catalyst}
<-- IMGLY-TYPES-MD-END -->

## Related Skills

- Use the sibling `build` skill to implement or scaffold Swift code.
- Use the sibling `explain` skill for a conceptual walkthrough.
