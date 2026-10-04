# FileLoader

- **Module:** `ly.img:plugin-background-removal`
- **Package:** `ly.img.editor.plugin.backgroundRemoval.util`

```kotlin
object FileLoader
```


## Members

### loadUri

```kotlin
suspend fun loadUri(context: Context, uri: Uri, httpClient: OkHttpClient): InputStream
```

Loads uri into an InputStream.
