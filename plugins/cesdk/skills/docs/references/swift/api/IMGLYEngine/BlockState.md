# BlockState

- **Module:** `IMGLYEngine`
- **DocC identifier:** `/documentation/IMGLYEngine/BlockState`

```swift
enum BlockState
```

## Members

### BlockState.error(_:)

```swift
case error(BlockStateError)
```

There’s an error preventing rendering.

### BlockState.pending(progress:)

```swift
case pending(progress: Float)
```

There is an ongoing operation on the block. Rendering may be affected. `progress`

### BlockState.ready

```swift
case ready
```

The block is ready to be rendered.
