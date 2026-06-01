> This is one page of the CE.SDK Angular `@cesdk/engine` API reference. For a complete overview, see the [Angular Documentation Index](https://img.ly/docs/cesdk/angular.md) or the [engine API Index](./api/engine.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

```ts
type HistoryUpdate = "Updated" | "Activated";
```

Describes the kind of update that triggered an `onHistoryUpdatedWithKind` callback.

- `Updated`: The active history's snapshots changed: a new snapshot was added (e.g. after an edit), or undo/redo
  was applied. The scene state changed as a direct consequence.
- `Activated`: A different history buffer was activated via `setActiveHistory`. The undo/redo stack visible to the
  user changed, but no new snapshot was created and no undo/redo was applied as part of this event.


---

## More Resources

- **[Angular Documentation Index](https://img.ly/docs/cesdk/angular.md)** - Browse all Angular documentation
- **[engine API Reference](./api/engine.md)** - Full engine API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./angular.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support