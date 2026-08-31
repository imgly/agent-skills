> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [User Interface](../user-interface.md) > [Localization](./localization.md)

---

Localize the CE.SDK editor UI on Android by overriding the string resources
that ship with the editor library.

CE.SDK's Android editor UI uses standard Android string resources for labels, button text, sheet titles, dialogs, and accessibility descriptions. These resources apply wherever the CE.SDK editor UI renders Android strings, including ready-made surfaces such as the [Design Editor Starter Kit](../starterkits/design-editor.md).

There is no runtime `setLocale()` or translation dictionary API for the Android editor UI. Android selects the active resources from the app or device locale, and your app overrides CE.SDK defaults by packaging resources with the same names.

## Default Languages and Resource Lookup

CE.SDK ships editor resources for English and German:

- English defaults live in [`sources/editor-core/src/main/res/values/strings.xml`](https://github.com/imgly/cesdk-android/blob/v1.83.0-nightly.20260831/sources/editor-core/src/main/res/values/strings.xml).
- German defaults live in [`sources/editor-core/src/main/res/values-de/strings.xml`](https://github.com/imgly/cesdk-android/blob/v1.83.0-nightly.20260831/sources/editor-core/src/main/res/values-de/strings.xml).

Android merges resources from your app module and its library dependencies when it builds the APK or AAB. If your app declares a string resource with the same name as a CE.SDK editor resource, your app's value takes precedence for that resource configuration.

Locale-specific directories still matter. An override in `res/values/strings.xml` changes the default value, while CE.SDK's `values-de` value can still render on a German device unless you also provide a matching `res/values-de/strings.xml` override.

## Finding the Resource You Want to Translate

Editor resource names use the `ly_img_editor_` prefix followed by the UI area, element type, and specific name. Search the English resource file for the visible text you want to change, then copy the matching resource name into your app.

| Visible UI element | Resource name |
| --- | --- |
| Gallery dock button | `ly_img_editor_dock_button_gallery` |
| Images asset library title | `ly_img_editor_asset_library_title_images` |
| Text format sheet title | `ly_img_editor_sheet_format_text_title` |

Plugin resources can live in plugin modules and usually use a plugin-specific prefix, such as `ly_img_plugin_*`. Check the plugin's own `res/values/strings.xml` file when you want to translate plugin UI.

## Overriding Existing Strings

Add only the resources you want to replace to your app module. Keep the resource names unchanged:

```xml

<resources>
    <string name="ly_img_editor_dock_button_gallery">Media</string>
    <string name="ly_img_editor_sheet_format_text_title">Typography</string>
</resources>
```

For each locale your app supports, add the same resource names to the matching locale directory:

```xml

<resources>
    <string name="ly_img_editor_dock_button_gallery">Medien</string>
    <string name="ly_img_editor_sheet_format_text_title">Typografie</string>
</resources>
```

You do not need to copy the complete CE.SDK resource file for small terminology changes. Missing keys continue to use the defaults from the editor library. If you only need selected brand terms or label changes, the [Custom Labels](./appearance/custom-labels.md) guide covers that narrower workflow in more detail.

## White-labeling and Custom Terminology

Resource overrides are also the Android white-labeling mechanism for editor text. Keep related terms consistent across surfaces: if you rename "Images" to "Photos", update the dock button, the asset library title, and the image section label together.

```xml
<resources>
    <string name="ly_img_editor_dock_button_images">Photos</string>
    <string name="ly_img_editor_asset_library_title_images">Photos</string>
    <string name="ly_img_editor_asset_library_section_images">Photos</string>
</resources>
```

Resource values are packaged at build time. For tenant-specific or brand-specific wording, use Android product flavors, locale-specific resources, or custom Compose UI for the surface that needs runtime text changes.

## Adding Support for a New Language

To add a language that CE.SDK does not ship, copy the English editor resource file into a locale-specific directory such as `res/values-fr/strings.xml`, then translate the values. The fragment below shows the file shape:

```xml

<resources>
    <string name="ly_img_editor_dock_button_gallery">Galerie</string>
    <string name="ly_img_editor_dock_button_images">Images</string>
    <string name="ly_img_editor_asset_library_title_images">Images</string>
    <string name="ly_img_editor_asset_library_section_images">Images</string>
    <string name="ly_img_editor_sheet_format_text_title">Format</string>
</resources>
```

For complete language coverage, translate the full editor resource set. If a key is missing from your new locale, Android falls back to the default resource value, which can leave parts of the editor in English.

When your app uses Android's per-app language picker, make sure the new locale is included in the app's supported locale configuration so users can select it.

## Troubleshooting

### My Override Has No Effect

Confirm the resource name matches the CE.SDK resource exactly and that the file is in your app module's `res` directory. Resource names are resolved by exact string equality after Android's resource merge step.

### Some Strings Stay in German or English

Check whether the active device or app locale uses a more specific resource directory. For example, a German device can still use CE.SDK's bundled `values-de` value when your app only overrides the default `res/values/strings.xml` value.

### A Formatted Label Renders Incorrectly

Preserve Android format placeholders when you override strings that contain values such as `%s` or `%d`. The editor reads regular `ly_img_editor_*` resources with Android's native string formatting, so changing or removing placeholders can break labels that receive runtime values.

## Key Reference

| Concern | Android resource location |
| --- | --- |
| Key naming convention | `ly_img_editor_<surface>_<element>_<name>` |
| English editor strings | [`res/values/strings.xml`](https://github.com/imgly/cesdk-android/blob/v1.83.0-nightly.20260831/sources/editor-core/src/main/res/values/strings.xml) |
| German editor strings | [`res/values-de/strings.xml`](https://github.com/imgly/cesdk-android/blob/v1.83.0-nightly.20260831/sources/editor-core/src/main/res/values-de/strings.xml) |
| Override location | Your app module's `res/values/strings.xml` |
| Locale-specific override | Your app module's `res/values-<locale>/strings.xml` |
| Locale selection | Android app or device locale and resource qualifiers |

## Next Steps

- [Custom Error Messages](./custom-error-messages.md) — Override engine error dialogs with localized, customer-facing copy
- [UI Customization](./customization.md) — Customize editor components and layout
- [Configuration](../configuration.md) — Explore editor configuration options
- [Asset Library Customization](../import-media/asset-library/customize.md) — Customize asset sources and library



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support