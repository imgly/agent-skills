> This is one page of the CE.SDK React `@cesdk/cesdk-js` API reference. For a complete overview, see the [React Documentation Index](https://img.ly/docs/cesdk/react.md) or the [cesdk-js API Index](./api/cesdk-js.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

Represents options for a text area.

The `TextAreaOptions` interface provides a set of properties that control the
behavior and appearance of a text area. These options include settings for the
input label, input label position, value, value setter, disabled state, placeholder,
and suffix.

## Extends

- [`InputOptions`](./api/cesdk-js/interfaces/inputoptions.md)\<`string`>

## Properties

| Property | Type | Inherited from |
| ------ | ------ | ------ |
|  `inputLabel?` | `string` | `string`\[] | [`InputOptions`](./api/cesdk-js/interfaces/inputoptions.md).[`inputLabel`](./api/cesdk-js/interfaces/inputoptions.md) |
|  `inputLabelPosition?` | `"left"` | `"top"` | [`InputOptions`](./api/cesdk-js/interfaces/inputoptions.md).[`inputLabelPosition`](./api/cesdk-js/interfaces/inputoptions.md) |
|  `value` | `string` | [`InputOptions`](./api/cesdk-js/interfaces/inputoptions.md).[`value`](./api/cesdk-js/interfaces/inputoptions.md) |
|  `setValue` | (`value`) => `void` | [`InputOptions`](./api/cesdk-js/interfaces/inputoptions.md).[`setValue`](./api/cesdk-js/interfaces/inputoptions.md) |
|  `isDisabled?` | `boolean` | [`InputOptions`](./api/cesdk-js/interfaces/inputoptions.md).[`isDisabled`](./api/cesdk-js/interfaces/inputoptions.md) |
|  `suffix?` | [`Suffix`](./api/cesdk-js/type-aliases/suffix.md) | [`InputOptions`](./api/cesdk-js/interfaces/inputoptions.md).[`suffix`](./api/cesdk-js/interfaces/inputoptions.md) |
|  `placeholder?` | `string` | - |


---

## More Resources

- **[React Documentation Index](https://img.ly/docs/cesdk/react.md)** - Browse all React documentation
- **[cesdk-js API Reference](./api/cesdk-js.md)** - Full cesdk-js API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./react.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support