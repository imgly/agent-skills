> This is one page of the CE.SDK Electron documentation. For a complete overview, see the [Electron Documentation Index](https://img.ly/docs/cesdk/electron.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Starter Kits](./starterkits.md) > [Video Editing](./starterkits/video-editing.md) > [Video Captions](./starterkits/video-captions.md)

---

Enhance video creation by importing, customizing, and styling captions directly within the editor.

![Design Editor starter kit showing a professional design editing interface](https://img.ly/docs/cesdk/./assets/browser.hero.webp)

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/starterkit-video-captions-react-web/archive/refs/tags/release-$UBQ_VERSION$.zip)
>
> - [View source on GitHub](https://github.com/imgly/starterkit-video-captions-react-web/tree/v$UBQ_VERSION$)
>
> - [Open in StackBlitz](https://stackblitz.com/github/imgly/starterkit-video-captions-react-web/tree/v$UBQ_VERSION$)
>
> - [Live demo](https://img.ly/docs/cesdk/examples/starterkit-video-captions/)

***

## Prerequisites

Before you begin, make sure you have the following:

- **Node.js v20+** and npm installed locally – [Download Node.js](https://nodejs.org/)
- A **supported browser** – Chrome 114+, Edge 114+, Firefox 115+, Safari 15.6+<br />
  See [Browser Support](./browser-support.md) for the full list.

***

<Tabs syncKey="project-type">
  <TabItem label="New Project">
    ## Get Started

    Start fresh with a standalone Video Captions project. This creates a complete, ready-to-run application.

    ## Step 1: Clone the Repository

    <TerminalTabs>
      <TerminalTab label="git">
        git clone https://github.com/imgly/starterkit-video-captions-react-web.git
      </TerminalTab>

      <TerminalTab label="degit">
        npx degit imgly/starterkit-video-captions-react-web starterkit-video-captions-react-web
      </TerminalTab>
    </TerminalTabs>

    The `src/` folder contains the editor code:

    ```
    src/
    ├── app/                          # Demo application
    ├── imgly/
    │   ├── config/
    │   │   ├── actions.ts                # Export/import actions
    │   │   ├── features.ts               # Feature toggles
    │   │   ├── i18n.ts                   # Translations
    │   │   ├── plugin.ts                 # Main configuration plugin
    │   │   ├── settings.ts               # Engine settings
    │   │   └── ui/
    │   │       ├── canvas.ts                 # Canvas configuration
    │   │       ├── components.ts             # Custom component registration
    │   │       ├── dock.ts                   # Dock layout configuration
    │   │       ├── index.ts                  # Combines UI customization exports
    │   │       ├── inspectorBar.ts           # Inspector bar layout
    │   │       ├── navigationBar.ts          # Navigation bar layout
    │   │       └── panel.ts                  # Panel configuration
    │   ├── index.ts                  # Editor initialization function
    │   └── plugins/
    │       └── auto-caption.ts
    └── index.tsx                 # Application entry point
    ```

    ## Step 2: Install Dependencies

    Install the required packages:

    <TerminalTabs syncKey="package-manager">
      <TerminalTab label="npm">
        cd starterkit-video-captions-react-web
        npm install
      </TerminalTab>

      <TerminalTab label="pnpm">
        cd starterkit-video-captions-react-web
        pnpm install
      </TerminalTab>

      <TerminalTab label="yarn">
        cd starterkit-video-captions-react-web
        yarn
      </TerminalTab>
    </TerminalTabs>

    ## Step 3: Download Assets

    CE.SDK requires engine assets (fonts, icons, UI elements) to function. These must be served as static files from your project's `public/` directory.

    <TerminalTabs>
      <TerminalTab label="Download">
        curl -O https://cdn.img.ly/packages/imgly/cesdk-js/$UBQ\_VERSION$/imgly-assets.zip
        unzip imgly-assets.zip -d public/
        rm imgly-assets.zip
      </TerminalTab>
    </TerminalTabs>

    > **Asset Configuration:** The starter kit is pre-configured to load assets from `/assets`. If you place assets in a different location, update the `baseURL` in `src/index.tsx`.

    ```typescript title="src/index.tsx"
    const config = {
      // ...
      baseURL: '/assets'
      // ...
    };
    ```

    ## Step 4: Run the Development Server

    <TerminalTabs syncKey="package-manager">
      <TerminalTab label="npm">
        npm run dev
      </TerminalTab>

      <TerminalTab label="pnpm">
        pnpm run dev
      </TerminalTab>

      <TerminalTab label="yarn">
        yarn dev
      </TerminalTab>
    </TerminalTabs>

    Open `http://localhost:5173` in your browser.
  </TabItem>

  <TabItem label="Existing Project">
    ## Get Started

    Integrate the Video Captions into an existing Electron application. This adds the editor configuration to your current project structure.

    ## Step 1: Clone

    <TerminalTabs>
      <TerminalTab label="Navigate">cd your-project</TerminalTab>
    </TerminalTabs>

    Clone the starter kit and copy the editor configuration to your project:

    <TerminalTabs>
      <TerminalTab label="git">
        git clone https://github.com/imgly/starterkit-video-captions-react-web.git
        cp -r starterkit-video-captions-react-web/src/imgly ./src/imgly
        rm -rf starterkit-video-captions-react-web
      </TerminalTab>

      <TerminalTab label="degit">
        npx degit imgly/starterkit-video-captions-react-web/src/imgly ./src/imgly
      </TerminalTab>
    </TerminalTabs>

    > **Adjust Path:** The default destination is `./src/imgly`. Adjust the path to match your
    > project structure.

    The `imgly/` folder contains the editor configuration:

    ```
    imgly/
    ├── config/
    │   ├── actions.ts                # Export/import actions
    │   ├── features.ts               # Feature toggles
    │   ├── i18n.ts                   # Translations
    │   ├── plugin.ts                 # Main configuration plugin
    │   ├── settings.ts               # Engine settings
    │   └── ui/
    │       ├── canvas.ts                 # Canvas configuration
    │       ├── components.ts             # Custom component registration
    │       ├── dock.ts                   # Dock layout configuration
    │       ├── index.ts                  # Combines UI customization exports
    │       ├── inspectorBar.ts           # Inspector bar layout
    │       ├── navigationBar.ts          # Navigation bar layout
    │       └── panel.ts                  # Panel configuration
    ├── index.ts                  # Editor initialization function
    └── plugins/
        └── auto-caption.ts
    ```

    ## Step 2: Install Dependencies

    Install the required packages for the editor:

    ### Core Editor

    Install the Creative Editor SDK:

    <TerminalTabs syncKey="package-manager">
      <TerminalTab label="npm">npm install @cesdk/cesdk-js@$UBQ\_VERSION$</TerminalTab>
      <TerminalTab label="pnpm">pnpm add @cesdk/cesdk-js@$UBQ\_VERSION$</TerminalTab>
      <TerminalTab label="yarn">yarn add @cesdk/cesdk-js@$UBQ\_VERSION$</TerminalTab>
    </TerminalTabs>

    ### Autocaption Plugin

    Add AI-powered autocaption generation:

    <TerminalTabs syncKey="package-manager">
      <TerminalTab label="npm">
        npm install @imgly/plugin-autocaption-web@$UBQ\_VERSION$
      </TerminalTab>

      <TerminalTab label="pnpm">
        pnpm add @imgly/plugin-autocaption-web@$UBQ\_VERSION$
      </TerminalTab>

      <TerminalTab label="yarn">
        yarn add @imgly/plugin-autocaption-web@$UBQ\_VERSION$
      </TerminalTab>
    </TerminalTabs>

    ## Step 3: Download Assets

    CE.SDK requires engine assets (fonts, icons, UI elements) to function. For Electron projects, place these in your `public/` directory which is served automatically.

    <TerminalTabs>
      <TerminalTab label="Download">
        curl -O https://cdn.img.ly/packages/imgly/cesdk-js/$UBQ\_VERSION$/imgly-assets.zip
        unzip imgly-assets.zip -d public/
        rm imgly-assets.zip
      </TerminalTab>
    </TerminalTabs>

    > **Asset Configuration:** The starter kit is pre-configured to load assets from `/assets`. If you place
    > assets in a different location, update the `baseURL` in Step 4: Create the
    > Editor Component.

    ## Step 4: Add a Container Element

    Add a container element to your renderer HTML where the editor will be mounted:

    ```html
    <div id="cesdk_container" style="width: 100%; height: 100vh;"></div>
    ```

    ## Step 5: Initialize the Editor

    Choose your editing mode and initialize the editor accordingly:

    <Tabs syncKey="editor-mode">
      <TabItem label="Autocaption">
        ```typescript title="src/index.ts"
        import CreativeEditorSDK from '@cesdk/cesdk-js';

        import { initVideoCaptionsAutocaptionEditor } from './imgly';

        const config = {
          userId: 'your-user-id',
          baseURL: '/assets'
          // license: 'YOUR_LICENSE_KEY',
        };

        CreativeEditorSDK.create('#cesdk_container', config)
          .then(async (cesdk) => {
            await initVideoCaptionsAutocaptionEditor(cesdk);
          })
          .catch((error) => {
            console.error('Failed to initialize CE.SDK:', error);
          });
        ```
      </TabItem>

      <TabItem label="Blank">
        ```typescript title="src/index.ts"
        import CreativeEditorSDK from '@cesdk/cesdk-js';

        import { initVideoCaptionsBlankEditor } from './imgly';

        const config = {
          userId: 'your-user-id',
          baseURL: '/assets'
          // license: 'YOUR_LICENSE_KEY',
        };

        CreativeEditorSDK.create('#cesdk_container', config)
          .then(async (cesdk) => {
            await initVideoCaptionsBlankEditor(cesdk);
          })
          .catch((error) => {
            console.error('Failed to initialize CE.SDK:', error);
          });
        ```
      </TabItem>

      <TabItem label="Import">
        ```typescript title="src/index.ts"
        import CreativeEditorSDK from '@cesdk/cesdk-js';

        import { initVideoCaptionsImportEditor } from './imgly';

        const config = {
          userId: 'your-user-id',
          baseURL: '/assets'
          // license: 'YOUR_LICENSE_KEY',
        };

        CreativeEditorSDK.create('#cesdk_container', config)
          .then(async (cesdk) => {
            await initVideoCaptionsImportEditor(cesdk);
          })
          .catch((error) => {
            console.error('Failed to initialize CE.SDK:', error);
          });
        ```
      </TabItem>

      <TabItem label="Pre-captioned">
        ```typescript title="src/index.ts"
        import CreativeEditorSDK from '@cesdk/cesdk-js';

        import { initVideoCaptionsPreCaptionedEditor } from './imgly';

        const config = {
          userId: 'your-user-id',
          baseURL: '/assets'
          // license: 'YOUR_LICENSE_KEY',
        };

        CreativeEditorSDK.create('#cesdk_container', config)
          .then(async (cesdk) => {
            await initVideoCaptionsPreCaptionedEditor(cesdk);
          })
          .catch((error) => {
            console.error('Failed to initialize CE.SDK:', error);
          });
        ```
      </TabItem>
    </Tabs>
  </TabItem>
</Tabs>

## Caption Modes

The Video Captions starter kit supports four distinct workflows for working with video captions:

### Autocaption Mode

Auto-generate captions using AI-powered speech-to-text transcription with ElevenLabs Scribe V2:

```typescript title="src/index.ts"
await initVideoCaptionsAutocaptionEditor(cesdk);
```

This mode:

- Loads a video with audio ready for transcription
- Integrates the `@imgly/plugin-autocaption-web` plugin
- Configures the ElevenLabs Scribe V2 provider via fal.ai proxy
- Automatically transcribes speech and generates styled captions
- Opens the caption inspector panel for editing

**Prerequisites:**

- fal.ai API key configured in `VITE_AUTOCAPTION_PROXY_URL` environment variable
- Default proxy: `https://proxy.img.ly/api/proxy/falai`

### Blank Mode

Start with an empty video canvas for manual caption creation:

```typescript title="src/index.ts"
await initVideoCaptionsBlankEditor(cesdk);
```

This mode:

- Creates a new blank video scene (1280x720)
- Lets you import your own videos
- Manually create and style captions from scratch
- No AI processing required

### Import Mode

Import existing SRT subtitle files and edit them:

```typescript title="src/index.ts"
await initVideoCaptionsImportEditor(cesdk);
```

This mode:

- Loads a video for caption placement
- Allows importing SRT files with existing captions
- Edit timing, styling, and positioning
- Export back to video with embedded captions

### Pre-captioned Mode

Edit videos that already have embedded captions:

```typescript title="src/index.ts"
await initVideoCaptionsPreCaptionedEditor(cesdk);
```

This mode:

- Loads a video with captions already embedded
- Automatically selects the first caption for editing
- Full access to caption styling and timing controls
- Refine existing captions without re-transcribing

## Autocaption Setup

To enable AI-powered caption generation, configure the fal.ai proxy URL:

```typescript title="src/imgly/index.ts"
import AutocaptionPlugin from '@imgly/plugin-autocaption-web';
import { ElevenLabsScribeV2 } from '@imgly/plugin-autocaption-web/fal-ai';

// Configure the proxy URL (default: https://proxy.img.ly/api/proxy/falai)
const AUTOCAPTION_PROXY_URL = import.meta.env.VITE_AUTOCAPTION_PROXY_URL ||
  'https://proxy.img.ly/api/proxy/falai';

// Add the autocaption plugin with ElevenLabs Scribe V2 provider
await cesdk.addPlugin(
  AutocaptionPlugin({
    provider: ElevenLabsScribeV2({
      proxyUrl: AUTOCAPTION_PROXY_URL
    })
  })
);
```

The proxy URL should point to a server that forwards requests to fal.ai with your API key. For production use, deploy your own proxy to keep the API key secure.

## Caption Inspector Panel

The caption inspector panel provides comprehensive controls for editing captions:

```typescript
// Open the caption inspector panel programmatically
cesdk.ui.openPanel('//ly.img.panel/inspector/caption');
```

The panel includes:

- **Caption text editor** - Edit caption content with live preview
- **Timing controls** - Adjust start time and duration
- **Styling options** - Font, size, color, background, alignment
- **Positioning** - Move captions anywhere on the video
- **Caption presets** - Apply pre-designed caption styles

The panel automatically opens when using `autocaption` mode, but you can open it manually in any mode using the code above.

## Set Up a Scene

Each caption mode has a dedicated init function that handles scene setup automatically.

For custom workflows beyond the predefined modes, you can load content manually:

```typescript title="src/index.ts"
// After initialization, load your own video
await cesdk.createFromVideo('https://example.com/video.mp4');

// Or load from a template archive with captions
await cesdk.loadFromArchiveURL('https://example.com/template.zip');

// Or load from a scene file
await cesdk.loadFromURL('https://example.com/scene.json');
```

The predefined init functions load appropriate scenes:

- **autocaption** - Loads a video ready for AI transcription
- **blank** - Creates an empty 1280x720 video scene
- **import** - Loads a video for SRT import
- **pre-captioned** - Loads a video with embedded captions

> **More Loading Options:** See [Open the Editor](./open-the-editor.md) for all available loading methods.

## Customize Assets

The Video Captions uses asset source plugins to provide built-in libraries for video clips, audio, effects, stickers, and fonts. The starter kit includes a curated selection—customize what's included based on your needs.

Asset sources are added via plugins in `src/index.ts`. Enable or disable individual sources:

```typescript title="src/index.ts"
import {
  FiltersAssetSource,
  StickerAssetSource,
  TextAssetSource,
  VectorShapeAssetSource,
  EffectsAssetSource,
  // ...
} from '@cesdk/cesdk-js/plugins';

// Add only the sources you need
await cesdk.addPlugin(new FiltersAssetSource());
await cesdk.addPlugin(new StickerAssetSource());
await cesdk.addPlugin(new TextAssetSource());
await cesdk.addPlugin(new VectorShapeAssetSource());
await cesdk.addPlugin(new EffectsAssetSource());
// ...
```

> **Available Asset Sources:** See [Asset Source Plugins](./plugins/asset-sources.md) for the complete list of available sources.

For production deployments, self-hosting assets is required—the IMG.LY CDN is intended for development only. See [Serve Assets](./serve-assets.md) for downloading assets, configuring `baseURL`, and excluding unused sources to optimize load times.

## Configure Actions

Actions are functions that handle user interactions like exporting videos, saving scenes, and importing files. CE.SDK provides built-in actions that you can run directly or override with custom implementations.

**Key built-in actions:**

- `exportDesign` – Export the current video to MP4 format
- `saveScene` – Save the scene as a JSON string for later editing
- `importScene` – Import a previously saved scene (supports `.scene` and `.cesdk` formats)
- `exportScene` – Export the scene as a JSON file or `.cesdk` archive with all assets
- `uploadFile` – Handle file uploads with progress tracking

Use `cesdk.actions.run()` to execute any action:

```typescript
// Run a built-in action
await cesdk.actions.run('exportDesign', { mimeType: 'video/mp4' });
```

#### Import from File Picker

```typescript title="src/imgly/config/actions.ts"
// Let users open videos from their device
cesdk.actions.register('importVideo', async () => {
  const blobURL = await cesdk.utils.loadFile({
    accept: 'video/*',
    returnType: 'objectURL'
  });
  await cesdk.createFromVideo(blobURL);
});
```

#### Export and Save

```typescript title="src/imgly/config/actions.ts"
// Register export action that downloads the edited video
cesdk.actions.register('exportDesign', async (exportOptions) => {
  const { blobs, options } = await cesdk.utils.export(exportOptions);
  await cesdk.utils.downloadFile(blobs[0], options.mimeType);
});
```

#### Upload to Your Backend

```typescript title="src/imgly/config/actions.ts"
// Override the built-in exportDesign action to send to your server
cesdk.actions.register('exportDesign', async (exportOptions) => {
  const { blobs } = await cesdk.utils.export(exportOptions);

  const formData = new FormData();
  formData.append('video', blobs[0], 'edited-video.mp4');

  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData
  });

  const { url } = await response.json();
  console.log('Uploaded to:', url);
});
```

> **Learn More:** See [Actions](./actions.md) for the full list of built-in actions, how to run them, and how to register custom actions.

***

## Customize (Optional)

### Theming

CE.SDK supports light and dark themes out of the box, plus automatic system preference detection. Switch between themes programmatically:

```typescript title="src/imgly/config/settings.ts"
// 'light' | 'dark' | 'system' | (() => 'light' | 'dark')
cesdk.ui.setTheme('dark');
```

See [Theming](./user-interface/appearance/theming.md) for custom color schemes, CSS variables, and advanced styling options.

### Localization

Customize UI labels and add support for multiple languages. The i18n system supports translation keys for all UI elements:

```typescript title="src/imgly/config/i18n.ts"
// Override specific labels
cesdk.i18n.setTranslations({
  en: {
    'actions.export.video': 'Download Video',
    'common.cancel': 'Cancel',
    'common.apply': 'Apply'
  }
});

// Add a new language
cesdk.i18n.setTranslations({
  de: {
    'actions.export.video': 'Video herunterladen'
  }
});

// Set the active locale
cesdk.i18n.setLocale('de');
```

See [Localization](./user-interface/localization.md) for supported languages, translation key reference, and right-to-left language support.

### UI Layout

![CE.SDK Editor UI Areas](https://img.ly/docs/cesdk/../_shared/assets/CESDK-UI.png)

Customize the editor interface by modifying the dock, inspector bar, navigation bar, and canvas menu. CE.SDK provides Order APIs to control which components appear and in what sequence.

```typescript title="src/imgly/config/ui/navigationBar.ts"
// Get current navigation bar components
const navOrder = cesdk.ui.getNavigationBarOrder();

// Add a custom button to the navigation bar
cesdk.ui.insertNavigationBarOrderComponent(
  'ly.img.spacer',
  { id: 'my-custom-action' },
  'after'
);

// Rearrange dock items
cesdk.ui.setDockOrder([
  'ly.img.assetLibrary.dock',
  'ly.img.separator',
  'my-custom-dock-item'
]);

// Customize the inspector bar
cesdk.ui.setInspectorBarOrder([
  'ly.img.fill.inspectorBar',
  'ly.img.separator',
  'ly.img.filter.inspectorBar'
]);
```

The Order API methods follow a consistent pattern across all UI areas:

- `get*Order()` – Retrieve the current component order
- `set*Order()` – Replace the entire order
- `insert*OrderComponent()` – Add components relative to existing ones

See [Dock](./user-interface/customization/dock.md), [Inspector Bar](./user-interface/customization/inspector-bar.md), [Navigation Bar](./user-interface/customization/navigation-bar.md), [Canvas Menu](./user-interface/customization/canvas-menu.md), and [Canvas](./user-interface/customization/canvas.md) for detailed layout customization options.

### Custom Components

Build custom UI components using the builder system and integrate them in the editor. Custom components receive reactive state updates and can interact with the engine API.

```typescript title="src/imgly/config/ui/components.ts"
// Register a custom component
cesdk.ui.registerComponent('my-custom-button', ({ builder, engine }) => {
  const selectedBlocks = engine.block.findAllSelected();

  builder.Button('apply-effect', {
    label: 'Apply Effect',
    isDisabled: selectedBlocks.length === 0,
    onClick: () => {
      // Apply custom logic to selected blocks
    }
  });
});

// Add the component to the navigation bar
cesdk.ui.insertNavigationBarOrderComponent(
  'ly.img.spacer',
  'my-custom-button',
  'after'
);
```

Custom components automatically re-render when the engine state they depend on changes—no manual subscription management required.

See [Register New Component](./user-interface/ui-extensions/register-new-component.md) for the complete builder API and component patterns.

### Settings & Features

Fine-tune editor behavior through settings and features.

**Settings** configure core engine behavior—rendering, input handling, and history management:

```typescript title="src/imgly/config/settings.ts"
cesdk.engine.editor.setSettingBool('page/dimOutOfPageAreas', true);
cesdk.engine.editor.setSettingBool('mouse/enableZoomControl', true);
cesdk.engine.editor.setSettingBool('features/undoHistory', true);
```

**Features** toggle which editing tools and panels appear in the UI:

```typescript title="src/imgly/config/features.ts"
// Toggle editor features
cesdk.feature.enable('ly.img.trim', true);
cesdk.feature.enable('ly.img.filter', true);
cesdk.feature.enable('ly.img.adjustment', true);
```

See [Settings](./settings.md) and [Features](./user-interface/customization/disable-or-enable.md) for the complete reference.

### Explore Plugins

CE.SDK has a rich plugin ecosystem that extends the editor with powerful capabilities. Plugins can add new features, integrate third-party services, or customize editor behavior.

#### AI Integration

Extend the editor with generative AI capabilities for text-to-image generation, image enhancement, and intelligent editing features. CE.SDK integrates with various AI providers.

```typescript title="src/imgly/config/plugin.ts"
import AIPlugin from '@imgly/plugin-ai-generation';

// Configure AI generation
await cesdk.addPlugin(AIPlugin({
  provider: 'your-ai-provider',
  apiKey: 'your-api-key'
}));
```

See [AI Integration](./user-interface/ai-integration.md) for provider setup and supported AI features.

#### Custom Asset Sources

Connect external asset libraries like Unsplash, Getty Images, or your own content management system. Asset sources let users browse and insert content from any source.

```typescript title="src/imgly/config/plugin.ts"
import UnsplashAssetSource from '@imgly/plugin-unsplash';

// Add Unsplash integration
await cesdk.addPlugin(UnsplashAssetSource({
  accessKey: 'your-unsplash-access-key'
}));
```

See [Custom Asset Sources](./import-media/from-remote-source/unsplash.md) for integration patterns.

#### Discover More Plugins

Explore the full plugin ecosystem in the [IMG.LY plugins repository](https://github.com/imgly/plugins). Available plugins include:

- **Vectorizer** – Convert raster images to vectors
- **Design Presets** – Pre-built design templates
- **Social Media Templates** – Platform-specific sizing
- **And more** – Check the repository for the latest additions

***

## Key Capabilities

The Video Captions starter kit includes everything needed for professional video captioning.

<CapabilityGrid
  features={[
  {
    title: 'AI Caption Generation',
    description:
      'Auto-generate accurate captions using ElevenLabs Scribe V2 speech-to-text technology.',
    imageId: 'text-editing',
  },
  {
    title: 'Caption Styling',
    description:
      'Customize fonts, colors, backgrounds, alignment, and positioning with professional presets.',
    imageId: 'filters',
  },
  {
    title: 'SRT Import/Export',
    description:
      'Import existing SRT subtitle files and export captions in standard subtitle formats.',
    imageId: 'asset-libraries',
  },
  {
    title: 'Timeline Control',
    description:
      'Precise timing controls for caption start time and duration with visual timeline feedback.',
    imageId: 'transform',
  },
  {
    title: 'Caption Inspector',
    description:
      'Dedicated inspector panel for editing caption text, timing, styling, and positioning.',
    imageId: 'text-editing',
  },
  {
    title: 'Video Export',
    description:
      'Export videos with embedded captions to MP4 format with customizable quality settings.',
    imageId: 'client-side',
  },
]}
/>

<br />

> **Free Trial:** [Sign up for a free trial](https://img.ly/forms/free-trial) to get a license key and remove the watermark.

***

## Troubleshooting

### Editor doesn't load

- **Check the container element exists**: Ensure your container element is in the DOM before calling `create()`
- **Verify the baseURL**: Assets must be accessible from the CDN or your self-hosted location
- **Check console errors**: Look for CORS or network errors in browser developer tools

### Autocaption doesn't work

- **Check fal.ai API key**: Verify your API key is configured correctly in the proxy URL
- **Verify proxy URL**: Ensure `VITE_AUTOCAPTION_PROXY_URL` points to a working proxy server
- **Check network requests**: Look for failed requests to the fal.ai API in DevTools Network tab
- **Video has no audio**: The autocaption feature requires audio to transcribe

### Caption Inspector doesn't open

- **Check video captions feature**: Ensure `features/videoCaptionsEnabled` is set to `true` in settings
- **Verify caption mode**: The inspector opens automatically in `autocaption` mode
- **Open manually**: Use `cesdk.ui.openPanel('//ly.img.panel/inspector/caption')` to open it programmatically

### SRT import fails

- **Check file format**: Ensure the SRT file follows standard subtitle formatting
- **Verify encoding**: SRT files should use UTF-8 encoding
- **Check timestamps**: Timestamps must be in the format `HH:MM:SS,mmm --> HH:MM:SS,mmm`

### Captions don't appear in export

- **Wait for caption rendering**: Ensure captions are visible in the editor before exporting
- **Check caption timing**: Verify caption start times and durations are correct
- **Export as MP4**: Captions are embedded in the video during MP4 export

### Video export takes too long

- **Reduce resolution**: Lower output resolution significantly improves encoding speed
- **Shorten clip length**: Longer videos take proportionally longer to encode
- **Check system resources**: Video encoding is CPU-intensive; close other applications

### Watermark appears in production

- **Add your license key**: Set the `license` property in your configuration
- **Sign up for a trial**: Get a free trial license at [img.ly/forms/free-trial](https://img.ly/forms/free-trial)

***

## Next Steps

- [Configuration](./configuration.md) – Complete list of initialization options
- [Serve Assets](./serve-assets.md) – Self-host engine assets for production
- [Actions](./actions.md) – Build custom export and save workflows
- [Theming](./user-interface/appearance/theming.md) – Customize colors and appearance
- [Localization](./user-interface/localization.md) – Add translations and language support



---

## More Resources

- **[Electron Documentation Index](https://img.ly/docs/cesdk/electron.md)** - Browse all Electron documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./electron.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support