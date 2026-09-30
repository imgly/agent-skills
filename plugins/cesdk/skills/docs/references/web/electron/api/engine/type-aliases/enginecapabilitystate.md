> This is one page of the CE.SDK Electron `@cesdk/engine` API reference. For a complete overview, see the [Electron Documentation Index](https://img.ly/docs/cesdk/electron.md) or the [engine API Index](./api/engine.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

```ts
type EngineCapabilityState = "unchecked" | "pending" | "supported" | "unsupported";
```

Where a capability stands, in this order:

- `unchecked`: nothing has asked for it to be measured, so it stays this way until something
  calls `checkCapabilities()` or runs a video check action.
- `pending`: it is being measured, and the answer arrives on its own.
- `supported` or `unsupported`: the answer. A codec that stays silent through its own test counts
  as `unsupported`. A measurement the browser cuts off, as a background tab can, is no answer:
  the capability goes back to `unchecked`, and anyone still waiting gets a new measurement.


---

## More Resources

- **[Electron Documentation Index](https://img.ly/docs/cesdk/electron.md)** - Browse all Electron documentation
- **[engine API Reference](./api/engine.md)** - Full engine API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./electron.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support