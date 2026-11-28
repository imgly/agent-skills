# CursorType

- **Module:** `IMGLYEngine`
- **DocC identifier:** `/documentation/IMGLYEngine/CursorType`

```swift
@objc enum CursorType
```

## Members

### CursorType.arrow

```swift
case arrow
```

### CursorType.cell

```swift
case cell
```

The engine does not return this cursor. The case keeps the raw values of the cases below equal to the engine’s.

### CursorType.convert

```swift
case convert
```

Vector bend mode: a click on the hovered anchor toggles it between smooth and corner, and a drag pulls out new handles.

### CursorType.move

```swift
case move
```

### CursorType.moveNotPermitted

```swift
case moveNotPermitted
```

### CursorType.pen

```swift
case pen
```

Vector draw mode: a click places an anchor.

### CursorType.penAdd

```swift
case penAdd
```

Vector editing: a click adds an anchor to the hovered segment.

### CursorType.penClose

```swift
case penClose
```

Vector draw mode: a click on the hovered anchor at the other end of the drawn path closes it.

### CursorType.penContinue

```swift
case penContinue
```

Vector draw mode: a click on the hovered end of an open path continues or joins it.

### CursorType.penRemove

```swift
case penRemove
```

Vector editing: a click removes the hovered anchor.

### CursorType.resize

```swift
case resize
```

### CursorType.rotate

```swift
case rotate
```

### CursorType.text

```swift
case text
```

### init(rawValue:)

```swift
init?(rawValue: _ObjCRawEnum)
```
