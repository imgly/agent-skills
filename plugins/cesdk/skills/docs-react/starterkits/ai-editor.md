> This is one page of the CE.SDK React documentation. For a complete overview, see the [React Documentation Index](https://img.ly/docs/cesdk/react.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Starter Kits](./starterkits.md) > [AI Editor](./starterkits/ai-editor.md)

---

Quickly add AI-powered visual editing and media generation to your web app — seamlessly connect any AI model.

![Design Editor starter kit showing a professional design editing interface](https://img.ly/docs/cesdk/./assets/browser.hero.webp)

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/starterkit-ai-editor-react-web/archive/refs/tags/release-$UBQ_VERSION$.zip)
>
> - [View source on GitHub](https://github.com/imgly/starterkit-ai-editor-react-web/tree/v$UBQ_VERSION$)
>
> - [Open in StackBlitz](https://stackblitz.com/github/imgly/starterkit-ai-editor-react-web/tree/v$UBQ_VERSION$)
>
> - [Live demo](https://img.ly/docs/cesdk/examples/starterkit-ai-editor/)

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

    Start fresh with a standalone AI Editor project. This creates a complete, ready-to-run React application with Design, Photo, and Video editing modes and AI generation capabilities.

    ## Step 1: Clone the Repository

    <TerminalTabs>
      <TerminalTab label="git">
        git clone https://github.com/imgly/starterkit-ai-editor-react-web.git
      </TerminalTab>

      <TerminalTab label="degit">
        npx degit imgly/starterkit-ai-editor-react-web starterkit-ai-editor-react-web
      </TerminalTab>
    </TerminalTabs>

    The `src/` folder contains the editor code:

    ```
    src/
    ├── app/                          # Demo application
    ├── imgly/
    │   ├── config/
    │   │   ├── design-editor/
    │   │   │   ├── actions.ts                # Export/import actions
    │   │   │   ├── features.ts               # Feature toggles
    │   │   │   ├── i18n.ts                   # Translations
    │   │   │   ├── plugin.ts                 # Main configuration plugin
    │   │   │   ├── settings.ts               # Engine settings
    │   │   │   └── ui/
    │   │   │       ├── canvas.ts                 # Canvas configuration
    │   │   │       ├── components.ts             # Custom component registration
    │   │   │       ├── dock.ts                   # Dock layout configuration
    │   │   │       ├── index.ts                  # Combines UI customization exports
    │   │   │       ├── inspectorBar.ts           # Inspector bar layout
    │   │   │       ├── navigationBar.ts          # Navigation bar layout
    │   │   │       └── panel.ts                  # Panel configuration
    │   │   ├── photo-editor/          # Same structure as design-editor/
    │   │   └── video-editor/          # Same structure as design-editor/
    │   ├── index.ts                  # Editor initialization function
    │   └── plugins/
    │       └── ai-app/
    │           ├── ai-apps.ts
    │           └── ai-providers.ts
    └── index.tsx                 # Application entry point
    ```

    ## Step 2: Install Dependencies

    Install the required packages:

    <TerminalTabs syncKey="package-manager">
      <TerminalTab label="npm">
        cd starterkit-ai-editor-react-web
        npm install
      </TerminalTab>

      <TerminalTab label="pnpm">
        cd starterkit-ai-editor-react-web
        pnpm install
      </TerminalTab>

      <TerminalTab label="yarn">
        cd starterkit-ai-editor-react-web
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

    Open `http://localhost:5173` in your browser. Use the mode selector at the top to switch between Design, Photo, and Video modes.
  </TabItem>

  <TabItem label="Existing Project">
    ## Get Started

    Integrate the AI Editor into an existing React application. This adds the editor configuration to your current project structure.

    ## Step 1: Clone

    <TerminalTabs>
      <TerminalTab label="Navigate">cd your-project</TerminalTab>
    </TerminalTabs>

    Clone the starter kit and copy the editor configuration to your project:

    <TerminalTabs>
      <TerminalTab label="git">
        git clone https://github.com/imgly/starterkit-ai-editor-react-web.git
        cp -r starterkit-ai-editor-react-web/src/imgly ./src/imgly
        rm -rf starterkit-ai-editor-react-web
      </TerminalTab>

      <TerminalTab label="degit">
        npx degit imgly/starterkit-ai-editor-react-web/src/imgly ./src/imgly
      </TerminalTab>
    </TerminalTabs>

    > **Adjust Path:** The default destination is `./src/imgly`. Adjust the path to match your
    > project structure.

    The `imgly/` folder contains the editor configuration:

    ```
    imgly/
    ├── config/
    │   ├── design-editor/
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
    │   ├── photo-editor/          # Same structure as design-editor/
    │   └── video-editor/          # Same structure as design-editor/
    ├── index.ts                  # Editor initialization function
    └── plugins/
        └── ai-app/
            ├── ai-apps.ts
            └── ai-providers.ts
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

    ### AI Plugins

    Add the AI Apps plugin and core generation utilities:

    <TerminalTabs syncKey="package-manager">
      <TerminalTab label="npm">
        npm install @imgly/plugin-ai-apps-web@$UBQ\_VERSION$ @imgly/plugin-ai-generation-web@$UBQ\_VERSION$
      </TerminalTab>

      <TerminalTab label="pnpm">
        pnpm add @imgly/plugin-ai-apps-web@$UBQ\_VERSION$ @imgly/plugin-ai-generation-web@$UBQ\_VERSION$
      </TerminalTab>

      <TerminalTab label="yarn">
        yarn add @imgly/plugin-ai-apps-web@$UBQ\_VERSION$ @imgly/plugin-ai-generation-web@$UBQ\_VERSION$
      </TerminalTab>
    </TerminalTabs>

    Add the image generation plugin for AI-powered image creation and editing:

    <TerminalTabs syncKey="package-manager">
      <TerminalTab label="npm">
        npm install @imgly/plugin-ai-image-generation-web@$UBQ\_VERSION$
      </TerminalTab>

      <TerminalTab label="pnpm">
        pnpm add @imgly/plugin-ai-image-generation-web@$UBQ\_VERSION$
      </TerminalTab>

      <TerminalTab label="yarn">
        yarn add @imgly/plugin-ai-image-generation-web@$UBQ\_VERSION$
      </TerminalTab>
    </TerminalTabs>

    Add the text generation plugin for AI-powered text content:

    <TerminalTabs syncKey="package-manager">
      <TerminalTab label="npm">
        npm install @imgly/plugin-ai-text-generation-web@$UBQ\_VERSION$
      </TerminalTab>

      <TerminalTab label="pnpm">
        pnpm add @imgly/plugin-ai-text-generation-web@$UBQ\_VERSION$
      </TerminalTab>

      <TerminalTab label="yarn">
        yarn add @imgly/plugin-ai-text-generation-web@$UBQ\_VERSION$
      </TerminalTab>
    </TerminalTabs>

    Add the video generation plugin for AI-powered video clips:

    <TerminalTabs syncKey="package-manager">
      <TerminalTab label="npm">
        npm install @imgly/plugin-ai-video-generation-web@$UBQ\_VERSION$
      </TerminalTab>

      <TerminalTab label="pnpm">
        pnpm add @imgly/plugin-ai-video-generation-web@$UBQ\_VERSION$
      </TerminalTab>

      <TerminalTab label="yarn">
        yarn add @imgly/plugin-ai-video-generation-web@$UBQ\_VERSION$
      </TerminalTab>
    </TerminalTabs>

    Add the audio generation plugin for AI-powered soundtracks and voiceovers:

    <TerminalTabs syncKey="package-manager">
      <TerminalTab label="npm">
        npm install @imgly/plugin-ai-audio-generation-web@$UBQ\_VERSION$
      </TerminalTab>

      <TerminalTab label="pnpm">
        pnpm add @imgly/plugin-ai-audio-generation-web@$UBQ\_VERSION$
      </TerminalTab>

      <TerminalTab label="yarn">
        yarn add @imgly/plugin-ai-audio-generation-web@$UBQ\_VERSION$
      </TerminalTab>
    </TerminalTabs>

    ## Step 3: Download Assets

    CE.SDK requires engine assets (fonts, icons, UI elements) to function. For React projects, place these in your `public/` directory which is served automatically.

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

    ## Step 4: Create the Editor Component

    Choose your editing mode and initialize the editor accordingly:

    <Tabs syncKey="editor-mode">
      <TabItem label="Design">
        ```tsx
        import CreativeEditor from '@cesdk/cesdk-js/react';
        import { initAiDesignEditor, createAIProviders } from './imgly';

        const providers = createAIProviders('Design');

        export default function DesignEditor() {
          return (
            <CreativeEditor
              config={{ baseURL: '/assets' }}
              init={(cesdk) => initAiDesignEditor(cesdk, providers)}
              width="100vw"
              height="100vh"
            />
          );
        }
        ```
      </TabItem>

      <TabItem label="Photo">
        ```tsx
        import CreativeEditor from '@cesdk/cesdk-js/react';
        import { initAiPhotoEditor, createAIProviders } from './imgly';

        const providers = createAIProviders('Photo');

        export default function DesignEditor() {
          return (
            <CreativeEditor
              config={{ baseURL: '/assets' }}
              init={(cesdk) => initAiPhotoEditor(cesdk, providers)}
              width="100vw"
              height="100vh"
            />
          );
        }
        ```
      </TabItem>

      <TabItem label="Video">
        ```tsx
        import CreativeEditor from '@cesdk/cesdk-js/react';
        import { initAiVideoEditor, createAIProviders } from './imgly';

        const providers = createAIProviders('Video');

        export default function DesignEditor() {
          return (
            <CreativeEditor
              config={{ baseURL: '/assets' }}
              init={(cesdk) => initAiVideoEditor(cesdk, providers)}
              width="100vw"
              height="100vh"
            />
          );
        }
        ```
      </TabItem>
    </Tabs>
  </TabItem>
</Tabs>

## Configure AI Providers

The AI Editor uses proxy URLs to securely connect to AI providers. Configure your proxy endpoints in the environment:

```env title=".env"
VITE_FAL_AI_PROXY_URL=https://your-server.com/api/proxy/falai
VITE_ANTHROPIC_PROXY_URL=https://your-server.com/api/proxy/anthropic
VITE_OPENAI_PROXY_URL=https://your-server.com/api/proxy/openai
VITE_ELEVENLABS_PROXY_URL=https://your-server.com/api/proxy/elevenlabs
```

> **Demo Proxies:** By default, the starter kit uses public IMG.LY demo proxies for quick testing. For production, set up your own proxy server to protect your API keys.

The AI provider configuration is managed in `src/imgly/plugins/ai-app/ai-providers.ts`:

```typescript title="src/imgly/plugins/ai-app/ai-providers.ts"
export function createAIProviders(mode: SceneMode): AIProviders {
  return {
    image: {
      provider: 'fal.ai',
      proxyUrl: import.meta.env.VITE_FAL_AI_PROXY_URL
    },
    video: {
      provider: 'fal.ai',
      proxyUrl: import.meta.env.VITE_FAL_AI_PROXY_URL
    },
    text: {
      provider: 'anthropic',
      proxyUrl: import.meta.env.VITE_ANTHROPIC_PROXY_URL
    },
    audio: {
      provider: 'elevenlabs',
      proxyUrl: import.meta.env.VITE_ELEVENLABS_PROXY_URL
    }
  };
}
```

See [AI Integration](./user-interface/ai-integration.md) for detailed provider setup and proxy server configuration.

## Set Up a Scene

CE.SDK offers multiple ways to load content into the editor. Choose the method that matches your use case:

```typescript title="src/imgly/config/index.ts"
// Create a blank design canvas - starts with an empty design scene
await cesdk.actions.run('scene.create');

// Load from a template archive - restores a previously saved project
await cesdk.loadFromArchiveURL('https://example.com/template.zip');

// Load from an image URL - creates a new scene with the image
await cesdk.createFromImage('https://example.com/image.jpg');

// Load from a scene file - restores a scene from JSON
await cesdk.loadFromURL('https://example.com/scene.json');
```

> **More Loading Options:** See [Open the Editor](./open-the-editor.md) for all available loading methods.

## Customize Assets

The AI Editor uses asset source plugins to provide built-in libraries for templates, stickers, shapes, and fonts. The starter kit includes a curated selection—customize what's included based on your needs.

Asset sources are added via plugins. Enable or disable individual sources:

```typescript title="src/imgly/config/design-editor/plugin.ts"
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

Actions are functions that handle user interactions like exporting designs, saving scenes, and importing files. CE.SDK provides built-in actions that you can run directly or override with custom implementations.

**Key built-in actions:**

- `exportDesign` – Export the current design to PNG, JPEG, PDF, or other formats
- `saveScene` – Save the scene as a JSON string for later editing
- `importScene` – Import a previously saved scene (supports `.scene` and `.cesdk` formats)
- `exportScene` – Export the scene as a JSON file or `.cesdk` archive with all assets
- `uploadFile` – Handle file uploads with progress tracking

Use `cesdk.actions.run()` to execute any action:

```typescript
// Run a built-in action
await cesdk.actions.run('exportDesign', { mimeType: 'image/png' });
```

#### Import from File Picker

```typescript title="src/imgly/config/design-editor/actions.ts"
// Let users open images from their device
cesdk.actions.register('importImage', async () => {
  const blobURL = await cesdk.utils.loadFile({
    accept: 'image/*',
    returnType: 'objectURL'
  });
  await cesdk.createFromImage(blobURL);
});
```

#### Export and Save

```typescript title="src/imgly/config/design-editor/actions.ts"
// Register export action that downloads the edited design
cesdk.actions.register('exportDesign', async (exportOptions) => {
  const { blobs, options } = await cesdk.utils.export(exportOptions);
  await cesdk.utils.downloadFile(blobs[0], options.mimeType);
});
```

> **Learn More:** See [Actions](./actions.md) for the full list of built-in actions, how to run them, and how to register custom actions.

***

## Customize (Optional)

### Theming

CE.SDK supports light and dark themes out of the box, plus automatic system preference detection. Switch between themes programmatically:

```typescript title="src/imgly/config/design-editor/settings.ts"
// 'light' | 'dark' | 'system' | (() => 'light' | 'dark')
cesdk.ui.setTheme('dark');
```

See [Theming](./user-interface/appearance/theming.md) for custom color schemes, CSS variables, and advanced styling options.

### Localization

Customize UI labels and add support for multiple languages. The i18n system supports translation keys for all UI elements:

```typescript title="src/imgly/config/design-editor/i18n.ts"
// Override specific labels
cesdk.i18n.setTranslations({
  en: {
    'actions.export.image': 'Download Design',
    'common.cancel': 'Cancel',
    'common.apply': 'Apply'
  }
});

// Set the active locale
cesdk.i18n.setLocale('de');
```

See [Localization](./user-interface/localization.md) for supported languages, translation key reference, and right-to-left language support.

### UI Layout

![CE.SDK Editor UI Areas](https://img.ly/docs/cesdk/../_shared/assets/CESDK-UI.png)

Customize the editor interface by modifying the dock, inspector bar, navigation bar, and canvas menu. CE.SDK provides Order APIs to control which components appear and in what sequence.

See [Dock](./user-interface/customization/dock.md), [Inspector Bar](./user-interface/customization/inspector-bar.md), [Navigation Bar](./user-interface/customization/navigation-bar.md), [Canvas Menu](./user-interface/customization/canvas-menu.md), and [Canvas](./user-interface/customization/canvas.md) for detailed layout customization options.

### Settings & Features

Fine-tune editor behavior through settings and features.

**Settings** configure core engine behavior—rendering, input handling, and history management:

```typescript title="src/imgly/config/design-editor/settings.ts"
cesdk.engine.editor.setSettingBool('page/dimOutOfPageAreas', true);
cesdk.engine.editor.setSettingBool('mouse/enableZoomControl', true);
```

**Features** toggle which editing tools and panels appear in the UI:

```typescript title="src/imgly/config/design-editor/features.ts"
// Toggle editor features
cesdk.feature.enable('ly.img.crop', true);
cesdk.feature.enable('ly.img.filter', true);
cesdk.feature.enable('ly.img.adjustment', true);
```

See [Settings](./settings.md) and [Features](./user-interface/customization/disable-or-enable.md) for the complete reference.

### Explore Plugins

CE.SDK has a rich plugin ecosystem that extends the editor with powerful capabilities.

#### AI Generation

The AI Editor uses multiple plugins for different generation capabilities:

- `@imgly/plugin-ai-apps-web` - Main AI Apps interface
- `@imgly/plugin-ai-generation-web` - Core generation utilities
- `@imgly/plugin-ai-image-generation-web` - Image generation (fal.ai, OpenAI)
- `@imgly/plugin-ai-text-generation-web` - Text generation (Anthropic, OpenAI)
- `@imgly/plugin-ai-video-generation-web` - Video generation (fal.ai)
- `@imgly/plugin-ai-audio-generation-web` - Audio generation (ElevenLabs)

```typescript title="src/imgly/plugins/ai-app/ai-apps.ts"
import AiApps from '@imgly/plugin-ai-apps-web';
import FalAiImage from '@imgly/plugin-ai-image-generation-web/fal-ai';
import Anthropic from '@imgly/plugin-ai-text-generation-web/anthropic';
import FalAiVideo from '@imgly/plugin-ai-video-generation-web/fal-ai';
import Elevenlabs from '@imgly/plugin-ai-audio-generation-web/elevenlabs';

await cesdk.addPlugin(
  AiApps({
    providers: {
      text2image: FalAiImage({ proxyUrl: '...' }),
      text2text: Anthropic({ proxyUrl: '...' }),
      text2video: FalAiVideo({ proxyUrl: '...' }),
      text2audio: Elevenlabs({ proxyUrl: '...' })
    }
  })
);
```

See [AI Integration](./user-interface/ai-integration.md) for provider setup and supported AI features.

#### Background Removal

Add AI-powered background removal that runs entirely client-side:

```typescript title="src/imgly/plugins/background-removal.ts"
import BackgroundRemovalPlugin from '@imgly/plugin-background-removal';

await cesdk.addPlugin(BackgroundRemovalPlugin());
```

See [Background Removal](./edit-image/remove-bg.md) for setup instructions and configuration options.

***

## Key Capabilities

The AI Editor includes everything needed for AI-powered creative editing.

<CapabilityGrid
  features={[
  {
    title: 'Image Generation',
    description:
      'Generate images from text prompts or transform existing images with AI-powered styles and effects.',
    imageId: 'effects',
  },
  {
    title: 'Video Generation',
    description:
      'Create short video clips from images or prompts with AI-powered animation and effects.',
    imageId: 'transform',
  },
  {
    title: 'Audio Generation',
    description:
      'Generate royalty-free soundtracks and audio effects from text descriptions.',
    imageId: 'audio',
  },
  {
    title: 'Voice Generation',
    description:
      'Create natural-sounding voiceovers from text scripts with adjustable speed and voice selection.',
    imageId: 'text-editing',
  },
  {
    title: 'Background Removal',
    description:
      'AI-powered background removal that runs entirely in the browser without server dependencies.',
    imageId: 'green-screen',
  },
  {
    title: 'Multi-Mode Editing',
    description:
      'Switch between Design, Photo, and Video editing modes with optimized configurations for each.',
    imageId: 'filters',
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

### AI generation fails

- **Check proxy configuration**: Ensure your proxy URLs are correctly configured in `.env`
- **Verify API keys**: Make sure your AI provider API keys are valid and have sufficient credits
- **Check network requests**: Open DevTools Network tab and look for failed requests to your proxy server

### Assets don't appear

- **Check network requests**: Open DevTools Network tab and look for failed requests to `cdn.img.ly`
- **Self-host assets for production**: See [Serve Assets](./serve-assets.md) to host assets on your infrastructure

### Watermark appears in production

- **Add your license key**: Set the `license` property in your configuration
- **Sign up for a trial**: Get a free trial license at [img.ly/forms/free-trial](https://img.ly/forms/free-trial)

***

## Next Steps

- [AI Integration](./user-interface/ai-integration.md) – Configure AI providers and proxy servers
- [Configuration](./configuration.md) – Complete list of initialization options
- [Serve Assets](./serve-assets.md) – Self-host engine assets for production
- [Actions](./actions.md) – Build custom export and save workflows
- [Theming](./user-interface/appearance/theming.md) – Customize colors and appearance



---

## More Resources

- **[React Documentation Index](https://img.ly/docs/cesdk/react.md)** - Browse all React documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./react.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support