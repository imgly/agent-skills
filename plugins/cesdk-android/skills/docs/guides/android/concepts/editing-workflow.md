> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Concepts](../concepts.md) > [Editing Workflow](./editing-workflow.md)

---

```kotlin file=@cesdk_android_examples/engine-guides-editing-workflow/EditingWorkflow.kt reference-only
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.CoroutineStart
import kotlinx.coroutines.Job
import kotlinx.coroutines.NonCancellable
import kotlinx.coroutines.cancelAndJoin
import kotlinx.coroutines.flow.collect
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import ly.img.engine.Color
import ly.img.engine.DesignBlockType
import ly.img.engine.Engine
import ly.img.engine.FillType
import ly.img.engine.GlobalScope
import ly.img.engine.ShapeType
import ly.img.engine.SizeMode

private const val BRAND_BANNER_NAME = "Brand banner"
private const val COMPANY_NAME = "Company name"
private const val ATTENDEE_NAME = "Attendee name"

suspend fun editingWorkflow(
    engine: Engine,
    restoreEngineState: Boolean = false,
) = withContext(engine.dispatcher) {
    val previousRole = if (restoreEngineState) engine.editor.getRole() else null
    val previousSelectionMode = if (restoreEngineState) {
        engine.editor.getSettingEnum("doubleClickSelectionMode")
    } else {
        null
    }
    val previousGlobalScopes = if (restoreEngineState) {
        engine.editor.findAllScopes().associateWith { scope ->
            engine.editor.getGlobalScope(key = scope)
        }
    } else {
        emptyMap()
    }
    val roleCustomization = customizeEditingWorkflowRoles(engine, this)

    try {
        val template = createEditingWorkflowTemplate(engine)
        engine.block.forceLoadResources(listOf(template.companyName, template.attendeeName))
    } finally {
        withContext(NonCancellable) {
            roleCustomization.cancelAndJoin()
            previousRole?.let(engine.editor::setRole)
            previousSelectionMode?.let {
                engine.editor.setSettingEnum("doubleClickSelectionMode", value = it)
            }
            previousGlobalScopes.forEach { (scope, globalScope) ->
                engine.editor.setGlobalScope(key = scope, globalScope = globalScope)
            }
        }
    }
}

internal fun createEditingWorkflowTemplate(engine: Engine): EditingWorkflowTemplate {
    val scene = engine.scene.create()
    val page = engine.block.create(DesignBlockType.Page)
    engine.block.setWidth(page, value = 720F)
    engine.block.setHeight(page, value = 1080F)
    engine.block.appendChild(parent = scene, child = page)

    val background = engine.block.create(DesignBlockType.Graphic)
    engine.block.setName(background, "Card background")
    engine.block.setShape(background, shape = engine.block.createShape(ShapeType.Rect))
    engine.block.setWidth(background, value = 720F)
    engine.block.setHeight(background, value = 1080F)
    engine.block.setFill(background, fill = engine.block.createFill(FillType.Color))
    engine.block.setFillSolidColor(background, color = Color.fromRGBA(247, 249, 252, 255))
    engine.block.appendChild(parent = page, child = background)

    val brandBanner = engine.block.create(DesignBlockType.Graphic)
    engine.block.setName(brandBanner, BRAND_BANNER_NAME)
    engine.block.setShape(brandBanner, shape = engine.block.createShape(ShapeType.Rect))
    engine.block.setWidth(brandBanner, value = 640F)
    engine.block.setHeight(brandBanner, value = 220F)
    engine.block.setPositionX(brandBanner, value = 40F)
    engine.block.setPositionY(brandBanner, value = 48F)
    engine.block.setFill(brandBanner, fill = engine.block.createFill(FillType.Color))
    engine.block.setFillSolidColor(brandBanner, color = Color.fromHex("#FF0B1220"))
    engine.block.appendChild(parent = page, child = brandBanner)

    val companyName = engine.block.create(DesignBlockType.Text)
    engine.block.setName(companyName, COMPANY_NAME)
    engine.block.setWidthMode(companyName, mode = SizeMode.AUTO)
    engine.block.setHeightMode(companyName, mode = SizeMode.AUTO)
    engine.block.setPositionX(companyName, value = 88F)
    engine.block.setPositionY(companyName, value = 122F)
    engine.block.replaceText(companyName, text = "IMGLY Labs")
    engine.block.setTextColor(companyName, color = Color.fromHex("#FFFFFFFF"))
    engine.block.appendChild(parent = page, child = companyName)

    val attendeeName = engine.block.create(DesignBlockType.Text)
    engine.block.setName(attendeeName, ATTENDEE_NAME)
    engine.block.setWidthMode(attendeeName, mode = SizeMode.AUTO)
    engine.block.setHeightMode(attendeeName, mode = SizeMode.AUTO)
    engine.block.setPositionX(attendeeName, value = 88F)
    engine.block.setPositionY(attendeeName, value = 404F)
    engine.block.replaceText(attendeeName, text = "Alex Morgan")
    engine.block.setTextColor(attendeeName, color = Color.fromHex("#FF0B1220"))
    engine.block.setBackgroundColor(attendeeName, color = Color.fromRGBA(231, 240, 255, 255))
    engine.block.setBackgroundColorEnabled(attendeeName, enabled = true)
    engine.block.setFloat(attendeeName, property = "backgroundColor/paddingLeft", value = 24F)
    engine.block.setFloat(attendeeName, property = "backgroundColor/paddingTop", value = 20F)
    engine.block.setFloat(attendeeName, property = "backgroundColor/paddingRight", value = 24F)
    engine.block.setFloat(attendeeName, property = "backgroundColor/paddingBottom", value = 20F)
    engine.block.setFloat(attendeeName, property = "backgroundColor/cornerRadius", value = 18F)
    engine.block.appendChild(parent = page, child = attendeeName)

    // Roles define user types: "Creator", "Adopter", "Viewer", "Presenter".
    val role = engine.editor.getRole()
    println("Current role: $role") // "Creator"

    engine.editor.setRole("Adopter")
    val adopterRole = engine.editor.getRole()
    println("Preview role: $adopterRole") // "Adopter"

    engine.editor.setRole("Creator")

    // Defer to the block-level settings so the template controls the Adopter experience.
    engine.editor.setGlobalScope(key = "editor/select", globalScope = GlobalScope.DEFER)
    engine.editor.setGlobalScope(key = "layer/move", globalScope = GlobalScope.DEFER)
    engine.editor.setGlobalScope(key = "text/edit", globalScope = GlobalScope.DEFER)
    engine.editor.setGlobalScope(key = "text/character", globalScope = GlobalScope.DEFER)
    engine.editor.setGlobalScope(key = "lifecycle/destroy", globalScope = GlobalScope.DEFER)

    val moveScope = engine.editor.getGlobalScope(key = "layer/move")
    val allScopes = engine.editor.findAllScopes()
    println("Global 'layer/move' scope: $moveScope")
    println("Available scopes: ${allScopes.count()}")

    engine.block.setScopeEnabled(page, key = "editor/select", enabled = false)
    engine.block.setScopeEnabled(page, key = "layer/move", enabled = false)
    engine.block.setScopeEnabled(page, key = "lifecycle/destroy", enabled = false)

    engine.block.setScopeEnabled(background, key = "editor/select", enabled = false)
    engine.block.setScopeEnabled(background, key = "layer/move", enabled = false)
    engine.block.setScopeEnabled(background, key = "lifecycle/destroy", enabled = false)

    // Locked brand elements stay fixed for Adopters.
    engine.block.setScopeEnabled(brandBanner, key = "editor/select", enabled = false)
    engine.block.setScopeEnabled(brandBanner, key = "layer/move", enabled = false)
    engine.block.setScopeEnabled(brandBanner, key = "lifecycle/destroy", enabled = false)

    engine.block.setScopeEnabled(companyName, key = "editor/select", enabled = false)
    engine.block.setScopeEnabled(companyName, key = "layer/move", enabled = false)
    engine.block.setScopeEnabled(companyName, key = "text/edit", enabled = false)
    engine.block.setScopeEnabled(companyName, key = "text/character", enabled = false)
    engine.block.setScopeEnabled(companyName, key = "lifecycle/destroy", enabled = false)

    // Keep the attendee name editable but fixed in place.
    engine.block.setScopeEnabled(attendeeName, key = "editor/select", enabled = true)
    engine.block.setScopeEnabled(attendeeName, key = "layer/move", enabled = false)
    engine.block.setScopeEnabled(attendeeName, key = "text/edit", enabled = true)
    engine.block.setScopeEnabled(attendeeName, key = "text/character", enabled = false)
    engine.block.setScopeEnabled(attendeeName, key = "lifecycle/destroy", enabled = false)

    engine.editor.setRole("Creator")

    val creatorCanSelectBrandBanner = engine.block.isAllowedByScope(brandBanner, key = "editor/select")
    val creatorCanEditAttendeeName = engine.block.isAllowedByScope(attendeeName, key = "text/edit")

    println("Creator can select the banner: $creatorCanSelectBrandBanner") // true
    println("Creator can edit the attendee name: $creatorCanEditAttendeeName") // true

    engine.editor.setRole("Adopter")

    val adopterCanSelectBrandBanner = engine.block.isAllowedByScope(brandBanner, key = "editor/select")
    val adopterCanEditAttendeeName = engine.block.isAllowedByScope(attendeeName, key = "text/edit")

    println("Adopter can select the banner: $adopterCanSelectBrandBanner") // false
    println("Adopter can edit the attendee name: $adopterCanEditAttendeeName") // true

    engine.editor.setRole("Creator")

    return EditingWorkflowTemplate(
        brandBanner = brandBanner,
        companyName = companyName,
        attendeeName = attendeeName,
    )
}

fun customizeEditingWorkflowRoles(
    engine: Engine,
    scope: CoroutineScope,
): Job = scope.launch(start = CoroutineStart.UNDISPATCHED) {
    engine.editor.onRoleChanged().collect { role ->
        if (role == "Adopter") {
            engine.editor.setGlobalScope(key = "appearance/filter", globalScope = GlobalScope.ALLOW)
            engine.editor.setGlobalScope(key = "appearance/effect", globalScope = GlobalScope.ALLOW)
        }
    }
}

fun findEditingWorkflowTemplate(engine: Engine): EditingWorkflowTemplate = EditingWorkflowTemplate(
    brandBanner = requireNotNull(engine.block.findByName(BRAND_BANNER_NAME).firstOrNull()),
    companyName = requireNotNull(engine.block.findByName(COMPANY_NAME).firstOrNull()),
    attendeeName = requireNotNull(engine.block.findByName(ATTENDEE_NAME).firstOrNull()),
)
```

