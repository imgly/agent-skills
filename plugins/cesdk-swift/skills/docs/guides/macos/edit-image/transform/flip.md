> This is one page of the CE.SDK macOS documentation. For a complete overview, see the [macOS Documentation Index](https://img.ly/docs/cesdk/macos/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/macos/llms-full.txt).

**Navigation:** [Guides](../../guides.md) > [Create and Edit Images](../../edit-image.md) > [Transform](../transform.md) > [Flip](./flip.md)

---

Use CE.SDK to flip or mirror image and video elements horizontally or vertically in your app. This guide covers block-level and crop-level flipping, batch operations, mirror effects, and scope-based permissions.

## What you'll learn

- Flip an image horizontally or vertically.
- Understand the difference between block flip and content crop flip.
- Use both dedicated methods and property-based approaches.
- Flip multiple elements together.
- Create mirrored or reflection effects.
- Protect templates by locking flip permissions.

## When to use

Flipping is helpful when:

- Mirroring product or model images for layout consistency.
- Creating stylistic reflections or symmetrical designs.
- Adjusting orientation in right-to-left layouts.
- Correcting flipped camera footage.

***

## Flip Types: Block vs. Crop

There are two kinds of flips in CE.SDK:

| Flip type  |                                  Methods | What is mirrored                                                                                          | When to use                                                           |
| ---------- | ---------------------------------------: | --------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| Block flip |   `setFlipHorizontal`, `setFlipVertical` | Entire block — including borders, effects, and overlays; changes how the block is rendered on the canvas. | Layout corrections or composition changes                             |
| Crop flip  | `flipCropHorizontal`, `flipCropVertical` | Only the content inside the crop frame; block layout and dimensions remain unchanged.                     | Adjust underlying image/video orientation without affecting placement |

Use **block flips** for layout corrections or composition changes, and **crop flips** to adjust underlying image or video orientation without affecting placement.

## Flip horizontally or vertically

Use the `flip/horizontal` and `flip/vertical` properties to control mirroring. They are boolean properties and have dedicated helper functions defined. All flips are around the center point of a block.

```swift
try engine.block.setFlipVertical(imageBlock, flip: true)
try engine.block.setFlipHorizontal(imageBlock, flip: true)
```

To determine if a block has been flipped you can query the properties or use helper functions.

```swift
let isFlippedHorizontally = try engine.block.getFlipHorizontal(imageBlock)
let isFlippedVertically = try engine.block.getFlipVertical(imageBlock)
```

### Property-Based Approach

In addition to convenience methods, you can use the property API for dynamic or batch operations. Blocks have `"flip/horizontal"` and `"flip/vertical"` Boolean properties.

```swift
try engine.block.setBool(imageBlock, property: "flip/horizontal", value: true)
try engine.block.setBool(imageBlock, property: "flip/vertical", value: true)
```

|                   Approach | When to use                                                | Notes                                             |
| -------------------------: | ---------------------------------------------------------- | ------------------------------------------------- |
| Dedicated helper functions | Type safety when writing explicit flip operations          | Prefer for explicit calls — safer, clearer API    |
|    Property-based approach | Flexible key-path manipulation in batch scripts or tooling | Better for dynamic/bulk updates; less type safety |

## Flip Multiple Elements Together

Group blocks and apply flip to the group:

```swift
let groupId = try engine.block.group([imageId, textId])
try engine.block.setFlipHorizontal(groupId, flip: true)
```

While respecting scope permissions, you can also:

1. Iterate over all blocks of a type.
2. Flip each one individually.

```swift
let blocks = try engine.block.find(byType: .graphic)
for id in blocks {
  if try engine.block.isAllowedByScope(id, key: "layer/flip") {
    try engine.block.setFlipHorizontal(id, flip: true)
  }
}
```

![Items flipped individually and as a group](https://img.ly/docs/cesdk/macos/edit-image/transform/flip-035e9f/assets/flip-group-160.jpg)

The preceding code:

- Shows the original composition on the left.
- Flips each item individually in the center composition.
- Groups first, then flips the group for the composition on the right.

## To Remove Any Flip Applied

If you want to remove the flip, set the property to false.

```swift
try engine.block.setFlipVertical(block, flip: false)
```

Applying the flip multiple times doesn’t flip the image back to its original orientation. This code results in a flipped block.

```swift
try engine.block.setFlipVertical(block, flip: true)
try engine.block.setFlipVertical(block, flip: true)
```

## Flip Crop Flips Content Only

When you need to flip the image inside its crop region without changing the block’s placement:

```swift
try engine.block.flipCropHorizontal(imageBlock)
try engine.block.flipCropVertical(imageBlock)
```

These operations invert the crop’s translation and scale values, producing a mirror effect within the same bounding box.
Use them for correcting camera orientation or stylized reflections without shifting the layout.

## Create Mirror and Reflection Effects

You can simulate reflections or mirrored designs by duplicating, flipping, and adjusting opacity and position:

```swift
let mirrored = try engine.block.duplicate(original)
try engine.block.setFlipVertical(mirrored, flip: true)
try engine.block.setOpacity(mirrored, value: 0.5)
try engine.block.setPositionY(mirrored, value: 200)
```

![Image mirrored using preceding code](https://img.ly/docs/cesdk/macos/edit-image/transform/flip-035e9f/assets/flip-mirror-160.png)

> **Note:** Try combining vertical flips with gradients or masks for realistic water or
> glass reflections.

## Lock or constrain flipping (optional)

When building templates, you might want to lock flipping to protect the layout:

```swift
try engine.block.setScopeEnabled(block, key: "layer/flip", enabled: false)
```

You can also disable all transformations by locking, this is regardless of working with a template.

```swift
try engine.block.setTransformLocked(block, locked: true)
```

## Troubleshooting

| Issue                           | Solution                                                            |
| ------------------------------- | ------------------------------------------------------------------- |
| Flipping doesn’t apply visually | Confirm image is rendered and loaded                                |
| Image flips unexpectedly        | Check that flipping is not being overridden by grouped parent block |
| User can still flip in editor   | Use "layer/flip" constraint to prevent this                         |




---

## More Resources

- **[macOS Documentation Index](https://img.ly/docs/cesdk/macos/)** - Browse all macOS documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/macos/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/macos/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support