> This is one page of the CE.SDK Next.js documentation. For a complete overview, see the [Next.js Documentation Index](https://img.ly/nextjs.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Fills](./fills.md) > [Video](./fills/video.md)

---

Apply motion content to design elements by filling shapes, backgrounds, and
text with videos using CE.SDK's video fill system.

![CE.SDK video fills example showing a 3x3 grid with video content applied to different blocks including rectangles, ellipse, and opacity variations](https://img.ly/docs/cesdk/./assets/browser.hero.webp)

> **Reading time:** 15 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/heads/main.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/main/guides-fills-video-browser)
>
> - [Open in StackBlitz](https://stackblitz.com/~/github.com/imgly/cesdk-web-examples/tree/main/guides-fills-video-browser)
>
> - [Live demo](https://img.ly/examples/guides-fills-video-browser/)

Understanding the distinction between **video fills** and **video blocks** is essential. Video fills are fill objects that can be applied to any block supporting fills—shapes, text, backgrounds—to paint them with video content. Video blocks, created with `addVideo()`, are dedicated timeline elements with full editing capabilities like trimming and duration control. Video fills focus on applying video as a visual treatment, while video blocks provide complete video editing functionality.

```typescript file=@cesdk_web_examples/guides-fills-video-browser/browser.ts reference-only
import type {
  CreativeEngine,
  EditorPlugin,
  EditorPluginContext
} from '@cesdk/cesdk-js';
import packageJson from './package.json';

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
import { calculateGridLayout } from './utils';

/**
 * CE.SDK Plugin: Video Fills Guide
 *
 * Demonstrates video fills in CE.SDK:
 * - Creating video fills
 * - Setting video sources (single URI and source sets)
 * - Applying video fills to blocks
 * - Content fill modes (Cover, Contain)
 * - Loading video resources
 * - Getting video thumbnails
 * - Different use cases (backgrounds, shapes, text)
 */
class Example implements EditorPlugin {
  name = packageJson.name;
  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    // Video fills require Video mode and video features enabled
    cesdk.feature.enable('ly.img.video');
    cesdk.feature.enable('ly.img.fill');
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

    const engine = cesdk.engine as CreativeEngine;
    const pages = engine.block.findByType('page');
    const page = pages.length > 0 ? pages[0] : engine.scene.get();

    // Calculate responsive grid layout based on page dimensions
    const pageWidth = engine.block.getWidth(page);
    const pageHeight = engine.block.getHeight(page);
    const layout = calculateGridLayout(pageWidth, pageHeight, 8);
    const { blockWidth, blockHeight, getPosition } = layout;

    // Use a sample video URL from demo assets
    const videoUri = 'https://img.ly/static/ubq_video_samples/bbb.mp4';

    // Create a sample block to demonstrate fill support checking
    const sampleBlock = engine.block.create('graphic');
    engine.block.setShape(sampleBlock, engine.block.createShape('rect'));

    // Check if the block supports fills
    const supportsFills = engine.block.supportsFill(sampleBlock);
    // eslint-disable-next-line no-console
    console.log('Block supports fills:', supportsFills); // true for graphic blocks

    // Verify we're in Video mode (required for video fills)
    const sceneMode = engine.scene.getMode();
    if (sceneMode !== 'Video') {
      throw new Error('Video fills require Video mode.');
    }
    // eslint-disable-next-line no-console
    console.log('Scene mode:', sceneMode); // "Video"

    // Pattern #1: Demonstrate Individual Before Combined
    // Create a basic video fill demonstration
    const basicBlock = engine.block.create('graphic');
    engine.block.setShape(basicBlock, engine.block.createShape('rect'));
    engine.block.setWidth(basicBlock, blockWidth);
    engine.block.setHeight(basicBlock, blockHeight);
    engine.block.appendChild(page, basicBlock);

    // Create a video fill
    const basicVideoFill = engine.block.createFill('video');
    // or using full type name: engine.block.createFill('//ly.img.ubq/fill/video');

    // Set the video source URI
    engine.block.setString(basicVideoFill, 'fill/video/fileURI', videoUri);

    // Apply the fill to the block
    engine.block.setFill(basicBlock, basicVideoFill);

    // Get and verify the current fill
    const fillId = engine.block.getFill(basicBlock);
    const fillType = engine.block.getType(fillId);
    // eslint-disable-next-line no-console
    console.log('Fill type:', fillType); // '//ly.img.ubq/fill/video'

    // Pattern #2: Content fill mode - Cover
    // Cover mode fills entire block, may crop video to fit
    const coverBlock = engine.block.create('graphic');
    engine.block.setShape(coverBlock, engine.block.createShape('rect'));
    engine.block.setWidth(coverBlock, blockWidth);
    engine.block.setHeight(coverBlock, blockHeight);
    engine.block.appendChild(page, coverBlock);

    const coverVideoFill = engine.block.createFill('video');
    engine.block.setString(coverVideoFill, 'fill/video/fileURI', videoUri);
    engine.block.setFill(coverBlock, coverVideoFill);

    // Set content fill mode to Cover
    engine.block.setEnum(coverBlock, 'contentFill/mode', 'Cover');

    // Get current fill mode
    const coverMode = engine.block.getEnum(coverBlock, 'contentFill/mode');
    // eslint-disable-next-line no-console
    console.log('Cover block fill mode:', coverMode); // 'Cover'

    // Content fill mode - Contain
    // Contain mode fits entire video, may leave empty space
    const containBlock = engine.block.create('graphic');
    engine.block.setShape(containBlock, engine.block.createShape('rect'));
    engine.block.setWidth(containBlock, blockWidth);
    engine.block.setHeight(containBlock, blockHeight);
    engine.block.appendChild(page, containBlock);

    const containVideoFill = engine.block.createFill('video');
    engine.block.setString(containVideoFill, 'fill/video/fileURI', videoUri);
    engine.block.setFill(containBlock, containVideoFill);

    // Set content fill mode to Contain
    engine.block.setEnum(containBlock, 'contentFill/mode', 'Contain');

    // Force load video resource to access metadata
    const resourceBlock = engine.block.create('graphic');
    engine.block.setShape(resourceBlock, engine.block.createShape('rect'));
    engine.block.setWidth(resourceBlock, blockWidth);
    engine.block.setHeight(resourceBlock, blockHeight);
    engine.block.appendChild(page, resourceBlock);

    const resourceVideoFill = engine.block.createFill('video');
    engine.block.setString(resourceVideoFill, 'fill/video/fileURI', videoUri);
    engine.block.setFill(resourceBlock, resourceVideoFill);

    // Force load the video resource before accessing metadata
    await engine.block.forceLoadAVResource(resourceVideoFill);

    // Now we can access video metadata
    const totalDuration = engine.block.getDouble(
      resourceVideoFill,
      'fill/video/totalDuration'
    );
    // eslint-disable-next-line no-console
    console.log('Video total duration:', totalDuration, 'seconds');

    // Use case: Video as shape fill - Ellipse
    const ellipseBlock = engine.block.create('graphic');
    const ellipseShape = engine.block.createShape('//ly.img.ubq/shape/ellipse');
    engine.block.setShape(ellipseBlock, ellipseShape);
    engine.block.setWidth(ellipseBlock, blockWidth);
    engine.block.setHeight(ellipseBlock, blockHeight);
    engine.block.appendChild(page, ellipseBlock);

    const ellipseVideoFill = engine.block.createFill('video');
    engine.block.setString(ellipseVideoFill, 'fill/video/fileURI', videoUri);
    engine.block.setFill(ellipseBlock, ellipseVideoFill);

    // Advanced: Video fill with opacity
    const opacityBlock = engine.block.create('graphic');
    engine.block.setShape(opacityBlock, engine.block.createShape('rect'));
    engine.block.setWidth(opacityBlock, blockWidth);
    engine.block.setHeight(opacityBlock, blockHeight);
    engine.block.appendChild(page, opacityBlock);

    const opacityVideoFill = engine.block.createFill('video');
    engine.block.setString(opacityVideoFill, 'fill/video/fileURI', videoUri);
    engine.block.setFill(opacityBlock, opacityVideoFill);

    // Set block opacity to 70%
    engine.block.setFloat(opacityBlock, 'opacity', 0.7);

    // Advanced: Share one video fill between multiple blocks
    const sharedFill = engine.block.createFill('video');
    engine.block.setString(sharedFill, 'fill/video/fileURI', videoUri);

    // First block using shared fill
    const sharedBlock1 = engine.block.create('graphic');
    engine.block.setShape(sharedBlock1, engine.block.createShape('rect'));
    engine.block.setWidth(sharedBlock1, blockWidth);
    engine.block.setHeight(sharedBlock1, blockHeight);
    engine.block.appendChild(page, sharedBlock1);
    engine.block.setFill(sharedBlock1, sharedFill);

    // Second block using the same shared fill
    const sharedBlock2 = engine.block.create('graphic');
    engine.block.setShape(sharedBlock2, engine.block.createShape('rect'));
    engine.block.setWidth(sharedBlock2, blockWidth * 0.8); // Slightly smaller
    engine.block.setHeight(sharedBlock2, blockHeight * 0.8);
    engine.block.appendChild(page, sharedBlock2);
    engine.block.setFill(sharedBlock2, sharedFill);

    // eslint-disable-next-line no-console
    console.log(
      'Shared fill - Two blocks using the same video fill instance for memory efficiency'
    );

    // ===== Position all blocks in grid layout =====
    const blocks = [
      basicBlock, // Position 0
      coverBlock, // Position 1
      containBlock, // Position 2
      resourceBlock, // Position 3
      ellipseBlock, // Position 4
      opacityBlock, // Position 5
      sharedBlock1, // Position 6
      sharedBlock2 // Position 7
    ];

    blocks.forEach((block, index) => {
      const pos = getPosition(index);
      engine.block.setPositionX(block, pos.x);
      engine.block.setPositionY(block, pos.y);
    });

    // Select the first block so users can see the fill in action
    engine.block.setSelected(basicBlock, true);

    // Set playback time to 2 seconds to show video content
    engine.block.setPlaybackTime(page, 2);

    // Start playback automatically
    try {
      engine.block.setPlaying(page, true);
      // eslint-disable-next-line no-console
      console.log(
        'Video fills guide initialized. Playback started. Demonstrating various video fill techniques across the grid.'
      );
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(
        'Video fills guide initialized. Click play to start video playback (browser autoplay restriction).'
      );
    }
  }
}

export default Example;
```

This guide covers how to create video fills, apply them to blocks, configure fill modes, and work with video resources programmatically.

## Understanding Video Fills

### What is a Video Fill?

A video fill is a fill object that paints a design block with video content. Like color and image fills, video fills are part of CE.SDK's broader fill system.

Video fills are identified by the type `'//ly.img.ubq/fill/video'` or the short form `'video'`. They contain properties for the video source, positioning, scaling, and playback behavior.

### Video Fill vs Video Blocks

**Video fills** are fill objects created with `createFill('video')` and applied to blocks with `setFill()`. You can use them to fill shapes with video content, create video backgrounds, or add video textures to text.

**Video blocks** are created with the convenience method `addVideo()` and come pre-configured with timeline integration, trim support, and playback controls. Use video blocks when building video editors or when you need features like trimming, duration adjustment, and precise playback control.

For this guide, we focus on video fills—applying video content as a fill to design elements. For video editing workflows, see the [Trim Video guide](./edit-video/trim.md).

### Video Mode Requirement

Video fills can only be created in Video mode scenes. Design mode doesn't support video fills. You must initialize CE.SDK with `createVideoScene()` instead of `createDesignScene()`.

```typescript
// Create Video mode scene (required for video fills)
await cesdk.actions.run('scene.create', { mode: 'Video' });

// Verify scene mode
const mode = engine.scene.getMode();
console.log(mode); // "Video"
```

## Checking Video Fill Support

Before applying video fills, verify that blocks support fills and that you're in the correct scene mode.

```typescript highlight-check-fill-support
    // Create a sample block to demonstrate fill support checking
    const sampleBlock = engine.block.create('graphic');
    engine.block.setShape(sampleBlock, engine.block.createShape('rect'));

    // Check if the block supports fills
    const supportsFills = engine.block.supportsFill(sampleBlock);
    // eslint-disable-next-line no-console
    console.log('Block supports fills:', supportsFills); // true for graphic blocks

    // Verify we're in Video mode (required for video fills)
    const sceneMode = engine.scene.getMode();
    if (sceneMode !== 'Video') {
      throw new Error('Video fills require Video mode.');
    }
    // eslint-disable-next-line no-console
    console.log('Scene mode:', sceneMode); // "Video"
```

Graphic blocks, shapes, and text blocks typically support fills. Pages and scenes don't. Always check `supportsFill()` before attempting to apply video fills to prevent errors.

## Creating Video Fills

### Creating Video Fills

Creating a video fill involves three steps: create the fill object, set the video source, and apply it to a block.

```typescript highlight-create-video-fill
    // Pattern #1: Demonstrate Individual Before Combined
    // Create a basic video fill demonstration
    const basicBlock = engine.block.create('graphic');
    engine.block.setShape(basicBlock, engine.block.createShape('rect'));
    engine.block.setWidth(basicBlock, blockWidth);
    engine.block.setHeight(basicBlock, blockHeight);
    engine.block.appendChild(page, basicBlock);

    // Create a video fill
    const basicVideoFill = engine.block.createFill('video');
    // or using full type name: engine.block.createFill('//ly.img.ubq/fill/video');

    // Set the video source URI
    engine.block.setString(basicVideoFill, 'fill/video/fileURI', videoUri);

    // Apply the fill to the block
    engine.block.setFill(basicBlock, basicVideoFill);
```

The video fill exists independently until you attach it to a block. This allows you to configure the fill completely before applying it. Once applied, the fill paints the block with the video content.

### Getting Current Fill Information

We can retrieve the current fill from a block and inspect its type to verify it's a video fill.

```typescript highlight-get-current-fill
// Get and verify the current fill
const fillId = engine.block.getFill(basicBlock);
const fillType = engine.block.getType(fillId);
// eslint-disable-next-line no-console
console.log('Fill type:', fillType); // '//ly.img.ubq/fill/video'
```

This is useful when building UIs that need to adapt based on the current fill type or when implementing undo/redo functionality that tracks fill changes.

## Content Fill Modes

Content fill modes control how video scales and positions within blocks. The two primary modes are Cover and Contain, each suited to different use cases.

### Cover Mode

Cover mode fills the entire block with video while maintaining the video's aspect ratio. If the aspect ratios don't match, CE.SDK crops portions of the video to ensure no empty space appears in the block.

```typescript highlight-fill-mode-cover
    // Pattern #2: Content fill mode - Cover
    // Cover mode fills entire block, may crop video to fit
    const coverBlock = engine.block.create('graphic');
    engine.block.setShape(coverBlock, engine.block.createShape('rect'));
    engine.block.setWidth(coverBlock, blockWidth);
    engine.block.setHeight(coverBlock, blockHeight);
    engine.block.appendChild(page, coverBlock);

    const coverVideoFill = engine.block.createFill('video');
    engine.block.setString(coverVideoFill, 'fill/video/fileURI', videoUri);
    engine.block.setFill(coverBlock, coverVideoFill);

    // Set content fill mode to Cover
    engine.block.setEnum(coverBlock, 'contentFill/mode', 'Cover');

    // Get current fill mode
    const coverMode = engine.block.getEnum(coverBlock, 'contentFill/mode');
    // eslint-disable-next-line no-console
    console.log('Cover block fill mode:', coverMode); // 'Cover'
```

Use Cover mode for background videos, full-frame video content, and situations where visual consistency matters more than showing the entire video. It guarantees no empty space but may crop content.

### Contain Mode

Contain mode fits the entire video within the block while maintaining aspect ratio. If aspect ratios don't match, CE.SDK adds empty space to preserve the full video visibility.

```typescript highlight-fill-mode-contain
    // Content fill mode - Contain
    // Contain mode fits entire video, may leave empty space
    const containBlock = engine.block.create('graphic');
    engine.block.setShape(containBlock, engine.block.createShape('rect'));
    engine.block.setWidth(containBlock, blockWidth);
    engine.block.setHeight(containBlock, blockHeight);
    engine.block.appendChild(page, containBlock);

    const containVideoFill = engine.block.createFill('video');
    engine.block.setString(containVideoFill, 'fill/video/fileURI', videoUri);
    engine.block.setFill(containBlock, containVideoFill);

    // Set content fill mode to Contain
    engine.block.setEnum(containBlock, 'contentFill/mode', 'Contain');
```

Use Contain mode when the entire video must remain visible—presentations, product demos, or content where cropping would lose important information. Empty space is acceptable to preserve complete visibility.

## Loading Video Resources

Before accessing video metadata like duration or dimensions, you must force load the video resource. This ensures CE.SDK has downloaded the necessary information.

```typescript highlight-force-load-resource
    // Force load video resource to access metadata
    const resourceBlock = engine.block.create('graphic');
    engine.block.setShape(resourceBlock, engine.block.createShape('rect'));
    engine.block.setWidth(resourceBlock, blockWidth);
    engine.block.setHeight(resourceBlock, blockHeight);
    engine.block.appendChild(page, resourceBlock);

    const resourceVideoFill = engine.block.createFill('video');
    engine.block.setString(resourceVideoFill, 'fill/video/fileURI', videoUri);
    engine.block.setFill(resourceBlock, resourceVideoFill);

    // Force load the video resource before accessing metadata
    await engine.block.forceLoadAVResource(resourceVideoFill);

    // Now we can access video metadata
    const totalDuration = engine.block.getDouble(
      resourceVideoFill,
      'fill/video/totalDuration'
    );
    // eslint-disable-next-line no-console
    console.log('Video total duration:', totalDuration, 'seconds');
```

Skipping this step causes errors when trying to access metadata. Videos load asynchronously, so `forceLoadAVResource` ensures the metadata is available before you query it.

Once loaded, you can access properties like `fill/video/totalDuration` to get the video length in seconds. This information helps you build UI previews or validate user input.

## Common Use Cases

### Video as Shape Fill

Video fills aren't limited to rectangles. You can fill any shape with video content.

```typescript highlight-video-shape-fill
    // Use case: Video as shape fill - Ellipse
    const ellipseBlock = engine.block.create('graphic');
    const ellipseShape = engine.block.createShape('//ly.img.ubq/shape/ellipse');
    engine.block.setShape(ellipseBlock, ellipseShape);
    engine.block.setWidth(ellipseBlock, blockWidth);
    engine.block.setHeight(ellipseBlock, blockHeight);
    engine.block.appendChild(page, ellipseBlock);

    const ellipseVideoFill = engine.block.createFill('video');
    engine.block.setString(ellipseVideoFill, 'fill/video/fileURI', videoUri);
    engine.block.setFill(ellipseBlock, ellipseVideoFill);
```

Ellipse shapes, polygons, stars, and custom paths all support video fills. The video content fills the shape boundary, masking the video.

### Video with Opacity

Control the transparency of video-filled blocks to create overlay effects or blend video content with backgrounds.

```typescript highlight-opacity
    // Advanced: Video fill with opacity
    const opacityBlock = engine.block.create('graphic');
    engine.block.setShape(opacityBlock, engine.block.createShape('rect'));
    engine.block.setWidth(opacityBlock, blockWidth);
    engine.block.setHeight(opacityBlock, blockHeight);
    engine.block.appendChild(page, opacityBlock);

    const opacityVideoFill = engine.block.createFill('video');
    engine.block.setString(opacityVideoFill, 'fill/video/fileURI', videoUri);
    engine.block.setFill(opacityBlock, opacityVideoFill);

    // Set block opacity to 70%
    engine.block.setFloat(opacityBlock, 'opacity', 0.7);
```

Opacity affects the entire block, including its video fill. This technique creates semi-transparent video overlays, watermarks, or layered compositions where video content blends with other elements.

## Additional Techniques

### Sharing Video Fills

Memory efficiency improves when multiple blocks share a single video fill instance. Changes to the shared fill affect all blocks using it.

```typescript highlight-shared-fill
    // Advanced: Share one video fill between multiple blocks
    const sharedFill = engine.block.createFill('video');
    engine.block.setString(sharedFill, 'fill/video/fileURI', videoUri);

    // First block using shared fill
    const sharedBlock1 = engine.block.create('graphic');
    engine.block.setShape(sharedBlock1, engine.block.createShape('rect'));
    engine.block.setWidth(sharedBlock1, blockWidth);
    engine.block.setHeight(sharedBlock1, blockHeight);
    engine.block.appendChild(page, sharedBlock1);
    engine.block.setFill(sharedBlock1, sharedFill);

    // Second block using the same shared fill
    const sharedBlock2 = engine.block.create('graphic');
    engine.block.setShape(sharedBlock2, engine.block.createShape('rect'));
    engine.block.setWidth(sharedBlock2, blockWidth * 0.8); // Slightly smaller
    engine.block.setHeight(sharedBlock2, blockHeight * 0.8);
    engine.block.appendChild(page, sharedBlock2);
    engine.block.setFill(sharedBlock2, sharedFill);

    // eslint-disable-next-line no-console
    console.log(
      'Shared fill - Two blocks using the same video fill instance for memory efficiency'
    );
```

This pattern reduces memory usage when the same video appears multiple times in a composition. It's particularly useful for repeated elements like watermarks or background patterns.

Shared fills play back synchronized—all blocks display the same frame at the same time during playback. This ensures visual consistency across multiple elements.

## Troubleshooting

### Video Not Visible

If your video fill doesn't appear, check several common causes. Verify the fill is enabled with `isFillEnabled(block)`. Ensure the video URL is accessible—CORS restrictions on web platforms can block video loading. Confirm the block has valid dimensions (width and height greater than zero) and exists in the scene hierarchy.

Check that the video format is supported on your platform. MP4 with H.264 encoding works reliably across platforms, while other codecs may have limited support.

### Cannot Create Video Fill

If creating a video fill throws an error, verify you're in Video mode. Design mode doesn't support video fills. Use `engine.scene.getMode()` to check the current mode. If it returns "Design", you need to create a video scene instead.

Call `await cesdk.actions.run('scene.create', { mode: 'Video' })` during initialization rather than `createDesignScene()` to enable video capabilities.

### Video Not Loading

When videos fail to load, verify network connectivity for remote URLs. Check CORS headers—web browsers enforce cross-origin restrictions that can block video access. Validate the URI format uses `https://` for remote videos or appropriate schemes for local files.

Test with a known working video URL to isolate whether the issue is with your specific video or a broader configuration problem. Check the browser console for detailed error messages.

### Memory Leaks

Always destroy replaced fills to prevent memory leaks. When changing a block's fill, retrieve the old fill with `getFill()`, assign the new fill with `setFill()`, then destroy the old fill with `destroy()`.

Don't create fills without attaching them to blocks—unattached fills remain in memory indefinitely. Clean up shared fills when no blocks reference them anymore.

### Performance Issues

Video playback is resource-intensive. Use appropriately sized videos—avoid massive files that strain decoding hardware. Consider lower resolutions for editing with high-resolution sources reserved for export.

Limit the number of simultaneously playing videos, especially on mobile devices. Too many concurrent video decodes overwhelm device capabilities. Compress videos before use to reduce file sizes and improve loading times.

## API Reference

| Method                                    | Description                      |
| ----------------------------------------- | -------------------------------- |
| `createFill('video')`                     | Create a new video fill object   |
| `setFill(block, fill)`                    | Assign fill to a block           |
| `getFill(block)`                          | Get the fill ID from a block     |
| `setString(fill, property, value)`        | Set video URI property           |
| `getString(fill, property)`               | Get current video URI            |
| `setSourceSet(fill, property, sources)`   | Set responsive video sources     |
| `getSourceSet(fill, property)`            | Get current source set           |
| `setEnum(block, property, value)`         | Set content fill mode            |
| `getEnum(block, property)`                | Get current fill mode            |
| `setFillEnabled(block, enabled)`          | Enable or disable fill rendering |
| `isFillEnabled(block)`                    | Check if fill is enabled         |
| `supportsFill(block)`                     | Check if block supports fills    |
| `forceLoadAVResource(fill)`               | Force load video metadata        |
| `getVideoFillThumbnail(fill, height)`     | Get single thumbnail frame       |
| `adjustCropToFillFrame(block, fillIndex)` | Adjust crop to fill frame        |

### Video Fill Properties

| Property                   | Type        | Description                                 |
| -------------------------- | ----------- | ------------------------------------------- |
| `fill/video/fileURI`       | String      | Single video URI (URL, data URI, file path) |
| `fill/video/sourceSet`     | SourceSet\[] | Array of responsive video sources           |
| `fill/video/totalDuration` | Double      | Total duration of video in seconds          |

### Content Fill Properties

| Property           | Type | Values             | Description                   |
| ------------------ | ---- | ------------------ | ----------------------------- |
| `contentFill/mode` | Enum | 'Cover', 'Contain' | How video scales within block |



---

## More Resources

- **[Next.js Documentation Index](https://img.ly/nextjs.md)** - Browse all Next.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./nextjs.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support