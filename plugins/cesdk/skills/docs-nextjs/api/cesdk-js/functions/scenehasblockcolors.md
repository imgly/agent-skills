> This is one page of the CE.SDK Next.js `@cesdk/cesdk-js` API reference. For a complete overview, see the [Next.js Documentation Index](https://img.ly/docs/cesdk/nextjs.md) or the [cesdk-js API Index](./api/cesdk-js.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

```ts
function sceneHasBlockColors(engine): boolean;
```

Cheap synchronous predicate: returns true if the scene currently contains at least one
graphic block whose fill can contribute colors to the Block Colors palette. Used to
decide whether the section should be rendered in the panel at all.

Best-effort hint: an image fill that has not finished loading yet will still make this
return true so the user sees the section appear as soon as the scene has something that
could plausibly contribute colors.

## Parameters

| Parameter | Type |
| ------ | ------ |
| `engine` | `CreativeEngine_2` |

## Returns

`boolean`


---

## More Resources

- **[Next.js Documentation Index](https://img.ly/docs/cesdk/nextjs.md)** - Browse all Next.js documentation
- **[cesdk-js API Reference](./api/cesdk-js.md)** - Full cesdk-js API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./nextjs.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support