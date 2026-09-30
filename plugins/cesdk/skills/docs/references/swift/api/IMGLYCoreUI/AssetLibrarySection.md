# AssetLibrarySection

- **Module:** `IMGLYCoreUI`
- **DocC identifier:** `/documentation/IMGLYCoreUI/AssetLibrarySection`

A section within a library category, representing an asset source. This is the data representation of an asset section, aligned with Android’s `LibraryContent.Section`.

```swift
struct AssetLibrarySection
```

## Members

### ==(_:_:)

```swift
static func == (lhs: AssetLibrarySection, rhs: AssetLibrarySection) -> Bool
```

### AssetLibrarySection.ContentType

```swift
enum ContentType
```

The content type determines how the section is rendered.

### ContentType-swift.enum.AssetLibrarySection.ContentType.audio

```swift
case audio
```

### ContentType-swift.enum.AssetLibrarySection.ContentType.audioUpload

```swift
case audioUpload
```

### ContentType-swift.enum.AssetLibrarySection.ContentType.image

```swift
case image
```

### ContentType-swift.enum.AssetLibrarySection.ContentType.imageUpload

```swift
case imageUpload
```

### ContentType-swift.enum.AssetLibrarySection.ContentType.photoRoll(media:)

```swift
case photoRoll(media: [PhotoRollMediaType])
```

### ContentType-swift.enum.AssetLibrarySection.ContentType.shape

```swift
case shape
```

### ContentType-swift.enum.AssetLibrarySection.ContentType.sticker

```swift
case sticker
```

### ContentType-swift.enum.AssetLibrarySection.ContentType.text

```swift
case text
```

### ContentType-swift.enum.AssetLibrarySection.ContentType.textComponent

```swift
case textComponent
```

### ContentType-swift.enum.AssetLibrarySection.ContentType.textPreset

```swift
case textPreset
```

### ContentType-swift.enum.AssetLibrarySection.ContentType.video

```swift
case video
```

### ContentType-swift.enum.AssetLibrarySection.ContentType.videoUpload

```swift
case videoUpload
```

### audio(id:title:source:)

```swift
static func audio(id: String, title: LocalizedStringResource, source: AssetLoader.SourceData) -> AssetLibrarySection
```

Creates an audio section. `id`

### audioUpload(id:title:source:)

```swift
static func audioUpload(id: String, title: LocalizedStringResource, source: AssetLoader.SourceData) -> AssetLibrarySection
```

Creates an audio upload section. `id`

### contentType

```swift
let contentType: AssetLibrarySection.ContentType
```

The type of content this section displays.

### groupTitleKeyPrefix

```swift
let groupTitleKeyPrefix: String?
```

Optional localization-key prefix for sections expanded from the source’s asset groups. When set, the section drills into one sub-section per asset group, each titled `<prefix><group>`, falling back to a humanized group name.

### id

```swift
let id: String
```

### image(id:title:source:)

```swift
static func image(id: String, title: LocalizedStringResource, source: AssetLoader.SourceData) -> AssetLibrarySection
```

Creates an image section. `id`

### imageUpload(id:title:source:)

```swift
static func imageUpload(id: String, title: LocalizedStringResource, source: AssetLoader.SourceData) -> AssetLibrarySection
```

Creates an image upload section. `id`

### init(id:title:source:contentType:groupTitleKeyPrefix:)

```swift
init(id: String, title: LocalizedStringResource?, source: AssetLoader.SourceData, contentType: AssetLibrarySection.ContentType, groupTitleKeyPrefix: String? = nil)
```

Creates a library section. `id`

### photoRoll(id:title:media:)

```swift
static func photoRoll(id: String, title: LocalizedStringResource, media: [PhotoRollMediaType]) -> AssetLibrarySection
```

Creates a photo roll section. `id`

### shape(id:title:source:)

```swift
static func shape(id: String, title: LocalizedStringResource, source: AssetLoader.SourceData) -> AssetLibrarySection
```

Creates a shape section. `id`

### source

```swift
let source: AssetLoader.SourceData
```

### sticker(id:title:source:)

```swift
static func sticker(id: String, title: LocalizedStringResource, source: AssetLoader.SourceData) -> AssetLibrarySection
```

Creates a sticker section. `id`

### text(id:title:source:)

> **Deprecated:** Plain text is deprecated. Use `textPreset(id:title:source:)` instead.

```swift
static func text(id: String, title: LocalizedStringResource, source: AssetLoader.SourceData) -> AssetLibrarySection
```

Creates a text section. `id`

### textComponent(id:title:source:)

```swift
static func textComponent(id: String, title: LocalizedStringResource, source: AssetLoader.SourceData) -> AssetLibrarySection
```

Creates a text component section. `id`

### textPreset(id:title:source:groupTitleKeyPrefix:)

```swift
static func textPreset(id: String, title: LocalizedStringResource, source: AssetLoader.SourceData, groupTitleKeyPrefix: String? = nil) -> AssetLibrarySection
```

Creates a text style-preset section. `id`

### title

```swift
let title: LocalizedStringResource?
```

### video(id:title:source:)

```swift
static func video(id: String, title: LocalizedStringResource, source: AssetLoader.SourceData) -> AssetLibrarySection
```

Creates a video section. `id`

### videoUpload(id:title:source:)

```swift
static func videoUpload(id: String, title: LocalizedStringResource, source: AssetLoader.SourceData) -> AssetLibrarySection
```

Creates a video upload section. `id`
