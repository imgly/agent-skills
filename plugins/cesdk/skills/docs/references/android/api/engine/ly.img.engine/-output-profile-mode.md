# OutputProfileMode

- **Module:** `ly.img:engine`
- **Package:** `ly.img.engine`

What a PDF export does with the document's Output profile. See ExportOptions.outputProfileMode.

```kotlin
enum OutputProfileMode : Enum<OutputProfileMode>
```


## Members

### ASSIGN

```kotlin
enum entry ASSIGN
```

Keep the colors in the space of the Output profile and convert the others. ExportOptions.embedProfiles labels them with the Output profile.

### CONVERT

```kotlin
enum entry CONVERT
```

Convert every color into the Output profile.

### OFF

```kotlin
enum entry OFF
```

Write the colors as they are.

### entries

```kotlin
val entries: EnumEntries<OutputProfileMode>
```

Returns a representation of an immutable list of all enum entries, in the order they're declared. This method may be used to iterate over the enum entries.

### valueOf

```kotlin
fun valueOf(value: String): OutputProfileMode
```

Returns the enum constant of this type with the specified name. The string must match exactly an identifier used to declare an enum constant in this type. (Extraneous whitespace characters are not permitted.)

### value

```kotlin
val value: Int
```

### values

```kotlin
fun values(): Array<OutputProfileMode>
```

Returns an array containing the constants of this enum type, in the order they're declared. This method may be used to iterate over the constants.
