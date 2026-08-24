> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Guides](../../guides.md) > [User Interface](../../user-interface.md) > [Appearance](../appearance.md) > [Custom Labels](./custom-labels.md)

---

Customize CE.SDK editor labels on Android by overriding the string resources that the editor UI reads from your app package.

CE.SDK's Android editor UI uses Android string resources for labels, button text, panel titles, dialogs, and accessibility descriptions. To change a label, add a string with the same resource name to your app module's `res/values/strings.xml`.

These overrides apply wherever the CE.SDK editor UI uses that resource, including ready-made surfaces such as the [Design Editor Starter Kit](../../starterkits/design-editor.md). They are best suited for product terminology, brand wording, and small copy refinements.

## Understanding Custom Labels

Custom labels let you change individual pieces of UI text while keeping the rest of the editor language unchanged. For example, you can change visible dock labels such as "Elements" to "Graphics", "Images" to "Photos", or "Add Page" to "New Page" without replacing the full localization file. For icon-only controls, such as the top editor bar, the same resource override changes the accessibility label instead of rendering visible text next to the icon.

Android resolves these labels through the normal resource merge step. Your app module's resource value takes precedence over the value shipped by the CE.SDK editor library, so the override is packaged with your APK or AAB.

## Android Resource Key Structure

Editor string resource names use a `ly_img_editor_` prefix followed by the UI area and element name:

| Pattern | Example | Purpose |
| --- | --- | --- |
| `ly_img_editor_navigation_bar_button_*` | `ly_img_editor_navigation_bar_button_export` | Navigation bar icon accessibility labels |
| `ly_img_editor_dock_button_*` | `ly_img_editor_dock_button_elements` | Dock buttons |
| `ly_img_editor_asset_library_title_*` | `ly_img_editor_asset_library_title_images` | Asset library tabs and titles |
| `ly_img_editor_canvas_menu_button_*` | `ly_img_editor_canvas_menu_button_delete` | Canvas menu actions |
| `ly_img_editor_pages_view_mode_dock_button_*` | `ly_img_editor_pages_view_mode_dock_button_add_page` | Page management actions |

