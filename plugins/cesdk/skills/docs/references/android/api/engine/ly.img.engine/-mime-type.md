# MimeType

- **Module:** `ly.img:engine`
- **Package:** `ly.img.engine`

```kotlin
enum MimeType : Enum<MimeType>
```


## Members

### BINARY

```kotlin
enum entry BINARY
```

### JPEG

```kotlin
enum entry JPEG
```

### MP4

```kotlin
enum entry MP4
```

### PDF

```kotlin
enum entry PDF
```

### PNG

```kotlin
enum entry PNG
```

### SVG

```kotlin
enum entry SVG
```

### TGA

```kotlin
enum entry TGA
```

### entries

```kotlin
val entries: EnumEntries<MimeType>
```

Returns a representation of an immutable list of all enum entries, in the order they're declared. This method may be used to iterate over the enum entries.

### key

```kotlin
val key: String
```

### valueOf

```kotlin
fun valueOf(value: String): MimeType
```

Returns the enum constant of this type with the specified name. The string must match exactly an identifier used to declare an enum constant in this type. (Extraneous whitespace characters are not permitted.)

### values

```kotlin
fun values(): Array<MimeType>
```

Returns an array containing the constants of this enum type, in the order they're declared. This method may be used to iterate over the constants.
