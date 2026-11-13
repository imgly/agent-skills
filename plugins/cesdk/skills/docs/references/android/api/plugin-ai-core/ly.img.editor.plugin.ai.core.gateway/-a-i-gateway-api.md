# AIGatewayApi

- **Module:** `ly.img:plugin-ai-core`
- **Package:** `ly.img.editor.plugin.ai.core.gateway`

IMG.LY AI Gateway client. Speaks to https://gateway.img.ly directly via OkHttp. Handles both text-to-image and image-to-image by switching the model id based on whether the request carries a source image.

```kotlin
class AIGatewayApi(val config: AIGatewayConfig)
```


## Members

### AIGatewayApi

```kotlin
constructor(config: AIGatewayConfig)
```

### config

```kotlin
val config: AIGatewayConfig
```

### generateImage

```kotlin
suspend fun generateImage(prompt: String, style: AIGatewayPromptStyle? = null, imageSize: Map<String, Int>? = null, inputImageUri: String = "", context: Context): List<String>
```

Generate an image. Uses the text-to-image model when inputImageUri is empty; otherwise uses the image-to-image model and uploads the source image first if it's a local URI. Returns a list of generated image URLs (currently always size 1, matching the gateway's single-output response shape).
