# FileSupport

- **Module:** `ly.img:engine`
- **Package:** `ly.img.engine`

Engine media support; external editable-design importers remain host registrations.

```kotlin
data class FileSupport(val mimeType: String, val extensions: List<String>, val inspection: String, val uses: List<FileSupportUse>)
```


## Members

### FileSupport

```kotlin
constructor(mimeType: String, extensions: List<String>, inspection: String, uses: List<FileSupportUse>)
```

### extensions

```kotlin
val extensions: List<String>
```

Extensions of the engine media path, without dots.

### inspection

```kotlin
val inspection: String
```

"format" for the runtime catalog; "metadata" after header/container inspection.

### mimeType

```kotlin
val mimeType: String
```

Recognized MIME type, or "unknown".

### uses

```kotlin
val uses: List<FileSupportUse>
```

Image, audio, and video results, in that order. No result guarantees a complete decode.
