> This is one page of the CE.SDK Next.js `@cesdk/engine` API reference. For a complete overview, see the [Next.js Documentation Index](https://img.ly/docs/cesdk/nextjs.md) or the [engine API Index](./api/engine.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

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
| `listener` | [`\_Listener`](./api/engine/type-aliases/listener.md)\<`T`> |

## Returns

[`\_Unsubscribe`](./api/engine/type-aliases/unsubscribe.md)

## Properties

| Property | Type |
| ------ | ------ |
|  `emit` | (`value`) => `void` |


---

## More Resources

- **[Next.js Documentation Index](https://img.ly/docs/cesdk/nextjs.md)** - Browse all Next.js documentation
- **[engine API Reference](./api/engine.md)** - Full engine API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./nextjs.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support