```kotlin file=@cesdk_android_examples/engine-guides-editing-workflow/EditingWorkflowTemplate.kt reference-only
import ly.img.engine.DesignBlock

data class EditingWorkflowTemplate(
    val brandBanner: DesignBlock,
    val companyName: DesignBlock,
    val attendeeName: DesignBlock,
)
```

CE.SDK controls editing access through roles and scopes, enabling template workflows where designers create locked layouts and end-users customize only the permitted parts.

> **Reading time:** 5 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-android-examples/tree/v1.82.0-nightly.20260821/engine-guides-editing-workflow)

<EngineReferenceNote {...props} />

The Kotlin snippets below assume you already have an `Engine` instance on the main thread.

CE.SDK uses a two-tier permission system: **roles** define user types with preset permissions, while **scopes** control specific capabilities. This enables workflows where templates can be prepared by designers and safely customized by end-users.

This guide covers:

- The four user roles and their purposes
- How scopes control editing capabilities
- The permission resolution hierarchy
- Common template workflow patterns

## Roles

Roles define user types with different default permissions:

| Role | Purpose | Default Access |
|------|---------|----------------|
| **Creator** | Designers building templates | Full access to all operations |
| **Adopter** | End-users customizing templates | Limited by block-level scopes |
| **Viewer** | Static preview without interaction | Read-only, no playback controls |
| **Presenter** | Presenting slideshows or playing videos | Read-only with playback and navigation |

