> This is one page of the CE.SDK Vanilla JS/TS documentation. For a complete overview, see the [Vanilla JS/TS Documentation Index](https://img.ly/js.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Create and Edit Audio](./create-audio/audio.md) > [Adjust Speed](./create-video/audio/adjust-speed.md)

---

Control audio playback speed by adjusting the speed multiplier using CE.SDK's
timeline UI and programmatic speed adjustment API.

![Audio Speed Adjustment example showing timeline with audio blocks at different speeds](https://img.ly/docs/cesdk/./assets/browser.hero.webp)

> **Reading time:** 8 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/heads/main.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/main/guides-create-audio-audio-adjust-speed-browser)
>
> - [Open in StackBlitz](https://stackblitz.com/~/github.com/imgly/cesdk-web-examples/tree/main/guides-create-audio-audio-adjust-speed-browser)
>
> - [Live demo](https://img.ly/examples/guides-create-audio-audio-adjust-speed-browser/)

Playback speed adjustment changes how fast or slow audio plays without changing its pitch (though pitch shifting may occur depending on the audio processing implementation). A speed multiplier of 1.0 represents normal speed, values below 1.0 slow down playback, and values above 1.0 speed it up. This technique is commonly used for podcast speed controls, time-compressed narration, slow-motion audio effects, and accessibility features.

```typescript file=@cesdk_web_examples/guides-create-audio-audio-adjust-speed-browser/browser.ts reference-only
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
 * CE.SDK Plugin: Adjust Audio Speed Guide
 *
 * Demonstrates audio playback speed adjustment in CE.SDK:
 * - Loading audio files
 * - Adjusting playback speed with setPlaybackSpeed
 * - Three speed presets: slow-motion (0.5x), normal (1.0x), and maximum (3.0x)
 */
class Example implements EditorPlugin {
  name = packageJson.name;

  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    // Enable audio and video features in CE.SDK
    cesdk.feature.enable('ly.img.video');
    cesdk.feature.enable('ly.img.audio');
    cesdk.feature.enable('ly.img.timeline');
    cesdk.feature.enable('ly.img.playback');
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

    const engine = cesdk.engine;
    const scene = engine.scene.get();
    const pages = engine.block.findByType('page');
    const page = pages.length > 0 ? pages[0] : scene;

    // Use a sample audio file
    const audioUri =
      'https://cdn.img.ly/assets/demo/v3/ly.img.audio/audios/dance_harder.m4a';

    // Create an audio block and load the audio file
    const audioBlock = engine.block.create('audio');
    engine.block.setString(audioBlock, 'audio/fileURI', audioUri);

    // Wait for audio resource to load
    await engine.block.forceLoadAVResource(audioBlock);

    // Slow Motion Audio (0.5x - half speed)
    const slowAudioBlock = engine.block.duplicate(audioBlock);
    engine.block.appendChild(page, slowAudioBlock);
    engine.block.setPositionX(slowAudioBlock, 100);
    engine.block.setPositionY(slowAudioBlock, 200);
    engine.block.setPlaybackSpeed(slowAudioBlock, 0.5);

    // Normal Speed Audio (1.0x)
    const normalAudioBlock = engine.block.duplicate(audioBlock);
    engine.block.appendChild(page, normalAudioBlock);
    engine.block.setPositionX(normalAudioBlock, 100);
    engine.block.setPositionY(normalAudioBlock, 400);
    engine.block.setPlaybackSpeed(normalAudioBlock, 1.0);

    // Maximum Speed Audio (3.0x - triple speed)
    const maxSpeedAudioBlock = engine.block.duplicate(audioBlock);
    engine.block.appendChild(page, maxSpeedAudioBlock);
    engine.block.setPositionX(maxSpeedAudioBlock, 100);
    engine.block.setPositionY(maxSpeedAudioBlock, 600);
    engine.block.setPlaybackSpeed(maxSpeedAudioBlock, 3.0);

    // Log duration changes for demonstration
    const slowDuration = engine.block.getDuration(slowAudioBlock);
    const normalDuration = engine.block.getDuration(normalAudioBlock);
    const maxDuration = engine.block.getDuration(maxSpeedAudioBlock);

    // eslint-disable-next-line no-console
    console.log(`Slow motion (0.5x) duration: ${slowDuration.toFixed(2)}s`);
    // eslint-disable-next-line no-console
    console.log(`Normal speed (1.0x) duration: ${normalDuration.toFixed(2)}s`);
    // eslint-disable-next-line no-console
    console.log(`Maximum speed (3.0x) duration: ${maxDuration.toFixed(2)}s`);

    // Remove the original audio block (we only need the duplicates)
    engine.block.destroy(audioBlock);

    // Zoom to fit all audio blocks and labels
    engine.scene.zoomToBlock(page, 40, 40, 40, 40);
  }
}

export default Example;
```

This guide covers how to adjust audio playback speed programmatically using the Engine API, understand speed constraints, and manage how speed changes affect timeline duration.

## Understanding Speed Concepts

CE.SDK supports playback speeds from **0.25x** (quarter speed) to **3.0x** (triple speed), with **1.0x** as the default normal speed. Values below 1.0 slow down playback, values above 1.0 speed it up.

**Speed and Duration**: Adjusting speed automatically changes the block's timeline duration following an inverse relationship: `perceived_duration = original_duration / speed_multiplier`. A 10-second clip at 2.0x speed plays in 5 seconds; at 0.5x speed it takes 20 seconds. This automatic adjustment maintains timeline synchronization when coordinating audio with other elements.

**Common use cases**: Podcast playback controls (1.5x-2.0x), accessibility features (0.75x for easier comprehension), time-compressed narration, dramatic slow-motion effects (0.25x-0.5x), transcription work, and music tempo adjustments.

## Setting Up Audio for Speed Adjustment

### Loading Audio Files

We create an audio block and load an audio file by setting its `fileURI` property.

```typescript highlight-create-audio
    // Create an audio block and load the audio file
    const audioBlock = engine.block.create('audio');
    engine.block.setString(audioBlock, 'audio/fileURI', audioUri);

    // Wait for audio resource to load
    await engine.block.forceLoadAVResource(audioBlock);
```

Unlike video or image blocks which use fills, audio blocks store the file URI directly on the block itself using the `audio/fileURI` property. The `forceLoadAVResource` call ensures CE.SDK has downloaded the audio file and loaded its metadata, which is essential for accurate duration information and playback speed control.

## Adjusting Playback Speed

### Setting Normal Speed

By default, audio plays at normal speed (1.0x). We can explicitly set this to ensure consistent baseline behavior.

```typescript highlight-set-normal-speed
// Normal Speed Audio (1.0x)
const normalAudioBlock = engine.block.duplicate(audioBlock);
engine.block.appendChild(page, normalAudioBlock);
engine.block.setPositionX(normalAudioBlock, 100);
engine.block.setPositionY(normalAudioBlock, 400);
engine.block.setPlaybackSpeed(normalAudioBlock, 1.0);
```

Setting speed to 1.0 ensures the audio plays at its original recorded rate. This is useful after experimenting with different speeds and wanting to return to normal, or when initializing audio blocks programmatically to ensure consistent starting states.

### Querying Current Speed

We can check the current playback speed at any time using `getPlaybackSpeed`.

```typescript highlight-set-normal-speed
// Normal Speed Audio (1.0x)
const normalAudioBlock = engine.block.duplicate(audioBlock);
engine.block.appendChild(page, normalAudioBlock);
engine.block.setPositionX(normalAudioBlock, 100);
engine.block.setPositionY(normalAudioBlock, 400);
engine.block.setPlaybackSpeed(normalAudioBlock, 1.0);
```

This returns the current speed multiplier as a number. Use this to populate UI controls, validate that speed changes were applied, or make relative adjustments based on existing speeds.

## Common Speed Presets

### Slow Motion Audio (0.5x)

Slowing audio to half speed creates a slow-motion effect that's useful for careful listening or transcription.

```typescript highlight-set-slow-motion
// Slow Motion Audio (0.5x - half speed)
const slowAudioBlock = engine.block.duplicate(audioBlock);
engine.block.appendChild(page, slowAudioBlock);
engine.block.setPositionX(slowAudioBlock, 100);
engine.block.setPositionY(slowAudioBlock, 200);
engine.block.setPlaybackSpeed(slowAudioBlock, 0.5);
```

At 0.5x speed, a 10-second audio clip will take 20 seconds to play. This slower pace makes it easier to catch details, transcribe speech accurately, or create dramatic slow-motion audio effects in creative projects.

### Maximum Speed (3.0x)

The maximum supported speed is 3.0x, three times normal playback rate.

```typescript highlight-set-maximum-speed
// Maximum Speed Audio (3.0x - triple speed)
const maxSpeedAudioBlock = engine.block.duplicate(audioBlock);
engine.block.appendChild(page, maxSpeedAudioBlock);
engine.block.setPositionX(maxSpeedAudioBlock, 100);
engine.block.setPositionY(maxSpeedAudioBlock, 600);
engine.block.setPlaybackSpeed(maxSpeedAudioBlock, 3.0);
```

At maximum speed, audio plays very quickly—a 10-second clip finishes in just 3.33 seconds. This extreme speed is useful for rapidly skimming through content to find specific moments, though comprehension becomes challenging at this rate.

## Speed and Timeline Duration

### Understanding Duration Changes

When we change playback speed, CE.SDK automatically adjusts the block's timeline duration to reflect the new playback time.

```typescript highlight-speed-and-duration
    // Log duration changes for demonstration
    const slowDuration = engine.block.getDuration(slowAudioBlock);
    const normalDuration = engine.block.getDuration(normalAudioBlock);
    const maxDuration = engine.block.getDuration(maxSpeedAudioBlock);

    // eslint-disable-next-line no-console
    console.log(`Slow motion (0.5x) duration: ${slowDuration.toFixed(2)}s`);
    // eslint-disable-next-line no-console
    console.log(`Normal speed (1.0x) duration: ${normalDuration.toFixed(2)}s`);
    // eslint-disable-next-line no-console
    console.log(`Maximum speed (3.0x) duration: ${maxDuration.toFixed(2)}s`);
```

The original duration represents how long the audio takes to play at normal speed. When we double the speed to 2.0x, the duration is automatically halved. The audio content is the same, but it plays through in half the time, so the timeline block shrinks accordingly.

This automatic adjustment keeps your timeline synchronized. If you have multiple audio tracks or need to coordinate audio with video, the timeline will accurately reflect the new playback duration after speed changes.



---

## More Resources

- **[Vanilla JS/TS Documentation Index](https://img.ly/js.md)** - Browse all Vanilla JS/TS documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./js.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support