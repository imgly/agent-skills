# FileSupportUse

- **Module:** `IMGLYEngine`
- **DocC identifier:** `/documentation/IMGLYEngine/FileSupportUse`

Engine support for one media use at the reported inspection level.

```swift
struct FileSupportUse
```

## Members

### init(kind:status:reason:)

```swift
init(kind: String, status: String, reason: String)
```

### kind

```swift
let kind: String
```

Image fill, audio, or video: `image`, `audio`, or `video`.

### reason

```swift
let reason: String
```

Empty when supported; otherwise a machine-readable reason.

### status

```swift
let status: String
```

`supported`, `unsupported`, `unchecked`, or `pending`.
