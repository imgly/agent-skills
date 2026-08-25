> This is one page of the CE.SDK iOS documentation. For a complete overview, see the [iOS Documentation Index](https://img.ly/docs/cesdk/ios/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/ios/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [User Interface](../user-interface.md) > [Localization](./localization.md)

---

Localize the CE.SDK editor UI on iOS by editing Apple String Catalogs — no runtime API needed.

The CE.SDK editor surfaces in English (`en`) and German (`de`) out of the box, with every editor string shipped in a String Catalog (`IMGLYEditor.xcstrings`) bundled inside the SDK. There is no runtime localization API to call — instead, the editor uses Apple's `LocalizedStringResource` type through a CE.SDK lookup extension that checks your app bundle's catalogs before falling back to the SDK's bundled translations. Drop the matching key into one of your app's String Catalogs and the editor picks it up automatically.

## Default Languages and Lookup Order

CE.SDK ships translations for English and German in `IMGLYEditor.xcstrings`, bundled inside the `IMGLYCoreUI` module of [`IMGLYUI-swift`](https://github.com/imgly/IMGLYUI-swift/blob/1.82.0-nightly.20260825/Sources/IMGLYCoreUI/IMGLYEditor.xcstrings). When the editor renders a label, CE.SDK's `LocalizedStringResource` extension resolves each key against three (bundle, table) pairs in order:

1. `Localizable.xcstrings` (or `Localizable.strings`) in your app's main bundle.
2. `IMGLYEditor.xcstrings` in your app's main bundle, if you ship one.
3. `IMGLYEditor.xcstrings` in the `IMGLYCoreUI` bundle — the SDK default.

The first pair that contains the key wins. That means any key you redefine in your app's `Localizable.xcstrings` overrides both the SDK's bundled string and any copy you keep in your own `IMGLYEditor.xcstrings`. Once a bundle is selected, Apple's standard locale resolution takes over for that bundle: the entry for the active locale renders; if the bundle has no entry for the active locale, Apple falls back to that bundle's source language (English).

The active locale is selected by the system based on the user's iOS language settings and your app's supported localizations in `Info.plist` (`CFBundleLocalizations`). The SDK does not expose a programmatic locale setter — switching languages at runtime follows the standard Apple flow.

## Finding the Key You Want to Override

Every editor string has a stable key with the form `ly_img_editor_<surface>_<element>_<name>`. Browse the canonical list in the [SDK's `IMGLYEditor.xcstrings`](https://github.com/imgly/IMGLYUI-swift/blob/1.82.0-nightly.20260825/Sources/IMGLYCoreUI/IMGLYEditor.xcstrings) and search for the visible text you want to change. A few examples:

| Visible UI element | Key |
| --- | --- |
| "Photo Roll" dock button | `ly_img_editor_dock_button_photo_roll` |
| "Format" sheet title for text blocks | `ly_img_editor_sheet_format_text_title` |
| "Design" navigation bar button | `ly_img_editor_navigation_bar_button_design` |

Copy the exact key — Apple's lookup is string-equality based and the editor key takes effect only when your override uses the matching identifier.

## Overriding Existing Strings

Add the keys you want to change to your app's `Localizable.xcstrings` and provide values for the locales you support. The SDK falls back to the bundled English / German values for every key you leave alone.

```json
{
  "sourceLanguage" : "en",
  "strings" : {
    "ly_img_editor_dock_button_photo_roll" : {
      "localizations" : {
        "en" : {
          "stringUnit" : {
            "state" : "translated",
            "value" : "Gallery"
          }
        },
        "de" : {
          "stringUnit" : {
            "state" : "translated",
            "value" : "Galerie"
          }
        }
      }
    },
    "ly_img_editor_sheet_format_text_title" : {
      "localizations" : {
        "en" : {
          "stringUnit" : {
            "state" : "translated",
            "value" : "Typography"
          }
        },
        "de" : {
          "stringUnit" : {
            "state" : "translated",
            "value" : "Typografie"
          }
        }
      }
    }
  },
  "version" : "1.0"
}
```

If you prefer to keep editor overrides separate from your app's own strings, ship a sibling `IMGLYEditor.xcstrings` in your main bundle with the same structure. Keys defined in `Localizable.xcstrings` still take precedence — the `IMGLYEditor.xcstrings` layer is useful when you want to override many keys at once without crowding your app's primary catalog.

## White-labeling and Custom Terminology

The same override mechanism doubles as a white-labeling tool. To rebrand the editor — say, replace "Photo Roll" with your product's name across both languages — keep the rest of the keys in the SDK's catalog untouched and only ship the specific keys you want to customize. Your `Localizable.xcstrings` ends up holding a focused list of brand-specific overrides; English / German fallbacks come from the SDK for everything else.

If your brand applies across many keys (custom button names, sheet titles, alert copy, asset library section names), centralize the overrides in your app's `Localizable.xcstrings`, or copy the SDK's `IMGLYEditor.xcstrings` into your bundle if you'd rather keep editor strings separate from your app's own. Those are the only two catalogs the lookup chain inspects — a catalog under any other name (`MyBrand.xcstrings`, for example) will not be picked up. Compare against the [SDK's current `IMGLYEditor.xcstrings`](https://github.com/imgly/IMGLYUI-swift/blob/1.82.0-nightly.20260825/Sources/IMGLYCoreUI/IMGLYEditor.xcstrings) when upgrading versions to catch any new strings that may warrant a branded translation.

## Adding Support for a New Language

To support a language the SDK does not ship, add a new locale column to one of the catalog files in your app — either `Localizable.xcstrings` (recommended for partial coverage) or a copy of `IMGLYEditor.xcstrings` in your bundle (recommended when you want to translate every key). Use Xcode's String Catalog editor to add the locale; for every key you provide a value for, your translation wins. Anything you leave untranslated falls back to English.

```json
{
  "sourceLanguage" : "en",
  "strings" : {
    "ly_img_editor_dock_button_photo_roll" : {
      "localizations" : {
        "en" : {
          "stringUnit" : {
            "state" : "translated",
            "value" : "Photo Roll"
          }
        },
        "fr" : {
          "stringUnit" : {
            "state" : "translated",
            "value" : "Pellicule"
          }
        }
      }
    }
  },
  "version" : "1.0"
}
```

Add the new locale's code to your app's `Info.plist` under `CFBundleLocalizations` so the system advertises it; without that entry the device will never select the new language.

## Troubleshooting

### My Override Has No Effect

Confirm the key matches exactly — character for character — the one in the SDK's `IMGLYEditor.xcstrings`. The lookup is by string equality and a single typo silently falls through to the next layer. Also verify that your override lives in your app's main bundle (not in a framework target) — the lookup chain checks `Bundle.main` before the SDK's bundle.

### My New Language Is Not Selected on Device

Apple's runtime picks the active locale from the intersection of the user's language preference and your app's declared localizations. Add the locale code to `CFBundleLocalizations` in your `Info.plist` (or let Xcode add it automatically when you introduce the language to your String Catalog). Then change the device language in Settings to confirm the editor renders the new strings.

### Some Strings Stay in English Even Though I Added a Translation

Once a key exists in your app's `Localizable.xcstrings`, CE.SDK's lookup commits to that catalog at step 1 of the chain and stops checking the SDK's bundled translations for it. If you only provided an English value for the key, Apple's locale resolution for your bundle falls back to English everywhere — even on a German device, where the SDK would otherwise have shown its bundled German translation. Add a value for every locale you support, or remove the key from your catalog and let the SDK's bundled translation surface.

## Key Reference

| Concern | Where |
| --- | --- |
| Key naming convention | `ly_img_editor_<surface>_<element>_<name>` |
| Canonical key list | [`IMGLYEditor.xcstrings` in IMGLYUI-swift](https://github.com/imgly/IMGLYUI-swift/blob/1.82.0-nightly.20260825/Sources/IMGLYCoreUI/IMGLYEditor.xcstrings) |
| Override catalog (recommended) | `Localizable.xcstrings` in your main bundle |
| Override catalog (alternative) | `IMGLYEditor.xcstrings` in your main bundle |
| Lookup order | App `Localizable` → App `IMGLYEditor` → SDK `IMGLYEditor` |
| Locale selection | Apple runtime (Settings + `Info.plist` `CFBundleLocalizations`) |

## Next Steps

- [Custom Error Messages](./custom-error-messages.md) — Override engine error dialogs with localized, customer-facing copy
- [UI Customization](./customization.md) — Customize editor components and layout
- [Configuration](../configuration.md) — Explore editor configuration options
- [Asset Library Customization](../import-media/asset-library/customize.md) — Customize asset sources and library




---

## More Resources

- **[iOS Documentation Index](https://img.ly/docs/cesdk/ios/)** - Browse all iOS documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/ios/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/ios/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support