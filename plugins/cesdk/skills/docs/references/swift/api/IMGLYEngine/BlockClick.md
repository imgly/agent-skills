# BlockClick

- **Module:** `IMGLYEngine`
- **DocC identifier:** `/documentation/IMGLYEngine/BlockClick`

A click or tap on a block, with the number of cohesive clicks or taps.

```swift
struct BlockClick
```

## Members

### clickCount

```swift
let clickCount: Int
```

The click count: 1 for a single click or tap, 2 for the second click of a double click, and so on.

### id

```swift
let id: DesignBlockID
```

The clicked block.

### init(id:clickCount:)

```swift
init(id: DesignBlockID, clickCount: Int)
```
