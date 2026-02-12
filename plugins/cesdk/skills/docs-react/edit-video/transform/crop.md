> This is one page of the CE.SDK React documentation. For a complete overview, see the [React Documentation Index](https://img.ly/react.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Create and Edit Videos](./create-video.md) > [Transform](./edit-video/transform.md) > [Crop](./edit-video/transform/crop.md)

---

Crop videos to focus on specific areas, remove unwanted edges, or prepare clips for fixed formats like 9:16 stories using programmatic crop transforms.

![Crop videos example showing cropped video content](https://img.ly/docs/cesdk/./assets/browser.hero.webp)

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/heads/main.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/main/guides-create-video-transform-crop-browser)
>
> - [Open in StackBlitz](https://stackblitz.com/~/github.com/imgly/cesdk-web-examples/tree/main/guides-create-video-transform-crop-browser)
>
> - [Live demo](https://img.ly/examples/guides-create-video-transform-crop-browser/)

Video cropping in CreativeEditor SDK (CE.SDK) lets you re-frame clips, remove unwanted edges, or adapt footage for platform-specific formats. Unlike resizing or scaling which affects the entire frame uniformly, cropping selects a specific region to display.

```typescript file=@cesdk_web_examples/guides-create-video-transform-crop-browser/browser.ts reference-only
import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';
import packageJson from './package.json';

class Example implements EditorPlugin {
  name = packageJson.name;
  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    // Load default and demo asset sources
    await cesdk.addDefaultAssetSources();
    await cesdk.addDemoAssetSources({
      sceneMode: 'Video',
      withUploadAssetSources: true
    });

    // Create a video scene - automatically sets up page and track structure
    await cesdk.createVideoScene();

    const engine = cesdk.engine;

    // Get the page from the scene
    const pages = engine.block.findByType('page');
    const page = pages[0];

    // Set the page dimensions to match the video aspect ratio (9:16 portrait)
    engine.block.setWidth(page, 720);
    engine.block.setHeight(page, 1280);

    // Add a video using the convenience API - this handles track creation automatically
    const videoUri =
      'https://cdn.img.ly/assets/demo/v3/ly.img.video/videos/pexels-drone-footage-of-a-surfer-barrelling-a-wave-12715991.mp4';
    const videoBlock = await engine.block.addVideo(videoUri, 720, 1280);

    // Append the video block to the page (for video scenes, this adds to the track)
    engine.block.appendChild(page, videoBlock);

    // Set video duration on the timeline
    engine.block.setDuration(videoBlock, 10);

    // Get the fill to force load the video resource
    const videoFill = engine.block.getFill(videoBlock);
    await engine.block.forceLoadAVResource(videoFill);

    // Verify the block supports cropping before applying crop operations
    const supportsCrop = engine.block.supportsCrop(videoBlock);
    console.log('Block supports crop:', supportsCrop);

    // Set content fill mode to 'Crop' for manual crop control
    // This enables the crop transform APIs to take effect
    engine.block.setContentFillMode(videoBlock, 'Crop');

    // Scale the video content within its frame using uniform scale ratio
    // Values greater than 1.0 zoom in, values less than 1.0 zoom out
    engine.block.setCropScaleRatio(videoBlock, 1.1);

    // Pan the video content within the crop frame
    // Translation values are percentages of the crop frame dimensions
    // Positive X moves content right, positive Y moves content down
    engine.block.setCropTranslationX(videoBlock, 0.0);
    engine.block.setCropTranslationY(videoBlock, 0.0);

    // Rotate the video content within its frame
    // Rotation is specified in radians (Math.PI = 180 degrees)
    engine.block.setCropRotation(videoBlock, Math.PI / 90); // 2 degrees

    // Retrieve the current crop state
    const scaleRatio = engine.block.getCropScaleRatio(videoBlock);
    const translationX = engine.block.getCropTranslationX(videoBlock);
    const translationY = engine.block.getCropTranslationY(videoBlock);
    const rotation = engine.block.getCropRotation(videoBlock);

    console.log('Crop scale ratio:', scaleRatio);
    console.log('Crop translation X:', translationX);
    console.log('Crop translation Y:', translationY);
    console.log('Crop rotation (radians):', rotation);

    // Adjust crop to ensure content fills the frame without letterboxing
    // The minScaleRatio parameter sets the minimum allowed scale
    // This corrects any black bars caused by rotation or translation
    engine.block.adjustCropToFillFrame(videoBlock, 1.1);
    const finalScale = engine.block.getCropScaleRatio(videoBlock);
    console.log('Adjusted scale ratio:', finalScale);

    // Flip the video content within its crop frame
    // This flips the content, not the entire block
    engine.block.flipCropHorizontal(videoBlock);

    // Lock the crop aspect ratio during interactive editing
    // When locked, crop handles maintain the current aspect ratio
    engine.block.setCropAspectRatioLocked(videoBlock, true);
    const isLocked = engine.block.isCropAspectRatioLocked(videoBlock);
    console.log('Crop aspect ratio locked:', isLocked);

    // Reset crop to default state (removes all crop transformations)
    engine.block.resetCrop(videoBlock);
    // Re-apply a subtle zoom to demonstrate crop is working
    engine.block.setCropScaleRatio(videoBlock, 1.05);

    // Select the video block to show it in the UI
    engine.block.select(videoBlock);

    // Set playback time to show video content
    engine.block.setPlaybackTime(page, 2.0);

    // Zoom to the video block for better visibility of the crop effect
    cesdk.engine.scene.zoomToBlock(videoBlock, 0.5, 0.5, 0.8);
  }
}

export default Example;
```

This guide covers programmatic video cropping using scale, translation, and rotation transforms, checking crop support, adjusting crop to fill frames, flipping content, and locking aspect ratios.

## Check Crop Support

Before applying crop operations, verify the block supports cropping using `engine.block.supportsCrop()`. Video blocks with fills support cropping:

```typescript highlight-check-crop-support
    // Verify the block supports cropping before applying crop operations
    const supportsCrop = engine.block.supportsCrop(videoBlock);
    console.log('Block supports crop:', supportsCrop);

    // Set content fill mode to 'Crop' for manual crop control
    // This enables the crop transform APIs to take effect
    engine.block.setContentFillMode(videoBlock, 'Crop');
```

## Scale Crop

Scale the video content within its frame using `engine.block.setCropScaleRatio()`. Values greater than 1.0 zoom in, values less than 1.0 zoom out. This applies a uniform scale to both axes:

```typescript highlight-scale-crop
// Scale the video content within its frame using uniform scale ratio
// Values greater than 1.0 zoom in, values less than 1.0 zoom out
engine.block.setCropScaleRatio(videoBlock, 1.1);
```

## Translate Crop

Pan the video content within the crop frame using `engine.block.setCropTranslationX()` and `engine.block.setCropTranslationY()`. Translation values are percentages of the crop frame dimensions. Positive X moves content right, positive Y moves content down:

```typescript highlight-translate-crop
// Pan the video content within the crop frame
// Translation values are percentages of the crop frame dimensions
// Positive X moves content right, positive Y moves content down
engine.block.setCropTranslationX(videoBlock, 0.0);
engine.block.setCropTranslationY(videoBlock, 0.0);
```

## Rotate Crop

Rotate the video content within its frame using `engine.block.setCropRotation()`. Rotation is specified in radians where `Math.PI` equals 180 degrees:

```typescript highlight-rotate-crop
// Rotate the video content within its frame
// Rotation is specified in radians (Math.PI = 180 degrees)
engine.block.setCropRotation(videoBlock, Math.PI / 90); // 2 degrees
```

## Get Crop Values

Retrieve the current crop state to read or restore crop settings using getter methods:

```typescript highlight-get-crop-values
    // Retrieve the current crop state
    const scaleRatio = engine.block.getCropScaleRatio(videoBlock);
    const translationX = engine.block.getCropTranslationX(videoBlock);
    const translationY = engine.block.getCropTranslationY(videoBlock);
    const rotation = engine.block.getCropRotation(videoBlock);

    console.log('Crop scale ratio:', scaleRatio);
    console.log('Crop translation X:', translationX);
    console.log('Crop translation Y:', translationY);
    console.log('Crop rotation (radians):', rotation);
```

## Fill Frame

Adjust the crop to ensure content fills the frame without letterboxing using `engine.block.adjustCropToFillFrame()`. The `minScaleRatio` parameter sets the minimum allowed scale:

```typescript highlight-fill-frame
// Adjust crop to ensure content fills the frame without letterboxing
// The minScaleRatio parameter sets the minimum allowed scale
// This corrects any black bars caused by rotation or translation
engine.block.adjustCropToFillFrame(videoBlock, 1.1);
const finalScale = engine.block.getCropScaleRatio(videoBlock);
console.log('Adjusted scale ratio:', finalScale);
```

This is useful after applying translations or rotations that might reveal empty areas.

## Flip Crop

Flip the video content horizontally or vertically within its crop frame using `engine.block.flipCropHorizontal()` or `engine.block.flipCropVertical()`. This flips the content, not the block itself:

```typescript highlight-flip-crop
// Flip the video content within its crop frame
// This flips the content, not the entire block
engine.block.flipCropHorizontal(videoBlock);
```

## Lock Aspect Ratio

Lock the crop aspect ratio during interactive editing using `engine.block.setCropAspectRatioLocked()`. When locked, crop handles maintain the current aspect ratio:

```typescript highlight-lock-aspect-ratio
// Lock the crop aspect ratio during interactive editing
// When locked, crop handles maintain the current aspect ratio
engine.block.setCropAspectRatioLocked(videoBlock, true);
const isLocked = engine.block.isCropAspectRatioLocked(videoBlock);
console.log('Crop aspect ratio locked:', isLocked);
```

## Reset Crop

Reset all crop transformations to their default state using `engine.block.resetCrop()`:

```typescript highlight-reset-crop
// Reset crop to default state (removes all crop transformations)
engine.block.resetCrop(videoBlock);
// Re-apply a subtle zoom to demonstrate crop is working
engine.block.setCropScaleRatio(videoBlock, 1.05);
```

## Coordinate System

Crop transforms use normalized values:

| Property | Value Type | Description |
| --- | --- | --- |
| Scale | Float (0.0+) | 1.0 is original size, 2.0 is double, 0.5 is half |
| Translation | Float (-1.0 to 1.0) | Percentage of frame dimensions |
| Rotation | Float (radians) | Math.PI = 180°, Math.PI/2 = 90° |

All crop values are independent of canvas zoom level or timeline duration.

## Combining with Other Transforms

You can combine crop operations with other block transforms like position, rotation, and scale. The crop transforms affect the content within the block, while block transforms affect the block itself on the canvas:

```typescript
// Crop the content (scales/pans the video within its frame)
engine.block.setCropScaleRatio(videoBlock, 1.5);
engine.block.setCropRotation(videoBlock, Math.PI / 12);

// Transform the block itself (moves/rotates the entire block on canvas)
engine.block.setRotation(videoBlock, Math.PI / 6);
engine.block.setWidth(videoBlock, 800);
```

## Troubleshooting

### Crop Functions Not Working

Check if the block supports cropping using `engine.block.supportsCrop()`. Ensure the block has a fill that supports cropping (video, image fills).

### Black Bars After Scaling

Call `engine.block.adjustCropToFillFrame()` or increase the scale ratio so content fully covers the block frame.

### Unexpected Crop Behavior

Verify you're operating on the correct block ID. Check that the video resource has loaded using `engine.block.forceLoadAVResource()` before applying crop transforms.

## API Reference

| Method | Description |
| --- | --- |
| `engine.block.supportsCrop()` | Check if block supports cropping |
| `engine.block.setCropScaleRatio()` | Set uniform scale ratio |
| `engine.block.setCropScaleX()` | Set horizontal scale |
| `engine.block.setCropScaleY()` | Set vertical scale |
| `engine.block.setCropTranslationX()` | Set horizontal pan |
| `engine.block.setCropTranslationY()` | Set vertical pan |
| `engine.block.setCropRotation()` | Set rotation in radians |
| `engine.block.getCropScaleRatio()` | Get current scale ratio |
| `engine.block.getCropTranslationX()` | Get horizontal translation |
| `engine.block.getCropTranslationY()` | Get vertical translation |
| `engine.block.getCropRotation()` | Get rotation value |
| `engine.block.adjustCropToFillFrame()` | Auto-adjust to fill frame |
| `engine.block.flipCropHorizontal()` | Flip content horizontally |
| `engine.block.flipCropVertical()` | Flip content vertically |
| `engine.block.setCropAspectRatioLocked()` | Lock/unlock aspect ratio |
| `engine.block.isCropAspectRatioLocked()` | Check if aspect ratio locked |
| `engine.block.resetCrop()` | Reset all crop transforms |



---

## More Resources

- **[React Documentation Index](https://img.ly/react.md)** - Browse all React documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./react.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support