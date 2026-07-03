> This is one page of the CE.SDK React `@cesdk/cesdk-js` API reference. For a complete overview, see the [React Documentation Index](https://img.ly/docs/cesdk/react.md) or the [cesdk-js API Index](./api/cesdk-js.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

Represents options for a dropdown.

The `DropdownOptions` interface provides a set of properties that control the
behavior and appearance of a dropdown. These options include settings for the
input label, input label position, label, tooltip, variant, color, size, icon,
disabled state, loading state, loading progress, children, and suffix.

## Properties

| Property | Type | Description |
| ------ | ------ | ------ |
|  `inputLabel?` | `string` | `string`\[] | - |
|  `inputLabelPosition?` | `"left"` | `"top"` | - |
|  `label?` | `string` | `string`\[] | - |
|  `tooltip?` | `string` | `string`\[] | - |
|  `variant?` | `"regular"` | `"plain"` | - |
|  `color?` | `"accent"` | `"danger"` | - |
|  `size?` | `"normal"` | `"large"` | - |
|  `icon?` | [`CustomIcon`](./api/cesdk-js/documentation/namespaces/userinterfaceelements/type-aliases/customicon.md) | - |
|  `isActive?` | `boolean` | - |
|  `activeStateStyle?` | `"outline"` | `"pill"` | `"none"` | - |
|  `isDisabled?` | `boolean` | - |
|  `isLoading?` | `boolean` | - |
|  `loadingProgress?` | `number` | - |
|  `children?` | | ((`context`) => `void`) | [`ChildrenOrder`](./api/cesdk-js/type-aliases/childrenorder.md) | - |
|  `suffix?` | [`Suffix`](./api/cesdk-js/type-aliases/suffix.md) | - |
|  `showIndicator?` | `boolean` | Whether to show the expand indicator icons (triangle up/down). **Default** `true` |


---

## More Resources

- **[React Documentation Index](https://img.ly/docs/cesdk/react.md)** - Browse all React documentation
- **[cesdk-js API Reference](./api/cesdk-js.md)** - Full cesdk-js API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./react.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support