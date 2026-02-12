> This is one page of the CE.SDK Svelte documentation. For a complete overview, see the [Svelte Documentation Index](https://img.ly/svelte.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [User Interface](./user-interface.md) > [Customization](./user-interface/customization.md) > [Force Crop](./user-interface/customization/force-crop.md)

---

Programmatically apply crop presets to enforce specific aspect ratios or dimensions on design blocks using the `applyForceCrop` API.

![Force Crop example showing CE.SDK with crop mode active](https://img.ly/docs/cesdk/./assets/browser.hero.webp)

> **Reading time:** 8 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/heads/main.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples)
>
> - [Open in StackBlitz](https://stackblitz.com/~/github.com/imgly/cesdk-web-examples)
>
> - [Live demo](https://img.ly/examples/guides-user-interface-customization-force-crop-browser/)

The `applyForceCrop` API lets you enforce specific dimensions or aspect ratios on blocks that support cropping. This is useful when building integrations that require content to match specific formats, such as Instagram portrait posts, LinkedIn profile photos, or Facebook shared images. You can control whether the crop UI appears after applying a preset through three different modes.

```typescript file=@cesdk_web_examples/guides-user-interface-customization-force-crop-browser/browser.ts reference-only
import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';
import packageJson from './package.json';

class Example implements EditorPlugin {
  name = packageJson.name;
  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    const engine = cesdk.engine;

    // Load assets and create scene
    await cesdk.addDefaultAssetSources();
    await cesdk.addDemoAssetSources({
      sceneMode: 'Design',
      withUploadAssetSources: true
    });
    await cesdk.createDesignScene();

    const page = engine.block.findByType('page')[0];

    // Set page dimensions
    engine.block.setWidth(page, 800);
    engine.block.setHeight(page, 600);

    // Add an image to demonstrate force crop
    const imageUri = 'https://img.ly/static/ubq_samples/sample_1.jpg';
    const imageBlock = await engine.block.addImage(imageUri);
    engine.block.appendChild(page, imageBlock);

    // Position and size the image to fill the page
    engine.block.setWidth(imageBlock, 800);
    engine.block.setHeight(imageBlock, 600);
    engine.block.setPositionX(imageBlock, 0);
    engine.block.setPositionY(imageBlock, 0);

    // Create a custom crop preset with a fixed aspect ratio (4:5 for portrait)
    engine.asset.addAssetToSource('ly.img.crop.presets', {
      id: 'instagram-portrait',
      label: { en: 'Portrait Post (4:5)' },
      payload: {
        transformPreset: {
          type: 'FixedAspectRatio',
          width: 4,
          height: 5,
          designUnit: 'Pixel'
        }
      }
    });

    // Create a custom crop preset with fixed dimensions
    engine.asset.addAssetToSource('ly.img.crop.presets', {
      id: 'profile-photo',
      label: { en: 'Profile Photo (400x400)' },
      payload: {
        transformPreset: {
          type: 'FixedSize',
          width: 400,
          height: 400,
          designUnit: 'Pixel'
        }
      }
    });

    // Select the image block to demonstrate force crop
    engine.block.select(imageBlock);

    // Apply force crop with 'ifNeeded' mode
    // This will only enter crop mode if dimensions differ from target
    await cesdk.ui.applyForceCrop(imageBlock, {
      sourceId: 'ly.img.crop.presets',
      presetId: 'instagram-portrait',
      mode: 'ifNeeded'
    });

    // If Needed mode - only enters crop mode when dimensions differ
    // await cesdk.ui.applyForceCrop(imageBlock, {
    //   sourceId: 'ly.img.crop.presets',
    //   presetId: 'instagram-portrait',
    //   mode: 'ifNeeded'
    // });

    // Example of silent mode - applies crop without showing UI
    // await cesdk.ui.applyForceCrop(imageBlock, {
    //   sourceId: 'ly.img.crop.presets',
    //   presetId: 'profile-photo',
    //   mode: 'silent'
    // });

    // Example of always mode - always enters crop mode
    // await cesdk.ui.applyForceCrop(imageBlock, {
    //   sourceId: 'ly.img.crop.presets',
    //   presetId: 'instagram-portrait',
    //   mode: 'always'
    // });

    console.log('Force crop example loaded successfully!');
  }
}

export default Example;
```

This guide covers how to apply crop presets programmatically, create custom presets with fixed aspect ratios or dimensions, and control the crop mode behavior.

## Applying a Crop Preset

The `cesdk.ui.applyForceCrop()` method takes a block ID and an options object containing `sourceId`, `presetId`, and `mode`. The `sourceId` identifies the asset source containing crop presets, `presetId` specifies which preset to apply, and `mode` determines whether the crop UI appears.

```typescript highlight=highlight-apply-force-crop
// Apply force crop with 'ifNeeded' mode
// This will only enter crop mode if dimensions differ from target
await cesdk.ui.applyForceCrop(imageBlock, {
  sourceId: 'ly.img.crop.presets',
  presetId: 'instagram-portrait',
  mode: 'ifNeeded'
});
```

CE.SDK ships with default crop presets in the `ly.img.crop.presets` source. Common ratios like 1:1, 4:3, and 16:9 are available without additional configuration.

## Creating Custom Crop Presets

You can create custom crop presets by adding assets to the `ly.img.crop.presets` source using `engine.asset.addAssetToSource()`. Two preset types are available: fixed aspect ratio and fixed size.

### Fixed Aspect Ratio Presets

Fixed aspect ratio presets maintain a ratio but allow flexible dimensions. Set `type: 'FixedAspectRatio'` with width and height values representing the ratio.

```typescript highlight=highlight-custom-preset
// Create a custom crop preset with a fixed aspect ratio (4:5 for portrait)
engine.asset.addAssetToSource('ly.img.crop.presets', {
  id: 'instagram-portrait',
  label: { en: 'Portrait Post (4:5)' },
  payload: {
    transformPreset: {
      type: 'FixedAspectRatio',
      width: 4,
      height: 5,
      designUnit: 'Pixel'
    }
  }
});
```

### Fixed Size Presets

Fixed size presets enforce exact pixel dimensions. Set `type: 'FixedSize'` with specific width and height values.

```typescript highlight=highlight-fixed-size-preset
// Create a custom crop preset with fixed dimensions
engine.asset.addAssetToSource('ly.img.crop.presets', {
  id: 'profile-photo',
  label: { en: 'Profile Photo (400x400)' },
  payload: {
    transformPreset: {
      type: 'FixedSize',
      width: 400,
      height: 400,
      designUnit: 'Pixel'
    }
  }
});
```

## Understanding Crop Modes

The `mode` parameter controls how the editor responds after applying a crop preset.

### Silent Mode

Silent mode applies the crop without any UI feedback. The editor remains in its current mode. Use this for batch operations or when cropping should be invisible to the user.

```typescript highlight=highlight-silent-mode
// Example of silent mode - applies crop without showing UI
// await cesdk.ui.applyForceCrop(imageBlock, {
//   sourceId: 'ly.img.crop.presets',
//   presetId: 'profile-photo',
//   mode: 'silent'
// });
```

### Always Mode

Always mode applies the crop and opens crop mode for user adjustment. Dimension inputs are hidden to prevent changing the preset.

```typescript highlight=highlight-always-mode
// Example of always mode - always enters crop mode
// await cesdk.ui.applyForceCrop(imageBlock, {
//   sourceId: 'ly.img.crop.presets',
//   presetId: 'instagram-portrait',
//   mode: 'always'
// });
```

### If Needed Mode

If needed mode applies the crop only if dimensions differ from the target. The crop mode opens only when changes occur. This prevents unnecessary user interaction when content already fits the required dimensions.

```typescript highlight=highlight-if-needed-mode
// If Needed mode - only enters crop mode when dimensions differ
// await cesdk.ui.applyForceCrop(imageBlock, {
//   sourceId: 'ly.img.crop.presets',
//   presetId: 'instagram-portrait',
//   mode: 'ifNeeded'
// });
```

## Applying Force Crop to Pages

When applying force crop to page blocks, the API automatically enables page resize interaction during the operation. In `silent` mode, resize interaction is disabled after completion. In `always` and `ifNeeded` modes, it remains enabled while crop mode is open.

## API Reference

| Method | Description |
| ------ | ----------- |
| `cesdk.ui.applyForceCrop(blockId, options)` | Apply a crop preset to a block |
| `engine.asset.addAssetToSource(sourceId, asset)` | Add an asset to a source |
| `engine.asset.findAllSources()` | List available asset sources |
| `engine.block.supportsCrop(blockId)` | Check if block supports cropping |



---

## More Resources

- **[Svelte Documentation Index](https://img.ly/svelte.md)** - Browse all Svelte documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./svelte.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support