> This is one page of the CE.SDK React `@cesdk/cesdk-js` API reference. For a complete overview, see the [React Documentation Index](https://img.ly/docs/cesdk/react.md) or the [cesdk-js API Index](./api/cesdk-js.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

```ts
type PanelOptions<T> = object;
```

Represents the options for a panel in the Creative Editor SDK.
This interface defines the options for a panel, including whether it is closable by the user,
its position, whether it is floating, and its payload.

## Type Parameters

| Type Parameter |
| ------ |
| `T` *extends* [`PanelId`](./api/cesdk-js/type-aliases/panelid.md) |

## Properties

| Property | Type |
| ------ | ------ |
|  `closableByUser?` | `boolean` |
|  `position?` | [`PanelPosition`](./api/cesdk-js/type-aliases/panelposition.md) |
|  `floating?` | `boolean` |
|  `payload?` | [`PanelPayload`](./api/cesdk-js/type-aliases/panelpayload.md)\<`T`> |


---

## More Resources

- **[React Documentation Index](https://img.ly/docs/cesdk/react.md)** - Browse all React documentation
- **[cesdk-js API Reference](./api/cesdk-js.md)** - Full cesdk-js API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./react.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support