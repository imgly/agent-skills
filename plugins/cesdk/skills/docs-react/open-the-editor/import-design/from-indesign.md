> This is one page of the CE.SDK React documentation. For a complete overview, see the [React Documentation Index](https://img.ly/react.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Open the Editor](./open-the-editor.md) > [Import a Design](./open-the-editor/import-design.md) > [From InDesign](./open-the-editor/import-design/from-indesign.md)

---

Import Adobe InDesign (IDML) files into CE.SDK, converting them into editable scenes while preserving text, shapes, images, and positioning.

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/heads/main.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/main/guides-open-the-editor-import-design-from-indesign-browser)
>
> - [Open in StackBlitz](https://stackblitz.com/~/github.com/imgly/cesdk-web-examples/tree/main/guides-open-the-editor-import-design-from-indesign-browser)
>
> - [Live demo](https://img.ly/examples/guides-open-the-editor-import-design-from-indesign-browser/)

![Import from InDesign](https://img.ly/docs/cesdk/./assets/browser.hero.webp)

The `@imgly/idml-importer` package converts InDesign IDML files into CE.SDK scene format, preserving design structure for editing or export. This guide focuses on enabling end-users to upload their own IDML files directly in the browser and load them into the CE.SDK editor. For batch conversion of template libraries at build-time, see the [server guide](./open-the-editor/import-design/from-indesign.md).

```typescript file=@cesdk_web_examples/guides-open-the-editor-import-design-from-indesign-browser/browser.ts reference-only
import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';
import type {
  AssetResult,
  AssetQueryData,
  AssetsQueryResult
} from '@cesdk/engine';
import type { TypefaceResolver } from '@imgly/idml-importer';
import { IDMLParser, addGoogleFontsAssetLibrary } from '@imgly/idml-importer';
import packageJson from './package.json';

/**
 * CE.SDK Plugin: Import from InDesign Guide
 *
 * Demonstrates how to import Adobe InDesign IDML files into CE.SDK:
 * - Creating a custom asset source for IDML templates
 * - Adding a custom nav bar button to upload IDML files
 * - Parsing IDML files with the IDML importer
 * - Displaying import warnings to users
 *
 * Note: In-library file uploads for custom asset sources will be supported
 * in a future CE.SDK release. This guide demonstrates using a custom nav bar
 * button as an alternative approach for user file uploads.
 */

// Asset source ID for IDML library
const IDML_SOURCE_ID = 'idml-files';

// Base URL for IDML template files
const IDML_BASE_URL =
  'https://staticimgly.com/imgly/docs-reference-files-temp/indesign-template-import';

// Sample IDML files for the asset library
// These files are hosted on the IMG.LY CDN from the showcases-app public folder
const SAMPLE_IDML_FILES: AssetResult[] = [
  {
    id: 'idml-socialmedia',
    label: 'Social Media',
    tags: ['sample', 'idml', 'social', 'marketing'],
    meta: {
      uri: `${IDML_BASE_URL}/socialmedia.idml`,
      thumbUri: `${IDML_BASE_URL}/socialmedia-thumb@2x.png`,
      mimeType: 'application/vnd.adobe.indesign-idml-package',
      width: 1080,
      height: 1080
    }
  },
  {
    id: 'idml-poster',
    label: 'Poster',
    tags: ['sample', 'idml', 'poster', 'print'],
    meta: {
      uri: `${IDML_BASE_URL}/poster.idml`,
      thumbUri: `${IDML_BASE_URL}/poster-thumb@2x.png`,
      mimeType: 'application/vnd.adobe.indesign-idml-package',
      width: 1240,
      height: 1754
    }
  },
  {
    id: 'idml-postcard',
    label: 'Postcard',
    tags: ['sample', 'idml', 'postcard', 'print'],
    meta: {
      uri: `${IDML_BASE_URL}/postcard.idml`,
      thumbUri: `${IDML_BASE_URL}/postcard-thumb@2x.png`,
      mimeType: 'application/vnd.adobe.indesign-idml-package',
      width: 1050,
      height: 600
    }
  }
];

class Example implements EditorPlugin {
  name = packageJson.name;

  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    const engine = cesdk.engine;

    // Initialize CE.SDK with Google Fonts support for IDML text matching
    await cesdk.addDefaultAssetSources();
    await cesdk.addDemoAssetSources({
      sceneMode: 'Design',
      withUploadAssetSources: true
    });

    // Register Google Fonts before parsing IDML files for best font matching
    await addGoogleFontsAssetLibrary(engine);

    // Optional: Create a custom font resolver for advanced font mapping
    // Use this when you need to map InDesign fonts to specific alternatives,
    // use enterprise fonts, or implement custom fallback logic
    const customFontResolver: TypefaceResolver = async (fontParams, eng) => {
      const { family, style, weight } = fontParams;

      // Define font mappings from InDesign fonts to available alternatives
      const fontMappings: Record<string, string> = {
        Arial: 'Open Sans',
        Helvetica: 'Inter',
        'Helvetica Neue': 'Inter',
        'Times New Roman': 'Lora',
        Georgia: 'Merriweather'
      };

      // Use mapped font or original family name
      const targetFamily = fontMappings[family] || family;

      // Search for the font in available typefaces
      const result = await eng.asset.findAssets('ly.img.typeface', {
        query: targetFamily,
        page: 0,
        perPage: 10
      });

      if (result.assets.length === 0) {
        console.warn(`Font "${family}" not found, using default fallback`);
        return null; // Let the parser use its default fallback
      }

      // Get the typeface from the asset payload
      const asset = result.assets[0];
      const typeface = asset.payload?.typeface;
      if (!typeface) return null;

      // Find the best matching font variant (weight and style)
      const matchingFont =
        typeface.fonts.find(
          (f: { weight?: string; style?: string }) =>
            f.weight === weight && f.style === style
        ) ||
        typeface.fonts.find((f: { weight?: string }) => f.weight === weight) ||
        typeface.fonts[0];

      return { typeface, font: matchingFont };
    };

    // Create an initial design scene
    await cesdk.createDesignScene();

    // Helper function to import IDML from URL or buffer
    const importIdml = async (
      source: string | ArrayBuffer,
      sourceName: string
    ) => {
      console.log(`Processing IDML: ${sourceName}`);

      // Get buffer from URL or use directly
      let buffer: ArrayBuffer;
      if (typeof source === 'string') {
        const response = await fetch(source);
        buffer = await response.arrayBuffer();
      } else {
        buffer = source;
      }

      // Parse the IDML file using the IDML importer
      // The addGoogleFontsAssetLibrary() call above enables automatic font matching
      // For custom font mapping, pass fontResolver as 4th parameter (see customFontResolver example)
      const parser = await IDMLParser.fromFile(
        engine,
        buffer,
        (content: string) =>
          new DOMParser().parseFromString(content, 'text/xml')
        // Optional: customFontResolver for advanced font mapping
      );
      await parser.parse();

      // Verify pages were imported successfully
      const pages = engine.scene.getPages();
      if (pages.length === 0) {
        console.error('No pages imported from IDML');
        throw new Error('No pages could be imported from the IDML file');
      }
      console.log(`Successfully imported ${pages.length} page(s)`);

      // Save the imported scene as an archive for editor loading
      const sceneArchive = await engine.scene.saveToArchive();
      const archiveUrl = URL.createObjectURL(sceneArchive);

      // Optional: Save scene as JSON string with stable URLs instead of archive
      // This is useful when storing scenes in a database or referencing CDN-hosted assets
      // By default, IDML images use transient buffer:// URLs that only work with saveToArchive()
      // To use saveToString(), relocate transient resources to permanent URLs first:

      // Mock upload function - replace with your actual backend upload logic
      const uploadToBackend = async (data: Uint8Array): Promise<string> => {
        // In production, upload the data to your CDN/storage and return the permanent URL
        // For this example, we create a blob URL to demonstrate the workflow
        const blob = new Blob([data], { type: 'image/png' });
        return URL.createObjectURL(blob);
      };

      const transientResources = engine.editor.findAllTransientResources();
      for (const resource of transientResources) {
        const { URL: bufferUri, size } = resource;
        const data = engine.editor.getBufferData(bufferUri, 0, size);
        const permanentUrl = await uploadToBackend(data);
        engine.editor.relocateResource(bufferUri, permanentUrl);
      }
      const sceneString = await engine.scene.saveToString();

      // Load the archived scene into the editor
      await cesdk.engine.scene.loadFromArchiveURL(archiveUrl);

      // Verify scene loaded correctly
      const loadedPages = engine.scene.getPages();
      console.log(
        `IDML imported successfully with ${loadedPages.length} page(s)`
      );

      // Zoom to fit the imported page
      await cesdk.actions.run('zoom.toPage', { page: 'first', autoFit: true });

      // Clean up object URL
      URL.revokeObjectURL(archiveUrl);
    };

    // Add custom asset source for IDML templates
    engine.asset.addSource({
      id: IDML_SOURCE_ID,

      async findAssets(
        queryData: AssetQueryData
      ): Promise<AssetsQueryResult<AssetResult>> {
        let assets = SAMPLE_IDML_FILES;

        // Filter by query if provided
        if (queryData.query) {
          const query = queryData.query.toLowerCase();
          assets = assets.filter(
            (a) =>
              a.label?.toLowerCase().includes(query) ||
              a.tags?.some((t) => t.toLowerCase().includes(query))
          );
        }

        return {
          assets,
          total: assets.length,
          currentPage: queryData.page,
          nextPage: undefined
        };
      },

      async applyAsset(asset: AssetResult): Promise<number | undefined> {
        if (!asset.meta?.uri) {
          console.error('Asset has no URI');
          return undefined;
        }

        await importIdml(asset.meta.uri as string, asset.label || asset.id);
        return undefined; // Scene replaced, no new block created
      }
    });

    // Set labels for the asset source and library entry
    cesdk.i18n.setTranslations({
      en: {
        [`libraries.${IDML_SOURCE_ID}.label`]: 'IDML Files',
        'libraries.idml-library-entry.label': 'InDesign Templates'
      }
    });

    // Configure the asset library UI to show the IDML source
    cesdk.ui.addAssetLibraryEntry({
      id: 'idml-library-entry',
      sourceIds: [IDML_SOURCE_ID],
      previewLength: 3,
      previewBackgroundType: 'contain',
      gridBackgroundType: 'contain',
      gridColumns: 2
    });

    // Add IDML library to the dock and remove the default Templates entry
    const existingDockOrder = cesdk.ui.getComponentOrder({ in: 'ly.img.dock' });
    const filteredDockOrder = existingDockOrder.filter(
      (entry) => entry.key !== 'ly.img.template'
    );
    cesdk.ui.setComponentOrder({ in: 'ly.img.dock' }, [
      {
        id: 'ly.img.assetLibrary.dock',
        key: 'idml-library-dock',
        label: 'InDesign Templates',
        icon: '@imgly/Template',
        entries: ['idml-library-entry']
      },
      ...filteredDockOrder
    ]);

    // Add a custom nav bar button for uploading and importing IDML files
    // Uses cesdk.utils.loadFile() to open the browser's file picker
    cesdk.ui.registerComponent('idml.uploadButton', ({ builder }) => {
      builder.Button('idml.uploadButton', {
        label: 'Load IDML File',
        icon: '@imgly/Upload',
        variant: 'regular',
        color: 'accent',
        onClick: async () => {
          const buffer = await cesdk.utils.loadFile({
            accept: '.idml,application/vnd.adobe.indesign-idml-package',
            returnType: 'arrayBuffer'
          });
          await importIdml(buffer, 'uploaded.idml');
        }
      });
    });

    // Add the upload button to the right side of the navigation bar
    cesdk.ui.setComponentOrder({ in: 'ly.img.navigation.bar' }, [
      ...cesdk.ui.getComponentOrder({ in: 'ly.img.navigation.bar' }),
      'idml.uploadButton'
    ]);

    // Open the IDML Templates library by default
    cesdk.ui.openPanel('//ly.img.panel/assetLibrary', {
      payload: {
        entries: ['idml-library-entry'],
        title: 'InDesign Templates'
      }
    });

    // Override the importScene action to support IDML files alongside standard formats
    // This integrates IDML import with the default import workflow
    cesdk.actions.register(
      'importScene',
      async ({
        format = 'scene'
      }: {
        format?: 'scene' | 'archive' | 'idml';
      }) => {
        if (format === 'idml') {
          // Handle IDML import using cesdk.utils.loadFile
          const buffer = await cesdk.utils.loadFile({
            accept: '.idml,application/vnd.adobe.indesign-idml-package',
            returnType: 'arrayBuffer'
          });
          await importIdml(buffer, 'imported.idml');
        } else if (format === 'scene') {
          // Handle standard .scene files
          const scene = await cesdk.utils.loadFile({
            accept: '.scene',
            returnType: 'text'
          });
          await cesdk.engine.scene.loadFromString(scene);
          await cesdk.actions.run('zoom.toPage', { page: 'first' });
        } else {
          // Handle archive files (.zip)
          const blobURL = await cesdk.utils.loadFile({
            accept: '.zip',
            returnType: 'objectURL'
          });
          try {
            await cesdk.engine.scene.loadFromArchiveURL(blobURL);
          } finally {
            URL.revokeObjectURL(blobURL);
          }
          await cesdk.actions.run('zoom.toPage', { page: 'first' });
        }
      }
    );
  }
}

export default Example;
```

## Installation

Install the `@imgly/idml-importer` package alongside CE.SDK:

```bash
npm install @imgly/idml-importer @cesdk/cesdk-js
```

The browser environment uses the native `DOMParser` API for XML parsing, which requires no additional dependencies.

## Supported Elements

The IDML importer preserves the following InDesign elements:

- **Layer structure** - Element grouping and hierarchy
- **Positioning** - X/Y coordinates, rotation, and transparency
- **Text elements** - Font family, bold/italic styles
- **Shapes** - Rectangles, ovals, polygons, lines
- **Fills** - Solid color fills and gradients
- **Strokes** - Color, weight, and alignment
- **Images** - Embedded images only (linked images require embedding before export)

## Setting Up Font Matching

Text elements in IDML files reference fonts that may not be available in CE.SDK. Use `addGoogleFontsAssetLibrary()` to register Google Fonts as a font source before parsing:

```typescript highlight=highlight-setup
    // Initialize CE.SDK with Google Fonts support for IDML text matching
    await cesdk.addDefaultAssetSources();
    await cesdk.addDemoAssetSources({
      sceneMode: 'Design',
      withUploadAssetSources: true
    });

    // Register Google Fonts before parsing IDML files for best font matching
    await addGoogleFontsAssetLibrary(engine);
```

Call this function on the engine before parsing IDML files. The importer attempts to match fonts from the IDML with available Google Fonts. For fonts not found, the importer uses a fallback font.

## Parsing the IDML File

Use `IDMLParser.fromFile()` with the browser's native `DOMParser` for XML parsing. After parsing, the scene is immediately available in the engine:

```typescript highlight=highlight-parse-idml
      // Get buffer from URL or use directly
      let buffer: ArrayBuffer;
      if (typeof source === 'string') {
        const response = await fetch(source);
        buffer = await response.arrayBuffer();
      } else {
        buffer = source;
      }

      // Parse the IDML file using the IDML importer
      // The addGoogleFontsAssetLibrary() call above enables automatic font matching
      // For custom font mapping, pass fontResolver as 4th parameter (see customFontResolver example)
      const parser = await IDMLParser.fromFile(
        engine,
        buffer,
        (content: string) =>
          new DOMParser().parseFromString(content, 'text/xml')
        // Optional: customFontResolver for advanced font mapping
      );
      await parser.parse();
```

The parser creates a new scene in the engine with all supported IDML elements converted to CE.SDK blocks.

## Checking Import Results

Verify the import succeeded by checking the page count. If no pages were imported, the IDML file may have contained only unsupported elements:

```typescript highlight=highlight-check-warnings
// Verify pages were imported successfully
const pages = engine.scene.getPages();
if (pages.length === 0) {
  console.error('No pages imported from IDML');
  throw new Error('No pages could be imported from the IDML file');
}
console.log(`Successfully imported ${pages.length} page(s)`);
```

Log warnings about any unsupported features to help users understand what couldn't be converted.

## Saving as Archive

After parsing, save the imported scene as an archive. This creates a portable bundle containing the scene and all its assets:

```typescript highlight=highlight-save-archive
// Save the imported scene as an archive for editor loading
const sceneArchive = await engine.scene.saveToArchive();
const archiveUrl = URL.createObjectURL(sceneArchive);
```

Archives can be stored, shared, or loaded later using `loadFromArchiveURL()`.

## Saving Scenes with Stable URLs

By default, the IDML importer creates internal `buffer://` URLs for imported images. These are transient resources that work well when saving to an archive (`engine.scene.saveToArchive()`), which bundles all assets together.

However, if you want to save scenes as JSON strings (`engine.scene.saveToString()`) with stable, permanent URLs (e.g., for storing in a database or referencing CDN-hosted assets), you need to relocate the transient resources first.

### Why Relocate?

- **Scene Archives** (`saveToArchive`): Include all assets in a single ZIP file. Transient `buffer://` URLs work fine.
- **Scene Strings** (`saveToString`): Only contain references to assets. Transient URLs won't work when reloading the scene later. You need permanent URLs (e.g., `https://`).

### How to Relocate Transient Resources

After parsing the IDML file, use CE.SDK's native APIs to find and relocate all transient resources:

```typescript highlight=highlight-stable-urls
      // Optional: Save scene as JSON string with stable URLs instead of archive
      // This is useful when storing scenes in a database or referencing CDN-hosted assets
      // By default, IDML images use transient buffer:// URLs that only work with saveToArchive()
      // To use saveToString(), relocate transient resources to permanent URLs first:

      // Mock upload function - replace with your actual backend upload logic
      const uploadToBackend = async (data: Uint8Array): Promise<string> => {
        // In production, upload the data to your CDN/storage and return the permanent URL
        // For this example, we create a blob URL to demonstrate the workflow
        const blob = new Blob([data], { type: 'image/png' });
        return URL.createObjectURL(blob);
      };

      const transientResources = engine.editor.findAllTransientResources();
      for (const resource of transientResources) {
        const { URL: bufferUri, size } = resource;
        const data = engine.editor.getBufferData(bufferUri, 0, size);
        const permanentUrl = await uploadToBackend(data);
        engine.editor.relocateResource(bufferUri, permanentUrl);
      }
      const sceneString = await engine.scene.saveToString();
```

The relocation workflow:

1. Find all transient resources using `engine.editor.findAllTransientResources()`
2. Extract binary data for each resource using `engine.editor.getBufferData()`
3. Upload the data to your backend or CDN
4. Relocate the resource URL using `engine.editor.relocateResource()`
5. Save to string with `engine.scene.saveToString()` - all URLs will now be permanent

### Note on Font URLs

When using the default font resolver with Google Fonts, the resulting scene string will contain Google CDN URLs for fonts. If you need fonts hosted on your own infrastructure, configure a custom font resolver instead of using the default Google Fonts integration.

## Loading into the Editor

Load the archived scene into the CE.SDK editor for user editing:

```typescript highlight=highlight-load-editor
      // Load the archived scene into the editor
      await cesdk.engine.scene.loadFromArchiveURL(archiveUrl);

      // Verify scene loaded correctly
      const loadedPages = engine.scene.getPages();
      console.log(
        `IDML imported successfully with ${loadedPages.length} page(s)`
      );

      // Zoom to fit the imported page
      await cesdk.actions.run('zoom.toPage', { page: 'first', autoFit: true });
```

After loading, verify the scene contains at least one page. The imported design is now ready for editing in the CE.SDK editor.

## API Reference

The `@imgly/idml-importer` package exports the following key APIs:

| API | Description |
|-----|-------------|
| `IDMLParser.fromFile(engine, buffer, xmlParser)` | Creates a parser instance from an IDML file buffer. The `xmlParser` function converts XML strings to DOM documents. |
| `parser.parse()` | Parses the IDML file and creates a CE.SDK scene. Returns when parsing is complete. |
| `addGoogleFontsAssetLibrary(engine)` | Registers Google Fonts as a font source for text element matching. Call before parsing. |

## Limitations

The IDML importer has the following limitations:

- **Linked images** - Only embedded images are supported. Linked images become placeholders. Embed all images in InDesign before exporting to IDML.
- **Text flow** - Text that flows between multiple text frames is not supported and may appear duplicated.
- **Image fitting** - Images shrunk inside their frames may not render as expected.
- **PDF content** - Embedded PDF content is replaced with placeholders.
- **Page sizes** - Different page sizes within the same document are not supported. All pages use the first page's dimensions.
- **Advanced text** - Complex text formatting beyond bold/italic may not be preserved.

## Pre-Import Checklist

Before exporting from InDesign:

1. **Embed all images** - File > Links, select linked images, and choose "Embed Link" from the panel menu
2. **Flatten complex effects** - Some effects may not translate to CE.SDK
3. **Use standard fonts** - Consider using Google Fonts for better compatibility
4. **Export as IDML** - File > Export > InDesign Markup (IDML)

## Troubleshooting

**Import fails silently:** Check the console for error messages. Verify the file is a valid IDML file exported correctly from InDesign.

**Missing images:** Ensure images were embedded in InDesign before exporting. Linked images are replaced with placeholders.

**Text appears with wrong font:** Ensure `addGoogleFontsAssetLibrary()` is called before parsing. If the original font isn't available in Google Fonts, a fallback is used.

**Text is duplicated:** This can happen when text flows between multiple frames. The IDML importer doesn't support linked text frames.

**Pages have wrong size:** All pages use the first page's dimensions. Ensure consistent page sizes in the InDesign document.



---

## More Resources

- **[React Documentation Index](https://img.ly/react.md)** - Browse all React documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./react.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support