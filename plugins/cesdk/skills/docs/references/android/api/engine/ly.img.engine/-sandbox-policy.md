# SandboxPolicy

- **Module:** `ly.img:engine`
- **Package:** `ly.img.engine`

Which methods a script may call. A rule is a full path such as imgly.engine.block.setString, a group such as imgly.engine.block.*, a prefix such as imgly.engine.block.set*, or *. A host function is named <specifier>.<name>. A rule without the imgly.engine. prefix matches no engine method. deny wins over allow.

```kotlin
data class SandboxPolicy(val allow: List<String> = emptyList(), val deny: List<String> = emptyList())
```


## Members

### SandboxPolicy

```kotlin
constructor(allow: List<String> = emptyList(), deny: List<String> = emptyList())
```

### allow

```kotlin
val allow: List<String>
```

### deny

```kotlin
val deny: List<String>
```
