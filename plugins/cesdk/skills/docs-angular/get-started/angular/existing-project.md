> This is one page of the CE.SDK Angular documentation. For a complete overview, see the [Angular Documentation Index](https://img.ly/angular.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Get Started](./get-started/overview.md) > [Quickstart Angular](./get-started/angular/new-project.md)

---

Follow the steps to integrate the CreativeEditor SDK (CE.SDK) into an
**existing Angular app**. Learn how to create an editor component that
correctly initializes and disposes of CE.SDK resources.

<CesdkOverview />

## Who is This Guide For?

This guide is for developers who:

- Already work on an **existing Angular codebase**.
- Want to add CE.SDK for design or media editing capabilities.
- Want to integrate the Creative Editor within a reusable Angular component.

## What You’ll Achieve

- Add CE.SDK to an existing Angular project.
- Embed the editor within a component.
- Load the editor with a default configuration and run it locally.

## Prerequisites

Before you begin, make sure your project has:

- Angular (v12 or later).
- Node.js (v20 or later).
- A valid **CE.SDK license key**.

## Step 1: Install CE.SDK

From your Angular project root, install CE.SDK with your preferred package manager:

<Install />

## Step 2: Add a CE.SDK Container to Your Component

Choose the component where you want to integrate CE.SDK (for example, `app.component` or any feature component).

### Style the editor:

Choose where to integrate CE.SDK:

- In a `.component.html`
- In `a .component.ts` file if you're using [Angular inline template](https://angular.dev/guide/templates):

<Tabs syncKey="code-language">
  <TabItem label=".component.html">
    ```html title=".component.html"
    <div #cesdk_container [style.height.vh]="'100'" [style.width.vw]="'100'"></div>
    ```
  </TabItem>

  <TabItem label=".component.ts">
    Add the following imports and properties at the top of your file:

    ```tsx title="app.component.ts"
    import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
    import CreativeEditorSDK, { Configuration } from '@cesdk/cesdk-js';

    @Component({
      selector: 'app-editor', // Adjust as needed
      template: `
        <div class="journal-editor-container">
          <div #cesdk_container style="height: 600px; width: 100%;"></div>
        </div>
        `,
      styleUrls: ['./editor.component.css'], // Adjust as needed
      standalone: true,
    })
    ```
  </TabItem>
</Tabs>

This sets up a full-viewport container for the editor.

## Step 3: Initialize CE.SDK in the Component Logic

### In the TypeScript file `.component.ts`:

<Tabs syncKey="code-language">
  <TabItem label="Not using Angular inline templates">
    If you separate HTML from the component logic, add this to your `.component.ts`:

    ```tsx title="app.component.ts"
    import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
    import CreativeEditorSDK, { Configuration } from '@cesdk/cesdk-js';

    @Component({
      selector: 'app-editor', // Adjust as needed
      templateUrl: './app.component.html',
      styleUrls: ['./styles.css'], // Adjust as needed
    })
    export class EditorComponent implements AfterViewInit {
      @ViewChild('cesdk_container') containerRef!: ElementRef;

      ngAfterViewInit(): void {
        const config: Configuration = {
          // license: 'YOUR_CESDK_LICENSE_KEY', // Replace with your actual CE.SDK license key
          baseURL: `https://cdn.img.ly/packages/imgly/cesdk-js/${CreativeEditorSDK.version}/assets`,
          callbacks: {
            onUpload: 'local',
          },
        };

        CreativeEditorSDK.create(this.containerRef.nativeElement, config).then(
          async (instance: any) => {
            instance.addDefaultAssetSources();
            instance.addDemoAssetSources({ sceneMode: 'Design' });
            await instance.createDesignScene();
          },
        );
      }
    }
    ```

    **Remember to:**

    - Replace `YOUR_LICENSE_KEY` with your **actual CE.SDK license key**
    - Adjust the `styleUrls` property to match your project’s structure
    - Adjust the `selector` property to match your component’s name
  </TabItem>

  <TabItem label="Using Angular inline templates">
    After adding the properties in Step 2, add this to your `.component.ts`:

    ```tsx title="app.component.ts"
    // imports
    // properties

    export class EditorComponent implements AfterViewInit {
      @ViewChild('cesdk_container') containerRef!: ElementRef;

      ngAfterViewInit(): void {
        const config: Configuration = {
          // license: 'YOUR_CESDK_LICENSE_KEY', // Replace with your actual CE.SDK license key
          baseURL: `https://cdn.img.ly/packages/imgly/cesdk-js/${CreativeEditorSDK.version}/assets`,
          callbacks: {
            onUpload: 'local',
          },
        };

        CreativeEditorSDK.create(this.containerRef.nativeElement, config).then(
          async (instance: any) => {
            instance.addDefaultAssetSources();
            instance.addDemoAssetSources({ sceneMode: 'Design' });
            await instance.createDesignScene();
          },
        );
      }
    }
    ```

    Your final file should look like this:

    ```tsx title="app.component.ts"
    import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
    import CreativeEditorSDK, { Configuration } from '@cesdk/cesdk-js';

    @Component({
      selector: 'app-editor', // Adjust as needed
      template: `
        <div class="journal-editor-container">
          <div #cesdk_container style="height: 600px; width: 100%;"></div>
        </div>
      `,
      styleUrls: ['./styles.css'], // Adjust as needed
      standalone: true, // Adjust as needed
    })
    export class EditorComponent implements AfterViewInit {
      @ViewChild('cesdk_container') containerRef!: ElementRef;

      ngAfterViewInit(): void {
        const config: Configuration = {
          // license: 'YOUR_CESDK_LICENSE_KEY', // Replace with your actual CE.SDK license key
          baseURL: `https://cdn.img.ly/packages/imgly/cesdk-js/${CreativeEditorSDK.version}/assets`,
          callbacks: {
            onUpload: 'local',
          },
        };

        CreativeEditorSDK.create(this.containerRef.nativeElement, config).then(
          async (instance: any) => {
            instance.addDefaultAssetSources();
            instance.addDemoAssetSources({ sceneMode: 'Design' });
            await instance.createDesignScene();
          },
        );
      }
    }
    ```

    **Remember to:**

    - Replace `YOUR_LICENSE_KEY` with your actual CE.SDK license key
    - Adjust the `styleUrls` property to match your project’s structure
    - Adjust the `selector` property to match your component’s name
    - Set standalone: `true` if you want to use this component as a standalone component, or `false` if you want to use it as part of a module.
  </TabItem>
</Tabs>

### Setup Notice

> **Note:** For convenience, the SDK loads all **assets** (for example, images, stickers,
> fonts etc.) from the CDN by default. For **production use**, we recommend
> [serving assets from your own servers](./serve-assets.md).

## Step 4: Serve the Project

Start your Angular app as usual:

```bash
ng serve

```

Then navigate to `http://localhost:4200/` and you should see CE.SDK loaded in your chosen component.

## Troubleshooting & Common Errors

**❌ Error: `Cannot read property 'nativeElement' of undefined`**

- Ensure `@ViewChild('cesdk_container')` matches the `#cesdk_container` element in your template.

**❌ Error: `license key is invalid`**

- Make sure your trial or production license key is correct and up to date.

**❌ CE.SDK assets not loading**

- Check network requests. Ensure you allow access to `cdn.img.ly`.

## Next Steps

You’ve successfully integrated **CE.SDK into your existing Angular project**! Here’s what you can do next:

- [Customize the UI](./user-interface.md)
- [Add Localization Support](./user-interface/localization.md)
- [Use Theming and Styling](./user-interface/appearance/theming.md)
- [Configure Callbacks & Asset Libraries](./actions.md)



---

## More Resources

- **[Angular Documentation Index](https://img.ly/angular.md)** - Browse all Angular documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./angular.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support