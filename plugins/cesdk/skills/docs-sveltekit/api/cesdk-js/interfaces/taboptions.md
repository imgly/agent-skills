> This is one page of the CE.SDK SvelteKit `@cesdk/cesdk-js` API reference. For a complete overview, see the [SvelteKit Documentation Index](https://img.ly/docs/cesdk/sveltekit.md) or the [cesdk-js API Index](./api/cesdk-js.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

Represents a single tab of a tab bar.

The `TabOptions` interface provides a set of properties that control the
behavior and appearance of a tab. These options include settings for the id,
label, icon, tooltip, disabled state, active state and children.

## Properties

| Property | Type | Description |
| ------ | ------ | ------ |
|  `id` | `string` | Identifies this tab. Passed to `setValue` when the tab is selected and compared against `value` to determine the selected tab. |
|  `label?` | `string` | `string`\[] | - |
|  `icon?` | [`CustomIcon`](./api/cesdk-js/documentation/namespaces/userinterfaceelements/type-aliases/customicon.md) | - |
|  `tooltip?` | `string` | `string`\[] | - |
|  `isDisabled?` | `boolean` | - |
|  `isActive?` | `boolean` | Renders an indicator below the tab icon, signalling that this tab has a value applied — an animation, for example. Not whether the tab is selected. Requires an `icon`, since the indicator is anchored to it. |
|  `children?` | | [`ChildrenOrder`](./api/cesdk-js/type-aliases/childrenorder.md) | (() => `void`) | The content of this tab. Only evaluated while the tab is selected, so hidden tabs do not build their content. |


---

## More Resources

- **[SvelteKit Documentation Index](https://img.ly/docs/cesdk/sveltekit.md)** - Browse all SvelteKit documentation
- **[cesdk-js API Reference](./api/cesdk-js.md)** - Full cesdk-js API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./sveltekit.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support