# BooleanOperation

- **Module:** `IMGLYEngine`
- **DocC identifier:** `/documentation/IMGLYEngine/BooleanOperation`

The operation of `combine`. The engine reads the raw value, so a new operation goes last.

```swift
@objc enum BooleanOperation
```

## Members

### BooleanOperation.difference

```swift
case difference
```

### BooleanOperation.intersection

```swift
case intersection
```

### BooleanOperation.merge

```swift
case merge
```

Every shape as a contour of its own, with no boolean operation.

### BooleanOperation.union

```swift
case union
```

### BooleanOperation.xor

```swift
case xor
```

### init(rawValue:)

```swift
init?(rawValue: _ObjCRawEnum)
```
