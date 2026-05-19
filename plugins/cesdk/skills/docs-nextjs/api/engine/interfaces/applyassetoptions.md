> This is one page of the CE.SDK Next.js `@cesdk/engine` API reference. For a complete overview, see the [Next.js Documentation Index](https://img.ly/docs/cesdk/nextjs.md) or the [engine API Index](./api/engine.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

Options for applying an asset to the scene.

## Indexable

```ts
[key: string]: unknown
```

Additional custom context options.
Allows passing arbitrary data to middleware for custom placement logic.

## Properties

| Property | Type | Description |
| ------ | ------ | ------ |
|  `clipType?` | `"clip"` | `"overlay"` | How the asset should be placed in the scene. - 'clip': Background clip placed on background track - 'overlay': Foreground overlay placed at playhead |


---

## More Resources

- **[Next.js Documentation Index](https://img.ly/docs/cesdk/nextjs.md)** - Browse all Next.js documentation
- **[engine API Reference](./api/engine.md)** - Full engine API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./nextjs.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support