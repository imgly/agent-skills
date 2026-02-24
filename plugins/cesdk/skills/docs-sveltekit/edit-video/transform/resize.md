> This is one page of the CE.SDK SvelteKit documentation. For a complete overview, see the [SvelteKit Documentation Index](https://img.ly/sveltekit.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Create and Edit Videos](./create-video.md) > [Transform](./edit-video/transform.md) > [Resize](./edit-video/transform/resize.md)

---

The **CreativeEditor SDK (CE.SDK)** provides a video resizing feature. This guide offers a complete overview of the resizing feature, from using it in the default UI to locking resizing to safeguard layouts.

![Resize videos example showing videos with different sizing modes](https://img.ly/docs/cesdk/./assets/browser.hero.webp)

> **Reading time:** 8 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/heads/main.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/main/guides-edit-video-transform-resize-browser)
>
> - [Open in StackBlitz](https://stackblitz.com/~/github.com/imgly/cesdk-web-examples/tree/main/guides-edit-video-transform-resize-browser)
>
> - [Live demo](https://img.ly/examples/guides-edit-video-transform-resize-browser/)

```typescript file=@cesdk_web_examples/guides-edit-video-transform-resize-browser/browser.ts reference-only
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
  name = 'guides-edit-video-transform-resize-browser';

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

    // Layout constants for centered positioning
    // Page: 800x500, 3 columns of 200px each with 50px spacing
    // Total width: 700px, centered start X: 50px
    // Column centers: 150, 400, 650
    const videoWidth = 150;
    const videoHeight = 100;
    const columnWidth = 200;
    const startY = 165; // Vertically centered
    const labelY = startY + videoHeight + 10;
    const explanationY = labelY + 35;

    // Column 1 center: 150
    const col1X = 50;
    const col1VideoX = col1X + (columnWidth - videoWidth) / 2; // 75

    // Column 2 center: 400 (percentage video is 200px = 25% of 800)
    const col2X = 300;
    const col2VideoX = col2X; // 200px wide video centered at 400

    // Column 3 center: 650
    const col3X = 550;
    const col3VideoX = col3X + (columnWidth - videoWidth) / 2; // 575

    // Demo 1: Resizable Video - Can be freely resized by user
    const resizableVideo = await engine.block.addVideo(
      'https://img.ly/static/ubq_video_samples/bbb.mp4',
      videoWidth,
      videoHeight
    );
    engine.block.appendChild(page, resizableVideo);
    engine.block.setPositionX(resizableVideo, col1VideoX);
    engine.block.setPositionY(resizableVideo, startY);

    const text1 = engine.block.create('text');
    engine.block.setString(text1, 'text/text', 'Resizable');
    engine.block.setFloat(text1, 'text/fontSize', 28);
    engine.block.setEnum(text1, 'text/horizontalAlignment', 'Center');
    engine.block.setWidth(text1, columnWidth);
    engine.block.setPositionX(text1, col1X);
    engine.block.setPositionY(text1, labelY);
    engine.block.setFillEnabled(text1, true);
    engine.block.setColor(engine.block.getFill(text1), 'fill/color/value', {
      r: 1,
      g: 1,
      b: 1,
      a: 1
    });
    engine.block.appendChild(page, text1);

    // Add explanatory text below
    const explanation1 = engine.block.create('text');
    engine.block.setString(
      explanation1,
      'text/text',
      'Absolute pixel dimensions'
    );
    engine.block.setFloat(explanation1, 'text/fontSize', 12);
    engine.block.setEnum(explanation1, 'text/horizontalAlignment', 'Center');
    engine.block.setWidth(explanation1, columnWidth);
    engine.block.setPositionX(explanation1, col1X);
    engine.block.setPositionY(explanation1, explanationY);
    engine.block.setFillEnabled(explanation1, true);
    engine.block.setColor(
      engine.block.getFill(explanation1),
      'fill/color/value',
      {
        r: 1,
        g: 1,
        b: 1,
        a: 1
      }
    );
    engine.block.appendChild(page, explanation1);

    // Demo 2: Percentage Sizing - Responsive layout
    const percentVideo = await engine.block.addVideo(
      'https://img.ly/static/ubq_video_samples/bbb.mp4',
      videoWidth,
      videoHeight
    );
    engine.block.appendChild(page, percentVideo);

    // Set size mode to percentage (0.0 to 1.0)
    engine.block.setWidthMode(percentVideo, 'Percent');
    engine.block.setHeightMode(percentVideo, 'Percent');
    // Set to 25% width, 20% height of parent
    engine.block.setWidth(percentVideo, 0.25);
    engine.block.setHeight(percentVideo, 0.2);

    engine.block.setPositionX(percentVideo, col2VideoX);
    engine.block.setPositionY(percentVideo, startY);

    const text2 = engine.block.create('text');
    engine.block.setString(text2, 'text/text', 'Percentage');
    engine.block.setFloat(text2, 'text/fontSize', 28);
    engine.block.setEnum(text2, 'text/horizontalAlignment', 'Center');
    engine.block.setWidth(text2, columnWidth);
    engine.block.setPositionX(text2, col2X);
    engine.block.setPositionY(text2, labelY);
    engine.block.setFillEnabled(text2, true);
    engine.block.setColor(engine.block.getFill(text2), 'fill/color/value', {
      r: 1,
      g: 1,
      b: 1,
      a: 1
    });
    engine.block.appendChild(page, text2);

    // Add explanatory text below
    const explanation2 = engine.block.create('text');
    engine.block.setString(explanation2, 'text/text', '25% width, 20% height');
    engine.block.setFloat(explanation2, 'text/fontSize', 12);
    engine.block.setEnum(explanation2, 'text/horizontalAlignment', 'Center');
    engine.block.setWidth(explanation2, columnWidth);
    engine.block.setPositionX(explanation2, col2X);
    engine.block.setPositionY(explanation2, explanationY);
    engine.block.setFillEnabled(explanation2, true);
    engine.block.setColor(
      engine.block.getFill(explanation2),
      'fill/color/value',
      {
        r: 1,
        g: 1,
        b: 1,
        a: 1
      }
    );
    engine.block.appendChild(page, explanation2);

    // Demo 3: Resize-Locked Video - Cannot be resized
    const lockedVideo = await engine.block.addVideo(
      'https://img.ly/static/ubq_video_samples/bbb.mp4',
      videoWidth,
      videoHeight
    );
    engine.block.appendChild(page, lockedVideo);
    engine.block.setPositionX(lockedVideo, col3VideoX);
    engine.block.setPositionY(lockedVideo, startY);

    // Lock the transform to prevent resizing
    engine.block.setTransformLocked(lockedVideo, true);

    const text3 = engine.block.create('text');
    engine.block.setString(text3, 'text/text', 'Locked');
    engine.block.setFloat(text3, 'text/fontSize', 28);
    engine.block.setEnum(text3, 'text/horizontalAlignment', 'Center');
    engine.block.setWidth(text3, columnWidth);
    engine.block.setPositionX(text3, col3X);
    engine.block.setPositionY(text3, labelY);
    engine.block.setFillEnabled(text3, true);
    engine.block.setColor(engine.block.getFill(text3), 'fill/color/value', {
      r: 1,
      g: 1,
      b: 1,
      a: 1
    });
    engine.block.appendChild(page, text3);

    // Add explanatory text below
    const explanation3 = engine.block.create('text');
    engine.block.setString(explanation3, 'text/text', 'Transform locked');
    engine.block.setFloat(explanation3, 'text/fontSize', 12);
    engine.block.setEnum(explanation3, 'text/horizontalAlignment', 'Center');
    engine.block.setWidth(explanation3, columnWidth);
    engine.block.setPositionX(explanation3, col3X);
    engine.block.setPositionY(explanation3, explanationY);
    engine.block.setFillEnabled(explanation3, true);
    engine.block.setColor(
      engine.block.getFill(explanation3),
      'fill/color/value',
      {
        r: 1,
        g: 1,
        b: 1,
        a: 1
      }
    );
    engine.block.appendChild(page, explanation3);

    // Get current dimensions
    const currentWidth = engine.block.getWidth(resizableVideo);
    const currentHeight = engine.block.getHeight(resizableVideo);
    console.log('Current dimensions:', currentWidth, 'x', currentHeight);

    // Check size mode
    const widthMode = engine.block.getWidthMode(percentVideo);
    const heightMode = engine.block.getHeightMode(percentVideo);
    console.log('Size modes:', widthMode, heightMode);

    // Set playhead position to 2 seconds
    engine.block.setPlaybackTime(page, 2);
  }
}

export default Example;
```

## What You'll Learn

- Resize a single video block with the **default UI**.
- Resize clips using **JavaScript** and the **CE.SDK API**.
- Resize **groups** of video blocks uniformly.
- **Lock** or restrict a user's ability to resize.

### When to Use

Resize videos to:

- Fit **template areas**.

- Insert videos into reusable **layouts**.

- Keep aspect ratios **consistent** for:

  - Social media posts (like reels)
  - Ads

- Create **automation workflows** in JavaScript.

- Combine with trimming or cropping.

## Resize a Video Block with the UI

When using the default CE.SDK UI:

1. Select the video.
2. The resize handles appear.
3. Drag one of the handles to resize the video until you set the desired size.

The editor provides two kinds of handles:

- **Corner scale handles:** keep the video's aspect ratio.

<Picture src={resizeHandles} style={{ width: '110%' }} alt="Resize handles from the default CE.SDK web editor" formats={['webp']} />

- **Edge handles:** stretch only the width or the height independently.

<Picture src={edgeHandles} style={{ width: '110%' }} alt="Resize edge handles from the default CE.SDK web editor" formats={['webp']} />

Any embedded audio remains synchronous, because resizing affects only the block's frame, not the timeline.

### Hide the Resize Handles in the UI

To prevent manual resizing in the UI, **hide the resize edge handles** using the **EditorAPI**:

1. Call the `setSetting` function.
2. Include the `"controlGizmo/showResizeHandles"` key.
3. Set the value to `false`.

```ts
// Hide resize handles if you want to prevent manual resizing
engine.editor.setSetting("controlGizmo/showResizeHandles", false);
```

> **Note:** This setting still **displays the corner handles** and helps avoid editing operations that change the size independently in the UI.

## Resize a Video Block with JavaScript

When developing a custom UI use the CreativeEngine BlockAPI to edit a video's size. Two methods exist: choose the one that best suits your project.

### Set Absolute Sizing

Set the video's absolute size with `setWidth` and `setHeight`. First, create the video block with `addVideo`, then set explicit pixel dimensions:

```typescript highlight-resizable-video
const resizableVideo = await engine.block.addVideo(
  'https://img.ly/static/ubq_video_samples/bbb.mp4',
  videoWidth,
  videoHeight
);
engine.block.appendChild(page, resizableVideo);
engine.block.setPositionX(resizableVideo, col1VideoX);
engine.block.setPositionY(resizableVideo, startY);
```

### Set Relative Sizing

Set the video's size relative to its parent (for example, to the page):

1. Set the size mode with `setWidthMode` and `setHeightMode`.
2. Define the mode as `'Percent'`.
3. Set the size in normalized values, with `1` being full-width.

```typescript highlight-percentage-sizing
// Set size mode to percentage (0.0 to 1.0)
engine.block.setWidthMode(percentVideo, 'Percent');
engine.block.setHeightMode(percentVideo, 'Percent');
// Set to 25% width, 20% height of parent
engine.block.setWidth(percentVideo, 0.25);
engine.block.setHeight(percentVideo, 0.2);
```

The preceding code:

- Sets the clip to 25% width of its parent.
- Makes the clip 20% as tall.
- Stays responsive to the parent's size changes.

<Picture src={resizePercent} style={{ width: '110%' }} alt="Resized video relative to the page" formats={['webp']} />

This method allows for the clip to follow the parent's size changes while maintaining proportional dimensions.

### Get Current Dimensions

Read current size values using `getWidth` and `getHeight`. Values are returned in the current size mode (absolute pixels or percentage 0.0-1.0):

```typescript highlight-get-dimensions
// Get current dimensions
const currentWidth = engine.block.getWidth(resizableVideo);
const currentHeight = engine.block.getHeight(resizableVideo);
```

### Check Size Mode

Query the current size mode using `getWidthMode` and `getHeightMode`:

```typescript highlight-get-size-mode
// Check size mode
const widthMode = engine.block.getWidthMode(percentVideo);
const heightMode = engine.block.getHeightMode(percentVideo);
```

### Maintain Aspect Ratio

If the block's *fill* is a video (`FillType.video`), the engine preserves the footage's native aspect ratio. To force a different ratio, you must:

1. Calculate the ratio
2. Adjust one side, or add constraints (see **Locking** below).

## Resize Videos Together

To resize several videos at once, instead of resizing each video individually:

1. Group the videos with `engine.block.group`.
2. Set the size for the entire group.

```ts
// Group multiple video clips
const group = engine.block.group([clipA, clipB, clipC]);

// Resize the entire group - height scales proportionally
engine.block.setWidth(group, 400);
```

To ensure consistent layout, groups of videos:

- Always scale uniformly on both axes.
- Show only *scale* and *rotate* gizmos in the UI, never individual resize handles.

## Lock or Constrain Resizing

Use the BlockAPI to define if your app allows resizing for a specific block:

<Tabs>
  <TabItem label="Lock a specific block">
    1. Tell the engine that each block has its own resize policy with `setGlobalScope`.
    2. Call `setScopeEnabled`.
    3. Include the video block ID.
    4. Set the boolean's value for `locked`:
       - `true` enables resizing.
       - `false` deactivates resizing.

    ```ts
    // Disable only resize for this specific block
    engine.editor.setGlobalScope('layer/resize', 'Defer');
    engine.block.setScopeEnabled(videoBlock, 'layer/resize', false);

    // The block can still be moved and rotated, but not resized via UI
    ```

    Resize actions remain available through code, but not via the UI.
  </TabItem>

  <TabItem label="Lock all transforms">
    Lock all transforms entirely to prevent resizing, repositioning, and rotation:

    ```typescript highlight-locked-video
    // Lock the transform to prevent resizing
    engine.block.setTransformLocked(lockedVideo, true);
    ```

    The preceding code deactivates all transform actions, resize included:

    - Manual actions from the UI
    - Automated actions through code.
  </TabItem>
</Tabs>

Create templates with finer-grained scope keys to allow rotation or movement while forbidding size changes.

## Notes on Resizing with CE.SDK

| Topic | What you want to do | What happens |
| --- | --- | --- |
| **Timeline length** | Resize the block's on-canvas frame. | No need to retime; duration and trims stay untouched. |
| **Content fill** | Switch the block to `.contain` or `.cover`. | Update it with `setContentFillMode` (see *common crop APIs*). |
| **Performance** | Work on large canvases such as 4K. | Plan around GPU limits and the Video Editor 4K constraints. |

## Next Steps

Now that you understand how to resize with the CE.SDK, take time to dive into other related features:

- [Create a template](./create-templates.md) to enforce design rules.
- [Use other transforms](./edit-video/transform.md) available with the CreativeEditor.
- [Add captions](./edit-video/add-captions.md) to videos.



---

## More Resources

- **[SvelteKit Documentation Index](https://img.ly/sveltekit.md)** - Browse all SvelteKit documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./sveltekit.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support