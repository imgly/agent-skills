> This is one page of the CE.SDK Electron documentation. For a complete overview, see the [Electron Documentation Index](https://img.ly/electron.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Solutions](./prebuilt-solutions.md) > [Video Editor](./prebuilt-solutions/video-editor.md)

---

This CE.SDK configuration is highly customizable and extendible, offering a full suite of video editing features such as splitting, cropping, and composing clips on a timeline.

[Launch Web Demo](https://img.ly/showcases/cesdk/video-ui/web)

[View on GitHub](https://github.com/imgly/cesdk-web-examples/tree/main/showcase-video-ui/src/components/case/CaseComponent.jsx)

## Key Capabilities of the Electron Video Editor SDK

<CapabilityGrid
  features={[
  {
    title: 'Transform',
    description:
      'Perform operations like video cropping, flipping, and rotating.',
    imageId: 'transform',
  },
  {
    title: 'Trim & Split',
    description:
      'Easily set start and end times, and split videos as needed.',
    imageId: 'trim-split',
  },
  {
    title: 'Merge Videos',
    description:
      'Edit and combine multiple video clips into a single sequence.',
    imageId: 'merge-videos',
  },
  {
    title: 'Video Collage',
    description: 'Arrange multiple clips on one canvas.',
    imageId: 'video-collage',
  },
  {
    title: 'Client-Side Processing',
    description:
      'Execute all video editing operations directly in the browser, with no need for server dependencies.',
    imageId: 'client-side',
  },
  {
    title: 'Headless & Automation',
    description:
      'Programmatically edit videos within your Electron application.',
    imageId: 'headless',
  },
  {
    title: 'Extendible',
    description:
      'Add new functionalities seamlessly using the plugins and engine API.',
    imageId: 'extendible',
  },
  {
    title: 'Customizable UI',
    description:
      'Design and integrate custom UIs tailored to your application.',
    imageId: 'customizable-u-i',
  },
  {
    title: 'Asset Libraries',
    description:
      'Incorporate custom assets like filters, stickers, images, and videos.',
    imageId: 'asset-libraries',
  },
  {
    title: 'Green Screen Support',
    description: 'Apply chroma keying for background removal.',
    imageId: 'green-screen',
  },
  {
    title: 'Templating',
    description:
      'Create design templates with placeholders and text variables for dynamic content.',
    imageId: 'templating',
  },
]}
/>

## What is the Video Editor Solution?

The Video Editor is a prebuilt solution powered by the CreativeEditor SDK (CE.SDK) that enables fast integration of high-performance video editing into web, mobile, and desktop applications. It’s designed to help your users create professional-grade videos—from short social clips to long-form stories—directly within your app.

Skip building a video editor from scratch. This fully client-side solution provides a solid foundation with an extensible UI and a robust engine API to power video editing in any use case.

## Supported File Types

Creative Editor SDK supports loading, editing, and saving **MP4 files** directly in the browser.

### Importing Media

### Exporting Media

### Importing Templates

For detailed information, see the [full file format support list](./file-format-support.md).

## Getting Started

If you're ready to start integrating CE.SDK into your Electron application, check out the CE.SDK [Getting Started guide](./get-started/overview.md).
In order to configure the editor for a video editing use case consult our [video editor UI showcase](https://img.ly/showcases/cesdk/video-ui/web) and its [reference implementation](https://github.com/imgly/cesdk-web-examples/blob/main/showcase-video-ui/src/components/case/CaseComponent.jsx).

## Understanding CE.SDK Architecture & API

The sections below provide an overview of the key components of the CE.SDK video editor UI and its API architecture.

If you're ready to start integrating CE.SDK into your Electron application, check out our [Getting Started guide](./get-started/overview.md) or explore the [Essential Guides](./guides.md).

### CreativeEditor Video UI

The CE.SDK video UI is designed for intuitive video creation and editing.
Below are the main components and customizable elements within the UI:
![](https://img.ly/docs/cesdk/./assets/Simple-Timeline-Mono.png)

- **Canvas:** The main interaction area for video content.
- **Dock:** Entry point for interactions not directly related to the selected video block, often used for accessing asset libraries.
- **Canvas Menu:** Access block-specific settings such as duplication or deletion.
- **Inspector Bar:** Manage block-specific functionalities, like adjusting properties of the selected block.
- **Navigation Bar:** Handles global scene actions like undo/redo and zoom.
- **Canvas Bar:** Provides tools for managing the overall canvas, such as adding pages or controlling zoom.
- **Timeline:** The core video editing control, where clips and audio are arranged over time.

### CreativeEngine

CreativeEngine is the core of CE.SDK, responsible for managing the rendering and manipulation of video scenes.
It can be used in headless mode or integrated with the CreativeEditor UI.
Below are key features and APIs provided by the CreativeEngine:

- **Scene Management:** Programmatically create, load, save, and modify video scenes.
- **Block Manipulation:** Create and manage video elements such as shapes, text, and images.
- **Asset Management:** Load assets like videos and images from URLs or local sources.
- **Variable Management:** Define and manipulate variables within scenes for dynamic content.
- **Event Handling:** Subscribe to events such as block creation or updates for dynamic interaction.

## API Overview

The APIs of CE.SDK are grouped into several categories, reflecting different aspects of scene management and manipulation.

[Scene API:](./concepts/scenes.md)- **Creating and Loading Scenes**:

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

  <Link id="90241e">**Block API:**</Link>

- **Creating Blocks**:

  ```jsx
  const block = engine.block.create('shapes/star');
  
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

[Variable API:](./create-templates/add-dynamic-content/text-variables.md)
Variables allow dynamic content within scenes to programmatically create
variations of a design.

- **Managing Variables**:

  ```jsx
  engine.variable.setString('myVariable', 'value');
  const value = engine.variable.getString('myVariable');
  ```

````

  <Link id="5e6197">**Asset API:**</Link>

- **Managing Assets**:

  ```jsx
  engine.asset.add('image', 'https://example.com/image.png');
  
````

[Event API](./concepts/events.md)

- **Subscribing to Events**:

  ```jsx
  // Subscribe to scene changes
  engine.scene.onActiveChanged(() => {
    const newActiveScene = engine.scene.get();
  });
  ```

````

## Customizing the Electron Video Editor

CE.SDK provides extensive customization options to adapt the UI to various use cases.
These options range from simple configuration changes to more advanced customizations involving callbacks and custom elements.

### Basic Customizations

- **Configuration Object**: When initializing the CreativeEditor, you can pass a configuration object that defines basic settings such as the base URL for assets, the language, theme, and license key.

  ```jsx
  const config = {
    baseURL:
      'https://cdn.img.ly/packages/imgly/cesdk-engine/$UBQ_VERSION$/assets',
    // license: 'YOUR_CESDK_LICENSE_KEY',
  };
  
````

- **Localization**: Customize the language and labels used in the editor to support different locales.

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

````

- <Link id="5e6197">Custom Asset Sources</Link>: Serve custom video or image
  assets from a remote URL.

### UI Customization Options

- **Theme**: Choose between predefined themes such as 'dark', 'light', or 'system'.

  ```jsx
  CreativeEditorSDK.create('#cesdk_container', config).then(async cesdk => {
    // Set theme using the UI API
    cesdk.ui.setTheme('dark'); // 'light' | 'system'
  });
  
````

- **UI Components**: Enable or disable specific UI components based on your requirements.

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

```

## Advanced Customizations

Learn more about extending editor functionality and customizing its UI to your use case by consulting our in-depth <Link id="d194d1">customization guide</Link>.
Here is an overview of the APIs and components available to you.

### Order APIs

Customization of the web editor's components and their order within these locations is managed through the unified Component Order API using `setComponentOrder({ in: location }, order)`, allowing the addition, removal, or reordering of elements.
These locations are configured with values like `'ly.img.dock'`, `'ly.img.canvas.menu'`, `'ly.img.inspector.bar'`, `'ly.img.navigation.bar'`, and `'ly.img.canvas.bar'`.

### Layout Components

CE.SDK provides special components for layout control, such as `ly.img.separator` for separating groups of components and `ly.img.spacer` for adding space between components.

### Registration of New Components

Custom components can be registered and integrated into the web editor using builder components like buttons, dropdowns, and inputs.
These components can replace default ones or introduce new functionalities, deeply integrating custom logic into the editor.

### Feature API

The Feature API enables conditional display and functionality of components based on the current context, allowing for dynamic customization.
For example, you can hide certain buttons for specific block types.

## Plugins

Customize the CE.SDK web editor during initialization using the outlined APIs.
For many use cases, this is sufficient, but for more advanced scenarios, plugins are useful.
Follow our <Link id="2a26b6">guide on building plugins</Link> or explore existing plugins like:

<Link id="9dfcf7">**Background Removal**</Link>: Adds a button to the canvas
menu to remove image backgrounds.
<Link id="2b4c7f">**Vectorizer**</Link>: Adds a button to the canvas menu to
quickly vectorize a graphic.

<CallToAction />
<LogoWall />
```



---

## More Resources

- **[Electron Documentation Index](https://img.ly/electron.md)** - Browse all Electron documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./electron.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support