# Grid

- **Module:** `ly.img:editor-core`
- **Package:** `ly.img.editor.core.library`

Second subtype of LibraryContent. It is used to render the assets of sourceType as a grid.

```kotlin
@Immutable
data class Grid(@StringRes val titleRes: Int, val sourceType: AssetSourceType, val groups: List<String>? = null, val perPage: Int = 20, val assetType: AssetType, val title: String? = null) : LibraryContent
```


## Members

### Grid

```kotlin
constructor(@StringRes titleRes: Int, sourceType: AssetSourceType, groups: List<String>? = null, perPage: Int = 20, assetType: AssetType, title: String? = null)
```

### assetType

```kotlin
val assetType: AssetType
```

### groups

```kotlin
val groups: List<String>? = null
```

### perPage

```kotlin
val perPage: Int = 20
```

### sourceType

```kotlin
val sourceType: AssetSourceType
```

### titleRes

```kotlin
val titleRes: Int
```

### title

```kotlin
val title: String? = null
```
