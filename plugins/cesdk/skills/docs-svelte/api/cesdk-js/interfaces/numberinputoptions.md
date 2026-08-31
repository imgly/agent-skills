> This is one page of the CE.SDK Svelte `@cesdk/cesdk-js` API reference. For a complete overview, see the [Svelte Documentation Index](https://img.ly/docs/cesdk/svelte.md) or the [cesdk-js API Index](./api/cesdk-js.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

Represents options for a number input.

The `NumberInputOptions` interface provides a set of properties that control the
behavior and appearance of a number input. These options include settings for the
input label, input label position, value, value setter, disabled state, minimum value,
maximum value, step value, suffix, and requireConfirm.

## Extends

- [`InputOptions`](./api/cesdk-js/interfaces/inputoptions.md)\<`number`>

## Properties

| Property | Type | Default value | Description | Inherited from |
| ------ | ------ | ------ | ------ | ------ |
|  `inputLabel?` | `string` | `string`\[] | `undefined` | - | [`InputOptions`](./api/cesdk-js/interfaces/inputoptions.md).[`inputLabel`](./api/cesdk-js/interfaces/inputoptions.md) |
|  `inputLabelPosition?` | `"left"` | `"top"` | `undefined` | - | [`InputOptions`](./api/cesdk-js/interfaces/inputoptions.md).[`inputLabelPosition`](./api/cesdk-js/interfaces/inputoptions.md) |
|  `value` | `number` | `undefined` | - | [`InputOptions`](./api/cesdk-js/interfaces/inputoptions.md).[`value`](./api/cesdk-js/interfaces/inputoptions.md) |
|  `setValue` | (`value`) => `void` | `undefined` | - | [`InputOptions`](./api/cesdk-js/interfaces/inputoptions.md).[`setValue`](./api/cesdk-js/interfaces/inputoptions.md) |
|  `isDisabled?` | `boolean` | `undefined` | - | [`InputOptions`](./api/cesdk-js/interfaces/inputoptions.md).[`isDisabled`](./api/cesdk-js/interfaces/inputoptions.md) |
|  `suffix?` | [`Suffix`](./api/cesdk-js/type-aliases/suffix.md) | `undefined` | - | [`InputOptions`](./api/cesdk-js/interfaces/inputoptions.md).[`suffix`](./api/cesdk-js/interfaces/inputoptions.md) |
|  `min?` | `number` | `undefined` | - | - |
|  `max?` | `number` | `undefined` | - | - |
|  `step?` | `number` | `undefined` | - | - |
|  `requireConfirm?` | `boolean` | `true` | Whether to require explicit confirmation (Enter/Escape/blur) before applying changes. When true, changes are only applied when user presses Enter/ESC or blurs the input. When false, changes are applied immediately on every keystroke. | - |
|  `showStepper?` | `boolean` | `false` | Renders a decrement and an increment button inside the input. Each press changes the value by `step` and stops at `min` and `max`. Holding a button repeats the step. Typing a value into the input keeps working. The buttons are not tab stops. The input's Up and Down arrow keys already do the same thing, which is what the WAI-ARIA spinbutton pattern expects. | - |


---

## More Resources

- **[Svelte Documentation Index](https://img.ly/docs/cesdk/svelte.md)** - Browse all Svelte documentation
- **[cesdk-js API Reference](./api/cesdk-js.md)** - Full cesdk-js API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./svelte.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support