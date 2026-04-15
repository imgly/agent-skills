> This is one page of the CE.SDK Electron documentation. For a complete overview, see the [Electron Documentation Index](https://img.ly/docs/cesdk/electron.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Starter Kits](./starterkits.md) > [Custom Built UIs](./starterkits/custom-built-uis.md) > [Photobook UI](./starterkits/photobook-ui.md)

---

Custom UI for building photo books focusing on theming, page layouts, and managing photo assets.

![Photobook UI starter kit showing a multi-page photobook editing interface](https://img.ly/docs/cesdk/./assets/browser.hero.webp)

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/starterkit-photobook-ui-react-web/archive/refs/heads/main.zip)
>
> - [View source on GitHub](https://github.com/imgly/starterkit-photobook-ui-react-web)
>
> - [Live demo](https://img.ly/docs/cesdk/examples/starterkit-photobook-ui/)

***

## Pre-requisites

This guide assumes basic familiarity with React and TypeScript.

- **Node.js v20+** with npm – [Download](https://nodejs.org/)
- **Supported browsers** – Chrome 114+, Edge 114+, Firefox 115+, Safari 15.6+<br />
  See [Browser Support](./browser-support.md) for the full list

***

## Get Started

Start fresh with a standalone Photobook Editor project. This creates a complete, ready-to-run application with a custom React-based interface.

## Step 1: Clone the Repository

<TerminalTabs>
  <TerminalTab label="git">
    git clone https://github.com/imgly/starterkit-photobook-ui-react-web.git
    cd starterkit-photobook-ui-react-web
  </TerminalTab>

  <TerminalTab label="degit">
    npx degit imgly/starterkit-photobook-ui-react-web starterkit-photobook-ui-react-web
    cd starterkit-photobook-ui-react-web
  </TerminalTab>
</TerminalTabs>

The `src/` folder contains the editor code:

```
src/
├── app/                          # Demo application
├── imgly/
│   ├── index.ts                  # Editor initialization function
│   ├── photobook-layouts.ts
│   ├── photobook-stickers.ts
│   └── utils/
│       ├── UnsplashSource.ts
│       ├── apply-layout.ts
│       ├── engine-utils.ts
│       └── loadAssetSourceFromContentJSON.ts
└── index.tsx                 # Application entry point
```

## Step 2: Install Dependencies

Install the required packages:

<TerminalTabs syncKey="package-manager">
  <TerminalTab label="npm">
    npm install
  </TerminalTab>

  <TerminalTab label="pnpm">
    pnpm install
  </TerminalTab>

  <TerminalTab label="yarn">
    yarn
  </TerminalTab>
</TerminalTabs>

## Step 3: Run the Development Server

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

***

## Key Capabilities

The Photobook Editor includes everything needed for photobook creation workflows.

<CapabilityGrid
  features={[
  {
    title: 'Theme Selector',
    description:
      'Allow users to personalize their photobook based on events or aesthetics with per-page theme support.',
    imageId: 'filters',
  },
  {
    title: 'Multi-Page Management',
    description:
      'Add, remove, and reorder pages with built-in layout templates for professional results.',
    imageId: 'text-editing',
  },
  {
    title: 'Placeholder Editing',
    description:
      'Built-in placeholders make adding and replacing photos effortless with click-to-upload.',
    imageId: 'transform',
  },
  {
    title: 'Asset Library',
    description:
      'Quickly add embellishments or brand elements using an extendable sticker library.',
    imageId: 'asset-libraries',
  },
  {
    title: 'Mobile-Friendly',
    description:
      'Responsive interface optimized for both desktop and mobile devices.',
    imageId: 'client-side',
  },
  {
    title: 'Export Options',
    description:
      'Export designs in high-resolution formats suitable for print or digital delivery.',
    imageId: 'green-screen',
  },
]}
/>

<br />

> **Free Trial:** [Sign up for a free trial](https://img.ly/forms/free-trial) to get a license key and remove the watermark.

***

## Troubleshooting

### Editor doesn't load

- **Check console errors**: Look for CORS or network errors in browser developer tools
- **Verify dependencies**: Ensure all npm packages are installed correctly

### Assets don't appear

- **Check network requests**: Open DevTools Network tab and look for failed requests
- **Verify baseURL**: Ensure the asset URL is accessible

### Watermark appears in production

- **Add your license key**: Set the `license` property in your configuration
- **Sign up for a trial**: Get a free trial license at [img.ly/forms/free-trial](https://img.ly/forms/free-trial)

***

## Next Steps

- [Configuration](./configuration.md) – Complete list of initialization options
- [Serve Assets](./serve-assets.md) – Self-host engine assets for production
- [Theming](./user-interface/appearance/theming.md) – Customize colors and appearance
- [Localization](./user-interface/localization.md) – Add translations and language support



---

## More Resources

- **[Electron Documentation Index](https://img.ly/docs/cesdk/electron.md)** - Browse all Electron documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./electron.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support