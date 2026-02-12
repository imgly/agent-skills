> This is one page of the CE.SDK Svelte documentation. For a complete overview, see the [Svelte Documentation Index](https://img.ly/svelte.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Create and Edit Videos](./create-video.md) > [Redaction](./edit-video/redaction.md)

---

Redact sensitive video content using blur, pixelization, or solid overlays for privacy protection.

![Video Redaction example showing video clips with blur, pixelization, and overlay effects](https://img.ly/docs/cesdk/./assets/browser.hero.webp)

> **Reading time:** 15 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/heads/main.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/main/guides-create-video-redaction-browser)
>
> - [Open in StackBlitz](https://stackblitz.com/~/github.com/imgly/cesdk-web-examples/tree/main/guides-create-video-redaction-browser)
>
> - [Live demo](https://img.ly/examples/guides-create-video-redaction-browser/)

CE.SDK applies effects to blocks themselves, not as overlays affecting content beneath. This means redaction involves applying effects directly to the block for complete obscuration. Four techniques cover most privacy scenarios: full-block blur, radial blur, pixelization, and solid overlays.

```typescript file=@cesdk_web_examples/guides-create-video-redaction-browser/browser.ts reference-only
import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';
import packageJson from './package.json';

// Video URLs for demonstrating different redaction scenarios
const VIDEOS = {
  surfer:
    'https://cdn.img.ly/assets/demo/v3/ly.img.video/videos/pexels-drone-footage-of-a-surfer-barrelling-a-wave-12715991.mp4',
  lifestyle1:
    'https://cdn.img.ly/assets/demo/v3/ly.img.video/videos/pexels-taryn-elliott-7108793.mp4',
  lifestyle2:
    'https://cdn.img.ly/assets/demo/v3/ly.img.video/videos/pexels-taryn-elliott-7108801.mp4',
  nature1:
    'https://cdn.img.ly/assets/demo/v3/ly.img.video/videos/pexels-taryn-elliott-8713109.mp4',
  nature2:
    'https://cdn.img.ly/assets/demo/v3/ly.img.video/videos/pexels-taryn-elliott-8713114.mp4'
};

// Labels for each redaction technique
const LABELS = [
  'Radial Blur',
  'Full-Block Blur',
  'Pixelization',
  'Solid Overlay',
  'Time-Based'
];

// Duration for each video segment (in seconds)
const SEGMENT_DURATION = 5.0;

/**
 * CE.SDK Plugin: Video Redaction Guide
 *
 * Demonstrates video redaction techniques in CE.SDK:
 * - Full-block blur for complete video obscuration
 * - Radial blur for circular redaction patterns
 * - Pixelization for mosaic-style censoring
 * - Solid overlays for complete blocking
 * - Time-based redactions
 */
class Example implements EditorPlugin {
  name = packageJson.name;

  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    // Enable video editing features
    cesdk.feature.enable('ly.img.video');
    cesdk.feature.enable('ly.img.timeline');
    cesdk.feature.enable('ly.img.playback');
    cesdk.feature.enable('ly.img.blur');
    cesdk.feature.enable('ly.img.effect');

    // Load assets and create a video scene
    await cesdk.addDefaultAssetSources();
    await cesdk.addDemoAssetSources({
      sceneMode: 'Video',
      withUploadAssetSources: true
    });
    await cesdk.createVideoScene();

    const engine = cesdk.engine;
    const scene = engine.scene.get();
    const pages = engine.block.findByType('page');
    const page = pages.length > 0 ? pages[0] : scene;

    // Set 16:9 page dimensions (1920x1080)
    const pageWidth = 1920;
    const pageHeight = 1080;
    engine.block.setWidth(page, pageWidth);
    engine.block.setHeight(page, pageHeight);

    // Load all videos simultaneously
    const videoUrls = [
      VIDEOS.nature2,
      VIDEOS.surfer,
      VIDEOS.lifestyle1,
      VIDEOS.lifestyle2,
      VIDEOS.nature1
    ];

    const videos = await Promise.all(
      videoUrls.map((url) => engine.block.addVideo(url, pageWidth, pageHeight))
    );

    const [
      radialVideo,
      fullBlurVideo,
      pixelVideo,
      , // Base video for overlay segment (overlay is created separately)
      timedVideo
    ] = videos;

    // Position all videos at origin (they'll play sequentially)
    videos.forEach((video, index) => {
      engine.block.setPositionX(video, 0);
      engine.block.setPositionY(video, 0);
      engine.block.setDuration(video, SEGMENT_DURATION);
      engine.block.setTimeOffset(video, index * SEGMENT_DURATION);
      engine.block.appendChild(page, video);
    });

    // Full-Block Blur: Apply blur to entire video
    // Use this when the entire video content needs obscuring

    // Check if the block supports blur
    const supportsBlur = engine.block.supportsBlur(fullBlurVideo);
    // eslint-disable-next-line no-console
    console.log('Video supports blur:', supportsBlur);

    // Create and apply uniform blur to entire video
    const uniformBlur = engine.block.createBlur('uniform');
    engine.block.setFloat(uniformBlur, 'blur/uniform/intensity', 0.7);
    engine.block.setBlur(fullBlurVideo, uniformBlur);
    engine.block.setBlurEnabled(fullBlurVideo, true);

    // Pixelization: Apply mosaic effect for clearly intentional censoring

    // Check if the block supports effects
    if (engine.block.supportsEffects(pixelVideo)) {
      // Create and apply pixelize effect
      const pixelizeEffect = engine.block.createEffect('pixelize');
      engine.block.setInt(pixelizeEffect, 'effect/pixelize/horizontalPixelSize', 24);
      engine.block.setInt(pixelizeEffect, 'effect/pixelize/verticalPixelSize', 24);
      engine.block.appendEffect(pixelVideo, pixelizeEffect);
      engine.block.setEffectEnabled(pixelizeEffect, true);
    }

    // Solid Overlay: Create opaque shape for complete blocking
    // Best for highly sensitive information like documents or credentials

    // Create a solid rectangle overlay
    const overlay = engine.block.create('//ly.img.ubq/graphic');
    const rectShape = engine.block.createShape('//ly.img.ubq/shape/rect');
    engine.block.setShape(overlay, rectShape);

    // Create solid black fill
    const solidFill = engine.block.createFill('//ly.img.ubq/fill/color');
    engine.block.setColor(solidFill, 'fill/color/value', {
      r: 0.1, g: 0.1, b: 0.1, a: 1.0
    });
    engine.block.setFill(overlay, solidFill);

    // Position and size the overlay
    engine.block.setWidth(overlay, pageWidth * 0.4);
    engine.block.setHeight(overlay, pageHeight * 0.3);
    engine.block.setPositionX(overlay, pageWidth * 0.55);
    engine.block.setPositionY(overlay, pageHeight * 0.65);
    engine.block.appendChild(page, overlay);
    engine.block.setTimeOffset(overlay, 3 * SEGMENT_DURATION);
    engine.block.setDuration(overlay, SEGMENT_DURATION);

    // Time-Based Redaction: Redaction appears only during specific time range

    // Apply blur to the video
    const timedBlur = engine.block.createBlur('uniform');
    engine.block.setFloat(timedBlur, 'blur/uniform/intensity', 0.9);
    engine.block.setBlur(timedVideo, timedBlur);
    engine.block.setBlurEnabled(timedVideo, true);

    // The video is already timed to appear at a specific offset (set earlier)
    // You can adjust timeOffset and duration to control when redaction is visible
    engine.block.setTimeOffset(timedVideo, 4 * SEGMENT_DURATION);
    engine.block.setDuration(timedVideo, SEGMENT_DURATION);

    // Radial Blur: Use radial blur for face-like regions

    // Apply radial blur for circular redaction effect
    const radialBlur = engine.block.createBlur('radial');
    engine.block.setFloat(radialBlur, 'blur/radial/blurRadius', 50);
    engine.block.setFloat(radialBlur, 'blur/radial/radius', 25);
    engine.block.setFloat(radialBlur, 'blur/radial/gradientRadius', 35);
    engine.block.setFloat(radialBlur, 'blur/radial/x', 0.5);
    engine.block.setFloat(radialBlur, 'blur/radial/y', 0.45);
    engine.block.setBlur(radialVideo, radialBlur);
    engine.block.setBlurEnabled(radialVideo, true);

    // Add text labels for each video segment (positioned top-right)
    const labelWidth = 400;
    const labelHeight = 60;
    const labelPadding = 20;
    const labelMargin = 30;

    videos.forEach((_, index) => {
      const label = LABELS[index];

      // Add background first (so it's behind text)
      const labelBg = engine.block.create('//ly.img.ubq/graphic');
      const labelBgShape = engine.block.createShape('//ly.img.ubq/shape/rect');
      engine.block.setShape(labelBg, labelBgShape);

      const labelBgFill = engine.block.createFill('//ly.img.ubq/fill/color');
      engine.block.setColor(labelBgFill, 'fill/color/value', {
        r: 0.0,
        g: 0.0,
        b: 0.0,
        a: 0.8
      });
      engine.block.setFill(labelBg, labelBgFill);

      engine.block.setWidth(labelBg, labelWidth);
      engine.block.setHeight(labelBg, labelHeight + labelPadding);
      engine.block.setPositionX(labelBg, pageWidth - labelWidth - labelMargin);
      engine.block.setPositionY(labelBg, labelMargin);
      engine.block.setTimeOffset(labelBg, index * SEGMENT_DURATION);
      engine.block.setDuration(labelBg, SEGMENT_DURATION);
      engine.block.appendChild(page, labelBg);

      // Create text block for label
      const textBlock = engine.block.create('//ly.img.ubq/text');
      engine.block.setString(textBlock, 'text/text', label);
      engine.block.setFloat(textBlock, 'text/fontSize', 48);
      engine.block.setEnum(textBlock, 'text/horizontalAlignment', 'Center');
      engine.block.setEnum(textBlock, 'text/verticalAlignment', 'Center');

      // Set white text color
      engine.block.setTextColor(textBlock, { r: 1.0, g: 1.0, b: 1.0, a: 1.0 });

      // Position label at top right
      engine.block.setWidth(textBlock, labelWidth);
      engine.block.setHeight(textBlock, labelHeight);
      engine.block.setPositionX(textBlock, pageWidth - labelWidth - labelMargin);
      engine.block.setPositionY(textBlock, labelMargin + labelPadding / 2);
      engine.block.setTimeOffset(textBlock, index * SEGMENT_DURATION);
      engine.block.setDuration(textBlock, SEGMENT_DURATION);

      engine.block.appendChild(page, textBlock);
    });

    // Enable auto-fit to keep page in view
    cesdk.engine.scene.enableZoomAutoFit(page, 'Both', 40, 40, 40, 40);

    // Select first video to show timeline controls
    engine.block.select(fullBlurVideo);

    // eslint-disable-next-line no-console
    console.log(
      'Video redaction guide initialized. Videos play sequentially - press play to see each redaction technique.'
    );
  }
}

export default Example;
```

This guide covers how to use the built-in UI for blur and pixelization effects, and how to apply redaction programmatically using blur, pixelization, solid overlays, and time-based controls.

## Understanding Redaction in CE.SDK

### How Effects Work

Effects in CE.SDK modify the block's appearance directly rather than creating transparent overlays that affect content beneath. When you blur a video block, the entire block becomes blurred—not just a region on top of the video.

### Choosing a Redaction Technique

Select your technique based on privacy requirements and visual impact:

- **Full-block blur**: Complete obscuration for backgrounds or placeholder content
- **Radial blur**: Circular blur patterns ideal for face-like regions
- **Pixelization**: Clearly intentional censoring that's faster to render than heavy blur
- **Solid overlays**: Complete blocking for highly sensitive information like documents or credentials

## Using the Built-in UI

### Accessing Blur Controls

When you select a video block, the inspector panel provides access to blur settings. Navigate to the blur section to find controls for different blur types including uniform, radial, linear, and mirrored.

The uniform blur applies consistent intensity across the entire block. Adjust the intensity slider to control how strongly the content is obscured. Higher values create stronger privacy protection but may affect visual quality.

### Accessing Pixelization Controls

The effects panel contains pixelization settings. Select your video block, open the effects section, and add a pixelize effect. Configure the horizontal and vertical pixel sizes to control the mosaic block dimensions.

Larger pixel sizes create stronger obscuration but are more visually disruptive. Values between 15-30 pixels work well for standard redaction scenarios.

## Programmatic Redaction

### Full-Block Blur

When the entire video needs obscuring, apply blur directly to the original block without duplication. This approach works well for background content or privacy placeholders.

```typescript highlight-full-block-blur
    // Check if the block supports blur
    const supportsBlur = engine.block.supportsBlur(fullBlurVideo);
    // eslint-disable-next-line no-console
    console.log('Video supports blur:', supportsBlur);

    // Create and apply uniform blur to entire video
    const uniformBlur = engine.block.createBlur('uniform');
    engine.block.setFloat(uniformBlur, 'blur/uniform/intensity', 0.7);
    engine.block.setBlur(fullBlurVideo, uniformBlur);
    engine.block.setBlurEnabled(fullBlurVideo, true);
```

We first check that the block supports blur with `supportsBlur()`. Then we create a uniform blur, configure its intensity, attach it to the video block with `setBlur()`, and enable it with `setBlurEnabled()`. The intensity value ranges from 0.0 to 1.0, where higher values create stronger blur.

### Pixelization

Pixelization creates a mosaic effect that's clearly intentional and renders faster than heavy blur. We use the effect system rather than the blur system for pixelization.

```typescript highlight-pixelization
// Check if the block supports effects
if (engine.block.supportsEffects(pixelVideo)) {
  // Create and apply pixelize effect
  const pixelizeEffect = engine.block.createEffect('pixelize');
  engine.block.setInt(pixelizeEffect, 'effect/pixelize/horizontalPixelSize', 24);
  engine.block.setInt(pixelizeEffect, 'effect/pixelize/verticalPixelSize', 24);
  engine.block.appendEffect(pixelVideo, pixelizeEffect);
  engine.block.setEffectEnabled(pixelizeEffect, true);
}
```

We check `supportsEffects()` before creating the pixelize effect. The horizontal and vertical pixel sizes control the mosaic block dimensions—larger values create stronger obscuration.

### Solid Overlays

For complete blocking without any visual hint of the underlying content, create an opaque shape overlay. This approach doesn't require block duplication.

```typescript highlight-solid-overlay
    // Create a solid rectangle overlay
    const overlay = engine.block.create('//ly.img.ubq/graphic');
    const rectShape = engine.block.createShape('//ly.img.ubq/shape/rect');
    engine.block.setShape(overlay, rectShape);

    // Create solid black fill
    const solidFill = engine.block.createFill('//ly.img.ubq/fill/color');
    engine.block.setColor(solidFill, 'fill/color/value', {
      r: 0.1, g: 0.1, b: 0.1, a: 1.0
    });
    engine.block.setFill(overlay, solidFill);

    // Position and size the overlay
    engine.block.setWidth(overlay, pageWidth * 0.4);
    engine.block.setHeight(overlay, pageHeight * 0.3);
    engine.block.setPositionX(overlay, pageWidth * 0.55);
    engine.block.setPositionY(overlay, pageHeight * 0.65);
    engine.block.appendChild(page, overlay);
```

We create a graphic block with a rectangle shape and solid color fill. The overlay uses absolute page coordinates for positioning. Set the alpha to 1.0 for complete opacity.

### Time-Based Redaction

Redactions can appear only during specific portions of the video timeline. We use `setTimeOffset()` and `setDuration()` to control when the redaction is visible.

```typescript highlight-time-based-redaction
    // Apply blur to the video
    const timedBlur = engine.block.createBlur('uniform');
    engine.block.setFloat(timedBlur, 'blur/uniform/intensity', 0.9);
    engine.block.setBlur(timedVideo, timedBlur);
    engine.block.setBlurEnabled(timedVideo, true);

    // The video is already timed to appear at a specific offset (set earlier)
    // You can adjust timeOffset and duration to control when redaction is visible
    engine.block.setTimeOffset(timedVideo, 4 * SEGMENT_DURATION);
    engine.block.setDuration(timedVideo, SEGMENT_DURATION);
```

The time offset specifies when the redaction appears (in seconds from the start), and the duration controls how long it remains visible. This is useful for redacting faces or information that only appears briefly.

### Radial Blur

For face-like regions, radial blur creates a circular blur pattern that works well with rounded subjects.

```typescript highlight-radial-blur
// Apply radial blur for circular redaction effect
const radialBlur = engine.block.createBlur('radial');
engine.block.setFloat(radialBlur, 'blur/radial/blurRadius', 50);
engine.block.setFloat(radialBlur, 'blur/radial/radius', 25);
engine.block.setFloat(radialBlur, 'blur/radial/gradientRadius', 35);
engine.block.setFloat(radialBlur, 'blur/radial/x', 0.5);
engine.block.setFloat(radialBlur, 'blur/radial/y', 0.45);
engine.block.setBlur(radialVideo, radialBlur);
engine.block.setBlurEnabled(radialVideo, true);
```

Radial blur properties control the blur center (`x`, `y` from 0.0-1.0), the unblurred center area (`radius`), the blur transition zone (`gradientRadius`), and the blur strength (`blurRadius`).

## Performance Considerations

Different redaction techniques have different performance impacts:

- **Solid overlays**: Minimal impact, can create many without significant overhead
- **Pixelization**: Faster than blur, larger pixel sizes have minimal impact
- **Blur effects**: Higher intensity values increase rendering time

For complex scenes with multiple redactions, consider using solid overlays where blur isn't necessary, or reduce blur intensity to maintain smooth playback.

## Troubleshooting

### Redaction Not Visible

If your redaction doesn't appear, verify that:

- The overlay is a child of the page with `appendChild()`
- Blur is enabled with `setBlurEnabled()` after setting it with `setBlur()`
- Effects are enabled with `setEffectEnabled()` after appending with `appendEffect()`

### Performance Issues

Reduce blur intensity, use pixelization instead of heavy blur, or switch to solid overlays for some redactions.

## Best Practices

- **Preview thoroughly**: Scrub the entire timeline to verify all sensitive content is covered
- **Add safety margins**: Make redaction regions slightly larger than the sensitive area
- **Test at export resolution**: Higher resolutions may need stronger blur settings
- **Archive originals**: Exported redactions are permanent and cannot be reversed
- **Document redactions**: For compliance requirements, maintain records of what was redacted

## API Reference

| Method | Description |
| ------ | ----------- |
| `block.supportsBlur(id)` | Check if block supports blur effects |
| `block.createBlur(type)` | Create blur instance (uniform, radial, linear, mirrored) |
| `block.setBlur(id, blur)` | Apply blur to block |
| `block.setBlurEnabled(id, enabled)` | Enable or disable blur |
| `block.supportsEffects(id)` | Check if block supports effects |
| `block.createEffect(type)` | Create effect instance (pixelize, etc.) |
| `block.appendEffect(id, effect)` | Add effect to block |
| `block.setEffectEnabled(effect, enabled)` | Enable or disable effect |
| `block.setTimeOffset(id, offset)` | Set when block appears in timeline |
| `block.setDuration(id, duration)` | Set block duration in timeline |
| `block.create(type)` | Create block of specified type |
| `block.createShape(type)` | Create shape for graphic blocks |
| `block.setShape(id, shape)` | Apply shape to graphic block |
| `block.createFill(type)` | Create fill (color, image, video, gradient) |
| `block.setFill(id, fill)` | Apply fill to block |
| `block.setFloat(id, property, value)` | Set float property value |
| `block.setInt(id, property, value)` | Set integer property value |
| `block.setColor(id, property, color)` | Set color property value |



---

## More Resources

- **[Svelte Documentation Index](https://img.ly/svelte.md)** - Browse all Svelte documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./svelte.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support