# SceneMarker

- **Module:** `IMGLYEngine`
- **DocC identifier:** `/documentation/IMGLYEngine/SceneMarker`

A named point or span on the scene timeline.

```swift
struct SceneMarker
```

## Members

### duration

```swift
let duration: Double
```

The length of the marker in seconds. 0 marks a single point in time.

### init(name:time:duration:)

```swift
init(name: String, time: Double, duration: Double = 0)
```

Creates a scene marker.

### name

```swift
let name: String
```

The name of the marker. Several markers may share a name.

### time

```swift
let time: Double
```

The start of the marker in seconds.
