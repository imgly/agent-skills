> This is one page of the CE.SDK React `@cesdk/cesdk-js` API reference. For a complete overview, see the [React Documentation Index](https://img.ly/docs/cesdk/react.md) or the [cesdk-js API Index](./api/cesdk-js.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

Specifies the configuration for the user interface of the Creative Editor SDK.

The `UserInterface` interface provides a set of properties that control the appearance
and behavior of the user interface. These options include settings for the base URL,
scale, elements, stylesheets, visibility, small viewport optimization, color palette,
color libraries, typeface libraries, page presets libraries, crop presets libraries,
and page formats.

## Properties

| Property | Type | Description |
| ------ | ------ | ------ |
|  `baseURL?` | `string` | - |
|  ~~`scale?`~~ | [`ScaleConfig`](./api/cesdk-js/documentation/namespaces/configtypes/type-aliases/scaleconfig.md) | **Deprecated** The `scale` property is deprecated. Please use `cesdk.ui.setScale()` and `cesdk.ui.getScale()` methods instead for runtime scale management. |
|  `elements?` | [`UserInterfaceElements`](./api/cesdk-js/documentation/namespaces/userinterfaceelements/interfaces/userinterfaceelements.md) | - |
|  `stylesheets?` | `object` | - |
| `stylesheets.disableShadowDOM?` | `boolean` | - |
|  `hide?` | `boolean` | - |
|  `smallViewportOptimization?` | `boolean` | - |
|  ~~`colorPalette?`~~ | `PaletteColor`\[] | **Deprecated** Add a local asset source using `cesdk.engine.asset.addLocalSource()` and populate it with color assets, then use `cesdk.ui.updateAssetLibraryEntry('ly.img.colors', { sourceIds: [...] })` to configure which sources to display. **Example** `// Before (deprecated): const config = { ui: { colorPalette: ['#FF0000', '#00FF00', '#0000FF'] } }; // After (recommended): // Add a local source for custom colors engine.asset.addLocalSource('my.custom.colors'); engine.asset.addAssetToSource('my.custom.colors', { id: 'red', label: { en: 'Red' }, payload: { color: { colorSpace: 'sRGB', r: 1.0, g: 0.0, b: 0.0, a: 1.0 } } }); // ... add more colors // Update the asset library entry to use your custom source cesdk.ui.updateAssetLibraryEntry('ly.img.colors', { sourceIds: ['ly.img.scene.colors', 'my.custom.colors'] });` |
|  ~~`colorLibraries?`~~ | `string`\[] | **Deprecated** Add asset sources using `cesdk.engine.asset.addAssetSource()` or `cesdk.engine.asset.addLocalSource()`, then use `cesdk.ui.updateAssetLibraryEntry('ly.img.colors', { sourceIds: [...] })` to configure which sources to display. **Example** `// Before (deprecated): const config = { ui: { colorLibraries: ['ly.img.color.palette', 'my.custom.colors'] } }; // After (recommended): // Add a local source for custom colors engine.asset.addLocalSource('my.custom.colors'); // Add color assets to the source engine.asset.addAssetToSource('my.custom.colors', { id: 'custom-color-1', payload: { color: { colorSpace: 'sRGB', r: 1.0, g: 0.0, b: 0.0 } } }); // Update the library entry to use your sources cesdk.ui.updateAssetLibraryEntry('ly.img.colors', { sourceIds: ['ly.img.color.palette', 'my.custom.colors'] });` |
|  ~~`typefaceLibraries?`~~ | `string`\[] | **Deprecated** Add asset sources using `cesdk.engine.asset.addAssetSource()` or `cesdk.engine.asset.addLocalSource()`, then use `cesdk.ui.updateAssetLibraryEntry('ly.img.typefaces', { sourceIds: [...] })` to configure which sources to display. **Example** `// Before (deprecated): const config = { ui: { typefaceLibraries: ['ly.img.typeface', 'my.custom.fonts'] } }; // After (recommended): // Add a local source for custom typefaces engine.asset.addLocalSource('my.custom.fonts'); // Add typeface assets to the source engine.asset.addAssetToSource('my.custom.fonts', { id: 'custom-font-1', meta: { uri: 'https://example.com/font.ttf' } }); // Update the library entry to use your sources cesdk.ui.updateAssetLibraryEntry('ly.img.typefaces', { sourceIds: ['ly.img.typeface', 'my.custom.fonts'] });` |
|  ~~`pagePresetsLibraries?`~~ | `string`\[] | ((`engine`) => `string`\[]) | **Deprecated** Add asset sources using `cesdk.engine.asset.addAssetSource()` or `cesdk.engine.asset.addLocalSource()`, then use `cesdk.ui.updateAssetLibraryEntry('ly.img.pagePresets', { sourceIds: ... })` to configure which sources to display. For dynamic source IDs, use a callback function with the new API: `{ sourceIds: ({ engine }) => [...] }` **Example** `// Before (deprecated): const config = { ui: { pagePresetsLibraries: ['ly.img.page.presets'] } }; // After (recommended): // Add a local source for custom page presets engine.asset.addLocalSource('my.custom.pagePresets'); // Add page preset assets to the source engine.asset.addAssetToSource('my.custom.pagePresets', { id: 'custom-preset-1', payload: { transformPreset: { type: 'FixedSize', width: 800, height: 600 } } }); // Update the library entry with dynamic sourceIds cesdk.ui.updateAssetLibraryEntry('ly.img.pagePresets', { sourceIds: ({ engine }) => { return ['ly.img.page.presets', 'my.custom.pagePresets']; } });` |
|  ~~`cropPresetsLibraries?`~~ | `string`\[] | ((`engine`) => `string`\[]) | **Deprecated** Add asset sources using `cesdk.engine.asset.addAssetSource()` or `cesdk.engine.asset.addLocalSource()`, then use `cesdk.ui.updateAssetLibraryEntry('ly.img.cropPresets', { sourceIds: ... })` to configure which sources to display. For dynamic source IDs, use a callback function with the new API: `{ sourceIds: ({ engine }) => [...] }` **Example** `// Before (deprecated): const config = { ui: { cropPresetsLibraries: ['ly.img.crop.presets'] } }; // After (recommended): // Add a local source for custom crop presets engine.asset.addLocalSource('my.custom.cropPresets'); // Add crop preset assets to the source engine.asset.addAssetToSource('my.custom.cropPresets', { id: 'custom-crop-1', payload: { transformPreset: { type: 'FixedAspectRatio', width: 16, height: 9 } } }); // Update the library entry to use your sources cesdk.ui.updateAssetLibraryEntry('ly.img.cropPresets', { sourceIds: ['ly.img.crop.presets', 'my.custom.cropPresets'] });` |
|  ~~`pageFormats?`~~ | `object` | **Deprecated** Add a local asset source using `cesdk.engine.asset.addLocalSource()` and populate it with page format assets, then use `cesdk.ui.updateAssetLibraryEntry('ly.img.pagePresets', { sourceIds: [...] })` to configure which sources to display. **Example** `// Before (deprecated): const config = { ui: { pageFormats: { 'custom-format': { width: 800, height: 600, unit: 'Pixel' } } } }; // After (recommended): // Add a local source for custom page formats engine.asset.addLocalSource('my.custom.pageFormats'); engine.asset.addAssetToSource('my.custom.pageFormats', { id: 'custom-format', label: { en: 'Custom Format' }, payload: { transformPreset: { type: 'FixedSize', width: 800, height: 600, designUnit: 'Pixel' } } }); // Update the asset library entry to use your custom source cesdk.ui.updateAssetLibraryEntry('ly.img.pagePresets', { sourceIds: ['my.custom.pageFormats'] });` |


---

## More Resources

- **[React Documentation Index](https://img.ly/docs/cesdk/react.md)** - Browse all React documentation
- **[cesdk-js API Reference](./api/cesdk-js.md)** - Full cesdk-js API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./react.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support