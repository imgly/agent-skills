> This is one page of the CE.SDK SvelteKit `@cesdk/cesdk-js` API reference. For a complete overview, see the [SvelteKit Documentation Index](https://img.ly/docs/cesdk/sveltekit.md) or the [cesdk-js API Index](./api/cesdk-js.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

```ts
type AnyUILocationOptions<A> = A extends "ly.img.canvas.bar" ? CanvasBarLocationOptions : A extends "ly.img.dock" ? DockLocationOptions : UILocationOptions<A>;
```

Union type for location options. Resolves to the appropriate options type based on area-specific requirements.

## Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `A` *extends* [`UIArea`](./api/cesdk-js/type-aliases/uiarea.md) | [`UIArea`](./api/cesdk-js/type-aliases/uiarea.md) |


---

## More Resources

- **[SvelteKit Documentation Index](https://img.ly/docs/cesdk/sveltekit.md)** - Browse all SvelteKit documentation
- **[cesdk-js API Reference](./api/cesdk-js.md)** - Full cesdk-js API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./sveltekit.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support