# AssetLibraryConfiguration

- **Module:** `IMGLYEditor`
- **DocC identifier:** `/documentation/IMGLYEditor/AssetLibraryConfiguration`

Configuration for asset library.

```swift
struct AssetLibraryConfiguration
```

## Members

### AssetLibraryConfiguration.Builder

```swift
struct Builder
```

Builder for asset library configuration.

### Builder.categories(_:)

```swift
mutating func categories(_ categories: [AssetLibraryCategory])
```

Sets the categories, replacing the editor’s defaults. `categories`

### Builder.includeAVResources

```swift
var includeAVResources: Bool
```

Whether video and audio categories are included in the asset library. When `false` (the default), categories with IDs `AssetLibraryCategory.ID.videos` and `AssetLibraryCategory.ID.audio` are removed before the library is created. Set to `true` in video-oriented editors.

### init(_:)

```swift
init(_ configure: (inout AssetLibraryConfiguration.Builder) -> Void)
```

Creates asset library configuration.

### Builder.modify(_:)

```swift
mutating func modify(_ modification: @escaping CategoryModifications)
```

Adds a category modification. Modifications accumulate in order. `modification`

### Builder.view(_:)

```swift
mutating func view(_ view: @escaping ([AssetLibraryCategory]) -> any AssetLibrary)
```

Sets the asset library view factory. `view`
