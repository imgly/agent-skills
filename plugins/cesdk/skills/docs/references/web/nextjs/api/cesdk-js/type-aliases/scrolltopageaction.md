> This is one page of the CE.SDK Next.js `@cesdk/cesdk-js` API reference. For a complete overview, see the [Next.js Documentation Index](https://img.ly/docs/cesdk/nextjs.md) or the [cesdk-js API Index](./api/cesdk-js.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

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

- **[Next.js Documentation Index](https://img.ly/docs/cesdk/nextjs.md)** - Browse all Next.js documentation
- **[cesdk-js API Reference](./api/cesdk-js.md)** - Full cesdk-js API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./nextjs.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support