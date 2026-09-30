> This is one page of the CE.SDK Electron `@cesdk/cesdk-js` API reference. For a complete overview, see the [Electron Documentation Index](https://img.ly/docs/cesdk/electron.md) or the [cesdk-js API Index](./api/cesdk-js.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

Interface representing the blocks in the user interface inspector.

- `opacity`: Optional element or boolean indicating whether the opacity block should be shown.
- `transform`: Optional element or boolean indicating whether the transform block should be shown.
- `trim`: Optional element or boolean indicating whether the trim block should be shown.
- `//ly.img.ubq/text`: Optional text block configuration.
- `//ly.img.ubq/page`: Optional page block configuration.
- `//ly.img.ubq/graphic`: Optional graphic block configuration.

## Deprecated

Use `cesdk.feature.enable()` instead.

## Properties

| Property | Type | Description |
| ------ | ------ | ------ |
|  ~~`opacity?`~~ | | `boolean` | [`UserInterfaceElement`](./api/cesdk-js/documentation/namespaces/userinterfaceelements/interfaces/userinterfaceelement.md) | **Deprecated** Use `cesdk.feature.enable('ly.img.opacity')` instead. |
|  ~~`transform?`~~ | | `boolean` | [`UserInterfaceElement`](./api/cesdk-js/documentation/namespaces/userinterfaceelements/interfaces/userinterfaceelement.md) | **Deprecated** Use `cesdk.feature.enable('ly.img.transform.position')`, `cesdk.feature.enable('ly.img.transform.size')`, `cesdk.feature.enable('ly.img.transform.rotation')`, or `cesdk.feature.enable('ly.img.transform.flip')` instead. |
|  ~~`trim?`~~ | | `boolean` | [`UserInterfaceElement`](./api/cesdk-js/documentation/namespaces/userinterfaceelements/interfaces/userinterfaceelement.md) | **Deprecated** Use `cesdk.feature.enable('ly.img.trim')` instead. |
|  ~~`//ly.img.ubq/text?`~~ | [`UserInterfaceInspectorBlockText`](./api/cesdk-js/documentation/namespaces/userinterfaceelements/interfaces/userinterfaceinspectorblocktext.md) | **Deprecated** Use `cesdk.feature.enable()` for text-related features instead. |
|  ~~`//ly.img.ubq/page?`~~ | [`UserInterfaceInspectorBlockPage`](./api/cesdk-js/documentation/namespaces/userinterfaceelements/interfaces/userinterfaceinspectorblockpage.md) | **Deprecated** Use `cesdk.feature.enable()` for page-related features instead. |
|  ~~`//ly.img.ubq/graphic?`~~ | [`UserInterfaceInspectorBlockGraphic`](./api/cesdk-js/documentation/namespaces/userinterfaceelements/interfaces/userinterfaceinspectorblockgraphic.md) | **Deprecated** Use `cesdk.feature.enable()` for graphic-related features instead. |


---

## More Resources

- **[Electron Documentation Index](https://img.ly/docs/cesdk/electron.md)** - Browse all Electron documentation
- **[cesdk-js API Reference](./api/cesdk-js.md)** - Full cesdk-js API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./electron.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support