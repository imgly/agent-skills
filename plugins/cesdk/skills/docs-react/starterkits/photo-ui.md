> This is one page of the CE.SDK React documentation. For a complete overview, see the [React Documentation Index](https://img.ly/docs/cesdk/react.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Starter Kits](./starterkits.md) > [Custom Built UIs](./starterkits/custom-built-uis.md) > [Photo UI](./starterkits/photo-ui.md)

---

Photo UI is equipped with advanced photo editing options while remaining easy and intuitive to use. Try the demo and see for yourself.

![Photo UI starter kit showing a professional photo editing interface](https://img.ly/docs/cesdk/./assets/browser.hero.webp)

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/starterkit-photo-ui-react-web/archive/refs/heads/main.zip)
>
> - [View source on GitHub](https://github.com/imgly/starterkit-photo-ui-react-web)
>
> - [Live demo](https://img.ly/docs/cesdk/examples/starterkit-photo-ui/)

***

## Pre-requisites

This guide assumes basic familiarity with React and TypeScript.

- **Node.js v20+** with npm – [Download](https://nodejs.org/)
- **Supported browsers** – Chrome 114+, Edge 114+, Firefox 115+, Safari 15.6+<br />
  See [Browser Support](./browser-support.md) for the full list

***

## Get Started

Start fresh with a standalone Photo Editor project. This creates a complete, ready-to-run application with a custom React-based interface.

## Step 1: Clone the Repository

<TerminalTabs>
  <TerminalTab label="git">
    git clone https://github.com/imgly/starterkit-photo-ui-react-web.git
    cd starterkit-photo-ui-react-web
  </TerminalTab>

  <TerminalTab label="degit">
    npx degit imgly/starterkit-photo-ui-react-web starterkit-photo-ui-react-web
    cd starterkit-photo-ui-react-web
  </TerminalTab>
</TerminalTabs>

The `src/` folder contains the editor code:

```
src/
├── app/                          # Demo application
├── imgly/
│   ├── engine-utils.ts
│   ├── hooks/
│   │   ├── useSelectedProperty.ts
│   │   └── useSinglePageFocus.ts
│   ├── index.ts                  # Editor initialization function
│   └── upload.ts
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

The Photo Editor includes everything needed for professional photo editing.

<CapabilityGrid
  features={[
  {
    title: 'Professional Filters',
    description:
      'Apply color grading with LUT filters, duotone effects, and customizable presets.',
    imageId: 'filters',
  },
  {
    title: 'Color Adjustments',
    description:
      'Fine-tune brightness, contrast, saturation, and more with professional controls.',
    imageId: 'green-screen',
  },
  {
    title: 'Cropping & Transform',
    description:
      'Crop, rotate, and transform images with precise controls and aspect ratio presets.',
    imageId: 'transform',
  },
  {
    title: 'Text & Overlays',
    description:
      'Add styled text with font selection, plus shapes and stickers from the asset library.',
    imageId: 'text-editing',
  },
  {
    title: 'Responsive Design',
    description:
      'Interface optimized for both desktop and mobile devices with adaptive layouts.',
    imageId: 'client-side',
  },
  {
    title: 'Export Options',
    description:
      'Export as PNG or JPEG with configurable quality and resolution settings.',
    imageId: 'asset-libraries',
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

- **[React Documentation Index](https://img.ly/docs/cesdk/react.md)** - Browse all React documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./react.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support