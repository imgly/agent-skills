# SheetStyle

- **Module:** `IMGLYEditor`
- **DocC identifier:** `/documentation/IMGLYEditor/SheetStyle`

A style that represents the presentation behavior of a sheet.

```swift
struct SheetStyle
```

## Members

### addAsset(detent:detents:)

```swift
static func addAsset(detent: PresentationDetent = .imgly.large, detents: Set<PresentationDetent> = [.imgly.medium, .imgly.large]) -> SheetStyle
```

Creates a floating sheet style [`withPredefinedDetents(isFloating:detent:detents:largestUndimmedDetent:)`](./withpredefineddetents(isfloating:detent:detents:largestundimmeddetent:).md) that is used for adding assets. `detent`

### default(isFloating:detent:detents:)

```swift
static func `default`(isFloating: Bool = false, detent: PresentationDetent = .imgly.medium, detents: Set<PresentationDetent> = [.imgly.medium, .imgly.large]) -> SheetStyle
```

Creates a default sheet style [`withPredefinedDetents(isFloating:detent:detents:largestUndimmedDetent:)`](./withpredefineddetents(isfloating:detent:detents:largestundimmeddetent:).md). `isFloating`

### init(isFloating:detent:detents:)

```swift
init(isFloating: Bool, detent: PresentationDetent, detents: Set<PresentationDetent>)
```

Creates a sheet style with arbitrary detents where the underlying content is always dimmed. `isFloating`

### init(isFloating:detent:detents:largestUndimmedDetent:)

```swift
init(isFloating: Bool, detent: PresentationDetent, detents: Set<PresentationDetent>, largestUndimmedDetent: PresentationDetent?)
```

Creates a sheet style with arbitrary detents where the underlying content can be undimmed. `isFloating`

### only(isFloating:detent:)

```swift
static func only(isFloating: Bool = false, detent: PresentationDetent) -> SheetStyle
```

Creates a sheet style [`withPredefinedDetents(isFloating:detent:detents:largestUndimmedDetent:)`](./withpredefineddetents(isfloating:detent:detents:largestundimmeddetent:).md) that does not allow to resize the sheet. `isFloating`

### withPredefinedDetents(isFloating:detent:detents:largestUndimmedDetent:)

```swift
static func withPredefinedDetents(isFloating: Bool, detent: PresentationDetent, detents: Set<PresentationDetent>, largestUndimmedDetent: PresentationDetent? = nil) -> SheetStyle
```

Creates a sheet style where the underlying content can be undimmed when exclusively predefined detents are used. Use [`init(isFloating:detent:detents:largestUndimmedDetent:)`](./init(isfloating:detent:detents:largestundimmeddetent:).md) instead if arbitrary detents are required. `isFloating`
