/**
 * Feature Configuration - Enable/Disable Photo Editing Capabilities
 *
 * This file configures which features are available in the photo editor.
 * Features control the visibility and availability of UI elements and functionality.
 *
 * ## Feature System Overview
 *
 * - `cesdk.feature.enable(features)` - Enable features with default predicates
 * - `cesdk.feature.disable(features)` - Disable features completely
 * - `cesdk.feature.set(feature, predicate)` - Set custom predicate for conditional availability
 *
 * ## Glob Pattern Support
 *
 * Use glob patterns to enable/disable entire feature groups:
 * - `'ly.img.text.*'` - All text features
 * - `'ly.img.crop.*'` - All crop features
 * - `'ly.img.filter.*'` - All filter features
 *
 * @see https://img.ly/docs/cesdk/js/user-interface/customization/disable-or-enable-f058e2/
 */

import type CreativeEditorSDK from '@cesdk/cesdk-js';
import type { CreativeEngine } from '@cesdk/cesdk-js';

/**
 * Configure which features are enabled in the photo editor.
 *
 * Features are organized by category for easy customization.
 * Optimized for single-image photo editing.
 *
 * @param cesdk - The CreativeEditorSDK instance to configure
 */
export function setupFeatures(cesdk: CreativeEditorSDK) {
  cesdk.feature.enable([
    // ============================================================================
    // NAVIGATION FEATURES
    // Configure the top navigation bar visibility and controls
    // ============================================================================

    // #region Navigation Features
    'ly.img.navigation.bar' /* Navigation Bar visibility */,
    'ly.img.navigation.back' /* "Back" button */,
    'ly.img.navigation.close' /* "Close" button */,
    'ly.img.navigation.undoRedo' /* "Undo" and "Redo" buttons */,
    'ly.img.navigation.zoom' /* Zoom controls */,
    'ly.img.navigation.actions' /* Actions dropdown */,
    // #endregion

    // ============================================================================
    // TEXT FEATURES
    // Configure text overlay editing capabilities
    // ============================================================================

    // #region Text Features
    'ly.img.text.edit' /* Edit button in Canvas Menu */,
    'ly.img.text.typeface' /* Typeface dropdown */,
    'ly.img.text.fontSize' /* Font Size input */,
    'ly.img.text.fontStyle' /* Bold and Italic toggles */,
    'ly.img.text.alignment' /* Text Horizontal Alignment */,
    'ly.img.text.advanced' /* Advanced text controls */,
    'ly.img.text.background' /* Text background controls */,
    // #endregion

    // ============================================================================
    // CROP FEATURES
    // Configure image cropping capabilities (core photo editing feature)
    // ============================================================================

    // #region Crop Features
    'ly.img.crop' /* Crop button */,
    'ly.img.crop.size' /* Crop size controls */,
    'ly.img.crop.rotation' /* Crop rotation controls */,
    'ly.img.crop.flip' /* Crop flip controls */,
    'ly.img.crop.fillMode' /* Crop fill mode controls */,
    'ly.img.crop.scale' /* Crop scale controls */,
    'ly.img.crop.position' /* Crop position controls */,
    'ly.img.crop.panel.autoOpen' /* Auto-open crop panel on crop mode */,
    // #endregion

    // ============================================================================
    // EFFECTS FEATURES
    // Configure image enhancement and adjustment tools
    // ============================================================================

    // #region Effects Features
    'ly.img.filter' /* Filter button */,
    'ly.img.adjustment' /* Adjustments button (brightness, contrast, etc.) */,
    'ly.img.effect' /* Effect button */,
    'ly.img.blur' /* Blur button */,
    'ly.img.shadow' /* Shadow button */,
    // #endregion

    // ============================================================================
    // GENERAL EDITING FEATURES
    // Configure common editing operations
    // ============================================================================

    // #region General Editing Features
    'ly.img.delete' /* Delete button and keyboard shortcut */,
    'ly.img.duplicate' /* Duplicate button and copy/paste */,
    'ly.img.group' /* Group and Ungroup buttons */,
    'ly.img.replace' /* Replace button in Canvas Menu and Fill Panel */,
    'ly.img.replace.fill' /* Replace image/video fill content */,
    'ly.img.replace.shape' /* Replace block shape */,
    'ly.img.replace.audio' /* Replace audio block content */,
    // #endregion

    // ============================================================================
    // STYLING FEATURES
    // Configure appearance options for overlays (text, shapes, stickers)
    // ============================================================================

    // #region Styling Features
    'ly.img.fill' /* Fill button and Fill Panel */,
    'ly.img.opacity' /* Opacity controls */,
    'ly.img.blendMode' /* Blend mode controls */,
    'ly.img.shape.options' /* Shape Options dropdown */,
    'ly.img.combine' /* Combine dropdown (shapes/cutouts) */,
    'ly.img.position' /* Position dropdown */,
    'ly.img.options' /* Options dropdown */,
    // #endregion

    // ============================================================================
    // NOTIFICATION FEATURES
    // Configure user feedback notifications
    // ============================================================================

    // #region Notification Features
    'ly.img.notifications' /* Global notifications visibility */,
    'ly.img.notifications.undo' /* Undo notifications */,
    'ly.img.notifications.redo' /* Redo notifications */,
    // #endregion

    // ============================================================================
    // DOCK AND LIBRARY FEATURES
    // Configure the asset dock and library panels
    // ============================================================================

    // #region Dock and Library Features
    'ly.img.dock' /* Dock visibility */,
    'ly.img.library.panel' /* Asset Library panel */
    // #endregion

    // ============================================================================
    // PLACEHOLDER FEATURES
    // Uncomment to enable template placeholder functionality
    // ============================================================================

    // #region Placeholder Features
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
    // #endregion

    // ============================================================================
    // VIDEO FEATURES
    // Uncomment to enable video editing functionality (not typical for photo editor)
    // ============================================================================

    // #region Video Features
    // 'ly.img.video.timeline', /* Video Timeline visibility */
    // 'ly.img.video.clips', /* Clips track in timeline */
    // 'ly.img.video.overlays', /* Overlays track in timeline */
    // 'ly.img.video.audio', /* Audio track in timeline */
    // 'ly.img.video.addClip', /* Add clips to timeline */
    // 'ly.img.video.controls', /* Base video control UI */
    // 'ly.img.video.controls.toggle', /* Timeline collapse/expand toggle */
    // 'ly.img.video.controls.background', /* Background color controls */
    // 'ly.img.video.controls.playback', /* Play/pause and timestamp */
    // 'ly.img.video.controls.loop', /* Loop toggle */
    // 'ly.img.video.controls.split', /* Split clip control */
    // 'ly.img.video.controls.timelineZoom', /* Timeline zoom controls */
    // 'ly.img.video.caption', /* Video captions */
    // 'ly.img.playbackSpeed', /* Playback speed control */
    // 'ly.img.animations', /* Animations button */
    // #endregion

    // ============================================================================
    // DEVELOPMENT FEATURES
    // Uncomment for development and debugging
    // ============================================================================

    // #region Development Features
    // 'ly.img.settings', /* Quick settings menu for development */
    // #endregion
  ]);

  // ============================================================================
  // CUSTOM FEATURE PREDICATES
  // Configure conditional availability for specific features
  // ============================================================================

  // #region Custom Feature Predicates

  /**
   * Stroke feature - Only available for overlays (not page background).
   * In photo editing, strokes apply to text, shapes, and stickers, not the main image.
   */
  cesdk.feature.set(
    'ly.img.stroke',
    ({ engine }: { engine: CreativeEngine }) => {
      const selectedBlocks = engine.block.findAllSelected();
      return !selectedBlocks.some(
        (id) => engine.block.getType(id) === '//ly.img.ubq/page'
      );
    }
  );

  /**
   * Canvas menu - Only show for overlays (not page background).
   * Prevents right-click menu on the main photo page.
   */
  cesdk.feature.set(
    'ly.img.canvas.menu',
    ({ engine }: { engine: CreativeEngine }) => {
      const selectedBlocks = engine.block.findAllSelected();
      return !selectedBlocks.some(
        (id) => engine.block.getType(id) === '//ly.img.ubq/page'
      );
    }
  );

  /**
   * Inspector bar - Only show for overlays (not page background).
   * Prevents inspector toolbar from showing when page is selected.
   */
  cesdk.feature.set(
    'ly.img.inspector.bar',
    ({ engine }: { engine: CreativeEngine }) => {
      const selectedBlocks = engine.block.findAllSelected();
      return !selectedBlocks.some(
        (id) => engine.block.getType(id) === '//ly.img.ubq/page'
      );
    }
  );

  // #endregion
}
