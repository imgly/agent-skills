> This is one page of the CE.SDK Electron `@cesdk/engine` API reference. For a complete overview, see the [Electron Documentation Index](https://img.ly/docs/cesdk/electron.md) or the [engine API Index](./api/engine.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

```ts
function _createDerivedProperty<T, S>(
   sources, 
   derive, 
options?): _ReadonlyReactiveProperty<T>;
```

Creates a derived reactive property from one or more sources.

The value is computed from source values using a derivation function.
Updates are memoized (only emit when derived value changes).

## Type Parameters

| Type Parameter |
| ------ |
| `T` |
| `S` *extends* `any`\[] |

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `sources` | \{ \[K in string | number | symbol]: \_ReadonlyReactiveProperty\<S\[K]> | \_Source\<S\[K]> } | Array of reactive properties or sources to track |
| `derive` | (...`values`) => `T` | Function that computes the derived value from source values |
| `options?` | `Pick`\<[`_ReactivePropertyOptions`](./api/engine/interfaces/reactivepropertyoptions.md)\<`T`>, `"equals"`> | Configuration options |

## Returns

[`_ReadonlyReactiveProperty`](./api/engine/interfaces/readonlyreactiveproperty.md)\<`T`>

A read-only reactive property

## Example

```typescript
const width = createReactiveProperty(800);
const height = createReactiveProperty(600);

const area = createDerivedProperty(
  [width, height],
  (w, h) => w * h
);

area.subscribe((value) => console.log('Area:', value));
width.update(1000); // Logs: "Area: 600000"
```


---

## More Resources

- **[Electron Documentation Index](https://img.ly/docs/cesdk/electron.md)** - Browse all Electron documentation
- **[engine API Reference](./api/engine.md)** - Full engine API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./electron.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support