# LibraryAdd

- **Module:** `ly.img:editor-core`
- **Package:** `ly.img.editor.core.sheet`

A sheet that should be used to display LibraryCategory in order to add assets in the scene.

```kotlin
class LibraryAdd(val style: SheetStyle = SheetStyle( isFloating = true, maxHeight = Height.Fraction(1F), isHalfExpandingEnabled = true, ), val libraryCategory: LibraryCategory? = null, val addToBackgroundTrack: Boolean = false) : SheetType
```


## Members

### LibraryAdd

```kotlin
constructor(style: SheetStyle = SheetStyle( isFloating = true, maxHeight = Height.Fraction(1F), isHalfExpandingEnabled = true, ), libraryCategory: LibraryCategory? = null, addToBackgroundTrack: Boolean = false)
```

### addToBackgroundTrack

```kotlin
val addToBackgroundTrack: Boolean = false
```

### libraryCategory

```kotlin
val libraryCategory: LibraryCategory? = null
```

### style

```kotlin
open override val style: SheetStyle
```
