# InteractionModifiers

- **Module:** `IMGLYEngine`
- **DocC identifier:** `/documentation/IMGLYEngine/InteractionModifiers`

The modifier keys that an interaction update applies, as held keys would during a pointer drag.

```swift
struct InteractionModifiers
```

## Members

### alt

```swift
var alt: Bool
```

Copies the moved blocks, as Alt or Option does.

### command

```swift
var command: Bool
```

Moves into a nested frame, or resizes a page with its content, as Command does.

### control

```swift
var control: Bool
```

Turns snapping off and places a moved block without a flow slot, as Control does.

### init(alt:command:control:)

```swift
init(alt: Bool = false, command: Bool = false, control: Bool = false)
```
