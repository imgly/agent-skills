> This is one page of the CE.SDK Next.js documentation. For a complete overview, see the [Next.js Documentation Index](https://img.ly/nextjs.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Create and Edit Audio](./create-audio/audio.md) > [Loop](./create-audio/audio/loop.md)

---

Create seamless repeating audio playback for background music, sound effects,
and rhythmic elements using CE.SDK's audio looping system.

![Loop Audio example showing timeline with looping audio blocks](https://img.ly/docs/cesdk/./assets/browser.hero.webp)

> **Reading time:** 8 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/heads/main.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/main/guides-create-audio-audio-loop-browser)
>
> - [Open in StackBlitz](https://stackblitz.com/~/github.com/imgly/cesdk-web-examples/tree/main/guides-create-audio-audio-loop-browser)
>
> - [Live demo](https://img.ly/examples/guides-create-audio-audio-loop-browser/)

Audio looping allows media to play continuously by restarting from the beginning when it reaches the end. When you set a block's duration longer than the audio length and enable looping, CE.SDK automatically repeats the audio to fill the entire duration. This makes looping perfect for background music, ambient soundscapes, and repeating sound effects.

```typescript file=@cesdk_web_examples/guides-create-audio-audio-loop-browser/browser.ts reference-only
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
import packageJson from './package.json';

/**
 * CE.SDK Plugin: Audio Loop Guide
 *
 * Demonstrates audio looping capabilities in CE.SDK:
 * - Creating audio blocks with looping enabled
 * - Controlling looping behavior with duration
 * - Querying looping state
 * - Disabling looping for one-time playback
 * - Understanding loop and duration interaction
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
      page: { width: 1280, height: 720, unit: 'Pixel' }
    });

    // Enable video and audio features
    cesdk.feature.enable('ly.img.video');
    cesdk.feature.enable('ly.img.timeline');
    cesdk.feature.enable('ly.img.playback');

    const engine = cesdk.engine;
    const scene = engine.scene.get()!;
    const pages = engine.block.findByType('page');
    const page = pages.length > 0 ? pages[0] : scene;

    engine.block.setDuration(page, 30); // 30 second timeline

    // Use sample audio from demo assets
    const audioUri =
      'https://cdn.img.ly/assets/demo/v3/ly.img.audio/audios/far_from_home.m4a';

    // Create a basic audio block
    const audioBlock = engine.block.create('audio')!;
    engine.block.appendChild(page, audioBlock);

    // Set the audio source URI
    engine.block.setString(audioBlock, 'audio/fileURI', audioUri);

    // Load the audio resource to access metadata like duration
    await engine.block.forceLoadAVResource(audioBlock);

    // Get the total audio duration
    const audioDuration = engine.block.getDouble(
      audioBlock,
      'audio/totalDuration'
    );
    // eslint-disable-next-line no-console
    console.log('Audio duration:', audioDuration, 'seconds');

    // Enable looping for this audio block
    engine.block.setLooping(audioBlock, true);

    // Set the block duration longer than the audio length
    // The audio will loop to fill the entire duration
    engine.block.setDuration(audioBlock, 15);

    // eslint-disable-next-line no-console
    console.log('Looping enabled - audio will repeat to fill 15 seconds');

    // Check if an audio block is set to loop
    const isLooping = engine.block.isLooping(audioBlock);
    // eslint-disable-next-line no-console
    console.log('Is looping:', isLooping); // true

    // Create a second audio block to demonstrate non-looping behavior
    const nonLoopingAudio = engine.block.create('audio')!;
    engine.block.appendChild(page, nonLoopingAudio);
    engine.block.setString(nonLoopingAudio, 'audio/fileURI', audioUri);
    await engine.block.forceLoadAVResource(nonLoopingAudio);

    // Set time offset so it doesn't overlap with first audio
    engine.block.setTimeOffset(nonLoopingAudio, 16);

    // Disable looping (or leave it at default false)
    engine.block.setLooping(nonLoopingAudio, false);

    // Set duration longer than audio length
    // Audio will play once and stop (no looping)
    engine.block.setDuration(nonLoopingAudio, 12);

    // eslint-disable-next-line no-console
    console.log('Looping disabled - audio plays once and stops');

    // Create a third audio block demonstrating looping with trim
    const trimmedLoopAudio = engine.block.create('audio')!;
    engine.block.appendChild(page, trimmedLoopAudio);
    engine.block.setString(trimmedLoopAudio, 'audio/fileURI', audioUri);
    await engine.block.forceLoadAVResource(trimmedLoopAudio);

    // Trim to a 2-second segment
    engine.block.setTrimOffset(trimmedLoopAudio, 1.0);
    engine.block.setTrimLength(trimmedLoopAudio, 2.0);

    // Enable looping and set duration longer than trim length
    engine.block.setLooping(trimmedLoopAudio, true);
    engine.block.setDuration(trimmedLoopAudio, 8.0);

    // Position in timeline
    engine.block.setTimeOffset(trimmedLoopAudio, 29);

    // eslint-disable-next-line no-console
    console.log('Trimmed loop - 2s segment will loop 4 times to fill 8s');

    // Select the first audio block to show it in timeline
    engine.block.setSelected(audioBlock, true);

    // eslint-disable-next-line no-console
    console.log('Audio looping guide initialized successfully');
  }
}

export default Example;
```

This guide covers how to enable and disable audio looping, control looping behavior with duration settings, and loop trimmed audio segments.

## Understanding Audio Looping

When looping is enabled on an audio block, CE.SDK repeats the audio content from the beginning each time it reaches the end. This continues until the block's duration is filled. For example, a 5-second audio clip with looping enabled and a 15-second duration will play three complete times.

The loop transitions are seamless—CE.SDK jumps immediately from the end back to the beginning without gaps or clicks. The audio content itself determines how smooth the loop sounds. Audio files designed for looping (with matching start and end points) create perfectly seamless loops, while non-looping audio may have audible transitions.

## Creating Audio Blocks

### Adding Audio Content

Audio blocks use file URIs to reference audio sources. We create the block, add it to the page, and set the audio source.

```typescript highlight-create-audio-block
    // Create a basic audio block
    const audioBlock = engine.block.create('audio')!;
    engine.block.appendChild(page, audioBlock);

    // Set the audio source URI
    engine.block.setString(audioBlock, 'audio/fileURI', audioUri);
```

The `audio/fileURI` property points to the audio file. CE.SDK supports common audio formats including MP3, M4A, WAV, and AAC.

## Enabling Audio Looping

### Loading Audio Resources

Before working with audio properties like duration or trim, we load the audio resource to ensure metadata is available.

```typescript highlight-load-audio-resource
    // Load the audio resource to access metadata like duration
    await engine.block.forceLoadAVResource(audioBlock);

    // Get the total audio duration
    const audioDuration = engine.block.getDouble(
      audioBlock,
      'audio/totalDuration'
    );
    // eslint-disable-next-line no-console
    console.log('Audio duration:', audioDuration, 'seconds');
```

Loading the resource provides access to the total audio duration, which helps calculate how many times the audio will loop given a specific block duration.

### Setting Looping State

We enable looping by calling `setLooping()` with `true`. When combined with a block duration longer than the audio length, the audio repeats to fill the full duration.

```typescript highlight-enable-looping
    // Enable looping for this audio block
    engine.block.setLooping(audioBlock, true);

    // Set the block duration longer than the audio length
    // The audio will loop to fill the entire duration
    engine.block.setDuration(audioBlock, 15);

    // eslint-disable-next-line no-console
    console.log('Looping enabled - audio will repeat to fill 15 seconds');
```

In this example, if the audio is 5 seconds long and the block duration is 15 seconds, the audio loops three times (5 seconds × 3 = 15 seconds total).

## Querying and Controlling Looping

### Checking Looping State

We can check whether an audio block has looping enabled at any time.

```typescript highlight-query-looping-state
// Check if an audio block is set to loop
const isLooping = engine.block.isLooping(audioBlock);
// eslint-disable-next-line no-console
console.log('Is looping:', isLooping); // true
```

This is useful when managing complex compositions with multiple audio tracks, allowing us to query and update looping states dynamically.

### Disabling Looping

To play audio once without repeating, we set looping to `false`.

```typescript highlight-non-looping-audio
    const nonLoopingAudio = engine.block.create('audio')!;
    engine.block.appendChild(page, nonLoopingAudio);
    engine.block.setString(nonLoopingAudio, 'audio/fileURI', audioUri);
    await engine.block.forceLoadAVResource(nonLoopingAudio);

    // Set time offset so it doesn't overlap with first audio
    engine.block.setTimeOffset(nonLoopingAudio, 16);

    // Disable looping (or leave it at default false)
    engine.block.setLooping(nonLoopingAudio, false);

    // Set duration longer than audio length
    // Audio will play once and stop (no looping)
    engine.block.setDuration(nonLoopingAudio, 12);

    // eslint-disable-next-line no-console
    console.log('Looping disabled - audio plays once and stops');
```

With looping disabled and a duration longer than the audio length, the audio plays once and then stops, leaving silence for the remaining duration.

## Looping with Trim Settings

### Trimming Looped Audio

We can combine trimming with looping to create short repeating segments from longer audio files.

```typescript highlight-looping-with-trim
    // Create a third audio block demonstrating looping with trim
    const trimmedLoopAudio = engine.block.create('audio')!;
    engine.block.appendChild(page, trimmedLoopAudio);
    engine.block.setString(trimmedLoopAudio, 'audio/fileURI', audioUri);
    await engine.block.forceLoadAVResource(trimmedLoopAudio);

    // Trim to a 2-second segment
    engine.block.setTrimOffset(trimmedLoopAudio, 1.0);
    engine.block.setTrimLength(trimmedLoopAudio, 2.0);

    // Enable looping and set duration longer than trim length
    engine.block.setLooping(trimmedLoopAudio, true);
    engine.block.setDuration(trimmedLoopAudio, 8.0);

    // Position in timeline
    engine.block.setTimeOffset(trimmedLoopAudio, 29);

    // eslint-disable-next-line no-console
    console.log('Trimmed loop - 2s segment will loop 4 times to fill 8s');
```

This trims the audio to a 2-second segment (from 1.0s to 3.0s of the source), then loops that segment four times to fill an 8-second duration. This technique is powerful for creating rhythmic loops or extracting repeatable portions from longer audio files.

### Choosing Loop Points

For seamless loops, choose trim points where the audio content flows naturally from end to beginning. Audio with consistent rhythm, tone, and volume at trim boundaries creates the smoothest loops. Abrupt changes in content or volume at loop boundaries create noticeable transitions.

## API Reference

| Method                          | Description                        | Parameters                                | Returns         |
| ------------------------------- | ---------------------------------- | ----------------------------------------- | --------------- |
| `create(type)`                  | Create an audio block              | `type: 'audio'`                           | `DesignBlockId` |
| `setString(id, property, value)`| Set audio source URI               | `id: DesignBlockId, property: string, value: string` | `void`          |
| `setLooping(id, enabled)`       | Enable or disable audio looping    | `id: DesignBlockId, enabled: boolean`     | `void`          |
| `isLooping(id)`                 | Check if audio is set to loop      | `id: DesignBlockId`                       | `boolean`       |
| `setDuration(id, duration)`     | Set block playback duration        | `id: DesignBlockId, duration: number`     | `void`          |
| `getDuration(id)`               | Get block duration                 | `id: DesignBlockId`                       | `number`        |
| `setTrimOffset(id, offset)`     | Set trim start point               | `id: DesignBlockId, offset: number`       | `void`          |
| `setTrimLength(id, length)`     | Set trim length                    | `id: DesignBlockId, length: number`       | `void`          |
| `forceLoadAVResource(id)`       | Load audio resource with metadata  | `id: DesignBlockId`                       | `Promise<void>` |
| `getDouble(id, property)`       | Get audio property value           | `id: DesignBlockId, property: string`     | `number`        |



---

## More Resources

- **[Next.js Documentation Index](https://img.ly/nextjs.md)** - Browse all Next.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./nextjs.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support