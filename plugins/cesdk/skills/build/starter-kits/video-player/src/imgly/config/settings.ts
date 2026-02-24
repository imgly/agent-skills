/**
 * Engine Settings Configuration - Customize Player Behavior and Appearance
 *
 * This file configures low-level engine settings that control how the player
 * behaves and appears. Settings are applied via `cesdk.engine.editor.setSetting()`
 * and `cesdk.engine.editor.setGlobalScope()`.
 *
 * ## Player Mode Principles
 *
 * Player mode enforces read-only behavior by:
 * - Denying selection scope (no element selection)
 * - Denying add scope (no content addition)
 * - Removing visual feedback (no highlight colors)
 * - Disabling interactive features
 *
 * @see https://img.ly/docs/cesdk/js/settings-970c98/
 */

import type CreativeEditorSDK from '@cesdk/cesdk-js';

/**
 * Configure engine settings for the player editor.
 *
 * Settings control the underlying behavior of the engine, including:
 * - What operations users can perform (via scopes)
 * - How users interact with content (read-only mode)
 * - Visual appearance (minimal feedback)
 *
 * @param cesdk - The CreativeEditorSDK instance to configure
 */
export function setupSettings(cesdk: CreativeEditorSDK): void {
  // ============================================================================
  // SCOPE SETTINGS - DISABLE EDITING
  // Deny all editing operations to enforce read-only playback mode
  // ============================================================================

  // #region Scope Settings
  // Disable element selection - users cannot select blocks
  cesdk.engine.editor.setGlobalScope('editor/select', 'Deny');

  // Disable content addition - users cannot add new elements
  cesdk.engine.editor.setGlobalScope('editor/add', 'Deny');
  // #endregion

  // ============================================================================
  // CONTROL GIZMO SETTINGS
  // Configure the visual handles that appear when blocks are selected
  // ============================================================================

  // #region Control Gizmo Settings
  // Show/hide various control handles

  // Crop handles - Handles for adjusting crop area in crop mode
  // cesdk.engine.editor.setSetting('controlGizmo/showCropHandles', true);

  // Crop scale handles - Outer handles that scale the full image during crop
  // cesdk.engine.editor.setSetting('controlGizmo/showCropScaleHandles', true);

  // Move handles - Center handles for moving blocks
  // cesdk.engine.editor.setSetting('controlGizmo/showMoveHandles', true);

  // Resize handles - Edge handles for non-proportional resizing
  // cesdk.engine.editor.setSetting('controlGizmo/showResizeHandles', true);

  // Scale handles - Corner handles for proportional scaling
  // cesdk.engine.editor.setSetting('controlGizmo/showScaleHandles', true);

  // Rotate handles - Handles for rotating blocks
  // cesdk.engine.editor.setSetting('controlGizmo/showRotateHandles', true);

  // Minimum size (in screen pixels) when scaling down with gizmos or touch
  // Prevents blocks from becoming too small to interact with
  // cesdk.engine.editor.setSetting('controlGizmo/blockScaleDownLimit', 8.0);
  // #endregion

  // ============================================================================
  // INTERACTION SETTINGS
  // Configure how users interact with the editor
  // ============================================================================

  // #region Interaction Settings
  // Enable double-click to enter crop mode for images
  // cesdk.engine.editor.setSetting('doubleClickToCropEnabled', true);

  // Selection mode for double-click:
  // - 'Direct': Select the exact element clicked (player behavior)
  // - 'Hierarchical': Traverse up/down the hierarchy (editor behavior)
  cesdk.engine.editor.setSetting('doubleClickSelectionMode', 'Direct');
  // #endregion

  // ============================================================================
  // PAGE AND CANVAS SETTINGS
  // Configure page appearance and behavior
  // ============================================================================

  // #region Page Settings
  // Allow cropping the page content via handles/gestures
  // cesdk.engine.editor.setSetting('page/allowCropInteraction', true);

  // Allow moving pages when layout is not controlled by scene
  // cesdk.engine.editor.setSetting('page/allowMoveInteraction', true);

  // Allow resizing pages via handles/gestures
  // cesdk.engine.editor.setSetting('page/allowResizeInteraction', true);

  // Allow rotating pages when layout is not controlled by scene
  // cesdk.engine.editor.setSetting('page/allowRotateInteraction', true);

  // Dim areas outside of page boundaries for visual clarity
  // cesdk.engine.editor.setSetting('page/dimOutOfPageAreas', true);

  // Restrict resize to fixed aspect ratio
  // cesdk.engine.editor.setSetting('page/restrictResizeInteractionToFixedAspectRatio', false);

  // Don't transform children when cropping fill (maintain absolute positions)
  // cesdk.engine.editor.setSetting('page/moveChildrenWhenCroppingFill', false);

  // Don't select page when clicking empty canvas area
  // cesdk.engine.editor.setSetting('page/selectWhenNoBlocksSelected', false);

  // Highlight page boundaries when cropping for better visual feedback
  // cesdk.engine.editor.setSetting('page/highlightWhenCropping', true);
  // #endregion

  // #region Page Title Settings
  // Configure page title display

  // Show titles above each page for multi-page navigation
  // cesdk.engine.editor.setSetting('page/title/show', true);

  // Show title even when only one page exists
  // cesdk.engine.editor.setSetting('page/title/showOnSinglePage', true);

  // Include the template title in page titles
  // cesdk.engine.editor.setSetting('page/title/showPageTitleTemplate', true);

  // Append page name to the title
  // cesdk.engine.editor.setSetting('page/title/appendPageName', true);

  // Separator between page number and name (e.g., "Page 1 - Cover")
  // cesdk.engine.editor.setSetting('page/title/separator', '-');

  // Custom font for page titles (optional)
  // cesdk.engine.editor.setSetting('page/title/fontFileUri', 'https://example.com/font.ttf');
  // #endregion

  // ============================================================================
  // TOUCH INTERACTION SETTINGS
  // Configure touch gestures and behavior
  // ============================================================================

  // #region Touch Settings
  // Whether starting a drag can select elements
  // cesdk.engine.editor.setSetting('touch/dragStartCanSelect', true);

  // Enable single-finger panning (vs two-finger)
  // cesdk.engine.editor.setSetting('touch/singlePointPanning', true);

  // Pinch gesture action:
  // - 'None': Pinch disabled
  // - 'Zoom': Pinch zooms the canvas
  // - 'Scale': Pinch scales selected blocks
  // cesdk.engine.editor.setSetting('touch/pinchAction', 'Scale');

  // Rotate gesture action:
  // - 'None': Rotation disabled
  // - 'Rotate': Two-finger rotation rotates selected blocks
  // cesdk.engine.editor.setSetting('touch/rotateAction', 'Rotate');
  // #endregion

  // ============================================================================
  // MOUSE INTERACTION SETTINGS
  // Configure mouse behavior
  // ============================================================================

  // #region Mouse Settings
  // Enable scroll wheel to pan the canvas
  // cesdk.engine.editor.setSetting('mouse/enableScroll', true);

  // Enable scroll wheel + modifier key to zoom
  // cesdk.engine.editor.setSetting('mouse/enableZoom', true);
  // #endregion

  // ============================================================================
  // ANIMATION SETTINGS
  // Configure block animations
  // ============================================================================

  // #region Animation Settings
  // Enable/disable block animations (in/out animations, loops)
  // cesdk.engine.editor.setSetting('blockAnimations/enabled', true);
  // #endregion

  // ============================================================================
  // PLACEHOLDER CONTROL SETTINGS
  // Configure placeholder appearance for template editing
  // ============================================================================

  // #region Placeholder Settings
  // Show overlay pattern on placeholder elements
  // cesdk.engine.editor.setSetting('placeholderControls/showOverlay', true);

  // Show button on placeholders for easy content replacement
  // cesdk.engine.editor.setSetting('placeholderControls/showButton', true);
  // #endregion

  // ============================================================================
  // SNAPPING SETTINGS
  // Configure snap-to behavior for positioning and rotation
  // ============================================================================

  // #region Snapping Settings
  // Distance threshold (in pixels) for position snapping to guides
  // cesdk.engine.editor.setSetting('positionSnappingThreshold', 4.0);

  // Angle threshold (in degrees) for rotation snapping
  // cesdk.engine.editor.setSetting('rotationSnappingThreshold', 0.15);
  // #endregion

  // ============================================================================
  // CAMERA SETTINGS
  // Configure viewport and camera behavior
  // ============================================================================

  // #region Camera Settings
  // How to handle when clamp area is smaller than viewport:
  // - 'Center': Center the content
  // - 'Reverse': Allow panning beyond bounds then snap back
  // cesdk.engine.editor.setSetting('camera/clamping/overshootMode', 'Reverse');
  // #endregion

  // ============================================================================
  // DOCK SETTINGS
  // Configure the asset dock appearance
  // ============================================================================

  // #region Dock Settings
  // Hide text labels on dock icons (icon-only mode)
  // cesdk.engine.editor.setSetting('dock/hideLabels', false);

  // Dock icon size: 'normal' or 'large'
  // cesdk.engine.editor.setSetting('dock/iconSize', 'large');
  // #endregion

  // ============================================================================
  // FEATURE FLAGS
  // Enable/disable specific engine capabilities
  // ============================================================================

  // #region Feature Flags
  // Force system emojis instead of custom emoji fonts
  // cesdk.engine.editor.setSetting('forceSystemEmojis', true);

  // Enable single page mode (hide multi-page navigation)
  // cesdk.engine.editor.setSetting('features/singlePageModeEnabled', false);

  // Enable page carousel navigation
  // cesdk.engine.editor.setSetting('features/pageCarouselEnabled', true);

  // Retain cover mode during transform edits
  // cesdk.engine.editor.setSetting('features/transformEditsRetainCoverMode', true);
  // #endregion

  // ============================================================================
  // COLOR SETTINGS
  // Customize UI colors for branding and theming
  // ============================================================================

  // #region Color Settings
  // All colors use RGBA format: { r: 0-1, g: 0-1, b: 0-1, a: 0-1 }

  // Remove canvas highlight color (no selection feedback) - PLAYER SPECIFIC
  // RGBA color with alpha = 0 (fully transparent)
  cesdk.engine.editor.setSetting('highlightColor', {
    r: 0,
    g: 0,
    b: 0,
    a: 0
  });

  // Highlight color for placeholder elements
  // cesdk.engine.editor.setSetting('placeholderHighlightColor', {
  //   r: 0.77,
  //   g: 0.06,
  //   b: 0.95,
  //   a: 1.0
  // });

  // Highlight color for text variables
  // cesdk.engine.editor.setSetting('textVariableHighlightColor', {
  //   r: 0.7,
  //   g: 0.0,
  //   b: 0.7,
  //   a: 1.0
  // });

  // Color of position snapping guide lines
  // cesdk.engine.editor.setSetting('snappingGuideColor', {
  //   r: 1.0,
  //   g: 0.004,
  //   b: 0.361,
  //   a: 1.0
  // });

  // Color of rotation snapping guide lines
  // cesdk.engine.editor.setSetting('rotationSnappingGuideColor', {
  //   r: 1.0,
  //   g: 0.004,
  //   b: 0.361,
  //   a: 1.0
  // });

  // Color of the crop mode overlay (dims non-cropped area)
  // cesdk.engine.editor.setSetting('cropOverlayColor', {
  //   r: 0.0,
  //   g: 0.0,
  //   b: 0.0,
  //   a: 0.39
  // });

  // Color indicating error states (e.g., invalid operations)
  // cesdk.engine.editor.setSetting('errorStateColor', {
  //   r: 1.0,
  //   g: 1.0,
  //   b: 1.0,
  //   a: 0.7
  // });

  // Color for progress indicators
  // cesdk.engine.editor.setSetting('progressColor', {
  //   r: 1.0,
  //   g: 1.0,
  //   b: 1.0,
  //   a: 0.7
  // });

  // Fill color for control handles
  // cesdk.engine.editor.setSetting('handleFillColor', {
  //   r: 1.0,
  //   g: 1.0,
  //   b: 1.0,
  //   a: 1.0
  // });

  // Color of handle/selection borders
  // cesdk.engine.editor.setSetting('borderOutlineColor', {
  //   r: 0.0,
  //   g: 0.0,
  //   b: 0.0,
  //   a: 1.0
  // });

  // Background color of the canvas
  // cesdk.engine.editor.setSetting('clearColor', {
  //   r: 0.1,
  //   g: 0.1,
  //   b: 0.1,
  //   a: 1.0
  // });

  // Color of page highlights/outlines
  // cesdk.engine.editor.setSetting('pageHighlightColor', {
  //   r: 0.2,
  //   g: 0.3,
  //   b: 1.0,
  //   a: 1.0
  // });

  // Color filled into bleed margins of pages
  // cesdk.engine.editor.setSetting('page/marginFillColor', {
  //   r: 0.79,
  //   g: 0.12,
  //   b: 0.4,
  //   a: 0.1
  // });

  // Color of the frame around bleed margin area
  // cesdk.engine.editor.setSetting('page/marginFrameColor', {
  //   r: 0.79,
  //   g: 0.12,
  //   b: 0.4,
  //   a: 0.15
  // });

  // Inner border color around pages
  // cesdk.engine.editor.setSetting('page/innerBorderColor', {
  //   r: 0.0,
  //   g: 0.0,
  //   b: 0.0,
  //   a: 0.0
  // });

  // Outer border color around pages
  // cesdk.engine.editor.setSetting('page/outerBorderColor', {
  //   r: 1.0,
  //   g: 1.0,
  //   b: 1.0,
  //   a: 0.0
  // });

  // Color of page titles
  // cesdk.engine.editor.setSetting('page/title/color', {
  //   r: 1.0,
  //   g: 1.0,
  //   b: 1.0,
  //   a: 1.0
  // });

  // Rule of thirds guide line color
  // cesdk.engine.editor.setSetting('ruleOfThirdsLineColor', {
  //   r: 1.0,
  //   g: 1.0,
  //   b: 1.0,
  //   a: 0.3
  // });
  // #endregion

  // ============================================================================
  // RESOURCE SETTINGS
  // Configure paths and resource URIs
  // ============================================================================

  // #region Resource Settings
  // Base path for resolving relative paths and bundle:/* URIs */
  // cesdk.engine.editor.setSetting('basePath', 'https://cdn.example.com/assets/');

  // Default font file URI
  // cesdk.engine.editor.setSetting('defaultFontFileUri', 'https://example.com/fonts/default.ttf');

  // Default emoji font file URI
  // cesdk.engine.editor.setSetting('defaultEmojiFontFileUri', 'https://example.com/fonts/emoji.ttf');

  // Fallback font for missing glyphs
  // cesdk.engine.editor.setSetting('fallbackFontUri', 'https://example.com/fonts/fallback.ttf');
  // #endregion

  // ============================================================================
  // UPLOAD SETTINGS
  // Configure file upload behavior
  // ============================================================================

  // #region Upload Settings
  // Supported MIME types for file uploads (comma-separated)
  // cesdk.engine.editor.setSetting('upload/supportedMimeTypes', 'image/jpeg,image/png,image/webp,video/mp4,video/webm');

  // Maximum image size (width or height) in pixels
  // cesdk.engine.editor.setSetting('maxImageSize', 4096);

  // Clamp thumbnail sizes to GPU texture limit
  // cesdk.engine.editor.setSetting('clampThumbnailTextureSizes', true);
  // #endregion

  // ============================================================================
  // NETWORK SETTINGS
  // Configure network behavior (Web only)
  // ============================================================================

  // #region Network Settings
  // Credentials mode for cross-origin fetch requests:
  // - 'omit': Never send cookies
  // - 'same-origin': Send cookies only for same-origin requests (default)
  // - 'include': Always send cookies, even for cross-origin
  // cesdk.engine.editor.setSetting('web/fetchCredentials', 'same-origin');
  // #endregion
}
