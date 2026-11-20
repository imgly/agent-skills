# SandboxLimits

- **Module:** `ly.img:engine`
- **Package:** `ly.img.engine`

Resource limits of one sandbox. A null field keeps the engine default.

```kotlin
data class SandboxLimits(val memoryBytes: Long? = null, val stackBytes: Long? = null, val tickBudgetMs: Long? = null)
```


## Members

### SandboxLimits

```kotlin
constructor(memoryBytes: Long? = null, stackBytes: Long? = null, tickBudgetMs: Long? = null)
```

### memoryBytes

```kotlin
val memoryBytes: Long? = null
```

### stackBytes

```kotlin
val stackBytes: Long? = null
```

### tickBudgetMs

```kotlin
val tickBudgetMs: Long? = null
```
