# BlockEdit

- **Module:** `IMGLYEngine`
- **DocC identifier:** `/documentation/IMGLYEngine/BlockEdit`

An edit of a block that a variable binding can lock.

```swift
@objc enum BlockEdit
```

## Members

### BlockEdit.crop

```swift
case crop
```

A change of the crop.

### BlockEdit.flip

```swift
case flip
```

A horizontal or vertical flip.

### BlockEdit.move

```swift
case move
```

A change of the position, on either axis.

### BlockEdit.moveX

```swift
case moveX
```

A change of the x position.

### BlockEdit.moveY

```swift
case moveY
```

A change of the y position.

### BlockEdit.resize

```swift
case resize
```

A change of the width or the height, or of both.

### BlockEdit.resizeHeight

```swift
case resizeHeight
```

A change of the height.

### BlockEdit.resizeWidth

```swift
case resizeWidth
```

A change of the width.

### BlockEdit.rotate

```swift
case rotate
```

A change of the rotation.

### BlockEdit.scale

```swift
case scale
```

A scale of the block with everything below it, as a content-aware resize does.

### init(rawValue:)

```swift
init?(rawValue: _ObjCRawEnum)
```
