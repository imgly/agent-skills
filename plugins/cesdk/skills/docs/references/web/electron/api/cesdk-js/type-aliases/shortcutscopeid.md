> This is one page of the CE.SDK Electron `@cesdk/cesdk-js` API reference. For a complete overview, see the [Electron Documentation Index](https://img.ly/docs/cesdk/electron.md) or the [cesdk-js API Index](./api/cesdk-js.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

```ts
type ShortcutScopeId = 
  | AddImageOptions
  | typeof VIDEO_TIMELINE_SHORTCUT_SCOPE
  | typeof EDITOR_SHORTCUT_SCOPE
  | `${PanelId}`;
```

The active `uiScope` of a keyboard-shortcut keypress. Resolves to:

- One of the named surface scopes (`ly.img.scope.canvas`,
  `ly.img.scope.videoTimeline`) when focus is in a region marked with
  `data-shortcut-scope`.
- A panel id (`//ly.img.panel/...`) when focus is inside a panel —
  every `PanelPortal` auto-stamps the panel's id as its scope.
- The default `ly.img.scope.editor` when focus is anywhere inside
  the editor root but not under a more specific marker.
- Any other string when a customer-registered scope or custom panel
  id is in the focus path.


---

## More Resources

- **[Electron Documentation Index](https://img.ly/docs/cesdk/electron.md)** - Browse all Electron documentation
- **[cesdk-js API Reference](./api/cesdk-js.md)** - Full cesdk-js API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./electron.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support