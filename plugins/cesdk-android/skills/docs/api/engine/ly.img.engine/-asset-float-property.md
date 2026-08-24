# AssetFloatProperty

- **Module:** `ly.img:engine`
- **Package:** `ly.img.engine`

A class that represents a float asset property.

```kotlin
data class AssetFloatProperty(val property: String, val value: Float, val defaultValue: Float, val min: Float, val max: Float, val step: Float) : AssetProperty
```


## Members

### AssetFloatProperty

```kotlin
constructor(property: String, value: Float, defaultValue: Float, min: Float, max: Float, step: Float)
```

### defaultValue

```kotlin
val defaultValue: Float
```

### max

```kotlin
val max: Float
```

### min

```kotlin
val min: Float
```

### property

```kotlin
open override val property: String
```

### step

```kotlin
val step: Float
```

### value

```kotlin
val value: Float
```
