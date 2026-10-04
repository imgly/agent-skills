> This is one page of the CE.SDK Flutter documentation. For a complete overview, see the [Flutter Documentation Index](https://img.ly/docs/cesdk/flutter/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/flutter/llms-full.txt).

**Navigation:** [Guides](https://img.ly/docs/cesdk/flutter/guides-8d8b00/) > [Create and Edit Text](https://img.ly/docs/cesdk/flutter/text-8a993a/) > [Text Designs](./text-designs.md)

---

Text Designs (also known as Text Components) are pre-designed text layouts that appear in your asset library. Users can click on these components to automatically insert them into their designs. This guide explains how to prepare and customize the `content.json` file that defines these components.

## What are Text Designs?

Text Designs are serialized text blocks or groups of text blocks configured with specific styling, layout constraints, and behavior. They provide users with professionally designed text layouts that are easy to customize while maintaining their visual integrity.

When users browse the asset library, they see thumbnails of these text components. Clicking on a component automatically loads and inserts it into their current scene.

## Default Components

CE.SDK ships with over 20 pre-built text designs including:

- **Box** - Text with decorative border elements
- **Breaking** - Bold, attention-grabbing headlines
- **Cinematic** - Movie poster-style text effects
- **Glow** - Text with luminous glow effects
- **Greetings** - Welcoming message layouts
- **Promo** - Promotional and sale-focused designs
- **Quote** - Quote bubble and callout styles
- **Speech** - Dialog and conversation layouts
- **Valentine** - Romantic and heart-themed designs
- **Handwriting** - Script and handwritten font styles
- And many more...

## Content.json Structure

Text designs are defined in a `content.json` file with the following structure:

```json
{
  "version": "5.0.0",
  "id": "ly.img.text.components",
  "assets": [
    {
      "id": "ly.img.text.components.box",
      "label": {
        "en": "Box"
      },
      "meta": {
        "uri": "{{base_url}}/ly.img.text.components/data/box/blocks.blocks",
        "thumbUri": "{{base_url}}/ly.img.text.components/thumbnails/box.png",
        "mimeType": "application/ubq-blocks-string"
      }
    }
  ],
  "blocks": []
}
```

### Key Properties

- **version**: Content format version (currently "5.0.0")
- **id**: Unique identifier for the asset source ("ly.img.text.components")
- **assets**: Array of component definitions

### Asset Properties

Each component in the assets array has:

- **id**: Unique identifier following the pattern `ly.img.text.components.[name]`
- **label**: Display name object with language codes (e.g., `{"en": "Box"}`)
- **meta**:
  - **uri**: Path to the `.blocks` file containing the serialized component
  - **thumbUri**: Path to the thumbnail image (400x320px PNG recommended)
  - **mimeType**: Always `"application/ubq-blocks-string"` for text components

The `{{base_url}}` placeholder gets replaced with your configured base URL.

## Creating Custom Components

### 1. Design Your Component

Follow these best practices when designing text components:

#### Text Settings

- Use **variable text** with a range of 0-1000 characters
- Set **fixed frame** with **clipping enabled**
- Avoid growing or shrinking frames to prevent scaling issues

#### Constraints Setup

- **Parent Group**: Give the parent group all available constraint options for maximum flexibility
- **Child Elements**: Set constraints relative to the parent group to maintain proper relationships during resizing

#### Design Considerations

- Use **scopes** and **auto font-size** features to enable easy editing
- Test components by dropping them into new files to verify constraint behavior
- Ensure components work as cohesive units that are easy to edit but difficult to accidentally break

### 2. Export Your Component

Once your design is ready:

1. Select the complete text component (parent group with all children)
2. Use the BlockAPI (not the SceneAPI) to serialize it to an archive:

```javascript
// Save the component to a blocks archive file
const blocksArchive = await engine.block.saveToArchive([componentBlockId]);
```

#### Resource Management

Text components often reference external resources like fonts and images. When using `saveToArchive()`, these resources can be stored. If you later serve all the resources together with the blocks file, the component can be used in other editors.

Using `saveToArchive()` ensures that:

- Font references remain valid across different environments
- Components can be safely used in any scene
- Serialized scenes maintain all resource references

**Best Practices:**

1. **Ensure resource availability**: Make sure all resources used in your components are served
2. **Test in isolation**: Always test components in fresh editor instances to verify resource loading
3. **Validate references**: Check that all asset URIs are accessible from your target environments

### 3. Create Component Files

#### Save the Blocks Archive File

Save the component archive and extract it:

- Use descriptive names matching your component ID (e.g., `customBox`)
- Extract the zip file and store it in your `/data/customBox` directory structure
- All files should be included in the same file structure as in the archive

Example with only a blocks file:

```
/data/customBox/blocks.blocks
```

Example with images and fonts:

```
/data/customBox/blocks.blocks
/data/customBox/fonts/59251598.ttf
/data/customBox/fonts/355809377.ttf
/data/customBox/images/3255389386.jpeg
/data/customBox/images/3302885400.jpeg
```

#### Create Thumbnails

Generate 400x320px PNG thumbnails:

1. Remove page background color from your design
2. Export as PNG using the block export API:

```javascript
// Export component as 400x320px thumbnail
const thumbnailBlob = await engine.block.export(componentBlockId, {
  mimeType: 'image/png',
  targetWidth: 400,
  targetHeight: 320,
});

// Save thumbnail to file
const thumbnailBuffer = await thumbnailBlob.arrayBuffer();
// Save thumbnailBuffer to your thumbnail file (e.g., customBox.png)
```

### 4. Update content.json

Add your new component to the assets array:

```json
{
  "id": "ly.img.text.components.customBox",
  "label": {
    "en": "Custom Box",
    "de": "Eigene Box"
  },
  "meta": {
    "uri": "{{base_url}}/ly.img.text.components/data/customBox/blocks.blocks",
    "thumbUri": "{{base_url}}/ly.img.text.components/thumbnails/customBox.png",
    "mimeType": "application/ubq-blocks-string"
  }
}
```

## Hosting Custom Components

### Backend Setup

1. **Host your files**: Upload your modified `content.json`, `.blocks` files, and thumbnails to your web server
2. **Maintain structure**: Keep the same directory structure:
   ```
   /ly.img.text.components/
   ├── content.json
   ├── data/
   │   ├── box/blocks.blocks
   │   ├── customBox/blocks.blocks
   │   ├── customBox/fonts/59251598.ttf
   │   ├── customBox/fonts/355809377.ttf
   │   ├── customBox/images/3255389386.jpeg
   │   ├── customBox/images/3302885400.jpeg
   │   └── ...
   └── thumbnails/
       ├── box.png
       ├── customBox.png
       └── ...
   ```

### Configuration

Your custom text designs will now appear in the text components section of the asset library.



---

## More Resources

- **[Flutter Documentation Index](https://img.ly/docs/cesdk/flutter/)** - Browse all Flutter documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/flutter/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/flutter/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support