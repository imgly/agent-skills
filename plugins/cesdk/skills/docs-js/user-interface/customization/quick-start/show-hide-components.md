> This is one page of the CE.SDK Vanilla JS/TS documentation. For a complete overview, see the [Vanilla JS/TS Documentation Index](https://img.ly/js.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [User Interface](./user-interface.md) > [Customization](./user-interface/customization.md) > [Show/Hide Components](./user-interface/customization/quick-start/show-hide-components.md)

---

Hide UI components using two approaches: the Feature API for disabling entire features, and the Component Order API for surgical control over individual components.

![Show/Hide Components example showing a minimal editor interface](https://img.ly/docs/cesdk/./assets/browser.hero.webp)

> **Reading time:** 5 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/heads/main.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/main/guides-user-interface-customization-quick-start-show-hide-components-browser)
>
> - [Open in StackBlitz](https://stackblitz.com/~/github.com/imgly/cesdk-web-examples/tree/main/guides-user-interface-customization-quick-start-show-hide-components-browser)
>
> - [Live demo](https://img.ly/examples/guides-user-interface-customization-quick-start-show-hide-components-browser/)

CE.SDK provides two ways to hide UI elements. The **Feature API** hides features globally across the entire editor—use this for broad visibility control. The **Component Order API** removes specific components from specific UI areas—use this for targeted, surgical control over individual components.

```typescript file=@cesdk_web_examples/guides-user-interface-customization-quick-start-show-hide-components-browser/browser.ts reference-only
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
      page: {
        sourceId: 'ly.img.page.presets',
        assetId: 'ly.img.page.presets.print.iso.a6.landscape'
      }
    });

    // Hide components using Feature API (disables both UI and functionality)
    // This hides the page resize controls from the navigation bar
    cesdk.feature.disable('ly.img.navigation.pageResize');

    // Hide specific components using Component Order API
    // This removes the preview button but keeps preview functionality (keyboard shortcut still works)
    const previewResult = cesdk.ui.removeOrderComponent({
      in: 'ly.img.navigation.bar',
      match: 'ly.img.preview.navigationBar'
    });
    console.log(
      `Removed preview button: ${previewResult.removed} component(s)`
    );

    // Remove all separators from the navigation bar for a cleaner look
    const separatorResult = cesdk.ui.removeOrderComponent({
      in: 'ly.img.navigation.bar',
      match: 'ly.img.separator'
    });
    console.log(`Removed separators: ${separatorResult.removed} component(s)`);

    // Remove components using glob patterns
    // This removes all zoom-related components
    const zoomResult = cesdk.ui.removeOrderComponent({
      in: 'ly.img.navigation.bar',
      match: 'ly.img.zoom.*'
    });
    console.log(`Removed zoom components: ${zoomResult.removed} component(s)`);

    // Remove from multiple areas at once using area glob patterns
    // This removes all spacers from all areas
    const spacerResult = cesdk.ui.removeOrderComponent({
      in: '*',
      match: 'ly.img.spacer'
    });
    console.log('Removed spacers from all areas:', spacerResult);

    // Hide components only in specific edit modes using the 'when' context
    // This removes crop controls only when in Transform mode (keeps them in Crop mode)
    const conditionalResult = cesdk.ui.removeOrderComponent({
      in: 'ly.img.inspector.bar',
      match: 'ly.img.crop.inspectorBar',
      when: { editMode: 'Transform' }
    });
    console.log(
      `Removed crop controls in Transform mode: ${conditionalResult.removed} component(s)`
    );

    // Verify component removal by checking the current order
    const currentOrder = cesdk.ui.getComponentOrder({
      in: 'ly.img.navigation.bar'
    });
    console.log('Current navigation bar components:', currentOrder);

    console.log('Show/Hide Components example loaded successfully');
  }
}

export default Example;
```

This guide covers how to hide components using the Feature API, remove specific components with the Component Order API, use glob patterns for bulk operations, hide components conditionally based on edit mode, and verify component removal.

## Hide Using Feature API

The simplest way to hide UI elements is to disable the associated feature. This removes the feature from all UI areas globally.

```typescript highlight=highlight-feature-disable
// Hide components using Feature API (disables both UI and functionality)
// This hides the page resize controls from the navigation bar
cesdk.feature.disable('ly.img.navigation.pageResize');
```

The Feature API uses feature identifiers like `ly.img.navigation.pageResize` that correspond to specific UI capabilities. Disabling a feature hides it from all UI areas throughout the editor.

## Hide Specific Components

Use `cesdk.ui.removeOrderComponent()` to remove individual components while preserving the underlying functionality. This is useful when you want to hide a button but keep the feature accessible via keyboard shortcuts or your own custom UI.

```typescript highlight=highlight-remove-component
// Hide specific components using Component Order API
// This removes the preview button but keeps preview functionality (keyboard shortcut still works)
const previewResult = cesdk.ui.removeOrderComponent({
  in: 'ly.img.navigation.bar',
  match: 'ly.img.preview.navigationBar'
});
console.log(
  `Removed preview button: ${previewResult.removed} component(s)`
);
```

The method returns an object with `removed` (count of removed components) and `order` (the updated component array). Use this return value to verify the operation succeeded.

## Remove Multiple Components

You can remove layout elements like separators and spacers to create a more compact interface.

```typescript highlight=highlight-remove-separator
// Remove all separators from the navigation bar for a cleaner look
const separatorResult = cesdk.ui.removeOrderComponent({
  in: 'ly.img.navigation.bar',
  match: 'ly.img.separator'
});
console.log(`Removed separators: ${separatorResult.removed} component(s)`);
```

## Hide Using Glob Patterns

Glob patterns let you remove multiple matching components with a single call. Use `*` as a wildcard to match any sequence of characters.

```typescript highlight=highlight-glob-pattern
// Remove components using glob patterns
// This removes all zoom-related components
const zoomResult = cesdk.ui.removeOrderComponent({
  in: 'ly.img.navigation.bar',
  match: 'ly.img.zoom.*'
});
console.log(`Removed zoom components: ${zoomResult.removed} component(s)`);
```

This removes all components matching the pattern from the specified area.

## Hide from Multiple Areas

Target multiple UI areas at once using area glob patterns. This is useful for removing layout components like spacers or separators across the entire interface.

```typescript highlight=highlight-multi-area
// Remove from multiple areas at once using area glob patterns
// This removes all spacers from all areas
const spacerResult = cesdk.ui.removeOrderComponent({
  in: '*',
  match: 'ly.img.spacer'
});
console.log('Removed spacers from all areas:', spacerResult);
```

The method returns results for each affected area when using multi-area patterns.

## Conditional Hiding

Hide components only in specific edit modes using the `when` context. This lets you show different UI controls based on what the user is doing.

```typescript highlight=highlight-conditional
// Hide components only in specific edit modes using the 'when' context
// This removes crop controls only when in Transform mode (keeps them in Crop mode)
const conditionalResult = cesdk.ui.removeOrderComponent({
  in: 'ly.img.inspector.bar',
  match: 'ly.img.crop.inspectorBar',
  when: { editMode: 'Transform' }
});
console.log(
  `Removed crop controls in Transform mode: ${conditionalResult.removed} component(s)`
);
```

The `when` option accepts an `editMode` property that specifies when the removal applies. Common edit modes include `Transform`, `Crop`, `Trim`, and `Text`. The removal only affects the specified context—the component remains visible in other modes.

## Verify Component Removal

Check the current component order to verify your changes took effect.

```typescript highlight=highlight-verify-removal
// Verify component removal by checking the current order
const currentOrder = cesdk.ui.getComponentOrder({
  in: 'ly.img.navigation.bar'
});
console.log('Current navigation bar components:', currentOrder);
```

Use `getComponentOrder()` to inspect the current state of any UI area. This helps with debugging when components don't appear or disappear as expected.

## Common Hiding Scenarios

| What to Hide | Method | Code |
|--------------|--------|------|
| Undo/Redo buttons | Feature API | `cesdk.feature.disable('ly.img.navigation.undoRedo')` |
| Entire navigation bar | Feature API | `cesdk.feature.disable('ly.img.navigation.bar')` |
| Specific component | Component Order API | `cesdk.ui.removeOrderComponent({ in: area, match: id })` |
| All separators | Component Order API | `cesdk.ui.removeOrderComponent({ in: '*', match: 'ly.img.separator' })` |

## Troubleshooting

**Component still visible** — Verify the component ID and area are correct. Use `getComponentOrder()` to see current components. Component IDs include an area suffix like `.navigationBar` or `.inspectorBar`.

**Feature still works after hiding** — If you used `removeOrderComponent()`, functionality remains active. Use `feature.disable()` to completely disable a feature.

**Wrong area** — Double-check the area suffix in component IDs. For example, `ly.img.undoRedo.navigationBar` is different from `ly.img.undoRedo.inspectorBar`.

## API Reference

| Method | Category | Purpose |
|--------|----------|---------|
| `cesdk.feature.disable()` | Feature | Disable a feature and hide its UI |
| `cesdk.ui.removeOrderComponent()` | UI | Remove specific components from UI areas |
| `cesdk.ui.getComponentOrder()` | UI | Get current components to verify removal |

## Next Steps

- [Reorder Components](./user-interface/customization/quick-start/reorder-components.md) — Change component order instead of hiding
- [Component Reference](./user-interface/customization/reference/component-reference.md) — Find all component IDs
- [Component Order API](./user-interface/customization/reference/component-order-api.md) — Complete API reference



---

## More Resources

- **[Vanilla JS/TS Documentation Index](https://img.ly/js.md)** - Browse all Vanilla JS/TS documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./js.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support