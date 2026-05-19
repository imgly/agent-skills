> This is one page of the CE.SDK SvelteKit `@cesdk/cesdk-js` API reference. For a complete overview, see the [SvelteKit Documentation Index](https://img.ly/docs/cesdk/sveltekit.md) or the [cesdk-js API Index](./api/cesdk-js.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

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

- **[SvelteKit Documentation Index](https://img.ly/docs/cesdk/sveltekit.md)** - Browse all SvelteKit documentation
- **[cesdk-js API Reference](./api/cesdk-js.md)** - Full cesdk-js API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./sveltekit.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support