> This is one page of the CE.SDK React `@cesdk/cesdk-js` API reference. For a complete overview, see the [React Documentation Index](https://img.ly/docs/cesdk/react.md) or the [cesdk-js API Index](./api/cesdk-js.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

```ts
type AssetLibraryDockComponent = object;
```

Represents an asset library dock component.

The AssetLibraryDockComponent interface defines the structure of an asset library dock component.
It includes properties for the ID, key, label, icon, entries, and optional button styling/behavior.

## Properties

| Property | Type | Description |
| ------ | ------ | ------ |
|  `id` | `"ly.img.assetLibrary.dock"` | - |
|  `key?` | `string` | Individual and optional key for the component. |
|  `label?` | `string` | Label to display on the button. |
|  `icon?` | `string` | Icon to display on the button. |
|  `entries` | `string`\[] | Determines with what entries the asset library is opened. |
|  `onClick?` | () => `void` | Custom onClick handler. If provided, overrides the default asset library toggle behavior. |
|  `isSelected?` | `boolean` | (() => `boolean`) | Controls the selected state of the button. If provided, overrides the automatic detection. Can be a boolean or a function that returns a boolean for reactive updates. |
|  `isDisabled?` | `boolean` | (() => `boolean`) | Controls the disabled state of the button. If provided, overrides the automatic detection. Can be a boolean or a function that returns a boolean for reactive updates. |
|  `size?` | `"normal"` | `"large"` | Size of the button. Defaults to 'normal'. |
|  `variant?` | `"regular"` | `"plain"` | Visual variant of the button. Defaults to 'regular'. |
|  `color?` | `"accent"` | `"danger"` | Color scheme of the button. |


---

## More Resources

- **[React Documentation Index](https://img.ly/docs/cesdk/react.md)** - Browse all React documentation
- **[cesdk-js API Reference](./api/cesdk-js.md)** - Full cesdk-js API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./react.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support