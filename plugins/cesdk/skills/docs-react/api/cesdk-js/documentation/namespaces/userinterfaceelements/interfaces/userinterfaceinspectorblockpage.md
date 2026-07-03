> This is one page of the CE.SDK React `@cesdk/cesdk-js` API reference. For a complete overview, see the [React Documentation Index](https://img.ly/docs/cesdk/react.md) or the [cesdk-js API Index](./api/cesdk-js.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

Interface representing a page block in the user interface inspector.

- `format`: Optional element or boolean indicating whether the format section should be shown.
- `manage`: Optional element or boolean indicating whether the manage section should be shown.
- `maxDuration`: Optional number controlling the maximum allowed duration of a page, if in video mode.
- `crop`: Optional element or boolean indicating whether the crop section should be shown.
- `filters`: Optional element or boolean indicating whether the filters section should be shown.
- `adjustments`: Optional element or boolean indicating whether the adjustments section should be shown.
- `effects`: Optional element or boolean indicating whether the effects section should be shown.
- `blur`: Optional element or boolean indicating whether the blur section should be shown.

## Deprecated

Use `cesdk.feature.enable()` for page-related features instead.

## Extends

- [`UserInterfaceInspectorBlock`](./api/cesdk-js/documentation/namespaces/userinterfaceelements/interfaces/userinterfaceinspectorblock.md)

## Properties

| Property | Type | Description |
| ------ | ------ | ------ |
|  ~~`format?`~~ | | `boolean` | [`UserInterfaceElement`](./api/cesdk-js/documentation/namespaces/userinterfaceelements/interfaces/userinterfaceelement.md) | **Deprecated** Use `cesdk.feature.enable('ly.img.page.resize')` instead. |
|  ~~`manage?`~~ | | `boolean` | [`UserInterfaceElement`](./api/cesdk-js/documentation/namespaces/userinterfaceelements/interfaces/userinterfaceelement.md) | **Deprecated** Use `cesdk.feature.enable('ly.img.page.add')`, `cesdk.feature.enable('ly.img.page.move')`, or `cesdk.feature.enable('ly.img.duplicate')` instead. |
|  ~~`maxDuration?`~~ | `number` | **Deprecated** Use feature API instead. Controls the maximum allowed duration of a page, if in video mode. |
|  ~~`crop?`~~ | | `boolean` | [`UserInterfaceElement`](./api/cesdk-js/documentation/namespaces/userinterfaceelements/interfaces/userinterfaceelement.md) | **Deprecated** Use `cesdk.feature.enable('ly.img.crop')` instead. |
|  ~~`filters?`~~ | | `boolean` | [`UserInterfaceElement`](./api/cesdk-js/documentation/namespaces/userinterfaceelements/interfaces/userinterfaceelement.md) | **Deprecated** Use `cesdk.feature.enable('ly.img.filter')` instead. |
|  ~~`adjustments?`~~ | | `boolean` | [`UserInterfaceElement`](./api/cesdk-js/documentation/namespaces/userinterfaceelements/interfaces/userinterfaceelement.md) | **Deprecated** Use `cesdk.feature.enable('ly.img.adjustment')` instead. |
|  ~~`effects?`~~ | | `boolean` | [`UserInterfaceElement`](./api/cesdk-js/documentation/namespaces/userinterfaceelements/interfaces/userinterfaceelement.md) | **Deprecated** Use `cesdk.feature.enable('ly.img.effect')` instead. |
|  ~~`blur?`~~ | | `boolean` | [`UserInterfaceElement`](./api/cesdk-js/documentation/namespaces/userinterfaceelements/interfaces/userinterfaceelement.md) | **Deprecated** Use `cesdk.feature.enable('ly.img.blur')` instead. |


---

## More Resources

- **[React Documentation Index](https://img.ly/docs/cesdk/react.md)** - Browse all React documentation
- **[cesdk-js API Reference](./api/cesdk-js.md)** - Full cesdk-js API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./react.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support