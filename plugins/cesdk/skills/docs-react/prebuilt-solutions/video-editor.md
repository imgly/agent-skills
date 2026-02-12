> This is one page of the CE.SDK React documentation. For a complete overview, see the [React Documentation Index](https://img.ly/react.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Solutions](./prebuilt-solutions.md) > [Video Editor](./prebuilt-solutions/video-editor.md)

---

CreativeEditor SDK offers a comprehensive React library designed for creating
and editing videos directly within the browser.

This CE.SDK configuration is highly customizable and extendible, offering a complete suite of video editing features such as splitting, cropping, and composing clips on a timeline.

[Launch Web Demo](https://img.ly/showcases/cesdk/video-ui/web)

[View on GitHub](https://github.com/imgly/cesdk-web-examples/tree/main/showcase-video-ui/src/components/case/CaseComponent.jsx)

## Key Capabilities of the React Video Editor SDK

<CapabilityGrid
  features={[
  {
    title: 'Transform',
    description: 'Perform video cropping, flipping, and rotating operations.',
    imageId: 'transform',
  },
  {
    title: 'Trim & Split',
    description: 'Set start and end times, and split videos effortlessly.',
    imageId: 'trim-split',
  },
  {
    title: 'Merge Videos',
    description:
      'Edit and merge multiple video clips into a single sequence.',
    imageId: 'merge-videos',
  },
  {
    title: 'Video Collage',
    description: 'Arrange multiple clips on a single canvas.',
    imageId: 'video-collage',
  },
  {
    title: 'Client-Side Processing',
    description:
      'All video editing operations are executed directly in the browser, without server dependencies.',
    imageId: 'client-side',
  },
  {
    title: 'Headless & Automation',
    description:
      'Programmatically edit videos within your React application.',
    imageId: 'headless',
  },
  {
    title: 'Extendible',
    description:
      'Easily add new functionalities using the plugins and engine API.',
    imageId: 'extendible',
  },
  {
    title: 'Customizable UI',
    description:
      "Build and integrate custom UIs tailored to your application\'s needs.",
    imageId: 'customizable-u-i',
  },
  {
    title: 'Asset Libraries',
    description:
      'Integrate custom assets like filters, stickers, images, and videos.',
    imageId: 'asset-libraries',
  },
  {
    title: 'Green Screen Support',
    description: 'Utilize chroma keying for background removal.',
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

## Browser Support

Video editing mode relies on modern web codecs, which are currently only available in the latest versions of Google Chrome, Microsoft Edge, or other Chromium-based browsers.

## Prerequisites

[Get the latest stable version of **Node.js & NPM**](https://www.npmjs.com/get-npm)

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

The following sections provide an overview of the key components of the CE.SDK video editor UI and its API architecture.

If you're ready to start integrating CE.SDK into your React application, check out our [Getting Started guide](./get-started/overview.md) or dive into the [Essential Guides](./guides.md).

### CreativeEditor Video UI

The CE.SDK video UI is built for intuitive video creation and editing. Here are the main components and customizable elements within the UI:

![](https://img.ly/docs/cesdk/./assets/Simple-Timeline-Mono.png)

- **Canvas:** The core interaction area for video content.
- **Dock:** Entry point for interactions not directly related to the selected video block, often used for accessing asset libraries.
- **Canvas Menu:** Access block-specific settings like duplication or deletion.
- **Inspector Bar:** Manage block-specific functionalities, such as adjusting properties of the selected block.
- **Navigation Bar:** Handles global scene actions like undo/redo and zoom.
- **Canvas Bar:** Provides tools for managing the overall canvas, such as adding pages or controlling zoom.
- **Timeline:** Core video editing control, where clips and audio are arranged in time.

### CreativeEngine

CreativeEngine is the heart of CE.SDK, managing the rendering and manipulation of video scenes. It can be used in headless mode or integrated with the CreativeEditor UI. Below are key features and APIs provided by the CreativeEngine:

- **Scene Management:** Create, load, save, and modify video scenes programmatically.
- **Block Manipulation:** Create and manage video elements, such as shapes, text, and images.
- **Asset Management:** Load assets like videos and images from URLs or local sources.
- **Variable Management:** Define and manipulate variables within scenes for dynamic content.
- **Event Handling:** Subscribe to events like block creation or updates for dynamic interaction.

## API Overview

The APIs of CE.SDK are grouped into several categories, reflecting different aspects of scene management and manipulation.

[Scene API:](./concepts/scenes.md)- **Creating and Loading Scenes**:
[Block API:](./concepts/blocks.md)- **Creating Blocks**: - **Setting
Properties**: - **Querying Properties**:
[Variable API:](./create-templates/add-dynamic-content/text-variables.md)
Variables allow dynamic content within scenes to programmatically create
variations of a design. - **Managing Variables**:
[Asset API:](./import-media/concepts.md)- **Managing Assets**:
[Event API:](./concepts/events.md)- **Subscribing to Events**:

## Customizing the React Video Editor

CE.SDK provides extensive customization options to adapt the UI to various use cases. These options range from simple configuration changes to more advanced customizations involving callbacks and custom elements.

### Basic Customizations

- **Configuration Object**: When initializing the CreativeEditor, you can pass a configuration object that defines basic settings such as the base URL for assets, the language, theme, and license key.

- **Localization**: Customize the language and labels used in the editor to support different locales.

- [Custom Asset Sources](./import-media/concepts.md): Serve custom video or image
  assets from a remote URL.

### UI Customization Options

- **Theme**: Choose between predefined themes such as 'dark', 'light', or 'system'. Use `cesdk.ui.setTheme()` API to set themes.

- **UI Components**: Enable or disable specific UI components based on your requirements.

## Advanced Customizations

Learn more about extending editor functionality and customizing its UI to your use case by consulting our in-depth [customization guide](./user-interface/ui-extensions.md). Here is an overview of the APIs and components available to you.

### Order APIs

Customization of the web editor's components and their order within these locations is managed through the unified Component Order API using `setComponentOrder({ in: location }, order)`, allowing the addition, removal, or reordering of elements. These locations are configured with values like `'ly.img.dock'`, `'ly.img.canvas.menu'`, `'ly.img.inspector.bar'`, `'ly.img.navigation.bar'`, and `'ly.img.canvas.bar'`.

### Layout Components

CE.SDK provides special components for layout control, such as `ly.img.separator` for separating groups of components and `ly.img.spacer` for adding space between components.

### Registration of New Components

Custom components can be registered and integrated into the web editor using builder components like buttons, dropdowns, and inputs. These components can replace default ones or introduce new functionalities, deeply integrating custom logic into the editor.

### Feature API

The Feature API enables conditional display and functionality of components based on the current context, allowing for dynamic customization. For example, you can hide certain buttons for specific block types.

## Plugins

You can customize the CE.SDK web editor during its initialization using the APIs outlined above. For many use cases, this will be adequate. However, there are times when you might want to encapsulate functionality for reuse. This is where plugins become useful.

Follow our [guide on building your own plugins](./user-interface/ui-extensions.md) to learn more or check out one of the plugins we built using this api:

[Background Removal](./edit-image/remove-bg.md): Adds a button to the canvas
menu to remove image backgrounds.
[Vectorizer](./edit-image/vectorize.md): Adds a button to the canvas menu to
quickly vectorize a graphic.

## Framework Support

CreativeEditor SDK’s video editing library is compatible with any Javascript including, React, Angular, Vue.js, Svelte, Blazor, Next.js, Typescript. It is also compatible with desktop and server-side technologies such as electron, PHP, Laravel and Rails.

<CallToAction />

<LogoWall />



---

## More Resources

- **[React Documentation Index](https://img.ly/react.md)** - Browse all React documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./react.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support