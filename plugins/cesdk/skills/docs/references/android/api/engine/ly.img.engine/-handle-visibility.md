# HandleVisibility

- **Module:** `ly.img:engine`
- **Package:** `ly.img.engine`

When a transform handle is shown: by the default rules, always (including while editing text), or never. always does not apply in crop edit mode, which has its own handles.

```kotlin
enum HandleVisibility : Enum<HandleVisibility>
```


## Members

### ALWAYS

```kotlin
enum entry ALWAYS
```

### AUTO

```kotlin
enum entry AUTO
```

### NEVER

```kotlin
enum entry NEVER
```

### entries

```kotlin
val entries: EnumEntries<HandleVisibility>
```

Returns a representation of an immutable list of all enum entries, in the order they're declared. This method may be used to iterate over the enum entries.

### valueOf

```kotlin
fun valueOf(value: String): HandleVisibility
```

Returns the enum constant of this type with the specified name. The string must match exactly an identifier used to declare an enum constant in this type. (Extraneous whitespace characters are not permitted.)

### value

```kotlin
val value: String
```

### values

```kotlin
fun values(): Array<HandleVisibility>
```

Returns an array containing the constants of this enum type, in the order they're declared. This method may be used to iterate over the constants.
