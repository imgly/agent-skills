> This is one page of the CE.SDK React Native documentation. For a complete overview, see the [React Native Documentation Index](https://img.ly/docs/cesdk/react-native/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/react-native/llms-full.txt).

**Navigation:** [Solutions](../prebuilt-solutions.md) > [Video Editor](./video-editor.md)

---

Rich video and editing experiences can be created directly within your React
Native applications with the help of the React Native Mobile Video Editor SDK.

React Native, with its ability to create cross-platform applications from a single codebase, is a perfect match for IMG.LY's CreativeEditor SDK. Whether your app targets social media, marketing, or eCommerce, implementing a video editor gives users a creative tool set and improves the whole experience.

[Explore Demo](https://img.ly/showcases/cesdk/video-ui/ios)

[View on GitHub](https://github.com/imgly/cesdk-react-native-examples/tree/main/showcases/guides/editor-guides-solutions-video-editor)

<ImageContainer image="true" />

<br />

## Key Capabilities of the React Native Mobile Video Editor SDK

<CapabilityGrid
  features={[
  {
    title: 'Multi-Format Support',
    description:
      'Create videos in various formats, including story reels and Ultra HD, tailored for different channels like Instagram, TikTok, or custom formats.',
    imageId: 'transform',
  },
  {
    title: 'Templating',
    description:
      'Jumpstart your users designs with easily adaptable templates including text variables and placeholders.',
    imageId: 'templating',
  },
  {
    title: 'Asset Management',
    description:
      'Record, upload, or select pre-existing videos, images, and other media from a custom library to enrich video content.',
    imageId: 'asset-libraries',
  },
  {
    title: 'Advanced Editing Tools',
    description:
      'Utilize features such as adjustments, filters, effects, and blur to fine-tune each element or the entire video, delivering a professional finish.',
    imageId: 'empty',
  },
  {
    title: 'Timeline Management',
    description:
      'Arrange multiple video clips, images, text, stickers, and shapes on a timeline for precise control over the final output.',
    imageId: 'timeline',
  },
  {
    title: 'Audio Integration',
    description:
      'Enhance videos with audio tracks, either imported or selected from a custom asset library, to add another layer of creativity.',
    imageId: 'audio',
  },
  {
    title: 'Customizable UI',
    description:
      'Tailor the video editing interface to match your application’s branding and user experience needs, ensuring an intuitive and engaging experience.',
    imageId: 'customizable-u-i',
  },
  {
    title: 'Camera SDK',
    description:
      'Easily integrate with our Camera SDK for dual camera, timers and more',
    imageId: 'camera',
  },
]}
/>

## What is the Video Editor Solution?

The Video Editor is a prebuilt solution powered by the CreativeEditor SDK (CE.SDK) that enables fast integration of high-performance video editing into web, mobile, and desktop applications. It’s designed to help your users create professional-grade videos—from short social clips to long-form stories—directly within your app.

Skip building a video editor from scratch. This fully client-side solution provides a solid foundation with an extensible UI and a robust engine API to power video editing in any use case.

## Supported Platforms

Using a common graphics engine for both iOS and Android, React Native guarantees smooth performance on both of these platforms. This ensures uniform rendering across all platforms, compatible designs, and consistent functionality.

## Prerequisites

Make sure your environment satisfies the following requirements

- React Native: 0.73+
- iOS: 16+
- Swift: 6.3.1 (Xcode 26.4.1)
- Android: 7+

Add the `@imgly/editor-react-native` package to your project to get started.

## Supported Media Types

[IMG.LY](http://img.ly/)'s Creative Editor SDK enables you to load, edit, and save **MP4 files** directly on the device without server dependencies.

### Importing Media

| Category      | Supported Formats                                                  |
| ------------- | ------------------------------------------------------------------ |
| **Images**    | `.png`, `.apng`, `.jpeg`, `.jpg`, `.gif`, `.webp`, `.svg`, `.bmp`  |
| **Video**     | `.mp4` (H.264/AVC, H.265/HEVC), `.mov` (H.264/AVC, H.265/HEVC)     |
| **Audio**     | `.wav`, `.mp3`, `.m4a`, `.mp4` (AAC or MP3), `.mov` (AAC or MP3)   |
| **Animation** | `.json` (Lottie)                                                   |

Animated images (`.gif` and `.apng`) import as a static first frame in design
scenes and as a looping video fill in video scenes.

> **Note:** Need to import a format not listed here? CE.SDK allows you to create custom
> importers for any file type by using our Scene and Block APIs
> programmatically.

### Exporting Media

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

### Importing Templates

| Format   | Description                                                     |
| -------- | --------------------------------------------------------------- |
| `.idml`  | InDesign (via `@imgly/idml-importer`)                           |
| `.psd`   | Photoshop (via `@imgly/psd-importer`)                           |
| `.pdf`   | PDF (via `@imgly/pdf-importer`)                                 |
| `.pptx`  | PowerPoint (via `@imgly/pptx-importer`)                         |
| `.imgly` | CE.SDK Native (scene or archive, detected automatically)        |
| `.scene` | CE.SDK Native (scene extension)       |
| `.zip`   | CE.SDK Native (archive extension)     |

Non-native design files are converted into editable CE.SDK scenes by dedicated
importer packages rather than uploaded as media assets.

> **Note:** The `.idml`, `.psd`, `.pdf` and `.pptx` importers ship as separate packages
> that you install in addition to CE.SDK. These importer packages run only in
> the browser and in Node.js. They are not available on any other platform,
> including Android, iOS, Flutter and React Native.

> **Note:** Need to import a format not listed here? CE.SDK allows you to create custom
> importers for any file type by using our Scene and Block APIs to generate
> scenes programmatically.

For detailed information, see the [full file format support list](../file-format-support.md).

## Understanding CE.SDK Architecture & API

The following sections provide an overview of the key components of the CE.SDK video editor UI and its API architecture.

If you're ready to start integrating CE.SDK into your React Native application, check out our [Implementation Guide](./video-editor.md).

### CreativeEditor SDK Mobile Video UI

The CE.SDK video editor UI is a specific configuration of the CreativeEditor SDK, focusing on essential video editing features. It includes robust tools for video manipulation, customizable to suit different use cases. Key components include:

- **Canvas:** The main workspace where users interact with their video content.
- **Timeline:** Provides control over the sequence and duration of video clips, images, and audio tracks.
- **Tool Bar:** Provides essential editing options like adjustments, filters, effectsi, layer management or adding text or images in order of relevance.
- **Context Menu:** Presents relevant editing options for each selected element, simplifying the editing process for users.

Learn more about interacting with and customizing the video editor UI in our design editor UI guide.

### CreativeEngine

At the core of CE.SDK is the CreativeEngine, which handles all rendering and video manipulation tasks. It can be used in headless mode or alongside the CreativeEditor UI. Key features and APIs provided by CreativeEngine include:

- **Scene Management:** Create, load, save,
  and manipulate video scenes programmatically.
- **Block Management:** Manage video clips,
  images, text, and other elements within the timeline.
- **Asset Management:** Integrate and manage
  video, audio, and image assets from various sources.
- **Variable Management:** Define and
  manipulate variables for dynamic content within video scenes.
- **Event Handling:** Subscribe to events
  like clip selection changes or timeline updates for dynamic interaction.

## Customizing the React Native Mobile Video Editor

CE.SDK provides extensive customization options, allowing you to tailor the UI and functionality to meet your specific needs. This can range from basic configuration settings to more advanced customizations involving callbacks and custom elements.

### Basic Customizations

Configure the editor by passing a configuration object during initialization:

```typescript
const settings = new EditorSettingsModel({ license: 'YOUR_LICENSE_KEY' });
```

Explore further customization options by visiting the [configuration guide.](../user-interface/customization.md)

## Framework Support

CreativeEditor SDK’s video editor is compatible with React Native, making it easy to integrate into your application.

<CallToAction />

<LogoWall />



---

## More Resources

- **[React Native Documentation Index](https://img.ly/docs/cesdk/react-native/)** - Browse all React Native documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/react-native/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/react-native/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support