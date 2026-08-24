> This is one page of the CE.SDK Vanilla JS/TS documentation. For a complete overview, see the [Vanilla JS/TS Documentation Index](https://img.ly/docs/cesdk/js.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Create and Edit Audio](./create-audio/audio.md) > [Fade In and Out](./create-audio/audio/fade.md)

---

Ramp audio up at the start of a clip and back down at the end using CE.SDK's
audio fade API, with a duration in seconds and an optional easing curve.

![Audio fade example showing a timeline with audio clips that fade in and out](https://img.ly/docs/cesdk/./assets/browser.hero.webp)

> **Reading time:** 7 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/tags/release-$UBQ_VERSION$.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/release-$UBQ_VERSION$/guides-create-audio-audio-fade-browser)
>
> - [Open in StackBlitz](https://stackblitz.com/github/imgly/cesdk-web-examples/tree/v$UBQ_VERSION$/guides-create-audio-audio-fade-browser)
>
> - [Live demo](https://cdn.img.ly/demo/cesdk-web-examples/v1.81.0/examples/guides-create-audio-audio-fade-browser/index.html)

An audio fade ramps a clip between silence and its configured volume over a fixed duration, so audio eases in at the start and tapers off at the end instead of cutting abruptly. Fades apply to standalone audio blocks and to video fills with embedded audio, and they stay anchored to the clip's edges when the clip is trimmed or resized.

```typescript file=@cesdk_web_examples/guides-create-audio-audio-fade-browser/browser.ts reference-only
import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';

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
import packageJson from './package.json';

/**
 * CE.SDK Plugin: Fade Audio In and Out Guide
 *
 * Demonstrates audio fades in CE.SDK:
 * - Fading audio in with setAudioFadeIn
 * - Fading audio out with setAudioFadeOut
 * - Shaping a fade with an easing curve
 * - Fading the embedded audio of a video fill
 * - Reading fade settings back through block properties
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

    await cesdk.actions.run('scene.create', {
      layout: 'DepthStack',
      page: {
        sourceId: 'ly.img.page.presets',
        assetId: 'ly.img.page.presets.instagram.story',
        color: { r: 0, g: 0, b: 0, a: 1 }
      }
    });

    const engine = cesdk.engine;
    const scene = engine.scene.get();
    const pages = engine.block.findByType('page');
    const page = pages.length > 0 ? pages[0] : scene;
    engine.block.setDuration(page, 18);

    const audioUri =
      'https://cdn.img.ly/assets/demo/v3/ly.img.audio/audios/dance_harder.m4a';
    const videoUri = 'https://img.ly/static/ubq_video_samples/bbb.mp4';

    // Create an audio block and load the audio file.
    const audioBlock = engine.block.create('audio');
    engine.block.appendChild(page, audioBlock);
    engine.block.setString(audioBlock, 'audio/fileURI', audioUri);

    // Wait for the resource so the block reports its real metadata.
    await engine.block.forceLoadAVResource(audioBlock);

    engine.block.setTimeOffset(audioBlock, 0);
    engine.block.setDuration(audioBlock, 8);

    // Ramp the audio up from silence over the first 2 seconds of the block.
    engine.block.setAudioFadeIn(audioBlock, 2);

    // Ramp the audio back down to silence over the last 3 seconds of the block.
    engine.block.setAudioFadeOut(audioBlock, 3);

    // Pass an easing curve to shape the ramp. The default is 'Linear'.
    const easedAudio = engine.block.duplicate(audioBlock);
    engine.block.appendChild(page, easedAudio);
    engine.block.setTimeOffset(easedAudio, 9);
    engine.block.setDuration(easedAudio, 8);
    engine.block.setAudioFadeIn(easedAudio, 2, 'EaseInOut');
    engine.block.setAudioFadeOut(easedAudio, 2, 'EaseInOut');

    // Add a video clip on its own track so the page shows moving footage.
    const track = engine.block.create('track');
    engine.block.appendChild(page, track);
    const videoClip = await engine.block.addVideo(videoUri, 1280, 720, {
      timeline: { duration: 8, timeOffset: 0 }
    });
    engine.block.appendChild(track, videoClip);
    engine.block.fillParent(track);

    // Video audio lives on the video fill, so the fade is set on the fill.
    const videoFill = engine.block.getFill(videoClip);
    await engine.block.forceLoadAVResource(videoFill);

    engine.block.setAudioFadeIn(videoFill, 1.5);
    engine.block.setAudioFadeOut(videoFill, 1.5);

    // Fades are block properties, so they read back through getDouble and getEnum.
    const fadeInDuration = engine.block.getDouble(
      easedAudio,
      'playback/fadeIn/duration'
    );
    const fadeInEasing = engine.block.getEnum(
      easedAudio,
      'playback/fadeIn/easing'
    );
    const fadeOutDuration = engine.block.getDouble(
      easedAudio,
      'playback/fadeOut/duration'
    );

    // eslint-disable-next-line no-console
    console.log(`Fade in: ${fadeInDuration}s (${fadeInEasing})`);
    // eslint-disable-next-line no-console
    console.log(`Fade out: ${fadeOutDuration}s`);

    // A duration of 0 removes a fade again.
    engine.block.setAudioFadeOut(easedAudio, 0);

    // Zoom to fit the composition.
    engine.scene.zoomToBlock(page, 40, 40, 40, 40);
  }
}

export default Example;
```

This guide covers how to fade audio in and out, shape a fade with an easing curve, fade the audio of a video fill, and read the fade configuration back from a block.

## Understanding Audio Fades

A fade produces a gain between **0.0** and **1.0** that is multiplied with the block's volume. A fade-in on a block at 50% volume therefore ramps from silence to 50%, not to full volume. Fades combine with page volume, muting, and clip transitions rather than replacing them.

The fade-in window starts at the beginning of the block and the fade-out window ends at the end of the block, measured against the block's duration on the timeline. Both durations default to `0`, which means no fade.

## Fading Audio In

### Creating the Audio Block

We create an audio block, point it at an audio file, and wait for the resource to load before configuring playback.

```typescript highlight-create-audio
    // Create an audio block and load the audio file.
    const audioBlock = engine.block.create('audio');
    engine.block.appendChild(page, audioBlock);
    engine.block.setString(audioBlock, 'audio/fileURI', audioUri);

    // Wait for the resource so the block reports its real metadata.
    await engine.block.forceLoadAVResource(audioBlock);

    engine.block.setTimeOffset(audioBlock, 0);
    engine.block.setDuration(audioBlock, 8);
```

Audio blocks store the file URI directly on the block through the `audio/fileURI` property. The `forceLoadAVResource` call ensures the file has been downloaded and its metadata is available.

### Setting a Fade-In

`setAudioFadeIn()` takes the block and a duration in seconds.

```typescript highlight-fade-in
// Ramp the audio up from silence over the first 2 seconds of the block.
engine.block.setAudioFadeIn(audioBlock, 2);
```

The clip now starts silent and reaches its configured volume two seconds in. Negative durations are clamped to `0`, so passing a negative value simply leaves the clip without a fade.

## Fading Audio Out

`setAudioFadeOut()` works the same way, measured backwards from the end of the block.

```typescript highlight-fade-out
// Ramp the audio back down to silence over the last 3 seconds of the block.
engine.block.setAudioFadeOut(audioBlock, 3);
```

With an eight-second clip and a three-second fade-out, the audio plays at full volume for five seconds and then ramps down to silence.

## Choosing an Easing Curve

Both methods take an optional easing curve as their third argument. The default, `'Linear'`, changes the gain at a constant rate.

```typescript highlight-eased-fade
// Pass an easing curve to shape the ramp. The default is 'Linear'.
const easedAudio = engine.block.duplicate(audioBlock);
engine.block.appendChild(page, easedAudio);
engine.block.setTimeOffset(easedAudio, 9);
engine.block.setDuration(easedAudio, 8);
engine.block.setAudioFadeIn(easedAudio, 2, 'EaseInOut');
engine.block.setAudioFadeOut(easedAudio, 2, 'EaseInOut');
```

`'EaseInOut'` starts and ends the ramp gently, which sounds smoother than a linear fade on music. `'EaseIn'` and `'EaseOut'` bias the ramp towards one end. The full set of curves is the same one used by block animations.

## Fading Video Audio

The audio of a video clip lives on the video fill, not on the graphic block that displays it. Resolve the fill and set the fade on it, exactly as you would with `setVolume()`.

```typescript highlight-video-fade
    // Video audio lives on the video fill, so the fade is set on the fill.
    const videoFill = engine.block.getFill(videoClip);
    await engine.block.forceLoadAVResource(videoFill);

    engine.block.setAudioFadeIn(videoFill, 1.5);
    engine.block.setAudioFadeOut(videoFill, 1.5);
```

The fade window still follows the graphic block's position and duration on the timeline, so a video clip trimmed on the timeline keeps its fade-out at the new end.

## Reading and Removing Fades

### Reading the Configuration

Fades are exposed as block properties, which makes them straightforward to bind to UI controls.

```typescript highlight-read-fade
    // Fades are block properties, so they read back through getDouble and getEnum.
    const fadeInDuration = engine.block.getDouble(
      easedAudio,
      'playback/fadeIn/duration'
    );
    const fadeInEasing = engine.block.getEnum(
      easedAudio,
      'playback/fadeIn/easing'
    );
    const fadeOutDuration = engine.block.getDouble(
      easedAudio,
      'playback/fadeOut/duration'
    );

    // eslint-disable-next-line no-console
    console.log(`Fade in: ${fadeInDuration}s (${fadeInEasing})`);
    // eslint-disable-next-line no-console
    console.log(`Fade out: ${fadeOutDuration}s`);
```

The four properties are `playback/fadeIn/duration` and `playback/fadeOut/duration` (read with `getDouble()`), and `playback/fadeIn/easing` and `playback/fadeOut/easing` (read with `getEnum()`). The same properties can be written with `setDouble()` and `setEnum()` if that fits your code better than the dedicated methods.

### Removing a Fade

Setting a duration of `0` removes the fade again.

```typescript highlight-remove-fade
// A duration of 0 removes a fade again.
engine.block.setAudioFadeOut(easedAudio, 0);
```

## Fades, Trimming, and Splitting

Because the windows are anchored to the block's timeline duration, shortening a clip moves the fade-out along with the new end instead of leaving it stranded in the middle of the clip. Trimming which part of the source plays does not move the fades either — they stay at the audible start and end.

Splitting a clip keeps only the outer fades: the first half keeps its fade-in and the second half keeps its fade-out. This prevents the audio from dipping to silence and back at the cut.

## Troubleshooting

### Fade Is Not Audible

Check that the block is not muted with `isMuted()` and that its volume is above `0`. The fade ramps towards the block's volume, so a muted or silent block stays silent.

### Setting a Fade Throws

Fades apply only to audio blocks and video fills. Passing a page, or the graphic block that owns a video fill, throws — resolve the fill with `getFill()` first.

### Clip Starts Partly Faded Out

If the fade-out is longer than the clip, its window is clamped to the block and the clip begins mid-ramp. Shorten the fade or lengthen the clip.



---

## More Resources

- **[Vanilla JS/TS Documentation Index](https://img.ly/docs/cesdk/js.md)** - Browse all Vanilla JS/TS documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./js.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support