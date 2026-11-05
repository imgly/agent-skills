# ProfileRole

- **Module:** `ly.img:engine`
- **Package:** `ly.img.engine`

The role of a document color profile.

```kotlin
enum ProfileRole : Enum<ProfileRole>
```


## Members

### DEFAULT

```kotlin
enum entry DEFAULT
```

### OUTPUT

```kotlin
enum entry OUTPUT
```

### entries

```kotlin
val entries: EnumEntries<ProfileRole>
```

Returns a representation of an immutable list of all enum entries, in the order they're declared. This method may be used to iterate over the enum entries.

### valueOf

```kotlin
fun valueOf(value: String): ProfileRole
```

Returns the enum constant of this type with the specified name. The string must match exactly an identifier used to declare an enum constant in this type. (Extraneous whitespace characters are not permitted.)

### values

```kotlin
fun values(): Array<ProfileRole>
```

Returns an array containing the constants of this enum type, in the order they're declared. This method may be used to iterate over the constants.
