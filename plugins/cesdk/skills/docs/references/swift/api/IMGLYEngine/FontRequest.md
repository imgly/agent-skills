# FontRequest

- **Module:** `IMGLYEngine`
- **DocC identifier:** `/documentation/IMGLYEngine/FontRequest`

A stable font identity resolved at runtime, preserved when the font is unavailable.

```swift
@objcMembers final class FontRequest
```

## Members

### assetID

```swift
let assetID: String?
```

### assetSourceID

```swift
let assetSourceID: String?
```

### family

```swift
let family: String
```

### hash

```swift
override var hash: Int { get }
```

### init(family:subFamily:weight:style:postScriptName:assetSourceID:assetID:)

```swift
init(family: String, subFamily: String = "", weight: FontWeight = .normal, style: FontStyle = .normal, postScriptName: String? = nil, assetSourceID: String? = nil, assetID: String? = nil)
```

### isEqual(_:)

```swift
override func isEqual(_ object: Any?) -> Bool
```

### postScriptName

```swift
let postScriptName: String?
```

### style

```swift
let style: FontStyle
```

### subFamily

```swift
let subFamily: String
```

### weight

```swift
let weight: FontWeight
```
