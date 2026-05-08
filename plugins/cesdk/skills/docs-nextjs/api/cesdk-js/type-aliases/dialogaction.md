> This is one page of the CE.SDK Next.js `@cesdk/cesdk-js` API reference. For a complete overview, see the [Next.js Documentation Index](https://img.ly/docs/cesdk/nextjs.md) or the [cesdk-js API Index](./api/cesdk-js.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

```ts
type DialogAction = object;
```

Represents an action in the dialog.

The DialogAction type defines the structure of an action that can be performed within a dialog.
It includes properties for the variant, color, label, and a callback function to handle the action
when clicked, providing flexibility in how user interactions are managed.

## Properties

| Property | Type |
| ------ | ------ |
|  `variant?` | `"regular"` | `"plain"` |
|  `color?` | `"accent"` | `"danger"` |
|  `label` | `string` |
|  `onClick` | (`context`) => `void` |


---

## More Resources

- **[Next.js Documentation Index](https://img.ly/docs/cesdk/nextjs.md)** - Browse all Next.js documentation
- **[cesdk-js API Reference](./api/cesdk-js.md)** - Full cesdk-js API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./nextjs.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support