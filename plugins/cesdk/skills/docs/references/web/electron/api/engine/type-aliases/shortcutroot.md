> This is one page of the CE.SDK Electron `@cesdk/engine` API reference. For a complete overview, see the [Electron Documentation Index](https://img.ly/docs/cesdk/electron.md) or the [engine API Index](./api/engine.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

```ts
type ShortcutRoot = HTMLElement | Document;
```

The DOM root the keyboard listener attaches to.

Defaults to the engine's canvas element so a headless `@cesdk/engine`
integration is scoped out of the box. A host UI widens it by passing its
editor container to ShortcutsAPI.mount. The listener is never bound
to `document`, so it cannot swallow keys belonging to the surrounding app.


---

## More Resources

- **[Electron Documentation Index](https://img.ly/docs/cesdk/electron.md)** - Browse all Electron documentation
- **[engine API Reference](./api/engine.md)** - Full engine API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./electron.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support