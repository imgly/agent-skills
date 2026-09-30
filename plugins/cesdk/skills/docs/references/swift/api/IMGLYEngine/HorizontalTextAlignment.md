# HorizontalTextAlignment

- **Module:** `IMGLYEngine`
- **DocC identifier:** `/documentation/IMGLYEngine/HorizontalTextAlignment`

The horizontal alignment of a text block.

```swift
@objc enum HorizontalTextAlignment
```

## Members

### HorizontalTextAlignment.auto

```swift
case auto
```

Match alignment to the text direction.

### HorizontalTextAlignment.center

```swift
case center
```

Align text to the center.

### HorizontalTextAlignment.justify

```swift
case justify
```

The gaps between words are widened until each line fills the block. The last line of a paragraph keeps its natural width and aligns like [`HorizontalTextAlignment.auto`](auto.md). A line with no gap to widen, such as CJK text, keeps its natural width too.

### HorizontalTextAlignment.left

```swift
case left
```

Align text to the left.

### HorizontalTextAlignment.right

```swift
case right
```

Align text to the right.

### init(rawValue:)

```swift
init?(rawValue: _ObjCRawEnum)
```
