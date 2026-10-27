# VariableApi

- **Module:** `ly.img:engine`
- **Package:** `ly.img.engine`

```kotlin
interface VariableApi
```


## Members

### findAllOfType

```kotlin
abstract fun findAllOfType(type: VariableType): List<String>
```

Get all variables of one type. Note that findAll returns only text variables. Experimental: this API may change in a minor release.

### findAll

```kotlin
abstract fun findAll(): List<String>
```

Get all text variables currently stored in the engine.

### getColor

```kotlin
abstract fun getColor(key: String): Color
```

Get a color variable. Experimental: this API may change in a minor release.

### getImage

```kotlin
abstract fun getImage(key: String): String
```

Get an image variable. Experimental: this API may change in a minor release.

### getNumber

```kotlin
abstract fun getNumber(key: String): Float
```

Get a number variable. Experimental: this API may change in a minor release.

### getType

```kotlin
abstract fun getType(key: String): VariableType
```

Get the type of a variable. Experimental: this API may change in a minor release.

### getTypeface

```kotlin
abstract fun getTypeface(key: String): Typeface
```

Get a typeface variable. Experimental: this API may change in a minor release.

### get

```kotlin
abstract fun get(key: String): String
```

Get a text variable.

### remove

```kotlin
abstract fun remove(key: String)
```

Destroy a variable of any type. Bound properties keep their last value and their binding, so direct writes to them still fail with BLOCK.PROPERTY_BOUND. Setting a variable with the same key and type again makes them follow it again.

### rename

```kotlin
abstract fun rename(from: String, to: String)
```

Rename a variable of any type. The value and the type move to the new key. Every block property bound to the variable follows the new key and keeps its value. For a text variable, every {{key}} token in text blocks is rewritten too. Experimental: this API may change in a minor release.

### setColor

```kotlin
abstract fun setColor(key: String, value: Color)
```

Set a color variable. Creates the variable if no variable has this key. Every block property bound to the variable takes the new value. If a bound property rejects the value, the call throws its error, but the variable and the other bound properties change anyway. Experimental: this API may change in a minor release.

### setImage

```kotlin
abstract fun setImage(key: String, uri: String)
```

Set an image variable. Creates the variable if no variable has this key. Every block property bound to the variable takes the new URI. If a bound property rejects the value, the call throws its error, but the variable and the other bound properties change anyway. Experimental: this API may change in a minor release.

### setNumber

```kotlin
abstract fun setNumber(key: String, value: Float)
```

Set a number variable. Creates the variable if no variable has this key. Every block property bound to the variable takes the new value. If a bound property rejects the value, the call throws its error, but the variable and the other bound properties change anyway. Experimental: this API may change in a minor release.

### setTypeface

```kotlin
abstract fun setTypeface(key: String, typeface: Typeface)
```

Set a typeface variable. Creates the variable if no variable has this key. Every text block whose typeface is bound to the variable takes the new typeface over its whole text. Bold and italic text keeps its formatting where the typeface supports it. If a bound property rejects the value, the call throws its error, but the variable and the other bound properties change anyway. Experimental: this API may change in a minor release.

### set

```kotlin
abstract fun set(key: String, value: String)
```

Set a text variable.
