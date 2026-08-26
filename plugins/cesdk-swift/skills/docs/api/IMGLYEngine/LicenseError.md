# LicenseError

- **Module:** `IMGLYEngine`
- **DocC identifier:** `/documentation/IMGLYEngine/LicenseError`

```swift
enum LicenseError
```

## Members

### errorDescription

```swift
var errorDescription: String? { get }
```

### LicenseError.expired

```swift
case expired
```

### LicenseError.internalError

```swift
case internalError
```

### LicenseError.invalid

```swift
case invalid
```

### LicenseError.missing

> **Deprecated:** An empty license key activates evaluation mode, so this error is never thrown.

```swift
case missing
```

An empty license key activates evaluation mode instead of failing, so this case is no longer thrown.

### LicenseError.serverError

```swift
case serverError
```
