# Sections

- **Module:** `ly.img:editor-core`
- **Package:** `ly.img.editor.core.library`

First subtype of LibraryContent. It is used to vertically render preview sections.

```kotlin
@Immutable
data class Sections(@StringRes val titleRes: Int, val sections: List<LibraryContent.Section>) : LibraryContent
```


## Members

### Sections

```kotlin
constructor(@StringRes titleRes: Int, sections: List<LibraryContent.Section>)
```

### sections

```kotlin
val sections: List<LibraryContent.Section>
```

### titleRes

```kotlin
val titleRes: Int
```
