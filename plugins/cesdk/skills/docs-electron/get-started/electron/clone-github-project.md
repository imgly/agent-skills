> This is one page of the CE.SDK Electron documentation. For a complete overview, see the [Electron Documentation Index](https://img.ly/electron.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

This guide walks you through cloning and running a preconfigured
**CreativeEditor SDK (CE.SDK)** Electron integration project from GitHub. It’s
the quickest way to get started with CE.SDK without needing to set everything
up from scratch.

## Who Is This Guide For?

This guide is for developers who:

- Want to **explore CE.SDK** without the need to configure a custom setup.
- Prefer working with a **ready-to-go Electron sample project**.
- Are familiar with using **Git** and **Node.js** for managing local development environments.

## What You’ll Achieve

- Clone the CE.SDK Electron integration project from GitHub.
- Install the necessary dependencies and run the project locally.
- Open a fully functional image and video editor right in your browser.

## Prerequisites

Before starting, make sure you have the following:

- **Git** - Required to clone the project repository. [Download Git](https://git-scm.com/downloads).
- **The latest LTS version of Node.js and npm**. [Download Node.js](https://nodejs.org/).
- A valid **CE.SDK license key** ([Get a free trial](https://img.ly/forms/free-trial)).

## Step 1: Clone the GitHub Repository

Clone the CE.SDK examples repository from GitHub:

```bash
git clone https://github.com/imgly/cesdk-web-examples.git
```

Then navigate to the Electron integration folder:

```bash
cd cesdk-web-examples/integrate-with-electron
```

## Step 2: Install the Dependencies

Install the required dependencies with npm:

```bash
npm install
```

This fetches and installs all the packages listed in the project’s `package.json` file.

## Step 3: Add Your CE.SDK License Key

Open the `index.html` file and replace the placeholder with your valid CE.SDK license key:

```js title="index.html"
const config = {
  // license: 'YOUR_CESDK_LICENSE_KEY', // Replace with your CE.SDK license key
  // ...
};
```

## Step 4: Run the Project

Start the Electron development server by running:

```bash
npm run dev
```

The application with CE.SDK integration opens in a native window provided by Electron.

## Troubleshooting & Common Issues

❌ **Error**: `'electron' is not recognized as an internal or external command, operable program or batch file.`

- Ensure you’ve successfully run `npm install` before attempting `npm run dev`.

❌ **Error**: `Invalid license key`

- Double-check that the license key is correctly added and valid.

## Next Steps

Congratulations! You’ve successfully set up CE.SDK with Electron. When you’re ready, explore the SDK further and move on to the next steps:

- [Configure the Creative Editor](./user-interface/overview.md)
- [Serve assets from your own servers](./serve-assets.md)
- [Create and use a license key](./licensing.md)
- [Configure callbacks](./actions.md)
- [Customize interface labels and translation](./user-interface/localization.md)
- [Edit colors and appearance with themes](./user-interface/appearance/theming.md)



---

## More Resources

- **[Electron Documentation Index](https://img.ly/electron.md)** - Browse all Electron documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./electron.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support