> This is one page of the CE.SDK Angular documentation. For a complete overview, see the [Angular Documentation Index](https://img.ly/angular.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Get Started](./get-started/overview.md) > [Quickstart Angular](./get-started/angular/new-project.md)

---

Learn how to integrate the CreativeEditor SDK (CE.SDK) Engine into an Angular
application in **headless mode** - without the default user interface. Use the
powerful CE.SDK Engine directly to programmatically create and edit designs.

<CesdkOverview />

## Who is This Guide For?

This guide is for developers who:

- Want to *build a custom UI* instead of using CE.SDK’s default interface.
- Need to use CE.SDK in *automation workflows*, without displaying a user-facing editor.
- Have already followed one of the [Getting Started with CE.SDK in Angular](./get-started/angular/new-project.md) tutorials and want to extend their integration.

## What You’ll Achieve

- Initialize CE.SDK’s headless engine inside an Angular component.
- Programmatically create and manipulate a scene.
- (Optionally) attach the CE.SDK canvas for rendering visuals while using your own controls.

## Prerequisites

- An existing Angular project set up with CE.SDK.
- Having completed the [Angular getting started guide](./get-started/angular/new-project.md).
- A valid **CE.SDK license key**.

## Step 1: Install the `cesdk/engine` package

In order to interact with CE.SDK in headless mode you need to include the *Creative Engine* install it via your package manager:

<Install />

## Step 2: Setup a CE.SDK Canvas Container

We are going to create a small application consisting of a button which reduces the opacity of an image by half on click.
In your Angular component’s HTML (for example, `custom-editor.component.html`):

```html title="custom-editor.component.html"
<div style="width: 100vw; height: 100vh; position: relative">
  <div #canvasRef style="width: 100%; height: 100%"></div>
  <div style="position: absolute; top: 20px; left: 20px">
    <button (click)="changeOpacity()">Reduce Opacity</button>
  </div>
</div>
```

## Step 3: Initialize CE.SDK Engine Programmatically

After initializing the Creative Engine, you have access to the scene which allows you to create elements and manipulate their properties, in this example we are adding a sample image to the scene.

The `changeOpacity` click handler simply retrieves this block by id and uses the block API to change its opacity.

In your component TypeScript file (for example, `custom-editor.component.ts`):

> **Warning:** **Important**: You must replace `'YOUR_LICENSE_KEY'` with your actual CE.SDK
> license key. The script will fail with initialization errors without a valid
> license key. [Get a free trial license key](https://img.ly/forms/free-trial).

```tsx title="custom-editor.component.ts"
import {
  AfterViewInit,
  Component,
  ElementRef,
  ViewChild,
  OnDestroy,
} from '@angular/core';
import CreativeEngine from '@cesdk/engine';

@Component({
  selector: 'app-custom-editor',
  templateUrl: './custom-editor.component.html',
  standalone: true,
  imports: [],
})
export class CustomEditorComponent implements AfterViewInit {
  @ViewChild('cesdkCanvas') canvasContainer!: ElementRef;
  private cesdk: CreativeEngine | null = null;
  private engine: any;
  private imageBlockId: number | undefined;

  ngAfterViewInit(): void {
    const config = {
      // license: 'YOUR_CESDK_LICENSE_KEY', // ⚠️ REPLACE WITH YOUR ACTUAL LICENSE KEY
    };

    CreativeEngine.init(config).then((engine: any) => {
      this.engine = engine;
      this.canvasContainer.nativeElement.append(engine.element);

      // Get the current scene or create a new one
      let scene = engine.scene.get();
      if (!scene) {
        scene = engine.scene.create();
        const page = engine.block.create('page');
        engine.block.appendChild(scene, page);
      }

      // Get the first page block
      const [page] = engine.block.findByType('page');

      // Append a block to show an image on the page
      const imageBlockId = engine.block.create('graphic');
      this.imageBlockId = imageBlockId;
      engine.block.setShape(imageBlockId, engine.block.createShape('rect'));

      // Fill the block with an image from a public source
      const imageFill = engine.block.createFill('image');
      engine.block.setSourceSet(imageFill, 'fill/image/sourceSet', [
        {
          uri: 'https://img.ly/static/ubq_samples/sample_1_1024x683.jpg',
          width: 1024,
          height: 683,
        },
      ]);
      engine.block.setFill(imageBlockId, imageFill);
      engine.block.appendChild(page, imageBlockId);

      // Zoom to fit the page in the editor view
      engine.scene.zoomToBlock(page);
    });
  }

  changeOpacity(): void {
    if (this.imageBlockId !== undefined) {
      const currentOpacity = this.engine.block.getOpacity(this.imageBlockId);
      this.engine.block.setOpacity(this.imageBlockId, currentOpacity * 0.8);
    }
  }

  ngOnDestroy(): void {
    if (this.cesdk) {
      this.cesdk.dispose();
    }
  }
}
```

## Step 4: Use the Custom Editor Component

Import `CustomEditorComponent` in the parent component file (for example, `app.component.ts`):

```ts title="app.component.ts"
// other imports...
import { CustomEditorComponent } from './custom-editor.component';

@Component({
  // other component metadata...
  imports: [CustomEditorComponent],
})
```

And use it in your `app.component.html`:

```html title="app.component.html"
<main>
  <~-- other content... --~>
  <app-custom-editor></app-custom-editor>
</main>
```

## Step 5: Serve the Angular Project Locally

Run the project locally via your **package manager**, using the following command:

<Run />

Or run it using the **Angular CLI**:

```bash
ng serve
```

By default, the Angular app runs on your localhost at `http://localhost:4200/`.

## Step 6: Test the Integration

1. Open `http://localhost:4200/` in your browser.
2. You should see:
   - A canvas showing the programmatically created image
   - A ”Reduce Opacity” button in the top-left corner (your custom UI)
   - No default editor interface or toolbars (this is headless mode)
3. Click the ”Reduce Opacity” button to test programmatic manipulation.

## Use Cases

Congratulations, you have taken the first step to be able to:

- Build *custom UIs* using Angular templates and CE.SDK’s canvas.
- Automate generation of graphics or marketing assets in-browser.
- Integrate CE.SDK into *multi-step creative workflows* with programmatic logic.

## Troubleshooting & Common Errors

**❌ Error**: `Cannot read property 'nativeElement' of undefined.`

- Ensure the `@ViewChild` selector matches your `#cesdkCanvas` reference.

**❌ Error**: `Invalid license key`

- Make sure your trial or production license key is correct and up to date.

**❌ CE.SDK canvas doesn’t render.**

- Make sure you are appending `engine.element` to a valid DOM container inside `ngAfterViewInit`.

## Next Steps

This guide sets the stage for:

- [Creating a full custom UI with Angular](./get-started/overview.md)
- [Exporting scenes programmatically](./export-save-publish/export/overview.md)
- [Batch processing graphics or templated content](./automation.md)



---

## More Resources

- **[Angular Documentation Index](https://img.ly/angular.md)** - Browse all Angular documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./angular.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support