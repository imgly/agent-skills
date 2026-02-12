> This is one page of the CE.SDK Vue documentation. For a complete overview, see the [Vue Documentation Index](https://img.ly/vue.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Get Started](./get-started/overview.md) > [What is CE.SDK?](./what-is-cesdk.md)

---

The CreativeEditor SDK delivers a powerful Vue.js library designed for
crafting and editing rich visual designs directly within the browser.

### What is CE.SDK?

This CE.SDK configuration is fully customizable and extendable, offering a comprehensive range of design editing capabilities, including templating, layout management, asset integration, and more, as well as advanced features like background removal.

[Launch Web Demo](https://img.ly/showcases/cesdk)

[Get Started](./get-started/overview.md)

## Key Features of the Vue.js Creative Editor SDK

<CapabilityGrid
  features={[
  {
    title: 'Transformations',
    description:
      'Execute operations like cropping, rotating, and resizing design components.',
    imageId: 'transform',
  },
  {
    title: 'Templating',
    description:
      'Build and apply design templates with placeholders and text variables for dynamic content.',
    imageId: 'templating',
  },
  {
    title: 'Placeholders & Lockable Design',
    description:
      'Constrain templates to guide your users’ design and ensure brand consistency.',
    imageId: 'placeholders',
  },
  {
    title: 'Asset Handling',
    description:
      'Import and manage images, shapes, and other assets for your design projects.',
    imageId: 'asset-libraries',
  },
  {
    title: 'Design Collages',
    description:
      'Arrange multiple elements on a single canvas to create intricate layouts.',
    imageId: 'video-collage',
  },
  {
    title: 'Text Editing',
    description:
      'Incorporate and style text blocks using various fonts, colors, and effects.',
    imageId: 'text-editing',
  },
  {
    title: 'Client-Side Operations',
    description:
      'All design editing tasks are performed directly in the browser, eliminating the need for server dependencies.',
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
      'Easily enhance functionality with plugins and custom scripts.',
    imageId: 'extendible',
  },
  {
    title: 'Customizable UI',
    description:
      'Develop and integrate custom UIs tailored to your application’s design requirements.',
    imageId: 'customizable-u-i',
  },
  {
    title: 'Background Removal',
    description:
      'This plugin simplifies the process of removing backgrounds from images entirely within the browser.',
    imageId: 'green-screen',
  },
  {
    title: 'Print Optimization',
    description:
      'Ideal for web-to-print scenarios, supporting spot colors and cut-outs.',
    imageId: 'cutout-lines',
  },
]}
/>

## Browser Support

The CE.SDK Design Editor is optimized for use in modern web browsers, ensuring compatibility with the latest versions of Chrome, Firefox, Edge, and Safari. See the full list of [supported browsers here](./browser-support.md).

## Supported Formats

CE.SDK supports a wide range of file types to ensure maximum flexibility for developers:

### Importing Media

### Exporting Media

### Importing Templates

For detailed information, see the [full file format support list](./file-format-support.md).

## Understanding CE.SDK Architecture & API

The following sections provide an overview of the key components of the CE.SDK design editor UI and its API architecture. If you're ready to start integrating CE.SDK into your Vue.js application, refer to our [Getting Started guide](./get-started/overview.md) or explore the Essential Guides.

### CreativeEditor Design UI

The CE.SDK design UI is designed for intuitive design creation and editing. Key components and customizable elements within the UI include:

![](https://img.ly/docs/cesdk/./assets/CESDK-UI.png)

- **Canvas:** The main interaction area for design content.
- **Dock:** An entry point for interactions not directly related to the selected design block, often used for accessing asset libraries.
- **Canvas Menu:** Access block-specific settings like duplication or deletion.
- **Inspector Bar:** Manage block-specific functionalities, such as adjusting properties of the selected block.
- **Navigation Bar:** Handles global scene actions like undo/redo and zoom.
- **Canvas Bar:** Provides tools for managing the overall canvas, such as adding pages or controlling zoom.
- **Layer Panel:** Manage the stacking order and visibility of design elements.

Learn more about interacting with and manipulating design controls in our design editor UI guide.

### CreativeEngine

The CreativeEngine is the core of CE.SDK, responsible for rendering and manipulating design scenes. It can operate in headless mode or be integrated with the CreativeEditor UI. Key features and APIs provided by CreativeEngine include:

- **Scene Management:** Create, load, save, and modify design scenes programmatically.
- **Block Manipulation:** Create and manage design elements, such as shapes, text, and images.
- **Asset Management:** Load assets like images and SVGs from URLs or local sources.
- **Variable Management:** Define and manipulate variables within scenes for dynamic content.
- **Event Handling:** Subscribe to events like block creation or updates for dynamic interaction.

## API Overview

CE.SDK’s APIs are categorized into several groups, reflecting different aspects of scene management and manipulation.

[Scene API:](./concepts/scenes.md)- **Creating and Loading Scenes**:

```javascript
engine.scene.create();
engine.scene.loadFromURL(url);
```

- **Zoom Control**:

  ```javascript
  engine.scene.setZoomLevel(1.0);
  engine.scene.zoomToBlock(blockId);
  ```

````

<Link id="90241e">**Block API:**</Link>: - **Creating Blocks**:

```javascript
const block = engine.block.create('shapes/rectangle');
````

- **Setting Properties**:

  ```javascript
  engine.block.setColor(blockId, 'fill/color', { r: 1, g: 0, b: 0, a: 1 });
  engine.block.setString(blockId, 'text/content', 'Hello World');
  ```

````

- **Querying Properties**:

  ```javascript
  const color = engine.block.getColor(blockId, 'fill/color');
  const text = engine.block.getString(blockId, 'text/content');
  
````

[Variable API:](./create-templates/add-dynamic-content/text-variables.md)
Variables allow dynamic content within scenes, enabling programmatic creation of
design variations.

- **Managing Variables**:

  ```javascript
  engine.variable.setString('myVariable', 'value');
  const value = engine.variable.getString('myVariable');
  ```

````

<Link id="5e6197">**Asset API:**</Link>: - **Managing Assets**:

```javascript
engine.asset.add('image', 'https://example.com/image.png');
````

[Event API:](./concepts/events.md): - **Subscribing to Events**:

```javascript
// Subscribe to scene changes
engine.scene.onActiveChanged(() => {
  const newActiveScene = engine.scene.get();
});
```

## Customizing the Vue.js Creative Editor

CE.SDK provides extensive customization options to tailor the UI to various use cases. These options range from simple configuration changes to more advanced customizations involving callbacks and custom elements.

### Basic Customizations

- **Configuration Object:** When initializing the CreativeEditor, pass a configuration object that defines basic settings such as the base URL for assets, language, theme, and license key.

  ```javascript
  const config = {
    baseURL: `https://cdn.img.ly/packages/imgly/cesdk-js/${CreativeEditorSDK.version}/assets`,
    // license: 'YOUR_CESDK_LICENSE_KEY',
  };
  ```

````

- **Localization:** Customize the language and labels used in the editor to support different locales.

  ```javascript
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
  
````

- [Custom Asset Sources](./import-media/concepts.md): Serve custom image or SVG
  assets from a remote URL.

### UI Customization Options

- **Theme:** Select from predefined themes like 'dark', 'light', or 'system'.

  ```javascript
  CreativeEditorSDK.create('#cesdk_container', config).then(async cesdk => {
    // Set theme using the UI API
    cesdk.ui.setTheme('dark'); // 'light' | 'system'
  });
  ```

````

- **UI Components:** Enable or disable specific UI components as needed.

  ```javascript
  const config = {
    ui: {
      elements: {
        toolbar: true,
        inspector: false,
      },
    },
  };
  
````

## Advanced Customizations

Explore more ways to extend editor functionality and customize its UI to your specific needs by consulting our detailed [customization guide](./user-interface.md). Below is an overview of the available APIs and components.

### Order APIs

The Order APIs manage the customization of the web editor's components and their order within these locations, allowing the addition, removal, or reordering of elements. These locations are configured through the unified Component Order API using `setComponentOrder({ in: location }, order)` with location values like `'ly.img.dock'`, `'ly.img.canvas.menu'`, `'ly.img.inspector.bar'`, `'ly.img.navigation.bar'`, and `'ly.img.canvas.bar'`.

### Layout Components

CE.SDK offers special components for layout control, such as `ly.img.separator` for separating groups of components and `ly.img.spacer` for adding space between components.

### Registration of New Components

Custom components can be registered and integrated into the web editor using builder components like buttons, dropdowns, and inputs. These components can replace default ones or introduce new functionalities, seamlessly integrating custom logic into the editor.

### Feature API

The Feature API allows for the conditional display and functionality of components based on the current context, enabling dynamic customization. For instance, certain buttons can be hidden for specific block types.

## Plugins

Customizing the CE.SDK web editor during its initialization is possible through the APIs outlined above. For many use cases, this will be sufficient. However, there are situations where encapsulating functionality for reuse is necessary. Plugins come in handy here. Follow our [guide on building your own plugins](./user-interface.md) to learn more or explore some of the plugins we've created using this API:

- **Background Removal**: Adds a button to the canvas menu to remove image backgrounds.
- **Vectorizer**: Adds a button to the canvas menu to quickly vectorize a graphic.

<CallToAction />

<LogoWall />



---

## More Resources

- **[Vue Documentation Index](https://img.ly/vue.md)** - Browse all Vue documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./vue.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support