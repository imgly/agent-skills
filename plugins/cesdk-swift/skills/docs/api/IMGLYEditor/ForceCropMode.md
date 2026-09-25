# ForceCropMode

- **Module:** `IMGLYEditor`
- **DocC identifier:** `/documentation/IMGLYEditor/ForceCropMode`

Defines the behavior when applying a force crop preset.

```swift
enum ForceCropMode
```

## Members

### ForceCropMode.always

```swift
case always
```

Applies the preset and always opens the crop UI.

### ForceCropMode.ifNeeded

```swift
case ifNeeded
```

Only applies the preset if dimensions differ, then opens the crop UI.

### ForceCropMode.silent

```swift
case silent
```

Applies the preset without opening the crop UI.
