> This is one page of the CE.SDK Vanilla JS/TS `@cesdk/engine` API reference. For a complete overview, see the [Vanilla JS/TS Documentation Index](https://img.ly/docs/cesdk/js.md) or the [engine API Index](./api/engine.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

```ts
type TypefaceDefinition = object;
```

Represents a typeface definition used in the editor.

## Deprecated

This type definition is not used anymore and will be removed.

Defines the structure of a typeface definition, including metadata, family name, and font details.

- 'meta': Optional metadata for the typeface, including default status, library, and categories.
- 'family': The name of the typeface family.
- 'fonts': An array of font definitions, each containing a font URL, weight, and style.

## Properties

| Property | Type | Description |
| ------ | ------ | ------ |
|  ~~`meta?`~~ | `object` | **Deprecated** The meta field is not used anymore |
| `meta.default?` | `boolean` | - |
| `meta.library?` | `string` | - |
| `meta.categories?` | `string`\[] | - |
|  ~~`family`~~ | `string` | - |
|  ~~`fonts`~~ | `object`\[] | - |


---

## More Resources

- **[Vanilla JS/TS Documentation Index](https://img.ly/docs/cesdk/js.md)** - Browse all Vanilla JS/TS documentation
- **[engine API Reference](./api/engine.md)** - Full engine API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./js.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support