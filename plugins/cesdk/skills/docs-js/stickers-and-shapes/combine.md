> This is one page of the CE.SDK Vanilla JS documentation. For a complete overview, see the [Vanilla JS Documentation Index](https://img.ly/js.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Create and Edit Shapes](./shapes.md) > [Combine](./stickers-and-shapes/combine.md)

---

Combine multiple shapes using boolean operations to create custom compound designs programmatically.

![Boolean operations demonstration showing Union, Difference, Intersection, and XOR](https://img.ly/docs/cesdk/./assets/browser.hero.webp)

> **Reading time:** 8 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/heads/main.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/main/guides-stickers-and-shapes-combine-browser)
>
> - [Open in StackBlitz](https://stackblitz.com/~/github.com/imgly/cesdk-web-examples/tree/main/guides-stickers-and-shapes-combine-browser)
>
> - [Live demo](https://img.ly/examples/guides-stickers-and-shapes-combine-browser/)

CE.SDK provides four boolean operations for combining shapes: *Union*, *Difference*, *Intersection*, and *XOR*. These operations work with graphic blocks and text blocks, allowing you to build complex designs from simple primitives.

```typescript file=@cesdk_web_examples/guides-stickers-and-shapes-combine-browser/browser.ts reference-only
import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';
import { calculateGridLayout } from './utils';
import packageJson from './package.json';

class Example implements EditorPlugin {
  name = packageJson.name;
  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    // Load assets and create scene
    await cesdk.addDefaultAssetSources();
    await cesdk.addDemoAssetSources({
      sceneMode: 'Design',
      withUploadAssetSources: true,
    });
    await cesdk.createDesignScene();

    const engine = cesdk.engine;
    const page = engine.block.findByType('page')[0];

    // Set page dimensions before grid calculation
    engine.block.setWidth(page, 800);
    engine.block.setHeight(page, 600);

    // Calculate responsive grid layout for demonstrations
    const pageWidth = engine.block.getWidth(page);
    const pageHeight = engine.block.getHeight(page);
    const layout = calculateGridLayout(pageWidth, pageHeight, {
      cols: 2,
      rows: 2,
      spacing: 20,
      margin: 20,
    });
    const { blockWidth, blockHeight, getPosition } = layout;

    // ===== Demonstration 1: Union Operation =====
    // Create three equal circles for union demonstration
    const circleSize = 120;
    const unionCircle1 = engine.block.create('graphic');
    engine.block.setShape(
      unionCircle1,
      engine.block.createShape('//ly.img.ubq/shape/ellipse'),
    );
    const unionFill1 = engine.block.createFill('color');
    engine.block.setColor(unionFill1, 'fill/color/value', {
      r: 1.0,
      g: 0.4,
      b: 0.4,
      a: 1.0,
    });
    engine.block.setFill(unionCircle1, unionFill1);
    engine.block.setWidth(unionCircle1, circleSize);
    engine.block.setHeight(unionCircle1, circleSize);
    engine.block.appendChild(page, unionCircle1);

    const unionCircle2 = engine.block.create('graphic');
    engine.block.setShape(
      unionCircle2,
      engine.block.createShape('//ly.img.ubq/shape/ellipse'),
    );
    const unionFill2 = engine.block.createFill('color');
    engine.block.setColor(unionFill2, 'fill/color/value', {
      r: 0.4,
      g: 1.0,
      b: 0.4,
      a: 1.0,
    });
    engine.block.setFill(unionCircle2, unionFill2);
    engine.block.setWidth(unionCircle2, circleSize);
    engine.block.setHeight(unionCircle2, circleSize);
    engine.block.appendChild(page, unionCircle2);

    const unionCircle3 = engine.block.create('graphic');
    engine.block.setShape(
      unionCircle3,
      engine.block.createShape('//ly.img.ubq/shape/ellipse'),
    );
    const unionFill3 = engine.block.createFill('color');
    engine.block.setColor(unionFill3, 'fill/color/value', {
      r: 0.4,
      g: 0.4,
      b: 1.0,
      a: 1.0,
    });
    engine.block.setFill(unionCircle3, unionFill3);
    engine.block.setWidth(unionCircle3, circleSize);
    engine.block.setHeight(unionCircle3, circleSize);
    engine.block.appendChild(page, unionCircle3);

    // ===== Demonstration 2: Difference Operation =====
    // Create image block for punch-out effect
    const imageBlock = engine.block.create('graphic');
    engine.block.setShape(
      imageBlock,
      engine.block.createShape('//ly.img.ubq/shape/rect'),
    );
    const imageFill = engine.block.createFill('image');
    engine.block.setString(
      imageFill,
      'fill/image/imageFileURI',
      'https://img.ly/static/ubq_samples/sample_1.jpg',
    );
    engine.block.setFill(imageBlock, imageFill);
    engine.block.setWidth(imageBlock, blockWidth * 0.9);
    engine.block.setHeight(imageBlock, blockHeight * 0.9);
    engine.block.appendChild(page, imageBlock);

    // Create text block for punch-out
    const textBlock = engine.block.create('text');
    engine.block.replaceText(textBlock, 'CUTOUT');
    engine.block.setFloat(textBlock, 'text/fontSize', 120);
    engine.block.setWidth(textBlock, blockWidth * 0.9);
    engine.block.appendChild(page, textBlock);

    // ===== Demonstration 3: Intersection Operation =====
    // Create two overlapping circles for intersection (20% larger)
    const intersectCircleSize = circleSize * 1.2;
    const intersectCircle1 = engine.block.create('graphic');
    engine.block.setShape(
      intersectCircle1,
      engine.block.createShape('//ly.img.ubq/shape/ellipse'),
    );
    const intersectFill1 = engine.block.createFill('color');
    engine.block.setColor(intersectFill1, 'fill/color/value', {
      r: 1.0,
      g: 0.6,
      b: 0.2,
      a: 1.0,
    });
    engine.block.setFill(intersectCircle1, intersectFill1);
    engine.block.setWidth(intersectCircle1, intersectCircleSize);
    engine.block.setHeight(intersectCircle1, intersectCircleSize);
    engine.block.appendChild(page, intersectCircle1);

    const intersectCircle2 = engine.block.create('graphic');
    engine.block.setShape(
      intersectCircle2,
      engine.block.createShape('//ly.img.ubq/shape/ellipse'),
    );
    const intersectFill2 = engine.block.createFill('color');
    engine.block.setColor(intersectFill2, 'fill/color/value', {
      r: 1.0,
      g: 0.6,
      b: 0.2,
      a: 1.0,
    });
    engine.block.setFill(intersectCircle2, intersectFill2);
    engine.block.setWidth(intersectCircle2, intersectCircleSize);
    engine.block.setHeight(intersectCircle2, intersectCircleSize);
    engine.block.appendChild(page, intersectCircle2);

    // ===== Demonstration 4: XOR Operation =====
    // Create two overlapping circles for XOR
    const xorCircle1 = engine.block.create('graphic');
    engine.block.setShape(
      xorCircle1,
      engine.block.createShape('//ly.img.ubq/shape/ellipse'),
    );
    const xorFill1 = engine.block.createFill('color');
    engine.block.setColor(xorFill1, 'fill/color/value', {
      r: 1.0,
      g: 0.8,
      b: 0.2,
      a: 1.0,
    });
    engine.block.setFill(xorCircle1, xorFill1);
    engine.block.setWidth(xorCircle1, 140);
    engine.block.setHeight(xorCircle1, 140);
    engine.block.appendChild(page, xorCircle1);

    const xorCircle2 = engine.block.create('graphic');
    engine.block.setShape(
      xorCircle2,
      engine.block.createShape('//ly.img.ubq/shape/ellipse'),
    );
    const xorFill2 = engine.block.createFill('color');
    engine.block.setColor(xorFill2, 'fill/color/value', {
      r: 0.2,
      g: 0.8,
      b: 1.0,
      a: 1.0,
    });
    engine.block.setFill(xorCircle2, xorFill2);
    engine.block.setWidth(xorCircle2, 140);
    engine.block.setHeight(xorCircle2, 140);
    engine.block.appendChild(page, xorCircle2);

    // Position all blocks in grid layout before combining
    // Position union circles at vertices of equilateral triangle in top-left quadrant
    const unionPos = getPosition(0);
    const unionCenterX = unionPos.x + blockWidth / 2;
    const unionCenterY = unionPos.y + blockHeight / 2;
    const triangleRadius = 55; // Distance from center to each vertex
    const halfCircle = circleSize / 2;
    // Top vertex
    engine.block.setPositionX(unionCircle1, unionCenterX - halfCircle);
    engine.block.setPositionY(unionCircle1, unionCenterY - triangleRadius - halfCircle);
    // Bottom-right vertex (angle -30°)
    engine.block.setPositionX(unionCircle2, unionCenterX + triangleRadius * 0.866 - halfCircle);
    engine.block.setPositionY(unionCircle2, unionCenterY + triangleRadius * 0.5 - halfCircle);
    // Bottom-left vertex (angle 210°)
    engine.block.setPositionX(unionCircle3, unionCenterX - triangleRadius * 0.866 - halfCircle);
    engine.block.setPositionY(unionCircle3, unionCenterY + triangleRadius * 0.5 - halfCircle);

    // Center image in top-right quadrant, then center text on image
    const diffPos = getPosition(1);
    const imageX = diffPos.x + (blockWidth - engine.block.getWidth(imageBlock)) / 2;
    const imageY = diffPos.y + (blockHeight - engine.block.getHeight(imageBlock)) / 2;
    engine.block.setPositionX(imageBlock, imageX);
    engine.block.setPositionY(imageBlock, imageY);

    // Center text on the image block (not the quadrant)
    const textX = imageX + (engine.block.getWidth(imageBlock) - engine.block.getWidth(textBlock)) / 2;
    const textY = imageY + (engine.block.getHeight(imageBlock) - engine.block.getHeight(textBlock)) / 2;
    engine.block.setPositionX(textBlock, textX);
    engine.block.setPositionY(textBlock, textY);

    // Center intersection circles in bottom-left quadrant with vertical overlap
    const intersectPos = getPosition(2);
    const intersectCenterX = intersectPos.x + blockWidth / 2;
    const intersectCenterY = intersectPos.y + blockHeight / 2;
    const halfIntersectCircle = intersectCircleSize / 2;
    // Position circles to overlap vertically by about 50% (72px offset for 144px circles)
    engine.block.setPositionX(intersectCircle1, intersectCenterX - halfIntersectCircle);
    engine.block.setPositionY(intersectCircle1, intersectCenterY - halfIntersectCircle - 36);
    engine.block.setPositionX(intersectCircle2, intersectCenterX - halfIntersectCircle);
    engine.block.setPositionY(intersectCircle2, intersectCenterY - halfIntersectCircle + 36);

    // Center XOR circles in bottom-right quadrant
    const xorPos = getPosition(3);
    const xorCenterX = xorPos.x + blockWidth / 2;
    const xorCenterY = xorPos.y + blockHeight / 2;
    engine.block.setPositionX(xorCircle1, xorCenterX - 70);
    engine.block.setPositionY(xorCircle1, xorCenterY - 70);
    engine.block.setPositionX(xorCircle2, xorCenterX - 14);
    engine.block.setPositionY(xorCircle2, xorCenterY - 42);

    // Perform boolean operations
    // Check if blocks can be combined before attempting operations
    const canCombineUnion = engine.block.isCombinable([
      unionCircle1,
      unionCircle2,
      unionCircle3,
    ]);
    const canCombineDiff = engine.block.isCombinable([imageBlock, textBlock]);
    const canCombineIntersect = engine.block.isCombinable([
      intersectCircle1,
      intersectCircle2,
    ]);
    const canCombineXor = engine.block.isCombinable([xorCircle1, xorCircle2]);

    // Combine three circles using Union operation
    if (canCombineUnion) {
      engine.block.combine([unionCircle1, unionCircle2, unionCircle3], 'Union');
    }

    // Create punch-out effect using Difference operation
    // Ensure image is at the bottom (will be the base block)
    if (canCombineDiff) {
      engine.block.sendToBack(imageBlock);
      engine.block.combine([imageBlock, textBlock], 'Difference');
    }

    // Extract overlapping area using Intersection operation
    if (canCombineIntersect) {
      engine.block.combine([intersectCircle1, intersectCircle2], 'Intersection');
    }

    // Create exclusion pattern using XOR operation
    if (canCombineXor) {
      engine.block.combine([xorCircle1, xorCircle2], 'XOR');
    }

    // Zoom to fit all demonstrations
    await engine.scene.zoomToBlock(page, { padding: 40 });
  }
}

export default Example;
```

This guide covers checking combinability, applying the four boolean operations, understanding fill inheritance, and troubleshooting common combination issues.

## Understanding Boolean Operations

CE.SDK offers four boolean operations for combining blocks into new shapes. Each operation applies geometric transformations to create unique compound designs.

**Union** merges all blocks into a single shape, adding their areas together. **Difference** subtracts overlapping areas from a base block, creating cutouts. **Intersection** keeps only the overlapping regions. **XOR** removes overlaps while preserving non-overlapping parts.

The operations use `engine.block.combine(ids, operation)` where `ids` is an array of blocks and `operation` is one of: `'Union'`, `'Difference'`, `'Intersection'`, or `'XOR'`.

Combining blocks with the `'Union'`, `'Intersection'`, or `'XOR'` operation results in a new block whose fill is that of the top-most block. The operation is applied pair-wise from the top-most block to the bottom-most block.

Combining blocks with the `'Difference'` operation results in a new block whose fill is that of the bottom-most block. The operation is applied pair-wise from the bottom-most block to the top-most block.

The combined blocks will be destroyed if the `'lifecycle/destroy'` scope is enabled.

> **Note:** **Only the following blocks can be combined*** A graphics block
> * A text block

## Checking Combinability

Before combining blocks, verify they can be combined using `engine.block.isCombinable(ids)`. Only graphic blocks and text blocks with the `'lifecycle/duplicate'` scope enabled can be combined.

```typescript highlight-check-combinability
// Check if blocks can be combined before attempting operations
const canCombineUnion = engine.block.isCombinable([
  unionCircle1,
  unionCircle2,
  unionCircle3,
]);
const canCombineDiff = engine.block.isCombinable([imageBlock, textBlock]);
const canCombineIntersect = engine.block.isCombinable([
  intersectCircle1,
  intersectCircle2,
]);
const canCombineXor = engine.block.isCombinable([xorCircle1, xorCircle2]);
```

The check returns `true` if all blocks meet the requirements. Attempting to combine incompatible blocks will fail.

## Combining with Union

Union merges multiple shapes into one compound outline. The result inherits the fill from the top-most block in the z-order.

```typescript highlight-combine-union
// Combine three circles using Union operation
if (canCombineUnion) {
  engine.block.combine([unionCircle1, unionCircle2, unionCircle3], 'Union');
}
```

We create three circles with different colors. Union combines them into a single block with the blue fill (from the top-most circle).

Use Union for merging logos, creating compound icons, and building complex shapes from simple primitives.

## Combining with Difference

Difference subtracts overlapping shapes from a base block, creating cutout effects. The result inherits the fill from the bottom-most block.

```typescript highlight-combine-difference
// Create punch-out effect using Difference operation
// Ensure image is at the bottom (will be the base block)
if (canCombineDiff) {
  engine.block.sendToBack(imageBlock);
  engine.block.combine([imageBlock, textBlock], 'Difference');
}
```

We position an image as the bottom block and text above it. Difference removes the text shape from the image, creating a punch-out effect where the text was.

Use Difference for text punch-outs, logo cutouts, and mask effects. Ensure the base block is at the bottom using `engine.block.sendToBack()`.

## Combining with Intersection

Intersection keeps only the overlapping areas of all blocks. The result inherits the fill from the bottom-most block.

```typescript highlight-combine-intersection
// Extract overlapping area using Intersection operation
if (canCombineIntersect) {
  engine.block.combine([intersectCircle1, intersectCircle2], 'Intersection');
}
```

We create two overlapping circles. Intersection extracts only the area where they overlap, discarding the rest.

Use Intersection for lens effects, overlapping patterns, and extracting geometric intersections.

## Combining with XOR

XOR (exclusive OR) keeps non-overlapping parts while removing intersections, creating an exclusion or donut effect. The result inherits the fill from the top-most block.

```typescript highlight-combine-xor
// Create exclusion pattern using XOR operation
if (canCombineXor) {
  engine.block.combine([xorCircle1, xorCircle2], 'XOR');
}
```

We create two overlapping circles. XOR removes the overlapping area while preserving the non-overlapping parts.

Use XOR for donut shapes, exclusion patterns, and inverted overlaps.

## Understanding Fill Inheritance

Combined blocks inherit properties from a prioritized block based on the operation.

**Union, Intersection, XOR**: The new block inherits the fill from the top-most block. Operations are applied pair-wise from highest to lowest sort order.

**Difference**: The new block inherits the fill from the bottom-most block. Operations are applied pair-wise from lowest to highest sort order.

Original blocks are destroyed after combination if the `'lifecycle/destroy'` scope is enabled. Control which fill is inherited by reordering blocks with `engine.block.bringToFront()` and `engine.block.sendToBack()`.

## Scope Requirements

Combining blocks requires specific scopes:

**`'lifecycle/duplicate'`**: Required on all blocks. Checked by `engine.block.isCombinable()`. If missing, combination fails.

**`'lifecycle/destroy'`**: Required for destroying original blocks. If disabled, original blocks remain after combination.

Check scopes with `engine.block.isScopeEnabled(id, scope)` and enable with `engine.block.setScopeEnabled(id, scope, true)`.

## Troubleshooting

### Combination Fails Silently

Verify blocks are combinable using `engine.block.isCombinable(ids)` before attempting operations. Only graphic blocks and text blocks can be combined. Check that the `'lifecycle/duplicate'` scope is enabled on all blocks.

### Original Blocks Not Destroyed

Ensure the `'lifecycle/destroy'` scope is enabled on input blocks. If disabled, blocks remain after combination. Check with `engine.block.isScopeEnabled(id, 'lifecycle/destroy')`.

### Wrong Fill on Result

For Union/Intersection/XOR, the top-most block's fill is inherited. For Difference, the bottom-most block's fill is inherited. Reorder blocks before combining using `engine.block.bringToFront()` or `engine.block.sendToBack()`.

### Unexpected Shape Result

Boolean operations are applied pair-wise in specific order. Union/Intersection/XOR start with the highest sort order (top-most). Difference starts with the lowest sort order (bottom-most). Control order with z-order methods.

## Full Code

Here's the complete implementation showing all four boolean operations:

```typescript
import CreativeEditorSDK from '@cesdk/cesdk-js';

const config = {
  license: 'YOUR_CESDK_LICENSE_KEY',
  callbacks: {
    onUpload: 'local'
  }
};

const cesdk = await CreativeEditorSDK.create('#cesdk_container', config);

await cesdk.addDefaultAssetSources();
await cesdk.addDemoAssetSources({ sceneMode: 'Design' });
await cesdk.createDesignScene();

const engine = cesdk.engine;
const page = engine.block.findByType('page')[0];

engine.block.setWidth(page, 800);
engine.block.setHeight(page, 600);

const pageWidth = engine.block.getWidth(page);
const pageHeight = engine.block.getHeight(page);
const quadrantWidth = pageWidth / 2;
const quadrantHeight = pageHeight / 2;

// Union: Combine three circles in top-left quadrant (20% larger, centered)
const circle1 = engine.block.create('graphic');
engine.block.setShape(circle1, engine.block.createShape('//ly.img.ubq/shape/ellipse'));
const fill1 = engine.block.createFill('color');
engine.block.setColor(fill1, 'fill/color/value', { r: 1.0, g: 0.4, b: 0.4, a: 1.0 });
engine.block.setFill(circle1, fill1);
engine.block.setWidth(circle1, 96);  // 80 * 1.2 = 96
engine.block.setHeight(circle1, 96);
engine.block.setPositionX(circle1, quadrantWidth / 2 - 48);
engine.block.setPositionY(circle1, quadrantHeight / 2 - 48);
engine.block.appendChild(page, circle1);

const circle2 = engine.block.create('graphic');
engine.block.setShape(circle2, engine.block.createShape('//ly.img.ubq/shape/ellipse'));
const fill2 = engine.block.createFill('color');
engine.block.setColor(fill2, 'fill/color/value', { r: 0.4, g: 1.0, b: 0.4, a: 1.0 });
engine.block.setFill(circle2, fill2);
engine.block.setWidth(circle2, 96);  // 80 * 1.2 = 96
engine.block.setHeight(circle2, 96);
engine.block.setPositionX(circle2, quadrantWidth / 2 + 24);
engine.block.setPositionY(circle2, quadrantHeight / 2 - 48);
engine.block.appendChild(page, circle2);

const circle3 = engine.block.create('graphic');
engine.block.setShape(circle3, engine.block.createShape('//ly.img.ubq/shape/ellipse'));
const fill3 = engine.block.createFill('color');
engine.block.setColor(fill3, 'fill/color/value', { r: 0.4, g: 0.4, b: 1.0, a: 1.0 });
engine.block.setFill(circle3, fill3);
engine.block.setWidth(circle3, 120);  // 100 * 1.2 = 120
engine.block.setHeight(circle3, 120);
engine.block.setPositionX(circle3, quadrantWidth / 2 - 12);
engine.block.setPositionY(circle3, quadrantHeight / 2 - 12);
engine.block.appendChild(page, circle3);

// Check combinability and perform Union
if (engine.block.isCombinable([circle1, circle2, circle3])) {
  const unionResult = engine.block.combine([circle1, circle2, circle3], 'Union');
}

// Difference: Create punch-out text effect in top-right quadrant
const imageWidth = 360;  // 300 * 1.2 = 360
const imageHeight = 240;  // 200 * 1.2 = 240
const imageBlock = engine.block.create('graphic');
engine.block.setShape(imageBlock, engine.block.createShape('//ly.img.ubq/shape/rect'));
const imageFill = engine.block.createFill('image');
engine.block.setString(imageFill, 'fill/image/imageFileURI',
  'https://img.ly/static/ubq_samples/sample_1.jpg');
engine.block.setFill(imageBlock, imageFill);
engine.block.setWidth(imageBlock, imageWidth);
engine.block.setHeight(imageBlock, imageHeight);
engine.block.setPositionX(imageBlock, quadrantWidth + (quadrantWidth - imageWidth) / 2);
engine.block.setPositionY(imageBlock, (quadrantHeight - imageHeight) / 2);
engine.block.appendChild(page, imageBlock);

const textBlock = engine.block.create('text');
engine.block.replaceText(textBlock, 'CUTOUT');
engine.block.setFloat(textBlock, 'text/fontSize', 170);
const textWidth = 300;
const textHeight = 120;
engine.block.setWidth(textBlock, textWidth);
engine.block.setHeight(textBlock, textHeight);
// Center text on the image
engine.block.setPositionX(textBlock, quadrantWidth + (quadrantWidth - textWidth) / 2);
engine.block.setPositionY(textBlock, (quadrantHeight - textHeight) / 2);
engine.block.appendChild(page, textBlock);

// Ensure image is at bottom for Difference operation
engine.block.sendToBack(imageBlock);

if (engine.block.isCombinable([imageBlock, textBlock])) {
  const differenceResult = engine.block.combine([imageBlock, textBlock], 'Difference');
}

// Zoom to see all results
await engine.scene.zoomToBlock(page, { padding: 40 });
```

## API Reference

| Method | Category | Purpose |
| --- | --- | --- |
| `engine.block.isCombinable(ids)` | Validation | Check if blocks can be combined |
| `engine.block.combine(ids, op)` | Combination | Perform boolean operation on blocks |
| `engine.block.create('graphic')` | Creation | Create graphic block for shapes |
| `engine.block.create('text')` | Creation | Create text block |
| `engine.block.createShape(type)` | Shapes | Create shape (ellipse, rect, etc.) |
| `engine.block.setShape(id, shape)` | Shapes | Apply shape to graphic block |
| `engine.block.createFill(type)` | Fills | Create fill (color, image, etc.) |
| `engine.block.setFill(id, fill)` | Fills | Apply fill to block |
| `engine.block.setPositionX/Y(id, val)` | Transform | Position blocks before combining |
| `engine.block.setWidth/Height(id, val)` | Transform | Size blocks before combining |
| `engine.block.appendChild(parent, child)` | Hierarchy | Add blocks to scene |
| `engine.block.isScopeEnabled(id, scope)` | Scope | Check if scope is enabled |
| `engine.block.setScopeEnabled(id, scope, enabled)` | Scope | Enable/disable scope |
| `engine.block.bringToFront(id)` | Order | Control stacking order |
| `engine.block.sendToBack(id)` | Order | Control stacking order |



---

## More Resources

- **[Vanilla JS Documentation Index](https://img.ly/js.md)** - Browse all Vanilla JS documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./js.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support