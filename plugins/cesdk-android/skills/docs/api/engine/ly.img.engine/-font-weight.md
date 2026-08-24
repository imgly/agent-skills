# FontWeight

- **Module:** `ly.img:engine`
- **Package:** `ly.img.engine`

```kotlin
enum FontWeight : Enum<FontWeight>
```


## Members

### BOLD

```kotlin
enum entry BOLD
```

### EXTRA_BOLD

```kotlin
enum entry EXTRA_BOLD
```

### EXTRA_LIGHT

```kotlin
enum entry EXTRA_LIGHT
```

### HEAVY

```kotlin
enum entry HEAVY
```

### LIGHT

```kotlin
enum entry LIGHT
```

### MEDIUM

```kotlin
enum entry MEDIUM
```

### NORMAL

```kotlin
enum entry NORMAL
```

### SEMI_BOLD

```kotlin
enum entry SEMI_BOLD
```

### THIN

```kotlin
enum entry THIN
```

### entries

```kotlin
val entries: EnumEntries<FontWeight>
```

Returns a representation of an immutable list of all enum entries, in the order they're declared. This method may be used to iterate over the enum entries.

### valueOf

```kotlin
fun valueOf(value: String): FontWeight
```

Returns the enum constant of this type with the specified name. The string must match exactly an identifier used to declare an enum constant in this type. (Extraneous whitespace characters are not permitted.)

### value

```kotlin
val value: Int
```

### values

```kotlin
fun values(): Array<FontWeight>
```

Returns an array containing the constants of this enum type, in the order they're declared. This method may be used to iterate over the constants.
