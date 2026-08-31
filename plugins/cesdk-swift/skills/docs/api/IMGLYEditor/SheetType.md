# SheetType

- **Module:** `IMGLYEditor`
- **DocC identifier:** `/documentation/IMGLYEditor/SheetType`

A type that represents a sheet used in the editor.

```swift
protocol SheetType
```

## Members

### adjustments(style:id:)

```swift
static func adjustments(style: SheetStyle = .only(detent: .imgly.medium), id: DesignBlockID) -> Self
```

Creates a [`SheetType`](../sheettype.md) that is used to make adjustments to design blocks with image and video fills `style`

### animation(style:)

```swift
static func animation(style: SheetStyle = .only(detent: .imgly.small)) -> Self
```

Creates a [`SheetType`](../sheettype.md) that is used to configure animations on design blocks. `style`

### blur(style:id:)

```swift
static func blur(style: SheetStyle = .only(detent: .imgly.tiny), id: DesignBlockID) -> Self
```

Creates a [`SheetType`](../sheettype.md) that is used to set blurs to design blocks with image and video fills. `style`

### captions(style:)

```swift
static func captions(style: SheetStyle = .default(detent: .imgly.small, detents: [.imgly.small, .imgly.medium, .imgly.large])) -> Self
```

Creates a [`SheetType`](../sheettype.md) that is used to create and edit captions on a video. `style`

### captionStyle(style:id:)

```swift
static func captionStyle(style: SheetStyle = .only(detent: .imgly.tiny), id: DesignBlockID) -> Self
```

Creates a [`SheetType`](../sheettype.md) that is used to apply a caption style preset to a caption block. `style`

### clipSpeed(style:)

```swift
static func clipSpeed(style: SheetStyle = .only(detent: .imgly.tiny)) -> Self
```

Creates a [`SheetType`](../sheettype.md) that is used to control the playback speed of clips. `style`

### crop(style:id:assetSourceIDs:)

```swift
static func crop(style: SheetStyle = .only(detent: .imgly.medium), id: DesignBlockID, assetSourceIDs: [String] = ["ly.img.crop.presets"]) -> Self
```

Creates a [`SheetType`](../sheettype.md) that is used to crop design blocks with image and video fills. `style`

### effect(style:id:)

```swift
static func effect(style: SheetStyle = .only(detent: .imgly.tiny), id: DesignBlockID) -> Self
```

Creates a [`SheetType`](../sheettype.md) that is used to set effects to design blocks with image and video fills. `style`

### fillStroke(style:fillOnly:)

```swift
static func fillStroke(style: SheetStyle = .default(), fillOnly: Bool = false) -> Self
```

Creates a [`SheetType`](../sheettype.md) that is used to control the fill and/or stroke of various blocks. `style`

### filter(style:id:)

```swift
static func filter(style: SheetStyle = .only(detent: .imgly.tiny), id: DesignBlockID) -> Self
```

Creates a [`SheetType`](../sheettype.md) that is used to set filters to design blocks with image and video fills. `style`

### formatText(style:)

```swift
static func formatText(style: SheetStyle = .only(detent: .imgly.medium)) -> Self
```

Creates a [`SheetType`](../sheettype.md) that is used to control formatting of text blocks. `style`

### layer(style:)

```swift
static func layer(style: SheetStyle = .only(detent: .imgly.medium)) -> Self
```

Creates a [`SheetType`](../sheettype.md) that is used to control the layering of design blocks. `style`

### libraryAdd(_:style:content:)

```swift
@MainActor static func libraryAdd(_ title: LocalizedStringResource, style: SheetStyle = .addAsset(), @AssetLibraryBuilder content: @escaping () -> any AssetLibraryContent) -> Self
```

Creates a [`SheetType`](../sheettype.md) to add assets to the scene from a custom asset library defined by the provided `content` with an [`AssetLibraryBuilder`](../../imglycoreui/assetlibrarybuilder.md) independent of the configured [`AssetLibrary`](../../imglycoreui/assetlibrary.md). `title`

### libraryAdd(style:content:)

```swift
static func libraryAdd(style: SheetStyle = .addAsset(), @ViewBuilder content: @escaping () -> any View) -> Self
```

Creates a [`SheetType`](../sheettype.md) to add assets to the scene from the configured [`AssetLibrary`](../../imglycoreui/assetlibrary.md). `style`

### libraryReplace(_:style:content:)

```swift
@MainActor static func libraryReplace(_ title: LocalizedStringResource, style: SheetStyle = .default(), @AssetLibraryBuilder content: @escaping () -> any AssetLibraryContent) -> Self
```

Creates a [`SheetType`](../sheettype.md) to replace assets in the scene from a custom asset library defined by the provided `content` with an [`AssetLibraryBuilder`](../../imglycoreui/assetlibrarybuilder.md) independent of the configured [`AssetLibrary`](../../imglycoreui/assetlibrary.md). `title`

### libraryReplace(style:content:)

```swift
static func libraryReplace(style: SheetStyle = .default(), @ViewBuilder content: @escaping () -> any View) -> Self
```

Creates a [`SheetType`](../sheettype.md) to replace assets in the scene from the configured [`AssetLibrary`](../../imglycoreui/assetlibrary.md). `style`

### reorder(style:)

```swift
static func reorder(style: SheetStyle = .only(detent: .imgly.medium)) -> Self
```

Creates a [`SheetType`](../sheettype.md) that is used to reorder videos on the background track. `style`

### resize(style:)

```swift
static func resize(style: SheetStyle = .only(detent: .imgly.small)) -> Self
```

Creates a [`SheetType`](../sheettype.md) that is used to resize pages. `style`

### shape(style:)

```swift
static func shape(style: SheetStyle = .default(detent: .imgly.small, detents: [.imgly.tiny, .imgly.small])) -> Self
```

Creates a [`SheetType`](../sheettype.md) that is used to control the shape of various blocks. `style`

### style

```swift
var style: SheetStyle { get }
```

The style of the sheet.

### textBackground(style:)

```swift
static func textBackground(style: SheetStyle = .only(detent: .imgly.medium)) -> Self
```

Creates a [`SheetType`](../sheettype.md) that is used to control the text background properties. `style`

### textOnPath(style:)

```swift
static func textOnPath(style: SheetStyle = .only(detent: .imgly.tiny)) -> Self
```

Creates a [`SheetType`](../sheettype.md) that is used to control placing text along an SVG baseline path. `style`

### transition(style:id:)

```swift
static func transition(style: SheetStyle = .only(detent: .imgly.small), id: DesignBlockID) -> Self
```

Creates a sheet for configuring the outgoing transition of `id`.

### voiceover(style:)

```swift
static func voiceover(style: SheetStyle = .only(isFloating: true, detent: .imgly.micro)) -> Self
```

Creates a [`SheetType`](../sheettype.md) that is used for voiceover recording. `style`

### volume(style:)

```swift
static func volume(style: SheetStyle = .only(detent: .imgly.tiny)) -> Self
```

Creates a [`SheetType`](../sheettype.md) that is used to control the volume of audio/video. `style`
