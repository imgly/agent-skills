> This is one page of the CE.SDK Nuxt.js `@cesdk/cesdk-js` API reference. For a complete overview, see the [Nuxt.js Documentation Index](https://img.ly/docs/cesdk/nuxtjs.md) or the [cesdk-js API Index](./api/cesdk-js.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

Represents options for a prompt input.

The `PromptInputOptions` interface provides a set of properties that control
the behavior and appearance of a prompt input. These options include
settings for the input label, value, value setter, disabled state,
placeholder, suffix and attachments.

## Extends

- [`InputOptions`](./api/cesdk-js/interfaces/inputoptions.md)\<`string`, `"top"`>

## Properties

| Property | Type | Description | Inherited from |
| ------ | ------ | ------ | ------ |
|  `inputLabel?` | `string` | `string`\[] | - | [`InputOptions`](./api/cesdk-js/interfaces/inputoptions.md).[`inputLabel`](./api/cesdk-js/interfaces/inputoptions.md) |
|  `inputLabelPosition?` | `"top"` | - | [`InputOptions`](./api/cesdk-js/interfaces/inputoptions.md).[`inputLabelPosition`](./api/cesdk-js/interfaces/inputoptions.md) |
|  `value` | `string` | - | [`InputOptions`](./api/cesdk-js/interfaces/inputoptions.md).[`value`](./api/cesdk-js/interfaces/inputoptions.md) |
|  `setValue` | (`value`) => `void` | - | [`InputOptions`](./api/cesdk-js/interfaces/inputoptions.md).[`setValue`](./api/cesdk-js/interfaces/inputoptions.md) |
|  `isDisabled?` | `boolean` | - | [`InputOptions`](./api/cesdk-js/interfaces/inputoptions.md).[`isDisabled`](./api/cesdk-js/interfaces/inputoptions.md) |
|  `suffix?` | [`Suffix`](./api/cesdk-js/type-aliases/suffix.md) | - | [`InputOptions`](./api/cesdk-js/interfaces/inputoptions.md).[`suffix`](./api/cesdk-js/interfaces/inputoptions.md) |
|  `placeholder?` | `string` | `string`\[] | - | - |
|  `attachments?` | [`PromptInputAttachmentsOptions`](./api/cesdk-js/interfaces/promptinputattachmentsoptions.md) | Leave it out for a prompt with no attachments. The row that holds the add button and the attachments is then absent, not empty. | - |


---

## More Resources

- **[Nuxt.js Documentation Index](https://img.ly/docs/cesdk/nuxtjs.md)** - Browse all Nuxt.js documentation
- **[cesdk-js API Reference](./api/cesdk-js.md)** - Full cesdk-js API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./nuxtjs.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support