> This is one page of the CE.SDK Electron `@cesdk/engine` API reference. For a complete overview, see the [Electron Documentation Index](https://img.ly/docs/cesdk/electron.md) or the [engine API Index](./api/engine.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

```ts
type AssetPropertyFilter = object & 
  | {
  contains: string;
  equals?: never;
}
  | {
  equals: string;
  contains?: never;
};
```

A single property predicate. Exactly one of `contains` (case-insensitive
substring) or `equals` (case-insensitive equality) must be set — the
type forbids passing both or neither. On a string-array property
(`tags`, `groups`), the operator matches if any element matches.

`meta.<key>` values are flat strings in the engine; if a meta value
was originally serialized as a number or boolean, stringify it the
same way before comparing.

## Type Declaration

| Name | Type |
| ------ | ------ |
| `property` | [`AssetPropertyPath`](./api/engine/type-aliases/assetpropertypath.md) |


---

## More Resources

- **[Electron Documentation Index](https://img.ly/docs/cesdk/electron.md)** - Browse all Electron documentation
- **[engine API Reference](./api/engine.md)** - Full engine API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./electron.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support