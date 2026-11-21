# CustomShaderProgramDefinition

- **Module:** `ly.img:engine`
- **Package:** `ly.img.engine`

Shared GLSL ES source and ordered passes. GPU resources and feedback are excluded.

```kotlin
data class CustomShaderProgramDefinition(val commonSource: String = "", val passes: List<CustomShaderPassDefinition> = emptyList())
```


## Members

### CustomShaderProgramDefinition

```kotlin
constructor(commonSource: String = "", passes: List<CustomShaderPassDefinition> = emptyList())
```

### commonSource

```kotlin
val commonSource: String
```

### passes

```kotlin
val passes: List<CustomShaderPassDefinition>
```
