> This is one page of the CE.SDK iOS documentation. For a complete overview, see the [iOS Documentation Index](https://img.ly/docs/cesdk/ios/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/ios/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [User Interface](../user-interface.md) > [Overview](./overview.md)

---

The CreativeEditor SDK (CE.SDK) includes a powerful, fully-integrated user interface that enables your users to create, edit, and export stunning designs—without requiring you to build a UI from scratch. Whether you're launching a full-featured editor or embedding design tools into a larger application, CE.SDK provides everything you need to get started quickly.

Out of the box, the UI is professional, responsive, and production-ready. But it’s not a one-size-fits-all solution. You can fully **customize**, **extend**, or even **replace the UI entirely** with your own interface built on top of the CE.SDK engine. The SDK is designed to be as flexible as your product demands.

[Explore Demos](https://img.ly/showcases/cesdk?tags=ios)

[Get Started](../get-started/overview.md)

## Architecture

CE.SDK’s UI is modular, declaratively configured, and tightly integrated with the core engine. At a high level, it consists of:

- **Core Engine APIs** — The underlying logic for manipulating scenes, blocks, assets, and rendering
- **UI Components** — Panels, bars, buttons, and menus that interact with the engine through configuration and callbacks
- **Event System** — A reactive layer that tracks user input, selections, and state transitions

This separation of concerns allows you to extend, replace, or completely rebuild the UI without impacting the rendering and scene logic handled by the engine.

## Customizing the UI

You can tailor the editor’s interface to match your brand and use case. CE.SDK provides flexible APIs and configuration options for customizing:

### Appearance

- Change the UI theme or colors
- Use custom fonts and icons
- Localize labels and messages

### Layout

- Show or hide components based on context
- Reorder buttons or entire sections
- Rearrange dock elements or panel positions

### Behavior

- Enable or disable specific features
- Apply feature-based logic (e.g., show certain tools only for certain block types)

## Extending the UI

In addition to customizing what’s already there, you can **add entirely new functionality** to the UI:

- **Quick Actions** — One-click tools that perform fast edits (e.g., remove background)
- **Custom Buttons** — Add buttons to the dock, canvas menu, or canvas bar
- **Custom Panels** — Create complex UIs to support advanced workflows like export wizards or AI tools
- **Third-Party Integrations** — Connect with external APIs, such as QR generators or content management systems

## Building Your Own UI

While CE.SDK includes a fully-featured UI by default, you're not locked into it. Many developers choose to **build a completely custom UI** on top of the CE.SDK engine. This approach gives you full control over layout, interaction patterns, and visual design.

When building your own UI, you interact directly with:

- **The CE.SDK Engine** — Use the core APIs to manage scenes, create or modify blocks, control playback, and export content
- **Canvas Rendering** — Render and manipulate the canvas area within your application shell
- **State and Events** — Observe selections, listen for changes, and update your UI reactively

This approach is ideal when:

- You need tight integration with a larger application or workflow
- You want to match a highly specific design system
- You're building for a unique form factor or device
- You need to simplify the UI dramatically for a focused use case

## Integrating with Custom Workflows

The CE.SDK UI isn’t a closed system—it plays well with your broader application logic and workflows.

You can:

- **Sync programmatic state** — Reflect external data (e.g., product names or image URLs) directly in the editor
- **Control headless rendering** — Run the engine without the UI for automation or server-side rendering
- **Trigger external logic** — Connect UI actions (like export) to your own backend services

The UI components can be programmatically configured, replaced, or completely bypassed depending on your needs. Whether you’re creating a collaborative editor, running batch jobs, or embedding CE.SDK in a no-code platform, you have full control over how the UI interacts with your app.

## Next Steps

- [Customization](./customization.md) — Control which features are available and how UI components behave, appear, or are arranged in the editor.
- [Appearance](./appearance.md) — Customize the visual style of the editor UI, including themes, fonts, labels, and icons.
- [UI Extensions](./ui-extensions.md) — Extend the editor interface with custom components, panels, actions, and dialogs tailored to your workflow.
- [UI Events](./events.md) — Connect editor callbacks and UI events to your app logic.



---

## More Resources

- **[iOS Documentation Index](https://img.ly/docs/cesdk/ios/)** - Browse all iOS documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/ios/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/ios/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support