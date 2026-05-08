> This is one page of the CE.SDK React `@cesdk/cesdk-js` API reference. For a complete overview, see the [React Documentation Index](https://img.ly/docs/cesdk/react.md) or the [cesdk-js API Index](./api/cesdk-js.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

```ts
type InferOrderContext<A> = A extends UIArea ? OrderContextFor<A> : A extends UIArea[] ? OrderContextFor<A[number]> : OrderContext;
```

Infers the order context type from a UI area specifier.

- Single area: returns area-specific context type
- Array of areas: returns union of context types
- Glob pattern: returns base OrderContext (all areas)

## Type Parameters

| Type Parameter |
| ------ |
| `A` *extends* [`UIAreaSpecifier`](./api/cesdk-js/type-aliases/uiareaspecifier.md) |


---

## More Resources

- **[React Documentation Index](https://img.ly/docs/cesdk/react.md)** - Browse all React documentation
- **[cesdk-js API Reference](./api/cesdk-js.md)** - Full cesdk-js API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./react.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support