> This is one page of the CE.SDK SvelteKit `@cesdk/cesdk-js` API reference. For a complete overview, see the [SvelteKit Documentation Index](https://img.ly/docs/cesdk/sveltekit.md) or the [cesdk-js API Index](./api/cesdk-js.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

Represents options for the attachments of a prompt input.

The `PromptInputAttachmentsOptions` interface provides a set of properties
that control the appearance and behavior of the attachment row below a
prompt. These options include settings for the items, the list label, the add
button and the maximum number of attachments.

## Properties

| Property | Type | Description |
| ------ | ------ | ------ |
|  `items` | [`PromptInputAttachmentOptions`](./api/cesdk-js/interfaces/promptinputattachmentoptions.md)\[] | - |
|  `label` | `string` | `string`\[] | Names the list of attachments for assistive technology. |
|  `addLabel` | `string` | `string`\[] | Names the add button, in its tooltip and for assistive technology. |
|  `addIcon?` | [`CustomIcon`](./api/cesdk-js/documentation/namespaces/userinterfaceelements/type-aliases/customicon.md) | The icon of the add button. Defaults to a generic image icon. |
|  `onAdd` | () => `void` | - |
|  `maxCount?` | `number` | The add button turns disabled once this many attachments are added. Leave it out for no limit. |


---

## More Resources

- **[SvelteKit Documentation Index](https://img.ly/docs/cesdk/sveltekit.md)** - Browse all SvelteKit documentation
- **[cesdk-js API Reference](./api/cesdk-js.md)** - Full cesdk-js API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./sveltekit.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support