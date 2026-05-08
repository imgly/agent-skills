> This is one page of the CE.SDK Electron `@cesdk/cesdk-js` API reference. For a complete overview, see the [Electron Documentation Index](https://img.ly/docs/cesdk/electron.md) or the [cesdk-js API Index](./api/cesdk-js.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

Represents options for a button.

The `ButtonOptions` interface provides a set of properties that control the
behavior and appearance of a button. These options include settings for the
input label, input label position, label, label alignment, tooltip, click
handler, variant, color, size, icon, trailing icon, active state, selected state,
disabled state, loading state, loading progress, suffix, and keyboard shortcut.

## Properties

| Property | Type | Description |
| ------ | ------ | ------ |
|  `inputLabel?` | `string` | `string`\[] | - |
|  `inputLabelPosition?` | `"left"` | `"top"` | - |
|  `label?` | `string` | `string`\[] | - |
|  `labelAlignment?` | `"left"` | `"center"` | - |
|  `tooltip?` | `string` | `string`\[] | - |
|  `onClick?` | () => `void` | - |
|  `variant?` | `"regular"` | `"plain"` | - |
|  `color?` | `"accent"` | `"danger"` | - |
|  `size?` | `"normal"` | `"large"` | - |
|  `icon?` | [`CustomIcon`](./api/cesdk-js/documentation/namespaces/userinterfaceelements/type-aliases/customicon.md) | - |
|  `trailingIcon?` | [`CustomIcon`](./api/cesdk-js/documentation/namespaces/userinterfaceelements/type-aliases/customicon.md) | - |
|  `isActive?` | `boolean` | - |
|  `isSelected?` | `boolean` | - |
|  `isDisabled?` | `boolean` | - |
|  `isLoading?` | `boolean` | - |
|  `loadingProgress?` | `number` | - |
|  `suffix?` | [`Suffix`](./api/cesdk-js/type-aliases/suffix.md) | - |
|  `shortcut?` | `string` | Keyboard shortcut to display (e.g., 'Meta+C', 'Meta+V', 'Alt+D'). Automatically renders OS-appropriate modifiers (⌘ on macOS, Ctrl on Windows/Linux). Hidden on small viewports. |


---

## More Resources

- **[Electron Documentation Index](https://img.ly/docs/cesdk/electron.md)** - Browse all Electron documentation
- **[cesdk-js API Reference](./api/cesdk-js.md)** - Full cesdk-js API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./electron.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support