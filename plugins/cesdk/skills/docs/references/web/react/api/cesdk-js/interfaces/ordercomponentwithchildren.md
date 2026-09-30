> This is one page of the CE.SDK React `@cesdk/cesdk-js` API reference. For a complete overview, see the [React Documentation Index](https://img.ly/docs/cesdk/react.md) or the [cesdk-js API Index](./api/cesdk-js.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

Represents a custom dock component.

The CustomDockComponent interface defines the structure of a custom dock component.
It includes properties for the ID and payload.

## Extends

- [`OrderComponent`](./api/cesdk-js/interfaces/ordercomponent.md)\<`I`>

## Extended by

- [`CanvasMenuOptionsComponent`](./api/cesdk-js/interfaces/canvasmenuoptionscomponent.md)

## Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `I` *extends* [`ComponentId`](./api/cesdk-js/type-aliases/componentid.md) | - |
| `C` | [`OrderComponent`](./api/cesdk-js/interfaces/ordercomponent.md)\<`I`> |

## Indexable

```ts
[key: string]: unknown
```

## Properties

| Property | Type | Description | Inherited from |
| ------ | ------ | ------ | ------ |
|  `id` | `I` | - | [`OrderComponent`](./api/cesdk-js/interfaces/ordercomponent.md).[`id`](./api/cesdk-js/interfaces/ordercomponent.md) |
|  `key?` | `string` | - | [`OrderComponent`](./api/cesdk-js/interfaces/ordercomponent.md).[`key`](./api/cesdk-js/interfaces/ordercomponent.md) |
|  `children?` | (`OrderComponentWithChildren`\<`I`, `C`> | `I` | `C`)\[] | A list of children as order components | - |


---

## More Resources

- **[React Documentation Index](https://img.ly/docs/cesdk/react.md)** - Browse all React documentation
- **[cesdk-js API Reference](./api/cesdk-js.md)** - Full cesdk-js API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./react.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support