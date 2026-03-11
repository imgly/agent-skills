> This is one page of the CE.SDK Vue documentation. For a complete overview, see the [Vue Documentation Index](https://img.ly/docs/cesdk/vue.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Create and Edit Videos](./create-video.md) > [Transform](./edit-video/transform.md) > [Flip](./edit-video/transform/flip.md)

---

Use **CE.SDK** to **mirror video clips** horizontally or vertically to create symmetrical designs, correct orientation issues, or achieve specific visual effects.

![Flip Videos example showing videos with horizontal, vertical, and combined flip effects](https://img.ly/docs/cesdk/./assets/browser.hero.webp)

> **Reading time:** 5 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/heads/main.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/main/guides-create-video-transform-flip-browser)
>
> - [Open in StackBlitz](https://stackblitz.com/~/github.com/imgly/cesdk-web-examples/tree/main/guides-create-video-transform-flip-browser)
>
> - [Live demo](https://img.ly/docs/cesdk/examples/guides-create-video-transform-flip-browser/)

Flipping mirrors video content along horizontal or vertical axes. Unlike rotation, which changes the angle of content, flipping creates a true mirror reflection. The flip operation affects only the visual track—audio embedded in the video or on separate tracks remains unchanged, preserving lip-sync and sound design.

```typescript file=@cesdk_web_examples/guides-create-video-transform-flip-browser/browser.ts reference-only
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
 * CE.SDK Plugin: Flip Videos Guide
 *
 * Demonstrates video flipping in CE.SDK:
 * - Flip videos horizontally and vertically
 * - Query flip states
 * - Toggle flips programmatically
 * - Flip multiple clips as a group
 * - Lock flip operations in templates
 */
class Example implements EditorPlugin {
  name = packageJson.name;

  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    // Enable video editing features in CE.SDK
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
      page: { width: 1280, height: 720, unit: 'Pixel' }
    });

    const engine = cesdk.engine;
    const pages = engine.block.findByType('page');
    const page = pages[0];

    // Sample video URL
    const videoUri = 'https://img.ly/static/ubq_video_samples/bbb.mp4';

    // Block dimensions
    const blockWidth = 280;
    const blockHeight = 160;

    // Centered grid layout (3 columns × 2 rows)
    const col1X = 180;
    const col2X = 500;
    const col3X = 820;
    const row1Y = 135;
    const row2Y = 385;
    const label1Y = 305;
    const label2Y = 555;
    const fontSize = 24;

    // Helper to create centered white label
    const createLabel = (text: string, x: number, y: number) => {
      const label = engine.block.create('text');
      engine.block.setString(label, 'text/text', text);
      engine.block.setFloat(label, 'text/fontSize', fontSize);
      engine.block.setEnum(label, 'text/horizontalAlignment', 'Center');
      engine.block.setWidth(label, blockWidth);
      engine.block.setPositionX(label, x);
      engine.block.setPositionY(label, y);
      // Set white text color
      engine.block.setTextColor(label, { r: 1, g: 1, b: 1, a: 1 });
      engine.block.appendChild(page, label);
      return label;
    };

    // Demo 1: Original video (no flip)
    const originalVideo = await engine.block.addVideo(
      videoUri,
      blockWidth,
      blockHeight
    );
    engine.block.appendChild(page, originalVideo);
    engine.block.setPositionX(originalVideo, col1X);
    engine.block.setPositionY(originalVideo, row1Y);

    createLabel('Original', col1X, label1Y);

    // Demo 2: Horizontal flip
    const horizontalFlipVideo = await engine.block.addVideo(
      videoUri,
      blockWidth,
      blockHeight
    );
    engine.block.appendChild(page, horizontalFlipVideo);
    engine.block.setPositionX(horizontalFlipVideo, col2X);
    engine.block.setPositionY(horizontalFlipVideo, row1Y);

    // Flip the video horizontally (mirrors left to right)
    engine.block.setFlipHorizontal(horizontalFlipVideo, true);

    createLabel('Horizontal', col2X, label1Y);

    // Demo 3: Vertical flip
    const verticalFlipVideo = await engine.block.addVideo(
      videoUri,
      blockWidth,
      blockHeight
    );
    engine.block.appendChild(page, verticalFlipVideo);
    engine.block.setPositionX(verticalFlipVideo, col3X);
    engine.block.setPositionY(verticalFlipVideo, row1Y);

    // Flip the video vertically (mirrors top to bottom)
    engine.block.setFlipVertical(verticalFlipVideo, true);

    createLabel('Vertical', col3X, label1Y);

    // Demo 4: Both flips combined
    const bothFlipVideo = await engine.block.addVideo(
      videoUri,
      blockWidth,
      blockHeight
    );
    engine.block.appendChild(page, bothFlipVideo);
    engine.block.setPositionX(bothFlipVideo, col1X);
    engine.block.setPositionY(bothFlipVideo, row2Y);

    // Combine horizontal and vertical flips
    engine.block.setFlipHorizontal(bothFlipVideo, true);
    engine.block.setFlipVertical(bothFlipVideo, true);

    createLabel('Both', col1X, label2Y);

    // Query flip states
    const isFlippedH = engine.block.getFlipHorizontal(horizontalFlipVideo);
    const isFlippedV = engine.block.getFlipVertical(verticalFlipVideo);
    console.log(`Horizontal flip state: ${isFlippedH}`);
    console.log(`Vertical flip state: ${isFlippedV}`);

    // Toggle flip by reading current state and setting opposite
    const currentFlip = engine.block.getFlipHorizontal(originalVideo);
    engine.block.setFlipHorizontal(originalVideo, !currentFlip);
    console.log(`Toggled original video flip: ${!currentFlip}`);
    // Toggle back to keep original state for demo
    engine.block.setFlipHorizontal(originalVideo, currentFlip);

    // Demo 5: Group flip - flip multiple videos together
    const smallWidth = blockWidth / 2;
    const smallHeight = blockHeight / 2;
    const groupGap = 10;
    // Center the pair horizontally within column 2
    const groupPairWidth = smallWidth * 2 + groupGap;
    const groupStartX = col2X + (blockWidth - groupPairWidth) / 2;
    // Center vertically within row 2 (smaller blocks)
    const groupY = row2Y + (blockHeight - smallHeight) / 2;

    const groupVideo1 = await engine.block.addVideo(
      videoUri,
      smallWidth,
      smallHeight
    );
    engine.block.appendChild(page, groupVideo1);
    engine.block.setPositionX(groupVideo1, groupStartX);
    engine.block.setPositionY(groupVideo1, groupY);

    const groupVideo2 = await engine.block.addVideo(
      videoUri,
      smallWidth,
      smallHeight
    );
    engine.block.appendChild(page, groupVideo2);
    engine.block.setPositionX(groupVideo2, groupStartX + smallWidth + groupGap);
    engine.block.setPositionY(groupVideo2, groupY);

    // Group the videos and flip them together
    const groupId = engine.block.group([groupVideo1, groupVideo2]);
    engine.block.setFlipHorizontal(groupId, true);

    createLabel('Group Flip', col2X, label2Y);

    // Demo 6: Lock flip scope
    const lockedVideo = await engine.block.addVideo(
      videoUri,
      blockWidth,
      blockHeight
    );
    engine.block.appendChild(page, lockedVideo);
    engine.block.setPositionX(lockedVideo, col3X);
    engine.block.setPositionY(lockedVideo, row2Y);

    // Disable flip operations for this block
    engine.block.setScopeEnabled(lockedVideo, 'layer/flip', false);

    // Verify scope is disabled
    const canFlip = engine.block.isScopeEnabled(lockedVideo, 'layer/flip');
    console.log(`Flip enabled for locked video: ${canFlip}`);

    createLabel('Flip Locked', col3X, label2Y);

    // Set playhead to 1 second to show video content in thumbnails
    engine.block.setPlaybackTime(page, 1.0);

    console.log(
      'Flip Videos guide initialized. Use the timeline to view and edit videos.'
    );
  }
}

export default Example;
```

This guide covers how to flip videos both through the built-in user interface and programmatically using the Engine API.

## What You'll Learn

- Flip a video clip **horizontally or vertically**
- **Query** current flip states
- **Toggle** flip on or off programmatically
- Flip **multiple clips together** as a group
- **Lock** flip operations for template enforcement

## When to Use

Flipping helps when you need to:

- Create **symmetrical** video layouts or animated collages
- Align **eyelines** when switching between front and rear cameras
- Keep **branded elements** facing inward on split-screen layouts
- Enforce **template layouts** that should freeze flip states

## How Flipping Works

CE.SDK represents each video clip as a graphic block with transforms, including flip states. The flip API uses boolean setters and getters that apply to video blocks in the same way they apply to image blocks.

**Horizontal flipping** mirrors content left-to-right, creating a reflection as if viewed in a vertical mirror. **Vertical flipping** mirrors content top-to-bottom, inverting the image vertically.

## Using the Built-in Flip UI

The editor provides flip controls in the transform panel. Select a video block and use the flip buttons to mirror content horizontally or vertically. These controls are part of the layer transform options available for any graphic block.

## Programmatic Video Flipping

### Initialize CE.SDK

We initialize CE.SDK with video editing features enabled. This provides access to the timeline, playback controls, and transform operations.

```typescript highlight=highlight-enable-video-features
// Enable video editing features in CE.SDK
cesdk.feature.enable('ly.img.video');
cesdk.feature.enable('ly.img.timeline');
cesdk.feature.enable('ly.img.playback');
```

### Flip a Video Horizontally

To flip a video horizontally, call `engine.block.setFlipHorizontal()` with the block ID and `true`. This mirrors the content left-to-right.

```typescript highlight=highlight-flip-horizontal
    // Demo 1: Original video (no flip)
    const originalVideo = await engine.block.addVideo(
      videoUri,
      blockWidth,
      blockHeight
    );
    engine.block.appendChild(page, originalVideo);
    engine.block.setPositionX(originalVideo, col1X);
    engine.block.setPositionY(originalVideo, row1Y);

    createLabel('Original', col1X, label1Y);

    // Demo 2: Horizontal flip
    const horizontalFlipVideo = await engine.block.addVideo(
      videoUri,
      blockWidth,
      blockHeight
    );
    engine.block.appendChild(page, horizontalFlipVideo);
    engine.block.setPositionX(horizontalFlipVideo, col2X);
    engine.block.setPositionY(horizontalFlipVideo, row1Y);

    // Flip the video horizontally (mirrors left to right)
    engine.block.setFlipHorizontal(horizontalFlipVideo, true);
```

The flip is applied immediately. To restore the original orientation, call the same method with `false`.

### Flip a Video Vertically

Vertical flipping mirrors content top-to-bottom. We use `engine.block.setFlipVertical()` in the same way.

```typescript highlight=highlight-flip-vertical
    // Demo 3: Vertical flip
    const verticalFlipVideo = await engine.block.addVideo(
      videoUri,
      blockWidth,
      blockHeight
    );
    engine.block.appendChild(page, verticalFlipVideo);
    engine.block.setPositionX(verticalFlipVideo, col3X);
    engine.block.setPositionY(verticalFlipVideo, row1Y);

    // Flip the video vertically (mirrors top to bottom)
    engine.block.setFlipVertical(verticalFlipVideo, true);
```

### Combine Both Flips

You can apply both horizontal and vertical flips to the same block. This rotates the content 180 degrees while maintaining mirror properties on both axes.

```typescript highlight=highlight-flip-both
    // Demo 4: Both flips combined
    const bothFlipVideo = await engine.block.addVideo(
      videoUri,
      blockWidth,
      blockHeight
    );
    engine.block.appendChild(page, bothFlipVideo);
    engine.block.setPositionX(bothFlipVideo, col1X);
    engine.block.setPositionY(bothFlipVideo, row2Y);

    // Combine horizontal and vertical flips
    engine.block.setFlipHorizontal(bothFlipVideo, true);
    engine.block.setFlipVertical(bothFlipVideo, true);
```

### Query Flip State

Before applying changes, you may want to check the current flip state. Use `engine.block.getFlipHorizontal()` and `engine.block.getFlipVertical()` to query the current values.

```typescript highlight=highlight-get-flip-state
// Query flip states
const isFlippedH = engine.block.getFlipHorizontal(horizontalFlipVideo);
const isFlippedV = engine.block.getFlipVertical(verticalFlipVideo);
console.log(`Horizontal flip state: ${isFlippedH}`);
console.log(`Vertical flip state: ${isFlippedV}`);
```

Both methods return boolean values indicating whether the block is currently flipped on that axis.

### Toggle Flip On or Off

Calling `setFlipHorizontal(block, true)` twice doesn't revert the flip—it leaves the block mirrored. To toggle the flip state, read the current value and set the opposite.

```typescript highlight=highlight-toggle-flip
// Toggle flip by reading current state and setting opposite
const currentFlip = engine.block.getFlipHorizontal(originalVideo);
engine.block.setFlipHorizontal(originalVideo, !currentFlip);
console.log(`Toggled original video flip: ${!currentFlip}`);
// Toggle back to keep original state for demo
engine.block.setFlipHorizontal(originalVideo, currentFlip);
```

This pattern is useful for implementing toggle buttons in your application's user interface.

## Flipping Multiple Clips Together

### Group Flipping

When you need to flip multiple video blocks as a unit, group them first using `engine.block.group()`. Applying a flip to the group mirrors all elements while preserving their relative positions.

```typescript highlight=highlight-group-flip
    // Demo 5: Group flip - flip multiple videos together
    const smallWidth = blockWidth / 2;
    const smallHeight = blockHeight / 2;
    const groupGap = 10;
    // Center the pair horizontally within column 2
    const groupPairWidth = smallWidth * 2 + groupGap;
    const groupStartX = col2X + (blockWidth - groupPairWidth) / 2;
    // Center vertically within row 2 (smaller blocks)
    const groupY = row2Y + (blockHeight - smallHeight) / 2;

    const groupVideo1 = await engine.block.addVideo(
      videoUri,
      smallWidth,
      smallHeight
    );
    engine.block.appendChild(page, groupVideo1);
    engine.block.setPositionX(groupVideo1, groupStartX);
    engine.block.setPositionY(groupVideo1, groupY);

    const groupVideo2 = await engine.block.addVideo(
      videoUri,
      smallWidth,
      smallHeight
    );
    engine.block.appendChild(page, groupVideo2);
    engine.block.setPositionX(groupVideo2, groupStartX + smallWidth + groupGap);
    engine.block.setPositionY(groupVideo2, groupY);

    // Group the videos and flip them together
    const groupId = engine.block.group([groupVideo1, groupVideo2]);
    engine.block.setFlipHorizontal(groupId, true);
```

When you flip a group:

- All child blocks mirror together
- Relative spacing and positioning remain intact
- The flip applies to the group as a whole, not individual children

## Locking Flip Operations

### Prevent Flipping in Templates

For template-based workflows, you may want to prevent certain blocks from being flipped. Use `engine.block.setScopeEnabled()` with the `layer/flip` scope.

```typescript highlight=highlight-lock-flip
    // Demo 6: Lock flip scope
    const lockedVideo = await engine.block.addVideo(
      videoUri,
      blockWidth,
      blockHeight
    );
    engine.block.appendChild(page, lockedVideo);
    engine.block.setPositionX(lockedVideo, col3X);
    engine.block.setPositionY(lockedVideo, row2Y);

    // Disable flip operations for this block
    engine.block.setScopeEnabled(lockedVideo, 'layer/flip', false);

    // Verify scope is disabled
    const canFlip = engine.block.isScopeEnabled(lockedVideo, 'layer/flip');
    console.log(`Flip enabled for locked video: ${canFlip}`);
```

Setting the scope to `false` disables flip controls for that block. The block can still be flipped programmatically, but UI controls will be disabled.

For complete transform prevention, use `engine.block.setTransformLocked()` to lock all transforms including flip, rotation, and scaling.

## Troubleshooting

### Flip Not Applied

If setting flip values has no visible effect, verify that:

- The block ID is valid and references a video block
- The video resource has finished loading
- No parent group has an opposing flip applied

### Flip Operations Blocked

If flip operations appear blocked, check whether the `layer/flip` scope is disabled for that block. Use `engine.block.isScopeEnabled(block, 'layer/flip')` to verify.

### Parent Group Conflicts

When a parent group is flipped, child blocks appear flipped relative to the group. If you flip both the group and a child, the flips combine. To determine the visual orientation, consider the flip state of the entire hierarchy.

## API References in this Guide

| Method | Description |
| --- | --- |
| `engine.block.setFlipHorizontal(blockId, boolean)` | Mirror a block left/right or restore default orientation |
| `engine.block.setFlipVertical(blockId, boolean)` | Mirror a block top/bottom or restore default orientation |
| `engine.block.getFlipHorizontal(blockId)` | Check whether the block is currently flipped horizontally |
| `engine.block.getFlipVertical(blockId)` | Check whether the block is currently flipped vertically |
| `engine.block.group(blockIds[])` | Group blocks to flip them together |
| `engine.block.setScopeEnabled(blockId, 'layer/flip', boolean)` | Enable or disable flip controls for templates |
| `engine.block.setTransformLocked(blockId, boolean)` | Lock all transforms including flip |



---

## More Resources

- **[Vue Documentation Index](https://img.ly/docs/cesdk/vue.md)** - Browse all Vue documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./vue.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support