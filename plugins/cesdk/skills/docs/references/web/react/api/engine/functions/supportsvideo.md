> This is one page of the CE.SDK React `@cesdk/engine` API reference. For a complete overview, see the [React Documentation Index](https://img.ly/docs/cesdk/react.md) or the [engine API Index](./api/engine.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

```ts
function supportsVideo(): boolean;
```

Checks if the current browser supports video editing.

## Returns

`boolean`

false if the browser does not support the required APIs.

## Deprecated

Run the engine's `video.decode.checkSupport` action instead:
`await engine.actions.run('video.decode.checkSupport')`. This only checks that the video APIs
exist, so it can answer true in a browser that cannot decode H.264.


---

## More Resources

- **[React Documentation Index](https://img.ly/docs/cesdk/react.md)** - Browse all React documentation
- **[engine API Reference](./api/engine.md)** - Full engine API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./react.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support