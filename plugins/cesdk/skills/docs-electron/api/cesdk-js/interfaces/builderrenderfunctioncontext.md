> This is one page of the CE.SDK Electron `@cesdk/cesdk-js` API reference. For a complete overview, see the [Electron Documentation Index](https://img.ly/docs/cesdk/electron.md) or the [cesdk-js API Index](./api/cesdk-js.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

Represents the context for rendering a builder function.

The `BuilderRenderFunctionContext` interface provides a set of properties that
describe the context for rendering a builder function. These options include
settings for the builder, engine, state, payload, render optimized small viewport,
and experimental APIs.

## Type Parameters

| Type Parameter |
| ------ |
| `P` |

## Properties

| Property | Modifier | Type | Description |
| ------ | ------ | ------ | ------ |
|  `builder` | `public` | [`Builder`](./api/cesdk-js/interfaces/builder.md) | - |
|  `cesdk` | `public` | [`CreativeEditorSDK`](./api/cesdk-js/classes/creativeeditorsdk.md) | - |
|  `engine` | `public` | `CreativeEngine_2` | - |
|  `state` | `public` | \{ \<`T`> (`id`, `defaultValue`): `object`; \<`T`> (`id`): `object`; } | State object that can be used to store and retrieve local values. It will take a unique identifier for this state that can be used to access this store later. `const { value, setValue } = state('unique-id', 'default-value');` If no default value is set, the `value` property may be undefined if no value was set before: `const { value, setValue } = state('unique-id', 'default-value');` **Param** The unique identifier for the state. **Param** The default value for the state. |
|  `payload?` | `public` | `P` | - |
|  `renderOptimizedSmallViewport` | `public` | `boolean` | - |
|  `experimental` | `public` | [`BuilderRenderContext`](./api/cesdk-js/documentation/namespaces/experimentalbuilder/interfaces/builderrendercontext.md) | PLEASE NOTE: This contains experimental APIs. Use them with caution since they might change without warning and might be replaced with a completely different concept or maybe not at all. |


---

## More Resources

- **[Electron Documentation Index](https://img.ly/docs/cesdk/electron.md)** - Browse all Electron documentation
- **[cesdk-js API Reference](./api/cesdk-js.md)** - Full cesdk-js API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./electron.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support