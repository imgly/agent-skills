# ClipInitialDurationMode

- **Module:** `IMGLYEngine`
- **DocC identifier:** `/documentation/IMGLYEngine/ClipInitialDurationMode`

How new foreground clips receive their initial duration via `clip/initialDurationMode`.

```swift
enum ClipInitialDurationMode
```

## Members

### ClipInitialDurationMode.default

```swift
case `default`
```

Static clips use `clip/defaultDurationValue`; videos use their media duration.

### ClipInitialDurationMode.followParent

```swift
case followParent
```

Static clips end with the background track; videos use their media duration capped at that end. Without a remaining background interval, uses the same duration as `default`.

### init(rawValue:)

```swift
init?(rawValue: String)
```
