> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Rules](../rules.md) > [Enforce Brand Guidelines](./enforce-brand-guidelines.md)

---

```kotlin file=@cesdk_android_examples/engine-guides-enforce-brand-guidelines/EnforceBrandGuidelines.kt reference-only
import android.net.Uri
import ly.img.engine.AssetDefinition
import ly.img.engine.AssetPayload
import ly.img.engine.Color
import ly.img.engine.DesignBlockType
import ly.img.engine.Engine
import ly.img.engine.FillType
import ly.img.engine.FindAssetsQuery
import ly.img.engine.Font
import ly.img.engine.FontStyle
import ly.img.engine.FontWeight
import ly.img.engine.GlobalScope
import ly.img.engine.MimeType
import ly.img.engine.ShapeType
import ly.img.engine.SizeMode
import ly.img.engine.Typeface
import java.nio.ByteBuffer

suspend fun enforceBrandGuidelines(engine: Engine): ByteBuffer {
    val scene = engine.scene.create()

    val page = engine.block.create(DesignBlockType.Page)
    engine.block.setWidth(page, value = 800F)
    engine.block.setHeight(page, value = 600F)
    engine.block.appendChild(parent = scene, child = page)

    val logo = engine.block.create(DesignBlockType.Graphic)
    engine.block.setName(logo, name = "Locked brand logo")
    engine.block.setShape(logo, shape = engine.block.createShape(ShapeType.Rect))
    engine.block.setPositionX(logo, value = 56F)
    engine.block.setPositionY(logo, value = 56F)
    engine.block.setWidth(logo, value = 184F)
    engine.block.setHeight(logo, value = 96F)
    engine.block.setFill(logo, fill = engine.block.createFill(FillType.Color))
    engine.block.setFillSolidColor(logo, color = Color.fromHex("#FF17233A"))
    engine.block.appendChild(parent = page, child = logo)

    val logoText = engine.block.create(DesignBlockType.Text)
    engine.block.setName(logoText, name = "Locked brand wordmark")
    engine.block.setWidthMode(logoText, mode = SizeMode.AUTO)
    engine.block.setHeightMode(logoText, mode = SizeMode.AUTO)
    engine.block.setPositionX(logoText, value = 88F)
    engine.block.setPositionY(logoText, value = 90F)
    engine.block.replaceText(logoText, text = "BRAND")
    engine.block.setTextColor(logoText, color = Color.fromHex("#FFFFFFFF"))
    engine.block.appendChild(parent = page, child = logoText)

    val legalText = engine.block.create(DesignBlockType.Text)
    engine.block.setName(legalText, name = "Locked legal text")
    engine.block.setWidth(legalText, value = 680F)
    engine.block.setHeightMode(legalText, mode = SizeMode.AUTO)
    engine.block.setPositionX(legalText, value = 56F)
    engine.block.setPositionY(legalText, value = 520F)
    engine.block.replaceText(legalText, text = "Approved brand disclaimer")
    engine.block.setTextFontSize(legalText, fontSize = 12F)
    engine.block.setTextColor(legalText, color = Color.fromHex("#FF17233A"))
    engine.block.appendChild(parent = page, child = legalText)

    val headline = engine.block.create(DesignBlockType.Text)
    engine.block.setName(headline, name = "Editable campaign headline")
    engine.block.setWidth(headline, value = 680F)
    engine.block.setHeightMode(headline, mode = SizeMode.AUTO)
    engine.block.setPositionX(headline, value = 56F)
    engine.block.setPositionY(headline, value = 236F)
    engine.block.replaceText(headline, text = "Brand Offer")
    engine.block.setTextFontSize(headline, fontSize = 28F)
    engine.block.setTextColor(headline, color = Color.fromHex("#FF1F5EFF"))
    engine.block.appendChild(parent = page, child = headline)

    // Replace this sample asset URI with your bundled brand font file.
    val brandRegular = Font(
        uri = Uri.parse(
            "file:///android_asset/imgly-assets/ly.img.typeface/fonts/FiraSans/FiraSans-Regular.ttf",
        ),
        subFamily = "Regular",
        weight = FontWeight.NORMAL,
        style = FontStyle.NORMAL,
    )
    val brandTypeface = Typeface(name = "Brand Sans", fonts = listOf(brandRegular))
    val typefaceSourceId = "ly.img.typeface"
    val brandTextBlocks = listOf(logoText, legalText, headline)

    if (typefaceSourceId in engine.asset.findAllSources()) {
        engine.asset.removeSource(sourceId = typefaceSourceId)
    }
    engine.asset.addLocalSource(sourceId = typefaceSourceId, supportedMimeTypes = emptyList())
    engine.asset.addAsset(
        sourceId = typefaceSourceId,
        asset = AssetDefinition(
            id = "brand-sans",
            label = mapOf("en" to "Brand Sans"),
            payload = AssetPayload(typeface = brandTypeface),
        ),
    )
    engine.asset.assetSourceContentsChanged(sourceId = typefaceSourceId)

    brandTextBlocks.forEach { textBlock ->
        engine.block.setTypeface(block = textBlock, typeface = brandTypeface)
    }

    val brandControlledScopes = listOf(
        "editor/select",
        "text/edit",
        "text/character",
        "fill/change",
        "layer/move",
        "layer/resize",
        "layer/rotate",
        "lifecycle/destroy",
        "lifecycle/duplicate",
    )

    brandControlledScopes.forEach { scope ->
        engine.editor.setGlobalScope(key = scope, globalScope = GlobalScope.DEFER)
    }

    // Use the IDs of brand blocks that already exist in your scene.
    val lockedBrandBlocks = listOf(logo, logoText, legalText)
    lockedBrandBlocks.forEach { brandBlock ->
        brandControlledScopes.forEach { scope ->
            engine.block.setScopeEnabled(block = brandBlock, key = scope, enabled = false)
        }
    }

    // Use the ID of an editable text block that already exists in your scene.
    engine.block.setScopeEnabled(block = headline, key = "editor/select", enabled = true)
    engine.block.setScopeEnabled(block = headline, key = "text/edit", enabled = true)
    engine.block.setScopeEnabled(block = headline, key = "text/character", enabled = true)
    engine.block.setScopeEnabled(block = headline, key = "fill/change", enabled = true)
    engine.block.setScopeEnabled(block = headline, key = "layer/move", enabled = false)
    engine.block.setScopeEnabled(block = headline, key = "layer/resize", enabled = false)
    engine.block.setScopeEnabled(block = headline, key = "layer/rotate", enabled = false)
    engine.block.setScopeEnabled(block = headline, key = "lifecycle/destroy", enabled = false)

    val approvedTypefaces = engine.asset.findAssets(
        sourceId = typefaceSourceId,
        query = FindAssetsQuery(perPage = 10, page = 0),
    )
    val logoCanMove = engine.block.isAllowedByScope(block = logo, key = "layer/move")
    val logoCanBeDeleted = engine.block.isAllowedByScope(block = logo, key = "lifecycle/destroy")
    val legalTextCanBeEdited = engine.block.isAllowedByScope(block = legalText, key = "text/edit")
    val headlineCanBeEdited = engine.block.isAllowedByScope(block = headline, key = "text/edit")
    val headlineCanChangeTypeface = engine.block.isAllowedByScope(block = headline, key = "text/character")
    val approvedTypefaceDefinitions = approvedTypefaces.assets.mapNotNull { it.payload.typeface }.toSet()
    val brandTextUsesApprovedTypeface = brandTextBlocks.all { textBlock ->
        val typefaces = engine.block.getTypefaces(textBlock)
        typefaces.isNotEmpty() && typefaces.all { it in approvedTypefaceDefinitions }
    }

    check(approvedTypefaces.assets.size == 1)
    check(approvedTypefaceDefinitions.size == 1)
    check(brandTextUsesApprovedTypeface)
    check(!logoCanMove)
    check(!logoCanBeDeleted)
    check(!legalTextCanBeEdited)
    check(headlineCanBeEdited)
    check(headlineCanChangeTypeface)

    val exportedPng = engine.block.export(block = page, mimeType = MimeType.PNG)

    return exportedPng
}
```

