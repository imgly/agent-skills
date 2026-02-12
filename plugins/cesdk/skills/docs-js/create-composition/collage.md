> This is one page of the CE.SDK Vanilla JS documentation. For a complete overview, see the [Vanilla JS Documentation Index](https://img.ly/js.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Create and Edit Compositions](./create-composition.md) > [Create a Collage](./create-composition/collage.md)

---

This guide shows you how to add a **Collage** feature in your web app with the help of the CE.SDK. A collage allows you to reuse images and assets as you change the layout of the scene.

<Picture src={demoCollage} style={{ width: '100%' }} alt="Example of a layout change in the demo app" formats={['webp']} />

> **Reading time:** 15 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/heads/main.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/blob/main/showcase-layouts/src/components/case/CaseComponent.jsx)
>
> - [Open in StackBlitz](https://stackblitz.com/fork/github/imgly/cesdk-web-examples/tree/main/showcase-layouts?title=IMG.LY+CE.SDK%3A+Layouts\&file=src%2Fcomponents%2Fcase%2FCaseComponent.jsx)
>
> - [Live demo](https://img.ly/showcases/cesdk/layouts/web)

**Layouts** in CE.SDK are predefined templates that dictate how to arrange images and assets within a single composition. They allow you to create visually appealing collages by specifying each image’s:

- Position
- Size
- Orientation relative to other assets on the page

Layouts instantly create visuals and allow you to skip manually arranging each asset.

## What You’ll Learn

In this guide, you will learn how to:

- Set up the layout panel in the CE.SDK UI.
- Use a layout file for collages.
- Use TypeScript to apply layouts in your custom UI.

## When to Use Layouts

The CE.SDK **Layout** feature is ideal for:

- Photo collages
- Grid layouts
- Magazine spreads
- Social media posts

## Difference Between Layouts and Templates

Layouts are [custom assets](./import-media/concepts.md) that differ from templates:

- **Templates:** Load **new assets** and replace the existing scene.
- **Layouts:** Keep existing assets but change their arrangement on the page.

Preserving assets while changing the layout **isn’t a native CE.SDK feature**. The following sections explain how to leverage the CE.SDK to do it in your app using JavaScript.

## How Collages Work

When you choose a collage layout, the app needs to:

1. Load a new layout file.
2. Extract content from your current design.
3. Map content to new layout positions.
4. Preserve images and text in visual order.

You trigger this workflow when a user selects a layout from the **Layouts** panel in the CE.SDK UI.

## Add a Layouts Panel to the CE.SDK UI

The CE.SDK allows you to add [custom panels to the UI](./user-interface/customization/panel.md). To add a **Layouts** panel for collage selection, you need to create it and load custom assets to configure its appearance and behavior.

For this action, you need:

1. A layout file defining the collage structure (use [this one](https://github.com/imgly/cesdk-web-examples/blob/main/showcase-layouts/src/components/case/CustomLayouts.json) to get started).
2. Thumbnail images for preview (find a collection [here](https://github.com/imgly/cesdk-web-examples/tree/main/showcase-layouts/public/cases/layouts)).

### 1. Add a Layouts Option to the CE.SDK Menu

To **customize the CE.SDK UI** and create a **Layouts** panel, use the CE.SDK UserInterfaceAPI. Add a Layout button with `ui.setComponentOrder({ in: 'ly.img.dock' }, order)`, using the following properties:

- `id`
- `key`
- `label`
- `icon`
- `entries`

For example:

```ts
cesdk.ui.setComponentOrder({ in: 'ly.img.dock' }, [
  {
    id: 'ly.img.assetLibrary.dock',
    key: 'layouts-dock-entry',
    label: 'Layouts',
    icon: '@imgly/Layout',
    entries: ['layouts'],
  },
]);
```

<Picture src={addLayoutsToUI} style={{ width: '80%' }} alt="Default dock vs. custom dock with layout option." formats={['webp']} />

### 2. Customize the Layouts Panel Appearance

To configure how the **Layouts** panel looks and behaves, use the `ui.addAssetLibraryEntry()` helper with the following options:

- `id`: Unique identifier for the panel.
- `sourceIds`: Which assets to display.
- `previewLength`: How many preview items to display in the panel.
- `gridColumns`: How many columns to contain the previews in the panel.
- `gridItemHeight`: The shape of each tile in the panel grid.
- `previewBackgroundType`: How to fit the previews inside their tiles (cover/contain).
- `gridBackgroundType`: How to display the panel background (cover/contain).

For example, the demo uses this configuration:

```jsx title="CustomCase.jsx"

instance.ui.addAssetLibraryEntry({
id: 'ly.img.layouts', // Referenced in the dock entry in Step 1
sourceIds: ['ly.img.layouts'], // Points to our custom layout asset source
previewLength: 2, // Number of preview items int the compact panel
gridColumns: 2, // Organize tiles in 2 columns
gridItemHeight: 'square', // Square tiles
previewBackgroundType: 'contain', // Fit compact panel background
gridBackgroundType: 'contain' // Fit panel background
});

```

<Picture src={panelLayout} style={{ width: '80%' }} alt="Default dock vs. custom dock with layout option." formats={['webp']} />

To learn more about panel customization, check the [Panel Customization guide](./user-interface/customization/panel.md).

### 3. Load Custom Assets

The demo uses a [helper function](https://github.com/imgly/cesdk-web-examples/blob/main/showcase-layouts/src/components/case/lib/loadAssetSourceFromContentJSON.ts) to load a custom layout asset source from a JSON file. This file defines the available layouts and their metadata. You can reuse this logic by defining both:

- A `ContentJSON` object (like `CustomLayouts.json`)
- A `baseURL` for your custom assets that replaces the `{{base_url}}`.

```jsx title="CustomCase.jsx"

import { createApplyLayoutAsset } from './lib/createApplyLayoutAsset';
import loadAssetSourceFromContentJSON from './lib/loadAssetSourceFromContentJSON';

// ...
const caseAssetPath = (path, caseId = 'layouts') =>
  `${process.env.NEXT_PUBLIC_URL_HOSTNAME}${process.env.NEXT_PUBLIC_URL}/cases/${caseId}${path}`;

// Call the helper to load the layout assets
 loadAssetSourceFromContentJSON(
      instance.engine, // Pss the CE.SDK engine to load assets into
      LAYOUT_ASSETS, // Pass the JSON bundle
      caseAssetPath(''), // Base URL for assets
      createApplyLayoutAsset(instance.engine) // Callback to createApplyLayoutAsset.js helper
    );
    await instance.loadFromURL(caseAssetPath('/custom-layouts.scene')); // Load the scene
// ...

```

In the previous example, the helper accepts an optional **applyAsset callback**, so:

1. A user picks a layout from the library.
2. The engine invokes the callback to apply it.
3. The engine replaces the current page’s structure with the layout while keeping the user’s images/text.

Asset preservation isn't a CE.SDK native feature. It’s handled in the `createApplyLayoutAsset.js` helper, which you can find in [the repository](https://github.com/imgly/cesdk-web-examples/blob/main/showcase-layouts/src/components/case/lib/createApplyLayoutAsset.js).

## Apply the Collage

When applying a collage, the following actions need to be implemented:

1. Changing the structure of the design.
2. Transferring the existing content to the new structure.
3. Deleting the previous scene.

You can find this workflow in the `createApplyLayoutAsset()` helper from the demo. Follow these steps to replicate it:

### 1. Prepare and Allow changes

- Allow block deletion with `editor.setGlobalScope('lifecycle/destroy', 'Allow')`.
- Clear the selected blocks with `block.setSelected(block, false)`.

```js title="createApplyLayoutAsset.js"

const scopeBefore = engine.editor.getGlobalScope('lifecycle/destroy');
engine.editor.setGlobalScope('lifecycle/destroy', 'Allow');
const page = engine.scene.getCurrentPage();
engine.block.findAllSelected().forEach((block) => engine.block.setSelected(block, false));

```

### 2. Load the New Layout

- Load the new layout with `block.loadFromString()`.
- Return the first page from the loaded blocks as the layout page.

```js title="createApplyLayoutAsset.js"

const sceneString = await fetch(asset.meta.uri).then((response) => response.text());
const blocks = await engine.block.loadFromString(sceneString);
const layoutPage = blocks[0];

```

### 3. Backup Current Page

- Duplicate the current page with `block.duplicate()` to keep a backup of the existing content.
- The CE.SDK uses this backup to transfer images and text to the new layout.
- Clear the current page structure by destroying all its children.

```js title="createApplyLayoutAsset.js"

const oldPage = engine.block.duplicate(page);
engine.block.getChildren(page).forEach((child) => {
  engine.block.destroy(child);
});
engine.block.getChildren(layoutPage).forEach((child) => {
  engine.block.insertChild(page, child, engine.block.getChildren(page).length);
});

```

### 4. Transfer Content

Copy user text and images onto the new layout:

```js title="createApplyLayoutAsset.js"

copyAssets(engine, oldPage, page);

```

### 5. Sort Blocks Visually and Pair Content

Grab text and image blocks from both pages in visual order (top to bottom, left to right):

```js title="createApplyLayoutAsset.js"

const fromChildren = visuallySortBlocks(engine, getChildrenTree(engine, fromPageId).flat());
const textsOnFromPage = fromChildren.filter((childId) => engine.block.getType(childId).includes('text'));
const imagesOnFromPage = fromChildren.filter((childId) => engine.block.getKind(childId) === 'image');
// same for toPageId -> textsOnToPage, imagesOnToPage

```

Then apply the content from the old page to the new layout by looping through the blocks:

<Tabs>
  <TabItem label="Step 1: Copy text content, font, color">
    ```js title="createApplyLayoutAsset.js"

    const fromText = engine.block.getString(fromBlock, 'text/text');
    const fromFontFileUri = engine.block.getString(fromBlock, 'text/fontFileUri');
    const fromTypeface = engine.block.getTypeface(fromBlock);
    engine.block.setFont(toBlock, fromFontFileUri, fromTypeface);
    const fromTextFillColor = engine.block.getColor(fromBlock, 'fill/solid/color');
    engine.block.setString(toBlock, 'text/text', fromText);
    engine.block.setColor(toBlock, 'fill/solid/color', fromTextFillColor);

    ```
  </TabItem>

  <TabItem label="Step 2: Copy images and placeholder behavior">
    ```js title="createApplyLayoutAsset.js"

    const fromImageFill = engine.block.getFill(fromBlock);
    const toImageFill = engine.block.getFill(toBlock);
    const fromImageFileUri = engine.block.getString(fromImageFill, 'fill/image/imageFileURI');
    engine.block.setString(toImageFill, 'fill/image/imageFileURI', fromImageFileUri);
    const fromImageSourceSets = engine.block.getSourceSet(fromImageFill, 'fill/image/sourceSet');
    engine.block.setSourceSet(toImageFill, 'fill/image/sourceSet', fromImageSourceSets);
    if (engine.block.supportsPlaceholderBehavior(fromBlock)) {
      engine.block.setPlaceholderBehaviorEnabled(
        toBlock,
        engine.block.isPlaceholderBehaviorEnabled(fromBlock)
      );
    }
    engine.block.resetCrop(toBlock);

    ```
  </TabItem>
</Tabs>

### 6. Cleanup and Restore State

Cleanup temporary blocks with `block.destroy()` and restore global scope:

```js title="createApplyLayoutAsset.js"
engine.block.destroy(oldPage);
engine.block.destroy(layoutPage);
engine.editor.setGlobalScope('lifecycle/destroy', scopeBefore);
if (config.addUndoStep) {
  engine.editor.addUndoStep();
}
return page;

```

This keeps the editor stable and predictable after the layout changes and prevents:

- Stray selections.
- Ghost placeholders.
- Unused assets left at the scene.

## Advanced Collage Techniques

<Tabs>
  <TabItem label="Keep Placeholder Behavior">
    The CE.SDK BlockAPI eases the transfer of [placeholder behavior](./create-templates/add-dynamic-content/placeholders.md) when moving images between blocks. You can use it to:

    1. Checks if the block supports placeholder behavior with `supportsPlaceholderBehavior`.
    2. Apply the same setting to the target image block with:

    - `isPlaceholderBehaviorEnabled()`
    - `setPlaceholderBehaviorEnabled()`

    ```js title="createApplyLayoutAsset.js"

    if (engine.block.supportsPlaceholderBehavior(fromBlock)) {
      engine.block.setPlaceholderBehaviorEnabled(
        toBlock,
        engine.block.isPlaceholderBehaviorEnabled(fromBlock),
      );
    }
    ```

    This maintains the behavior of current placeholders after the layout swap.
  </TabItem>

  <TabItem label="Distribute Content Evenly">
    To ensure the CE.SDK uses all the existing images when applying a layout, you can:

    1. Handle overflow when more images than slots:

    ```js title="createApplyLayoutAsset.js"

    for (
      let index = 0;
      index < imagesOnToPage.length && index < imagesOnFromPage.length;
      index++
    ) { ... }

    ```

    2. Fill empty slots with defaults or placeholders:

    ```js title="createApplyLayoutAsset.js"

    // loop condition ends when sources run out, leaving remaining target slots unchanged
    index < imagesOnToPage.length && index < imagesOnFromPage.length;

    ```

    3. List content by importance or metadata:

    ```js title="createApplyLayoutAsset.js"

    const visuallySortBlocks = (engine, blocks) => {
      const blocksWithCoordinates = blocks
        .map((block) => ({
          block,
          coordinates: [
            Math.round(engine.block.getPositionX(block)),
            Math.round(engine.block.getPositionY(block))
          ]
        }))
        .sort(({ coordinates: [X1, Y1] }, { coordinates: [X2, Y2] }) => {
          if (Y1 === Y2) return X1 - X2;
          return Y1 - Y2;
        });
      return blocksWithCoordinates.map(({ block }) => block);
    };

    ```
  </TabItem>

  <TabItem label="Animate Layout Transitions">
    For a better user experience, consider adding animations when applying layouts:

    ```tsx title="LoadingSpinner.tsx"
    const LoadingSpinner = () => {
      return <div className={styles.spinner} data-cy={'loading-spinner'}></div>;
    };
    ```

    You can code more customizations to incorporate these effects into collage transitions:

    - Fading
    - Sliding
    - Morphing
  </TabItem>
</Tabs>

## Optimize the Layout Workflow

For a better user experience when creating collages, consider these optimizations:

| Topic | Strategies |
| --- | --- |
| **Asset Loading** | ・ Lazy load thumbnails and cache scene files<br />・ Preload common layouts and minimize file sizes<br />・ Use CDN for efficient asset delivery |
| **Content Transfer** | ・ Batch block operations to reduce engine calls<br />・ Optimize sorting algorithms and memory usage<br />・ Handle large page structures efficiently |
| **Visual Cues** | ・ Show loading states and support undo/redo<br />・ Add error recovery and prevent accidental changes |

## Troubleshooting

| ❌ Issue | ✅ Solutions |
| --- | --- |
| Layout not applying | ・ Verify asset source registration and callback connection<br />・ Check browser console for scene files or CORS errors<br />・ Check the validity of scene file URLs |
| Content lost during layout change | ・ Debug visual sorting with console logs<br />・ Verify block type filtering is correct<br />・ Test with different content settings|
| Incorrect visual order | ・ Adjust coordinate rounding tolerance in sorting<br />・ Flatten complex hierarchies before sorting<br />・ Test with well-defined layout structures |
| Performance degradation | ・ Optimize scene file sizes<br />・ Batch engine operations<br />・ Profile and optimize content transfer |
| Undo not working | ・ Ensure `addUndoStep()` called after all changes complete<br />・ Verify undo configuration in engine setup |

## Next Steps

Now that know how to create collages with layouts, explore these related guides to expand your CE.SDK knowledge:

- [Apply Templates](./create-templates/overview.md) - Work with templates instead of layouts
- [Create Custom Asset Sources](./import-media/asset-panel/basics.md) - Import custom assets
- [Customize UI Panels](./user-interface/customization/panel.md) - Advanced UI customization
- [Work with Images](./insert-media/images.md) - Manage image blocks and fills
- [Scene Management](./open-the-editor/load-scene.md) - Load and save scenes



---

## More Resources

- **[Vanilla JS Documentation Index](https://img.ly/js.md)** - Browse all Vanilla JS documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./js.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support