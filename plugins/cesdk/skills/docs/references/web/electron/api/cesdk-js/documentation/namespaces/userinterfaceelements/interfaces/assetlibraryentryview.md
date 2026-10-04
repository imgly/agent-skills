> This is one page of the CE.SDK Electron `@cesdk/cesdk-js` API reference. For a complete overview, see the [Electron Documentation Index](https://img.ly/docs/cesdk/electron.md) or the [cesdk-js API Index](./api/cesdk-js.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

Interface representing the view configuration for an asset library entry.

- `showGroupOverview`: Optional boolean indicating whether to show the group overview.
- `promptBeforeApply`: Optional configuration for showing a confirmation dialog before applying an asset.
- `icon`: Optional custom icon for the asset.
- `previewLength`: Optional number determining how many asset results will be shown in an overview or section overview.
- `previewBackgroundType`: Optional type determining if the thumbUri is set as a background that will be contained or covered by the card in an overview or section overview.
- `gridBackgroundType`: Optional type determining if the thumbUri is set as a background that will be contained or covered by the card in the grid view.
- `gridColumns`: Optional number of columns in the grid view.
- `gridItemHeight`: Optional height of an item in the grid view, either 'auto' or 'square'.
- `cardBackgroundPreferences`: Optional configuration for determining what will be used as the card background from the asset and in which priorities.
- `cardBorder`: Optional boolean indicating whether to draw a border around the card.
- `cardLabel`: Optional function to overwrite the label of a card for a specific asset result.
- `cardStyle`: Optional function to add custom styles to a card for a specific asset result.
- `cardLabelStyle`: Optional function to add custom styles to a label for a specific asset result.
- `cardLabelPosition`: Optional function to position the label inside or below the card.
- `cardLabelTruncateLines`: Optional function to control label truncation to occur at end of first line ('single') or at end of second line ('multi').
- `sortBy`: Optional configuration for sorting the asset results.

## Extended by

- [`AssetLibraryEntry`](./api/cesdk-js/interfaces/assetlibraryentry.md)

## Properties

| Property | Type | Description |
| ------ | ------ | ------ |
|  `showGroupOverview?` | `boolean` | - |
|  `isSearchable?` | `boolean` | Indicates whether this asset library entry supports searching. When set to false, this entry's assets cannot be searched. The search field in the panel will only be shown if at least one visible entry is searchable. Defaults to true (entry is searchable). |
|  `promptBeforeApply?` | | `boolean` | \{ `show`: `boolean`; `sourceIds?`: `string`\[]; } | Wether or not we need to show a confirmation dialog when an asset is selected. accepted values: - `true`: Show a confirmation dialog for all assets - `false`: Never show a confirmation dialog - `{ show: true, sourceIds: ['sourceId1', 'sourceId2'] }`: Show a confirmation dialog for the given sourceIds The content of the dialog should be defined in the translation files using the following keys: - Headline: `libraries.[your_source_id].confirmation.headline` - Body: `libraries.[your_source_id].confirmation.body` - Confirm: `libraries.[your_source_id].confirmation.confirm` - Abort: `libraries.[your_source_id].confirmation.abort` |
|  `icon?` | [`CustomIcon`](./api/cesdk-js/documentation/namespaces/userinterfaceelements/type-aliases/customicon.md) | - |
|  `previewLength?` | `number` | Determines how many asset results will be show in an overview or section overview. |
|  `previewBackgroundType?` | `"cover"` | `"contain"` | Determines if the thumbUri is set as a background that will be contained or covered by the card in an overview or section overview. |
|  `gridBackgroundType?` | `"cover"` | `"contain"` | Determines if the thumbUri is set as a background that will be contained or covered by the card in the grid view |
|  `gridColumns?` | `number` | Number of columns in the grid view |
|  `gridItemHeight?` | `"auto"` | `"square"` | Determines the height of an item in the grid view. - `auto` automatically determine height yielding a masonry-like grid view - `square` every card will have the same square size |
|  `cardBackgroundPreferences?` | | [`CardBackground`](./api/cesdk-js/documentation/namespaces/userinterfaceelements/type-aliases/cardbackground.md)\[] | ((`asset`) => [`CustomCardBackground`](./api/cesdk-js/documentation/namespaces/userinterfaceelements/type-aliases/customcardbackground.md)) | Determines what will be used as the card background from the asset and in which priorities. The first preference for which the `path` returns a value will be used to decide what and how the background will be rendered. E.g. a path of `meta.thumbUri` will look inside the asset for a value `asset.meta.thumbUri`. This non-null value will be used. The type of the preference decides how the card will render the background. - `svgVectorPath` - creates a \<svg> element with the given vector path. Adapts the color depending on the theme - `image` - use a CSS background image Example of the default: `[ { path: 'meta.vectorPath', type: 'svgVectorPath' }, { path: 'meta.thumbUri', type: 'image' } ]` This will look if the asset has a value in `meta.vectorPath` and will use this value to render a SVG as background. If `meta.vectorPath` has no value, it will use `meta.thumbUri` instead as a background image. Otherwise it will render nothing |
|  `cardBorder?` | `boolean` | Draws a border around the card if set to true |
|  `cardLabel?` | (`assetResult`) => `string` | Overwrite the label of a card for a specific asset result |
|  `hideCardLabelInPreview?` | `boolean` | When true, suppresses the card label rendered in section previews (the rows shown above each section's "More" button) while keeping the label visible inside the full asset section view (opened via the "More" button). Use this when the preview rows render very compactly and labels would not fit. |
|  `cardStyle?` | (`assetResult`) => `Record`\<`string`, `string` | `undefined`> | Add custom styles to a card for a specific asset result |
|  `cardLabelStyle?` | (`assetResult`) => `Record`\<`string`, `string` | `undefined`> | Add custom styles to a label for a specific asset result |
|  `cardLabelPosition?` | (`assetResult`) => `"inside"` | `"below"` | Position the label inside or below the card. Defaults to 'inside'. |
|  `cardLabelTruncateLines?` | (`assetResult`) => `"single"` | `"multi"` | Control label truncation to occur at end of first line ('single'), or at end of second line ('multi'). Defaults to 'multi'. |
|  `disableTooltips?` | `boolean` | Control whether tooltips should be disabled for asset library cards. When set to true, tooltips will not be shown on cards. Defaults to false (tooltips are shown). |
|  `sortBy?` | `any` | - |


---

## More Resources

- **[Electron Documentation Index](https://img.ly/docs/cesdk/electron.md)** - Browse all Electron documentation
- **[cesdk-js API Reference](./api/cesdk-js.md)** - Full cesdk-js API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./electron.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support