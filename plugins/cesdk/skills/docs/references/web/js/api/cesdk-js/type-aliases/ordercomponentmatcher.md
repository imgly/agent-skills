> This is one page of the CE.SDK Vanilla JS/TS `@cesdk/cesdk-js` API reference. For a complete overview, see the [Vanilla JS/TS Documentation Index](https://img.ly/docs/cesdk/js.md) or the [cesdk-js API Index](./api/cesdk-js.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

```ts
type OrderComponentMatcher<C> = 
  | "first"
  | "last"
  | number
  | C["id"]
  | Partial<C>
  | ((component, index) => boolean);
```

Represents a matcher for order components.

The OrderComponentMatcher type defines the possible matchers for order components.
It includes predefined matchers for component IDs, partial components, and custom matchers.

## Type Parameters

| Type Parameter |
| ------ |
| `C` *extends* [`OrderComponent`](./api/cesdk-js/interfaces/ordercomponent.md) |


---

## More Resources

- **[Vanilla JS/TS Documentation Index](https://img.ly/docs/cesdk/js.md)** - Browse all Vanilla JS/TS documentation
- **[cesdk-js API Reference](./api/cesdk-js.md)** - Full cesdk-js API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./js.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support