> This is one page of the CE.SDK macOS documentation. For a complete overview, see the [macOS Documentation Index](https://img.ly/docs/cesdk/macos/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/macos/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Create and Use Templates](../create-templates.md) > [Lock the Template](./lock.md)

---

```swift file=@cesdk_swift_examples/engine-guides-lock-template/LockTemplate.swift reference-only
import Foundation
import IMGLYEngine

@MainActor
func lockTemplate(engine: Engine) throws {
  let baseURL = try engine.guidesBaseURL
  let logoImage = baseURL.appendingPathComponent("ly.img.image/images/sample_1.jpg")

  // Build a brand template with a logo and a headline. New engine instances
  // start in the default Creator role.
  let scene = try engine.scene.create()
  let page = try engine.block.create(.page)
  try engine.block.setWidth(page, value: 800)
  try engine.block.setHeight(page, value: 500)
  try engine.block.appendChild(to: scene, child: page)

  let logo = try engine.block.create(.graphic)
  try engine.block.setShape(logo, shape: engine.block.createShape(.rect))
  let logoFill = try engine.block.createFill(.image)
  try engine.block.setURL(logoFill, property: "fill/image/imageFileURI", value: logoImage)
  try engine.block.setFill(logo, fill: logoFill)
  try engine.block.setPositionX(logo, value: 40)
  try engine.block.setPositionY(logo, value: 40)
  try engine.block.setWidth(logo, value: 120)
  try engine.block.setHeight(logo, value: 80)
  try engine.block.setName(logo, name: "Logo")
  try engine.block.appendChild(to: page, child: logo)

  let headline = try engine.block.create(.text)
  try engine.block.replaceText(headline, text: "Edit this headline")
  try engine.block.setFloat(headline, property: "text/fontSize", value: 48)
  try engine.block.setEnum(headline, property: "text/horizontalAlignment", value: "Center")
  try engine.block.setWidth(headline, value: 720)
  try engine.block.setHeightMode(headline, mode: .auto)
  try engine.block.setPositionX(headline, value: 40)
  try engine.block.setPositionY(headline, value: 200)
  try engine.block.setName(headline, name: "Headline")
  try engine.block.appendChild(to: page, child: headline)

  try engine.editor.setRole("Creator")

  let activeRole = try engine.editor.getRole()
  print("Active role:", activeRole) // Creator

  try engine.block.setScopeEnabled(headline, key: "editor/select", enabled: true)
  try engine.block.setScopeEnabled(headline, key: "text/edit", enabled: true)

  let headlineIsSelectable = try engine.block.isScopeEnabled(headline, key: "editor/select")
  print("Headline editor/select enabled:", headlineIsSelectable) // true

  try engine.editor.setRole("Adopter")

  let canEditHeadline = try engine.block.isAllowedByScope(headline, key: "text/edit")
  let canSelectLogo = try engine.block.isAllowedByScope(logo, key: "editor/select")
  let canMoveLogo = try engine.block.isAllowedByScope(logo, key: "layer/move")
  print("Adopter can edit the headline:", canEditHeadline) // true
  print("Adopter can select the logo:", canSelectLogo) // false
  print("Adopter can move the logo:", canMoveLogo) // false

  try engine.editor.setRole("Creator")

  let creatorCanMoveLogo = try engine.block.isAllowedByScope(logo, key: "layer/move")
  let headlineStillEditable = try engine.block.isScopeEnabled(headline, key: "text/edit")
  print("Creator can move the logo:", creatorCanMoveLogo) // true
  print("Headline text/edit survived the switch:", headlineStillEditable) // true
}
```

Set up a two-surface integration where template creators have full editing access while template adopters can only modify designated areas.

> **Reading time:** 8 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-swift-examples/tree/v1.83.0-nightly.20260905/engine-guides-lock-template)

<EngineReferenceNote {...props} />

Many integrations need two different editing experiences: one for designers who build templates, and one for end users who customize them. The Creator and Adopter roles make this possible—same CE.SDK, different permissions based on who's using it. For detailed scope configuration patterns, see [Lock Content](../rules/lock-content.md).

The example builds a brand template with a logo and a headline, marks only the headline as editable, then switches between the Creator and Adopter roles to show how the effective permissions change.

## Understanding the Two-Surface Pattern

Template-based workflows typically involve two distinct user groups with different needs:

| Surface         | Users                | Role      | What they can do                              |
| --------------- | -------------------- | --------- | --------------------------------------------- |
| Creator Surface | Designers, admins    | `Creator` | Full editing—build templates, set locks       |
| Adopter Surface | End users, marketers | `Adopter` | Restricted editing—only modify unlocked areas |

This separation protects design intent while enabling customization. Each role installs its own global scope defaults: the Creator role sets every global scope to `.allow`, so block-level locks are never consulted. The Adopter role defers the global scopes to each block's own settings, so the locks configured by creators decide what users can modify.

## Setting Up the Creator Surface

The Creator surface is where templates are built. Call `engine.editor.setRole(_:)` with `"Creator"` to give designers unrestricted access. New engine instances already start in the Creator role; the explicit call documents the surface's intent. Read the active role back with `engine.editor.getRole()`.

```swift highlight-lockTemplate-creatorSurface
  try engine.editor.setRole("Creator")

  let activeRole = try engine.editor.getRole()
  print("Active role:", activeRole) // Creator
```

Under the Creator role's defaults, every operation is permitted regardless of block-level scope settings. This is where designers build the template layout, configure which elements should be editable with `engine.block.setScopeEnabled(_:key:enabled:)`, and save the template for distribution.

## Configuring What Users Can Edit

The scope system controls what Adopters can modify. While in the Creator role, enable specific scopes on the blocks that should stay editable. Verify a block-level setting with `engine.block.isScopeEnabled(_:key:)`.

