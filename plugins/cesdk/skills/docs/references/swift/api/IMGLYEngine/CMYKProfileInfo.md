# CMYKProfileInfo

- **Module:** `IMGLYEngine`
- **DocC identifier:** `/documentation/IMGLYEngine/CMYKProfileInfo`

What the document stores about a CMYK profile that was assigned to it.

```swift
struct CMYKProfileInfo
```

## Members

### contentHash

```swift
let contentHash: String
```

SHA-256 of the profile bytes, base64 encoded. Two profiles with the same hash have the same content.
