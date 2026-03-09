/**
 * Inspector Bar Configuration - Contextual Toolbar for Selected Elements
 *
 * Configure the inspector bar that appears above selected blocks.
 * Different edit modes show different controls.
 *
 * @see https://img.ly/docs/cesdk/js/user-interface/customization/inspector-bar-8ca1cd/
 */

import type CreativeEditorSDK from '@cesdk/cesdk-js';

/**
 * Configure the inspector bar layout for different edit modes.
 *
 * @param cesdk - The CreativeEditorSDK instance to configure
 */
export function setupInspectorBar(cesdk: CreativeEditorSDK): void {
  // #region Inspector Bar Order
  // Edit modes: 'Transform' | 'Text' | 'Crop' | 'Trim'

  // cesdk.ui.setComponentOrder(
  //   { in: 'ly.img.inspector.bar', when: { editMode: 'Transform' } }, /* or 'Text', 'Crop', 'Trim' */
  //   [
  //     'ly.img.spacer',
  //
  //     /* ============================== */
  //     /* Media Controls                 */
  //     /* ============================== */
  //     'ly.img.video.caption.inspectorBar',
  //     'ly.img.audio.replace.inspectorBar',
  //
  //     /* ============================== */
  //     /* Shape Controls                 */
  //     /* ============================== */
  //     'ly.img.shape.options.inspectorBar',
  //     'ly.img.cutout.type.inspectorBar',
  //     'ly.img.cutout.offset.inspectorBar',
  //     'ly.img.cutout.smoothing.inspectorBar',
  //
  //     /* ============================== */
  //     /* Group Management               */
  //     /* ============================== */
  //     'ly.img.group.create.inspectorBar',
  //     'ly.img.group.ungroup.inspectorBar',
  //     'ly.img.combine.inspectorBar',
  //     'ly.img.separator',
  //
  //     /* ============================== */
  //     /* Text Formatting                */
  //     /* ============================== */
  //     'ly.img.text.typeFace.inspectorBar',
  //     'ly.img.text.style.inspectorBar',
  //     'ly.img.text.bold.inspectorBar',
  //     'ly.img.text.italic.inspectorBar',
  //     'ly.img.text.fontSize.inspectorBar',
  //     'ly.img.text.alignHorizontal.inspectorBar',
  //     'ly.img.text.advanced.inspectorBar',
  //     'ly.img.separator',
  //
  //     /* ============================== */
  //     /* Appearance                     */
  //     /* ============================== */
  //     'ly.img.fill.inspectorBar',
  //     'ly.img.stroke.inspectorBar',
  //     'ly.img.text.background.inspectorBar',
  //     'ly.img.separator',
  //
  //     /* ============================== */
  //     /* Media                          */
  //     /* ============================== */
  //     'ly.img.trim.inspectorBar',
  //     'ly.img.volume.inspectorBar',
  //     'ly.img.playbackSpeed.inspectorBar',
  //     'ly.img.crop.inspectorBar',
  //     'ly.img.separator',
  //
  //     /* ============================== */
  //     /* Effects                        */
  //     /* ============================== */
  //     {
  //       id: 'ly.img.appearance.inspectorBar',
  //       children: [
  //         'ly.img.adjustment.inspectorBar',
  //         'ly.img.filter.inspectorBar',
  //         'ly.img.effect.inspectorBar',
  //         'ly.img.blur.inspectorBar'
  //       ]
  //     },
  //     'ly.img.separator',
  //     'ly.img.shadow.inspectorBar',
  //     'ly.img.separator',
  //
  //     /* ============================== */
  //     /* Properties                     */
  //     /* ============================== */
  //     'ly.img.opacityOptions.inspectorBar',
  //     'ly.img.position.inspectorBar',
  //
  //     'ly.img.spacer',
  //     'ly.img.inspectorToggle.inspectorBar',
  //   ]
  // );
  //
  // /* Trim mode: ['ly.img.spacer', 'ly.img.trimControls.inspectorBar', 'ly.img.spacer'] */
  // /* Crop mode: ['ly.img.spacer', 'ly.img.cropControls.inspectorBar', 'ly.img.spacer'] */
  // #endregion

  // Suppress unused variable warning (remove when uncommenting code above)
  void cesdk;
}