Use the public CE.SDK Android source package path as the source of truth for built-in English labels: [sources/editor-core/src/main/res/values/strings.xml](https://github.com/imgly/cesdk-android/blob/v1.82.0-nightly.20260824/sources/editor-core/src/main/res/values/strings.xml).

## Override Labels in App Resources

Add only the resources you want to replace to your app module. Keep the same resource names and provide your custom values:

```xml

<resources>
    <string name="ly_img_editor_dock_button_elements">Graphics</string>
    <string name="ly_img_editor_asset_library_title_elements">Graphics</string>
    <string name="ly_img_editor_dock_button_images">Photos</string>
    <string name="ly_img_editor_asset_library_title_images">Photos</string>
    <string name="ly_img_editor_asset_library_section_images">Photos</string>
</resources>
```

You do not need to copy the complete CE.SDK resource file. Missing keys continue to use the defaults from the editor library.

## Override Labels for Localized UIs

Android resolves resources from the directory that best matches the current locale. CE.SDK ships locale-specific resources such as `values-de`, so an override in only `res/values/strings.xml` changes the default language but does not replace every localized CE.SDK default.

When you customize labels for a localized UI, add the same resource names to each matching locale directory in your app:

```xml

<resources>
    <string name="ly_img_editor_dock_button_images">Fotos</string>
    <string name="ly_img_editor_asset_library_title_images">Fotos</string>
    <string name="ly_img_editor_asset_library_section_images">Fotos</string>
</resources>
```

Use `res/values/strings.xml` for default wording and locale-specific directories, such as `res/values-de/strings.xml`, for language-specific wording.

## Customize Navigation Accessibility Labels

The built-in top editor bar uses icon-only buttons. Navigation bar resources such as `ly_img_editor_navigation_bar_button_export`, `ly_img_editor_navigation_bar_button_close_editor`, `ly_img_editor_navigation_bar_button_undo`, `ly_img_editor_navigation_bar_button_redo`, and `ly_img_editor_navigation_bar_button_toggle_preview_mode` are used as accessibility content descriptions for those icons, not as visible button text.

Override them when you want screen readers and UI automation to use product-wide terminology such as "Download" instead of "Export" or "Close" instead of "Back":

```xml
<resources>
    <string name="ly_img_editor_navigation_bar_button_export">Download</string>
    <string name="ly_img_editor_navigation_bar_button_close_editor">Close</string>
    <string name="ly_img_editor_navigation_bar_button_undo">Revert</string>
    <string name="ly_img_editor_navigation_bar_button_redo">Restore</string>
    <string name="ly_img_editor_navigation_bar_button_toggle_preview_mode">View Mode</string>
</resources>
```

Keep these labels short because they describe compact icon buttons. They do not visibly appear in the top editor bar unless you build a custom navigation surface that renders text labels.

## Customize Dock and Library Labels

Dock labels and asset library titles help users find content categories. Override both the dock button and the matching library title when you want the terminology to stay consistent after users open the library:

```xml
<resources>
    <string name="ly_img_editor_dock_button_elements">Graphics</string>
    <string name="ly_img_editor_asset_library_title_elements">Graphics</string>
    <string name="ly_img_editor_dock_button_images">Photos</string>
    <string name="ly_img_editor_asset_library_title_images">Photos</string>
    <string name="ly_img_editor_asset_library_section_images">Photos</string>
    <string name="ly_img_editor_dock_button_text">Typography</string>
    <string name="ly_img_editor_asset_library_title_text">Typography</string>
</resources>
```

Some asset labels are resolved from asset IDs. For those labels, CE.SDK looks for resource names such as `ly_img_editor_asset_label_fade`, then falls back to the label provided by the asset source.

## Customize Page and Action Labels

Page and action labels appear in page management controls, canvas menus, and inspector actions. Use the same terminology across related actions. The stock canvas menu uses icon-only buttons, so `ly_img_editor_canvas_menu_button_delete` and `ly_img_editor_canvas_menu_button_duplicate` set accessibility content descriptions; page-mode and inspector resources provide visible action text.

```xml
<resources>
    <string name="ly_img_editor_pages_view_mode_dock_button_add_page">New Page</string>
    <string name="ly_img_editor_pages_view_mode_dock_button_delete">Remove</string>
    <string name="ly_img_editor_pages_view_mode_dock_button_duplicate">Copy</string>
    <string name="ly_img_editor_canvas_menu_button_delete">Remove</string>
    <string name="ly_img_editor_canvas_menu_button_duplicate">Copy</string>
    <string name="ly_img_editor_inspector_bar_button_delete">Remove</string>
    <string name="ly_img_editor_inspector_bar_button_duplicate">Copy</string>
</resources>
```

If the same concept appears in more than one editor surface, override all related resources so users do not see mixed wording.

## Discovering Available Labels

Use the default resource files as the source of truth for available Android labels:

- English labels: [sources/editor-core/src/main/res/values/strings.xml](https://github.com/imgly/cesdk-android/blob/v1.82.0-nightly.20260824/sources/editor-core/src/main/res/values/strings.xml)
- German labels: [sources/editor-core/src/main/res/values-de/strings.xml](https://github.com/imgly/cesdk-android/blob/v1.82.0-nightly.20260824/sources/editor-core/src/main/res/values-de/strings.xml)
- Plugin labels: each plugin can ship its own `res/values/strings.xml`, for example [background removal](https://github.com/imgly/cesdk-android/blob/v1.82.0-nightly.20260824/sources/plugin-background-removal/src/main/res/values/strings.xml) uses `ly_img_plugin_background_removal_dock_button`

Search those files for the visible text first, then copy the matching resource name into your app module. The surrounding prefix usually identifies where the label appears, such as `navigation_bar`, `dock`, `asset_library`, `canvas_menu`, `inspector_bar`, or `dialog`.

## Best Practices

**Override Only What You Need**

Keep your app's resource file small and intentional:

```xml
<resources>
    <string name="ly_img_editor_dock_button_images">Photos</string>
    <string name="ly_img_editor_asset_library_title_images">Photos</string>
    <string name="ly_img_editor_asset_library_section_images">Photos</string>
</resources>
```

**Keep Related Labels Consistent**

When you change a term, check related surfaces for the same concept. For example, if you rename "Images" to "Photos", update the dock button, library title, and image section label together.

**Test Labels in Context**

Long labels can overflow compact buttons and sheets, and long accessibility descriptions can become noisy for assistive technology. Validate visible labels on the smallest device size you support, and prefer one or two words for dock buttons, page actions, and navigation icon descriptions.

**Document Your Overrides**

Keep a small comment or team note that explains why each override exists. This makes future CE.SDK updates easier to review when new default resources are added.

## Custom Labels vs. Full Localization

Custom labels change selected strings for the language your app is already using. Use them when you want brand-specific wording or a few targeted copy changes.

Use [Localization](../localization.md) when you need complete language coverage. For a new language, copy the default resource file into a locale-specific directory such as `res/values-fr/strings.xml` and translate the full set of strings.

## Runtime Considerations

Android resource overrides are resolved from packaged app resources. They are not a runtime translation dictionary, so changing labels for different brands, tenants, or user roles usually means one of these approaches:

- Package product-specific resource values per app flavor.
- Use locale-specific resource directories for language-specific wording.
- Build custom Compose UI for the surface that needs runtime text changes.

## Resource Reference

| Resource | Default text | Use when |
| --- | --- | --- |
| `ly_img_editor_navigation_bar_button_export` | Export | Set the export icon content description |
| `ly_img_editor_navigation_bar_button_close_editor` | Back | Set the editor close/back icon content description |
| `ly_img_editor_navigation_bar_button_undo` | Undo | Set the undo icon content description |
| `ly_img_editor_navigation_bar_button_redo` | Redo | Set the redo icon content description |
| `ly_img_editor_navigation_bar_button_toggle_preview_mode` | Toggle Preview | Set the preview mode icon content description |
| `ly_img_editor_dock_button_elements` | Elements | Rename the elements dock button |
| `ly_img_editor_dock_button_images` | Images | Rename the images dock button |
| `ly_img_editor_dock_button_text` | Text | Rename the text dock button |
| `ly_img_editor_asset_library_title_elements` | Elements | Rename the elements library title |
| `ly_img_editor_asset_library_title_images` | Images | Rename the images library title |
| `ly_img_editor_asset_library_section_images` | Images | Rename image sections inside the asset library |
| `ly_img_editor_asset_library_title_text` | Text | Rename the text library title |
| `ly_img_editor_pages_view_mode_dock_button_add_page` | Add Page | Rename the add-page action |
| `ly_img_editor_pages_view_mode_dock_button_delete` | Delete | Rename the page-mode delete action |
| `ly_img_editor_pages_view_mode_dock_button_duplicate` | Duplicate | Rename the page-mode duplicate action |
| `ly_img_editor_canvas_menu_button_delete` | Delete | Set the canvas-menu delete icon content description |
| `ly_img_editor_canvas_menu_button_duplicate` | Duplicate | Set the canvas-menu duplicate icon content description |
| `ly_img_editor_inspector_bar_button_delete` | Delete | Rename the inspector delete action |
| `ly_img_editor_inspector_bar_button_duplicate` | Duplicate | Rename the inspector duplicate action |

## Next Steps

- [Localization](../localization.md) - Manage complete language resources for the editor UI
- [Theming](./theming.md) - Customize the visual appearance of the interface
- [UI Extensions](../ui-extensions.md) - Extend the editor with custom panels, actions, and dialogs



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support