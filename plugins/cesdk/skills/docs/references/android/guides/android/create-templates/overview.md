> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Create and Use Templates](../create-templates.md) > [Overview](./overview.md)

---

Get a high-level map of CE.SDK template workflows on Android, from creation
and import to dynamic content and asset libraries.

In CE.SDK, a *template* is a scene or video composition prepared with editable areas, constraints, and optional dynamic inputs. It gives users specific places to change text or media while the surrounding layout, branding, and export workflow stay predictable.

Unlike a regular editable design, a template narrows editing freedom through placeholders, variables, and permissions. You decide which elements users can change, which parts stay locked, and whether the result is created through the CE.SDK UI, the API, or both.

Templates can produce static outputs such as PNG and PDF, as well as video outputs such as MP4. They are a core part of design automation, personalization, and streamlined creative workflows in Android apps.

[Explore Demos](https://img.ly/showcases/cesdk?tags=android)

[Get Started](../get-started/overview.md)

## Why Use Templates?

Templates are a powerful tool for:

- Maintaining **brand consistency** across all user-generated designs.
- **Scaling** asset creation for campaigns, catalogs, or print products.
- Providing a **guided experience** where users adapt content without starting from scratch.

They are ideal for use cases like:

- Personalized marketing campaigns
- Dynamic social media ads
- Product catalogs and e-commerce visuals
- Custom print materials and photo books

## Ways to Create Templates

You can create templates from scratch or by importing an existing template.

**From Scratch:** Start a new project and design a scene with the intent of turning it into a template. You can define variables, placeholders, and constraints directly in the editor.

**Import Existing Designs:** If you already have assets created in other tools, you can import them as templates.

For Android, templates are loaded as CE.SDK scene files (`.scene`) or archive
templates. Photoshop (`.psd`) and InDesign (`.idml`) files are not imported
directly on Android. Convert those files with the Browser/Web or Node.js/Server
importers first, save the result as a scene or archive, and then load that
converted template in your Android app.

These imported designs can then be adapted into editable, structured templates inside CE.SDK.

## Dynamic Content in Templates

Templates support dynamic content to enable data-driven generation of assets. CE.SDK provides several mechanisms:

- **Text Variables**: Bind text elements to dynamic values (e.g., user names, product SKUs).
- **Image Placeholders**: Reserve space for images to be inserted later.
- **Video Placeholders**: Reserve space for videos, enabling dynamic insertion of video clips in a templated layout.

This makes it easy to generate hundreds or thousands of personalized variations from a single design.

## Controlling Template Editing

Templates in CE.SDK offer powerful tools for controlling the editing experience:

- **Editing Constraints**: Lock specific properties such as position, style, or content of elements.
- **Locked Templates**: Prevent any edits outside allowed fields to protect design integrity.
- **Fully Editable Templates**: Allow unrestricted editing for power users or advanced workflows.
- **Form-Based Editing**: Build a custom editing interface for users to fill in variables and placeholders via input forms (a ready-made UI is not currently provided, but can be built using our APIs).

These options let you strike a balance between creative freedom and design control.

## Working with Templates Programmatically and Through the UI

You can manage templates using both the UI and API:

- **UI Integration**: Users can select, apply, and edit templates directly inside the CE.SDK interface.
- **Programmatic Access**: Use the SDK’s APIs to create, apply, or modify templates as part of an automated workflow.
- **Asset Library Integration**: Templates can appear in the asset library, allowing users to browse and pick templates visually.
  - The Asset Library's appearance and behavior can be fully customized to fit your app’s needs.

## Managing Templates

Templates are saved and reused just like any other CE.SDK asset:

- **Save Templates** to a *Template Library*.
- **Edit or Remove** existing templates from your asset library.
- Templates are saved as Scene (`.scene`) or Archive (`.zip`) files and can be loaded across all platforms supported by CE.SDK (Web, Mobile, Server, Desktop)

## Default and Premium Templates

- **Default Templates**: CE.SDK may include a small number of starter templates depending on your configuration.
- **Premium Templates**: IMG.LY offers a growing collection of professionally designed templates available for licensing.
- Templates can be imported, customized, and used directly within your app.

Check your license or speak with our team for details on accessing premium templates.

## Templates as Assets

Templates are treated as **assets** in CE.SDK. That means:

- They can be included in local or remote asset libraries.
- They can be shared, versioned, and indexed using the same systems as images or videos.
- You can apply your own metadata, tags, and search capabilities to them.

## Next Steps

- [Create From Scratch](./from-scratch.md) - Build reusable design templates programmatically using CE.SDK APIs.
- [Text Variables](./add-dynamic-content/text-variables.md) - Define dynamic text elements that can be populated with custom values.
- [Placeholders](./add-dynamic-content/placeholders.md) - Mark editable image, video, or text areas within a locked template layout.
- [Set Editing Constraints](./add-dynamic-content/set-editing-constraints.md) - Learn how to control editing capabilities in CE.SDK templates using the Scope system to lock positions, prevent transformations, and create guided editing experiences
- [Asset Library](../import-media/asset-library.md) - Manage how users browse, preview, and insert templates and other assets.



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support