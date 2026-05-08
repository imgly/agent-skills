> This is one page of the CE.SDK React `@cesdk/cesdk-js` API reference. For a complete overview, see the [React Documentation Index](https://img.ly/docs/cesdk/react.md) or the [cesdk-js API Index](./api/cesdk-js.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

```ts
type ActionFunction<T, C> = T extends keyof RegisteredActions ? RegisteredActions[T] : C;
```

Type helper for retrieving the correct action function type based on the action ID.
Returns the strongly-typed action for known actions, or a custom action type for unknown IDs.

## Type Parameters

| Type Parameter | Default type | Description |
| ------ | ------ | ------ |
| `T` *extends* [`ActionId`](./api/cesdk-js/type-aliases/actionid.md) | - | The action ID type |
| `C` | [`CustomActionFunction`](./api/cesdk-js/type-aliases/customactionfunction.md) | The custom action function type (defaults to CustomActionFunction) |


---

## More Resources

- **[React Documentation Index](https://img.ly/docs/cesdk/react.md)** - Browse all React documentation
- **[cesdk-js API Reference](./api/cesdk-js.md)** - Full cesdk-js API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./react.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support