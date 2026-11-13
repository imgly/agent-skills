# VerticalContentFillAlignment

- **Module:** `IMGLYEngine`
- **DocC identifier:** `/documentation/IMGLYEngine/VerticalContentFillAlignment`

Vertical alignment of the content fill inside the block. Applies when the content fill mode is `.contain` or `.cover`. Has no visible effect in `.crop`, where the user positions the content explicitly.

```swift
@objc enum VerticalContentFillAlignment
```

## Members

### init(rawValue:)

```swift
init?(rawValue: _ObjCRawEnum)
```

### VerticalContentFillAlignment.bottom

```swift
case bottom
```

Align the content to the bottom edge of the block.

### VerticalContentFillAlignment.center

```swift
case center
```

Center the content vertically.

### VerticalContentFillAlignment.top

```swift
case top
```

Align the content to the top edge of the block.
