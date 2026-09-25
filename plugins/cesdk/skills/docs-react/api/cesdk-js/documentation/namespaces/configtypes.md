> This is one page of the CE.SDK React `@cesdk/cesdk-js` API reference. For a complete overview, see the [React Documentation Index](https://img.ly/docs/cesdk/react.md) or the [cesdk-js API Index](./api/cesdk-js.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

## Type Aliases

| Type Alias | Description |
| ------ | ------ |
| [A11y](./api/cesdk-js/documentation/namespaces/configtypes/type-aliases/a11y.md) | Represents the accessibility settings for the Creative Editor SDK. This type defines the heading hierarchy start level, which can be a number between 1 and 6. |
| [~~Callbacks~~](./api/cesdk-js/documentation/namespaces/configtypes/type-aliases/callbacks.md) | Represents the callback functions for various events in the Creative Editor SDK. This interface defines functions for handling back, close, share, save, load, load archive, download, export, upload, and unsupported browser events. |
| [CombinedConfiguration](./api/cesdk-js/documentation/namespaces/configtypes/type-aliases/combinedconfiguration.md) | Represents the combined configuration for the Creative Editor SDK. This type combines the `CESDKConfiguration` with the `EngineConfiguration` while omitting the `presets` key. |
| [I18n](./api/cesdk-js/documentation/namespaces/configtypes/type-aliases/i18n.md) | Represents the internationalization settings for the Creative Editor SDK. This type defines a record of locale strings to translation objects. Note: this will append keys and not override keys. |
| [OnUploadCallback](./api/cesdk-js/documentation/namespaces/configtypes/type-aliases/onuploadcallback.md) | Represents the upload callback function for the Creative Editor SDK. This type defines a function that handles file uploads, including progress updates and context. |
| [OnUploadOptions](./api/cesdk-js/documentation/namespaces/configtypes/type-aliases/onuploadoptions.md) | Represents the options for the upload callback in the Creative Editor SDK. This type defines the supported MIME types for uploads. |
| [Scale](./api/cesdk-js/documentation/namespaces/configtypes/type-aliases/scale.md) | Represents the base scale values for the Creative Editor SDK. This type defines the concrete scales that can be rendered. |
| [ScaleConfig](./api/cesdk-js/documentation/namespaces/configtypes/type-aliases/scaleconfig.md) | Represents the scale configuration for the Creative Editor SDK. This can be a concrete scale or a function that returns a scale based on viewport properties. |
| [ScaleFn](./api/cesdk-js/documentation/namespaces/configtypes/type-aliases/scalefn.md) | A function that returns a scale value based on viewport properties. This allows for dynamic scale selection based on runtime conditions. |
| [Theme](./api/cesdk-js/documentation/namespaces/configtypes/type-aliases/theme.md) | Represents the base theme values for the Creative Editor SDK. This type defines the concrete themes that can be rendered. |
| [ThemeConfig](./api/cesdk-js/documentation/namespaces/configtypes/type-aliases/themeconfig.md) | Represents the theme configuration for the Creative Editor SDK. This can be a concrete theme, a function that returns a theme, or 'system' to use OS preference. |
| [ThemeFn](./api/cesdk-js/documentation/namespaces/configtypes/type-aliases/themefn.md) | A function that returns a theme value. This allows for dynamic theme selection based on runtime conditions. The function is evaluated lazily whenever the theme is accessed. |

## Interfaces

| Interface | Description |
| ------ | ------ |
| [BleedMarginOptions](./api/cesdk-js/documentation/namespaces/configtypes/interfaces/bleedmarginoptions.md) | Represents the bleed margin configuration options for a single design unit type in the Creative Editor SDK. This interface defines the dropdown options and the default bleed margin value. |
| [FontSizeOptions](./api/cesdk-js/documentation/namespaces/configtypes/interfaces/fontsizeoptions.md) | Represents the font size configuration options in the Creative Editor SDK. This interface defines the dropdown options for font sizes. |
| [UIOptionsForSingleDesignUnit](./api/cesdk-js/documentation/namespaces/configtypes/interfaces/uioptionsforsingledesignunit.md) | Represents the UI options for a single design unit type in the Creative Editor SDK. This interface defines the bleed margin options for a single design unit. |
| [UIOptionsPerDesignUnit](./api/cesdk-js/documentation/namespaces/configtypes/interfaces/uioptionsperdesignunit.md) | Represents the UI options for different design units in the Creative Editor SDK. This interface defines the UI options for millimeters, pixels, and inches. |
| [UploadCallbackContext](./api/cesdk-js/documentation/namespaces/configtypes/interfaces/uploadcallbackcontext.md) | Represents the context for the upload callback in the Creative Editor SDK. This interface defines the source ID and an optional group for the upload context. |


---

## More Resources

- **[React Documentation Index](https://img.ly/docs/cesdk/react.md)** - Browse all React documentation
- **[cesdk-js API Reference](./api/cesdk-js.md)** - Full cesdk-js API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./react.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support