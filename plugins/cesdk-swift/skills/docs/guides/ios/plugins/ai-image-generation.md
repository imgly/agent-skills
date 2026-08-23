> This is one page of the CE.SDK iOS documentation. For a complete overview, see the [iOS Documentation Index](https://img.ly/docs/cesdk/ios/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/ios/llms-full.txt).

**Navigation:** [Plugins](../plugins.md) > [AI Image Generation](./ai-image-generation.md)

---

```swift file=@cesdk_swift_examples/editor-guides-ai-image-generation/AIImageGenerationSolution.swift reference-only
import IMGLYEditor
import IMGLYPluginAIImageGeneration

import SwiftUI

struct AIImageGenerationSolution: View {
  let settings = EngineSettings(license: secrets.licenseKey,
                                userID: "<your unique user id>")

  var body: some View {
    Editor(settings)
      .imgly.configuration {
        DesignEditorConfiguration()
        AIImageGenerationPlugin(options: .init(
          service: AIGatewayService(apiKey: secrets.gatewayApiKey),
        ))
      }
  }
}

// MARK: - Choosing a Model

struct AIImageGenerationModelSolution: View {
  let settings = EngineSettings(license: secrets.licenseKey,
                                userID: "<your unique user id>")

  var body: some View {
    Editor(settings)
      .imgly.configuration {
        DesignEditorConfiguration()
        AIImageGenerationPlugin(options: .init(
          service: AIGatewayService(
            apiKey: secrets.gatewayApiKey,
            model: .gptImage2,
          ),
        ))
      }
  }
}

// MARK: - Custom Styles

struct AIImageGenerationStylesSolution: View {
  let settings = EngineSettings(license: secrets.licenseKey,
                                userID: "<your unique user id>")

  var body: some View {
    Editor(settings)
      .imgly.configuration {
        DesignEditorConfiguration()
        AIImageGenerationPlugin(options: .init(
          service: AIGatewayService(apiKey: secrets.gatewayApiKey),
          styles: [
            PromptStyle(
              id: "watercolor",
              displayName: "Watercolor",
              promptSnippet: "loose watercolor washes, gentle gradients, dreamy storybook feel",
            ),
            PromptStyle(
              id: "cyberpunk",
              displayName: "Cyberpunk",
              promptSnippet: "cyberpunk cityscape, glowing neon signage, dark atmosphere",
            ),
          ],
        ))
      }
  }
}

// MARK: - Error Handling

struct AIImageGenerationErrorHandlingSolution: View {
  let settings = EngineSettings(license: secrets.licenseKey,
                                userID: "<your unique user id>")
  @State private var errorMessage: String?

  var body: some View {
    Editor(settings)
      .imgly.configuration {
        DesignEditorConfiguration()
        AIImageGenerationPlugin(options: .init(
          service: AIGatewayService(apiKey: secrets.gatewayApiKey),
          onError: { error in
            errorMessage = error.localizedDescription
          },
        ))
      }
      .alert("Generation Error", isPresented: .constant(errorMessage != nil)) {
        Button("OK") { errorMessage = nil }
      } message: {
        Text(errorMessage ?? "")
      }
  }
}

// MARK: - Button Placement

struct AIImageGenerationPlacementSolution: View {
  let settings = EngineSettings(license: secrets.licenseKey,
                                userID: "<your unique user id>")

  var body: some View {
    Editor(settings)
      .imgly.configuration {
        DesignEditorConfiguration()
        AIImageGenerationPlugin(options: .init(
          service: AIGatewayService(apiKey: secrets.gatewayApiKey),
          dockModifier: { items, button in
            items.addLast { button }
          },
          inspectorBarModifier: { items, button in
            items.addLast { button }
          },
        ))
      }
  }
}

// MARK: - Hide Style Picker

struct AIImageGenerationNoStylesSolution: View {
  let settings = EngineSettings(license: secrets.licenseKey,
                                userID: "<your unique user id>")

  var body: some View {
    Editor(settings)
      .imgly.configuration {
        DesignEditorConfiguration()
        AIImageGenerationPlugin(options: .init(
          service: AIGatewayService(apiKey: secrets.gatewayApiKey),
          styles: [],
        ))
      }
  }
}
```

Add AI-powered image generation to your editor so users can create visuals from text prompts or transform existing images.

![AI image generation in the editor](https://img.ly/docs/cesdk/ios/plugins/ai-image-generation-aimg01/assets/ios.hero.webp)

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-swift-examples/tree/v1.82.0-nightly.20260823/editor-guides-ai-image-generation)

The `AIImageGenerationPlugin` adds two integration points to the editor: a **dock button** for text-to-image generation (creates new image blocks) and an **inspector bar button** for image-to-image enhancement (transforms selected images). Both connect to the [IMG.LY Gateway](https://img.ly/dashboard) for AI model access.

This guide builds on the [Design Editor Starter Kit](../starterkits/design-editor.md). The same plugin works with any editor configuration that hosts a dock and inspector bar.

## Prerequisites

You need an IMG.LY Gateway API key to use image generation. Once you have a key, configure the models it has access to (`bfl/flux-2`, `openai/gpt-image-2`, etc.).

> **Note:** You can acquire an API key at [img.ly/dashboard](https://img.ly/dashboard). Register, generate the API key, and contact IMG.LY support to credit the balance for Gateway usage.

## Install the Plugin

Add the `IMGLYPluginAIImageGeneration` Swift package to your project. The package depends on `IMGLYUI` and is available via Swift Package Manager:

```
https://github.com/imgly/IMGLYPluginAIImageGeneration-swift
```

## Use the Plugin

Import `IMGLYEditor` and the plugin module in the file where you set up the editor:

```swift highlight-aiImageGeneration-imports
import IMGLYEditor
import IMGLYPluginAIImageGeneration
```

Register the plugin as an `EditorConfiguration` alongside your editor configuration. Pass your Gateway API key to `AIGatewayService`:

```swift highlight-aiImageGeneration-basicSetup
Editor(settings)
  .imgly.configuration {
    DesignEditorConfiguration()
    AIImageGenerationPlugin(options: .init(
      service: AIGatewayService(apiKey: secrets.gatewayApiKey),
    ))
  }
```

The plugin adds a "Generate" button to the dock and an "Edit" button to the inspector bar. Users enter a text prompt, choose a style and format, and the generated image appears on the canvas. The "Edit" button appears only when a compatible image block (non-sticker with an image fill) is selected.

> **Warning:** Image generation requires network access and a valid IMG.LY Gateway API key. Without both, generation requests fail with HTTP 401/403 or network errors.

## Configure the Plugin

The following sections show each public configuration option.

### Choosing a Model

`AIGatewayService` defaults to FLUX.2 (`bfl/flux-2`). To use GPT Image 2 instead, pass `.gptImage2` as the `model` parameter:

```swift highlight-aiImageGeneration-chooseModel
Editor(settings)
  .imgly.configuration {
    DesignEditorConfiguration()
    AIImageGenerationPlugin(options: .init(
      service: AIGatewayService(
        apiKey: secrets.gatewayApiKey,
        model: .gptImage2,
      ),
    ))
  }
```

| Model | Text-to-Image ID | Image-to-Image ID |
|-------|-------------------|-------------------|
| FLUX.2 (default) | `bfl/flux-2` | `bfl/flux-2-edit` |
| GPT Image 2 | `openai/gpt-image-2` | `openai/gpt-image-2-edit` |

The model your key has access to must match the scopes configured in the [IMG.LY Dashboard](https://img.ly/dashboard).

### Customizing Styles

The plugin ships with 14 curated prompt styles (Anime, Cyberpunk, Watercolor, Dark Fantasy, etc.). Each style appends a prompt snippet to the user's text before sending the request. Pass a custom array to replace the built-in styles:

```swift highlight-aiImageGeneration-customStyles
Editor(settings)
  .imgly.configuration {
    DesignEditorConfiguration()
    AIImageGenerationPlugin(options: .init(
      service: AIGatewayService(apiKey: secrets.gatewayApiKey),
      styles: [
        PromptStyle(
          id: "watercolor",
          displayName: "Watercolor",
          promptSnippet: "loose watercolor washes, gentle gradients, dreamy storybook feel",
        ),
        PromptStyle(
          id: "cyberpunk",
          displayName: "Cyberpunk",
          promptSnippet: "cyberpunk cityscape, glowing neon signage, dark atmosphere",
        ),
      ],
    ))
  }
```

Each `PromptStyle` has three fields:

| Property | Purpose |
|----------|---------|
| `id` | Stable identifier for the style |
| `displayName` | Name shown in the style picker |
| `promptSnippet` | Text appended to the user's prompt (e.g., "anime cel-shaded, bright pastel palette") |

To hide the style picker entirely, pass an empty array:

```swift highlight-aiImageGeneration-hideStyles
Editor(settings)
  .imgly.configuration {
    DesignEditorConfiguration()
    AIImageGenerationPlugin(options: .init(
      service: AIGatewayService(apiKey: secrets.gatewayApiKey),
      styles: [],
    ))
  }
```

### Handling Errors

By default, generation errors trigger the editor's built-in error alert. To keep the editor open and present a custom alert, pass an `onError` closure:

```swift highlight-aiImageGeneration-errorHandling
Editor(settings)
  .imgly.configuration {
    DesignEditorConfiguration()
    AIImageGenerationPlugin(options: .init(
      service: AIGatewayService(apiKey: secrets.gatewayApiKey),
      onError: { error in
        errorMessage = error.localizedDescription
      },
    ))
  }
  .alert("Generation Error", isPresented: .constant(errorMessage != nil)) {
    Button("OK") { errorMessage = nil }
  } message: {
    Text(errorMessage ?? "")
  }
```

Common errors include authentication failures (HTTP 401/403 when the API key is invalid) and generation failures (model-side errors or timeouts).

### Customizing Button Placement

The dock and inspector bar buttons are prepended by default. Use `dockModifier` and `inspectorBarModifier` to control placement:

```swift highlight-aiImageGeneration-buttonPlacement
Editor(settings)
  .imgly.configuration {
    DesignEditorConfiguration()
    AIImageGenerationPlugin(options: .init(
      service: AIGatewayService(apiKey: secrets.gatewayApiKey),
      dockModifier: { items, button in
        items.addLast { button }
      },
      inspectorBarModifier: { items, button in
        items.addLast { button }
      },
    ))
  }
```

### Custom Providers

`AIGatewayService` is the default provider, but you can implement the `AIImageService` protocol to connect to any image generation backend. Your custom service receives an `ImageGenerationRequest` (prompt, size, style, source image) and returns a `GeneratedImage` with the result URL.

## How Generation Works

**Text-to-image (dock button):** The plugin creates a pending block on the canvas, sends the prompt to the Gateway via SSE streaming, and applies the generated image URL to the block when the response completes.

**Image-to-image (inspector bar button):** The plugin reads the selected image block's fill URI, uploads local images via a presigned PUT to `/v1/uploads`, and sends both the prompt and image URL to the Gateway's image-to-image model.

## API Reference

| API | Purpose |
|-----|---------|
| `AIImageGenerationPlugin(options:)` | Register the plugin with an editor configuration |
| `AIImageService` | Protocol for custom image generation providers |
| `AIGatewayService(apiKey:model:gatewayURL:)` | Create a Gateway service instance |
| `AIGatewayImageModel.fluxV2` | FLUX.2 model family (default) |
| `AIGatewayImageModel.gptImage2` | GPT Image 2 model family |
| `PromptStyle(id:displayName:promptSnippet:thumbnailURL:)` | Define a custom prompt style |
| `PromptStyle.curated` | Built-in prompt styles (13 styles + None) |
| `Options.onError` | Custom error handler closure |
| `Options.dockModifier` | Control dock button placement |
| `Options.inspectorBarModifier` | Control inspector bar button placement |
| `Options.styles` | Custom style array (empty array hides the picker) |

## Next Steps

- [Dock](../user-interface/customization/dock.md) — Customize dock items and ordering.
- [Inspector Bar](../user-interface/customization/inspector-bar.md) — Customize inspector bar actions and ordering.
- [Design Editor Starter Kit](../starterkits/design-editor.md) — The editor preset that hosts this plugin.



---

## More Resources

- **[iOS Documentation Index](https://img.ly/docs/cesdk/ios/)** - Browse all iOS documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/ios/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/ios/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support