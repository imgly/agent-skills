> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Guides](../../guides.md) > [Create and Use Templates](../../create-templates.md) > [Dynamic Content](../add-dynamic-content.md) > [Placeholders](./placeholders.md)

---

```kotlin file=@cesdk_android_examples/engine-guides-placeholders/Placeholders.kt reference-only
import ly.img.engine.DesignBlock
import ly.img.engine.DesignBlockType
import ly.img.engine.Engine
import ly.img.engine.FillType
import ly.img.engine.ShapeType

data class Placeholders(
    val imagePlaceholder: DesignBlock,
    val textPlaceholder: DesignBlock,
    val imageBehaviorSupported: Boolean,
    val textBehaviorSupported: Boolean,
    val imageControlsSupported: Boolean,
    val textControlsSupported: Boolean,
    val imageBehaviorEnabled: Boolean,
    val textBehaviorEnabled: Boolean,
    val imagePlaceholderEnabled: Boolean,
    val textPlaceholderEnabled: Boolean,
    val overlayEnabled: Boolean,
    val buttonEnabled: Boolean,
    val batchImageBlock: DesignBlock,
    val batchImageFill: DesignBlock,
    val batchTextBlock: DesignBlock,
    val placeholders: List<DesignBlock>,
)

fun placeholders(engine: Engine): Placeholders {
    val scene = engine.scene.create()
    val page = engine.block.create(DesignBlockType.Page)
    engine.block.appendChild(parent = scene, child = page)

    val imagePlaceholder = engine.block.create(DesignBlockType.Graphic)
    val imageFill = engine.block.createFill(FillType.Image)
    engine.block.setName(imagePlaceholder, name = "image-placeholder")
    engine.block.setShape(imagePlaceholder, shape = engine.block.createShape(ShapeType.Rect))
    engine.block.setFill(imagePlaceholder, fill = imageFill)
    engine.block.appendChild(parent = page, child = imagePlaceholder)

    val textPlaceholder = engine.block.create(DesignBlockType.Text)
    engine.block.setName(textPlaceholder, name = "text-placeholder")
    engine.block.replaceText(textPlaceholder, text = "Replace this text")
    engine.block.appendChild(parent = page, child = textPlaceholder)

    val imagePlaceholderFill = engine.block.getFill(imagePlaceholder)
    val imageBehaviorSupported = engine.block.supportsPlaceholderBehavior(imagePlaceholderFill)
    val imageControlsSupported = engine.block.supportsPlaceholderControls(imagePlaceholder)

    val textBehaviorSupported = engine.block.supportsPlaceholderBehavior(textPlaceholder)
    val textControlsSupported = engine.block.supportsPlaceholderControls(textPlaceholder)

    val imageBehaviorEnabled = if (imageBehaviorSupported) {
        engine.block.setPlaceholderBehaviorEnabled(imagePlaceholderFill, enabled = true)
        engine.block.isPlaceholderBehaviorEnabled(imagePlaceholderFill)
    } else {
        false
    }

    val textBehaviorEnabled = if (textBehaviorSupported) {
        engine.block.setPlaceholderBehaviorEnabled(textPlaceholder, enabled = true)
        engine.block.isPlaceholderBehaviorEnabled(textPlaceholder)
    } else {
        false
    }

    engine.block.setPlaceholderEnabled(imagePlaceholder, enabled = true)
    engine.block.setPlaceholderEnabled(textPlaceholder, enabled = true)

    val imagePlaceholderEnabled = engine.block.isPlaceholderEnabled(imagePlaceholder)
    val textPlaceholderEnabled = engine.block.isPlaceholderEnabled(textPlaceholder)

    val overlayEnabled: Boolean
    val buttonEnabled: Boolean
    if (imageControlsSupported) {
        engine.block.setPlaceholderControlsOverlayEnabled(imagePlaceholder, enabled = true)
        engine.block.setPlaceholderControlsButtonEnabled(imagePlaceholder, enabled = true)
        overlayEnabled = engine.block.isPlaceholderControlsOverlayEnabled(imagePlaceholder)
        buttonEnabled = engine.block.isPlaceholderControlsButtonEnabled(imagePlaceholder)
    } else {
        overlayEnabled = false
        buttonEnabled = false
    }

    engine.block.setScopeEnabled(imagePlaceholder, key = "fill/change", enabled = true)
    engine.block.setScopeEnabled(textPlaceholder, key = "text/edit", enabled = true)

    val batchImageBlock = engine.block.create(DesignBlockType.Graphic)
    val batchImageFill = engine.block.createFill(FillType.Image)
    engine.block.setShape(batchImageBlock, shape = engine.block.createShape(ShapeType.Rect))
    engine.block.setFill(batchImageBlock, fill = batchImageFill)
    engine.block.appendChild(parent = page, child = batchImageBlock)

    val batchTextBlock = engine.block.create(DesignBlockType.Text)
    engine.block.replaceText(batchTextBlock, text = "Replace this text too")
    engine.block.appendChild(parent = page, child = batchTextBlock)

    val batchTargets = listOf(
        Triple(batchImageBlock, batchImageFill, "fill/change"),
        Triple(batchTextBlock, batchTextBlock, "text/edit"),
    )
    batchTargets.forEach { (block, behaviorTarget, contentScope) ->
        if (engine.block.supportsPlaceholderBehavior(behaviorTarget)) {
            engine.block.setPlaceholderBehaviorEnabled(behaviorTarget, enabled = true)
            engine.block.setPlaceholderEnabled(block, enabled = true)
            engine.block.setScopeEnabled(block, key = contentScope, enabled = true)
        }
        if (engine.block.supportsPlaceholderControls(block)) {
            engine.block.setPlaceholderControlsOverlayEnabled(block, enabled = true)
            engine.block.setPlaceholderControlsButtonEnabled(block, enabled = true)
        }
    }

    val placeholders = engine.block.findAllPlaceholders()

    return Placeholders(
        imagePlaceholder = imagePlaceholder,
        textPlaceholder = textPlaceholder,
        imageBehaviorSupported = imageBehaviorSupported,
        textBehaviorSupported = textBehaviorSupported,
        imageControlsSupported = imageControlsSupported,
        textControlsSupported = textControlsSupported,
        imageBehaviorEnabled = imageBehaviorEnabled,
        textBehaviorEnabled = textBehaviorEnabled,
        imagePlaceholderEnabled = imagePlaceholderEnabled,
        textPlaceholderEnabled = textPlaceholderEnabled,
        overlayEnabled = overlayEnabled,
        buttonEnabled = buttonEnabled,
        batchImageBlock = batchImageBlock,
        batchImageFill = batchImageFill,
        batchTextBlock = batchTextBlock,
        placeholders = placeholders,
    )
}
```

