> This is one page of the CE.SDK React documentation. For a complete overview, see the [React Documentation Index](https://img.ly/react.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Rules](./rules.md) > [Moderate Content](./rules/moderate-content.md)

---

Use CE.SDK's engine APIs to extract images and text from designs, then integrate with third-party moderation services to detect inappropriate content.

> **Reading time:** 8 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/heads/main.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/main/guides-rules-moderate-content-browser)
>
> - [Open in StackBlitz](https://stackblitz.com/~/github.com/imgly/cesdk-web-examples/tree/main/guides-rules-moderate-content-browser)
>
> - [Live demo](https://img.ly/examples/guides-rules-moderate-content-browser/)

![Content moderation example showing a design with validation results panel displaying moderation checks for images and text](https://img.ly/docs/cesdk/./assets/browser.hero.webp)

CE.SDK does not provide prebuilt content moderation workflows. Instead, it provides powerful engine APIs that make it straightforward to extract images and text from designs for moderation by third-party services of your choice. This approach is intentional: content moderation requirements are highly specific to each business, including which categories to check, what thresholds to apply, and which services to use. Similarly, when and where to check content (during editing, before export, on upload) varies based on your workflow and user experience goals.

Content moderation helps maintain quality standards and comply with content policies. Unlike built-in validation rules that check technical aspects like resolution or layout, content moderation requires integration with external AI-powered services (Sightengine, AWS Rekognition, OpenAI Moderation API) to analyze visual content (images for weapons, drugs, nudity) and textual content (profanity, hate speech, threats).

```typescript file=@cesdk_web_examples/guides-rules-moderate-content-browser/browser.ts reference-only
import type {
  CreativeEngine,
  EditorPlugin,
  EditorPluginContext
} from '@cesdk/cesdk-js';
import packageJson from './package.json';

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

// Type definitions for content moderation
interface ImageBlockData {
  blockId: number;
  url: string;
  blockType: string;
  blockName: string;
}

interface TextBlockData {
  blockId: number;
  text: string;
  blockType: string;
  blockName: string;
}

interface ContentCategory {
  name: string;
  description: string;
  state: 'success' | 'warning' | 'failed';
}

interface ValidationResult extends ContentCategory {
  blockId: number;
  blockType: string;
  blockName: string;
  id: string;
  url?: string; // For image blocks
  text?: string; // For text blocks
}

// Mock moderation caches
const imageCache: Record<string, ContentCategory[]> = {};
const textCache: Record<string, ContentCategory[]> = {};

/**
 * CE.SDK Plugin: Content Moderation Guide
 *
 * Demonstrates implementing automated content moderation for both images and text
 */
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
      page: { width: 1200, height: 800, unit: 'Pixel' }
    });

    const engine = cesdk.engine;
    const page = engine.block.findByType('page')[0];

    const pageHeight = engine.block.getHeight(page);

    // Create a single sample image
    const imageWidth = 500;
    const imageHeight = 400;
    const imageUri = 'https://img.ly/static/ubq_samples/sample_1.jpg';

    const imageBlock = await engine.block.addImage(imageUri, {
      size: { width: imageWidth, height: imageHeight }
    });

    // Position image in center-left
    engine.block.setPositionX(imageBlock, 100);
    engine.block.setPositionY(imageBlock, (pageHeight - imageHeight) / 2);

    engine.block.appendChild(page, imageBlock);

    const textBlock = engine.block.create('text');
    engine.block.setString(
      textBlock,
      'text/text',
      'Sample text content for moderation testing'
    );

    // Position text on the right side of the image
    engine.block.setPositionX(textBlock, 650);
    engine.block.setPositionY(textBlock, (pageHeight - 120) / 2);
    engine.block.setWidth(textBlock, 450);
    engine.block.setHeight(textBlock, 120);

    // Make text larger and more readable
    engine.block.setFloat(textBlock, 'text/fontSize', 48);
    engine.block.setEnum(textBlock, 'text/horizontalAlignment', 'Left');

    engine.block.appendChild(page, textBlock);

    await this.demonstrateContentModeration(engine);

    // Zoom to fit the entire page in the viewport
    await engine.scene.zoomToBlock(page, {
      padding: {
        left: 40,
        top: 40,
        right: 40,
        bottom: 40
      }
    });
  }

  private async demonstrateContentModeration(
    engine: CreativeEngine
  ): Promise<void> {
    // Check both images and text
    const imageResults = await this.checkImageContent(engine);
    const textResults = await this.checkTextContent(engine);
    const allResults = [...imageResults, ...textResults];

    // eslint-disable-next-line no-console
    console.log(`Total moderation checks: ${allResults.length}`);

    const failed = allResults.filter((r) => r.state === 'failed');
    const warnings = allResults.filter((r) => r.state === 'warning');
    const passed = allResults.filter((r) => r.state === 'success');

    // eslint-disable-next-line no-console
    console.log('Validation Summary:');
    // eslint-disable-next-line no-console
    console.log(`  Violations: ${failed.length}`);
    // eslint-disable-next-line no-console
    console.log(`  Warnings: ${warnings.length}`);
    // eslint-disable-next-line no-console
    console.log(`  Passed: ${passed.length}`);

    if (failed.length > 0) {
      const blockToSelect = failed[0].blockId;
      engine.block
        .findAllSelected()
        .forEach((id) => engine.block.setSelected(id, false));
      engine.block.setSelected(blockToSelect, true);
    }
  }

  /**
   * Extracts the image URL from a block's fill property
   */
  private getImageUrl(engine: CreativeEngine, blockId: number): string | null {
    try {
      const imageFill = engine.block.getFill(blockId);

      const fillImageURI = engine.block.getString(
        imageFill,
        'fill/image/imageFileURI'
      );
      if (fillImageURI) {
        return fillImageURI;
      }

      const sourceSet = engine.block.getSourceSet(
        imageFill,
        'fill/image/sourceSet'
      );
      if (sourceSet && sourceSet.length > 0) {
        return sourceSet[0].uri;
      }

      return null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Extracts text content from a text block
   */
  private getTextContent(engine: CreativeEngine, blockId: number): string {
    try {
      return engine.block.getString(blockId, 'text/text');
    } catch (error) {
      return '';
    }
  }

  /**
   * Checks all images in the design for inappropriate content
   */
  private async checkImageContent(
    engine: CreativeEngine
  ): Promise<ValidationResult[]> {
    const imageBlockIds = engine.block.findByKind('image');
    const imageBlocksData: ImageBlockData[] = imageBlockIds
      .map((blockId) => ({
        blockId,
        url: this.getImageUrl(engine, blockId),
        blockType: engine.block.getType(blockId),
        blockName: engine.block.getName(blockId)
      }))
      .filter((data) => data.url !== null) as ImageBlockData[];

    const imagesWithValidity = await Promise.all(
      imageBlocksData.map(async (imageBlockData) => {
        const categories = await this.checkImageContentAPI(imageBlockData.url);

        return categories.map((checkResult) => ({
          ...checkResult,
          blockId: imageBlockData.blockId,
          blockType: imageBlockData.blockType,
          blockName: imageBlockData.blockName,
          url: imageBlockData.url,
          id: `${imageBlockData.blockId}-${checkResult.name}`
        }));
      })
    );

    return imagesWithValidity.flat();
  }

  /**
   * Checks all text blocks in the design for inappropriate content
   */
  private async checkTextContent(
    engine: CreativeEngine
  ): Promise<ValidationResult[]> {
    const textBlockIds = engine.block.findByType('//ly.img.ubq/text');
    const textBlocksData: TextBlockData[] = textBlockIds
      .map((blockId) => ({
        blockId,
        text: this.getTextContent(engine, blockId),
        blockType: engine.block.getType(blockId),
        blockName: engine.block.getName(blockId)
      }))
      .filter((data) => data.text.trim().length > 0);

    const textsWithValidity = await Promise.all(
      textBlocksData.map(async (textBlockData) => {
        const categories = await this.checkTextContentAPI(textBlockData.text);

        return categories.map((checkResult) => ({
          ...checkResult,
          blockId: textBlockData.blockId,
          blockType: textBlockData.blockType,
          blockName: textBlockData.blockName,
          text: textBlockData.text,
          id: `${textBlockData.blockId}-${checkResult.name}`
        }));
      })
    );

    return textsWithValidity.flat();
  }

  /**
   * Simulates an image content moderation API call
   */
  private async checkImageContentAPI(url: string): Promise<ContentCategory[]> {
    if (imageCache[url]) {
      return imageCache[url];
    }

    await new Promise((resolve) => setTimeout(resolve, 100));

    const results: ContentCategory[] = [
      {
        name: 'Weapons',
        description: 'Handguns, rifles, machine guns, threatening knives',
        state: this.percentageToState(Math.random() * 0.3)
      },
      {
        name: 'Alcohol',
        description: 'Wine, beer, cocktails, champagne',
        state: this.percentageToState(Math.random() * 0.4)
      },
      {
        name: 'Drugs',
        description: 'Cannabis, syringes, glass pipes, bongs, pills',
        state: this.percentageToState(Math.random() * 0.2)
      },
      {
        name: 'Nudity',
        description: 'Raw or partial nudity',
        state: this.percentageToState(Math.random() * 0.3)
      }
    ];

    imageCache[url] = results;
    return results;
  }

  /**
   * Simulates a text content moderation API call
   */
  private async checkTextContentAPI(text: string): Promise<ContentCategory[]> {
    if (textCache[text]) {
      return textCache[text];
    }

    await new Promise((resolve) => setTimeout(resolve, 100));

    const results: ContentCategory[] = [
      {
        name: 'Profanity',
        description: 'Offensive or vulgar language',
        state: this.percentageToState(Math.random() * 0.3)
      },
      {
        name: 'Hate Speech',
        description: 'Content promoting hatred or discrimination',
        state: this.percentageToState(Math.random() * 0.2)
      },
      {
        name: 'Threats',
        description: 'Threatening or violent language',
        state: this.percentageToState(Math.random() * 0.1)
      }
    ];

    textCache[text] = results;
    return results;
  }

  /**
   * Maps confidence scores to validation states
   */
  private percentageToState(
    percentage: number
  ): 'success' | 'warning' | 'failed' {
    if (percentage > 0.8) {
      return 'failed';
    } else if (percentage > 0.4) {
      return 'warning';
    } else {
      return 'success';
    }
  }
}

export default Example;
```

This guide demonstrates how to use CE.SDK's engine APIs to find and extract content from designs, send it to moderation APIs, and display validation results.

## Finding Content in Designs

Locate all images and text blocks, then extract the data needed for moderation.

**Images**: Use `findByKind('image')` to find image blocks, then extract URLs from fill properties:

```typescript highlight-get-image-url
  /**
   * Extracts the image URL from a block's fill property
   */
  private getImageUrl(engine: CreativeEngine, blockId: number): string | null {
    try {
      const imageFill = engine.block.getFill(blockId);

      const fillImageURI = engine.block.getString(
        imageFill,
        'fill/image/imageFileURI'
      );
      if (fillImageURI) {
        return fillImageURI;
      }

      const sourceSet = engine.block.getSourceSet(
        imageFill,
        'fill/image/sourceSet'
      );
      if (sourceSet && sourceSet.length > 0) {
        return sourceSet[0].uri;
      }

      return null;
    } catch (error) {
      return null;
    }
  }
```

Process all images by checking each URL against the moderation API:

```typescript highlight-check-all-images
  /**
   * Checks all images in the design for inappropriate content
   */
  private async checkImageContent(
    engine: CreativeEngine
  ): Promise<ValidationResult[]> {
    const imageBlockIds = engine.block.findByKind('image');
    const imageBlocksData: ImageBlockData[] = imageBlockIds
      .map((blockId) => ({
        blockId,
        url: this.getImageUrl(engine, blockId),
        blockType: engine.block.getType(blockId),
        blockName: engine.block.getName(blockId)
      }))
      .filter((data) => data.url !== null) as ImageBlockData[];

    const imagesWithValidity = await Promise.all(
      imageBlocksData.map(async (imageBlockData) => {
        const categories = await this.checkImageContentAPI(imageBlockData.url);

        return categories.map((checkResult) => ({
          ...checkResult,
          blockId: imageBlockData.blockId,
          blockType: imageBlockData.blockType,
          blockName: imageBlockData.blockName,
          url: imageBlockData.url,
          id: `${imageBlockData.blockId}-${checkResult.name}`
        }));
      })
    );

    return imagesWithValidity.flat();
  }
```

**Text**: Use `findByType('//ly.img.ubq/text')` to find text blocks, then extract content using `getString()`:

```typescript highlight-get-text-content
/**
 * Extracts text content from a text block
 */
private getTextContent(engine: CreativeEngine, blockId: number): string {
  try {
    return engine.block.getString(blockId, 'text/text');
  } catch (error) {
    return '';
  }
}
```

Process all text blocks by checking each text string against the moderation API:

```typescript highlight-check-all-text
  /**
   * Checks all text blocks in the design for inappropriate content
   */
  private async checkTextContent(
    engine: CreativeEngine
  ): Promise<ValidationResult[]> {
    const textBlockIds = engine.block.findByType('//ly.img.ubq/text');
    const textBlocksData: TextBlockData[] = textBlockIds
      .map((blockId) => ({
        blockId,
        text: this.getTextContent(engine, blockId),
        blockType: engine.block.getType(blockId),
        blockName: engine.block.getName(blockId)
      }))
      .filter((data) => data.text.trim().length > 0);

    const textsWithValidity = await Promise.all(
      textBlocksData.map(async (textBlockData) => {
        const categories = await this.checkTextContentAPI(textBlockData.text);

        return categories.map((checkResult) => ({
          ...checkResult,
          blockId: textBlockData.blockId,
          blockType: textBlockData.blockType,
          blockName: textBlockData.blockName,
          text: textBlockData.text,
          id: `${textBlockData.blockId}-${checkResult.name}`
        }));
      })
    );

    return textsWithValidity.flat();
  }
```

Both processes use `Promise.all()` to handle multiple items concurrently.

## Integrating Moderation APIs

Integrate external AI services (Sightengine, AWS Rekognition, OpenAI Moderation API) to analyze content. Always proxy API requests through your backend to protect credentials.

**Image Moderation** — This example shows a simulated API call that you'll replace with your actual moderation service. The function returns content categories with confidence scores:

```typescript highlight-image-moderation-api
  /**
   * Simulates an image content moderation API call
   */
  private async checkImageContentAPI(url: string): Promise<ContentCategory[]> {
    if (imageCache[url]) {
      return imageCache[url];
    }

    await new Promise((resolve) => setTimeout(resolve, 100));

    const results: ContentCategory[] = [
      {
        name: 'Weapons',
        description: 'Handguns, rifles, machine guns, threatening knives',
        state: this.percentageToState(Math.random() * 0.3)
      },
      {
        name: 'Alcohol',
        description: 'Wine, beer, cocktails, champagne',
        state: this.percentageToState(Math.random() * 0.4)
      },
      {
        name: 'Drugs',
        description: 'Cannabis, syringes, glass pipes, bongs, pills',
        state: this.percentageToState(Math.random() * 0.2)
      },
      {
        name: 'Nudity',
        description: 'Raw or partial nudity',
        state: this.percentageToState(Math.random() * 0.3)
      }
    ];

    imageCache[url] = results;
    return results;
  }
```

In production, replace the simulated logic with a real API call to your backend endpoint that proxies requests to services like Sightengine or AWS Rekognition.

**Text Moderation** — Similar to image moderation, this simulates an API call that checks text content. Replace this with your actual text moderation service:

```typescript highlight-text-moderation-api
  /**
   * Simulates a text content moderation API call
   */
  private async checkTextContentAPI(text: string): Promise<ContentCategory[]> {
    if (textCache[text]) {
      return textCache[text];
    }

    await new Promise((resolve) => setTimeout(resolve, 100));

    const results: ContentCategory[] = [
      {
        name: 'Profanity',
        description: 'Offensive or vulgar language',
        state: this.percentageToState(Math.random() * 0.3)
      },
      {
        name: 'Hate Speech',
        description: 'Content promoting hatred or discrimination',
        state: this.percentageToState(Math.random() * 0.2)
      },
      {
        name: 'Threats',
        description: 'Threatening or violent language',
        state: this.percentageToState(Math.random() * 0.1)
      }
    ];

    textCache[text] = results;
    return results;
  }
```

In production, replace the simulation with calls to services like OpenAI Moderation API or Perspective API through your backend.

**Processing Results**: Map confidence scores to severity levels (failed > 0.8, warning > 0.4, success ≤ 0.4):

```typescript highlight-threshold-mapping
/**
 * Maps confidence scores to validation states
 */
private percentageToState(
  percentage: number
): 'success' | 'warning' | 'failed' {
  if (percentage > 0.8) {
    return 'failed';
  } else if (percentage > 0.4) {
    return 'warning';
  } else {
    return 'success';
  }
}
```

Implement caching to avoid redundant API calls for the same content.

## Displaying Validation Results

Group results by severity (failed, warning, success) and display them in the UI:

```typescript highlight-display-results
    const failed = allResults.filter((r) => r.state === 'failed');
    const warnings = allResults.filter((r) => r.state === 'warning');
    const passed = allResults.filter((r) => r.state === 'success');

    // eslint-disable-next-line no-console
    console.log('Validation Summary:');
    // eslint-disable-next-line no-console
    console.log(`  Violations: ${failed.length}`);
    // eslint-disable-next-line no-console
    console.log(`  Warnings: ${warnings.length}`);
    // eslint-disable-next-line no-console
    console.log(`  Passed: ${passed.length}`);
```

Make results interactive by selecting the corresponding block when users click on a validation result:

```typescript highlight-interactive-results
if (failed.length > 0) {
  const blockToSelect = failed[0].blockId;
  engine.block
    .findAllSelected()
    .forEach((id) => engine.block.setSelected(id, false));
  engine.block.setSelected(blockToSelect, true);
}
```

## Integration Points

Choose when to run validation based on your workflow:

**Export Validation** — Validate when users export designs using `registerAction`:

```typescript
cesdk.ui.registerAction('ly.img.export', async (engine) => {
  const imageResults = await checkImageContent(engine);
  const textResults = await checkTextContent(engine);
  const violations = [...imageResults, ...textResults].filter((r) => r.state === 'failed');

  if (violations.length > 0) {
    alert(`Cannot export: ${violations.length} policy violation(s) detected.`);
    return;
  }

  const blob = await engine.block.export(engine.scene.get(), 'image/png');
  downloadBlob(blob, 'design.png');
});
```

**Other Integration Points**:

- Pre-upload validation: Check before allowing uploads to your platform
- Review queue: Flag designs with warnings for manual review
- Batch validation: Check all content on-demand when users click a button

## Best Practices

**Security**: Always proxy API requests through your backend to protect credentials. Implement rate limiting and authentication.

**Performance**: Cache results by URL/text to avoid redundant calls. Process items in parallel with `Promise.all()`.

**User Experience**: Run checks asynchronously without blocking the UI. Provide clear error messages and interactive results.

**Timing**: Validate at export time for the best balance between policy enforcement and creative freedom.

## Troubleshooting

**Checks not running**: Verify engine is initialized, content exists, API endpoint is reachable, and credentials are valid.

**Content not found**: Ensure blocks have correct kind/type, images have fills, text blocks aren't empty, and scene has loaded.

**API errors**: Check API key validity, endpoint URL, image URL accessibility, rate limits, and service-specific error codes.

**Inconsistent results**: Verify caching works correctly, threshold values are appropriate, and API responses parse correctly.

## API Reference

**Finding Content**:

- `engine.block.findByKind('image')` — Find all image blocks
- `engine.block.findByType('//ly.img.ubq/text')` — Find all text blocks

**Getting Data**:

- `engine.block.getFill(blockId)` — Get fill object for image
- `engine.block.getString(id, 'text/text')` — Get text content
- `engine.block.getString(fill, 'fill/image/imageFileURI')` — Get image URL
- `engine.block.getSourceSet(fill, 'fill/image/sourceSet')` — Get image source set

**Selection**:

- `engine.block.setSelected(id, bool)` — Select or deselect a block
- `engine.block.findAllSelected()` — Get currently selected blocks

## Next Steps

Now that you understand content moderation, explore related validation features:

- [Rules Overview](./rules/overview.md) — Learn about CE.SDK's comprehensive validation system



---

## More Resources

- **[React Documentation Index](https://img.ly/react.md)** - Browse all React documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./react.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support