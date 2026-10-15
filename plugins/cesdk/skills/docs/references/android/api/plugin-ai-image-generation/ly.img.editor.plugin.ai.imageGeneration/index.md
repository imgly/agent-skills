# ly.img.editor.plugin.ai.imageGeneration

- **Module:** `ly.img:plugin-ai-image-generation`
- **Package:** `ly.img.editor.plugin.ai.imageGeneration`
- **Module catalog:** [`ly.img:plugin-ai-image-generation`](<../../indexes/plugin-ai-image-generation.md>)

## Top-level declarations

### rememberAIImageGeneration

```kotlin
@Composable
fun Dock.Button.rememberAIImageGeneration(aiGatewayConfig: AIGatewayConfig, builder: Dock.ButtonBuilder.() -> Unit = {}): Button<Dock.ItemScope>
```

```kotlin
@Composable
fun InspectorBar.Button.rememberAIImageGeneration(aiGatewayConfig: AIGatewayConfig, builder: InspectorBar.ButtonBuilder.() -> Unit = {}): Button<InspectorBar.ItemScope>
```

A composable helper function that creates and remembers a Dock.Button that opens a sheet with prompt input to generate an image.
