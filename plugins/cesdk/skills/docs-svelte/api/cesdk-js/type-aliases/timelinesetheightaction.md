> This is one page of the CE.SDK Svelte `@cesdk/cesdk-js` API reference. For a complete overview, see the [Svelte Documentation Index](https://img.ly/docs/cesdk/svelte.md) or the [cesdk-js API Index](./api/cesdk-js.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

```ts
type TimelineSetHeightAction = (settings) => void;
```

Action function for setting the video timeline's height behaviour.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `settings` | [`TimelineHeightSettings`](./api/cesdk-js/interfaces/timelineheightsettings.md) | The height settings to apply. |

## Returns

`void`

## Example

```typescript
// Fixed 320px timeline that does not grow with content.
cesdk.actions.run('timeline.setHeight', { height: 320 });
// Content-hugging behaviour, but never taller than 400px.
cesdk.actions.run('timeline.setHeight', { height: 'auto', maxHeight: 400 });
```


---

## More Resources

- **[Svelte Documentation Index](https://img.ly/docs/cesdk/svelte.md)** - Browse all Svelte documentation
- **[cesdk-js API Reference](./api/cesdk-js.md)** - Full cesdk-js API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./svelte.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support