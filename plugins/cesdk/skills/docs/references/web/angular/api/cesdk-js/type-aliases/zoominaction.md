> This is one page of the CE.SDK Angular `@cesdk/cesdk-js` API reference. For a complete overview, see the [Angular Documentation Index](https://img.ly/docs/cesdk/angular.md) or the [cesdk-js API Index](./api/cesdk-js.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

```ts
type ZoomInAction = (options?) => void | Promise<void>;
```

Action function for zooming in by one step

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `options?` | \{ `stepSize?`: `number`; `animate?`: | `boolean` | \{ `duration?`: `number`; `easing?`: `"Linear"` | `"EaseIn"` | `"EaseOut"` | `"EaseInOut"`; `interruptible?`: `boolean`; }; `maxZoom?`: `number`; } | - |
| `options.stepSize?` | `number` | Custom step size for zoom in (default uses predefined steps) |
| `options.animate?` | | `boolean` | \{ `duration?`: `number`; `easing?`: `"Linear"` | `"EaseIn"` | `"EaseOut"` | `"EaseInOut"`; `interruptible?`: `boolean`; } | Animation configuration - boolean for default animation or object for custom settings |
| `options.maxZoom?` | `number` | Maximum allowed zoom level (default: 32) |

## Returns

`void` | `Promise`\<`void`>


---

## More Resources

- **[Angular Documentation Index](https://img.ly/docs/cesdk/angular.md)** - Browse all Angular documentation
- **[cesdk-js API Reference](./api/cesdk-js.md)** - Full cesdk-js API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./angular.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support