# ForceCropMode

- **Module:** `IMGLYEditor`
- **DocC identifier:** `/documentation/IMGLYEditor/ForceCropMode`

Defines the behavior when applying a force crop preset.

```swift
enum ForceCropMode
```

## Members

### allCases

```swift
static var allCases: [ForceCropMode] { get }
```

### defaultIfNeededThreshold

```swift
static let defaultIfNeededThreshold: Float
```

The threshold that [`ifNeeded`](ifneeded.md) uses.

### ForceCropMode.always

```swift
case always
```

Applies the preset and always opens the crop UI.

### ForceCropMode.ifNeeded(threshold:)

```swift
case ifNeeded(threshold: Float)
```

Only applies the preset if the dimensions differ by more than `threshold`, then opens the crop UI. `threshold`

### ForceCropMode.silent

```swift
case silent
```

Applies the preset without opening the crop UI.

### ifNeeded

```swift
static var ifNeeded: ForceCropMode { get }
```

[`ForceCropMode.ifNeeded(threshold:)`](./ifneeded(threshold:).md) with [`defaultIfNeededThreshold`](defaultifneededthreshold.md).
