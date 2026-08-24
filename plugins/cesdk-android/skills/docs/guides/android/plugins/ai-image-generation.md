> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Plugins](../plugins.md) > [AI Image Generation](./ai-image-generation.md)

---

```kotlin file=@cesdk_android_examples/editor-guides-ai-image-generation/AIImageGenerationEditorSolution.kt reference-only
import androidx.compose.runtime.Composable
import ly.img.editor.Editor
import ly.img.editor.configuration.design.DesignConfigurationBuilder
import ly.img.editor.core.component.Dock
import ly.img.editor.core.component.InspectorBar
import ly.img.editor.core.configuration.EditorConfiguration
import ly.img.editor.core.configuration.remember
import ly.img.editor.core.configuration.then
import ly.img.editor.plugin.ai.core.gateway.AIGatewayConfig
import ly.img.editor.plugin.ai.core.gateway.AIGatewayImageModel
import ly.img.editor.plugin.ai.imageGeneration.AIImageGenerationPlugin
import ly.img.editor.plugin.ai.imageGeneration.rememberAIImageGeneration
import okhttp3.OkHttpClient
import java.util.concurrent.TimeUnit

// Add this composable to your NavHost.
@Composable
fun AIImageGenerationEditorSolution(
    license: String,
    aiGatewayApiKey: String,
    onClose: (Throwable?) -> Unit,
) {
    Editor(
        license = license,
        configuration = {
            EditorConfiguration
                .remember(::DesignConfigurationBuilder)
                .then(::AIImageGenerationPlugin) {
                    aiGatewayConfig = AIGatewayConfig(
                        apiKey = aiGatewayApiKey,
                    )
                }
        },
        onClose = onClose,
    )
}

@Composable
private fun AIImageGenerationEditorSolutionWithConfigurations(
    license: String,
    aiGatewayApiKey: String,
    onClose: (Throwable?) -> Unit,
) {
    Editor(
        license = license,
        configuration = {
            EditorConfiguration
                .remember(::DesignConfigurationBuilder)
                .then(::AIImageGenerationPlugin) {
                    aiGatewayConfig = AIGatewayConfig(apiKey = aiGatewayApiKey)
                    dockModifier = {
                        addFirst { Dock.Button.rememberAIImageGeneration(aiGatewayConfig = it) }
                    }
                    inspectorBarModifier = {
                        addFirst { InspectorBar.Button.rememberAIImageGeneration(aiGatewayConfig = it) }
                    }
                }
        },
        onClose = onClose,
    )
}

@Composable
private fun AIImageGenerationEditorSolutionWithGatewayConfig(
    license: String,
    aiGatewayApiKey: String,
    onClose: (Throwable?) -> Unit,
) {
    Editor(
        license = license,
        configuration = {
            EditorConfiguration
                .remember(::DesignConfigurationBuilder)
                .then(::AIImageGenerationPlugin) {
                    aiGatewayConfig = AIGatewayConfig(
                        apiKey = aiGatewayApiKey,
                        model = AIGatewayImageModel.GptImage2,
                        gatewayUrl = "https://gateway.img.ly",
                        httpClient = OkHttpClient.Builder()
                            .connectTimeout(15, TimeUnit.SECONDS)
                            .readTimeout(120, TimeUnit.SECONDS)
                            .writeTimeout(120, TimeUnit.SECONDS)
                            .build(),
                    )
                }
        },
        onClose = onClose,
    )
}

@Composable
private fun AIImageGenerationEditorSolutionWithButtonPlacement(
    license: String,
    aiGatewayApiKey: String,
    onClose: (Throwable?) -> Unit,
) {
    Editor(
        license = license,
        configuration = {
            EditorConfiguration
                .remember(::DesignConfigurationBuilder)
                .then(::AIImageGenerationPlugin) {
                    aiGatewayConfig = AIGatewayConfig(apiKey = aiGatewayApiKey)
                    dockModifier = {
                        addLast { Dock.Button.rememberAIImageGeneration(aiGatewayConfig = it) }
                    }
                    inspectorBarModifier = {
                        addLast { InspectorBar.Button.rememberAIImageGeneration(aiGatewayConfig = it) }
                    }
                }
        },
        onClose = onClose,
    )
}
```

