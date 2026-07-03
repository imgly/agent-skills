> This is one page of the CE.SDK Angular `@cesdk/engine` API reference. For a complete overview, see the [Angular Documentation Index](https://img.ly/docs/cesdk/angular.md) or the [engine API Index](./api/engine.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

Passed to a shortcut's `when` check and to a function `run`.

The engine API is engine-only: the context carries just the engine. Scope is
handled by the dispatcher (via the shortcut's `scopes`), not here — `when`
only checks engine state (edit mode, selection, …). A host that needs richer
state (the web editor's `cesdk`) closes over it in the predicate it registers.

## Properties

| Property | Type | Description |
| ------ | ------ | ------ |
|  `engine` | [`CreativeEngine`](./api/engine/classes/creativeengine.md) | The engine, for checking state like edit mode or selection. |


---

## More Resources

- **[Angular Documentation Index](https://img.ly/docs/cesdk/angular.md)** - Browse all Angular documentation
- **[engine API Reference](./api/engine.md)** - Full engine API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./angular.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support