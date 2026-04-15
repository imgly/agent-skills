> This is one page of the CE.SDK React documentation. For a complete overview, see the [React Documentation Index](https://img.ly/docs/cesdk/react.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Starter Kits](./starterkits.md) > [Custom Built UIs](./starterkits/custom-built-uis.md) > [Mobile UI](./starterkits/mobile-ui.md)

---

Easily build custom mobile UIs and provide a seamless design editing experience for your users, on both iOS and Android.

![Mobile UI starter kit showing a touch-friendly photo editing interface](https://img.ly/docs/cesdk/./assets/browser.hero.webp)

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/starterkit-mobile-ui-react-web/archive/refs/heads/main.zip)
>
> - [View source on GitHub](https://github.com/imgly/starterkit-mobile-ui-react-web)
>
> - [Live demo](https://img.ly/docs/cesdk/examples/starterkit-mobile-ui/)

***

## Pre-requisites

This guide assumes basic familiarity with React and TypeScript.

- **Node.js v20+** with npm – [Download](https://nodejs.org/)
- **Supported browsers** – Chrome 114+, Edge 114+, Firefox 115+, Safari 15.6+<br />
  See [Browser Support](./browser-support.md) for the full list

***

## Get Started

Start fresh with a standalone Mobile Editor project. This creates a complete, ready-to-run application with a custom React-based interface.

## Step 1: Clone the Repository

<TerminalTabs>
  <TerminalTab label="git">
    git clone https://github.com/imgly/starterkit-mobile-ui-react-web.git
    cd starterkit-mobile-ui-react-web
  </TerminalTab>

  <TerminalTab label="degit">
    npx degit imgly/starterkit-mobile-ui-react-web starterkit-mobile-ui-react-web
    cd starterkit-mobile-ui-react-web
  </TerminalTab>
</TerminalTabs>

The `src/` folder contains the editor code:

```
src/
├── app/                          # Demo application
├── imgly/
│   ├── ColorUtilities.ts
│   ├── CreativeEngineUtils.ts
│   ├── index.ts                  # Editor initialization function
│   ├── upload.ts
│   └── utils.ts                  # Utility functions
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

The Mobile Editor includes everything needed for mobile-first photo editing.

<CapabilityGrid
  features={[
  {
    title: 'Touch-Optimized',
    description:
      'Carefully designed touch targets, gestures, and interactions for mobile users.',
    imageId: 'client-side',
  },
  {
    title: 'Photo Editing',
    description:
      'Complete toolkit with filters, adjustments, cropping, and color customization.',
    imageId: 'filters',
  },
  {
    title: 'Text & Shapes',
    description:
      'Add styled text with font selection, plus shapes and stickers from the asset library.',
    imageId: 'text-editing',
  },
  {
    title: 'Guided Workflow',
    description:
      'Step-by-step editing process with intuitive navigation between editing modes.',
    imageId: 'transform',
  },
  {
    title: 'Asset Management',
    description:
      'Integrated image library, custom sticker collection, and user upload support.',
    imageId: 'asset-libraries',
  },
  {
    title: 'Export Options',
    description:
      'Export designs as PNG with configurable quality and resolution settings.',
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

- **[React Documentation Index](https://img.ly/docs/cesdk/react.md)** - Browse all React documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./react.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support