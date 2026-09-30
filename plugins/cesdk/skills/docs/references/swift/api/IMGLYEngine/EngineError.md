# EngineError

- **Module:** `IMGLYEngine`
- **DocC identifier:** `/documentation/IMGLYEngine/EngineError`

Structured CE.SDK engine error surfaced through the Apple binding. Engine APIs throw `NSError` for ObjC interop, but `EngineError` bridges from that `NSError`, so you can catch it directly with a typed `catch` and branch on the stable catalog code instead of matching the rendered message. Errors from other domains skip the typed `catch` and propagate unchanged.

```swift
struct EngineError
```

## Members

### args

```swift
let args: [String : EngineError.ArgValue]
```

Typed template arguments mirroring the engine’s `ErrorArg` variant. Use pattern matching: `if case let .int(size) = args["fontSize"] { ... }`.

### catalogCode

```swift
var catalogCode: EngineErrorCode? { get }
```

The stable `code` resolved into the generated catalog enum, or `nil` for an unrecognized code. Saves callers the `EngineErrorCode(rawValue:)` lookup when branching on a known case. Named `catalogCode` to avoid colliding with `CustomNSError.errorCode`.

### category

```swift
let category: String
```

Category prefix derived from the id (e.g. `"SCENE"`). Empty when `code` is empty.

### code

```swift
let code: String
```

Stable catalog id (e.g. `"SCENE.NOT_VALID"`). Empty only as a defensive fallback.

### ArgValue.description

```swift
var description: String { get }
```

Matches the engine’s `ErrorArg::toString()` for bools/ints/strings: `bool` renders `"true"`/`"false"` (not `"1"`/`"0"`), keeping parity with Web/Android.

### description

```swift
var description: String { get }
```

`CustomStringConvertible` — `"<code>: <message>"` when a code is present, plain message otherwise.

### docsURL

```swift
var docsURL: URL? { get }
```

Fully-qualified docs URL, e.g. `https://img.ly/docs/cesdk/ios/user-interface/font-size-d194d1/`. `nil` when the catalog entry links no docs page. The URL is built once on the ObjC++ side and carried in the underlying `NSError`’s `helpAnchor` (`NSHelpAnchorErrorKey`); this reads it back so the Apple docs base lives in exactly one place.

### EngineError.ArgValue

```swift
enum ArgValue
```

A single typed error-template argument. Mirrors the engine’s C++ `std::variant<bool, int64_t, double, std::string>`, so `Bool` and `Int` stay distinct (an `NSNumber`-backed `[String: Any]` would conflate them).

### ArgValue.EngineError.ArgValue.bool(_:)

```swift
case bool(Bool)
```

### ArgValue.EngineError.ArgValue.double(_:)

```swift
case double(Double)
```

### ArgValue.EngineError.ArgValue.int(_:)

```swift
case int(Int64)
```

### ArgValue.EngineError.ArgValue.string(_:)

```swift
case string(String)
```

### errorCode

```swift
var errorCode: Int { get }
```

### errorDescription

```swift
var errorDescription: String? { get }
```

`LocalizedError.errorDescription` — surfaces `message` so `error.localizedDescription` keeps working.

### errorDomain

```swift
static var errorDomain: String { get }
```

### errorUserInfo

```swift
var errorUserInfo: [String : Any] { get }
```

### hint

```swift
let hint: String
```

English “what to do next” hint, already interpolated. Empty when the catalog entry declares no hint.

### init(_:)

```swift
init?(_ error: any Error)
```

Build an `EngineError` from any thrown error if it originated in the engine bridge. Returns `nil` for errors from other domains so callers can rethrow.

### message

```swift
let message: String
```

English developer-facing message, already interpolated with `args`.

### recoverySuggestion

```swift
var recoverySuggestion: String? { get }
```

`LocalizedError.recoverySuggestion` — surfaces the “what to do next” hint when present. (`failureReason` is intentionally left at its `nil` default: the developer-facing message is already on `errorDescription`, and the hint is a recovery suggestion, not a reason.)

### silent

```swift
let silent: Bool
```

Whether the catalog marks this error as silent (expected platform limitation that should not be logged). Consumers may still surface it programmatically.

### underlyingError

```swift
let underlyingError: NSError
```

The underlying `NSError` that carried this payload across the bridge. Kept available so consumers can chain into APIs that consume `NSError` (logging, analytics, etc.).
