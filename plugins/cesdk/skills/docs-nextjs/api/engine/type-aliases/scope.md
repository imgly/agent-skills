> This is one page of the CE.SDK Next.js `@cesdk/engine` API reference. For a complete overview, see the [Next.js Documentation Index](https://img.ly/docs/cesdk/nextjs.md) or the [engine API Index](./api/engine.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

```ts
type Scope = 
  | "text/edit"
  | "text/character"
  | "fill/change"
  | "fill/changeType"
  | "stroke/change"
  | "shape/change"
  | "layer/move"
  | "layer/resize"
  | "layer/rotate"
  | "layer/flip"
  | "layer/crop"
  | "layer/opacity"
  | "layer/blendMode"
  | "layer/visibility"
  | "layer/clipping"
  | "appearance/adjustments"
  | "appearance/filter"
  | "appearance/effect"
  | "appearance/blur"
  | "appearance/shadow"
  | "appearance/animation"
  | "lifecycle/destroy"
  | "lifecycle/duplicate"
  | "editor/add"
  | "editor/select";
```

Represents the various scopes that define the capabilities and permissions
within the Creative Editor SDK. Each scope corresponds to a specific
functionality or action that can be performed within the editor.

The `Scope` type is used to control access to different features and operations,
allowing for fine-grained control over what actions are permitted.


---

## More Resources

- **[Next.js Documentation Index](https://img.ly/docs/cesdk/nextjs.md)** - Browse all Next.js documentation
- **[engine API Reference](./api/engine.md)** - Full engine API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./nextjs.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support