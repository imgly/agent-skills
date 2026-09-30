> This is one page of the CE.SDK React `@cesdk/cesdk-js` API reference. For a complete overview, see the [React Documentation Index](https://img.ly/docs/cesdk/react.md) or the [cesdk-js API Index](./api/cesdk-js.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

```ts
type EditorCheckBrowserSupportAction = (params?) => Promise<void>;
```

Action for checking browser capabilities at editor startup.
Idempotent: only runs checks once per editor lifetime.

When called with explicit params, uses them directly (no scene needed).
When called without params, reads scene mode for defaults.

## Parameters

| Parameter | Type |
| ------ | ------ |
| `params?` | \{ `videoDecode?`: [`UnsupportedCapabilityBehavior`](./api/cesdk-js/type-aliases/unsupportedcapabilitybehavior.md); `videoEncode?`: [`UnsupportedCapabilityBehavior`](./api/cesdk-js/type-aliases/unsupportedcapabilitybehavior.md); } |
| `params.videoDecode?` | [`UnsupportedCapabilityBehavior`](./api/cesdk-js/type-aliases/unsupportedcapabilitybehavior.md) |
| `params.videoEncode?` | [`UnsupportedCapabilityBehavior`](./api/cesdk-js/type-aliases/unsupportedcapabilitybehavior.md) |

## Returns

`Promise`\<`void`>


---

## More Resources

- **[React Documentation Index](https://img.ly/docs/cesdk/react.md)** - Browse all React documentation
- **[cesdk-js API Reference](./api/cesdk-js.md)** - Full cesdk-js API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./react.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support