Creators set the block-level scopes that constrain what Adopters can do. This separation enables brand consistency while allowing personalization.

```kotlin highlight-android-roles
    // Roles define user types: "Creator", "Adopter", "Viewer", "Presenter".
    val role = engine.editor.getRole()
    println("Current role: $role") // "Creator"

    engine.editor.setRole("Adopter")
    val adopterRole = engine.editor.getRole()
    println("Preview role: $adopterRole") // "Adopter"

    engine.editor.setRole("Creator")
```

## Scopes

Scopes define specific capabilities organized into categories:

- **Text**: Editing content and character formatting
- **Fill/Stroke**: Changing colors and shapes
- **Layer**: Moving, resizing, rotating, cropping
- **Appearance**: Filters, effects, shadows, animations
- **Lifecycle**: Deleting and duplicating elements
- **Editor**: Adding new elements and selecting

## Global vs Block-Level Scopes

**Global scopes** apply editor-wide and determine whether block-level settings are checked:

- `GlobalScope.ALLOW` — Always permit the operation
- `GlobalScope.DENY` — Always block the operation
- `GlobalScope.DEFER` — Check block-level scope settings

**Block-level scopes** control permissions on individual blocks. These settings only take effect when the corresponding global scope is set to `GlobalScope.DEFER`.

