> This is one page of the CE.SDK Flutter documentation. For a complete overview, see the [Flutter Documentation Index](https://img.ly/docs/cesdk/flutter/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/flutter/llms-full.txt).

**Navigation:** [Guides](https://img.ly/docs/cesdk/flutter/guides-8d8b00/) > [Engine](./engine-interface.md)

---

The Creative Engine is the powerhouse behind CE.SDK's cross-platform capabilities. While the UI components provide ready-to-use editing experiences, the Engine interface gives you direct programmatic control over all creative operations—from simple batch processing to complex automated workflows.

## Client-Side vs Server-Side Processing

Understanding when to use client-side versus server-side processing is crucial for building efficient creative automation workflows. Each approach offers distinct advantages depending on your use case requirements.

### Client-Side Processing (Mobile Device)

Client-side processing runs the Engine directly in the user's device — but importantly, this doesn't mean visible to the user. The Engine operates headlessly in the background, making it perfect for automation tasks that enhance user experience without interrupting their workflow.

**Common Implementation Patterns:**

**Hidden Engine Instances**: Run a second, invisible Engine instance alongside your main UI for background processing. While users edit in the primary interface, the hidden instance can validate designs, generate previews, or prepare export-ready assets.

**Underlying Engine Access**: Access the Engine API directly from prebuilt UI components for custom automation within existing workflows.

**Dedicated Engine Packages**: Use platform-specific Engine packages for specialized client-side automation without any UI overhead.

**Ideal Client-Side Use Cases:**

- **Design Validation**: Check for empty placeholders, low-resolution images, or brand guideline violations in real-time
- **Thumbnail Generation**: Create preview images for design galleries or version history
- **Effect Previews**: Generate quick previews of filters or effects before applying them to the main design
- **Auto-Save Optimization**: Compress and optimize scenes for storage while maintaining editability
- **Real-Time Feedback**: Provide instant visual feedback for design rules or constraints

### Server-Side Processing

Server-side processing moves the Engine to your backend infrastructure, unlocking powerful capabilities for resource-intensive operations and scalable workflows.

**Key Advantages:**

- **Enhanced Resources**: Access to more CPU, memory, and storage than client devices
- **Secure Asset Access**: Process private assets without exposing them to client-side code
- **Background Operations**: Handle long-running tasks without affecting user experience
- **Scheduled Automation**: Trigger design generation based on events, schedules, or external APIs

**Ideal Server-Side Use Cases:**

- **High-Resolution Exports**: Generate print-quality assets that would be too resource-intensive for client devices
- **Bulk Generation**: Create thousands of design variations for marketing campaigns or product catalogs
- **Data Pipeline Integration**: Connect to databases, APIs, or file systems for automated content generation
- **Multi-Format Output**: Export designs in multiple formats and resolutions simultaneously
- **Workflow Orchestration**: Coordinate complex multi-step automation processes

**Hybrid Workflows**: Often, the most effective approach combines both client and server-side processing. Users can design and preview on the client with instant feedback, while heavy processing happens on the server in the background.

## Engine-Powered Use Cases

The Engine interface unlocks [powerful automation scenarios](./automation/overview.md) that can scale creative workflows:

### Batch Processing

Process multiple designs simultaneously with consistent results. Whether you're applying filters to hundreds of images or generating variations of a marketing template, the Engine handles bulk operations efficiently both client-side and server-side.

### Auto-Resize

Automatically adapt designs to different aspect ratios and platforms. The Engine intelligently repositions elements, adjusts text sizes, and maintains visual hierarchy across formats—from Instagram stories to LinkedIn posts.

### Data Merge

Connect external data sources (CSV, JSON, APIs) to templates for personalized content generation. Perfect for creating thousands of product cards, personalized certificates, or location-specific campaigns.

### Product Variations

Generate multiple versions of product designs with different colors, sizes, or configurations. Ideal for e-commerce platforms needing to showcase product options without manual design work.

### Design Generation

Create entirely new designs programmatically based on rules, templates, or AI inputs. The Engine can compose layouts, select appropriate fonts, and arrange elements according to your design guidelines.

### Multiple Image Generation

Efficiently process and export designs in various formats and resolutions. Generate web-optimized previews alongside print-ready high-resolution files in a single workflow.

### Actions

Implement complex multi-step operations as reusable actions. Chain together filters, transformations, and exports to create sophisticated automated workflows that can be triggered programmatically.



---

## More Resources

- **[Flutter Documentation Index](https://img.ly/docs/cesdk/flutter/)** - Browse all Flutter documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/flutter/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/flutter/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support