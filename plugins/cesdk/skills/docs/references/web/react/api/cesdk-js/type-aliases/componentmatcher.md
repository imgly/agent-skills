> This is one page of the CE.SDK React `@cesdk/cesdk-js` API reference. For a complete overview, see the [React Documentation Index](https://img.ly/docs/cesdk/react.md) or the [cesdk-js API Index](./api/cesdk-js.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

```ts
type ComponentMatcher<C> = 
  | "first"
  | "last"
  | number
  | C["id"]
  | ComponentGlobPattern
  | Partial<C>
  | ((component, index) => boolean);
```

Unified component matcher type supporting all matching strategies.

- `'first'` / `'last'` - Match first or last component
- `number` - Match by index (0, 1, -1, etc.)
- `C['id']` - Match by exact ID (with autocomplete for known IDs)
- `ComponentGlobPattern` - Match by glob pattern (e.g., `'ly.img.*'`)
- `Partial<C>` - Match by partial properties (e.g., `{ id: 'x', key: 'y' }`)
- `(component, index) => boolean` - Custom predicate function

## Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `C` *extends* [`OrderComponent`](./api/cesdk-js/interfaces/ordercomponent.md) | [`OrderComponent`](./api/cesdk-js/interfaces/ordercomponent.md) |


---

## More Resources

- **[React Documentation Index](https://img.ly/docs/cesdk/react.md)** - Browse all React documentation
- **[cesdk-js API Reference](./api/cesdk-js.md)** - Full cesdk-js API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./react.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support