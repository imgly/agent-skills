> This is one page of the CE.SDK Vanilla JS documentation. For a complete overview, see the [Vanilla JS Documentation Index](https://img.ly/js.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Get Started](./get-started/overview.md) > [What is CE.SDK?](./what-is-cesdk.md)

---

CreativeEditor SDK offers a fully-featured JavaScript library for creating and
editing rich visual designs directly within the browser.

### What is CE.SDK?

This CE.SDK configuration is highly customizable and extendable, providing a comprehensive set of design editing features such as templating, layout management, asset integration, and more. All operations are executed directly in the browser, without the need for server dependencies.

[Launch Web Demo](https://img.ly/showcases/cesdk)

[Get Started](./get-started/overview.md)

## Key Capabilities of the JavaScript Creative Editor SDK

<CapabilityGrid
  features={[
  {
    title: 'Transform',
    description:
      'Perform operations like cropping, rotating, and resizing design elements.',
    imageId: 'transform',
  },
  {
    title: 'Templating',
    description:
      'Create and apply design templates with placeholders and text variables for dynamic content.',
    imageId: 'templating',
  },
  {
    title: 'Placeholders & Lockable Design',
    description:
      'Constrain templates to guide your users’ design and ensure brand consistency.',
    imageId: 'placeholders',
  },
  {
    title: 'Asset Management',
    description:
      'Import and manage images, shapes, and other assets to build your designs.',
    imageId: 'asset-libraries',
  },
  {
    title: 'Design Collage',
    description:
      'Arrange multiple elements on a single canvas to create complex layouts.',
    imageId: 'video-collage',
  },
  {
    title: 'Text Editing',
    description:
      'Add and style text blocks with various fonts, colors, and effects.',
    imageId: 'text-editing',
  },
  {
    title: 'Client-Side Processing',
    description:
      'All design editing operations are executed directly in the browser, with no need for server dependencies.',
    imageId: 'client-side',
  },
  {
    title: 'Headless & Automation',
    description:
      'Programmatically edit designs within your React application using the engine API.',
    imageId: 'headless',
  },
  {
    title: 'Extendible',
    description:
      'Hook into the engine API and editor events to implement custom features.',
    imageId: 'extendible',
  },
  {
    title: 'Customizable UI',
    description:
      'Build and integrate custom UIs tailored to your application’s design needs.',
    imageId: 'customizable-u-i',
  },
  {
    title: 'Background Removal',
    description:
      'This plugin makes it easy to remove the background from images running entirely in the browser.',
    imageId: 'green-screen',
  },
  {
    title: 'Optimized for Print',
    description:
      'Perfect for web-to-print use cases, supporting spot colors and cut-outs.',
    imageId: 'cutout-lines',
  },
]}
/>

## Browser Support

The CE.SDK Design Editor is optimized for use in modern web browsers, ensuring compatibility with the latest versions of Chrome, Firefox, Edge, and Safari.

See the full list of [supported browsers here](./browser-support.md).

## Supported File Types

CE.SDK supports a wide range of file types to ensure maximum flexibility for developers:

### Importing Media

### Exporting Media

### Importing Templates

For detailed information, see the [full file format support list](./file-format-support.md).

## Understanding CE.SDK Architecture & API

The following sections provide an overview of the key components of the CE.SDK design editor UI and its API architecture.
If you're ready to start integrating CE.SDK into your JavaScript application, check out our [Getting Started guide](./get-started/overview.md) or dive into the [guides](./guides.md).

### CreativeEditor Design UI

The CE.SDK design UI is built for intuitive design creation and editing. Here are the main components and customizable elements within the UI:

![](https://img.ly/docs/cesdk/./assets/CESDK-UI.png)

- **Canvas:** The core interaction area for design content.
- **Dock:** Entry point for interactions not directly related to the selected design block, often used for accessing asset libraries.
- **Canvas Menu:** Access block-specific settings like duplication or deletion.
- **Inspector Bar:** Manage block-specific functionalities, such as adjusting properties of the selected block.
- **Navigation Bar:** Handles global scene actions like undo/redo and zoom.
- **Canvas Bar:** Provides tools for managing the overall canvas, such as adding pages or controlling zoom.
- **Layer Panel:** Manage the stacking order and visibility of design elements.

Learn more about interacting with and manipulating design controls in our design editor UI guide.

### CreativeEngine

CreativeEngine is the core of CE.SDK, responsible for managing the rendering and manipulation of design scenes. It can be used in headless mode or integrated with the CreativeEditor UI.

Below are key features and APIs provided by the CreativeEngine:

- **Scene Management:** Create, load, save, and modify design scenes programmatically.
- **Block Manipulation:** Create and manage design elements, such as shapes, text, and images.
- **Asset Management:** Load assets like images and SVGs from URLs or local sources.
- **Variable Management:** Define and manipulate variables within scenes for dynamic content.
- **Event Handling:** Subscribe to events like block creation or updates for dynamic interaction.

## API Overview

The APIs of CE.SDK are grouped into several categories, reflecting different aspects of scene management and manipulation.

[Scene API:](./concepts/scenes.md)- **Creating and Loading
Scenes:** `jsx engine.scene.create(); engine.scene.loadFromURL(url); `

- **Zoom Control:**

```jsx
  engine.scene.setZoomLevel(1.0);
  engine.scene.zoomToBlock(blockId);
```

[Block API:](./concepts/blocks.md)- **Creating Blocks**: \`\`\`jsx
const block = engine.block.create('shapes/rectangle');

````

- **Setting Properties**:

  ```jsx
  engine.block.setColor(blockId, 'fill/color', { r: 1, g: 0, b: 0, a: 1 });
  engine.block.setString(blockId, 'text/content', 'Hello World');
  
````

- **Querying Properties**:
  ```jsx
  const color = engine.block.getColor(blockId, 'fill/color');
  const text = engine.block.getString(blockId, 'text/content');
  ```

````

<Link id="7ecb50">**Variable API:**</Link>
Variables allow dynamic content within scenes to programmatically create
variations of a design. - **Managing Variables**: ```jsx
engine.variable.setString('myVariable', 'value'); const value =
engine.variable.getString('myVariable'); 
````

[Asset API:](./import-media/concepts.md)- **Managing Assets**: \`\`\`jsx
engine.asset.add('image', 'https://example.com/image.png');

````

<Link id="353f97">**Event API:**</Link>
- **Subscribing to Events**:
  ```jsx
  // Subscribe to scene changes
  engine.scene.onActiveChanged(() => {
    const newActiveScene = engine.scene.get();
  });
  
````

## Customizing the JavaScript Creative Editor

CE.SDK provides extensive customization options to adapt the UI to various use cases. These options range from simple configuration changes to more advanced customizations involving callbacks and custom elements.

### Role-Based Customization

Switch between "Creator" and "Adopter" roles to control the editing experience. The "Creator" role allows setting constraints on template elements, while the "Adopter" role is focused on adapting these elements.

- **Creator:** Set constraints and manage template settings.
- **Adopter:** Edit elements within the bounds set by the Creator.

### Basic Customizations

- **Configuration Object:** When initializing the CreativeEditor, you can pass a configuration object that defines basic settings such as the base URL for assets, the language, theme, and license key.

```jsx
const config = {
  baseURL: `https://cdn.img.ly/packages/imgly/cesdk-js/${CreativeEditorSDK.version}/assets`,
  // license: 'YOUR_CESDK_LICENSE_KEY',
};
```

- **Localization:** Customize the language and labels used in the editor to support different locales.

```jsx
const config = {};

CreativeEditorSDK.create('#cesdk_container', config).then(async cesdk => {
  // Set theme using the UI API
  cesdk.ui.setTheme('light'); // 'dark' | 'system'
  cesdk.i18n.setLocale('en');
  cesdk.i18n.setTranslations({
    en: {
      variables: {
        my_custom_variable: {
          label: 'Custom Label',
        },
      },
    },
  });
});
```

- [Custom Asset Sources](./import-media/concepts.md): Serve custom image
  or SVG assets from a remote URL.

### UI Customization Options

- **Theme:** Choose between predefined themes such as 'dark', 'light', or 'system'.

```jsx
CreativeEditorSDK.create('#cesdk_container', config).then(async cesdk => {
  // Set theme using the UI API
  cesdk.ui.setTheme('dark'); // 'light' | 'system'
});
```

- **UI Components:** Enable or disable specific UI components based on your requirements.

```jsx
const config = {
  ui: {
    elements: {
      toolbar: true,
      inspector: false,
    },
  },
};
```

## Advanced Customizations

Learn more about extending editor functionality and customizing its UI to your use case by consulting our in-depth [customization guide](./user-interface.md).

Here is an overview of the APIs and components available to you.

### Order APIs

Customization of the web editor's components and their order within these locations is managed through specific Order APIs, allowing the addition, removal, or reordering of elements. These locations are configured through the unified Component Order API using `setComponentOrder({ in: location }, order)` with location values like `'ly.img.dock'`, `'ly.img.canvas.menu'`, `'ly.img.inspector.bar'`, `'ly.img.navigation.bar'`, and `'ly.img.canvas.bar'`.

### Layout Components

CE.SDK provides special components for layout control, such as `ly.img.separator` for separating groups of components and `ly.img.spacer` for adding space between components.

### Registration of New Components

Custom components can be registered and integrated into the web editor using builder components like buttons, dropdowns, and inputs. These components can replace default ones or introduce new functionalities, deeply integrating custom logic into the editor.

### Feature API

The Feature API enables conditional display and functionality of components based on the current context, allowing for dynamic customization. For example, you can hide certain buttons for specific block types.

## Plugins

You can customize the CE.SDK web editor during its initialization using the APIs outlined above. For many use cases, this will be adequate. However, there are times when you might want to encapsulate functionality for reuse. This is where plugins become useful.

Follow our [guide on building your own plugins](./user-interface.md) to learn more or check out one of the plugins we built using this API:

- [Background Removal](./edit-image/remove-bg.md): Adds a button to
  the canvas menu to remove image backgrounds.
- [Vectorizer](./edit-image/vectorize.md): Transform your pixel-based
  images images into scalable vector graphics.

<CallToAction />

<LogoWall />



---

## More Resources

- **[Vanilla JS Documentation Index](https://img.ly/js.md)** - Browse all Vanilla JS documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./js.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support