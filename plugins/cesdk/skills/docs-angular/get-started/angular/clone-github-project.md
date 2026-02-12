> This is one page of the CE.SDK Angular documentation. For a complete overview, see the [Angular Documentation Index](https://img.ly/angular.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Get Started](./get-started/overview.md) > [Quickstart Angular](./get-started/angular/new-project.md)

---

Download and run a **pre-built** CreativeEditor SDK (CE.SDK) Angular project
from GitHub. It’s the quickest way to get started with CE.SDK **without having
to build anything from scratch**.

> **Reading time:** 10 minutes
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

This guide is intended for developers who:

- Want to explore CE.SDK without setting up a custom environment.
- Prefer starting with a **pre-configured Angular sample project**.
- Are comfortable with **Git** and **Node.js** in local development.

## What You’ll Achieve

By following this tutorial, you will:

- Clone the CE.SDK Angular integration project from **GitHub**.
- Install the necessary dependencies and run the project locally.
- Launch a fully functional image and video editor directly in your browser.

## Prerequisites

Before you get started, ensure you have the following:

- A **cloning** method (Git, GitHub CLI, or `npx`).
- **The latest LTS version of Node.js and npm**: Necessary for installing dependencies and running the local server. [Download Node.js](https://nodejs.org/).
- A valid **CE.SDK license key**.

## Step 1: Clone the GitHub Repository

First, clone the CE.SDK examples repository from GitHub:

> **Note:** Since this is a large repository, the cloning process can be slow depending on
> your network. The following steps include alternative methods to clone faster.

<Tabs>
  <TabItem label="Git">
    ```bash
    git clone https://github.com/imgly/cesdk-web-examples.git
    ```

    <details>
      <summary>Clone taking too long?</summary>

      Try a shallow clone instead:

      ```bash
      git clone --depth=1 --branch main --single-branch https://github.com/imgly/cesdk-web-examples.git
      ```
    </details>

    Then navigate to the Angular integration folder:

    ```bash
    cd cesdk-web-examples/integrate-with-angular
    ```
  </TabItem>

  <TabItem label="GitHub CLI">
    ```bash
    gh repo clone imgly/cesdk-web-examples
    ```

    <details>
      <summary>Clone taking too long?</summary>

      Try a shallow clone instead:

      ```bash
      gh repo clone imgly/cesdk-web-examples -- --depth=1 --branch main --single-branch imgly/cesdk-web-examples
      ```
    </details>

    Then navigate to the Angular integration folder:

    ```bash
    cd cesdk-web-examples/integrate-with-angular
    ```
  </TabItem>

  <TabItem label="npx">
    Use `npx degit` to clone only the Angular integration example:

    ```bash
    npx degit https://github.com/imgly/cesdk-web-examples/integrate-with-angular
    ```
  </TabItem>
</Tabs>

## Step 2: Install the Dependencies

Install the project’s dependencies using npm:

```bash
npm install
```

This command downloads and installs all the packages listed in the `package.json` file.

## Step 3: Set Your CE.SDK License Key

Open the `src/app/app.component.ts` file and replace the placeholder license key with your **valid CE.SDK license**:

```ts title="app.component.ts"
const config: Configuration = {
  // license: '<YOUR_CE_SDK_LICENSE>, // Replace with your CE.SDK license key
  // ...
};
```

## Step 4: Run the Project

Start the local Angular development server with:

```bash
npm run start
```

By default, the Angular application runs locally at `http://localhost:4200/`. Open this URL in your browser to see the creative editor in action.

## Troubleshooting & Common Issues

**❌ Error**: `Could not find the '@angular-devkit/build-angular:dev-server' builder's node package.`

- Double-check that you ran `npm install` before executing `npm run start`.

**❌ Error**: `Editor engine could not be loaded: The License Key (API Key) you are using to access CE.SDK is invalid`

- Verify that your CE.SDK license key is valid, hasn’t expired, and has been correctly assigned to the `CreativeEditor` component’s props.

**❌ Issue**: The editor doesn’t load

- Check the browser console for any error messages that may provide more details.

## Next Steps

Congratulations! You’ve successfully integrated CE.SDK with Angular. Now, feel free to explore the SDK and proceed to the next steps:

- [Configure the Creative Editor](./configuration.md)
- [Serve assets from your own servers](./serve-assets.md)
- [Customize interface labels and translations](./user-interface/localization.md)
- [Edit colors and appearance with themes](./user-interface/appearance/theming.md)



---

## More Resources

- **[Angular Documentation Index](https://img.ly/angular.md)** - Browse all Angular documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./angular.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support