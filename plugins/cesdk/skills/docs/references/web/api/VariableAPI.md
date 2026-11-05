# VariableAPI

## Variable Management

Create, update, retrieve, and remove variables from the engine.

### findAll()

Get all text variable names of the scene, or of the variables that wait for a scene.

```typescript
findAll(): string[]
```

**Returns:** List of variable names.

### setString()

Set a text variable's value.
Creates a new variable if the key doesn't exist, or updates an existing one. The scene saves its variables, and
undo reverts their changes. A variable set while no scene exists waits for the next scene. That scene takes it
when it is created or loaded, as this setter without a target writes it. A value of another type than the loaded
variable is dropped.
A new key must not be empty, start or end with whitespace, contain `{{` or `}}`, or be reserved:
`scene_root` and keys that start with `ubq.`.

```typescript
setString(key: string, value: string, options?: VariableOptions | null): void
```

**Parameters:**
- `key` - The variable's key.
- `value` - The text value to assign to the variable.
- `options` - The layer to write. By default the active value set when it holds the key, else the default value.

### getString()

Get a text variable's value.

```typescript
getString(key: string, options?: VariableOptions | null): string
```

**Parameters:**
- `key` - The variable's key.
- `options` - The layer to read. By default the value that the scene shows.

**Returns:** The text value of the variable.

### remove()

Remove a variable of any type from the engine.
Bound properties keep their last value and their binding, so direct writes
to them still fail with `BLOCK.PROPERTY_BOUND`. Setting a variable with the
same key and type again makes them follow it again.

```typescript
remove(key: string, options?: VariableOptions | null): void
```

**Parameters:**
- `key` - The variable's key to remove.
- `options` - The layer to remove from. By default, and with the target `'Default'`, the variable goes with
its value in every value set. A value set target removes only the value of that set.

### createValueSet()

Create an empty value set in the scene. Experimental: this API may change in a minor release.
A value set holds alternative values for some scene variables; write them with the target
`{ valueSet: id }`. The scene saves its sets, and undo reverts their changes.

```typescript
createValueSet(name: string): ValueSetId
```

**Parameters:**
- `name` - The name of the set. It must be unique among the sets of the scene, must not be empty, and must not
start or end with whitespace.

**Returns:** The id of the new set. The scene saves it, so it stays the same across saves and loads.

### destroyValueSet()

Destroy a value set and its values. Experimental: this API may change in a minor release.
When the set is active, no set is active afterwards, and text and bound properties show the
default values again.

```typescript
destroyValueSet(set: ValueSetId): void
```

**Parameters:**
- `set` - The id of the set.

### setValueSetName()

Rename a value set. Experimental: this API may change in a minor release.
The id stays, and an active set stays active.

```typescript
setValueSetName(set: ValueSetId, name: string): void
```

**Parameters:**
- `set` - The id of the set.
- `name` - The new name, valid as for `createValueSet`.

### getValueSetName()

Get the name of a value set. Experimental: this API may change in a minor release.

```typescript
getValueSetName(set: ValueSetId): string
```

**Parameters:**
- `set` - The id of the set.

**Returns:** The name of the set.

### findAllValueSets()

Get the value sets of the scene. Experimental: this API may change in a minor release.

```typescript
findAllValueSets(): ValueSetId[]
```

**Returns:** The ids of the sets in creation order, empty when no scene exists.

### findValueSetByName()

Find a value set by its name. Experimental: this API may change in a minor release.
```javascript
const german = engine.variable.findValueSetByName('Deutsch');
```

```typescript
findValueSetByName(name: string): ValueSetId | null
```

**Parameters:**
- `name` - The name of the set.

**Returns:** The id, or null when no set of the scene has this name or no scene exists.

### setActiveValueSet()

Activate a value set, or no set. Experimental: this API may change in a minor release.
The values of the active set win over the default values in text, bound properties and
getters. Exports show the active set, as the canvas does. A scene has one active set and saves
it. Undo reverts the change.

```typescript
setActiveValueSet(set: ValueSetId | null): void
```

**Parameters:**
- `set` - The id of the set, or null to show the default values.

### getActiveValueSet()

Get the active value set. Experimental: this API may change in a minor release.

```typescript
getActiveValueSet(): ValueSetId | null
```

**Returns:** The id of the active set, or null when no set is active or no scene exists.

### rename()

Rename a variable of any type. Experimental: this API may change in a minor release.
The value, the type and the values in every value set move to the new key. Every block
property bound to the variable follows the new key and keeps its value. For a text variable,
every `{{key}}` token in text blocks and page titles is rewritten too. A key inside a longer
expression or a statement, such as `{% if key %}`, is not renamed.
```javascript
engine.variable.rename('accent', 'brand/accent');
```

```typescript
rename(from: string, to: string): void
```

**Parameters:**
- `from` - The current key of the variable.
- `to` - The new key. It must not be empty, start or end with whitespace, contain `{{` or `}}`, name
another variable, or be reserved: `scene_root` and keys that start with `ubq.`.

