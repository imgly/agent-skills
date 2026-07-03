> This is one page of the CE.SDK React `@cesdk/cesdk-js` API reference. For a complete overview, see the [React Documentation Index](https://img.ly/docs/cesdk/react.md) or the [cesdk-js API Index](./api/cesdk-js.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

```ts
type GlobPattern = `${string}*` | `*${string}` | `*${string}*` | "*";
```

A glob pattern string for matching UI areas or component IDs.
Supports `*` as a wildcard.

Examples:

- `'ly.img.canvas.*'` matches 'ly.img.canvas.bar' and 'ly.img.canvas.menu'
- `'ly.img.*.bar'` matches 'ly.img.canvas.bar', 'ly.img.inspector.bar', 'ly.img.navigation.bar'
- `'*'` matches all areas


---

## More Resources

- **[React Documentation Index](https://img.ly/docs/cesdk/react.md)** - Browse all React documentation
- **[cesdk-js API Reference](./api/cesdk-js.md)** - Full cesdk-js API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./react.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support