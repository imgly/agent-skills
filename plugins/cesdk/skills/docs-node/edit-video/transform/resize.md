> This is one page of the CE.SDK Node.js documentation. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Create and Edit Videos](./create-video.md) > [Transform](./edit-video/transform.md) > [Resize](./edit-video/transform/resize.md)

---

Programmatically resize video blocks using absolute or percentage-based dimensions with CE.SDK's block layout API in headless mode.

> **Reading time:** 8 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/heads/main.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/main/guides-create-video-transform-resize-server-js)
>
> - [Open in StackBlitz](https://stackblitz.com/~/github.com/imgly/cesdk-web-examples/tree/main/guides-create-video-transform-resize-server-js)

Video resizing changes the canvas dimensions of video blocks without affecting playback duration or content. Unlike scaling, which proportionally adjusts size, resizing allows independent control of width and height dimensions. This makes resizing ideal for batch normalization, template fitting, and aspect ratio standardization workflows.

<NodejsVideoExportNotice {...props} />

```typescript file=@cesdk_web_examples/guides-create-video-transform-resize-server-js/server-js.ts reference-only
import CreativeEngine from '@cesdk/node';
import { config } from 'dotenv';
import { writeFileSync, mkdirSync, existsSync } from 'fs';

// Load environment variables
config();

/**
 * CE.SDK Server Guide: Resize Video Blocks
 *
 * Demonstrates resizing video blocks in headless mode:
 * - Setting absolute pixel dimensions with setWidth/setHeight
 * - Reading current dimensions with getWidth/getHeight
 * - Using percentage-based sizing with setWidthMode/setHeightMode
 * - Maintaining aspect ratio when resizing
 * - Resizing multiple blocks together as a group
 * - Locking resize operations for template protection
 * - Understanding content fill behavior
 */

// Initialize CE.SDK engine in headless mode
const engine = await CreativeEngine.init({
  // license: process.env.CESDK_LICENSE, // Optional (trial mode available)
});

try {
  // Create a video scene with specific page dimensions
  engine.scene.create('VerticalStack', {
    page: { size: { width: 1920, height: 1080 } }
  });
  const page = engine.block.findByType('page')[0];

  // Sample video URL for demonstrations
  const videoUri = 'https://img.ly/static/ubq_video_samples/bbb.mp4';

  // Create a video block with initial dimensions
  const videoBlock = await engine.block.addVideo(videoUri, 640, 360);
  engine.block.appendChild(page, videoBlock);

  console.log('Initial dimensions:');
  console.log('  Width:', engine.block.getWidth(videoBlock));
  console.log('  Height:', engine.block.getHeight(videoBlock));

  // Resize to specific pixel dimensions (1280x720)
  engine.block.setWidth(videoBlock, 1280);
  engine.block.setHeight(videoBlock, 720);

  console.log('After resize to 1280x720:');
  console.log('  Width:', engine.block.getWidth(videoBlock));
  console.log('  Height:', engine.block.getHeight(videoBlock));

  // Read current dimensions and sizing modes
  const currentWidth = engine.block.getWidth(videoBlock);
  const currentHeight = engine.block.getHeight(videoBlock);
  const widthMode = engine.block.getWidthMode(videoBlock);
  const heightMode = engine.block.getHeightMode(videoBlock);

  console.log('Current state:');
  console.log(`  Dimensions: ${currentWidth} x ${currentHeight}`);
  console.log(`  Width mode: ${widthMode}`);
  console.log(`  Height mode: ${heightMode}`);

  // Set sizing modes to control dimension interpretation
  // 'Absolute' - Fixed pixel values
  // 'Percent' - Percentage of parent container (0.0 to 1.0)
  // 'Auto' - Automatic sizing based on content

  // Ensure we're using absolute mode for pixel values
  engine.block.setWidthMode(videoBlock, 'Absolute');
  engine.block.setHeightMode(videoBlock, 'Absolute');

  console.log('Sizing modes set to Absolute');

  // Create another video block for percentage-based sizing
  const percentVideo = await engine.block.addVideo(videoUri, 400, 225);
  engine.block.appendChild(page, percentVideo);

  // Switch to percentage mode and resize to 50% of parent width
  engine.block.setWidthMode(percentVideo, 'Percent');
  engine.block.setWidth(percentVideo, 0.5); // 50% of parent width

  // Keep height in absolute mode for this example
  engine.block.setHeightMode(percentVideo, 'Absolute');
  engine.block.setHeight(percentVideo, 270);

  console.log('Percentage-based sizing:');
  console.log(`  Width mode: ${engine.block.getWidthMode(percentVideo)}`);
  console.log(
    `  Width value: ${engine.block.getWidth(percentVideo)} (50% of parent)`
  );

  // Calculate and maintain aspect ratio when resizing
  const aspectVideo = await engine.block.addVideo(videoUri, 800, 450);
  engine.block.appendChild(page, aspectVideo);

  // Get current dimensions
  const originalWidth = engine.block.getWidth(aspectVideo);
  const originalHeight = engine.block.getHeight(aspectVideo);
  const aspectRatio = originalWidth / originalHeight;

  console.log(
    `Original aspect ratio: ${aspectRatio.toFixed(4)} (${originalWidth}x${originalHeight})`
  );

  // Resize width to 1200, calculate height to maintain aspect ratio
  const newWidth = 1200;
  const newHeight = newWidth / aspectRatio;

  engine.block.setWidth(aspectVideo, newWidth);
  engine.block.setHeight(aspectVideo, newHeight);

  console.log(
    `After aspect-ratio-preserving resize: ${newWidth}x${newHeight.toFixed(0)}`
  );

  // Group multiple video blocks for unified resizing
  const groupVideo1 = await engine.block.addVideo(videoUri, 300, 169);
  const groupVideo2 = await engine.block.addVideo(videoUri, 300, 169);
  engine.block.appendChild(page, groupVideo1);
  engine.block.appendChild(page, groupVideo2);

  // Position the blocks before grouping
  engine.block.setPositionX(groupVideo1, 50);
  engine.block.setPositionY(groupVideo1, 600);
  engine.block.setPositionX(groupVideo2, 400);
  engine.block.setPositionY(groupVideo2, 600);

  // Group the blocks
  const group = engine.block.group([groupVideo1, groupVideo2]);

  console.log('Created group with 2 video blocks');
  console.log(
    '  Before scale - Block 1 width:',
    engine.block.getWidth(groupVideo1)
  );
  console.log(
    '  Before scale - Block 2 width:',
    engine.block.getWidth(groupVideo2)
  );

  // Scale the entire group - child blocks scale proportionally
  engine.block.scale(group, 1.5);

  console.log(
    '  After 1.5x scale - Block 1 width:',
    engine.block.getWidth(groupVideo1)
  );
  console.log(
    '  After 1.5x scale - Block 2 width:',
    engine.block.getWidth(groupVideo2)
  );

  // Lock resize operations on a block for template protection
  const templateVideo = await engine.block.addVideo(videoUri, 500, 281);
  engine.block.appendChild(page, templateVideo);
  engine.block.setPositionX(templateVideo, 1300);
  engine.block.setPositionY(templateVideo, 50);

  // Disable the layer/resize scope to prevent resizing
  engine.block.setScopeEnabled(templateVideo, 'layer/resize', false);

  // Verify the scope is disabled
  const canResize = engine.block.isScopeEnabled(templateVideo, 'layer/resize');
  console.log('Resize scope enabled:', canResize); // false

  // Alternative: Lock all transforms (move, resize, rotate)
  const fullyLockedVideo = await engine.block.addVideo(videoUri, 400, 225);
  engine.block.appendChild(page, fullyLockedVideo);
  engine.block.setPositionX(fullyLockedVideo, 1300);
  engine.block.setPositionY(fullyLockedVideo, 400);

  engine.block.setTransformLocked(fullyLockedVideo, true);
  console.log('All transforms locked on block');

  // Control how video content fills the block frame
  const fillModeVideo = await engine.block.addVideo(videoUri, 600, 400);
  engine.block.appendChild(page, fillModeVideo);
  engine.block.setPositionX(fillModeVideo, 1300);
  engine.block.setPositionY(fillModeVideo, 700);

  // Available fill modes:
  // 'Crop' - Fill the frame, crop overflow (default)
  // 'Cover' - Scale to cover the frame completely
  // 'Contain' - Scale to fit within frame, may show letterboxing

  // Set content fill mode
  engine.block.setContentFillMode(fillModeVideo, 'Contain');

  const currentFillMode = engine.block.getContentFillMode(fillModeVideo);
  console.log('Content fill mode:', currentFillMode);

  // Position all blocks in a grid layout for the export
  const margin = 40;

  engine.block.setPositionX(videoBlock, margin);
  engine.block.setPositionY(videoBlock, margin);

  engine.block.setPositionX(percentVideo, margin);
  engine.block.setPositionY(percentVideo, 400);

  engine.block.setPositionX(aspectVideo, margin);
  engine.block.setPositionY(aspectVideo, 700);

  // Export the scene as a PNG snapshot
  // Note: Full video export with encoding requires the browser SDK.
  // In headless mode, we export a frame snapshot to verify resize operations.
  console.log('Starting PNG export...');

  const blob = await engine.block.export(page, { mimeType: 'image/png' });
  const buffer = Buffer.from(await blob.arrayBuffer());

  // Ensure output directory exists
  if (!existsSync('output')) {
    mkdirSync('output');
  }

  // Save to file
  writeFileSync('output/resized-videos-snapshot.png', buffer);
  console.log('Exported to output/resized-videos-snapshot.png');

  console.log('Video resize guide completed successfully.');
} finally {
  engine.dispose();
}
```

This guide covers how to resize video blocks programmatically using the Engine API in a headless Node.js environment.

## Understanding Resize Concepts

### Resizing vs Scaling

Resizing and scaling serve different purposes. Resizing changes the actual dimensions of a block—you specify exact pixel values or percentages. Scaling multiplies the current dimensions by a factor, affecting both width and height proportionally.

Use resizing when you need specific dimensions for template layouts or output formats. Use scaling when you want to enlarge or shrink content while preserving its aspect ratio automatically.

### Sizing Modes

CE.SDK supports three sizing modes that control how dimension values are interpreted:

- **Absolute**: Fixed pixel values. A width of 1920 means exactly 1920 pixels.
- **Percent**: Percentage of parent container (0.0 to 1.0). A width of 0.5 means 50% of the parent's width.
- **Auto**: Automatic sizing based on content dimensions.

Each dimension (width and height) can have its own independent sizing mode. This flexibility allows combinations like fixed width with percentage-based height.

### Content Fill Behavior

When you resize a video block, the video content must adapt to the new frame dimensions. CE.SDK provides three fill modes to control this behavior:

- **Crop**: Video fills the frame completely, cropping overflow (default)
- **Cover**: Video scales to cover the entire frame
- **Contain**: Video scales to fit within the frame, potentially showing letterboxing

The fill mode determines visual appearance when block dimensions don't match video aspect ratio.

## Programmatic Video Resizing

### Initialize CE.SDK

For headless video processing, we initialize CE.SDK's Node.js engine. This provides full API access to resizing operations without browser dependencies.

```typescript highlight=highlight-setup
// Initialize CE.SDK engine in headless mode
const engine = await CreativeEngine.init({
  // license: process.env.CESDK_LICENSE, // Optional (trial mode available)
});
```

The headless engine provides complete control over block dimensions, making it ideal for automated workflows and server-side video preparation.

### Resizing with Absolute Dimensions

We resize video blocks using `setWidth()` and `setHeight()` with pixel values. This provides precise dimensional control for layout requirements.

```typescript highlight=highlight-resize-absolute
  // Create a video block with initial dimensions
  const videoBlock = await engine.block.addVideo(videoUri, 640, 360);
  engine.block.appendChild(page, videoBlock);

  console.log('Initial dimensions:');
  console.log('  Width:', engine.block.getWidth(videoBlock));
  console.log('  Height:', engine.block.getHeight(videoBlock));

  // Resize to specific pixel dimensions (1280x720)
  engine.block.setWidth(videoBlock, 1280);
  engine.block.setHeight(videoBlock, 720);

  console.log('After resize to 1280x720:');
  console.log('  Width:', engine.block.getWidth(videoBlock));
  console.log('  Height:', engine.block.getHeight(videoBlock));
```

The `setWidth()` and `setHeight()` methods accept the block ID and a numeric value. When the sizing mode is `Absolute` (the default), these values represent pixels.

### Reading Current Dimensions

We can retrieve current size values using `getWidth()` and `getHeight()`. To understand how values are interpreted, check the current mode with `getWidthMode()` and `getHeightMode()`.

```typescript highlight=highlight-read-dimensions
  // Read current dimensions and sizing modes
  const currentWidth = engine.block.getWidth(videoBlock);
  const currentHeight = engine.block.getHeight(videoBlock);
  const widthMode = engine.block.getWidthMode(videoBlock);
  const heightMode = engine.block.getHeightMode(videoBlock);

  console.log('Current state:');
  console.log(`  Dimensions: ${currentWidth} x ${currentHeight}`);
  console.log(`  Width mode: ${widthMode}`);
  console.log(`  Height mode: ${heightMode}`);
```

These getter methods return current values in the active sizing mode. If the mode is `Percent`, the returned value is a decimal (0.0 to 1.0). If `Absolute`, the value is in pixels.

### Setting Sizing Modes

We configure how dimensions are interpreted using `setWidthMode()` and `setHeightMode()`. Set to `'Absolute'` for pixels, `'Percent'` for percentage values, or `'Auto'` for automatic sizing.

```typescript highlight=highlight-sizing-modes
  // Set sizing modes to control dimension interpretation
  // 'Absolute' - Fixed pixel values
  // 'Percent' - Percentage of parent container (0.0 to 1.0)
  // 'Auto' - Automatic sizing based on content

  // Ensure we're using absolute mode for pixel values
  engine.block.setWidthMode(videoBlock, 'Absolute');
  engine.block.setHeightMode(videoBlock, 'Absolute');

  console.log('Sizing modes set to Absolute');
```

Switching modes doesn't automatically convert values. If you change from `Absolute` to `Percent`, the numeric value remains the same but is now interpreted as a percentage. Set the appropriate value after changing modes.

### Percentage-Based Sizing

We can resize using percentage values relative to the parent container. First set the mode to `'Percent'`, then use decimal values where 0.5 represents 50% of the parent's dimension.

```typescript highlight=highlight-percentage-sizing
  // Create another video block for percentage-based sizing
  const percentVideo = await engine.block.addVideo(videoUri, 400, 225);
  engine.block.appendChild(page, percentVideo);

  // Switch to percentage mode and resize to 50% of parent width
  engine.block.setWidthMode(percentVideo, 'Percent');
  engine.block.setWidth(percentVideo, 0.5); // 50% of parent width

  // Keep height in absolute mode for this example
  engine.block.setHeightMode(percentVideo, 'Absolute');
  engine.block.setHeight(percentVideo, 270);

  console.log('Percentage-based sizing:');
  console.log(`  Width mode: ${engine.block.getWidthMode(percentVideo)}`);
  console.log(
    `  Width value: ${engine.block.getWidth(percentVideo)} (50% of parent)`
  );
```

Percentage-based sizing is useful for responsive layouts where elements should maintain proportional relationships with their containers.

## Advanced Resizing Techniques

### Maintaining Aspect Ratio

When resizing, we often want to maintain the original aspect ratio to avoid distortion. We calculate the ratio from current dimensions, then apply it when setting new values.

```typescript highlight=highlight-aspect-ratio
  // Calculate and maintain aspect ratio when resizing
  const aspectVideo = await engine.block.addVideo(videoUri, 800, 450);
  engine.block.appendChild(page, aspectVideo);

  // Get current dimensions
  const originalWidth = engine.block.getWidth(aspectVideo);
  const originalHeight = engine.block.getHeight(aspectVideo);
  const aspectRatio = originalWidth / originalHeight;

  console.log(
    `Original aspect ratio: ${aspectRatio.toFixed(4)} (${originalWidth}x${originalHeight})`
  );

  // Resize width to 1200, calculate height to maintain aspect ratio
  const newWidth = 1200;
  const newHeight = newWidth / aspectRatio;

  engine.block.setWidth(aspectVideo, newWidth);
  engine.block.setHeight(aspectVideo, newHeight);

  console.log(
    `After aspect-ratio-preserving resize: ${newWidth}x${newHeight.toFixed(0)}`
  );
```

Calculate aspect ratio by dividing width by height. When changing one dimension, derive the other by applying this ratio. This ensures the video doesn't appear stretched or squashed.

### Resizing Blocks Together

We can group multiple video blocks with `group()` and resize the group. Child blocks scale proportionally, maintaining their relative layout and individual aspect ratios.

```typescript highlight=highlight-group-resize
  // Group multiple video blocks for unified resizing
  const groupVideo1 = await engine.block.addVideo(videoUri, 300, 169);
  const groupVideo2 = await engine.block.addVideo(videoUri, 300, 169);
  engine.block.appendChild(page, groupVideo1);
  engine.block.appendChild(page, groupVideo2);

  // Position the blocks before grouping
  engine.block.setPositionX(groupVideo1, 50);
  engine.block.setPositionY(groupVideo1, 600);
  engine.block.setPositionX(groupVideo2, 400);
  engine.block.setPositionY(groupVideo2, 600);

  // Group the blocks
  const group = engine.block.group([groupVideo1, groupVideo2]);

  console.log('Created group with 2 video blocks');
  console.log(
    '  Before scale - Block 1 width:',
    engine.block.getWidth(groupVideo1)
  );
  console.log(
    '  Before scale - Block 2 width:',
    engine.block.getWidth(groupVideo2)
  );

  // Scale the entire group - child blocks scale proportionally
  engine.block.scale(group, 1.5);

  console.log(
    '  After 1.5x scale - Block 1 width:',
    engine.block.getWidth(groupVideo1)
  );
  console.log(
    '  After 1.5x scale - Block 2 width:',
    engine.block.getWidth(groupVideo2)
  );
```

The `scale()` method applies to the entire group, affecting all children uniformly. This is useful for resizing compositions of multiple elements while preserving their spatial relationships.

> **Warning:** You cannot group page blocks with other blocks. Only group elements that share the same parent container.

### Locking Resize Operations

For template protection, we can prevent resize changes on specific blocks. Disable the `layer/resize` scope using `setScopeEnabled()`, or lock all transforms with `setTransformLocked()`.

```typescript highlight=highlight-lock-resize
  // Lock resize operations on a block for template protection
  const templateVideo = await engine.block.addVideo(videoUri, 500, 281);
  engine.block.appendChild(page, templateVideo);
  engine.block.setPositionX(templateVideo, 1300);
  engine.block.setPositionY(templateVideo, 50);

  // Disable the layer/resize scope to prevent resizing
  engine.block.setScopeEnabled(templateVideo, 'layer/resize', false);

  // Verify the scope is disabled
  const canResize = engine.block.isScopeEnabled(templateVideo, 'layer/resize');
  console.log('Resize scope enabled:', canResize); // false

  // Alternative: Lock all transforms (move, resize, rotate)
  const fullyLockedVideo = await engine.block.addVideo(videoUri, 400, 225);
  engine.block.appendChild(page, fullyLockedVideo);
  engine.block.setPositionX(fullyLockedVideo, 1300);
  engine.block.setPositionY(fullyLockedVideo, 400);

  engine.block.setTransformLocked(fullyLockedVideo, true);
  console.log('All transforms locked on block');
```

Use `isScopeEnabled()` to check if resizing is currently allowed on a block. Locking is essential for template workflows where certain elements should maintain fixed dimensions.

### Content Fill Mode

We control how video content fills the block frame using `setContentFillMode()`. This determines visual appearance when block dimensions don't match video aspect ratio.

```typescript highlight=highlight-content-fill
  // Control how video content fills the block frame
  const fillModeVideo = await engine.block.addVideo(videoUri, 600, 400);
  engine.block.appendChild(page, fillModeVideo);
  engine.block.setPositionX(fillModeVideo, 1300);
  engine.block.setPositionY(fillModeVideo, 700);

  // Available fill modes:
  // 'Crop' - Fill the frame, crop overflow (default)
  // 'Cover' - Scale to cover the frame completely
  // 'Contain' - Scale to fit within frame, may show letterboxing

  // Set content fill mode
  engine.block.setContentFillMode(fillModeVideo, 'Contain');

  const currentFillMode = engine.block.getContentFillMode(fillModeVideo);
  console.log('Content fill mode:', currentFillMode);
```

Choose `'Crop'` when video should fill the frame completely (some content may be hidden). Choose `'Contain'` when all video content must be visible (may show letterboxing). Choose `'Cover'` for a balance that covers the frame while maintaining aspect ratio.

## Exporting Results

After applying resize operations, export the processed content to verify configurations. In headless mode, we export a PNG snapshot.

```typescript highlight=highlight-export
  // Export the scene as a PNG snapshot
  // Note: Full video export with encoding requires the browser SDK.
  // In headless mode, we export a frame snapshot to verify resize operations.
  console.log('Starting PNG export...');

  const blob = await engine.block.export(page, { mimeType: 'image/png' });
  const buffer = Buffer.from(await blob.arrayBuffer());

  // Ensure output directory exists
  if (!existsSync('output')) {
    mkdirSync('output');
  }

  // Save to file
  writeFileSync('output/resized-videos-snapshot.png', buffer);
  console.log('Exported to output/resized-videos-snapshot.png');
```

The export renders all video blocks at their current dimensions. For full video encoding, use the browser SDK with video export capabilities. Always dispose of the engine instance when processing is complete.

## Best Practices

### Workflow Recommendations

1. Set sizing mode before setting dimension values
2. Calculate aspect ratios from original dimensions before resizing
3. Use `group()` for resizing multiple elements proportionally
4. Lock resize scope for template protection
5. Match content fill mode to layout requirements

### Common Patterns

**Batch normalization**: Process multiple videos to consistent dimensions.

```typescript
// Normalize all videos to 1280x720
for (const videoBlock of videoBlocks) {
  engine.block.setWidthMode(videoBlock, 'Absolute');
  engine.block.setHeightMode(videoBlock, 'Absolute');
  engine.block.setWidth(videoBlock, 1280);
  engine.block.setHeight(videoBlock, 720);
}
```

**Responsive layouts**: Use percentage-based sizing for adaptive designs.

```typescript
// Video fills 80% of parent width
engine.block.setWidthMode(videoBlock, 'Percent');
engine.block.setWidth(videoBlock, 0.8);
```

**Aspect-ratio-preserving resize**: Calculate height from width using ratio.

```typescript
const ratio = engine.block.getWidth(block) / engine.block.getHeight(block);
const targetWidth = 1920;
engine.block.setWidth(block, targetWidth);
engine.block.setHeight(block, targetWidth / ratio);
```

## Troubleshooting

### Dimensions Not Changing

If setting width or height has no effect, check if the block's transforms are locked with `setTransformLocked()` or if the `layer/resize` scope is disabled. Use `isScopeEnabled(block, 'layer/resize')` to verify.

### Aspect Ratio Distortion

If video appears stretched or squashed, the block dimensions don't match the video's natural aspect ratio. Either maintain aspect ratio when resizing or adjust content fill mode to `'Contain'` or `'Cover'`.

### Percentage Values Not Working

If percentage-based sizing doesn't behave as expected, verify the sizing mode is set to `'Percent'`. Values like `50` won't work—use `0.5` for 50% when in percentage mode.

### Group Resize Issues

If grouped blocks don't resize together, ensure they were properly grouped with `group()`. The returned group ID is what you should pass to `scale()`, not the individual block IDs.

## API Reference

| Method | Description | Parameters | Returns |
|--------|-------------|------------|---------|
| `setWidth(id, value, maintainCrop?)` | Set block width | `id: DesignBlockId, value: number, maintainCrop?: boolean` | `void` |
| `setHeight(id, value, maintainCrop?)` | Set block height | `id: DesignBlockId, value: number, maintainCrop?: boolean` | `void` |
| `getWidth(id)` | Get current width | `id: DesignBlockId` | `number` |
| `getHeight(id)` | Get current height | `id: DesignBlockId` | `number` |
| `setWidthMode(id, mode)` | Set width mode | `id: DesignBlockId, mode: 'Absolute' \| 'Percent' \| 'Auto'` | `void` |
| `setHeightMode(id, mode)` | Set height mode | `id: DesignBlockId, mode: 'Absolute' \| 'Percent' \| 'Auto'` | `void` |
| `getWidthMode(id)` | Get current width mode | `id: DesignBlockId` | `string` |
| `getHeightMode(id)` | Get current height mode | `id: DesignBlockId` | `string` |
| `group(ids)` | Group blocks together | `ids: DesignBlockId[]` | `DesignBlockId` |
| `scale(id, factor, anchorX?, anchorY?)` | Scale block or group | `id: DesignBlockId, factor: number, anchorX?: number, anchorY?: number` | `void` |
| `setScopeEnabled(id, scope, enabled)` | Enable/disable scope | `id: DesignBlockId, scope: string, enabled: boolean` | `void` |
| `isScopeEnabled(id, scope)` | Check if scope is enabled | `id: DesignBlockId, scope: string` | `boolean` |
| `setTransformLocked(id, locked)` | Lock all transforms | `id: DesignBlockId, locked: boolean` | `void` |
| `setContentFillMode(id, mode)` | Set content fill mode | `id: DesignBlockId, mode: 'Crop' \| 'Cover' \| 'Contain'` | `void` |
| `getContentFillMode(id)` | Get content fill mode | `id: DesignBlockId` | `string` |



---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support