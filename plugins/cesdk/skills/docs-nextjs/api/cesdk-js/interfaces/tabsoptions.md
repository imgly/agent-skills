> This is one page of the CE.SDK Next.js `@cesdk/cesdk-js` API reference. For a complete overview, see the [Next.js Documentation Index](https://img.ly/docs/cesdk/nextjs.md) or the [cesdk-js API Index](./api/cesdk-js.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

Represents options for a tab bar.

The `TabsOptions` interface provides a set of properties that control the
behavior and appearance of a tab bar. These options include settings for the
tabs, the selected tab, the selected tab setter and the disabled state.

## Properties

| Property | Type | Description |
| ------ | ------ | ------ |
|  `tabs` | [`TabOptions`](./api/cesdk-js/interfaces/taboptions.md)\[] | - |
|  `inputLabel?` | `string` | `string`\[] | Labels the tab bar, both on screen and for assistive technology. Without it the bar is announced only as a tab list. |
|  `inputLabelPosition?` | `"left"` | `"top"` | - |
|  `value` | `string` | The `id` of the currently selected tab. |
|  `setValue` | (`value`) => `void` | - |
|  `isDisabled?` | `boolean` | - |


---

## More Resources

- **[Next.js Documentation Index](https://img.ly/docs/cesdk/nextjs.md)** - Browse all Next.js documentation
- **[cesdk-js API Reference](./api/cesdk-js.md)** - Full cesdk-js API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./nextjs.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support