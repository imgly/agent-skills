> This is one page of the CE.SDK React `@cesdk/engine` API reference. For a complete overview, see the [React Documentation Index](https://img.ly/docs/cesdk/react.md) or the [engine API Index](./api/engine.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

```ts
function _combineProperties<T>(properties, options?): _ReadonlyReactiveProperty<T>;
```

Combines multiple reactive properties into a single reactive property.

Similar to `combineLatest` from RxJS but simpler. Emits whenever any source emits.

## Type Parameters

| Type Parameter |
| ------ |
| `T` *extends* `any`\[] |

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `properties` | \{ \[K in string | number | symbol]: \_ReadonlyReactiveProperty\<T\[K]> } | Array of reactive properties to combine |
| `options?` | `Pick`\<[`_ReactivePropertyOptions`](./api/engine/interfaces/reactivepropertyoptions.md)\<`T`>, `"equals"`> | Configuration options |

## Returns

[`_ReadonlyReactiveProperty`](./api/engine/interfaces/readonlyreactiveproperty.md)\<`T`>

A reactive property containing an array of values

## Example

```typescript
const x = createReactiveProperty(0);
const y = createReactiveProperty(0);

const position = combineProperties([x, y]);

position.subscribe(([xVal, yVal]) => {
  console.log(`Position: (${xVal}, ${yVal})`);
});
```


---

## More Resources

- **[React Documentation Index](https://img.ly/docs/cesdk/react.md)** - Browse all React documentation
- **[engine API Reference](./api/engine.md)** - Full engine API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./react.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support