> This is one page of the CE.SDK Electron documentation. For a complete overview, see the [Electron Documentation Index](https://img.ly/docs/cesdk/electron.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Create and Edit Text](./text.md) > [Understanding Text Rendering](./guides/text/rendering-internals.md)

---

Understand how CE.SDK positions and renders text by exploring font metrics—ascenders, descenders, baselines, and line height—and see these concepts visualized directly on the canvas.

![Text rendering visualization showing font metrics overlays](https://img.ly/docs/cesdk/./assets/browser.hero.webp)

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/heads/main.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/main/guides-text-rendering-internals-browser)
>
> - [Open in StackBlitz](https://stackblitz.com/~/github.com/imgly/cesdk-web-examples/tree/main/guides-text-rendering-internals-browser)
>
> - [Live demo](https://img.ly/docs/cesdk/examples/guides-text-rendering-internals-browser/)

Every font defines metrics that determine how text is positioned vertically. Understanding these metrics helps you debug text layout issues, align text precisely with other design elements, and comprehend why fonts at the "same size" can appear different heights.

```typescript file=@cesdk_web_examples/guides-text-rendering-internals-browser/browser.ts reference-only
import type {
  CreativeEngine,
  DesignUnit,
  EditorPlugin,
  EditorPluginContext,
  FontMetrics,
  RGBAColor,
  Typeface
} from '@cesdk/cesdk-js';
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
import { DesignEditorConfig } from '@cesdk/core-configs-web/design-editor';
import packageJson from './package.json';

// Color constants for visualization overlays
const COLORS: Record<string, RGBAColor> = {
  ascender: { r: 1.0, g: 0.42, b: 0.42, a: 0.3 }, // Light red
  descender: { r: 0.31, g: 0.8, b: 0.77, a: 0.3 }, // Light cyan
  baseline: { r: 1.0, g: 0.84, b: 0.0, a: 0.8 }, // Gold
  lineGap: { r: 0.59, g: 0.81, b: 0.71, a: 0.4 }, // Light green
  paragraphSpacing: { r: 1.0, g: 0.6, b: 0.2, a: 0.5 }, // Orange
  frame: { r: 0.87, g: 0.63, b: 0.87, a: 0.15 } // Light purple
};

/** Calculated metrics for a single line of text, in the scene's design unit. */
interface LineMetrics {
  ascenderHeight: number; // Design units above baseline
  descenderHeight: number; // Design units below baseline
  lineHeight: number; // Total line height (ascender + descender)
  baselineOffset: number; // Distance from line top to baseline (= ascenderHeight)
}

/** Multiline layout metrics derived from LineMetrics. */
interface MultilineMetrics {
  lineSpacing: number; // Distance between line tops
  lineGap: number; // Extra space between lines (when multiplier > 1)
  totalHeight: number; // Total height for all lines
}

/**
 * Unit Conversion Constants
 *
 * Font sizes are specified in typographic points (pt).
 * CE.SDK supports three design unit types, each with different relationships to points:
 *
 *   - Millimeter: 1 inch = 25.4 mm, so 1 pt = 25.4/72 mm ≈ 0.3528 mm
 *   - Inch: 1 inch = 72 pt, so 1 pt = 1/72 inch ≈ 0.0139 inch
 *   - Pixel: At 72 DPI (CE.SDK default), 1 pt = 1 px
 *
 * The conversion factor transforms point-based font measurements to design units.
 */
const POINTS_PER_INCH = 72;
const MM_PER_INCH = 25.4;
const CESDK_DEFAULT_DPI = 72; // CE.SDK uses 72 DPI for pixel mode

/** Convert typographic points to the specified design unit. */
export function getDesignUnitsPerPoint(designUnit: DesignUnit): number {
  switch (designUnit) {
    case 'Millimeter':
      // 1 point = 25.4/72 mm ≈ 0.3528 mm
      return MM_PER_INCH / POINTS_PER_INCH;
    case 'Inch':
      // 1 point = 1/72 inch ≈ 0.0139 inch
      return 1 / POINTS_PER_INCH;
    case 'Pixel':
      // At 72 DPI: 1 point = 1 pixel
      return CESDK_DEFAULT_DPI / POINTS_PER_INCH;
    default:
      throw new Error(`Unknown design unit: ${designUnit}`);
  }
}

/**
 * Calculate single-line metrics from font metrics and font size.
 * lineHeight = fontSize × (ascender + |descender|) / unitsPerEm × designUnitsPerPoint
 */
export function calculateLineMetrics(
  fontMetrics: FontMetrics,
  fontSize: number,
  designUnit: DesignUnit = 'Millimeter'
): LineMetrics {
  const designUnitsPerPoint = getDesignUnitsPerPoint(designUnit);

  const totalTypographicUnits =
    fontMetrics.ascender + Math.abs(fontMetrics.descender);
  const ascenderRatio = fontMetrics.ascender / totalTypographicUnits;
  const descenderRatio =
    Math.abs(fontMetrics.descender) / totalTypographicUnits;

  const lineHeightInPoints =
    (fontSize * totalTypographicUnits) / fontMetrics.unitsPerEm;
  const lineHeight = lineHeightInPoints * designUnitsPerPoint;

  const ascenderHeight = lineHeight * ascenderRatio;
  const descenderHeight = lineHeight * descenderRatio;
  const baselineOffset = ascenderHeight;

  return {
    ascenderHeight,
    descenderHeight,
    lineHeight,
    baselineOffset
  };
}

/**
 * Calculate multiline layout metrics from single-line metrics.
 * lineSpacing = lineHeight × multiplier; lineGap = lineSpacing - lineHeight
 */
export function calculateMultilineMetrics(
  lineMetrics: LineMetrics,
  lineCount: number,
  lineHeightMultiplier: number
): MultilineMetrics {
  const lineSpacing = lineMetrics.lineHeight * lineHeightMultiplier;
  const lineGap = lineSpacing - lineMetrics.lineHeight;
  const totalHeight = lineMetrics.lineHeight + (lineCount - 1) * lineSpacing;

  return {
    lineSpacing,
    lineGap,
    totalHeight
  };
}

interface LineVisualization {
  ascenderRect: number;
  descenderRect: number;
  baselineRect: number;
  lineGapRect: number;
  paragraphSpacingRect: number;
}

interface VisualizationSet {
  textBlock: number;
  lineVisualizations: LineVisualization[];
  frameRect: number;
  fontUri: string;
}

class Example implements EditorPlugin {
  name = packageJson.name;

  version = packageJson.version;

  private visualizationBlocks: Map<number, VisualizationSet> = new Map();

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    await cesdk.addPlugin(new DesignEditorConfig());

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
      page: { width: 1000, height: 1000, unit: 'Pixel' }
    });

    const engine = cesdk.engine;
    const page = engine.block.findByType('page')[0];

    const fontNames = [
      'Roboto',
      'Playfair Display',
      'Abril Fatface',
      'Caveat',
      'Lato'
    ];

    let yOffset = 30;
    for (const fontName of fontNames) {
      const result = await engine.asset.findAssets('ly.img.typeface', {
        query: fontName,
        page: 0,
        perPage: 1
      });

      if (result.assets.length === 0) {
        console.warn(`Font "${fontName}" not found in asset library`);
        continue;
      }

      const typefaceAsset = result.assets[0];
      const typeface = typefaceAsset.payload?.typeface;
      if (typeface && typeface.fonts?.[0]?.uri) {
        const fontUri = typeface.fonts[0].uri;

        const vizSet = await this.createVisualizationSet(
          engine,
          page,
          fontName,
          fontUri,
          typeface,
          yOffset
        );
        this.visualizationBlocks.set(vizSet.textBlock, vizSet);

        yOffset += 180;
      }
    }

    engine.event.subscribe([], async (events) => {
      for (const event of events) {
        if (this.visualizationBlocks.has(event.block)) {
          await this.updateVisualization(engine, event.block);
        }
      }
    });

    const scene = engine.scene.get();
    if (scene) {
      engine.event.subscribe([scene], async () => {
        for (const vizSet of this.visualizationBlocks.values()) {
          await this.updateVisualization(engine, vizSet.textBlock);
        }
      });
    }

    for (const vizSet of this.visualizationBlocks.values()) {
      await this.updateVisualization(engine, vizSet.textBlock);
    }

    await this.createLegend(engine, page);

    await engine.scene.zoomToBlock(page, { padding: 40 });

    const firstVizSet = this.visualizationBlocks.values().next().value;
    if (firstVizSet) {
      engine.block.setSelected(firstVizSet.textBlock, true);
    }
  }

  private async createVisualizationSet(
    engine: CreativeEngine,
    page: number,
    fontName: string,
    fontUri: string,
    typeface: Typeface,
    yPosition: number
  ): Promise<VisualizationSet> {
    const frameRect = this.createColoredRect(engine, page, COLORS.frame);

    const textBlock = engine.block.create('text');
    engine.block.appendChild(page, textBlock);
    engine.block.replaceText(
      textBlock,
      `${fontName}\u2028Second Line\nNew Paragraph`
    );
    engine.block.setTextFontSize(textBlock, 36);
    engine.block.setFont(textBlock, fontUri, typeface);
    engine.block.setFloat(textBlock, 'text/paragraphSpacing', 0.5);
    engine.block.setHeightMode(textBlock, 'Auto');
    engine.block.setWidthMode(textBlock, 'Auto');
    engine.block.setPositionX(textBlock, 30);
    engine.block.setPositionY(textBlock, yPosition);

    return {
      textBlock,
      lineVisualizations: [],
      frameRect,
      fontUri
    };
  }

  private ensureLineVisualizations(
    engine: CreativeEngine,
    page: number,
    vizSet: VisualizationSet,
    requiredLineCount: number
  ): void {
    const previousCount = vizSet.lineVisualizations.length;

    while (vizSet.lineVisualizations.length < requiredLineCount) {
      vizSet.lineVisualizations.push({
        ascenderRect: this.createColoredRect(engine, page, COLORS.ascender),
        descenderRect: this.createColoredRect(engine, page, COLORS.descender),
        baselineRect: this.createColoredRect(engine, page, COLORS.baseline),
        lineGapRect: this.createColoredRect(engine, page, COLORS.lineGap),
        paragraphSpacingRect: this.createColoredRect(
          engine,
          page,
          COLORS.paragraphSpacing
        )
      });
    }

    if (vizSet.lineVisualizations.length > previousCount) {
      engine.block.appendChild(page, vizSet.textBlock);
    }

    for (let i = requiredLineCount; i < vizSet.lineVisualizations.length; i++) {
      this.setLineVizVisibility(engine, vizSet.lineVisualizations[i], false);
    }
  }

  private async createLegend(
    engine: CreativeEngine,
    page: number
  ): Promise<void> {
    const legendX = 700;
    const legendY = 30;
    const swatchSize = 20;
    const lineHeight = 35;

    const result = await engine.asset.findAssets('ly.img.typeface', {
      query: 'Roboto',
      page: 0,
      perPage: 1
    });
    const typeface = result.assets[0]?.payload?.typeface;
    const fontUri = typeface?.fonts?.[0]?.uri;

    const legendItems = [
      { color: COLORS.ascender, label: 'Ascender' },
      { color: COLORS.descender, label: 'Descender' },
      { color: COLORS.baseline, label: 'Baseline' },
      { color: COLORS.lineGap, label: 'Line Gap' },
      { color: COLORS.paragraphSpacing, label: 'Paragraph Gap' },
      { color: COLORS.frame, label: 'Text Frame' }
    ];

    const titleBlock = engine.block.create('text');
    engine.block.appendChild(page, titleBlock);
    engine.block.replaceText(titleBlock, 'Legend');
    engine.block.setTextFontSize(titleBlock, 24);
    if (fontUri && typeface) {
      engine.block.setFont(titleBlock, fontUri, typeface);
    }
    engine.block.setHeightMode(titleBlock, 'Auto');
    engine.block.setWidthMode(titleBlock, 'Auto');
    engine.block.setPositionX(titleBlock, legendX);
    engine.block.setPositionY(titleBlock, legendY);

    for (let i = 0; i < legendItems.length; i++) {
      const item = legendItems[i];
      const itemY = legendY + 40 + i * lineHeight;

      const swatch = this.createColoredRect(engine, page, {
        ...item.color,
        a: item.color.a < 0.5 ? 0.6 : item.color.a // Make swatches more visible
      });
      this.positionRect(engine, swatch, legendX, itemY, swatchSize, swatchSize);

      const label = engine.block.create('text');
      engine.block.appendChild(page, label);
      engine.block.replaceText(label, item.label);
      engine.block.setTextFontSize(label, 16);
      if (fontUri && typeface) {
        engine.block.setFont(label, fontUri, typeface);
      }
      engine.block.setHeightMode(label, 'Auto');
      engine.block.setWidthMode(label, 'Auto');
      engine.block.setPositionX(label, legendX + swatchSize + 10);
      engine.block.setPositionY(label, itemY + 2);
    }
  }

  private createColoredRect(
    engine: CreativeEngine,
    page: number,
    color: RGBAColor
  ): number {
    const rect = engine.block.create('graphic');
    engine.block.appendChild(page, rect);
    const shape = engine.block.createShape('rect');
    engine.block.setShape(rect, shape);
    const fill = engine.block.createFill('color');
    engine.block.setFill(rect, fill);
    engine.block.setColor(fill, 'fill/color/value', color);
    return rect;
  }

  private positionRect(
    engine: CreativeEngine,
    block: number,
    x: number,
    y: number,
    width: number,
    height: number
  ): void {
    engine.block.setPositionX(block, x);
    engine.block.setPositionY(block, y);
    engine.block.setWidth(block, width);
    engine.block.setHeight(block, height);
  }

  private setLineVizVisibility(
    engine: CreativeEngine,
    lineViz: LineVisualization,
    visible: boolean
  ): void {
    engine.block.setVisible(lineViz.ascenderRect, visible);
    engine.block.setVisible(lineViz.descenderRect, visible);
    engine.block.setVisible(lineViz.baselineRect, visible);
    engine.block.setVisible(lineViz.lineGapRect, visible);
    engine.block.setVisible(lineViz.paragraphSpacingRect, visible);
  }

  /**
   * Find lines ending with paragraph breaks (\n) vs line separators (\u2028).
   * Queries the engine's visual line content to handle soft wraps correctly.
   */
  private findParagraphBreakLines(
    engine: CreativeEngine,
    textBlock: number,
    lineCount: number
  ): Set<number> {
    const result = new Set<number>();

    for (let lineIndex = 0; lineIndex < lineCount; lineIndex++) {
      const lineContent = engine.block.getTextVisibleLineContent(
        textBlock,
        lineIndex
      );
      if (lineContent.endsWith('\n')) {
        result.add(lineIndex);
      }
    }

    return result;
  }

  private async updateVisualization(
    engine: CreativeEngine,
    textBlock: number
  ): Promise<void> {
    const vizSet = this.visualizationBlocks.get(textBlock);
    if (!vizSet) return;

    const page = engine.block.getParent(textBlock);
    if (!page) return;

    const fontUri = engine.block.getString(textBlock, 'text/fontFileUri');
    if (!fontUri) return;
    vizSet.fontUri = fontUri;

    // Returns FontMetrics in font design units, e.g. for Roboto:
    // { ascender: 1900, descender: -500, unitsPerEm: 2048, lineGap: 0,
    //   capHeight: 1456, xHeight: 1082, underlineOffset: -200,
    //   underlineSize: 100, strikeoutOffset: 528, strikeoutSize: 102 }
    let metrics: FontMetrics;
    try {
      metrics = await engine.editor.getFontMetrics(fontUri);
    } catch (error) {
      console.error(`Failed to load font metrics for ${fontUri}:`, error);
      return;
    }

    const frameX = engine.block.getPositionX(textBlock);
    const frameY = engine.block.getPositionY(textBlock);
    const frameWidth = engine.block.getFrameWidth(textBlock);
    const frameHeight = engine.block.getFrameHeight(textBlock);
    const fontSizePt = engine.block.getTextFontSizes(textBlock)[0] ?? 36;
    const lineHeightMultiplier = engine.block.getFloat(
      textBlock,
      'text/lineHeight'
    );
    const lineCount = engine.block.getTextVisibleLineCount(textBlock);

    if (lineCount === 0) return;

    this.ensureLineVisualizations(engine, page, vizSet, lineCount);

    const designUnit = engine.scene.getDesignUnit();

    const lineMetrics = calculateLineMetrics(metrics, fontSizePt, designUnit);
    const multilineMetrics = calculateMultilineMetrics(
      lineMetrics,
      lineCount,
      lineHeightMultiplier
    );

    const { ascenderHeight, descenderHeight, lineHeight } = lineMetrics;
    const { lineSpacing } = multilineMetrics;

    const paragraphSpacingMultiplier = engine.block.getFloat(
      textBlock,
      'text/paragraphSpacing'
    );
    const paragraphGap = paragraphSpacingMultiplier * lineHeight;

    const linesEndingWithParagraphBreak = this.findParagraphBreakLines(
      engine,
      textBlock,
      lineCount
    );

    const lineX = frameX;
    const lineWidth = frameWidth;

    const regularLineGap = lineSpacing - lineHeight;
    let cumulativeY = frameY;

    for (let lineIndex = 0; lineIndex < lineCount; lineIndex++) {
      const lineViz = vizSet.lineVisualizations[lineIndex];

      const lineTopY = cumulativeY;
      const baselineY = lineTopY + ascenderHeight;
      const ascenderTop = lineTopY;
      const descenderBottom = baselineY + descenderHeight;

      engine.block.setVisible(lineViz.ascenderRect, true);
      this.positionRect(
        engine,
        lineViz.ascenderRect,
        lineX,
        ascenderTop,
        lineWidth,
        ascenderHeight
      );

      engine.block.setVisible(lineViz.descenderRect, true);
      this.positionRect(
        engine,
        lineViz.descenderRect,
        lineX,
        baselineY,
        lineWidth,
        descenderHeight
      );

      const baselineThicknessPx = 2;
      const baselineThickness =
        baselineThicknessPx * getDesignUnitsPerPoint(designUnit);
      engine.block.setVisible(lineViz.baselineRect, true);
      this.positionRect(
        engine,
        lineViz.baselineRect,
        lineX,
        baselineY - baselineThickness / 2,
        lineWidth,
        baselineThickness
      );

      if (lineIndex < lineCount - 1) {
        const gapTop = descenderBottom;

        const hasParagraphBreak = linesEndingWithParagraphBreak.has(lineIndex);
        const extraParagraphGap = hasParagraphBreak ? paragraphGap : 0;

        if (regularLineGap > 0.5) {
          engine.block.setVisible(lineViz.lineGapRect, true);
          this.positionRect(
            engine,
            lineViz.lineGapRect,
            lineX,
            gapTop,
            lineWidth,
            regularLineGap
          );
        } else {
          engine.block.setVisible(lineViz.lineGapRect, false);
        }

        if (hasParagraphBreak && extraParagraphGap > 0.5) {
          engine.block.setVisible(lineViz.paragraphSpacingRect, true);
          this.positionRect(
            engine,
            lineViz.paragraphSpacingRect,
            lineX,
            gapTop + regularLineGap,
            lineWidth,
            extraParagraphGap
          );
        } else {
          engine.block.setVisible(lineViz.paragraphSpacingRect, false);
        }

        cumulativeY += lineSpacing + extraParagraphGap;
      } else {
        engine.block.setVisible(lineViz.lineGapRect, false);
        engine.block.setVisible(lineViz.paragraphSpacingRect, false);
      }
    }

    this.positionRect(
      engine,
      vizSet.frameRect,
      frameX,
      frameY,
      frameWidth,
      frameHeight
    );
  }
}

export default Example;
```

This guide covers how font metrics determine text positioning, how CE.SDK converts font sizes to design units, and how the line height and paragraph spacing properties affect multiline layout.

## Font Metrics Fundamentals

Use `getFontMetrics()` to read a font's metrics in its design units:

```typescript highlight-get-metrics
// Returns FontMetrics in font design units, e.g. for Roboto:
// { ascender: 1900, descender: -500, unitsPerEm: 2048, lineGap: 0,
//   capHeight: 1456, xHeight: 1082, underlineOffset: -200,
//   underlineSize: 100, strikeoutOffset: 528, strikeoutSize: 102 }
let metrics: FontMetrics;
try {
  metrics = await engine.editor.getFontMetrics(fontUri);
} catch (error) {
  console.error(`Failed to load font metrics for ${fontUri}:`, error);
  return;
}
```

Typography positions text relative to the **baseline**—the invisible line characters sit on. Every font defines these key measurements:

- **Ascender**: Distance above the baseline to the top of tall characters (b, d, h, l)
- **Descender**: Distance below the baseline where characters like g, p, y extend
- **EM Square**: The design space containing all glyphs, typically 1000 or 2048 units
- **Line Height**: Total vertical space allocated for a line, calculated from ascender + descender

These values are stored in **font units** relative to the EM square. When you set a font size of 36pt, CE.SDK scales these proportionally:

```
lineHeight = fontSize × (ascender + |descender|) / unitsPerEm × designUnitsPerPoint
```

## Design Units and Point Conversion

CE.SDK supports three design unit types. Font sizes are always specified in **typographic points** (72 pt = 1 inch), then converted:

| Design Unit | Conversion Factor | Example: 36pt Font |
|-------------|-------------------|-------------------|
| Millimeter | 25.4 / 72 ≈ 0.3528 mm/pt | ~12.7 mm line height |
| Inch | 1 / 72 ≈ 0.0139 in/pt | ~0.5 inch line height |
| Pixel | 1.0 (at 72 DPI) | 36 px line height |

Use `engine.scene.getDesignUnit()` to retrieve the current design unit for correct positioning.

## Line Height and the lineHeight Multiplier

The `text/lineHeight` property is a **multiplier** that controls spacing between lines. A value of 1.0 means lines touch (no gap); 2.0 doubles the spacing.

Ascender and descender heights are **constant** for a given font and size. The multiplier only affects the gap between lines—not the glyph regions themselves.

At `lineHeight = 1.0`:

- Line spacing equals the natural line height
- Lines touch with no gap

At `lineHeight = 2.0`:

- Line spacing doubles
- A gap appears between descender of one line and ascender of the next

## Line Breaks vs Paragraph Breaks

CE.SDK distinguishes between two types of line breaks, each with different spacing behavior:

| Break Type | Key | Character | Triggers Paragraph Spacing |
|------------|-----|-----------|---------------------------|
| **Paragraph Break** | Enter | `\n` (U+000A) | Yes |
| **Line Separator** | Shift+Enter | U+2028 | No |

When users press **Enter**, CE.SDK inserts a paragraph break (`\n`). This triggers paragraph spacing—extra vertical space controlled by the `text/paragraphSpacing` property.

When users press **Shift+Enter**, CE.SDK inserts a line separator (U+2028). This creates a new line but does **not** add paragraph spacing, keeping lines closer together within the same logical paragraph.

## Paragraph Spacing

The `text/paragraphSpacing` property controls extra space added after paragraph breaks. It's a **multiplier** applied to the line height:

```
paragraphGap = paragraphSpacing × lineHeight
```

This gap appears **only** after lines ending with `\n` (paragraph breaks), not after lines ending with U+2028 (line separators).

```typescript highlight-paragraph-spacing
    const paragraphSpacingMultiplier = engine.block.getFloat(
      textBlock,
      'text/paragraphSpacing'
    );
    const paragraphGap = paragraphSpacingMultiplier * lineHeight;

    const linesEndingWithParagraphBreak = this.findParagraphBreakLines(
      engine,
      textBlock,
      lineCount
    );
```

**Use cases**:

- Set `paragraphSpacing = 0` to have paragraph breaks behave like line breaks
- Set `paragraphSpacing = 0.5` for subtle paragraph separation
- Set `paragraphSpacing = 1.0` for full line spacing between paragraphs

## Why Fonts Look Different at the Same Size

Different fonts allocate the EM square differently. A serif font like Playfair Display may have taller ascenders than a sans-serif like Roboto, even at the same point size. Each typeface has unique proportions—this is normal.

## Troubleshooting Text Layout

**Text appears cut off**: Check if your text block's frame height is sufficient. Use `getTextVisibleLineCount()` to verify how many lines are rendering.

**Fonts look different sizes**: This is expected—fonts have different ascender/descender ratios. Set frames based on measured line heights rather than assumed pixel values.

**Text not aligning with other elements**: Different fonts have different baselines. For precise alignment, calculate baseline position using the font's ascender height.

**Line gap not appearing**: The gap only shows when `text/lineHeight > 1.0`. At 1.0, lines touch directly.

**Paragraph spacing not appearing after Shift+Enter**: Shift+Enter inserts a line separator (U+2028), not a paragraph break (`\n`). Only paragraph breaks trigger `text/paragraphSpacing`. Use Enter for paragraph breaks with extra spacing.

**How to insert a line break without paragraph spacing**: Use Shift+Enter to insert a line separator (U+2028). This creates a visual line break but keeps the content within the same paragraph, without triggering paragraph spacing.

## API Reference

| Method | Purpose |
|--------|---------|
| `engine.editor.getFontMetrics(fontUri)` | Get font metrics (ascender, descender, unitsPerEm) in font design units |
| `engine.scene.getDesignUnit()` | Get current design unit (Millimeter, Inch, or Pixel) |
| `engine.block.getTextFontSizes(id)` | Get current font sizes |
| `engine.block.getFloat(id, 'text/lineHeight')` | Get line height multiplier |
| `engine.block.getFloat(id, 'text/paragraphSpacing')` | Get paragraph spacing multiplier |
| `engine.block.getString(id, 'text/fontFileUri')` | Get current font file URI |
| `engine.block.getTextVisibleLineContent(id, lineIndex)` | Get rendered text content for a specific visual line |
| `engine.block.getTextVisibleLineCount(id)` | Get number of rendered text lines |
| `engine.block.getTextCharacterInkBoxes(id, from, to)` | Get tight ink bounding boxes per grapheme in global scene coordinates |
| `engine.block.getPositionX/Y(id)` | Get block position in design units |
| `engine.block.getFrameWidth/Height(id)` | Get block frame dimensions |
| `engine.asset.findAssets('ly.img.typeface', options)` | Query typeface asset source by name |



---

## More Resources

- **[Electron Documentation Index](https://img.ly/docs/cesdk/electron.md)** - Browse all Electron documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./electron.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support