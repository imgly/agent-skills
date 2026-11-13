# NamedColor

- **Module:** `IMGLYEditor`
- **DocC identifier:** `/documentation/IMGLYEditor/NamedColor`

A named color that is composed of a name, required for accessibility, and the actual `CGColor` to use.

```swift
struct NamedColor
```

## Members

### color

```swift
let color: CGColor
```

The color value.

### hash(into:)

```swift
func hash(into hasher: inout Hasher)
```

### id

```swift
var id: CGColor { get }
```

### init(_:_:)

```swift
init(_ name: LocalizedStringResource, _ color: CGColor)
```

Creates a named color. `name`

### name

```swift
let name: LocalizedStringResource
```

The color name.
