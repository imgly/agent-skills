> This is one page of the CE.SDK Svelte `@cesdk/engine` API reference. For a complete overview, see the [Svelte Documentation Index](https://img.ly/docs/cesdk/svelte.md) or the [engine API Index](./api/engine.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

```ts
function _makeSource<T>(): _Source<T>;
```

Creates a simple event source that can emit values to subscribed listeners.

This is the most basic building block - a pub/sub pattern without state management.

## Type Parameters

| Type Parameter |
| ------ |
| `T` |

## Returns

[`_Source`](./api/engine/interfaces/source-1.md)\<`T`>

A source function with an emit method

## Example

```typescript
const onResize = makeSource<{ width: number; height: number }>();

// Subscribe
const unsubscribe = onResize((size) => {
  console.log('New size:', size);
});

// Emit
onResize.emit({ width: 800, height: 600 });

// Cleanup
unsubscribe();
```


---

## More Resources

- **[Svelte Documentation Index](https://img.ly/docs/cesdk/svelte.md)** - Browse all Svelte documentation
- **[engine API Reference](./api/engine.md)** - Full engine API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./svelte.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support