Add AI-powered image generation to your editor so users can create visuals from text prompts or transform existing images.

![AI image generation in the Android editor](https://img.ly/docs/cesdk/android/plugins/ai-image-generation-aimg01/assets/android.hero.png)

> **Reading time:** 8 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-android-examples/tree/v1.81.0/editor-guides-ai-image-generation)

The `AIImageGenerationPlugin` adds two integration points to the editor: a dock button for text-to-image generation and an inspector bar button for image-to-image replacement. Both actions connect to the [IMG.LY Gateway](https://img.ly/dashboard) through `AIGatewayConfig`.

This guide builds on the [Design Editor Starter Kit](../starterkits/design-editor.md). The same plugin works with any editor configuration that hosts a dock and inspector bar.

## Prerequisites

You need an IMG.LY Gateway API key with access to the model family you want to use, such as FLUX.2 (`bfl/flux-2`) or GPT Image 2 (`openai/gpt-image-2`). The host app also needs network access to send generation requests and load the returned images.

> **Note:** You can acquire an API key at [img.ly/dashboard](https://img.ly/dashboard). Register, generate the API key and contact IMG.LY support to credit the balance for Gateway usage.

## Install the Plugin

Add the AI image generation plugin package to the module that hosts CE.SDK. The plugin includes the shared AI Gateway client.

```groovy
dependencies {
    implementation("ly.img:plugin-ai-image-generation:1.81.0")
}
```

## Use the Plugin

Import the editor configuration APIs, the plugin and the Gateway configuration types where you create your editor configuration:

```kotlin highlight-android-imports
import androidx.compose.runtime.Composable
import ly.img.editor.Editor
import ly.img.editor.configuration.design.DesignConfigurationBuilder
import ly.img.editor.core.component.Dock
import ly.img.editor.core.component.InspectorBar
import ly.img.editor.core.configuration.EditorConfiguration
import ly.img.editor.core.configuration.remember
import ly.img.editor.core.configuration.then
import ly.img.editor.plugin.ai.core.gateway.AIGatewayConfig
import ly.img.editor.plugin.ai.core.gateway.AIGatewayImageModel
import ly.img.editor.plugin.ai.imageGeneration.AIImageGenerationPlugin
import ly.img.editor.plugin.ai.imageGeneration.rememberAIImageGeneration
import okhttp3.OkHttpClient
import java.util.concurrent.TimeUnit
```

Register `AIImageGenerationPlugin` alongside your existing editor configuration and provide the Gateway API key:

```kotlin highlight-android-basic-setup
Editor(
    license = license,
    configuration = {
        EditorConfiguration
            .remember(::DesignConfigurationBuilder)
            .then(::AIImageGenerationPlugin) {
                aiGatewayConfig = AIGatewayConfig(
                    apiKey = aiGatewayApiKey,
                )
            }
    },
    onClose = onClose,
)
```

The plugin adds a “Generate” button to the dock and an “Edit” button to the inspector bar. The dock action creates a new image block from a prompt. The inspector action appears when the current selection is a non-sticker block with an image fill and replaces that image content.

> **Warning:** Image generation requires network access and a valid IMG.LY Gateway API key. Without both, generation requests fail with authentication or network errors.

## Configure the Plugin

The Android plugin exposes the Gateway configuration and modifiers for the two editor actions. This example shows all three options with their default button placements:

```kotlin highlight-android-configuration
Editor(
    license = license,
    configuration = {
        EditorConfiguration
            .remember(::DesignConfigurationBuilder)
            .then(::AIImageGenerationPlugin) {
                aiGatewayConfig = AIGatewayConfig(apiKey = aiGatewayApiKey)
                dockModifier = {
                    addFirst { Dock.Button.rememberAIImageGeneration(aiGatewayConfig = it) }
                }
                inspectorBarModifier = {
                    addFirst { InspectorBar.Button.rememberAIImageGeneration(aiGatewayConfig = it) }
                }
            }
    },
    onClose = onClose,
)
```

### Choose a Model

`AIGatewayConfig` defaults to FLUX.2. To use GPT Image 2, set `model` to `AIGatewayImageModel.GptImage2`. You can also provide a Gateway-compatible endpoint and a custom `OkHttpClient` for shared interceptors or timeouts.

```kotlin highlight-android-gateway-config
aiGatewayConfig = AIGatewayConfig(
    apiKey = aiGatewayApiKey,
    model = AIGatewayImageModel.GptImage2,
    gatewayUrl = "https://gateway.img.ly",
    httpClient = OkHttpClient.Builder()
        .connectTimeout(15, TimeUnit.SECONDS)
        .readTimeout(120, TimeUnit.SECONDS)
        .writeTimeout(120, TimeUnit.SECONDS)
        .build(),
)
```

| Model | Text-to-Image ID | Image-to-Image ID |
| --- | --- | --- |
| FLUX.2 (default) | `bfl/flux-2` | `bfl/flux-2-edit` |
| GPT Image 2 | `openai/gpt-image-2` | `openai/gpt-image-2-edit` |

The model must be available to the API key configured in the [IMG.LY Dashboard](https://img.ly/dashboard).

### Customize Button Placement

The plugin prepends both buttons by default. Use `dockModifier` and `inspectorBarModifier` to change their positions with the same list builder operations available to other dock and inspector bar customizations.

The following dock modifier moves the text-to-image action to the end:

```kotlin highlight-android-dock-modifier
dockModifier = {
    addLast { Dock.Button.rememberAIImageGeneration(aiGatewayConfig = it) }
}
```

The inspector bar modifier moves the image-to-image action to the end:

```kotlin highlight-android-inspector-bar-modifier
inspectorBarModifier = {
    addLast { InspectorBar.Button.rememberAIImageGeneration(aiGatewayConfig = it) }
}
```

## How Generation Works

**Text-to-image:** The dock action opens the generation sheet, creates a pending image block, streams the Gateway response and applies the generated image URL when the request completes.

**Image-to-image:** The inspector bar action reads the selected image fill URI. The plugin uploads local images through the Gateway upload flow before it sends the prompt and source image URL to the image-to-image model.

The built-in generation sheet provides prompt, style, output type and format controls. For image-to-image requests, the plugin omits the output format so the Gateway derives the dimensions from the selected source image.

## Troubleshooting

- If the buttons are missing, verify that the plugin dependency is installed and `AIImageGenerationPlugin` is composed with the editor configuration.
- If the inspector action is hidden, select a non-sticker block with an image fill.
- If generation fails, verify network access, model access, the Gateway balance and the values in `AIGatewayConfig`.
- If the prompt cannot be submitted, enter non-empty prompt text.

## API Reference

| API | Purpose |
| --- | --- |
| `EditorConfiguration.remember(builderFactory=_)` | Creates the Design Editor configuration used by the example. |
| `EditorConfiguration.then(builderFactory=_)` | Composes the image generation plugin with the base editor configuration. |
| `AIImageGenerationPlugin.aiGatewayConfig` | Sets the Gateway configuration used by generation requests. |
| `AIGatewayConfig(apiKey=_, model=_, gatewayUrl=_, httpClient=_)` | Configures the API key, model family, Gateway endpoint and HTTP client. |
| `AIImageGenerationPlugin.dockModifier` | Changes where the plugin inserts its dock button. |
| `Dock.Button.rememberAIImageGeneration(aiGatewayConfig=_, builder=_)` | Creates the dock button for text-to-image generation. |
| `AIImageGenerationPlugin.inspectorBarModifier` | Changes where the plugin inserts its inspector bar button. |
| `InspectorBar.Button.rememberAIImageGeneration(aiGatewayConfig=_, builder=_)` | Creates the inspector bar button for image-to-image replacement. |

## Next Steps

- [Dock](../user-interface/customization/dock.md) — Customize dock items and ordering.
- [Inspector Bar](../user-interface/customization/inspector-bar.md) — Customize inspector bar actions and ordering.
- [Design Editor Starter Kit](../starterkits/design-editor.md) — Start from the editor preset used by the example.



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support