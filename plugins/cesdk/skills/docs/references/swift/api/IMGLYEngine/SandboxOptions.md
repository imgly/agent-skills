# SandboxOptions

- **Module:** `IMGLYEngine`
- **DocC identifier:** `/documentation/IMGLYEngine/SandboxOptions`

Options for `SandboxAPI.start(_:options:)` and `SandboxAPI.run(_:options:)`.

```swift
struct SandboxOptions
```

## Members

### init(limits:policy:modules:)

```swift
init(limits: SandboxLimits = .init(), policy: SandboxPolicy = .init(), modules: [String : SandboxRegistration] = [:])
```

### limits

```swift
var limits: SandboxLimits
```

### modules

```swift
var modules: [String : SandboxRegistration]
```

Modules a script can import, keyed by specifier.

### policy

```swift
var policy: SandboxPolicy
```
