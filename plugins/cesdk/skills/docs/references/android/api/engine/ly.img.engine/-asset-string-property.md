# AssetStringProperty

- **Module:** `ly.img:engine`
- **Package:** `ly.img.engine`

A class that represents a string asset property.

```kotlin
data class AssetStringProperty(val property: String, val value: String, val defaultValue: String) : AssetProperty
```


## Members

### AssetStringProperty

```kotlin
constructor(property: String, value: String, defaultValue: String)
```

### defaultValue

```kotlin
val defaultValue: String
```

### property

```kotlin
open override val property: String
```

### value

```kotlin
val value: String
```
