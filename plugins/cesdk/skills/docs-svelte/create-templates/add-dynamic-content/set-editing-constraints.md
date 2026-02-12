> This is one page of the CE.SDK Svelte documentation. For a complete overview, see the [Svelte Documentation Index](https://img.ly/svelte.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Create and Use Templates](./create-templates.md) > [Insert Dynamic Content](./create-templates/add-dynamic-content.md) > [Set Editing Constraints](./create-templates/add-dynamic-content/set-editing-constraints.md)

---

Control what users can edit in templates by setting fine-grained permissions on individual blocks or globally across your scene using CE.SDK's Scope system.

![Set Editing Constraints example showing constraint patterns](https://img.ly/docs/cesdk/./assets/browser.hero.webp)

> **Reading time:** 15 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/heads/main.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/main/guides-create-templates-dynamic-content-set-editing-constraints-browser)
>
> - [Open in StackBlitz](https://stackblitz.com/~/github.com/imgly/cesdk-web-examples/tree/main/guides-create-templates-dynamic-content-set-editing-constraints-browser)
>
> - [Live demo](https://img.ly/examples/guides-create-templates-dynamic-content-set-editing-constraints-browser/)

Editing constraints in CE.SDK allow you to lock specific properties of design elements while keeping others editable. The Scope system provides granular control over 20+ editing capabilities including movement, resizing, rotation, fill changes, text editing, and lifecycle operations.

```typescript file=@cesdk_web_examples/guides-create-templates-dynamic-content-set-editing-constraints-browser/browser.ts reference-only
import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';
import packageJson from './package.json';

/**
 * CE.SDK Plugin: Set Editing Constraints Guide
 *
 * This example demonstrates:
 * - Setting global scopes to respect block-level settings
 * - Disabling move scope to lock position
 * - Disabling lifecycle scopes to prevent deletion
 */
class Example implements EditorPlugin {
  name = packageJson.name;

  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    // Create a design scene
    await cesdk.createDesignScene();

    const engine = cesdk.engine;

    // Get the page
    const pages = engine.block.findByType('page');
    const page = pages[0];
    if (!page) {
      throw new Error('No page found');
    }

    // Set page dimensions for 4 examples
    engine.block.setWidth(page, 1200);
    engine.block.setHeight(page, 600);

    // Set page background color
    const pageFill = engine.block.getFill(page);
    engine.block.setColor(pageFill, 'fill/color/value', {
      r: 0.95,
      g: 0.95,
      b: 0.95,
      a: 1.0
    });

    // ===== Configure Global Scopes =====
    // Set global scopes to 'Defer' to respect block-level scope settings
    // Without this, global 'Allow' settings might override block-level restrictions
    engine.editor.setGlobalScope('layer/move', 'Defer');
    engine.editor.setGlobalScope('layer/resize', 'Defer');
    engine.editor.setGlobalScope('lifecycle/destroy', 'Defer');
    engine.editor.setGlobalScope('lifecycle/duplicate', 'Defer');

    // Global scope modes:
    // - 'Allow': Always allow (overrides block-level settings)
    // - 'Deny': Always deny (overrides block-level settings)
    // - 'Defer': Use block-level settings (respects setScopeEnabled)

    // Calculate layout for 4 examples (2x2 grid)
    const pageWidth = engine.block.getWidth(page);
    const pageHeight = engine.block.getHeight(page);
    const margin = 40;
    const spacing = 20;
    const blockWidth = (pageWidth - margin * 2 - spacing) / 2;
    const blockHeight = (pageHeight - margin * 2 - spacing) / 2;

    const getPosition = (index: number) => {
      const col = index % 2;
      const row = Math.floor(index / 2);
      return {
        x: margin + col * (blockWidth + spacing),
        y: margin + row * (blockHeight + spacing)
      };
    };

    // Helper function to create a labeled example block
    const createExampleBlock = (
      labelText: string,
      backgroundColor: { r: number; g: number; b: number },
      applyScopesCallback?: (blockId: number) => void
    ): number => {
      // Create container block
      const block = engine.block.create('graphic');
      const shape = engine.block.createShape('rect');
      engine.block.setShape(block, shape);
      engine.block.setWidth(block, blockWidth);
      engine.block.setHeight(block, blockHeight);

      // Set background color
      const fill = engine.block.createFill('color');
      engine.block.setFill(block, fill);
      engine.block.setColor(fill, 'fill/color/value', {
        ...backgroundColor,
        a: 1.0
      });

      // Add label text
      const textBlock = engine.block.create('text');
      engine.block.setWidth(textBlock, blockWidth * 0.85);
      engine.block.setHeightMode(textBlock, 'Auto');
      engine.block.setString(textBlock, 'text/text', labelText);
      engine.block.setEnum(textBlock, 'text/horizontalAlignment', 'Center');
      engine.block.setFloat(textBlock, 'text/fontSize', 36);

      // Append text to get dimensions
      engine.block.appendChild(block, textBlock);

      // Center text in container
      const textWidth = engine.block.getWidth(textBlock);
      const textHeight = engine.block.getHeight(textBlock);
      engine.block.setPositionX(textBlock, (blockWidth - textWidth) / 2);
      engine.block.setPositionY(textBlock, (blockHeight - textHeight) / 2);

      // Set text color to white
      const textFill = engine.block.createFill('color');
      engine.block.setFill(textBlock, textFill);
      engine.block.setColor(textFill, 'fill/color/value', {
        r: 1.0,
        g: 1.0,
        b: 1.0,
        a: 1.0
      });

      // Apply scope configuration to both blocks
      if (applyScopesCallback) {
        applyScopesCallback(block);
        applyScopesCallback(textBlock);
      }

      // Append container to page
      engine.block.appendChild(page, block);

      return block;
    };

    // ===== Example 1: Lock Position (Disable Move Scope) =====
    const disableMoveScope = (block: number) => {
      // Disable move scope
      engine.block.setScopeEnabled(block, 'layer/move', false);

      // Explicitly enable other transform scopes
      engine.block.setScopeEnabled(block, 'layer/resize', true);
      engine.block.setScopeEnabled(block, 'layer/rotate', true);
      engine.block.setScopeEnabled(block, 'layer/flip', true);

      // Explicitly enable lifecycle scopes
      engine.block.setScopeEnabled(block, 'lifecycle/destroy', true);
      engine.block.setScopeEnabled(block, 'lifecycle/duplicate', true);
    };

    const moveLockedBlock = createExampleBlock(
      'Locked\nposition',
      {
        r: 0.5,
        g: 0.75,
        b: 0.9
      },
      disableMoveScope
    );
    // Block position is locked - users cannot move or reposition it
    // Other scopes are explicitly enabled: resizing, rotation, flipping, deletion, duplication

    // ===== Example 2: Prevent Deletion (Disable Lifecycle Scopes) =====
    const disableLifecycleScopes = (block: number) => {
      // Disable lifecycle scopes
      engine.block.setScopeEnabled(block, 'lifecycle/destroy', false);
      engine.block.setScopeEnabled(block, 'lifecycle/duplicate', false);

      // Explicitly enable transform scopes
      engine.block.setScopeEnabled(block, 'layer/move', true);
      engine.block.setScopeEnabled(block, 'layer/resize', true);
      engine.block.setScopeEnabled(block, 'layer/rotate', true);
      engine.block.setScopeEnabled(block, 'layer/flip', true);
    };

    const lifecycleLockedBlock = createExampleBlock(
      'Cannot\ndelete',
      {
        r: 0.75,
        g: 0.75,
        b: 0.75
      },
      disableLifecycleScopes
    );
    // Block cannot be deleted or duplicated
    // Other scopes are explicitly enabled: moving, resizing, rotation, flipping

    // ===== Example 3: All Scopes Enabled =====
    const enableAllScopes = (block: number) => {
      // Explicitly enable all transform scopes
      engine.block.setScopeEnabled(block, 'layer/move', true);
      engine.block.setScopeEnabled(block, 'layer/resize', true);
      engine.block.setScopeEnabled(block, 'layer/rotate', true);
      engine.block.setScopeEnabled(block, 'layer/flip', true);

      // Explicitly enable lifecycle scopes
      engine.block.setScopeEnabled(block, 'lifecycle/destroy', true);
      engine.block.setScopeEnabled(block, 'lifecycle/duplicate', true);

      // Explicitly enable fill scopes
      engine.block.setScopeEnabled(block, 'fill/change', true);
      engine.block.setScopeEnabled(block, 'fill/changeType', true);

      // Explicitly enable text scopes
      engine.block.setScopeEnabled(block, 'text/edit', true);
      engine.block.setScopeEnabled(block, 'text/character', true);
    };

    const fullyEditableBlock = createExampleBlock(
      'Fully\neditable',
      {
        r: 0.5,
        g: 0.85,
        b: 0.5
      },
      enableAllScopes
    );
    // All scopes are explicitly enabled - users have full editing capabilities
    // This is the default behavior, but explicitly enabling shows clear intent

    // ===== Example 4: All Scopes Disabled =====
    const disableAllScopes = (block: number) => {
      // Disable all transform scopes
      engine.block.setScopeEnabled(block, 'layer/move', false);
      engine.block.setScopeEnabled(block, 'layer/resize', false);
      engine.block.setScopeEnabled(block, 'layer/rotate', false);
      engine.block.setScopeEnabled(block, 'layer/flip', false);
      engine.block.setScopeEnabled(block, 'layer/crop', false);

      // Disable lifecycle scopes
      engine.block.setScopeEnabled(block, 'lifecycle/destroy', false);
      engine.block.setScopeEnabled(block, 'lifecycle/duplicate', false);

      // Disable fill scopes
      engine.block.setScopeEnabled(block, 'fill/change', false);
      engine.block.setScopeEnabled(block, 'fill/changeType', false);
      engine.block.setScopeEnabled(block, 'stroke/change', false);

      // Disable text scopes
      engine.block.setScopeEnabled(block, 'text/edit', false);
      engine.block.setScopeEnabled(block, 'text/character', false);

      // Disable shape scopes
      engine.block.setScopeEnabled(block, 'shape/change', false);

      // Disable editor scopes
      engine.block.setScopeEnabled(block, 'editor/select', false);

      // Disable appearance scopes
      engine.block.setScopeEnabled(block, 'layer/opacity', false);
      engine.block.setScopeEnabled(block, 'layer/blendMode', false);
      engine.block.setScopeEnabled(block, 'layer/visibility', false);
    };

    const fullyLockedBlock = createExampleBlock(
      'Fully\nlocked',
      {
        r: 0.9,
        g: 0.5,
        b: 0.5
      },
      disableAllScopes
    );
    // All scopes are disabled - block is completely locked and cannot be edited
    // Useful for watermarks, logos, or legal disclaimers

    // ===== Block-Level Scope Setting Example =====
    // Check if a scope is enabled for a specific block
    const canMove = engine.block.isScopeEnabled(moveLockedBlock, 'layer/move');
    const canDelete = engine.block.isScopeEnabled(
      lifecycleLockedBlock,
      'lifecycle/destroy'
    );
    const canEditFully = engine.block.isScopeEnabled(
      fullyEditableBlock,
      'layer/move'
    );
    const canEditLocked = engine.block.isScopeEnabled(
      fullyLockedBlock,
      'layer/move'
    );

    // eslint-disable-next-line no-console
    console.log('Move-locked block - layer/move enabled:', canMove); // false
    // eslint-disable-next-line no-console
    console.log(
      'Lifecycle-locked block - lifecycle/destroy enabled:',
      canDelete
    ); // false
    // eslint-disable-next-line no-console
    console.log('Fully editable block - layer/move enabled:', canEditFully); // true
    // eslint-disable-next-line no-console
    console.log('Fully locked block - layer/move enabled:', canEditLocked); // false

    // Position blocks in 2x2 grid
    const blocks = [
      fullyEditableBlock,
      moveLockedBlock,
      lifecycleLockedBlock,
      fullyLockedBlock
    ];

    blocks.forEach((block, index) => {
      const pos = getPosition(index);
      engine.block.setPositionX(block, pos.x);
      engine.block.setPositionY(block, pos.y);
    });

    // Deselect all blocks
    engine.block.findAllSelected().forEach((block) => {
      engine.block.setSelected(block, false);
    });

    // Zoom to fit content
    await engine.scene.zoomToBlock(page, {
      padding: 50,
      animate: false
    });

    // Log instructions
    // eslint-disable-next-line no-console
    console.log(`
=== Editing Constraints Demo ===

Try interacting with the 4 examples (arranged in 2x2 grid):

Top row:
1. "Fully editable" (green): All scopes enabled - complete editing freedom
2. "Locked position" (light blue): Cannot move, but can resize/edit/delete

Bottom row:
3. "Cannot delete" (light grey): Cannot delete/duplicate, but can move/resize/edit
4. "Fully locked" (red): All scopes disabled - completely locked

Note: Global scopes are set to 'Defer' to respect block-level settings.
    `);
  }
}

export default Example;
```

This guide demonstrates how to apply editing constraints to create brand templates, guided editing experiences, and form-based workflows.

## Understanding Scopes

### What are Scopes?

A scope is a permission key that controls a specific editing capability in CE.SDK. Each scope represents a distinct action users can perform, such as moving blocks (`'layer/move'`), changing fills (`'fill/change'`), or editing text content (`'text/edit'`). By enabling or disabling scopes, you control exactly what users can and cannot do with each design element.

Scopes exist at two levels:

- **Block-level scopes**: Per-block permissions set using `setScopeEnabled()`
- **Global scopes**: Default behavior for all blocks set using `setGlobalScope()`

### Available Scope Categories

CE.SDK provides scopes organized into logical categories:

| Category | Purpose | Example Scopes |
| --- | --- | --- |
| **Text Editing** | Control text content and formatting | `text/edit`, `text/character` |
| **Fill & Stroke** | Manage colors and gradients | `fill/change`, `fill/changeType`, `stroke/change` |
| **Shape** | Modify shape properties | `shape/change` |
| **Layer Transform** | Control position and dimensions | `layer/move`, `layer/resize`, `layer/rotate`, `layer/flip`, `layer/crop` |
| **Layer Appearance** | Manage visual properties | `layer/opacity`, `layer/blendMode`, `layer/visibility` |
| **Effects & Filters** | Apply visual effects | `appearance/adjustments`, `appearance/filter`, `appearance/effect`, `appearance/blur`, `appearance/shadow` |
| **Lifecycle** | Control creation and deletion | `lifecycle/destroy`, `lifecycle/duplicate` |
| **Editor** | Manage scene-level actions | `editor/add`, `editor/select` |

## Scope Configuration

### Global Scope Modes

Global scopes set the default behavior for all blocks in the scene. They have three modes:

- **Allow**: Always allow the action, overriding block-level settings
- **Deny**: Always deny the action, overriding block-level settings
- **Defer**: Use block-level settings (default mode)

To ensure block-level scope settings are respected, set relevant global scopes to 'Defer':

```typescript highlight=highlight-global-scopes
    // Set global scopes to 'Defer' to respect block-level scope settings
    // Without this, global 'Allow' settings might override block-level restrictions
    engine.editor.setGlobalScope('layer/move', 'Defer');
    engine.editor.setGlobalScope('layer/resize', 'Defer');
    engine.editor.setGlobalScope('lifecycle/destroy', 'Defer');
    engine.editor.setGlobalScope('lifecycle/duplicate', 'Defer');

    // Global scope modes:
    // - 'Allow': Always allow (overrides block-level settings)
    // - 'Deny': Always deny (overrides block-level settings)
    // - 'Defer': Use block-level settings (respects setScopeEnabled)
```

Without setting global scopes to 'Defer', default 'Allow' settings might override your block-level restrictions. This is essential when applying fine-grained constraints.

### Scope Resolution Priority

When both global and block-level scopes are set, they resolve in this order:

1. **Global Deny** takes highest priority (action always denied)
2. **Global Allow** takes second priority (action always allowed)
3. **Global Defer** defers to block-level settings (default behavior)

## Setting Block-Level Constraints

### Locking Position

Prevent users from moving or repositioning a block while allowing other edits:

```typescript highlight=highlight-disable-move-scope
    const disableMoveScope = (block: number) => {
      // Disable move scope
      engine.block.setScopeEnabled(block, 'layer/move', false);

      // Explicitly enable other transform scopes
      engine.block.setScopeEnabled(block, 'layer/resize', true);
      engine.block.setScopeEnabled(block, 'layer/rotate', true);
      engine.block.setScopeEnabled(block, 'layer/flip', true);

      // Explicitly enable lifecycle scopes
      engine.block.setScopeEnabled(block, 'lifecycle/destroy', true);
      engine.block.setScopeEnabled(block, 'lifecycle/duplicate', true);
    };

    const moveLockedBlock = createExampleBlock(
      'Locked\nposition',
      {
        r: 0.5,
        g: 0.75,
        b: 0.9
      },
      disableMoveScope
    );
    // Block position is locked - users cannot move or reposition it
    // Other scopes are explicitly enabled: resizing, rotation, flipping, deletion, duplication
```

The block position is locked—users cannot move or reposition it. Other scopes remain enabled, allowing resizing, editing, and deletion. This pattern maintains layout integrity while allowing content updates.

### Preventing Deletion

Protect blocks from being deleted or duplicated:

```typescript highlight=highlight-disable-lifecycle-scopes
    const disableLifecycleScopes = (block: number) => {
      // Disable lifecycle scopes
      engine.block.setScopeEnabled(block, 'lifecycle/destroy', false);
      engine.block.setScopeEnabled(block, 'lifecycle/duplicate', false);

      // Explicitly enable transform scopes
      engine.block.setScopeEnabled(block, 'layer/move', true);
      engine.block.setScopeEnabled(block, 'layer/resize', true);
      engine.block.setScopeEnabled(block, 'layer/rotate', true);
      engine.block.setScopeEnabled(block, 'layer/flip', true);
    };

    const lifecycleLockedBlock = createExampleBlock(
      'Cannot\ndelete',
      {
        r: 0.75,
        g: 0.75,
        b: 0.75
      },
      disableLifecycleScopes
    );
    // Block cannot be deleted or duplicated
    // Other scopes are explicitly enabled: moving, resizing, rotation, flipping
```

Users cannot delete or duplicate the block but can still move, resize, and edit it. Use this for essential template elements that must remain present.

### Checking Scope State

Query the current state of any scope for a block:

```typescript highlight=highlight-block-level-scope-check
    // Check if a scope is enabled for a specific block
    const canMove = engine.block.isScopeEnabled(moveLockedBlock, 'layer/move');
    const canDelete = engine.block.isScopeEnabled(
      lifecycleLockedBlock,
      'lifecycle/destroy'
    );
    const canEditFully = engine.block.isScopeEnabled(
      fullyEditableBlock,
      'layer/move'
    );
    const canEditLocked = engine.block.isScopeEnabled(
      fullyLockedBlock,
      'layer/move'
    );

    // eslint-disable-next-line no-console
    console.log('Move-locked block - layer/move enabled:', canMove); // false
    // eslint-disable-next-line no-console
    console.log(
      'Lifecycle-locked block - lifecycle/destroy enabled:',
      canDelete
    ); // false
    // eslint-disable-next-line no-console
    console.log('Fully editable block - layer/move enabled:', canEditFully); // true
    // eslint-disable-next-line no-console
    console.log('Fully locked block - layer/move enabled:', canEditLocked); // false
```

Use `isScopeEnabled()` to check the block-level setting. This returns whether the scope is enabled at the block level, but doesn't consider global scope settings.

### Checking Effective Permissions

Check the effective permission considering both block and global settings:

```typescript
// Check if scope is allowed (considers global + block settings)
const moveAllowed = engine.block.isAllowedByScope(block, 'layer/move');
```

`isAllowedByScope()` returns the final permission after resolving block-level and global scope settings. Use this when you need to know if an action is actually permitted.

## API Reference

| Method | Description |
| --- | --- |
| `engine.block.setScopeEnabled()` | Enable or disable a scope for a specific block |
| `engine.block.isScopeEnabled()` | Check if a scope is enabled at the block level |
| `engine.block.isAllowedByScope()` | Check if a scope is allowed considering both block and global settings |
| `engine.editor.setGlobalScope()` | Set global scope policy (`'Allow'`, `'Deny'`, or `'Defer'`) |
| `engine.editor.findAllScopes()` | List all available scope keys |



---

## More Resources

- **[Svelte Documentation Index](https://img.ly/svelte.md)** - Browse all Svelte documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./svelte.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support