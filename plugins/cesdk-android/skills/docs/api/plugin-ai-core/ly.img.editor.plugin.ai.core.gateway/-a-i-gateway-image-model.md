# AIGatewayImageModel

- **Module:** `ly.img:plugin-ai-core`
- **Package:** `ly.img.editor.plugin.ai.core.gateway`

IMG.LY Gateway image model family. The showcase ships with FluxV2 and GptImage2 as worked examples — the same structure extends to any other model the gateway supports. Each case owns:

```kotlin
sealed class AIGatewayImageModel
```


## Members

### buildInput

```kotlin
abstract fun buildInput(prompt: String, size: Map<String, Int>?, imageUrls: List<String>?): JSONObject
```

Build the input payload for POST /v1/responses for this model. - prompt: the final prompt to send (already augmented with any selected AIGatewayPromptStyle.promptSnippet by the service). - size: optional { "width": Int, "height": Int } map. Models whose schema accepts CustomSize will receive this verbatim; for ratio-only models, override this to convert. - imageUrls: non-null/non-empty when an input image is present (image-to-image). The service has already uploaded local bytes via /v1/uploads and passes the resulting asset_url here.

### imageToImageId

```kotlin
abstract val imageToImageId: String
```

### textToImageId

```kotlin
abstract val textToImageId: String
```
