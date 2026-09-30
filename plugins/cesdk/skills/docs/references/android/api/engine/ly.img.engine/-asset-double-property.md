# AssetDoubleProperty

- **Module:** `ly.img:engine`
- **Package:** `ly.img.engine`

A class that represents a double asset property.

```kotlin
data class AssetDoubleProperty(val property: String, val value: Double, val defaultValue: Double, val min: Double, val max: Double, val step: Double) : AssetProperty
```


## Members

### AssetDoubleProperty

```kotlin
constructor(property: String, value: Double, defaultValue: Double, min: Double, max: Double, step: Double)
```

### defaultValue

```kotlin
val defaultValue: Double
```

### max

```kotlin
val max: Double
```

### min

```kotlin
val min: Double
```

### property

```kotlin
open override val property: String
```

### step

```kotlin
val step: Double
```

### value

```kotlin
val value: Double
```
