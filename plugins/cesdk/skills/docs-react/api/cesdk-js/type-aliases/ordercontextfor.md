> This is one page of the CE.SDK React `@cesdk/cesdk-js` API reference. For a complete overview, see the [React Documentation Index](https://img.ly/docs/cesdk/react.md) or the [cesdk-js API Index](./api/cesdk-js.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

```ts
type OrderContextFor<A> = A extends "ly.img.caption.panel" ? CaptionPanelOrderContext : A extends "ly.img.video.clip.menu" ? VideoClipMenuOrderContext : OrderContext;
```

Maps a UI area to its appropriate order context type for public API usage.

- Caption panel uses CaptionPanelOrderContext (adds view property)
- Video clip menu uses VideoClipMenuOrderContext (adds clipType)
- All other areas use OrderContext (editMode only)

## Type Parameters

| Type Parameter |
| ------ |
| `A` *extends* [`UIArea`](./api/cesdk-js/type-aliases/uiarea.md) |


---

## More Resources

- **[React Documentation Index](https://img.ly/docs/cesdk/react.md)** - Browse all React documentation
- **[cesdk-js API Reference](./api/cesdk-js.md)** - Full cesdk-js API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./react.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support