Turn image, video, or text content into replaceable areas while keeping the
surrounding template layout under your control.

![Image placeholder with an overlay and Replace button in the Android editor](https://img.ly/docs/cesdk/android/create-templates/add-dynamic-content/placeholders-d9ba8a/assets/android.hero.webp)

> **Reading time:** 6 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-android-examples/tree/v1.83.0-nightly.20260904/engine-guides-placeholders)

<EngineReferenceNote {...props} />

Placeholders separate replaceable content from the template block that positions and styles it. This guide checks support, enables placeholder behavior and interaction, configures visual controls, and applies placeholder settings to multiple blocks.

## Placeholder Fundamentals

Placeholder configuration has three parts:

- **Placeholder behavior** marks content as replaceable.
- **Placeholder interaction** marks the containing block as available to an Adopter.
- **Placeholder controls** display the overlay and Replace button in an editor UI.

### Block-Level vs Fill-Level Behavior

The behavior target depends on the block type:

- For graphic blocks with image or video content, enable placeholder behavior on the fill returned by `engine.block.getFill`. Enable interaction and controls on the graphic block.
- For text blocks, enable behavior and interaction on the text block. Text blocks do not support placeholder controls.

## Checking Placeholder Support

Check each target before enabling its placeholder feature. The image fill supports behavior, the graphic block supports controls, and the text block supports behavior directly.

