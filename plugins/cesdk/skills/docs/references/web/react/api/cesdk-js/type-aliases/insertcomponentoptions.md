> This is one page of the CE.SDK React `@cesdk/cesdk-js` API reference. For a complete overview, see the [React Documentation Index](https://img.ly/docs/cesdk/react.md) or the [cesdk-js API Index](./api/cesdk-js.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

```ts
type InsertComponentOptions<A> = A extends PositionalUIArea ? 
  | PositionalInsertBeforeOptions<A>
  | PositionalInsertAfterOptions<A>
  | PositionalInsertAtPositionOptions<A>
  | PositionalInsertAppendOptions<A> : A extends Exclude<UIArea, PositionalUIArea> ? 
  | InsertBeforeOptions<A>
  | InsertAfterOptions<A>
  | InsertAtPositionOptions<A>
  | InsertAppendOptions<A> : never;
```

Options for inserting a component into a UI area.
Supports mutual exclusion: only one of `before`, `after`, or `position` can be specified.
Positional areas (like canvas bar) require the `at` property to specify which slot.

## Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `A` *extends* [`UIArea`](./api/cesdk-js/type-aliases/uiarea.md) | [`UIArea`](./api/cesdk-js/type-aliases/uiarea.md) |


---

## More Resources

- **[React Documentation Index](https://img.ly/docs/cesdk/react.md)** - Browse all React documentation
- **[cesdk-js API Reference](./api/cesdk-js.md)** - Full cesdk-js API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./react.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support