# VariableApi

- **Module:** `ly.img:engine`
- **Package:** `ly.img.engine`

```kotlin
interface VariableApi
```


## Members

### createValueSet

```kotlin
abstract fun createValueSet(name: String): ValueSetId
```

Create an empty value set in the scene. A value set holds alternative values for some scene variables. Write them with the target parameter of the setters. The scene saves its sets, and undo reverts their changes. Experimental: this API may change in a minor release.

### destroyValueSet

```kotlin
abstract fun destroyValueSet(set: ValueSetId)
```

Destroy a value set and its values. When the set is active, no set is active afterwards, and text and bound properties show the default values again. Experimental: this API may change in a minor release.

### findAllOfType

```kotlin
abstract fun findAllOfType(type: VariableType): List<String>
```

Get all variables of one type. Note that findAll returns only text variables. Experimental: this API may change in a minor release.

### findAllValueSets

```kotlin
abstract fun findAllValueSets(): List<ValueSetId>
```

Get the value sets of the scene. Experimental: this API may change in a minor release.

### findAll

```kotlin
abstract fun findAll(): List<String>
```

Get all text variables of the scene, or of the variables that wait for a scene.

### findValueSetByName

```kotlin
abstract fun findValueSetByName(name: String): ValueSetId?
```

Find a value set by its name. Experimental: this API may change in a minor release.

### getActiveValueSet

```kotlin
abstract fun getActiveValueSet(): ValueSetId?
```

Get the active value set. Experimental: this API may change in a minor release.

### getColor

```kotlin
abstract fun getColor(key: String, target: VariableTarget?): Color
```

```kotlin
open fun getColor(key: String): Color
```

Get a color variable. Experimental: this API may change in a minor release.

### getImage

```kotlin
abstract fun getImage(key: String, target: VariableTarget?): String
```

```kotlin
open fun getImage(key: String): String
```

Get an image variable. Experimental: this API may change in a minor release.

### getNumber

```kotlin
abstract fun getNumber(key: String, target: VariableTarget?): Float
```

```kotlin
open fun getNumber(key: String): Float
```

Get a number variable. Experimental: this API may change in a minor release.

### getType

```kotlin
abstract fun getType(key: String, target: VariableTarget?): VariableType
```

```kotlin
open fun getType(key: String): VariableType
```

Get the type of a variable. Experimental: this API may change in a minor release.

### getTypeface

```kotlin
abstract fun getTypeface(key: String, target: VariableTarget?): Typeface
```

```kotlin
open fun getTypeface(key: String): Typeface
```

Get a typeface variable. Experimental: this API may change in a minor release.

### getValueSetName

```kotlin
abstract fun getValueSetName(set: ValueSetId): String
```

Get the name of a value set. Experimental: this API may change in a minor release.

### get

```kotlin
abstract fun get(key: String, target: VariableTarget?): String
```

```kotlin
open fun get(key: String): String
```

Get a text variable.

### remove

```kotlin
abstract fun remove(key: String, target: VariableTarget?)
```

```kotlin
open fun remove(key: String)
```

Destroy a variable of any type. Bound properties keep their last value and their binding, so direct writes to them still fail with BLOCK.PROPERTY_BOUND. Setting a variable with the same key and type again makes them follow it again.

### rename

```kotlin
abstract fun rename(from: String, to: String)
```

Rename a variable of any type. The value, the type and the values in every value set move to the new key. Every block property bound to the variable follows the new key and keeps its value. For a text variable, every {{key}} token in text blocks and page titles is rewritten too. A key inside a longer expression or a statement, such as {% if key %}, is not renamed. Experimental: this API may change in a minor release.

### setActiveValueSet

```kotlin
abstract fun setActiveValueSet(set: ValueSetId?)
```

Activate a value set, or no set. The values of the active set win over the default values in text, bound properties and getters. Exports show the active set, as the canvas does. A scene has one active set, and saves it. Undo reverts the change. Experimental: this API may change in a minor release.

### setColor

```kotlin
abstract fun setColor(key: String, value: Color, target: VariableTarget?)
```

```kotlin
open fun setColor(key: String, value: Color)
```

Set a color variable. Creates the variable if no variable has this key. Every block property bound to the variable takes the value that the scene shows. If a bound property rejects the value, the call throws its error, but the variable and the other bound properties change anyway. Experimental: this API may change in a minor release.

### setImage

```kotlin
abstract fun setImage(key: String, uri: String, target: VariableTarget?)
```

```kotlin
open fun setImage(key: String, uri: String)
```

Set an image variable. Creates the variable if no variable has this key. Every block property bound to the variable takes the URI that the scene shows. If a bound property rejects the value, the call throws its error, but the variable and the other bound properties change anyway. Experimental: this API may change in a minor release.

### setNumber

```kotlin
abstract fun setNumber(key: String, value: Float, target: VariableTarget?)
```

```kotlin
open fun setNumber(key: String, value: Float)
```

Set a number variable. Creates the variable if no variable has this key. Every block property bound to the variable takes the value that the scene shows. If a bound property rejects the value, the call throws its error, but the variable and the other bound properties change anyway. Experimental: this API may change in a minor release.

### setTypeface

```kotlin
abstract fun setTypeface(key: String, typeface: Typeface, target: VariableTarget?)
```

```kotlin
open fun setTypeface(key: String, typeface: Typeface)
```

Set a typeface variable. Creates the variable if no variable has this key. Every text block whose typeface is bound to the variable takes the typeface that the scene shows, over its whole text. Bold and italic text keeps its formatting where the typeface supports it. If a bound property rejects the value, the call throws its error, but the variable and the other bound properties change anyway. Experimental: this API may change in a minor release.

### setValueSetName

```kotlin
abstract fun setValueSetName(set: ValueSetId, name: String)
```

Rename a value set. The id stays, and an active set stays active. Experimental: this API may change in a minor release.

### set

```kotlin
abstract fun set(key: String, value: String, target: VariableTarget?)
```

```kotlin
open fun set(key: String, value: String)
```

Set a text variable. The key must not be "scene_root" or start with "ubq.", because those name the built-in placeholders. The scene saves its variables, and undo reverts their changes. A variable set while no scene exists waits for the next scene. That scene takes it when it is created or loaded, as this setter without a target writes it. A value of another type than the loaded variable is dropped.
