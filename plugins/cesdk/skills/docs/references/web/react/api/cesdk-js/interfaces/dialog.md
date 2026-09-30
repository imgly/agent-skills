> This is one page of the CE.SDK React `@cesdk/cesdk-js` API reference. For a complete overview, see the [React Documentation Index](https://img.ly/docs/cesdk/react.md) or the [cesdk-js API Index](./api/cesdk-js.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

Represents a dialog configuration.

The Dialog interface defines the structure of a dialog configuration within the Creative Editor SDK.
It includes properties for the type, size, content, progress, actions, cancel action, onClose callback,
and whether clicking outside the dialog should close it. This interface provides a comprehensive way to
define and manage dialogs, allowing for flexibility in how they are presented and interacted with by users.

## Properties

| Property | Type |
| ------ | ------ |
|  `type?` | [`DialogType`](./api/cesdk-js/type-aliases/dialogtype.md) |
|  `size?` | [`DialogSize`](./api/cesdk-js/type-aliases/dialogsize.md) |
|  `backdrop?` | [`DialogBackdrop`](./api/cesdk-js/type-aliases/dialogbackdrop.md) |
|  `content` | [`DialogContent`](./api/cesdk-js/type-aliases/dialogcontent.md) |
|  `progress?` | [`DialogProgress`](./api/cesdk-js/type-aliases/dialogprogress.md) |
|  `actions?` | | [`DialogAction`](./api/cesdk-js/type-aliases/dialogaction.md) | [`DialogAction`](./api/cesdk-js/type-aliases/dialogaction.md)\[] |
|  `cancel?` | [`DialogAction`](./api/cesdk-js/type-aliases/dialogaction.md) |
|  `onClose?` | () => `void` |
|  `clickOutsideToClose?` | `boolean` |


---

## More Resources

- **[React Documentation Index](https://img.ly/docs/cesdk/react.md)** - Browse all React documentation
- **[cesdk-js API Reference](./api/cesdk-js.md)** - Full cesdk-js API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./react.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support