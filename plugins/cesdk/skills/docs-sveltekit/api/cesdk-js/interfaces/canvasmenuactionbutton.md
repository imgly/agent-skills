> This is one page of the CE.SDK SvelteKit `@cesdk/cesdk-js` API reference. For a complete overview, see the [SvelteKit Documentation Index](https://img.ly/docs/cesdk/sveltekit.md) or the [cesdk-js API Index](./api/cesdk-js.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

Base interface for action buttons in the canvas menu.
Contains common properties shared across all canvas menu button types.

- `onClick`: Handler invoked when the button is clicked.
- `label`: Optional label for the button.
- `icon`: Optional icon name to display on the button.
- `variant`: Optional style variant of the button, either 'regular' or 'plain'.
- `isDisabled`: Optional disabled property.
- `shortcut`: Optional keyboard shortcut displayed alongside the action.

## Extends

- [`OrderComponent`](./api/cesdk-js/interfaces/ordercomponent.md)

## Indexable

```ts
[key: string]: unknown
```

## Properties

| Property | Type | Overrides | Inherited from |
| ------ | ------ | ------ | ------ |
|  `id` | | `"ly.img.flipX.canvasMenu"` | `"ly.img.flipY.canvasMenu"` | `"ly.img.copy.canvasMenu"` | `"ly.img.paste.canvasMenu"` | [`OrderComponent`](./api/cesdk-js/interfaces/ordercomponent.md).[`id`](./api/cesdk-js/interfaces/ordercomponent.md) | - |
|  `onClick?` | () => `void` | `Promise`\<`void`> | - | - |
|  `label?` | `string` | - | - |
|  `icon?` | `string` | - | - |
|  `variant?` | `"regular"` | `"plain"` | - | - |
|  `isDisabled?` | `boolean` | - | - |
|  `shortcut?` | `string` | - | - |
|  `key?` | `string` | - | [`OrderComponent`](./api/cesdk-js/interfaces/ordercomponent.md).[`key`](./api/cesdk-js/interfaces/ordercomponent.md) |


---

## More Resources

- **[SvelteKit Documentation Index](https://img.ly/docs/cesdk/sveltekit.md)** - Browse all SvelteKit documentation
- **[cesdk-js API Reference](./api/cesdk-js.md)** - Full cesdk-js API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./sveltekit.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support