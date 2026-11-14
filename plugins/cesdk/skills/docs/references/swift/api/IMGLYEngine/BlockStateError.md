# BlockStateError

- **Module:** `IMGLYEngine`
- **DocC identifier:** `/documentation/IMGLYEngine/BlockStateError`

```swift
@objc enum BlockStateError
```

## Members

### BlockStateError.audioDecoding

```swift
case audioDecoding
```

Failed to decode the block’s audio stream.

### BlockStateError.fileFetch

```swift
case fileFetch
```

Failed to retrieve the block’s remote content.

### BlockStateError.imageDecoding

```swift
case imageDecoding
```

Failed to decode the block’s image stream.

### BlockStateError.softProof

```swift
case softProof
```

The engine could not prepare the soft proof of the canvas. The block itself is intact. An export ignores this state when the engine sets it, and fails on it when `setState(_:state:)` sets it.

### BlockStateError.unknown

```swift
case unknown
```

An unknown error occurred.

### BlockStateError.videoDecoding

```swift
case videoDecoding
```

Failed to decode the block’s video stream.

### init(rawValue:)

```swift
init?(rawValue: _ObjCRawEnum)
```
