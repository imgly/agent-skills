# GptImage2

- **Module:** `ly.img:plugin-ai-core`
- **Package:** `ly.img.editor.plugin.ai.core.gateway`

GPT Image 2 by OpenAI. Schema: prompt, image_urls, format (anyOf<enum|CustomSize>), quality (low/medium/high, gateway picks the default). To expose quality in the UI, add it to the body here. - text-to-image: openai/gpt-image-2 - image-to-image: openai/gpt-image-2-edit

```kotlin
data object GptImage2 : AIGatewayImageModel
```


## Members

### buildInput

```kotlin
open override fun buildInput(prompt: String, size: Map<String, Int>?, imageUrls: List<String>?): JSONObject
```

Build the input payload for POST /v1/responses for this model. - prompt: the final prompt to send (already augmented with any selected AIGatewayPromptStyle.promptSnippet by the service). - size: optional { "width": Int, "height": Int } map. Models whose schema accepts CustomSize will receive this verbatim; for ratio-only models, override this to convert. - imageUrls: non-null/non-empty when an input image is present (image-to-image). The service has already uploaded local bytes via /v1/uploads and passes the resulting asset_url here.

### imageToImageId

```kotlin
open override val imageToImageId: String
```

### textToImageId

```kotlin
open override val textToImageId: String
```
