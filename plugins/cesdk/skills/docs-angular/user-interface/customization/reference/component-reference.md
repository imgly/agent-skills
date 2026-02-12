> This is one page of the CE.SDK Angular documentation. For a complete overview, see the [Angular Documentation Index](https://img.ly/angular.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [User Interface](./user-interface.md) > [Customization](./user-interface/customization.md) > [Component Reference](./user-interface/customization/reference/component-reference.md)

---

This guide provides the complete list of all built-in component IDs for each of the five customizable UI areas in CE.SDK. Use this reference when you need to find the exact ID for a component to show, hide, reorder, or modify using the Component Order API.

Component IDs in CE.SDK follow the pattern `ly.img.[feature].[area]` (for example, `ly.img.undoRedo.navigationBar`). Custom components you create can use any ID pattern.

For information on how to use these IDs with the API methods, see the [Component Order API Reference](./user-interface/customization/reference/component-order-api.md). For task-focused tutorials, see the [Quick Start guides](./user-interface/customization/quick-start.md).

## Layout Components

These utility components are available across multiple UI areas:

| ID | Description | Available In |
|----|-------------|--------------|
| `ly.img.separator` | Visual divider line | All areas |
| `ly.img.spacer` | Flexible empty space that expands to fill available room | All areas |

## Navigation Bar Components

Components available in `'ly.img.navigation.bar'`:

### Navigation Controls

| ID | Description |
|----|-------------|
| `ly.img.back.navigationBar` | Back button (uses `onBack` handler) |
| `ly.img.close.navigationBar` | Close button (uses `onClose` handler) |
| `ly.img.undoRedo.navigationBar` | Undo and redo buttons |
| `ly.img.zoom.navigationBar` | Zoom controls |
| `ly.img.preview.navigationBar` | Preview mode toggle |
| `ly.img.pageResize.navigationBar` | Page size controls |
| `ly.img.title.navigationBar` | Editable document title |

### Action Buttons

| ID | Description |
|----|-------------|
| `ly.img.action.navigationBar` | Generic action button (requires `key` property to distinguish instances) |
| `ly.img.actions.navigationBar` | Dropdown menu containing multiple actions |
| `ly.img.saveScene.navigationBar` | Save scene action |
| `ly.img.exportImage.navigationBar` | Export as image action |
| `ly.img.exportPDF.navigationBar` | Export as PDF action |
| `ly.img.exportVideo.navigationBar` | Export as video action |
| `ly.img.shareScene.navigationBar` | Share scene action |
| `ly.img.exportScene.navigationBar` | Export scene file action |
| `ly.img.exportArchive.navigationBar` | Export as archive action |
| `ly.img.importScene.navigationBar` | Import scene file action |
| `ly.img.importArchive.navigationBar` | Import from archive action |

Action buttons support inline configuration with `onClick` handlers:

```javascript
cesdk.ui.insertOrderComponent(
  { in: 'ly.img.navigation.bar', position: 'end' },
  {
    id: 'ly.img.action.navigationBar',
    key: 'my-export',
    label: 'Export',
    icon: '@imgly/Download',
    onClick: async () => {
      // Export logic here
    }
  }
);
```

## Dock Components

Components available in `'ly.img.dock'`:

| ID | Description |
|----|-------------|
| `ly.img.assetLibrary.dock` | Asset library button with configurable entries |

The dock is primarily configured through the `ly.img.assetLibrary.dock` component. Use the `entries` array to specify which asset library panels appear:

```javascript
cesdk.ui.setComponentOrder({ in: 'ly.img.dock' }, [
  'ly.img.spacer',
  {
    id: 'ly.img.assetLibrary.dock',
    entries: ['ly.img.image', 'ly.img.text', 'ly.img.shape']
  }
]);
```

## Inspector Bar Components

Components available in `'ly.img.inspector.bar'`. The inspector bar supports edit mode context via the `when` option.

### Block Operations

| ID | Description |
|----|-------------|
| `ly.img.group.create.inspectorBar` | Create group from selection |
| `ly.img.group.ungroup.inspectorBar` | Ungroup selected group |
| `ly.img.combine.inspectorBar` | Boolean shape operations (union, subtract, etc.) |
| `ly.img.position.inspectorBar` | Position and alignment controls |

### Appearance & Effects

| ID | Description |
|----|-------------|
| `ly.img.fill.inspectorBar` | Fill color and type controls |
| `ly.img.stroke.inspectorBar` | Stroke and border controls |
| `ly.img.shadow.inspectorBar` | Drop shadow controls |
| `ly.img.opacityOptions.inspectorBar` | Opacity and blend mode |
| `ly.img.adjustment.inspectorBar` | Color adjustments (brightness, contrast, etc.) |
| `ly.img.filter.inspectorBar` | Photo filters |
| `ly.img.effect.inspectorBar` | Visual effects |
| `ly.img.blur.inspectorBar` | Blur effects |
| `ly.img.animations.inspectorBar` | Animation controls |

### Text Controls

| ID | Description |
|----|-------------|
| `ly.img.text.typeFace.inspectorBar` | Font family selector |
| `ly.img.text.fontSize.inspectorBar` | Font size control |
| `ly.img.text.bold.inspectorBar` | Bold toggle |
| `ly.img.text.italic.inspectorBar` | Italic toggle |
| `ly.img.text.alignHorizontal.inspectorBar` | Text alignment (left, center, right, justify) |
| `ly.img.text.style.inspectorBar` | Text style presets |
| `ly.img.text.advanced.inspectorBar` | Advanced text options (line height, letter spacing, etc.) |
| `ly.img.text.background.inspectorBar` | Text background highlight |

### Media Controls

| ID | Description |
|----|-------------|
| `ly.img.trim.inspectorBar` | Video trim button |
| `ly.img.trimControls.inspectorBar` | Video trim controls (shown in Trim edit mode) |
| `ly.img.crop.inspectorBar` | Image crop button |
| `ly.img.cropControls.inspectorBar` | Image crop controls (shown in Crop edit mode) |
| `ly.img.volume.inspectorBar` | Audio volume control |
| `ly.img.playbackSpeed.inspectorBar` | Video playback speed |
| `ly.img.audio.replace.inspectorBar` | Replace audio source |
| `ly.img.video.caption.inspectorBar` | Video caption controls |

### Shape & Cutout Controls

| ID | Description |
|----|-------------|
| `ly.img.shape.options.inspectorBar` | Shape-specific options |
| `ly.img.cutout.type.inspectorBar` | Cutout type selector |
| `ly.img.cutout.offset.inspectorBar` | Cutout offset control |
| `ly.img.cutout.smoothing.inspectorBar` | Cutout edge smoothing |

### View Controls

| ID | Description |
|----|-------------|
| `ly.img.inspectorToggle.inspectorBar` | Toggle between default and advanced view |

## Canvas Menu Components

Components available in `'ly.img.canvas.menu'`. The canvas menu appears on right-click (desktop) or long-press (mobile) and supports edit mode context.

### Block Actions

| ID | Description |
|----|-------------|
| `ly.img.delete.canvasMenu` | Delete selected block |
| `ly.img.duplicate.canvasMenu` | Duplicate selected block |
| `ly.img.replace.canvasMenu` | Replace block content |
| `ly.img.placeholder.canvasMenu` | Placeholder settings |

### Edit Actions

| ID | Description |
|----|-------------|
| `ly.img.copy.canvasMenu` | Copy to clipboard |
| `ly.img.paste.canvasMenu` | Paste from clipboard |
| `ly.img.flipX.canvasMenu` | Flip horizontally |
| `ly.img.flipY.canvasMenu` | Flip vertically |

### Layer Ordering

| ID | Description |
|----|-------------|
| `ly.img.bringForward.canvasMenu` | Bring forward one layer |
| `ly.img.sendBackward.canvasMenu` | Send backward one layer |

### Page Actions

| ID | Description |
|----|-------------|
| `ly.img.page.moveUp.canvasMenu` | Move page up in page list |
| `ly.img.page.moveDown.canvasMenu` | Move page down in page list |

### Group Actions

| ID | Description |
|----|-------------|
| `ly.img.group.select.canvasMenu` | Select entire group |
| `ly.img.group.enter.canvasMenu` | Enter group to edit children |

### Text Actions

| ID | Description |
|----|-------------|
| `ly.img.text.edit.canvasMenu` | Enter text edit mode |
| `ly.img.text.color.canvasMenu` | Quick text color change |
| `ly.img.text.bold.canvasMenu` | Toggle bold (in Text edit mode) |
| `ly.img.text.italic.canvasMenu` | Toggle italic (in Text edit mode) |
| `ly.img.text.variables.canvasMenu` | Insert variable (in Text edit mode) |

### Other

| ID | Description |
|----|-------------|
| `ly.img.action.canvasMenu` | Generic action (requires `key` property) |
| `ly.img.options.canvasMenu` | Options submenu |

## Canvas Bar Components

Components available in `'ly.img.canvas.bar'`. This area requires the `at` option to specify position (`'top'` or `'bottom'`).

| ID | Description |
|----|-------------|
| `ly.img.settings.canvasBar` | Settings/preferences button |
| `ly.img.page.add.canvasBar` | Add new page button |

The canvas bar is the most minimal area, typically showing contextual controls based on the current edit mode.

```javascript
// Get top canvas bar order
const topBar = cesdk.ui.getComponentOrder({
  in: 'ly.img.canvas.bar',
  at: 'top'
});

// Get bottom canvas bar order
const bottomBar = cesdk.ui.getComponentOrder({
  in: 'ly.img.canvas.bar',
  at: 'bottom'
});
```

## Component Configuration Options

When components are passed as objects instead of string IDs, they support inline configuration.

### Common Properties

All components support these properties:

| Property | Type | Description |
|----------|------|-------------|
| `id` | `string` | Component identifier (required) |
| `key` | `string` | Unique key when same component appears multiple times |
| `disabled` | `boolean` | Disable the component |
| `hidden` | `boolean` | Hide the component |

### Action Button Properties

Components with ID `ly.img.action.*` support additional properties:

| Property | Type | Description |
|----------|------|-------------|
| `label` | `string` | Button label text |
| `icon` | `string` | Icon identifier (e.g., `'@imgly/Download'`) |
| `onClick` | `function` | Click handler function |
| `variant` | `'regular'` | `'accent'` | Button visual style |

### Asset Library Dock Properties

The `ly.img.assetLibrary.dock` component supports:

| Property | Type | Description |
|----------|------|-------------|
| `entries` | `string[]` | Array of asset library entry IDs |
| `label` | `string` | Custom label for the button |

## Troubleshooting

### Component not appearing

1. Verify the component ID is spelled correctly with the right area suffix
2. Check if the component is included in the current area's order using `getComponentOrder()`
3. Confirm the component isn't hidden by a `hidden: true` property

### Multiple components with same ID

Use the `key` property to distinguish between instances:

```javascript
cesdk.ui.setComponentOrder({ in: 'ly.img.navigation.bar' }, [
  { id: 'ly.img.action.navigationBar', key: 'save', label: 'Save' },
  { id: 'ly.img.action.navigationBar', key: 'export', label: 'Export' }
]);
```

### Component disabled unexpectedly

Check if a feature flag is disabling it:

```javascript
// Check if feature is enabled
const enabled = cesdk.feature.isEnabled('ly.img.navigation.bar');

// Re-enable if needed
cesdk.feature.enable('ly.img.navigation.bar');
```

## Next Steps

- [Component Order API](./user-interface/customization/reference/component-order-api.md) — How to manipulate components using these IDs
- [Show/Hide Components](./user-interface/customization/quick-start/show-hide-components.md) — Hide specific components from UI areas
- [Register New Component](./user-interface/ui-extensions/register-new-component.md) — Create custom components with the builder API



---

## More Resources

- **[Angular Documentation Index](https://img.ly/angular.md)** - Browse all Angular documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./angular.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support