> This is one page of the CE.SDK Next.js `@cesdk/engine` API reference. For a complete overview, see the [Next.js Documentation Index](https://img.ly/docs/cesdk/nextjs.md) or the [engine API Index](./api/engine.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

```ts
type EngineCapability = 
  | "aacEncode"
  | "opusEncode"
  | "h264Encode"
  | "hevcEncode"
  | "vp9Encode"
  | "av1Encode"
  | "h264Decode"
  | "hevcDecode"
  | "vp9Decode"
  | "av1Decode"
  | "tempFileStorage"
  | "concurrentFileRead";
```

A platform capability queryable via `EditorAPI.isCapabilitySupported`.


---

## More Resources

- **[Next.js Documentation Index](https://img.ly/docs/cesdk/nextjs.md)** - Browse all Next.js documentation
- **[engine API Reference](./api/engine.md)** - Full engine API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./nextjs.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support