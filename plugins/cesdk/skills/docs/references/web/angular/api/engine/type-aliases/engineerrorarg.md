> This is one page of the CE.SDK Angular `@cesdk/engine` API reference. For a complete overview, see the [Angular Documentation Index](https://img.ly/docs/cesdk/angular.md) or the [engine API Index](./api/engine.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

```ts
type EngineErrorArg = boolean | number | string;
```

Typed value of a structured-error template argument. The engine preserves the original primitive
type (`boolean`, `number`, `string`) when crossing the binding boundary, so customer-facing i18n
layers can format numbers, plurals, etc. without parsing stringified values.


---

## More Resources

- **[Angular Documentation Index](https://img.ly/docs/cesdk/angular.md)** - Browse all Angular documentation
- **[engine API Reference](./api/engine.md)** - Full engine API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./angular.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support