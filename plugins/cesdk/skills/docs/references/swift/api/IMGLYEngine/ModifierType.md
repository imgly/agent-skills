# ModifierType

- **Module:** `IMGLYEngine`
- **DocC identifier:** `/documentation/IMGLYEngine/ModifierType`

The types of shape modifier blocks. A modifier changes the path of a shape, or draws the shape several times.

```swift
enum ModifierType
```

## Members

### init(rawValue:)

```swift
init?(rawValue: String)
```

### ModifierType.offset

```swift
case offset
```

An offset path modifier.

### ModifierType.puckerBloat

```swift
case puckerBloat
```

A pucker and bloat modifier.

### ModifierType.repeater

```swift
case repeater
```

A repeater modifier.

### ModifierType.roundCorners

```swift
case roundCorners
```

A round corners modifier.

### ModifierType.trim

```swift
case trim
```

A trim paths modifier.

### ModifierType.twist

```swift
case twist
```

A twist modifier.

### ModifierType.zigzag

```swift
case zigzag
```

A zig zag modifier.
