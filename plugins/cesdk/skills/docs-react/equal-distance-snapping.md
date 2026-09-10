> This is one page of the CE.SDK React documentation. For a complete overview, see the [React Documentation Index](https://img.ly/docs/cesdk/react.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

Turn on equal-distance snapping so a dragged block lands at an equal distance from its siblings, and a badge shows the size of each gap.

> **Reading time:** 5 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/tags/release-$UBQ_VERSION$.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/release-$UBQ_VERSION$/guides-equal-distance-snapping-browser)
>
> - [Open in StackBlitz](https://stackblitz.com/github/imgly/cesdk-web-examples/tree/v$UBQ_VERSION$/guides-equal-distance-snapping-browser)
>
> - [Live demo](https://cdn.img.ly/demo/cesdk-web-examples/v1.83.0-nightly.20260910/examples/guides-equal-distance-snapping-browser/index.html)

While the user drags a block, the engine looks for sibling blocks that already sit at an equal distance from each other. When the dragged block comes close to a position that continues or splits that spacing, the engine pulls the block onto it. It then draws a line across each gap, a tick at both ends of the line, and a badge with the size of the gap.

The engine draws these indicators, so Web, iOS and Android all show the same thing.

```typescript file=@cesdk_web_examples/guides-equal-distance-snapping-browser/browser.ts reference-only
import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';

import {
  BlurAssetSource,
  ImageColorsAssetSource,
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
import { AdvancedEditorConfig } from '@cesdk/core-configs-web/advanced-editor';
import packageJson from './package.json';

/**
 * Turns on equal-distance snapping and builds a row of blocks to drag into equal spacing.
 */
class Example implements EditorPlugin {
  name = packageJson.name;

  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    await cesdk.addPlugin(new AdvancedEditorConfig());

    // Add asset source plugins
    await cesdk.addPlugin(new BlurAssetSource());
    await cesdk.addPlugin(new ImageColorsAssetSource());
    await cesdk.addPlugin(new ColorPaletteAssetSource());
    await cesdk.addPlugin(new CropPresetsAssetSource());
    await cesdk.addPlugin(
      new UploadAssetSources({ include: ['ly.img.image.upload'] })
    );
    await cesdk.addPlugin(
      new DemoAssetSources({
        include: [
          'ly.img.templates.blank.*',
          'ly.img.templates.presentation.*',
          'ly.img.templates.print.*',
          'ly.img.templates.social.*',
          'ly.img.image.*'
        ]
      })
    );
    await cesdk.addPlugin(new EffectsAssetSource());
    await cesdk.addPlugin(new FiltersAssetSource());
    await cesdk.addPlugin(new PagePresetsAssetSource());
    await cesdk.addPlugin(new StickerAssetSource());
    await cesdk.addPlugin(new TextAssetSource());
    await cesdk.addPlugin(new TextComponentAssetSource());
    await cesdk.addPlugin(new TypefaceAssetSource());
    await cesdk.addPlugin(new VectorShapeAssetSource());

    await cesdk.actions.run('scene.create', {
      page: { width: 800, height: 600, unit: 'Pixel' }
    });

    const engine = cesdk.engine;

    // Equal-distance snapping is off by default. Turn it on per engine instance.
    engine.editor.setSettingBool('features/equalDistanceSnappingEnabled', true);

    // The pull distance is shared with edge and center snapping. It is in
    // screen pixels, so it does not change with the zoom.
    engine.editor.setSettingFloat('positionSnappingThreshold', 4);

    // The badges and the measurement lines use the snapping guide color.
    engine.editor.setSettingColor('snappingGuideColor', {
      r: 1,
      g: 0.004,
      b: 0.361,
      a: 1
    });

    // Build a row of three blocks with unequal spacing. Drag the third one
    // to the left to see the snap and the badges.
    const page = engine.block.findByType('page')[0];
    for (const positionX of [40, 260, 620]) {
      const block = engine.block.create('graphic');
      engine.block.setShape(block, engine.block.createShape('rect'));
      engine.block.setFill(block, engine.block.createFill('color'));
      engine.block.setWidth(block, 120);
      engine.block.setHeight(block, 120);
      engine.block.setPositionX(block, positionX);
      engine.block.setPositionY(block, 240);
      engine.block.appendChild(page, block);
    }
  }
}

export default Example;
```

## Turn the Feature On

Equal-distance snapping is off by default. Turn it on per engine instance with the `features/equalDistanceSnappingEnabled` setting.

```typescript highlight=highlight-enable
// Equal-distance snapping is off by default. Turn it on per engine instance.
engine.editor.setSettingBool('features/equalDistanceSnappingEnabled', true);
```

The setting takes effect on the next drag. You can turn it off again at any time.

## Understand When the Snap Fires

The engine measures gaps along one axis and needs the blocks to overlap across that axis. Two blocks in the same row form one horizontal gap. Two blocks in the same column form one vertical gap. The dragged block must overlap each block of the chain across that axis, and each pair of neighbours must overlap each other. Both axes are checked on every drag, so a block can snap on X and on Y at the same time.

From one chain of equal gaps, the engine offers three positions:

- **After the chain.** The dragged block continues the spacing on the right, or below.
- **Before the chain.** The dragged block continues the spacing on the left, or above.
- **Inside a single gap.** The dragged block splits one gap into two equal halves. This needs the block to fit in the gap.

Only blocks on the same page take part. A block that overlaps its neighbour has no gap with it, so the chain stops there.

The size of each gap comes from the blocks that do not move, so it does not follow the cursor and the snap stays free of jitter. Which blocks take part follows the row or column that the dragged block is in.

## Control the Pull Distance

`positionSnappingThreshold` sets how close the drag must come before the block is pulled. Edge and center snapping share the same value.

```typescript highlight=highlight-threshold
// The pull distance is shared with edge and center snapping. It is in
// screen pixels, so it does not change with the zoom.
engine.editor.setSettingFloat('positionSnappingThreshold', 4);
```

The value is in screen pixels, so the pull feels the same at any zoom.

## Style the Indicators

`snappingGuideColor` sets the color of the measurement line, of the ticks, and of the badge background. `handleFillColor` sets the color of the label inside the badge, so pick a color with a strong contrast against the background.

```typescript highlight=highlight-color
// The badges and the measurement lines use the snapping guide color.
engine.editor.setSettingColor('snappingGuideColor', {
  r: 1,
  g: 0.004,
  b: 0.361,
  a: 1
});
```

The badge measures its own label, so it always fits the number. Every gap of a chain shows the same number: the spacing the snap holds, in design units, to one decimal. A badge wider than its gap moves above or beside the line.

## Combine With Other Snapping

Equal-distance snapping runs first on each axis. When an equal-distance position is in reach, it takes that axis, even when an edge or center guide sits nearer. The engine uses the edge and center guides only when no equal-distance position is in reach. The badge appears only on an axis that equal distance won.

While an equal-distance snap holds the block, the engine does not round the position to the pixel grid. Rounding would break the equality that the badges show.

## Try It

The example builds a page with three blocks in a row at unequal spacing.

```typescript highlight=highlight-scene
// Build a row of three blocks with unequal spacing. Drag the third one
// to the left to see the snap and the badges.
const page = engine.block.findByType('page')[0];
for (const positionX of [40, 260, 620]) {
  const block = engine.block.create('graphic');
  engine.block.setShape(block, engine.block.createShape('rect'));
  engine.block.setFill(block, engine.block.createFill('color'));
  engine.block.setWidth(block, 120);
  engine.block.setHeight(block, 120);
  engine.block.setPositionX(block, positionX);
  engine.block.setPositionY(block, 240);
  engine.block.appendChild(page, block);
}
```

Drag the third block to the left. When the two gaps become equal, the block snaps and two badges appear.



---

## More Resources

- **[React Documentation Index](https://img.ly/docs/cesdk/react.md)** - Browse all React documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./react.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support