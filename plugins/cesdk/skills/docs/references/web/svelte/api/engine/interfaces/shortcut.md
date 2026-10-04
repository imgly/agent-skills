> This is one page of the CE.SDK Svelte `@cesdk/engine` API reference. For a complete overview, see the [Svelte Documentation Index](https://img.ly/docs/cesdk/svelte.md) or the [engine API Index](./api/engine.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

A keyboard shortcut. `keys` is a chord (`'Mod+z'`); sequences (string
arrays) currently bind on their first chord. `run` is an action id or an
inline function.

## Properties

| Property | Type | Description |
| ------ | ------ | ------ |
|  `keys` | `string` | `string`\[] | The chord (e.g. `Mod+z`). `Mod` is Cmd on macOS, Ctrl elsewhere. |
|  `run` | [`ShortcutRun`](./api/engine/type-aliases/shortcutrun.md) | An action id (run via `engine.actions.run`) or an inline function. |
|  `when?` | (`context`) => `boolean` | Only fire the shortcut (and swallow the key) when this returns true. Checks engine state only; scope is handled separately via `scope`. |
|  `scope` | [`ShortcutScopeId`](./api/engine/type-aliases/shortcutscopeid.md)\[] | Restrict the shortcut to one or more UI scopes: it is a candidate only when the resolved active scope is in this list. Use the editor fallback scope (`ly.img.scope.editor`) for a shortcut that should fire anywhere inside the editor; an empty array fires in any scope. |
|  `description?` | `string` | Optional human-readable description, surfaced in help UIs. |
|  `category?` | `string` | Optional grouping label for help UIs. |
|  `sequenceTimeout?` | `number` | For multi-step (sequence) shortcuts: the maximum idle gap, in milliseconds, allowed between key presses before the in-progress sequence is forgotten. Ignored for single-chord shortcuts. Defaults to 1000ms. |


---

## More Resources

- **[Svelte Documentation Index](https://img.ly/docs/cesdk/svelte.md)** - Browse all Svelte documentation
- **[engine API Reference](./api/engine.md)** - Full engine API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./svelte.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support