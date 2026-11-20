# SandboxOptions

- **Module:** `ly.img:engine`
- **Package:** `ly.img.engine`

Options for SandboxApi.run and SandboxApi.start.

```kotlin
data class SandboxOptions(val limits: SandboxLimits = SandboxLimits(), val policy: SandboxPolicy = SandboxPolicy(), val modules: Map<String, SandboxRegistration> = emptyMap())
```


## Members

### SandboxOptions

```kotlin
constructor(limits: SandboxLimits = SandboxLimits(), policy: SandboxPolicy = SandboxPolicy(), modules: Map<String, SandboxRegistration> = emptyMap())
```

### limits

```kotlin
val limits: SandboxLimits
```

### modules

```kotlin
val modules: Map<String, SandboxRegistration>
```

### policy

```kotlin
val policy: SandboxPolicy
```
