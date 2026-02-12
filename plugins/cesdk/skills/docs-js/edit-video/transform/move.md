> This is one page of the CE.SDK Vanilla JS documentation. For a complete overview, see the [Vanilla JS Documentation Index](https://img.ly/js.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Create and Edit Videos](./create-video.md) > [Transform](./edit-video/transform.md) > [Move](./edit-video/transform/move.md)

---

Position videos on the canvas using absolute pixel coordinates or percentage-based positioning for responsive layouts.

![Move videos example showing positioned videos with labels](https://img.ly/docs/cesdk/./assets/browser.hero.webp)

> **Reading time:** 8 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/heads/main.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/main/guides-create-video-transform-move-browser)
>
> - [Open in StackBlitz](https://stackblitz.com/~/github.com/imgly/cesdk-web-examples/tree/main/guides-create-video-transform-move-browser)
>
> - [Live demo](https://img.ly/examples/guides-create-video-transform-move-browser/)

Position videos on the canvas using coordinates that start at the top-left corner (0, 0). X increases right, Y increases down. Values are relative to the parent block, simplifying nested layouts.

```typescript file=@cesdk_web_examples/guides-create-video-transform-move-browser/browser.ts reference-only
import CreativeEditorSDK, {
  type EditorPlugin,
  type EditorPluginContext
} from '@cesdk/cesdk-js';

class Example implements EditorPlugin {
  name = 'guides-create-video-transform-move-browser';

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

    // Demo 1: Movable Video - Can be freely repositioned by user
    const movableVideo = await engine.block.addVideo(
      'https://img.ly/static/ubq_video_samples/bbb.mp4',
      200,
      150
    );
    engine.block.appendChild(page, movableVideo);
    engine.block.setPositionX(movableVideo, 0);
    engine.block.setPositionY(movableVideo, 100);

    const text1 = engine.block.create('text');
    engine.block.setString(text1, 'text/text', 'Movable');
    engine.block.setFloat(text1, 'text/fontSize', 32);
    engine.block.setEnum(text1, 'text/horizontalAlignment', 'Center');
    engine.block.setWidth(text1, 200);
    engine.block.setPositionX(text1, 0);
    engine.block.setPositionY(text1, 310);
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
      'Uses absolute positioning with pixel coordinates'
    );
    engine.block.setFloat(explanation1, 'text/fontSize', 14);
    engine.block.setEnum(explanation1, 'text/horizontalAlignment', 'Center');
    engine.block.setWidth(explanation1, 200);
    engine.block.setPositionX(explanation1, 0);
    engine.block.setPositionY(explanation1, 345);
    engine.block.setFillEnabled(explanation1, true);
    engine.block.setColor(engine.block.getFill(explanation1), 'fill/color/value', {
      r: 1,
      g: 1,
      b: 1,
      a: 1
    });
    engine.block.appendChild(page, explanation1);

    // Demo 2: Percentage Positioning - Responsive layout
    const percentVideo = await engine.block.addVideo(
      'https://img.ly/static/ubq_video_samples/bbb.mp4',
      200,
      150
    );
    engine.block.appendChild(page, percentVideo);

    // Set position mode to percentage (0.0 to 1.0)
    engine.block.setPositionXMode(percentVideo, 'Percent');
    engine.block.setPositionYMode(percentVideo, 'Percent');

    // Position at 37.5% from left (300px), 30% from top (150px)
    engine.block.setPositionX(percentVideo, 0.375);
    engine.block.setPositionY(percentVideo, 0.3);

    const text2 = engine.block.create('text');
    engine.block.setString(text2, 'text/text', 'Percentage');
    engine.block.setFloat(text2, 'text/fontSize', 32);
    engine.block.setEnum(text2, 'text/horizontalAlignment', 'Center');
    engine.block.setWidth(text2, 200);
    engine.block.setPositionX(text2, 300);
    engine.block.setPositionY(text2, 310);
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
    engine.block.setString(
      explanation2,
      'text/text',
      'Uses percentage values (0.0-1.0) for responsive layouts'
    );
    engine.block.setFloat(explanation2, 'text/fontSize', 14);
    engine.block.setEnum(explanation2, 'text/horizontalAlignment', 'Center');
    engine.block.setWidth(explanation2, 200);
    engine.block.setPositionX(explanation2, 300);
    engine.block.setPositionY(explanation2, 345);
    engine.block.setFillEnabled(explanation2, true);
    engine.block.setColor(engine.block.getFill(explanation2), 'fill/color/value', {
      r: 1,
      g: 1,
      b: 1,
      a: 1
    });
    engine.block.appendChild(page, explanation2);

    // Demo 3: Locked Video - Cannot be moved, rotated, or scaled
    const lockedVideo = await engine.block.addVideo(
      'https://img.ly/static/ubq_video_samples/bbb.mp4',
      200,
      150
    );
    engine.block.appendChild(page, lockedVideo);
    engine.block.setPositionX(lockedVideo, 550);
    engine.block.setPositionY(lockedVideo, 150);

    // Lock the transform to prevent user interaction
    engine.block.setBool(lockedVideo, 'transformLocked', true);

    const text3 = engine.block.create('text');
    engine.block.setString(text3, 'text/text', 'Locked');
    engine.block.setFloat(text3, 'text/fontSize', 32);
    engine.block.setEnum(text3, 'text/horizontalAlignment', 'Center');
    engine.block.setWidth(text3, 200);
    engine.block.setPositionX(text3, 550);
    engine.block.setPositionY(text3, 310);
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
    engine.block.setString(
      explanation3,
      'text/text',
      'Transform locked - cannot be repositioned'
    );
    engine.block.setFloat(explanation3, 'text/fontSize', 14);
    engine.block.setEnum(explanation3, 'text/horizontalAlignment', 'Center');
    engine.block.setWidth(explanation3, 200);
    engine.block.setPositionX(explanation3, 550);
    engine.block.setPositionY(explanation3, 345);
    engine.block.setFillEnabled(explanation3, true);
    engine.block.setColor(engine.block.getFill(explanation3), 'fill/color/value', {
      r: 1,
      g: 1,
      b: 1,
      a: 1
    });
    engine.block.appendChild(page, explanation3);

    // Get current position values
    const currentX = engine.block.getPositionX(movableVideo);
    const currentY = engine.block.getPositionY(movableVideo);
    console.log('Current position:', currentX, currentY);

    // Move relative to current position
    const offsetX = engine.block.getPositionX(movableVideo);
    const offsetY = engine.block.getPositionY(movableVideo);
    engine.block.setPositionX(movableVideo, offsetX + 50);
    engine.block.setPositionY(movableVideo, offsetY + 50);

    // Adjust text positions after relative movement
    engine.block.setPositionX(text1, 50);
    engine.block.setPositionY(text1, 310);
    engine.block.setPositionX(explanation1, 50);
    engine.block.setPositionY(explanation1, 345);

    // Set playhead position to 2 seconds
    engine.block.setPlaybackTime(page, 2);
  }
}

export default Example;
```

This guide covers positioning videos with absolute or percentage coordinates, configuring position modes, and locking transforms to prevent repositioning.

## Position Coordinates

Coordinates originate at the top-left (0, 0) of the parent container. Use **absolute** mode for fixed pixel values or **percentage** mode (0.0 to 1.0) for responsive layouts that adapt to parent size changes.

## Positioning Videos

Position videos using `engine.block.setPositionX()` and `engine.block.setPositionY()` with absolute pixel coordinates:

```typescript highlight-movable-video
engine.block.appendChild(page, movableVideo);
engine.block.setPositionX(movableVideo, 0);
engine.block.setPositionY(movableVideo, 100);
```

## Getting Current Position

Read current position values using `engine.block.getPositionX()` and `engine.block.getPositionY()`. Values are returned in the current position mode (absolute pixels or percentage 0.0-1.0):

```typescript highlight-get-position
// Get current position values
const currentX = engine.block.getPositionX(movableVideo);
const currentY = engine.block.getPositionY(movableVideo);
```

## Configuring Position Modes

Control how position values are interpreted using `engine.block.setPositionXMode()` and `engine.block.setPositionYMode()`. Set to `'Absolute'` for pixels or `'Percent'` for percentage values (0.0 to 1.0). Check the current mode using `engine.block.getPositionXMode()` and `engine.block.getPositionYMode()`. The Percentage Positioning section below demonstrates setting these modes.

## Percentage Positioning

Position videos using percentage values (0.0 to 1.0) for responsive layouts. Set the position mode to `'Percent'`, then use values between 0.0 and 1.0:

```typescript highlight-percentage-positioning
// Set position mode to percentage (0.0 to 1.0)
engine.block.setPositionXMode(percentVideo, 'Percent');
engine.block.setPositionYMode(percentVideo, 'Percent');
```

Percentage positioning adapts automatically when the parent block dimensions change, maintaining relative positions in responsive designs.

## Relative Positioning

Move videos relative to their current position by getting the current coordinates and adding offset values:

```typescript highlight-relative-positioning
// Move relative to current position
const offsetX = engine.block.getPositionX(movableVideo);
const offsetY = engine.block.getPositionY(movableVideo);
engine.block.setPositionX(movableVideo, offsetX + 50);
engine.block.setPositionY(movableVideo, offsetY + 50);
```

## Locking Transforms

Lock transforms to prevent repositioning, rotation, and scaling by setting `transformLocked` to true:

```typescript highlight-locked-video
// Lock the transform to prevent user interaction
engine.block.setBool(lockedVideo, 'transformLocked', true);
```

## Troubleshooting

### Video Not Moving

Check if transforms are locked using `engine.block.getBool(block, 'transformLocked')`. Ensure the video block exists and values are within parent bounds.

### Unexpected Position Values

Check position mode using `engine.block.getPositionXMode()` and `engine.block.getPositionYMode()`. Verify if using absolute (pixels) vs percentage (0.0-1.0) values. Review parent block dimensions if using percentage positioning.

### Positioned Outside Visible Area

Verify parent block dimensions and boundaries. Check coordinate system: origin is top-left, not center. Review X/Y values for calculation errors.

### Percentage Positioning Not Responsive

Ensure position mode is set to `'Percent'` using `engine.block.setPositionXMode(block, 'Percent')`. Verify percentage values are between 0.0 and 1.0. Check that parent block dimensions can change.

## API Reference

| Method                                | Description                                |
| ------------------------------------- | ------------------------------------------ |
| `engine.block.addVideo()`             | Create and position video in one operation |
| `engine.block.setPositionX()`         | Set X coordinate value                     |
| `engine.block.setPositionY()`         | Set Y coordinate value                     |
| `engine.block.getPositionX()`         | Get current X coordinate value             |
| `engine.block.getPositionY()`         | Get current Y coordinate value             |
| `engine.block.setPositionXMode()`     | Set position mode for X coordinate         |
| `engine.block.setPositionYMode()`     | Set position mode for Y coordinate         |
| `engine.block.getPositionXMode()`     | Get position mode for X coordinate         |
| `engine.block.getPositionYMode()`     | Get position mode for Y coordinate         |
| `engine.block.setBool()`              | Set transform lock state                   |
| `engine.block.getBool()`              | Get transform lock state                   |



---

## More Resources

- **[Vanilla JS Documentation Index](https://img.ly/js.md)** - Browse all Vanilla JS documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./js.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support