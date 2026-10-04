# SheetValue

- **Module:** `ly.img:editor-core`
- **Package:** `ly.img.editor.core.sheet`

Possible values of SheetState.

```kotlin
enum SheetValue : Enum<SheetValue>
```


## Members

### Expanded

```kotlin
enum entry Expanded
```

The bottom sheet is visible at full height.

### HalfExpanded

```kotlin
enum entry HalfExpanded
```

The bottom sheet is partially visible at 50% of the screen height. This state is only enabled if the height of the bottom sheet is more than 50% of the screen height.

### Hidden

```kotlin
enum entry Hidden
```

The bottom sheet is not visible.

### entries

```kotlin
val entries: EnumEntries<SheetValue>
```

Returns a representation of an immutable list of all enum entries, in the order they're declared. This method may be used to iterate over the enum entries.

### valueOf

```kotlin
fun valueOf(value: String): SheetValue
```

Returns the enum constant of this type with the specified name. The string must match exactly an identifier used to declare an enum constant in this type. (Extraneous whitespace characters are not permitted.)

### values

```kotlin
fun values(): Array<SheetValue>
```

Returns an array containing the constants of this enum type, in the order they're declared. This method may be used to iterate over the constants.
