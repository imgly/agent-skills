> This is one page of the CE.SDK Vanilla JS documentation. For a complete overview, see the [Vanilla JS Documentation Index](https://img.ly/js.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Solutions](./prebuilt-solutions.md) > [Video Editor](./prebuilt-solutions/video-editor.md)

---

CreativeEditor SDK is a Javascript library for creating and editing videos
directly in a browser.

This CE.SDK configuration is highly customizable and extendible and offers a well-rounded suite of video editing features such as splitting, cropping and composing clips on a timeline.

[Launch Web Demo](https://img.ly/showcases/cesdk/video-ui/web)

[View on GitHub](https://github.com/imgly/cesdk-web-examples/tree/main/showcase-video-ui/src/components/case/CaseComponent.jsx)

## Key Capabilities

<CapabilityGrid
  features={[
  {
    title: 'Transform',
    description: 'Crop, flip, and rotate video operations.',
    imageId: 'transform',
  },
  {
    title: 'Trim & Split',
    description: 'Set start and end time and split videos.',
    imageId: 'trim-split',
  },
  {
    title: 'Merge Videos',
    description:
      'Pick, edit and merge several video clips into a single sequence.',
    imageId: 'merge-videos',
  },
  {
    title: 'Video Collage',
    description: 'Arrange multiple clips on a single page.',
    imageId: 'video-collage',
  },
  {
    title: 'Client-Side Processing',
    description:
      'All video editing operations are performed by our engine in the browser.',
    imageId: 'client-side',
  },
  {
    title: 'Headless & Automation',
    description: 'Programmatically edit videos inside the browser.',
    imageId: 'headless',
  },
  {
    title: 'Extendible',
    description: 'Easily add functionality using the plugins & engine API.',
    imageId: 'extendible',
  },
  {
    title: 'Customizable UI',
    description: 'Build Custom UIs.',
    imageId: 'customizable-u-i',
  },
  {
    title: 'Asset Libraries',
    description:
      'Add custom assets for filters, stickers, images and videos.',
    imageId: 'asset-libraries',
  },
  {
    title: 'Green Screen',
    description: 'Utilize chroma keying for background removal.',
    imageId: 'green-screen',
  },
  {
    title: 'Templating',
    description:
      'Create role based design templates with placeholders and text variables.',
    imageId: 'templating',
  },
]}
/>

## What is the Video Editor Solution?

The Video Editor is a prebuilt solution powered by the CreativeEditor SDK (CE.SDK) that enables fast integration of high-performance video editing into web, mobile, and desktop applications. It’s designed to help your users create professional-grade videos—from short social clips to long-form stories—directly within your app.

Skip building a video editor from scratch. This fully client-side solution provides a solid foundation with an extensible UI and a robust engine API to power video editing in any use case.

## Browser Support

Video editing mode relies on modern web codecs, which are currently only available in the latest versions of Google Chrome, Microsoft Edge, or other Chromium-based browsers.

## Supported File Types

[IMG.LY](http://img.ly/)'s Creative Editor SDK enables you to load, edit, and save **MP4 files** directly in the browser without server dependencies.

### Importing Media

### Exporting Media

### Importing Templates

For detailed information, see the [full file format support list](./file-format-support.md).

## Getting Started

If you're ready to start integrating CE.SDK into your Vue.js application, check out the CE.SDK [Getting Started guide](./get-started/overview.md).
In order to configure the editor for a video editing use case consult our [video editor UI showcase](https://img.ly/showcases/cesdk/video-ui/web) and its [reference implementation](https://github.com/imgly/cesdk-web-examples/blob/main/showcase-video-ui/src/components/case/CaseComponent.jsx).

## Understanding CE.SDK Architecture & API

The following sections outline the fundamentals of CE.SDK’s video editor user interface and its technical architecture and APIs.
CE.SDK architecture is designed to facilitate the creation, manipulation, and rendering of complex designs.
At a high level, it consists of two main components: the CreativeEngine and the CreativeEditor UI.
The following is an overview of these components and how they are reflected at the API level.

If you are already familiar with CE.SDK and want to get started integrating CE.SDK video editor check out our “Getting Started” guide or jump ahead to the “Essential Guides” section.

### CreativeEditor Video UI

CE.SDK’s video UI is designed to facilitate intuitive manipulation and creation of a range of video-based designs.
The following are the key locations in the editor UI and extension points for your Ui customizations:
![](https://img.ly/docs/cesdk/./assets/Simple-Timeline-Mono.png)

- *Canvas*: The core interaction area for design content, controlled by the Creative Engine.
- *Dock*: The primary entry point for user interactions not directly related to the selected block. It is primarily, though not exclusively, used to open panels with asset libraries or add elements to the canvas. [Learn how to add demo videos in the dock.](./import-media.md)
- *Canvas Menu*: Provides block-specific settings and actions such as deletion or duplication.
- *Inspector Bar*: Main location for block-specific functionality. Any action or setting available for the currently selected block that does not appear in the canvas menu will be shown here.
- *Navigation Bar*: For actions affecting browser navigation and global scene effects such as zoom or undo/redo.
- *Canvas Bar*: For actions affecting the canvas or scene as a whole such as adding pages. This is an alternative place for actions such as zoom or redo/undo.
- *Timeline*: The timeline is the main control for video editing. It is here that clips and audio strips can be positioned in time.

### CreativeEngine

The CreativeEngine is the core of CE.SDK, responsible for handling the rendering and manipulation of designs.
It can be used independently (headless mode) or integrated with the CreativeEditor UI.
The CreativeEngine provides several APIs to interact with and manipulate scenes.
A scene is the visual context or environment within the CreativeEditor SDK where blocks (elements) are created, manipulated, and rendered.

### Key Features:

1. **Scene Management**:
   - Create, load, save, and [modify](./concepts/blocks.md) scenes.
   - Control the zoom and camera position within scenes.
2. **Block Manipulation**:
   - Blocks are the basic building units of a scene, representing elements like shapes, images, and text.
   - APIs to create, modify, and manage blocks.
   - Properties of blocks (e.g., color, position, size) can be queried and set using specific methods.
3. **Asset Management**:
   - Manage assets like images, videos, and fonts.
   - Load assets from URLs or local sources.
4. **Variable Management**:
   - Define and manipulate variables within scenes.
   - Useful for template-based designs where dynamic content is required.
5. **Event Handling**:
   - Subscribe to events related to block creation, updates, and destruction.
   - Manage user interactions and state changes.

## API Overview

The APIs of CE.SDK are grouped into several categories, reflecting different aspects of scene management and manipulation.

[Scene API :](./concepts/scenes.md)- **Creating and Loading
Scenes**: `jsx engine.scene.create(); engine.scene.loadFromURL(url); `

- **Zoom Control**:

```jsx
  engine.scene.setZoomLevel(1.0);
  engine.scene.zoomToBlock(blockId);
```

[Block API :](./concepts/blocks.md)- **Creating Blocks**: \`\`\`jsx
const block = engine.block.create('shapes/star');

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

<Link id="7ecb50">**Variable API :**</Link>
Variables allow dynamic content within scenes to programmatically create
variations of a design. - **Managing Variables**: ```jsx
engine.variable.setString('myVariable', 'value'); const value =
engine.variable.getString('myVariable'); 
````

**Asset API :**- **Managing Assets**:

```jsx
engine.asset.add('image', 'https://example.com/image.png');
```

[Event API :](./concepts/events.md)- **Subscribing to Events**:

```jsx
// Subscribe to scene changes
engine.scene.onActiveChanged(() => {
  const newActiveScene = engine.scene.get();
});

```

### Example Usage

Here is a simple example of initializing the CreativeEngine and creating a video scene with a text block:

```jsx
import CreativeEngine from 'https://cdn.img.ly/packages/imgly/cesdk-engine/$UBQ_VERSION$/index.js';

const config = {
  baseURL:
    'https://cdn.img.ly/packages/imgly/cesdk-engine/$UBQ_VERSION$/assets',
};

CreativeEngine.init(config).then(async engine => {
  // Create a new scene
  await engine.scene.createVideo();

  // Add a text block
  const textBlock = engine.block.create('text');
  engine.block.setString(textBlock, 'text/content', 'Hello, CE.SDK!');

  // Set the color of the text
  engine.block.setColor(textBlock, 'fill/color', { r: 0, g: 0, b: 0, a: 1 });

  // Attach the engine canvas to the DOM
  document.getElementById('cesdk_container').append(engine.element);
});
```

This example demonstrates how to initialize the CreativeEngine, create a scene, add a text block, and set its properties.
The flexibility of the APIs allows for extensive customization and automation of design workflows.
To learn more about how to power your own UI or creative workflows with the CreativeEngine have a look at the [engine guides](./guides.md).

### Customization Options

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
  ```

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
  
````

- [Custom Asset Sources](./import-media/concepts.md): Serve custom video
  or image assets from a remote URL.

### UI Customization Options

- **Theme**: Choose between predefined themes such as 'dark', 'light', or 'system'.

  ```jsx
  CreativeEditorSDK.create('#cesdk_container', config).then(async cesdk => {
    // Set theme using the UI API
    cesdk.ui.setTheme('dark'); // 'light' | 'system'
  });
  ```

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
  
````

### Advanced Customizations

Learn more about extending editor functionality and customizing its UI to your use case by consulting our in-depth [customization guide](./user-interface/ui-extensions.md).
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

You can customize the CE.SDK web editor during its initialization using the APIs outlined above.
For many use cases, this will be adequate.
However, there are times when you might want to encapsulate functionality for reuse.
This is where plugins become useful.
Follow our [guide on building your own plugins](./user-interface/ui-extensions.md) to learn more or check out one of the plugins we built using this api:

[Background Removal](./edit-image/remove-bg.md): Adds a button to the
canvas menu to remove image backgrounds.
[Vectorizer](./edit-image/vectorize.md): Adds a button to the canvas
menu to quickly vectorize a graphic.

## Framework Support

CreativeEditor SDK’s video editing library is compatible with any Javascript including, React, Angular, Vue.js, Svelte, Blazor, Next.js, Typescript.
It is also compatible with desktop and server-side technologies such as electron, PHP, Laravel and Rails.

<CallToAction />

<LogoWall />



---

## More Resources

- **[Vanilla JS Documentation Index](https://img.ly/js.md)** - Browse all Vanilla JS documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./js.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support