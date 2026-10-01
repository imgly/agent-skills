> This is one page of the CE.SDK Vanilla JS/TS documentation. For a complete overview, see the [Vanilla JS/TS Documentation Index](https://img.ly/docs/cesdk/js.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Automate Workflows](./automation.md) > [Overview](./automation/overview.md)

---

Workflow automation with CreativeEditor SDK (CE.SDK) enables you to programmatically generate, manipulate, and export creative assets—at scale. Whether you're creating thousands of localized ads, preparing platform-specific variants of a campaign, or populating print-ready templates with dynamic data, CE.SDK provides a flexible foundation for automation.

You can run automation entirely on the client, integrate it with your backend, or build hybrid “human-in-the-loop” workflows where users interact with partially automated scenes before export. The automation engine supports static and video pipelines, making it suitable for a wide range of publishing, e-commerce, and marketing applications. On the server, export MP4 video directly with the native `@cesdk/node-native` package; with the WASM-based `@cesdk/node`, use the separate CE.SDK Renderer.

[Launch Web Demo](https://img.ly/showcases/cesdk)

[Get Started](./get-started/overview.md)

## What Can Be Automated with CE.SDK

CE.SDK supports a wide variety of automation use cases, including:

- **Design generation at scale**: Create thousands of variants from a single template, such as product cards or regionalized campaigns.
- **Data-driven customization**: Merge external data (e.g., CSV, JSON, APIs) into templates to personalize text, images, or layout.
- **Responsive output creation**: Automatically resize designs and export assets in different aspect ratios or dimensions for various platforms.
- **Pre-export validation**: Detect issues like empty placeholders or low-resolution images before generating final output.
- **Multimodal exporting**: Automate delivery to multiple formats including JPG, PNG, PDF, and MP4.

## Automation Contexts

### Headless / Server-Side Automation

Server-side automation provides complete control over content generation without rendering a UI. This is ideal for background processing, such as creating assets in response to API requests or batch-generating print files for a mail campaign.

### UI-Integrated Automation (Human-in-the-Loop)

For workflows that require user input or final approval, you can embed automation into the CE.SDK UI. Users can review, customize, or finalize designs that were pre-filled with dynamic data—ideal for marketing teams, e-commerce admins, or print professionals.

### Client-Side vs. Backend-Supported Workflows

Many automation workflows can run directly on the client or device thanks to CE.SDK’s client-side architecture. However, a backend may be required for use cases involving:

- Secure access to private assets
- Large dataset lookups
- Server-side template rendering
- Scheduled or event-based triggers

## Customization Capabilities

CE.SDK gives you deep control over how your automation pipeline behaves:

### Data Sources

Connect to a variety of inputs:

- Local or remote JSON
- CSV files
- REST APIs
- CMS or PIM systems

### Template Customization

- Define dynamic variables and conditional placeholders
- Use reusable templates or generate them on-the-fly
- Lock or constrain specific fields to preserve brand integrity

### Design Rules

Enforce visual and content constraints:

- Brand-compliant colors and fonts
- Overflow handling and text auto-resizing
- Show/hide conditions and fallback logic

### Output Formats

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

## UI Customization for Automation

You can extend the CE.SDK UI to trigger and manage automation tasks directly in the interface:

- Add buttons or panels to trigger workflows
- Dynamically update the scene based on user input or external data
- Customize visibility of UI components depending on the stage (e.g., pre-fill vs. review)

This makes it easy to integrate human-in-the-loop flows while preserving a tailored editing experience.



---

## More Resources

- **[Vanilla JS/TS Documentation Index](https://img.ly/docs/cesdk/js.md)** - Browse all Vanilla JS/TS documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./js.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support