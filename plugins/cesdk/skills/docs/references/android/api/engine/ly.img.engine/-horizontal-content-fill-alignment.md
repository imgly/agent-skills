# HorizontalContentFillAlignment

- **Module:** `ly.img:engine`
- **Package:** `ly.img.engine`

Horizontal alignment of the content fill inside the block. Applies when the content fill mode is ContentFillMode.CONTAIN or ContentFillMode.COVER. Has no effect in ContentFillMode.CROP.

```kotlin
enum HorizontalContentFillAlignment : Enum<HorizontalContentFillAlignment>
```


## Members

### CENTER

```kotlin
enum entry CENTER
```

Center the content horizontally.

### LEFT

```kotlin
enum entry LEFT
```

Align the content to the left edge of the block.

### RIGHT

```kotlin
enum entry RIGHT
```

Align the content to the right edge of the block.

### entries

```kotlin
val entries: EnumEntries<HorizontalContentFillAlignment>
```

Returns a representation of an immutable list of all enum entries, in the order they're declared. This method may be used to iterate over the enum entries.

### valueOf

```kotlin
fun valueOf(value: String): HorizontalContentFillAlignment
```

Returns the enum constant of this type with the specified name. The string must match exactly an identifier used to declare an enum constant in this type. (Extraneous whitespace characters are not permitted.)

### values

```kotlin
fun values(): Array<HorizontalContentFillAlignment>
```

Returns an array containing the constants of this enum type, in the order they're declared. This method may be used to iterate over the constants.
