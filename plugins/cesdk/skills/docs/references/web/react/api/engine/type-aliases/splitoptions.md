> This is one page of the CE.SDK React `@cesdk/engine` API reference. For a complete overview, see the [React Documentation Index](https://img.ly/docs/cesdk/react.md) or the [engine API Index](./api/engine.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

```ts
type SplitOptions = object;
```

Options for configuring block split operations.

## Properties

| Property | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
|  `attachToParent?` | `boolean` | `true` | Whether or not the new block will be attached to the same parent as the original. |
|  `createParentTrackIfNeeded?` | `boolean` | `false` | Whether to create a parent track if needed and add both blocks to it. Only used when attachToParent is true. |
|  `selectNewBlock?` | `boolean` | `true` | Whether to select the newly created block after splitting. |


---

## More Resources

- **[React Documentation Index](https://img.ly/docs/cesdk/react.md)** - Browse all React documentation
- **[engine API Reference](./api/engine.md)** - Full engine API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./react.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support