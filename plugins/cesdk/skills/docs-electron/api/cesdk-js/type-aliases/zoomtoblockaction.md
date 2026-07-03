> This is one page of the CE.SDK Electron `@cesdk/cesdk-js` API reference. For a complete overview, see the [Electron Documentation Index](https://img.ly/docs/cesdk/electron.md) or the [cesdk-js API Index](./api/cesdk-js.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

```ts
type ZoomToBlockAction = (blockId, options?) => Promise<void>;
```

Action function for zooming to a specific block

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `blockId` | `number` | - |
| `options?` | \{ `padding?`: | `number` | \{ `x?`: `number`; `y?`: `number`; } | \{ `top?`: `number`; `bottom?`: `number`; `left?`: `number`; `right?`: `number`; }; `animate?`: | `boolean` | \{ `duration?`: `number`; `easing?`: `"Linear"` | `"EaseIn"` | `"EaseOut"` | `"EaseInOut"`; `interruptible?`: `boolean`; }; `autoFit?`: `boolean`; } | - |
| `options.padding?` | | `number` | \{ `x?`: `number`; `y?`: `number`; } | \{ `top?`: `number`; `bottom?`: `number`; `left?`: `number`; `right?`: `number`; } | Padding configuration around the block |
| `options.animate?` | | `boolean` | \{ `duration?`: `number`; `easing?`: `"Linear"` | `"EaseIn"` | `"EaseOut"` | `"EaseInOut"`; `interruptible?`: `boolean`; } | Animation configuration - boolean for default animation or object for custom settings |
| `options.autoFit?` | `boolean` | Whether to enable auto-fit mode after zooming (default: false) |

## Returns

`Promise`\<`void`>


---

## More Resources

- **[Electron Documentation Index](https://img.ly/docs/cesdk/electron.md)** - Browse all Electron documentation
- **[cesdk-js API Reference](./api/cesdk-js.md)** - Full cesdk-js API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./electron.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support