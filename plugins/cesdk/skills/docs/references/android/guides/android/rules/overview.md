> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Rules](../rules.md) > [Overview](./overview.md)

---

Learn how CE.SDK's rules system enforces design constraints and controls
editing permissions through the scopes mechanism.

<EngineReferenceNote {...props} />

In CE.SDK, rules are design constraints and guardrails that control which editing operations are permitted. The primary mechanism for enforcing rules is the **scopes system**: permission flags that let you build guided editing experiences, maintain brand consistency, ensure design quality, and prevent unauthorized modifications.

This guide covers the scopes system conceptually: the available scope categories, the difference between global and block-level scopes, and how to resolve the effective permission for a block. Concrete locking, brand, and moderation workflows belong in focused rules guides.

## What Are Scopes

Scopes are permission flags that control specific editing capabilities. Each scope maps to an operation category and uses a string key such as `layer/move` or `fill/change`.

CE.SDK groups scopes into four logical categories:

**Layer operations** - Control positioning and transformation:

- `layer/move`, `layer/resize`, `layer/rotate`, `layer/flip`, `layer/crop`
- `layer/opacity`, `layer/blendMode`, `layer/visibility`, `layer/clipping`

**Appearance** - Control visual effects and adjustments:

- `appearance/adjustments`, `appearance/filter`, `appearance/effect`
- `appearance/blur`, `appearance/shadow`, `appearance/animation`

**Content editing** - Control content modifications:

- `text/edit`, `text/character`
- `fill/change`, `fill/changeType`, `stroke/change`, `shape/change`

**Lifecycle** - Control block management:

- `lifecycle/destroy`, `lifecycle/duplicate`
- `editor/add`, `editor/select`

When a scope is denied, the CE.SDK editor UI checks the same effective permission and disables matching controls where that operation is exposed. You can query the available scope keys with `engine.editor.findAllScopes()`.

## Setting Global Scopes

Global scopes set editor-wide defaults that apply to every block. Each global scope has one of three permission levels:

- `GlobalScope.ALLOW` - The operation is always permitted for every block.
- `GlobalScope.DENY` - The operation is always blocked for every block.
- `GlobalScope.DEFER` - Control is deferred to each block's individual scope setting.

Use `engine.editor.setGlobalScope(key=_, globalScope=_)` when an operation should be allowed, blocked, or delegated consistently across the whole editing experience. Read the current default with `engine.editor.getGlobalScope(key=_)`.

For example, a brand-controlled workflow can deny destructive operations globally, while a template workflow can defer selected operations so individual blocks decide what users may edit.

## Setting Block-Level Scopes

Block-level scopes apply to individual blocks when the matching global scope is deferred. They let a scene mix locked and editable elements: a logo can stay fixed while a text placeholder remains editable, or a background can keep its size while another graphic can still be moved.

Set a block-level permission with `engine.block.setScopeEnabled(block=_, key=_, enabled=_)`. Read the stored block-level value with `engine.block.isScopeEnabled(block=_, key=_)`.

## Checking Scope Permissions

The effective permission comes from the combination of global and block-level settings. A global `GlobalScope.DENY` blocks the operation everywhere, a global `GlobalScope.ALLOW` permits it everywhere, and `GlobalScope.DEFER` lets the block-level setting decide.

Before performing a protected operation programmatically, check the effective permission with `engine.block.isAllowedByScope(block=_, key=_)`. This resolves the global and block-level settings into the permission that CE.SDK enforces for that block.

## UI Integration

The CE.SDK editor UI uses effective scope permissions when it presents editing controls. Denied operations can remove transform handles, hide or disable inspector controls, and prevent matching menu actions. This keeps the visible editing surface aligned with the same rules that protect programmatic operations.

## Common Use Cases

Rules support several editing and compliance scenarios:

- **Lock content** - Prevent changes to specific elements such as logos or legal text.
- **Enforce brand guidelines** - Restrict fonts, colors, and styles to approved options.
- **Moderate content** - Integrate external services to validate content appropriateness.

## API Reference

| Method | Category | Purpose |
| --- | --- | --- |
| `engine.editor.findAllScopes()` | Global | List the available scope keys |
| `engine.editor.setGlobalScope(key=_, globalScope=_)` | Global | Set an editor-wide scope permission to `GlobalScope.ALLOW`, `GlobalScope.DENY`, or `GlobalScope.DEFER` |
| `engine.editor.getGlobalScope(key=_)` | Global | Get the current global scope value |
| `engine.block.setScopeEnabled(block=_, key=_, enabled=_)` | Block | Enable or disable a scope for a specific block |
| `engine.block.isScopeEnabled(block=_, key=_)` | Block | Check whether a scope is enabled on a block |
| `engine.block.isAllowedByScope(block=_, key=_)` | Effective | Check whether the operation is allowed after global and block-level scope resolution |

## Next Steps

- [Lock Content](./lock-content.md) - Lock specific elements and selectively enable editing capabilities.
- [Enforce Brand Guidelines](./enforce-brand-guidelines.md) - Restrict approved assets and protect brand elements.
- [Moderate Content](./moderate-content.md) - Learn how to implement automated content moderation to flag potentially inappropriate images in your CE.SDK designs.



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support