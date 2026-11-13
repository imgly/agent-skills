# VariableType

- **Module:** `ly.img:engine`
- **Package:** `ly.img.engine`

The value type of a variable. One variable name holds one type. Experimental: this API may change in a minor release.

```kotlin
enum VariableType : Enum<VariableType>
```


## Members

### COLOR

```kotlin
enum entry COLOR
```

A color variable.

### IMAGE

```kotlin
enum entry IMAGE
```

An image variable that holds a URI.

### NUMBER

```kotlin
enum entry NUMBER
```

A number variable.

### STRING

```kotlin
enum entry STRING
```

A text variable, used by text templates.

### TYPEFACE

```kotlin
enum entry TYPEFACE
```

A typeface variable.

### entries

```kotlin
val entries: EnumEntries<VariableType>
```

Returns a representation of an immutable list of all enum entries, in the order they're declared. This method may be used to iterate over the enum entries.

### valueOf

```kotlin
fun valueOf(value: String): VariableType
```

Returns the enum constant of this type with the specified name. The string must match exactly an identifier used to declare an enum constant in this type. (Extraneous whitespace characters are not permitted.)

### values

```kotlin
fun values(): Array<VariableType>
```

Returns an array containing the constants of this enum type, in the order they're declared. This method may be used to iterate over the constants.
