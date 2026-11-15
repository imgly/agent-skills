# FileSupportUse

- **Module:** `ly.img:engine`
- **Package:** `ly.img.engine`

Engine support for one media use at the reported inspection level.

```kotlin
data class FileSupportUse(val kind: String, val status: String, val reason: String)
```


## Members

### FileSupportUse

```kotlin
constructor(kind: String, status: String, reason: String)
```

### kind

```kotlin
val kind: String
```

Image fill, audio, or video: "image", "audio", or "video".

### reason

```kotlin
val reason: String
```

Empty when supported; otherwise a machine-readable reason.

### status

```kotlin
val status: String
```

"supported", "unsupported", "unchecked", or "pending".
