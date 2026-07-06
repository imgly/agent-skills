> This is one page of the CE.SDK Electron `@cesdk/cesdk-js` API reference. For a complete overview, see the [Electron Documentation Index](https://img.ly/docs/cesdk/electron.md) or the [cesdk-js API Index](./api/cesdk-js.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

Interface for all available builder. Depending on the context different
implementation might be used. A "Button" in the canvas menu might render
different component than a button in the topbar or a panel.

## Properties

| Property | Type |
| ------ | ------ |
|  `Button` | (`id`, `options`) => `void` |
|  `ButtonGroup` | (`id`, `options`) => `void` |
|  `Checkbox` | (`id`, `options`) => `void` |
|  `Dropdown` | (`id`, `options`) => `void` |
|  `MediaPreview` | (`id`, `options`) => `void` |
|  `Section` | (`id`, `options`) => `void` |
|  `Separator` | (`id`) => `void` |
|  `Spinner` | (`id`, `options?`) => `void` |
|  `TextArea` | (`id`, `options`) => `void` |
|  `TextInput` | (`id`, `options`) => `void` |
|  `NumberInput` | (`id`, `options`) => `void` |
|  `ColorInput` | (`id`, `options`) => `void` |
|  `Slider` | (`id`, `options`) => `void` |
|  `Library` | (`id`, `options`) => `void` |
|  `Heading` | (`id`, `options`) => `void` |
|  `Text` | (`id`, `options`) => `void` |
|  `Select` | (`id`, `options`) => `void` |
|  `Component` | (`id`, `options`) => `void` |


---

## More Resources

- **[Electron Documentation Index](https://img.ly/docs/cesdk/electron.md)** - Browse all Electron documentation
- **[cesdk-js API Reference](./api/cesdk-js.md)** - Full cesdk-js API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./electron.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support