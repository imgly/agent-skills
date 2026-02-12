> This is one page of the CE.SDK Vanilla JS documentation. For a complete overview, see the [Vanilla JS Documentation Index](https://img.ly/js.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Solutions](./prebuilt-solutions.md) > [Photo Editor](./prebuilt-solutions/photo-editor.md)

---

The CreativeEditor SDK provides a powerful and intuitive solution designed for
seamless photo editing directly in the browser.

This CE.SDK configuration is fully customizable, offering a range of features that cater to various use cases, from simple photo adjustments, image compositions with background removal, to programmatic editing at scale.

Whether you are building a photo editing application for social media, e-commerce, or any other platform, the CE.SDK Javascript Image Editor provides the tools you need to deliver a best-in-class user experience.

[Launch Web Demo](https://img.ly/showcases/cesdk/photo-editor-ui/web)

[View on GitHub](https://github.com/imgly/cesdk-web-examples/tree/main/showcase-photo-editor-ui/src/components/case/CaseComponent.jsx)

## Key Capabilities

<CapabilityGrid
  features={[
  {
    title: 'Transform',
    description:
      'Easily perform operations like cropping, rotating, and resizing your design elements to achieve the perfect composition.',
    imageId: 'transform',
  },
  {
    title: 'Asset Management',
    description:
      'Import and manage stickers, images, shapes, and other assets to build intricate and visually appealing designs.',
    imageId: 'asset-libraries',
  },
  {
    title: 'Text Editing',
    description:
      'Add and style text blocks with a variety of fonts, colors, and effects, giving users the creative freedom to express themselves.',
    imageId: 'text-editing',
  },
  {
    title: 'Client-Side Processing',
    description:
      'All editing operations are performed directly in the browser, ensuring fast performance without the need for server dependencies.',
    imageId: 'client-side',
  },
  {
    title: 'Headless & Automation',
    description:
      'Programmatically edit designs using the engine API, allowing for automated workflows and advanced integrations within your application.',
    imageId: 'headless',
  },
  {
    title: 'Extendible',
    description:
      'Enhance functionality with plugins and custom scripts, making it easy to tailor the editor to specific needs and use cases.',
    imageId: 'extendible',
  },
  {
    title: 'Customizable UI',
    description:
      'Design and integrate custom user interfaces that align with your application’s branding and user experience requirements.',
    imageId: 'customizable-u-i',
  },
  {
    title: 'Background Removal',
    description:
      'Utilize the powerful background removal plugin to allow users to effortlessly remove backgrounds from images, entirely on the Client-Side.',
    imageId: 'green-screen',
  },
  {
    title: 'Filters & Effects',
    description:
      ' Choose from a wide range of filters and effects to add professional-grade finishing touches to photos, enhancing their visual appeal.',
    imageId: 'filters',
  },
  {
    title: 'Size Presets',
    description:
      'Access a variety of size presets tailored for different use cases, including social media formats and print-ready dimensions.',
    imageId: 'size-presets',
  },
]}
/>

## What is the Photo Editor Solution?

The Photo Editor is a fully customizable CE.SDK configuration focused on photo-centric use cases. It strips down the editor interface to include only the most relevant features for image adjustments — giving users a focused and responsive experience. Whether your users need to fine-tune selfies, prepare product photos, or create profile images, this solution makes it easy.

Get a powerful photo editor into your app with minimal setup. The Photo Editor runs entirely client-side — which helps reduce cloud computing costs and improve privacy.

## Browser Support

The CE.SDK Design Editor is optimized for use in modern web browsers, ensuring compatibility with the latest versions of Chrome, Firefox, Edge, and Safari.

See the full list of [supported browsers here](./browser-support.md).

## Supported File Types

[IMG.LY](http://img.ly/)'s Creative Editor SDK enables you to load, edit, and save images directly in the browser without server dependencies.

### Importing Media

### Exporting Media

### Importing Templates

For detailed information, see the [full file format support list](./file-format-support.md).

## Getting Started

If you're ready to start integrating CE.SDK into your Javascript application, check out the CE.SDK [Getting Started guide](./get-started/overview.md).

In order to configure the editor for an image editing use case consult our [photo editor UI showcase](https://img.ly/showcases/cesdk/photo-editor-ui/web#c) and its [reference implementation](https://github.com/imgly/cesdk-web-examples/tree/main/showcase-photo-editor-ui/src/components/case/CaseComponent.jsx).

## Understanding CE.SDK Architecture & API

The following sections provide an overview of the key components of the CE.SDK photo editor UI and its API architecture.

If you're ready to start integrating CE.SDK into your application, check out our [Getting Started guide](./get-started/overview.md) or explore the Essential Guides.

### CreativeEditor Photo UI

The CE.SDK photo editor UI is a specific configuration of the CE.SDK which focuses the Editor UI to essential photo editing features.

It further includes our powerful background removal plugin that runs entirely on the users device, saving on computing costs.

This configuration can be further modified to suit your needs, see the section on customization.

Designed for intuitive interaction, enabling users to create and edit designs with ease. Key components include:
![](https://img.ly/docs/cesdk/./assets/CESDK-UI.png)

- *Canvas*: The primary workspace where users interact with their photo content.
- *Dock*: Provides access to tools and assets that are not directly related to the selected image or block, often used for adding or managing assets.
- *Inspector Bar*: Controls properties specific to the selected block, such as size, rotation, and other adjustments.
- *Canvas Menu*: Provides block-specific settings and actions such as deletion or duplication.
- *Canvas Bar*: For actions affecting the canvas or scene as a whole such as adding pages. This is an alternative place for actions such as zoom or redo/undo.
- *Navigation Bar*: Offers global actions such as undo/redo, zoom controls, and access to export options.

Learn more about interacting with and customizing the photo editor UI in our design editor UI guide.

### CreativeEngine

At the heart of CE.SDK is the CreativeEngine, which powers all rendering and design manipulation tasks.

It can be used in headless mode or in combination with the CreativeEditor UI.

Key features and APIs provided by CreativeEngine include:

- **Scene Management:** Create, load, save, and manipulate design scenes programmatically.
- **Block Manipulation:** Create and manage elements such as images, text, and shapes within the scene.
- **Asset Management:** Load and manage assets like images and SVGs from URLs or local sources.
- **Variable Management:** Define and manipulate variables for dynamic content within scenes.
- **Event Handling:** Subscribe to events such as block creation or selection changes for dynamic interaction.

## API Overview

CE.SDK’s APIs are organized into several categories, each addressing different aspects of scene and content management.

The engine API is relevant if you want to programmatically manipulate images to create or modify them at scale.

[Scene API:](./concepts/scenes.md)- **Creating and Loading
Scenes**:

```jsx
engine.scene.create();
engine.scene.loadFromURL(url);
```

- **Zoom Control**:

  ```jsx
  engine.scene.setZoomLevel(1.0);
  engine.scene.zoomToBlock(blockId);
  ```

````

<Link id="90241e">**Block API:**</Link>- **Creating Blocks**:

```jsx
const block = engine.block.create('shapes/rectangle');
````

- **Setting Properties**:

  ```jsx
  engine.block.setColor(blockId, 'fill/color', { r: 1, g: 0, b: 0, a: 1 });
  engine.block.setString(blockId, 'text/content', 'Hello World');
  ```

````

- **Querying Properties**:

  ```jsx
  const color = engine.block.getColor(blockId, 'fill/color');
  const text = engine.block.getString(blockId, 'text/content');
  
````

[Variable API:](./create-templates/add-dynamic-content/text-variables.md)- **Managing Variables**:

```jsx
engine.variable.setString('myVariable', 'value');
const value = engine.variable.getString('myVariable');
```

[Asset API:](./import-media/concepts.md)- **Managing Assets**:

```jsx
engine.asset.add('image', 'https://example.com/image.png');
```

[Event API:](./concepts/events.md)- **Subscribing to Events**:

```jsx
engine.scene.onActiveChanged(() => {
  const newActiveScene = engine.scene.get();
});
```

### Basic Automation Example

The following automation example shows how to turn an image block into a square format for a platform such as Instagram.

```jsx
// Assuming you have an initialized engine and a selected block (which is an image block)

// Example dimensions
const newWidth = 1080; // Width in pixels
const newHeight = 1080; // Height in pixels

// Get the ID of the image block you want to resize
const imageBlockId = engine.block.findByType('image')[0];

// Resize the image block
engine.block.setWidth(imageBlockId, newWidth);
engine.block.setHeight(imageBlockId, newHeight);

// Optionally, you can ensure the content fills the new dimensions
engine.block.setContentFillMode(imageBlockId, 'Cover');
```

## Customizing the CE.SDK Photo Editor

CE.SDK provides extensive customization options, allowing you to tailor the UI and functionality to meet your specific needs.

This can range from basic configuration settings to more advanced customizations involving callbacks and custom elements.

### Basic Customizations

- **Configuration Object:** Customize the editor’s appearance and functionality by passing a configuration object during initialization.

  ```jsx
  const config = {
    baseURL:
      'https://cdn.img.ly/packages/imgly/cesdk-engine/$UBQ_VERSION$/assets',
    // license: 'YOUR_CESDK_LICENSE_KEY',
  };
  ```

````

- **Localization:** Adjust the editor’s language and labels to support different locales.

  ```jsx
  const config = {};

  CreativeEditorSDK.create('#cesdk_container', config).then(async cesdk => {
    // Set theme using the UI API
    cesdk.ui.setTheme('light'); // 'dark' | 'system'
    cesdk.i18n.setLocale('en');

    cesdk.i18n.setTranslations({
      en: {
        'libraries.ly.img.insert.text.label': 'Add Caption',
      },
    });
  });
  
````

- **Custom Asset Sources:** Serve custom sticker or shape assets from a remote URL.

### UI Customization Options

- **Theme:** Choose between 'dark' or 'light' themes.

  ```jsx
  CreativeEditorSDK.create('#cesdk_container', config).then(async cesdk => {
    // Set theme using the UI API
    cesdk.ui.setTheme('dark'); // 'light' | 'system'
  });
  ```

````

- **UI Components:** Enable or disable specific UI components as per your application’s needs.

  ```jsx
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

For deeper customization, [explore the range of APIs](./user-interface.md) available for extending the functionality of the photo editor.

You can customize the order of components, add new UI elements, and even develop your own plugins to introduce new features.

## Plugins

For cases where encapsulating functionality for reuse is necessary, plugins provide an effective solution.

Use our [guide on building plugins](./user-interface/ui-extensions/add-custom-feature.md) to get started, or explore existing plugins like **Background Removal** and **Vectorizer**.

<CallToAction />

<LogoWall />



---

## More Resources

- **[Vanilla JS Documentation Index](https://img.ly/js.md)** - Browse all Vanilla JS documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./js.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support