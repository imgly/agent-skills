# Mode

- **Module:** `ly.img:editor-core`
- **Package:** `ly.img.editor.core.library.data`

Current permission mode for gallery access. - UNDECIDED: No decision yet; UI should ask for permission when needed. - ALL: Full media access granted. - SELECTED: Limited access to user-selected items. - DENIED: Access denied; UI should surface a permission prompt.

```kotlin
enum Mode : Enum<SystemGalleryPermission.Mode>
```


## Members

### ALL

```kotlin
enum entry ALL
```

### DENIED

```kotlin
enum entry DENIED
```

### SELECTED

```kotlin
enum entry SELECTED
```

### UNDECIDED

```kotlin
enum entry UNDECIDED
```

### entries

```kotlin
val entries: EnumEntries<SystemGalleryPermission.Mode>
```

Returns a representation of an immutable list of all enum entries, in the order they're declared. This method may be used to iterate over the enum entries.

### valueOf

```kotlin
fun valueOf(value: String): SystemGalleryPermission.Mode
```

Returns the enum constant of this type with the specified name. The string must match exactly an identifier used to declare an enum constant in this type. (Extraneous whitespace characters are not permitted.)

### values

```kotlin
fun values(): Array<SystemGalleryPermission.Mode>
```

Returns an array containing the constants of this enum type, in the order they're declared. This method may be used to iterate over the constants.
