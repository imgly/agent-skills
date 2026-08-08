> This is one page of the CE.SDK iOS documentation. For a complete overview, see the [iOS Documentation Index](https://img.ly/docs/cesdk/ios/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/ios/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Import Media Assets](../import-media.md) > [Concepts](./concepts.md)

---

Understand the foundational architecture of CE.SDK's asset system and how asset sources organize content across platforms.

Asset sources are CE.SDK's content delivery architecture. Instead of hardcoding asset knowledge into the engine, CE.SDK uses a modular system where any content can be provided through a standardized interface. This decouples what assets are available from how they're discovered and applied.

```
 PLATFORM-SPECIFIC UI (iOS editor)
┌─────────────────────────────────────────────────────────────────────────┐
│  ┌─────────────┐    ┌───────────────┐    ┌─────────────┐                │
│  │ Dock Button │───▶│ Asset Library │───▶│ Assets Grid │                │
│  └─────────────┘    └───────────────┘    └─────────────┘                │
│                                                                         │
│  Configured via: Asset Library config, Dock config                      │
└─────────────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
 CROSS-PLATFORM ENGINE (engine.asset API)
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│   findAssets()    addSource()    addLocalSource()    apply()            │
│                                                                         │
│  ┌──────────────┐   ┌──────────────┐   ┌──────────────┐                 │
│  │    Custom    │   │    Local     │   │  JSON-Based  │                 │
│  │   Sources    │   │   Sources    │   │   Sources    │                 │
│  ├──────────────┤   ├──────────────┤   ├──────────────┤                 │
│  │ Your API     │   │ User Uploads │   │ Built-in     │                 │
│  │ Database     │   │ Collections  │   │ Asset Packs  │                 │
│  └──────────────┘   └──────────────┘   └──────────────┘                 │
│                                                                         │
│  Identical across every platform CE.SDK supports                        │
└─────────────────────────────────────────────────────────────────────────┘
```

This guide covers the foundational concepts of asset sources. For implementation details, see the linked guides at the end.

## Asset Source Fundamentals

An asset source provides content to the engine through a common interface. Every source has a unique identifier (e.g., `ly.img.image`, `ly.img.sticker`) and implements methods for discovering and applying assets.

Sources support:

- **Query-based discovery** with pagination and filtering
- **Optional grouping** (e.g., sticker groups: "emoji", "doodle", "hand")
- **Metadata** including credits, licenses, and format information

Sources are content-agnostic—images, fonts, templates, and custom content all use the same pattern.

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

Built-in sources include `ly.img.image`, `ly.img.sticker`, `ly.img.templates`, `ly.img.typeface`, `ly.img.filter.lut`, `ly.img.blur`, `ly.img.effect`, and more.

## Types of Asset Sources

There are three ways to provide assets to CE.SDK:

### Custom Sources

Conform to the `AssetSource` protocol to connect any backend—database, API, or custom system. Custom sources provide full control over discovery and application logic. Use a custom source when you need to:

- Connect to your existing content management system
- Implement custom search or filtering logic
- Control how assets are applied to the scene

### Local Sources

Managed by the engine with dynamic add and remove operations. Local sources are suitable for user uploads or custom collections that change during the editing session. The engine handles storage and retrieval.

### JSON-Based Sources

Pre-defined asset collections loaded from JSON files. All built-in asset packs use this approach. JSON sources are ideal for static content that doesn't change frequently.

## Asset Sources and the User Interface

Asset sources are backend providers—they don't know about UI. The connection between sources and what users see happens through editor configuration.

On iOS, the editor's asset library presents sources to users. You configure which sources appear and how they're grouped through the asset library configuration, and the same sources surface from dock buttons that open the library. This separation means you can:

- Show multiple sources in one library section
- Show the same source in different locations
- Change the presentation without changing the source

macOS and Mac Catalyst apps that drive the engine directly work with the `engine.asset` API and present results in whatever interface they build.

## Cross-Platform Architecture

Asset sources use the `engine.asset` API consistently across every platform CE.SDK supports.

All platforms support:

- Custom source registration
- JSON-based asset loading
- Local asset management
- Group-based organization
- Event subscriptions (source added, removed, updated)

Code patterns transfer directly between platforms with only syntax changes.

## Asset Structure

Each asset contains:

- **ID** — Unique identifier within the source
- **Meta** — URI, thumbnail, MIME type, dimensions, block type hints
- **Label** — Localized display name
- **Tags** — Searchable keywords (localized)
- **Groups** — Category membership
- **Context** — Source reference for tracking origin

The engine uses metadata hints (`blockType`, `fillType`, `shapeType`) to determine what block type to create when applying an asset.

## Discovery and Application

Assets are discovered through queries supporting pagination, text search, tag and group filtering, and sorting. When applied, assets either create new blocks or modify existing ones. Sources can customize application behavior or use the engine's default implementation.

## Source Lifecycle Events

The engine emits events when sources change: added, removed, or contents updated. Subscribe to these events to keep available content synchronized.

## Troubleshooting

Common conceptual misunderstandings:

- **Confusing sources with UI** — Asset sources are backend providers; they don't render UI. The asset library presents them, and you configure that presentation separately.
- **Expecting sources to filter themselves** — Sources return all matching assets; the configuration determines what's displayed to users.
- **Mixing source types** — Custom sources (your code), local sources (engine-managed), and JSON sources (static files) serve different purposes. Choose based on whether you need dynamic backend connections, runtime asset management, or static asset packs.

## API Reference

### Methods

| Method | Description |
| --- | --- |
| `engine.asset.addSource(_:)` | Register a custom asset source with discovery and apply callbacks |
| `engine.asset.addLocalSource(sourceID:)` | Create an engine-managed source for dynamic asset add and remove |
| `engine.asset.findAssets(sourceID:query:)` | Query assets with pagination, search, filtering, and sorting |
| `engine.asset.apply(sourceID:assetResult:)` | Apply an asset to the active scene, creating a configured block |

### Events

| Property | Type | Description |
| --- | --- | --- |
| `engine.asset.onAssetSourceAdded` | `AsyncStream<String>` | Emits the ID of each newly registered source |
| `engine.asset.onAssetSourceRemoved` | `AsyncStream<String>` | Emits the ID of each removed source |
| `engine.asset.onAssetSourceUpdated` | `AsyncStream<String>` | Emits the ID of each source whose contents changed |

## Next Steps

- [Your Server](./from-remote-source/your-server.md) — Connect your own backend as an asset source
- [Integrate Unsplash Stock Images](./from-remote-source/unsplash.md) — Follow an end-to-end remote custom asset source example
- [Customize Asset Library](./asset-library/customize.md) — On iOS, customize the asset library appearance



---

## More Resources

- **[iOS Documentation Index](https://img.ly/docs/cesdk/ios/)** - Browse all iOS documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/ios/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/ios/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support