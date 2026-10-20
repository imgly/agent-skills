# BlockState

- **Module:** `IMGLYEngine`
- **DocC identifier:** `/documentation/IMGLYEngine/BlockState`

```swift
enum BlockState
```

## Members

### ==(_:_:)

```swift
static func == (lhs: BlockState, rhs: BlockState) -> Bool
```

Two error states are equal when their kind matches. The engine error is not compared, as on Android.

### BlockState.error(_:engineError:)

```swift
case error(BlockStateError, engineError: EngineError? = nil)
```

There’s an error preventing rendering. `error`

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
