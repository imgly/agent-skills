> This is one page of the CE.SDK SvelteKit documentation. For a complete overview, see the [SvelteKit Documentation Index](https://img.ly/sveltekit.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Plugins](./plugins.md) > [Asset Sources](./plugins/asset-sources.md)

---

Asset source plugins provide pre-built asset libraries for CE.SDK. They register asset sources that populate the editor's asset panel with images, stickers, filters, effects, fonts, shapes, and templates.

## BlurAssetSource

Provides blur effect presets for image editing.

```typescript
import { BlurAssetSource } from '@cesdk/cesdk-js/plugins';

await cesdk.addPlugin(new BlurAssetSource());
```

**Options:**

| Option | Type | Description |
|--------|------|-------------|
| `baseURL` | `string` | Custom base URL for loading asset definition files |
| `include` | `string[]` | GLOB patterns to filter which assets to load |
| `assetLibraryEntries` | `Record<string, string \| string[]>` | Map asset source IDs to UI library entry IDs |

**Asset Source ID:** `ly.img.blur`

**Default `include` patterns:**

- `ly.img.blur.*`

***

## CaptionPresetsAssetSource

Provides caption text presets for video editing with custom application logic for applying captions.

```typescript
import { CaptionPresetsAssetSource } from '@cesdk/cesdk-js/plugins';

await cesdk.addPlugin(new CaptionPresetsAssetSource());
```

**Options:**

| Option | Type | Description |
|--------|------|-------------|
| `baseURL` | `string` | Custom base URL for loading asset definition files |
| `include` | `string[]` | GLOB patterns to filter which assets to load |
| `assetLibraryEntries` | `Record<string, string \| string[]>` | Map asset source IDs to UI library entry IDs |

**Asset Source ID:** `ly.img.caption.presets`

**Default `include` patterns:**

- `ly.img.caption.presets.*`

***

## ColorPaletteAssetSource

Provides default color palette presets for the color picker.

```typescript
import { ColorPaletteAssetSource } from '@cesdk/cesdk-js/plugins';

await cesdk.addPlugin(new ColorPaletteAssetSource());
```

**Options:**

| Option | Type | Description |
|--------|------|-------------|
| `baseURL` | `string` | Custom base URL for loading asset definition files |
| `include` | `string[]` | GLOB patterns to filter which assets to load |
| `assetLibraryEntries` | `Record<string, string \| string[]>` | Map asset source IDs to UI library entry IDs |

**Asset Source ID:** `ly.img.color.palette`

**Default `include` patterns:**

- `ly.img.color.palette.*`

***

## CropPresetsAssetSource

Provides crop aspect ratio presets (16:9, 4:3, 1:1, etc.).

```typescript
import { CropPresetsAssetSource } from '@cesdk/cesdk-js/plugins';

await cesdk.addPlugin(new CropPresetsAssetSource());
```

**Options:**

| Option | Type | Description |
|--------|------|-------------|
| `baseURL` | `string` | Custom base URL for loading asset definition files |
| `include` | `string[]` | GLOB patterns to filter which assets to load |
| `assetLibraryEntries` | `Record<string, string \| string[]>` | Map asset source IDs to UI library entry IDs |

**Asset Source ID:** `ly.img.crop.presets`

**Default `include` patterns:**

- `ly.img.crop.presets.*`
- `ly.img.crop.presets.fixed-ratio.*`

***

## DemoAssetSources

Provides demo assets for testing and prototyping: images, videos, audio, stickers, and templates. Useful during development before integrating your own asset sources.

```typescript
import { DemoAssetSources } from '@cesdk/cesdk-js/plugins';

// Load all demo assets
await cesdk.addPlugin(new DemoAssetSources());

// Load specific categories using GLOB patterns
await cesdk.addPlugin(new DemoAssetSources({
  include: [
    'ly.img.templates.social.*',
    'ly.img.image.*'
  ]
}));
```

**Options:**

| Option | Type | Description |
|--------|------|-------------|
| `baseURL` | `string` | Custom base URL for loading asset definition files |
| `include` | `string[]` | GLOB patterns to filter which asset sources and assets to load |
| `assetLibraryEntries` | `Record<string, string \| string[]>` | Map asset source IDs to UI library entry IDs |

**Asset Source IDs:**

| ID | Description |
|----|-------------|
| `ly.img.audio` | Audio files |
| `ly.img.video` | Video files |
| `ly.img.image` | Image files |
| `ly.img.sticker.misc` | Miscellaneous stickers |
| `ly.img.templates` | All templates |

**Default `include` patterns:**

- `ly.img.audio.*`
- `ly.img.video.*`
- `ly.img.image.*`
- `ly.img.sticker.misc.*`
- `ly.img.sticker.misc.3dstickers.*`
- `ly.img.sticker.misc.marker.*`
- `ly.img.sticker.misc.sketches.*`
- `ly.img.sticker.misc.tape.*`
- `ly.img.templates.*`
- `ly.img.templates.blank.*`
- `ly.img.templates.social.*`
- `ly.img.templates.print.*`
- `ly.img.templates.presentation.*`
- `ly.img.templates.video.*`

***

## EffectsAssetSource

Provides visual effect presets including adjustments, vignette, and other image effects.

```typescript
import { EffectsAssetSource } from '@cesdk/cesdk-js/plugins';

await cesdk.addPlugin(new EffectsAssetSource());
```

**Options:**

| Option | Type | Description |
|--------|------|-------------|
| `baseURL` | `string` | Custom base URL for loading asset definition files |
| `include` | `string[]` | GLOB patterns to filter which assets to load |
| `assetLibraryEntries` | `Record<string, string \| string[]>` | Map asset source IDs to UI library entry IDs |

**Asset Source ID:** `ly.img.effect`

**Default `include` patterns:**

- `ly.img.effect.*`

***

## FiltersAssetSource

Provides photo filter presets including LUT-based color grading filters and duotone effects.

```typescript
import { FiltersAssetSource } from '@cesdk/cesdk-js/plugins';

// Load all filters
await cesdk.addPlugin(new FiltersAssetSource());

// Load specific filter categories
await cesdk.addPlugin(new FiltersAssetSource({
  include: [
    'ly.img.filter.lut.bw.*',
    'ly.img.filter.duotone.*'
  ]
}));
```

**Options:**

| Option | Type | Description |
|--------|------|-------------|
| `baseURL` | `string` | Custom base URL for loading asset definition files |
| `include` | `string[]` | GLOB patterns to filter which assets to load |
| `assetLibraryEntries` | `Record<string, string \| string[]>` | Map asset source IDs to UI library entry IDs |

**Asset Source ID:** `ly.img.filter`

**Default `include` patterns:**

- `ly.img.filter.*`
- `ly.img.filter.duotone.*`
- `ly.img.filter.lut.*`
- `ly.img.filter.lut.bw.*`
- `ly.img.filter.lut.retro.*`
- `ly.img.filter.lut.analog.*`
- `ly.img.filter.lut.winter.*`
- `ly.img.filter.lut.summer.*`
- `ly.img.filter.lut.legacy.*`

***

## PagePresetsAssetSource

Provides page size presets for social media platforms and print formats.

```typescript
import { PagePresetsAssetSource } from '@cesdk/cesdk-js/plugins';

await cesdk.addPlugin(new PagePresetsAssetSource());

// Load only social media presets
await cesdk.addPlugin(new PagePresetsAssetSource({
  include: ['ly.img.page.presets.instagram.*']
}));
```

**Options:**

| Option | Type | Description |
|--------|------|-------------|
| `baseURL` | `string` | Custom base URL for loading asset definition files |
| `include` | `string[]` | GLOB patterns to filter which assets to load |
| `assetLibraryEntries` | `Record<string, string \| string[]>` | Map asset source IDs to UI library entry IDs |

**Asset Source ID:** `ly.img.page.presets`

**Default `include` patterns:**

- `ly.img.page.presets.*`
- `ly.img.page.presets.facebook.*`
- `ly.img.page.presets.facebook.video.*`
- `ly.img.page.presets.instagram.*`
- `ly.img.page.presets.linkedin.*`
- `ly.img.page.presets.pinterest.*`
- `ly.img.page.presets.tiktok.*`
- `ly.img.page.presets.tiktok.video.*`
- `ly.img.page.presets.x.*`
- `ly.img.page.presets.x.video.*`
- `ly.img.page.presets.youtube.*`
- `ly.img.page.presets.video.*`
- `ly.img.page.presets.print.*`
- `ly.img.page.presets.print.brochure.*`
- `ly.img.page.presets.print.business_card.*`
- `ly.img.page.presets.print.flyer.*`
- `ly.img.page.presets.print.iso.*`
- `ly.img.page.presets.print.na.*`
- `ly.img.page.presets.print.postcard.*`
- `ly.img.page.presets.print.poster.*`

***

## StickerAssetSource

Provides sticker graphics organized by category.

```typescript
import { StickerAssetSource } from '@cesdk/cesdk-js/plugins';

await cesdk.addPlugin(new StickerAssetSource());

// Load only emoji stickers
await cesdk.addPlugin(new StickerAssetSource({
  include: ['ly.img.sticker.emoji.*']
}));
```

**Options:**

| Option | Type | Description |
|--------|------|-------------|
| `baseURL` | `string` | Custom base URL for loading asset definition files |
| `include` | `string[]` | GLOB patterns to filter which assets to load |
| `assetLibraryEntries` | `Record<string, string \| string[]>` | Map asset source IDs to UI library entry IDs |

**Asset Source ID:** `ly.img.sticker`

**Default `include` patterns:**

- `ly.img.sticker.*`
- `ly.img.sticker.3Dstickers.*`
- `ly.img.sticker.craft.*`
- `ly.img.sticker.doodle.*`
- `ly.img.sticker.emoji.*`
- `ly.img.sticker.emoticons.*`
- `ly.img.sticker.hand.*`

***

## TextAssetSource

Provides text style presets for headlines, body text, and other typography styles.

```typescript
import { TextAssetSource } from '@cesdk/cesdk-js/plugins';

await cesdk.addPlugin(new TextAssetSource());
```

**Options:**

| Option | Type | Description |
|--------|------|-------------|
| `baseURL` | `string` | Custom base URL for loading asset definition files |
| `include` | `string[]` | GLOB patterns to filter which assets to load |
| `assetLibraryEntries` | `Record<string, string \| string[]>` | Map asset source IDs to UI library entry IDs |

**Asset Source ID:** `ly.img.text`

**Default `include` patterns:**

- `ly.img.text.*`

***

## TextComponentAssetSource

Provides pre-designed text component layouts combining multiple text elements.

```typescript
import { TextComponentAssetSource } from '@cesdk/cesdk-js/plugins';

await cesdk.addPlugin(new TextComponentAssetSource());
```

**Options:**

| Option | Type | Description |
|--------|------|-------------|
| `baseURL` | `string` | Custom base URL for loading asset definition files |
| `include` | `string[]` | GLOB patterns to filter which assets to load |
| `assetLibraryEntries` | `Record<string, string \| string[]>` | Map asset source IDs to UI library entry IDs |

**Asset Source ID:** `ly.img.text.components`

**Default `include` patterns:**

- `ly.img.text.components.*`

***

## TypefaceAssetSource

Provides font and typeface assets for text styling.

```typescript
import { TypefaceAssetSource } from '@cesdk/cesdk-js/plugins';

await cesdk.addPlugin(new TypefaceAssetSource());
```

**Options:**

| Option | Type | Description |
|--------|------|-------------|
| `baseURL` | `string` | Custom base URL for loading asset definition files |
| `include` | `string[]` | GLOB patterns to filter which assets to load |
| `assetLibraryEntries` | `Record<string, string \| string[]>` | Map asset source IDs to UI library entry IDs |

**Asset Source ID:** `ly.img.typeface`

**Default `include` patterns:**

- `ly.img.typeface.*`

***

## UploadAssetSources

Provides local file upload sources for images, videos, and audio. Users can upload files from their device to use in the editor.

The `include` option supports two modes:

- **Additive mode**: When all entries are config objects, all default sources are included and objects customize them
- **Explicit mode**: When any string is present, only listed sources are included

```typescript
import { UploadAssetSources } from '@cesdk/cesdk-js/plugins';

// Enable all upload types with defaults
await cesdk.addPlugin(new UploadAssetSources());

// Explicit mode: enable only specific upload types
await cesdk.addPlugin(new UploadAssetSources({
  include: ['ly.img.image.upload']
}));

// Additive mode: customize MIME types while keeping all sources
await cesdk.addPlugin(new UploadAssetSources({
  include: [
    {
      id: 'ly.img.image.upload',
      mimeTypes: ['image/png', 'image/jpeg', 'image/webp']
    }
  ]
}));

// Explicit mode with custom MIME types
await cesdk.addPlugin(new UploadAssetSources({
  include: [
    'ly.img.image.upload',
    {
      id: 'ly.img.video.upload',
      mimeTypes: ['video/mp4', 'video/webm']
    }
  ]
}));
```

**Options:**

| Option | Type | Description |
|--------|------|-------------|
| `include` | `(string \| UploadSourceConfig)[]` | Upload source IDs or configuration objects |

**UploadSourceConfig:**

| Property | Type | Description |
|----------|------|-------------|
| `id` | `string` | Upload source ID |
| `mimeTypes` | `string[]` | Accepted MIME types for file uploads |
| `assetLibraryEntries` | `Record<string, string \| string[]>` | Map asset source IDs to UI library entry IDs |

**Asset Source IDs:**

| ID | Default MIME Types |
|----|-------------------|
| `ly.img.image.upload` | `image/jpeg`, `image/png`, `image/webp`, `image/svg+xml`, `image/bmp`, `image/gif` |
| `ly.img.video.upload` | `application/json`, `video/mp4`, `video/quicktime`, `video/webm`, `video/matroska`, `image/gif` |
| `ly.img.audio.upload` | `audio/mpeg`, `audio/mp3`, `audio/x-m4a`, `audio/wav` |

***

## VectorShapeAssetSource

Provides vector shape assets including basic shapes, arrows, and decorative elements.

```typescript
import { VectorShapeAssetSource } from '@cesdk/cesdk-js/plugins';

// Load all shape types
await cesdk.addPlugin(new VectorShapeAssetSource());

// Load specific shape categories
await cesdk.addPlugin(new VectorShapeAssetSource({
  include: [
    'ly.img.vector.shape.filled.*',
    'ly.img.vector.shape.outline.*'
  ]
}));
```

**Options:**

| Option | Type | Description |
|--------|------|-------------|
| `baseURL` | `string` | Custom base URL for loading asset definition files |
| `include` | `string[]` | GLOB patterns to filter which assets to load |
| `assetLibraryEntries` | `Record<string, string \| string[]>` | Map asset source IDs to UI library entry IDs |

**Asset Source ID:** `ly.img.vector.shape`

**Default `include` patterns:**

- `ly.img.vector.shape.*`
- `ly.img.vector.shape.filled.*`
- `ly.img.vector.shape.filled.abstract.*`
- `ly.img.vector.shape.gradient.*`
- `ly.img.vector.shape.gradient.abstract.*`
- `ly.img.vector.shape.image.*`
- `ly.img.vector.shape.image.abstract.*`
- `ly.img.vector.shape.outline.*`
- `ly.img.vector.shape.outline.abstract.*`

***

## Pre-registered Asset Library Entries

Asset library entries define where assets appear in the editor's UI. Each asset source plugin maps its source to one or more library entries using the `assetLibraryEntries` option.

The following library entry IDs are pre-registered by CE.SDK:

| Entry ID | Description |
|----------|-------------|
| `ly.img.templates` | Templates panel |
| `ly.img.upload` | Upload panel |
| `ly.img.image` | Images panel |
| `ly.img.video` | Videos panel |
| `ly.img.audio` | Audio panel |
| `ly.img.text` | Text panel |
| `ly.img.vector.shape` | Shapes panel |
| `ly.img.sticker` | Stickers panel |
| `ly.img.colors` | Colors panel |
| `ly.img.typefaces` | Typefaces/fonts panel |
| `ly.img.pagePresets` | Page presets panel |
| `ly.img.cropPresets` | Crop presets panel |
| `ly.img.library.captionPresets` | Caption presets panel |
| `ly.img.animations` | Animations panel |
| `ly.img.textAnimations` | Text animations panel |

You can also use custom entry IDs to create your own library panels.



---

## More Resources

- **[SvelteKit Documentation Index](https://img.ly/sveltekit.md)** - Browse all SvelteKit documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./sveltekit.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support