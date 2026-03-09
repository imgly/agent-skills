/**
 * Canvas Configuration - Canvas Bar and Context Menu
 *
 * Configure the canvas bar (top/bottom of canvas) and right-click context menu.
 * Different edit modes can have different menu configurations.
 *
 * @see https://img.ly/docs/cesdk/js/user-interface/customization/canvas-632c8e/
 * @see https://img.ly/docs/cesdk/js/user-interface/customization/canvas-menu-0d2b5b/
 */

import type CreativeEditorSDK from '@cesdk/cesdk-js';

/**
 * Configure the canvas bar and context menu.
 *
 * @param cesdk - The CreativeEditorSDK instance to configure
 */
export function setupCanvas(cesdk: CreativeEditorSDK): void {
  // #region Canvas Bar
  // Position: 'top' | 'bottom'

  // cesdk.ui.setComponentOrder(
  //   { in: 'ly.img.canvas.bar', at: 'top' /* or 'bottom' */ },
  //   [
  //     'ly.img.spacer',
  //     'ly.img.page.add.canvasBar',
  //     'ly.img.pageNavigation.canvasBar',
  //     'ly.img.spacer',
  //   ]
  // );
  // #endregion

  // #region Canvas Menu - Transform mode
  // cesdk.ui.setComponentOrder(
  //   { in: 'ly.img.canvas.menu', when: { editMode: 'Transform' } },
  //   [
  //     /* ============================== */
  //     /* Group Navigation               */
  //     /* ============================== */
  //     'ly.img.group.enter.canvasMenu',
  //     'ly.img.group.select.canvasMenu',
  //
  //     /* ============================== */
  //     /* Page Ordering                  */
  //     /* ============================== */
  //     'ly.img.page.moveUp.canvasMenu',
  //     'ly.img.page.moveDown.canvasMenu',
  //     'ly.img.separator',
  //
  //     /* ============================== */
  //     /* Content Editing                */
  //     /* ============================== */
  //     'ly.img.text.edit.canvasMenu',
  //     'ly.img.replace.canvasMenu',
  //
  //     /* ============================== */
  //     /* Layer Ordering                 */
  //     /* ============================== */
  //     'ly.img.bringForward.canvasMenu',
  //     'ly.img.sendBackward.canvasMenu',
  //     'ly.img.bringToFront.canvasMenu',
  //     'ly.img.sendToBack.canvasMenu',
  //     'ly.img.separator',
  //
  //     /* ============================== */
  //     /* Common Operations              */
  //     /* ============================== */
  //     'ly.img.duplicate.canvasMenu',
  //     'ly.img.delete.canvasMenu',
  //     'ly.img.options.canvasMenu',
  //   ]
  // );
  // #endregion

  // #region Canvas Menu - Text mode
  // cesdk.ui.setComponentOrder(
  //   { in: 'ly.img.canvas.menu', when: { editMode: 'Text' } },
  //   [
  //     'ly.img.text.color.canvasMenu',
  //     'ly.img.separator',
  //     'ly.img.text.bold.canvasMenu',
  //     'ly.img.text.italic.canvasMenu',
  //     'ly.img.separator',
  //     'ly.img.text.variables.canvasMenu',
  //   ]
  // );
  // #endregion

  // #region Canvas Menu - Crop mode
  // cesdk.ui.setComponentOrder(
  //   { in: 'ly.img.canvas.menu', when: { editMode: 'Crop' } },
  //   [
  //     /* Crop-specific operations (most controls in inspector bar) */
  //   ]
  // );
  // #endregion

  // #region Canvas Menu - Trim mode
  // cesdk.ui.setComponentOrder(
  //   { in: 'ly.img.canvas.menu', when: { editMode: 'Trim' } },
  //   [
  //     /* Trim-specific operations (most controls in inspector bar) */
  //   ]
  // );
  // #endregion

  // Suppress unused variable warning (remove when uncommenting code above)
  void cesdk;
}
