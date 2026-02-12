> This is one page of the CE.SDK Vanilla JS documentation. For a complete overview, see the [Vanilla JS Documentation Index](https://img.ly/js.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Create and Edit Compositions](./create-composition.md) > [Position and Align](./insert-media/position-and-align.md)

---

Position, align, and distribute design elements precisely using CE.SDK's
layout APIs and snapping system.

![Positioning and Alignment example showing blocks arranged in a grid layout](https://img.ly/docs/cesdk/./assets/browser.hero.webp)

> **Reading time:** 8 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/heads/main.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/main/guides-create-composition-position-and-align-browser)
>
> - [Open in StackBlitz](https://stackblitz.com/~/github.com/imgly/cesdk-web-examples/tree/main/guides-create-composition-position-and-align-browser)
>
> - [Live demo](https://img.ly/examples/guides-create-composition-position-and-align-browser/)

CE.SDK positions blocks relative to their parent container with the origin at the top left. You can set positions using absolute values (design units) or as percentages of the parent's dimensions. For multi-element layouts, alignment and distribution APIs arrange blocks precisely without manual calculations. In the browser, snapping guides provide visual feedback when dragging elements.

```typescript file=@cesdk_web_examples/guides-create-composition-position-and-align-browser/browser.ts reference-only
import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';
import packageJson from './package.json';

/**
 * CE.SDK Plugin: Positioning and Alignment Guide
 *
 * Demonstrates positioning, aligning, and distributing design elements:
 * - Setting block positions with absolute and percentage modes
 * - Aligning multiple blocks horizontally and vertically
 * - Aligning a single block within its parent
 * - Distributing blocks with even spacing
 * - Configuring snapping thresholds and guide colors
 */
class Example implements EditorPlugin {
  name = packageJson.name;

  version = packageJson.version;

  private currentDemo = 'position';

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    // Initialize CE.SDK with Design mode and load asset sources
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

    // Create navigation buttons for different demos
    this.addNavigationButtons(cesdk);

    // Run the initial demo
    await this.runPositionDemo(cesdk);
  }

  private addNavigationButtons(
    cesdk: NonNullable<EditorPluginContext['cesdk']>
  ) {
    // Register position demo button component
    cesdk.ui.registerComponent('position-demo-btn', ({ builder }) => {
      builder.Button('position-demo', {
        label: 'Position',
        variant: 'regular',
        isActive: this.currentDemo === 'position',
        onClick: async () => {
          this.currentDemo = 'position';
          await this.clearAndRun(cesdk, () => this.runPositionDemo(cesdk));
        }
      });
    });

    // Register align demo button component
    cesdk.ui.registerComponent('align-demo-btn', ({ builder }) => {
      builder.Button('align-demo', {
        label: 'Align',
        variant: 'regular',
        isActive: this.currentDemo === 'align',
        onClick: async () => {
          this.currentDemo = 'align';
          await this.clearAndRun(cesdk, () => this.runAlignDemo(cesdk));
        }
      });
    });

    // Register distribute demo button component
    cesdk.ui.registerComponent('distribute-demo-btn', ({ builder }) => {
      builder.Button('distribute-demo', {
        label: 'Distribute',
        variant: 'regular',
        isActive: this.currentDemo === 'distribute',
        onClick: async () => {
          this.currentDemo = 'distribute';
          await this.clearAndRun(cesdk, () => this.runDistributeDemo(cesdk));
        }
      });
    });

    // Register snapping demo button component
    cesdk.ui.registerComponent('snapping-demo-btn', ({ builder }) => {
      builder.Button('snapping-demo', {
        label: 'Snapping',
        variant: 'regular',
        isActive: this.currentDemo === 'snapping',
        onClick: async () => {
          this.currentDemo = 'snapping';
          await this.clearAndRun(cesdk, () => this.runSnappingDemo(cesdk));
        }
      });
    });

    // Add buttons to navigation bar
    cesdk.ui.insertOrderComponent({ in: 'ly.img.navigation.bar', position: 'end' }, 'position-demo-btn');
    cesdk.ui.insertOrderComponent({ in: 'ly.img.navigation.bar', position: 'end' }, 'align-demo-btn');
    cesdk.ui.insertOrderComponent({ in: 'ly.img.navigation.bar', position: 'end' }, 'distribute-demo-btn');
    cesdk.ui.insertOrderComponent({ in: 'ly.img.navigation.bar', position: 'end' }, 'snapping-demo-btn');
  }

  private async clearAndRun(
    cesdk: NonNullable<EditorPluginContext['cesdk']>,
    runDemo: () => Promise<void>
  ) {
    const engine = cesdk.engine;
    const page = engine.block.findByType('page')[0];

    // Remove all children from the page
    const children = engine.block.getChildren(page);
    children.forEach((child) => {
      engine.block.destroy(child);
    });

    // Run the new demo
    await runDemo();
  }

  private async runPositionDemo(
    cesdk: NonNullable<EditorPluginContext['cesdk']>
  ) {
    const engine = cesdk.engine;
    const page = engine.block.findByType('page')[0];
    const pageWidth = engine.block.getWidth(page);
    const pageHeight = engine.block.getHeight(page);

    // Create image blocks to demonstrate positioning
    const imageUri = 'https://img.ly/static/ubq_samples/sample_1.jpg';
    const blockSize = { width: 150, height: 100 };

    // Block 1: Absolute positioning at specific coordinates
    const block1 = await engine.block.addImage(imageUri, { size: blockSize });
    engine.block.appendChild(page, block1);

    // Set position using absolute coordinates (in design units)
    engine.block.setPositionX(block1, 50);
    engine.block.setPositionY(block1, 50);

    // Query the current position
    const x1 = engine.block.getPositionX(block1);
    const y1 = engine.block.getPositionY(block1);
    // eslint-disable-next-line no-console
    console.log(`Block 1 position: (${x1}, ${y1})`);

    // Block 2: Percentage-based positioning (relative to parent)
    const block2 = await engine.block.addImage(imageUri, { size: blockSize });
    engine.block.appendChild(page, block2);

    // Set position mode to Percent and use percentage values
    engine.block.setPositionXMode(block2, 'Percent');
    engine.block.setPositionYMode(block2, 'Percent');
    engine.block.setPositionX(block2, 0.5); // 50% from left
    engine.block.setPositionY(block2, 0.5); // 50% from top

    // Query the position mode
    const xMode = engine.block.getPositionXMode(block2);
    const yMode = engine.block.getPositionYMode(block2);
    // eslint-disable-next-line no-console
    console.log(`Block 2 position modes: X=${xMode}, Y=${yMode}`);

    // Block 3: Using the convenience method setPosition()
    const block3 = await engine.block.addImage(imageUri, { size: blockSize });
    engine.block.appendChild(page, block3);

    // Set both X and Y at once with a specific position mode
    engine.block.setPosition(block3, 0.75, 0.25, { positionMode: 'Percent' });

    // eslint-disable-next-line no-console
    console.log(
      `Block 3 set to 75% horizontal, 25% vertical using setPosition()`
    );

    // Block 4: Bottom right corner using absolute positioning
    const block4 = await engine.block.addImage(imageUri, { size: blockSize });
    engine.block.appendChild(page, block4);
    engine.block.setPositionX(block4, pageWidth - blockSize.width - 50);
    engine.block.setPositionY(block4, pageHeight - blockSize.height - 50);

    // eslint-disable-next-line no-console
    console.log(
      'Position demo initialized. Blocks placed at various positions.'
    );
  }

  private async runAlignDemo(cesdk: NonNullable<EditorPluginContext['cesdk']>) {
    const engine = cesdk.engine;
    const page = engine.block.findByType('page')[0];

    // Create multiple blocks for alignment demonstration
    const imageUri = 'https://img.ly/static/ubq_samples/sample_1.jpg';
    const blockSize = { width: 100, height: 80 };

    // Create 4 blocks at random-ish positions
    const blocks: number[] = [];
    const positions = [
      { x: 100, y: 100 },
      { x: 250, y: 150 },
      { x: 180, y: 250 },
      { x: 350, y: 200 }
    ];

    for (const pos of positions) {
      const block = await engine.block.addImage(imageUri, { size: blockSize });
      engine.block.appendChild(page, block);
      engine.block.setPositionX(block, pos.x);
      engine.block.setPositionY(block, pos.y);
      blocks.push(block);
    }

    // Check if blocks can be aligned
    const canAlign = engine.block.isAlignable(blocks);
    // eslint-disable-next-line no-console
    console.log('Can align blocks:', canAlign);

    if (canAlign) {
      // Align blocks horizontally to the left edge of their bounding box
      engine.block.alignHorizontally(blocks, 'Left');
      // eslint-disable-next-line no-console
      console.log('Blocks aligned to left edge');
    }

    // Create a single block to demonstrate aligning within parent
    const singleBlock = await engine.block.addImage(imageUri, {
      size: { width: 150, height: 100 }
    });
    engine.block.appendChild(page, singleBlock);

    // Position initially off-center
    engine.block.setPositionX(singleBlock, 500);
    engine.block.setPositionY(singleBlock, 300);

    // Align single block to center of parent (page)
    if (engine.block.isAlignable([singleBlock])) {
      engine.block.alignHorizontally([singleBlock], 'Center');
      engine.block.alignVertically([singleBlock], 'Center');
      // eslint-disable-next-line no-console
      console.log('Single block centered within parent');
    }

    // eslint-disable-next-line no-console
    console.log(
      'Align demo initialized. Left group aligned left, single block centered.'
    );
  }

  private async runDistributeDemo(
    cesdk: NonNullable<EditorPluginContext['cesdk']>
  ) {
    const engine = cesdk.engine;
    const page = engine.block.findByType('page')[0];

    // Create multiple blocks for distribution demonstration
    const imageUri = 'https://img.ly/static/ubq_samples/sample_1.jpg';
    const blockSize = { width: 100, height: 80 };

    // Create 4 blocks at uneven horizontal positions
    const blocks: number[] = [];
    const xPositions = [50, 180, 400, 650];

    for (let i = 0; i < xPositions.length; i++) {
      const block = await engine.block.addImage(imageUri, { size: blockSize });
      engine.block.appendChild(page, block);
      engine.block.setPositionX(block, xPositions[i]);
      engine.block.setPositionY(block, 200); // Same Y for horizontal distribution
      blocks.push(block);
    }

    // Check if blocks can be distributed
    const canDistribute = engine.block.isDistributable(blocks);
    // eslint-disable-next-line no-console
    console.log('Can distribute blocks:', canDistribute);

    if (canDistribute) {
      // Distribute blocks horizontally with even spacing
      engine.block.distributeHorizontally(blocks);
      // eslint-disable-next-line no-console
      console.log('Blocks distributed horizontally with even spacing');
    }

    // Create another set of blocks for vertical distribution
    const verticalBlocks: number[] = [];
    const yPositions = [50, 150, 350, 500];

    for (let i = 0; i < yPositions.length; i++) {
      const block = await engine.block.addImage(imageUri, { size: blockSize });
      engine.block.appendChild(page, block);
      engine.block.setPositionX(block, 600); // Same X for vertical distribution
      engine.block.setPositionY(block, yPositions[i]);
      verticalBlocks.push(block);
    }

    if (engine.block.isDistributable(verticalBlocks)) {
      engine.block.distributeVertically(verticalBlocks);
      // eslint-disable-next-line no-console
      console.log('Vertical blocks distributed with even spacing');
    }

    // eslint-disable-next-line no-console
    console.log(
      'Distribute demo initialized. Left group horizontal, right group vertical.'
    );
  }

  private async runSnappingDemo(
    cesdk: NonNullable<EditorPluginContext['cesdk']>
  ) {
    const engine = cesdk.engine;
    const page = engine.block.findByType('page')[0];

    // Create some blocks to demonstrate snapping
    const imageUri = 'https://img.ly/static/ubq_samples/sample_1.jpg';

    // Create reference blocks (these will act as snap targets)
    const refBlock1 = await engine.block.addImage(imageUri, {
      size: { width: 150, height: 100 }
    });
    engine.block.appendChild(page, refBlock1);
    engine.block.setPositionX(refBlock1, 100);
    engine.block.setPositionY(refBlock1, 100);

    const refBlock2 = await engine.block.addImage(imageUri, {
      size: { width: 150, height: 100 }
    });
    engine.block.appendChild(page, refBlock2);
    engine.block.setPositionX(refBlock2, 100);
    engine.block.setPositionY(refBlock2, 350);

    // Create a draggable block
    const dragBlock = await engine.block.addImage(imageUri, {
      size: { width: 120, height: 80 }
    });
    engine.block.appendChild(page, dragBlock);
    engine.block.setPositionX(dragBlock, 400);
    engine.block.setPositionY(dragBlock, 225);

    // Configure position snapping threshold (pixels)
    // Higher values = snapping activates from further away
    engine.editor.setSettingFloat('positionSnappingThreshold', 10);

    // Configure rotation snapping threshold (degrees)
    engine.editor.setSettingFloat('rotationSnappingThreshold', 5);
    // eslint-disable-next-line no-console
    console.log('Snapping thresholds configured: position=10px, rotation=5deg');

    // Customize snapping guide colors
    engine.editor.setSettingColor('snappingGuideColor', {
      r: 0.2,
      g: 0.6,
      b: 1.0,
      a: 1.0
    });

    engine.editor.setSettingColor('rotationSnappingGuideColor', {
      r: 1.0,
      g: 0.4,
      b: 0.2,
      a: 1.0
    });

    engine.editor.setSettingColor('ruleOfThirdsLineColor', {
      r: 0.5,
      g: 0.5,
      b: 0.5,
      a: 0.5
    });
    // eslint-disable-next-line no-console
    console.log('Snapping guide colors configured');

    // Select the draggable block so user can interact with it
    engine.block.setSelected(dragBlock, true);

    // eslint-disable-next-line no-console
    console.log(
      'Snapping demo initialized. Drag the selected block to see snapping guides.'
    );
  }
}

export default Example;
```

This guide covers how to set block positions using different modes, align blocks horizontally and vertically, distribute blocks with even spacing, and configure snapping for interactive editing.

## Coordinate System

CE.SDK uses a coordinate system where the origin (0, 0) is at the top-left corner of the parent container. The X axis extends to the right and the Y axis extends downward. All positions are relative to the block's parent.

## Setting Block Positions

### Absolute Positioning

We can position blocks using absolute coordinates in design units. This is useful when you need precise control over element placement.

```typescript highlight-absolute-position
    // Set position using absolute coordinates (in design units)
    engine.block.setPositionX(block1, 50);
    engine.block.setPositionY(block1, 50);

    // Query the current position
    const x1 = engine.block.getPositionX(block1);
    const y1 = engine.block.getPositionY(block1);
    // eslint-disable-next-line no-console
    console.log(`Block 1 position: (${x1}, ${y1})`);
```

The `engine.block.setPositionX()` and `engine.block.setPositionY()` methods set the block's position relative to its parent. Use `engine.block.getPositionX()` and `engine.block.getPositionY()` to query the current position.

### Percentage-Based Positioning

Positions can also be set as percentages of the parent's dimensions. This approach is useful for responsive layouts that adapt to different container sizes.

```typescript highlight-percent-position
    // Block 2: Percentage-based positioning (relative to parent)
    const block2 = await engine.block.addImage(imageUri, { size: blockSize });
    engine.block.appendChild(page, block2);

    // Set position mode to Percent and use percentage values
    engine.block.setPositionXMode(block2, 'Percent');
    engine.block.setPositionYMode(block2, 'Percent');
    engine.block.setPositionX(block2, 0.5); // 50% from left
    engine.block.setPositionY(block2, 0.5); // 50% from top

    // Query the position mode
    const xMode = engine.block.getPositionXMode(block2);
    const yMode = engine.block.getPositionYMode(block2);
    // eslint-disable-next-line no-console
    console.log(`Block 2 position modes: X=${xMode}, Y=${yMode}`);
```

Position modes are set using `engine.block.setPositionXMode()` and `engine.block.setPositionYMode()`. When set to `'Percent'`, position values represent a fraction of the parent's size (0.5 = 50%). Query the current mode with `engine.block.getPositionXMode()` and `engine.block.getPositionYMode()`.

### Using the Convenience Method

CE.SDK provides a convenience method that sets both coordinates at once, optionally with a position mode.

```typescript highlight-setPosition-convenience
    // Block 3: Using the convenience method setPosition()
    const block3 = await engine.block.addImage(imageUri, { size: blockSize });
    engine.block.appendChild(page, block3);

    // Set both X and Y at once with a specific position mode
    engine.block.setPosition(block3, 0.75, 0.25, { positionMode: 'Percent' });

    // eslint-disable-next-line no-console
    console.log(
      `Block 3 set to 75% horizontal, 25% vertical using setPosition()`
    );
```

The `engine.block.setPosition()` method accepts X and Y values along with an optional `positionMode` parameter. This simplifies code when setting both coordinates simultaneously.

## Aligning Blocks

### Aligning Multiple Blocks

Multiple blocks can be aligned within their combined bounding box. This is useful for creating visually organized layouts.

```typescript highlight-check-alignable
// Check if blocks can be aligned
const canAlign = engine.block.isAlignable(blocks);
// eslint-disable-next-line no-console
console.log('Can align blocks:', canAlign);
```

Before aligning, we check if the blocks can be aligned using `engine.block.isAlignable()`. This method returns `true` if the blocks support alignment operations.

```typescript highlight-align-horizontal
// Align blocks horizontally to the left edge of their bounding box
engine.block.alignHorizontally(blocks, 'Left');
// eslint-disable-next-line no-console
console.log('Blocks aligned to left edge');
```

The `engine.block.alignHorizontally()` method accepts an array of block IDs and an alignment value: `'Left'`, `'Right'`, or `'Center'`. Similarly, `engine.block.alignVertically()` accepts `'Top'`, `'Bottom'`, or `'Center'`.

### Aligning a Single Block to Parent

When you pass a single block to the alignment methods, it aligns within its parent container rather than a group bounding box.

```typescript highlight-align-single-block
    // Create a single block to demonstrate aligning within parent
    const singleBlock = await engine.block.addImage(imageUri, {
      size: { width: 150, height: 100 }
    });
    engine.block.appendChild(page, singleBlock);

    // Position initially off-center
    engine.block.setPositionX(singleBlock, 500);
    engine.block.setPositionY(singleBlock, 300);

    // Align single block to center of parent (page)
    if (engine.block.isAlignable([singleBlock])) {
      engine.block.alignHorizontally([singleBlock], 'Center');
      engine.block.alignVertically([singleBlock], 'Center');
      // eslint-disable-next-line no-console
      console.log('Single block centered within parent');
    }
```

This approach is useful for centering elements on a page or positioning them at specific edges of the container.

## Distributing Blocks

Distribution spaces blocks evenly within their bounding box. This is ideal for creating consistent spacing in grid layouts or navigation elements.

```typescript highlight-check-distributable
// Check if blocks can be distributed
const canDistribute = engine.block.isDistributable(blocks);
// eslint-disable-next-line no-console
console.log('Can distribute blocks:', canDistribute);
```

The `engine.block.isDistributable()` method verifies that the blocks can be distributed.

```typescript highlight-distribute-horizontal
// Distribute blocks horizontally with even spacing
engine.block.distributeHorizontally(blocks);
// eslint-disable-next-line no-console
console.log('Blocks distributed horizontally with even spacing');
```

The `engine.block.distributeHorizontally()` method arranges blocks so the horizontal space between them is equal. The first and last blocks remain in place while the middle blocks are repositioned.

```typescript highlight-distribute-vertical
    // Create another set of blocks for vertical distribution
    const verticalBlocks: number[] = [];
    const yPositions = [50, 150, 350, 500];

    for (let i = 0; i < yPositions.length; i++) {
      const block = await engine.block.addImage(imageUri, { size: blockSize });
      engine.block.appendChild(page, block);
      engine.block.setPositionX(block, 600); // Same X for vertical distribution
      engine.block.setPositionY(block, yPositions[i]);
      verticalBlocks.push(block);
    }

    if (engine.block.isDistributable(verticalBlocks)) {
      engine.block.distributeVertically(verticalBlocks);
      // eslint-disable-next-line no-console
      console.log('Vertical blocks distributed with even spacing');
    }
```

Similarly, `engine.block.distributeVertically()` distributes blocks with equal vertical spacing.

## Configuring Snapping

Snapping provides visual guides when dragging elements in the editor, helping users align blocks precisely. Configure the snapping sensitivity and appearance using editor settings.

### Setting Snapping Thresholds

```typescript highlight-configure-snapping-threshold
    // Configure position snapping threshold (pixels)
    // Higher values = snapping activates from further away
    engine.editor.setSettingFloat('positionSnappingThreshold', 10);

    // Configure rotation snapping threshold (degrees)
    engine.editor.setSettingFloat('rotationSnappingThreshold', 5);
    // eslint-disable-next-line no-console
    console.log('Snapping thresholds configured: position=10px, rotation=5deg');
```

The `positionSnappingThreshold` setting controls how close (in pixels) a block must be to a snap target before snapping activates. Higher values make snapping more "sticky". The `rotationSnappingThreshold` setting controls rotation snapping sensitivity in degrees.

### Customizing Snapping Guide Colors

```typescript highlight-configure-snapping-colors
    // Customize snapping guide colors
    engine.editor.setSettingColor('snappingGuideColor', {
      r: 0.2,
      g: 0.6,
      b: 1.0,
      a: 1.0
    });

    engine.editor.setSettingColor('rotationSnappingGuideColor', {
      r: 1.0,
      g: 0.4,
      b: 0.2,
      a: 1.0
    });

    engine.editor.setSettingColor('ruleOfThirdsLineColor', {
      r: 0.5,
      g: 0.5,
      b: 0.5,
      a: 0.5
    });
    // eslint-disable-next-line no-console
    console.log('Snapping guide colors configured');
```

Customize the appearance of snapping guides using color settings. The `snappingGuideColor` controls position snapping lines, `rotationSnappingGuideColor` controls rotation guides, and `ruleOfThirdsLineColor` controls composition guide lines.

## Troubleshooting

### Position Not Updating

If a block's position doesn't change after calling the setter methods:

- Verify the block's transform is not locked with `engine.block.isTransformLocked()`
- Check that the block has the `'layer/move'` scope enabled
- Ensure you're using the correct position mode for your values

### Alignment Not Working

If `engine.block.alignHorizontally()` or `engine.block.alignVertically()` has no effect:

- Confirm `engine.block.isAlignable()` returns `true` for the blocks
- Verify all block IDs in the array are valid
- Check that blocks have the `'layer/move'` scope enabled

### Blocks Cannot Be Distributed

If `engine.block.distributeHorizontally()` or `engine.block.distributeVertically()` doesn't work:

- Verify `engine.block.isDistributable()` returns `true`
- Ensure you have at least three blocks in the array
- Check that all blocks share the same parent

## API Reference

| Method                                              | Description                                    |
| --------------------------------------------------- | ---------------------------------------------- |
| `engine.block.getPositionX(id)`                     | Get block's X position                         |
| `engine.block.getPositionY(id)`                     | Get block's Y position                         |
| `engine.block.setPositionX(id, value)`              | Set block's X position                         |
| `engine.block.setPositionY(id, value)`              | Set block's Y position                         |
| `engine.block.getPositionXMode(id)`                 | Get X position mode (Absolute/Percent)         |
| `engine.block.getPositionYMode(id)`                 | Get Y position mode (Absolute/Percent)         |
| `engine.block.setPositionXMode(id, mode)`           | Set X position mode                            |
| `engine.block.setPositionYMode(id, mode)`           | Set Y position mode                            |
| `engine.block.setPosition(id, x, y, options)`       | Set both coordinates with optional mode        |
| `engine.block.isAlignable(ids)`                     | Check if blocks can be aligned                 |
| `engine.block.alignHorizontally(ids, alignment)`    | Align blocks horizontally (Left/Right/Center)  |
| `engine.block.alignVertically(ids, alignment)`      | Align blocks vertically (Top/Bottom/Center)    |
| `engine.block.isDistributable(ids)`                 | Check if blocks can be distributed             |
| `engine.block.distributeHorizontally(ids)`          | Distribute blocks horizontally with even spacing |
| `engine.block.distributeVertically(ids)`            | Distribute blocks vertically with even spacing |
| `engine.editor.setSettingFloat(keypath, value)`     | Set float settings (snapping thresholds)       |
| `engine.editor.setSettingColor(keypath, color)`     | Set color settings (snapping guide colors)     |

## Next Steps

Now that you understand positioning and alignment, explore related layout features:

- [Layer Management](./create-composition/layer-management.md) - Control the stacking order of elements
- [Grouping](./create-composition/group-and-ungroup.md) - Group related elements together
- [Multi-Page Layouts](./create-composition/multi-page.md) - Create multi-page designs with multiple pages in a single scene



---

## More Resources

- **[Vanilla JS Documentation Index](https://img.ly/js.md)** - Browse all Vanilla JS documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./js.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support