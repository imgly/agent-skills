# AssetEnumProperty

- **Module:** `ly.img:engine`
- **Package:** `ly.img.engine`

A class that represents an enum asset property.

```kotlin
data class AssetEnumProperty(val property: String, val value: String, val defaultValue: String, val options: List<String>) : AssetProperty
```


## Members

### AssetEnumProperty

```kotlin
constructor(property: String, value: String, defaultValue: String, options: List<String>)
```

### defaultValue

```kotlin
val defaultValue: String
```

### options

```kotlin
val options: List<String>
```

### property

```kotlin
open override val property: String
```

### value

```kotlin
val value: String
```