### setColor()

Set a color variable's value. Experimental: this API may change in a minor release.
Creates a new variable if the key doesn't exist. Every block property bound to the
variable takes the color that the scene shows. If a bound property rejects the value, the call throws
its error, but the variable and the other bound properties change anyway.
A new key must not be empty, start or end with whitespace, contain `{{` or `}}`, or be reserved:
`scene_root` and keys that start with `ubq.`.

```typescript
setColor(key: string, value: Color, options?: VariableOptions | null): void
```

**Parameters:**
- `key` - The variable's key.
- `value` - The color to assign to the variable.
- `options` - The layer to write. By default the active value set when it holds the key, else the default value.

### getColor()

Get a color variable's value. Experimental: this API may change in a minor release.

```typescript
getColor(key: string, options?: VariableOptions | null): Color
```

**Parameters:**
- `key` - The variable's key.
- `options` - The layer to read. By default the value that the scene shows.

**Returns:** The color value of the variable.

### setNumber()

Set a number variable's value. Experimental: this API may change in a minor release.
Creates a new variable if the key doesn't exist. Every block property bound to the
variable takes the number that the scene shows. If a bound property rejects the value, the call throws
its error, but the variable and the other bound properties change anyway.
A new key must not be empty, start or end with whitespace, contain `{{` or `}}`, or be reserved:
`scene_root` and keys that start with `ubq.`.

```typescript
setNumber(key: string, value: number, options?: VariableOptions | null): void
```

**Parameters:**
- `key` - The variable's key.
- `value` - The finite number to assign to the variable.
- `options` - The layer to write. By default the active value set when it holds the key, else the default value.

### getNumber()

Get a number variable's value. Experimental: this API may change in a minor release.

```typescript
getNumber(key: string, options?: VariableOptions | null): number
```

**Parameters:**
- `key` - The variable's key.
- `options` - The layer to read. By default the value that the scene shows.

**Returns:** The number value of the variable.

### setImage()

Set an image variable's URI. Experimental: this API may change in a minor release.
Creates a new variable if the key doesn't exist. Every block property bound to the
variable takes the URI that the scene shows. If a bound property rejects the value, the call throws
its error, but the variable and the other bound properties change anyway.
A new key must not be empty, start or end with whitespace, contain `{{` or `}}`, or be reserved:
`scene_root` and keys that start with `ubq.`.

```typescript
setImage(key: string, uri: string, options?: VariableOptions | null): void
```

**Parameters:**
- `key` - The variable's key.
- `uri` - The URI of the image.
- `options` - The layer to write. By default the active value set when it holds the key, else the default value.

### getImage()

Get an image variable's URI. Experimental: this API may change in a minor release.

```typescript
getImage(key: string, options?: VariableOptions | null): string
```

**Parameters:**
- `key` - The variable's key.
- `options` - The layer to read. By default the value that the scene shows.

**Returns:** The URI of the image.

### setTypeface()

Set a typeface variable's value. Experimental: this API may change in a minor release.
Creates a new variable if the key doesn't exist. Every text block whose typeface is bound
to the variable takes the typeface that the scene shows, over its whole text. Bold and italic text keeps its
formatting where the typeface supports it. If a bound property rejects the value, the call
throws its error, but the variable and the other bound properties change anyway.
```javascript
engine.variable.setTypeface('heading', typeface);
engine.block.setVariableBinding(text, 'text/typeface', 'heading');
```
A new key must not be empty, start or end with whitespace, contain `{{` or `}}`, or be reserved:
`scene_root` and keys that start with `ubq.`.

```typescript
setTypeface(key: string, typeface: Typeface, options?: VariableOptions | null): void
```

**Parameters:**
- `key` - The variable's key.
- `typeface` - The typeface. It needs a name and at least one font.
- `options` - The layer to write. By default the active value set when it holds the key, else the default value.

### getTypeface()

Get a typeface variable's value. Experimental: this API may change in a minor release.

```typescript
getTypeface(key: string, options?: VariableOptions | null): Typeface
```

**Parameters:**
- `key` - The variable's key.
- `options` - The layer to read. By default the value that the scene shows.

**Returns:** The typeface of the variable.

### getType()

Get the type of a variable. Experimental: this API may change in a minor release.

```typescript
getType(key: string, options?: VariableOptions | null): VariableType
```

**Parameters:**
- `key` - The variable's key.
- `options` - The layer to read. By default the value that the scene shows.

**Returns:** The variable's type.

### findAllOfType()

Get the keys of all variables of one type, of the scene or of the variables that wait for a scene.
Experimental: this API may change in a minor release.
`findAll` returns only text variables.

```typescript
findAllOfType(type: VariableType): string[]
```

**Parameters:**
- `type` - The type of the variables.

**Returns:** List of variable keys.

---

For complete type definitions, see the [CE.SDK TypeScript API Reference](https://img.ly/docs/cesdk/engine/api/).