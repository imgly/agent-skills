> This is one page of the CE.SDK Next.js `@cesdk/cesdk-js` API reference. For a complete overview, see the [Next.js Documentation Index](https://img.ly/docs/cesdk/nextjs.md) or the [cesdk-js API Index](./api/cesdk-js.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

Interface representing a text block in the user interface inspector.

- `advanced`: Optional element or boolean indicating whether the advanced section should be shown.
- `color`: Optional element or boolean indicating whether the color section should be shown.

## Deprecated

Use `cesdk.feature.enable()` for text-related features instead.

## Extends

- [`UserInterfaceInspectorBlock`](./api/cesdk-js/documentation/namespaces/userinterfaceelements/interfaces/userinterfaceinspectorblock.md)

## Properties

| Property | Type | Description |
| ------ | ------ | ------ |
|  ~~`advanced?`~~ | | `boolean` | [`UserInterfaceElement`](./api/cesdk-js/documentation/namespaces/userinterfaceelements/interfaces/userinterfaceelement.md) | **Deprecated** Use `cesdk.feature.enable('ly.img.text.advanced')` instead. |
|  ~~`color?`~~ | | `boolean` | [`UserInterfaceElement`](./api/cesdk-js/documentation/namespaces/userinterfaceelements/interfaces/userinterfaceelement.md) | **Deprecated** Use `cesdk.feature.enable('ly.img.fill')` instead. |


---

## More Resources

- **[Next.js Documentation Index](https://img.ly/docs/cesdk/nextjs.md)** - Browse all Next.js documentation
- **[cesdk-js API Reference](./api/cesdk-js.md)** - Full cesdk-js API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./nextjs.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support