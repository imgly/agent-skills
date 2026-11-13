# VariableAPI

- **Module:** `IMGLYEngine`
- **DocC identifier:** `/documentation/IMGLYEngine/VariableAPI`

```swift
@MainActor final class VariableAPI
```

## Members

### createValueSet(name:)

```swift
@MainActor func createValueSet(name: String) throws -> ValueSetID
```

Create an empty value set in the scene. A value set holds alternative values for some scene variables. Write them with the `target` parameter of the setters. The scene saves its sets, and undo reverts their changes. `name`

### destroyValueSet(_:)

```swift
@MainActor func destroyValueSet(_ set: ValueSetID) throws
```

Destroy a value set and its values. When the set is active, no set is active afterwards, and text and bound properties show the default values again. `set`

### findAll()

```swift
@MainActor func findAll() -> [String]
```

Get all text variables of the scene, or of the variables that wait for a scene. Return a list of variable names.

### findAll(type:)

```swift
@MainActor func findAll(type: VariableType) -> [String]
```

Get the keys of all variables of one type. [`findAll()`](findall().md) returns only text variables. `type`

### findAllValueSets()

```swift
@MainActor func findAllValueSets() -> [ValueSetID]
```

Get the value sets of the scene. The IDs of the sets in creation order, empty when no scene exists.

### findValueSet(byName:)

```swift
@MainActor func findValueSet(byName name: String) -> ValueSetID?
```

Find a value set by its name. `name`

### get(key:target:)

```swift
@MainActor func get(key: String, target: VariableTarget? = nil) throws -> String
```

Get a text variable. `key`

### getActiveValueSet()

```swift
@MainActor func getActiveValueSet() -> ValueSetID?
```

Get the active value set. The ID of the active set, or `nil` when no set is active or no scene exists.

### getColor(key:target:)

```swift
@MainActor func getColor(key: String, target: VariableTarget? = nil) throws -> Color
```

Get a color variable. `key`

### getImageURL(key:target:)

```swift
@MainActor func getImageURL(key: String, target: VariableTarget? = nil) throws -> URL
```

Get an image variable. `key`

### getNumber(key:target:)

```swift
@MainActor func getNumber(key: String, target: VariableTarget? = nil) throws -> Float
```

Get a number variable. `key`

### getType(key:target:)

```swift
@MainActor func getType(key: String, target: VariableTarget? = nil) throws -> VariableType
```

Get the type of a variable. `key`

### getTypeface(key:target:)

```swift
@MainActor func getTypeface(key: String, target: VariableTarget? = nil) throws -> Typeface
```

Get a typeface variable. `key`

### getValueSetName(_:)

```swift
@MainActor func getValueSetName(_ set: ValueSetID) throws -> String
```

Get the name of a value set. `set`

### remove(key:target:)

```swift
@MainActor func remove(key: String, target: VariableTarget? = nil) throws
```

Destroy a variable of any type. Bound properties keep their last value and their binding, so direct writes to them still fail with `BLOCK.PROPERTY_BOUND`. Setting a variable with the same key and type again makes them follow it again. `key`

### rename(key:to:)

```swift
@MainActor func rename(key: String, to newKey: String) throws
```

Rename a variable of any type. The value, the type and the values in every value set move to the new key. Every block property bound to the variable follows the new key and keeps its value. For a text variable, every `{{key}}` token in text blocks and page titles is rewritten too. A key inside a longer expression or a statement, such as `{% if key %}`, is not renamed. `key`

### set(key:color:target:)

```swift
@MainActor func set(key: String, color: Color, target: VariableTarget? = nil) throws
```

Set a color variable. Creates it when no variable has this key. Every block property bound to the variable takes the value that the scene shows. If a bound property rejects the value, the call throws its error, but the variable and the other bound properties change anyway. `key`

### set(key:imageURL:target:)

```swift
@MainActor func set(key: String, imageURL: URL, target: VariableTarget? = nil) throws
```

Set an image variable. Creates it when no variable has this key. Every block property bound to the variable takes the URL that the scene shows. If a bound property rejects the value, the call throws its error, but the variable and the other bound properties change anyway. `key`

### set(key:number:target:)

```swift
@MainActor func set(key: String, number: Float, target: VariableTarget? = nil) throws
```

Set a number variable. Creates it when no variable has this key. Every block property bound to the variable takes the value that the scene shows. If a bound property rejects the value, the call throws its error, but the variable and the other bound properties change anyway. `key`

### set(key:typeface:target:)

```swift
@MainActor func set(key: String, typeface: Typeface, target: VariableTarget? = nil) throws
```

Set a typeface variable. Creates it when no variable has this key. Every text block whose typeface is bound to the variable takes the typeface that the scene shows, over its whole text. Bold and italic text keeps its formatting where the typeface supports it. If a bound property rejects the value, the call throws its error, but the variable and the other bound properties change anyway. `key`

### set(key:value:target:)

```swift
@MainActor func set(key: String, value: String, target: VariableTarget? = nil) throws
```

Set a text variable. The key must not be `scene_root` or start with `ubq.`, because those name the built-in placeholders. The scene saves its variables, and undo reverts their changes. A variable set while no scene exists waits for the next scene. That scene takes it when it is created or loaded, as this setter without a target writes it. A value of another type than the loaded variable is dropped. `key`

### setActiveValueSet(_:)

```swift
@MainActor func setActiveValueSet(_ set: ValueSetID?) throws
```

Activate a value set, or no set. The values of the active set win over the default values in text, bound properties and getters. Exports show the active set, as the canvas does. A scene has one active set, and saves it. Undo reverts the change. `set`

### setValueSetName(_:name:)

```swift
@MainActor func setValueSetName(_ set: ValueSetID, name: String) throws
```

Rename a value set. The ID stays, and an active set stays active. `set`
