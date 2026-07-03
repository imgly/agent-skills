> This is one page of the CE.SDK SvelteKit `@cesdk/cesdk-js` API reference. For a complete overview, see the [SvelteKit Documentation Index](https://img.ly/docs/cesdk/sveltekit.md) or the [cesdk-js API Index](./api/cesdk-js.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

```ts
type CustomPanelMountFunction = (domElement) => PanelDisposer;
```

Represents a function that mounts a custom panel.

The `CustomPanelMountFunction` type provides a function that mounts a custom panel to a
specified HTMLDivElement. The function returns a `PanelDisposer` function that disposes
of the panel when called.

## Parameters

| Parameter | Type |
| ------ | ------ |
| `domElement` | `HTMLDivElement` |

## Returns

[`PanelDisposer`](./api/cesdk-js/type-aliases/paneldisposer.md)


---

## More Resources

- **[SvelteKit Documentation Index](https://img.ly/docs/cesdk/sveltekit.md)** - Browse all SvelteKit documentation
- **[cesdk-js API Reference](./api/cesdk-js.md)** - Full cesdk-js API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./sveltekit.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support