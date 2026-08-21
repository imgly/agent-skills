> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Create and Use Templates](../create-templates.md) > [Dynamic Content](./add-dynamic-content.md)

---

Dynamic content turns static template layouts into data-driven designs. Use
text variables, placeholders, form-based editing patterns, and editing
constraints to personalize content while keeping the layout predictable.

This overview maps each dynamic-content capability to the Android implementation
area or app pattern you use. Continue with the dedicated guides below when you
are ready to implement each part in detail.

## Dynamic Content Capabilities

CE.SDK templates can expose controlled customization points in four ways:

- **Text Variables** - Insert `{{tokens}}` into text blocks and set their
  values from Kotlin.
- **Placeholders** - Mark supported blocks as drop zones for swappable content.
- **Form-Based Editing** - Build app UI that maps structured inputs to
  variables and placeholders.
- **Editing Constraints** - Lock specific block properties so users can update
  content without breaking the design.

## Text Variables

Text variables enable data-driven text personalization. Add tokens such as
`{{firstName}}` to text blocks, then set the corresponding values through
`engine.variable.set(key=_, value=_)`.

Keep the required variable keys in template or app metadata, or inspect text
blocks for `{{...}}` references when your app needs to derive them from a scene.
`engine.variable.findAll()` only lists variables that have already been stored
in the Engine. Use it for readback flows together with
`engine.variable.get(key=_)`, and use
`engine.block.referencesAnyVariables(block=_)` when you need to detect whether a
specific text block depends on any variables.

> **Note:** Variable keys are case-sensitive. `{{Name}}` and `{{name}}` reference
> different variables.

## Placeholders

Placeholders turn supported blocks into replacement targets. They are useful for
template areas where adopters should replace an image, video, or other supported
content while the surrounding layout stays fixed.

Placeholder interaction and placeholder behavior target different objects. Use
`engine.block.setPlaceholderEnabled(block=_, enabled=_)` on the placeholder
block itself. For image or video placeholders, check and enable placeholder
behavior on the supporting image or video fill block; for text placeholders, do
that on the text block. Call
`engine.block.supportsPlaceholderBehavior(block=_)` on that fill or text block
before `engine.block.setPlaceholderBehaviorEnabled(block=_, enabled=_)`. Use the
placeholder control APIs on the placeholder block when your editor surface
should show overlay or button affordances.

## Form-Based Editing

Form-based editing is an app-level pattern on Android. Instead of asking users
to select blocks on the canvas, your app can present Compose fields or custom
controls that read template variables and placeholder blocks, then write the
updated values back through the same Engine APIs.

This pattern works well for guided template adoption, batch workflows, and
non-designer editing surfaces. Keep the form model data-driven: variable names,
placeholder blocks, labels, validation rules, and submitted values should come
from your template metadata or app data model.

## Editing Constraints

Editing constraints protect template structure by limiting which operations are
allowed on each block. CE.SDK evaluates effective permissions from the active
role, global scopes, and block-level scopes. In the default Creator role, global
scopes usually allow edits, so a block-level
`engine.block.setScopeEnabled(block=_, key=_, enabled=_)` call alone does not
necessarily enforce a lock.

To make block-level scopes matter, switch to role defaults such as
`engine.editor.setRole("Adopter")`, or set the relevant global scope explicitly
with `engine.editor.setGlobalScope(key=_, globalScope=GlobalScope.DEFER)`.
Then use `engine.block.setScopeEnabled(block=_, key=_, enabled=_)` for
per-block permissions such as `layer/move`, `layer/resize`, `fill/change`, or
`text/edit`. Use `GlobalScope.DENY` only when an operation should be blocked for
every block regardless of block-level flags. Use
`engine.block.isAllowedByScope(block=_, key=_)` when you need to check the final
effective permission.

Combine constraints with variables and placeholders to allow targeted
customization. For example, a template can let users replace a hero image and
update text variables while the logo, layout, and protected brand elements stay
locked.

## Combining Capabilities

Production templates often combine these capabilities:

1. **Text Variables + Placeholders** - Personalize both text and media in one
   template.
2. **Placeholders + Constraints** - Allow replacement while protecting size and
   position.
3. **Variables + Form-Based Editing** - Expose template text as structured input
   fields.
4. **All Together** - Build guided editing flows where users enter data, replace
   assets, and export a design without direct layout editing.

## Choosing the Right Capability

| Need | Capability | Android focus |
| --- | --- | --- |
| Dynamic text content | Text Variables | `engine.variable.set(key=_, value=_)`, `engine.variable.get(key=_)` |
| Swappable images, videos, or supported blocks | Placeholders | Placeholder behavior and control APIs |
| Simplified editing UI | Form-Based Editing | Custom app UI backed by variables and placeholders |
| Locked template structure | Editing Constraints | Roles, global scopes, and block-level scopes |

## Next Steps

- [Text Variables](./add-dynamic-content/text-variables.md) - Define dynamic text elements that can be populated with custom values during design generation.
- [Placeholders](./add-dynamic-content/placeholders.md) - Use placeholders to mark editable image, video, or text areas within a locked template layout.
- [Form-Based Editing](./add-dynamic-content/form-based-editing.md) - Build custom form interfaces for template customization using CE.SDK variables and placeholders.
- [Set Editing Constraints](./add-dynamic-content/set-editing-constraints.md) - Learn how to control editing capabilities in CE.SDK templates using the Scope system to lock positions, prevent transformations, and create guided editing experiences.
- [Automate Design Generation](../automation/design-generation.md) - Generate on-brand designs programmatically using templates, variables, and CE.SDK’s headless API.



---

## Related Pages

- [Text Variables](./add-dynamic-content/text-variables.md) - Define dynamic text elements that can be populated with custom values during design generation.
- [Placeholders](./add-dynamic-content/placeholders.md) - Use placeholders to mark editable image, video, or text areas within a locked template layout.
- [Set Editing Constraints](./add-dynamic-content/set-editing-constraints.md) - Control what users can edit in templates with CE.SDK scopes on Android.
- [Form-Based Editing](./add-dynamic-content/form-based-editing.md) - Build custom native form workflows that populate template variables and placeholders on Android.


---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support