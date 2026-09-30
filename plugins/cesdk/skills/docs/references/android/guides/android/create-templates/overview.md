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

For Android, templates are loaded as CE.SDK scene files (`.scene`) or archive
templates. Photoshop (`.psd`) and InDesign (`.idml`) files are not imported
directly on Android. Convert those files with the Browser/Web or Node.js/Server
importers first, save the result as a scene or archive, and then load that
converted template in your Android app.

These imported designs can then be adapted into editable, structured templates inside CE.SDK.

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