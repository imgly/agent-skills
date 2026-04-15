> This is one page of the CE.SDK Electron documentation. For a complete overview, see the [Electron Documentation Index](https://img.ly/docs/cesdk/electron.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Starter Kits](./starterkits.md) > [Custom Built UIs](./starterkits/custom-built-uis.md) > [Postcard UI](./starterkits/postcard-editor.md)

---

Built to facilitate optimal post- and greeting-card design, from changing accent colors and selecting fonts to custom messages and pictures.

![Postcard UI starter kit showing a greeting card design interface](https://img.ly/docs/cesdk/./assets/browser.hero.webp)

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/starterkit-postcard-ui-react-web/archive/refs/heads/main.zip)
>
> - [View source on GitHub](https://github.com/imgly/starterkit-postcard-ui-react-web)
>
> - [Live demo](https://img.ly/docs/cesdk/examples/starterkit-postcard-ui/)

***

## Pre-requisites

This guide assumes basic familiarity with React and TypeScript.

- **Node.js v20+** with npm – [Download](https://nodejs.org/)
- **Supported browsers** – Chrome 114+, Edge 114+, Firefox 115+, Safari 15.6+<br />
  See [Browser Support](./browser-support.md) for the full list

***

## Get Started

Start fresh with a standalone Postcard Editor project. This creates a complete, ready-to-run application with a custom React-based interface.

## Step 1: Clone the Repository

<TerminalTabs>
  <TerminalTab label="git">
    git clone https://github.com/imgly/starterkit-postcard-ui-react-web.git
    cd starterkit-postcard-ui-react-web
  </TerminalTab>

  <TerminalTab label="degit">
    npx degit imgly/starterkit-postcard-ui-react-web starterkit-postcard-ui-react-web
    cd starterkit-postcard-ui-react-web
  </TerminalTab>
</TerminalTabs>

The `src/` folder contains the editor code:

```
src/
├── app/                          # Demo application
├── imgly/
│   ├── CreativeEditor.tsx
│   ├── CreativeEngine.tsx
│   ├── PremiumTemplateUtilities.ts
│   ├── contexts/
│   │   ├── EngineContext.tsx
│   │   ├── SelectionContext.tsx
│   │   └── SinglePageModeContext.tsx
│   ├── createApplyLayoutAsset.js
│   ├── hooks/
│   │   ├── UseEditMode.ts
│   │   ├── UseHistory.ts
│   │   ├── UseImageUpload.ts
│   │   ├── UseSelectedProperty.ts
│   │   └── UseSinglePageFocus.ts
│   ├── index.ts                  # Editor initialization function
│   ├── loadAssetSourceFromContentJSON.ts
│   ├── localDownload.ts
│   ├── postcard-catalog.ts
│   └── utils/
│       ├── ColorUtilities.ts
│       ├── CreativeEngineUtils.js
│       └── UnsplashSource.ts
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

The Postcard Editor includes everything needed for postcard creation workflows.

<CapabilityGrid
  features={[
  {
    title: 'Style Presets',
    description:
      'Professionally crafted postcard templates to jump-start the design process.',
    imageId: 'filters',
  },
  {
    title: 'Design Mode',
    description:
      'Full editing capabilities including color changes, photo replacement, and text editing.',
    imageId: 'transform',
  },
  {
    title: 'Write Mode',
    description:
      'Personal message composition with font, size, and color customization.',
    imageId: 'text-editing',
  },
  {
    title: 'Dynamic Variables',
    description:
      'Support for personalization variables for batch generation.',
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
      'Export designs in high-resolution, print-friendly formats.',
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