> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Create and Use Templates](../create-templates.md) > [Lock the Template](./lock.md)

---

```kotlin file=@cesdk_android_examples/engine-guides-lock-template/LockTemplate.kt reference-only
import ly.img.engine.Color
import ly.img.engine.DesignBlockType
import ly.img.engine.Engine
import ly.img.engine.FillType
import ly.img.engine.GlobalScope
import ly.img.engine.ShapeType
import ly.img.engine.SizeMode

fun lockTemplate(engine: Engine) {
    engine.editor.setRole("Creator")
    val creatorRole = engine.editor.getRole()

    require(creatorRole == "Creator")

    val scene = engine.scene.create()
    val page = engine.block.create(DesignBlockType.Page)
    engine.block.setWidth(page, value = 720F)
    engine.block.setHeight(page, value = 1080F)
    engine.block.appendChild(parent = scene, child = page)

    val background = engine.block.create(DesignBlockType.Graphic)
    engine.block.setName(background, "Template background")
    engine.block.setShape(background, shape = engine.block.createShape(ShapeType.Rect))
    engine.block.setWidth(background, value = 720F)
    engine.block.setHeight(background, value = 1080F)
    engine.block.setFill(background, fill = engine.block.createFill(FillType.Color))
    engine.block.setFillSolidColor(background, color = Color.fromHex("#FFF7F9FC"))
    engine.block.appendChild(parent = page, child = background)

    val brandBanner = engine.block.create(DesignBlockType.Graphic)
    engine.block.setName(brandBanner, "Locked brand banner")
    engine.block.setShape(brandBanner, shape = engine.block.createShape(ShapeType.Rect))
    engine.block.setWidth(brandBanner, value = 640F)
    engine.block.setHeight(brandBanner, value = 220F)
    engine.block.setPositionX(brandBanner, value = 40F)
    engine.block.setPositionY(brandBanner, value = 48F)
    engine.block.setFill(brandBanner, fill = engine.block.createFill(FillType.Color))
    engine.block.setFillSolidColor(brandBanner, color = Color.fromHex("#FF11203A"))
    engine.block.appendChild(parent = page, child = brandBanner)

    val brandName = engine.block.create(DesignBlockType.Text)
    engine.block.setName(brandName, "Locked brand name")
    engine.block.setWidthMode(brandName, mode = SizeMode.AUTO)
    engine.block.setHeightMode(brandName, mode = SizeMode.AUTO)
    engine.block.setPositionX(brandName, value = 88F)
    engine.block.setPositionY(brandName, value = 124F)
    engine.block.replaceText(brandName, text = "Brand Studio")
    engine.block.setTextColor(brandName, color = Color.fromHex("#FFFFFFFF"))
    engine.block.appendChild(parent = page, child = brandName)

    val headline = engine.block.create(DesignBlockType.Text)
    engine.block.setName(headline, "Editable campaign headline")
    engine.block.setWidthMode(headline, mode = SizeMode.AUTO)
    engine.block.setHeightMode(headline, mode = SizeMode.AUTO)
    engine.block.setPositionX(headline, value = 88F)
    engine.block.setPositionY(headline, value = 404F)
    engine.block.replaceText(headline, text = "Spring Launch")
    engine.block.setTextColor(headline, color = Color.fromHex("#FF11203A"))
    engine.block.setBackgroundColor(headline, color = Color.fromRGBA(231, 240, 255, 255))
    engine.block.setBackgroundColorEnabled(headline, enabled = true)
    engine.block.setFloat(headline, property = "backgroundColor/paddingLeft", value = 24F)
    engine.block.setFloat(headline, property = "backgroundColor/paddingTop", value = 20F)
    engine.block.setFloat(headline, property = "backgroundColor/paddingRight", value = 24F)
    engine.block.setFloat(headline, property = "backgroundColor/paddingBottom", value = 20F)
    engine.block.setFloat(headline, property = "backgroundColor/cornerRadius", value = 18F)
    engine.block.appendChild(parent = page, child = headline)

    val templateScopes = listOf(
        "editor/select",
        "text/edit",
        "text/character",
        "fill/change",
        "layer/move",
        "layer/resize",
        "layer/rotate",
        "lifecycle/destroy",
    )

    listOf(page, background, brandBanner, brandName).forEach { lockedBlock ->
        templateScopes.forEach { scope ->
            engine.block.setScopeEnabled(block = lockedBlock, key = scope, enabled = false)
        }
    }

    engine.block.setScopeEnabled(block = headline, key = "editor/select", enabled = true)
    engine.block.setScopeEnabled(block = headline, key = "text/edit", enabled = true)
    engine.block.setScopeEnabled(block = headline, key = "text/character", enabled = false)
    engine.block.setScopeEnabled(block = headline, key = "fill/change", enabled = false)
    engine.block.setScopeEnabled(block = headline, key = "layer/move", enabled = false)
    engine.block.setScopeEnabled(block = headline, key = "layer/resize", enabled = false)
    engine.block.setScopeEnabled(block = headline, key = "layer/rotate", enabled = false)
    engine.block.setScopeEnabled(block = headline, key = "lifecycle/destroy", enabled = false)

    engine.editor.setRole("Creator")

    val creatorCanSelectBrandBanner = engine.block.isAllowedByScope(brandBanner, key = "editor/select")
    val creatorCanEditHeadline = engine.block.isAllowedByScope(headline, key = "text/edit")

    require(creatorCanSelectBrandBanner)
    require(creatorCanEditHeadline)

    engine.editor.setRole("Adopter")
    engine.editor.setGlobalScope(key = "editor/add", globalScope = GlobalScope.DENY)

    val adopterCanAddBlocks = engine.block.isAllowedByScope(headline, key = "editor/add")
    val adopterCanSelectBrandBanner = engine.block.isAllowedByScope(brandBanner, key = "editor/select")
    val adopterCanEditHeadline = engine.block.isAllowedByScope(headline, key = "text/edit")
    val adopterCanRestyleHeadline = engine.block.isAllowedByScope(headline, key = "text/character")
    val adopterCanMoveHeadline = engine.block.isAllowedByScope(headline, key = "layer/move")
    val adopterCanDeleteHeadline = engine.block.isAllowedByScope(headline, key = "lifecycle/destroy")

    require(!adopterCanAddBlocks)
    require(!adopterCanSelectBrandBanner)
    require(adopterCanEditHeadline)
    require(!adopterCanRestyleHeadline)
    require(!adopterCanMoveHeadline)
    require(!adopterCanDeleteHeadline)

    engine.editor.setRole("Viewer")
    val viewerRole = engine.editor.getRole()

    require(viewerRole == "Viewer")

    engine.editor.setRole("Creator")
}
```

