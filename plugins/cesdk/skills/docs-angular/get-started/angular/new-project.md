> This is one page of the CE.SDK Angular documentation. For a complete overview, see the [Angular Documentation Index](https://img.ly/angular.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Get Started](./get-started/overview.md) > [Quickstart Angular](./get-started/angular/new-project.md)

---

Follow this guide to set up a **new Angular project** with **npm**, and build
a reusable component to integrate the CreativeEditor SDK (CE.SDK). The result
is an Angular app with a complete image and video editor, ready for further
customization.

<CesdkOverview />

## Who is This Guide For?

This guide is for developers who:

- Are building or maintaining an **Angular app**.
- Want to integrate CE.SDK using **TypeScript and Angular component’s lifecycle**.
- Prefer installing the SDK via a package manager (npm, pnpm, yarn) and serving the UI inside a reusable Angular component.

## What You’ll Achieve:

- Set up a new Angular project.
- Install and configure **CE.SDK** using npm.
- Embed the editor in your component and launch it with configuration options.

## Prerequisites

Before getting started, ensure you have:

- **Node.js** (v20 or later) and **npm** installed.
- A valid **CE.SDK license key**.
- Angular CLI installed globally:

  ```bash
  npm install -g @angular/cli
  ```

````

## Step 1: Create a New Angular Project

Create a new Angular app (skip routing, Server Side Rendering, and use CSS or SCSS as preferred):

```bash
ng new cesdk-angular-app
cd cesdk-angular-app
````

## Step 2: Install CE.SDK via NPM

Install the SDK package:

```bash
npm install @cesdk/cesdk-js
```

### Step 3: Start the Angular Development Server

Run your app locally:

```bash
ng serve
```

Navigate to `http://localhost:4200/` and the starter Angular home page should appear.

## Step 4: Embed CE.SDK in a Component

### 1. Add Container Element

> **Note:** **📁 Which files to edit?*** [Angular 20+](https://blog.angular.dev/announcing-angular-v20-b5c9c06cf301): `app.html` and `app.ts`
> * **Angular 19** or below: `app.component.html` and `app.component.ts`

This guide uses Angular 20 and above, adjust the component names and paths in the code as needed.

In your IDE or from your terminal, open `src/app/app.html` and replace the contents with:

```html title="app.html"
<div #cesdk_container [style.height.vh]="'100'" [style.width.vw]="'100'"></div>
```

This provides a full-screen container for the editor.

### 2. Initialize the Editor in TypeScript

Open `src/app/app.ts` and replace the content with:

```tsx title="app.ts"
// Import Angular core features and CreativeEditor SDK
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import CreativeEditorSDK, { Configuration } from '@cesdk/cesdk-js';

// Define this class as an Angular component and sets seletor and styles
@Component({
  selector: 'app-root',
  templateUrl: './app.html', // Adjust based on your Angular version
  styleUrls: ['./app.css'], // Adjust based on your Angular version
})

// Run code after the component's vue is initialized
export class App implements AfterViewInit {
  // Replace App by AppComponent if using Angular 19 or below
  @ViewChild('cesdk_container') containerRef!: ElementRef;

  title = 'Integrate CreativeEditor SDK with Angular';

  // Initializes the CreativeEditor SDK after the view is ready
  ngAfterViewInit(): void {
    // Set CreativeEditor SDK configuration
    const config: Configuration = {
      // license: 'YOUR_CESDK_LICENSE_KEY', // Replace with your actual CE.SDK license key
      baseURL: `https://cdn.img.ly/packages/imgly/cesdk-js/${CreativeEditorSDK.version}/assets`,
      callbacks: {
        onUpload: 'local',
      },
    };
    // Create the editor inside the DOM element
    CreativeEditorSDK.create(this.containerRef.nativeElement, config).then(
      async (instance: any) => {
        // Add default and demo asset sources
        await instance.addDefaultAssetSources();
        await instance.addDemoAssetSources({ sceneMode: 'Design' });
        // Create a new design scene in the editor
        await instance.createDesignScene();
      },
    );
  }
}
```

> **Warning:** Replace `YOUR_LICENSE_KEY` with your actual CE.SDK license key.

### Components Paths

If you decide to generate [Angular components](https://v17.angular.io/guide/component-overview), update the file paths and imports accordingly.

> **Note:** For convenience, the SDK loads all **assets** (for example, images, stickers,
> fonts etc.) from the CDN by default. For **production use**, we recommend
> [serving assets from your own servers](./serve-assets.md).

## Step 4: Check the Editor

Navigate to `http://localhost:4200/` and in place of the previous demo home page, the CE.SDK editor should appear fullscreen inside your Angular app.

## Troubleshooting & Common Errors

**❌ Error: `Cannot read property 'nativeElement' of undefined`**

- Ensure `@ViewChild('cesdk_container')` matches the `#cesdk_container` element in your template.

**❌ Error: `license key is invalid`**

- Make sure your trial or production license key is correct and up to date.

**❌ CE.SDK assets not loading**

- Check network requests. Ensure you allow access to `cdn.img.ly`.

## Next Steps

You’ve successfully integrated **CE.SDK into Angular**. Now explore:

- [Customize the Editor UI](./user-interface/overview.md)
- [Serve assets from your own servers](./serve-assets.md)
- [Use Callbacks and Events](./actions.md)
- [Customize interface labels and translations](./user-interface/localization.md)
- [Theme the Editor](./user-interface/appearance/theming.md)



---

## More Resources

- **[Angular Documentation Index](https://img.ly/angular.md)** - Browse all Angular documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./angular.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support