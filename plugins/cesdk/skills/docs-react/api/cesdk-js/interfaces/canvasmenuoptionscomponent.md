> This is one page of the CE.SDK React `@cesdk/cesdk-js` API reference. For a complete overview, see the [React Documentation Index](https://img.ly/docs/cesdk/react.md) or the [cesdk-js API Index](./api/cesdk-js.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

Interface representing the canvas menu options dropdown component.
This component can contain children components that are rendered in a dropdown menu.

- `children`: Optional array of child component IDs or components to render in the dropdown.
- `icon`: Optional icon name to display on the dropdown button.
- `variant`: Optional style variant of the dropdown button, either 'regular' or 'plain'.
- `tooltip`: Optional tooltip text to display when hovering over the dropdown button.

## Extends

- [`OrderComponentWithChildren`](./api/cesdk-js/interfaces/ordercomponentwithchildren.md)\<[`CanvasMenuComponentId`](./api/cesdk-js/type-aliases/canvasmenucomponentid.md), [`CanvasMenuActionButton`](./api/cesdk-js/interfaces/canvasmenuactionbutton.md)>

## Indexable

```ts
[key: string]: unknown
```

## Properties

| Property | Type | Description | Overrides | Inherited from |
| ------ | ------ | ------ | ------ | ------ |
|  `id` | `"ly.img.options.canvasMenu"` | - | [`OrderComponentWithChildren`](./api/cesdk-js/interfaces/ordercomponentwithchildren.md).[`id`](./api/cesdk-js/interfaces/ordercomponentwithchildren.md) | - |
|  `icon?` | `string` | - | - | - |
|  `variant?` | `"regular"` | `"plain"` | - | - | - |
|  `tooltip?` | `string` | - | - | - |
|  `key?` | `string` | - | - | [`OrderComponentWithChildren`](./api/cesdk-js/interfaces/ordercomponentwithchildren.md).[`key`](./api/cesdk-js/interfaces/ordercomponentwithchildren.md) |
|  `children?` | ( | [`CanvasMenuActionButton`](./api/cesdk-js/interfaces/canvasmenuactionbutton.md) | [`CanvasMenuComponentId`](./api/cesdk-js/type-aliases/canvasmenucomponentid.md) | [`OrderComponentWithChildren`](./api/cesdk-js/interfaces/ordercomponentwithchildren.md)\<[`CanvasMenuComponentId`](./api/cesdk-js/type-aliases/canvasmenucomponentid.md), [`CanvasMenuActionButton`](./api/cesdk-js/interfaces/canvasmenuactionbutton.md)>)\[] | A list of children as order components | - | [`OrderComponentWithChildren`](./api/cesdk-js/interfaces/ordercomponentwithchildren.md).[`children`](./api/cesdk-js/interfaces/ordercomponentwithchildren.md) |


---

## More Resources

- **[React Documentation Index](https://img.ly/docs/cesdk/react.md)** - Browse all React documentation
- **[cesdk-js API Reference](./api/cesdk-js.md)** - Full cesdk-js API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./react.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support