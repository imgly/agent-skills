# NavigationLabel

- **Module:** `IMGLYEditor`
- **DocC identifier:** `/documentation/IMGLYEditor/NavigationLabel`

A label that looks like the original navigation back button.

```swift
@MainActor struct NavigationLabel
```

## Members

### body

```swift
@MainActor var body: some View { get }
```

### init(_:direction:)

```swift
@MainActor init(_ title: LocalizedStringResource, direction: NavigationLabel.Direction)
```

Creates a navigation label with a title and direction. `title`

### Direction.init(rawValue:)

```swift
init?(rawValue: String)
```

### NavigationLabel.Direction

```swift
enum Direction
```

The direction of the navigation label.

### Direction.NavigationLabel.Direction.backward

```swift
case backward
```

### Direction.NavigationLabel.Direction.forward

```swift
case forward
```