Set up a two-surface template workflow where creators build and lock layouts
while adopters customize only the areas you allow.

> **Reading time:** 6 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-android-examples/tree/v1.83.0-nightly.20260901/engine-guides-lock-template)

<EngineReferenceNote {...props} />

Many integrations need two editing experiences: one for designers or admins who build templates, and one for end users who fill them in. CE.SDK models this with roles and scopes. Use a Creator surface to prepare the template. In production, save that configured template and load it in an Adopter surface; the sample keeps both roles in one scene so it can focus on the permission rules.

The snippets below use the Android Engine API directly. The same role and scope settings are respected by the CE.SDK editor UI; the [Design Editor Starter Kit](../starterkits/design-editor.md) is a complete Android UI surface you can configure around this workflow.

For detailed scope configuration patterns, see [Lock Content](../rules/lock-content.md).

## Understanding the Two-Surface Pattern

Template-based workflows usually split users by responsibility:

| Surface | Users | Role | What they can do |
| ------- | ----- | ---- | ---------------- |
| Creator surface | Designers, admins | `Creator` | Build templates, set locks, and save the result |
| Adopter surface | End users, marketers | `Adopter` | Modify only blocks with enabled scopes |

This separation protects the template's brand and layout rules while still allowing personalization. The Creator role has full access. The Adopter role applies its default permissions and evaluates block-level scopes.

