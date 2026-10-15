# LibraryCategory

- **Module:** `ly.img:editor-core`
- **Package:** `ly.img.editor.core.library`

Configuration class of the UI of each library category. Each category contains a title (check tabTitleRes) and a content to render the UI. If the category is part of the tabs specified in AssetLibrary.tabs, tabSelectedIcon and tabUnselectedIcon are used to display the icon of the category in the tabs.

```kotlin
@Immutable
data class LibraryCategory(@StringRes val tabTitleRes: Int, val tabSelectedIcon: ImageVector, val tabUnselectedIcon: ImageVector, val isHalfExpandedInitially: Boolean = false, val content: LibraryContent)
```


## Members

### LibraryCategory

```kotlin
constructor(@StringRes tabTitleRes: Int, tabSelectedIcon: ImageVector, tabUnselectedIcon: ImageVector, isHalfExpandedInitially: Boolean = false, content: LibraryContent)
```

### content

```kotlin
val content: LibraryContent
```

### isHalfExpandedInitially

```kotlin
val isHalfExpandedInitially: Boolean = false
```
> **Deprecated:** Parameter is unused. Consider configuring it via SheetType.LibraryAdd.mode or SheetType.LibraryReplace.mode

### tabSelectedIcon

```kotlin
val tabSelectedIcon: ImageVector
```

### tabTitleRes

```kotlin
val tabTitleRes: Int
```

### tabUnselectedIcon

```kotlin
val tabUnselectedIcon: ImageVector
```