```kotlin highlight-android-globalScopes
    // Defer to the block-level settings so the template controls the Adopter experience.
    engine.editor.setGlobalScope(key = "editor/select", globalScope = GlobalScope.DEFER)
    engine.editor.setGlobalScope(key = "layer/move", globalScope = GlobalScope.DEFER)
    engine.editor.setGlobalScope(key = "text/edit", globalScope = GlobalScope.DEFER)
    engine.editor.setGlobalScope(key = "text/character", globalScope = GlobalScope.DEFER)
    engine.editor.setGlobalScope(key = "lifecycle/destroy", globalScope = GlobalScope.DEFER)

    val moveScope = engine.editor.getGlobalScope(key = "layer/move")
    val allScopes = engine.editor.findAllScopes()
    println("Global 'layer/move' scope: $moveScope")
    println("Available scopes: ${allScopes.count()}")
```

To lock a specific block, disable its scopes:

```kotlin highlight-android-blockScopes
    engine.block.setScopeEnabled(page, key = "editor/select", enabled = false)
    engine.block.setScopeEnabled(page, key = "layer/move", enabled = false)
    engine.block.setScopeEnabled(page, key = "lifecycle/destroy", enabled = false)

    engine.block.setScopeEnabled(background, key = "editor/select", enabled = false)
    engine.block.setScopeEnabled(background, key = "layer/move", enabled = false)
    engine.block.setScopeEnabled(background, key = "lifecycle/destroy", enabled = false)

    // Locked brand elements stay fixed for Adopters.
    engine.block.setScopeEnabled(brandBanner, key = "editor/select", enabled = false)
    engine.block.setScopeEnabled(brandBanner, key = "layer/move", enabled = false)
    engine.block.setScopeEnabled(brandBanner, key = "lifecycle/destroy", enabled = false)

    engine.block.setScopeEnabled(companyName, key = "editor/select", enabled = false)
    engine.block.setScopeEnabled(companyName, key = "layer/move", enabled = false)
    engine.block.setScopeEnabled(companyName, key = "text/edit", enabled = false)
    engine.block.setScopeEnabled(companyName, key = "text/character", enabled = false)
    engine.block.setScopeEnabled(companyName, key = "lifecycle/destroy", enabled = false)

    // Keep the attendee name editable but fixed in place.
    engine.block.setScopeEnabled(attendeeName, key = "editor/select", enabled = true)
    engine.block.setScopeEnabled(attendeeName, key = "layer/move", enabled = false)
    engine.block.setScopeEnabled(attendeeName, key = "text/edit", enabled = true)
    engine.block.setScopeEnabled(attendeeName, key = "text/character", enabled = false)
    engine.block.setScopeEnabled(attendeeName, key = "lifecycle/destroy", enabled = false)
```

In the example template, the brand banner and company name are locked while the attendee name keeps `editor/select` and `text/edit` enabled so adopters can personalize the template without moving or deleting anything.

## Permission Resolution

Permissions resolve in this order:

1. **Role defaults** — Each role has preset global scope values
2. **Global scope** — If `GlobalScope.ALLOW` or `GlobalScope.DENY`, this is the final answer
3. **Block-level scope** — If global is `GlobalScope.DEFER`, check the block's settings

Use `isAllowedByScope()` to check the final computed permission for any block and scope combination:

