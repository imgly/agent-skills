> This is one page of the CE.SDK Electron `@cesdk/engine` API reference. For a complete overview, see the [Electron Documentation Index](https://img.ly/docs/cesdk/electron.md) or the [engine API Index](./api/engine.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

```ts
function normalizeKeyCombo(combo): string;
```

Convert a combo into the internal canonical form (sorted modifiers,
lowercase letters, `Mod` for Cmd/Ctrl). Exposed so hosts can match against it.

A combo that is only whitespace is the Space key (the W3C `' '` value); it
is normalized to `Space` rather than split on whitespace as a sequence.

## Parameters

| Parameter | Type |
| ------ | ------ |
| `combo` | `string` |

## Returns

`string`


---

## More Resources

- **[Electron Documentation Index](https://img.ly/docs/cesdk/electron.md)** - Browse all Electron documentation
- **[engine API Reference](./api/engine.md)** - Full engine API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./electron.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support