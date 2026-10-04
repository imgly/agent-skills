> This is one page of the CE.SDK Svelte `@cesdk/engine` API reference. For a complete overview, see the [Svelte Documentation Index](https://img.ly/docs/cesdk/svelte.md) or the [engine API Index](./api/engine.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

```ts
type ShortcutScopeId = 
  | "ly.img.scope.canvas"
  | "ly.img.scope.editor"
  | "ly.img.scope.global"
  | string & object;
```

Identifier for a UI scope, resolved from the DOM at dispatch time by
walking `data-shortcut-scope` ancestors from the focused element up to the
root.

The engine knows two scopes on its own — the canvas, and a `global` fallback
used when no scoped ancestor is in the focus path. A host UI extends this
type with its additional surfaces (editor, timeline, panels, …) and
re-exports it, so registering a shortcut in that layer gets the host's full
scope union. The `(string & {})` arm keeps any string assignable (so host
scopes pass) while preserving IntelliSense for the known literals.


---

## More Resources

- **[Svelte Documentation Index](https://img.ly/docs/cesdk/svelte.md)** - Browse all Svelte documentation
- **[engine API Reference](./api/engine.md)** - Full engine API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./svelte.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support