> This is one page of the CE.SDK Electron `@cesdk/cesdk-js` API reference. For a complete overview, see the [Electron Documentation Index](https://img.ly/docs/cesdk/electron.md) or the [cesdk-js API Index](./api/cesdk-js.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

```ts
type FeaturePredicateContext = IsEnabledFeatureContext & object;
```

Represents the context for enabling a feature.
This type extends `IsEnabledFeatureContext` and includes a function to check the previous enable state
and a function to get the default predicate.

## Type Declaration

| Name | Type |
| ------ | ------ |
| `isPreviousEnable()` | () => `boolean` |
| `defaultPredicate()` | () => `boolean` |


---

## More Resources

- **[Electron Documentation Index](https://img.ly/docs/cesdk/electron.md)** - Browse all Electron documentation
- **[cesdk-js API Reference](./api/cesdk-js.md)** - Full cesdk-js API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./electron.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support