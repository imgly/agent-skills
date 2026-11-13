# AIGatewayConfig

- **Module:** `ly.img:plugin-ai-core`
- **Package:** `ly.img.editor.plugin.ai.core.gateway`

IMG.LY Gateway client config. Speaks to https://gateway.img.ly directly via OkHttp. Handles both text-to-image and image-to-image by switching the model id based on whether the request carries a source image.

```kotlin
class AIGatewayConfig(val apiKey: String, val model: AIGatewayImageModel = AIGatewayImageModel.FluxV2, val gatewayUrl: String = "https://gateway.img.ly", val httpClient: OkHttpClient = OkHttpClient.Builder() .connectTimeout(15, TimeUnit.SECONDS) .readTimeout(120, TimeUnit.SECONDS) .writeTimeout(120, TimeUnit.SECONDS) .build())
```


## Members

### AIGatewayConfig

```kotlin
constructor(apiKey: String, model: AIGatewayImageModel = AIGatewayImageModel.FluxV2, gatewayUrl: String = "https://gateway.img.ly", httpClient: OkHttpClient = OkHttpClient.Builder() .connectTimeout(15, TimeUnit.SECONDS) .readTimeout(120, TimeUnit.SECONDS) .writeTimeout(120, TimeUnit.SECONDS) .build())
```

### apiKey

```kotlin
val apiKey: String
```

### gatewayUrl

```kotlin
val gatewayUrl: String
```

### httpClient

```kotlin
val httpClient: OkHttpClient
```

### model

```kotlin
val model: AIGatewayImageModel
```