```swift highlight-lockTemplate-configureScopes
  try engine.block.setScopeEnabled(headline, key: "editor/select", enabled: true)
  try engine.block.setScopeEnabled(headline, key: "text/edit", enabled: true)

  let headlineIsSelectable = try engine.block.isScopeEnabled(headline, key: "editor/select")
  print("Headline editor/select enabled:", headlineIsSelectable) // true
```

When Adopters load this template, they can edit the headline text but nothing else. The `editor/select` scope must be enabled for users to interact with a block at all. The logo keeps its defaults—blocks created under the Creator role start with every block-level scope disabled—so it stays locked for Adopters. For comprehensive scope configuration patterns, see [Lock Content](../rules/lock-content.md).

## Setting Up the Adopter Surface

The Adopter surface is where templates are used. Call `engine.editor.setRole(_:)` with `"Adopter"` to apply the restrictions configured by creators. Check the resulting permissions with `engine.block.isAllowedByScope(_:key:)`, which evaluates the global and block-level settings together.

```swift highlight-lockTemplate-adopterSurface
  try engine.editor.setRole("Adopter")

  let canEditHeadline = try engine.block.isAllowedByScope(headline, key: "text/edit")
  let canSelectLogo = try engine.block.isAllowedByScope(logo, key: "editor/select")
  let canMoveLogo = try engine.block.isAllowedByScope(logo, key: "layer/move")
  print("Adopter can edit the headline:", canEditHeadline) // true
  print("Adopter can select the logo:", canSelectLogo) // false
  print("Adopter can move the logo:", canMoveLogo) // false
```

The Adopter role sets every global scope to `.defer`—except `editor/add`, which stays `.allow` so users can still add their own content. Blocks an Adopter creates start with all block-level scopes enabled, leaving users in full control of content they add themselves.

Scopes describe what users may do: query the effective permission with `isAllowedByScope(_:key:)` and use it to gate the editing controls you expose to users. Engine API calls from your own code aren't blocked by scopes.

## When to Use This Pattern

This two-surface approach works well for:

- **Brand template systems**: Marketing teams customize approved templates
- **Design approval workflows**: Creators build, reviewers can't accidentally modify
- **Self-service customization**: End users personalize within guardrails
- **White-label products**: Customers can only edit designated areas

For simpler use cases where all users have the same permissions, you may not need separate surfaces. For preview or approval surfaces that should allow no editing at all, set the `"Viewer"` role—it sets every global scope to `.deny`.

## Switching Roles at Runtime

The same engine instance can switch roles at any time, for example when a designer previews the Adopter experience. Each `setRole(_:)` call re-applies that role's global scope defaults and overwrites any manual `engine.editor.setGlobalScope(key:value:)` customizations. Block-level scopes are untouched, so the locks configured in the Creator role persist across switches.

```swift highlight-lockTemplate-switchRoles
  try engine.editor.setRole("Creator")

  let creatorCanMoveLogo = try engine.block.isAllowedByScope(logo, key: "layer/move")
  let headlineStillEditable = try engine.block.isScopeEnabled(headline, key: "text/edit")
  print("Creator can move the logo:", creatorCanMoveLogo) // true
  print("Headline text/edit survived the switch:", headlineStillEditable) // true
```

## Troubleshooting

| Issue                                 | Cause                                            | Solution                                                                  |
| ------------------------------------- | ------------------------------------------------ | ------------------------------------------------------------------------- |
| Adopter can edit everything           | The role is still `Creator`                      | Call `setRole(_:)` with `"Adopter"` on the adopter surface                |
| Adopter can't edit anything           | `editor/select` scope not enabled                | Enable `editor/select` on blocks users should interact with               |
| Manual global scope settings disappear | `setRole(_:)` re-applies the role's global defaults | Re-apply `setGlobalScope(key:value:)` customizations after switching roles |
| Changes not persisting                | Template not saved after scope changes           | Save the template after configuring scopes in the Creator role            |

## API Reference

| Method                                       | Description                                                                  |
| -------------------------------------------- | ---------------------------------------------------------------------------- |
| `engine.editor.setRole(_:)`                  | Set the editing role: `"Creator"`, `"Adopter"` or `"Viewer"`                 |
| `engine.editor.getRole()`                    | Get the current editing role                                                  |
| `engine.block.setScopeEnabled(_:key:enabled:)` | Enable or disable a scope on a block                                        |
| `engine.block.isScopeEnabled(_:key:)`        | Check if a scope is enabled on a block                                        |
| `engine.block.isAllowedByScope(_:key:)`      | Check the effective permission after evaluating global and block-level settings |

### Common Scopes

| Scope                 | Description                                            |
| --------------------- | ------------------------------------------------------ |
| `editor/select`       | Allow selecting the block (required for any interaction) |
| `fill/change`         | Allow changing the block's fill (images, colors)       |
| `text/edit`           | Allow editing text content                             |
| `text/character`      | Allow changing text formatting (font, size, color)     |
| `layer/move`          | Allow moving the block                                 |
| `layer/resize`        | Allow resizing the block                               |
| `layer/rotate`        | Allow rotating the block                               |
| `layer/crop`          | Allow cropping the block                               |
| `lifecycle/destroy`   | Allow deleting the block                               |

## Next Steps

- [Lock Content](../rules/lock-content.md) - Configure scope-based permissions to lock design elements
- [Set Editing Constraints](./add-dynamic-content/set-editing-constraints.md) - Fine-tune what users can modify
- [Placeholders](./add-dynamic-content/placeholders.md) - Mark editable image, video, or text areas within a locked template layout



---

## More Resources

- **[macOS Documentation Index](https://img.ly/docs/cesdk/macos/)** - Browse all macOS documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/macos/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/macos/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support