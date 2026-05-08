> This is one page of the CE.SDK Svelte `@cesdk/cesdk-js` API reference. For a complete overview, see the [Svelte Documentation Index](https://img.ly/docs/cesdk/svelte.md) or the [cesdk-js API Index](./api/cesdk-js.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

Represents options for an input.

The `InputOptions` interface provides a set of properties that control the
behavior and appearance of an input. These options include settings for the
input label, input label position, value, value setter, disabled state, and suffix.

## Extended by

- [`CheckboxOptions`](./api/cesdk-js/interfaces/checkboxoptions.md)
- [`ColorInputOptions`](./api/cesdk-js/interfaces/colorinputoptions.md)
- [`NumberInputOptions`](./api/cesdk-js/interfaces/numberinputoptions.md)
- [`SelectOptions`](./api/cesdk-js/interfaces/selectoptions.md)
- [`SliderOptions`](./api/cesdk-js/interfaces/slideroptions.md)
- [`TextAreaOptions`](./api/cesdk-js/interfaces/textareaoptions.md)
- [`TextInputOptions`](./api/cesdk-js/interfaces/textinputoptions.md)

## Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `T` | - |
| `P` | `"top"` | `"left"` |

## Properties

| Property | Type |
| ------ | ------ |
|  `inputLabel?` | `string` | `string`\[] |
|  `inputLabelPosition?` | `P` |
|  `value` | `T` |
|  `setValue` | (`value`) => `void` |
|  `isDisabled?` | `boolean` |
|  `suffix?` | [`Suffix`](./api/cesdk-js/type-aliases/suffix.md) |


---

## More Resources

- **[Svelte Documentation Index](https://img.ly/docs/cesdk/svelte.md)** - Browse all Svelte documentation
- **[cesdk-js API Reference](./api/cesdk-js.md)** - Full cesdk-js API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./svelte.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support