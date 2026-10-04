# BackgroundRemovalConfig

- **Module:** `ly.img:plugin-background-removal`
- **Package:** `ly.img.editor.plugin.backgroundRemoval`

Configuration for the background removal plugin. Use one of the concrete implementations to choose which segmentation backend should remove image backgrounds.

```kotlin
interface BackgroundRemovalConfig
```


## Members

### httpClient

```kotlin
abstract val httpClient: OkHttpClient
```

HTTP client used to load input images and model assets.

### remover

```kotlin
abstract val remover: BackgroundRemover<*>
```

Backend implementation that produces segmentation masks for source images.
