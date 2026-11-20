# RunningSandbox

- **Module:** `IMGLYEngine`
- **DocC identifier:** `/documentation/IMGLYEngine/RunningSandbox`

A sandbox started by `SandboxAPI.start(_:options:)`. It is updated on every engine update until you call [`dispose()`](runningsandbox/dispose().md). Values cross as JSON: `nil` for null, `Bool`, numbers, `String`, arrays and `[String: Any]`.

```swift
@MainActor final class RunningSandbox
```

## Members

### abort()

```swift
@MainActor func abort()
```

Stop the script. Its `abortSignal` fires, the engine calls it has in flight end, and it rejects with `SANDBOX.ABORTED`. A script that settled keeps its result.

### call(_:_:)

```swift
@MainActor func call(_ name: String, _ arguments: Any...) throws -> Any?
```

Call an exported function of the module. `name`

### dispose()

```swift
@MainActor func dispose()
```

Release the sandbox. A script that has not settled rejects with `SANDBOX.DISPOSED`.

### has(_:)

```swift
@MainActor func has(_ specifier: String) -> Bool
```

Whether a module is reachable from the script.

### id

```swift
@MainActor let id: Int
```

Unique for the engine instance and never reused.

### listExports()

```swift
@MainActor func listExports() -> [String]
```

The names the module exports.

### listModules()

```swift
@MainActor func listModules() -> [String]
```

The module specifiers the policy admitted, which can be fewer than you registered.

### read(_:)

```swift
@MainActor func read(_ name: String) throws -> Any?
```

Read an exported constant of the module.

### settled

```swift
@MainActor var settled: String { get async throws }
```

The script’s return value, converted to a string.

### state

```swift
@MainActor var state: SandboxState { get }
```

Whether the script is still running, or how it settled. A disposed sandbox reads `.rejected`.

### wasInterrupted

```swift
@MainActor var wasInterrupted: Bool { get }
```

Whether the CPU budget stopped the script.
