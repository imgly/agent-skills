> This is one page of the CE.SDK Nuxt.js documentation. For a complete overview, see the [Nuxt.js Documentation Index](https://img.ly/nuxtjs.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Create and Edit Videos](./create-video.md) > [Transform](./edit-video/transform.md) > [Rotate](./edit-video/transform/rotate.md)

---

Rotate video elements to any angle using radians or degrees, with precise programmatic control and UI rotation handles.

![Rotate videos example showing videos at different rotation angles](https://img.ly/docs/cesdk/./assets/browser.hero.webp)

> **Reading time:** 8 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/heads/main.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/main/guides-create-video-transform-rotate-browser)
>
> - [Open in StackBlitz](https://stackblitz.com/~/github.com/imgly/cesdk-web-examples/tree/main/guides-create-video-transform-rotate-browser)
>
> - [Live demo](https://img.ly/examples/guides-create-video-transform-rotate-browser/)

Rotation in CE.SDK occurs around the block's center point. All rotation values use radians, where `Math.PI` equals 180 degrees. Positive values rotate counterclockwise, negative values rotate clockwise.

```typescript file=@cesdk_web_examples/guides-create-video-transform-rotate-browser/browser.ts reference-only
import CreativeEditorSDK, {
  type EditorPlugin,
  type EditorPluginContext
} from '@cesdk/cesdk-js';

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

class Example implements EditorPlugin {
  name = 'guides-create-video-transform-rotate-browser';

  version = CreativeEditorSDK.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    // Setup: Load assets and create scene
    cesdk.feature.enable('ly.img.video');
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
      page: { width: 800, height: 500, unit: 'Pixel' }
    });

    const engine = cesdk.engine;
    const pages = engine.block.findByType('page');
    const page = pages.length > 0 ? pages[0] : engine.scene.get();

    // Enable fill and set page fill color to #6686FF
    engine.block.setFillEnabled(page, true);
    engine.block.setColor(engine.block.getFill(page), 'fill/color/value', {
      r: 102 / 255,
      g: 134 / 255,
      b: 255 / 255,
      a: 1
    });

    // Demo 1: Rotated Video - Rotated 45 degrees
    const rotatedVideo = await engine.block.addVideo(
      'https://img.ly/static/ubq_video_samples/bbb.mp4',
      200,
      150
    );
    engine.block.appendChild(page, rotatedVideo);
    engine.block.setPositionX(rotatedVideo, 50);
    engine.block.setPositionY(rotatedVideo, 100);

    // Rotate the video 45 degrees (in radians)
    const toRadians = (degrees: number) => (degrees * Math.PI) / 180;
    engine.block.setRotation(rotatedVideo, toRadians(45));

    // Add label for rotated video
    const text1 = engine.block.create('text');
    engine.block.setString(text1, 'text/text', '45° Rotation');
    engine.block.setFloat(text1, 'text/fontSize', 28);
    engine.block.setEnum(text1, 'text/horizontalAlignment', 'Center');
    engine.block.setWidth(text1, 200);
    engine.block.setPositionX(text1, 50);
    engine.block.setPositionY(text1, 320);
    engine.block.setFillEnabled(text1, true);
    engine.block.setColor(engine.block.getFill(text1), 'fill/color/value', {
      r: 1,
      g: 1,
      b: 1,
      a: 1
    });
    engine.block.appendChild(page, text1);

    // Get current rotation value
    const currentRotation = engine.block.getRotation(rotatedVideo);
    const toDegrees = (radians: number) => (radians * 180) / Math.PI;
    console.log('Current rotation:', toDegrees(currentRotation), 'degrees');

    // Demo 2: 90 Degree Rotation
    const rotatedVideo90 = await engine.block.addVideo(
      'https://img.ly/static/ubq_video_samples/bbb.mp4',
      200,
      150
    );
    engine.block.appendChild(page, rotatedVideo90);
    engine.block.setPositionX(rotatedVideo90, 300);
    engine.block.setPositionY(rotatedVideo90, 100);

    // Rotate 90 degrees using Math.PI / 2
    engine.block.setRotation(rotatedVideo90, Math.PI / 2);

    // Add label for 90 degree rotation
    const text2 = engine.block.create('text');
    engine.block.setString(text2, 'text/text', '90° Rotation');
    engine.block.setFloat(text2, 'text/fontSize', 28);
    engine.block.setEnum(text2, 'text/horizontalAlignment', 'Center');
    engine.block.setWidth(text2, 200);
    engine.block.setPositionX(text2, 300);
    engine.block.setPositionY(text2, 320);
    engine.block.setFillEnabled(text2, true);
    engine.block.setColor(engine.block.getFill(text2), 'fill/color/value', {
      r: 1,
      g: 1,
      b: 1,
      a: 1
    });
    engine.block.appendChild(page, text2);

    // Demo 3: Locked Rotation - Rotation is disabled for this block
    const lockedVideo = await engine.block.addVideo(
      'https://img.ly/static/ubq_video_samples/bbb.mp4',
      200,
      150
    );
    engine.block.appendChild(page, lockedVideo);
    engine.block.setPositionX(lockedVideo, 550);
    engine.block.setPositionY(lockedVideo, 150);

    // Disable rotation for this specific block
    engine.block.setScopeEnabled(lockedVideo, 'layer/rotate', false);

    // Add label for locked video
    const text3 = engine.block.create('text');
    engine.block.setString(text3, 'text/text', 'Rotation Locked');
    engine.block.setFloat(text3, 'text/fontSize', 28);
    engine.block.setEnum(text3, 'text/horizontalAlignment', 'Center');
    engine.block.setWidth(text3, 200);
    engine.block.setPositionX(text3, 550);
    engine.block.setPositionY(text3, 320);
    engine.block.setFillEnabled(text3, true);
    engine.block.setColor(engine.block.getFill(text3), 'fill/color/value', {
      r: 1,
      g: 1,
      b: 1,
      a: 1
    });
    engine.block.appendChild(page, text3);

    // Check if rotation is enabled for a block
    const canRotate = engine.block.isScopeEnabled(lockedVideo, 'layer/rotate');
    console.log('Rotation enabled:', canRotate);

    // Set playhead position to 2 seconds
    engine.block.setPlaybackTime(page, 2);
  }
}

export default Example;
```

This guide covers rotating videos programmatically, converting between degrees and radians, grouping blocks for collective rotation, and locking rotation permissions.

## Rotating Videos

Rotate videos using `engine.block.setRotation()` with the angle in radians. Convert from degrees using the formula `radians = degrees * Math.PI / 180`:

```typescript highlight-rotate-video
// Rotate the video 45 degrees (in radians)
const toRadians = (degrees: number) => (degrees * Math.PI) / 180;
engine.block.setRotation(rotatedVideo, toRadians(45));
```

## Getting Current Rotation

Read the current rotation value using `engine.block.getRotation()`. The value is returned in radians. Convert to degrees with `degrees = radians * 180 / Math.PI`:

```typescript highlight-get-rotation
// Get current rotation value
const currentRotation = engine.block.getRotation(rotatedVideo);
const toDegrees = (radians: number) => (radians * 180) / Math.PI;
console.log('Current rotation:', toDegrees(currentRotation), 'degrees');
```

## Common Rotation Angles

For 90-degree rotations, use `Math.PI / 2`. For 180 degrees, use `Math.PI`. For 270 degrees, use `3 * Math.PI / 2`:

```typescript highlight-rotate-90
// Rotate 90 degrees using Math.PI / 2
engine.block.setRotation(rotatedVideo90, Math.PI / 2);
```

## Locking Rotation

Disable rotation for specific blocks using `engine.block.setScopeEnabled()` with the `'layer/rotate'` scope set to false:

```typescript highlight-lock-rotation
// Disable rotation for this specific block
engine.block.setScopeEnabled(lockedVideo, 'layer/rotate', false);
```

## Checking Rotation Permissions

Check if rotation is enabled for a block using `engine.block.isScopeEnabled()`:

```typescript highlight-check-scope
// Check if rotation is enabled for a block
const canRotate = engine.block.isScopeEnabled(lockedVideo, 'layer/rotate');
console.log('Rotation enabled:', canRotate);
```

## Troubleshooting

### Rotation Has No Effect

Verify the block exists in the scene and is not a page block. Check if rotation is locked using `engine.block.isScopeEnabled(block, 'layer/rotate')`.

### Rotation Handle Missing

Check if rotation handles are hidden globally via `controlGizmo/showRotateHandles` setting. Verify the `'layer/rotate'` scope is enabled for the block.

### Unexpected Rotation Direction

Remember that positive values rotate counterclockwise in CE.SDK. To rotate clockwise, use negative radian values.

## API Reference

| Method                             | Description                              |
| ---------------------------------- | ---------------------------------------- |
| `engine.block.setRotation()`       | Set block rotation in radians            |
| `engine.block.getRotation()`       | Get current rotation in radians          |
| `engine.block.setScopeEnabled()`   | Enable/disable `'layer/rotate'` scope    |
| `engine.block.isScopeEnabled()`    | Check if rotation is allowed             |
| `engine.block.setTransformLocked()`| Lock all transforms including rotation   |



---

## More Resources

- **[Nuxt.js Documentation Index](https://img.ly/nuxtjs.md)** - Browse all Nuxt.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./nuxtjs.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support