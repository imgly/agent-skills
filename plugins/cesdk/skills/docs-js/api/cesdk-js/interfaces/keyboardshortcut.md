> This is one page of the CE.SDK Vanilla JS/TS `@cesdk/cesdk-js` API reference. For a complete overview, see the [Vanilla JS/TS Documentation Index](https://img.ly/docs/cesdk/js.md) or the [cesdk-js API Index](./api/cesdk-js.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

Unified keyboard shortcut definition

## Properties

| Property | Type | Description |
| ------ | ------ | ------ |
|  `keys` | `string` | `string`\[] | The key combination(s) for this shortcut: - String: Single chord (e.g., "Ctrl+c" or "Meta+s") - Array with one element: Single chord (e.g., \["Ctrl+c"]) - Array with multiple elements: Sequence (e.g., \["g", "g"] or \["Ctrl+c", "v"]) Note: Use "+" to combine keys in a chord. Use array elements for sequences. |
|  `description?` | `string` | Optional human-readable description of what this shortcut does. |
|  `category?` | `string` | Optional category for grouping shortcuts in the UI |
|  `run` | | [`ActionId`](./api/cesdk-js/type-aliases/actionid.md) | ((`context`) => `unknown`) | Function to run when the shortcut is triggered. Returning the literal `false` suppresses the manager's automatic `preventDefault` + `stopPropagation` for this keypress (mousetrap parity); any other return value (or `void`) consumes the event. **Param** The context object containing the CESDK instance |
|  `scope` | `any`\[] | Restrict the shortcut to one or more UI scopes: it fires only when the active scope (resolved from the focused element's `data-shortcut-scope` ancestor) is in this list. Pass an empty array `[]` to fire in any scope. |
|  `when?` | (`context`) => `boolean` | Optional condition to determine if the shortcut should be active. Checks editor state only; scope gating is handled by `scope`. **Example** `when: ({ cesdk }) => { if (!cesdk.feature.isEnabled('ly.img.duplicate')) return false; return cesdk.engine.editor.getEditMode() === 'Transform'; }` |
|  `sequenceTimeout?` | `number` | For multi-step (sequence) shortcuts: the maximum milliseconds allowed between key presses before the in-progress sequence is forgotten. Ignored for single-chord shortcuts. **Default** `1000` |


---

## More Resources

- **[Vanilla JS/TS Documentation Index](https://img.ly/docs/cesdk/js.md)** - Browse all Vanilla JS/TS documentation
- **[cesdk-js API Reference](./api/cesdk-js.md)** - Full cesdk-js API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./js.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support