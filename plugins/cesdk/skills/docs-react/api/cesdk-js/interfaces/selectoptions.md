> This is one page of the CE.SDK React `@cesdk/cesdk-js` API reference. For a complete overview, see the [React Documentation Index](https://img.ly/docs/cesdk/react.md) or the [cesdk-js API Index](./api/cesdk-js.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

Options for a select input.

## Extends

- [`InputOptions`](./api/cesdk-js/interfaces/inputoptions.md)\<[`SelectValue`](./api/cesdk-js/interfaces/selectvalue.md)>

## Properties

| Property | Type | Description | Overrides | Inherited from |
| ------ | ------ | ------ | ------ | ------ |
|  `inputLabelPosition?` | `"left"` | `"top"` | - | - | [`InputOptions`](./api/cesdk-js/interfaces/inputoptions.md).[`inputLabelPosition`](./api/cesdk-js/interfaces/inputoptions.md) |
|  `value` | [`SelectValue`](./api/cesdk-js/interfaces/selectvalue.md) | - | - | [`InputOptions`](./api/cesdk-js/interfaces/inputoptions.md).[`value`](./api/cesdk-js/interfaces/inputoptions.md) |
|  `setValue` | (`value`) => `void` | - | - | [`InputOptions`](./api/cesdk-js/interfaces/inputoptions.md).[`setValue`](./api/cesdk-js/interfaces/inputoptions.md) |
|  `icon?` | [`CustomIcon`](./api/cesdk-js/documentation/namespaces/userinterfaceelements/type-aliases/customicon.md) | - | - | - |
|  `inputLabel?` | `string` | `string`\[] | - | [`InputOptions`](./api/cesdk-js/interfaces/inputoptions.md).[`inputLabel`](./api/cesdk-js/interfaces/inputoptions.md) | - |
|  `tooltip?` | `string` | `string`\[] | - | - | - |
|  `isDisabled?` | `boolean` | - | [`InputOptions`](./api/cesdk-js/interfaces/inputoptions.md).[`isDisabled`](./api/cesdk-js/interfaces/inputoptions.md) | - |
|  `isLoading?` | `boolean` | - | - | - |
|  `loadingProgress?` | `number` | - | - | - |
|  `suffix?` | [`Suffix`](./api/cesdk-js/type-aliases/suffix.md) | - | [`InputOptions`](./api/cesdk-js/interfaces/inputoptions.md).[`suffix`](./api/cesdk-js/interfaces/inputoptions.md) | - |
|  `values` | [`SelectValue`](./api/cesdk-js/interfaces/selectvalue.md)\[] | - | - | - |
|  `searchable?` | `boolean` | When true, adds a search input that filters the dropdown options by label. | - | - |
|  `searchPlaceholder?` | `string` | `string`\[] | Placeholder text for the search input. Only used when `searchable` is true. | - | - |


---

## More Resources

- **[React Documentation Index](https://img.ly/docs/cesdk/react.md)** - Browse all React documentation
- **[cesdk-js API Reference](./api/cesdk-js.md)** - Full cesdk-js API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./react.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support