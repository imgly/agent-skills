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

Whether the source page becomes a page without page slices when the move leaves it one page slice. That page slice and its content then become the page and its content. The page keeps its id. The page takes the shape, the effects and the blur of that page slice with its enabled fill. It takes the enabled drop shadow of that page slice when the fill or the stroke of the page slice is enabled. A blur in the Block mode then blurs the content of the page too. A page that clips its content cuts it at that shape. The default value is false.
