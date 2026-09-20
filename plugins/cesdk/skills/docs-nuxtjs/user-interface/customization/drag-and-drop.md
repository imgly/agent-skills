> This is one page of the CE.SDK Nuxt.js documentation. For a complete overview, see the [Nuxt.js Documentation Index](https://img.ly/docs/cesdk/nuxtjs.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [User Interface](./user-interface.md) > [Customization](./user-interface/customization.md) > [Drag & Drop](./user-interface/customization/drag-and-drop.md)

---

```typescript file=@cesdk_web_examples/engine-guides-drag-and-drop/DragAndDrop.ts reference-only
import CreativeEngine from '@cesdk/engine';

async function dragAndDrop() {
  const engine = await CreativeEngine.init({
    // license: 'YOUR_CESDK_LICENSE_KEY'
  });
  // The canvas fills this container, so give the container a size.
  const container = document.getElementById('cesdk_container');
  if (container == null) throw new Error('The page has no #cesdk_container.');
  container.append(engine.element);

  const scene = engine.scene.create();

  const page = engine.block.create('page');
  engine.block.setWidth(page, 800);
  engine.block.setHeight(page, 600);
  engine.block.appendChild(scene, page);

  // `addImage` adds each image to the current page, which is the only page so far.
  const first = await engine.block.addImage(
    'https://img.ly/static/ubq_samples/sample_1.jpg',
    { size: { width: 300, height: 300 } }
  );
  const second = await engine.block.addImage(
    'https://img.ly/static/ubq_samples/sample_2.jpg',
    { size: { width: 300, height: 300 } }
  );
  engine.block.setPositionX(first, 50);
  engine.block.setPositionY(first, 150);
  engine.block.setPositionX(second, 450);
  engine.block.setPositionY(second, 150);

  // A second page beside the first, for the placement examples.
  const placementPage = engine.block.create('page');
  engine.block.setWidth(placementPage, 800);
  engine.block.setHeight(placementPage, 600);
  engine.block.setPositionX(placementPage, 850);
  engine.block.appendChild(scene, placementPage);

  // One local source with one photo, standing in for your own asset library.
  engine.asset.addLocalSource('my-photos');
  engine.asset.addAssetToSource('my-photos', {
    id: 'photo',
    meta: {
      uri: 'https://img.ly/static/ubq_samples/sample_3.jpg',
      blockType: '//ly.img.ubq/graphic',
      fillType: '//ly.img.ubq/fill/image',
      width: 512,
      height: 341
    }
  });
  const { assets } = await engine.asset.findAssets('my-photos', {
    page: 0,
    perPage: 1
  });
  const [photo] = assets;

  await engine.scene.zoomToBlock(scene);

  // Users can now exchange the images of two blocks by dragging one onto the other.
  engine.editor.setSettingBool('dragToSwapFills/enabled', true);

  // How long the pointer stays pressed before the image lifts.
  // 0 lifts at once, which suits fixed layouts.
  engine.editor.setSettingFloat('dragToSwapFills/longPressDurationMs', 400);

  // A thumbnail in your own UI that the user can drag onto the canvas.
  const thumbnail = document.createElement('img');
  thumbnail.src = 'https://img.ly/static/ubq_samples/sample_3.jpg';
  thumbnail.width = 120;
  thumbnail.draggable = true;
  thumbnail.addEventListener('dragstart', (event) => {
    // Names the asset in the drag, so a drop on the canvas can place it.
    void engine.actions.run('asset.drag', { event, asset: photo });
  });
  document.body.append(thumbnail);

  // The engine runs this when a dragged asset is released on the canvas.
  engine.actions.register('asset.drop', async (drop) => {
    // A drag that carries no asset, such as a file from the desktop, has no ids.
    if (drop.sourceId === '' || drop.assetId === '') return;
    // A drop beside every page has nowhere to go.
    if (drop.target == null && drop.page == null) return;

    const asset = await engine.asset.fetchAsset(drop.sourceId, drop.assetId);
    if (asset == null) return;

    if (drop.target != null && engine.block.isValid(drop.target)) {
      // Replace the image of the block below the drop.
      await engine.asset.applyToBlock(drop.sourceId, asset, drop.target);
    } else if (drop.page != null && engine.block.isValid(drop.page)) {
      // Add the asset centered on the drop point, and select the new block.
      const block = await engine.asset.apply(drop.sourceId, asset, {
        placement: {
          parent: drop.page,
          center: { x: drop.pageX, y: drop.pageY }
        }
      });
      if (block == null) return;
      engine.block.select(block);
    } else {
      return;
    }
    // Make the drop one step that the user can undo.
    engine.editor.addUndoStep();
  });

  // Place the new block yourself. Both center values must be finite.
  const placed = await engine.asset.apply('my-photos', photo, {
    placement: { parent: placementPage, center: { x: 400, y: 200 } }
  });

  // The same placement, through the default behavior an asset source can call.
  const added = await engine.asset.defaultApplyAsset(photo, {
    placement: { parent: placementPage, center: { x: 400, y: 400 } }
  });

  // eslint-disable-next-line no-console
  console.log({ placed, added });
}

void dragAndDrop();
```

Let users exchange the images of two blocks by dragging one onto the other,
drag assets from your own UI onto the canvas, and decide what a drop does.

The examples below use two pages and one local asset source. The first page holds two image blocks, and the second page takes the blocks that the placement examples add:

```typescript highlight-setup
  const scene = engine.scene.create();

  const page = engine.block.create('page');
  engine.block.setWidth(page, 800);
  engine.block.setHeight(page, 600);
  engine.block.appendChild(scene, page);

  // `addImage` adds each image to the current page, which is the only page so far.
  const first = await engine.block.addImage(
    'https://img.ly/static/ubq_samples/sample_1.jpg',
    { size: { width: 300, height: 300 } }
  );
  const second = await engine.block.addImage(
    'https://img.ly/static/ubq_samples/sample_2.jpg',
    { size: { width: 300, height: 300 } }
  );
  engine.block.setPositionX(first, 50);
  engine.block.setPositionY(first, 150);
  engine.block.setPositionX(second, 450);
  engine.block.setPositionY(second, 150);

  // A second page beside the first, for the placement examples.
  const placementPage = engine.block.create('page');
  engine.block.setWidth(placementPage, 800);
  engine.block.setHeight(placementPage, 600);
  engine.block.setPositionX(placementPage, 850);
  engine.block.appendChild(scene, placementPage);

  // One local source with one photo, standing in for your own asset library.
  engine.asset.addLocalSource('my-photos');
  engine.asset.addAssetToSource('my-photos', {
    id: 'photo',
    meta: {
      uri: 'https://img.ly/static/ubq_samples/sample_3.jpg',
      blockType: '//ly.img.ubq/graphic',
      fillType: '//ly.img.ubq/fill/image',
      width: 512,
      height: 341
    }
  });
  const { assets } = await engine.asset.findAssets('my-photos', {
    page: 0,
    perPage: 1
  });
  const [photo] = assets;

  await engine.scene.zoomToBlock(scene);
```

## The swap gesture

Two settings control the built-in gesture. The first turns it on, and the second sets how long a press lasts before the image lifts:

```typescript highlight-gesture-enable
  // Users can now exchange the images of two blocks by dragging one onto the other.
  engine.editor.setSettingBool('dragToSwapFills/enabled', true);

  // How long the pointer stays pressed before the image lifts.
  // 0 lifts at once, which suits fixed layouts.
  engine.editor.setSettingFloat('dragToSwapFills/longPressDurationMs', 400);
```

The engine owns the whole interaction. The user presses and holds an image block to lift its image, drags to highlight the block below the pointer, and releases to exchange the two images as one undo step. Holding Alt (Option on macOS) when the drag starts skips the wait. The preview that follows the pointer comes from `@cesdk/engine`, and Escape, a cancelled pointer and a system-cancelled touch all end the gesture without a swap. You write none of that.

A block can lift or receive an image when it has an image fill, is not a sticker or animated sticker, and its `fill/change` scope is allowed. A page never takes part in a swap.

## Dropping an asset on the canvas

A drag onto the canvas from outside it is a separate interaction. The engine follows the drag, outlines the block that would take the drop, and runs the `asset.drop` action on release.

By default, an image dropped on a block that can take an image replaces that image. The same rules decide which blocks qualify as for the swap, except that a page with an image fill qualifies too. Any other drop on a page adds the asset, centered on the release point. A drop beside every page does nothing, and so does any drop outside the transform edit mode.

In the CE.SDK editor, the asset library starts these drags, and the feature key `ly.img.dragAndDrop.asset` turns them on. A configuration that lists its feature keys and was written before 1.83 does not list this key. Declare the release it was written for with `cesdk.setEditorCompatibilityVersion`, and the editor turns the key on for it.

## Dragging from your own UI

A drag from any element on your page reaches the engine too. Run the `asset.drag` action in the element's `dragstart` handler, with the event and the asset:

```typescript highlight-drag-source
// A thumbnail in your own UI that the user can drag onto the canvas.
const thumbnail = document.createElement('img');
thumbnail.src = 'https://img.ly/static/ubq_samples/sample_3.jpg';
thumbnail.width = 120;
thumbnail.draggable = true;
thumbnail.addEventListener('dragstart', (event) => {
  // Names the asset in the drag, so a drop on the canvas can place it.
  void engine.actions.run('asset.drag', { event, asset: photo });
});
document.body.append(thumbnail);
```

`asset.drag` writes the asset source and the asset id into the drag, and the default `asset.drop` fetches the asset from that source, so register the source with the engine first. Pass an asset from `engine.asset.findAssets` or `engine.asset.fetchAsset`, because those results carry their asset source.

The action also marks whether the asset is an image. A browser hides the values of a drag until the drop, so this mark is how the engine knows during the drag. Only an image drag outlines a block to replace, and any other asset is added to the page.

A browser accepts drag data only inside `dragstart`, so run the action there and not later. The action writes the data before `run` returns.

## Changing what a drop does

Register your own `asset.drop` to change what a release does. This handler replaces an image like the default does, and selects a block that it adds:

```typescript highlight-asset-drop-action
  // The engine runs this when a dragged asset is released on the canvas.
  engine.actions.register('asset.drop', async (drop) => {
    // A drag that carries no asset, such as a file from the desktop, has no ids.
    if (drop.sourceId === '' || drop.assetId === '') return;
    // A drop beside every page has nowhere to go.
    if (drop.target == null && drop.page == null) return;

    const asset = await engine.asset.fetchAsset(drop.sourceId, drop.assetId);
    if (asset == null) return;

    if (drop.target != null && engine.block.isValid(drop.target)) {
      // Replace the image of the block below the drop.
      await engine.asset.applyToBlock(drop.sourceId, asset, drop.target);
    } else if (drop.page != null && engine.block.isValid(drop.page)) {
      // Add the asset centered on the drop point, and select the new block.
      const block = await engine.asset.apply(drop.sourceId, asset, {
        placement: {
          parent: drop.page,
          center: { x: drop.pageX, y: drop.pageY }
        }
      });
      if (block == null) return;
      engine.block.select(block);
    } else {
      return;
    }
    // Make the drop one step that the user can undo.
    engine.editor.addUndoStep();
  });
```

The payload says where the asset was released:

| Field      | Type                    | Description                                                                             |
| ---------- | ----------------------- | --------------------------------------------------------------------------------------- |
| `sourceId` | `string`                | The asset source of the dropped asset. Empty when the drag did not carry one            |
| `assetId`  | `string`                | The dropped asset. Empty when the drag did not carry one                                |
| `target`   | `DesignBlockId \| null` | The block below the drop that can take the asset                                        |
| `page`     | `DesignBlockId \| null` | The page below the drop                                                                 |
| `pageX`    | `number`                | The drop point in the coordinates of `page`, in design units. `0` when `page` is `null` |
| `pageY`    | `number`                | The drop point in the coordinates of `page`, in design units. `0` when `page` is `null` |

A drag that carries no asset, such as a file from the desktop, also runs the action, with an empty `sourceId` and `assetId`. `engine.asset.fetchAsset` loads the asset, `engine.asset.applyToBlock` replaces the content of one block, and `engine.asset.apply` adds a new one.

Your handler replaces the default for every drop. It owns the undo step, which the default adds after each drop. In the CE.SDK editor it also replaces the editor's confirmation dialogs, error messages and screen reader announcements.

`@cesdk/engine` types both payloads, as `AssetDropPayload` and `AssetDragPayload`. In the CE.SDK editor, `cesdk.actions` is the same registry, so `cesdk.actions.register('asset.drop', …)` and `cesdk.actions.run('asset.drag', …)` reach the same actions. To keep the editor's behavior for some drops, read it with `cesdk.actions.get('asset.drop')` before you register your own, and call it from your handler.

## Placing an asset yourself

`placement` says where the block an asset creates goes:

```typescript highlight-apply-placement
// Place the new block yourself. Both center values must be finite.
const placed = await engine.asset.apply('my-photos', photo, {
  placement: { parent: placementPage, center: { x: 400, y: 200 } }
});
```

The same option works on the default behavior an asset source calls:

```typescript highlight-default-apply-asset
// The same placement, through the default behavior an asset source can call.
const added = await engine.asset.defaultApplyAsset(photo, {
  placement: { parent: placementPage, center: { x: 400, y: 400 } }
});
```

`placement` has two optional fields:

```typescript
interface AssetPlacement {
  parent?: DesignBlockId;
  center?: { x: number; y: number };
}
```

`parent` omitted means the current page. `center` omitted means the engine places the block itself. Both center values must be finite, so a `NaN` or an infinite coordinate is an error.

An asset source registered with its own `applyAsset` function ignores the placement. To position a drop for such a source, register your own `asset.drop` action, which carries `page`, `pageX` and `pageY`.

## API Reference

| Method                                                 | Description                                             |
| ------------------------------------------------------ | ------------------------------------------------------- |
| `engine.asset.apply(sourceId, assetResult, options)`   | Apply an asset, with an optional `placement`            |
| `engine.asset.defaultApplyAsset(assetResult, options)` | The default apply, with an optional `placement`         |
| `engine.asset.fetchAsset(sourceId, assetId)`           | Load one asset from a source                            |
| `engine.actions.register('asset.drop', handler)`       | Replace what a drop on the canvas does                  |
| `engine.actions.run('asset.drag', { event, asset })`   | Start a drag of an asset, in a `dragstart` handler      |
| `engine.editor.addUndoStep()`                          | Turn the changes since the last step into one undo step |

| Setting                               | Type    | Default | Description                                                                               |
| ------------------------------------- | ------- | ------- | ----------------------------------------------------------------------------------------- |
| `dragToSwapFills/enabled`             | Boolean | `false` | Turns the press-and-hold swap gesture on                                                  |
| `dragToSwapFills/longPressDurationMs` | Float   | `400`   | Hold in milliseconds before the image lifts. `0` lifts at once, which suits fixed layouts |



---

## More Resources

- **[Nuxt.js Documentation Index](https://img.ly/docs/cesdk/nuxtjs.md)** - Browse all Nuxt.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./nuxtjs.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support