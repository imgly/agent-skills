> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Import Media Assets](../import-media.md) > [Concepts](./concepts.md)

---

Understand the foundational architecture of CE.SDK's asset system and how asset sources organize content across platforms.

Asset sources are CE.SDK's content delivery architecture. Instead of hardcoding asset knowledge into the editor, CE.SDK uses a modular system where any content can be provided through a standardized interface. This decouples what assets are available from how they're discovered and applied.

```
 PLATFORM-SPECIFIC UI (Android editor)
----------------------------------------------------------------------------
  Dock Button / Gallery Entry -> Asset Library -> Assets Grid

  Configured via: AssetLibrary, LibraryContent, and source IDs
----------------------------------------------------------------------------
                                   |
                                   v
 CROSS-PLATFORM ENGINE (engine.asset API)
---------------------------------------------------------------------------
 findAssets()    addSource()    addLocalSource()    applyAssetSourceAsset()

   Custom Sources        Local Sources        JSON-Based Sources
   Your API or DB        User uploads         Built-in asset packs
   App backend           Runtime lists        Bundled or hosted JSON
---------------------------------------------------------------------------
```

This guide covers the foundational concepts of asset sources. For implementation details, see the linked guides at the end.

## Asset Source Fundamentals

An asset source provides content to the engine through a common interface. Every source has a unique identifier, such as `ly.img.image` or `ly.img.sticker`, and exposes methods for discovering and applying assets.

Sources support:

- **Query-based discovery** with pagination and filtering
- **Optional grouping**, such as sticker groups or preset categories
- **Metadata** including credits, licenses, formats, and block hints

Sources are content-agnostic. Images, videos, fonts, templates, and custom content all use the same pattern.

## Content Organized as Asset Sources

Asset sources handle virtually all reusable creative content:

| Category   | Examples                                 |
| ---------- | ---------------------------------------- |
| Media      | Images, videos, audio clips              |
| Graphics   | Stickers, shapes, vectors, icons         |
| Typography | Fonts, typefaces, text presets           |
| Colors     | Color palettes, spot colors              |
| Effects    | Blur types, filters, LUT effects         |
| Templates  | Design templates, page presets           |
| Custom     | User uploads, remote APIs, your own data |

Built-in source IDs include `ly.img.image`, `ly.img.video`, `ly.img.audio`, `ly.img.sticker`, `ly.img.typeface`, `ly.img.filter`, `ly.img.effect`, `ly.img.blur`, and more.

## Types of Asset Sources

There are three ways to provide assets to CE.SDK. The right choice depends on who owns the data and how often it changes.

### Custom Sources

Custom sources connect CE.SDK to your app backend, content management system, digital asset management system, or another data provider. Use a custom source when your app owns search, filtering, authentication, or custom apply behavior.

### Local Sources

Local sources are engine-managed sources that your app can add assets to and remove assets from at runtime. They are useful for uploads, temporary collections, recently used assets, and other session-specific lists.

### JSON-Based Sources

JSON-based sources load predefined asset definitions from JSON files. Built-in asset packs use this approach, and Android apps can load the same structure from bundled app assets, a self-hosted server, or another URI that the app can access.

## Asset Sources and the Android UI

Asset sources are backend providers. They do not render the editor UI by themselves. The connection between sources and what users see happens through editor configuration.

On Android, the editor's asset library presents sources to users. You configure which sources appear and how they're grouped through `AssetLibrary`, `LibraryContent`, and source IDs such as `AssetSourceType` values. A section can reference one source, combine multiple sources, or expand a single source into grouped subsections.

This separation lets you:

- Show multiple sources in one library section
- Show the same source in different locations
- Add upload sources only where users should import local media
- Change the presentation without changing the source implementation

## Cross-Platform Architecture

Asset sources use the `engine.asset` API consistently across every platform CE.SDK supports.

All platforms support:

- Custom source registration
- JSON-based asset loading
- Local asset management
- Group-based organization
- Event subscriptions for source changes

Code patterns transfer directly between platforms with syntax and UI configuration changes. Android uses Kotlin `AssetSource` implementations, Android `Uri` values, and editor library configuration classes to present registered sources in the UI.

## Asset Structure

Each asset contains data that lets CE.SDK display it, search it, and apply it:

- **ID** - Unique identifier within the source
- **Meta** - URI, thumbnail URI, MIME type, dimensions, and block type hints
- **Label** - Localized display name
- **Tags** - Localized searchable keywords
- **Groups** - Category membership used by grouped library sections
- **Context** - Source reference for tracking origin

The engine uses metadata hints such as `blockType`, `fillType`, and `shapeType` to choose what block to create when applying an asset.

## Discovery and Application

Assets are discovered through queries supporting pagination, text search, tag and group filtering, and sorting. Query results return assets plus paging information so the editor UI can load asset grids incrementally.

When an asset is applied, CE.SDK either creates a new block in the active scene or updates an existing compatible block. Sources can customize application behavior or use the engine's default metadata-based behavior.

## Source Lifecycle Events

The engine emits events when sources change: added, removed, or contents updated. Subscribe to these events to keep available content synchronized. On Android, call `assetSourceContentsChanged` when the contents of a registered source change so subscribers can refresh without replacing the whole source.

## Troubleshooting

- **Confusing sources with UI** - Asset sources are backend providers; they don't render UI. The asset library presents them, and you configure that presentation separately.
- **Expecting sources to filter themselves** - Sources return matching assets; UI configuration determines what's displayed to users.
- **Mixing source types** - Custom sources, local sources, and JSON sources serve different purposes. Choose based on whether you need dynamic backend connections, runtime asset management, or static asset packs.
- **Forgetting source updates** - Notify the engine after source contents change so the UI can refresh.

## API Reference

### Methods

| Method | Description |
| --- | --- |
| `engine.asset.addSource(source=_)` | Register a custom asset source with discovery and apply callbacks. |
| `engine.asset.addLocalSource(sourceId=_, supportedMimeTypes=_)` | Create an engine-managed source for dynamic asset add and remove. |
| `engine.asset.addLocalSourceFromJSON(contentUri=_, matcher=_)` | Load a JSON-defined asset source from a URI. |
| `engine.asset.findAssets(sourceId=_, query=_)` | Query assets with pagination, search, filtering, and sorting. |
| `engine.asset.applyAssetSourceAsset(sourceId=_, asset=_)` | Apply an asset to the active scene, creating a configured block. |

### Events

| Method | Description |
| --- | --- |
| `engine.asset.assetSourceContentsChanged(sourceId=_)` | Notify subscribers that a source's contents changed. |
| `engine.asset.onAssetSourceAdded()` | Observe source registration events. |
| `engine.asset.onAssetSourceRemoved()` | Observe source removal events. |
| `engine.asset.onAssetSourceUpdated()` | Observe source content update events. |

## Next Steps

- [From Your Server](./from-remote-source/your-server.md) — Load images, videos, and audio from your backend servers into CE.SDK for integration with CMS, DAM, or custom asset management systems.
- [Integrate Unsplash Stock Images](./from-remote-source/unsplash.md) - Follow an end-to-end remote custom asset source example.
- [Basics](./asset-library/basics.md) — Explore the core functionality of the asset library and how users browse, search, and insert media.
- [Customize Asset Library](./asset-library/customize.md) - Surface registered asset sources in the Android editor UI.



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support