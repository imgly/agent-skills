> This is one page of the CE.SDK Electron `@cesdk/cesdk-js` API reference. For a complete overview, see the [Electron Documentation Index](https://img.ly/docs/cesdk/electron.md) or the [cesdk-js API Index](./api/cesdk-js.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

```ts
function useOrderContext<A>(area): object;
```

Hook for reading and setting order context for a UI area.

Components wrapped with `observer` will automatically re-render when the context changes.

## Type Parameters

| Type Parameter |
| ------ |
| `A` *extends* [`UIArea`](./api/cesdk-js/type-aliases/uiarea.md) |

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `area` | `A` | The UI area to get/set context for |

## Returns

`object`

Object with `context` and `setContext`

| Name | Type |
| ------ | ------ |
| `context` | [`UIAreaContext`](./api/cesdk-js/type-aliases/uiareacontext.md)\<`A`> |
| `setContext()` | (`ctx`) => `void` |

## Example

```tsx
function MyCaptionStyleButton() {
  const { context, setContext } = useOrderContext('ly.img.caption.panel');
  return <button onClick={() => setContext({ view: 'style' })}>Styles</button>;
}
```


---

## More Resources

- **[Electron Documentation Index](https://img.ly/docs/cesdk/electron.md)** - Browse all Electron documentation
- **[cesdk-js API Reference](./api/cesdk-js.md)** - Full cesdk-js API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./electron.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support