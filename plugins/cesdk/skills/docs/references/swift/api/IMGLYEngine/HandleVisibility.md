# HandleVisibility

- **Module:** `IMGLYEngine`
- **DocC identifier:** `/documentation/IMGLYEngine/HandleVisibility`

When a transform handle is shown: by the default rules, always (including while editing text), or never. `always` does not apply in crop edit mode, which has its own handles.

```swift
enum HandleVisibility
```

## Members

### HandleVisibility.always

```swift
case always
```

### HandleVisibility.auto

```swift
case auto
```

### HandleVisibility.never

```swift
case never
```

### init(rawValue:)

```swift
init?(rawValue: String)
```
