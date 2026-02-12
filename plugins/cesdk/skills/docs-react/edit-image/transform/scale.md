> This is one page of the CE.SDK React documentation. For a complete overview, see the [React Documentation Index](https://img.ly/react.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Create and Edit Images](./edit-image.md) > [Transform](./edit-image/transform.md) > [Scale](./edit-image/transform/scale.md)

---

Scale images proportionally with `engine.block.scale()` using configurable anchor points, or stretch individual axes with direct width/height manipulation.

![Scale images example showing uniform and non-uniform scaling](https://img.ly/docs/cesdk/./assets/browser.hero.webp)

> **Reading time:** 8 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/heads/main.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/main/guides-edit-image-transform-scale-browser)
>
> - [Open in StackBlitz](https://stackblitz.com/~/github.com/imgly/cesdk-web-examples/tree/main/guides-edit-image-transform-scale-browser)
>
> - [Live demo](https://img.ly/examples/guides-edit-image-transform-scale-browser/)

Scaling transforms a block proportionally using a factor, while resizing changes dimensions directly. Use scaling to maintain aspect ratio or apply consistent size changes across multiple elements.

```typescript file=@cesdk_web_examples/guides-edit-image-transform-scale-browser/browser.ts reference-only
import CreativeEditorSDK, {
  type EditorPlugin,
  type EditorPluginContext
} from '@cesdk/cesdk-js';

class Example implements EditorPlugin {
  name = 'guides-edit-image-transform-scale-browser';

  version = CreativeEditorSDK.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    // Setup: Load assets and create scene
    await cesdk.addDefaultAssetSources();
    await cesdk.addDemoAssetSources({
      sceneMode: 'Design',
      withUploadAssetSources: true
    });
    await cesdk.createDesignScene();

    const engine = cesdk.engine;
    const page = engine.block.findByType('page')[0];

    // Set page dimensions
    engine.block.setWidth(page, 800);
    engine.block.setHeight(page, 600);

    // Demo 1: Uniform Scaling - Scale from center anchor
    const scaledImage = await engine.block.addImage(
      'https://img.ly/static/ubq_samples/sample_1.jpg',
      {
        size: { width: 150, height: 150 }
      }
    );
    engine.block.appendChild(page, scaledImage);
    engine.block.setPositionX(scaledImage, 50);
    engine.block.setPositionY(scaledImage, 100);

    // Scale uniformly to 150% from center anchor
    engine.block.scale(scaledImage, 1.5, 0.5, 0.5);

    const text1 = engine.block.create('text');
    engine.block.setString(text1, 'text/text', 'Uniform Scale');
    engine.block.setFloat(text1, 'text/fontSize', 28);
    engine.block.setEnum(text1, 'text/horizontalAlignment', 'Center');
    engine.block.setWidth(text1, 225);
    engine.block.setPositionX(text1, 50);
    engine.block.setPositionY(text1, 360);
    engine.block.appendChild(page, text1);

    // Demo 2: Non-Uniform Scaling - Stretch width only
    const stretchedImage = await engine.block.addImage(
      'https://img.ly/static/ubq_samples/sample_3.jpg',
      {
        size: { width: 150, height: 150 }
      }
    );
    engine.block.appendChild(page, stretchedImage);
    engine.block.setPositionX(stretchedImage, 300);
    engine.block.setPositionY(stretchedImage, 150);

    // Stretch width by 50% while keeping height
    engine.block.setWidthMode(stretchedImage, 'Absolute');
    const currentWidth = engine.block.getWidth(stretchedImage);
    engine.block.setWidth(stretchedImage, currentWidth * 1.5, true);

    const text2 = engine.block.create('text');
    engine.block.setString(text2, 'text/text', 'Non-Uniform');
    engine.block.setFloat(text2, 'text/fontSize', 28);
    engine.block.setEnum(text2, 'text/horizontalAlignment', 'Center');
    engine.block.setWidth(text2, 225);
    engine.block.setPositionX(text2, 300);
    engine.block.setPositionY(text2, 360);
    engine.block.appendChild(page, text2);

    // Demo 3: Locked Image - Cannot be scaled
    const lockedImage = await engine.block.addImage(
      'https://img.ly/static/ubq_samples/sample_5.jpg',
      {
        size: { width: 150, height: 150 }
      }
    );
    engine.block.appendChild(page, lockedImage);
    engine.block.setPositionX(lockedImage, 575);
    engine.block.setPositionY(lockedImage, 150);

    // Lock transforms to prevent scaling
    engine.block.setTransformLocked(lockedImage, true);

    const text3 = engine.block.create('text');
    engine.block.setString(text3, 'text/text', 'Locked');
    engine.block.setFloat(text3, 'text/fontSize', 28);
    engine.block.setEnum(text3, 'text/horizontalAlignment', 'Center');
    engine.block.setWidth(text3, 150);
    engine.block.setPositionX(text3, 575);
    engine.block.setPositionY(text3, 360);
    engine.block.appendChild(page, text3);

    // Scale with different anchor points
    // Top-left anchor (0, 0) - default
    // Center anchor (0.5, 0.5) - scales from center
    // Bottom-right anchor (1, 1) - scales from bottom-right corner
    const anchorX = 0.5;
    const anchorY = 0.5;
    const scaleFactor = 1.2;
    engine.block.scale(scaledImage, scaleFactor, anchorX, anchorY);

    // Restrict scaling through scopes
    engine.block.setScopeEnabled(lockedImage, 'layer/resize', false);

    // Select the scaled image to show the result
    engine.block.select(scaledImage);
  }
}

export default Example;
```

This guide covers uniform scaling with anchor points, non-uniform axis stretching, and locking transforms to prevent scaling in templates.

## Uniform Scaling

Apply a scale factor with `engine.block.scale()` where 1.0 keeps the original size, values greater than 1 enlarge, and values less than 1 shrink. The third and fourth parameters control the anchor point (0 to 1 range):

```typescript highlight-uniform-scale
// Scale uniformly to 150% from center anchor
engine.block.scale(scaledImage, 1.5, 0.5, 0.5);
```

## Anchor Point Control

Control the scaling origin with `anchorX` and `anchorY` parameters. Use (0, 0) for top-left, (0.5, 0.5) for center, or (1, 1) for bottom-right. Center anchor expands equally in all directions:

```typescript highlight-anchor-points
// Scale with different anchor points
// Top-left anchor (0, 0) - default
// Center anchor (0.5, 0.5) - scales from center
// Bottom-right anchor (1, 1) - scales from bottom-right corner
const anchorX = 0.5;
const anchorY = 0.5;
const scaleFactor = 1.2;
engine.block.scale(scaledImage, scaleFactor, anchorX, anchorY);
```

## Non-Uniform Scaling

Stretch a single axis by setting absolute mode and modifying width or height independently. This changes the aspect ratio:

```typescript highlight-non-uniform-scale
// Stretch width by 50% while keeping height
engine.block.setWidthMode(stretchedImage, 'Absolute');
const currentWidth = engine.block.getWidth(stretchedImage);
engine.block.setWidth(stretchedImage, currentWidth * 1.5, true);
```

## Locking Transforms

Lock transforms to prevent scaling, rotation, and repositioning using `setTransformLocked`:

```typescript highlight-lock-scaling
// Lock transforms to prevent scaling
engine.block.setTransformLocked(lockedImage, true);
```

## Scope Restrictions

Disable specific capabilities using scopes. Use `'layer/resize'` to prevent resizing while allowing other operations:

```typescript highlight-scope-restriction
// Restrict scaling through scopes
engine.block.setScopeEnabled(lockedImage, 'layer/resize', false);
```

## Troubleshooting

### Image Scales Unevenly

Use the same anchor values for both X and Y (e.g., 0.5, 0.5 for center). Use `scale()` instead of separate width/height changes to maintain proportions.

### Scaling Doesn't Apply

Verify the block is valid using `engine.block.isValid(blockId)`. Ensure the block is appended to the scene hierarchy with `engine.block.appendChild()`.

### Users Can Still Scale Locked Blocks

Check that the `'layer/resize'` scope is disabled using `engine.block.isScopeEnabled()`. Transform locks prevent UI manipulation but not API calls.

### Export Shows Original Size

Confirm scaling was applied before export. Use `engine.block.getWidth()` and `engine.block.getHeight()` to verify dimensions after scaling.

## API Reference

| Method                              | Description                                   |
| ----------------------------------- | --------------------------------------------- |
| `engine.block.scale()`              | Scale block and children proportionally       |
| `engine.block.getWidth()`           | Get current width                             |
| `engine.block.setWidth()`           | Set width with optional crop maintenance      |
| `engine.block.getHeight()`          | Get current height                            |
| `engine.block.setHeight()`          | Set height with optional crop maintenance     |
| `engine.block.setWidthMode()`       | Set width mode (Absolute, Percent, Auto)      |
| `engine.block.setHeightMode()`      | Set height mode (Absolute, Percent, Auto)     |
| `engine.block.setTransformLocked()` | Lock all transformations                      |
| `engine.block.isTransformLocked()`  | Check if transforms are locked                |
| `engine.block.setScopeEnabled()`    | Enable or disable a scope                     |
| `engine.block.isScopeEnabled()`     | Check if scope is enabled                     |



---

## More Resources

- **[React Documentation Index](https://img.ly/react.md)** - Browse all React documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./react.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support