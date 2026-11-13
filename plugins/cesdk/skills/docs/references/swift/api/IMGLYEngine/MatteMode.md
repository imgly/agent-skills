# MatteMode

- **Module:** `IMGLYEngine`
- **DocC identifier:** `/documentation/IMGLYEngine/MatteMode`

The channel of a matte source that masks a block.

```swift
@objc enum MatteMode
```

## Members

### init(rawValue:)

```swift
init?(rawValue: _ObjCRawEnum)
```

### MatteMode.alpha

```swift
case alpha
```

The block shows where the source is opaque.

### MatteMode.alphaInverted

```swift
case alphaInverted
```

The block shows where the source is transparent.

### MatteMode.luma

```swift
case luma
```

The block shows where the source is bright.

### MatteMode.lumaInverted

```swift
case lumaInverted
```

The block shows where the source is dark or transparent.
