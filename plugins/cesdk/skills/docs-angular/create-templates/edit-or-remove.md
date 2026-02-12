> This is one page of the CE.SDK Angular documentation. For a complete overview, see the [Angular Documentation Index](https://img.ly/angular.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Create and Use Templates](./create-templates.md) > [Edit or Remove Templates](./create-templates/edit-or-remove.md)

---

Modify existing templates and manage template lifecycle in your asset library using CE.SDK.

![Edit or Remove Templates example showing template management](https://img.ly/docs/cesdk/./assets/browser.hero.webp)

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/heads/main.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/main/guides-create-templates-edit-or-remove-browser)
>
> - [Open in StackBlitz](https://stackblitz.com/~/github.com/imgly/cesdk-web-examples/tree/main/guides-create-templates-edit-or-remove-browser)
>
> - [Live demo](https://img.ly/examples/guides-create-templates-edit-or-remove-browser/)

Templates evolve as designs change. You might need to update branding, fix content errors, or remove outdated templates from your library. CE.SDK provides APIs for adding, editing, and removing templates from asset sources.

```typescript file=@cesdk_web_examples/guides-create-templates-edit-or-remove-browser/browser.ts reference-only
import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';
import packageJson from './package.json';

/**
 * CE.SDK Plugin: Edit or Remove Templates Guide
 *
 * Demonstrates template management workflows:
 * - Adding templates to local asset sources with thumbnails
 * - Editing template content and updating in asset sources
 * - Removing templates from asset sources
 * - Saving updated templates with new content
 */

// Helper function to generate SVG thumbnail with text label
function generateThumbnail(label: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="150" viewBox="0 0 200 150">
    <rect width="200" height="150" fill="#f5f5f5"/>
    <text x="100" y="75" text-anchor="middle" dominant-baseline="middle" font-family="sans-serif" font-size="14" fill="#333">${label}</text>
  </svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

class Example implements EditorPlugin {
  name = packageJson.name;

  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    // Initialize CE.SDK with Design mode and create a scene
    await cesdk.addDefaultAssetSources();
    await cesdk.addDemoAssetSources({
      sceneMode: 'Design',
      withUploadAssetSources: true
    });
    await cesdk.createDesignScene();
    const engine = cesdk.engine;

    const page = engine.block.findByType('page')[0];
    engine.block.setWidth(page, 800);
    engine.block.setHeight(page, 600);
    const pageWidth = engine.block.getWidth(page);
    const pageHeight = engine.block.getHeight(page);

    // Create a local asset source for managing templates
    engine.asset.addLocalSource('my-templates', undefined, async (asset) => {
      const uri = asset.meta?.uri;
      if (!uri) return undefined;
      const base64Content = uri.split(',')[1];
      if (!base64Content) return undefined;
      await engine.scene.loadFromString(base64Content);
      return engine.scene.get() ?? undefined;
    });

    // Add the template source to the dock as an asset library entry
    cesdk.ui.addAssetLibraryEntry({
      id: 'my-templates-entry',
      sourceIds: ['my-templates'],
      title: 'My Templates',
      icon: '@imgly/Template',
      gridColumns: 2,
      gridItemHeight: 'square'
    });

    // Add a spacer to push "My Templates" to the bottom of the dock
    cesdk.ui.setComponentOrder({ in: 'ly.img.dock' }, [
      ...cesdk.ui.getComponentOrder({ in: 'ly.img.dock' }),
      'ly.img.spacer',
      {
        id: 'ly.img.assetLibrary.dock',
        key: 'my-templates',
        icon: '@imgly/Template',
        label: 'My Templates',
        entries: ['my-templates-entry']
      }
    ]);

    // Create the template with text blocks
    const titleBlock = engine.block.create('text');
    engine.block.replaceText(titleBlock, 'Original Template');
    engine.block.setFloat(titleBlock, 'text/fontSize', 64);
    engine.block.setWidthMode(titleBlock, 'Auto');
    engine.block.setHeightMode(titleBlock, 'Auto');
    engine.block.appendChild(page, titleBlock);

    const subtitleBlock = engine.block.create('text');
    engine.block.replaceText(
      subtitleBlock,
      'Browse "My Templates" at the bottom of the dock'
    );
    engine.block.setFloat(subtitleBlock, 'text/fontSize', 42);
    engine.block.setWidthMode(subtitleBlock, 'Auto');
    engine.block.setHeightMode(subtitleBlock, 'Auto');
    engine.block.appendChild(page, subtitleBlock);

    // Position text blocks centered on the page
    const titleWidth = engine.block.getFrameWidth(titleBlock);
    const titleHeight = engine.block.getFrameHeight(titleBlock);
    engine.block.setPositionX(titleBlock, (pageWidth - titleWidth) / 2);
    engine.block.setPositionY(titleBlock, pageHeight / 2 - titleHeight - 20);

    const subtitleWidth = engine.block.getFrameWidth(subtitleBlock);
    engine.block.setPositionX(subtitleBlock, (pageWidth - subtitleWidth) / 2);
    engine.block.setPositionY(subtitleBlock, pageHeight / 2 + 20);

    // Save template content and add to asset source
    const originalContent = await engine.scene.saveToString();
    engine.asset.addAssetToSource('my-templates', {
      id: 'template-original',
      label: { en: 'Original Template' },
      meta: {
        uri: `data:application/octet-stream;base64,${originalContent}`,
        thumbUri: generateThumbnail('Original Template')
      }
    });

    // eslint-disable-next-line no-console
    console.log('Original template added to asset source');

    // Edit the template content and save as a new version
    engine.block.replaceText(titleBlock, 'Updated Template');
    engine.block.replaceText(
      subtitleBlock,
      'This template was edited and saved'
    );

    const updatedContent = await engine.scene.saveToString();
    engine.asset.addAssetToSource('my-templates', {
      id: 'template-updated',
      label: { en: 'Updated Template' },
      meta: {
        uri: `data:application/octet-stream;base64,${updatedContent}`,
        thumbUri: generateThumbnail('Updated Template')
      }
    });

    // Re-center after modification
    const newTitleWidth = engine.block.getFrameWidth(titleBlock);
    const newTitleHeight = engine.block.getFrameHeight(titleBlock);
    engine.block.setPositionX(titleBlock, (pageWidth - newTitleWidth) / 2);
    engine.block.setPositionY(titleBlock, pageHeight / 2 - newTitleHeight - 20);

    const newSubtitleWidth = engine.block.getFrameWidth(subtitleBlock);
    engine.block.setPositionX(
      subtitleBlock,
      (pageWidth - newSubtitleWidth) / 2
    );

    // eslint-disable-next-line no-console
    console.log('Updated template added to asset source');

    // Add a temporary template to demonstrate removal
    engine.asset.addAssetToSource('my-templates', {
      id: 'template-temporary',
      label: { en: 'Temporary Template' },
      meta: {
        uri: `data:application/octet-stream;base64,${originalContent}`,
        thumbUri: generateThumbnail('Temporary Template')
      }
    });

    // Remove the temporary template from the asset source
    engine.asset.removeAssetFromSource('my-templates', 'template-temporary');

    // eslint-disable-next-line no-console
    console.log('Temporary template removed from asset source');

    // Update an existing template by removing and re-adding with same ID
    engine.block.replaceText(subtitleBlock, 'Updated again with new content');
    const reUpdatedContent = await engine.scene.saveToString();

    engine.asset.removeAssetFromSource('my-templates', 'template-updated');
    engine.asset.addAssetToSource('my-templates', {
      id: 'template-updated',
      label: { en: 'Updated Template' },
      meta: {
        uri: `data:application/octet-stream;base64,${reUpdatedContent}`,
        thumbUri: generateThumbnail('Updated Template')
      }
    });

    // Notify that the asset source contents have changed
    engine.asset.assetSourceContentsChanged('my-templates');

    // Re-center subtitle after final update
    const reUpdatedSubtitleWidth = engine.block.getFrameWidth(subtitleBlock);
    engine.block.setPositionX(
      subtitleBlock,
      (pageWidth - reUpdatedSubtitleWidth) / 2
    );

    // eslint-disable-next-line no-console
    console.log('Template updated in asset source');

    // Apply the original template to show the starting point
    await engine.scene.loadFromString(originalContent);
    // eslint-disable-next-line no-console
    console.log(
      'Original template applied - browse "My Templates" in the dock'
    );
  }
}

export default Example;
```

This guide covers how to add templates to asset sources, edit template content, remove templates, and save updated versions.

## Adding Templates

First, create a local asset source to store your templates:

```typescript highlight-create-source
// Create a local asset source for managing templates
engine.asset.addLocalSource('my-templates', undefined, async (asset) => {
  const uri = asset.meta?.uri;
  if (!uri) return undefined;
  const base64Content = uri.split(',')[1];
  if (!base64Content) return undefined;
  await engine.scene.loadFromString(base64Content);
  return engine.scene.get() ?? undefined;
});
```

Next, create your template content using block APIs:

```typescript highlight-create-template
    // Create the template with text blocks
    const titleBlock = engine.block.create('text');
    engine.block.replaceText(titleBlock, 'Original Template');
    engine.block.setFloat(titleBlock, 'text/fontSize', 64);
    engine.block.setWidthMode(titleBlock, 'Auto');
    engine.block.setHeightMode(titleBlock, 'Auto');
    engine.block.appendChild(page, titleBlock);

    const subtitleBlock = engine.block.create('text');
    engine.block.replaceText(
      subtitleBlock,
      'Browse "My Templates" at the bottom of the dock'
    );
    engine.block.setFloat(subtitleBlock, 'text/fontSize', 42);
    engine.block.setWidthMode(subtitleBlock, 'Auto');
    engine.block.setHeightMode(subtitleBlock, 'Auto');
    engine.block.appendChild(page, subtitleBlock);
```

Then save the template and add it to the asset source using `addAssetToSource()`. Each template needs a unique ID, a label, and metadata containing the template URI and thumbnail:

```typescript highlight-add-to-source
// Save template content and add to asset source
const originalContent = await engine.scene.saveToString();
engine.asset.addAssetToSource('my-templates', {
  id: 'template-original',
  label: { en: 'Original Template' },
  meta: {
    uri: `data:application/octet-stream;base64,${originalContent}`,
    thumbUri: generateThumbnail('Original Template')
  }
});
```

The `meta.uri` field contains the template content as a data URI. The `meta.thumbUri` provides a thumbnail image for display in the asset library.

## Editing Templates

Modify template content using block APIs. You can update text, change images, adjust positions, and reconfigure any block properties.

```typescript highlight-modify-template
    // Edit the template content and save as a new version
    engine.block.replaceText(titleBlock, 'Updated Template');
    engine.block.replaceText(
      subtitleBlock,
      'This template was edited and saved'
    );

    const updatedContent = await engine.scene.saveToString();
    engine.asset.addAssetToSource('my-templates', {
      id: 'template-updated',
      label: { en: 'Updated Template' },
      meta: {
        uri: `data:application/octet-stream;base64,${updatedContent}`,
        thumbUri: generateThumbnail('Updated Template')
      }
    });
```

After editing, save the modified template as a new asset or update an existing one.

## Removing Templates

Remove templates from asset sources using `removeAssetFromSource()`. This permanently deletes the template entry from the source.

```typescript highlight-remove-template
    // Add a temporary template to demonstrate removal
    engine.asset.addAssetToSource('my-templates', {
      id: 'template-temporary',
      label: { en: 'Temporary Template' },
      meta: {
        uri: `data:application/octet-stream;base64,${originalContent}`,
        thumbUri: generateThumbnail('Temporary Template')
      }
    });

    // Remove the temporary template from the asset source
    engine.asset.removeAssetFromSource('my-templates', 'template-temporary');
```

> **Warning:** Removal is permanent. The template is no longer accessible from the asset source after removal. If you need to restore templates, maintain backups or implement a soft-delete mechanism.

## Saving Updated Templates

To update an existing template, first remove it using `removeAssetFromSource()`, then add the updated version with `addAssetToSource()` using the same asset ID.

```typescript highlight-update-in-source
    // Update an existing template by removing and re-adding with same ID
    engine.block.replaceText(subtitleBlock, 'Updated again with new content');
    const reUpdatedContent = await engine.scene.saveToString();

    engine.asset.removeAssetFromSource('my-templates', 'template-updated');
    engine.asset.addAssetToSource('my-templates', {
      id: 'template-updated',
      label: { en: 'Updated Template' },
      meta: {
        uri: `data:application/octet-stream;base64,${reUpdatedContent}`,
        thumbUri: generateThumbnail('Updated Template')
      }
    });

    // Notify that the asset source contents have changed
    engine.asset.assetSourceContentsChanged('my-templates');
```

After updating templates, call `assetSourceContentsChanged()` to notify the UI that the asset source contents have changed.

## Best Practices

### Versioning Strategies

When managing template updates, consider these approaches:

- **Replace in place**: Use the same asset ID to update templates without changing references. Existing designs using the template won't break.
- **Version suffixes**: Create new entries with version identifiers (e.g., `template-v2`). This preserves old versions while introducing new ones.
- **Archive old versions**: Move deprecated templates to a separate source before removal. This maintains a history without cluttering the main library.

### Batch Operations

When adding, updating, or removing multiple templates, call `assetSourceContentsChanged()` once after all operations complete rather than after each individual change. This reduces UI refreshes and improves performance.

### Template IDs

Use descriptive, unique IDs that reflect the template's purpose (e.g., `marketing-banner-2024`, `social-post-square`). Consistent naming conventions make templates easier to find and manage programmatically.

### Thumbnails

Generate meaningful thumbnails that accurately represent template content. Good thumbnails improve discoverability in the asset library and help users quickly identify the right template.

### Memory Considerations

Templates stored as base64 data URIs remain in memory. For production applications with many templates, consider storing template content externally and using URLs in the `meta.uri` field instead of inline data URIs.

## API Reference

| Method | Description |
| --- | --- |
| `engine.asset.addLocalSource()` | Create a local asset source |
| `engine.asset.addAssetToSource()` | Add template to asset source |
| `engine.asset.removeAssetFromSource()` | Remove template from asset source |
| `engine.asset.assetSourceContentsChanged()` | Notify UI of asset source changes |
| `engine.scene.saveToString()` | Save scene as base64 string |
| `engine.scene.loadFromString()` | Load scene from base64 string |



---

## More Resources

- **[Angular Documentation Index](https://img.ly/angular.md)** - Browse all Angular documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./angular.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support