## Setting Up the Creator Surface

Set the engine role to `Creator` while building or updating the template. Creators can configure locked brand elements, editable text, and other scope rules before saving the scene.

```kotlin highlight-android-creator-surface
    engine.editor.setRole("Creator")
    val creatorRole = engine.editor.getRole()

    require(creatorRole == "Creator")
```

In an app, this surface can be a dedicated admin screen, a separate editor configuration, or an internal template-building flow.

## Configuring What Users Can Edit

Scopes decide which operations Adopters can perform. In `Creator`, disable operations on locked blocks and enable only the scopes that should be available on each editable block.

```kotlin highlight-android-configure-scopes
    val templateScopes = listOf(
        "editor/select",
        "text/edit",
        "text/character",
        "fill/change",
        "layer/move",
        "layer/resize",
        "layer/rotate",
        "lifecycle/destroy",
    )

    listOf(page, background, brandBanner, brandName).forEach { lockedBlock ->
        templateScopes.forEach { scope ->
            engine.block.setScopeEnabled(block = lockedBlock, key = scope, enabled = false)
        }
    }

    engine.block.setScopeEnabled(block = headline, key = "editor/select", enabled = true)
    engine.block.setScopeEnabled(block = headline, key = "text/edit", enabled = true)
    engine.block.setScopeEnabled(block = headline, key = "text/character", enabled = false)
    engine.block.setScopeEnabled(block = headline, key = "fill/change", enabled = false)
    engine.block.setScopeEnabled(block = headline, key = "layer/move", enabled = false)
    engine.block.setScopeEnabled(block = headline, key = "layer/resize", enabled = false)
    engine.block.setScopeEnabled(block = headline, key = "layer/rotate", enabled = false)
    engine.block.setScopeEnabled(block = headline, key = "lifecycle/destroy", enabled = false)
```

The example keeps the brand banner, background, and brand name locked. The campaign headline can be selected and edited, but it cannot be moved, resized, restyled, or deleted.

## Checking Creator Permissions

After setting block-level scopes, switch back to `Creator` to confirm the template-building surface still has full access. Creator permissions ignore the locks that constrain Adopters.

```kotlin highlight-android-check-creator-permissions
    engine.editor.setRole("Creator")

    val creatorCanSelectBrandBanner = engine.block.isAllowedByScope(brandBanner, key = "editor/select")
    val creatorCanEditHeadline = engine.block.isAllowedByScope(headline, key = "text/edit")

    require(creatorCanSelectBrandBanner)
    require(creatorCanEditHeadline)
```

This check is useful in tooling that lets designers preview the template before publishing it.

## Setting Up the Adopter Surface

For production surfaces, load the saved template in the end-user surface, then set the role to `Adopter`. In this sample, the same scene switches to `Adopter` after scope setup. Because `setRole("Adopter")` applies the role's default global scopes, deny `editor/add` after setting the role when adopters should only edit existing template areas.

```kotlin highlight-android-adopter-surface
    engine.editor.setRole("Adopter")
    engine.editor.setGlobalScope(key = "editor/add", globalScope = GlobalScope.DENY)

    val adopterCanAddBlocks = engine.block.isAllowedByScope(headline, key = "editor/add")
    val adopterCanSelectBrandBanner = engine.block.isAllowedByScope(brandBanner, key = "editor/select")
    val adopterCanEditHeadline = engine.block.isAllowedByScope(headline, key = "text/edit")
    val adopterCanRestyleHeadline = engine.block.isAllowedByScope(headline, key = "text/character")
    val adopterCanMoveHeadline = engine.block.isAllowedByScope(headline, key = "layer/move")
    val adopterCanDeleteHeadline = engine.block.isAllowedByScope(headline, key = "lifecycle/destroy")

    require(!adopterCanAddBlocks)
    require(!adopterCanSelectBrandBanner)
    require(adopterCanEditHeadline)
    require(!adopterCanRestyleHeadline)
    require(!adopterCanMoveHeadline)
    require(!adopterCanDeleteHeadline)
```

