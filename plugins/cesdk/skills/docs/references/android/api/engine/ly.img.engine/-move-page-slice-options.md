# MovePageSliceOptions

- **Module:** `ly.img:engine`
- **Package:** `ly.img.engine`

The options of BlockApi.movePageSliceIntoPage and BlockApi.movePageSliceOutOfPage.

```kotlin
data class MovePageSliceOptions(val convertSourceToPage: Boolean = false)
```


## Members

### MovePageSliceOptions

```kotlin
constructor(convertSourceToPage: Boolean = false)
```

### convertSourceToPage

```kotlin
val convertSourceToPage: Boolean = false
```

Whether the source page becomes a page without page slices when the move leaves it one page slice. That page slice and its content then become the page and its content. The page keeps its id. The default value is false.
