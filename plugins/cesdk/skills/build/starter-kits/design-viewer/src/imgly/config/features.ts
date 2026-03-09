/**
 * Feature Configuration - Enable/Disable Editor Capabilities
 *
 * This file configures which features are available in your custom editor.
 * Uncomment features you want to enable, or use glob patterns like 'ly.img.text.*'.
 *
 * @see https://img.ly/docs/cesdk/js/user-interface/customization/disable-or-enable-f058e2/
 */

import type CreativeEditorSDK from '@cesdk/cesdk-js';

/**
 * Configure which features are enabled in the viewer.
 *
 * @param cesdk - The CreativeEditorSDK instance to configure
 */
export function setupFeatures(cesdk: CreativeEditorSDK): void {
  // Enable features by uncommenting lines below.
  // Use glob patterns (e.g., 'ly.img.text.*') to enable entire feature groups.

  // #region Feature List
  cesdk.feature.enable([
    /* ============================== */
    /* Navigation                     */
    /* ============================== */
    'ly.img.navigation.bar' /* Navigation Bar visibility */,
    // 'ly.img.navigation.back', /* "Back" button */
    // 'ly.img.navigation.close', /* "Close" button */
    // 'ly.img.navigation.undoRedo', /* "Undo" and "Redo" buttons */
    'ly.img.navigation.zoom' /* Zoom controls */
    // 'ly.img.navigation.actions', /* Actions dropdown */
    // 'ly.img.navigation.*', /* All navigation features */

    /* ============================== */
    /* General Editing                */
    /* ============================== */
    // 'ly.img.delete', /* Delete button and keyboard shortcut */
    // 'ly.img.duplicate', /* Duplicate button and copy/paste */
    // 'ly.img.group', /* Group and Ungroup buttons */
    // 'ly.img.replace', /* Replace button in Canvas Menu and Fill Panel */
    // 'ly.img.options', /* Options button (...) in Inspector Bar */

    /* ============================== */
    /* Page Management                */
    /* ============================== */
    // 'ly.img.page.move', /* Move Up/Down/Left/Right buttons */
    // 'ly.img.page.add', /* Add Page button in Canvas Bar */
    // 'ly.img.page.resize', /* Resize button and page formats */

    /* ============================== */
    /* Text                           */
    /* ============================== */
    // 'ly.img.text.edit', /* Edit button in Canvas Menu */
    // 'ly.img.text.typeface', /* Typeface dropdown */
    // 'ly.img.text.fontSize', /* Font Size input */
    // 'ly.img.text.fontStyle', /* Bold and Italic toggles */
    // 'ly.img.text.alignment', /* Text Horizontal Alignment */
    // 'ly.img.text.advanced', /* Advanced text controls */
    // 'ly.img.text.background', /* Text background controls */
    // 'ly.img.text.*', /* All text features */

    /* ============================== */
    /* Effects                        */
    /* ============================== */
    // 'ly.img.adjustment', /* Adjustments button */
    // 'ly.img.filter', /* Filter button */
    // 'ly.img.effect', /* Effect button */
    // 'ly.img.blur', /* Blur button */
    // 'ly.img.shadow', /* Shadow button */
    // 'ly.img.cutout', /* Cutout controls */

    /* ============================== */
    /* Styling                        */
    /* ============================== */
    // 'ly.img.fill', /* Fill button and Fill Panel */
    // 'ly.img.stroke', /* Stroke controls (Color, Width) */
    // 'ly.img.opacity', /* Opacity controls */
    // 'ly.img.blendMode', /* Blend mode controls */
    // 'ly.img.shape.options', /* Shape Options dropdown */
    // 'ly.img.combine', /* Combine dropdown (shapes/cutouts) */
    // 'ly.img.position', /* Position dropdown */

    /* ============================== */
    /* Transform                      */
    /* ============================== */
    // 'ly.img.transform.position', /* X and Y position controls */
    // 'ly.img.transform.size', /* Width and height controls */
    // 'ly.img.transform.rotation', /* Rotation controls */
    // 'ly.img.transform.flip', /* Flip controls */
    // 'ly.img.transform.*', /* All transform features */

    /* ============================== */
    /* Crop                           */
    /* ============================== */
    // 'ly.img.crop', /* Crop button */
    // 'ly.img.crop.size', /* Crop size controls */
    // 'ly.img.crop.rotation', /* Crop rotation controls */
    // 'ly.img.crop.flip', /* Crop flip controls */
    // 'ly.img.crop.fillMode', /* Crop fill mode controls */
    // 'ly.img.crop.scale', /* Crop scale controls */
    // 'ly.img.crop.position', /* Crop position controls */
    // 'ly.img.crop.panel.autoOpen', /* Auto-open crop panel on crop mode */
    // 'ly.img.crop.*', /* All crop features */

    /* ============================== */
    /* Video                          */
    /* ============================== */
    // 'ly.img.video.timeline', /* Video Timeline visibility */
    // 'ly.img.video.clips', /* Clips track in timeline */
    // 'ly.img.video.overlays', /* Overlays track in timeline */
    // 'ly.img.video.audio', /* Audio track in timeline */
    // 'ly.img.video.addClip', /* Add clips to timeline */
    // 'ly.img.video.caption', /* Video captions */
    // 'ly.img.video.controls', /* Base video control UI */
    // 'ly.img.video.controls.toggle', /* Timeline collapse/expand toggle */
    // 'ly.img.video.controls.background', /* Background color controls */
    // 'ly.img.video.controls.playback', /* Play/pause and timestamp */
    // 'ly.img.video.controls.loop', /* Loop toggle */
    // 'ly.img.video.controls.split', /* Split clip control */
    // 'ly.img.video.controls.timelineZoom', /* Timeline zoom controls */
    // 'ly.img.video.*', /* All video features */

    /* ============================== */
    /* Media Controls                 */
    /* ============================== */
    // 'ly.img.audio.replace', /* Replace audio */
    // 'ly.img.volume', /* Volume control (video mode) */
    // 'ly.img.playbackSpeed', /* Playback speed control */
    // 'ly.img.animations', /* Animations button (video mode) */
    // 'ly.img.trim', /* Trim button (video mode) */

    /* ============================== */
    /* Inspector                      */
    /* ============================== */
    // 'ly.img.inspector.bar', /* Inspector Bar visibility */
    // 'ly.img.inspector.panel', /* Advanced Inspector panel */
    // 'ly.img.inspector.toggle', /* Inspector Toggle button */

    /* ============================== */
    /* Canvas                         */
    /* ============================== */
    // 'ly.img.canvas.bar', /* Canvas Bar visibility */
    // 'ly.img.canvas.menu', /* Canvas Menu visibility */

    /* ============================== */
    /* Panels                         */
    /* ============================== */
    // 'ly.img.dock', /* Dock visibility */
    // 'ly.img.library.panel', /* Asset Library panel */
    // 'ly.img.settings', /* Settings panel */

    /* ============================== */
    /* Notifications                  */
    /* ============================== */
    // 'ly.img.notifications', /* Global notifications visibility */
    // 'ly.img.notifications.undo', /* Undo notifications */
    // 'ly.img.notifications.redo', /* Redo notifications */

    /* ============================== */
    /* Placeholder                    */
    /* ============================== */
    // 'ly.img.placeholder', /* Placeholder button in Canvas Menu */
    // 'ly.img.placeholder.general', /* General section (opacity, blend, etc.) */
    // 'ly.img.placeholder.general.opacity', /* Opacity option */
    // 'ly.img.placeholder.general.blendMode', /* Blend Mode option */
    // 'ly.img.placeholder.general.duplicate', /* Duplicate option */
    // 'ly.img.placeholder.general.delete', /* Delete option */
    // 'ly.img.placeholder.arrange', /* Arrange section */
    // 'ly.img.placeholder.arrange.move', /* Move option */
    // 'ly.img.placeholder.arrange.resize', /* Resize option */
    // 'ly.img.placeholder.arrange.rotate', /* Rotate option */
    // 'ly.img.placeholder.arrange.flip', /* Flip option */
    // 'ly.img.placeholder.audio', /* Audio section */
    // 'ly.img.placeholder.audio.change', /* Replace Audio option */
    // 'ly.img.placeholder.fill', /* Fill section */
    // 'ly.img.placeholder.fill.change', /* Change Fill option */
    // 'ly.img.placeholder.fill.changeType', /* Change Fill Type option */
    // 'ly.img.placeholder.fill.actAsPlaceholder', /* Act as Placeholder option */
    // 'ly.img.placeholder.fill.crop', /* Crop option */
    // 'ly.img.placeholder.shape', /* Shape section */
    // 'ly.img.placeholder.shape.change', /* Change Shape option */
    // 'ly.img.placeholder.stroke', /* Stroke section */
    // 'ly.img.placeholder.stroke.change', /* Change Stroke option */
    // 'ly.img.placeholder.text', /* Text section */
    // 'ly.img.placeholder.text.edit', /* Edit Text option */
    // 'ly.img.placeholder.text.actAsPlaceholder', /* Act as Placeholder option */
    // 'ly.img.placeholder.text.character', /* Character option */
    // 'ly.img.placeholder.appearance', /* Appearance section */
    // 'ly.img.placeholder.appearance.adjustments', /* Adjustments option */
    // 'ly.img.placeholder.appearance.filter', /* Filter option */
    // 'ly.img.placeholder.appearance.effect', /* Effect option */
    // 'ly.img.placeholder.appearance.blur', /* Blur option */
    // 'ly.img.placeholder.appearance.shadow', /* Shadow option */
    // 'ly.img.placeholder.appearance.animations', /* Animations option */
    // 'ly.img.preview', /* Preview button (Creator role only) */
    // 'ly.img.placeholder.*', /* All placeholder features */
  ]);
  // #endregion

  // #region Conditional Features (Advanced)
  // Use predicates for dynamic feature availability

  // Example: Disable delete/duplicate for blocks with a custom "avatar" kind
  // cesdk.feature.set('ly.img.delete', ({ engine, isPreviousEnable }) => {
  //   const selectedBlock = engine.block.findAllSelected()[0];
  //   if (!selectedBlock) return isPreviousEnable();
  //   const kind = engine.block.getKind(selectedBlock);
  //   return kind === 'avatar' ? false : isPreviousEnable();
  // });
  // #endregion
}
