# AssetLibrarySource

- **Module:** `IMGLYCoreUI`
- **DocC identifier:** `/documentation/IMGLYCoreUI/AssetLibrarySource`

The leaf nodes of hierarchical asset library content. It is used within an [`AssetLibraryBuilder`](assetlibrarybuilder.md) context.

```swift
@MainActor struct AssetLibrarySource<Destination, Preview, Accessory> where Destination : View, Preview : View, Accessory : View
```

## Members

### AssetLibrarySource.Mode

```swift
enum Mode
```

The display mode of an asset source.

### Mode.AssetLibrarySource.Mode.title(_:)

```swift
case title(LocalizedStringResource)
```

A single section is created which contains all groups for the asset source configuration.

### Mode.AssetLibrarySource.Mode.titleForGroup(_:)

```swift
case titleForGroup((String?) -> LocalizedStringResource = {
        if let group = $0 {
          "\(group)"
        } else {
          "Assets"
        }
      })
```

Multiple sections are created. One for each group of the asset source configuration. If `groups` of the asset source configuration is `nil` or empty available groups will be queried from the asset source. `group` for the `.titleForGroup` closure is `nil` when there are no groups available. In this case the resulting behavior is identical to the single `.title` mode and the `.titleForGroup` closure should return a valid title.

### audio(_:source:)

```swift
@MainActor static func audio(_ mode: AssetLibrarySource<Destination, Preview, Accessory>.Mode, source: AssetLoader.SourceData) -> AssetLibrarySource<Destination, Preview, Accessory>
```

Creates an [`AssetLibrarySource`](../assetlibrarysource.md) for audio assets. `mode`

### audioUpload(_:source:)

```swift
@MainActor static func audioUpload(_ mode: AssetLibrarySource<Destination, Preview, Accessory>.Mode, source: AssetLoader.SourceData) -> AssetLibrarySource<Destination, Preview, Accessory>
```

Creates an [`AssetLibrarySource`](../assetlibrarysource.md) for audio assets that supports uploads. `mode`

### body

```swift
@MainActor var body: some View { get }
```

### content

```swift
@MainActor var content: some View { get }
```

The `Destination` content view of the asset source without section(s).

### debugPrint(_:)

```swift
@MainActor func debugPrint(_ level: Int)
```

Helper utility to print the content hierrachy for debugging.

### id

```swift
@MainActor var id: Int { get }
```

The stable identity of the entity associated with this instance. Suitable to conform to `Identifiable`.

### image(_:source:)

```swift
@MainActor static func image(_ mode: AssetLibrarySource<Destination, Preview, Accessory>.Mode, source: AssetLoader.SourceData) -> AssetLibrarySource<Destination, Preview, Accessory>
```

Creates an [`AssetLibrarySource`](../assetlibrarysource.md) for image assets. `mode`

### imageUpload(_:source:)

```swift
@MainActor static func imageUpload(_ mode: AssetLibrarySource<Destination, Preview, Accessory>.Mode, source: AssetLoader.SourceData) -> AssetLibrarySource<Destination, Preview, Accessory>
```

Creates an [`AssetLibrarySource`](../assetlibrarysource.md) for image assets that supports uploads. `mode`

### init(_:source:destination:preview:accessory:)

```swift
@MainActor init(_ mode: AssetLibrarySource<Destination, Preview, Accessory>.Mode, source: AssetLoader.SourceData, @ViewBuilder destination: @escaping () -> Destination, @ViewBuilder preview: @escaping @MainActor @Sendable () -> Preview = { AssetPreview.imageOrVideo }, @ViewBuilder accessory: @escaping () -> Accessory = { EmptyView() })
```

Creates one or more sections for an asset `source` depending on the used display `mode`. Each section is displayed with a `preview` and an optional `accessory` view. The `destination` view is used to browse the entire content of the asset source. `mode`

### photoRoll(_:media:)

```swift
@MainActor static func photoRoll(_ mode: AssetLibrarySource<Destination, Preview, Accessory>.Mode, media: [PhotoRollMediaType]) -> AssetLibrarySource<Destination, Preview, Accessory>
```

Creates an [`AssetLibrarySource`](../assetlibrarysource.md) for the photo roll. `mode`

### shape(_:source:)

```swift
@MainActor static func shape(_ mode: AssetLibrarySource<Destination, Preview, Accessory>.Mode, source: AssetLoader.SourceData) -> AssetLibrarySource<Destination, Preview, Accessory>
```

Creates an [`AssetLibrarySource`](../assetlibrarysource.md) for shape assets. `mode`

### sources

```swift
@MainActor var sources: [AssetLoader.SourceData] { get }
```

All asset source definitions that belong to this content including all sources of its children.

### sticker(_:source:)

```swift
@MainActor static func sticker(_ mode: AssetLibrarySource<Destination, Preview, Accessory>.Mode, source: AssetLoader.SourceData) -> AssetLibrarySource<Destination, Preview, Accessory>
```

Creates an [`AssetLibrarySource`](../assetlibrarysource.md) for sticker assets. `mode`

### text(_:source:)

```swift
@MainActor static func text(_ mode: AssetLibrarySource<Destination, Preview, Accessory>.Mode, source: AssetLoader.SourceData) -> AssetLibrarySource<Destination, Preview, Accessory>
```

Creates an [`AssetLibrarySource`](../assetlibrarysource.md) for text assets. `mode`

### textComponent(_:source:)

```swift
@MainActor static func textComponent(_ mode: AssetLibrarySource<Destination, Preview, Accessory>.Mode, source: AssetLoader.SourceData) -> AssetLibrarySource<Destination, Preview, Accessory>
```

Creates an [`AssetLibrarySource`](../assetlibrarysource.md) for text component assets. `mode`

### textPreset(_:source:)

```swift
@MainActor static func textPreset(_ mode: AssetLibrarySource<Destination, Preview, Accessory>.Mode, source: AssetLoader.SourceData) -> AssetLibrarySource<Destination, Preview, Accessory>
```

Creates an [`AssetLibrarySource`](../assetlibrarysource.md) for text style-preset assets. `mode`

### video(_:source:)

```swift
@MainActor static func video(_ mode: AssetLibrarySource<Destination, Preview, Accessory>.Mode, source: AssetLoader.SourceData) -> AssetLibrarySource<Destination, Preview, Accessory>
```

Creates an [`AssetLibrarySource`](../assetlibrarysource.md) for video assets. `mode`

### videoUpload(_:source:)

```swift
@MainActor static func videoUpload(_ mode: AssetLibrarySource<Destination, Preview, Accessory>.Mode, source: AssetLoader.SourceData) -> AssetLibrarySource<Destination, Preview, Accessory>
```

Creates an [`AssetLibrarySource`](../assetlibrarysource.md) for video assets that supports uploads. `mode`

### view

```swift
@MainActor var view: AnyView { get }
```

A view representation of this content.