Learn how to restrict available fonts to brand typefaces and lock brand
elements like logos and legal text, while keeping selected content editable.

![A branded Android export with locked logo and editable headline content](https://img.ly/docs/cesdk/android/rules/enforce-brand-guidelines-23a1e3/assets/android.hero.png)

> **Reading time:** 8 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-android-examples/tree/v1.81.0-nightly.20260809/engine-guides-enforce-brand-guidelines)

<EngineReferenceNote {...props} />

Brand guidelines enforcement in CE.SDK combines two complementary approaches:
restricting which assets users can choose and controlling what editing
operations are permitted on brand elements. This guide restricts the available
fonts to an approved set and uses the scopes system to lock brand elements like
logos and legal text so they cannot be modified. On Android, to restrict the
colors users can pick in the editor, configure `EditorConfiguration.colorPalette`
in your editor configuration. The example builds on a scene with a single page;
adapt the block creation to the scene your app edits.

The snippets below use the Android Engine API directly. If you expose the same
workflow through the CE.SDK editor UI, configure its font sheet separately so
the visible font families match the approved typeface assets; the
[Design Editor Starter Kit](../starterkits/design-editor.md) is a complete Android UI
surface you can adapt around this workflow.

## Restricting Fonts to Brand Typefaces

Register the `ly.img.typeface` asset source with only your approved typefaces
instead of loading the default typeface source, so only brand fonts are
available to choose from. Apply the approved typeface to existing text blocks
before validating or exporting the scene.

