> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Guides](../../guides.md) > [Import Media Assets](../../import-media.md) > [Import From Remote Source](../from-remote-source.md) > [From Third-Party](./third-party.md)

---

Connect third-party media APIs to CE.SDK through custom asset sources and make
their assets available inside your Android app.

## Custom Asset Sources

CE.SDK's asset source system lets you connect external media libraries to the editor UI and Engine API. A custom asset source owns how assets are fetched, searched, paginated, previewed, and applied, so it can work with REST APIs, proxy servers, or your own backend.

This page is a hub for third-party integrations. The implementation details live in the service-specific guides.

## Available Integration Examples

Complete Android integrations are available for Unsplash, Pexels, and Getty Images:

- [Unsplash](./unsplash.md) — Browse and import royalty-free photos, with search, pagination, metadata, credits, and license information handled through a custom asset source.
- [Pexels](./pexels.md) — Search, browse, and add royalty-free stock photos directly to designs.
- [Getty Images](./getty-images.md) — Search and import premium stock photography through a secure proxy server.

The same custom asset source pattern can support other stock-photo libraries, royalty-free audio or video services, and private media backends. Each integration mainly differs in the API endpoint it calls and how the response maps to CE.SDK assets.

## Common Integration Patterns

Most third-party integrations use the same building blocks:

- **Search** — Let users query the provider's media catalog.
- **Pagination** — Load large result sets page by page.
- **Asset preview** — Provide thumbnails, labels, and metadata before import.
- **Authentication** — Keep API keys on a trusted backend or proxy server when the provider requires credentials.

## Next Steps

- [Asset Concepts](../concepts.md) — Understand how asset sources organize content and connect to the rest of the asset system.
- [From Pexels](./pexels.md) — Connect CE.SDK to Pexels API to search, browse, and add royalty-free stock photos directly to designs.
- [Integrate Getty Images Stock Photos](./getty-images.md) — Search and import premium stock photography from Getty Images directly into CE.SDK using a secure proxy server.
- [Source Sets](../source-sets.md) — Serve multiple resolutions of an asset for performance and quality.




---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support