> This is one page of the CE.SDK Next.js `@cesdk/cesdk-js` API reference. For a complete overview, see the [Next.js Documentation Index](https://img.ly/docs/cesdk/nextjs.md) or the [cesdk-js API Index](./api/cesdk-js.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

```ts
type ScaleFn = ({ containerWidth, isTouch }) => Scale;
```

A function that returns a scale value based on viewport properties.
This allows for dynamic scale selection based on runtime conditions.

## Parameters

| Parameter | Type |
| ------ | ------ |
| `{ containerWidth, isTouch }` | \{ `containerWidth?`: `number`; `isTouch?`: `boolean`; } |
| `{ containerWidth, isTouch }.containerWidth?` | `number` |
| `{ containerWidth, isTouch }.isTouch?` | `boolean` |

## Returns

[`Scale`](./api/cesdk-js/documentation/namespaces/configtypes/type-aliases/scale.md)


---

## More Resources

- **[Next.js Documentation Index](https://img.ly/docs/cesdk/nextjs.md)** - Browse all Next.js documentation
- **[cesdk-js API Reference](./api/cesdk-js.md)** - Full cesdk-js API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./nextjs.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support