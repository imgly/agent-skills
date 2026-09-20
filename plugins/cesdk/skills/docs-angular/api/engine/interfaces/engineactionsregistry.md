> This is one page of the CE.SDK Angular `@cesdk/engine` API reference. For a complete overview, see the [Angular Documentation Index](https://img.ly/docs/cesdk/angular.md) or the [engine API Index](./api/engine.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

The typed action ids. The engine types the actions it implements here. Augment via
`declare module '@cesdk/engine'` to type your own ids and get autocomplete on register/run,
while custom string ids stay allowed.

## Properties

| Property | Type | Description |
| ------ | ------ | ------ |
|  `asset.drop` | (`payload`) => `void` | `Promise`\<`void`> | Runs when a dragged asset is released on the canvas. The default replaces the content of `target`, or adds the asset to `page` centered on the drop point. |


---

## More Resources

- **[Angular Documentation Index](https://img.ly/docs/cesdk/angular.md)** - Browse all Angular documentation
- **[engine API Reference](./api/engine.md)** - Full engine API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./angular.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support