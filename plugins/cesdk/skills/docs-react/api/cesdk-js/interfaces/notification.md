> This is one page of the CE.SDK React `@cesdk/cesdk-js` API reference. For a complete overview, see the [React Documentation Index](https://img.ly/docs/cesdk/react.md) or the [cesdk-js API Index](./api/cesdk-js.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

Represents a notification configuration.

The Notification interface defines the structure of a notification configuration within the Creative Editor SDK.
It includes properties for the type, message, duration, onDismiss callback, and action. This interface provides a
comprehensive way to define and manage notifications, allowing for flexibility in how they are presented and
interacted with by users.

## Properties

| Property | Type |
| ------ | ------ |
|  `type?` | [`NotificationType`](./api/cesdk-js/type-aliases/notificationtype.md) |
|  `message` | `string` |
|  `duration?` | [`NotificationDuration`](./api/cesdk-js/type-aliases/notificationduration.md) |
|  `onDismiss?` | () => `void` |
|  `action?` | `object` |
| `action.label` | `string` |
| `action.onClick` | (`context`) => `void` |


---

## More Resources

- **[React Documentation Index](https://img.ly/docs/cesdk/react.md)** - Browse all React documentation
- **[cesdk-js API Reference](./api/cesdk-js.md)** - Full cesdk-js API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./react.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support