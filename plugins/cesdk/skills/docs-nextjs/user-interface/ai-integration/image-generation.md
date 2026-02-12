> This is one page of the CE.SDK Next.js documentation. For a complete overview, see the [Next.js Documentation Index](https://img.ly/nextjs.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [AI Integration](./user-interface/ai-integration.md) > [Image Generation](./user-interface/ai-integration/image-generation.md)

---

We add AI image generation to CE.SDK applications for creating visuals from text descriptions or transforming existing images using multiple AI providers.

![AI Image Generation Interface](https://img.ly/docs/cesdk/./assets/browser.hero.webp)

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/heads/main.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/main/guides-user-interface-ai-integration-image-generation-browser)
>
> - [Open in StackBlitz](https://stackblitz.com/~/github.com/imgly/cesdk-web-examples/tree/main/guides-user-interface-ai-integration-image-generation-browser)
>
> - [Live demo](https://img.ly/examples/guides-user-interface-ai-integration-image-generation-browser/)

The image generation plugin creates visuals from text descriptions (text-to-image) or transforms existing images (image-to-image). Use models like RecraftV3, Recraft20b, IdeogramV3, GeminiFlash25, and GPT Image with output in raster or vector format.

```typescript file=@cesdk_web_examples/guides-user-interface-ai-integration-image-generation-browser/browser.ts reference-only
import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';
import AiApps from '@imgly/plugin-ai-apps-web';
import FalAiImage from '@imgly/plugin-ai-image-generation-web/fal-ai';
import OpenAiImage from '@imgly/plugin-ai-image-generation-web/open-ai';
import packageJson from './package.json';

class Example implements EditorPlugin {
  name = packageJson.name;
  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    // Load asset sources
    await cesdk.addDefaultAssetSources();
    await cesdk.addDemoAssetSources({ sceneMode: 'Design' });

    // Create a design scene
    await cesdk.createDesignScene();

    const engine = cesdk.engine;

    // Configure the AI image generation plugin
    // NOTE: In production, provide a secure proxy URL that forwards
    // requests to fal.ai or OpenAI API with your API key
    const proxyUrl = 'https://your-proxy-server.com/api';

    // Configure image generation with all available providers using AiApps
    await cesdk.addPlugin(
      AiApps({
        providers: {
          text2image: [
            FalAiImage.RecraftV3({ proxyUrl }),
            FalAiImage.Recraft20b({ proxyUrl }),
            FalAiImage.IdeogramV3({ proxyUrl }),
            FalAiImage.GeminiFlash25({ proxyUrl }),
            FalAiImage.NanoBanana({ proxyUrl }),
            FalAiImage.SeedreamV4({ proxyUrl }),
            FalAiImage.FluxProKontextEdit({ proxyUrl }),
            FalAiImage.FluxProKontextMaxEdit({ proxyUrl }),
            OpenAiImage.GptImage1.Text2Image({ proxyUrl }),
          ],
          image2image: [
            FalAiImage.GeminiFlashEdit({ proxyUrl }),
            FalAiImage.Gemini25FlashImageEdit({ proxyUrl }),
            FalAiImage.IdeogramV3Remix({ proxyUrl }),
            FalAiImage.QwenImageEdit({ proxyUrl }),
            FalAiImage.NanoBananaEdit({ proxyUrl }),
            FalAiImage.SeedreamV4Edit({ proxyUrl }),
            OpenAiImage.GptImage1.Image2Image({ proxyUrl }),
          ],
        },
        // IMPORTANT: dryRun mode simulates generation without API calls
        // Perfect for testing and development
        dryRun: true
      })
    );

    // Reorder dock to show AI Apps button prominently
    cesdk.ui.setComponentOrder({ in: 'ly.img.dock' }, [
      'ly.img.ai.apps.dock',
      ...cesdk.ui.getComponentOrder({ in: 'ly.img.dock' })
    ]);

    // Alternative: Configure with single provider
    /*
    await cesdk.addPlugin(
      ImageGeneration({
        providers: {
          text2image: FalAiImage.RecraftV3({
            proxyUrl,
            headers: { 'x-client-version': '1.0.0' }
          }) as any
        },
        dryRun: true
      })
    );
    */

    // Customize generation parameters with default values
    /*
    await cesdk.addPlugin(
      ImageGeneration({
        providers: {
          text2image: FalAiImage.RecraftV3({
            proxyUrl,
            properties: {
              style: { default: 'realistic_image/natural_light' },
              image_size: { default: 'square_hd' },
            },
          }) as any,
        },
      })
    );
    */

    // Control output mode (vector vs raster) via style selection
    // RecraftV3 supports both raster (realistic_image) and vector output
    // To restrict to vector only:
    /*
    cesdk.feature.enable(
      'ly.img.plugin-ai-image-generation-web.fal-ai/recraft-v3.style.image',
      false
    );
    */

    // Configure artistic styles for different visual outputs
    /*
    await cesdk.addPlugin(
      ImageGeneration({
        providers: {
          text2image: FalAiImage.RecraftV3({
            proxyUrl,
            properties: {
              style: {
                default: 'digital_illustration/pixel_art',
              },
            },
          }) as any,
        },
      })
    );
    */

    // Control which features are visible in the UI
    /*
    // Hide provider selection when using single provider
    cesdk.feature.enable('ly.img.plugin-ai-image-generation-web.providerSelect', false);

    // Disable specific style groups
    cesdk.feature.enable(
      'ly.img.plugin-ai-image-generation-web.fal-ai/recraft-v3.style.vector',
      false
    );
    */

    // Customize UI labels and translations
    /*
    cesdk.i18n.setTranslations({
      en: {
        'ly.img.plugin-ai-image-generation-web.fal-ai/recraft-v3.property.prompt':
          'Describe your image',
        'ly.img.plugin-ai-generation-web.property.prompt': 'AI Prompt',
      },
      de: {
        'ly.img.plugin-ai-image-generation-web.fal-ai/recraft-v3.property.prompt':
          'Beschreiben Sie Ihr Bild',
      },
    });
    */

    // Implement middleware for logging or rate limiting
    /*
    import {
      loggingMiddleware,
      rateLimitMiddleware,
    } from '@imgly/plugin-ai-generation-web';

    const logging = loggingMiddleware();
    const rateLimit = rateLimitMiddleware({
      maxRequests: 10,
      timeWindow: 60000, // 1 minute
    });

    await cesdk.addPlugin(
      ImageGeneration({
        providers: {
          text2image: FalAiImage.RecraftV3({ proxyUrl }) as any,
        },
        middleware: [logging, rateLimit],
      })
    );
    */

    // Test without making actual API calls
    /*
    await cesdk.addPlugin(
      ImageGeneration({
        providers: {
          text2image: FalAiImage.RecraftV3({
            proxyUrl,
            debug: true,
            dryRun: true,
          }) as any,
        },
      })
    );
    */

    // Generated images are automatically added to provider-specific history sources:
    // - fal-ai/recraft-v3.history
    // - fal-ai/ideogram/v3.history
    // - open-ai/gpt-image-1/text2image.history
    // Access them through the asset library or programmatically:
    /*
    const assets = engine.asset.findAllSources();
    const historySource = assets.find(id =>
      engine.asset.getName(id) === 'fal-ai/recraft-v3.history'
    );
    if (historySource) {
      const results = await engine.asset.findAssets(historySource);
      console.log('Generated images:', results);
    }
    */

    // Open the AI Apps panel to make the image generation features visible
    cesdk.ui.openPanel('ly.img.ai.apps');
  }
}

export default Example;
```

This guide covers installing the plugin, configuring text-to-image and image-to-image providers, setting up proxy communication, customizing generation parameters, choosing between vector and raster output, configuring artistic styles, and testing with dry-run mode.

## Using the Built-in Image Generation UI

After configuring the plugin, users access image generation through the UI. They choose text-to-image or image-to-image mode, enter prompts or upload images, select output format and styles, adjust generation parameters, and find generated results in the asset library. The UI adapts based on the configured providers and available features.

## Installing the Plugin

Import the plugin and provider modules from the image generation package.

```typescript highlight-install
import AiApps from '@imgly/plugin-ai-apps-web';
import FalAiImage from '@imgly/plugin-ai-image-generation-web/fal-ai';
import OpenAiImage from '@imgly/plugin-ai-image-generation-web/open-ai';
```

Install `@imgly/plugin-ai-image-generation-web` to access the ImageGeneration plugin and provider modules for fal.ai and OpenAI:

<Tabs syncKey="package-manager">
  <TabItem label="npm">
    ```bash
    npm install @imgly/plugin-ai-image-generation-web

    ```
  </TabItem>

  <TabItem label="yarn">
    ```bash
    yarn add @imgly/plugin-ai-image-generation-web

    ```
  </TabItem>

  <TabItem label="pnpm">
    ```bash
    pnpm add @imgly/plugin-ai-image-generation-web

    ```
  </TabItem>
</Tabs>

## Configuring Text-to-Image Providers

Configure text-to-image generation by adding providers like RecraftV3, Recraft20b, IdeogramV3, GeminiFlash25, or GPT Image. Each provider requires a proxy URL for secure API communication.

For available models, see the provider documentation:

- [fal.ai Models](https://fal.ai/models)
- [OpenAI Models](https://platform.openai.com/docs/models)

```typescript highlight-text-to-image-basic
await cesdk.addPlugin(
  ImageGeneration({
    providers: {
      text2image: FalAiImage.RecraftV3({
        proxyUrl,
        headers: { 'x-client-version': '1.0.0' }
      }) as any
    },
    dryRun: true
  })
);
```

We configure RecraftV3 as the text-to-image provider with custom headers and enable dry-run mode for testing without actual API calls.

## Configuring Image-to-Image Providers

Set up image-to-image transformation by configuring providers like GeminiFlashEdit, Gemini25FlashImageEdit, IdeogramV3Remix, QwenImageEdit, FluxProKontextEdit, or GPT Image. Users can upload images and transform them based on text instructions.

```typescript
ImageGeneration({
  providers: {
    text2image: FalAiImage.RecraftV3({ proxyUrl: '...' }),
    image2image: FalAiImage.GeminiFlashEdit({ proxyUrl: '...' }),
  },
})
```

The image-to-image mode accepts uploaded images and applies AI-powered transformations based on user prompts.

## Setting Up a Proxy Server

A proxy server protects your API keys by forwarding requests server-side. See the [Proxy Server](./user-interface/ai-integration/proxy-server.md) guide for implementation details and examples.

## Customizing Generation Parameters

Set default generation properties using the properties configuration. Control style for visual appearance and image\_size for output dimensions.

```typescript highlight-customizing-parameters
await cesdk.addPlugin(
  ImageGeneration({
    providers: {
      text2image: FalAiImage.RecraftV3({
        proxyUrl,
        properties: {
          style: { default: 'realistic_image/natural_light' },
          image_size: { default: 'square_hd' },
        },
      }) as any,
    },
  })
);
```

For RecraftV3 and Recraft20b, configure `style` (realistic\_image, digital\_illustration, vector\_illustration) and `image_size` (square\_hd, landscape\_4\_3, portrait\_3\_4). For IdeogramV3, control `style_mode` (AUTO, GENERAL, REALISTIC, DESIGN). For GeminiFlash25, set `aspect_ratio` and `output_format`.

## Choosing Output Modes: Vector vs Raster

Choose between vector (scalable SVG) and raster (bitmap PNG/JPEG) output via style selection. RecraftV3 and Recraft20b support both modes based on the selected style.

```typescript highlight-vector-vs-raster
cesdk.feature.enable(
  'ly.img.plugin-ai-image-generation-web.fal-ai/recraft-v3.style.image',
  false
);
```

RecraftV3 provides `realistic_image` for raster output, and `digital_illustration` or `vector_illustration` for vector output. Control available styles with the Feature API to restrict output modes.

## Configuring Artistic Styles

RecraftV3 and Recraft20b support artistic styles through the properties configuration. RecraftV3 offers styles like `realistic_image/natural_light`, `digital_illustration/pixel_art`, and `vector_illustration`. Recraft20b adds icon styles like `icon/broken_line`, `icon/colored_outline`, and `logo`.

```typescript highlight-artistic-styles
await cesdk.addPlugin(
  ImageGeneration({
    providers: {
      text2image: FalAiImage.RecraftV3({
        proxyUrl,
        properties: {
          style: {
            default: 'digital_illustration/pixel_art',
          },
        },
      }) as any,
    },
  })
);
```

Users select styles in the UI or set defaults programmatically to control the visual appearance of generated images.

## Multiple Provider and Model Configuration

Configure arrays of providers to give users choice between different AI models and capabilities.

```typescript highlight-multiple-providers
// Configure image generation with all available providers using AiApps
await cesdk.addPlugin(
  AiApps({
    providers: {
      text2image: [
        FalAiImage.RecraftV3({ proxyUrl }),
        FalAiImage.Recraft20b({ proxyUrl }),
        FalAiImage.IdeogramV3({ proxyUrl }),
        FalAiImage.GeminiFlash25({ proxyUrl }),
        FalAiImage.NanoBanana({ proxyUrl }),
        FalAiImage.SeedreamV4({ proxyUrl }),
        FalAiImage.FluxProKontextEdit({ proxyUrl }),
        FalAiImage.FluxProKontextMaxEdit({ proxyUrl }),
        OpenAiImage.GptImage1.Text2Image({ proxyUrl }),
      ],
      image2image: [
        FalAiImage.GeminiFlashEdit({ proxyUrl }),
        FalAiImage.Gemini25FlashImageEdit({ proxyUrl }),
        FalAiImage.IdeogramV3Remix({ proxyUrl }),
        FalAiImage.QwenImageEdit({ proxyUrl }),
        FalAiImage.NanoBananaEdit({ proxyUrl }),
        FalAiImage.SeedreamV4Edit({ proxyUrl }),
        OpenAiImage.GptImage1.Image2Image({ proxyUrl }),
      ],
    },
    // IMPORTANT: dryRun mode simulates generation without API calls
    // Perfect for testing and development
    dryRun: true
  })
);
```

Multiple provider configurations trigger automatic provider and model selection interfaces in the UI, allowing users to choose the best model for their use case.

## Controlling Feature Visibility

Hide or show features using the Feature API. Disable provider selection when using a single provider or restrict specific style groups.

```typescript highlight-feature-visibility
    // Hide provider selection when using single provider
    cesdk.feature.enable('ly.img.plugin-ai-image-generation-web.providerSelect', false);

    // Disable specific style groups
    cesdk.feature.enable(
      'ly.img.plugin-ai-image-generation-web.fal-ai/recraft-v3.style.vector',
      false
    );
```

We disable provider selection to hide the UI when only one provider is configured, and control style group visibility to restrict output modes.

## Customizing Labels and Translations

Customize UI text using the i18n system. Set provider-specific translations or generic keys that apply to multiple providers.

```typescript highlight-custom-translations
cesdk.i18n.setTranslations({
  en: {
    'ly.img.plugin-ai-image-generation-web.fal-ai/recraft-v3.property.prompt':
      'Describe your image',
    'ly.img.plugin-ai-generation-web.property.prompt': 'AI Prompt',
  },
  de: {
    'ly.img.plugin-ai-image-generation-web.fal-ai/recraft-v3.property.prompt':
      'Beschreiben Sie Ihr Bild',
  },
});
```

Provider-specific keys like `ly.img.plugin-ai-image-generation-web.fal-ai/recraft-v3.property.prompt` customize individual models, while generic keys like `ly.img.plugin-ai-generation-web.property.prompt` apply broadly.

## Implementing Middleware

Intercept generation requests and responses with middleware functions. Use built-in middleware for logging or rate limiting, or create custom middleware for error handling.

```typescript highlight-middleware
    import {
      loggingMiddleware,
      rateLimitMiddleware,
    } from '@imgly/plugin-ai-generation-web';

    const logging = loggingMiddleware();
    const rateLimit = rateLimitMiddleware({
      maxRequests: 10,
      timeWindow: 60000, // 1 minute
    });

    await cesdk.addPlugin(
      ImageGeneration({
        providers: {
          text2image: FalAiImage.RecraftV3({ proxyUrl }) as any,
        },
        middleware: [logging, rateLimit],
      })
    );
```

Middleware receives input, options, and a next callback. Chain multiple middleware functions to process requests before they reach the AI provider.

## Testing Without API Calls

Use debug mode for console logging and dryRun to simulate generation without making actual API requests.

```typescript highlight-dry-run
await cesdk.addPlugin(
  ImageGeneration({
    providers: {
      text2image: FalAiImage.RecraftV3({
        proxyUrl,
        debug: true,
        dryRun: true,
      }) as any,
    },
  })
);
```

Dry-run mode returns simulated responses, allowing development and testing without consuming API credits or requiring valid API keys.

## Accessing Generated Images

Generated images appear in provider-specific history sources like `fal-ai/recraft-v3.history`, `fal-ai/ideogram/v3.history`, and `open-ai/gpt-image-1/text2image.history`.

```typescript highlight-accessing-images
const assets = engine.asset.findAllSources();
const historySource = assets.find(id =>
  engine.asset.getName(id) === 'fal-ai/recraft-v3.history'
);
if (historySource) {
  const results = await engine.asset.findAssets(historySource);
  console.log('Generated images:', results);
}
```

Access generated images through the asset library UI or programmatically with `engine.asset` methods to retrieve and use generated content.

## Troubleshooting

Common issues when configuring the image generation plugin:

**Plugin not appearing in UI**: Verify plugin installation and the `addPlugin()` call is executed after scene creation.

**Proxy errors**: Check proxy URL accessibility, CORS configuration, and that the proxy correctly forwards requests with API keys.

**Generation failures**: Verify provider API key validity and that the proxy correctly authenticates with the AI provider.

**Generation timeouts**: Adjust timeout settings for complex prompts or high-resolution outputs.

**Provider/model selection not showing**: Verify multiple provider configurations are provided in the array format.

**Custom translations not applying**: Check translation key format matches provider-specific patterns.

**Middleware not executing**: Verify middleware array is passed to the plugin configuration.

**Images not appearing in asset library**: Check asset library configuration includes the provider's history source.

**Poor quality results**: Adjust style and image\_size parameters to match your use case.

**Vector output not working**: Verify style is set to vector modes and vector style groups are enabled.

**Styles not showing in UI**: Check the provider supports styles and style feature flags are enabled.

**Image-to-image not accepting uploads**: Verify input image format and size meet the provider's requirements.

## API Reference

| Method                                | Category | Purpose                                             |
| ------------------------------------- | -------- | --------------------------------------------------- |
| `cesdk.addPlugin()`                   | Plugin   | Register and initialize the Image Generation plugin |
| `ImageGeneration()`                   | Plugin   | Create plugin instance with provider configuration  |
| `FalAiImage.RecraftV3()`              | Provider | Configure RecraftV3 text-to-image (raster/vector)   |
| `FalAiImage.Recraft20b()`             | Provider | Configure Recraft20b text-to-image with icon styles |
| `FalAiImage.IdeogramV3()`             | Provider | Configure IdeogramV3 text-to-image generation       |
| `FalAiImage.IdeogramV3Remix()`        | Provider | Configure IdeogramV3 image remixing                 |
| `FalAiImage.GeminiFlash25()`          | Provider | Configure Gemini Flash 2.5 text-to-image            |
| `FalAiImage.GeminiFlashEdit()`        | Provider | Configure Gemini Flash image editing                |
| `FalAiImage.Gemini25FlashImageEdit()` | Provider | Configure Gemini 2.5 Flash image editing            |
| `FalAiImage.QwenImageEdit()`          | Provider | Configure Qwen image editing                        |
| `FalAiImage.FluxProKontextEdit()`     | Provider | Configure Flux Pro Kontext image editing            |
| `FalAiImage.FluxProKontextMaxEdit()`  | Provider | Configure Flux Pro Kontext Max image editing        |
| `FalAiImage.NanoBanana()`             | Provider | Configure NanoBanana text-to-image                  |
| `FalAiImage.NanoBananaEdit()`         | Provider | Configure NanoBanana image editing                  |
| `FalAiImage.SeedreamV4()`             | Provider | Configure Seedream V4 text-to-image                 |
| `FalAiImage.SeedreamV4Edit()`         | Provider | Configure Seedream V4 image editing                 |
| `OpenAiImage.GptImage1.Text2Image()`  | Provider | Configure GPT Image text-to-image                   |
| `OpenAiImage.GptImage1.Image2Image()` | Provider | Configure GPT Image image-to-image                  |
| `cesdk.feature.enable()`              | Feature  | Control visibility of plugin features               |
| `cesdk.i18n.setTranslations()`        | I18n     | Customize UI labels and translations                |
| `engine.asset`                        | Asset    | Access and manage generated image assets            |

## Next Steps

- [Proxy Server](./user-interface/ai-integration/proxy-server.md) — Set up secure API communication
- [Custom Provider](./user-interface/ai-integration/custom-provider.md) — Create custom AI providers
- [Integrate AI Features](./user-interface/ai-integration/integrate.md) — Overview of AI integration
- [Asset Library Basics](./import-media/asset-panel/basics.md) — Work with generated assets
- [Customize Asset Library](./import-media/asset-panel/customize.md) — Configure asset sources



---

## More Resources

- **[Next.js Documentation Index](https://img.ly/nextjs.md)** - Browse all Next.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./nextjs.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support