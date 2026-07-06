> This is one page of the CE.SDK Electron `@cesdk/engine` API reference. For a complete overview, see the [Electron Documentation Index](https://img.ly/docs/cesdk/electron.md) or the [engine API Index](./api/engine.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

```ts
type AssetPropertyPath = "label" | "tags" | "id" | "groups" | `meta.${string}`;
```

Dot-path against the resolved asset that a property predicate targets:
`label`, `id`, `tags`, `groups`, or `meta.<key>` (one segment — meta
values in the engine are flat strings).

The template literal accepts `'meta.'` (empty key) because TypeScript's
`${string}` includes the empty string; the engine rejects this at
runtime with an explanatory error.


---

## More Resources

- **[Electron Documentation Index](https://img.ly/docs/cesdk/electron.md)** - Browse all Electron documentation
- **[engine API Reference](./api/engine.md)** - Full engine API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./electron.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support