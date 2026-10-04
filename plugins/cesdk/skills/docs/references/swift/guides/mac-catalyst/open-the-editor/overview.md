> This is one page of the CE.SDK Mac Catalyst documentation. For a complete overview, see the [Mac Catalyst Documentation Index](https://img.ly/docs/cesdk/mac-catalyst/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/mac-catalyst/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Open the Editor](../open-the-editor.md) > [Overview](./overview.md)

---

CreativeEditor SDK (CE.SDK) offers multiple ways to open the editor. Whether
you're starting with a blank canvas or importing complex layered files, CE.SDK
gives you the building blocks to launch an editing session tailored to your
users' needs.

[Explore Demos](https://img.ly/showcases/cesdk?tags=ios)

[Get Started](../get-started/overview.md)

## Ways to Open the Editor

You can initialize CE.SDK in several ways depending on your content pipeline:

- [Start with a Blank Canvas](./blank-canvas.md)<br />
  Create new content from scratch by defining the canvas dimensions manually or
  programmatically.

- [Load a Scene](./load-scene.md)<br />
  Restore a saved scene from serialized scene data, a scene file, or a
  self-contained archive.

- Create from Media<br />
  Initialize the editor with a preloaded [image](./from-image.md) or
  [video](./from-video.md).

- [Create from Template](./from-template.md)<br />
  Kick off the editor with a predefined template, including placeholders and
  editing constraints.

- [Import a Design](./import-design.md)<br />
  Import external designs with the relevant importer, then load the resulting
  scene or archive in the SDK.

## Set the Zoom Level

After a scene is open, use [Set Zoom Level](./set-zoom-level.md) to control
the viewport and focus the canvas on the content your user should inspect next.

## Using Low-Quality / High-Quality Assets

To ensure responsive editing and high-quality exports, CE.SDK allows you to
dynamically switch between asset resolutions:

- **Edit with Low-Res Assets**<br />
  Load smaller versions of images or videos during the editing process to reduce
  memory usage and improve performance.

- **Export with High-Res Assets**<br />
  Swap out low-res placeholders for full-quality assets just before exporting.
  This can be handled using the Scene or Block APIs by switching asset paths or
  making use of source sets for fills.

> **Note:** This pattern is commonly used in design systems that require high-resolution
> print or web output while maintaining editing performance.

## Working with Watermarked or Placeholder Media

CE.SDK supports licensing-based workflows where full-resolution assets are only
available after purchase or user action:

- **Use Watermarked or Preview Media on Load**<br />
  Start with branded, obfuscated, or watermarked assets to limit unauthorized
  use.

- **Swap with Purchased Assets Post-Checkout**<br />
  Replace asset URIs within the same scene structure using a one-time update,
  ensuring consistency without disrupting layout or styling.

## Implementing a Custom URI Resolver

Use [URI resolver APIs](./uri-resolver.md) to intercept and customize asset
loading:

- **Why Use a URI Resolver?**<br />
  Handle dynamic URL rewriting, signed query parameters, asset migration, CDN
  fallbacks, or redirects to internal mirrors.

- **How It Works**<br />
  The engine routes every asset URI through your custom resolver function. This
  function returns the final, resolved URI used for the current fetch operation.

- **Recommended Use Cases**:
  - Append signed query params
  - Redirect public assets to internal mirrors
  - Refresh tokenized URLs before they expire



---

## More Resources

- **[Mac Catalyst Documentation Index](https://img.ly/docs/cesdk/mac-catalyst/)** - Browse all Mac Catalyst documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/mac-catalyst/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/mac-catalyst/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support