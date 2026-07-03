> This is one page of the CE.SDK Electron documentation. For a complete overview, see the [Electron Documentation Index](https://img.ly/docs/cesdk/electron.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [AI Integration](./user-interface/ai-integration.md) > [Auto Captions](./user-interface/ai-integration/auto-captions.md) > [Plugins](./plugins.md) > [AI: Auto Captions](./user-interface/ai-integration/auto-captions.md)

---

Generate captions automatically from spoken audio in video and audio blocks using CE.SDK's Auto Caption plugin.

> **Reading time:** 15 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/heads/main.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/main/guides-user-interface-ai-integration-auto-captions-browser)
>
> - [Open in StackBlitz](https://stackblitz.com/github/imgly/cesdk-web-examples/tree/v$UBQ_VERSION$/guides-user-interface-ai-integration-auto-captions-browser)
>
> - [Live demo](https://img.ly/docs/cesdk/examples/guides-user-interface-ai-integration-auto-captions-browser/)

The Auto Caption plugin extracts audio from media blocks, sends it to a speech-to-text provider, and creates timed caption blocks from the transcription. It supports both a built-in UI workflow where users select which blocks to transcribe and a programmatic API for automation. The plugin ships with an ElevenLabs Scribe V2 provider via fal.ai, and you can implement your own provider using the `TranscriptionProvider` interface. For manually creating and editing captions, see [Add Captions](./edit-video/add-captions.md).

```typescript file=@cesdk_web_examples/guides-user-interface-ai-integration-auto-captions-browser/browser.ts reference-only
import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';
import type { TranscriptionProvider } from '@imgly/plugin-autocaption-web';

import {
  BlurAssetSource,
  CaptionPresetsAssetSource,
  ImageColorsAssetSource,
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
import { VideoEditorConfig } from '@cesdk/core-configs-web/video-editor';

import AutocaptionPlugin from '@imgly/plugin-autocaption-web';
import { ElevenLabsScribeV2 } from '@imgly/plugin-autocaption-web/fal-ai';

import packageJson from './package.json';

class Example implements EditorPlugin {
  name = packageJson.name;

  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    await cesdk.addPlugin(new VideoEditorConfig());

    // Add asset source plugins for the video editor
    await cesdk.addPlugin(new BlurAssetSource());
    await cesdk.addPlugin(new CaptionPresetsAssetSource());
    await cesdk.addPlugin(new ImageColorsAssetSource());
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

    // Register the Auto Caption plugin with the built-in ElevenLabs provider
    await cesdk.addPlugin(
      AutocaptionPlugin({
        provider: ElevenLabsScribeV2({
          // The proxy URL forwards requests to fal.ai with the API key added
          // server-side, keeping the key out of the browser
          proxyUrl: 'https://your-server.com/api/fal-proxy'
        })
      })
    );

    // Create a video scene and add a video clip with spoken audio
    await cesdk.actions.run('scene.create', {
      page: {
        width: 1920,
        height: 1080,
        unit: 'Pixel',
        color: { r: 0, g: 0, b: 0, a: 1 }
      }
    });

    const engine = cesdk.engine;
    const page = engine.block.findByType('page')[0];

    engine.block.setDuration(page, 30);

    const videoUrl =
      'https://cdn.img.ly/assets/demo/v3/ly.img.video/videos/pexels-drone-footage-of-a-surfer-barrelling-a-wave-12715991.mp4';

    const track = engine.block.create('track');
    engine.block.appendChild(page, track);

    const videoClip = await engine.block.addVideo(videoUrl, 1920, 1080, {
      timeline: { duration: 30, timeOffset: 0 }
    });
    engine.block.appendChild(track, videoClip);
    engine.block.fillParent(track);

    // Example: Implementing a custom transcription provider
    // Use this pattern to connect any speech-to-text service
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _customProvider: TranscriptionProvider = {
      name: 'My Custom STT',
      async transcribe(audio: Blob, options?) {
        // Send the audio blob to your speech-to-text service
        const formData = new FormData();
        formData.append('audio', audio, 'audio.mp4');
        if (options?.language) {
          formData.append('language', options.language);
        }

        const response = await fetch('https://your-stt-api.com/transcribe', {
          method: 'POST',
          body: formData,
          signal: options?.abortSignal
        });

        const result = await response.json();
        // Return the transcription as a valid SRT string
        return { srt: result.srt };
      }
    };
    // To use the custom provider instead of ElevenLabs:
    // AutocaptionPlugin({ provider: customProvider })

    // Open the caption panel so the Auto Caption button is visible
    cesdk.ui.openPanel('//ly.img.panel/inspector/caption');
  }
}

export default Example;
```

This guide covers how to use the built-in auto caption UI, install and configure the plugin with the ElevenLabs provider, set up a proxy server for secure API communication, implement a custom transcription provider, and troubleshoot common issues.

## Using the Built-in Auto Caption UI

The Auto Caption plugin adds an "Auto Caption" button to the caption panel. Clicking it opens an auto-generate view where you select which media blocks to transcribe.

### Accessing the Auto-Generate View

Open the caption panel from the inspector and click the "Auto Caption" button. The auto-generate view lists all audio and video blocks in the scene with checkboxes. Muted blocks and video blocks without audio tracks appear disabled and cannot be selected.

### Selecting Blocks

Use the checkboxes to choose which blocks to include in caption generation. The "Select All" button selects every eligible block, and "Deselect All" clears the selection. Only blocks with audible audio content can be selected.

### Generating and Cancelling Captions

Click "Generate Captions" to start transcription. The plugin extracts audio from each selected block, sends it to the configured provider, and creates caption blocks from the returned transcription. You can cancel an in-progress generation at any time — the plugin cleans up any partially created caption blocks.

After generation completes, the view switches to the caption edit view where you can review, restyle, and adjust the generated captions.

## Installing the Plugin

Install `@imgly/plugin-autocaption-web` alongside `@cesdk/cesdk-js`. The plugin version must match the CE.SDK version (unified versioning).

```typescript highlight-install-plugin
import AutocaptionPlugin from '@imgly/plugin-autocaption-web';
import { ElevenLabsScribeV2 } from '@imgly/plugin-autocaption-web/fal-ai';
```

The plugin is imported as a default export, and the fal.ai provider is imported from the `/fal-ai` subpath. The `@fal-ai/client` dependency is bundled into the provider, so you don't need to install it separately.

## Configuring the Built-in Provider

We register the Auto Caption plugin with `cesdk.addPlugin()`, passing the ElevenLabs Scribe V2 provider configured with a `proxyUrl`. The proxy URL points to your server endpoint that forwards requests to fal.ai with the API key added server-side.

```typescript highlight-configure-provider
// Register the Auto Caption plugin with the built-in ElevenLabs provider
await cesdk.addPlugin(
  AutocaptionPlugin({
    provider: ElevenLabsScribeV2({
      // The proxy URL forwards requests to fal.ai with the API key added
      // server-side, keeping the key out of the browser
      proxyUrl: 'https://your-server.com/api/fal-proxy'
    })
  })
);
```

The `ElevenLabsScribeV2()` factory accepts a configuration object with `proxyUrl` (required) and optional `headers` for custom authentication headers. You can also pass `debug: true` to the `AutocaptionPlugin()` call to enable console logging of each pipeline step, including audio sizes and provider timings.

## Setting Up a Proxy Server

The built-in provider communicates with fal.ai to run the ElevenLabs Scribe V2 model. Calling fal.ai directly from the browser would expose your API key in client-side code, which is insecure.

A proxy server sits between the browser and fal.ai. Your browser sends requests to your own server endpoint, which adds the fal.ai API key and forwards the request. The API key never leaves the server.

Your proxy endpoint needs to:

- Accept POST requests from the browser
- Add the `Authorization` header with your fal.ai API key
- Forward the request body to fal.ai
- Handle CORS so the browser can reach the endpoint

For detailed proxy implementation instructions, see [Proxy Server](./user-interface/ai-integration/proxy-server.md).

## Implementing a Custom Transcription Provider

You can use any speech-to-text service by implementing the `TranscriptionProvider` interface. The interface requires a `name` string and a `transcribe()` method that receives an audio blob and returns SRT text.

```typescript highlight-custom-provider
    // Example: Implementing a custom transcription provider
    // Use this pattern to connect any speech-to-text service
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _customProvider: TranscriptionProvider = {
      name: 'My Custom STT',
      async transcribe(audio: Blob, options?) {
        // Send the audio blob to your speech-to-text service
        const formData = new FormData();
        formData.append('audio', audio, 'audio.mp4');
        if (options?.language) {
          formData.append('language', options.language);
        }

        const response = await fetch('https://your-stt-api.com/transcribe', {
          method: 'POST',
          body: formData,
          signal: options?.abortSignal
        });

        const result = await response.json();
        // Return the transcription as a valid SRT string
        return { srt: result.srt };
      }
    };
    // To use the custom provider instead of ElevenLabs:
    // AutocaptionPlugin({ provider: customProvider })
```

### The TranscriptionProvider Interface

The `transcribe()` method receives two arguments:

- **`audio`**: A `Blob` in audio/mp4 format, produced by `engine.block.exportAudio()`. Send this to your speech-to-text service.
- **`options`**: An optional object with:
  - `language`: A BCP-47 language code (e.g., `"en"`, `"de"`, `"pt"`) for the expected spoken language.
  - `abortSignal`: An `AbortSignal` to cancel the transcription request. Pass this to `fetch()` or your HTTP client to abort the request.
  - `maxLineLength`: Maximum characters per SRT line (default 37).
  - `maxLines`: Maximum lines per SRT cue (default 1).
  - `debug`: Enable verbose logging to the console (default `false`).

The method must return `{ srt: string }` containing a valid SRT-formatted subtitle string. The plugin then passes this SRT to `engine.block.createCaptionsFromURI()` to create the caption blocks.

## Caption Generation Workflow

When the user clicks "Generate Captions", the plugin runs the following pipeline for each selected block:

1. **Load media** — Calls `engine.block.forceLoadAVResource()` to ensure the media is ready.
2. **Export audio** — Extracts audio via `engine.block.exportAudio()`, producing an MP4 blob.
3. **Transcribe** — Sends the blob to the `TranscriptionProvider.transcribe()` method.
4. **Create captions** — Converts the SRT string to caption blocks with `engine.block.createCaptionsFromURI()`.
5. **Add to track** — Appends caption blocks to a caption track on the page using `engine.block.appendChild()`.
6. **Style** — Applies the `ly.img.caption.presets.outline` preset via `engine.asset.fetchAsset()` and `engine.asset.applyToBlock()`.
7. **Position** — Centers the first caption with `engine.block.alignHorizontally()` and `engine.block.alignVertically()`.
8. **Undo step** — Wraps the entire operation in a single undo step with `engine.editor.addUndoStep()`.

Multiple blocks are processed in parallel using `Promise.all`. Existing caption tracks are removed before new ones are created.

## Handling Errors and Notifications

The plugin handles errors per-block, so if one block fails, others continue processing. When transcription fails or no speech is detected, the plugin shows a notification via `cesdk.ui.showNotification()`.

- **Total failure**: All blocks failed — shows an error notification.
- **Partial failure**: Some blocks succeeded, others failed — shows a warning listing which blocks had issues.
- **Cancellation**: When the user cancels, the plugin throws an `AbortError` and cleans up any caption blocks already created during the current generation.

## Troubleshooting

- **Plugin not appearing in caption panel**: Verify `cesdk.addPlugin()` is called with the `AutocaptionPlugin()` result and the caption panel is enabled in the editor.
- **Proxy errors**: Check that `proxyUrl` is accessible from the browser, handles CORS preflight requests, and correctly forwards the fal.ai API key.
- **"No speech detected" for all blocks**: Verify audio blocks are not muted and contain audible speech. Video blocks without audio tracks are intentionally disabled.
- **Generation hangs or times out**: Check network connectivity to fal.ai through your proxy. The ElevenLabs model can take 10-30 seconds for longer audio.
- **Captions not styled correctly**: Verify the `CaptionPresetsAssetSource` plugin is registered, which provides the `ly.img.caption.presets` asset source.
- **Muted blocks cannot be selected**: This is intentional. Muted audio blocks and video blocks without audio tracks produce no audio output for transcription.

## Next Steps

- [Add Captions](./edit-video/add-captions.md) — Manually create and edit caption blocks
- [Update Caption Presets](./create-video/update-caption-presets.md) — Customize caption styling presets
- [Proxy Server](./user-interface/ai-integration/proxy-server.md) — Set up secure API communication
- [Custom Provider](./user-interface/ai-integration/custom-provider.md) — Create custom AI providers
- [Integrate AI Features](./user-interface/ai-integration/integrate.md) — Overview of AI integration



---

## More Resources

- **[Electron Documentation Index](https://img.ly/docs/cesdk/electron.md)** - Browse all Electron documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./electron.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support