# PathVertex

- **Module:** `IMGLYEngine`
- **DocC identifier:** `/documentation/IMGLYEngine/PathVertex`

One vertex of a bezier path keyframe value.

```swift
struct PathVertex
```

## Members

### init(point:inTangent:outTangent:)

```swift
init(point: SIMD2<Float>, inTangent: SIMD2<Float> = .zero, outTangent: SIMD2<Float> = .zero)
```

Creates a path vertex. `point`

### inTangent

```swift
var inTangent: SIMD2<Float>
```

The incoming tangent, relative to `point`.

### outTangent

```swift
var outTangent: SIMD2<Float>
```

The outgoing tangent, relative to `point`.

### point

```swift
var point: SIMD2<Float>
```

The position of the vertex.
