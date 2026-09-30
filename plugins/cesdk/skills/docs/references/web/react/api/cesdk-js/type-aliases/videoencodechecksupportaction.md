> This is one page of the CE.SDK React `@cesdk/cesdk-js` API reference. For a complete overview, see the [React Documentation Index](https://img.ly/docs/cesdk/react.md) or the [cesdk-js API Index](./api/cesdk-js.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

```ts
type VideoEncodeCheckSupportAction = (options?) => Promise<boolean>;
```

Action function for checking video encoding/export support.
Returns true if H.264 video encoding and AAC audio encoding are supported.
Shows a warning dialog if not supported (unless dialog is disabled).

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `options?` | \{ `dialog?`: | `boolean` | [`VideoSupportDialogOptions`](./api/cesdk-js/type-aliases/videosupportdialogoptions.md); } | Options for configuring the action behavior - dialog: false to disable the dialog, true for default, or VideoSupportDialogOptions for fine control |
| `options.dialog?` | | `boolean` | [`VideoSupportDialogOptions`](./api/cesdk-js/type-aliases/videosupportdialogoptions.md) | - |

## Returns

`Promise`\<`boolean`>

A promise that resolves to true if video encoding is supported, false otherwise


---

## More Resources

- **[React Documentation Index](https://img.ly/docs/cesdk/react.md)** - Browse all React documentation
- **[cesdk-js API Reference](./api/cesdk-js.md)** - Full cesdk-js API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./react.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support