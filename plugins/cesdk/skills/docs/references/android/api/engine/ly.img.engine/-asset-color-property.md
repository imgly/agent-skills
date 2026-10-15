# AssetColorProperty

- **Module:** `ly.img:engine`
- **Package:** `ly.img.engine`

A class that represents a color asset property.

```kotlin
data class AssetColorProperty(val property: String, val value: Color, val defaultValue: Color) : AssetProperty
```


## Members

### AssetColorProperty

```kotlin
constructor(property: String, value: Color, defaultValue: Color)
```

### defaultValue

```kotlin
val defaultValue: Color
```

### property

```kotlin
open override val property: String
```

### value

```kotlin
val value: Color
```
