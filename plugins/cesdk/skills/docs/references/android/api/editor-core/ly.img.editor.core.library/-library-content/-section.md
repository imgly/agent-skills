# Section

- **Module:** `ly.img:editor-core`
- **Package:** `ly.img.editor.core.library`

This class configures each section in the Sections.

```kotlin
@Immutable
data class Section(@StringRes val titleRes: Int? = null, val sourceTypes: List<AssetSourceType>, val excludedPreviewSourceTypes: List<AssetSourceType>? = null, val groups: List<String>? = null, val addGroupedSubSections: Boolean = false, val groupTitleKeyPrefix: String? = null, val showUpload: Boolean = sourceTypes.size == 1 && sourceTypes[0] is UploadAssetSourceType, val count: Int = 10, val assetType: AssetType, val expandContent: LibraryContent? = Grid( titleRes = requireNotNull(titleRes), sourceType = sourceTypes[0], groups = groups, assetType = assetType, ))
```


## Members

### Section

```kotlin
constructor(@StringRes titleRes: Int? = null, sourceTypes: List<AssetSourceType>, excludedPreviewSourceTypes: List<AssetSourceType>? = null, groups: List<String>? = null, addGroupedSubSections: Boolean = false, groupTitleKeyPrefix: String? = null, showUpload: Boolean = sourceTypes.size == 1 && sourceTypes[0] is UploadAssetSourceType, count: Int = 10, assetType: AssetType, expandContent: LibraryContent? = Grid( titleRes = requireNotNull(titleRes), sourceType = sourceTypes[0], groups = groups, assetType = assetType, ))
```

### addGroupedSubSections

```kotlin
val addGroupedSubSections: Boolean = false
```

### assetType

```kotlin
val assetType: AssetType
```

### count

```kotlin
val count: Int = 10
```

### excludedPreviewSourceTypes

```kotlin
val excludedPreviewSourceTypes: List<AssetSourceType>? = null
```

### expandContent

```kotlin
val expandContent: LibraryContent?
```

### groupTitleKeyPrefix

```kotlin
val groupTitleKeyPrefix: String? = null
```

Optional localization-key prefix for sections expanded from asset groups (addGroupedSubSections). When set, each group section's title resolves the string resource named "<prefix><group>" (e.g. prefix "ly_img_editor_asset_library_section_text_style_presets_" + group "paragraphDefault" resolves "ly_img_editor_asset_library_section_text_style_presets_paragraphDefault"). Library-shipped strings merge into the app resource namespace at build time and are found without additional configuration; a consuming app may add its own strings for new groups. Falls back to the raw group id when no such resource exists. When null, expanded sections keep this section's titleRes. Only meaningful when addGrou…

### groups

```kotlin
val groups: List<String>? = null
```

### showUpload

```kotlin
val showUpload: Boolean
```

### sourceTypes

```kotlin
val sourceTypes: List<AssetSourceType>
```

### titleRes

```kotlin
val titleRes: Int? = null
```
