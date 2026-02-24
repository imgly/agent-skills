> This is one page of the CE.SDK SvelteKit documentation. For a complete overview, see the [SvelteKit Documentation Index](https://img.ly/sveltekit.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

This guide shows you how to use CE.SDK's headless engine for programmatic content creation without a UI. You'll install the engine, initialize it, and create content through code. By the end, you'll be able to generate images and videos programmatically.

## Install CE.SDK Engine

<Tabs syncKey="package-manager">
  <TabItem label="npm">
    ```bash
    npm install @cesdk/engine
    ```
  </TabItem>

  <TabItem label="pnpm">
    ```bash
    pnpm add @cesdk/engine
    ```
  </TabItem>

  <TabItem label="yarn">
    ```bash
    yarn add @cesdk/engine
    ```
  </TabItem>

  <TabItem label="CDN">
    ```javascript
    import CreativeEngine from 'https://cdn.img.ly/packages/imgly/cesdk-engine/$UBQ_VERSION$/index.js';
    ```
  </TabItem>
</Tabs>

## Initialize the Engine

Initialize the engine and create content programmatically:

```typescript
const config = {
  license: 'YOUR_CESDK_LICENSE_KEY',
  userId: 'your-user-id',
};

const engine = await CreativeEngine.init(config);

// Create a scene programmatically
const scene = await engine.scene.create();

// Add blocks and manipulate content
const page = engine.block.create('page');
engine.block.setWidth(page, 800);
engine.block.setHeight(page, 600);
engine.block.appendChild(scene, page);

// Clean up
engine.dispose();
```

> **Note:** Learn more about programmatic content creation in the [Engine documentation](https://img.ly/docs/cesdk/js/engine/quickstart/).

## Key Features

The headless engine provides full access to CE.SDK's capabilities without rendering a UI:

- **Programmatic Scene Creation** - Build designs entirely through code
- **Server-Side Rendering** - Generate images and videos on the server
- **Batch Processing** - Automate content generation at scale
- **Asset Management** - Load and manipulate images, videos, and fonts
- **Export Capabilities** - Export to PNG, JPEG, PDF, MP4, and more

## API Reference

| Method                       | Description                                                |
| ---------------------------- | ---------------------------------------------------------- |
| `CreativeEngine.init()`      | Initializes the headless engine for programmatic creation |
| `engine.scene.create()`      | Creates a new scene programmatically                       |
| `engine.block.create()`      | Creates a new block of the specified type                  |
| `engine.block.setWidth()`    | Sets the width of a block                                  |
| `engine.block.setHeight()`   | Sets the height of a block                                 |
| `engine.block.appendChild()` | Adds a block as a child of another block                   |
| `engine.dispose()`           | Cleans up engine resources and releases memory             |

## Next Steps

- **[Engine Quickstart](https://img.ly/docs/cesdk/js/engine/quickstart/)** - Learn more about programmatic content creation
- **[Block API Guide](https://img.ly/docs/cesdk/js/engine/guides/blocks/)** - Understand blocks and the scene hierarchy
- **[Export Guide](https://img.ly/docs/cesdk/js/engine/guides/export/)** - Learn about export formats and configuration



---

## More Resources

- **[SvelteKit Documentation Index](https://img.ly/sveltekit.md)** - Browse all SvelteKit documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./sveltekit.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support