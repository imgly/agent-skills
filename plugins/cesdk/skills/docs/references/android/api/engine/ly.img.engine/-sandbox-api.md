# SandboxApi

- **Module:** `ly.img:engine`
- **Package:** `ly.img.engine`

Runs JavaScript against the engine in an isolated runtime. A script sees a global engine object with the same groups as this engine, limited to the methods its SandboxPolicy allows. Values cross the boundary as JSON: null, Boolean, Number, String, List and Map with String keys.

```kotlin
interface SandboxApi
```


## Members

### compile

```kotlin
abstract fun compile(source: String): SandboxModule
```

Compile module source ahead of time, without creating a sandbox.

### disposeAll

```kotlin
abstract fun disposeAll()
```

Dispose every sandbox. A pending script rejects with SANDBOX.DISPOSED.

### get

```kotlin
abstract fun get(id: Int): RunningSandbox?
```

### list

```kotlin
abstract fun list(): List<RunningSandbox>
```

### run

```kotlin
abstract suspend fun run(source: String, options: SandboxOptions = SandboxOptions()): String
```

```kotlin
abstract suspend fun run(module: SandboxModule, options: SandboxOptions = SandboxOptions()): String
```

Run a script and wait for it to finish, then dispose its sandbox.

### start

```kotlin
abstract fun start(source: String, options: SandboxOptions = SandboxOptions()): RunningSandbox
```

```kotlin
abstract fun start(module: SandboxModule, options: SandboxOptions = SandboxOptions()): RunningSandbox
```

Start a script without waiting for it.
