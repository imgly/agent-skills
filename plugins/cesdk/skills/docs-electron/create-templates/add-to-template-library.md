> This is one page of the CE.SDK Electron documentation. For a complete overview, see the [Electron Documentation Index](https://img.ly/electron.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Create and Use Templates](./create-templates.md) > [Add to Template Library](./create-templates/add-to-template-library.md)

---

Create a template library where users can browse, preview, and apply templates from a custom asset source.

![Add to Template Library](https://img.ly/docs/cesdk/./assets/browser.hero.webp)

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/heads/main.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/main/guides-create-templates-add-to-template-library-browser)
>
> - [Open in StackBlitz](https://stackblitz.com/~/github.com/imgly/cesdk-web-examples/tree/main/guides-create-templates-add-to-template-library-browser)
>
> - [Live demo](https://img.ly/examples/guides-create-templates-add-to-template-library-browser/)

Templates in CE.SDK are stored and accessed through the asset system. A template library is a local asset source configured to hold and serve template assets, allowing users to browse thumbnails and apply templates to their designs.

```typescript file=@cesdk_web_examples/guides-create-templates-add-to-template-library-browser/browser.ts reference-only
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

/**
 * CE.SDK Plugin: Add to Template Library
 *
 * This example demonstrates how to create a template library by:
 * 1. Creating a local asset source for templates
 * 2. Adding templates with metadata (label, thumbnail, URI)
 * 3. Configuring the UI to display the template library
 * 4. Saving scenes as templates
 */
class Example implements EditorPlugin {
  name = packageJson.name;

  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    const engine = cesdk.engine;

    // Create a local asset source for templates
    engine.asset.addLocalSource('my-templates', undefined, async (asset) => {
      // Apply the selected template to the current scene
      await engine.scene.applyTemplateFromURL(asset.meta!.uri as string);
      // Set zoom to auto-fit after applying template
      await cesdk.actions.run('zoom.toPage', { autoFit: true });
      return undefined;
    });

    // Add a template to the source with metadata
    engine.asset.addAssetToSource('my-templates', {
      id: 'template-postcard',
      label: { en: 'Postcard' },
      meta: {
        uri: 'https://cdn.img.ly/assets/demo/v3/ly.img.template/templates/cesdk_postcard_1.scene',
        thumbUri:
          'https://cdn.img.ly/assets/demo/v3/ly.img.template/thumbnails/cesdk_postcard_1.jpg'
      }
    });

    // Add more templates
    engine.asset.addAssetToSource('my-templates', {
      id: 'template-business-card',
      label: { en: 'Business Card' },
      meta: {
        uri: 'https://cdn.img.ly/assets/demo/v3/ly.img.template/templates/cesdk_business_card_1.scene',
        thumbUri:
          'https://cdn.img.ly/assets/demo/v3/ly.img.template/thumbnails/cesdk_business_card_1.jpg'
      }
    });

    engine.asset.addAssetToSource('my-templates', {
      id: 'template-social-media',
      label: { en: 'Social Media Post' },
      meta: {
        uri: 'https://cdn.img.ly/assets/demo/v3/ly.img.template/templates/cesdk_instagram_post_1.scene',
        thumbUri:
          'https://cdn.img.ly/assets/demo/v3/ly.img.template/thumbnails/cesdk_instagram_post_1.jpg'
      }
    });

    // Add translation for the library entry
    cesdk.i18n.setTranslations({
      en: { 'libraries.my-templates-entry.label': 'My Templates' }
    });

    // Add the template source to the asset library
    cesdk.ui.addAssetLibraryEntry({
      id: 'my-templates-entry',
      sourceIds: ['my-templates'],
      sceneMode: 'Design',
      previewLength: 3,
      previewBackgroundType: 'cover',
      gridBackgroundType: 'cover',
      gridColumns: 2,
      cardLabelPosition: () => 'below'
    });

    // Add template library to the dock
    cesdk.ui.setComponentOrder({ in: 'ly.img.dock' }, [
      ...cesdk.ui.getComponentOrder({ in: 'ly.img.dock' }),
      'ly.img.spacer',
      {
        id: 'ly.img.assetLibrary.dock',
        key: 'my-templates-dock',
        label: 'My Templates',
        icon: '@imgly/Template',
        entries: ['my-templates-entry']
      }
    ]);

    // Load the first template
    await engine.scene.loadFromURL(
      'https://cdn.img.ly/assets/demo/v3/ly.img.template/templates/cesdk_postcard_1.scene'
    );

    // Set zoom to auto-fit
    await cesdk.actions.run('zoom.toPage', { autoFit: true });

    // Open the template library panel by default
    cesdk.ui.openPanel('//ly.img.panel/assetLibrary', {
      payload: { entries: ['my-templates-entry'] }
    });

    // Save as string format (lightweight, references remote assets)
    const templateString = await engine.scene.saveToString();
    console.log('Template saved as string. Length:', templateString.length);

    // Save as archive format (self-contained with bundled assets)
    const templateBlob = await engine.scene.saveToArchive();
    console.log('Template saved as archive. Size:', templateBlob.size, 'bytes');

    // List all registered asset sources
    const sources = engine.asset.findAllSources();
    console.log('Registered sources:', sources);

    // Notify UI when source contents change
    engine.asset.assetSourceContentsChanged('my-templates');

    // Query templates from the source
    const queryResult = await engine.asset.findAssets('my-templates', {
      page: 0,
      perPage: 10
    });
    console.log('Templates in library:', queryResult.total);

    // Remove a template from the source
    engine.asset.removeAssetFromSource('my-templates', 'template-social-media');
    console.log('Removed template-social-media from library');

    cesdk.ui.insertOrderComponent({ in: 'ly.img.navigation.bar', position: 'end' }, {
      id: 'ly.img.actions.navigationBar',
      children: [
        'ly.img.saveScene.navigationBar',
        'ly.img.exportArchive.navigationBar'
      ]
    });
  }
}

export default Example;
```

This guide covers how to save scenes as templates, create a template asset source, and add templates with metadata.

## Saving Templates

Scenes can be exported in two formats for use as templates.

### String Format

Use `engine.scene.saveToString()` to serialize the scene to a base64 string. This lightweight format references remote assets by URL and is ideal for templates where assets are hosted on a CDN.

```typescript highlight=highlight-save-string
// Save as string format (lightweight, references remote assets)
const templateString = await engine.scene.saveToString();
console.log('Template saved as string. Length:', templateString.length);
```

### Archive Format

For self-contained templates that bundle all assets, use `engine.scene.saveToArchive()`. This returns a Blob containing all assets bundled together, making templates portable without external dependencies.

```typescript highlight=highlight-save-archive
// Save as archive format (self-contained with bundled assets)
const templateBlob = await engine.scene.saveToArchive();
console.log('Template saved as archive. Size:', templateBlob.size, 'bytes');
```

## Creating a Template Asset Source

Register a local asset source using `engine.asset.addLocalSource()` with an ID and `applyAsset` callback.

```typescript highlight=highlight-create-source
// Create a local asset source for templates
engine.asset.addLocalSource('my-templates', undefined, async (asset) => {
  // Apply the selected template to the current scene
  await engine.scene.applyTemplateFromURL(asset.meta!.uri as string);
  // Set zoom to auto-fit after applying template
  await cesdk.actions.run('zoom.toPage', { autoFit: true });
  return undefined;
});
```

The `applyAsset` callback receives the selected asset and determines how to apply it. We use `engine.scene.applyTemplateFromURL()` to load the template from the asset's `meta.uri` property. The template is applied to the current scene, adjusting content to fit the existing page dimensions.

## Adding Templates to the Source

Register templates using `engine.asset.addAssetToSource()` with an asset definition that includes metadata for display and loading.

```typescript highlight=highlight-add-templates
// Add a template to the source with metadata
engine.asset.addAssetToSource('my-templates', {
  id: 'template-postcard',
  label: { en: 'Postcard' },
  meta: {
    uri: 'https://cdn.img.ly/assets/demo/v3/ly.img.template/templates/cesdk_postcard_1.scene',
    thumbUri:
      'https://cdn.img.ly/assets/demo/v3/ly.img.template/thumbnails/cesdk_postcard_1.jpg'
  }
});
```

Each template asset requires:

- `id` - Unique identifier for the template
- `label` - Localized display name shown in the template library
- `meta.uri` - URL to the `.scene` file that will be loaded when the template is selected
- `meta.thumbUri` - URL to a preview image displayed in the template library grid

## Managing Templates

After the initial setup, you can manage templates programmatically.

```typescript highlight=highlight-manage-templates
    // List all registered asset sources
    const sources = engine.asset.findAllSources();
    console.log('Registered sources:', sources);

    // Notify UI when source contents change
    engine.asset.assetSourceContentsChanged('my-templates');

    // Query templates from the source
    const queryResult = await engine.asset.findAssets('my-templates', {
      page: 0,
      perPage: 10
    });
    console.log('Templates in library:', queryResult.total);

    // Remove a template from the source
    engine.asset.removeAssetFromSource('my-templates', 'template-social-media');
    console.log('Removed template-social-media from library');
```

Use `engine.asset.findAllSources()` to list registered sources. When you add or remove templates from a source, call `engine.asset.assetSourceContentsChanged()` to refresh the UI. To remove a template, use `engine.asset.removeAssetFromSource()`.

## Troubleshooting

| Issue | Cause | Solution |
|-------|-------|----------|
| Templates not appearing in UI | Asset source not added to library entry | Ensure `sourceIds` includes the template source ID |
| Template fails to load | Incorrect URI in asset meta | Verify the `uri` points to a valid `.scene` file |
| Thumbnails not displaying | Missing or incorrect `thumbUri` | Check the thumbnail URL is accessible |
| Apply callback not triggered | `applyAsset` not defined in `addLocalSource` | Provide the callback when creating the source |

## API Reference

| Method | Description |
| --- | --- |
| `engine.asset.addLocalSource()` | Register a local asset source with an apply callback |
| `engine.asset.addAssetToSource()` | Add an asset to a registered source |
| `engine.asset.removeAssetFromSource()` | Remove an asset from a source by ID |
| `engine.asset.assetSourceContentsChanged()` | Notify UI that source contents changed |
| `engine.scene.saveToString()` | Serialize scene to base64 string format |
| `engine.scene.saveToArchive()` | Save scene as self-contained archive blob |
| `engine.scene.applyTemplateFromURL()` | Apply a template to the current scene |
| `cesdk.ui.addAssetLibraryEntry()` | Add a library entry to the asset library |



---

## More Resources

- **[Electron Documentation Index](https://img.ly/electron.md)** - Browse all Electron documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./electron.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support