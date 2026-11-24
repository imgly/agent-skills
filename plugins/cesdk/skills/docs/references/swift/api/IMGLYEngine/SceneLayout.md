# SceneLayout

- **Module:** `IMGLYEngine`
- **DocC identifier:** `/documentation/IMGLYEngine/SceneLayout`

The layout of a scene. Only `free` is not deprecated: use `SceneAutoLayoutDirection` for the other layouts.

```swift
@objc enum SceneLayout
```

## Members

### init(rawValue:)

```swift
init?(rawValue: _ObjCRawEnum)
```

### SceneLayout.depthStack

```swift
case depthStack
```

The pages are arranged one behind the other.

### SceneLayout.free

```swift
case free
```

The pages stay at free positions on the canvas.

### SceneLayout.horizontalStack

```swift
case horizontalStack
```

The pages are arranged side by side.

### SceneLayout.verticalStack

```swift
case verticalStack
```

The pages are arranged one below the other.
