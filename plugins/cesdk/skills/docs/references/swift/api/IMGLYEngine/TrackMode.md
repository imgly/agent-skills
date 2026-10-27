# TrackMode

- **Module:** `IMGLYEngine`
- **DocC identifier:** `/documentation/IMGLYEngine/TrackMode`

How the keyframe track of a property combines with the static value of the property.

```swift
@objc enum TrackMode
```

## Members

### init(rawValue:)

```swift
init?(rawValue: _ObjCRawEnum)
```

### TrackMode.absolute

```swift
case absolute
```

The track value replaces the static value.

### TrackMode.relative

```swift
case relative
```

The track value is added to the static value. Only float and vec2 properties allow this mode.
