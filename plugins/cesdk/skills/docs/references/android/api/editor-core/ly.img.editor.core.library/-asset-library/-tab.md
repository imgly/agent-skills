# Tab

- **Module:** `ly.img:editor-core`
- **Package:** `ly.img.editor.core.library`

Predefined tabs that can be displayed in the asset library.

```kotlin
enum Tab : Enum<AssetLibrary.Tab>
```


## Members

### AUDIOS

```kotlin
enum entry AUDIOS
```

### ELEMENTS

```kotlin
enum entry ELEMENTS
```

### IMAGES

```kotlin
enum entry IMAGES
```

### SHAPES

```kotlin
enum entry SHAPES
```

### STICKERS

```kotlin
enum entry STICKERS
```

### TEXT

```kotlin
enum entry TEXT
```

### VIDEOS

```kotlin
enum entry VIDEOS
```

### entries

```kotlin
val entries: EnumEntries<AssetLibrary.Tab>
```

Returns a representation of an immutable list of all enum entries, in the order they're declared. This method may be used to iterate over the enum entries.

### valueOf

```kotlin
fun valueOf(value: String): AssetLibrary.Tab
```

Returns the enum constant of this type with the specified name. The string must match exactly an identifier used to declare an enum constant in this type. (Extraneous whitespace characters are not permitted.)

### values

```kotlin
fun values(): Array<AssetLibrary.Tab>
```

Returns an array containing the constants of this enum type, in the order they're declared. This method may be used to iterate over the constants.
