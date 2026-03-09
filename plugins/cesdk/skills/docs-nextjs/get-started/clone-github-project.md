> This is one page of the CE.SDK Next.js documentation. For a complete overview, see the [Next.js Documentation Index](https://img.ly/nextjs.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

Download a prebuilt CreativeEditor SDK (CE.SDK) integration project using
Next.js from GitHub, and run it locally. It’s the quickest way to get started
with CE.SDK—no need to configure everything from the ground up.

> **Reading time:** 5 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/heads/main.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples)
>
> - [Open in StackBlitz](https://stackblitz.com/~/github.com/imgly/cesdk-web-examples)

<CesdkOverview />

## Who Is This Guide For?

This guide is for developers who:

- Want to explore CE.SDK while skipping a custom setup.
- Prefer using a ready-to-go Next.js project.
- Have experience with Git and Node.js for setting up local development environments.

## What You’ll Achieve

- Clone the CE.SDK Next.js integration project from GitHub.
- Set up the project by installing the necessary dependencies and running it locally with **npm**.
- Open a fully functional image and video editor right in your browser.

## Prerequisites

Before you begin, ensure you have the following tools:

- **Git**: Used to clone the project from GitHub. [Download Git](https://git-scm.com/downloads).
- **The latest LTS version of Node.js and npm**: Essential for installing dependencies and running the local development server. [Download Node.js](https://nodejs.org/).
- A valid **CE.SDK license key** ([Get a free trial](https://img.ly/forms/free-trial)).

## Step 1: Clone the GitHub Repository

Clone the CE.SDK examples repository from GitHub:

```bash
git clone https://github.com/imgly/cesdk-web-examples.git
```

Then navigate to the Next.js integration folder:

```bash
cd cesdk-web-examples/integrate-with-next-js
```

## Step 2: Install the Dependencies

Install the required dependencies listed in the `package.json` file using npm:

```bash
npm install
```

## Step 3: Add Your License Key

Open the CE.SDK editor component file (located at `/app/components/CreativeEditorSDK.js`), and replace the placeholder license key with your actual one:

```jsx title="CreativeEditorSDK.js"
const config = {
  // license: '<YOUR_CE_SDK_LICENSE>', // Replace with your CE.SDK license key
  // ...
};
```

## Step 4: Run the Project

Start the local development server with:

```bash
npm run dev
```

The Next.js app runs by default on `http://localhost:3000/`. Open the URL in your browser to see the Creative Editor in action.

## Troubleshooting & Common Issues

**❌ Error**: `'next' is not recognized as an internal or external command, operable program or batch file.`

- Make sure to run `npm install` **before** executing `npm run dev`.

**❌ Error**: `Editor engine could not be loaded: The License Key (API Key) you are using to access CE.SDK is invalid`

- Verify that your CE.SDK license key is correct, hasn’t expired, and you've properly added it to the [object](./get-started/clone-github-project-m6567s/#step-3-add-your-license-key.md).

**❌ Issue**: the editor isn’t showing up

- Check the terminal for any server-side errors.
- Inspect the browser console for specific error messages that can help identify the issue.

## Next Steps

You’ve successfully set up CE.SDK with Next.js. When you're ready, explore the SDK further and move on to the next steps:

- [Configure the Creative Editor](./user-interface/overview.md)
- [Serve assets from your own servers](./serve-assets.md)
- [Customize interface labels and translations](./user-interface/localization.md)
- [Edit colors and appearance with themes](./user-interface/appearance/theming.md)



---

## More Resources

- **[Next.js Documentation Index](https://img.ly/nextjs.md)** - Browse all Next.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./nextjs.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support