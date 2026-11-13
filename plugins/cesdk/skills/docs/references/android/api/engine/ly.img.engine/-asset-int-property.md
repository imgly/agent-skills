# AssetIntProperty

- **Module:** `ly.img:engine`
- **Package:** `ly.img.engine`

A class that represents an int asset property.

```kotlin
data class AssetIntProperty(val property: String, val value: Int, val defaultValue: Int, val min: Int, val max: Int, val step: Int) : AssetProperty
```


## Members

### AssetIntProperty

```kotlin
constructor(property: String, value: Int, defaultValue: Int, min: Int, max: Int, step: Int)
```

### defaultValue

```kotlin
val defaultValue: Int
```

### max

```kotlin
val max: Int
```

### min

```kotlin
val min: Int
```

### property

```kotlin
open override val property: String
```

### step

```kotlin
val step: Int
```

### value

```kotlin
val value: Int
```
