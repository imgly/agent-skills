> This is one page of the CE.SDK Next.js `@cesdk/engine` API reference. For a complete overview, see the [Next.js Documentation Index](https://img.ly/docs/cesdk/nextjs.md) or the [engine API Index](./api/engine.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

```ts
function _mergeSources(...sources): (listener) => _Unsubscribe;
```

Merges multiple event sources into a single source that emits when any source emits.

This is useful for tracking properties that depend on multiple independent events.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| ...`sources` | (`listener`) => [`_Unsubscribe`](./api/engine/type-aliases/unsubscribe.md)\[] | Event source functions to merge |

## Returns

A merged source that emits when any source emits

(`listener`) => [`_Unsubscribe`](./api/engine/type-aliases/unsubscribe.md)

## Example

```typescript
const zoomChanged = engine.scene.onZoomLevelChanged;
const dpiChanged = engine.scene.onDpiChanged;

const zoomOrDpiChanged = mergeSources(zoomChanged, dpiChanged);

// Now use with createTrackedProperty
const normalizedZoom = createTrackedProperty(
  () => engine.scene.getZoomLevel() / getDpi(),
  (value) => engine.scene.setZoomLevel(value * getDpi()),
  zoomOrDpiChanged
);
```


---

## More Resources

- **[Next.js Documentation Index](https://img.ly/docs/cesdk/nextjs.md)** - Browse all Next.js documentation
- **[engine API Reference](./api/engine.md)** - Full engine API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./nextjs.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support