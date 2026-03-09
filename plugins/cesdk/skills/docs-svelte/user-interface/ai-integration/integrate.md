> This is one page of the CE.SDK Svelte documentation. For a complete overview, see the [Svelte Documentation Index](https://img.ly/svelte.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [AI Integration](./user-interface/ai-integration.md) > [Integrate AI Into CE.SDK](./user-interface/ai-integration/integrate.md)

---

Add AI-powered generation capabilities to your CE.SDK application for generating images, videos, audio, and text using the `@imgly/plugin-ai-apps-web` package.

![Integrate AI Into CE.SDK example showing the editor with AI capabilities](https://img.ly/docs/cesdk/./assets/browser.hero.webp)

> **Reading time:** 15 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/heads/main.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/main/guides-user-interface-ai-integration-browser)
>
> - [Open in StackBlitz](https://stackblitz.com/~/github.com/imgly/cesdk-web-examples/tree/main/guides-user-interface-ai-integration-browser)
>
> - [Live demo](https://img.ly/examples/guides-user-interface-ai-integration-browser/)

This tutorial will guide you through integrating AI-powered generation capabilities into your CreativeEditor SDK application using the `@imgly/plugin-ai-apps-web` package. You'll learn how to set up various AI providers for generating images, videos, audio, and text.

```typescript file=@cesdk_web_examples/guides-user-interface-ai-integration-browser/browser.ts reference-only
import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';

import {
  BlurAssetSource,
  CaptionPresetsAssetSource,
  ColorPaletteAssetSource,
  CropPresetsAssetSource,
  DemoAssetSources,
  EffectsAssetSource,
  FiltersAssetSource,
  PagePresetsAssetSource,
  StickerAssetSource,
  TextAssetSource,
  TextComponentAssetSource,
  TypefaceAssetSource,
  UploadAssetSources,
  VectorShapeAssetSource
} from '@cesdk/cesdk-js/plugins';
import { VideoEditorConfig } from './video-editor/plugin';
import AiApps from '@imgly/plugin-ai-apps-web';

// Import providers from individual AI generation packages
import Elevenlabs from '@imgly/plugin-ai-audio-generation-web/elevenlabs';
import FalAiImage from '@imgly/plugin-ai-image-generation-web/fal-ai';
import OpenAiImage from '@imgly/plugin-ai-image-generation-web/open-ai';
import Anthropic from '@imgly/plugin-ai-text-generation-web/anthropic';
import FalAiVideo from '@imgly/plugin-ai-video-generation-web/fal-ai';

// Import middleware utilities
import { uploadMiddleware } from '@imgly/plugin-ai-generation-web';

import packageJson from './package.json';

/**
 * Upload to your image storage server.
 * Replace this mock with your actual storage API call.
 */
async function uploadToYourStorageServer(imageUrl: string) {
  // In production, upload the image to your server:
  // const response = await fetch('https://your-server.com/api/store-image', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({
  //     imageUrl,
  //     metadata: { source: 'ai-generation' }
  //   })
  // });
  // return await response.json();

  // Mock: Return a fake response
  return { permanentUrl: imageUrl };
}

/**
 * CE.SDK Plugin: AI Integration Guide
 *
 * Demonstrates how to integrate AI-powered generation capabilities:
 * - Text generation and transformation (Anthropic)
 * - Image generation (fal.ai, OpenAI)
 * - Video generation (fal.ai)
 * - Audio generation (ElevenLabs)
 * - Using middleware for custom processing
 * - Configuring UI integration
 */
class Example implements EditorPlugin {
  name = packageJson.name;

  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    await cesdk.addPlugin(new VideoEditorConfig());

    // Add asset source plugins
    await cesdk.addPlugin(new BlurAssetSource());
    await cesdk.addPlugin(new CaptionPresetsAssetSource());
    await cesdk.addPlugin(new ColorPaletteAssetSource());
    await cesdk.addPlugin(new CropPresetsAssetSource());
    await cesdk.addPlugin(
      new UploadAssetSources({
        include: [
          'ly.img.image.upload',
          'ly.img.video.upload',
          'ly.img.audio.upload'
        ]
      })
    );
    await cesdk.addPlugin(
      new DemoAssetSources({
        include: [
          'ly.img.templates.video.*',
          'ly.img.image.*',
          'ly.img.audio.*',
          'ly.img.video.*'
        ]
      })
    );
    await cesdk.addPlugin(new EffectsAssetSource());
    await cesdk.addPlugin(new FiltersAssetSource());
    await cesdk.addPlugin(
      new PagePresetsAssetSource({
        include: [
          'ly.img.page.presets.instagram.*',
          'ly.img.page.presets.facebook.*',
          'ly.img.page.presets.x.*',
          'ly.img.page.presets.linkedin.*',
          'ly.img.page.presets.pinterest.*',
          'ly.img.page.presets.tiktok.*',
          'ly.img.page.presets.youtube.*',
          'ly.img.page.presets.video.*'
        ]
      })
    );
    await cesdk.addPlugin(new StickerAssetSource());
    await cesdk.addPlugin(new TextAssetSource());
    await cesdk.addPlugin(new TextComponentAssetSource());
    await cesdk.addPlugin(new TypefaceAssetSource());
    await cesdk.addPlugin(new VectorShapeAssetSource());

    await cesdk.actions.run('scene.create', {
      mode: 'Video',
      page: {
        sourceId: 'ly.img.page.presets',
        assetId: 'ly.img.page.presets.instagram.story'
      }

    // Configure AI Apps dock position
    cesdk.ui.setComponentOrder({ in: 'ly.img.dock' }, [
      'ly.img.ai.apps.dock',
      ...cesdk.ui.getComponentOrder({ in: 'ly.img.dock' })
    ]);

    // Add AI options to canvas menu
    cesdk.ui.setComponentOrder({ in: 'ly.img.canvas.menu' }, [
      'ly.img.ai.text.canvasMenu',
      'ly.img.ai.image.canvasMenu',
      ...cesdk.ui.getComponentOrder({ in: 'ly.img.canvas.menu' })
    ]);

    // Add the AI Apps plugin with all providers
    cesdk.addPlugin(
      AiApps({
        // IMPORTANT: dryRun mode simulates generation without API calls
        // Perfect for testing and development - remove for production use
        dryRun: true,
        providers: {
          // Text generation and transformation
          text2text: Anthropic.AnthropicProvider({
            proxyUrl: 'http://your-proxy-server.com/api/proxy',
            headers: {
              'x-client-version': '1.0.0',
              'x-request-source': 'cesdk-tutorial'
            },
            // Optional: Configure default property values
            properties: {
              temperature: { default: 0.7 },
              maxTokens: { default: 500 }
            }
          }),

          // Image generation - Multiple providers with selection UI
          text2image: [
            FalAiImage.RecraftV3({
              proxyUrl: 'http://your-proxy-server.com/api/proxy',
              headers: {
                'x-client-version': '1.0.0',
                'x-request-source': 'cesdk-tutorial'
              },
              // Add upload middleware to store generated images on your server
              middleware: [
                uploadMiddleware(async (output) => {
                  // Upload the generated image to your server
                  const result = await uploadToYourStorageServer(output.url);

                  // Return the output with your server's URL
                  return {
                    ...output,
                    url: result.permanentUrl
                  };
                })
              ]
            }),
            // Alternative with icon style support
            FalAiImage.Recraft20b({
              proxyUrl: 'http://your-proxy-server.com/api/proxy',
              headers: {
                'x-client-version': '1.0.0',
                'x-request-source': 'cesdk-tutorial'
              },
              // Configure dynamic defaults based on style type
              properties: {
                style: { default: 'broken_line' },
                image_size: { default: 'square_hd' }
              }
            }),
            // Additional image provider for user selection
            OpenAiImage.GptImage1.Text2Image({
              proxyUrl: 'http://your-proxy-server.com/api/proxy',
              headers: {
                'x-api-key': 'your-key',
                'x-request-source': 'cesdk-tutorial'
              }
            })
          ],

          // Image-to-image transformation
          image2image: FalAiImage.GeminiFlashEdit({
            proxyUrl: 'https://your-server.com/api/fal-ai-proxy',
            headers: {
              'x-client-version': '1.0.0',
              'x-request-source': 'cesdk-tutorial'
            }
          }),

          // Video generation - Multiple providers
          text2video: [
            FalAiVideo.MinimaxVideo01Live({
              proxyUrl: 'https://your-server.com/api/fal-ai-proxy',
              headers: {
                'x-client-version': '1.0.0',
                'x-request-source': 'cesdk-tutorial'
              }
            }),
            FalAiVideo.PixverseV35TextToVideo({
              proxyUrl: 'https://your-server.com/api/fal-ai-proxy',
              headers: {
                'x-client-version': '1.0.0',
                'x-request-source': 'cesdk-tutorial'
              }
            })
          ],
          image2video: FalAiVideo.MinimaxVideo01LiveImageToVideo({
            proxyUrl: 'https://your-server.com/api/fal-ai-proxy',
            headers: {
              'x-client-version': '1.0.0',
              'x-request-source': 'cesdk-tutorial'
            }
          }),

          // Audio generation
          text2speech: Elevenlabs.ElevenMultilingualV2({
            proxyUrl: 'https://your-server.com/api/elevenlabs-proxy',
            headers: {
              'x-client-version': '1.0.0',
              'x-request-source': 'cesdk-tutorial'
            }
          }),
          text2sound: Elevenlabs.ElevenSoundEffects({
            proxyUrl: 'https://your-server.com/api/elevenlabs-proxy',
            headers: {
              'x-client-version': '1.0.0',
              'x-request-source': 'cesdk-tutorial'
            }
          })
        }
      })
    );

    // Control AI features with Feature API
    // Disable specific quick actions
    cesdk.feature.enable(
      'ly.img.plugin-ai-image-generation-web.quickAction.editImage',
      false
    );
    cesdk.feature.enable(
      'ly.img.plugin-ai-text-generation-web.quickAction.translate',
      false
    );

    // Control input types for image/video generation
    cesdk.feature.enable(
      'ly.img.plugin-ai-image-generation-web.fromText',
      true
    );
    cesdk.feature.enable(
      'ly.img.plugin-ai-image-generation-web.fromImage',
      false
    );

    // Hide provider selection dropdowns
    cesdk.feature.enable(
      'ly.img.plugin-ai-image-generation-web.providerSelect',
      false
    );

    // Control style groups for specific providers
    cesdk.feature.enable(
      'ly.img.plugin-ai-image-generation-web.fal-ai/recraft-v3.style.vector',
      false
    );

    console.log('AI integration guide initialized.');
  }
}

export default Example;
```

This guide covers installing AI generation packages, initializing CE.SDK with video mode, configuring the AI dock and canvas menu, setting up text, image, video, and audio providers, implementing middleware for custom processing, controlling features with the Feature API, and setting up proxy servers for secure API communication.

## Prerequisites

- Basic knowledge of JavaScript/TypeScript and React
- Familiarity with CreativeEditor SDK
- API keys for AI services (Anthropic, fal.ai, ElevenLabs, etc.)

## 1. Project Setup

First, set up your project and install the necessary packages:

```bash
# Initialize a new project or use an existing one
npm install @cesdk/cesdk-js
npm install @imgly/plugin-ai-apps-web

# Install individual AI generation packages as needed
npm install @imgly/plugin-ai-image-generation-web
npm install @imgly/plugin-ai-video-generation-web
npm install @imgly/plugin-ai-audio-generation-web
npm install @imgly/plugin-ai-text-generation-web
```

Import the providers from their respective packages:

```typescript highlight=highlight-imports
// Import providers from individual AI generation packages
import Elevenlabs from '@imgly/plugin-ai-audio-generation-web/elevenlabs';
import FalAiImage from '@imgly/plugin-ai-image-generation-web/fal-ai';
import OpenAiImage from '@imgly/plugin-ai-image-generation-web/open-ai';
import Anthropic from '@imgly/plugin-ai-text-generation-web/anthropic';
import FalAiVideo from '@imgly/plugin-ai-video-generation-web/fal-ai';

// Import middleware utilities
import { uploadMiddleware } from '@imgly/plugin-ai-generation-web';
```

## 2. Initialize CE.SDK

Initialize CE.SDK with Video mode to utilize all AI capabilities:

```typescript highlight=highlight-setup
    await cesdk.addPlugin(new VideoEditorConfig());

    // Add asset source plugins
    await cesdk.addPlugin(new BlurAssetSource());
    await cesdk.addPlugin(new CaptionPresetsAssetSource());
    await cesdk.addPlugin(new ColorPaletteAssetSource());
    await cesdk.addPlugin(new CropPresetsAssetSource());
    await cesdk.addPlugin(
      new UploadAssetSources({
        include: [
          'ly.img.image.upload',
          'ly.img.video.upload',
          'ly.img.audio.upload'
        ]
      })
    );
    await cesdk.addPlugin(
      new DemoAssetSources({
        include: [
          'ly.img.templates.video.*',
          'ly.img.image.*',
          'ly.img.audio.*',
          'ly.img.video.*'
        ]
      })
    );
    await cesdk.addPlugin(new EffectsAssetSource());
    await cesdk.addPlugin(new FiltersAssetSource());
    await cesdk.addPlugin(
      new PagePresetsAssetSource({
        include: [
          'ly.img.page.presets.instagram.*',
          'ly.img.page.presets.facebook.*',
          'ly.img.page.presets.x.*',
          'ly.img.page.presets.linkedin.*',
          'ly.img.page.presets.pinterest.*',
          'ly.img.page.presets.tiktok.*',
          'ly.img.page.presets.youtube.*',
          'ly.img.page.presets.video.*'
        ]
      })
    );
    await cesdk.addPlugin(new StickerAssetSource());
    await cesdk.addPlugin(new TextAssetSource());
    await cesdk.addPlugin(new TextComponentAssetSource());
    await cesdk.addPlugin(new TypefaceAssetSource());
    await cesdk.addPlugin(new VectorShapeAssetSource());

    await cesdk.actions.run('scene.create', {
      mode: 'Video',
      page: {
        sourceId: 'ly.img.page.presets',
        assetId: 'ly.img.page.presets.instagram.story'
      }
```

## 3. Configure UI Components

### AI Dock Button

The main entry point for AI features is the AI dock button. Position it at the beginning of the dock:

```typescript highlight=highlight-dock-position
// Configure AI Apps dock position
cesdk.ui.setComponentOrder({ in: 'ly.img.dock' }, [
  'ly.img.ai.apps.dock',
  ...cesdk.ui.getComponentOrder({ in: 'ly.img.dock' })
]);
```

### Canvas Menu Options

AI text and image transformations are available in the canvas context menu:

```typescript highlight=highlight-canvas-menu
// Add AI options to canvas menu
cesdk.ui.setComponentOrder({ in: 'ly.img.canvas.menu' }, [
  'ly.img.ai.text.canvasMenu',
  'ly.img.ai.image.canvasMenu',
  ...cesdk.ui.getComponentOrder({ in: 'ly.img.canvas.menu' })
]);
```

## 4. Add the AI Apps Plugin

Configure the AI Apps plugin with all providers:

```typescript highlight=highlight-add-plugin
    // Add the AI Apps plugin with all providers
    cesdk.addPlugin(
      AiApps({
        // IMPORTANT: dryRun mode simulates generation without API calls
        // Perfect for testing and development - remove for production use
        dryRun: true,
        providers: {
          // Text generation and transformation
          text2text: Anthropic.AnthropicProvider({
            proxyUrl: 'http://your-proxy-server.com/api/proxy',
            headers: {
              'x-client-version': '1.0.0',
              'x-request-source': 'cesdk-tutorial'
            },
            // Optional: Configure default property values
            properties: {
              temperature: { default: 0.7 },
              maxTokens: { default: 500 }
            }
          }),

          // Image generation - Multiple providers with selection UI
          text2image: [
            FalAiImage.RecraftV3({
              proxyUrl: 'http://your-proxy-server.com/api/proxy',
              headers: {
                'x-client-version': '1.0.0',
                'x-request-source': 'cesdk-tutorial'
              },
              // Add upload middleware to store generated images on your server
              middleware: [
                uploadMiddleware(async (output) => {
                  // Upload the generated image to your server
                  const result = await uploadToYourStorageServer(output.url);

                  // Return the output with your server's URL
                  return {
                    ...output,
                    url: result.permanentUrl
                  };
                })
              ]
            }),
            // Alternative with icon style support
            FalAiImage.Recraft20b({
              proxyUrl: 'http://your-proxy-server.com/api/proxy',
              headers: {
                'x-client-version': '1.0.0',
                'x-request-source': 'cesdk-tutorial'
              },
              // Configure dynamic defaults based on style type
              properties: {
                style: { default: 'broken_line' },
                image_size: { default: 'square_hd' }
              }
            }),
            // Additional image provider for user selection
            OpenAiImage.GptImage1.Text2Image({
              proxyUrl: 'http://your-proxy-server.com/api/proxy',
              headers: {
                'x-api-key': 'your-key',
                'x-request-source': 'cesdk-tutorial'
              }
            })
          ],

          // Image-to-image transformation
          image2image: FalAiImage.GeminiFlashEdit({
            proxyUrl: 'https://your-server.com/api/fal-ai-proxy',
            headers: {
              'x-client-version': '1.0.0',
              'x-request-source': 'cesdk-tutorial'
            }
          }),

          // Video generation - Multiple providers
          text2video: [
            FalAiVideo.MinimaxVideo01Live({
              proxyUrl: 'https://your-server.com/api/fal-ai-proxy',
              headers: {
                'x-client-version': '1.0.0',
                'x-request-source': 'cesdk-tutorial'
              }
            }),
            FalAiVideo.PixverseV35TextToVideo({
              proxyUrl: 'https://your-server.com/api/fal-ai-proxy',
              headers: {
                'x-client-version': '1.0.0',
                'x-request-source': 'cesdk-tutorial'
              }
            })
          ],
          image2video: FalAiVideo.MinimaxVideo01LiveImageToVideo({
            proxyUrl: 'https://your-server.com/api/fal-ai-proxy',
            headers: {
              'x-client-version': '1.0.0',
              'x-request-source': 'cesdk-tutorial'
            }
          }),

          // Audio generation
          text2speech: Elevenlabs.ElevenMultilingualV2({
            proxyUrl: 'https://your-server.com/api/elevenlabs-proxy',
            headers: {
              'x-client-version': '1.0.0',
              'x-request-source': 'cesdk-tutorial'
            }
          }),
          text2sound: Elevenlabs.ElevenSoundEffects({
            proxyUrl: 'https://your-server.com/api/elevenlabs-proxy',
            headers: {
              'x-client-version': '1.0.0',
              'x-request-source': 'cesdk-tutorial'
            }
          })
        }
      })
    );
```

### Testing with Dry-Run Mode

During development, use `dryRun: true` to simulate AI generation without making actual API calls:

```typescript highlight=highlight-dry-run
// IMPORTANT: dryRun mode simulates generation without API calls
// Perfect for testing and development - remove for production use
dryRun: true,
```

This helps verify your integration and UI flows without incurring API costs or requiring valid API keys.

## 5. AI Provider Configuration

Each AI provider type serves a specific purpose and creates different types of content:

### Text Generation (Anthropic)

```typescript highlight=highlight-text-provider
// Text generation and transformation
text2text: Anthropic.AnthropicProvider({
  proxyUrl: 'http://your-proxy-server.com/api/proxy',
  headers: {
    'x-client-version': '1.0.0',
    'x-request-source': 'cesdk-tutorial'
  },
  // Optional: Configure default property values
  properties: {
    temperature: { default: 0.7 },
    maxTokens: { default: 500 }
  }
}),
```

The text provider enables capabilities like:

- Improving writing quality
- Fixing spelling and grammar
- Making text shorter or longer
- Changing tone (professional, casual, friendly)
- Translating to different languages
- Custom text transformations

### Image Generation

Configure multiple image providers with selection UI:

```typescript highlight=highlight-image-providers
          // Image generation - Multiple providers with selection UI
          text2image: [
            FalAiImage.RecraftV3({
              proxyUrl: 'http://your-proxy-server.com/api/proxy',
              headers: {
                'x-client-version': '1.0.0',
                'x-request-source': 'cesdk-tutorial'
              },
              // Add upload middleware to store generated images on your server
              middleware: [
                uploadMiddleware(async (output) => {
                  // Upload the generated image to your server
                  const result = await uploadToYourStorageServer(output.url);

                  // Return the output with your server's URL
                  return {
                    ...output,
                    url: result.permanentUrl
                  };
                })
              ]
            }),
            // Alternative with icon style support
            FalAiImage.Recraft20b({
              proxyUrl: 'http://your-proxy-server.com/api/proxy',
              headers: {
                'x-client-version': '1.0.0',
                'x-request-source': 'cesdk-tutorial'
              },
              // Configure dynamic defaults based on style type
              properties: {
                style: { default: 'broken_line' },
                image_size: { default: 'square_hd' }
              }
            }),
            // Additional image provider for user selection
            OpenAiImage.GptImage1.Text2Image({
              proxyUrl: 'http://your-proxy-server.com/api/proxy',
              headers: {
                'x-api-key': 'your-key',
                'x-request-source': 'cesdk-tutorial'
              }
            })
          ],

          // Image-to-image transformation
          image2image: FalAiImage.GeminiFlashEdit({
            proxyUrl: 'https://your-server.com/api/fal-ai-proxy',
            headers: {
              'x-client-version': '1.0.0',
              'x-request-source': 'cesdk-tutorial'
            }
          }),
```

When multiple providers are configured, users will see a selection box to choose between them.

Image generation features include:

- Creating images from text descriptions
- Multiple style options (realistic, illustration, vector)
- Various size presets and custom dimensions
- Transforming existing images based on text prompts

### Video Generation

```typescript highlight=highlight-video-providers
// Video generation - Multiple providers
text2video: [
  FalAiVideo.MinimaxVideo01Live({
    proxyUrl: 'https://your-server.com/api/fal-ai-proxy',
    headers: {
      'x-client-version': '1.0.0',
      'x-request-source': 'cesdk-tutorial'
    }
  }),
  FalAiVideo.PixverseV35TextToVideo({
    proxyUrl: 'https://your-server.com/api/fal-ai-proxy',
    headers: {
      'x-client-version': '1.0.0',
      'x-request-source': 'cesdk-tutorial'
    }
  })
],
image2video: FalAiVideo.MinimaxVideo01LiveImageToVideo({
  proxyUrl: 'https://your-server.com/api/fal-ai-proxy',
  headers: {
    'x-client-version': '1.0.0',
    'x-request-source': 'cesdk-tutorial'
  }
}),
```

Video generation capabilities include:

- Creating videos from text descriptions
- Transforming still images into videos
- Fixed output dimensions (typically 1280×720)
- 5-second video duration

### Audio Generation (ElevenLabs)

```typescript highlight=highlight-audio-providers
// Audio generation
text2speech: Elevenlabs.ElevenMultilingualV2({
  proxyUrl: 'https://your-server.com/api/elevenlabs-proxy',
  headers: {
    'x-client-version': '1.0.0',
    'x-request-source': 'cesdk-tutorial'
  }
}),
text2sound: Elevenlabs.ElevenSoundEffects({
  proxyUrl: 'https://your-server.com/api/elevenlabs-proxy',
  headers: {
    'x-client-version': '1.0.0',
    'x-request-source': 'cesdk-tutorial'
  }
})
```

Audio generation features include:

- Text-to-speech with multiple voices
- Multilingual support
- Adjustable speaking speed
- Sound effect generation from text descriptions
- Creating ambient sounds and effects

## 6. Using Middleware

The AI generation framework supports middleware that can enhance or modify the generation process. Middleware functions are executed in sequence and can perform operations before generation, after generation, or both.

### Upload Middleware

The `uploadMiddleware` is useful when you need to store generated content on your server before it's used. First, create a helper function for your storage server:

```typescript highlight=highlight-upload-function
/**
 * Upload to your image storage server.
 * Replace this mock with your actual storage API call.
 */
async function uploadToYourStorageServer(imageUrl: string) {
  // In production, upload the image to your server:
  // const response = await fetch('https://your-server.com/api/store-image', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({
  //     imageUrl,
  //     metadata: { source: 'ai-generation' }
  //   })
  // });
  // return await response.json();

  // Mock: Return a fake response
  return { permanentUrl: imageUrl };
}
```

Then use `uploadMiddleware` to process generated outputs before they're added to the scene:

```typescript highlight=highlight-upload-middleware
              // Add upload middleware to store generated images on your server
              middleware: [
                uploadMiddleware(async (output) => {
                  // Upload the generated image to your server
                  const result = await uploadToYourStorageServer(output.url);

                  // Return the output with your server's URL
                  return {
                    ...output,
                    url: result.permanentUrl
                  };
                })
              ]
```

Use cases for upload middleware:

- Storing generated assets in your own cloud storage
- Adding watermarks or processing assets before use
- Tracking/logging generated content
- Implementing licensing or rights management

### Rate Limiting Middleware

To prevent abuse of AI services, you can implement rate limiting:

```typescript
import { rateLimitMiddleware } from '@imgly/plugin-ai-generation-web';

// In your provider configuration
middleware: [
  rateLimitMiddleware({
    maxRequests: 10,
    timeWindowMs: 60 * 60 * 1000, // 1 hour
    onRateLimitExceeded: (input, options, info) => {
      // Show a notice to the user
      console.log(`Rate limit reached: ${info.currentCount}/${info.maxRequests}`);
      return false; // Reject the request
    }
  })
]
```

### Custom Error Handling Middleware

You can create custom middleware for error handling:

```typescript
const errorMiddleware = async (input, options, next) => {
  try {
    return await next(input, options);
  } catch (error) {
    // Handle error (show UI notification, log, etc.)
    console.error('Generation failed:', error);
    // You can rethrow or return a fallback
    throw error;
  }
};
```

### Middleware Order

The order of middleware is important - they're executed in the sequence provided:

```typescript
middleware: [
  // Executes first
  rateLimitMiddleware({ maxRequests: 10, timeWindowMs: 3600000 }),

  // Executes second (only if rate limit wasn't exceeded)
  loggingMiddleware(),

  // Executes third (after generation completes)
  uploadMiddleware(async (output) => { /* ... */ })
]
```

## 7. Controlling Features with Feature API

You can control which AI features are available to users using CE.SDK's Feature API:

```typescript highlight=highlight-feature-control
    // Control AI features with Feature API
    // Disable specific quick actions
    cesdk.feature.enable(
      'ly.img.plugin-ai-image-generation-web.quickAction.editImage',
      false
    );
    cesdk.feature.enable(
      'ly.img.plugin-ai-text-generation-web.quickAction.translate',
      false
    );

    // Control input types for image/video generation
    cesdk.feature.enable(
      'ly.img.plugin-ai-image-generation-web.fromText',
      true
    );
    cesdk.feature.enable(
      'ly.img.plugin-ai-image-generation-web.fromImage',
      false
    );

    // Hide provider selection dropdowns
    cesdk.feature.enable(
      'ly.img.plugin-ai-image-generation-web.providerSelect',
      false
    );

    // Control style groups for specific providers
    cesdk.feature.enable(
      'ly.img.plugin-ai-image-generation-web.fal-ai/recraft-v3.style.vector',
      false
    );
```

This is useful for:

- Creating different feature tiers for different user groups
- Simplifying the UI by hiding unused features
- Temporarily disabling features during maintenance

For more details on available feature flags, see the [@imgly/plugin-ai-generation-web documentation](https://github.com/imgly/plugins/tree/main/packages/plugin-ai-generation-web#available-feature-flags).

## 8. Proxy Server Configuration

For security reasons, you should never include your AI service API keys directly in client-side code. Instead, you should set up proxy services that securely forward requests to AI providers while keeping your API keys secure on the server side.

Each AI provider configuration requires a `proxyUrl` parameter, which should point to your server-side endpoint that handles authentication and forwards requests to the AI service:

```typescript
text2image: FalAiImage.RecraftV3({
    proxyUrl: 'http://your-proxy-server.com/api/proxy'
});
```

Your proxy server should handle authentication, forward requests to the appropriate AI service providers, and manage response streaming for optimal performance.

## API Reference

| Method | Category | Purpose |
| --- | --- | --- |
| `cesdk.addPlugin()` | Plugin | Register and initialize the AI Apps plugin with CE.SDK |
| `AiApps()` | Plugin | Create unified plugin instance with all AI provider types |
| `Anthropic.AnthropicProvider()` | Text | Configure Claude for text generation and transformation |
| `FalAiImage.RecraftV3()` | Image | Configure RecraftV3 text-to-image with vector/raster support |
| `FalAiImage.Recraft20b()` | Image | Configure Recraft20b text-to-image with icon styles |
| `FalAiImage.GeminiFlashEdit()` | Image | Configure Gemini Flash for image-to-image transformation |
| `OpenAiImage.GptImage1.Text2Image()` | Image | Configure GPT Image for text-to-image generation |
| `FalAiVideo.MinimaxVideo01Live()` | Video | Configure Minimax Video for text-to-video generation |
| `FalAiVideo.MinimaxVideo01LiveImageToVideo()` | Video | Configure Minimax Video for image-to-video transformation |
| `FalAiVideo.PixverseV35TextToVideo()` | Video | Configure Pixverse for text-to-video generation |
| `Elevenlabs.ElevenMultilingualV2()` | Audio | Configure ElevenLabs for multilingual text-to-speech |
| `Elevenlabs.ElevenSoundEffects()` | Audio | Configure ElevenLabs for sound effect generation |
| `uploadMiddleware()` | Middleware | Process and store generated outputs before use |
| `rateLimitMiddleware()` | Middleware | Limit generation requests per time window |
| `cesdk.feature.enable()` | Feature | Control visibility of AI features and providers |
| `cesdk.ui.setComponentOrder({ in: 'ly.img.dock' }, order)` | UI | Position AI Apps button in the dock |
| `cesdk.ui.setComponentOrder({ in: 'ly.img.canvas.menu' }, order)` | UI | Add AI options to canvas context menu |
| `engine.asset.findAssets()` | Asset | Query generated assets from provider history sources |

## Next Steps

- [Proxy Server](./user-interface/ai-integration/proxy-server.md) — Set up secure API communication for production
- [Text Generation](./user-interface/ai-integration/text-generation.md) — Deep dive into text generation and transformation
- [Image Generation](./user-interface/ai-integration/image-generation.md) — Advanced image generation configuration
- [Video Generation](./user-interface/ai-integration/video-generation.md) — Video generation with multiple providers
- [Audio Generation](./user-interface/ai-integration/audio-generation.md) — Text-to-speech and sound effects
- [Custom Provider](./user-interface/ai-integration/custom-provider.md) — Create custom AI providers
- [Asset Library Basics](./import-media/asset-panel/basics.md) — Work with generated assets



---

## More Resources

- **[Svelte Documentation Index](https://img.ly/svelte.md)** - Browse all Svelte documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./svelte.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support