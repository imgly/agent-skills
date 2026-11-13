# KeyframeEasing

- **Module:** `IMGLYEngine`
- **DocC identifier:** `/documentation/IMGLYEngine/KeyframeEasing`

The curve from one keyframe to the next.

```swift
enum KeyframeEasing
```

## Members

### KeyframeEasing.bezier(out:in:)

```swift
case bezier(out: SIMD2<Float>, in: SIMD2<Float>)
```

A cubic bezier curve with the handles in CSS `cubic-bezier` space.

### KeyframeEasing.hold

```swift
case hold
```

The value holds until the next keyframe.

### KeyframeEasing.preset(_:)

```swift
case preset(AnimationEasing)
```

A predefined easing curve.
