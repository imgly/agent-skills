> This is one page of the CE.SDK SvelteKit documentation. For a complete overview, see the [SvelteKit Documentation Index](https://img.ly/sveltekit.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Open the Editor](./open-the-editor.md) > [Create From Template](./open-the-editor/from-template.md)

---

Load pre-designed templates to give users a professional starting point instead of a blank canvas.

![Create From Template example showing a postcard template loaded in the editor](https://img.ly/docs/cesdk/./assets/browser.hero.webp)

> **Reading time:** 5 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/heads/main.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/main/guides-open-the-editor-from-template-browser)
>
> - [Open in StackBlitz](https://stackblitz.com/~/github.com/imgly/cesdk-web-examples/tree/main/guides-open-the-editor-from-template-browser)
>
> - [Live demo](https://img.ly/examples/guides-open-the-editor-from-template-browser/)

Templates provide consistent layouts and styling that users can customize for their needs. CE.SDK supports loading templates from remote URLs, local strings, and applying template content to existing scenes while preserving page dimensions.

```typescript file=@cesdk_web_examples/guides-open-the-editor-from-template-browser/browser.ts reference-only
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
import businessCardSceneString from './assets/business-card.scene?raw';

class Example implements EditorPlugin {
  name = packageJson.name;
  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (cesdk == null) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    const engine = cesdk.engine;
    const templateUrl =
      'https://cdn.img.ly/assets/demo/v3/ly.img.template/templates/cesdk_postcard_1.scene';
    await engine.scene.loadFromURL(templateUrl);

    const textBlocks = engine.block.findByType('text');
    if (textBlocks.length > 0) {
      engine.block.replaceText(textBlocks[0], 'Welcome to CE.SDK');
    }

    // Zoom to fit the page in view
    const pages = engine.block.findByType('page');
    if (pages.length > 0) {
      engine.scene.zoomToBlock(pages[0]);
    }

    // Add custom navigation bar actions for template operations
    cesdk.ui.insertOrderComponent({ in: 'ly.img.navigation.bar', position: 'end' }, {
      id: 'ly.img.actions.navigationBar',
      children: [
        {
          id: 'ly.img.action.navigationBar',
          key: 'load-from-string-action',
          label: 'Load from String',
          iconName: '@imgly/icons/Essentials/Download',
          onClick: async () => {
            await engine.scene.loadFromString(businessCardSceneString);
            const scene = engine.scene.get();
            if (scene != null) {
              await engine.scene.zoomToBlock(scene, { padding: 40 });
            }
          }
        },
        {
          id: 'ly.img.action.navigationBar',
          key: 'apply-template-action',
          label: 'Apply Template',
          iconName: '@imgly/icons/Essentials/TemplateLibrary',
          onClick: async () => {
            const applyTemplateUrl =
              'https://cdn.img.ly/assets/demo/v3/ly.img.template/templates/cesdk_instagram_photo_1.scene';
            await engine.scene.applyTemplateFromURL(applyTemplateUrl);
            const scene = engine.scene.get();
            if (scene != null) {
              await engine.scene.zoomToBlock(scene, { padding: 40 });
            }
          }
        }
      ]
    });
  }
}

export default Example;
```

This guide covers how to load templates from URLs and strings, and how to apply templates to existing scenes.

## Load a Template from URL

The most common approach is loading templates from a remote URL. The engine replaces any existing scene with the loaded template.

```typescript highlight-load-from-url
const templateUrl =
  'https://cdn.img.ly/assets/demo/v3/ly.img.template/templates/cesdk_postcard_1.scene';
await engine.scene.loadFromURL(templateUrl);
```

The template URL should point to a valid `.scene` file hosted on a server with appropriate CORS headers.

## Load a Template from String

When templates are stored in a database or retrieved from custom storage, use `engine.scene.loadFromString()`. This accepts the scene data as a string, typically from a previous `engine.scene.saveToString()` call.

```typescript highlight-load-from-string
await engine.scene.loadFromString(businessCardSceneString);
```

This approach is useful for loading templates from your backend API, restoring saved user designs, or working with templates stored in databases.

## Apply a Template to an Existing Scene

To apply template content while preserving the current page dimensions, use `engine.scene.applyTemplateFromURL()`. The template content automatically adjusts to fit the existing page size.

```typescript highlight-apply-template
await engine.scene.applyTemplateFromURL(applyTemplateUrl);
```

This is useful when users have already set up a canvas size and you want to populate it with template content without changing the dimensions.

## Modify Template Content

After loading a template, customize the content using block APIs. Find elements and modify them as needed.

```typescript highlight-modify-content
const textBlocks = engine.block.findByType('text');
if (textBlocks.length > 0) {
  engine.block.replaceText(textBlocks[0], 'Welcome to CE.SDK');
}
```

Common modifications include:

- **Updating text content**: `engine.block.replaceText(blockId, 'New text')`
- **Swapping images**: `engine.block.setString(fill, 'fill/image/imageFileURI', newUrl)`
- **Adjusting colors**: `engine.block.setColor(blockId, 'fill/solid/color', newColor)`

## Troubleshooting

### Template Fails to Load

- Verify the template URL is accessible and returns a valid scene file
- Check CORS headers allow fetching from the template source
- Ensure the template format is compatible with your CE.SDK version

### Assets Not Displaying After Load

- Template scene files store asset references as URLs; ensure those URLs remain accessible
- Use archives (`.zip`) for self-contained templates with bundled assets
- Configure a URI resolver if assets are hosted on different servers

## API Reference

| Method | Description |
| ------ | ----------- |
| `engine.scene.loadFromURL()` | Load a scene from a remote URL |
| `engine.scene.loadFromString()` | Load a scene from a string |
| `engine.scene.applyTemplateFromURL()` | Apply template to existing scene from URL |
| `engine.scene.applyTemplateFromString()` | Apply template to existing scene from string |
| `engine.block.findByType()` | Find blocks by type |
| `engine.block.findByKind()` | Find blocks by kind |
| `engine.block.replaceText()` | Replace text content in a text block |

## Next Steps

- [Load a Scene](./open-the-editor/load-scene.md) - Load saved scenes from various sources
- [Save a Design](./export-save-publish/save.md) - Save your customized template
- [Import a Design](./open-the-editor/import-design.md) - Import designs from archives or other formats



---

## More Resources

- **[SvelteKit Documentation Index](https://img.ly/sveltekit.md)** - Browse all SvelteKit documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./sveltekit.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support