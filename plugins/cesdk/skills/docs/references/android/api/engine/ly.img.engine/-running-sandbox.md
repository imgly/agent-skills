# RunningSandbox

- **Module:** `ly.img:engine`
- **Package:** `ly.img.engine`

A sandbox started by SandboxApi.start. It is updated on every engine update until dispose.

```kotlin
interface RunningSandbox
```


## Members

### abort

```kotlin
abstract fun abort()
```

Stop the script. Its abortSignal fires, the engine calls it has in flight end, and it rejects with SANDBOX.ABORTED. A script that settled keeps its result.

### call

```kotlin
abstract fun call(name: String, vararg args: Any?): Any?
```

Call an exported function.

### dispose

```kotlin
abstract fun dispose()
```

Release the sandbox. Safe to call more than once.

### has

```kotlin
abstract fun has(specifier: String): Boolean
```

### id

```kotlin
abstract val id: Int
```

Unique for the engine instance and never reused.

### listExports

```kotlin
abstract fun listExports(): List<String>
```

### listModules

```kotlin
abstract fun listModules(): List<String>
```

### read

```kotlin
abstract fun read(name: String): Any?
```

Read an exported constant.

### settled

```kotlin
abstract val settled: Deferred<String>
```

Completes with the script's return value, or fails with its EngineException. A sandbox disposed before it settled fails with SANDBOX.DISPOSED.

### state

```kotlin
abstract val state: SandboxState
```

Whether the script is still running, or how it settled.

### wasInterrupted

```kotlin
abstract val wasInterrupted: Boolean
```

Whether the CPU budget stopped the script.
