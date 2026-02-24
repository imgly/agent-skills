> This is one page of the CE.SDK Vanilla JS/TS documentation. For a complete overview, see the [Vanilla JS/TS Documentation Index](https://img.ly/js.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

This guide walks you through downloading and running a prebuilt
**CreativeEditor SDK (CE.SDK)** integration project hosted on GitHub. It’s the
fastest way to explore how CE.SDK works without building anything from
scratch.

## Who Is This Guide For?

This guide is for developers who:

- Want to **try out CE.SDK** without setting up a custom environment.
- Prefer working with an existing **template or sample project**.
- Are comfortable using Git and Node.js to set up local projects.

## What You’ll Achieve

- Clone a working CE.SDK integration project from GitHub.
- Install dependencies and run the project locally.
- Launch a functional editor in your browser.

## Prerequisites

Before getting started, ensure you have the following installed:

- **Git** – Used to clone the GitHub repository. [Download Git](https://git-scm.com/downloads).
- **Node.js** (v14 or higher) and **npm** – Required to run the local server. [Download Node.js](https://nodejs.org/).
- A valid **CE.SDK license key** ([Get a free trial](https://img.ly/forms/free-trial)).

## Step 1: Clone the GitHub Repository

First, clone the CE.SDK examples repository from GitHub:

<Tabs syncKey="code-language">
  <TabItem label="Git">
    `bash git clone https://github.com/imgly/cesdk-web-examples.git `
  </TabItem>

  <TabItem label="GitHub CLI">
    `bash gh repo clone imgly/cesdk-web-examples `
  </TabItem>
</Tabs>

Then navigate to the Vanilla JS integration folder:

```bash
cd cesdk-web-examples/integrate-with-vanilla-js
```

<br />

> **Warning:** **Warning:** The full `cesdk-web-examples` repository has a size of
> approximately 1 GB. Ensure you have a reliable internet connection before
> cloning. Any download interruption may result in a `fatal: early EOF` error,
> and require restarting the clone process.

## Step 2: Install Dependencies

Once inside the project directory, install the necessary packages using npm:

```bash
npm install
```

This will download all required modules as defined in the project’s `package.json`.

## Step 3: Add Your License Key

Open `index.js` and replace the placeholder license key with your valid one.

```js
const config = {
  // license: 'YOUR_CESDK_LICENSE_KEY',  // Replace with your CE.SDK license key
  ...
};

```

## Step 4: Run the Project

Now you can run your project locally using your preferred bundler such as Webpack, Rollup, Parcel, or Vite. This example uses [Vite](https://vite.dev/).

To start the Vite development server, run:

```bash
npm run dev
```

By default, the app runs on localhost at `http://localhost:5173/`.

## Troubleshooting & Common Issues

**❌ `Module not found` or missing packages**

- Double-check that you ran `npm install` successfully and there are no errors.

**❌ `Invalid license key`**

- Make sure the license key is correctly added and valid.

## Next Steps

Congratulations! You’ve got CE.SDK up and running. Get to know the SDK and dive into the next steps, when you’re ready:

- [Perform basic configuration](./user-interface/overview.md)
- [Configure the Callbacks](./actions.md)
- [Serve assets from your own servers](./serve-assets.md)
- [Add localization](./user-interface/localization.md)
- [Adapt the user interface](./user-interface/appearance/theming.md)



---

## More Resources

- **[Vanilla JS/TS Documentation Index](https://img.ly/js.md)** - Browse all Vanilla JS/TS documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./js.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support