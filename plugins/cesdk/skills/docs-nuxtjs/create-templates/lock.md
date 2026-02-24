> This is one page of the CE.SDK Nuxt.js documentation. For a complete overview, see the [Nuxt.js Documentation Index](https://img.ly/nuxtjs.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Create and Use Templates](./create-templates.md) > [Lock the Template](./create-templates/lock.md)

---

Set up a two-surface integration where template creators have full editing access while template adopters can only modify designated areas.

![Lock the Template](https://img.ly/docs/cesdk/./assets/browser.hero.webp)

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/heads/main.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/main/guides-create-templates-lock-browser)
>
> - [Open in StackBlitz](https://stackblitz.com/~/github.com/imgly/cesdk-web-examples/tree/main/guides-create-templates-lock-browser)
>
> - [Live demo](https://img.ly/examples/guides-create-templates-lock-browser/)

Many integrations need two different editing experiences: one for designers who build templates, and one for end users who customize them. The Creator and Adopter roles make this possible—same CE.SDK, different permissions based on who's using it. For detailed scope configuration patterns, see [Lock Content](./rules/lock-content.md).

In the live example, the headline text is pre-selected and the Placeholder panel is open, showing the scope settings that control what Adopters can edit. Toggle the role to Adopter and try selecting the logo to see the restrictions in action.

```typescript file=@cesdk_web_examples/guides-create-templates-lock-browser/browser.ts reference-only
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
 * CE.SDK Plugin: Lock the Template
 *
 * This example demonstrates the two-surface pattern for template workflows:
 * - Creator role: Full editing access for designers building templates
 * - Adopter role: Restricted access for users customizing templates
 */
class Example implements EditorPlugin {
  name = packageJson.name;

  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
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
      page: { width: 800, height: 500, unit: 'Pixel' }
    });

    const engine = cesdk.engine;

    // Get the page and set dimensions
    const page = engine.block.findByType('page')[0];

    // Create a brand template with a logo and headline
    const logoBlock = await engine.block.addImage(
      'https://img.ly/static/ubq_samples/imgly_logo.jpg',
      { size: { width: 120, height: 30 } }
    );
    engine.block.appendChild(page, logoBlock);
    engine.block.setPositionX(logoBlock, 40);
    engine.block.setPositionY(logoBlock, 40);
    engine.block.setName(logoBlock, 'Logo');

    const headlineBlock = engine.block.create('text');
    engine.block.replaceText(headlineBlock, 'Edit this headline');
    engine.block.setWidth(headlineBlock, 720);
    engine.block.setHeightMode(headlineBlock, 'Auto');
    engine.block.setFloat(headlineBlock, 'text/fontSize', 48);
    engine.block.setEnum(headlineBlock, 'text/horizontalAlignment', 'Center');
    engine.block.appendChild(page, headlineBlock);
    engine.block.setPositionX(headlineBlock, 40);
    engine.block.setPositionY(headlineBlock, 200);
    engine.block.setName(headlineBlock, 'Headline');

    // Configure which elements Adopters can edit
    // Enable selection and text editing on the headline
    engine.block.setScopeEnabled(headlineBlock, 'editor/select', true);
    engine.block.setScopeEnabled(headlineBlock, 'text/edit', true);

    // Leave all scopes disabled on the logo (default state)
    // This prevents Adopters from selecting or modifying the logo

    // The Creator role ignores all scope restrictions
    engine.editor.setRole('Creator');

    // Add a role toggle to the navigation bar (engine calls are reactive)
    cesdk.ui.registerComponent(
      'ly.img.roleToggle.navigationBar',
      ({ builder }) => {
        const role = engine.editor.getRole();
        builder.ButtonGroup('role-toggle', {
          children: () => {
            builder.Button('creator', {
              label: 'Creator',
              isActive: role === 'Creator',
              onClick: () => engine.editor.setRole('Creator')
            });
            builder.Button('adopter', {
              label: 'Adopter',
              isActive: role === 'Adopter',
              onClick: () => {
                // Close the placeholder panel since Adopters can't configure scopes
                cesdk.ui.closePanel(
                  '//ly.img.panel/inspector/placeholderSettings'
                );
                engine.editor.setRole('Adopter');
              }
            });
          }
        });
      }
    );

    cesdk.ui.setComponentOrder({ in: 'ly.img.navigation.bar' }, [
      'ly.img.undoRedo.navigationBar',
      'ly.img.spacer',
      'ly.img.roleToggle.navigationBar',
      'ly.img.spacer'
    ]);

    await engine.scene.zoomToBlock(page, { padding: 40 });

    // Select the headline and open the placeholder panel so users see the scope settings
    engine.block.select(headlineBlock);
    setTimeout(() => {
      cesdk.ui.openPanel('//ly.img.panel/inspector/placeholderSettings');
    }, 300);
  }
}

export default Example;
```

This guide covers how to understand the two-surface pattern, configure roles for different user groups, and set up scope restrictions that control what Adopters can edit.

## Understanding the Two-Surface Pattern

Template-based workflows typically involve two distinct user groups with different needs:

| Surface | Users | Role | What they can do |
|---------|-------|------|------------------|
| Creator Surface | Designers, admins | `Creator` | Full editing—build templates, set locks |
| Adopter Surface | End users, marketers | `Adopter` | Restricted editing—only modify unlocked areas |

This separation protects design intent while enabling customization. The Creator role ignores all locks, giving full access. The Adopter role respects locks, restricting users to what's explicitly allowed.

## Setting Up the Creator Surface

The Creator surface is where templates are built. We use `engine.editor.setRole('Creator')` to give designers unrestricted access.

```typescript highlight=highlight-creator-surface
// The Creator role ignores all scope restrictions
engine.editor.setRole('Creator');
```

In Creator mode, all operations are permitted regardless of scope settings. This is where designers build the template layout, configure which elements should be editable, set scope restrictions using `engine.block.setScopeEnabled()`, and save the template for distribution.

## Setting Up the Adopter Surface

The Adopter surface is where templates are used. Call `engine.editor.setRole('Adopter')` to enforce the restrictions configured by creators. In Adopter mode, users can only interact with blocks that have the appropriate scopes enabled. The Adopter role respects all lock configurations, ensuring brand consistency and design intent are maintained.

## When to Use This Pattern

This two-surface approach works well for:

- **Brand template systems**: Marketing teams customize approved templates
- **Design approval workflows**: Creators build, reviewers can't accidentally modify
- **Self-service customization**: End users personalize within guardrails
- **White-label products**: Customers can only edit designated areas

For simpler use cases where all users have the same permissions, you may not need separate surfaces.

## Configuring What Users Can Edit

The scope system controls what Adopters can modify. In Creator mode, we enable specific scopes on blocks that should be editable.

```typescript highlight=highlight-configure-scopes
    // Configure which elements Adopters can edit
    // Enable selection and text editing on the headline
    engine.block.setScopeEnabled(headlineBlock, 'editor/select', true);
    engine.block.setScopeEnabled(headlineBlock, 'text/edit', true);

    // Leave all scopes disabled on the logo (default state)
    // This prevents Adopters from selecting or modifying the logo
```

When Adopters load this template, they can edit the headline text but nothing else. The `editor/select` scope must be enabled for users to interact with a block at all. For comprehensive scope configuration patterns, see [Lock Content](./rules/lock-content.md).

## Configuring Scopes in the Editor UI

Designers can also configure scopes visually without writing code. In Creator mode, select any block and open the Placeholder panel in the inspector. This panel provides toggles for each scope:

- **Allow selecting** (`editor/select`): Users can click to select the block
- **Allow editing text** (`text/edit`): Users can modify text content
- **Allow changing fill** (`fill/change`): Users can swap images or change colors
- **Allow moving** (`layer/move`): Users can reposition the block
- **Allow deleting** (`lifecycle/destroy`): Users can remove the block

Changes made in the Placeholder panel are equivalent to calling `engine.block.setScopeEnabled()` programmatically. When the template is saved, these settings persist and apply when Adopters load the template.

## Adding a Role Toggle

Add a segmented control to the navigation bar that switches between Creator and Adopter modes. Engine calls inside the builder are automatically reactive—the component re-renders when the role changes.

```typescript highlight=highlight-toggle-role
    // Add a role toggle to the navigation bar (engine calls are reactive)
    cesdk.ui.registerComponent(
      'ly.img.roleToggle.navigationBar',
      ({ builder }) => {
        const role = engine.editor.getRole();
        builder.ButtonGroup('role-toggle', {
          children: () => {
            builder.Button('creator', {
              label: 'Creator',
              isActive: role === 'Creator',
              onClick: () => engine.editor.setRole('Creator')
            });
            builder.Button('adopter', {
              label: 'Adopter',
              isActive: role === 'Adopter',
              onClick: () => {
                // Close the placeholder panel since Adopters can't configure scopes
                cesdk.ui.closePanel(
                  '//ly.img.panel/inspector/placeholderSettings'
                );
                engine.editor.setRole('Adopter');
              }
            });
          }
        });
      }
    );

    cesdk.ui.setComponentOrder({ in: 'ly.img.navigation.bar' }, [
      'ly.img.undoRedo.navigationBar',
      'ly.img.spacer',
      'ly.img.roleToggle.navigationBar',
      'ly.img.spacer'
    ]);
```

## Troubleshooting

| Issue | Cause | Solution |
|-------|-------|----------|
| Adopter can edit everything | Wrong role or scopes not configured | Verify role is `Adopter` and scopes are set in Creator mode |
| Adopter can't edit anything | `editor/select` scope not enabled | Enable `editor/select` on blocks users should interact with |
| Creator can't set locks | Wrong role | Switch to Creator role before configuring scopes |
| Changes not persisting | Template not saved after scope changes | Save template after configuring scopes in Creator mode |

## API Reference

| Method | Description |
|--------|-------------|
| `engine.editor.setRole(role)` | Set the editing role (`'Creator'`, `'Adopter'`, or `'Viewer'`) |
| `engine.editor.getRole()` | Get the current editing role |
| `engine.block.setScopeEnabled(block, scope, enabled)` | Enable or disable a scope on a block |
| `engine.block.isScopeEnabled(block, scope)` | Check if a scope is enabled on a block |
| `cesdk.ui.registerComponent(id, renderFn)` | Register a custom UI component |
| `builder.ButtonGroup(id, { children })` | Create a segmented control |
| `builder.Button(id, { label, isActive, onClick })` | Create a button |

### Common Scopes

| Scope | Description |
|-------|-------------|
| `'editor/select'` | Allow selecting the block (required for any interaction) |
| `'fill/change'` | Allow changing the block's fill (images, colors) |
| `'text/edit'` | Allow editing text content |
| `'text/character'` | Allow changing text formatting (font, size, color) |
| `'layer/move'` | Allow moving the block |
| `'layer/resize'` | Allow resizing the block |
| `'layer/rotate'` | Allow rotating the block |
| `'layer/crop'` | Allow cropping the block |
| `'lifecycle/destroy'` | Allow deleting the block |



---

## More Resources

- **[Nuxt.js Documentation Index](https://img.ly/nuxtjs.md)** - Browse all Nuxt.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./nuxtjs.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support