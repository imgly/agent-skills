# SheetStyle

- **Module:** `ly.img:editor-core`
- **Package:** `ly.img.editor.core.sheet`

A class representing the style of sheets.

```kotlin
data class SheetStyle(val isFloating: Boolean = false, val minHeight: Height = Height.Exactly(0.dp), val maxHeight: Height? = Height.Fraction(0.5F), val isHalfExpandingEnabled: Boolean = false, val isHalfExpandedInitially: Boolean = false, val animateInitialValue: Boolean = true)
```


## Members

### SheetStyle

```kotlin
constructor(isFloating: Boolean = false, minHeight: Height = Height.Exactly(0.dp), maxHeight: Height? = Height.Fraction(0.5F), isHalfExpandingEnabled: Boolean = false, isHalfExpandedInitially: Boolean = false, animateInitialValue: Boolean = true)
```

### animateInitialValue

```kotlin
val animateInitialValue: Boolean = true
```

### isFloating

```kotlin
val isFloating: Boolean = false
```

### isHalfExpandedInitially

```kotlin
val isHalfExpandedInitially: Boolean = false
```

### isHalfExpandingEnabled

```kotlin
val isHalfExpandingEnabled: Boolean = false
```

### maxHeight

```kotlin
val maxHeight: Height?
```

### minHeight

```kotlin
val minHeight: Height
```
