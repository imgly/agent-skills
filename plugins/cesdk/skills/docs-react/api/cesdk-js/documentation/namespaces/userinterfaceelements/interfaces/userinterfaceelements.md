> This is one page of the CE.SDK React `@cesdk/cesdk-js` API reference. For a complete overview, see the [React Documentation Index](https://img.ly/docs/cesdk/react.md) or the [cesdk-js API Index](./api/cesdk-js.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

Defines the configuration for user interface elements, including panels, dock, libraries, blocks, navigation, and inspector bar.

## Properties

| Property | Type | Description |
| ------ | ------ | ------ |
|  ~~`view?`~~ | `"advanced"` | `"default"` | **Deprecated** Please use `cesdk.ui.setView` and `cesdk.ui.getView` instead. **Example** `// Before (deprecated): const config = { ui: { elements: { view: 'default' // or 'advanced' } } }; // After (recommended): const view = 'default'; // or 'advanced' cesdk.ui.setView(view);` |
|  `panels?` | `object` | - |
| `panels.inspector?` | | `boolean` | [`UserInterfaceInspector`](./api/cesdk-js/documentation/namespaces/userinterfaceelements/interfaces/userinterfaceinspector.md) | **Deprecated** Plese use `cesdk.feature.enable('ly.img.inspector')`, `cesdk.ui.setPanelPosition('//ly.img.panel/inspector')` and `cesdk.ui.setPanelFloating('//ly.img.panel/inspector')` instead. |
| `panels.settings?` | | `boolean` | [`UserInterfaceSettings`](./api/cesdk-js/documentation/namespaces/userinterfaceelements/interfaces/userinterfacesettings.md) | **Deprecated** Please use `cesdk.feature.enable('ly.img.settings')`, `cesdk.ui.setPanelPosition('//ly.img.panel/settings')` and `cesdk.ui.setPanelFloating('//ly.img.panel/settings')` instead. |
| `panels.assetLibrary?` | | `boolean` | [`UserInterfaceAssetLibrary`](./api/cesdk-js/documentation/namespaces/userinterfaceelements/interfaces/userinterfaceassetlibrary.md) | **Deprecated** Please use `cesdk.feature.enable('ly.img.library.panel')`, `cesdk.ui.setPanelPosition('//ly.img.panel/assetLibrary')` and `cesdk.ui.setPanelFloating('//ly.img.panel/assetLibrary')` instead. |
|  `dock?` | `object` | - |
| `dock.show?` | `boolean` | **Deprecated** Please use `cesdk.feature.enable('ly.img.dock')` instead. |
| `dock.iconSize?` | `"normal"` | `"large"` | - |
| `dock.hideLabels?` | `boolean` | - |
|  `libraries?` | `object` | - |
| `libraries.insert?` | `object` | - |
| `libraries.insert.autoClose?` | `boolean` | (() => `boolean`) | - |
| `libraries.insert.floating?` | `boolean` | **Deprecated** Please use `cesdk.ui.setPanelFloating('//ly.img.panel/assetLibrary')` instead. |
| `libraries.insert.backgroundTrackLibraryEntries?` | `string`\[] | ((`entries`) => `string`\[]) | **Deprecated** please use the cesdk.actions API to register an action for 'addClip' and implement your own logic. **Example** `cesdk.actions.register('addClip', async () => { cesdk.ui.openPanel('//ly.img.panel/assetLibrary', { payload: { entries: ['ly.img.video', 'ly.img.image'] } }); });` |
| `libraries.replace?` | `object` | - |
| `libraries.replace.autoClose?` | `boolean` | (() => `boolean`) | - |
| `libraries.replace.floating?` | `boolean` | **Deprecated** Please use `cesdk.ui.setPanelFloating('//ly.img.panel/replaceAssetLibrary')` instead. |
|  ~~`blocks?`~~ | [`UserInterfaceInspectorBlocks`](./api/cesdk-js/documentation/namespaces/userinterfaceelements/interfaces/userinterfaceinspectorblocks.md) | **Deprecated** Use `cesdk.feature.enable()` instead. |
|  `navigation?` | [`UserInterfaceNavigation`](./api/cesdk-js/documentation/namespaces/userinterfaceelements/interfaces/userinterfacenavigation.md) | - |
|  `inspectorBar?` | | `boolean` | [`UserInterfaceElement`](./api/cesdk-js/documentation/namespaces/userinterfaceelements/interfaces/userinterfaceelement.md) | - |


---

## More Resources

- **[React Documentation Index](https://img.ly/docs/cesdk/react.md)** - Browse all React documentation
- **[cesdk-js API Reference](./api/cesdk-js.md)** - Full cesdk-js API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./react.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support