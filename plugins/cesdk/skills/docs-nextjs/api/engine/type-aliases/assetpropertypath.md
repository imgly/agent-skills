> This is one page of the CE.SDK Next.js `@cesdk/engine` API reference. For a complete overview, see the [Next.js Documentation Index](https://img.ly/docs/cesdk/nextjs.md) or the [engine API Index](./api/engine.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

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

- **[Next.js Documentation Index](https://img.ly/docs/cesdk/nextjs.md)** - Browse all Next.js documentation
- **[engine API Reference](./api/engine.md)** - Full engine API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./nextjs.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support