> This is one page of the CE.SDK React `@cesdk/cesdk-js` API reference. For a complete overview, see the [React Documentation Index](https://img.ly/docs/cesdk/react.md) or the [cesdk-js API Index](./api/cesdk-js.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

```ts
type SceneCreateOptions = object & 
  | {
  page?: PageSpec;
  pageCount?: number;
  pages?: never;
}
  | {
  pages: PageSpec[];
  page?: never;
  pageCount?: never;
};
```

Options for creating a new scene.

## Type Declaration

| Name | Type | Description |
| ------ | ------ | ------ |
| `mode?` | [`AddImageOptions`](./api/cesdk-js/variables/addimageoptions.md) | Scene mode. Defaults to null (unified mode with all features enabled). **Deprecated** Scene mode is deprecated. New scenes should use the default null mode. |
| `layout?` | [`AddImageOptions`](./api/cesdk-js/variables/addimageoptions.md) | Scene layout. Defaults to 'VerticalStack' for Design, ignored for Video. |


---

## More Resources

- **[React Documentation Index](https://img.ly/docs/cesdk/react.md)** - Browse all React documentation
- **[cesdk-js API Reference](./api/cesdk-js.md)** - Full cesdk-js API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./react.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support