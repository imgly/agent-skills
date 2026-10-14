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

### name

```swift
let name: String
```

The ICC `desc` tag of the profile. Empty when the profile carries no description, and while it is still loading.

### uri

```swift
let uri: String
```

The URI the document names the profile by, for `setCMYKProfile`. An archive save and load rewrites it.
