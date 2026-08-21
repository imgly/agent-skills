> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Guides](../../guides.md) > [Create and Edit Images](../../edit-image.md) > [Transform](../transform.md) > [Flip](./flip.md)

---

The CreativeEditor SDK includes a **flipping** feature that you can add to your **Android** app. Flipping is a powerful transformation that Android photo apps use for creating mirror effects, correcting orientation, and achieving symmetrical layouts. Learn in this guide how to implement both **interactive** flip controls and **programmatic** flipping, through clean **Kotlin** APIs.

## Flip features

The flip feature enables the following actions:

- Horizontal and vertical image mirroring
- Integration with template systems and creative workflows
- Programmatic flip state management and toggling

## Flip applications

Implement flipping for:

- Correcting selfie camera orientation in Android camera apps
- Creating mirror effects for product photography
- Building symmetrical design layouts and compositions

***

## Flip horizontally or vertically

Use the `flip/horizontal` and `flip/vertical` properties to control mirroring. These are **boolean** properties with defined helper functions. All flips occur around the center point of a block.

```kotlin
engine.block.setFlipVertical(imageBlock, true)
engine.block.setFlipHorizontal(imageBlock, true)
```

To determine if a block has been flipped, you can either:

- Query the **properties**.
- Use **helper functions**.

```kotlin
val isFlippedVertical = engine.block.getFlipVertical(imageBlock)
val isFlippedHorizontal = engine.block.getFlipHorizontal(imageBlock)
```

***

## Toggle flipping

To toggle the flip state, the code reads the current flip value and sets it to its opposite:

```kotlin
val currentVerticalFlip = engine.block.getFlipVertical(imageBlock)
engine.block.setFlipVertical(imageBlock, !currentVerticalFlip)

val currentHorizontalFlip = engine.block.getFlipHorizontal(imageBlock)
engine.block.setFlipHorizontal(imageBlock, !currentHorizontalFlip)
```

## Reset flipping

To reset all flips:

```kotlin
engine.block.setFlipVertical(imageBlock, false)
engine.block.setFlipHorizontal(imageBlock, false)
```

***

## Flip multiple elements

Group elements to flip them together:

```kotlin
val groupId = engine.block.group(listOf(imageBlock, textBlock))
engine.block.setFlipHorizontal(groupId, true)
```

***



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support