In this state, users can edit the headline text but cannot add new blocks, select the locked brand banner, or move the headline.

## When to Use This Pattern

Use separate Creator and Adopter surfaces when your integration needs controlled customization:

- **Brand template systems**: Teams personalize approved layouts without changing brand assets.
- **Design approval workflows**: Reviewers can inspect a template without accidentally changing protected blocks.
- **Self-service customization**: Customers edit designated fields inside fixed layout rules.
- **White-label products**: Tenant-specific surfaces expose only the areas each tenant may change.

For simpler integrations where every user has the same permissions, a single role may be enough.

## Viewer Role for Read-Only Access

For preview or approval screens where no editing should happen, use the `Viewer` role instead of `Adopter`.

```kotlin highlight-android-viewer-surface
    engine.editor.setRole("Viewer")
    val viewerRole = engine.editor.getRole()

    require(viewerRole == "Viewer")
```

Use `Viewer` for read-only display. Use `Adopter` when users should edit selected placeholders, text blocks, or media areas.

## Troubleshooting

| Issue | Cause | Solution |
| ----- | ----- | -------- |
| Adopters can edit everything | The surface is still in `Creator`, or the locked blocks still have operation scopes enabled | Set the role to `Adopter` and disable the relevant block scopes in the Creator surface |
| Adopters cannot select an editable block | `editor/select` is disabled on that block | Enable `editor/select` on every block users should interact with |
| A block is selectable but cannot be changed | The operation-specific scope is disabled | Enable the matching scope, such as `text/edit` for text content or `fill/change` for image replacement |
| Adopters can add new blocks | `editor/add` is still allowed by the Adopter role defaults | After setting the role to `Adopter`, set `editor/add` to `GlobalScope.DENY` |
| Creator tooling appears locked | The active role is not `Creator` | Switch the template-building surface back to `Creator` before editing locks |
| Template locks do not appear after loading a template | The production template was not saved after configuring scopes | Save the scene/template after setting block scopes in the Creator surface, then load that saved template in the Adopter surface. |

## API Reference

| Method | Purpose |
| ------ | ------- |
| `engine.editor.setRole(role=_)` | Set the active user role, such as `Creator`, `Adopter`, or `Viewer`. |
| `engine.editor.getRole()` | Read the active user role. |
| `engine.editor.setGlobalScope(key=_,globalScope=_)` | Allow, deny, or defer an operation globally. |
| `engine.block.setScopeEnabled(block=_,key=_,enabled=_)` | Enable or disable a scope on one block. |
| `engine.block.isAllowedByScope(block=_,key=_)` | Check the final permission after role, global scope, and block-level scope evaluation. |

### Common Scopes

| Scope | Description |
| ----- | ----------- |
| `editor/add` | Allow adding new blocks. |
| `editor/select` | Allow selecting the block. |
| `text/edit` | Allow editing text content. |
| `text/character` | Allow changing text styling such as font or size. |
| `fill/change` | Allow changing fill content or text color. |
| `layer/move` | Allow moving the block. |
| `layer/resize` | Allow resizing the block. |
| `layer/rotate` | Allow rotating the block. |
| `lifecycle/destroy` | Allow deleting the block. |

## Next Steps

- [Lock Content](../rules/lock-content.md) - Lock design elements to prevent unwanted modifications using CE.SDK's scope-based permission system
- [Set Editing Constraints](./add-dynamic-content/set-editing-constraints.md) — Learn how to control editing capabilities in CE.SDK templates using the Scope system to lock positions, prevent transformations, and create guided editing experiences
- [Placeholders](./add-dynamic-content/placeholders.md) - Mark editable image, video, or text areas within a locked template layout



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support