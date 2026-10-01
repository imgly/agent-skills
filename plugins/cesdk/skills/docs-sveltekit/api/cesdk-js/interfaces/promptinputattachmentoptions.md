> This is one page of the CE.SDK SvelteKit `@cesdk/cesdk-js` API reference. For a complete overview, see the [SvelteKit Documentation Index](https://img.ly/docs/cesdk/sveltekit.md) or the [cesdk-js API Index](./api/cesdk-js.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

Represents one attachment a prompt refers to.

The `PromptInputAttachmentOptions` interface provides a set of properties
that control the appearance and behavior of a single attachment in a prompt
input. These options include settings for the id, thumbnail, label,
highlighted state, suggested state, click handler, remove label and remove
handler.

## Properties

| Property | Type | Description |
| ------ | ------ | ------ |
|  `id` | `string` | Identifies this attachment within the list. |
|  `thumbnailUri` | `string` | The thumbnail that stands for the attachment in the row. Any URL an `img` element can load, so an attachment that is not itself an image gives a poster or a preview. |
|  `label?` | `string` | `string`\[] | Names the attachment for assistive technology, and in its tooltip. |
|  `isHighlighted?` | `boolean` | Draws a ring around the attachment, marking it as the one in use elsewhere — the block selected on the canvas, for example. Not whether it is attached: everything in the list is. |
|  `isSuggested?` | `boolean` | An attachment that is offered but not added yet. It carries no remove button and shakes, so the offer is visible without a text hint. It does not count towards `maxCount`. |
|  `onClick?` | () => `void` | - |
|  `removeLabel?` | `string` | `string`\[] | Names the remove button. Without it the attachment carries no remove button. |
|  `onRemove?` | () => `void` | Without it the attachment carries no remove button. |


---

## More Resources

- **[SvelteKit Documentation Index](https://img.ly/docs/cesdk/sveltekit.md)** - Browse all SvelteKit documentation
- **[cesdk-js API Reference](./api/cesdk-js.md)** - Full cesdk-js API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./sveltekit.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support