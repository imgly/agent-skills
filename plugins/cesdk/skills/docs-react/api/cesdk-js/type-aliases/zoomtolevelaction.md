> This is one page of the CE.SDK React `@cesdk/cesdk-js` API reference. For a complete overview, see the [React Documentation Index](https://img.ly/docs/cesdk/react.md) or the [cesdk-js API Index](./api/cesdk-js.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

```ts
type ZoomToLevelAction = (level, options?) => void | Promise<void>;
```

Action function for setting zoom to a specific level

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `level` | `number` | - |
| `options?` | \{ `animate?`: | `boolean` | \{ `duration?`: `number`; `easing?`: `"Linear"` | `"EaseIn"` | `"EaseOut"` | `"EaseInOut"`; `interruptible?`: `boolean`; }; `minZoom?`: `number`; `maxZoom?`: `number`; } | - |
| `options.animate?` | | `boolean` | \{ `duration?`: `number`; `easing?`: `"Linear"` | `"EaseIn"` | `"EaseOut"` | `"EaseInOut"`; `interruptible?`: `boolean`; } | Animation configuration - boolean for default animation or object for custom settings |
| `options.minZoom?` | `number` | Minimum allowed zoom level (default: 0.125) |
| `options.maxZoom?` | `number` | Maximum allowed zoom level (default: 32) |

## Returns

`void` | `Promise`\<`void`>


---

## More Resources

- **[React Documentation Index](https://img.ly/docs/cesdk/react.md)** - Browse all React documentation
- **[cesdk-js API Reference](./api/cesdk-js.md)** - Full cesdk-js API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./react.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support