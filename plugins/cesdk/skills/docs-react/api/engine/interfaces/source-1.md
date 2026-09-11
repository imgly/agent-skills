> This is one page of the CE.SDK React `@cesdk/engine` API reference. For a complete overview, see the [React Documentation Index](https://img.ly/docs/cesdk/react.md) or the [engine API Index](./api/engine.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

A source that can emit values to subscribed listeners

## Type Parameters

| Type Parameter |
| ------ |
| `T` |

```ts
_Source(listener): _Unsubscribe;
```

A source that can emit values to subscribed listeners

## Parameters

| Parameter | Type |
| ------ | ------ |
| `listener` | [`_Listener`](./api/engine/type-aliases/listener.md)\<`T`> |

## Returns

[`_Unsubscribe`](./api/engine/type-aliases/unsubscribe.md)

## Properties

| Property | Type |
| ------ | ------ |
|  `emit` | (`value`) => `void` |


---

## More Resources

- **[React Documentation Index](https://img.ly/docs/cesdk/react.md)** - Browse all React documentation
- **[engine API Reference](./api/engine.md)** - Full engine API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./react.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support