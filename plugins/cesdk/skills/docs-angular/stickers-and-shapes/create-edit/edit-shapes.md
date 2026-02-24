> This is one page of the CE.SDK Angular documentation. For a complete overview, see the [Angular Documentation Index](https://img.ly/angular.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Create and Edit Shapes](./shapes.md) > [Edit Shapes](./stickers-and-shapes/create-edit/edit-shapes.md)

---

This guide shows how to programmatically edit shapes using the Block API, covering geometry modifications, fill changes, stroke configuration, transforms, and boolean combinations.

![Edit shapes demonstration showing various shape modifications](https://img.ly/docs/cesdk/./assets/browser.hero.png)

> **Reading time:** 15 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/heads/main.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/main/guides-stickers-and-shapes-edit-shapes-browser)
>
> - [Open in StackBlitz](https://stackblitz.com/~/github.com/imgly/cesdk-web-examples/tree/main/guides-stickers-and-shapes-edit-shapes-browser)
>
> - [Live demo](https://img.ly/examples/guides-stickers-and-shapes-edit-shapes-browser/)

The `graphic` block in CE.SDK allows you to modify and replace its shape. CE.SDK supports many different types of shapes, such as rectangles, lines, ellipses, polygons, stars, and custom vector paths.

```typescript file=@cesdk_web_examples/guides-stickers-and-shapes-edit-shapes-browser/browser.ts reference-only
import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';

import {
  BlurAssetSource,
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
import { DesignEditorConfig } from './design-editor/plugin';
import packageJson from './package.json';

class Example implements EditorPlugin {
  name = packageJson.name;
  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }
    await cesdk.addPlugin(new DesignEditorConfig());

    // Add asset source plugins
    await cesdk.addPlugin(new BlurAssetSource());
    await cesdk.addPlugin(new ColorPaletteAssetSource());
    await cesdk.addPlugin(new CropPresetsAssetSource());
    await cesdk.addPlugin(new UploadAssetSources({ include: ['ly.img.image.upload'] }));
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
      page: { width: 100, height: 100, unit: 'Pixel' }
    });

    const engine = cesdk.engine;
    const page = engine.block.findByType('page')[0];

    const graphic = engine.block.create('graphic');
    const imageFill = engine.block.createFill('image');
    engine.block.setString(
      imageFill,
      'fill/image/imageFileURI',
      'https://img.ly/static/ubq_samples/sample_1.jpg'
    );
    engine.block.setFill(graphic, imageFill);
    engine.block.setWidth(graphic, 100);
    engine.block.setHeight(graphic, 100);
    engine.block.appendChild(page, graphic);
    engine.block.setPositionX(graphic, 0);
    engine.block.setPositionY(graphic, 0);

    await engine.scene.zoomToBlock(page, { padding: 40 });

    engine.block.supportsShape(graphic); // Returns true
    const text = engine.block.create('text');
    engine.block.supportsShape(text); // Returns false

    const rectShape = engine.block.createShape('rect');
    engine.block.setShape(graphic, rectShape);

    const shape = engine.block.getShape(graphic);
    const shapeType = engine.block.getType(shape);

    const starShape = engine.block.createShape('star');
    engine.block.destroy(engine.block.getShape(graphic));
    engine.block.setShape(graphic, starShape);
    /* The following line would also destroy the currently attached starShape */
    // engine.block.destroy(graphic);

    const allShapeProperties = engine.block.findAllProperties(starShape);
    engine.block.setInt(starShape, 'shape/star/points', 5);
  }
}

export default Example;
```

Similarly to blocks, each shape object has a numeric ID which can be used to query and modify its properties.

## Accessing Shapes

To query whether a block supports shapes, use the `engine.block.supportsShape(id)` API. Currently, only the `graphic` design block supports shape objects. To query the shape of a design block, first create a shape and set it, then call `engine.block.getShape(id)`. You can pass the returned result into other APIs to query more information about the shape, such as its type via `engine.block.getType(id)`.

```typescript highlight-accessShapes
    engine.block.supportsShape(graphic); // Returns true
    const text = engine.block.create('text');
    engine.block.supportsShape(text); // Returns false

    const rectShape = engine.block.createShape('rect');
    engine.block.setShape(graphic, rectShape);

    const shape = engine.block.getShape(graphic);
    const shapeType = engine.block.getType(shape);
```

## Replacing Shapes

When replacing a shape, remember to destroy the previous shape object if you don't intend to use it further. Shape objects that are not attached to a design block will never be automatically destroyed.

```typescript highlight-replaceShape
const starShape = engine.block.createShape('star');
engine.block.destroy(engine.block.getShape(graphic));
engine.block.setShape(graphic, starShape);
/* The following line would also destroy the currently attached starShape */
// engine.block.destroy(graphic);
```

Destroying a design block will also destroy its attached shape block (shown in the commented line).

## Shape Properties

Just like design blocks, shapes with different types have different properties that you can query and modify via the API. Use `engine.block.findAllProperties(id)` to get a list of all properties of a given shape.

```typescript highlight-getProperties
const allShapeProperties = engine.block.findAllProperties(starShape);
```

For the star shape in this example, the call returns an array including properties like `"shape/star/innerDiameter"` and `"shape/star/points"`.

Once we know the property keys of a shape, we can use the same APIs as for design blocks to modify those properties. For example, we can use `engine.block.setInt()` to change the number of points of the star to five.

```typescript highlight-modifyProperties
engine.block.setInt(starShape, 'shape/star/points', 5);
```

## Troubleshooting

### Shape Not Changing

- Verify the block supports shapes: `engine.block.supportsShape(block)` must return `true`
- Check that the shape was created successfully and has a valid ID
- Ensure the shape is assigned to the block using `engine.block.setShape()`

### Property Modification Not Working

- Confirm you're using the correct property key (use `findAllProperties()` to discover them)
- Verify you're using the right setter method: `setInt()` for integers, `setFloat()` for floats, `setString()` for strings
- Check that the property exists for that shape type (e.g., `shape/star/points` only exists on star shapes)

## API Reference

| Method | Category | Purpose |
| --- | --- | --- |
| `engine.block.supportsShape(id)` | Validation | Check if block supports shapes |
| `engine.block.createShape(type)` | Creation | Create new shape instance |
| `engine.block.getShape(id)` | Query | Get shape from graphic block |
| `engine.block.getType(id)` | Query | Get type of block or shape |
| `engine.block.setShape(id, shape)` | Modification | Apply shape to graphic block |
| `engine.block.findAllProperties(id)` | Query | List all properties of block or shape |
| `engine.block.setInt(id, prop, val)` | Modification | Set integer property (e.g., star points) |
| `engine.block.setFloat(id, prop, val)` | Modification | Set float property (e.g., corner radius) |
| `engine.block.setString(id, prop, val)` | Modification | Set string property (e.g., vector path data) |
| `engine.block.destroy(id)` | Management | Destroy block or shape |



---

## More Resources

- **[Angular Documentation Index](https://img.ly/angular.md)** - Browse all Angular documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./angular.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support