# PropertyType

- **Module:** `ly.img:engine`
- **Package:** `ly.img.engine`

```kotlin
enum PropertyType : Enum<PropertyType>
```


## Members

### BOOL

```kotlin
enum entry BOOL
```

### COLOR

```kotlin
enum entry COLOR
```

### DOUBLE

```kotlin
enum entry DOUBLE
```

### ENUM

```kotlin
enum entry ENUM
```

### FLOAT

```kotlin
enum entry FLOAT
```

### INT

```kotlin
enum entry INT
```

### SOURCESET

```kotlin
enum entry SOURCESET
```

### STRING

```kotlin
enum entry STRING
```

### STRUCT

```kotlin
enum entry STRUCT
```

### entries

```kotlin
val entries: EnumEntries<PropertyType>
```

Returns a representation of an immutable list of all enum entries, in the order they're declared. This method may be used to iterate over the enum entries.

### valueOf

```kotlin
fun valueOf(value: String): PropertyType
```

Returns the enum constant of this type with the specified name. The string must match exactly an identifier used to declare an enum constant in this type. (Extraneous whitespace characters are not permitted.)

### values

```kotlin
fun values(): Array<PropertyType>
```

Returns an array containing the constants of this enum type, in the order they're declared. This method may be used to iterate over the constants.
