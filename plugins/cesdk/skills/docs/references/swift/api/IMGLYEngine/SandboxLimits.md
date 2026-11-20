# SandboxLimits

- **Module:** `IMGLYEngine`
- **DocC identifier:** `/documentation/IMGLYEngine/SandboxLimits`

Resource limits for one sandbox. A `nil` field keeps the engine default.

```swift
struct SandboxLimits
```

## Members

### init(memoryBytes:stackBytes:tickBudgetMs:)

```swift
init(memoryBytes: Int? = nil, stackBytes: Int? = nil, tickBudgetMs: Int? = nil)
```

### memoryBytes

```swift
var memoryBytes: Int?
```

Heap cap in bytes. The default is 64 MiB.

### stackBytes

```swift
var stackBytes: Int?
```

Stack cap in bytes. The default is 4 MiB.

### tickBudgetMs

```swift
var tickBudgetMs: Int?
```

CPU time per engine update in milliseconds. The default is 250.
