# GoogleBackgroundRemovalConfig

- **Module:** `ly.img:plugin-background-removal-google`
- **Package:** `ly.img.editor.plugin.backgroundRemoval`

Uses Google's on-device background segmentation implementation.

```kotlin
data class GoogleBackgroundRemovalConfig(val httpClient: OkHttpClient = OkHttpClient.Builder() .connectTimeout(15, TimeUnit.SECONDS) .readTimeout(120, TimeUnit.SECONDS) .writeTimeout(120, TimeUnit.SECONDS) .build()) : BackgroundRemovalConfig
```


## Members

### GoogleBackgroundRemovalConfig

```kotlin
constructor(httpClient: OkHttpClient = OkHttpClient.Builder() .connectTimeout(15, TimeUnit.SECONDS) .readTimeout(120, TimeUnit.SECONDS) .writeTimeout(120, TimeUnit.SECONDS) .build())
```

### httpClient

```kotlin
open override val httpClient: OkHttpClient
```

Makes network calls.

### remover

```kotlin
open override val remover: BackgroundRemover<*>
```

Google ML Kit remover configured by this instance.