```kotlin highlight-android-check-support
    val imagePlaceholderFill = engine.block.getFill(imagePlaceholder)
    val imageBehaviorSupported = engine.block.supportsPlaceholderBehavior(imagePlaceholderFill)
    val imageControlsSupported = engine.block.supportsPlaceholderControls(imagePlaceholder)

    val textBehaviorSupported = engine.block.supportsPlaceholderBehavior(textPlaceholder)
    val textControlsSupported = engine.block.supportsPlaceholderControls(textPlaceholder)
```

The support predicates let your app skip unsupported block types without relying on type assumptions.

## Enabling Placeholder Behavior

Placeholder behavior turns supported content into a replacement target.

### For Graphic Blocks

Read the graphic block's fill, then enable and verify behavior on that fill.

```kotlin highlight-android-enable-image-behavior
val imageBehaviorEnabled = if (imageBehaviorSupported) {
    engine.block.setPlaceholderBehaviorEnabled(imagePlaceholderFill, enabled = true)
    engine.block.isPlaceholderBehaviorEnabled(imagePlaceholderFill)
} else {
    false
}
```

The same pattern applies to image and video fills.

### For Text Blocks

Text content belongs directly to the text block, so use that block as the behavior target.

```kotlin highlight-android-enable-text-behavior
val textBehaviorEnabled = if (textBehaviorSupported) {
    engine.block.setPlaceholderBehaviorEnabled(textPlaceholder, enabled = true)
    engine.block.isPlaceholderBehaviorEnabled(textPlaceholder)
} else {
    false
}
```

## Enabling Adopter Interaction

Enable placeholder interaction on the block a user selects or replaces, not on its fill.

```kotlin highlight-android-enable-interaction
    engine.block.setPlaceholderEnabled(imagePlaceholder, enabled = true)
    engine.block.setPlaceholderEnabled(textPlaceholder, enabled = true)

    val imagePlaceholderEnabled = engine.block.isPlaceholderEnabled(imagePlaceholder)
    val textPlaceholderEnabled = engine.block.isPlaceholderEnabled(textPlaceholder)
```

`setPlaceholderEnabled` marks the block as a placeholder for Adopter workflows and prepares its interaction state for the role switch:

- **Adopter selectability:** While the current role is Creator, `setPlaceholderEnabled(block, enabled)` writes the same value to the block-level `editor/select` scope. Adopter global scopes defer to this setting, so enabling keeps the block selectable after the switch, while disabling makes it unselectable.
- **Creator selection:** The current Creator can still select the block because Creator scopes are globally allowed.
- **Image and video replacement:** After an Adopter replaces an image or video asset through the CE.SDK editor UI, the editor clears the block's placeholder flag.
- **Text editing:** When an Adopter edits placeholder text interactively through the CE.SDK editor UI, the editor disables placeholder behavior on the text block without clearing its placeholder flag. Creator edits and programmatic `replaceText` calls do not trigger this automatic change.

## Configuring Visual Feedback

Graphic placeholders can show an overlay pattern and a Replace button. Enable these controls only after `supportsPlaceholderControls` returns `true`.

```kotlin highlight-android-enable-controls
val overlayEnabled: Boolean
val buttonEnabled: Boolean
if (imageControlsSupported) {
    engine.block.setPlaceholderControlsOverlayEnabled(imagePlaceholder, enabled = true)
    engine.block.setPlaceholderControlsButtonEnabled(imagePlaceholder, enabled = true)
    overlayEnabled = engine.block.isPlaceholderControlsOverlayEnabled(imagePlaceholder)
    buttonEnabled = engine.block.isPlaceholderControlsButtonEnabled(imagePlaceholder)
} else {
    overlayEnabled = false
    buttonEnabled = false
}
```

The controls appear in editor preview surfaces and are excluded from exports.

> **Note:** See the [Design Editor Starter Kit](../../starterkits/design-editor.md) for a complete
> Android editor UI that can host template workflows.

## Scope Requirements

