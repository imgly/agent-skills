> This is one page of the CE.SDK Nuxt.js documentation. For a complete overview, see the [Nuxt.js Documentation Index](https://img.ly/nuxtjs.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Create and Edit Videos](./create-video.md) > [Transform](./edit-video/transform.md) > [Flip](./edit-video/transform/flip.md)

---

Use **CE.SDK** to **mirror video clips** horizontally or vertically in your web app. Flip videos to create mirror effects and symmetrical designs using the same API calls to the image-flipping workflow.

## What You’ll Learn

- Flip a video clip **horizontally or vertically**.
- Use flipping in template or timeline **workflows**.
- **Reset** or toggle a flip using JavaScript.

## When to Use

Flipping is useful when you need to:

- Create:
  - **Symmetrical** video layouts
  - Animated **collages**
- Align **eyelines** when switching between front and rear cameras.
- Keep **branded elements** facing inward on split-screen layouts.

## How to Flip Videos

The CreativeEditor represents each video clip as a **graphic** block with:

- Size
- Transforms
- Grouping
- A fill set to a *video* asset

Use the Engine BlockAPI boolean helpers, common to videos and images.

### Flip Horizontally or Vertically

To flip a video:

1. Call the BlockAPI with `engine.block.SetFipHorizontal` or `engine.block.SetFipVertical`.
2. Specify the **block ID** to flip.
3. Set the boolean to `true`.

```ts
engine.block.setFlipHorizontal(videoBlock, true);
engine.block.setFlipVertical(videoBlock,  true);
```

<Picture src={flipVideo} style={{ width: '85%' }} alt="Video flipped horizontally" formats={['webp']} />

### Query the Flip Status

To know if a video has already been flipped:

1. Declare a variable for each direction.
2. Call  `engine.block.getFlip<Directions>`.
3. Specify the block ID.

```ts
const flippedH = engine.block.getFlipHorizontal(videoBlock);
const flippedV = engine.block.getFlipVertical(videoBlock);
```

The response is a boolean stating whether this specific block has already been flipped or not.

> **Note:** Flipping only affects the **visual track**. Audio (either embedded or separate) isn’t reversed, so **lip-sync and sound design stay intact**.

### Flip Clips Together

To simplify the process of rotating multiple blocks, instead of rotating each block individually, you can select and rotate a cluster of blocks simultaneously.

1. Declare a variable for the group of clips using `engine.block.group`.
2. Specify each clip to include in the group by its block ID.
3. Apply the flip to the group variable.

For example, to flip three clips together:

```ts
const groupId = await engine.block.group([clipId1, clipId2, clipId3]);
engine.block.setFlipVertical(groupId, true);
```

<Picture src={flipGroup} style={{ width: '85%' }} alt="Grouped video flipped horizontally" formats={['webp']} />

When you flip the group:

- The flip mirrors everything at once.
- Each clip keeps the same **spacing and order** inside the group.

## Restore or Manage Flip States

The CE.SDK provides ways to reset or toggle a flip. You can either:

- **Reset:** when you want to restore a clip to its original orientation.
- **Code a toggle:** when you need a quick way to switch the current flip state on and off.

### Reset a Flip

To reset a clip to its default orientation:

1. Call `setFlip<Directions>`.
2. Specify the clip’s block ID.
3. Set the boolean to `false`.

For example, to reset a horizontal flip, use the following code:

```ts
engine.block.setFlipHorizontal(videoBlock, false);
```

### Switch Flip on or Off

Calling the same flip twice:

- **Doesn't** revert to the original orientation.
- Issues two flips in the same direction.
- Leaves the clip mirrored.

To “toggle” the flip in your code:

1. Check if a specific clip is flipped.
2. Store the value in a variable (for example, `isFlipped`).
3. Set the opposite of that value in a new `setFlip<Directions>`function.

For example:

```ts
const isFlipped = await engine.block.getFlipHorizontal(videoBlock);
engine.block.setFlipHorizontal(videoBlock, !isFlipped);
```

In the preceding code, the two actions are possible depending on the value stored in `isFlipped`:

- `true`: `!isFlipped` sets the horizontal flip to `false`.
- `false`: `!isFlipped` sets the horizontal flip to `true`.

You can add a toggle button to your custom UI to let users **quickly test flipping a video horizontally**.

## Lock or Constrain Flipping

CE.SDK provides a way to prevent editors from flipping a video. This can be useful to:

- Avoid accidentally mirroring text.
- Protect UI mock-ups or frames that must stay in a fixed position.
- Keep templates brand-locked.

To deactivate flipping, use `setScopeEnabled` with:

- The `"layer/flip"` key
- The boolean set to `false`

```ts
engine.block.setScopeEnabled(videoBlock, "layer/flip", false);
```

## Troubleshooting

| Issue | Solution |
| --- | --- |
| ❌ Clip appears flipped, but playback is blank | ✅ Make sure the video file has finished loading before applying the flip |
| ❌ Flip seems ignored | ✅ Check whether the parent group is already flipped (flips are relative) |
| ❌ Users can still flip in UI | ✅ Turn off the `"layer/flip"` scope or lock transforms in the template |

## API Reference Summary

| BlockAPI  `engine.block.<>` | Purpose |
| --- | --- |
| `setFlipHorizontal(blockId, boolean)` | Mirror a block left/right or restore the default orientation. |
| `setFlipVertical(blockId, boolean)` | Mirror a block top/bottom or restore the default orientation. |
| `getFlipHorizontal(blockId)` | Check whether the block is currently flipped horizontally. |
| `getFlipVertical(blockId)` | Check whether the block is currently flipped vertically. |
| `group(blockIds[])` | Group blocks so they can be flipped together. |
| `setScopeEnabled(blockId, "layer/flip", boolean)` | Activate or deactivate flip controls to lock orientation. |



---

## More Resources

- **[Nuxt.js Documentation Index](https://img.ly/nuxtjs.md)** - Browse all Nuxt.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./nuxtjs.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support