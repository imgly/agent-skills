> This is one page of the CE.SDK React documentation. For a complete overview, see the [React Documentation Index](https://img.ly/docs/cesdk/react.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [AI Integration](./user-interface/ai-integration.md) > [IMG.LY AI Gateway](./user-interface/ai-integration/gateway-provider.md) > [Plugins](./plugins.md) > [AI: IMG.LY AI Gateway](./user-interface/ai-integration/gateway-provider.md)

---

Connect CE.SDK to AI models for image, video, text, and audio generation through the IMG.LY AI Gateway.

![AI Generation with the IMG.LY AI Gateway](https://img.ly/docs/cesdk/./assets/browser.hero.webp)

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/tags/release-$UBQ_VERSION$.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/release-$UBQ_VERSION$/guides-user-interface-ai-integration-gateway-provider-browser)
>
> - [Open in StackBlitz](https://stackblitz.com/github/imgly/cesdk-web-examples/tree/v$UBQ_VERSION$/guides-user-interface-ai-integration-gateway-provider-browser)
>
> - [Live demo](https://img.ly/docs/cesdk/examples/guides-user-interface-ai-integration-gateway-provider-browser/)

The IMG.LY AI Gateway is a managed API service that sits between CE.SDK and upstream AI providers. Instead of configuring each provider separately with proxy URLs and API keys, we point all generation requests at a single gateway URL. The gateway handles model routing, authentication, billing, and credit management. Each content type has a dedicated `GatewayProvider` factory that fetches the model's OpenAPI schema and renders input fields automatically.

```typescript file=@cesdk_web_examples/guides-user-interface-ai-integration-gateway-provider-browser/browser.ts reference-only
import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';

import {
  BlurAssetSource,
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
import { DesignEditorConfig } from './design-editor/plugin';
import ImageGeneration from '@imgly/plugin-ai-image-generation-web';
import { GatewayProvider as ImageGatewayProvider } from '@imgly/plugin-ai-image-generation-web/gateway';
import TextGeneration from '@imgly/plugin-ai-text-generation-web';
import { GatewayProvider as TextGatewayProvider } from '@imgly/plugin-ai-text-generation-web/gateway';
import VideoGeneration from '@imgly/plugin-ai-video-generation-web';
import { GatewayProvider as VideoGatewayProvider } from '@imgly/plugin-ai-video-generation-web/gateway';
import AudioGeneration from '@imgly/plugin-ai-audio-generation-web';
import { GatewayProvider as AudioGatewayProvider } from '@imgly/plugin-ai-audio-generation-web/gateway';
import packageJson from './package.json';

class Example implements EditorPlugin {
  name = packageJson.name;
  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    await cesdk.addPlugin(new DesignEditorConfig());

    // Add asset source plugins
    await cesdk.addPlugin(new BlurAssetSource());
    await cesdk.addPlugin(new ColorPaletteAssetSource());
    await cesdk.addPlugin(new CropPresetsAssetSource());
    await cesdk.addPlugin(
      new UploadAssetSources({ include: ['ly.img.image.upload'] })
    );
    await cesdk.addPlugin(
      new DemoAssetSources({
        include: [
          'ly.img.templates.blank.*',
          'ly.img.templates.presentation.*',
          'ly.img.templates.print.*',
          'ly.img.templates.social.*',
          'ly.img.image.*'
        ]
      })
    );
    await cesdk.addPlugin(new EffectsAssetSource());
    await cesdk.addPlugin(new FiltersAssetSource());
    await cesdk.addPlugin(new PagePresetsAssetSource());
    await cesdk.addPlugin(new StickerAssetSource());
    await cesdk.addPlugin(new TextAssetSource());
    await cesdk.addPlugin(new TextComponentAssetSource());
    await cesdk.addPlugin(new TypefaceAssetSource());
    await cesdk.addPlugin(new VectorShapeAssetSource());

    await cesdk.actions.run('scene.create', {
      page: {
        sourceId: 'ly.img.page.presets',
        assetId: 'ly.img.page.presets.print.iso.a6.landscape'
      }
    });

    const engine = cesdk.engine;

    // Register a token action that CE.SDK calls before each generation request.
    // In production, this calls your backend endpoint to mint a short-lived JWT.
    cesdk.actions.register('ly.img.ai.getToken', async () => {
      const res = await fetch('/api/ai/token', { method: 'POST' });
      const { token } = await res.json();
      return token;
    });

    // Alternative: use a direct API key for development (not for production)
    /*
    cesdk.actions.register('ly.img.ai.getToken', async () => {
      return { dangerouslyExposeApiKey: 'sk_your_api_key' };
    });
    */

    // All gateway providers share this configuration.
    // An empty object uses sensible defaults (gateway URL, token action ID, etc.).
    const gatewayConfig = {
      debug: true
    };

    // Configure image generation with text-to-image and image-to-image providers
    await cesdk.addPlugin(
      ImageGeneration({
        providers: {
          text2image: ImageGatewayProvider('fal-ai/flux/dev', gatewayConfig),
          image2image: ImageGatewayProvider(
            'fal-ai/flux-kontext/edit',
            gatewayConfig
          )
        }
      })
    );

    // Configure text generation with streaming output
    await cesdk.addPlugin(
      TextGeneration({
        providers: {
          text2text: TextGatewayProvider('openai/gpt-4o', gatewayConfig)
        }
      })
    );

    // Configure video generation with text-to-video and image-to-video providers
    await cesdk.addPlugin(
      VideoGeneration({
        providers: {
          text2video: VideoGatewayProvider('fal-ai/veo3.1', gatewayConfig),
          image2video: VideoGatewayProvider(
            'fal-ai/kling-video/v2.1/standard/image-to-video',
            gatewayConfig
          )
        }
      })
    );

    // Configure audio generation with text-to-speech
    await cesdk.addPlugin(
      AudioGeneration({
        providers: {
          text2speech: AudioGatewayProvider(
            'elevenlabs/multilingual-v2',
            gatewayConfig
          )
        }
      })
    );

    // You can also pass arrays of providers to offer model selection in the UI
    /*
    await cesdk.addPlugin(
      ImageGeneration({
        providers: {
          text2image: [
            ImageGatewayProvider('fal-ai/flux/dev', gatewayConfig),
            ImageGatewayProvider('fal-ai/recraft-v3', gatewayConfig)
          ]
        }
      })
    );
    */

    // Add middleware for logging or rate limiting
    /*
    import {
      loggingMiddleware,
      rateLimitMiddleware,
    } from '@imgly/plugin-ai-generation-web';

    await cesdk.addPlugin(
      ImageGeneration({
        providers: {
          text2image: ImageGatewayProvider('fal-ai/flux/dev', gatewayConfig),
        },
        middleware: [loggingMiddleware(), rateLimitMiddleware({ maxRequests: 10, timeWindow: 60000 })],
      })
    );
    */

    // Customize provider labels in the UI
    /*
    cesdk.i18n.setTranslations({
      en: {
        'ly.img.plugin-ai-image-generation-web.gateway/fal-ai/flux/dev.defaults.property.prompt':
          'Describe your image',
      },
    });
    */
  }
}

export default Example;
```

This guide covers obtaining an API key, setting up token-based authentication, configuring gateway providers for each content type (image, text, video, audio), and customizing provider behavior.

## Prerequisites

Before setting up gateway providers, you need:

- CE.SDK with the relevant AI generation plugin packages installed
- An IMG.LY account with a gateway API key from the [Dashboard](https://img.ly/dashboard)
- For production: a backend endpoint that mints short-lived JWT tokens

## Obtaining an API Key

We create and manage API keys in the IMG.LY Dashboard. Keys use the `sk_` prefix and control which AI models and services your application can access. You configure model access scopes and credit budgets per key in the Dashboard.

## Authentication

The gateway uses token-based authentication. Your API key (`sk_...`) should never be exposed in client-side code. Instead, we implement a token endpoint on your server that mints short-lived JWT tokens by calling the gateway's `POST /v1/tokens` endpoint. CE.SDK retrieves these tokens through a registered action.

### Backend Token Endpoint (Production)

The token endpoint drops into any existing backend with minimal effort. The handler does one thing: forward a `POST /v1/tokens` request to the gateway with our API key in the `Authorization` header and return the minted JWT to the client. No SDK, no database, no state — a single HTTP call. Optionally pass a `sub` claim to identify the end user for per-user rate limiting.

The example below uses Express, but the same pattern works in any HTTP framework or language — Fastify, Hono, Next.js route handlers, FastAPI, Rails, Go's `net/http`, ASP.NET, and so on. The only requirement is the ability to make an outbound HTTP request and keep the API key out of client-side code.

```typescript
// Express — any backend framework or language works the same way
app.post('/api/ai/token', async (req, res) => {
  const response = await fetch('https://gateway.img.ly/v1/tokens', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.IMGLY_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ sub: req.user?.id })
  });
  const { token } = await response.json();
  res.json({ token });
});
```

On the frontend, we register a token action that CE.SDK calls automatically before each generation request. Tokens are cached for 5 minutes by default (configurable via `tokenCacheTTL`).

```typescript highlight-token-action
// Register a token action that CE.SDK calls before each generation request.
// In production, this calls your backend endpoint to mint a short-lived JWT.
cesdk.actions.register('ly.img.ai.getToken', async () => {
  const res = await fetch('/api/ai/token', { method: 'POST' });
  const { token } = await res.json();
  return token;
});
```

### Direct API Key (Development and Internal Tools)

For local development or internal tools where all users are trusted, we can pass the API key directly. The key is visible in DevTools, so do not use this approach in public-facing applications.

We return `{ dangerouslyExposeApiKey: 'sk_...' }` from the token action. CE.SDK rejects raw `sk_` strings — the wrapper object makes the security trade-off explicit. Manage exposure via key scopes and credit budgets in the Dashboard.

```typescript highlight-direct-api-key
cesdk.actions.register('ly.img.ai.getToken', async () => {
  return { dangerouslyExposeApiKey: 'sk_your_api_key' };
});
```

## Gateway Provider Configuration

All gateway providers share a `GatewayProviderConfiguration` object. An empty object is sufficient in most cases — the gateway URL and token action ID have sensible defaults.

```typescript highlight-gateway-config
// All gateway providers share this configuration.
// An empty object uses sensible defaults (gateway URL, token action ID, etc.).
const gatewayConfig = {
  debug: true
};
```

The available configuration options are:

- **`gatewayUrl`**: Base URL of the gateway service. Defaults to `'https://gateway.img.ly'`.
- **`history`**: Where generated assets are stored. Defaults to `'@imgly/indexedDB'`. Set to `'@imgly/local'` for in-memory storage or `false` to disable.
- **`tokenActionId`**: Action ID for token retrieval. Defaults to `'ly.img.ai.getToken'`.
- **`tokenCacheTTL`**: Token cache duration in milliseconds. Defaults to `300000` (5 minutes).
- **`onError`**: Called when schema loading or provider initialization fails.
- **`debug`**: Enable console logging for troubleshooting.

## Setting Up Image Generation

We import `GatewayProvider` from `@imgly/plugin-ai-image-generation-web/gateway` and the default export from `@imgly/plugin-ai-image-generation-web`. We create providers via `GatewayProvider(modelId, config)` for text-to-image and image-to-image models.

The image provider fetches the model schema, renders input fields, uploads local blob/buffer URLs, and creates placeholder blocks that fill with the generated result.

```typescript highlight-image-generation
import ImageGeneration from '@imgly/plugin-ai-image-generation-web';
import { GatewayProvider as ImageGatewayProvider } from '@imgly/plugin-ai-image-generation-web/gateway';
import TextGeneration from '@imgly/plugin-ai-text-generation-web';
import { GatewayProvider as TextGatewayProvider } from '@imgly/plugin-ai-text-generation-web/gateway';
import VideoGeneration from '@imgly/plugin-ai-video-generation-web';
import { GatewayProvider as VideoGatewayProvider } from '@imgly/plugin-ai-video-generation-web/gateway';
import AudioGeneration from '@imgly/plugin-ai-audio-generation-web';
import { GatewayProvider as AudioGatewayProvider } from '@imgly/plugin-ai-audio-generation-web/gateway';
import packageJson from './package.json';

class Example implements EditorPlugin {
  name = packageJson.name;
  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    await cesdk.addPlugin(new DesignEditorConfig());

    // Add asset source plugins
    await cesdk.addPlugin(new BlurAssetSource());
    await cesdk.addPlugin(new ColorPaletteAssetSource());
    await cesdk.addPlugin(new CropPresetsAssetSource());
    await cesdk.addPlugin(
      new UploadAssetSources({ include: ['ly.img.image.upload'] })
    );
    await cesdk.addPlugin(
      new DemoAssetSources({
        include: [
          'ly.img.templates.blank.*',
          'ly.img.templates.presentation.*',
          'ly.img.templates.print.*',
          'ly.img.templates.social.*',
          'ly.img.image.*'
        ]
      })
    );
    await cesdk.addPlugin(new EffectsAssetSource());
    await cesdk.addPlugin(new FiltersAssetSource());
    await cesdk.addPlugin(new PagePresetsAssetSource());
    await cesdk.addPlugin(new StickerAssetSource());
    await cesdk.addPlugin(new TextAssetSource());
    await cesdk.addPlugin(new TextComponentAssetSource());
    await cesdk.addPlugin(new TypefaceAssetSource());
    await cesdk.addPlugin(new VectorShapeAssetSource());

    await cesdk.actions.run('scene.create', {
      page: {
        sourceId: 'ly.img.page.presets',
        assetId: 'ly.img.page.presets.print.iso.a6.landscape'
      }
    });

    const engine = cesdk.engine;

    // Register a token action that CE.SDK calls before each generation request.
    // In production, this calls your backend endpoint to mint a short-lived JWT.
    cesdk.actions.register('ly.img.ai.getToken', async () => {
      const res = await fetch('/api/ai/token', { method: 'POST' });
      const { token } = await res.json();
      return token;
    });

    // Alternative: use a direct API key for development (not for production)
    /*
    cesdk.actions.register('ly.img.ai.getToken', async () => {
      return { dangerouslyExposeApiKey: 'sk_your_api_key' };
    });
    */

    // All gateway providers share this configuration.
    // An empty object uses sensible defaults (gateway URL, token action ID, etc.).
    const gatewayConfig = {
      debug: true
    };

    // Configure image generation with text-to-image and image-to-image providers
    await cesdk.addPlugin(
      ImageGeneration({
        providers: {
          text2image: ImageGatewayProvider('fal-ai/flux/dev', gatewayConfig),
          image2image: ImageGatewayProvider(
            'fal-ai/flux-kontext/edit',
            gatewayConfig
          )
        }
      })
    );
```

## Setting Up Text Generation

We import `GatewayProvider` from `@imgly/plugin-ai-text-generation-web/gateway` and register it under `providers.text2text`. The text provider streams responses via SSE delta events and applies them to text blocks in real time. It maps `prompt` input to `messages: [{ role: 'user', content: prompt }]` automatically.

```typescript highlight-text-generation
import TextGeneration from '@imgly/plugin-ai-text-generation-web';
import { GatewayProvider as TextGatewayProvider } from '@imgly/plugin-ai-text-generation-web/gateway';
import VideoGeneration from '@imgly/plugin-ai-video-generation-web';
import { GatewayProvider as VideoGatewayProvider } from '@imgly/plugin-ai-video-generation-web/gateway';
import AudioGeneration from '@imgly/plugin-ai-audio-generation-web';
import { GatewayProvider as AudioGatewayProvider } from '@imgly/plugin-ai-audio-generation-web/gateway';
import packageJson from './package.json';

class Example implements EditorPlugin {
  name = packageJson.name;
  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    await cesdk.addPlugin(new DesignEditorConfig());

    // Add asset source plugins
    await cesdk.addPlugin(new BlurAssetSource());
    await cesdk.addPlugin(new ColorPaletteAssetSource());
    await cesdk.addPlugin(new CropPresetsAssetSource());
    await cesdk.addPlugin(
      new UploadAssetSources({ include: ['ly.img.image.upload'] })
    );
    await cesdk.addPlugin(
      new DemoAssetSources({
        include: [
          'ly.img.templates.blank.*',
          'ly.img.templates.presentation.*',
          'ly.img.templates.print.*',
          'ly.img.templates.social.*',
          'ly.img.image.*'
        ]
      })
    );
    await cesdk.addPlugin(new EffectsAssetSource());
    await cesdk.addPlugin(new FiltersAssetSource());
    await cesdk.addPlugin(new PagePresetsAssetSource());
    await cesdk.addPlugin(new StickerAssetSource());
    await cesdk.addPlugin(new TextAssetSource());
    await cesdk.addPlugin(new TextComponentAssetSource());
    await cesdk.addPlugin(new TypefaceAssetSource());
    await cesdk.addPlugin(new VectorShapeAssetSource());

    await cesdk.actions.run('scene.create', {
      page: {
        sourceId: 'ly.img.page.presets',
        assetId: 'ly.img.page.presets.print.iso.a6.landscape'
      }
    });

    const engine = cesdk.engine;

    // Register a token action that CE.SDK calls before each generation request.
    // In production, this calls your backend endpoint to mint a short-lived JWT.
    cesdk.actions.register('ly.img.ai.getToken', async () => {
      const res = await fetch('/api/ai/token', { method: 'POST' });
      const { token } = await res.json();
      return token;
    });

    // Alternative: use a direct API key for development (not for production)
    /*
    cesdk.actions.register('ly.img.ai.getToken', async () => {
      return { dangerouslyExposeApiKey: 'sk_your_api_key' };
    });
    */

    // All gateway providers share this configuration.
    // An empty object uses sensible defaults (gateway URL, token action ID, etc.).
    const gatewayConfig = {
      debug: true
    };

    // Configure image generation with text-to-image and image-to-image providers
    await cesdk.addPlugin(
      ImageGeneration({
        providers: {
          text2image: ImageGatewayProvider('fal-ai/flux/dev', gatewayConfig),
          image2image: ImageGatewayProvider(
            'fal-ai/flux-kontext/edit',
            gatewayConfig
          )
        }
      })
    );

    // Configure text generation with streaming output
    await cesdk.addPlugin(
      TextGeneration({
        providers: {
          text2text: TextGatewayProvider('openai/gpt-4o', gatewayConfig)
        }
      })
    );
```

## Setting Up Video Generation

We import `GatewayProvider` from `@imgly/plugin-ai-video-generation-web/gateway`. We create providers for text-to-video and image-to-video models. The video provider handles local image uploads, aspect ratio matching, and duration parsing.

```typescript highlight-video-generation
import VideoGeneration from '@imgly/plugin-ai-video-generation-web';
import { GatewayProvider as VideoGatewayProvider } from '@imgly/plugin-ai-video-generation-web/gateway';
import AudioGeneration from '@imgly/plugin-ai-audio-generation-web';
import { GatewayProvider as AudioGatewayProvider } from '@imgly/plugin-ai-audio-generation-web/gateway';
import packageJson from './package.json';

class Example implements EditorPlugin {
  name = packageJson.name;
  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    await cesdk.addPlugin(new DesignEditorConfig());

    // Add asset source plugins
    await cesdk.addPlugin(new BlurAssetSource());
    await cesdk.addPlugin(new ColorPaletteAssetSource());
    await cesdk.addPlugin(new CropPresetsAssetSource());
    await cesdk.addPlugin(
      new UploadAssetSources({ include: ['ly.img.image.upload'] })
    );
    await cesdk.addPlugin(
      new DemoAssetSources({
        include: [
          'ly.img.templates.blank.*',
          'ly.img.templates.presentation.*',
          'ly.img.templates.print.*',
          'ly.img.templates.social.*',
          'ly.img.image.*'
        ]
      })
    );
    await cesdk.addPlugin(new EffectsAssetSource());
    await cesdk.addPlugin(new FiltersAssetSource());
    await cesdk.addPlugin(new PagePresetsAssetSource());
    await cesdk.addPlugin(new StickerAssetSource());
    await cesdk.addPlugin(new TextAssetSource());
    await cesdk.addPlugin(new TextComponentAssetSource());
    await cesdk.addPlugin(new TypefaceAssetSource());
    await cesdk.addPlugin(new VectorShapeAssetSource());

    await cesdk.actions.run('scene.create', {
      page: {
        sourceId: 'ly.img.page.presets',
        assetId: 'ly.img.page.presets.print.iso.a6.landscape'
      }
    });

    const engine = cesdk.engine;

    // Register a token action that CE.SDK calls before each generation request.
    // In production, this calls your backend endpoint to mint a short-lived JWT.
    cesdk.actions.register('ly.img.ai.getToken', async () => {
      const res = await fetch('/api/ai/token', { method: 'POST' });
      const { token } = await res.json();
      return token;
    });

    // Alternative: use a direct API key for development (not for production)
    /*
    cesdk.actions.register('ly.img.ai.getToken', async () => {
      return { dangerouslyExposeApiKey: 'sk_your_api_key' };
    });
    */

    // All gateway providers share this configuration.
    // An empty object uses sensible defaults (gateway URL, token action ID, etc.).
    const gatewayConfig = {
      debug: true
    };

    // Configure image generation with text-to-image and image-to-image providers
    await cesdk.addPlugin(
      ImageGeneration({
        providers: {
          text2image: ImageGatewayProvider('fal-ai/flux/dev', gatewayConfig),
          image2image: ImageGatewayProvider(
            'fal-ai/flux-kontext/edit',
            gatewayConfig
          )
        }
      })
    );

    // Configure text generation with streaming output
    await cesdk.addPlugin(
      TextGeneration({
        providers: {
          text2text: TextGatewayProvider('openai/gpt-4o', gatewayConfig)
        }
      })
    );

    // Configure video generation with text-to-video and image-to-video providers
    await cesdk.addPlugin(
      VideoGeneration({
        providers: {
          text2video: VideoGatewayProvider('fal-ai/veo3.1', gatewayConfig),
          image2video: VideoGatewayProvider(
            'fal-ai/kling-video/v2.1/standard/image-to-video',
            gatewayConfig
          )
        }
      })
    );
```

## Setting Up Audio Generation

We import `GatewayProvider` from `@imgly/plugin-ai-audio-generation-web/gateway`. The audio provider fetches the generated audio blob to derive duration and generates a waveform thumbnail.

```typescript highlight-audio-generation
import AudioGeneration from '@imgly/plugin-ai-audio-generation-web';
import { GatewayProvider as AudioGatewayProvider } from '@imgly/plugin-ai-audio-generation-web/gateway';
import packageJson from './package.json';

class Example implements EditorPlugin {
  name = packageJson.name;
  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    await cesdk.addPlugin(new DesignEditorConfig());

    // Add asset source plugins
    await cesdk.addPlugin(new BlurAssetSource());
    await cesdk.addPlugin(new ColorPaletteAssetSource());
    await cesdk.addPlugin(new CropPresetsAssetSource());
    await cesdk.addPlugin(
      new UploadAssetSources({ include: ['ly.img.image.upload'] })
    );
    await cesdk.addPlugin(
      new DemoAssetSources({
        include: [
          'ly.img.templates.blank.*',
          'ly.img.templates.presentation.*',
          'ly.img.templates.print.*',
          'ly.img.templates.social.*',
          'ly.img.image.*'
        ]
      })
    );
    await cesdk.addPlugin(new EffectsAssetSource());
    await cesdk.addPlugin(new FiltersAssetSource());
    await cesdk.addPlugin(new PagePresetsAssetSource());
    await cesdk.addPlugin(new StickerAssetSource());
    await cesdk.addPlugin(new TextAssetSource());
    await cesdk.addPlugin(new TextComponentAssetSource());
    await cesdk.addPlugin(new TypefaceAssetSource());
    await cesdk.addPlugin(new VectorShapeAssetSource());

    await cesdk.actions.run('scene.create', {
      page: {
        sourceId: 'ly.img.page.presets',
        assetId: 'ly.img.page.presets.print.iso.a6.landscape'
      }
    });

    const engine = cesdk.engine;

    // Register a token action that CE.SDK calls before each generation request.
    // In production, this calls your backend endpoint to mint a short-lived JWT.
    cesdk.actions.register('ly.img.ai.getToken', async () => {
      const res = await fetch('/api/ai/token', { method: 'POST' });
      const { token } = await res.json();
      return token;
    });

    // Alternative: use a direct API key for development (not for production)
    /*
    cesdk.actions.register('ly.img.ai.getToken', async () => {
      return { dangerouslyExposeApiKey: 'sk_your_api_key' };
    });
    */

    // All gateway providers share this configuration.
    // An empty object uses sensible defaults (gateway URL, token action ID, etc.).
    const gatewayConfig = {
      debug: true
    };

    // Configure image generation with text-to-image and image-to-image providers
    await cesdk.addPlugin(
      ImageGeneration({
        providers: {
          text2image: ImageGatewayProvider('fal-ai/flux/dev', gatewayConfig),
          image2image: ImageGatewayProvider(
            'fal-ai/flux-kontext/edit',
            gatewayConfig
          )
        }
      })
    );

    // Configure text generation with streaming output
    await cesdk.addPlugin(
      TextGeneration({
        providers: {
          text2text: TextGatewayProvider('openai/gpt-4o', gatewayConfig)
        }
      })
    );

    // Configure video generation with text-to-video and image-to-video providers
    await cesdk.addPlugin(
      VideoGeneration({
        providers: {
          text2video: VideoGatewayProvider('fal-ai/veo3.1', gatewayConfig),
          image2video: VideoGatewayProvider(
            'fal-ai/kling-video/v2.1/standard/image-to-video',
            gatewayConfig
          )
        }
      })
    );

    // Configure audio generation with text-to-speech
    await cesdk.addPlugin(
      AudioGeneration({
        providers: {
          text2speech: AudioGatewayProvider(
            'elevenlabs/multilingual-v2',
            gatewayConfig
          )
        }
      })
    );
```

## Multiple Providers and Model Selection

When we configure arrays of providers for a content type, CE.SDK shows a model selection dropdown. Gateway and direct providers can be combined in the same plugin.

```typescript highlight-multiple-providers
await cesdk.addPlugin(
  ImageGeneration({
    providers: {
      text2image: [
        ImageGatewayProvider('fal-ai/flux/dev', gatewayConfig),
        ImageGatewayProvider('fal-ai/recraft-v3', gatewayConfig)
      ]
    }
  })
);
```

## Dynamic Model Discovery

We can also fetch available models from the gateway API to create providers dynamically. Calling `GET /v1/models?groupBy=capability` with your token returns models grouped by capability (`text2image`, `image2image`, `text2text`, `text2video`, `image2video`, `text2speech`). We loop over the results and instantiate the matching `GatewayProvider` for each model.

## Middleware

Gateway providers use the same middleware system as direct providers. We import `loggingMiddleware`, `rateLimitMiddleware`, or `uploadMiddleware` from `@imgly/plugin-ai-generation-web` and pass them via the plugin's `middleware` option.

```typescript highlight-middleware
    import {
      loggingMiddleware,
      rateLimitMiddleware,
    } from '@imgly/plugin-ai-generation-web';

    await cesdk.addPlugin(
      ImageGeneration({
        providers: {
          text2image: ImageGatewayProvider('fal-ai/flux/dev', gatewayConfig),
        },
        middleware: [loggingMiddleware(), rateLimitMiddleware({ maxRequests: 10, timeWindow: 60000 })],
      })
    );
```

## Customizing Labels and Translations

Gateway providers register translation keys using the pattern `ly.img.plugin-ai-{kind}-generation-web.gateway/{modelId}.defaults.property.{propertyId}`. We override these via `cesdk.i18n.setTranslations()` before plugin initialization.

```typescript highlight-translations
cesdk.i18n.setTranslations({
  en: {
    'ly.img.plugin-ai-image-generation-web.gateway/fal-ai/flux/dev.defaults.property.prompt':
      'Describe your image',
  },
});
```

## Troubleshooting

Common issues when configuring gateway providers:

**"returned a raw API key" error**: The token action returned a string starting with `sk_`. Either use the `{ dangerouslyExposeApiKey }` wrapper or implement a backend token endpoint.

**"returned an empty token string"**: The token action returned an empty string. Check your backend endpoint returns a valid JWT.

**Schema loading fails**: If using a custom `gatewayUrl`, verify it is correct and accessible. Check the `onError` callback for details.

**Generation returns 401**: The JWT has expired or the API key was revoked. Check the `tokenCacheTTL` setting and Dashboard key status.

**Model not available**: The API key's scopes may not include the requested model. Check scope configuration in the Dashboard.

**Local images not uploading**: The gateway provider uploads `blob:` and `buffer:` URLs automatically. Ensure the gateway URL supports the `/v1/uploads` endpoint.

**Credit errors**: Check your credit balance in the IMG.LY Dashboard. Credits are claimed before generation and released on failure.

**CORS errors**: The gateway must allow requests from your application's origin.

## API Reference

| Method / Type                  | Category   | Purpose                                                         |
| ------------------------------ | ---------- | --------------------------------------------------------------- |
| `GatewayProvider()` (image)    | Provider   | Create image generation provider for a gateway model            |
| `GatewayProvider()` (text)     | Provider   | Create text generation provider with streaming                  |
| `GatewayProvider()` (video)    | Provider   | Create video generation provider for a gateway model            |
| `GatewayProvider()` (audio)    | Provider   | Create audio generation provider for a gateway model            |
| `createGatewayProvider()`      | Core       | Generic factory for building custom gateway providers           |
| `createGatewayClient()`        | Core       | Create a low-level HTTP client for the gateway API              |
| `GatewayProviderConfiguration` | Type       | Configuration interface shared by all gateway providers         |
| `GatewayTokenActionResult`     | Type       | Return type for the token action (string or dangerouslyExposeApiKey) |
| `ImageGeneration`              | Plugin     | Default export from `@imgly/plugin-ai-image-generation-web`     |
| `TextGeneration`               | Plugin     | Default export from `@imgly/plugin-ai-text-generation-web`      |
| `VideoGeneration`              | Plugin     | Default export from `@imgly/plugin-ai-video-generation-web`     |
| `AudioGeneration`              | Plugin     | Default export from `@imgly/plugin-ai-audio-generation-web`     |
| `loggingMiddleware`            | Middleware | Log generation requests and responses                           |
| `rateLimitMiddleware`          | Middleware | Rate-limit generation requests                                  |
| `uploadMiddleware`             | Middleware | Handle file uploads for generation inputs                       |
| `cesdk.addPlugin()`            | Plugin     | Register a plugin with the editor                               |
| `cesdk.actions.register()`     | Action     | Register a named action (used for token retrieval)              |
| `cesdk.i18n.setTranslations()` | I18n       | Customize UI labels and translations                            |

## Next Steps

- [Image Generation](./user-interface/ai-integration/image-generation.md) — Direct provider configuration for image models
- [Text Generation](./user-interface/ai-integration/text-generation.md) — Direct provider configuration for text models
- [Video Generation](./user-interface/ai-integration/video-generation.md) — Direct provider configuration for video models
- [Audio Generation](./user-interface/ai-integration/audio-generation.md) — Direct provider configuration for audio models
- [Custom Provider](./user-interface/ai-integration/custom-provider.md) — Build a provider from scratch using the core interface
- [Integrate AI Features](./user-interface/ai-integration/integrate.md) — Overview of AI integration in CE.SDK



---

## More Resources

- **[React Documentation Index](https://img.ly/docs/cesdk/react.md)** - Browse all React documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./react.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support