```kotlin highlight-android-checkPermissions
    engine.editor.setRole("Creator")

    val creatorCanSelectBrandBanner = engine.block.isAllowedByScope(brandBanner, key = "editor/select")
    val creatorCanEditAttendeeName = engine.block.isAllowedByScope(attendeeName, key = "text/edit")

    println("Creator can select the banner: $creatorCanSelectBrandBanner") // true
    println("Creator can edit the attendee name: $creatorCanEditAttendeeName") // true
```

## Switching Roles

Change roles at runtime with `setRole()`. When switching to Adopter, block-level restrictions take effect. Switching back to Creator restores full access.

```kotlin highlight-android-switchRole
    engine.editor.setRole("Adopter")

    val adopterCanSelectBrandBanner = engine.block.isAllowedByScope(brandBanner, key = "editor/select")
    val adopterCanEditAttendeeName = engine.block.isAllowedByScope(attendeeName, key = "text/edit")

    println("Adopter can select the banner: $adopterCanSelectBrandBanner") // false
    println("Adopter can edit the attendee name: $adopterCanEditAttendeeName") // true

    engine.editor.setRole("Creator")
```

## Customizing Role Behavior

`onRoleChanged()` returns a `Flow<String>` that emits after role defaults are applied. Collect it before switching roles when you need to override selected scopes for a role:

```kotlin highlight-android-customizeRoleBehavior
fun customizeEditingWorkflowRoles(
    engine: Engine,
    scope: CoroutineScope,
): Job = scope.launch(start = CoroutineStart.UNDISPATCHED) {
    engine.editor.onRoleChanged().collect { role ->
        if (role == "Adopter") {
            engine.editor.setGlobalScope(key = "appearance/filter", globalScope = GlobalScope.ALLOW)
            engine.editor.setGlobalScope(key = "appearance/effect", globalScope = GlobalScope.ALLOW)
        }
    }
}
```

> **Warning:** Scope changes made in the role-change collector override the role defaults for the active engine session.

## Template Workflow Pattern

A typical template workflow:

1. **Designer (Creator)** creates the template layout
2. **Designer** locks brand elements using block scopes
3. **Designer** keeps personalization fields editable
4. **End-user (Adopter)** opens the template
5. **End-user** edits only permitted elements
6. **End-user** exports the personalized result

This pattern ensures brand consistency while enabling personalization. The Android example creates a small template with locked brand elements and one editable personalization field:

```kotlin highlight-android-templateScene
    val brandBanner = engine.block.create(DesignBlockType.Graphic)
    engine.block.setName(brandBanner, BRAND_BANNER_NAME)
    engine.block.setShape(brandBanner, shape = engine.block.createShape(ShapeType.Rect))
    engine.block.setWidth(brandBanner, value = 640F)
    engine.block.setHeight(brandBanner, value = 220F)
    engine.block.setPositionX(brandBanner, value = 40F)
    engine.block.setPositionY(brandBanner, value = 48F)
    engine.block.setFill(brandBanner, fill = engine.block.createFill(FillType.Color))
    engine.block.setFillSolidColor(brandBanner, color = Color.fromHex("#FF0B1220"))
    engine.block.appendChild(parent = page, child = brandBanner)

    val companyName = engine.block.create(DesignBlockType.Text)
    engine.block.setName(companyName, COMPANY_NAME)
    engine.block.setWidthMode(companyName, mode = SizeMode.AUTO)
    engine.block.setHeightMode(companyName, mode = SizeMode.AUTO)
    engine.block.setPositionX(companyName, value = 88F)
    engine.block.setPositionY(companyName, value = 122F)
    engine.block.replaceText(companyName, text = "IMGLY Labs")
    engine.block.setTextColor(companyName, color = Color.fromHex("#FFFFFFFF"))
    engine.block.appendChild(parent = page, child = companyName)

    val attendeeName = engine.block.create(DesignBlockType.Text)
    engine.block.setName(attendeeName, ATTENDEE_NAME)
    engine.block.setWidthMode(attendeeName, mode = SizeMode.AUTO)
    engine.block.setHeightMode(attendeeName, mode = SizeMode.AUTO)
    engine.block.setPositionX(attendeeName, value = 88F)
    engine.block.setPositionY(attendeeName, value = 404F)
    engine.block.replaceText(attendeeName, text = "Alex Morgan")
    engine.block.setTextColor(attendeeName, color = Color.fromHex("#FF0B1220"))
    engine.block.setBackgroundColor(attendeeName, color = Color.fromRGBA(231, 240, 255, 255))
    engine.block.setBackgroundColorEnabled(attendeeName, enabled = true)
    engine.block.setFloat(attendeeName, property = "backgroundColor/paddingLeft", value = 24F)
    engine.block.setFloat(attendeeName, property = "backgroundColor/paddingTop", value = 20F)
    engine.block.setFloat(attendeeName, property = "backgroundColor/paddingRight", value = 24F)
    engine.block.setFloat(attendeeName, property = "backgroundColor/paddingBottom", value = 20F)
    engine.block.setFloat(attendeeName, property = "backgroundColor/cornerRadius", value = 18F)
    engine.block.appendChild(parent = page, child = attendeeName)
```

