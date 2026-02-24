/**
 * Feature Configuration - Enable/Disable Playback Capabilities
 *
 * This file configures which features are available in the player editor.
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
 * - `'ly.img.video.*'` - All video features
 * - `'ly.img.video.controls.*'` - All video control features
 * - `'ly.img.navigation.*'` - All navigation features
 *
 * ## Player Features Philosophy
 *
 * The player config enables ONLY playback-related features:
 * - Video timeline and playback controls (play/pause, loop)
 * - Basic navigation (back/close buttons)
 * - NO editing features (no text, crop, effects, etc.)
 * - NO asset library or content addition
 * - NO inspector or editing controls
 *
 * @see https://img.ly/docs/cesdk/js/user-interface/customization/disable-or-enable-f058e2/
 */

import type CreativeEditorSDK from '@cesdk/cesdk-js';

/**
 * Configure which features are enabled in the player editor.
 *
 * Only playback and viewing features are enabled to provide a clean,
 * distraction-free viewing experience. All editing capabilities are
 * disabled by being commented out or omitted.
 *
 * @param cesdk - The CreativeEditorSDK instance to configure
 */
export function setupFeatures(cesdk: CreativeEditorSDK): void {
  cesdk.feature.enable([
    // ============================================================================
    // NAVIGATION FEATURES (DISABLED)
    // All navigation controls are disabled for player mode
    // ============================================================================

    // #region Navigation Features (Disabled)
    // 'ly.img.navigation.bar' /* Navigation Bar visibility */,
    // 'ly.img.navigation.back' /* "Back" button */,
    // 'ly.img.navigation.close' /* "Close" button */,
    // 'ly.img.navigation.undoRedo' /* "Undo" and "Redo" buttons */,
    // 'ly.img.navigation.zoom' /* Zoom controls */,
    // 'ly.img.navigation.actions' /* Actions dropdown */,
    // #endregion

    // ============================================================================
    // TEXT FEATURES (DISABLED)
    // All text editing features are disabled in player mode
    // ============================================================================

    // #region Text Features (Disabled)
    // 'ly.img.text.edit' /* Edit button in Canvas Menu */,
    // 'ly.img.text.typeface' /* Typeface dropdown */,
    // 'ly.img.text.fontSize' /* Font Size input */,
    // 'ly.img.text.fontStyle' /* Bold and Italic toggles */,
    // 'ly.img.text.alignment' /* Text Horizontal Alignment */,
    // 'ly.img.text.advanced' /* Advanced text controls */,
    // 'ly.img.text.background' /* Text background controls */,
    // #endregion

    // ============================================================================
    // CROP FEATURES (DISABLED)
    // All cropping features are disabled in player mode
    // ============================================================================

    // #region Crop Features (Disabled)
    // 'ly.img.crop' /* Crop button */,
    // 'ly.img.crop.size' /* Crop size controls */,
    // 'ly.img.crop.rotation' /* Crop rotation controls */,
    // 'ly.img.crop.flip' /* Crop flip controls */,
    // 'ly.img.crop.fillMode' /* Crop fill mode controls */,
    // 'ly.img.crop.scale' /* Crop scale controls */,
    // 'ly.img.crop.position' /* Crop position controls */,
    // 'ly.img.crop.panel.autoOpen' /* Auto-open crop panel on crop mode */,
    // #endregion

    // ============================================================================
    // TRANSFORM FEATURES (DISABLED)
    // All transform controls are disabled in player mode
    // ============================================================================

    // #region Transform Features (Disabled)
    // 'ly.img.transform.position' /* X and Y position controls */,
    // 'ly.img.transform.size' /* Width and height controls */,
    // 'ly.img.transform.rotation' /* Rotation controls */,
    // 'ly.img.transform.flip' /* Flip controls */,
    // #endregion

    // ============================================================================
    // EFFECTS FEATURES (DISABLED)
    // All visual effects are disabled in player mode
    // ============================================================================

    // #region Effects Features (Disabled)
    // 'ly.img.filter' /* Filter button */,
    // 'ly.img.adjustment' /* Adjustments button */,
    // 'ly.img.effect' /* Effect button */,
    // 'ly.img.blur' /* Blur button */,
    // 'ly.img.shadow' /* Shadow button */,
    // 'ly.img.cutout' /* Cutout controls */,
    // #endregion

    // ============================================================================
    // CANVAS FEATURES (DISABLED)
    // Canvas bar and context menu are disabled in player mode
    // ============================================================================

    // #region Canvas Features (Disabled)
    // 'ly.img.canvas.bar' /* Canvas Bar visibility */,
    // 'ly.img.canvas.menu' /* Canvas Menu visibility */,
    // #endregion

    // ============================================================================
    // INSPECTOR FEATURES (DISABLED)
    // All inspector controls are disabled in player mode
    // ============================================================================

    // #region Inspector Features (Disabled)
    // 'ly.img.inspector' /* Inspector visibility */,
    // 'ly.img.inspector.bar' /* Inspector Bar visibility */,
    // 'ly.img.inspector.toggle' /* Inspector Toggle button */,
    // #endregion

    // ============================================================================
    // GENERAL EDITING FEATURES (DISABLED)
    // All editing operations are disabled in player mode
    // ============================================================================

    // #region General Editing Features (Disabled)
    // 'ly.img.delete' /* Delete button and keyboard shortcut */,
    // 'ly.img.duplicate' /* Duplicate button and copy/paste */,
    // 'ly.img.group' /* Group and Ungroup buttons */,
    // 'ly.img.replace' /* Replace button in Canvas Menu and Fill Panel */,
    // #endregion

    // ============================================================================
    // PAGE FEATURES (DISABLED)
    // All page management features are disabled in player mode
    // ============================================================================

    // #region Page Features (Disabled)
    // 'ly.img.page.move' /* Move Up/Down/Left/Right buttons */,
    // 'ly.img.page.add' /* Add Page button in Canvas Bar */,
    // 'ly.img.page.resize' /* Resize button and page formats */,
    // #endregion

    // ============================================================================
    // STYLING FEATURES (DISABLED)
    // All styling controls are disabled in player mode
    // ============================================================================

    // #region Styling Features (Disabled)
    // 'ly.img.fill' /* Fill button and Fill Panel */,
    // 'ly.img.stroke' /* Stroke controls (Color, Width) */,
    // 'ly.img.opacity' /* Opacity controls */,
    // 'ly.img.blendMode' /* Blend mode controls */,
    // 'ly.img.shape.options' /* Shape Options dropdown */,
    // 'ly.img.combine' /* Combine dropdown (shapes/cutouts) */,
    // 'ly.img.position' /* Position dropdown */,
    // 'ly.img.trim' /* Trim button (video mode) */,
    // #endregion

    // ============================================================================
    // NOTIFICATION FEATURES (DISABLED)
    // Notifications are disabled in player mode
    // ============================================================================

    // #region Notification Features (Disabled)
    // 'ly.img.notifications' /* Global notifications visibility */,
    // 'ly.img.notifications.undo' /* Undo notifications */,
    // 'ly.img.notifications.redo' /* Redo notifications */,
    // #endregion

    // ============================================================================
    // DOCK AND LIBRARY FEATURES (DISABLED)
    // Asset library is disabled in player mode
    // ============================================================================

    // #region Dock and Library Features (Disabled)
    // 'ly.img.dock' /* Dock visibility */,
    // 'ly.img.library.panel' /* Asset Library panel */,
    // #endregion

    // ============================================================================
    // PLACEHOLDER FEATURES (DISABLED)
    // Placeholder features are disabled in player mode
    // ============================================================================

    // #region Placeholder Features (Disabled)
    // 'ly.img.placeholder' /* Placeholder button in Canvas Menu */,
    // 'ly.img.placeholder.general' /* General section (opacity, blend, etc.) */,
    // 'ly.img.placeholder.general.opacity' /* Opacity option */,
    // 'ly.img.placeholder.general.blendMode' /* Blend Mode option */,
    // 'ly.img.placeholder.general.duplicate' /* Duplicate option */,
    // 'ly.img.placeholder.general.delete' /* Delete option */,
    // 'ly.img.placeholder.arrange' /* Arrange section */,
    // 'ly.img.placeholder.arrange.move' /* Move option */,
    // 'ly.img.placeholder.arrange.resize' /* Resize option */,
    // 'ly.img.placeholder.arrange.rotate' /* Rotate option */,
    // 'ly.img.placeholder.arrange.flip' /* Flip option */,
    // 'ly.img.placeholder.fill' /* Fill section */,
    // 'ly.img.placeholder.fill.change' /* Change Fill option */,
    // 'ly.img.placeholder.fill.changeType' /* Change Fill Type option */,
    // 'ly.img.placeholder.fill.actAsPlaceholder' /* Act as Placeholder option */,
    // 'ly.img.placeholder.fill.crop' /* Crop option */,
    // 'ly.img.placeholder.shape' /* Shape section */,
    // 'ly.img.placeholder.shape.change' /* Change Shape option */,
    // 'ly.img.placeholder.stroke' /* Stroke section */,
    // 'ly.img.placeholder.stroke.change' /* Change Stroke option */,
    // 'ly.img.placeholder.text' /* Text section */,
    // 'ly.img.placeholder.text.edit' /* Edit Text option */,
    // 'ly.img.placeholder.text.actAsPlaceholder' /* Act as Placeholder option */,
    // 'ly.img.placeholder.text.character' /* Character option */,
    // 'ly.img.placeholder.appearance' /* Appearance section */,
    // 'ly.img.placeholder.appearance.adjustments' /* Adjustments option */,
    // 'ly.img.placeholder.appearance.filter' /* Filter option */,
    // 'ly.img.placeholder.appearance.effect' /* Effect option */,
    // 'ly.img.placeholder.appearance.blur' /* Blur option */,
    // 'ly.img.placeholder.appearance.shadow' /* Shadow option */,
    // 'ly.img.placeholder.appearance.animations' /* Animations option */,
    // 'ly.img.preview' /* Preview button (Creator role only) */,
    // #endregion

    // ============================================================================
    // VIDEO PLAYBACK FEATURES (ENABLED)
    // Only essential playback controls are enabled for player mode
    // ============================================================================

    // #region Video Playback Features (Enabled)
    'ly.img.video.timeline' /* Video Timeline visibility - read-only */,
    'ly.img.video.controls' /* Base video control UI */,
    'ly.img.video.controls.playback' /* Play/pause and timestamp */,
    'ly.img.video.controls.loop' /* Loop toggle */
    // #endregion

    // ============================================================================
    // VIDEO EDITING FEATURES (DISABLED)
    // All video editing features are disabled in player mode
    // ============================================================================

    // #region Video Editing Features (Disabled)
    // 'ly.img.video.clips' /* Clips track in timeline */,
    // 'ly.img.video.overlays' /* Overlays track in timeline */,
    // 'ly.img.video.audio' /* Audio track in timeline */,
    // 'ly.img.video.addClip' /* Add clips to timeline */,
    // 'ly.img.video.controls.toggle' /* Timeline collapse/expand toggle */,
    // 'ly.img.video.controls.background' /* Background color controls */,
    // 'ly.img.video.controls.split' /* Split clip control */,
    // 'ly.img.video.controls.timelineZoom' /* Timeline zoom controls */,
    // 'ly.img.video.caption' /* Video captions */,
    // #endregion

    // ============================================================================
    // MEDIA CONTROLS (DISABLED)
    // Additional media controls are disabled in player mode
    // ============================================================================

    // #region Media Controls (Disabled)
    // 'ly.img.audio.replace' /* Audio replace button */,
    // 'ly.img.volume' /* Volume control (video mode) */,
    // 'ly.img.playbackSpeed' /* Playback speed control */,
    // 'ly.img.animations' /* Animations button (video mode) */,
    // #endregion

    // ============================================================================
    // DEVELOPMENT FEATURES (DISABLED)
    // Development features are disabled in player mode
    // ============================================================================

    // #region Development Features (Disabled)
    // 'ly.img.settings' /* Quick settings menu for development */,
    // #endregion
  ]);
}
