# SandboxRegistration

- **Module:** `ly.img:engine`
- **Package:** `ly.img.engine`

A module a script can import: either host functions or a compiled module. Host functions are denied by default, so SandboxPolicy.allow must name them.

```kotlin
data class SandboxRegistration(val functions: Map<String, (List<Any?>) -> Any?> = emptyMap(), val module: SandboxModule? = null, val globalName: String? = null)
```


## Members

### SandboxRegistration

```kotlin
constructor(functions: Map<String, (List<Any?>) -> Any?> = emptyMap(), module: SandboxModule? = null, globalName: String? = null)
```

### functions

```kotlin
val functions: Map<String, (List<Any?>) -> Any?>
```

### globalName

```kotlin
val globalName: String? = null
```

### module

```kotlin
val module: SandboxModule? = null
```
