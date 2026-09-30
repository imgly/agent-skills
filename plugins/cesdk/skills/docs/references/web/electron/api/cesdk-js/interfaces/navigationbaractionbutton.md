> This is one page of the CE.SDK Electron `@cesdk/cesdk-js` API reference. For a complete overview, see the [Electron Documentation Index](https://img.ly/docs/cesdk/electron.md) or the [cesdk-js API Index](./api/cesdk-js.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

Base interface for action buttons in the navigation bar.
Contains common properties shared across all action button types.

- `onClick`: Handler invoked when the button is clicked.
- `label`: Optional label for the button.
- `icon`: Optional icon name to display on the button.
- `variant`: Optional style variant of the button, either 'regular' or 'plain'.
- `color`: Optional color which can be either 'accent' or 'danger'.
- `isDisabled`: Optional disabled property.
- `isLoading`: Optional loading property.

## Extends

- [`OrderComponent`](./api/cesdk-js/interfaces/ordercomponent.md)

## Indexable

```ts
[key: string]: unknown
```

## Properties

| Property | Type | Overrides | Inherited from |
| ------ | ------ | ------ | ------ |
|  `id` | | `"ly.img.back.navigationBar"` | `"ly.img.close.navigationBar"` | `"ly.img.saveScene.navigationBar"` | `"ly.img.exportImage.navigationBar"` | `"ly.img.exportPDF.navigationBar"` | `"ly.img.exportVideo.navigationBar"` | `"ly.img.shareScene.navigationBar"` | `"ly.img.exportScene.navigationBar"` | `"ly.img.exportArchive.navigationBar"` | `"ly.img.importScene.navigationBar"` | `"ly.img.importArchive.navigationBar"` | [`OrderComponent`](./api/cesdk-js/interfaces/ordercomponent.md).[`id`](./api/cesdk-js/interfaces/ordercomponent.md) | - |
|  `onClick` | () => `void` | `Promise`\<`void`> | - | - |
|  `label?` | `string` | - | - |
|  `icon?` | `string` | - | - |
|  `variant?` | `"regular"` | `"plain"` | - | - |
|  `color?` | `"accent"` | `"danger"` | - | - |
|  `isDisabled?` | `boolean` | - | - |
|  `isLoading?` | `boolean` | - | - |
|  `key?` | `string` | - | [`OrderComponent`](./api/cesdk-js/interfaces/ordercomponent.md).[`key`](./api/cesdk-js/interfaces/ordercomponent.md) |


---

## More Resources

- **[Electron Documentation Index](https://img.ly/docs/cesdk/electron.md)** - Browse all Electron documentation
- **[cesdk-js API Reference](./api/cesdk-js.md)** - Full cesdk-js API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./electron.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support