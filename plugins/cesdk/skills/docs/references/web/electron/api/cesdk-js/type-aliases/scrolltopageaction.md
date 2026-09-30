> This is one page of the CE.SDK Electron `@cesdk/cesdk-js` API reference. For a complete overview, see the [Electron Documentation Index](https://img.ly/docs/cesdk/electron.md) or the [cesdk-js API Index](./api/cesdk-js.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

```ts
type ScrollToPageAction = (options?) => Promise<void>;
```

Action function for scrolling to a specific page

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `options?` | \{ `pageId?`: `number`; `animate?`: `boolean`; } | - |
| `options.pageId?` | `number` | The page ID to scroll to (defaults to current page) |
| `options.animate?` | `boolean` | Whether to animate the scroll (default: false) |

## Returns

`Promise`\<`void`>


---

## More Resources

- **[Electron Documentation Index](https://img.ly/docs/cesdk/electron.md)** - Browse all Electron documentation
- **[cesdk-js API Reference](./api/cesdk-js.md)** - Full cesdk-js API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./electron.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support