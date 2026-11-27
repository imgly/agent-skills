# NewerFormat

- **Module:** `ly.img:engine`
- **Package:** `ly.img.engine`

A loaded scene or block string that names a newer format than this engine reads without loss.

```kotlin
data class NewerFormat(val kind: String, val minReaderVersion: String, val engineVersion: String)
```


## Members

### NewerFormat

```kotlin
constructor(kind: String, minReaderVersion: String, engineVersion: String)
```

### engineVersion

```kotlin
val engineVersion: String
```

The newest format version of the same kind that this engine reads.

### kind

```kotlin
val kind: String
```

What was loaded: "scene" or "blocks".

### minReaderVersion

```kotlin
val minReaderVersion: String
```

The oldest format version that reads the content without loss, as the loaded string names it.
