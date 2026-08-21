# TextDecorationConfig

- **Module:** `ly.img:engine`
- **Package:** `ly.img.engine`

Configuration for text decorations on a text range. All active decoration lines share the same style and thickness. An optional underline color override can be set; overline and strikethrough always use the text color.

```kotlin
data class TextDecorationConfig(val lines: Set<TextDecorationLine> = setOf(TextDecorationLine.NONE), val style: TextDecorationStyle = TextDecorationStyle.SOLID, val underlineColor: Color? = null, val underlineThickness: Float = 1.0f, val underlineOffset: Float = 0.0f, val skipInk: Boolean = true)
```


## Members

### TextDecorationConfig

```kotlin
constructor(lines: Set<TextDecorationLine> = setOf(TextDecorationLine.NONE), style: TextDecorationStyle = TextDecorationStyle.SOLID, underlineColor: Color? = null, underlineThickness: Float = 1.0f, underlineOffset: Float = 0.0f, skipInk: Boolean = true)
```

### lines

```kotlin
val lines: Set<TextDecorationLine>
```

### skipInk

```kotlin
val skipInk: Boolean = true
```

### style

```kotlin
val style: TextDecorationStyle
```

### underlineColor

```kotlin
val underlineColor: Color? = null
```

### underlineOffset

```kotlin
val underlineOffset: Float = 0.0f
```

### underlineThickness

```kotlin
val underlineThickness: Float = 1.0f
```