## Troubleshooting

- **Block-level restrictions do not apply** — Set the matching global scope to `GlobalScope.DEFER`; `GlobalScope.ALLOW` and `GlobalScope.DENY` bypass block settings.
- **Role-specific overrides disappear after switching roles** — Apply custom scope changes from `onRoleChanged()` because role defaults are applied during the role switch.
- **A block cannot be selected at all** — Check `editor/select`; disabling that scope prevents interaction before other scope checks can matter.

## API Reference

| API | Purpose |
|-----|---------|
| `engine.editor.setRole(role=_)` | Set the active user role. |
| `engine.editor.getRole()` | Read the active user role. |
| `engine.editor.onRoleChanged()` | Collect role changes after role defaults are applied. |
| `engine.editor.setGlobalScope(key="layer/move",globalScope=_)` | Allow, deny, or defer an operation globally. |
| `engine.editor.getGlobalScope(key="layer/move")` | Read the global state for one scope. |
| `engine.editor.findAllScopes()` | List all scope keys supported by the engine. |
| `engine.scene.create()` | Create the template scene. |
| `engine.block.create(type=_)` | Create page, graphic, and text blocks. |
| `engine.block.setName(block=_,name=_)` | Assign readable block names for later lookup. |
| `engine.block.createShape(type=_)` | Create the banner shape. |
| `engine.block.setShape(block=_,shape=_)` | Attach a shape to a graphic block. |
| `engine.block.setWidth(block=_,value=_)` / `setHeight(block=_,value=_)` | Set fixed block dimensions. |
| `engine.block.setWidthMode(block=_,mode=_)` / `setHeightMode(block=_,mode=_)` | Let text blocks size to their content. |
| `engine.block.setPositionX(block=_,value=_)` / `setPositionY(block=_,value=_)` | Position template blocks on the page. |
| `engine.block.createFill(type=_)` | Create a fill block for a graphic. |
| `engine.block.setFill(block=_,fill=_)` | Assign the fill to a graphic block. |
| `engine.block.setFillSolidColor(block=_,color=_)` | Set the color of a solid fill without raw property paths. |
| `engine.block.replaceText(block=_,text=_)` | Set the editable template text. |
| `engine.block.setTextColor(block=_,color=_)` | Set text color. |
| `engine.block.setBackgroundColor(block=_,color=_)` | Set the text background color. |
| `engine.block.setBackgroundColorEnabled(block=_,enabled=_)` | Enable the text background. |
| `engine.block.setFloat(block=_,property=_,value=_)` | Configure text background padding and corner radius. |
| `engine.block.appendChild(parent=_,child=_)` | Add blocks to the scene hierarchy. |
| `engine.block.setScopeEnabled(block=_,key="text/edit",enabled=_)` | Enable or disable one scope on a block. |
| `engine.block.isScopeEnabled(block=_,key="text/edit")` | Read the block-level scope flag. |
| `engine.block.isAllowedByScope(block=_,key="text/edit")` | Check the final resolved permission for a block. |

## Next Steps

- [Lock Design Elements](../create-templates/lock.md) — Step-by-step instructions for locking specific elements in templates
- [Set Editing Constraints](../create-templates/add-dynamic-content/set-editing-constraints.md) — Learn how to control editing capabilities in CE.SDK templates using the Scope system to lock positions, prevent transformations, and create guided editing experiences



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support