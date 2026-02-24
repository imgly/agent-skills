> This is one page of the CE.SDK Nuxt.js documentation. For a complete overview, see the [Nuxt.js Documentation Index](https://img.ly/nuxtjs.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [User Interface](./user-interface.md) > [Customization](./user-interface/customization.md) > [Crop Presets](./user-interface/customization/crop-presets.md)

---

Customize crop presets to provide users with aspect ratio options tailored to your application's needs.

![Crop presets example showing custom aspect ratio options in the crop interface](https://img.ly/docs/cesdk/./assets/browser.hero.webp)

> **Reading time:** 5 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/heads/main.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/main/guides-crop-presets-browser)
>
> - [Open in StackBlitz](https://stackblitz.com/~/github.com/imgly/cesdk-web-examples/tree/main/guides-crop-presets-browser)
>
> - [Live demo](https://img.ly/examples/guides-crop-presets-browser/)

Crop presets define the aspect ratios and dimensions users can select when cropping images or pages. CE.SDK includes a default set of common ratios (1:1, 16:9, 4:3, etc.), and you can replace or extend these with custom presets through asset sources.

```javascript file=@cesdk_web_examples/guides-crop-presets-browser/index.js reference-only
import CreativeEditorSDK from '@cesdk/cesdk-js';

const config = {
  // license: import.meta.env.VITE_CESDK_LICENSE,
  userId: 'guides-user',
  // baseURL: `https://cdn.img.ly/packages/imgly/cesdk-js/${CreativeEditorSDK.version}/assets`,
  // Use local assets when developing with local packages
  ...(import.meta.env.CESDK_USE_LOCAL && {
    baseURL: import.meta.env.VITE_CESDK_ASSETS_BASE_URL
  }),
  ui: {
    stylesheets: {
      /* ... */
    },
    elements: {
      /* ... */
    }
  }
};

CreativeEditorSDK.create('#cesdk_container', config).then(async (instance) => {
  // Expose for hero image capture
  window.cesdk = instance;
  // Do something with the instance of CreativeEditor SDK
  // Set scale using the new API
  instance.ui.setScale('normal');
  // Populate the asset library with default / demo asset sources.
  instance.addDefaultAssetSources();
  instance.addDemoAssetSources({
    sceneMode: 'Design',
    withUploadAssetSources: true
  });

  // Add a custom crop preset asset source.
  instance.engine.asset.addLocalSource('my-custom-crop-presets');

  instance.engine.asset.addAssetToSource(
    'my-custom-crop-presets',
    {
      id: 'aspect-ratio-free',
      label: {
        en: 'Free'
      },
      meta: {
        width: 80,
        height: 120,
        thumbUri: `${window.location.protocol}//${window.location.host}/ratio-free.png`
      },
      payload: {
        transformPreset: {
          type: 'FreeAspectRatio'
        }
      }
    }
  );

  instance.engine.asset.addAssetToSource(
    'my-custom-crop-presets',
    {
      id: 'aspect-ratio-16-9',
      label: {
        en: '16:9'
      },
      meta: {
        width: 80,
        height: 120,
        thumbUri: `${window.location.protocol}//${window.location.host}/ratio-16-9.png`
      },
      payload: {
        transformPreset: {
          type: 'FixedAspectRatio',
          width: 16,
          height: 9
        }
      }
    }
  );

  instance.engine.asset.addAssetToSource(
    'my-custom-crop-presets',
    {
      id: 'din-a1-portrait',
      label: {
        en: 'DIN A1 Portrait'
      },
      meta: {
        width: 80,
        height: 120,
        thumbUri: `${window.location.protocol}//${window.location.host}/din-a1-portrait.png`
      },
      payload: {
        transformPreset: {
          type: 'FixedSize',
          width: 594,
          height: 841,
          designUnit: 'Millimeter'
        }
      }
    }
  );

  // Update crop presets library entry
  instance.ui.updateAssetLibraryEntry('ly.img.cropPresets', {
    sourceIds: [
      // 'ly.img.crop.presets',
      'my-custom-crop-presets'
    ]
  });

  await instance.actions.run('scene.create', {
    page: {
      sourceId: 'ly.img.page.presets',
      assetId: 'ly.img.page.presets.print.iso.a6.landscape'
    }
  });

  // Add an image and enable crop mode to show the presets
  const engine = instance.engine;
  const page = engine.scene.getCurrentPage();

  // Get page dimensions for relative sizing
  const pageWidth = engine.block.getWidth(page);
  const pageHeight = engine.block.getHeight(page);

  // Create an image block at ~50% of page size
  const imageBlock = engine.block.create('graphic');
  engine.block.appendChild(page, imageBlock);

  const rectShape = engine.block.createShape('rect');
  engine.block.setShape(imageBlock, rectShape);

  const imageWidth = pageWidth * 0.5;
  const imageHeight = pageHeight * 0.5;
  engine.block.setWidth(imageBlock, imageWidth);
  engine.block.setHeight(imageBlock, imageHeight);

  // Center the image on the page
  engine.block.setPositionX(imageBlock, (pageWidth - imageWidth) / 2);
  engine.block.setPositionY(imageBlock, (pageHeight - imageHeight) / 2);

  const imageFill = engine.block.createFill('image');
  engine.block.setString(
    imageFill,
    'fill/image/imageFileURI',
    'https://img.ly/static/ubq_samples/sample_1.jpg'
  );
  engine.block.setFill(imageBlock, imageFill);

  // Select the image and enter crop mode
  engine.block.select(imageBlock);
  engine.editor.setEditMode('Crop');
});
```

This guide covers how to use the built-in crop UI, understand default presets, create custom crop preset sources, and configure which presets appear in the interface.

## Using the Built-in Crop UI

The crop interface displays preset options when users enter crop mode. Presets appear as selectable thumbnails with aspect ratio labels. Users click a preset to constrain the crop frame to that ratio, or select the free preset for unconstrained cropping.

To enable the default crop presets, we load them using `addDefaultAssetSources()`:

```javascript
await instance.addDefaultAssetSources();
```

This loads the `ly.img.crop.presets` asset source, which contains common ratios including free, 1:1, 9:16, 16:9, 4:3, and others.

## Creating Custom Crop Preset Sources

We can define custom crop presets by [creating a local asset source](./import-media/from-remote-source/unsplash.md) and adding preset assets to it. Each preset requires a `payload.transformPreset` property that defines the crop behavior.

First, we create a local asset source to hold our custom presets:

```javascript
instance.engine.asset.addLocalSource('my-custom-crop-presets');
```

### Free Aspect Ratio

A free aspect ratio preset enables unconstrained cropping, allowing users to drag the crop frame sides independently.

```javascript highlight-crop-preset-free
{
  id: 'aspect-ratio-free',
  label: {
    en: 'Free'
  },
  meta: {
    width: 80,
    height: 120,
    thumbUri: `${window.location.protocol}//${window.location.host}/ratio-free.png`
  },
  payload: {
    transformPreset: {
      type: 'FreeAspectRatio'
    }
  }
}
```

The `type: 'FreeAspectRatio'` setting removes aspect ratio constraints from the crop frame.

### Fixed Aspect Ratio

A fixed aspect ratio preset constrains the crop frame to a specific ratio. When applied, the crop frame maintains the `width` to `height` proportion.

```javascript highlight-crop-preset-fixed-aspect
{
  id: 'aspect-ratio-16-9',
  label: {
    en: '16:9'
  },
  meta: {
    width: 80,
    height: 120,
    thumbUri: `${window.location.protocol}//${window.location.host}/ratio-16-9.png`
  },
  payload: {
    transformPreset: {
      type: 'FixedAspectRatio',
      width: 16,
      height: 9
    }
  }
}
```

The `width` and `height` values define the ratio (16:9 in this example), not absolute dimensions.

### Fixed Size

A fixed size preset sets exact pixel dimensions for the crop area. This resizes the selected block to match the specified `width` and `height`.

```javascript highlight-crop-preset-fixed-size
{
  id: 'din-a1-portrait',
  label: {
    en: 'DIN A1 Portrait'
  },
  meta: {
    width: 80,
    height: 120,
    thumbUri: `${window.location.protocol}//${window.location.host}/din-a1-portrait.png`
  },
  payload: {
    transformPreset: {
      type: 'FixedSize',
      width: 594,
      height: 841,
      designUnit: 'Millimeter'
    }
  }
}
```

The `designUnit` property specifies the measurement unit. Valid options are `'Pixel'`, `'Millimeter'`, or `'Inch'`.

## Configuring the Crop Presets Library

We control which presets appear in the crop interface by updating the `ly.img.cropPresets` asset library entry.

### Replace Default Presets

To show only custom presets, we set `sourceIds` to our custom source:

```javascript
instance.ui.updateAssetLibraryEntry('ly.img.cropPresets', {
  sourceIds: ['my-custom-crop-presets']
});
```

### Add Presets Alongside Defaults

To add custom presets while keeping the defaults, we use a callback to append our source:

```javascript
instance.ui.updateAssetLibraryEntry('ly.img.cropPresets', {
  sourceIds: ({ currentIds }) => [...currentIds, 'my-custom-crop-presets']
});
```

## Localization

Each preset requires a `label` object with at least an `en` key for the English label. You can add additional language keys for localization:

```javascript
label: {
  en: '16:9',
  de: '16:9'
}
```

## Troubleshooting

### Presets Not Appearing

Verify the asset source exists by checking registered sources:

```javascript
const sources = await instance.engine.asset.findAllSources();
console.log(sources); // Should include your custom source ID
```

### Invalid Preset Type

Ensure the `type` value is one of:

- `'FreeAspectRatio'` - for unconstrained cropping
- `'FixedAspectRatio'` - for ratio-locked cropping
- `'FixedSize'` - for exact dimension cropping

### Missing Labels

Each preset must have a `label` object. Missing labels cause presets to display without text.

## API Reference

| Method | Description |
|--------|-------------|
| `engine.asset.addLocalSource(sourceId)` | Create a local asset source for custom presets |
| `engine.asset.addAssetToSource(sourceId, asset)` | Add a crop preset asset to the source |
| `engine.asset.findAllSources()` | List all registered asset sources |
| `cesdk.ui.updateAssetLibraryEntry(entryId, config)` | Configure which sources appear in a library entry |
| `addDefaultAssetSources()` | Load default asset sources including crop presets |



---

## More Resources

- **[Nuxt.js Documentation Index](https://img.ly/nuxtjs.md)** - Browse all Nuxt.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./nuxtjs.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support