# SandboxAPI

- **Module:** `IMGLYEngine`
- **DocC identifier:** `/documentation/IMGLYEngine/SandboxAPI`

Runs JavaScript against the engine in an isolated runtime. A script sees a global `engine` object with the same API groups as the engine, limited to the methods its [`SandboxPolicy`](sandboxpolicy.md) allows. Every failure is an [`EngineError`](engineerror.md) carrying the catalog code, for example `SANDBOX.COMPILE_FAILED`, `SANDBOX.INTERRUPTED` or an engine code such as `BLOCK.UNKNOWN`.

```swift
@MainActor final class SandboxAPI
```

## Members

### compile(_:)

```swift
@MainActor func compile(_ source: String) throws -> SandboxModule
```

Compile module source ahead of time, without creating a sandbox. `source`

### disposeAll()

```swift
@MainActor func disposeAll()
```

Dispose every sandbox.

### get(id:)

```swift
@MainActor func get(id: Int) -> RunningSandbox?
```

The sandbox with this id, or `nil` once it is disposed.

### list()

```swift
@MainActor func list() -> [RunningSandbox]
```

Every sandbox that is not disposed.

### run(_:options:)-1vyls

```swift
@MainActor func run(_ module: SandboxModule, options: SandboxOptions = .init()) async throws -> String
```

Run a compiled module and wait for it to settle. The sandbox is disposed afterwards.

### run(_:options:)-6obqb

```swift
@MainActor func run(_ source: String, options: SandboxOptions = .init()) async throws -> String
```

Run a script and wait for it to settle. The sandbox is disposed afterwards. `source`

### start(_:options:)-2zkrh

```swift
@MainActor func start(_ module: SandboxModule, options: SandboxOptions = .init()) throws -> RunningSandbox
```

Start a compiled module. Only a module has exports that [`call(_:_:)`](../runningsandbox/call(_:_:).md) reaches.

### start(_:options:)-6t17x

```swift
@MainActor func start(_ source: String, options: SandboxOptions = .init()) throws -> RunningSandbox
```

Start a script without waiting for it.
