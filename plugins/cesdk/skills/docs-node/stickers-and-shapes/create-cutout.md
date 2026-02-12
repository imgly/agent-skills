> This is one page of the CE.SDK Node.js documentation. For a complete overview, see the [Node.js Documentation Index](https://img.ly/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Create and Edit Stickers](./stickers.md) > [Create Cutout](./stickers-and-shapes/create-cutout.md)

---

Create cutout paths for cutting printers to produce die-cut stickers, iron-on decals, and custom-shaped prints programmatically.

> **Reading time:** 8 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/heads/main.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/main/guides-stickers-and-shapes-create-cutout-server-js)
>
> - [Open in StackBlitz](https://stackblitz.com/~/github.com/imgly/cesdk-web-examples/tree/main/guides-stickers-and-shapes-create-cutout-server-js)

Cutouts define outline paths that cutting printers cut with a blade rather than print with ink. CE.SDK supports creating cutouts from SVG paths, generating them from block contours, and combining them with boolean operations.

```typescript file=@cesdk_web_examples/guides-stickers-and-shapes-create-cutout-server-js/server-js.ts reference-only
import CreativeEngine from '@cesdk/node';
import { config } from 'dotenv';
import { writeFileSync, mkdirSync, existsSync } from 'fs';

// Load environment variables
config();

/**
 * CE.SDK Server Guide: Create Cutout
 *
 * Demonstrates creating cutout paths for cutting printers in Node.js:
 * - Creating cutouts from SVG paths
 * - Configuring cutout types (Solid/Dashed)
 * - Setting cutout offset distance
 * - Combining cutouts with boolean operations
 * - Customizing spot colors
 * - Exporting to PDF for cutting printers
 */

// Initialize CE.SDK engine in headless mode
const engine = await CreativeEngine.init({
  // license: process.env.CESDK_LICENSE, // Optional (trial mode available)
});

try {
  const outputDir = './output';
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  // Create a design scene
  engine.scene.create('VerticalStack', {
    page: { size: { width: 800, height: 600 } }
  });
  const page = engine.block.findByType('page')[0];

  // Create a circular cutout from SVG path (scaled up for visibility)
  const circle = engine.block.createCutoutFromPath(
    'M 0,75 a 75,75 0 1,1 150,0 a 75,75 0 1,1 -150,0 Z'
  );
  engine.block.appendChild(page, circle);
  engine.block.setPositionX(circle, 200);
  engine.block.setPositionY(circle, 225);

  // Set cutout type to Dashed for perforated cut line
  engine.block.setEnum(circle, 'cutout/type', 'Dashed');

  // Set cutout offset distance from source path
  engine.block.setFloat(circle, 'cutout/offset', 5.0);

  // Create a square cutout with solid type (scaled up for visibility)
  const square = engine.block.createCutoutFromPath('M 0,0 H 150 V 150 H 0 Z');
  engine.block.appendChild(page, square);
  engine.block.setPositionX(square, 450);
  engine.block.setPositionY(square, 225);
  engine.block.setFloat(square, 'cutout/offset', 8.0);

  // Combine cutouts using Union operation
  const combined = engine.block.createCutoutFromOperation(
    [circle, square],
    'Union'
  );
  engine.block.appendChild(page, combined);
  engine.block.setPositionX(combined, 200);
  engine.block.setPositionY(combined, 225);

  // Destroy original cutouts to avoid duplicate cuts
  engine.block.destroy(circle);
  engine.block.destroy(square);

  // Customize spot color RGB for rendering (bright blue for visibility)
  engine.editor.setSpotColorRGB('CutContour', 0.0, 0.4, 0.9);

  // Export to PNG for preview
  const pngBlob = await engine.block.export(page, { mimeType: 'image/png' });
  const pngBuffer = Buffer.from(await pngBlob.arrayBuffer());
  writeFileSync(`${outputDir}/cutout-result.png`, pngBuffer);
  // eslint-disable-next-line no-console
  console.log('✓ Exported PNG preview to output/cutout-result.png');

  // Export to PDF with spot colors for cutting printer
  const pdfBlob = await engine.block.export(page, {
    mimeType: 'application/pdf'
  });
  const pdfBuffer = Buffer.from(await pdfBlob.arrayBuffer());
  writeFileSync(`${outputDir}/cutout-result.pdf`, pdfBuffer);
  // eslint-disable-next-line no-console
  console.log('✓ Exported PDF with spot colors to output/cutout-result.pdf');

  // eslint-disable-next-line no-console
  console.log('\n✓ Cutout creation completed successfully!');
} finally {
  // Always dispose the engine to free resources
  engine.dispose();
}
```

This guide covers creating cutouts from SVG paths, configuring cutout types and offsets, combining cutouts with boolean operations, and customizing spot colors for printer compatibility.

## Understanding Cutouts

Cutouts are special blocks that contain SVG paths interpreted by cutting printers as cut lines. Printers recognize cutouts through specially named spot colors: `CutContour` for solid continuous cuts and `PerfCutContour` for dashed perforated cuts.

The spot color RGB values affect on-screen rendering but not printer behavior. By default, solid cutouts render as magenta and dashed cutouts render as green.

> **Note:** Cutouts export to PDF format with spot color information preserved. Cutting printers read the spot colors to identify cut paths.

## Creating Cutouts from SVG Paths

Create cutouts using `engine.block.createCutoutFromPath(path)` with standard SVG path syntax. The path coordinates define the cutout dimensions.

```typescript highlight-create-cutout-from-path
// Create a circular cutout from SVG path (scaled up for visibility)
const circle = engine.block.createCutoutFromPath(
  'M 0,75 a 75,75 0 1,1 150,0 a 75,75 0 1,1 -150,0 Z'
);
engine.block.appendChild(page, circle);
engine.block.setPositionX(circle, 200);
engine.block.setPositionY(circle, 225);
```

The method accepts standard SVG path commands: `M` (move), `L` (line), `H` (horizontal), `V` (vertical), `C` (cubic curve), `Q` (quadratic curve), `A` (arc), and `Z` (close path).

## Configuring Cutout Type

Set the cutout type using `engine.block.setEnum()` to control whether the printer creates a continuous or perforated cut line.

```typescript highlight-configure-cutout-type
// Set cutout type to Dashed for perforated cut line
engine.block.setEnum(circle, 'cutout/type', 'Dashed');
```

`Solid` creates a continuous cutting line (default), while `Dashed` creates a perforated cutting line for tear-away edges.

## Configuring Cutout Offset

Adjust the distance between the cutout line and the source path using `engine.block.setFloat()`.

```typescript highlight-configure-cutout-offset
// Set cutout offset distance from source path
engine.block.setFloat(circle, 'cutout/offset', 5.0);
```

Positive offset values expand the cutout outward from the path. Use offset to add bleed or margin around designs for cleaner cuts.

## Creating Multiple Cutouts

Create additional cutouts with different properties to demonstrate various shapes and configurations.

```typescript highlight-create-square-cutout
// Create a square cutout with solid type (scaled up for visibility)
const square = engine.block.createCutoutFromPath('M 0,0 H 150 V 150 H 0 Z');
engine.block.appendChild(page, square);
engine.block.setPositionX(square, 450);
engine.block.setPositionY(square, 225);
engine.block.setFloat(square, 'cutout/offset', 8.0);
```

Each cutout can have independent type and offset settings based on your production requirements.

## Combining Cutouts with Boolean Operations

Combine multiple cutouts into compound shapes using `engine.block.createCutoutFromOperation(ids, operation)`. Available operations are `Union`, `Difference`, `Intersection`, and `XOR`.

```typescript highlight-combine-cutouts
  // Combine cutouts using Union operation
  const combined = engine.block.createCutoutFromOperation(
    [circle, square],
    'Union'
  );
  engine.block.appendChild(page, combined);
  engine.block.setPositionX(combined, 200);
  engine.block.setPositionY(combined, 225);

  // Destroy original cutouts to avoid duplicate cuts
  engine.block.destroy(circle);
  engine.block.destroy(square);
```

The combined cutout inherits the type from the first cutout in the array and has an offset of 0. Destroy the original cutouts after combining to avoid duplicate cuts.

> **Note:** When using `Difference`, the first cutout is the base that others subtract from. For other operations, the order affects which cutout's type is inherited.

## Customizing Spot Colors

Modify the spot color RGB approximation using `engine.editor.setSpotColorRGB()` to change how cutouts render without affecting printer behavior.

```typescript highlight-customize-spot-color
// Customize spot color RGB for rendering (bright blue for visibility)
engine.editor.setSpotColorRGB('CutContour', 0.0, 0.4, 0.9);
```

Spot color names (`CutContour`, `PerfCutContour`) are what printers recognize. Adjust the names if your printer uses different conventions.

## Exporting Cutouts

Export the design with cutouts to PDF format to preserve spot color information for cutting printers.

```typescript highlight-export
  // Export to PNG for preview
  const pngBlob = await engine.block.export(page, { mimeType: 'image/png' });
  const pngBuffer = Buffer.from(await pngBlob.arrayBuffer());
  writeFileSync(`${outputDir}/cutout-result.png`, pngBuffer);
  // eslint-disable-next-line no-console
  console.log('✓ Exported PNG preview to output/cutout-result.png');

  // Export to PDF with spot colors for cutting printer
  const pdfBlob = await engine.block.export(page, {
    mimeType: 'application/pdf'
  });
  const pdfBuffer = Buffer.from(await pdfBlob.arrayBuffer());
  writeFileSync(`${outputDir}/cutout-result.pdf`, pdfBuffer);
  // eslint-disable-next-line no-console
  console.log('✓ Exported PDF with spot colors to output/cutout-result.pdf');
```

The PDF output contains spot colors that cutting printers read to identify cut paths.

## Troubleshooting

### Cutout Not Visible

Cutouts render using spot color RGB approximations. Verify the cutout is appended to the page hierarchy and positioned within the visible canvas area.

### Printer Not Cutting

Check that spot color names match your printer's requirements. Some printers need specific names like `CutContour` or `Thru-cut`. Consult your printer documentation.

### Combined Cutout Has Wrong Type

Combined cutouts inherit the type from the first cutout in the array. Reorder the array or set the type explicitly after combination.

## API Reference

| Method | Category | Purpose |
| --- | --- | --- |
| `engine.block.createCutoutFromPath(path)` | Cutout | Create cutout from SVG path string |
| `engine.block.createCutoutFromBlocks(ids, vThresh, sThresh, useShape)` | Cutout | Create cutout from block contours |
| `engine.block.createCutoutFromOperation(ids, op)` | Cutout | Combine cutouts with boolean operation |
| `engine.block.setEnum(id, 'cutout/type', value)` | Property | Set cutout type (Solid/Dashed) |
| `engine.block.setFloat(id, 'cutout/offset', value)` | Property | Set cutout offset distance |
| `engine.block.setFloat(id, 'cutout/smoothing', value)` | Property | Set corner smoothing threshold |
| `engine.block.appendChild(parent, child)` | Hierarchy | Add cutout to scene |
| `engine.block.setPositionX/Y(id, value)` | Transform | Position cutout on canvas |
| `engine.block.destroy(id)` | Lifecycle | Remove cutout from scene |
| `engine.block.export(id, options)` | Export | Export page with cutouts to PDF |
| `engine.editor.setSpotColorRGB(name, r, g, b)` | Editor | Customize spot color rendering |

## Next Steps

- **[Combine Shapes](./stickers-and-shapes/combine.md)** - Boolean operations on graphic blocks
- **[Create Shapes](./stickers-and-shapes/create-edit/create-shapes.md)** - Create geometric shapes programmatically
- **[Export for Printing](./export-save-publish/for-printing.md)** - Export print-ready PDFs with spot colors



---

## More Resources

- **[Node.js Documentation Index](https://img.ly/node.md)** - Browse all Node.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support