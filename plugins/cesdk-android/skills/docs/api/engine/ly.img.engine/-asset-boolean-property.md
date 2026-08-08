# AssetBooleanProperty

- **Module:** `ly.img:engine`
- **Package:** `ly.img.engine`

A class that represents a boolean asset property.

```kotlin
data class AssetBooleanProperty(val property: String, val value: Boolean, val defaultValue: Boolean) : AssetProperty
```


## Members

### AssetBooleanProperty

```kotlin
constructor(property: String, value: Boolean, defaultValue: Boolean)
```

### defaultValue

```kotlin
val defaultValue: Boolean
```

### property

```kotlin
open override val property: String
```

### value

```kotlin
val value: Boolean
```
