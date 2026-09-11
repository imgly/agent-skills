> This is one page of the CE.SDK React `@cesdk/engine` API reference. For a complete overview, see the [React Documentation Index](https://img.ly/docs/cesdk/react.md) or the [engine API Index](./api/engine.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

```ts
function _createTrackedProperty<T, U>(
   getter, 
   setter, 
   source, 
options?): _ReactiveProperty<T>;
```

Creates a reactive property that tracks a source and updates based on a getter/setter.

This is useful for wrapping engine properties or complex state logic.

## Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `T` | - |
| `U` | `any` |

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `getter` | () => `T` | Function to get current value |
| `setter` | (`value`) => `void` | Function to update value |
| `source` | (`listener`) => [`_Unsubscribe`](./api/engine/type-aliases/unsubscribe.md) | Source to track for updates |
| `options?` | `Pick`\<[`_ReactivePropertyOptions`](./api/engine/interfaces/reactivepropertyoptions.md)\<`T`>, `"equals"`> | Configuration options |

## Returns

[`_ReactiveProperty`](./api/engine/interfaces/reactiveproperty.md)\<`T`>

A reactive property

## Example

```typescript
const settings = createTrackedProperty(
  // Getter
  () => {
    const camera = engine.block.findByType('camera')[0];
    return {
      width: engine.block.getFloat(camera, 'camera/resolution/width'),
      height: engine.block.getFloat(camera, 'camera/resolution/height')
    };
  },
  // Setter
  ({ width, height }) => {
    const camera = engine.block.findByType('camera')[0];
    engine.block.setFloat(camera, 'camera/resolution/width', width);
    engine.block.setFloat(camera, 'camera/resolution/height', height);
  },
  // Source to track
  onCameraUpdated,
  // Options
  { equals: isEqual }
);
```


---

## More Resources

- **[React Documentation Index](https://img.ly/docs/cesdk/react.md)** - Browse all React documentation
- **[engine API Reference](./api/engine.md)** - Full engine API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./react.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support