```kotlin highlight-android-restrict-fonts
    // Replace this sample asset URI with your bundled brand font file.
    val brandRegular = Font(
        uri = Uri.parse(
            "file:///android_asset/imgly-assets/ly.img.typeface/fonts/FiraSans/FiraSans-Regular.ttf",
        ),
        subFamily = "Regular",
        weight = FontWeight.NORMAL,
        style = FontStyle.NORMAL,
    )
    val brandTypeface = Typeface(name = "Brand Sans", fonts = listOf(brandRegular))
    val typefaceSourceId = "ly.img.typeface"
    val brandTextBlocks = listOf(logoText, legalText, headline)

    if (typefaceSourceId in engine.asset.findAllSources()) {
        engine.asset.removeSource(sourceId = typefaceSourceId)
    }
    engine.asset.addLocalSource(sourceId = typefaceSourceId, supportedMimeTypes = emptyList())
    engine.asset.addAsset(
        sourceId = typefaceSourceId,
        asset = AssetDefinition(
            id = "brand-sans",
            label = mapOf("en" to "Brand Sans"),
            payload = AssetPayload(typeface = brandTypeface),
        ),
    )
    engine.asset.assetSourceContentsChanged(sourceId = typefaceSourceId)

    brandTextBlocks.forEach { textBlock ->
        engine.block.setTypeface(block = textBlock, typeface = brandTypeface)
    }
```

Each `Typeface` has a display name and a list of `Font` entries. The sample
uses a bundled Android font asset so the snippet is copy-safe; replace that URI
with a bundled app asset or a self-hosted font file that belongs to your brand.

## Setting Global Scopes to Defer

Scopes control which operations are permitted. Setting a global scope to
`GlobalScope.DEFER` hands the decision to each block, so per-block settings take
effect.

```kotlin highlight-android-global-scope-defer
    val brandControlledScopes = listOf(
        "editor/select",
        "text/edit",
        "text/character",
        "fill/change",
        "layer/move",
        "layer/resize",
        "layer/rotate",
        "lifecycle/destroy",
        "lifecycle/duplicate",
    )

    brandControlledScopes.forEach { scope ->
        engine.editor.setGlobalScope(key = scope, globalScope = GlobalScope.DEFER)
    }
```

Without this, the global value applies everywhere and block-level settings are
ignored.

## Creating and Locking Brand Elements

Create or collect brand blocks such as a logo, wordmark, or legal text, then
disable the scopes that must stay protected. The sample uses existing block IDs
from its scene setup, but the same calls apply to blocks you create in code.

### Locking the Logo and Legal Text

```kotlin highlight-android-lock-brand-elements
// Use the IDs of brand blocks that already exist in your scene.
val lockedBrandBlocks = listOf(logo, logoText, legalText)
lockedBrandBlocks.forEach { brandBlock ->
    brandControlledScopes.forEach { scope ->
        engine.block.setScopeEnabled(block = brandBlock, key = scope, enabled = false)
    }
}
```

With these scopes disabled, protected blocks cannot be selected, moved, resized,
recolored, edited, duplicated, or deleted.

## Creating Editable Content Areas

While brand elements stay locked, other blocks can remain editable. Enable only
the scopes users need on each editable block.

```kotlin highlight-android-editable-content
// Use the ID of an editable text block that already exists in your scene.
engine.block.setScopeEnabled(block = headline, key = "editor/select", enabled = true)
engine.block.setScopeEnabled(block = headline, key = "text/edit", enabled = true)
engine.block.setScopeEnabled(block = headline, key = "text/character", enabled = true)
engine.block.setScopeEnabled(block = headline, key = "fill/change", enabled = true)
engine.block.setScopeEnabled(block = headline, key = "layer/move", enabled = false)
engine.block.setScopeEnabled(block = headline, key = "layer/resize", enabled = false)
engine.block.setScopeEnabled(block = headline, key = "layer/rotate", enabled = false)
engine.block.setScopeEnabled(block = headline, key = "lifecycle/destroy", enabled = false)
```

