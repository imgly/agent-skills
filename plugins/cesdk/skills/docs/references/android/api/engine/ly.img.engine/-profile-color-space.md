# ProfileColorSpace

- **Module:** `ly.img:engine`
- **Package:** `ly.img.engine`

The component space described by an ICC profile.

```kotlin
enum ProfileColorSpace : Enum<ProfileColorSpace>
```


## Members

### CMYK

```kotlin
enum entry CMYK
```

### GRAY

```kotlin
enum entry GRAY
```

### RGB

```kotlin
enum entry RGB
```

### entries

```kotlin
val entries: EnumEntries<ProfileColorSpace>
```

Returns a representation of an immutable list of all enum entries, in the order they're declared. This method may be used to iterate over the enum entries.

### valueOf

```kotlin
fun valueOf(value: String): ProfileColorSpace
```

Returns the enum constant of this type with the specified name. The string must match exactly an identifier used to declare an enum constant in this type. (Extraneous whitespace characters are not permitted.)

### values

```kotlin
fun values(): Array<ProfileColorSpace>
```

Returns an array containing the constants of this enum type, in the order they're declared. This method may be used to iterate over the constants.
