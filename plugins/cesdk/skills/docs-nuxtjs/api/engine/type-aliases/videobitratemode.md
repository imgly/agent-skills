> This is one page of the CE.SDK Nuxt.js `@cesdk/engine` API reference. For a complete overview, see the [Nuxt.js Documentation Index](https://img.ly/docs/cesdk/nuxtjs.md) or the [engine API Index](./api/engine.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

```ts
type VideoBitrateMode = "System" | "Auto";
```

Selects how the video bitrate is determined when no explicit bitrate is given.

- `'System'`: let the platform encoder choose the bitrate (the default). In the browser this can be a very
  high, near-lossless rate that may cause large exports to fail with an out-of-memory error.
- `'Auto'`: a bounded default derived from the output resolution and framerate, consistent across platforms.


---

## More Resources

- **[Nuxt.js Documentation Index](https://img.ly/docs/cesdk/nuxtjs.md)** - Browse all Nuxt.js documentation
- **[engine API Reference](./api/engine.md)** - Full engine API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./nuxtjs.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support