> This is one page of the CE.SDK React `@cesdk/cesdk-js` API reference. For a complete overview, see the [React Documentation Index](https://img.ly/docs/cesdk/react.md) or the [cesdk-js API Index](./api/cesdk-js.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

Interface representing the navigation in the user interface.

- `position`: Optional position of the navigation.
- `title`: Optional title for the navigation.
- `action`: Optional object containing actions for the navigation.

## Extends

- [`UserInterfaceElement`](./api/cesdk-js/documentation/namespaces/userinterfaceelements/interfaces/userinterfaceelement.md)

## Properties

| Property | Type | Description | Inherited from |
| ------ | ------ | ------ | ------ |
|  `show?` | `boolean` | - | [`UserInterfaceElement`](./api/cesdk-js/documentation/namespaces/userinterfaceelements/interfaces/userinterfaceelement.md).[`show`](./api/cesdk-js/documentation/namespaces/userinterfaceelements/interfaces/userinterfaceelement.md) |
|  `position?` | [`NavigationPosition`](./api/cesdk-js/documentation/namespaces/userinterfaceelements/enumerations/navigationposition.md) | - | - |
|  `title?` | `string` | - | - |
|  ~~`action?`~~ | `object` | **Deprecated** Use the Order API to configure the actions instead. | - |
| `action.close?` | | `boolean` | [`UserInterfaceElement`](./api/cesdk-js/documentation/namespaces/userinterfaceelements/interfaces/userinterfaceelement.md) | **Deprecated** Use the Order API to configure the actions instead. | - |
| `action.back?` | | `boolean` | [`UserInterfaceElement`](./api/cesdk-js/documentation/namespaces/userinterfaceelements/interfaces/userinterfaceelement.md) | **Deprecated** Use the Order API to configure the actions instead. | - |
| `action.save?` | | `boolean` | [`UserInterfaceElement`](./api/cesdk-js/documentation/namespaces/userinterfaceelements/interfaces/userinterfaceelement.md) | **Deprecated** Use the Order API to configure the actions instead. | - |
| `action.export?` | | `boolean` | [`UserInterfaceExportAction`](./api/cesdk-js/documentation/namespaces/userinterfaceelements/interfaces/userinterfaceexportaction.md) | **Deprecated** Use the Order API to configure the actions instead. | - |
| `action.share?` | | `boolean` | [`UserInterfaceElement`](./api/cesdk-js/documentation/namespaces/userinterfaceelements/interfaces/userinterfaceelement.md) | **Deprecated** Use the Order API to configure the actions instead. | - |
| `action.load?` | | `boolean` | [`UserInterfaceElement`](./api/cesdk-js/documentation/namespaces/userinterfaceelements/interfaces/userinterfaceelement.md) | **Deprecated** Use the Order API to configure the actions instead. | - |
| `action.download?` | | `boolean` | [`UserInterfaceElement`](./api/cesdk-js/documentation/namespaces/userinterfaceelements/interfaces/userinterfaceelement.md) | **Deprecated** Use the Order API to configure the actions instead. | - |
| `action.custom?` | [`UserInterfaceCustomAction`](./api/cesdk-js/documentation/namespaces/userinterfaceelements/interfaces/userinterfacecustomaction.md)\[] | **Deprecated** Use the Order API to configure the actions instead. | - |


---

## More Resources

- **[React Documentation Index](https://img.ly/docs/cesdk/react.md)** - Browse all React documentation
- **[cesdk-js API Reference](./api/cesdk-js.md)** - Full cesdk-js API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./react.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support