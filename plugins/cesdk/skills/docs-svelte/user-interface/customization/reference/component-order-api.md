> This is one page of the CE.SDK Svelte documentation. For a complete overview, see the [Svelte Documentation Index](https://img.ly/svelte.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [User Interface](./user-interface.md) > [Customization](./user-interface/customization.md) > [Component Order API](./user-interface/customization/reference/component-order-api.md)

---

This guide provides the complete reference for the Component Order API, which controls the layout and composition of all five customizable UI areas in CE.SDK. You'll learn how to use each of the five unified methods—`getComponentOrder`, `setComponentOrder`, `insertOrderComponent`, `updateOrderComponent`, and `removeOrderComponent`—to programmatically rearrange, add, modify, or hide components.

The Component Order API provides a unified way to customize all UI areas with consistent patterns. This API replaces the deprecated area-specific methods and supports powerful matching patterns including glob wildcards, position-based matchers, and edit mode contexts for conditional customization.

For a complete list of available component IDs in each area, see the [Component Reference](./user-interface/customization/reference/component-reference.md). For task-focused tutorials, see the [Quick Start guides](./user-interface/customization/quick-start.md).

## UI Areas Overview

The Component Order API supports five UI areas, each with specific purposes and requirements:

| Area | Location Value | Description | Special Options |
|------|----------------|-------------|-----------------|
| Dock | `'ly.img.dock'` | Asset library and tool buttons on the side | — |
| Inspector Bar | `'ly.img.inspector.bar'` | Property controls and settings panel | `when.editMode` |
| Canvas Menu | `'ly.img.canvas.menu'` | Right-click/long-press context menu on canvas | `when.editMode` |
| Navigation Bar | `'ly.img.navigation.bar'` | Top navigation with actions and controls | — |
| Canvas Bar | `'ly.img.canvas.bar'` | Controls above/below the canvas | `at: 'top' \| 'bottom'` (required) |

## Core Concepts

### Component Identifiers

Components can be specified in two forms:

**String IDs** — Simple component references:

```javascript
'ly.img.spacer'
'ly.img.separator'
'ly.img.undoRedo.navigationBar'
```

**Objects with inline configuration** — Components with custom properties:

```javascript
{
  id: 'ly.img.action.navigationBar',
  key: 'my-export',
  label: 'Export',
  icon: '@imgly/Download',
  onClick: async () => { /* export logic */ }
}
```

Using `cesdk.ui.getComponentOrder()` returns the full object form with all properties.

### Component Matchers

Matchers specify which components to target in `updateOrderComponent`, `removeOrderComponent`, and the `before`/`after` options in `insertOrderComponent`:

| Matcher Type | Example | Description |
|--------------|---------|-------------|
| Position keyword | `'first'`, `'last'` | Match first or last component |
| Index | `0`, `1`, `-1` | Match by index (negative for end) |
| Exact ID | `'ly.img.separator'` | Match exact component ID |
| Glob pattern | `'ly.img.*'` | Match using wildcards |
| Object match | `{ id: 'x', key: 'y' }` | Match by object properties |
| Predicate function | `(c, i) => boolean` | Custom matching logic |

```javascript
// Position-based
cesdk.ui.removeOrderComponent({ in: 'ly.img.dock', match: 'first' });

// Glob pattern
cesdk.ui.removeOrderComponent({ in: 'ly.img.dock', match: 'ly.img.*' });

// Predicate function
cesdk.ui.removeOrderComponent({
  in: 'ly.img.dock',
  match: (component) => component.id.includes('separator')
});
```

### Edit Mode Context

Use the `when` option to create conditional orderings that apply only in specific edit modes:

```javascript
cesdk.ui.setComponentOrder(
  { in: 'ly.img.inspector.bar', when: { editMode: 'Text' } },
  ['ly.img.text.typeFace.inspectorBar', 'ly.img.text.bold.inspectorBar']
);
```

Available edit modes include: `'Transform'` (default), `'Text'`, `'Crop'`, `'Trim'`, and custom values.

### Glob Patterns for Multi-Area Operations

Use glob patterns in the `in` option to target multiple areas with one call:

```javascript
// Update all areas at once
cesdk.ui.updateOrderComponent(
  { in: '*', match: 'ly.img.separator' },
  { disabled: true }
);

// Target all bar-type areas
cesdk.ui.removeOrderComponent({
  in: 'ly.img.*.bar',
  match: 'ly.img.spacer'
});
```

## Method Reference

### getComponentOrder()

Gets the current component order for a UI area. Returns an array of component objects with all their properties.

**Signature:**

```typescript
cesdk.ui.getComponentOrder<A extends UIArea>(
  options: GetOrderOptions<A>
): OrderComponentFor<A>[]
```

**Parameters:**

- `options.in` — The UI area to query (required)
- `options.at` — For canvas bar only: `'top'` or `'bottom'` (required for canvas bar)
- `options.when` — Optional edit mode context filter

**Returns:** Array of component objects in their current order.

**Examples:**

```javascript
// Get dock order
const dockOrder = cesdk.ui.getComponentOrder({ in: 'ly.img.dock' });

// Get canvas bar top order
const canvasBarTop = cesdk.ui.getComponentOrder({
  in: 'ly.img.canvas.bar',
  at: 'top'
});

// Get order for specific edit mode
const textInspector = cesdk.ui.getComponentOrder({
  in: 'ly.img.inspector.bar',
  when: { editMode: 'Text' }
});
```

### setComponentOrder()

Sets the complete component order for a UI area, replacing any existing order.

**Signature:**

```typescript
cesdk.ui.setComponentOrder<A extends UIArea>(
  options: SetOrderOptions<A>,
  order: ComponentSpec<A>[]
): void
```

**Parameters:**

- `options.in` — The UI area to set (required)
- `options.at` — For canvas bar only: `'top'` or `'bottom'` (required for canvas bar)
- `options.when` — Optional edit mode context for conditional ordering
- `order` — Array of component IDs or component objects

**Examples:**

```javascript
// Set dock order with simple IDs
cesdk.ui.setComponentOrder({ in: 'ly.img.dock' }, [
  'ly.img.spacer',
  'my.custom.button',
  'ly.img.separator',
  'ly.img.assetLibrary.dock'
]);

// Set canvas bar with position
cesdk.ui.setComponentOrder(
  { in: 'ly.img.canvas.bar', at: 'top' },
  ['ly.img.settings.canvasBar']
);

// Conditional order for Text edit mode
cesdk.ui.setComponentOrder(
  { in: 'ly.img.inspector.bar', when: { editMode: 'Text' } },
  ['ly.img.text.typeFace.inspectorBar', 'ly.img.text.fontSize.inspectorBar']
);
```

### insertOrderComponent()

Inserts one or more components at a specified position in a UI area.

**Signature:**

```typescript
cesdk.ui.insertOrderComponent<A extends UIArea>(
  options: InsertComponentOptions<A>,
  components: ComponentSpec<A> | ComponentSpec<A>[]
): InsertResult<A>
```

**Parameters:**

- `options.in` — The UI area (required)
- `options.at` — For canvas bar only: `'top'` or `'bottom'` (required for canvas bar)
- `options.when` — Optional edit mode context
- `options.before` — Insert before matching component (matcher)
- `options.after` — Insert after matching component (matcher)
- `options.position` — Insert at position: `'start'`, `'end'`, or numeric index
- `components` — Single component or array of components to insert

**Returns:** `{ inserted: boolean, insertedCount: number, order: OrderComponent[] }`

**Position defaults:** If no `before`, `after`, or `position` is specified, components append to the end.

**Examples:**

```javascript
// Append to end (default)
cesdk.ui.insertOrderComponent({ in: 'ly.img.dock' }, 'my.button');

// Insert multiple at once
cesdk.ui.insertOrderComponent(
  { in: 'ly.img.dock', after: 'ly.img.spacer' },
  ['my.button.1', 'my.button.2', 'my.button.3']
);

// Insert before a component
cesdk.ui.insertOrderComponent(
  { in: 'ly.img.dock', before: 'ly.img.separator' },
  'my.button'
);

// Insert at start
cesdk.ui.insertOrderComponent(
  { in: 'ly.img.dock', position: 'start' },
  'my.first.button'
);

// Insert at specific index
cesdk.ui.insertOrderComponent(
  { in: 'ly.img.dock', position: 2 },
  'my.third.button'
);

// Insert with inline configuration
cesdk.ui.insertOrderComponent(
  { in: 'ly.img.navigation.bar', position: 'end' },
  {
    id: 'ly.img.action.navigationBar',
    key: 'my-export',
    label: 'Export',
    icon: '@imgly/Download',
    onClick: async () => { /* export logic */ }
  }
);
```

### updateOrderComponent()

Updates components matching a criteria. Supports glob patterns for multi-area operations.

**Signature:**

```typescript
cesdk.ui.updateOrderComponent<A extends UIAreaSpecifier>(
  options: ComponentMatchOptions<A>,
  update: UpdateSpec<UIArea>
): UpdateResult | MultiAreaUpdateResult
```

**Parameters:**

- `options.in` — The UI area, array of areas, or glob pattern (required)
- `options.at` — For canvas bar: `'top'`, `'bottom'`, or omit for both
- `options.when` — Optional edit mode context
- `options.match` — Component matcher (required)
- `update` — New ID, partial properties, or updater function

**Returns:** `{ updated: number, order: OrderComponent[] }` for single area, or object with results per area for multi-area.

**Examples:**

```javascript
// Update by exact ID
cesdk.ui.updateOrderComponent(
  { in: 'ly.img.dock', match: 'ly.img.separator' },
  { key: 'my-separator' }
);

// Update by glob pattern
cesdk.ui.updateOrderComponent(
  { in: 'ly.img.dock', match: 'ly.img.*' },
  { disabled: true }
);

// Update using function
cesdk.ui.updateOrderComponent(
  { in: 'ly.img.inspector.bar', match: 'first' },
  (component) => ({ key: `${component.id}-modified` })
);

// Update across all areas
const results = cesdk.ui.updateOrderComponent(
  { in: '*', match: 'ly.img.separator' },
  { key: 'global-sep' }
);
```

### removeOrderComponent()

Removes components matching a criteria. Supports glob patterns for multi-area operations.

**Signature:**

```typescript
cesdk.ui.removeOrderComponent<A extends UIAreaSpecifier>(
  options: ComponentMatchOptions<A>
): RemoveResult | MultiAreaRemoveResult
```

**Parameters:**

- `options.in` — The UI area, array of areas, or glob pattern (required)
- `options.at` — For canvas bar: `'top'`, `'bottom'`, or omit for both
- `options.when` — Optional edit mode context
- `options.match` — Component matcher (required)

**Returns:** `{ removed: number, order: OrderComponent[] }` for single area, or object with results per area for multi-area.

**Examples:**

```javascript
// Remove by exact ID
cesdk.ui.removeOrderComponent({
  in: 'ly.img.dock',
  match: 'ly.img.separator'
});

// Remove by position
cesdk.ui.removeOrderComponent({
  in: 'ly.img.inspector.bar',
  match: 'last'
});

// Remove by glob pattern
cesdk.ui.removeOrderComponent({
  in: 'ly.img.dock',
  match: 'ly.img.*'
});

// Remove from all areas
const results = cesdk.ui.removeOrderComponent({
  in: '*',
  match: 'ly.img.separator'
});
```

## TypeScript Types Reference

Key types exported from CE.SDK for working with the Component Order API:

```typescript
// UI Areas
type UIArea =
  | 'ly.img.dock'
  | 'ly.img.inspector.bar'
  | 'ly.img.canvas.menu'
  | 'ly.img.navigation.bar'
  | 'ly.img.canvas.bar';

// Component matchers
type ComponentMatcher<C> =
  | 'first'
  | 'last'
  | number
  | string              // exact ID or glob pattern
  | Partial<C>          // object match
  | ((c: C, i: number) => boolean);  // predicate

// Order context for conditional ordering
interface OrderContext {
  editMode?: string;    // 'Transform', 'Text', 'Crop', 'Trim', etc.
}

// Result types
interface InsertResult<A> {
  inserted: boolean;
  insertedCount: number;
  order: OrderComponentFor<A>[];
}

interface UpdateResult<A> {
  updated: number;
  order: OrderComponentFor<A>[];
}

interface RemoveResult<A> {
  removed: number;
  order: OrderComponentFor<A>[];
}
```

## Troubleshooting

### "Canvas bar requires 'at' position"

When targeting `'ly.img.canvas.bar'`, you must specify `at: 'top'` or `at: 'bottom'` for `getComponentOrder` and `setComponentOrder`. For `updateOrderComponent` and `removeOrderComponent`, omitting `at` applies to both positions.

```javascript
// Correct
cesdk.ui.getComponentOrder({ in: 'ly.img.canvas.bar', at: 'top' });

// Error
cesdk.ui.getComponentOrder({ in: 'ly.img.canvas.bar' });
```

### "Invalid UI area"

Check that the `in` option uses a valid area string from the `UIArea` type. Valid values are:

- `'ly.img.dock'`
- `'ly.img.inspector.bar'`
- `'ly.img.canvas.menu'`
- `'ly.img.navigation.bar'`
- `'ly.img.canvas.bar'`

### Component not found

When using `before` or `after` in `insertOrderComponent`, if the matcher doesn't find any component, the insert fails silently with `inserted: false`. Check the return value:

```javascript
const result = cesdk.ui.insertOrderComponent(
  { in: 'ly.img.dock', after: 'non.existent.component' },
  'my.button'
);

if (!result.inserted) {
  console.warn('Insert failed - matcher found no components');
}
```

### Edit mode context not applying

Ensure the edit mode string matches exactly. Edit modes are case-sensitive:

```javascript
// Correct
cesdk.ui.setComponentOrder(
  { in: 'ly.img.inspector.bar', when: { editMode: 'Text' } },
  [...]
);

// Wrong - lowercase won't match
cesdk.ui.setComponentOrder(
  { in: 'ly.img.inspector.bar', when: { editMode: 'text' } },
  [...]
);
```

### Glob patterns not matching

Globs use `*` as a wildcard character:

- `'ly.img.*'` matches `'ly.img.separator'` but not `'my.custom.button'`
- `'*'` matches all areas
- `'ly.img.*.bar'` matches `'ly.img.navigation.bar'` and `'ly.img.inspector.bar'`

## API Reference

| Method | Category | Purpose |
|--------|----------|---------|
| `cesdk.ui.getComponentOrder()` | Read | Get current component order for a UI area |
| `cesdk.ui.setComponentOrder()` | Write | Set complete component order for a UI area |
| `cesdk.ui.insertOrderComponent()` | Write | Insert components at a position in a UI area |
| `cesdk.ui.updateOrderComponent()` | Write | Update components matching criteria in one or more areas |
| `cesdk.ui.removeOrderComponent()` | Write | Remove components matching criteria from one or more areas |

## Next Steps

- [Component Reference](./user-interface/customization/reference/component-reference.md) — Complete list of all component IDs by UI area
- [Show/Hide Components](./user-interface/customization/quick-start/show-hide-components.md) — Quick start for hiding components
- [Register New Component](./user-interface/ui-extensions/register-new-component.md) — Create custom components to use with this API
- [Navigation Bar](./user-interface/customization/navigation-bar.md) — Area-specific features and default order
- [Dock](./user-interface/customization/dock.md) — Area-specific features and default order



---

## More Resources

- **[Svelte Documentation Index](https://img.ly/svelte.md)** - Browse all Svelte documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./svelte.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support