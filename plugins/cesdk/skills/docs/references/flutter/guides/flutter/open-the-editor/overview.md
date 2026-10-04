> This is one page of the CE.SDK Flutter documentation. For a complete overview, see the [Flutter Documentation Index](https://img.ly/docs/cesdk/flutter/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/flutter/llms-full.txt).

**Navigation:** [Guides](https://img.ly/docs/cesdk/flutter/guides-8d8b00/) > [Open the Editor](https://img.ly/docs/cesdk/flutter/open-the-editor-23a1db/) > [Overview](./overview.md)

---

CreativeEditor SDK (CE.SDK) offers multiple ways to open the editor. Whether you're starting with a blank canvas or importing complex layered files, CE.SDK gives you the building blocks to launch an editing session tailored to your users' needs.

[Explore Demos](https://img.ly/showcases/cesdk?tags=android%2Cios)

[Get Started](../get-started/overview.md)

## Ways to Open the Editor

You can initialize CE.SDK in several ways depending on your content pipeline:

- **Start with a Blank Canvas**\
  Useful for creating new content from scratch. Define canvas dimensions manually or programmatically.

- **Load a Scene**\
  Load a saved scene from JSON, archive, or blob to restore a previous editing session or template.

- **Create from Media**\
  Initialize the editor with a preloaded image, video.

- **Create from Template**\
  Kick off the editor with a predefined template, including placeholders and editing constraints.

- **Import a Design**\
  Import external designs from InDesign or Photoshop by running them through an importer and edit the resulting scene or archive in the SDK.

## Using Low-Quality / High-Quality Assets

To ensure responsive editing and high-quality exports, CE.SDK allows you to dynamically switch between asset resolutions:

- **Edit with Low-Res Assets**\
  Load smaller versions of images or videos during the editing process to reduce memory usage and improve performance.

- **Export with High-Res Assets**\
  Swap out low-res placeholders for full-quality assets just before exporting. This can be handled using the Scene or Block APIs by switching asset paths or making use of source sets for fills.

> **Note:** This pattern is commonly used in design systems that require high-resolution
> print or web output while maintaining editing performance.

## Working with Watermarked or Placeholder Media

CE.SDK supports licensing-based workflows where full-resolution assets are only available after purchase or user action:

- **Use Watermarked or Preview Media on Load**\
  Start with branded, obfuscated, or watermarked assets to limit unauthorized use.

- **Swap with Purchased Assets Post-Checkout**\
  Replace asset URIs within the same scene structure using a one-time update, ensuring consistency without disrupting layout or styling.

## Implementing a Custom URI Resolver

CE.SDK provides a `setURIResolver()` method to intercept and customize asset loading:

- **Why Use a URI Resolver?**\
  Handle dynamic URL rewriting, token-based authentication, asset migration, CDN fallbacks, or redirect requests to internal APIs.

- **How It Works**\
  The engine routes every asset URI through your custom resolver function. This function returns the final, resolved URI used for the current fetch operation.

- **Recommended Use Cases**:
  - Add auth headers or query params
  - Redirect public assets to internal mirrors
  - Handle signed URLs or token expiration



---

## More Resources

- **[Flutter Documentation Index](https://img.ly/docs/cesdk/flutter/)** - Browse all Flutter documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/flutter/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/flutter/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support