Scopes determine whether an Adopter may replace placeholder content. Enable `fill/change` for graphic placeholders and `text/edit` for text placeholders.

```kotlin highlight-android-enable-scopes
engine.block.setScopeEnabled(imagePlaceholder, key = "fill/change", enabled = true)
engine.block.setScopeEnabled(textPlaceholder, key = "text/edit", enabled = true)
```

The active role and global scope settings also participate in the final permission. Use editing constraints to protect movement, resizing, and other layout operations separately.

## Working with Multiple Placeholders

After creating candidate graphic and text blocks, apply the same placeholder configuration to them in one pass. Pair each selectable block with the target that owns its placeholder behavior: the fill for graphic content, or the block itself for text content.

```kotlin highlight-android-batch-placeholders
val batchTargets = listOf(
    Triple(batchImageBlock, batchImageFill, "fill/change"),
    Triple(batchTextBlock, batchTextBlock, "text/edit"),
)
batchTargets.forEach { (block, behaviorTarget, contentScope) ->
    if (engine.block.supportsPlaceholderBehavior(behaviorTarget)) {
        engine.block.setPlaceholderBehaviorEnabled(behaviorTarget, enabled = true)
        engine.block.setPlaceholderEnabled(block, enabled = true)
        engine.block.setScopeEnabled(block, key = contentScope, enabled = true)
    }
    if (engine.block.supportsPlaceholderControls(block)) {
        engine.block.setPlaceholderControlsOverlayEnabled(block, enabled = true)
        engine.block.setPlaceholderControlsButtonEnabled(block, enabled = true)
    }
}
```

For each block whose target supports placeholder behavior, the loop enables behavior on that target plus interaction and the required content scope on the containing block; visual controls are enabled only on blocks that support them.

### Discovering Configured Placeholders

After configuration, use `findAllPlaceholders` to retrieve the blocks whose placeholder interaction flag is enabled.

```kotlin highlight-android-find-placeholders
val placeholders = engine.block.findAllPlaceholders()
```

Use the returned collection to inspect or validate the configured placeholder set. It is a discovery API; it does not identify blocks that still need placeholder configuration.

## API Reference

| Method | Purpose |
| --- | --- |
| `engine.block.getFill(block=_)` | Get the fill that carries replaceable image or video content. |
| `engine.block.supportsPlaceholderBehavior(block=_)` | Check whether a fill or text block supports placeholder behavior. |
| `engine.block.setPlaceholderBehaviorEnabled(block=_, enabled=_)` | Enable or disable placeholder behavior on a supported target. |
| `engine.block.isPlaceholderBehaviorEnabled(block=_)` | Read the placeholder behavior state. |
| `engine.block.setPlaceholderEnabled(block=_, enabled=_)` | Enable or disable Adopter interaction on a placeholder block. |
| `engine.block.isPlaceholderEnabled(block=_)` | Read the block's placeholder interaction state. |
| `engine.block.supportsPlaceholderControls(block=_)` | Check whether a block supports placeholder controls. |
| `engine.block.setPlaceholderControlsOverlayEnabled(block=_, enabled=_)` | Show or hide the placeholder overlay. |
| `engine.block.isPlaceholderControlsOverlayEnabled(block=_)` | Read the overlay visibility state. |
| `engine.block.setPlaceholderControlsButtonEnabled(block=_, enabled=_)` | Show or hide the Replace button. |
| `engine.block.isPlaceholderControlsButtonEnabled(block=_)` | Read the Replace button visibility state. |
| `engine.block.setScopeEnabled(block=_, key=_, enabled=_)` | Configure a block-level editing scope. |
| `engine.block.isScopeEnabled(block=_, key=_)` | Read whether a block-level editing scope is enabled. |
| `engine.block.findAllPlaceholders()` | Find all instantiated placeholder blocks, including blocks not attached to a scene. |

## Next Steps

- [Lock the Template](../lock.md) - Restrict editing access to specific elements or properties to enforce design rules.
- [Text Variables](./text-variables.md) - Define dynamic text elements that can be populated with custom values.



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support