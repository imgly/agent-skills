> This is one page of the CE.SDK SvelteKit `@cesdk/engine` API reference. For a complete overview, see the [SvelteKit Documentation Index](https://img.ly/docs/cesdk/sveltekit.md) or the [engine API Index](./api/engine.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

## Classes

| Class | Description |
| ------ | ------ |
| [AssetAPI](./api/engine/classes/assetapi.md) | Manage asset sources and apply assets to scenes. |
| [BlockAPI](./api/engine/classes/blockapi.md) | Create, manipulate, and query the building blocks of your design. |
| [CreativeEngine](./api/engine/classes/creativeengine.md) | The CreativeEngine is the core processing unit of CE.SDK and handles state management, rendering, input handling, and much more. It provides APIs to directly interact with assets, blocks, scenes, and variables. These APIs can be used in a headless environment to build and manipulate designs programmatically, or in a browser to create interactive applications. |
| [EditorAPI](./api/engine/classes/editorapi.md) | Control the design editor's behavior and settings. |
| [EngineActions](./api/engine/classes/engineactions.md) | Named, overridable actions for one engine. Actions are either JS closures you register or engine defaults (e.g. undo/redo), and either kind can override the other by reusing the id. |
| [EngineError](./api/engine/classes/engineerror.md) | Structured CE.SDK error. Extends the standard JS `Error` so existing `try { ... } catch (error) { console.log(error.message); }` flows keep working — `message` is the engine's rendered English string. The structured fields (`code`, `category`, `hint`, `args`, `docsUrl`, `silent`) let consumers branch on stable identifiers instead of matching on the message string and surface customer-facing copy + doc links. |
| [EventAPI](./api/engine/classes/eventapi.md) | Subscribe to block lifecycle events in the design engine. |
| [SceneAPI](./api/engine/classes/sceneapi.md) | Create, load, save, and manipulate scenes. |
| [ShortcutsAPI](./api/engine/classes/shortcutsapi.md) | `engine.shortcuts` — a remappable map of keyboard shortcuts to actions. |
| [VariableAPI](./api/engine/classes/variableapi.md) | Manage text variables within design templates. |

## Functions

| Function | Description |
| ------ | ------ |
| [checkVideoExportSupport](./api/engine/functions/checkvideoexportsupport.md) | Throws an error if the current browser does not support video exporting. |
| [checkVideoSupport](./api/engine/functions/checkvideosupport.md) | Throws an error if the current browser does not support video editing. |
| [\_combineProperties](./api/engine/functions/combineproperties.md) | Combines multiple reactive properties into a single reactive property. |
| [\_createDerivedProperty](./api/engine/functions/createderivedproperty.md) | Creates a derived reactive property from one or more sources. |
| [\_createReactiveProperty](./api/engine/functions/createreactiveproperty.md) | Creates a reactive property with subscribe, value, and update methods. |
| [\_createTrackedProperty](./api/engine/functions/createtrackedproperty.md) | Creates a reactive property that tracks a source and updates based on a getter/setter. |
| [createVariableFontCombinations](./api/engine/functions/createvariablefontcombinations.md) | Generates an array of [Font](./api/engine/interfaces/font.md) entries for a variable font file. |
| [defaultLogger](./api/engine/functions/defaultlogger.md) | - |
| [isCMYKColor](./api/engine/functions/iscmykcolor.md) | Type guard for [CMYKColor](./api/engine/interfaces/cmykcolor.md). |
| [isEngineError](./api/engine/functions/isengineerror.md) | Predicate that narrows an unknown thrown value to [EngineError](./api/engine/classes/engineerror.md). |
| [isRGBAColor](./api/engine/functions/isrgbacolor.md) | Type guard for [RGBAColor](./api/engine/interfaces/rgbacolor.md). |
| [isSpotColor](./api/engine/functions/isspotcolor.md) | Type guard for [SpotColor](./api/engine/interfaces/spotcolor.md). |
| [\_makeSource](./api/engine/functions/makesource.md) | Creates a simple event source that can emit values to subscribed listeners. |
| [\_mergeSources](./api/engine/functions/mergesources.md) | Merges multiple event sources into a single source that emits when any source emits. |
| [normalizeKeyCombo](./api/engine/functions/normalizekeycombo.md) | Convert a combo into the internal canonical form (sorted modifiers, lowercase letters, `Mod` for Cmd/Ctrl). Exposed so hosts can match against it. |
| [supportsBrowser](./api/engine/functions/supportsbrowser.md) | Checks if the current browser supports necessary technologies to match our supported browsers |
| [supportsVideo](./api/engine/functions/supportsvideo.md) | Checks if the current browser supports video editing. |
| [supportsVideoExport](./api/engine/functions/supportsvideoexport.md) | Checks if the current browser supports video exporting. |
| [supportsWasm](./api/engine/functions/supportswasm.md) | Checks if the current browser supports web assembly |

## Type Aliases

| Type Alias | Description |
| ------ | ------ |
| [AddImageOptions](./api/engine/type-aliases/addimageoptions.md) | Options for adding images to the scene. |
| [AnimationBaselineDirection](./api/engine/type-aliases/animationbaselinedirection.md) | - |
| [AnimationBlockSwipeTextDirection](./api/engine/type-aliases/animationblockswipetextdirection.md) | - |
| [AnimationEasing](./api/engine/type-aliases/animationeasing.md) | - |
| [AnimationEntry](./api/engine/type-aliases/animationentry.md) | Configuration options for animations. |
| [AnimationGrowDirection](./api/engine/type-aliases/animationgrowdirection.md) | - |
| [AnimationJumpLoopDirection](./api/engine/type-aliases/animationjumploopdirection.md) | - |
| [AnimationKenBurnsDirection](./api/engine/type-aliases/animationkenburnsdirection.md) | - |
| [AnimationMergeTextDirection](./api/engine/type-aliases/animationmergetextdirection.md) | - |
| [AnimationOptions](./api/engine/type-aliases/animationoptions.md) | Options for configuring animations (in, loop, out animations). |
| [AnimationSpinDirection](./api/engine/type-aliases/animationspindirection.md) | - |
| [AnimationSpinLoopDirection](./api/engine/type-aliases/animationspinloopdirection.md) | - |
| [AnimationType](./api/engine/type-aliases/animationtype.md) | The block type IDs for the animation blocks. These are the IDs used to create new animations using `cesdk.engine.block.createAnimation(id)`. Refer to [AnimationTypeShorthand](./api/engine/type-aliases/animationtypeshorthand.md) and [AnimationTypeLonghand](./api/engine/type-aliases/animationtypelonghand.md) for more details. |
| [AnimationTypeLonghand](./api/engine/type-aliases/animationtypelonghand.md) | The longhand block type IDs for the animation blocks. These are the IDs used to create new animations using `cesdk.engine.block.createAnimation(id)`. |
| [AnimationTypeShorthand](./api/engine/type-aliases/animationtypeshorthand.md) | - |
| [AnimationTypewriterTextWritingStyle](./api/engine/type-aliases/animationtypewritertextwritingstyle.md) | - |
| [AnimationWipeDirection](./api/engine/type-aliases/animationwipedirection.md) | - |
| [ApplicationMimeType](./api/engine/type-aliases/applicationmimetype.md) | Represents the application MIME types used in the editor. |
| [AssetColor](./api/engine/type-aliases/assetcolor.md) | Asset Color payload |
| [AssetFacetPath](./api/engine/type-aliases/assetfacetpath.md) | Property paths that can be faceted — the facetable subset of `AssetPropertyPath`. `label` and `id` are excluded because their cardinality is unbounded. |
| [AssetFilter](./api/engine/type-aliases/assetfilter.md) | Filter expression — predicate or logical combinator. Combinators nest arbitrarily. The union is mutually exclusive: an object with both `and` and `or`, or with `property` next to a combinator key, is rejected at the type level. |
| [AssetGroups](./api/engine/type-aliases/assetgroups.md) | An asset can be member of multiple groups. Groups have a semantic meaning used to build and group UIs exploring the assets, e.g.sections in the content library, or for things like topics in Unsplash for instance. |
| [AssetMetaData](./api/engine/type-aliases/assetmetadata.md) | Generic asset information |
| [AssetProperty](./api/engine/type-aliases/assetproperty.md) | Asset property for payload |
| [AssetPropertyFilter](./api/engine/type-aliases/assetpropertyfilter.md) | A single property predicate. Exactly one of `contains` (case-insensitive substring) or `equals` (case-insensitive equality) must be set — the type forbids passing both or neither. On a string-array property (`tags`, `groups`), the operator matches if any element matches. `meta.<key>` values are flat strings, compared whole. |
| [AssetPropertyPath](./api/engine/type-aliases/assetpropertypath.md) | Dot-path against the resolved asset that a property predicate targets: `label`, `id`, `tags`, `groups`, or `meta.<key>` (one segment). |
| [AssetStylePresetAnimationProperties](./api/engine/type-aliases/assetstylepresetanimationproperties.md) | The parameters of an [AssetStylePresetAnimation](./api/engine/interfaces/assetstylepresetanimation.md): a map of the animation's property paths to values. The animation's `animation/*` properties (e.g. `animation/slide/fade`, `animation/grow/scaleFactor`) are value-checked and autocomplete, as are the animation controls (`playback/duration`, `animationEasing`, `textWritingStyle`, `textWritingOverlap`); any other property path is still accepted. These are animation paths, distinct from the block-property paths in [AssetStylePresetProperties](./api/engine/type-aliases/assetstylepresetproperties.md). |
| [AssetStylePresetProperties](./api/engine/type-aliases/assetstylepresetproperties.md) | The look of an [AssetStylePreset](./api/engine/interfaces/assetstylepreset.md): a map of property paths to values. Known paths are value-checked and autocomplete (e.g. `stroke/enabled` must be a boolean, `stroke/width` a number, `fill/solid/color` a color); any other property path is still accepted with the broader [AssetStylePresetPropertyValue](./api/engine/type-aliases/assetstylepresetpropertyvalue.md). Keys without a `/` are namespaced to the block (`text/` or `caption/`); keys with a `/` are used verbatim. |
| [AssetStylePresetPropertyValue](./api/engine/type-aliases/assetstylepresetpropertyvalue.md) | A value a style preset can set on a property: a boolean, number, string (including enum values) or an RGB(A) color. Colors must be RGB(A) (`{ r, g, b, a? }`); CMYK and spot colors are not supported in presets. Structs and source sets cannot be set from a preset. A `null` value is ignored for regular properties; for the virtual `text/path` property it clears the baseline path. |
| [AssetStylePresetScalableProperty](./api/engine/type-aliases/assetstylepresetscalableproperty.md) | A length property a style preset may scale with the block's font size (see [AssetStylePreset.scaleWithFontSize](./api/engine/interfaces/assetstylepreset.md)). Restricted to the decoration lengths for which scaling is meaningful — stroke width, drop-shadow offset/blur and the caption background corner radius — not arbitrary numeric properties like `rotation` or `opacity`. |
| [AssetTransformPreset](./api/engine/type-aliases/assettransformpreset.md) | Transform preset payload |
| [AsyncURIResolver](./api/engine/type-aliases/asyncuriresolver.md) | An async-compatible URI resolver function. |
| [AudioExportOptions](./api/engine/type-aliases/audioexportoptions.md) | Represents the options for exporting audio. |
| [AudioFromVideoOptions](./api/engine/type-aliases/audiofromvideooptions.md) | Options for configuring audio extraction from video operations. |
| [AudioMimeType](./api/engine/type-aliases/audiomimetype.md) | Represents the audio MIME types used in the editor. |
| [BlendMode](./api/engine/type-aliases/blendmode.md) | - |
| [BlockEnumType](./api/engine/type-aliases/blockenumtype.md) | - |
| [BlockState](./api/engine/type-aliases/blockstate.md) | Represents the state of a design block. |
| [BlurType](./api/engine/type-aliases/blurtype.md) | The block type IDs for the blur blocks. These are the IDs used to create new blurs using `cesdk.engine.block.createBlur(id)`. Refer to [BlurTypeShorthand](./api/engine/type-aliases/blurtypeshorthand.md) and [BlurTypeLonghand](./api/engine/type-aliases/blurtypelonghand.md) for more details. |
| [BlurTypeLonghand](./api/engine/type-aliases/blurtypelonghand.md) | The longhand block type IDs for the blur blocks. These are the IDs used to create new blurs using `cesdk.engine.block.createBlur(id)`. |
| [BlurTypeShorthand](./api/engine/type-aliases/blurtypeshorthand.md) | - |
| [BooleanOperation](./api/engine/type-aliases/booleanoperation.md) | Represents the names of boolean operations. |
| [BoolPropertyName](./api/engine/type-aliases/boolpropertyname.md) | - |
| [CameraClampingOvershootMode](./api/engine/type-aliases/cameraclampingovershootmode.md) | - |
| [Canvas](./api/engine/type-aliases/canvas.md) | An HTML Canvas or an Offscreen Canvas |
| [CaptionHorizontalAlignment](./api/engine/type-aliases/captionhorizontalalignment.md) | - |
| [CaptionVerticalAlignment](./api/engine/type-aliases/captionverticalalignment.md) | - |
| [CMYK](./api/engine/type-aliases/cmyk.md) | Represents a color in the CMYK color space. |
| [Color](./api/engine/type-aliases/color.md) | Represents all color types supported by the engine. |
| [ColorPickerColorMode](./api/engine/type-aliases/colorpickercolormode.md) | - |
| [ColorPropertyName](./api/engine/type-aliases/colorpropertyname.md) | - |
| [ColorSpace](./api/engine/type-aliases/colorspace.md) | Represents the color space used in the editor. |
| [ContentFillMode](./api/engine/type-aliases/contentfillmode.md) | - |
| [ControlGizmoMoveHandleVisibility](./api/engine/type-aliases/controlgizmomovehandlevisibility.md) | - |
| [ControlGizmoResizeHandlesVisibility](./api/engine/type-aliases/controlgizmoresizehandlesvisibility.md) | - |
| [ControlGizmoRotateHandlesVisibility](./api/engine/type-aliases/controlgizmorotatehandlesvisibility.md) | - |
| [ControlGizmoScaleHandlesVisibility](./api/engine/type-aliases/controlgizmoscalehandlesvisibility.md) | - |
| [CreateSceneOptions](./api/engine/type-aliases/createsceneoptions.md) | Options for creating a video scene. |
| [CutoutOperation](./api/engine/type-aliases/cutoutoperation.md) | Represents the type of a cutout. |
| [CutoutType](./api/engine/type-aliases/cutouttype.md) | - |
| [~~DefaultAssetSourceId~~](./api/engine/type-aliases/defaultassetsourceid.md) | Represents the default asset source IDs used in the editor. |
| [~~DemoAssetSourceId~~](./api/engine/type-aliases/demoassetsourceid.md) | Represents the default demo asset source IDs used in the editor. |
| [DesignBlockId](./api/engine/type-aliases/designblockid.md) | A numerical identifier for a design block |
| [DesignBlockType](./api/engine/type-aliases/designblocktype.md) | The block type IDs for the top-level design blocks. These are the IDs used to create new blocks using `cesdk.engine.block.create(id)`. Refer to [DesignBlockTypeShorthand](./api/engine/type-aliases/designblocktypeshorthand.md) and [DesignBlockTypeLonghand](./api/engine/type-aliases/designblocktypelonghand.md) for more details. |
| [DesignBlockTypeLonghand](./api/engine/type-aliases/designblocktypelonghand.md) | The longhand block type IDs for the top-level design blocks. These are the IDs used to create new blocks using `cesdk.engine.block.create(id)`. |
| [DesignBlockTypeShorthand](./api/engine/type-aliases/designblocktypeshorthand.md) | - |
| [DoubleClickSelectionMode](./api/engine/type-aliases/doubleclickselectionmode.md) | - |
| [DoublePropertyName](./api/engine/type-aliases/doublepropertyname.md) | - |
| [DropShadowOptions](./api/engine/type-aliases/dropshadowoptions.md) | Options for configuring drop shadow effects on blocks. |
| [EditMode](./api/engine/type-aliases/editmode.md) | Represents the current edit mode of the editor. |
| [EffectType](./api/engine/type-aliases/effecttype.md) | The block type IDs for the effect blocks. These are the IDs used to create new effects using `cesdk.engine.block.createEffect(id)`. Refer to [EffectTypeShorthand](./api/engine/type-aliases/effecttypeshorthand.md) and [EffectTypeLonghand](./api/engine/type-aliases/effecttypelonghand.md) for more details. |
| [EffectTypeLonghand](./api/engine/type-aliases/effecttypelonghand.md) | The longhand block type IDs for the effect blocks. These are the IDs used to create new effects using `cesdk.engine.block.createEffect(id)`. |
| [EffectTypeShorthand](./api/engine/type-aliases/effecttypeshorthand.md) | - |
| [EngineActionId](./api/engine/type-aliases/engineactionid.md) | Known action ids from [EngineActionsRegistry](./api/engine/interfaces/engineactionsregistry.md). |
| [EngineCustomActionFunction](./api/engine/type-aliases/enginecustomactionfunction.md) | A generic, untyped action function for custom ids. |
| [EngineErrorArg](./api/engine/type-aliases/engineerrorarg.md) | Typed value of a structured-error template argument. The engine preserves the original primitive type (`boolean`, `number`, `string`) when crossing the binding boundary, so customer-facing i18n layers can format numbers, plurals, etc. without parsing stringified values. |
| [EngineErrorCode](./api/engine/type-aliases/engineerrorcode.md) | Every stable catalog error code as a string-literal union. Use it to type-check a branch on [EngineError.code](./api/engine/classes/engineerror.md) (which stays a plain `string` so unknown/future codes never break consumers): |
| [EnginePluginContext](./api/engine/type-aliases/engineplugincontext.md) | Represents the context for an engine plugin. |
| [EnumPropertyName](./api/engine/type-aliases/enumpropertyname.md) | - |
| [EnumValues](./api/engine/type-aliases/enumvalues.md) | - |
| [\_EqualsFn](./api/engine/type-aliases/equalsfn.md) | A function that compares two values for equality |
| [ExportOptions](./api/engine/type-aliases/exportoptions.md) | Represents the options for exporting a design block. |
| [FillPixelStreamOrientation](./api/engine/type-aliases/fillpixelstreamorientation.md) | - |
| [FillType](./api/engine/type-aliases/filltype.md) | The block type IDs for the fill blocks. These are the IDs used to create new fills using `cesdk.engine.block.createFill(id)`. Refer to [FillTypeShorthand](./api/engine/type-aliases/filltypeshorthand.md) and [FillTypeLonghand](./api/engine/type-aliases/filltypelonghand.md) for more details. |
| [FillTypeLonghand](./api/engine/type-aliases/filltypelonghand.md) | The longhand block type IDs for the fill blocks. These are the IDs used to create new fills using `cesdk.engine.block.createFill(id)`. |
| [FillTypeShorthand](./api/engine/type-aliases/filltypeshorthand.md) | - |
| [FloatPropertyName](./api/engine/type-aliases/floatpropertyname.md) | - |
| [FontSizeUnit](./api/engine/type-aliases/fontsizeunit.md) | Extended design unit type that includes Point for font size operations. Maintains consistency with SceneDesignUnit's capitalized naming convention. |
| [FontStyle](./api/engine/type-aliases/fontstyle.md) | Allowed font styles. Mirrors the WASM `FontStyle` union. |
| [FontWeight](./api/engine/type-aliases/fontweight.md) | Allowed font weights. Mirrors the `@cesdk/engine` (WASM) `FontWeight` union so a single `Font` is interchangeable across bindings. |
| [GradientstopRGBA](./api/engine/type-aliases/gradientstoprgba.md) | Represents a gradient stop in the RGBA color space. |
| [HeightMode](./api/engine/type-aliases/heightmode.md) | - |
| [HexColorString](./api/engine/type-aliases/hexcolorstring.md) | Represents a hexadecimal color value (RGB or RGBA) that starts with a '#'. |
| [HistoryId](./api/engine/type-aliases/historyid.md) | A numerical identifier for a history stack |
| [HistoryUpdate](./api/engine/type-aliases/historyupdate.md) | Describes the kind of update that triggered an `onHistoryUpdatedWithKind` callback. |
| [HorizontalBlockAlignment](./api/engine/type-aliases/horizontalblockalignment.md) | - |
| [HorizontalContentFillAlignment](./api/engine/type-aliases/horizontalcontentfillalignment.md) | - |
| [ImageMimeType](./api/engine/type-aliases/imagemimetype.md) | Represents the image MIME types used in the editor. |
| [IntPropertyName](./api/engine/type-aliases/intpropertyname.md) | - |
| [\_LegacySource](./api/engine/type-aliases/legacysource.md) | A simplified source type for legacy API streams |
| [\_Listener](./api/engine/type-aliases/listener.md) | A listener function that receives value updates |
| [ListStyle](./api/engine/type-aliases/liststyle.md) | Represents the list style of a paragraph. |
| [Locale](./api/engine/type-aliases/locale.md) | e.g. `en`, `de`, etc. |
| [LogLevel](./api/engine/type-aliases/loglevel.md) | Provides logging functionality for the Creative Editor SDK. |
| [MimeType](./api/engine/type-aliases/mimetype.md) | Represents the MIME types used in the editor. |
| [ObjectType](./api/engine/type-aliases/objecttype.md) | The block type IDs for all blocks types in the Creative Engine. Those are the types that can be passed to `cesdk.engine.block.findByType(type)` for example. Refer to [ObjectTypeShorthand](./api/engine/type-aliases/objecttypeshorthand.md) and [ObjectTypeLonghand](./api/engine/type-aliases/objecttypelonghand.md) for more details. |
| [ObjectTypeLonghand](./api/engine/type-aliases/objecttypelonghand.md) | The longhand block type IDs for all blocks types in the Creative Engine. Those are the Types returned by the engine when calling `cesdk.engine.block.getType(blockId)` for example. |
| [ObjectTypeShorthand](./api/engine/type-aliases/objecttypeshorthand.md) | The shorthand block type IDs for all blocks types in the Creative Engine. Those are the types that can be passed to `cesdk.engine.block.findByType(type)` for example. |
| [OffscreenCanvas](./api/engine/type-aliases/offscreencanvas.md) | A simplified placeholder type for `OffscreenCanvas`, to avoid a dependency on `@types/offscreencanvas` |
| [OptionalPrefix](./api/engine/type-aliases/optionalprefix.md) | - |
| [PageGuidesSource](./api/engine/type-aliases/pageguidessource.md) | - |
| [PaletteColor](./api/engine/type-aliases/palettecolor.md) | Represents a color definition for the custom color palette. |
| [PositionMode](./api/engine/type-aliases/positionmode.md) | - |
| [PositionXMode](./api/engine/type-aliases/positionxmode.md) | - |
| [PositionYMode](./api/engine/type-aliases/positionymode.md) | - |
| [PropertyType](./api/engine/type-aliases/propertytype.md) | Represents the various types of properties that can be associated with design blocks. Each type corresponds to a different kind of data that can be used to define the properties of a design block within the system. |
| [RGBA](./api/engine/type-aliases/rgba.md) | Represents a color in the RGBA color space. |
| [RoleString](./api/engine/type-aliases/rolestring.md) | Represents a role string. |
| [DesignUnit](./api/engine/type-aliases/designunit.md) | - |
| [SceneFontSizeUnit](./api/engine/type-aliases/scenefontsizeunit.md) | - |
| [SceneLayout](./api/engine/type-aliases/scenelayout.md) | - |
| [SceneMode](./api/engine/type-aliases/scenemode.md) | - |
| [Scope](./api/engine/type-aliases/scope.md) | Represents the various scopes that define the capabilities and permissions within the Creative Editor SDK. Each scope corresponds to a specific functionality or action that can be performed within the editor. |
| [SettingBoolPropertyName](./api/engine/type-aliases/settingboolpropertyname.md) | - |
| [SettingColorPropertyName](./api/engine/type-aliases/settingcolorpropertyname.md) | - |
| [SettingEnumPropertyName](./api/engine/type-aliases/settingenumpropertyname.md) | - |
| [SettingEnumType](./api/engine/type-aliases/settingenumtype.md) | - |
| [SettingEnumValues](./api/engine/type-aliases/settingenumvalues.md) | - |
| [SettingFloatPropertyName](./api/engine/type-aliases/settingfloatpropertyname.md) | - |
| [SettingIntPropertyName](./api/engine/type-aliases/settingintpropertyname.md) | - |
| [SettingKey](./api/engine/type-aliases/settingkey.md) | Union type of all valid setting keys. |
| [SettingsBool](./api/engine/type-aliases/settingsbool.md) | - |
| [SettingsColor](./api/engine/type-aliases/settingscolor.md) | Represents the color settings available in the editor. |
| [~~SettingsColorRGBA~~](./api/engine/type-aliases/settingscolorrgba.md) | Represents the color settings available in the editor. |
| [SettingsEnum](./api/engine/type-aliases/settingsenum.md) | - |
| [SettingsFloat](./api/engine/type-aliases/settingsfloat.md) | - |
| [SettingsInt](./api/engine/type-aliases/settingsint.md) | - |
| [SettingsString](./api/engine/type-aliases/settingsstring.md) | - |
| [SettingStringPropertyName](./api/engine/type-aliases/settingstringpropertyname.md) | - |
| [SettingType](./api/engine/type-aliases/settingtype.md) | Represents the type of a setting. |
| [SettingValueType](./api/engine/type-aliases/settingvaluetype.md) | Gets the value type for a specific setting key. |
| [ShapeType](./api/engine/type-aliases/shapetype.md) | The block type IDs for the shape blocks. These are the IDs used to create new shapes using `cesdk.engine.block.createShape(id)`. Refer to [ShapeTypeShorthand](./api/engine/type-aliases/shapetypeshorthand.md) and [ShapeTypeLonghand](./api/engine/type-aliases/shapetypelonghand.md) for more details. |
| [ShapeTypeLonghand](./api/engine/type-aliases/shapetypelonghand.md) | The longhand block type IDs for the blocks. These are the IDs used to create new shapes using `cesdk.engine.block.createShape(id)`. |
| [ShapeTypeShorthand](./api/engine/type-aliases/shapetypeshorthand.md) | - |
| [ShapeVectorPathFillRule](./api/engine/type-aliases/shapevectorpathfillrule.md) | - |
| [ShortcutRoot](./api/engine/type-aliases/shortcutroot.md) | The DOM root the keyboard listener attaches to. |
| [ShortcutRun](./api/engine/type-aliases/shortcutrun.md) | A shortcut's effect: an action id run via `engine.actions.run`, or a function called with the ShortcutContext. Returning `false` from a function suppresses the automatic `preventDefault` for that keypress. |
| [ShortcutScopeId](./api/engine/type-aliases/shortcutscopeid.md) | Identifier for a UI scope, resolved from the DOM at dispatch time by walking `data-shortcut-scope` ancestors from the focused element up to the root. |
| [SizeMode](./api/engine/type-aliases/sizemode.md) | - |
| [SortingOrder](./api/engine/type-aliases/sortingorder.md) | The order to sort by if the asset source supports sorting. If set to None, the order is the same as the assets were added to the source. |
| [SourceSetPropertyName](./api/engine/type-aliases/sourcesetpropertyname.md) | - |
| [SplitOptions](./api/engine/type-aliases/splitoptions.md) | Options for configuring block split operations. |
| [StringPropertyName](./api/engine/type-aliases/stringpropertyname.md) | - |
| [StrokeCap](./api/engine/type-aliases/strokecap.md) | - |
| [StrokeCornerGeometry](./api/engine/type-aliases/strokecornergeometry.md) | - |
| [StrokeDashEndCap](./api/engine/type-aliases/strokedashendcap.md) | - |
| [StrokeDashStartCap](./api/engine/type-aliases/strokedashstartcap.md) | - |
| [StrokeEndCap](./api/engine/type-aliases/strokeendcap.md) | - |
| [StrokePosition](./api/engine/type-aliases/strokeposition.md) | - |
| [StrokeStartCap](./api/engine/type-aliases/strokestartcap.md) | - |
| [StrokeStyle](./api/engine/type-aliases/strokestyle.md) | - |
| [\_Subscription](./api/engine/type-aliases/subscription.md) | Represents a subscription to an event. |
| [SyncURIResolver](./api/engine/type-aliases/syncuriresolver.md) | A synchronous URI resolver function. |
| [TextAnimationWritingStyle](./api/engine/type-aliases/textanimationwritingstyle.md) | - |
| [TextCase](./api/engine/type-aliases/textcase.md) | Represents the text case of a text block. |
| [TextDecorationLine](./api/engine/type-aliases/textdecorationline.md) | Represents a line type for text decoration. |
| [TextDecorationStyle](./api/engine/type-aliases/textdecorationstyle.md) | Represents the style of a text decoration line. |
| [HorizontalTextAlignment](./api/engine/type-aliases/horizontaltextalignment.md) | - |
| [TextVerticalAlignment](./api/engine/type-aliases/textverticalalignment.md) | - |
| [TimelineTrackVisibility](./api/engine/type-aliases/timelinetrackvisibility.md) | - |
| [TouchPinchAction](./api/engine/type-aliases/touchpinchaction.md) | - |
| [TouchRotateAction](./api/engine/type-aliases/touchrotateaction.md) | - |
| [TransitionType](./api/engine/type-aliases/transitiontype.md) | The block type IDs for the transition blocks. These are the IDs used to create new transitions using `cesdk.engine.block.createTransition(id)`. Refer to [TransitionTypeShorthand](./api/engine/type-aliases/transitiontypeshorthand.md) and [TransitionTypeLonghand](./api/engine/type-aliases/transitiontypelonghand.md) for more details. |
| [TransitionTypeLonghand](./api/engine/type-aliases/transitiontypelonghand.md) | The longhand block type IDs for the transition blocks. These are the IDs used to create new transitions using `cesdk.engine.block.createTransition(id)`. |
| [TransitionTypeShorthand](./api/engine/type-aliases/transitiontypeshorthand.md) | - |
| [~~TypefaceDefinition~~](./api/engine/type-aliases/typefacedefinition.md) | Represents a typeface definition used in the editor. |
| [\_Unsubscribe](./api/engine/type-aliases/unsubscribe.md) | An unsubscribe function that removes a listener |
| [VerticalBlockAlignment](./api/engine/type-aliases/verticalblockalignment.md) | - |
| [VerticalContentFillAlignment](./api/engine/type-aliases/verticalcontentfillalignment.md) | - |
| [VideoBitrateMode](./api/engine/type-aliases/videobitratemode.md) | Selects how the video bitrate is determined when no explicit bitrate is given. - `'System'`: let the platform encoder choose the bitrate (the default). In the browser this can be a very high, near-lossless rate that may cause large exports to fail with an out-of-memory error. - `'Auto'`: a bounded default derived from the output resolution and framerate, consistent across platforms. |
| [VideoExportOptions](./api/engine/type-aliases/videoexportoptions.md) | Represents the options for exporting a video. |
| [VideoMimeType](./api/engine/type-aliases/videomimetype.md) | Represents the video MIME types used in the editor. |
| [WidthMode](./api/engine/type-aliases/widthmode.md) | - |
| [XYWH](./api/engine/type-aliases/xywh.md) | Describes a rectangle on the screen. |
| [ZoomAutoFitAxis](./api/engine/type-aliases/zoomautofitaxis.md) | The axis(es) for which to auto-fit. |
| [ZoomOptions](./api/engine/type-aliases/zoomoptions.md) | Options for zooming to a block with optional animation. |

## Enumerations

| Enumeration | Description |
| ------ | ------ |
| [CompressionFormat](./api/engine/enumerations/compressionformat.md) | Compression format for scene serialization. |
| [CompressionLevel](./api/engine/enumerations/compressionlevel.md) | Compression level for scene serialization. |

## Interfaces

| Interface | Description |
| ------ | ------ |
| [AddVideoOptions](./api/engine/interfaces/addvideooptions.md) | Options for adding videos to the scene. |
| [ApplyAssetOptions](./api/engine/interfaces/applyassetoptions.md) | Options for applying an asset to the scene. |
| [Asset](./api/engine/interfaces/asset.md) | Generic asset information |
| [AssetBooleanProperty](./api/engine/interfaces/assetbooleanproperty.md) | Asset boolean property definition |
| [AssetCMYKColor](./api/engine/interfaces/assetcmykcolor.md) | Asset Color payload CMYK representation |
| [AssetColorProperty](./api/engine/interfaces/assetcolorproperty.md) | Asset color property definition |
| [AssetContentAspectRatio](./api/engine/interfaces/assetcontentaspectratio.md) | Asset transform preset payload that snaps a block's frame to the intrinsic aspect ratio of the block's content (e.g. the underlying image or video). |
| [AssetDefinition](./api/engine/interfaces/assetdefinition.md) | Definition of an asset used if an asset is added to an asset source. |
| [AssetEnumProperty](./api/engine/interfaces/assetenumproperty.md) | Asset enum property definition |
| [AssetFacetValue](./api/engine/interfaces/assetfacetvalue.md) | One bucket of a facet distribution. |
| [AssetFixedAspectRatio](./api/engine/interfaces/assetfixedaspectratio.md) | Asset transform preset payload fixed aspect ratio |
| [AssetFixedSize](./api/engine/interfaces/assetfixedsize.md) | Asset transform preset payload fixed size |
| [AssetFreeAspectRatio](./api/engine/interfaces/assetfreeaspectratio.md) | Asset transform preset payload free aspect ratio |
| [AssetNumberProperty](./api/engine/interfaces/assetnumberproperty.md) | Asset number property definition |
| [AssetPayload](./api/engine/interfaces/assetpayload.md) | Asset payload |
| [AssetQueryData](./api/engine/interfaces/assetquerydata.md) | Defines a request for querying assets |
| [AssetResult](./api/engine/interfaces/assetresult.md) | Single asset result of a query from the engine. |
| [\_AssetResultCredits](./api/engine/interfaces/assetresultcredits.md) | Represents the credits for an asset result. |
| [\_AssetResultLicense](./api/engine/interfaces/assetresultlicense.md) | Represents the license for an asset result. |
| [AssetRGBColor](./api/engine/interfaces/assetrgbcolor.md) | Asset Color payload RGB representation |
| [AssetSource](./api/engine/interfaces/assetsource.md) | A source of assets |
| [AssetSpotColor](./api/engine/interfaces/assetspotcolor.md) | Asset Color payload SpotColor representation |
| [AssetsQueryResult](./api/engine/interfaces/assetsqueryresult.md) | Return type of a `findAssets` query. |
| [AssetStringProperty](./api/engine/interfaces/assetstringproperty.md) | Asset string property definition |
| [AssetStylePreset](./api/engine/interfaces/assetstylepreset.md) | A declarative style preset the engine applies to text and caption blocks. The engine parses and applies it identically on every platform. Lives in [AssetPayload.stylePreset](./api/engine/interfaces/assetpayload.md). |
| [AssetStylePresetAnimation](./api/engine/interfaces/assetstylepresetanimation.md) | An animation slot of an [AssetStylePreset](./api/engine/interfaces/assetstylepreset.md) (`inAnimation`, `outAnimation` or `loopAnimation`). |
| [AudioTrackInfo](./api/engine/interfaces/audiotrackinfo.md) | Information about a single audio track from a video. This interface provides comprehensive metadata about audio tracks, including codec information, technical specifications, and track details. |
| [BlockEvent](./api/engine/interfaces/blockevent.md) | Represents an event related to a design block. |
| [BlockStateError](./api/engine/interfaces/blockstateerror.md) | Represents an error state for a design block. |
| [BlockStatePending](./api/engine/interfaces/blockstatepending.md) | Represents a pending state for a design block. |
| [BlockStateReady](./api/engine/interfaces/blockstateready.md) | Represents a ready state for a design block. |
| [BlurEvent](./api/engine/interfaces/blurevent.md) | Dispatched on the engine canvas when the text input has been blurred. Call `preventDefault()` to disallow this and refocus the engine text input. |
| [Buffer](./api/engine/interfaces/buffer.md) | Represents a buffer of data. |
| [CharacterInkBox](./api/engine/interfaces/characterinkbox.md) | Tight ink-paint bounding box of a single grapheme, in global scene coordinates. Returned by `block.getTextCharacterInkBoxes`. The baseline Y is reported separately because it does not equal `y + height` (the box is the tight ink rect; the baseline anchors glyph descenders). |
| [CMYKColor](./api/engine/interfaces/cmykcolor.md) | Represents a CMYK color value. |
| [CompleteAssetResult](./api/engine/interfaces/completeassetresult.md) | Asset results that are returned from the engine. |
| [Configuration](./api/engine/interfaces/configuration.md) | Specifies the configuration for the Creative Editor SDK. |
| [CursorEvent](./api/engine/interfaces/cursorevent.md) | Dispatched on the engine canvas when the text input has been blurred. Call `preventDefault()` to disallow this and refocus the engine text input. |
| [DominantColor](./api/engine/interfaces/dominantcolor.md) | A single color extracted from the rendered appearance of a block. |
| [DominantColorsOptions](./api/engine/interfaces/dominantcolorsoptions.md) | Options for `BlockAPI.getDominantColors`. |
| [EngineActionInfo](./api/engine/interfaces/engineactioninfo.md) | Info about a registered action, from [EngineActions.list](./api/engine/classes/engineactions.md). |
| [EngineActionsRegistry](./api/engine/interfaces/engineactionsregistry.md) | Hook for hosts to add strongly-typed action ids. Augment via `declare module '@cesdk/engine'` to get autocomplete on register/run while still allowing custom string ids. |
| [EnginePlugin](./api/engine/interfaces/engineplugin.md) | Represents an engine plugin. |
| [\_FindAssetsQuery](./api/engine/interfaces/findassetsquery.md) | Represents a query for finding assets. |
| [\_Flip](./api/engine/interfaces/flip.md) | Specifies the horizontal and vertical flip states of a design block. |
| [Font](./api/engine/interfaces/font.md) | Individual font within a typeface. Field optionality matches `@cesdk/engine` (WASM) — fields not present in the engine response are simply omitted rather than empty strings. |
| [FontMetrics](./api/engine/interfaces/fontmetrics.md) | Font metrics extracted from a font file. Values are in the font's design units coordinate space. |
| [GradientColorStop](./api/engine/interfaces/gradientcolorstop.md) | Represents a gradient color stop. |
| [HTMLCreativeEngineCanvasElement](./api/engine/interfaces/htmlcreativeenginecanvaselement.md) | A wrapper around a plain canvas |
| [Logger](./api/engine/interfaces/logger.md) | Represents a logger function. |
| [PageDuration](./api/engine/interfaces/pageduration.md) | - |
| [Range](./api/engine/interfaces/range.md) | An open range. |
| [Reaction](./api/engine/interfaces/reaction.md) | Reactions track read calls and provide a way to react if they change. |
| [\_ReactiveProperty](./api/engine/interfaces/reactiveproperty.md) | A reactive property with subscribe, value, and update methods |
| [\_ReactivePropertyOptions](./api/engine/interfaces/reactivepropertyoptions.md) | Options for creating a reactive property |
| [Reactor](./api/engine/interfaces/reactor.md) | The reactor coordinates the update of registered *Reactions*. |
| [\_ReadonlyReactiveProperty](./api/engine/interfaces/readonlyreactiveproperty.md) | A read-only reactive property with subscribe and value methods |
| [RefocusEvent](./api/engine/interfaces/refocusevent.md) | Dispatched on the engine canvas right before the engine will refocus its text input after a blur. Call `preventDefault()` to prevent the refocusing. |
| [RGBAColor](./api/engine/interfaces/rgbacolor.md) | Represents an RGBA color value. |
| [RGBColor](./api/engine/interfaces/rgbcolor.md) | Represents an RGB color value. |
| [Settings](./api/engine/interfaces/settings.md) | Map of all available settings with their types. This provides type-safe access to all editor settings. |
| [Shortcut](./api/engine/interfaces/shortcut.md) | A keyboard shortcut. `keys` is a chord (`'Mod+z'`); sequences (string arrays) currently bind on their first chord. `run` is an action id or an inline function. |
| [ShortcutContext](./api/engine/interfaces/shortcutcontext.md) | Passed to a shortcut's `when` check and to a function `run`. |
| [Size2](./api/engine/interfaces/size2.md) | - |
| [Source](./api/engine/interfaces/source.md) | A single source width an intrinsic width & height. |
| [\_Source](./api/engine/interfaces/source-1.md) | A source that can emit values to subscribed listeners |
| [SpotColor](./api/engine/interfaces/spotcolor.md) | Represents a spot color value. |
| [TextDecorationConfig](./api/engine/interfaces/textdecorationconfig.md) | Configuration for text decorations on a text run. |
| [TextFontSizeOptions](./api/engine/interfaces/textfontsizeoptions.md) | Options for text font size operations with unit support. |
| [TextRunInfo](./api/engine/interfaces/textruninfo.md) | Represents a single contiguous text run with uniform formatting. |
| [TransientResource](./api/engine/interfaces/transientresource.md) | Represents a transient resource. |
| [Typeface](./api/engine/interfaces/typeface.md) | Typeface definition |
| [\_UBQAudioFromVideoOptions](./api/engine/interfaces/ubqaudiofromvideooptions.md) | Specifies options for configuring audio extraction from video operations. |
| [\_UBQExportAudioOptions](./api/engine/interfaces/ubqexportaudiooptions.md) | Specifies options for exporting audio design blocks to various formats. |
| [\_UBQExportOptions](./api/engine/interfaces/ubqexportoptions.md) | Specifies options for exporting design blocks to various formats. |
| [\_UBQExportVideoOptions](./api/engine/interfaces/ubqexportvideooptions.md) | Specifies options for exporting video design blocks to various formats. |
| [\_UBQSplitOptions](./api/engine/interfaces/ubqsplitoptions.md) | Specifies options for configuring block split operations. |
| [Vec2](./api/engine/interfaces/vec2.md) | - |
| [Vec3](./api/engine/interfaces/vec3.md) | - |

## Variables

| Variable | Description |
| ------ | ------ |
| [ANIMATION\_TYPES](./api/engine/variables/animation_types.md) | The shorthand block type IDs for the animation blocks. These are the IDs used to create new animations using `cesdk.engine.block.createAnimation(id)`. |
| [AnimationBaselineDirectionValues](./api/engine/variables/animationbaselinedirectionvalues.md) | - |
| [AnimationBlockSwipeTextDirectionValues](./api/engine/variables/animationblockswipetextdirectionvalues.md) | - |
| [AnimationEasingValues](./api/engine/variables/animationeasingvalues.md) | - |
| [AnimationGrowDirectionValues](./api/engine/variables/animationgrowdirectionvalues.md) | - |
| [AnimationJumpLoopDirectionValues](./api/engine/variables/animationjumploopdirectionvalues.md) | - |
| [AnimationKenBurnsDirectionValues](./api/engine/variables/animationkenburnsdirectionvalues.md) | - |
| [AnimationMergeTextDirectionValues](./api/engine/variables/animationmergetextdirectionvalues.md) | - |
| [AnimationSpinDirectionValues](./api/engine/variables/animationspindirectionvalues.md) | - |
| [AnimationSpinLoopDirectionValues](./api/engine/variables/animationspinloopdirectionvalues.md) | - |
| [AnimationTypewriterTextWritingStyleValues](./api/engine/variables/animationtypewritertextwritingstylevalues.md) | - |
| [AnimationWipeDirectionValues](./api/engine/variables/animationwipedirectionvalues.md) | - |
| [BlendModeValues](./api/engine/variables/blendmodevalues.md) | - |
| [BLUR\_TYPES](./api/engine/variables/blur_types.md) | The shorthand block type IDs for the blur blocks. These are the IDs used to create new blurs using `cesdk.engine.block.createBlur(id)`. |
| [CameraClampingOvershootModeValues](./api/engine/variables/cameraclampingovershootmodevalues.md) | - |
| [CaptionHorizontalAlignmentValues](./api/engine/variables/captionhorizontalalignmentvalues.md) | - |
| [CaptionVerticalAlignmentValues](./api/engine/variables/captionverticalalignmentvalues.md) | - |
| [ColorPickerColorModeValues](./api/engine/variables/colorpickercolormodevalues.md) | - |
| [ContentFillModeValues](./api/engine/variables/contentfillmodevalues.md) | - |
| [ControlGizmoMoveHandleVisibilityValues](./api/engine/variables/controlgizmomovehandlevisibilityvalues.md) | - |
| [ControlGizmoResizeHandlesVisibilityValues](./api/engine/variables/controlgizmoresizehandlesvisibilityvalues.md) | - |
| [ControlGizmoRotateHandlesVisibilityValues](./api/engine/variables/controlgizmorotatehandlesvisibilityvalues.md) | - |
| [ControlGizmoScaleHandlesVisibilityValues](./api/engine/variables/controlgizmoscalehandlesvisibilityvalues.md) | - |
| [CutoutTypeValues](./api/engine/variables/cutouttypevalues.md) | - |
| [DESIGN\_BLOCK\_TYPES](./api/engine/variables/design_block_types.md) | The shorthand block type IDs for the top-level design blocks. These are the IDs used to create new blocks using `cesdk.engine.block.create(id)`. |
| [DoubleClickSelectionModeValues](./api/engine/variables/doubleclickselectionmodevalues.md) | - |
| [EFFECT\_TYPES](./api/engine/variables/effect_types.md) | The shorthand block type IDs for the effect blocks. These are the IDs used to create new effects using `cesdk.engine.block.createEffect(id)`. |
| [FILL\_TYPES](./api/engine/variables/fill_types.md) | The shorthand block type IDs for the fill blocks. These are the IDs used to create new fills using `cesdk.engine.block.createFill(id)`. |
| [FillPixelStreamOrientationValues](./api/engine/variables/fillpixelstreamorientationvalues.md) | - |
| [HeightModeValues](./api/engine/variables/heightmodevalues.md) | - |
| [HorizontalContentFillAlignmentValues](./api/engine/variables/horizontalcontentfillalignmentvalues.md) | - |
| [~~LogLevel~~](./api/engine/variables/loglevel.md) | Provides a set of predefined log levels for the Creative Editor SDK. |
| [~~MimeType~~](./api/engine/variables/mimetype.md) | Represents the MIME types used in the editor. |
| [PageGuidesSourceValues](./api/engine/variables/pageguidessourcevalues.md) | - |
| [PositionXModeValues](./api/engine/variables/positionxmodevalues.md) | - |
| [PositionYModeValues](./api/engine/variables/positionymodevalues.md) | - |
| [SceneDesignUnitValues](./api/engine/variables/scenedesignunitvalues.md) | - |
| [SceneFontSizeUnitValues](./api/engine/variables/scenefontsizeunitvalues.md) | - |
| [SceneLayoutValues](./api/engine/variables/scenelayoutvalues.md) | - |
| [SceneModeValues](./api/engine/variables/scenemodevalues.md) | - |
| [SHAPE\_TYPES](./api/engine/variables/shape_types.md) | The shorthand block type IDs for the shape blocks. These are the IDs used to create new shapes using `cesdk.engine.block.createShape(id)`. |
| [ShapeVectorPathFillRuleValues](./api/engine/variables/shapevectorpathfillrulevalues.md) | - |
| [StrokeCapValues](./api/engine/variables/strokecapvalues.md) | - |
| [StrokeCornerGeometryValues](./api/engine/variables/strokecornergeometryvalues.md) | - |
| [StrokeDashEndCapValues](./api/engine/variables/strokedashendcapvalues.md) | - |
| [StrokeDashStartCapValues](./api/engine/variables/strokedashstartcapvalues.md) | - |
| [StrokeEndCapValues](./api/engine/variables/strokeendcapvalues.md) | - |
| [StrokePositionValues](./api/engine/variables/strokepositionvalues.md) | - |
| [StrokeStartCapValues](./api/engine/variables/strokestartcapvalues.md) | - |
| [StrokeStyleValues](./api/engine/variables/strokestylevalues.md) | - |
| [TextAnimationWritingStyleValues](./api/engine/variables/textanimationwritingstylevalues.md) | - |
| [TextHorizontalAlignmentValues](./api/engine/variables/texthorizontalalignmentvalues.md) | - |
| [TextVerticalAlignmentValues](./api/engine/variables/textverticalalignmentvalues.md) | - |
| [TimelineTrackVisibilityValues](./api/engine/variables/timelinetrackvisibilityvalues.md) | - |
| [TouchPinchActionValues](./api/engine/variables/touchpinchactionvalues.md) | - |
| [TouchRotateActionValues](./api/engine/variables/touchrotateactionvalues.md) | - |
| [TRANSITION\_TYPES](./api/engine/variables/transition_types.md) | The shorthand block type IDs for the transition blocks. These are the IDs used to create new transitions using `cesdk.engine.block.createTransition(id)`. |
| [VerticalContentFillAlignmentValues](./api/engine/variables/verticalcontentfillalignmentvalues.md) | - |
| [WidthModeValues](./api/engine/variables/widthmodevalues.md) | - |


---

## More Resources

- **[SvelteKit Documentation Index](https://img.ly/docs/cesdk/sveltekit.md)** - Browse all SvelteKit documentation
- **[engine API Reference](./api/engine.md)** - Full engine API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./sveltekit.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support