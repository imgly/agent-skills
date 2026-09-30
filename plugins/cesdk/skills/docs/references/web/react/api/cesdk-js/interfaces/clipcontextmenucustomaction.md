> This is one page of the CE.SDK React `@cesdk/cesdk-js` API reference. For a complete overview, see the [React Documentation Index](https://img.ly/docs/cesdk/react.md) or the [cesdk-js API Index](./api/cesdk-js.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

Interface representing a generic custom action in the clip context menu.
Requires a `key` to uniquely identify the action and a `label` for display.

## Extends

- [`OrderComponent`](./api/cesdk-js/interfaces/ordercomponent.md)

## Indexable

```ts
[key: string]: unknown
```

## Properties

| Property | Type | Overrides |
| ------ | ------ | ------ |
|  `id` | `"ly.img.video.clip.menu.action"` | [`OrderComponent`](./api/cesdk-js/interfaces/ordercomponent.md).[`id`](./api/cesdk-js/interfaces/ordercomponent.md) |
|  `key` | `string` | [`OrderComponent`](./api/cesdk-js/interfaces/ordercomponent.md).[`key`](./api/cesdk-js/interfaces/ordercomponent.md) |
|  `onClick` | () => `void` | `Promise`\<`void`> | - |
|  `label` | `string` | - |
|  `icon?` | `string` | - |
|  `isDisabled?` | `boolean` | - |


---

## More Resources

- **[React Documentation Index](https://img.ly/docs/cesdk/react.md)** - Browse all React documentation
- **[cesdk-js API Reference](./api/cesdk-js.md)** - Full cesdk-js API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./react.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support