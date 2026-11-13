# Asset

- **Module:** `IMGLYEngine`
- **DocC identifier:** `/documentation/IMGLYEngine/Asset`

Generic asset information.

```swift
@objcMembers class Asset
```

## Members

### groups

```swift
let groups: Groups?
```

Groups of the asset.

### id

```swift
let id: String
```

Is a combination of source id, extension pack id (optional), type and asset id e.g. “extension://ly.img.cesdk.images.samples/ly.img.image/sample.1”.

### init(id:groups:meta:payload:)

```swift
init(id: String, groups: Groups? = nil, meta: [String : String]? = nil, payload: AssetPayload? = nil)
```

Initializes generic asset information. `id`

### meta

```swift
let meta: [String : String]?
```

Asset-specific and custom meta information.

### payload

```swift
let payload: AssetPayload?
```

Structured asset-specific data.
