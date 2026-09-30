> This is one page of the CE.SDK Electron `@cesdk/cesdk-js` API reference. For a complete overview, see the [Electron Documentation Index](https://img.ly/docs/cesdk/electron.md) or the [cesdk-js API Index](./api/cesdk-js.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

Represents options for a text input.

The `TextInputOptions` interface provides a set of properties that control the
behavior and appearance of a text input. These options include settings for the
input label, input label position, value, value setter, disabled state, placeholder,
suffix, and requireConfirm.

## Extends

- [`InputOptions`](./api/cesdk-js/interfaces/inputoptions.md)\<`string`>

## Properties

| Property | Type | Default value | Description | Inherited from |
| ------ | ------ | ------ | ------ | ------ |
|  `inputLabel?` | `string` | `string`\[] | `undefined` | - | [`InputOptions`](./api/cesdk-js/interfaces/inputoptions.md).[`inputLabel`](./api/cesdk-js/interfaces/inputoptions.md) |
|  `inputLabelPosition?` | `"left"` | `"top"` | `undefined` | - | [`InputOptions`](./api/cesdk-js/interfaces/inputoptions.md).[`inputLabelPosition`](./api/cesdk-js/interfaces/inputoptions.md) |
|  `value` | `string` | `undefined` | - | [`InputOptions`](./api/cesdk-js/interfaces/inputoptions.md).[`value`](./api/cesdk-js/interfaces/inputoptions.md) |
|  `setValue` | (`value`) => `void` | `undefined` | - | [`InputOptions`](./api/cesdk-js/interfaces/inputoptions.md).[`setValue`](./api/cesdk-js/interfaces/inputoptions.md) |
|  `isDisabled?` | `boolean` | `undefined` | - | [`InputOptions`](./api/cesdk-js/interfaces/inputoptions.md).[`isDisabled`](./api/cesdk-js/interfaces/inputoptions.md) |
|  `suffix?` | [`Suffix`](./api/cesdk-js/type-aliases/suffix.md) | `undefined` | - | [`InputOptions`](./api/cesdk-js/interfaces/inputoptions.md).[`suffix`](./api/cesdk-js/interfaces/inputoptions.md) |
|  `requireConfirm?` | `boolean` | `true` | Whether to require explicit confirmation (Enter/Escape/blur) before applying changes. When true, changes are only applied when user presses Enter/ESC or blurs the input. When false, changes are applied immediately on every keystroke. | - |


---

## More Resources

- **[Electron Documentation Index](https://img.ly/docs/cesdk/electron.md)** - Browse all Electron documentation
- **[cesdk-js API Reference](./api/cesdk-js.md)** - Full cesdk-js API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./electron.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support