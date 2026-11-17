# VariableAPI

- **Module:** `IMGLYEngine`
- **DocC identifier:** `/documentation/IMGLYEngine/VariableAPI`

```swift
@MainActor final class VariableAPI
```

## Members

### findAll()

```swift
@MainActor func findAll() -> [String]
```

Get all text variables currently stored in the engine. Return a list of variable names.

### findAll(type:)

```swift
@MainActor func findAll(type: VariableType) -> [String]
```

Get the keys of all variables of one type. [`findAll()`](findall().md) returns only text variables. `type`

### get(key:)

```swift
@MainActor func get(key: String) throws -> String
```

Get a text variable. `key`

### getColor(key:)

```swift
@MainActor func getColor(key: String) throws -> Color
```

Get a color variable. `key`

### getImageURL(key:)

```swift
@MainActor func getImageURL(key: String) throws -> URL
```

Get an image variable. `key`

### getNumber(key:)

```swift
@MainActor func getNumber(key: String) throws -> Float
```

Get a number variable. `key`

### getType(key:)

```swift
@MainActor func getType(key: String) throws -> VariableType
```

Get the type of a variable. `key`

### getTypeface(key:)

```swift
@MainActor func getTypeface(key: String) throws -> Typeface
```

Get a typeface variable. `key`

### remove(key:)

```swift
@MainActor func remove(key: String) throws
```

Destroy a variable of any type. Bound properties keep their last value and their binding, so direct writes to them still fail with `BLOCK.PROPERTY_BOUND`. Setting a variable with the same key and type again makes them follow it again. `key`

### rename(key:to:)

```swift
@MainActor func rename(key: String, to newKey: String) throws
```

Rename a variable of any type. The value and the type move to the new key. Every block property bound to the variable follows the new key and keeps its value. For a text variable, every `{{key}}` token in text blocks is rewritten too. `key`

### set(key:color:)

```swift
@MainActor func set(key: String, color: Color) throws
```

Set a color variable. Creates it when no variable has this key. Every block property bound to the variable takes the new value. If a bound property rejects the value, the call throws its error, but the variable and the other bound properties change anyway. `key`

### set(key:imageURL:)

```swift
@MainActor func set(key: String, imageURL: URL) throws
```

Set an image variable. Creates it when no variable has this key. Every block property bound to the variable takes the new URL. If a bound property rejects the value, the call throws its error, but the variable and the other bound properties change anyway. `key`

### set(key:number:)

```swift
@MainActor func set(key: String, number: Float) throws
```

Set a number variable. Creates it when no variable has this key. Every block property bound to the variable takes the new value. If a bound property rejects the value, the call throws its error, but the variable and the other bound properties change anyway. `key`

### set(key:typeface:)

```swift
@MainActor func set(key: String, typeface: Typeface) throws
```

Set a typeface variable. Creates it when no variable has this key. Every text block whose typeface is bound to the variable takes the new typeface over its whole text. Bold and italic text keeps its formatting where the typeface supports it. If a bound property rejects the value, the call throws its error, but the variable and the other bound properties change anyway. `key`

### set(key:value:)

```swift
@MainActor func set(key: String, value: String) throws
```

Set a text variable. `key`
