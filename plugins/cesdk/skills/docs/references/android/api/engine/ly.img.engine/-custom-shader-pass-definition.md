# CustomShaderPassDefinition

- **Module:** `ly.img:engine`
- **Package:** `ly.img.engine`

One ordered mainImage pass. The last pass is Image; two zero dimensions use evaluation size. Supply up to four channels. Missing channels are empty; queries always return four channels. RGB-only mainImage output defaults to alpha 1. Explicit alpha writes are preserved.

```kotlin
data class CustomShaderPassDefinition(val name: String = "", val source: String = "", val channels: List<CustomShaderChannelDefinition> = List(4) { CustomShaderChannelDefinition() }, val format: CustomShaderFormat = CustomShaderFormat.RGBA16_FLOAT, val width: Long = 0, val height: Long = 0)
```


## Members

### CustomShaderPassDefinition

```kotlin
constructor(name: String = "", source: String = "", channels: List<CustomShaderChannelDefinition> = List(4) { CustomShaderChannelDefinition() }, format: CustomShaderFormat = CustomShaderFormat.RGBA16_FLOAT, width: Long = 0, height: Long = 0)
```

### channels

```kotlin
val channels: List<CustomShaderChannelDefinition>
```

### format

```kotlin
val format: CustomShaderFormat
```

### height

```kotlin
val height: Long = 0
```

### name

```kotlin
val name: String
```

### source

```kotlin
val source: String
```

### width

```kotlin
val width: Long = 0
```
