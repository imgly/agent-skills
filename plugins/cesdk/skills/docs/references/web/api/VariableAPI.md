# VariableAPI

## Variable Management

Create, update, retrieve, and remove variables from the engine.

### findAll()

Get all text variable names currently stored in the engine.

```typescript
findAll(): string[]
```

**Returns:** List of variable names.

### setString()

Set a text variable's value.
Creates a new variable if the key doesn't exist, or updates an existing one.

```typescript
setString(key: string, value: string): void
```

**Parameters:**
- `key` - The variable's key.
- `value` - The text value to assign to the variable.

### getString()

Get a text variable's value.

```typescript
getString(key: string): string
```

**Parameters:**
- `key` - The variable's key.

**Returns:** The text value of the variable.

### remove()

Remove a variable of any type from the engine.
Bound properties keep their last value and their binding, so direct writes
to them still fail with `BLOCK.PROPERTY_BOUND`. Setting a variable with the
same key and type again makes them follow it again.

```typescript
remove(key: string): void
```

**Parameters:**
- `key` - The variable's key to remove.

### rename()

Rename a variable of any type. Experimental: this API may change in a minor release.
The value and the type move to the new key. Every block property bound to the variable
follows the new key and keeps its value. For a text variable, every `{{key}}` token in
text blocks is rewritten too.
```javascript
engine.variable.rename('accent', 'brand/accent');
```

```typescript
rename(from: string, to: string): void
```

**Parameters:**
- `from` - The current key of the variable.
- `to` - The new key. It must not be empty, start or end with whitespace, contain `{{` or `}}`, or
name another variable.

### setColor()

Set a color variable's value. Experimental: this API may change in a minor release.
Creates a new variable if the key doesn't exist. Every block property bound to the
variable takes the new color. If a bound property rejects the value, the call throws
its error, but the variable and the other bound properties change anyway.

```typescript
setColor(key: string, value: Color): void
```

**Parameters:**
- `key` - The variable's key.
- `value` - The color to assign to the variable.

### getColor()

Get a color variable's value. Experimental: this API may change in a minor release.

```typescript
getColor(key: string): Color
```

**Parameters:**
- `key` - The variable's key.

**Returns:** The color value of the variable.

### setNumber()

Set a number variable's value. Experimental: this API may change in a minor release.
Creates a new variable if the key doesn't exist. Every block property bound to the
variable takes the new number. If a bound property rejects the value, the call throws
its error, but the variable and the other bound properties change anyway.

```typescript
setNumber(key: string, value: number): void
```

**Parameters:**
- `key` - The variable's key.
- `value` - The finite number to assign to the variable.

### getNumber()

Get a number variable's value. Experimental: this API may change in a minor release.

```typescript
getNumber(key: string): number
```

**Parameters:**
- `key` - The variable's key.

**Returns:** The number value of the variable.

### setImage()

Set an image variable's URI. Experimental: this API may change in a minor release.
Creates a new variable if the key doesn't exist. Every block property bound to the
variable takes the new URI. If a bound property rejects the value, the call throws
its error, but the variable and the other bound properties change anyway.

```typescript
setImage(key: string, uri: string): void
```

**Parameters:**
- `key` - The variable's key.
- `uri` - The URI of the image.

### getImage()

Get an image variable's URI. Experimental: this API may change in a minor release.

```typescript
getImage(key: string): string
```

**Parameters:**
- `key` - The variable's key.

**Returns:** The URI of the image.

### setTypeface()

Set a typeface variable's value. Experimental: this API may change in a minor release.
Creates a new variable if the key doesn't exist. Every text block whose typeface is bound
to the variable takes the new typeface over its whole text. Bold and italic text keeps its
formatting where the typeface supports it. If a bound property rejects the value, the call
throws its error, but the variable and the other bound properties change anyway.
```javascript
engine.variable.setTypeface('heading', typeface);
engine.block.setVariableBinding(text, 'text/typeface', 'heading');
```

```typescript
setTypeface(key: string, typeface: Typeface): void
```

**Parameters:**
- `key` - The variable's key.
- `typeface` - The typeface. It needs a name and at least one font.

### getTypeface()

Get a typeface variable's value. Experimental: this API may change in a minor release.

```typescript
getTypeface(key: string): Typeface
```

**Parameters:**
- `key` - The variable's key.

**Returns:** The typeface of the variable.

### getType()

Get the type of a variable. Experimental: this API may change in a minor release.

```typescript
getType(key: string): VariableType
```

**Parameters:**
- `key` - The variable's key.

**Returns:** The variable's type.

### findAllOfType()

Get the keys of all variables of one type. Experimental: this API may change in a minor release.
`findAll` returns only text variables.

```typescript
findAllOfType(type: VariableType): string[]
```

**Parameters:**
- `type` - The type of the variables.

**Returns:** List of variable keys.

---

For complete type definitions, see the [CE.SDK TypeScript API Reference](https://img.ly/docs/cesdk/engine/api/).