# Fraction

- **Module:** `ly.img:editor-core`
- **Package:** `ly.img.editor.core.component.data`

Height as a fraction of another height.

```kotlin
@Stable
data class Fraction(@FloatRange(from = 0.0, to = 1.0)val fraction: Float) : Height
```


## Members

### Fraction

```kotlin
constructor(@FloatRange(from = 0.0, to = 1.0)fraction: Float)
```

### fraction

```kotlin
val fraction: Float
```
