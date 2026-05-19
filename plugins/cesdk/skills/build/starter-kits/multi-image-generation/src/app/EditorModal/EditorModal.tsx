/**
 * Editor Modal Component
 *
 * Modal wrapper for the CE.SDK editor using the official React wrapper.
 * Selects the appropriate editor configuration based on mode:
 * - Adopter mode (restaurant selected): DesignEditorConfig
 * - Creator mode (no restaurant): AdvancedEditorConfig
 */

import { useEffect } from 'react';
import type { Configuration } from '@cesdk/cesdk-js';
import CreativeEditor from '@cesdk/cesdk-js/react';

import {
  initMultiImageGenerationDesignEditor,
  initMultiImageGenerationAdvancedDesignEditor,
  applyRestaurantColors
} from '../../imgly';
import type { Restaurant, Template } from '../types';
import SCENES from '../scenes.json';

import styles from './EditorModal.module.css';

interface EditorModalProps {
  isOpen: boolean;
  template: Template | null;
  sceneString: string | null;
  selectedRestaurant: Restaurant | null;
  /** Base configuration from root */
  editorBaseConfig: Partial<Configuration>;
  /** Callback when back button is clicked */
  onBack: () => void;
  /** Callback when modal should close (escape key, etc.) */
  onClose: () => void;
  /** Callback when design is saved */
  onSave: (sceneString: string) => void;
}

export default function EditorModal({
  isOpen,
  template,
  sceneString,
  selectedRestaurant,
  editorBaseConfig,
  onBack,
  onClose,
  onSave
}: EditorModalProps) {
  // Handle body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('no-scroll');
    }
    return () => {
      document.body.classList.remove('no-scroll');
    };
  }, [isOpen]);

  // Handle Escape key
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || template == null) return null;

  // Compute title for editor
  const title = selectedRestaurant
    ? `${selectedRestaurant.name} - ${template.label}`
    : template.label;

  // Determine scene to load: saved scene or fresh template
  const sceneToLoad = sceneString ?? SCENES[template.sceneKey];

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <CreativeEditor
          className={styles.container}
          config={editorBaseConfig}
          init={async (cesdk) => {
            // Initialize appropriate editor configuration based on mode
            if (selectedRestaurant) {
              await initMultiImageGenerationDesignEditor(cesdk);
            } else {
              await initMultiImageGenerationAdvancedDesignEditor(cesdk);
            }

            // Set editor title
            cesdk.i18n.setTranslations({
              en: { 'common.title': title }
            });

            // Add back button
            cesdk.ui.insertOrderComponent(
              { in: 'ly.img.navigation.bar', position: 'start' },
              {
                id: 'ly.img.back.navigationBar',
                onClick: onBack
              }
            );

            // Override default save action and add save button
            cesdk.actions.register('saveScene', async () => {
              const savedScene = await cesdk.engine.scene.saveToString();
              onSave(savedScene);
            });

            // Load scene
            await cesdk.loadFromString(sceneToLoad);

            // Apply restaurant variables and colors if restaurant is selected.
            // Variables are not persisted in the scene string and must be set
            // after loading.
            if (selectedRestaurant) {
              await applyRestaurantColors(cesdk.engine, selectedRestaurant);
            }

            // Fit scene to view
            cesdk.actions.run('zoom.toPage', { autoFit: true });
          }}
          onError={(error) => {
            // eslint-disable-next-line no-console
            console.error('Failed to initialize editor:', error);
            onClose();
          }}
        />
      </div>
    </div>
  );
}
