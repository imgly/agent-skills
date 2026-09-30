> This is one page of the CE.SDK React `@cesdk/cesdk-js` API reference. For a complete overview, see the [React Documentation Index](https://img.ly/docs/cesdk/react.md) or the [cesdk-js API Index](./api/cesdk-js.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

```ts
type CustomActionFunction = (...args) => any | Promise<any>;
```

A generic action function type for custom actions.
Supports both synchronous and asynchronous implementations with flexible parameters.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| ...`args` | `any`\[] | Variable number of arguments of any type |

## Returns

`any` | `Promise`\<`any`>

Any value or a promise that resolves to any value


---

## More Resources

- **[React Documentation Index](https://img.ly/docs/cesdk/react.md)** - Browse all React documentation
- **[cesdk-js API Reference](./api/cesdk-js.md)** - Full cesdk-js API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./react.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support