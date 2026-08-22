> This is one page of the CE.SDK Next.js `@cesdk/cesdk-js` API reference. For a complete overview, see the [Next.js Documentation Index](https://img.ly/docs/cesdk/nextjs.md) or the [cesdk-js API Index](./api/cesdk-js.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

```ts
type TimelineSetHeightAction = (height) => void;
```

Action function for setting the video timeline's height.

A number fixes the timeline to that height in pixels. `'auto'` restores the
default behaviour: the timeline grows and shrinks to hug its content.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `height` | `number` | `"auto"` | The height in pixels, or `'auto'`. |

## Returns

`void`

## Example

```typescript
// Fixed 320px timeline that does not grow with content.
cesdk.actions.run('timeline.setHeight', 320);
// Back to the default content-hugging behaviour.
cesdk.actions.run('timeline.setHeight', 'auto');
```


---

## More Resources

- **[Next.js Documentation Index](https://img.ly/docs/cesdk/nextjs.md)** - Browse all Next.js documentation
- **[cesdk-js API Reference](./api/cesdk-js.md)** - Full cesdk-js API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./nextjs.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support