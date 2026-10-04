/**
 * Dock Configuration - Left Side Photo Tools and Asset Panel
 *
 * Configure the dock to control which photo editing tools and asset libraries appear.
 *
 * ## `'ly.img.assetLibrary.dock'`
 *
 * A pre-defined component that opens a panel with asset libraries.
 *
 * - `id` - Component ID (e.g., `'ly.img.assetLibrary.dock'`)
 * - `key` - Unique identifier for this entry
 * - `label` - Translation key for the button label
 * - `icon` - Icon name (e.g., `'@imgly/Text'`, `'@imgly/Sticker'`)
 * - `entries` - Array of asset source IDs to display
 * - `onClick` - Custom click handler (overrides default behavior)
 * - `isSelected` - Boolean or function to control selected state
 * - `isDisabled` - Boolean or function to control disabled state
 * - `tooltip` - Text or translation key, or a function returning one, for the button tooltip
 * - `size` - Button size: `'normal'` | `'large'`
 * - `variant` - Button variant: `'regular'` | `'plain'`
 * - `color` - Button color: `'accent'` | `'danger'`
 *
 * @see https://img.ly/docs/cesdk/js/user-interface/customization/dock-cb916c/
 * @see https://img.ly/docs/cesdk/js/user-interface/appearance/icons-679e32/
 */

import type CreativeEditorSDK from '@cesdk/cesdk-js';

/**
 * Configure the dock panel layout for photo editing.
 *
 * @param cesdk - The CreativeEditorSDK instance to configure
 */
export function setupDock(cesdk: CreativeEditorSDK): void {
  // ============================================================================
  // DOCK APPEARANCE SETTINGS
  // Configure how the dock looks
  // ============================================================================

  // #region Dock Appearance
  // Show text labels under dock icons
  cesdk.engine.editor.setSetting('dock/hideLabels', false);

  // Icon size: 'normal' or 'large'
  cesdk.engine.editor.setSetting('dock/iconSize', 'large');
  // #endregion

  // ============================================================================
  // DOCK ORDER
  // Configure photo editing tools and asset libraries
  // ============================================================================

  // Adjust, Filter and Effects edit the page's image, so a page with a color
  // or gradient fill disables them.
  const pageHasNoImage = () => {
    const { engine } = cesdk;
    const page = engine.scene.getCurrentPage();
    if (page == null || !engine.block.supportsFill(page)) return true;
    const fill = engine.block.getFill(page);
    if (!engine.block.isValid(fill)) return true;
    const fillType = engine.block.getType(fill);
    return (
      fillType !== '//ly.img.ubq/fill/image' &&
      fillType !== '//ly.img.ubq/fill/video'
    );
  };

  // #region Register Custom Dock Components
  // Photo tools need custom components since they open inspector panels, not asset libraries

  cesdk.ui.registerComponent('ly.img.crop.dock', ({ builder: { Button } }) => {
    const isCropMode = cesdk.engine.editor.getEditMode() === 'Crop';
    Button('crop-button', {
      label: 'ly.img.crop.dock.label',
      icon: '@imgly/Crop',
      isSelected: isCropMode,
      onClick: () => {
        const page = cesdk.engine.scene.getCurrentPage();
        if (page == null) return;

        if (isCropMode) {
          cesdk.engine.editor.setEditMode('Transform');
        } else {
          cesdk.ui.closePanel('*');
          cesdk.engine.block.select(page);
          cesdk.engine.editor.setEditMode('Crop');
        }
      }
    });
  });

  cesdk.ui.registerComponent(
    'ly.img.adjustment.dock',
    ({ builder: { Button } }) => {
      const panelId = '//ly.img.panel/inspector/adjustments';
      const isOpen = cesdk.ui.isPanelOpen(panelId);
      const noImage = pageHasNoImage();
      Button('adjustment-button', {
        label: 'ly.img.adjustment.dock.label',
        icon: '@imgly/Adjustments',
        isDisabled: noImage,
        tooltip: noImage ? 'photoEditor.dock.requiresImage' : undefined,
        isSelected: isOpen,
        onClick: () => {
          if (isOpen) {
            cesdk.ui.closePanel(panelId);
            return;
          }
          const page = cesdk.engine.scene.getCurrentPage();
          if (page == null) return;
          cesdk.ui.closePanel('*');
          cesdk.engine.editor.setEditMode('Transform');
          cesdk.engine.block.select(page);
          cesdk.ui.openPanel(panelId, { floating: true });
        }
      });
    }
  );

  cesdk.ui.registerComponent(
    'ly.img.filter.dock',
    ({ builder: { Button } }) => {
      const panelId = '//ly.img.panel/inspector/filters';
      const isOpen = cesdk.ui.isPanelOpen(panelId);
      const noImage = pageHasNoImage();
      Button('filter-button', {
        label: 'ly.img.filter.dock.label',
        icon: '@imgly/Filter',
        isDisabled: noImage,
        tooltip: noImage ? 'photoEditor.dock.requiresImage' : undefined,
        isSelected: isOpen,
        onClick: () => {
          if (isOpen) {
            cesdk.ui.closePanel(panelId);
            return;
          }
          const page = cesdk.engine.scene.getCurrentPage();
          if (page == null) return;
          cesdk.ui.closePanel('*');
          cesdk.engine.editor.setEditMode('Transform');
          cesdk.engine.block.select(page);
          cesdk.ui.openPanel(panelId, { floating: true });
        }
      });
    }
  );

  cesdk.ui.registerComponent(
    'ly.img.effects.dock',
    ({ builder: { Button } }) => {
      const panelId = '//ly.img.panel/inspector/effects';
      const isOpen = cesdk.ui.isPanelOpen(panelId);
      const noImage = pageHasNoImage();
      Button('effects-button', {
        label: 'ly.img.effects.dock.label',
        icon: '@imgly/Effects',
        isDisabled: noImage,
        tooltip: noImage ? 'photoEditor.dock.requiresImage' : undefined,
        isSelected: isOpen,
        onClick: () => {
          if (isOpen) {
            cesdk.ui.closePanel(panelId);
            return;
          }
          const page = cesdk.engine.scene.getCurrentPage();
          if (page == null) return;
          cesdk.ui.closePanel('*');
          cesdk.engine.editor.setEditMode('Transform');
          cesdk.engine.block.select(page);
          cesdk.ui.openPanel(panelId, { floating: true });
        }
      });
    }
  );
  // #endregion

  // #region Dock Order
  cesdk.ui.setComponentOrder({ in: 'ly.img.dock' }, [
    'ly.img.spacer',

    // Photo Editing Tools (custom components)
    'ly.img.crop.dock',
    'ly.img.adjustment.dock',
    'ly.img.filter.dock',
    'ly.img.effects.dock',

    'ly.img.separator',

    // Asset Libraries
    {
      id: 'ly.img.assetLibrary.dock',
      key: 'ly.img.text',
      icon: '@imgly/Text',
      label: 'libraries.ly.img.text.label',
      entries: ['ly.img.text']
    },
    {
      id: 'ly.img.assetLibrary.dock',
      key: 'ly.img.vector.shape',
      icon: '@imgly/Shapes',
      label: 'libraries.ly.img.vector.shape.label',
      entries: ['ly.img.vector.shape']
    },
    {
      id: 'ly.img.assetLibrary.dock',
      key: 'ly.img.sticker',
      icon: '@imgly/Sticker',
      label: 'libraries.ly.img.sticker.label',
      entries: ['ly.img.sticker']
    },

    'ly.img.spacer'
  ]);
  // #endregion
}
