> This is one page of the CE.SDK Electron `@cesdk/cesdk-js` API reference. For a complete overview, see the [Electron Documentation Index](https://img.ly/docs/cesdk/electron.md) or the [cesdk-js API Index](./api/cesdk-js.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

Interface representing an image block in the user interface inspector.

- `crop`: Optional element or boolean indicating whether the crop section should be shown.
- `filters`: Optional element or boolean indicating whether the filters section should be shown.
- `adjustments`: Optional element or boolean indicating whether the adjustments section should be shown.
- `effects`: Optional element or boolean indicating whether the effects section should be shown.
- `blur`: Optional element or boolean indicating whether the blur section should be shown.

## Deprecated

Use `cesdk.feature.enable()` for image-related features instead.

## Extends

- [`UserInterfaceInspectorBlock`](./api/cesdk-js/documentation/namespaces/userinterfaceelements/interfaces/userinterfaceinspectorblock.md)

## Properties

| Property | Type | Description |
| ------ | ------ | ------ |
|  ~~`crop?`~~ | | `boolean` | [`UserInterfaceElement`](./api/cesdk-js/documentation/namespaces/userinterfaceelements/interfaces/userinterfaceelement.md) | **Deprecated** Use `cesdk.feature.enable('ly.img.crop')` instead. |
|  ~~`filters?`~~ | | `boolean` | [`UserInterfaceElement`](./api/cesdk-js/documentation/namespaces/userinterfaceelements/interfaces/userinterfaceelement.md) | **Deprecated** Use `cesdk.feature.enable('ly.img.filter')` instead. |
|  ~~`adjustments?`~~ | | `boolean` | [`UserInterfaceElement`](./api/cesdk-js/documentation/namespaces/userinterfaceelements/interfaces/userinterfaceelement.md) | **Deprecated** Use `cesdk.feature.enable('ly.img.adjustment')` instead. |
|  ~~`effects?`~~ | | `boolean` | [`UserInterfaceElement`](./api/cesdk-js/documentation/namespaces/userinterfaceelements/interfaces/userinterfaceelement.md) | **Deprecated** Use `cesdk.feature.enable('ly.img.effect')` instead. |
|  ~~`blur?`~~ | | `boolean` | [`UserInterfaceElement`](./api/cesdk-js/documentation/namespaces/userinterfaceelements/interfaces/userinterfaceelement.md) | **Deprecated** Use `cesdk.feature.enable('ly.img.blur')` instead. |


---

## More Resources

- **[Electron Documentation Index](https://img.ly/docs/cesdk/electron.md)** - Browse all Electron documentation
- **[cesdk-js API Reference](./api/cesdk-js.md)** - Full cesdk-js API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./electron.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support