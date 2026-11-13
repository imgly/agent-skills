# DiscreteValue

- **Module:** `IMGLYEngine`
- **DocC identifier:** `/documentation/IMGLYEngine/DiscreteValue`

A keyframe value that does not interpolate. It changes at the time of the next keyframe.

```swift
enum DiscreteValue
```

## Members

### DiscreteValue.bool(_:)

```swift
case bool(Bool)
```

A boolean value.

### DiscreteValue.int(_:)

```swift
case int(Int32)
```

An integer value, for example the index of an enum property.

### DiscreteValue.string(_:)

```swift
case string(String)
```

A string value, for example text.
