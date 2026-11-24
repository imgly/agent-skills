# FillStroke

- **Module:** `ly.img:editor-core`
- **Package:** `ly.img.editor.core.component.data`

A type of an icon that renders a fill and/or a stroke. Check the documentation of Fill for more information.

```kotlin
@Stable
data class FillStroke(val showFill: Boolean, val showStroke: Boolean, val fill: Fill?, val stroke: Color?, val strokeFill: GradientFill? = null) : EditorIcon
```


## Members

### FillStroke

```kotlin
constructor(showFill: Boolean, showStroke: Boolean, fill: Fill?, stroke: Color?, strokeFill: GradientFill? = null)
```

### fill

```kotlin
val fill: Fill?
```

### showFill

```kotlin
val showFill: Boolean
```

### showStroke

```kotlin
val showStroke: Boolean
```

### strokeFill

```kotlin
val strokeFill: GradientFill? = null
```

### stroke

```kotlin
val stroke: Color?
```
