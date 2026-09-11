> This is one page of the CE.SDK React `@cesdk/cesdk-js` API reference. For a complete overview, see the [React Documentation Index](https://img.ly/docs/cesdk/react.md) or the [cesdk-js API Index](./api/cesdk-js.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

Manages localization and internationalization settings for the Creative Editor SDK.

The InternationalisationAPI provides methods to get and set the current locale,
as well as add custom translations for the editor interface.

## Constructors

<details>
  <summary>
    ### Constructor

    <br /><p><code>InternationalizationAPI</code></p>
  </summary>
</details>

## Localization

Methods for managing locale settings and custom translations within the editor.

<details>
  <summary>
    ### getLocale()

    <br /><p>Gets the currently active locale.</p>
  </summary>

  #### Returns

  `string`

  The currently set locale as a string, or the fallback locale if none is set.

  #### Signature

  ```typescript
  getLocale(): string
  ```

  ***
</details>

<details>
  <summary>
    ### listLocales()

    <br /><p>Returns all available locales that have been loaded.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `options?` | \{ `matcher?`: `string`; } | Optional configuration object with the following properties: - `matcher`: Optional pattern to match against. Use `*` for wildcard matching. |
  | `options.matcher?` | `string` | - |

  #### Returns

  `string`\[]

  An array of locale strings that have translations available.

  #### Example

  ```typescript
  const allLocales = cesdk.i18n.listLocales();
  console.log('Available locales:', allLocales);
  // Output: ['en', 'de', 'fr', ...]

  // Find all English variants using wildcard
  const englishLocales = cesdk.i18n.listLocales({ matcher: 'en*' });
  console.log('English locales:', englishLocales);
  // Output: ['en', 'en-US', 'en-GB', ...]
  ```

  #### Signature

  ```typescript
  listLocales(options?: object): string[]
  ```

  ***
</details>

<details>
  <summary>
    ### setLocale

    <br /><p>Sets the active locale for the editor interface.</p>
  </summary>

  This will **not check** whether translations for the given locale are available.

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `locale` | `string` | The locale string to set as active (e.g., 'en', 'de', 'fr'). |

  #### Returns

  `void`

  ***
</details>

<details>
  <summary>
    ### setTranslations()

    <br /><p>Adds custom translations for the editor interface.</p>
  </summary>

  This method allows you to provide custom translations that will be used
  by the editor interface. Translations are organized by locale and can
  override or extend the default editor translations.

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `definition` | `Partial`\<`Record`\<[`LocaleKey`](./api/cesdk-js/type-aliases/localekey.md), `Partial`\<[`Translations`](./api/cesdk-js/interfaces/translations.md)>>> | An object mapping locale strings to translation objects. |

  #### Returns

  `void`

  #### Example

  ```
  setTranslations({
   en: {
     presets: {
       scene: ...
     }
   }
  })
  ```

  #### Signature

  ```typescript
  setTranslations(definition: Partial<Record<LocaleKey, Partial<Translations>>>): void
  ```

  ***
</details>

<details>
  <summary>
    ### getTranslations()

    <br /><p>Retrieves the translations for the specified locales.</p>
  </summary>

  This method returns the translations for the given locales, or all available
  translations if no specific locales are provided.

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `locales?` | `string`\[] | An optional array of locale strings to retrieve translations for. |

  #### Returns

  `Partial`\<`Record`\<[`LocaleKey`](./api/cesdk-js/type-aliases/localekey.md), `Partial`\<[`Translations`](./api/cesdk-js/interfaces/translations.md)>>>

  An object mapping locale strings to their respective translations.

  #### Signature

  ```typescript
  getTranslations(locales?: string[]): Partial<Record<LocaleKey, Partial<Translations>>>
  ```

  ***
</details>

<details>
  <summary>
    ### translate()

    <br /><p>Translates a key or array of keys to the current locale.</p>
  </summary>

  This method retrieves the translation for the given key(s) in the currently
  active locale. When an array of keys is provided, the first key that has a
  translation will be used. If no translation is found for any of the provided
  keys, the last key in the array (or the single key if a string is provided)
  will be returned as the fallback value.

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `key` | `string` | `string`\[] | A translation key string or an array of translation keys to try in order. |

  #### Returns

  `string`

  The translated string for the key in the current locale, or the key itself if no translation is found.

  #### Example

  ```
  // Single key
  const translation = cesdk.i18n.translate('common.save');
  // Returns: "Save" (if translation exists) or "common.save" (if not found)

  // Array of keys (fallback)
  const translation = cesdk.i18n.translate(['specific.save', 'common.save']);
  // Tries 'specific.save' first, then 'common.save'
  // Returns the first found translation or "common.save" if neither exists
  ```

  #### Signature

  ```typescript
  translate(key: string | string[]): string
  ```
</details>


---

## More Resources

- **[React Documentation Index](https://img.ly/docs/cesdk/react.md)** - Browse all React documentation
- **[cesdk-js API Reference](./api/cesdk-js.md)** - Full cesdk-js API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./react.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support