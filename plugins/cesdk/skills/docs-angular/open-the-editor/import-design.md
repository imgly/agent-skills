> This is one page of the CE.SDK Angular documentation. For a complete overview, see the [Angular Documentation Index](https://img.ly/angular.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Open the Editor](./open-the-editor.md) > [Import a Design](./open-the-editor/import-design.md)

---

Open existing designs from various sources in CE.SDK, including saved scenes, professional design tool files, and source media.

![Import Design example showing different methods to load designs into CE.SDK](https://img.ly/docs/cesdk/./assets/browser.hero.webp)

> **Reading time:** 8 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/heads/main.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/main/guides-open-the-editor-import-design-browser)
>
> - [Open in StackBlitz](https://stackblitz.com/~/github.com/imgly/cesdk-web-examples/tree/main/guides-open-the-editor-import-design-browser)
>
> - [Live demo](https://img.ly/examples/guides-open-the-editor-import-design-browser/)

CE.SDK supports multiple import methods to bring designs into the editor. Load saved **scene files** or self-contained **archives**, create editable scenes from images and videos, or import from professional design tools.

```typescript file=@cesdk_web_examples/guides-open-the-editor-import-design-browser/browser.ts reference-only
import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';
import { calculateGridLayout } from './utils';
import packageJson from './package.json';

class Example implements EditorPlugin {
  name = packageJson.name;
  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    // Load default asset sources
    await cesdk.addDefaultAssetSources();
    await cesdk.addDemoAssetSources({
      sceneMode: 'Design',
      withUploadAssetSources: true
    });

    // Start with a blank design scene
    await cesdk.createDesignScene();

    const engine = cesdk.engine;

    // ===== Method 1: Load Scene from URL =====
    // URL to a saved CE.SDK scene file
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const sceneUrl =
      'https://cdn.img.ly/assets/demo/v3/ly.img.template/templates/cesdk_postcard_1.scene';

    // Load the scene from remote URL
    // await engine.scene.loadFromURL(sceneUrl);

    // The scene is now loaded and ready for editing
    // All blocks and properties from the saved scene are restored

    // ===== Method 2: Load Scene from String =====
    // Scene content as a string (from localStorage, database, or saveToString())
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const savedSceneString = '{ /* scene JSON content */ }';

    // Load the scene from string content
    // await engine.scene.loadFromString(savedSceneString);

    // The scene is restored from the string representation
    // This is useful for offline storage or database persistence

    // ===== Method 3: Load from Archive URL =====
    // Archive URL from cloud storage, CDN, or user upload
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const archiveUrl = 'https://example.com/designs/project-bundle.zip';

    // Load the archive using loadFromArchiveURL
    // await engine.scene.loadFromArchiveURL(archiveUrl);

    // Archives include all assets, making them portable across environments
    // No external asset URLs need to be accessible

    // ===== Method 4: Create Scene from Image =====
    // Create an editable scene from an existing image
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const imageUrl = 'https://img.ly/static/ubq_samples/sample_1.jpg';

    // Create a scene sized to the image dimensions
    // await engine.scene.createFromImage(imageUrl);

    // The image becomes the base content, ready for editing
    // You can now add text, shapes, effects, etc.

    // ===== Method 5: Create Scene from Video =====
    // Create a video editing scene from an existing video
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const videoUrl =
      'https://img.ly/static/ubq_samples/videos/pexels-drone-footage-of-a-surfer-by-ben-chewar-5368886_360p.mp4';

    // Create a scene configured for video mode
    // await engine.scene.createFromVideo(videoUrl);

    // The scene is set up with timeline controls for video editing

    // ===== Method 6: Modify Loaded Scene =====
    // Show that loaded scenes can be modified immediately
    // Find elements in the loaded scene
    // const textBlocks = engine.block.findByType('text');
    // if (textBlocks.length > 0) {
    //   engine.block.setString(textBlocks[0], 'text/text', 'Scene Imported & Modified');
    //   // Scene loads can be undone: engine.editor.undo();
    // }

    // Create a visual demonstration showing different import sources

    const demoPage = engine.block.findByType('page')[0];

    // Set page dimensions for proper grid layout
    engine.block.setWidth(demoPage, 1920);
    engine.block.setHeight(demoPage, 1080);

    const layout = calculateGridLayout(1920, 1080, 4, {
      spacing: 30,
      margin: 60
    });

    // Create demonstration blocks showing different sources
    const demoImage1 = await engine.block.addImage(
      'https://img.ly/static/ubq_samples/sample_1.jpg',
      {
        ...layout.getPosition(0),
        size: { width: layout.blockWidth, height: layout.blockHeight }
      }
    );

    const demoImage2 = await engine.block.addImage(
      'https://img.ly/static/ubq_samples/sample_2.jpg',
      {
        ...layout.getPosition(1),
        size: { width: layout.blockWidth, height: layout.blockHeight }
      }
    );

    const demoImage3 = await engine.block.addImage(
      'https://img.ly/static/ubq_samples/sample_3.jpg',
      {
        ...layout.getPosition(2),
        size: { width: layout.blockWidth, height: layout.blockHeight }
      }
    );

    const demoImage4 = await engine.block.addImage(
      'https://img.ly/static/ubq_samples/sample_4.jpg',
      {
        ...layout.getPosition(3),
        size: { width: layout.blockWidth, height: layout.blockHeight }
      }
    );

    // Add labels to each demonstration
    const labels = ['From URL', 'From String', 'From Archive', 'From Media'];

    [demoImage1, demoImage2, demoImage3, demoImage4].forEach((block, index) => {
      engine.block.appendChild(demoPage, block);

      // Add text label below each image
      const label = engine.block.create('text');
      const pos = layout.getPosition(index);
      engine.block.setString(label, 'text/text', labels[index]);
      engine.block.setWidth(label, layout.blockWidth);
      engine.block.setPositionX(label, pos.x);
      engine.block.setPositionY(label, pos.y + layout.blockHeight + 10);
      engine.block.setFloat(label, 'text/fontSize', 24);
      engine.block.setColor(label, 'fill/solid/color', {
        r: 0.2,
        g: 0.2,
        b: 0.2,
        a: 1.0
      });
      engine.block.appendChild(demoPage, label);
    });

    // Zoom to show the full grid
    await engine.scene.zoomToBlock(demoPage, {
      padding: 40
    });
  }
}

export default Example;
```

This guide covers how to load saved CE.SDK scenes and create scenes from media files.

## Understanding Import Methods

CE.SDK provides several approaches for importing designs:

- **Scene files** – Load lightweight JSON files that reference assets by URL
- **Archives** – Load self-contained packages that bundle scenes with all assets ([See dedicated guide](./open-the-editor/import-design/from-archive.md))
- **Media imports** – Create editable designs from source images or videos

## Import from other Design Tools

CE.SDK provides specialized importers that convert files from Photoshop (`.psd`) and InDesign (`.indd`) into editable scenes. These importers preserve layers, text, effects, and design structure.

## Load Saved CE.SDK Scenes

Load previously saved scenes to resume editing work. CE.SDK provides three methods depending on your source.

### From a URL

Use `engine.scene.loadFromURL()` to load scenes from a server or cloud storage. This works well for cloud-based editing where users access designs from any device.

```typescript highlight-load-from-url
    // URL to a saved CE.SDK scene file
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const sceneUrl =
      'https://cdn.img.ly/assets/demo/v3/ly.img.template/templates/cesdk_postcard_1.scene';

    // Load the scene from remote URL
    // await engine.scene.loadFromURL(sceneUrl);

    // The scene is now loaded and ready for editing
    // All blocks and properties from the saved scene are restored
```

The engine fetches the scene file asynchronously and replaces the current scene with the loaded content. All asset URLs referenced in the scene must remain accessible for the scene to render correctly.

### From a String

Use `engine.scene.loadFromString()` when you have scene content as a string from local storage, a database, or a previous `engine.scene.saveToString()` call.

```typescript highlight-load-from-string
    // Scene content as a string (from localStorage, database, or saveToString())
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const savedSceneString = '{ /* scene JSON content */ }';

    // Load the scene from string content
    // await engine.scene.loadFromString(savedSceneString);

    // The scene is restored from the string representation
    // This is useful for offline storage or database persistence
```

This approach works well for offline-first applications or when integrating with custom storage systems that return scene data as strings.

### From an Archive URL

For self-contained packages that bundle the scene with all assets, use archives. See the [Import Design from Archive](./open-the-editor/import-design/from-archive.md) guide for complete details on working with archive files.

## Create Scenes from Media

Create editable scenes directly from images or videos.

### From Images

Use `engine.scene.createFromImage()` to create a design based on an existing image. This creates a scene sized to the image dimensions with the image as the primary content.

```typescript highlight-create-from-image
    // Create an editable scene from an existing image
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const imageUrl = 'https://img.ly/static/ubq_samples/sample_1.jpg';

    // Create a scene sized to the image dimensions
    // await engine.scene.createFromImage(imageUrl);

    // The image becomes the base content, ready for editing
    // You can now add text, shapes, effects, etc.
```

The scene is ready for editing. You can add text, shapes, effects, and other design elements on top of the base image.

### From Videos

Use `engine.scene.createFromVideo()` to create a scene configured for video mode with timeline controls.

```typescript highlight-create-from-video
    // Create a video editing scene from an existing video
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const videoUrl =
      'https://img.ly/static/ubq_samples/videos/pexels-drone-footage-of-a-surfer-by-ben-chewar-5368886_360p.mp4';

    // Create a scene configured for video mode
    // await engine.scene.createFromVideo(videoUrl);

    // The scene is set up with timeline controls for video editing
```

The scene is set up for video editing with timeline support and video-specific features.

## Choosing the Right Import Method

Choose your import method based on your source and requirements:

- **Resuming previous work?** Use `engine.scene.loadFromURL()` or `engine.scene.loadFromString()` for scenes you previously saved with CE.SDK.

- **Need self-contained files?** Use archives that bundle scenes with all assets ([see guide](./open-the-editor/import-design/from-archive.md)).

- **Coming from design tools?** Use the respective importers to convert Photoshop or InDesign files.

- **Starting from media?** Use `engine.scene.createFromImage()` or `engine.scene.createFromVideo()` to build editable scenes from source files.

## Best Practices

Follow these recommendations for reliable and maintainable import workflows:

### Error Handling

Always wrap import operations in try-catch blocks to handle failures gracefully:

```typescript
try {
  await engine.scene.loadFromURL(sceneUrl);
} catch (error) {
  // Show user-friendly error message
  console.error('Failed to load scene:', error);
  // Optionally fall back to a default scene
  await engine.scene.create();
}
```

Provide specific error messages based on failure type (network errors, invalid files, CORS issues).

## Working with Loaded Scenes

Modify loaded scenes immediately using CE.SDK's editing APIs. All blocks are accessible for modification.

```typescript highlight-modify-loaded-scene
// Find elements in the loaded scene
// const textBlocks = engine.block.findByType('text');
// if (textBlocks.length > 0) {
//   engine.block.setString(textBlocks[0], 'text/text', 'Scene Imported & Modified');
//   // Scene loads can be undone: engine.editor.undo();
// }
```

Scene loads can be reverted using `engine.editor.undo()` if you need to return to the previous state.

## Performance Considerations

Consider these factors when importing designs to ensure optimal performance:

### File Size and Loading Time

- **Scene files** are typically small (10-100KB) and load quickly since they only contain structure and asset references
- **Archives** can be large (1MB-100MB+) depending on bundled assets, requiring more time to download and extract
- **Image/video imports** depend on source media size - a 4K image may take several seconds to process

Show loading indicators for imports that may take more than 500ms to complete.

### Network Performance

When loading from URLs:

- Use CDN-hosted resources for faster downloads and reduced latency
- Consider compression for scene files stored on your servers
- Implement retry logic for network failures
- Cache frequently loaded scenes in browser storage to avoid redundant network requests

### Memory Management

- Large scenes with many blocks and high-resolution assets consume more browser memory
- Archives extract their contents into memory during loading
- Video imports may require significant memory for processing
- Consider limiting the number of simultaneous scene loads in multi-scene applications

### Browser Limitations

Different browsers have varying capabilities:

- **File size limits**: Some browsers limit blob sizes to 500MB-2GB
- **Network timeouts**: Long-running downloads may timeout (typically 2-5 minutes)
- **Memory constraints**: Mobile browsers have tighter memory limits than desktop
- **CORS restrictions**: Cross-origin asset loading requires proper CORS headers

### Optimization Strategies

Improve import performance with these approaches:

- **Preload frequently used scenes** during idle time
- **Lazy load assets** by using archives with progressive extraction (for very large files)
- **Compress source media** before creating scenes to reduce file sizes
- **Use appropriate formats** - archives for portability, scene files for speed
- **Implement caching** to avoid re-downloading unchanged scenes

## Troubleshooting

**Scene fails to load with asset errors**

When a scene loads but displays missing images or fonts, the asset URLs referenced in the scene are likely inaccessible. Check that:

- All asset URLs are still valid and return the resources
- CORS headers allow fetching assets from their URLs (for cross-origin requests)
- Network connectivity allows reaching the asset servers

**Design tool import fails**

Import failures from Photoshop or InDesign files typically occur when:

- The file format isn't supported (verify `.psd` for Photoshop, `.indd` for InDesign)
- The file is corrupted or incomplete
- The importer service isn't properly configured

**Media file fails to load**

When `createFromImage()` or `createFromVideo()` fails:

- Verify the media URL is accessible and returns the file
- Check that the file format is supported (common formats: JPG, PNG, MP4, WebM)
- Ensure CORS headers allow fetching the media resource for cross-origin requests

## API Reference

| Method                                     | Purpose                                     |
| ------------------------------------------ | ------------------------------------------- |
| `engine.scene.loadFromURL(url)`            | Load scene from remote URL                  |
| `engine.scene.loadFromString(content)`     | Load scene from string content              |
| `engine.scene.loadFromArchiveURL(url)`     | Load archived scene with bundled assets     |
| `engine.scene.createFromImage(url)`        | Create editable scene from image            |
| `engine.scene.createFromVideo(url)`        | Create video editing scene from video       |
| `engine.scene.saveToString()`              | Save scene to string for later loading      |
| `engine.scene.saveToArchive()`             | Save scene with assets as ZIP archive       |



---

## Related Pages

- [From InDesign](./open-the-editor/import-design/from-indesign.md) - Import Adobe InDesign files (IDML format) into CE.SDK, converting them into editable scenes while preserving text, shapes, images, and positioning.
- [From Photoshop](./open-the-editor/import-design/from-photoshop.md) - Import Adobe Photoshop (PSD) files into CE.SDK, converting them into editable scenes while preserving layers, text, shapes, and positioning.
- [Import Design from Archive](./open-the-editor/import-design/from-archive.md) - Load self-contained CE.SDK archive files that bundle scene structure with all referenced assets for portable, reliable design imports.


---

## More Resources

- **[Angular Documentation Index](https://img.ly/angular.md)** - Browse all Angular documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./angular.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support