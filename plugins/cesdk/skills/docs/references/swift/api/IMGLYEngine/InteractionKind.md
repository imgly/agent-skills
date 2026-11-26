# InteractionKind

- **Module:** `IMGLYEngine`
- **DocC identifier:** `/documentation/IMGLYEngine/InteractionKind`

The edit that an interaction performs on the selected blocks, as a drag of the matching handle would.

```swift
@objc enum InteractionKind
```

## Members

### init(rawValue:)

```swift
init?(rawValue: Int32)
```

### InteractionKind.cropMove

```swift
case cropMove
```

Moves the content inside the crop frame. Needs the Crop edit mode.

### InteractionKind.cropResize

```swift
case cropResize
```

Resizes the crop frame, as an inner crop handle does. Needs the Crop edit mode.

### InteractionKind.cropScale

```swift
case cropScale
```

Scales the content inside the crop frame, as an outer crop handle does. Needs the Crop edit mode.

### InteractionKind.move

```swift
case move
```

### InteractionKind.resize

```swift
case resize
```

### InteractionKind.rotate

```swift
case rotate
```
