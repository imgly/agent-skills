# LibraryReplace

- **Module:** `ly.img:editor-core`
- **Package:** `ly.img.editor.core.sheet`

A sheet that should be used to display LibraryCategory in order to replace assets in the scene.

```kotlin
class LibraryReplace(val style: SheetStyle = SheetStyle( isFloating = false, maxHeight = Height.Fraction(1F), isHalfExpandingEnabled = true, isHalfExpandedInitially = true, ), val libraryCategory: LibraryCategory) : SheetType
```


## Members

### LibraryReplace

```kotlin
constructor(style: SheetStyle = SheetStyle( isFloating = false, maxHeight = Height.Fraction(1F), isHalfExpandingEnabled = true, isHalfExpandedInitially = true, ), libraryCategory: LibraryCategory)
```

### libraryCategory

```kotlin
val libraryCategory: LibraryCategory
```

### style

```kotlin
open override val style: SheetStyle
```
