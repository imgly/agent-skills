# KeyframeValue

- **Module:** `IMGLYEngine`
- **DocC identifier:** `/documentation/IMGLYEngine/KeyframeValue`

The value of one keyframe. All keyframes of a property must hold the kind of value that the property takes.

```swift
enum KeyframeValue
```

## Members

### KeyframeValue.color(_:)

```swift
case color(Color)
```

A color.

### KeyframeValue.discrete(_:)

```swift
case discrete(DiscreteValue)
```

A value that does not interpolate.

### KeyframeValue.float(_:)

```swift
case float(Float)
```

A float value.

### KeyframeValue.list(_:)

```swift
case list([Float])
```

A flat list of floats, for example gradient stops or a dash pattern.

### KeyframeValue.path(vertices:closed:)

```swift
case path(vertices: [PathVertex], closed: Bool)
```

A bezier path.

### KeyframeValue.vec2(_:)

```swift
case vec2(SIMD2<Float>)
```

A two-component vector, for example a position.
