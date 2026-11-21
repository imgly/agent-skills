# CustomShaderChannelDefinition

- **Module:** `ly.img:engine`
- **Package:** `ly.img.engine`

A named input or current/previous-frame pass channel.

```kotlin
data class CustomShaderChannelDefinition(val source: CustomShaderChannelSource = CustomShaderChannelSource.EMPTY, val name: String = "", val filter: CustomShaderFilter = CustomShaderFilter.LINEAR, val wrap: CustomShaderWrap = CustomShaderWrap.CLAMP)
```


## Members

### CustomShaderChannelDefinition

```kotlin
constructor(source: CustomShaderChannelSource = CustomShaderChannelSource.EMPTY, name: String = "", filter: CustomShaderFilter = CustomShaderFilter.LINEAR, wrap: CustomShaderWrap = CustomShaderWrap.CLAMP)
```

### filter

```kotlin
val filter: CustomShaderFilter
```

### name

```kotlin
val name: String
```

### source

```kotlin
val source: CustomShaderChannelSource
```

### wrap

```kotlin
val wrap: CustomShaderWrap
```