The sample headline can be selected, edited, restyled, and recolored, but it
cannot be moved, resized, rotated, or deleted.

## Validating Brand Compliance

Confirm that the constraints are enforced with
`engine.block.isAllowedByScope()`, which considers both the global and
block-level scope settings.

```kotlin highlight-android-validate-compliance
    val approvedTypefaces = engine.asset.findAssets(
        sourceId = typefaceSourceId,
        query = FindAssetsQuery(perPage = 10, page = 0),
    )
    val logoCanMove = engine.block.isAllowedByScope(block = logo, key = "layer/move")
    val logoCanBeDeleted = engine.block.isAllowedByScope(block = logo, key = "lifecycle/destroy")
    val legalTextCanBeEdited = engine.block.isAllowedByScope(block = legalText, key = "text/edit")
    val headlineCanBeEdited = engine.block.isAllowedByScope(block = headline, key = "text/edit")
    val headlineCanChangeTypeface = engine.block.isAllowedByScope(block = headline, key = "text/character")
    val approvedTypefaceDefinitions = approvedTypefaces.assets.mapNotNull { it.payload.typeface }.toSet()
    val brandTextUsesApprovedTypeface = brandTextBlocks.all { textBlock ->
        val typefaces = engine.block.getTypefaces(textBlock)
        typefaces.isNotEmpty() && typefaces.all { it in approvedTypefaceDefinitions }
    }

    check(approvedTypefaces.assets.size == 1)
    check(approvedTypefaceDefinitions.size == 1)
    check(brandTextUsesApprovedTypeface)
    check(!logoCanMove)
    check(!logoCanBeDeleted)
    check(!legalTextCanBeEdited)
    check(headlineCanBeEdited)
    check(headlineCanChangeTypeface)
```

Use these checks before saving, exporting, or handing a scene to another
surface.

## Exporting the Result

Export the page after configuring the brand rules. Locked blocks remain visible
in the final output and render alongside the editable content.

```kotlin highlight-android-export
val exportedPng = engine.block.export(block = page, mimeType = MimeType.PNG)
```

## Troubleshooting

- **Locked elements still movable**: Make sure the global scope is set to
  `GlobalScope.DEFER` before changing block-level settings; block-level values
  are ignored while the global scope allows or denies the operation directly.
- **Brand elements still editable**: Confirm the matching scope, for example
  `lifecycle/destroy`, `text/edit`, `text/character`, or `fill/change`, is
  disabled on the specific block.
- **Validation always passes**: `isAllowedByScope()` reflects the global scope
  unless it is deferred; verify the global scope before relying on block-level
  results.
- **Validation finds unapproved fonts**: Apply the approved typeface to existing
  text blocks before export.

## API Reference

| Method | Category | Purpose |
| --- | --- | --- |
| `engine.asset.addLocalSource(sourceId=_, supportedMimeTypes=_)` | Asset | Register a local source for approved brand typefaces |
| `engine.asset.findAllSources()` | Asset | Check whether the typeface source is already registered |
| `engine.asset.removeSource(sourceId=_)` | Asset | Remove an existing source before registering the approved typeface source |
| `engine.asset.addAsset(sourceId=_, asset=_)` | Asset | Add a typeface asset to the approved source |
| `engine.asset.assetSourceContentsChanged(sourceId=_)` | Asset | Notify the engine that the source contents changed |
| `engine.asset.findAssets(sourceId=_, query=_)` | Asset | Read back approved assets for validation |
| `engine.block.setTypeface(block=_, typeface=_)` | Text | Apply the approved typeface to text blocks already in the scene |
| `engine.block.getTypefaces(block=_)` | Text | Validate which typefaces existing text ranges use |
| `engine.editor.setGlobalScope(key=_, globalScope=_)` | Scope | Defer a scope to block-level settings |
| `engine.block.setScopeEnabled(block=_, key=_, enabled=_)` | Scope | Enable or disable a scope on one block |
| `engine.block.isAllowedByScope(block=_, key=_)` | Scope | Check whether an operation is allowed after global and block rules are combined |
| `engine.block.export(block=_, mimeType=_)` | Block | Export the page with the configured brand elements |

## Next Steps

- [Rules Overview](./overview.md) — Understand the scopes system fundamentals
- [Set Editing Constraints](../create-templates/add-dynamic-content/set-editing-constraints.md) — Configure template editing restrictions
- [Color Palette](../user-interface/customization/color-palette.md) — Customize available colors in the UI



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support