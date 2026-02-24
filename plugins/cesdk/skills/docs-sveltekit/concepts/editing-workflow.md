> This is one page of the CE.SDK SvelteKit documentation. For a complete overview, see the [SvelteKit Documentation Index](https://img.ly/sveltekit.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Concepts](./concepts.md) > [Editing Workflow](./concepts/editing-workflow.md)

---

CE.SDK controls editing access through roles and scopes, enabling template workflows where designers create locked layouts and end-users customize only permitted elements.

![Editing workflow with role-based permissions in CE.SDK](https://img.ly/docs/cesdk/./assets/browser.hero.webp)

> **Reading time:** 5 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/heads/main.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples)
>
> - [Open in StackBlitz](https://stackblitz.com/~/github.com/imgly/cesdk-web-examples)
>
> - [Live demo](https://img.ly/examples/guides-concepts-editing-workflow-browser/)

CE.SDK uses a two-tier permission system: **roles** define user types with preset permissions, while **scopes** control specific capabilities. This enables workflows where templates can be prepared by designers and safely customized by end-users.

```typescript file=@cesdk_web_examples/guides-concepts-editing-workflow-browser/browser.ts reference-only
import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';

import {
  BlurAssetSource,
  ColorPaletteAssetSource,
  CropPresetsAssetSource,
  DemoAssetSources,
  EffectsAssetSource,
  FiltersAssetSource,
  PagePresetsAssetSource,
  StickerAssetSource,
  TextAssetSource,
  TextComponentAssetSource,
  TypefaceAssetSource,
  UploadAssetSources,
  VectorShapeAssetSource
} from '@cesdk/cesdk-js/plugins';
import { DesignEditorConfig } from './design-editor/plugin';
import packageJson from './package.json';

/**
 * Demonstrates CE.SDK's role-based permission system with scopes.
 */
class Example implements EditorPlugin {
  name = packageJson.name;

  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required');
    }
    await cesdk.addPlugin(new DesignEditorConfig());

    // Add asset source plugins
    await cesdk.addPlugin(new BlurAssetSource());
    await cesdk.addPlugin(new ColorPaletteAssetSource());
    await cesdk.addPlugin(new CropPresetsAssetSource());
    await cesdk.addPlugin(new UploadAssetSources({ include: ['ly.img.image.upload'] }));
    await cesdk.addPlugin(
      new DemoAssetSources({
        include: [
          'ly.img.templates.blank.*',
          'ly.img.templates.presentation.*',
          'ly.img.templates.print.*',
          'ly.img.templates.social.*',
          'ly.img.image.*'
        ]
      })
    );
    await cesdk.addPlugin(new EffectsAssetSource());
    await cesdk.addPlugin(new FiltersAssetSource());
    await cesdk.addPlugin(new PagePresetsAssetSource());
    await cesdk.addPlugin(new StickerAssetSource());
    await cesdk.addPlugin(new TextAssetSource());
    await cesdk.addPlugin(new TextComponentAssetSource());
    await cesdk.addPlugin(new TypefaceAssetSource());
    await cesdk.addPlugin(new VectorShapeAssetSource());

    await cesdk.actions.run('scene.create', {
      page: {
        sourceId: 'ly.img.page.presets',
        assetId: 'ly.img.page.presets.print.iso.a6.landscape'
      }
    });

    const engine = cesdk.engine;
    const page = engine.block.findByType('page')[0];

    // Roles define user types: 'Creator', 'Adopter', 'Viewer', 'Presenter'
    const role = engine.editor.getRole();
    console.log('Current role:', role); // 'Creator'

    // Configure scopes when role changes (role change resets to defaults)
    engine.editor.onRoleChanged(() => {
      // Set global scopes to 'Defer' so block-level scopes take effect
      engine.editor.setGlobalScope('editor/select', 'Defer');
      engine.editor.setGlobalScope('layer/move', 'Defer');
      engine.editor.setGlobalScope('text/edit', 'Defer');
      engine.editor.setGlobalScope('lifecycle/destroy', 'Defer');
    });

    // Get page dimensions for centering
    const pageWidth = engine.block.getWidth(page);
    const pageHeight = engine.block.getHeight(page);

    // Create a locked text block (brand element)
    const lockedText = engine.block.create('text');
    engine.block.replaceText(lockedText, 'Locked Text');
    engine.block.setTextFontSize(lockedText, 40);
    engine.block.setEnum(lockedText, 'text/horizontalAlignment', 'Center');
    engine.block.setWidth(lockedText, pageWidth);
    engine.block.setHeightMode(lockedText, 'Auto');
    engine.block.setPositionX(lockedText, 0);
    engine.block.setPositionY(lockedText, pageHeight / 2 - 50);
    engine.block.appendChild(page, lockedText);

    // Lock the block - Adopters cannot select, edit, or move it
    engine.block.setScopeEnabled(lockedText, 'editor/select', false);
    engine.block.setScopeEnabled(lockedText, 'text/edit', false);
    engine.block.setScopeEnabled(lockedText, 'layer/move', false);
    engine.block.setScopeEnabled(lockedText, 'lifecycle/destroy', false);

    // Create an editable text block (user content)
    const editableText = engine.block.create('text');
    engine.block.replaceText(editableText, 'Editable Text');
    engine.block.setTextFontSize(editableText, 40);
    engine.block.setEnum(editableText, 'text/horizontalAlignment', 'Center');
    engine.block.setWidth(editableText, pageWidth);
    engine.block.setHeightMode(editableText, 'Auto');
    engine.block.setPositionX(editableText, 0);
    engine.block.setPositionY(editableText, pageHeight / 2 + 10);
    engine.block.appendChild(page, editableText);

    // Center both texts vertically as a group
    const lockedHeight = engine.block.getFrameHeight(lockedText);
    const editableHeight = engine.block.getFrameHeight(editableText);
    const gap = 20;
    const totalHeight = lockedHeight + gap + editableHeight;
    const topMargin = (pageHeight - totalHeight) / 2;
    engine.block.setPositionY(lockedText, topMargin);
    engine.block.setPositionY(editableText, topMargin + lockedHeight + gap);

    // Editable block - enable selection and editing
    engine.block.setScopeEnabled(editableText, 'editor/select', true);
    engine.block.setScopeEnabled(editableText, 'text/edit', true);
    engine.block.setScopeEnabled(editableText, 'layer/move', true);

    // Check resolved permissions (role + global + block scopes)
    const canEditLocked = engine.block.isAllowedByScope(
      lockedText,
      'text/edit'
    );
    const canEditEditable = engine.block.isAllowedByScope(
      editableText,
      'text/edit'
    );
    // As Creator: both return true (Creators bypass restrictions)
    console.log(
      'Can edit locked:',
      canEditLocked,
      'Can edit editable:',
      canEditEditable
    );

    // Switch to Adopter to apply restrictions
    engine.editor.setRole('Adopter');

    // Select the editable block to show it's interactive
    engine.block.select(editableText);
  }
}

export default Example;
```

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
| **Viewer** | Preview-only users | Read-only access |
| **Presenter** | Slideshow/video presenters | Read-only with playback controls |

Creators set the block-level scopes that constrain what Adopters can do. This separation enables brand consistency while allowing personalization.

```typescript highlight-roles
// Roles define user types: 'Creator', 'Adopter', 'Viewer', 'Presenter'
const role = engine.editor.getRole();
console.log('Current role:', role); // 'Creator'
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

- `'Allow'` — Always permit the operation
- `'Deny'` — Always block the operation
- `'Defer'` — Check block-level scope settings

**Block-level scopes** control permissions on individual blocks. These settings only take effect when the corresponding global scope is set to `'Defer'`.

```typescript highlight-global-scopes
// Configure scopes when role changes (role change resets to defaults)
engine.editor.onRoleChanged(() => {
  // Set global scopes to 'Defer' so block-level scopes take effect
  engine.editor.setGlobalScope('editor/select', 'Defer');
  engine.editor.setGlobalScope('layer/move', 'Defer');
  engine.editor.setGlobalScope('text/edit', 'Defer');
  engine.editor.setGlobalScope('lifecycle/destroy', 'Defer');
});
```

To lock a specific block, disable its scopes:

```typescript highlight-block-scopes
// Lock the block - Adopters cannot select, edit, or move it
engine.block.setScopeEnabled(lockedText, 'editor/select', false);
engine.block.setScopeEnabled(lockedText, 'text/edit', false);
engine.block.setScopeEnabled(lockedText, 'layer/move', false);
engine.block.setScopeEnabled(lockedText, 'lifecycle/destroy', false);
```

## Permission Resolution

Permissions resolve in this order:

1. **Role defaults** — Each role has preset global scope values
2. **Global scope** — If `'Allow'` or `'Deny'`, this is the final answer
3. **Block-level scope** — If global is `'Defer'`, check the block's settings

Use `isAllowedByScope()` to check the final computed permission for any block and scope combination:

```typescript highlight-check-permissions
// Check resolved permissions (role + global + block scopes)
const canEditLocked = engine.block.isAllowedByScope(
  lockedText,
  'text/edit'
);
const canEditEditable = engine.block.isAllowedByScope(
  editableText,
  'text/edit'
);
// As Creator: both return true (Creators bypass restrictions)
console.log(
  'Can edit locked:',
  canEditLocked,
  'Can edit editable:',
  canEditEditable
);
```

## Template Workflow Pattern

A typical template workflow:

1. **Designer (Creator)** creates the template layout
2. **Designer** locks brand elements using block scopes
3. **Designer** keeps personalization fields editable
4. **End-user (Adopter)** opens the template
5. **End-user** edits only permitted elements
6. **End-user** exports the personalized result

This pattern ensures brand consistency while enabling personalization.

## Implementation Guides

For detailed implementation, see these guides:

[Lock Design Elements](./create-templates/lock.md) — Step-by-step instructions for locking specific elements in templates

[Set Editing Constraints](./create-templates/add-dynamic-content/set-editing-constraints.md) — Configure which properties users can modify



---

## More Resources

- **[SvelteKit Documentation Index](https://img.ly/sveltekit.md)** - Browse all SvelteKit documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./sveltekit.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support