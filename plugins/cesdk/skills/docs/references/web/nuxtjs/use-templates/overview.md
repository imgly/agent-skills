> This is one page of the CE.SDK Nuxt.js documentation. For a complete overview, see the [Nuxt.js Documentation Index](https://img.ly/docs/cesdk/nuxtjs.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Create and Use Templates](./create-templates.md) > [Use Templates Overview](./use-templates/overview.md)

---

Templates in CreativeEditor SDK (CE.SDK) are pre-designed layouts that serve as starting points for generating static designs, videos, or print-ready outputs. Templates can be used to produce a wide range of media, including images, PDFs, and videos.

Instead of creating a design from scratch, you can use a template to quickly produce content by adapting pre-defined elements like text, images, and layout structures.

Using templates offers significant advantages: faster content creation, consistent visual style, and scalable design workflows across many outputs.

CE.SDK supports two modes of using templates:

- **Fully Programmatic**: Generate content variations automatically by merging external data into templates without user intervention.
- **User-Assisted**: Let users load a template, customize editable elements, and export the result manually.

Template-based generation can be performed entirely on the client, entirely on a server, or in a hybrid setup where users interact with templates client-side before triggering automated server-side generation.

[Launch Web Demo](https://img.ly/showcases/cesdk)

[Get Started](./get-started/overview.md)

## Ways to Use Templates

### Programmatic Use

You can automate the generation of final assets by merging data into templates entirely through code. This is ideal for workflows like mass personalization, product variations, or dynamic marketing content, where the design layout stays consistent, but the content (e.g., names, images, pricing) varies.

### User-Assisted Use

Alternatively, templates can be used as editable starting points for users. CE.SDK allows you to define which parts of a template are editable and which are locked. This ensures that users can customize elements such as text or images while maintaining brand or design consistency where needed.

This hybrid approach is useful for cases where users need some creative freedom but within structured design constraints.

## Working with Dynamic Content

CE.SDK templates support dynamic placeholders for content such as text, images, and custom elements. You can replace dynamic content in several ways:

- **Through the UI**: Users can manually edit placeholders directly on the canvas or through a form-based editing interface that lists all editable fields for faster and more structured updates.
- **Programmatically**: External data (e.g., from a database, CSV file, or API) can be merged automatically into placeholders without requiring user interaction.

This flexibility supports both one-off customizations and large-scale content generation scenarios.

## Exploring the Template Library

Templates are stored, organized, and managed through the CE.SDK Template Library. This library acts as a centralized place where templates are categorized and retrieved either programmatically or through the UI.

You can work with:

- **Default Templates**: Templates that come bundled with the SDK to help you get started quickly.
- **Custom Templates**: Templates you create based on your specific use case, offering full flexibility over design, dynamic fields, and editing constraints.
- **Premium Templates**: Additional high-quality templates provided by IMG.LY, which can be integrated into your application if licensed.

## Selecting Templates

Users can browse and select templates through the Asset Library, which you can customize to match your application's design and user experience. You have full control over:

- The appearance and layout of the template picker.
- The filters and categories shown to users.
- Whether to display only a subset of templates based on user roles or project types.

## Switching Between Templates

Users can switch templates during the editing process. When a new template is applied:

- Existing content may be preserved, repositioned, or reset depending on how the templates are configured.
- The editor can guide users through the transition to avoid accidental loss of work.

You can control how strict or flexible this behavior is, depending on your application's needs.

## Applying Templates to Existing Scenes

It’s possible to apply a template to an existing scene. In these cases:

- The template structure can be merged with the current content.
- Alternatively, the scene can be reset and rebuilt based on the new template, depending on the chosen integration approach.

This enables workflows like refreshing an old design with a new branded layout without starting over.

## Output Formats When Using Templates

When generating outputs from templates, CE.SDK supports:

| Category    | Supported Formats                                                                    |
| ----------- | ------------------------------------------------------------------------------------ |
| **Images**  | `.png` (with transparency), `.jpeg`, `.webp`, `.tga`                                 |
| **Vector**  | `.svg` (scalable vector graphics with text as paths)                                 |
| **Print**   | `.pdf` (supports underlayer printing and spot colors)                                |
| **Video**   | `.mp4` (H.264 or H.265 on supported platforms with limited transparency support)     |
| **Scene**   | `.imgly` or `.scene` (description of the scene without any assets) |
| **Archive** | `.imgly` or `.zip` (fully self-contained archive that bundles the scene file with all assets) |

> **Note:** Our custom cross-platform C++ based rendering and layout engine ensures
> consistent output quality across devices.

Templates are format-aware, allowing you to design once and export to multiple formats seamlessly. For example, a single marketing template could be used to produce a social media graphic, a printable flyer, and a promotional video, all using the same underlying design.



---

## More Resources

- **[Nuxt.js Documentation Index](https://img.ly/docs/cesdk/nuxtjs.md)** - Browse all Nuxt.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./nuxtjs.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support