> This is one page of the CE.SDK SvelteKit documentation. For a complete overview, see the [SvelteKit Documentation Index](https://img.ly/sveltekit.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Create and Edit Videos](./create-video.md) > [Transform](./edit-video/transform.md) > [Scale](./edit-video/transform/scale.md)

---

The CreativeEditor provides a scaling feature to edit videos in your web app, to render an intended composition. Explore the different scaling options within CE.SDK, and learn how to embed it both from the UI and the API.

![Scale videos example showing different scaling techniques](https://img.ly/docs/cesdk/./assets/browser.hero.webp)

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/heads/main.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/main/guides-create-video-transform-scale-browser)
>
> - [Open in StackBlitz](https://stackblitz.com/~/github.com/imgly/cesdk-web-examples/tree/main/guides-create-video-transform-scale-browser)
>
> - [Live demo](https://img.ly/examples/guides-create-video-transform-scale-browser/)

## What You'll Learn

- Scale videos through **JavaScript**.
- Scale **proportionally** or non-uniformly.
- **Group** elements to scale them together.
- Apply or lock scaling **constraints** in templates.

## When to Use

Use scaling to:

- **Emphasize** or de-emphasize a clip in a composition.
- **Fit** footage to a free-form layout without cropping.
- Drive zoom gestures or **responsive** designs.

## How Scaling Works

Scaling uses the `scale(block, scale, anchorX, anchorY)` function, with the following **parameters**:

| Parameter           | Description                                      | Values                                                                                         |
| ------------------- | ------------------------------------------------ | ---------------------------------------------------------------------------------------------- |
| `block`             | Handle (ID) of the block to scale.               | `number`                                                                                       |
| `scale`             | Scale factor to apply.                           | **1.0** keeps the original size. **>1.0** enlarges the block. **\< 1.0** shrinks it.            |
| `anchorX` `anchorY` | Origin point of scale along the width and height | **Top/Left** = 0, **Center** = 0.5, **Bottom/Right** = 1. **Defaults** = `0`                   |

For example:

- A value of `1.0` sets the original block's size.
- A value of `2.0` makes the block twice as large.

```typescript file=@cesdk_web_examples/guides-create-video-transform-scale-browser/browser.ts reference-only
import CreativeEditorSDK, {
  type EditorPlugin,
  type EditorPluginContext
} from '@cesdk/cesdk-js';

class Example implements EditorPlugin {
  name = 'guides-create-video-transform-scale-browser';

  version = CreativeEditorSDK.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    // Setup: Load assets and create scene
    cesdk.feature.enable('ly.img.video');
    cesdk.feature.enable('ly.img.timeline');
    cesdk.feature.enable('ly.img.playback');

    await cesdk.addDefaultAssetSources();
    await cesdk.addDemoAssetSources({
      sceneMode: 'Video',
      withUploadAssetSources: true
    });
    await cesdk.createVideoScene();

    const engine = cesdk.engine;
    const pages = engine.block.findByType('page');
    const page = pages.length > 0 ? pages[0] : engine.scene.get();

    // Set page dimensions and fill color
    engine.block.setWidth(page, 800);
    engine.block.setHeight(page, 500);

    // Enable fill and set page fill color to #6686FF
    engine.block.setFillEnabled(page, true);
    engine.block.setColor(engine.block.getFill(page), 'fill/color/value', {
      r: 102 / 255,
      g: 134 / 255,
      b: 255 / 255,
      a: 1
    });

    // Centered 2x2 grid layout for 800x500 canvas
    // Videos: 120x90, scaled to 180x135
    // Grid positions are where videos APPEAR after scaling
    // Left column visual X=200, Right column visual X=420
    // Top row visual Y=50, Bottom row visual Y=265
    const leftColumnX = 200;
    const rightColumnX = 420;
    const topRowY = 50;
    const bottomRowY = 265;
    const titleOffsetY = 145; // 135 (video height) + 10 (gap)
    const subtitleOffsetY = 172; // title + 27

    // For center-scaled video, compensate for position shift
    // Center scaling shifts top-left by (-30, -22.5) for 1.5x scale on 120x90
    const centerScaleOffsetX = 30;
    const centerScaleOffsetY = 22.5;

    // Demo 1: Uniform scaling from top-left (default anchor)
    const uniformVideo = await engine.block.addVideo(
      'https://img.ly/static/ubq_video_samples/bbb.mp4',
      120,
      90
    );
    engine.block.appendChild(page, uniformVideo);
    engine.block.setPositionX(uniformVideo, leftColumnX);
    engine.block.setPositionY(uniformVideo, topRowY);

    // Scale the video to 150% from the default top-left anchor
    engine.block.scale(uniformVideo, 1.5);

    const text1 = engine.block.create('text');
    engine.block.setString(text1, 'text/text', 'Uniform Scale');
    engine.block.setFloat(text1, 'text/fontSize', 24);
    engine.block.setEnum(text1, 'text/horizontalAlignment', 'Center');
    engine.block.setWidth(text1, 180);
    engine.block.setPositionX(text1, leftColumnX);
    engine.block.setPositionY(text1, topRowY + titleOffsetY);
    engine.block.setFillEnabled(text1, true);
    engine.block.setColor(engine.block.getFill(text1), 'fill/color/value', {
      r: 1,
      g: 1,
      b: 1,
      a: 1
    });
    engine.block.appendChild(page, text1);

    const explanation1 = engine.block.create('text');
    engine.block.setString(
      explanation1,
      'text/text',
      '150% from top-left anchor'
    );
    engine.block.setFloat(explanation1, 'text/fontSize', 12);
    engine.block.setEnum(explanation1, 'text/horizontalAlignment', 'Center');
    engine.block.setWidth(explanation1, 180);
    engine.block.setPositionX(explanation1, leftColumnX);
    engine.block.setPositionY(explanation1, topRowY + subtitleOffsetY);
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

    // Demo 2: Scaling from center anchor
    const centerVideo = await engine.block.addVideo(
      'https://img.ly/static/ubq_video_samples/bbb.mp4',
      120,
      90
    );
    engine.block.appendChild(page, centerVideo);
    // Position compensates for center scaling shift so final position aligns with grid
    engine.block.setPositionX(centerVideo, rightColumnX + centerScaleOffsetX);
    engine.block.setPositionY(centerVideo, topRowY + centerScaleOffsetY);

    // Scale from center anchor (0.5, 0.5)
    engine.block.scale(centerVideo, 1.5, 0.5, 0.5);

    const text2 = engine.block.create('text');
    engine.block.setString(text2, 'text/text', 'Center Scale');
    engine.block.setFloat(text2, 'text/fontSize', 24);
    engine.block.setEnum(text2, 'text/horizontalAlignment', 'Center');
    engine.block.setWidth(text2, 180);
    engine.block.setPositionX(text2, rightColumnX);
    engine.block.setPositionY(text2, topRowY + titleOffsetY);
    engine.block.setFillEnabled(text2, true);
    engine.block.setColor(engine.block.getFill(text2), 'fill/color/value', {
      r: 1,
      g: 1,
      b: 1,
      a: 1
    });
    engine.block.appendChild(page, text2);

    const explanation2 = engine.block.create('text');
    engine.block.setString(
      explanation2,
      'text/text',
      '150% from center anchor'
    );
    engine.block.setFloat(explanation2, 'text/fontSize', 12);
    engine.block.setEnum(explanation2, 'text/horizontalAlignment', 'Center');
    engine.block.setWidth(explanation2, 180);
    engine.block.setPositionX(explanation2, rightColumnX);
    engine.block.setPositionY(explanation2, topRowY + subtitleOffsetY);
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

    // Demo 3: Non-uniform scaling (width only)
    const stretchVideo = await engine.block.addVideo(
      'https://img.ly/static/ubq_video_samples/bbb.mp4',
      120,
      90
    );
    engine.block.appendChild(page, stretchVideo);
    engine.block.setPositionX(stretchVideo, leftColumnX);
    engine.block.setPositionY(stretchVideo, bottomRowY);

    // Stretch only the width by 1.5x
    engine.block.setWidthMode(stretchVideo, 'Absolute');
    const currentWidth = engine.block.getWidth(stretchVideo);
    engine.block.setWidth(stretchVideo, currentWidth * 1.5, true);

    const text3 = engine.block.create('text');
    engine.block.setString(text3, 'text/text', 'Width Stretch');
    engine.block.setFloat(text3, 'text/fontSize', 24);
    engine.block.setEnum(text3, 'text/horizontalAlignment', 'Center');
    engine.block.setWidth(text3, 180);
    engine.block.setPositionX(text3, leftColumnX);
    engine.block.setPositionY(text3, bottomRowY + titleOffsetY);
    engine.block.setFillEnabled(text3, true);
    engine.block.setColor(engine.block.getFill(text3), 'fill/color/value', {
      r: 1,
      g: 1,
      b: 1,
      a: 1
    });
    engine.block.appendChild(page, text3);

    const explanation3 = engine.block.create('text');
    engine.block.setString(
      explanation3,
      'text/text',
      '150% width, height unchanged'
    );
    engine.block.setFloat(explanation3, 'text/fontSize', 12);
    engine.block.setEnum(explanation3, 'text/horizontalAlignment', 'Center');
    engine.block.setWidth(explanation3, 180);
    engine.block.setPositionX(explanation3, leftColumnX);
    engine.block.setPositionY(explanation3, bottomRowY + subtitleOffsetY);
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

    // Demo 4: Locked scaling
    const lockedVideo = await engine.block.addVideo(
      'https://img.ly/static/ubq_video_samples/bbb.mp4',
      120,
      90
    );
    engine.block.appendChild(page, lockedVideo);
    engine.block.setPositionX(lockedVideo, rightColumnX);
    engine.block.setPositionY(lockedVideo, bottomRowY);

    // Lock all transforms to prevent scaling
    engine.block.setTransformLocked(lockedVideo, true);

    const text4 = engine.block.create('text');
    engine.block.setString(text4, 'text/text', 'Scale Locked');
    engine.block.setFloat(text4, 'text/fontSize', 24);
    engine.block.setEnum(text4, 'text/horizontalAlignment', 'Center');
    engine.block.setWidth(text4, 180);
    engine.block.setPositionX(text4, rightColumnX);
    engine.block.setPositionY(text4, bottomRowY + titleOffsetY);
    engine.block.setFillEnabled(text4, true);
    engine.block.setColor(engine.block.getFill(text4), 'fill/color/value', {
      r: 1,
      g: 1,
      b: 1,
      a: 1
    });
    engine.block.appendChild(page, text4);

    const explanation4 = engine.block.create('text');
    engine.block.setString(
      explanation4,
      'text/text',
      'Transform locked - cannot scale'
    );
    engine.block.setFloat(explanation4, 'text/fontSize', 12);
    engine.block.setEnum(explanation4, 'text/horizontalAlignment', 'Center');
    engine.block.setWidth(explanation4, 180);
    engine.block.setPositionX(explanation4, rightColumnX);
    engine.block.setPositionY(explanation4, bottomRowY + subtitleOffsetY);
    engine.block.setFillEnabled(explanation4, true);
    engine.block.setColor(
      engine.block.getFill(explanation4),
      'fill/color/value',
      {
        r: 1,
        g: 1,
        b: 1,
        a: 1
      }
    );
    engine.block.appendChild(page, explanation4);

    // Set playhead position to 2 seconds
    engine.block.setPlaybackTime(page, 2);
  }
}

export default Example;
```

## Scale a Video Uniformly

To change the clip size without distorting its proportions, use uniform scaling. Uniform scaling multiplies both width and height by the **same factor** to keep the frame's aspect ratio intact.

Scaling a video uniformly allows you to:

- Enlarge or shrink footage without altering the content.
- Maintain per-pixel sharpness.
- Align with layout constraints.

CE.SDK lets you use the same high-level API on all graphic blocks, videos included. To scale any block, use `engine.block.scale()`:

```typescript highlight-uniform-scale
    const uniformVideo = await engine.block.addVideo(
      'https://img.ly/static/ubq_video_samples/bbb.mp4',
      120,
      90
    );
    engine.block.appendChild(page, uniformVideo);
    engine.block.setPositionX(uniformVideo, leftColumnX);
    engine.block.setPositionY(uniformVideo, topRowY);

    // Scale the video to 150% from the default top-left anchor
    engine.block.scale(uniformVideo, 1.5);
```

The preceding code:

- Scales the video to 150% of its original size.
- Doesn't change the origin anchor point.

As a result, the video expands down and to the right.

### Anchor Point

The anchor point is the point around which a layer scales. All changes happen around the anchor's point position. By default, any block's anchor point is **the top left**.

To **change the anchor point**, the scale function has two optional parameters:

- `anchorX` to move the anchor point along the width.
- `anchorY` to move the anchor point along the height.

Both can have values between 0.0 and 1.0. For example, to scale from the center:

```typescript highlight-center-scale
    const centerVideo = await engine.block.addVideo(
      'https://img.ly/static/ubq_video_samples/bbb.mp4',
      120,
      90
    );
    engine.block.appendChild(page, centerVideo);
    // Position compensates for center scaling shift so final position aligns with grid
    engine.block.setPositionX(centerVideo, rightColumnX + centerScaleOffsetX);
    engine.block.setPositionY(centerVideo, topRowY + centerScaleOffsetY);

    // Scale from center anchor (0.5, 0.5)
    engine.block.scale(centerVideo, 1.5, 0.5, 0.5);
```

This function:

1. Scales the video to **150%** of its original size.
2. Sets the origin anchor point at the center with `0.5, 0.5`.

This way, the video expands from the center equally in all directions.

## Scale Videos Non-Uniformly

You might need to stretch a video only horizontally or vertically. To stretch or compress only one axis, thus distorting a video, use the **width** or **height** functions.

```typescript highlight-nonuniform-scale
    const stretchVideo = await engine.block.addVideo(
      'https://img.ly/static/ubq_video_samples/bbb.mp4',
      120,
      90
    );
    engine.block.appendChild(page, stretchVideo);
    engine.block.setPositionX(stretchVideo, leftColumnX);
    engine.block.setPositionY(stretchVideo, bottomRowY);

    // Stretch only the width by 1.5x
    engine.block.setWidthMode(stretchVideo, 'Absolute');
    const currentWidth = engine.block.getWidth(stretchVideo);
    engine.block.setWidth(stretchVideo, currentWidth * 1.5, true);
```

The preceding code:

1. Sets the width mode to `'Absolute'` to edit the video using a fixed pixel value instead of a relative layout mode.
2. Reads the current width.
3. Multiplies it by 1.5 to compute a new width that's 150% of the original.
4. Writes the new width back to the block with `maintainCrop` set to `true`.

Use this to:

- Create panoramic crops.
- Compensate for aspect ratios during automation.

### Respect the Existing Crop

The crop defines which part of the clip stays visible. Stretching the block without preserving its crop might:

- Reveal unwanted areas.
- Cut off the focal point.

The `maintainCrop` parameter (third argument to `setWidth`) keeps the visible region intact and avoids distortion. Consider using `maintainCrop` if a **template** already uses cropping to frame a subject or hide a watermark.

## Scale Clips Together

Grouping blocks is a useful way of scaling them proportionally. Use `engine.block.group()` to combine blocks into a group, then scale the group as a single unit:

```typescript
const groupId = engine.block.group([videoBlockId, textBlockId]);
engine.block.scale(groupId, 1.5, 0.5, 0.5);
```

The preceding code scales the entire group to 150% from the center anchor.

> **Warning:** You can't group `page` with other blocks. Group elements on the **top** of the page, **not** with the page itself.

## Lock Scaling in Templates

To preserve a template's layout, consider locking the scaling option. This is useful for:

- Brand assets
- Campaign creatives
- Collaboration workflows
- Fixed dimensions swapping editors

```typescript highlight-locked-scale
    const lockedVideo = await engine.block.addVideo(
      'https://img.ly/static/ubq_video_samples/bbb.mp4',
      120,
      90
    );
    engine.block.appendChild(page, lockedVideo);
    engine.block.setPositionX(lockedVideo, rightColumnX);
    engine.block.setPositionY(lockedVideo, bottomRowY);

    // Lock all transforms to prevent scaling
    engine.block.setTransformLocked(lockedVideo, true);
```

### Disable Resize Scope

Disable the `layer/resize` scope when working with templates to **prevent users from scaling** blocks:

```typescript
engine.block.setScopeEnabled(blockId, 'layer/resize', false);
```

### Lock All Transformations

To **lock** all transformations (move, resize, rotate), use `setTransformLocked`:

```typescript
engine.block.setTransformLocked(blockId, true);
```

To check if scaling is currently allowed:

```typescript
const canResize = engine.block.isScopeEnabled(blockId, 'layer/resize');
console.log('layer/resize scope enabled?', canResize);
```

## Troubleshooting

### Video Not Scaling

Check if transforms are locked using `engine.block.isTransformLocked(block)`. Ensure the block exists and is a valid design block.

### Unexpected Position After Scale

Verify the anchor point coordinates. Default anchor (0, 0) causes expansion to the right and down. Use (0.5, 0.5) for center-based scaling.

### Crop Region Shifting

When using `setWidth` or `setHeight`, pass `true` as the third parameter to maintain the crop region.

## Recap

| Usage              | How To                                                                                         |
| ------------------ | ---------------------------------------------------------------------------------------------- |
| Uniform scaling    | `engine.block.scale(blockId, scaleFactor)` + optional anchor                                   |
| Stretching an axis | Set width mode to `'Absolute'`, then use `setWidth()` or `setHeight()`                         |
| Group scaling      | 1. Group with `engine.block.group([blockId_1, blockId_2])` 2. Scale the group                  |
| Constraints        | Adjust scopes or lock transforms to protect templates                                          |

## API Reference

| API                          | Usage                                                              |
| ---------------------------- | ------------------------------------------------------------------ |
| `block.scale`                | Performs uniform or anchored scaling on blocks and groups.         |
| `block.setWidthMode`         | Enables absolute sizing before changing a single axis.             |
| `block.getWidth`             | Reads the current width before non-uniform scaling.                |
| `block.setWidth`             | Writes the adjusted width after single-axis scaling.               |
| `block.setHeightMode`        | Enables absolute sizing for height changes.                        |
| `block.getHeight`            | Reads the current height before non-uniform scaling.               |
| `block.setHeight`            | Writes the adjusted height after single-axis scaling.              |
| `block.group`                | Group blocks so they scale together.                               |
| `block.setScopeEnabled`      | Toggles the `layer/resize` scope to lock scaling in templates.     |
| `block.setTransformLocked`   | Locks all transform scopes when templates must stay fixed.         |
| `block.isScopeEnabled`       | Checks whether scaling is currently permitted on a block.          |
| `block.isTransformLocked`    | Checks whether all transforms are locked on a block.               |



---

## More Resources

- **[SvelteKit Documentation Index](https://img.ly/sveltekit.md)** - Browse all SvelteKit documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./sveltekit.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support