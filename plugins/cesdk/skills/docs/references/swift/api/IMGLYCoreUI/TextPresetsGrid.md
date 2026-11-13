# TextPresetsGrid

- **Module:** `IMGLYCoreUI`
- **DocC identifier:** `/documentation/IMGLYCoreUI/TextPresetsGrid`

A grid of text style-preset assets (engine sources `ly.img.text`, `ly.img.text.styles`, `ly.img.text.curves`). Used as the `destination` of `AssetLibrarySource.textPreset(_:source:)`.

```swift
@MainActor struct TextPresetsGrid
```

## Members

### body

```swift
@MainActor var body: some View { get }
```

### init()

```swift
@MainActor init()
```

Creates a grid of text style-preset assets.

### sectionTitle(for:keyPrefix:)

```swift
@MainActor static func sectionTitle(for group: String?, keyPrefix: String = "ly_img_editor_asset_library_section_text_style_presets_") -> LocalizedStringResource
```

Maps a style-preset asset `group` to its localized section title. The localization key is `keyPrefix` + `group`, so a new preset group shipped with the asset content only needs its translation string. Until a translation exists, the raw group id is shown. When `group` is `nil`, the prefix’s trailing `_` is dropped to form the base section key.
