# DemoAssetSource

- **Module:** `ly.img:engine`
- **Package:** `ly.img.engine`

```kotlin
enum DemoAssetSource : Enum<DemoAssetSource>
```
> **Deprecated:** Uses legacy v3-era demo asset source IDs and will be removed in a future version. Register sources by raw string ID via Engine.asset.addLocalSourceFromJSON(contentUri) instead.


## Members

### AUDIO

```kotlin
enum entry AUDIO
```

### AUDIO_UPLOAD

```kotlin
enum entry AUDIO_UPLOAD
```

### IMAGE

```kotlin
enum entry IMAGE
```

### IMAGE_UPLOAD

```kotlin
enum entry IMAGE_UPLOAD
```

### TEXT_COMPONENTS

```kotlin
enum entry TEXT_COMPONENTS
```

### VIDEO

```kotlin
enum entry VIDEO
```

### VIDEO_UPLOAD

```kotlin
enum entry VIDEO_UPLOAD
```

### entries

```kotlin
val entries: EnumEntries<DemoAssetSource>
```

Returns a representation of an immutable list of all enum entries, in the order they're declared. This method may be used to iterate over the enum entries.

### key

```kotlin
val key: String
```

### valueOf

```kotlin
fun valueOf(value: String): DemoAssetSource
```

Returns the enum constant of this type with the specified name. The string must match exactly an identifier used to declare an enum constant in this type. (Extraneous whitespace characters are not permitted.)

### values

```kotlin
fun values(): Array<DemoAssetSource>
```

Returns an array containing the constants of this enum type, in the order they're declared. This method may be used to iterate over the constants.
