# IMGLYBackgroundRemovalConfig

- **Module:** `ly.img:plugin-background-removal-imgly`
- **Package:** `ly.img.editor.plugin.backgroundRemoval`

Uses IMG.LY's ONNX Runtime based background removal implementation.

```kotlin
data class IMGLYBackgroundRemovalConfig(val model: IMGLYBackgroundRemovalConfig.Model = Model.FP16, val modelBaseUri: Uri = "https://staticimgly.com/imgly/plugin-mobile-background-removal/1.0.0".toUri(), val loadMode: IMGLYBackgroundRemovalConfig.LoadMode = LoadMode.EAGER, val httpClient: OkHttpClient = OkHttpClient.Builder() .connectTimeout(15, TimeUnit.SECONDS) .readTimeout(120, TimeUnit.SECONDS) .writeTimeout(120, TimeUnit.SECONDS) .build()) : BackgroundRemovalConfig
```


## Members

### IMGLYBackgroundRemovalConfig

```kotlin
constructor(model: IMGLYBackgroundRemovalConfig.Model = Model.FP16, modelBaseUri: Uri = "https://staticimgly.com/imgly/plugin-mobile-background-removal/1.0.0".toUri(), loadMode: IMGLYBackgroundRemovalConfig.LoadMode = LoadMode.EAGER, httpClient: OkHttpClient = OkHttpClient.Builder() .connectTimeout(15, TimeUnit.SECONDS) .readTimeout(120, TimeUnit.SECONDS) .writeTimeout(120, TimeUnit.SECONDS) .build())
```

### httpClient

```kotlin
open override val httpClient: OkHttpClient
```

Makes network calls.

### loadMode

```kotlin
val loadMode: IMGLYBackgroundRemovalConfig.LoadMode
```

Controls when the model is downloaded and loaded into memory.

### modelBaseUri

```kotlin
val modelBaseUri: Uri
```

Base URI used to resolve model assets.

### model

```kotlin
val model: IMGLYBackgroundRemovalConfig.Model
```

The model variant used for segmentation.

### remover

```kotlin
open override val remover: BackgroundRemover<*>
```

IMG.LY ONNX Runtime remover configured by this instance.
