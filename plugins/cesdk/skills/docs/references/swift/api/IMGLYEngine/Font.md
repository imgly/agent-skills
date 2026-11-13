# Font

- **Module:** `IMGLYEngine`
- **DocC identifier:** `/documentation/IMGLYEngine/Font`

```swift
@objcMembers final class Font
```

## Members

### init(from:)

```swift
convenience init(from decoder: any Decoder) throws
```

### init(uri:subFamily:weight:style:)

```swift
init(uri: URL, subFamily: String, weight: FontWeight, style: FontStyle)
```

### isEqual(_:)

```swift
override func isEqual(_ object: Any?) -> Bool
```

### style

```swift
let style: FontStyle
```

### subFamily

```swift
let subFamily: String
```

### uri

```swift
let uri: URL
```

### weight

```swift
let weight: FontWeight
```
