> This is one page of the CE.SDK Nuxt.js documentation. For a complete overview, see the [Nuxt.js Documentation Index](https://img.ly/nuxtjs.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Import Media Assets](./import-media.md) > [Import From Remote Source](./import-media/from-remote-source.md) > [From Third-Party](./import-media/from-remote-source/third-party.md)

---

CE.SDK makes it easy to integrate any third-party API using the custom asset
source mechanism, allowing you to import media directly into your creative
applications.

## Custom Asset Sources

CE.SDK's asset source system provides a flexible way to connect to any third-party API. Whether you're working with stock images, audio libraries, or custom data sources, the asset source mechanism handles search, pagination, and asset management automatically. The system works with any REST API, giving you complete control over how media is fetched and displayed.

## Available Integration Examples

We've created detailed implementation guides for popular third-party services that demonstrate how to build custom asset sources:

### Stock Images

- **[Unsplash](./import-media/from-remote-source/unsplash.md)** - High-quality royalty-free photos with powerful search capabilities
- **[Pexels](./import-media/from-remote-source/pexels.md)** - Royalty-free stock photography with curated collections
- **[Getty Images](./import-media/from-remote-source/getty-images.md)** - Premium stock photography using a secure proxy server architecture

### Audio Libraries

- **[Soundstripe](./import-media/from-remote-source/soundstripe.md)** - Royalty-free music and audio tracks for video projects

Each guide includes working code examples, API authentication setup, and best practices for integrating that specific service.

## Common Integration Patterns

Most third-party integrations share similar patterns:

- **Search functionality** - Enable users to search the third-party library
- **Pagination** - Handle large result sets with infinite scroll or page-based navigation
- **Asset preview** - Display thumbnails and metadata before importing
- **Authentication** - Manage API keys securely (client-side or via proxy server)

## Next Steps

Choose the integration guide that matches your needs to see a complete implementation. The patterns shown in these guides can be adapted to integrate virtually any third-party API into CE.SDK.



---

## More Resources

- **[Nuxt.js Documentation Index](https://img.ly/nuxtjs.md)** - Browse all Nuxt.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./nuxtjs.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support