> This is one page of the CE.SDK Vue documentation. For a complete overview, see the [Vue Documentation Index](https://img.ly/vue.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [User Interface](./user-interface.md) > [Customization](./user-interface/customization.md) > [Disable or Enable Features](./user-interface/customization/disable-or-enable.md)

---

Control which editor features are available to users using the Feature API.

![Disable or Enable Features example showing the CE.SDK editor with feature controls](https://img.ly/docs/cesdk/./assets/browser.hero.webp)

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/heads/main.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/main/guides-user-interface-customization-disable-or-enable-browser)
>
> - [Open in StackBlitz](https://stackblitz.com/~/github.com/imgly/cesdk-web-examples/tree/main/guides-user-interface-customization-disable-or-enable-browser)
>
> - [Live demo](https://img.ly/examples/guides-user-interface-customization-disable-or-enable-browser/)

The Feature API provides global control over feature visibility throughout the editor. Use it to hide delete buttons from certain users, disable crop controls based on context, or conditionally enable features based on user roles or selection state. Unlike the Component Order API which targets specific components in specific areas, the Feature API affects features everywhere in the editor at once.

```typescript file=@cesdk_web_examples/guides-user-interface-customization-disable-or-enable-browser/browser.ts reference-only
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
 * Disable or Enable Features Example
 *
 * This example demonstrates how to use CE.SDK's Feature API to:
 * - Enable and disable features with simple toggles
 * - Use glob patterns for bulk operations
 * - Create custom predicates based on selection
 * - Extend default predicates with additional conditions
 * - Check feature status and discover available features
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
      page: {
        sourceId: 'ly.img.page.presets',
        assetId: 'ly.img.page.presets.print.iso.a6.landscape'
      }
    });

    const engine = cesdk.engine;

    // Enable delete feature with default predicate
    cesdk.feature.enable('ly.img.delete');

    // Enable multiple features at once
    cesdk.feature.enable(['ly.img.duplicate', 'ly.img.group']);

    // Disable crop feature
    cesdk.feature.disable('ly.img.crop');

    // Disable multiple features at once
    cesdk.feature.disable(['ly.img.notifications', 'ly.img.preview']);

    // Disable all transform features using glob pattern
    cesdk.feature.disable('ly.img.transform*');

    // Enable all video features using glob pattern
    cesdk.feature.enable('ly.img.video*');

    // Set feature with boolean (terminal predicate)
    cesdk.feature.set('ly.img.fill', true);

    // Set feature with custom predicate based on selection
    cesdk.feature.set('ly.img.duplicate', ({ engine }) => {
      return engine.block.findAllSelected().length > 0;
    });

    // Extend default predicate with additional condition
    cesdk.feature.set('ly.img.delete', ({ defaultPredicate }) => {
      // Only allow delete in design mode
      return defaultPredicate() && engine.scene.getMode() === 'Design';
    });

    // Chain multiple predicates using isPreviousEnable
    cesdk.feature.set('ly.img.replace', ({ isPreviousEnable, engine }) => {
      const previousResult = isPreviousEnable();
      const hasSelection = engine.block.findAllSelected().length > 0;
      return previousResult && hasSelection;
    });

    // Check if a feature is enabled
    const isDeleteEnabled = cesdk.feature.isEnabled('ly.img.delete');
    console.log('Delete feature enabled:', isDeleteEnabled);

    // Check if all video features are enabled (returns true only if ALL match)
    const allVideoEnabled = cesdk.feature.isEnabled('ly.img.video*');
    console.log('All video features enabled:', allVideoEnabled);

    // List all registered feature IDs
    const allFeatures = cesdk.feature.list();
    console.log('All features:', allFeatures.slice(0, 10), '...');

    // List features matching a pattern
    const navigationFeatures = cesdk.feature.list({
      matcher: 'ly.img.navigation*'
    });
    console.log('Navigation features:', navigationFeatures);

    cesdk.ui.insertOrderComponent(
      { in: 'ly.img.navigation.bar', position: 'end' },
      {
        id: 'ly.img.actions.navigationBar',
        children: [
          {
            id: 'ly.img.action.navigationBar',
            key: 'toggle-dock',
            label: 'Toggle Dock',
            onClick: () => {
              const enabled = cesdk.feature.isEnabled('ly.img.dock');
              if (enabled) {
                cesdk.feature.disable('ly.img.dock');
                console.log('Dock feature disabled');
              } else {
                cesdk.feature.enable('ly.img.dock');
                console.log('Dock feature enabled');
              }
            }
          },
          {
            id: 'ly.img.action.navigationBar',
            key: 'toggle-crop',
            label: 'Toggle Crop Features',
            icon: '@imgly/Crop',
            onClick: () => {
              const enabled = cesdk.feature.isEnabled('ly.img.crop');
              if (enabled) {
                cesdk.feature.disable('ly.img.crop*');
                console.log('All crop features disabled');
              } else {
                cesdk.feature.enable('ly.img.crop*');
                console.log('All crop features enabled');
              }
            }
          },
          {
            id: 'ly.img.action.navigationBar',
            key: 'log-status',
            label: 'Log Feature Status',
            icon: '@imgly/Info',
            onClick: () => {
              console.log('=== Feature Status ===');
              console.log('Dock:', cesdk.feature.isEnabled('ly.img.dock'));
              console.log(
                'Duplicate:',
                cesdk.feature.isEnabled('ly.img.duplicate')
              );
              console.log('Crop:', cesdk.feature.isEnabled('ly.img.crop'));
              console.log('Fill:', cesdk.feature.isEnabled('ly.img.fill'));
              console.log(
                'Navigation features:',
                cesdk.feature.list({ matcher: 'ly.img.navigation*' })
              );
            }
          }
        ]
      }
    );

    const page = engine.block.findByType('page')[0];
    const pageWidth = engine.block.getWidth(page);
    const pageHeight = engine.block.getHeight(page);

    const gradientFill = engine.block.createFill('gradient/linear');
    engine.block.setFill(page, gradientFill);
    engine.block.setGradientColorStops(gradientFill, 'fill/gradient/colors', [
      { color: { r: 0.99, g: 0.98, b: 0.97, a: 1 }, stop: 0 },
      { color: { r: 0.97, g: 0.96, b: 0.94, a: 1 }, stop: 1 }
    ]);
    engine.block.setFloat(gradientFill, 'fill/gradient/linear/startPointX', 0);
    engine.block.setFloat(gradientFill, 'fill/gradient/linear/startPointY', 0);
    engine.block.setFloat(gradientFill, 'fill/gradient/linear/endPointX', 1);
    engine.block.setFloat(gradientFill, 'fill/gradient/linear/endPointY', 1);

    const titleBlock = engine.block.create('text');
    engine.block.appendChild(page, titleBlock);
    engine.block.replaceText(titleBlock, 'Disable or Enable Features');
    engine.block.setTextFontSize(titleBlock, 24);
    engine.block.setTextColor(titleBlock, { r: 0.25, g: 0.22, b: 0.2, a: 1 });
    engine.block.setEnum(titleBlock, 'text/horizontalAlignment', 'Center');
    engine.block.setWidth(titleBlock, pageWidth * 0.8);
    engine.block.setHeightMode(titleBlock, 'Auto');
    engine.block.setPositionX(titleBlock, pageWidth * 0.1);
    engine.block.setPositionY(titleBlock, pageHeight * 0.4);

    const subtitleBlock = engine.block.create('text');
    engine.block.appendChild(page, subtitleBlock);
    engine.block.replaceText(subtitleBlock, 'IMG.LY');
    engine.block.setTextFontSize(subtitleBlock, 12);
    engine.block.setTextColor(subtitleBlock, {
      r: 0.65,
      g: 0.45,
      b: 0.4,
      a: 1
    });
    engine.block.setEnum(subtitleBlock, 'text/horizontalAlignment', 'Center');
    engine.block.setWidth(subtitleBlock, pageWidth * 0.8);
    engine.block.setHeightMode(subtitleBlock, 'Auto');
    engine.block.setPositionX(subtitleBlock, pageWidth * 0.1);
    engine.block.setPositionY(subtitleBlock, pageHeight * 0.52);

    engine.block.setSelected(titleBlock, true);

    console.log('Disable or Enable Features example loaded successfully!');
  }
}

export default Example;
```

This guide covers how to enable and disable features with simple toggles, create custom predicates for conditional feature access, use glob patterns for bulk operations, and debug feature configurations.

## Feature API Methods

The following table summarizes the main Feature API methods and when to use each:

| Method | Use Case |
|--------|----------|
| `cesdk.feature.enable()` | Enable features with their default predicates |
| `cesdk.feature.disable()` | Disable features (hide from UI) |
| `cesdk.feature.set()` | Set features with custom predicates or boolean values |
| `cesdk.feature.isEnabled()` | Check if a feature is currently enabled |
| `cesdk.feature.list()` | Discover registered feature IDs |
| `cesdk.feature.get()` | Get predicate chain for debugging |

## Enable Features

Use `cesdk.feature.enable()` to activate a feature with its default predicate behavior. The method accepts a single feature ID, an array of IDs, or a glob pattern.

```typescript highlight-enable-feature
// Enable delete feature with default predicate
cesdk.feature.enable('ly.img.delete');
```

You can enable multiple features at once by passing an array:

```typescript highlight-enable-multiple
// Enable multiple features at once
cesdk.feature.enable(['ly.img.duplicate', 'ly.img.group']);
```

Glob patterns allow you to enable all features matching a pattern. The `*` wildcard matches any sequence of characters:

```typescript highlight-glob-enable
// Enable all video features using glob pattern
cesdk.feature.enable('ly.img.video*');
```

## Disable Features

Use `cesdk.feature.disable()` to hide features from the UI. Like `enable()`, it accepts single IDs, arrays, or glob patterns.

```typescript highlight-disable-feature
// Disable crop feature
cesdk.feature.disable('ly.img.crop');
```

Disable multiple features at once by passing an array:

```typescript highlight-disable-multiple
// Disable multiple features at once
cesdk.feature.disable(['ly.img.notifications', 'ly.img.preview']);
```

Use glob patterns to disable all features matching a pattern:

```typescript highlight-glob-disable
// Disable all transform features using glob pattern
cesdk.feature.disable('ly.img.transform*');
```

## Custom Predicates

The `cesdk.feature.set()` method allows you to configure features with custom logic. You can pass a boolean value or a function predicate.

### Boolean Predicates

Passing `true` or `false` creates a terminal predicate that overrides any `enable()` or `disable()` calls:

```typescript highlight-set-boolean
// Set feature with boolean (terminal predicate)
cesdk.feature.set('ly.img.fill', true);
```

> **Note:** Boolean predicates are terminal. Once you use `set()` with a boolean, subsequent `enable()` or `disable()` calls won't affect that feature because the boolean predicate evaluates first.

### Function Predicates

Function predicates receive a context object with `engine`, `isPreviousEnable()`, and `defaultPredicate()`. Use them for dynamic conditions based on selection or other state:

```typescript highlight-set-predicate
// Set feature with custom predicate based on selection
cesdk.feature.set('ly.img.duplicate', ({ engine }) => {
  return engine.block.findAllSelected().length > 0;
});
```

This predicate enables the duplicate feature only when at least one block is selected.

### Extending Default Behavior

You can build on a feature's default predicate using `defaultPredicate()`. This lets you add conditions while preserving the built-in logic:

```typescript highlight-extend-default
// Extend default predicate with additional condition
cesdk.feature.set('ly.img.delete', ({ defaultPredicate }) => {
  // Only allow delete in design mode
  return defaultPredicate() && engine.scene.getMode() === 'Design';
});
```

### Layering Conditions

Use `isPreviousEnable()` to chain with previously registered predicates. This enables layered conditions from multiple `set()` calls:

```typescript highlight-chain-predicates
// Chain multiple predicates using isPreviousEnable
cesdk.feature.set('ly.img.replace', ({ isPreviousEnable, engine }) => {
  const previousResult = isPreviousEnable();
  const hasSelection = engine.block.findAllSelected().length > 0;
  return previousResult && hasSelection;
});
```

## Evaluation Order

When multiple predicates are registered for a feature, they evaluate in this order:

1. Most recent `set()` predicates run first
2. Older `set()` predicates in reverse chronological order
3. `enable()`/`disable()` state runs last

Boolean predicates are terminal and immediately return their value without continuing the chain. Function predicates control whether to continue by calling `isPreviousEnable()` or returning directly.

## Glob Patterns

All main Feature API methods support glob pattern matching for bulk operations. The `*` wildcard matches any sequence of characters within a segment.

Supported methods:

- `cesdk.feature.enable('ly.img.video.*')` - Enable all video features
- `cesdk.feature.disable('ly.img.crop.*')` - Disable all crop features
- `cesdk.feature.set('ly.img.navigation.*', predicate)` - Set all navigation features
- `cesdk.feature.isEnabled('ly.img.video.*')` - Check if ALL matching features are enabled
- `cesdk.feature.list({ matcher: 'ly.img.video.*' })` - List matching features

## Check Feature Status

Use `cesdk.feature.isEnabled()` to query if a feature is currently enabled:

```typescript highlight-check-enabled
// Check if a feature is enabled
const isDeleteEnabled = cesdk.feature.isEnabled('ly.img.delete');
console.log('Delete feature enabled:', isDeleteEnabled);
```

When using a glob pattern with `isEnabled()`, it returns `true` only if all matching features are enabled:

```typescript highlight-check-glob
// Check if all video features are enabled (returns true only if ALL match)
const allVideoEnabled = cesdk.feature.isEnabled('ly.img.video*');
console.log('All video features enabled:', allVideoEnabled);
```

## Discover Features

Use `cesdk.feature.list()` to get all registered feature IDs. You can filter with the optional `matcher` parameter:

```typescript highlight-list-features
// List all registered feature IDs
const allFeatures = cesdk.feature.list();
console.log('All features:', allFeatures.slice(0, 10), '...');
```

Filter the list with a glob pattern:

```typescript highlight-list-filtered
// List features matching a pattern
const navigationFeatures = cesdk.feature.list({
  matcher: 'ly.img.navigation*'
});
console.log('Navigation features:', navigationFeatures);
```

## Built-in Features

CE.SDK includes many built-in features organized by category:

### Navigation Features

| Feature ID | Description |
|------------|-------------|
| `ly.img.navigation.bar` | Controls visibility of the Navigation Bar |
| `ly.img.navigation.back` | Controls visibility of the "Back" button |
| `ly.img.navigation.close` | Controls visibility of the "Close" button |
| `ly.img.navigation.undoRedo` | Controls visibility of "Undo" and "Redo" buttons |
| `ly.img.navigation.zoom` | Controls visibility of zoom controls |
| `ly.img.navigation.actions` | Controls visibility of navigation actions |

### Inspector Features

| Feature ID | Description |
|------------|-------------|
| `ly.img.inspector.bar` | Controls visibility of the Inspector Bar |
| `ly.img.inspector.panel` | Controls visibility of the Advanced Inspector |
| `ly.img.inspector.toggle` | Controls presence of the Inspector Toggle button |

### Canvas Features

| Feature ID | Description |
|------------|-------------|
| `ly.img.canvas.bar` | Controls visibility of the Canvas Bar |
| `ly.img.canvas.menu` | Controls visibility of the Canvas Menu |

### Editing Features

| Feature ID | Description |
|------------|-------------|
| `ly.img.delete` | Controls ability to delete blocks |
| `ly.img.duplicate` | Controls ability to duplicate blocks |
| `ly.img.replace` | Controls presence of the Replace button |
| `ly.img.group` | Controls grouping functionality |
| `ly.img.placeholder` | Controls Placeholder toggle visibility in Inspector |

### Video Features

| Feature ID | Description |
|------------|-------------|
| `ly.img.video.timeline` | Controls visibility of the Video Timeline |
| `ly.img.video.clips` | Controls visibility of video clips track |
| `ly.img.video.overlays` | Controls visibility of overlays track |
| `ly.img.video.audio` | Controls visibility of audio track |
| `ly.img.video.addClip` | Controls ability to add clips |
| `ly.img.video.controls.*` | Controls various video controls |

### Text Features

| Feature ID | Description |
|------------|-------------|
| `ly.img.text.edit` | Controls presence of the Edit button |
| `ly.img.text.typeface` | Controls typeface dropdown |
| `ly.img.text.fontSize` | Controls font size input |
| `ly.img.text.fontStyle` | Controls bold/italic toggles |
| `ly.img.text.alignment` | Controls text alignment |
| `ly.img.text.advanced` | Controls advanced text options |

### Effects Features

| Feature ID | Description |
|------------|-------------|
| `ly.img.fill` | Controls Fill button |
| `ly.img.stroke` | Controls Stroke controls |
| `ly.img.adjustment` | Controls Adjustments button |
| `ly.img.filter` | Controls Filter button |
| `ly.img.effect` | Controls Effect button |
| `ly.img.blur` | Controls Blur button |
| `ly.img.shadow` | Controls Shadow button |
| `ly.img.crop` | Controls Crop button |

### Transform Features

| Feature ID | Description |
|------------|-------------|
| `ly.img.transform.position` | Controls X/Y position controls |
| `ly.img.transform.size` | Controls width/height controls |
| `ly.img.transform.rotation` | Controls rotation controls |
| `ly.img.transform.flip` | Controls flip controls |

### Other Features

| Feature ID | Description |
|------------|-------------|
| `ly.img.dock` | Controls visibility of the Dock |
| `ly.img.preview` | Controls Preview button |
| `ly.img.page.add` | Controls Add Page button |
| `ly.img.page.move` | Controls page move buttons |
| `ly.img.page.resize` | Controls Resize button |
| `ly.img.notifications` | Controls notification toasts |
| `ly.img.notifications.undo` | Controls undo notifications |
| `ly.img.notifications.redo` | Controls redo notifications |

## Troubleshooting

### Feature Not Visible

If a feature doesn't appear in the UI after calling `enable()`:

1. Check if a `set()` call with a boolean is overriding it. Boolean predicates are terminal and take precedence.
2. Verify the feature ID spelling matches exactly.
3. Confirm the feature is relevant for the current context (e.g., video features only appear in Video mode).

### `disable()` Not Working

If `disable()` doesn't hide a feature:

1. Check if a `set()` predicate exists for that feature. The `set()` predicates evaluate before `disable()`.
2. Use `cesdk.feature.get()` to inspect the predicate chain.

### Glob Pattern Not Matching

If a glob pattern doesn't affect expected features:

1. Verify the pattern syntax is correct.
2. Use `cesdk.feature.list({ matcher: 'your.pattern.*' })` to see which features match.
3. Check that features are registered before applying the pattern.

## API Reference

| Method | Signature | Purpose |
|--------|-----------|---------|
| `cesdk.feature.enable()` | `enable(featureId: FeatureId \| FeatureId[]): void` | Enable features with default predicates |
| `cesdk.feature.disable()` | `disable(featureId: FeatureId \| FeatureId[]): void` | Disable features |
| `cesdk.feature.set()` | `set(featureId: FeatureId, enabled: boolean \| FeaturePredicate): void` | Set feature state with custom predicates |
| `cesdk.feature.isEnabled()` | `isEnabled(featureId: FeatureId, context?: FeatureContext): boolean` | Check if feature is enabled |
| `cesdk.feature.list()` | `list(options?: { matcher?: string }): FeatureId[]` | List registered feature IDs |
| `cesdk.feature.get()` | `get(featureId: FeatureId): FeaturePredicate[] \| undefined` | Get predicate chain for debugging |

## Next Steps

- [Show/Hide Components](./user-interface/customization/quick-start/show-hide-components.md) - Hide UI elements without disabling functionality
- [Navigation Bar](./user-interface/customization/navigation-bar.md) - Customize navigation bar buttons
- [Canvas Menu](./user-interface/customization/canvas-menu.md) - Customize the canvas context menu
- [Inspector Bar](./user-interface/customization/inspector-bar.md) - Customize the inspector bar



---

## More Resources

- **[Vue Documentation Index](https://img.ly/vue.md)** - Browse all Vue documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./vue.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support