# TextTiming

- **Module:** `IMGLYEngine`
- **DocC identifier:** `/documentation/IMGLYEngine/TextTiming`

A range of a text and the time at which it starts to be spoken, such as one word of a caption. A text animator whose `text_animator/selectorTiming` is not `None` selects the ranges by these times.

```swift
struct TextTiming
```

## Members

### from

```swift
let from: Int
```

Start grapheme index (inclusive).

### init(from:to:start:)

```swift
init(from: Int, to: Int, start: Double)
```

### start

```swift
let start: Double
```

The start in seconds from the start of the block. A range before the start of the block has a negative start.

### to

```swift
let to: Int
```

End grapheme index (exclusive).
