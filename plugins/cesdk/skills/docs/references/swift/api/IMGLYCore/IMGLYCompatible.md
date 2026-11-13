# IMGLYCompatible

- **Module:** `IMGLYCore`
- **DocC identifier:** `/documentation/IMGLYCore/IMGLYCompatible`

Represents an object type that is compatible with [`IMGLY`](imgly.md). You can use `imgly` property to get a value in the namespace of `IMGLY*` modules.

```swift
protocol IMGLYCompatible
```

## Members

### CompatibleType

```swift
associatedtype CompatibleType
```

Type that is being wrapped.

### imgly-1a8c0

```swift
static var imgly: IMGLY<Self.CompatibleType>.Type { get set }
```

Gets a namespace holder for [`IMGLY`](../imgly.md) compatible types.

### imgly-45c2b

```swift
var imgly: IMGLY<Self.CompatibleType> { get set }
```

Gets a namespace holder for [`IMGLY`](../imgly.md) compatible types.

### imgly-6cfuo

```swift
static var imgly: IMGLY<Self>.Type { get set }
```

Gets a namespace holder for `IMGLY` compatible types.

### imgly-8hgf3

```swift
var imgly: IMGLY<Self> { get set }
```

Gets a namespace holder for `IMGLY` compatible types.
