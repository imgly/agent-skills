# VariableBinding

- **Module:** `IMGLYEngine`
- **DocC identifier:** `/documentation/IMGLYEngine/VariableBinding`

A block property that is bound to a variable.

```swift
struct VariableBinding
```

## Members

### block

```swift
let block: DesignBlockID
```

The block that has the bound property.

### init(block:property:variable:)

```swift
init(block: DesignBlockID, property: String, variable: String)
```

Creates a description of a variable binding. `block`

### property

```swift
let property: String
```

The property path, for example `"position/x"`.

### variable

```swift
let variable: String
```

The key of the variable.
