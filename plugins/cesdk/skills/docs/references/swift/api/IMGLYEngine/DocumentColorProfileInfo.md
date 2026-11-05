# DocumentColorProfileInfo

- **Module:** `IMGLYEngine`
- **DocC identifier:** `/documentation/IMGLYEngine/DocumentColorProfileInfo`

What the document stores about a color profile that was assigned to it.

```swift
struct DocumentColorProfileInfo
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

The ICC `desc` tag of the profile. Empty when the profile carries no description, and until the engine opens the profile. A profile that you assign opens at once. After a scene or archive load, a profile opens when a conversion needs it, or when `loadColorProfiles()` runs.

### uri

```swift
let uri: String
```

The URI the document names the profile by, for `setDocumentColorProfile`. An archive save and load rewrites it.
