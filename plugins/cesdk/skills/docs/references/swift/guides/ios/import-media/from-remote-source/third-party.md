> This is one page of the CE.SDK iOS documentation. For a complete overview, see the [iOS Documentation Index](https://img.ly/docs/cesdk/ios/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/ios/llms-full.txt).

**Navigation:** [Guides](../../guides.md) > [Import Media Assets](../../import-media.md) > [Import From Remote Source](../from-remote-source.md) > [From Third-Party](./third-party.md)

---

Connect any third-party API to CE.SDK through the custom asset source
mechanism and import media directly into your creative app.

## Custom Asset Sources

CE.SDK's asset source system provides a flexible way to connect to any third-party API. Whether you're working with stock images, audio libraries, or custom data sources, a custom asset source handles search, pagination, and asset management for you. It works with any REST API, giving you full control over how media is fetched.

## Available Integration Examples

A complete, runnable integration is available for Unsplash:

- [Unsplash](./unsplash.md) — Browse and import royalty-free photos, with search, pagination, and credits handled through a custom asset source.

The same approach extends to any provider — other stock-photo libraries, royalty-free audio or video services, or your own backend. Each integration differs only in the REST endpoints it calls and how it maps the responses into assets.

## Common Integration Patterns

Most third-party integrations share the same building blocks:

- **Search** — Let users search the third-party library by query string.
- **Pagination** — Handle large result sets with page-based loading.
- **Asset preview** — Provide thumbnails and metadata so a preview is available before the full asset is imported.
- **Authentication** — Keep API keys secure by routing requests through a proxy server.

## Next Steps

- [Asset Concepts](../concepts.md) — Understand how asset sources organize content and connect to the rest of the asset system.
- [From Pexels](./pexels.md) — Connect CE.SDK to Pexels API to search, browse, and add royalty-free stock photos directly to designs.
- [Integrate Getty Images Stock Photos](./getty-images.md) — Search and import premium stock photography from Getty Images directly into CE.SDK using a secure proxy server.
- [Source Sets](../source-sets.md) — Serve multiple resolutions of an asset for performance and quality.




---

## More Resources

- **[iOS Documentation Index](https://img.ly/docs/cesdk/ios/)** - Browse all iOS documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/ios/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/ios/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support