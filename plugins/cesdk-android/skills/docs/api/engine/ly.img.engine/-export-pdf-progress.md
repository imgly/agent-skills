# ExportPdfProgress

- **Module:** `ly.img:engine`
- **Package:** `ly.img.engine`

```kotlin
data class ExportPdfProgress(val exportedPages: Int, val totalPages: Int)
```


## Members

### ExportPdfProgress

```kotlin
constructor(exportedPages: Int, totalPages: Int)
```

### exportedPages

```kotlin
val exportedPages: Int
```

The number of pages exported so far.

### totalPages

```kotlin
val totalPages: Int
```

The total number of pages to export.
