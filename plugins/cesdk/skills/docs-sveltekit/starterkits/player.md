> This is one page of the CE.SDK SvelteKit documentation. For a complete overview, see the [SvelteKit Documentation Index](https://img.ly/sveltekit.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Starter Kits](./starterkits.md) > [Video Player](./starterkits/player.md)

---

Lightweight video playback for your SvelteKit app—play, pause, and navigate video
content. Runs entirely in the browser with no server dependencies.

![Player starter kit showing a lightweight video playback interface](https://img.ly/docs/cesdk/./assets/browser.hero.webp)

> **Reading time:** 5 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/starterkit-video-player-ts-web/archive/refs/tags/release-$UBQ_VERSION$.zip)
>
> - [View source on GitHub](https://github.com/imgly/starterkit-video-player-ts-web/tree/release-$UBQ_VERSION$)
>
> - [Open in StackBlitz](https://stackblitz.com/~/github.com/imgly/starterkit-video-player-ts-web/tree/release-$UBQ_VERSION$)
>
> - [Live demo](https://img.ly/examples/starterkit-video-player/)

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

    Integrate the Video Player into your SvelteKit application using the imperative API.

    ## Step 1: Create a New Project

    <TerminalTabs syncKey="package-manager">
      <TerminalTab label="npm">
        npx sv create your-project-name
        cd your-project-name
      </TerminalTab>

      <TerminalTab label="pnpm">
        pnpm dlx sv create your-project-name
        cd your-project-name
      </TerminalTab>

      <TerminalTab label="yarn">
        npx sv create your-project-name
        cd your-project-name
      </TerminalTab>
    </TerminalTabs>

    ## Step 2: Clone the Starter Kit

    Clone the starter kit and copy the player configuration to your project:

    <TerminalTabs>
      <TerminalTab label="git">
        git clone https://github.com/imgly/starterkit-video-player-ts-web.git
        cp -r starterkit-video-player-ts-web/src/lib/imgly ./src/lib/imgly
        rm -rf starterkit-video-player-ts-web
      </TerminalTab>

      <TerminalTab label="degit">
        npx degit imgly/starterkit-video-player-ts-web/src/lib/imgly ./src/lib/imgly
      </TerminalTab>
    </TerminalTabs>

    > **Adjust Path:** The default destination is `./src/lib/imgly`. Adjust the path to match your project structure.

    The `imgly/` folder contains the player configuration:

    ```
    src/lib/imgly/
    ├── index.ts                  # Player initialization function
    └── config/
        ├── plugin.ts             # Main configuration plugin
        ├── features.ts           # Feature toggles
        ├── i18n.ts               # Translations
        └── settings.ts           # Engine settings
    ```

    ## Step 3: Install Dependencies

    The Creative Editor SDK package provides all playback functionality.

    <TerminalTabs syncKey="package-manager">
      <TerminalTab label="npm">npm install @cesdk/cesdk-js</TerminalTab>
      <TerminalTab label="pnpm">pnpm add @cesdk/cesdk-js</TerminalTab>
      <TerminalTab label="yarn">yarn add @cesdk/cesdk-js</TerminalTab>
    </TerminalTabs>

    ## Step 4: Download Assets

    CE.SDK requires engine assets (fonts, icons, UI elements) to function. These must be served as static files from your project's `static/` directory.

    <TerminalTabs>
      <TerminalTab label="Download">
        curl -O https://cdn.img.ly/packages/imgly/cesdk-js/$UBQ\_VERSION$/imgly-assets.zip
        unzip imgly-assets.zip -d static/
        rm imgly-assets.zip
      </TerminalTab>
    </TerminalTabs>

    > **Asset Configuration:** The starter kit is pre-configured to load assets from `/assets`. If you place assets in a different location, update the `baseURL` in the player component.

    ## Step 5: Create the Player Component

    Create a Svelte component using the CE.SDK imperative API (e.g., `src/lib/VideoPlayer.svelte`):

    ```svelte
    <script>
      import { onMount, onDestroy } from 'svelte';
      import CreativeEditorSDK from '@cesdk/cesdk-js';
      import { initVideoPlayer } from '$lib/imgly';

      let container;
      let cesdk = null;

      onMount(async () => {
        cesdk = await CreativeEditorSDK.create(container, {
          baseURL: '/assets'
        });
        await initVideoPlayer(cesdk);
      });

      onDestroy(() => {
        if (cesdk) {
          cesdk.dispose();
        }
      });
    </script>

    <div bind:this={container} style="width: 100vw; height: 100vh;"></div>
    ```

    ## Step 6: Use the Component

    Import and use the Video Player component in your page route:

    ```svelte
    <script>
      import { browser } from '$app/environment';
      import { onMount } from 'svelte';

      let VideoPlayer;

      onMount(async () => {
        const module = await import('$lib/VideoPlayer.svelte');
        VideoPlayer = module.default;
      });
    </script>

    {#if browser && VideoPlayer}
      <svelte:component this={VideoPlayer} />
    {/if}
    ```

    ### SSR Error

    If you encounter the error `window is not defined`, it means CE.SDK is being imported on the server. CE.SDK requires browser APIs and must run client-side only.

    Use the dynamic import pattern shown above, which defers loading the component until the browser is ready. The `browser` check from `$app/environment` ensures the component only renders client-side.

    Alternatively, disable SSR for the entire page by adding a `+page.ts` file:

    ```typescript
    export const ssr = false;
    ```

    This allows you to use a simpler static import in `+page.svelte`:

    ```svelte
    <script>
      import VideoPlayer from '$lib/VideoPlayer.svelte';
    </script>

    <VideoPlayer />
    ```
  </TabItem>

  <TabItem label="Existing Project">
    ## Get Started

    Integrate the Video Player into an existing SvelteKit application. This adds the player configuration to your current project structure.

    ### Step 1: Navigate to Your Project

    <TerminalTabs>
      <TerminalTab label="Navigate">cd your-project</TerminalTab>
    </TerminalTabs>

    ### Step 2: Clone the Starter Kit

    Clone the starter kit and copy the player configuration to your project:

    <TerminalTabs>
      <TerminalTab label="git">
        git clone https://github.com/imgly/starterkit-video-player-ts-web.git
        cp -r starterkit-video-player-ts-web/src/lib/imgly ./src/lib/imgly
        rm -rf starterkit-video-player-ts-web
      </TerminalTab>

      <TerminalTab label="degit">
        npx degit imgly/starterkit-video-player-ts-web/src/lib/imgly ./src/lib/imgly
      </TerminalTab>
    </TerminalTabs>

    > **Adjust Path:** The default destination is `./src/lib/imgly`. Adjust the path to match your
    > project structure.

    ### Step 3: Install Dependencies

    The Creative Editor SDK package provides all playback functionality.

    <TerminalTabs syncKey="package-manager">
      <TerminalTab label="npm">npm install @cesdk/cesdk-js</TerminalTab>
      <TerminalTab label="pnpm">pnpm add @cesdk/cesdk-js</TerminalTab>
      <TerminalTab label="yarn">yarn add @cesdk/cesdk-js</TerminalTab>
    </TerminalTabs>

    ### Step 4: Download Assets

    CE.SDK requires engine assets (fonts, icons, UI elements) to function. These must be served as static files from your project's `static/` directory.

    <TerminalTabs>
      <TerminalTab label="Download">
        curl -O https://cdn.img.ly/packages/imgly/cesdk-js/$UBQ\_VERSION$/imgly-assets.zip
        unzip imgly-assets.zip -d static/
        rm imgly-assets.zip
      </TerminalTab>
    </TerminalTabs>

    > **Asset Configuration:** The starter kit is pre-configured to load assets from `/assets`. If you place
    > assets in a different location, update the `baseURL` in the player component.

    ### Step 5: Create the Player Component

    Create a Svelte component using the CE.SDK imperative API (e.g., `src/lib/VideoPlayer.svelte`):

    ```svelte
    <script>
      import { onMount, onDestroy } from 'svelte';
      import CreativeEditorSDK from '@cesdk/cesdk-js';
      import { initVideoPlayer } from './imgly';

      let container;
      let cesdk = null;

      onMount(async () => {
        cesdk = await CreativeEditorSDK.create(container, {
          baseURL: '/assets'
        });
        await initVideoPlayer(cesdk);
      });

      onDestroy(() => {
        if (cesdk) {
          cesdk.dispose();
        }
      });
    </script>

    <div bind:this={container} style="width: 100vw; height: 100vh;"></div>
    ```

    ### Step 6: Use the Component

    Import and use the Video Player component in your page route:

    ```svelte
    <script>
      import { browser } from '$app/environment';
      import { onMount } from 'svelte';

      let VideoPlayer;

      onMount(async () => {
        const module = await import('$lib/VideoPlayer.svelte');
        VideoPlayer = module.default;
      });
    </script>

    {#if browser && VideoPlayer}
      <svelte:component this={VideoPlayer} />
    {/if}
    ```

    #### SSR Error

    If you encounter the error `window is not defined`, it means CE.SDK is being imported on the server. CE.SDK requires browser APIs and must run client-side only.

    Use the dynamic import pattern shown above, which defers loading the component until the browser is ready. The `browser` check from `$app/environment` ensures the component only renders client-side.

    Alternatively, disable SSR for the entire page by adding a `+page.ts` file:

    ```typescript
    export const ssr = false;
    ```

    This allows you to use a simpler static import in `+page.svelte`:

    ```svelte
    <script>
      import VideoPlayer from '$lib/VideoPlayer.svelte';
    </script>

    <VideoPlayer />
    ```
  </TabItem>
</Tabs>

***

## Set Up a Scene

CE.SDK offers multiple ways to load content into the player. Choose the method that matches your use case:

```typescript title="src/lib/imgly/index.ts"
// Load from a template archive - loads a previously saved project
await cesdk.loadFromArchiveURL('https://example.com/video.zip');

// Load from a scene file - restores a scene from JSON
await cesdk.loadFromURL('https://example.com/scene.json');

// Zoom to fit the content
await cesdk.actions.run('zoom.toPage', {
  page: 'first',
  autoFit: true,
  padding: 24,
});
```

> **More Loading Options:** See [Open the Editor](./open-the-editor.md) for all available loading
> methods.

***

## Customize (Optional)

### Theming

CE.SDK supports light and dark themes out of the box, plus automatic system preference detection. Switch between themes programmatically:

```typescript title="src/lib/imgly/config/settings.ts"
// 'light' | 'dark' | 'system' | (() => 'light' | 'dark')
cesdk.ui.setTheme('dark');
```

See [Theming](./user-interface/appearance/theming.md) for custom color schemes, CSS variables, and advanced styling options.

### Localization

Customize UI labels and add support for multiple languages. The i18n system supports translation keys for all UI elements:

```typescript title="src/lib/imgly/config/i18n.ts"
// Override specific labels
cesdk.i18n.setTranslations({
  en: {
    'common.play': 'Play Video',
    'common.pause': 'Pause',
  },
});

// Add a new language
cesdk.i18n.setTranslations({
  de: {
    'common.play': 'Video abspielen',
  },
});

// Set the active locale
cesdk.i18n.setLocale('de');
```

See [Localization](./user-interface/localization.md) for supported languages, translation key reference, and right-to-left language support.

***

## Key Capabilities

The Video Player includes everything needed for video playback.

<CapabilityGrid
  features={[
  {
    title: 'Playback Controls',
    description:
      'Play, pause, and seek through video content with intuitive controls.',
    imageId: 'transform',
  },
  {
    title: 'Timeline Navigation',
    description:
      'Scrub through the timeline to preview any point in the video.',
    imageId: 'filters',
  },
  {
    title: 'Zoom Controls',
    description:
      'Zoom in and out of the video canvas with fit-to-screen options.',
    imageId: 'green-screen',
  },
  {
    title: 'Page Navigation',
    description: 'Navigate between pages in multi-page video projects.',
    imageId: 'text-editing',
  },
  {
    title: 'Read-Only Mode',
    description:
      'Display video content without editing capabilities for preview and review workflows.',
    imageId: 'asset-libraries',
  },
  {
    title: 'Lightweight Interface',
    description:
      'Minimal UI focused on playback experience without editing distractions.',
    imageId: 'client-side',
  },
]}
/>

<br />

> **Free Trial:** [Sign up for a free trial](https://img.ly/forms/free-trial) to get
> a license key and remove the watermark.

***

## Troubleshooting

### Player doesn't load

- **Check the container element exists**: Ensure your container element is in the DOM before calling `create()`
- **Verify the baseURL**: Assets must be accessible from the CDN or your self-hosted location
- **Check console errors**: Look for CORS or network errors in browser developer tools

### Content doesn't appear

- **Check network requests**: Open DevTools Network tab and look for failed requests to `cdn.img.ly`
- **Self-host assets for production**: See [Serve Assets](./serve-assets.md) to host assets on your infrastructure

### Video doesn't play

- **Check browser autoplay policies**: Browsers require user interaction before playing video
- **Verify video format**: Ensure video files are in a supported format (MP4, WebM)

### Watermark appears in production

- **Add your license key**: Set the `license` property in your configuration
- **Sign up for a trial**: Get a free trial license at [img.ly/forms/free-trial](https://img.ly/forms/free-trial)

***

## Next Steps

- [Configuration](./configuration.md) – Complete list of initialization
  options
- [Serve Assets](./serve-assets.md) – Self-host engine assets for production
- [Theming](./user-interface/appearance/theming.md) – Customize colors and appearance
- [Localization](./user-interface/localization.md) – Add translations and language support



---

## More Resources

- **[SvelteKit Documentation Index](https://img.ly/sveltekit.md)** - Browse all SvelteKit documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./sveltekit.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support