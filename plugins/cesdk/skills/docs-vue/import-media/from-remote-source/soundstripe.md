> This is one page of the CE.SDK Vue documentation. For a complete overview, see the [Vue Documentation Index](https://img.ly/vue.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Import Media Assets](./import-media.md) > [Import From Remote Source](./import-media/from-remote-source.md) > [From Soundstripe](./import-media/from-remote-source/soundstripe.md)

---

Integrate Soundstripe's vast library of royalty-free audio tracks directly
into CE.SDK, enabling users to search and add high-quality music to their
designs.

![Soundstripe audio integration](https://img.ly/docs/cesdk/./assets/browser.hero.webp)

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/heads/main.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples)
>
> - [Open in StackBlitz](https://stackblitz.com/~/github.com/imgly/cesdk-web-examples)
>
> - [Live demo](https://img.ly/examples/guides-import-media-from-remote-source-soundstripe-browser/)

Soundstripe provides a vast library of high-quality, royalty-free audio tracks through their API. This guide shows you how to integrate Soundstripe's audio search and browsing capabilities directly into CE.SDK using the official `@imgly/plugin-soundstripe-web` plugin. You'll learn how to set up Soundstripe API authentication (including proxy server requirements for production), implement search and discovery features, configure the asset library UI, and handle automatic URI refresh for expired audio links.

```typescript file=@cesdk_web_examples/guides-import-media-from-remote-source-soundstripe-browser/browser.ts reference-only
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
import SoundstripePlugin from '@imgly/plugin-soundstripe-web';
import { refreshSoundstripeAudioURIs } from '@imgly/plugin-soundstripe-web';
import packageJson from './package.json';

/**
 * CE.SDK Plugin: Soundstripe Audio Integration
 *
 * Demonstrates integrating Soundstripe's audio library into CE.SDK:
 * - Adding the Soundstripe plugin
 * - Configuring API authentication (direct or proxy)
 * - Adding Soundstripe to the audio asset library
 * - Automatic URI refresh for expired audio links
 * - Manual URI refresh utility
 */
class Example implements EditorPlugin {
  name = packageJson.name;
  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    const engine = cesdk.engine;
    await cesdk.addPlugin(new VideoEditorConfig());

    // Add asset source plugins
    await cesdk.addPlugin(new BlurAssetSource());
    await cesdk.addPlugin(new CaptionPresetsAssetSource());
    await cesdk.addPlugin(new ColorPaletteAssetSource());
    await cesdk.addPlugin(new CropPresetsAssetSource());
    await cesdk.addPlugin(
      new UploadAssetSources({
        include: ['ly.img.image.upload', 'ly.img.video.upload', 'ly.img.audio.upload']
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
    });

    // Configure Soundstripe plugin with proxy server
    // The proxy securely handles API authentication without exposing keys in the frontend
    // Set up your own proxy server following:
    // https://docs.soundstripe.com/docs/integrating-soundstripes-content-into-your-application
    const proxyUrl =
      import.meta.env.VITE_SOUNDSTRIPE_PROXY_URL ||
      'https://your-proxy-server.example.com';

    await cesdk.addPlugin(
      SoundstripePlugin({
        baseUrl: proxyUrl
      })
    );

    // Configure localization for the asset library
    cesdk.i18n.setTranslations({
      en: {
        'libraries.soundstripe.label': 'Soundstripe'
      }
    });

    // Configure the asset library UI with a dedicated Soundstripe dock entry
    cesdk.ui.addAssetLibraryEntry({
      id: 'soundstripe',
      sourceIds: ['ly.img.audio.soundstripe'],
      previewLength: 6,
      gridColumns: 2,
      gridItemHeight: 'auto',
      cardLabel: (assetResult) => assetResult.label
    });

    // Add Soundstripe to the existing Audio asset library
    cesdk.ui.updateAssetLibraryEntry('ly.img.audio', {
      sourceIds: ({ currentIds }) => [...currentIds, 'ly.img.audio.soundstripe']
    });

    // Add Soundstripe as the first button in the dock with a separator
    cesdk.ui.setComponentOrder({ in: 'ly.img.dock' }, [
      {
        id: 'ly.img.assetLibrary.dock',
        key: 'soundstripe',
        label: 'libraries.soundstripe.label',
        entries: ['soundstripe']
      },
      { id: 'ly.img.separator' },
      ...cesdk.ui.getComponentOrder({ in: 'ly.img.dock' })
    ]);

    // Example: Manual URI refresh utility
    // This is useful if you need to manually refresh expired URIs
    // The plugin handles automatic refresh during scene loading and playback
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const handleManualRefresh = async () => {
      await refreshSoundstripeAudioURIs(engine, { baseUrl: proxyUrl });
    };

    // You can call this function when needed
    // For example, when loading a scene or before playback
    // handleManualRefresh();
  }
}

export default Example;
```

This guide covers installing the Soundstripe plugin, configuring API authentication with direct access or proxy server, adding Soundstripe to the audio asset library, understanding URI expiration and automatic refresh, and manually triggering URI refresh when needed.

## Prerequisites

Before integrating Soundstripe, ensure you have:

- The `@imgly/plugin-soundstripe-web` package installed via npm, yarn, or pnpm
- A Soundstripe API key from [Soundstripe](https://soundstripe.com/)
- A proxy server setup to handle API authentication securely

**IMPORTANT**: For production use, you must set up your own proxy server. Follow [Soundstripe's integration guide](https://docs.soundstripe.com/docs/integrating-soundstripes-content-into-your-application) which covers:

- **Option 1**: Direct API integration (client-side)
- **Option 2**: Proxy server setup (recommended for production)

The proxy approach handles authentication securely, prevents exposing API keys in client-side code, ensures CORS compliance, and maintains stable API access.

## Installing the Soundstripe Plugin

Install the plugin package using a package manager:

```bash
pnpm add @imgly/plugin-soundstripe-web
# or
yarn add @imgly/plugin-soundstripe-web
# or
npm install @imgly/plugin-soundstripe-web
```

## Configuring the Plugin

The Soundstripe plugin requires configuration with either a proxy server (recommended for production) or direct API access (development only).

### Proxy Server Setup (Recommended)

Configure the plugin with a proxy server base URL to keep your API key secure:

```typescript highlight-plugin-configuration
    // Configure Soundstripe plugin with proxy server
    // The proxy securely handles API authentication without exposing keys in the frontend
    // Set up your own proxy server following:
    // https://docs.soundstripe.com/docs/integrating-soundstripes-content-into-your-application
    const proxyUrl =
      import.meta.env.VITE_SOUNDSTRIPE_PROXY_URL ||
      'https://your-proxy-server.example.com';

    await cesdk.addPlugin(
      SoundstripePlugin({
        baseUrl: proxyUrl
      })
    );
```

The proxy server handles Soundstripe API authentication server-side, preventing exposure of your API key in the frontend code. This is the recommended approach for both development and production environments.

### Direct API Access (Development Only)

For local development and testing, you can configure the plugin with a direct API key:

```typescript
const apiKey = import.meta.env.VITE_SOUNDSTRIPE_API_KEY;

await cesdk.addPlugin(
  SoundstripePlugin({
    apiKey,
  }),
);
```

This approach should not be used in production as it exposes your API key in the frontend code.

## Plugin Configuration Parameters

The plugin configuration object supports the following parameters:

- **`apiKey`** (string, conditional): Your Soundstripe API key. Required when using direct API access for development.
- **`baseUrl`** (string, conditional): Your proxy server base URL. Required when using proxy server for production.

**Note:** Either `apiKey` or `baseUrl` must be provided. You cannot omit both parameters.

## How the Plugin Works

The Soundstripe plugin automatically registers an asset source with CE.SDK using `engine.asset.addSource()` internally. The plugin handles all API communication, translates API responses to CE.SDK's asset format, and manages asset source registration. You don't need to manually implement the asset source interface—the plugin takes care of everything.

The source ID for Soundstripe is `ly.img.audio.soundstripe`, which the plugin registers automatically when added.

## Adding Soundstripe to the Audio Asset Library

After adding the plugin, configure how Soundstripe appears in CE.SDK's asset library panel:

```typescript highlight-add-asset-library-entry
    // Configure the asset library UI with a dedicated Soundstripe dock entry
    cesdk.ui.addAssetLibraryEntry({
      id: 'soundstripe',
      sourceIds: ['ly.img.audio.soundstripe'],
      previewLength: 6,
      gridColumns: 2,
      gridItemHeight: 'auto',
      cardLabel: (assetResult) => assetResult.label
    });

    // Add Soundstripe to the existing Audio asset library
    cesdk.ui.updateAssetLibraryEntry('ly.img.audio', {
      sourceIds: ({ currentIds }) => [...currentIds, 'ly.img.audio.soundstripe']
    });

    // Add Soundstripe as the first button in the dock with a separator
    cesdk.ui.setComponentOrder({ in: 'ly.img.dock' }, [
      {
        id: 'ly.img.assetLibrary.dock',
        key: 'soundstripe',
        label: 'libraries.soundstripe.label',
        entries: ['soundstripe']
      },
      { id: 'ly.img.separator' },
      ...cesdk.ui.getComponentOrder({ in: 'ly.img.dock' })
    ]);
```

The `addAssetLibraryEntry()` call registers the Soundstripe asset library panel with display settings:

- `gridColumns`: Number of columns in the grid layout (2 for audio tracks)
- `gridItemHeight`: Height style for grid items (`'auto'` maintains aspect ratio)
- `cardLabel`: Function that returns the label to display on each card (shows track title/artist)
- `previewLength`: Number of preview items to show

The `cardLabel` property is particularly important for audio assets as it makes the track title and artist information always visible on the card, matching the display style of the default Audio library.

The `setComponentOrder()` call creates an explicit dock button component by prepending a new `AssetLibraryDockComponent` to the existing dock order.

The dock component structure includes:

- `id`: Fixed identifier for asset library dock buttons (`'ly.img.assetLibrary.dock'`)
- `key`: Unique identifier for this specific button (`'soundstripe'`)
- `label`: Internationalization key for the button label (`'libraries.soundstripe.label'`)
- `entries`: Array of asset library entry IDs to display when clicked (`['soundstripe']`)

Additionally, we add Soundstripe to the existing Audio asset library using `updateAssetLibraryEntry()`. This provides dual access: users can access Soundstripe tracks both from the dedicated Soundstripe panel and from the Audio library panel. The functional update pattern `({ currentIds }) => [...currentIds, 'ly.img.audio.soundstripe']` appends Soundstripe to the existing sources without replacing them.

The separator component `{ id: 'ly.img.separator' }` adds a visual divider between the Soundstripe button and the default dock buttons, improving UI organization and clarity.

## Understanding URI Expiration

Soundstripe MP3 file URIs expire after a certain time period. This is a security measure implemented by Soundstripe to protect their content. When URIs expire, audio tracks will fail to play or load in the editor. The plugin automatically handles URI refresh to ensure your audio tracks continue to play without interruption.

## Automatic URI Refresh

The plugin includes built-in automatic URI refresh that happens at key moments:

- When a scene is loaded
- When the block selection changes
- Before playback if URIs are expired

The plugin monitors audio blocks in your scene and refreshes expired Soundstripe URIs automatically. No additional configuration is required—this functionality works out of the box.

## Manual URI Refresh

In some cases, you may need to manually trigger a URI refresh. The plugin exports a `refreshSoundstripeAudioURIs()` utility function for this purpose:

```typescript highlight-uri-refresh-example
    // Example: Manual URI refresh utility
    // This is useful if you need to manually refresh expired URIs
    // The plugin handles automatic refresh during scene loading and playback
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const handleManualRefresh = async () => {
      await refreshSoundstripeAudioURIs(engine, { baseUrl: proxyUrl });
    };

    // You can call this function when needed
    // For example, when loading a scene or before playback
    // handleManualRefresh();
```

This function scans all audio blocks in the current scene, identifies Soundstripe audio tracks with expired URIs, and refreshes them using the configured API key or proxy server. You can call this function when loading a scene from storage, before starting video playback, or when users report audio playback issues.

## Setting Up a Proxy Server

For production environments, you should set up a proxy server to handle Soundstripe API requests securely. Follow [Soundstripe's integration guide](https://docs.soundstripe.com/docs/integrating-soundstripes-content-into-your-application) for detailed proxy setup instructions.

Here's an example Node.js Express endpoint for creating your own proxy:

```javascript
// Example Node.js proxy endpoint
app.use('/api/soundstripe', async (req, res) => {
  const response = await fetch(`https://api.soundstripe.com/v1${req.path}`, {
    headers: {
      Authorization: `Bearer ${process.env.SOUNDSTRIPE_API_KEY}`,
      Accept: 'application/vnd.api+json',
      'Content-Type': 'application/vnd.api+json',
    },
  });

  const data = await response.json();
  res.json(data);
});
```

The proxy server receives requests from your frontend, adds the authentication header with your API key (stored in environment variables), forwards the request to Soundstripe's API, and returns the response to your frontend. Configure your plugin to use your proxy:

```typescript
await cesdk.addPlugin(
  SoundstripePlugin({
    baseUrl: 'https://your-domain.com/api/soundstripe',
  }),
);
```

## Searching and Browsing Audio

Once configured, the plugin automatically handles search queries through the asset panel. Users can search for audio tracks by keywords, and the plugin fetches results from Soundstripe's API. The plugin manages pagination, filtering, and all API interactions behind the scenes.

## Adding Audio to Scenes

To add Soundstripe audio tracks to the scene programmatically, use `engine.asset.apply()`:

```typescript
const sourceId = 'ly.img.audio.soundstripe';
const assets = await engine.asset.findAssets(sourceId, {
  page: 0,
  perPage: 10,
});

if (assets.assets.length > 0) {
  const audioBlock = await engine.asset.apply(sourceId, assets.assets[0]);
  // The audio block is now added to the scene
}
```

The plugin ensures URIs are fresh before adding audio to the scene.

## Retrieving Song IDs

When users add Soundstripe songs, the plugin stores the song ID as metadata. You can retrieve these IDs programmatically (e.g., during export). This is useful when you need to pass the song ID through the Soundstripe API to generate a code for YouTube video captions or descriptions before publishing:

```typescript
const audioBlocks = cesdk.engine.block.findByType('audio');

audioBlocks.forEach(blockId => {
  const songId = cesdk.engine.block.getMetadata(
    blockId,
    'ly.img.audio.soundstripe.songId',
  );

  if (songId) {
    console.log('Soundstripe Song ID:', songId);
    // Use this songId with Soundstripe API to generate YouTube attribution codes
  }
});
```

The song ID is stored using the metadata key `'ly.img.audio.soundstripe.songId'` and can be retrieved at any time after the audio has been added to the scene. This allows you to integrate with Soundstripe's attribution API or include required attribution information in your exported content.

## Testing the Integration

Test both search functionality and audio browsing through the asset library panel:

1. Open the audio asset library panel in CE.SDK
2. Navigate to the Soundstripe source
3. Search for audio tracks by keyword
4. Preview audio tracks in the panel
5. Add an audio track to the scene
6. Verify the audio plays correctly

If the audio asset library doesn't show Soundstripe, verify the source ID was added correctly using `getAssetLibraryEntry()`.

## Troubleshooting

Common issues and solutions:

**API authentication errors**: Verify your API key is correct or that your proxy server URL is accessible and properly configured.

**Plugin not registering the asset source**: Check that the plugin configuration includes either `apiKey` or `baseUrl`. Verify the plugin was added using `cesdk.addPlugin()` before trying to use the source.

**Audio not playing**: Check that URIs haven't expired. Call `refreshSoundstripeAudioURIs()` manually to refresh them. Verify the Soundstripe API is accessible from your environment.

**Proxy server CORS issues**: Ensure your proxy server includes proper CORS headers. Add `Access-Control-Allow-Origin` headers to your proxy responses.

**Missing audio tracks in asset library**: Verify the Soundstripe source ID (`ly.img.audio.soundstripe`) was added to the audio entry's `sourceIds` array using `updateAssetLibraryEntry()`.

## API Reference

| Method                               | Category | Purpose                                            |
| ------------------------------------ | -------- | -------------------------------------------------- |
| `cesdk.addPlugin()`                  | Plugin   | Add the Soundstripe plugin to CE.SDK               |
| `engine.asset.findAllSources()`      | Asset    | List all registered asset sources                  |
| `cesdk.ui.getAssetLibraryEntry()`    | UI       | Get asset library entry configuration              |
| `cesdk.ui.updateAssetLibraryEntry()` | UI       | Update asset library entry with Soundstripe source |
| `engine.asset.apply()`               | Asset    | Add Soundstripe audio to the scene                 |
| `engine.block.findByType()`          | Block    | Find blocks by type (e.g., audio blocks)           |
| `engine.block.getMetadata()`         | Block    | Retrieve metadata from a block (e.g., song ID)     |
| `refreshSoundstripeAudioURIs()`      | Utility  | Manually refresh expired audio URIs                |

## Next Steps

- [Customize Asset Library](./import-media/asset-panel/customize.md) — Configure asset panels and
  UI
- [Asset Library Basics](./import-media/asset-panel/basics.md) — Understand asset sources
- [Integrate Unsplash Images](./import-media/from-remote-source/unsplash.md) — Add stock image sources
- [IMG.LY Premium Assets](./import-media/from-remote-source/imgly-premium-assets.md) — Access premium stock content
- [Import Media Concepts](./import-media/concepts.md) — Learn core import concepts



---

## More Resources

- **[Vue Documentation Index](https://img.ly/vue.md)** - Browse all Vue documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./vue.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support