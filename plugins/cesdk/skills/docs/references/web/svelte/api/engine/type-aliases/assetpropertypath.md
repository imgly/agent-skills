> This is one page of the CE.SDK Svelte `@cesdk/engine` API reference. For a complete overview, see the [Svelte Documentation Index](https://img.ly/docs/cesdk/svelte.md) or the [engine API Index](./api/engine.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

```ts
type AssetPropertyPath = "label" | "tags" | "id" | "groups" | `meta.${string}`;
```

Dot-path against the resolved asset that a property predicate targets:
`label`, `id`, `tags`, `groups`, or `meta.<key>` (one segment).

The template literal accepts `'meta.'` (empty key) because TypeScript's
`${string}` includes the empty string; the engine rejects this at
runtime with an explanatory error.


---

## More Resources

- **[Svelte Documentation Index](https://img.ly/docs/cesdk/svelte.md)** - Browse all Svelte documentation
- **[engine API Reference](./api/engine.md)** - Full engine API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./svelte.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support