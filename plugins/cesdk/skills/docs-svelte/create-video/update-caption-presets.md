> This is one page of the CE.SDK Svelte documentation. For a complete overview, see the [Svelte Documentation Index](https://img.ly/svelte.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Create and Edit Videos](./create-video.md) > [Update Caption Presets](./create-video/update-caption-presets.md)

---

Extend CE.SDK's video caption feature with custom caption presets by updating
the content.json file. Caption presets let your users apply predefined styles
to video captions with a single click.

![Update Caption Presets example showing a styled neon glow caption preset](https://img.ly/docs/cesdk/./assets/browser.hero.webp)

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/heads/main.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/main/guides-create-video-update-caption-presets-browser)
>
> - [Open in StackBlitz](https://stackblitz.com/~/github.com/imgly/cesdk-web-examples/tree/main/guides-create-video-update-caption-presets-browser)
>
> - [Live demo](https://img.ly/examples/guides-create-video-update-caption-presets-browser/)

Video captions have become an essential part of digital content, improving accessibility and engagement. With CE.SDK's caption presets feature, you can offer your users a selection of predefined caption styles that they can apply with a single click. This guide shows you how to create styled text blocks, serialize them as preset files, and structure the content.json to make them available in the caption presets panel.

```typescript file=@cesdk_web_examples/guides-create-video-update-caption-presets-browser/browser.ts reference-only
import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';
import packageJson from './package.json';

/**
 * CE.SDK Plugin: Update Caption Presets Guide
 *
 * Demonstrates creating custom caption presets in CE.SDK:
 * - Creating a styled text block as a preset base
 * - Applying neon glow styling with colors and drop shadow
 * - Serializing the block for use as a preset file
 * - Understanding the content.json structure for caption presets
 */
class Example implements EditorPlugin {
  name = packageJson.name;

  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    // Enable video editing features for caption presets
    cesdk.feature.enable('ly.img.video');
    cesdk.feature.enable('ly.img.timeline');
    cesdk.feature.enable('ly.img.playback');

    // Load assets and create a video scene
    await cesdk.addDefaultAssetSources();
    await cesdk.addDemoAssetSources({
      sceneMode: 'Video',
      withUploadAssetSources: true
    });
    await cesdk.createVideoScene();

    const engine = cesdk.engine;

    // Create a text block to use as the preset base
    // Text blocks support all the styling properties needed for captions
    const textBlock = engine.block.create('text');

    // Set sample caption text
    engine.block.setString(textBlock, 'text/text', 'NEON GLOW');

    // Position and size the text block
    engine.block.setPositionX(textBlock, 50);
    engine.block.setPositionY(textBlock, 200);
    engine.block.setWidth(textBlock, 600);
    engine.block.setHeightMode(textBlock, 'Auto');

    // Style the text with a bright neon cyan color
    // This will be the fill/solid/color property in the preset
    engine.block.setColor(textBlock, 'fill/solid/color', {
      r: 0.0,
      g: 1.0,
      b: 1.0,
      a: 1.0
    });

    // Set font properties for the caption style
    engine.block.setFloat(textBlock, 'text/fontSize', 48);

    // Use a bold font for better visibility
    // Load and set a typeface
    const typefaceResult = await engine.asset.findAssets('ly.img.typeface', {
      query: 'Roboto',
      page: 0,
      perPage: 10
    });

    if (typefaceResult.assets.length > 0) {
      const typefaceAsset = typefaceResult.assets[0];
      const typeface = typefaceAsset.payload?.typeface;
      if (typeface && typeface.fonts?.[0]?.uri) {
        engine.block.setFont(textBlock, typeface.fonts[0].uri, typeface);
      }
    }

    // Add a glowing drop shadow effect for the neon look
    // This creates the characteristic neon glow effect
    engine.block.setDropShadowEnabled(textBlock, true);

    // Set glow color (bright cyan to match text)
    engine.block.setColor(textBlock, 'dropShadow/color', {
      r: 0.0,
      g: 1.0,
      b: 1.0,
      a: 0.8
    });

    // Configure shadow properties for a soft glow
    engine.block.setFloat(textBlock, 'dropShadow/blurRadius/x', 20);
    engine.block.setFloat(textBlock, 'dropShadow/blurRadius/y', 20);
    engine.block.setFloat(textBlock, 'dropShadow/offset/x', 0);
    engine.block.setFloat(textBlock, 'dropShadow/offset/y', 0);

    // Optionally add a semi-transparent dark background
    // This helps the caption stand out against video content
    engine.block.setBackgroundColorEnabled(textBlock, true);
    engine.block.setColor(textBlock, 'backgroundColor/color', {
      r: 0.0,
      g: 0.0,
      b: 0.1,
      a: 0.7
    });

    // Add the styled text block to the page
    const pages = engine.block.findByType('page');
    if (pages.length > 0) {
      engine.block.appendChild(pages[0], textBlock);
    }

    // Select the block and zoom to it so it's visible in the editor
    engine.block.select(textBlock);
    await engine.scene.zoomToBlock(textBlock, { padding: 40 });

    // Serialize the styled text block to create a preset file
    // This serialized string can be saved as a .blocks or .preset file
    // Include 'bundle' scheme to allow serialization of blocks with bundled fonts
    const serializedPreset = await engine.block.saveToString(
      [textBlock],
      ['buffer', 'http', 'https', 'bundle']
    );

    // eslint-disable-next-line no-console
    console.log('=== Serialized Preset ===');
    // eslint-disable-next-line no-console
    console.log('Save this as a .preset file (e.g., neon-glow.preset):');
    // eslint-disable-next-line no-console
    console.log(serializedPreset);

    // Example content.json entry for the custom preset
    // This shows the structure needed to add the preset to content.json
    const contentJsonEntry = {
      id: '//ly.img.captionPresets/neon-glow',
      label: {
        en: 'Neon Glow'
      },
      meta: {
        uri: '{{base_url}}/ly.img.captionPresets/presets/neon-glow.preset',
        thumbUri: '{{base_url}}/ly.img.captionPresets/thumbnails/neon-glow.png',
        mimeType: 'application/ubq-blocks-string'
      },
      payload: {
        properties: [
          {
            type: 'Color',
            property: 'fill/solid/color',
            value: { r: 0.0, g: 1.0, b: 1.0, a: 1.0 },
            defaultValue: { r: 0.0, g: 1.0, b: 1.0, a: 1.0 }
          },
          {
            type: 'Color',
            property: 'dropShadow/color',
            value: { r: 0.0, g: 1.0, b: 1.0, a: 0.8 },
            defaultValue: { r: 0.0, g: 1.0, b: 1.0, a: 0.8 }
          },
          {
            type: 'Color',
            property: 'backgroundColor/color',
            value: { r: 0.0, g: 0.0, b: 0.1, a: 0.7 },
            defaultValue: { r: 0.0, g: 0.0, b: 0.1, a: 0.7 }
          }
        ]
      }
    };

    // eslint-disable-next-line no-console
    console.log('\n=== content.json Entry ===');
    // eslint-disable-next-line no-console
    console.log('Add this entry to your content.json assets array:');
    // eslint-disable-next-line no-console
    console.log(JSON.stringify(contentJsonEntry, null, 2));

    // Example of a complete content.json file structure
    const completeContentJson = {
      version: '3.0.0',
      id: 'ly.img.captionPresets',
      assets: [contentJsonEntry]
    };

    // eslint-disable-next-line no-console
    console.log('\n=== Complete content.json Example ===');
    // eslint-disable-next-line no-console
    console.log(JSON.stringify(completeContentJson, null, 2));

    // eslint-disable-next-line no-console
    console.log('\n=== Caption Preset Guide ===');
    // eslint-disable-next-line no-console
    console.log(
      'The styled text block above demonstrates a "Neon Glow" caption preset.'
    );
    // eslint-disable-next-line no-console
    console.log('To use this preset:');
    // eslint-disable-next-line no-console
    console.log('1. Save the serialized preset string as a .preset file');
    // eslint-disable-next-line no-console
    console.log('2. Create a thumbnail image showing the preset appearance');
    // eslint-disable-next-line no-console
    console.log('3. Add the content.json entry to your assets folder');
    // eslint-disable-next-line no-console
    console.log('4. Configure CE.SDK baseURL to point to your assets location');
  }
}

export default Example;
```

This guide covers how to understand the caption presets folder structure, create custom caption styles from text blocks, serialize presets for hosting, define customizable properties, and configure CE.SDK to load your custom presets.

## Understanding the Caption Presets Structure

### Folder Organization

CE.SDK's caption presets use a specific directory structure that the engine expects when loading presets. The base path is `assets/v4/ly.img.captionPresets/` and contains:

```
assets/v4/ly.img.captionPresets/
├── content.json                # Master index of all presets
├── presets/                    # Folder containing preset files
│   ├── my-custom-preset.preset # Serialized caption block with styling
│   └── ...
└── thumbnails/                 # Folder containing preview images
    ├── my-custom-preset.png    # Preview image for preset
    └── ...
```

The main `content.json` file acts as an index that lists all available presets with their metadata. When CE.SDK loads caption presets, it reads this file to discover available presets and their locations.

### content.json Format

The content.json file follows a specific format with version, asset source ID, and an assets array:

```json
{
  "version": "3.0.0",
  "id": "ly.img.captionPresets",
  "assets": [
    {
      "id": "//ly.img.captionPresets/my-preset",
      "label": { "en": "My Preset" },
      "meta": {
        "uri": "{{base_url}}/ly.img.captionPresets/presets/my-preset.preset",
        "thumbUri": "{{base_url}}/ly.img.captionPresets/thumbnails/my-preset.png",
        "mimeType": "application/ubq-blocks-string"
      },
      "payload": {
        "properties": []
      }
    }
  ]
}
```

Each asset entry requires a unique ID with namespace, localized label, meta with URIs and mime type, and optional payload properties for customization.

## Creating Custom Caption Presets

### Designing a Caption Style

We create a styled text block as the basis for our preset. Text blocks support all the styling properties needed for captions including colors, fonts, backgrounds, shadows, and effects.

```typescript highlight-create-text-block
    // Create a text block to use as the preset base
    // Text blocks support all the styling properties needed for captions
    const textBlock = engine.block.create('text');

    // Set sample caption text
    engine.block.setString(textBlock, 'text/text', 'NEON GLOW');

    // Position and size the text block
    engine.block.setPositionX(textBlock, 50);
    engine.block.setPositionY(textBlock, 200);
    engine.block.setWidth(textBlock, 600);
    engine.block.setHeightMode(textBlock, 'Auto');
```

We position and size the text block, then set sample caption text. The text block serves as our canvas for applying the styling that will define the preset's appearance.

### Styling with Colors and Fonts

We style the text with colors and configure font properties. The fill color becomes the `fill/solid/color` property in the preset:

```typescript highlight-style-text-color
// Style the text with a bright neon cyan color
// This will be the fill/solid/color property in the preset
engine.block.setColor(textBlock, 'fill/solid/color', {
  r: 0.0,
  g: 1.0,
  b: 1.0,
  a: 1.0
});
```

We also configure font size and load a typeface. When users apply this preset, their captions will inherit these font settings:

```typescript highlight-style-font
    // Set font properties for the caption style
    engine.block.setFloat(textBlock, 'text/fontSize', 48);

    // Use a bold font for better visibility
    // Load and set a typeface
    const typefaceResult = await engine.asset.findAssets('ly.img.typeface', {
      query: 'Roboto',
      page: 0,
      perPage: 10
    });

    if (typefaceResult.assets.length > 0) {
      const typefaceAsset = typefaceResult.assets[0];
      const typeface = typefaceAsset.payload?.typeface;
      if (typeface && typeface.fonts?.[0]?.uri) {
        engine.block.setFont(textBlock, typeface.fonts[0].uri, typeface);
      }
    }
```

### Adding Visual Effects

We add a glowing drop shadow effect for the neon look. Drop shadow creates the characteristic glow effect that makes caption presets visually distinctive:

```typescript highlight-style-drop-shadow
    // Add a glowing drop shadow effect for the neon look
    // This creates the characteristic neon glow effect
    engine.block.setDropShadowEnabled(textBlock, true);

    // Set glow color (bright cyan to match text)
    engine.block.setColor(textBlock, 'dropShadow/color', {
      r: 0.0,
      g: 1.0,
      b: 1.0,
      a: 0.8
    });

    // Configure shadow properties for a soft glow
    engine.block.setFloat(textBlock, 'dropShadow/blurRadius/x', 20);
    engine.block.setFloat(textBlock, 'dropShadow/blurRadius/y', 20);
    engine.block.setFloat(textBlock, 'dropShadow/offset/x', 0);
    engine.block.setFloat(textBlock, 'dropShadow/offset/y', 0);
```

Optionally, we add a semi-transparent background to help the caption stand out against video content:

```typescript highlight-style-background
// Optionally add a semi-transparent dark background
// This helps the caption stand out against video content
engine.block.setBackgroundColorEnabled(textBlock, true);
engine.block.setColor(textBlock, 'backgroundColor/color', {
  r: 0.0,
  g: 0.0,
  b: 0.1,
  a: 0.7
});
```

### Serializing the Preset

We serialize the styled text block using `block.saveToString()`. This creates a serialized string that can be saved as a `.preset` or `.blocks` file:

```typescript highlight-serialize-preset
    // Serialize the styled text block to create a preset file
    // This serialized string can be saved as a .blocks or .preset file
    // Include 'bundle' scheme to allow serialization of blocks with bundled fonts
    const serializedPreset = await engine.block.saveToString(
      [textBlock],
      ['buffer', 'http', 'https', 'bundle']
    );

    // eslint-disable-next-line no-console
    console.log('=== Serialized Preset ===');
    // eslint-disable-next-line no-console
    console.log('Save this as a .preset file (e.g., neon-glow.preset):');
    // eslint-disable-next-line no-console
    console.log(serializedPreset);
```

The serialized string contains all block properties and styling. Save this output as a file (e.g., `neon-glow.preset`) and create a thumbnail image showing the preset appearance.

## Defining Customizable Properties

### Color Properties

We define which properties users can customize without changing the entire preset. Color properties allow users to modify specific color aspects of a preset:

```typescript highlight-content-json-structure
    // Example content.json entry for the custom preset
    // This shows the structure needed to add the preset to content.json
    const contentJsonEntry = {
      id: '//ly.img.captionPresets/neon-glow',
      label: {
        en: 'Neon Glow'
      },
      meta: {
        uri: '{{base_url}}/ly.img.captionPresets/presets/neon-glow.preset',
        thumbUri: '{{base_url}}/ly.img.captionPresets/thumbnails/neon-glow.png',
        mimeType: 'application/ubq-blocks-string'
      },
      payload: {
        properties: [
          {
            type: 'Color',
            property: 'fill/solid/color',
            value: { r: 0.0, g: 1.0, b: 1.0, a: 1.0 },
            defaultValue: { r: 0.0, g: 1.0, b: 1.0, a: 1.0 }
          },
          {
            type: 'Color',
            property: 'dropShadow/color',
            value: { r: 0.0, g: 1.0, b: 1.0, a: 0.8 },
            defaultValue: { r: 0.0, g: 1.0, b: 1.0, a: 0.8 }
          },
          {
            type: 'Color',
            property: 'backgroundColor/color',
            value: { r: 0.0, g: 0.0, b: 0.1, a: 0.7 },
            defaultValue: { r: 0.0, g: 0.0, b: 0.1, a: 0.7 }
          }
        ]
      }
    };

    // eslint-disable-next-line no-console
    console.log('\n=== content.json Entry ===');
    // eslint-disable-next-line no-console
    console.log('Add this entry to your content.json assets array:');
    // eslint-disable-next-line no-console
    console.log(JSON.stringify(contentJsonEntry, null, 2));
```

Each property in the `payload.properties` array needs:

- `type`: Must be `"Color"` for color properties
- `property`: Property path (e.g., `"fill/solid/color"`, `"backgroundColor/color"`, `"dropShadow/color"`)
- `value`: Current RGBA color object with `r`, `g`, `b`, `a` values (0-1 range)
- `defaultValue`: Initial RGBA color object

### Supported Property Paths

Available property paths for caption customization:

- `fill/solid/color`: Text fill color
- `backgroundColor/color`: Background color behind text
- `dropShadow/color`: Drop shadow color
- `stroke/color`: Stroke/outline color

## Updating the content.json File

### Adding a New Preset Entry

Add a new object to the `assets` array with all required fields. The complete structure for a preset entry:

```json
{
  "id": "//ly.img.captionPresets/neon-glow",
  "label": { "en": "Neon Glow" },
  "meta": {
    "uri": "{{base_url}}/ly.img.captionPresets/presets/neon-glow.preset",
    "thumbUri": "{{base_url}}/ly.img.captionPresets/thumbnails/neon-glow.png",
    "mimeType": "application/ubq-blocks-string"
  },
  "payload": {
    "properties": [
      {
        "type": "Color",
        "property": "fill/solid/color",
        "value": { "r": 0.0, "g": 1.0, "b": 1.0, "a": 1.0 },
        "defaultValue": { "r": 0.0, "g": 1.0, "b": 1.0, "a": 1.0 }
      },
      {
        "type": "Color",
        "property": "dropShadow/color",
        "value": { "r": 0.0, "g": 1.0, "b": 1.0, "a": 0.8 },
        "defaultValue": { "r": 0.0, "g": 1.0, "b": 1.0, "a": 0.8 }
      }
    ]
  }
}
```

Ensure the `mimeType` is set to `"application/ubq-blocks-string"` and use the `{{base_url}}` placeholder for dynamic path resolution.

### Complete content.json Example

The complete content.json file structure wraps preset entries in the assets array:

```typescript highlight-complete-content-json
    // Example of a complete content.json file structure
    const completeContentJson = {
      version: '3.0.0',
      id: 'ly.img.captionPresets',
      assets: [contentJsonEntry]
    };

    // eslint-disable-next-line no-console
    console.log('\n=== Complete content.json Example ===');
    // eslint-disable-next-line no-console
    console.log(JSON.stringify(completeContentJson, null, 2));
```

## Hosting and Serving Custom Presets

### Server Setup

Prepare the folder structure and upload files to your server:

1. Create folder structure matching `assets/v4/ly.img.captionPresets/`
2. Upload `content.json` to the root folder
3. Upload `.preset` files to `presets/` subfolder
4. Upload thumbnail images to `thumbnails/` subfolder
5. Ensure files are accessible via HTTP/HTTPS
6. Configure CORS headers if serving cross-origin

### Verifying File Access

Test that all files are accessible before configuring CE.SDK:

- Access `content.json` directly in browser
- Access preset files and thumbnails via their URLs
- Check browser console for CORS errors

## Loading Custom Presets into CE.SDK

### Base URL Configuration

Set the base URL to point to your asset hosting location. CE.SDK automatically looks for `ly.img.captionPresets/content.json` relative to the base URL:

```typescript
const config = {
  baseURL: 'https://your-server.com/assets/'
};

CreativeEditorSDK.create('#cesdk_container', config).then(async (cesdk) => {
  // Caption presets load automatically from baseURL + 'ly.img.captionPresets/content.json'
});
```

Your custom presets will seamlessly integrate with any built-in presets and automatically appear in the caption presets panel in the UI. No additional source registration is needed when replacing the default presets.

## Troubleshooting

### Preset Not Loading

- Verify `content.json` is accessible at expected URL
- Check browser console for 404 errors on preset files
- Ensure `mimeType` is set to `"application/ubq-blocks-string"`
- Verify `{{base_url}}` placeholder is used correctly

### Preset Styles Not Applying

- Ensure preset was serialized from a text block (not other block types)
- Verify the serialized block contains styling properties
- Check that property paths in `payload.properties` are correct

### Thumbnail Not Displaying

- Verify thumbnail file exists at the `thumbUri` path
- Check image format is PNG
- Ensure CORS headers allow image loading

### Custom Colors Not Working

- Verify `properties` array structure in content.json
- Check property `type` is `"Color"`
- Ensure `value` and `defaultValue` have correct RGBA format (0-1 range)

## API Reference

| Method                                       | Category | Purpose                                     |
| -------------------------------------------- | -------- | ------------------------------------------- |
| `engine.block.create('text')`                | Block    | Create text block for preset styling        |
| `engine.block.saveToString(blocks)`          | Block    | Serialize styled block to preset format     |
| `engine.block.setColor(id, property, color)` | Block    | Set color property (fill, background, etc.) |
| `engine.block.setBackgroundColorEnabled()`   | Block    | Enable background color                     |
| `engine.block.setDropShadowEnabled()`        | Block    | Enable drop shadow                          |
| `engine.block.setFloat(id, property, value)` | Block    | Set numeric properties (font size, etc.)    |
| `engine.block.setString(id, property, val)`  | Block    | Set string properties (text, font URI)      |
| `engine.asset.findAssets(sourceId, query)`   | Asset    | Find assets like typefaces                  |
| `CreativeEngine.init(config)`                | Engine   | Initialize engine with base URL config      |



---

## More Resources

- **[Svelte Documentation Index](https://img.ly/svelte.md)** - Browse all Svelte documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./svelte.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support