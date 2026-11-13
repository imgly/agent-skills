# Keyframe

- **Module:** `IMGLYEngine`
- **DocC identifier:** `/documentation/IMGLYEngine/Keyframe`

One keyframe of a property track.

```swift
struct Keyframe
```

## Members

### easing

```swift
var easing: KeyframeEasing
```

The curve from this keyframe to the next one.

### init(time:value:easing:spatialOut:spatialIn:)

```swift
init(time: Float, value: KeyframeValue, easing: KeyframeEasing = .preset(.linear), spatialOut: SIMD2<Float>? = nil, spatialIn: SIMD2<Float>? = nil)
```

Creates a keyframe. `time`

### spatialIn

```swift
var spatialIn: SIMD2<Float>?
```

The motion path tangent that enters the next keyframe’s value, relative to that value. It sits on this keyframe, like `spatialOut`, so the last keyframe does not use it. Only keyframes with a vec2 value allow it.

### spatialOut

```swift
var spatialOut: SIMD2<Float>?
```

The motion path tangent that leaves this keyframe’s value, relative to it. Only keyframes with a vec2 value allow it.

### time

```swift
var time: Float
```

The time of the keyframe, normalized from 0 to 1 over the duration of the block.

### value

```swift
var value: KeyframeValue
```

The value of the property at `time`.
