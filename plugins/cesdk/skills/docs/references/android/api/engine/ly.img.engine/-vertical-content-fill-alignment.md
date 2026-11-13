# VerticalContentFillAlignment

- **Module:** `ly.img:engine`
- **Package:** `ly.img.engine`

Vertical alignment of the content fill inside the block. Applies when the content fill mode is ContentFillMode.CONTAIN or ContentFillMode.COVER. Has no effect in ContentFillMode.CROP.

```kotlin
enum VerticalContentFillAlignment : Enum<VerticalContentFillAlignment>
```


## Members

### BOTTOM

```kotlin
enum entry BOTTOM
```

Align the content to the bottom edge of the block.

### CENTER

```kotlin
enum entry CENTER
```

Center the content vertically.

### TOP

```kotlin
enum entry TOP
```

Align the content to the top edge of the block.

### entries

```kotlin
val entries: EnumEntries<VerticalContentFillAlignment>
```

Returns a representation of an immutable list of all enum entries, in the order they're declared. This method may be used to iterate over the enum entries.

### valueOf

```kotlin
fun valueOf(value: String): VerticalContentFillAlignment
```

Returns the enum constant of this type with the specified name. The string must match exactly an identifier used to declare an enum constant in this type. (Extraneous whitespace characters are not permitted.)

### values

```kotlin
fun values(): Array<VerticalContentFillAlignment>
```

Returns an array containing the constants of this enum type, in the order they're declared. This method may be used to iterate over the constants.
