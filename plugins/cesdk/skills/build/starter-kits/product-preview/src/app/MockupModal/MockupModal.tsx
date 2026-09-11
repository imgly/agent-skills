/**
 * CE.SDK Mockup Editor - Fullscreen Mockup Scene Editor Modal
 *
 * Opens a fullscreen CE.SDK instance to edit the mockup scene.
 * Users can reposition images, change backgrounds, etc.
 */

import { useCallback, useRef } from 'react';
import CreativeEditor from '@cesdk/cesdk-js/react';
import type CreativeEditorSDK from '@cesdk/cesdk-js';

import { initProductPreviewSceneEditor } from '../../imgly';
import styles from './MockupModal.module.css';

// ============================================================================
// Types
// ============================================================================

interface MockupModalProps {
  title: string;
  sceneString?: string;
  sceneUrl: string;
  license?: string;
  baseURL?: string;
  onSave: (sceneString: string) => void;
  onClose: () => void;
}

// ============================================================================
// Component
// ============================================================================

export function MockupModal({
  title,
  sceneString,
  sceneUrl,
  license,
  baseURL,
  onSave,
  onClose
}: MockupModalProps) {
  const cesdkRef = useRef<CreativeEditorSDK | null>(null);

  // ============================================================================
  // Navigation Bar Actions
  // ============================================================================

  /**
   * Handles the Back button click.
   */
  const handleBack = useCallback(() => {
    onClose();
  }, [onClose]);

  /**
   * Handles the Save button click.
   */
  const handleSave = useCallback(async () => {
    const cesdk = cesdkRef.current;
    if (!cesdk) return;

    try {
      const savedSceneString = await cesdk.engine.scene.saveToString();
      onSave(savedSceneString);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to save mockup scene:', error);
    }
  }, [onSave]);

  // ============================================================================
  // Editor Initialization
  // ============================================================================

  /**
   * Initializes the mockup scene editor using configuration from imgly/.
   */
  const handleEditorInit = useCallback(
    async (cesdk: CreativeEditorSDK) => {
      cesdkRef.current = cesdk;

      // Initialize mockup scene editor (Adopter role)
      await initProductPreviewSceneEditor(cesdk);

      // Set editor title
      cesdk.i18n.setTranslations({ en: { 'editor.title': title } });

      // Add back button & actions
      cesdk.ui.insertOrderComponent(
        { in: 'ly.img.navigation.bar', position: 'start' },
        { id: 'ly.img.back.navigationBar', onClick: handleBack }
      );

      cesdk.ui.updateOrderComponent(
        {
          in: 'ly.img.navigation.bar',
          match: 'ly.img.actions.navigationBar'
        },
        {
          children: [
            {
              id: 'ly.img.saveScene.navigationBar',
              onClick: handleSave
            }
          ]
        }
      );

      // Load scene
      if (sceneString) {
        await cesdk.loadFromString(sceneString);
      } else {
        await cesdk.loadFromURL(sceneUrl);
      }

      // Zoom to fit the page
      await cesdk.actions.run('zoom.toPage', { autoFit: true });
    },
    [title, sceneString, sceneUrl, handleBack, handleSave]
  );

  // ============================================================================
  // Render
  // ============================================================================

  const config = {
    license,
    baseURL
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.container}>
        <CreativeEditor
          className={styles.editor}
          config={config}
          init={handleEditorInit}
        />
      </div>
    </div>
  );
}
