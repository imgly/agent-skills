# SandboxRegistration

- **Module:** `IMGLYEngine`
- **DocC identifier:** `/documentation/IMGLYEngine/SandboxRegistration`

A module a script can import under its specifier: compiled script source, or functions your app implements. Host functions are denied until the policy names them.

```swift
struct SandboxRegistration
```

## Members

### functions

```swift
var functions: [String : ([Any]) -> Any?]
```

Host functions, keyed by export name. Arguments and results cross as JSON values: `NSNull` or `nil` for null, `Bool`, numbers, `String`, arrays and `[String: Any]`. A result without a JSON form reaches the script as null.

### globalName

```swift
var globalName: String?
```

When set, the module is also a global under this dotted path, for scripts that cannot `import`.

### init(module:functions:globalName:)

```swift
init(module: SandboxModule? = nil, functions: [String : ([Any]) -> Any?] = [:], globalName: String? = nil)
```

### module

```swift
var module: SandboxModule?
```

Compiled source to import. Mutually exclusive with `functions`.
