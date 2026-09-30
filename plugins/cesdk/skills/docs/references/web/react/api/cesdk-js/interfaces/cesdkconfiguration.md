> This is one page of the CE.SDK React `@cesdk/cesdk-js` API reference. For a complete overview, see the [React Documentation Index](https://img.ly/docs/cesdk/react.md) or the [cesdk-js API Index](./api/cesdk-js.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

Represents the configuration settings for the Creative Editor SDK.
This interface defines various settings such as locale, theme, development mode, user interface, internationalization,
accessibility, callbacks, feature flags, and logger.

## Properties

| Property | Type | Description |
| ------ | ------ | ------ |
|  ~~`locale`~~ | `string` | **Deprecated** The `locale` property is deprecated. Please use the `setLocale()` property to configure localization. |
|  ~~`theme`~~ | [`ThemeConfig`](./api/cesdk-js/documentation/namespaces/configtypes/type-aliases/themeconfig.md) | **Deprecated** The `theme` property is deprecated. Please use `ui.setTheme()` to configure theming. |
|  `devMode` | `boolean` | - |
|  `ui` | [`UserInterface`](./api/cesdk-js/interfaces/userinterface.md) | - |
|  ~~`i18n`~~ | [`I18n`](./api/cesdk-js/documentation/namespaces/configtypes/type-aliases/i18n.md) | **Deprecated** The `i18n` property is deprecated. Please use the `setTranslations()` method to configure internationalization. |
|  `a11y` | [`A11y`](./api/cesdk-js/documentation/namespaces/configtypes/type-aliases/a11y.md) | - |
|  ~~`callbacks`~~ | [`Callbacks`](./api/cesdk-js/documentation/namespaces/configtypes/type-aliases/callbacks.md) | **Deprecated** The `callbacks` property is deprecated in favor of the `cesdk.actions` API and navigation bar order APIs. |
|  `featureFlags?` | `_EngineConfiguration` | - |
|  `logger` | `_EngineConfiguration` | - |


---

## More Resources

- **[React Documentation Index](https://img.ly/docs/cesdk/react.md)** - Browse all React documentation
- **[cesdk-js API Reference](./api/cesdk-js.md)** - Full cesdk-js API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./react.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support