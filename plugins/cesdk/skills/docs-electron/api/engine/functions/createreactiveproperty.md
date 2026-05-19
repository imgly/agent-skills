> This is one page of the CE.SDK Electron `@cesdk/engine` API reference. For a complete overview, see the [Electron Documentation Index](https://img.ly/docs/cesdk/electron.md) or the [engine API Index](./api/engine.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

```ts
function _createReactiveProperty<T>(initialValue, options?): _ReactiveProperty<T>;
```

Creates a reactive property with subscribe, value, and update methods.

This is the main utility for managing state with change notifications.
Values are memoized by default (only emit when value changes).

## Type Parameters

| Type Parameter |
| ------ |
| `T` |

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `initialValue` | `T` | The initial value of the property |
| `options?` | [`_ReactivePropertyOptions`](./api/engine/interfaces/reactivepropertyoptions.md)\<`T`> | Configuration options |

## Returns

[`_ReactiveProperty`](./api/engine/interfaces/reactiveproperty.md)\<`T`>

A reactive property with subscribe, value, and update methods

## Example

```typescript
// Simple value
const zoom = createReactiveProperty(1.0);
zoom.subscribe((value) => console.log('Zoom:', value));
zoom.update(2.0); // Logs: "Zoom: 2.0"

// With custom equality for objects
const settings = createReactiveProperty(
  { width: 800, height: 600 },
  { equals: isEqual }
);

// With initial value emission
const formats = createReactiveProperty(
  defaultFormats,
  { emitOnSubscribe: true }
);
```


---

## More Resources

- **[Electron Documentation Index](https://img.ly/docs/cesdk/electron.md)** - Browse all Electron documentation
- **[engine API Reference](./api/engine.md)** - Full engine API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./electron.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support