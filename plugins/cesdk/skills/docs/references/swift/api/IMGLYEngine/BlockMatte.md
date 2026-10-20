# BlockMatte

- **Module:** `IMGLYEngine`
- **DocC identifier:** `/documentation/IMGLYEngine/BlockMatte`

A block that masks another block, and the channel it masks with.

```swift
struct BlockMatte
```

## Members

### init(source:mode:)

```swift
init(source: DesignBlockID, mode: MatteMode)
```

Creates a matte description. `source`

### mode

```swift
let mode: MatteMode
```

The channel of the source that masks the block.

### source

```swift
let source: DesignBlockID
```

The matte source block.
