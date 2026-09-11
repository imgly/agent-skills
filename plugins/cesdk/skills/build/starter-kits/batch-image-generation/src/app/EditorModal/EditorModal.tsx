/**
 * EditorModal Component
 *
 * Modal wrapper for CE.SDK editors (template and instance editing).
 * Handles application-specific logic like variable setting and scene loading,
 * while the imgly module handles generic editor configuration.
 */

import type { Configuration } from '@cesdk/cesdk-js';
import CreativeEditor from '@cesdk/cesdk-js/react';
import type CreativeEditorSDK from '@cesdk/cesdk-js';
import { useCallback, useEffect, useMemo, useRef } from 'react';

import {
  initBatchImageGenerationInstanceEditor,
  initBatchImageGenerationTemplateEditor
} from '../../imgly';

import styles from './EditorModal.module.css';

interface EditorModalProps {
  /** Editor type: 'template' for Creator role, 'instance' for Adopter role */
  type: 'template' | 'instance';
  /** Title displayed in the navigation bar */
  title: string;
  /** Scene string to load */
  sceneString: string;
  /** Variables to set in the scene */
  variables: { firstName: string; lastName: string; department: string };
  /** CE.SDK configuration (license, baseURL) */
  config: Configuration;
  /** Callback when scene is saved */
  onSave: (sceneString: string) => void;
  /** Callback when editor is closed */
  onClose: () => void;
}

export function EditorModal({
  type,
  title,
  sceneString,
  variables,
  config,
  onSave,
  onClose
}: EditorModalProps) {
  const cesdkRef = useRef<CreativeEditorSDK | null>(null);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    document.body.classList.add('no-scroll');
    return () => {
      document.body.classList.remove('no-scroll');
    };
  }, []);

  const handleInit = useCallback(
    async (cesdk: CreativeEditorSDK) => {
      cesdkRef.current = cesdk;

      // Initialize editor based on type
      if (type === 'template') {
        await initBatchImageGenerationTemplateEditor(cesdk);
      } else {
        await initBatchImageGenerationInstanceEditor(cesdk);
      }

      // Add close button (app-layer)
      cesdk.ui.insertOrderComponent(
        { in: 'ly.img.navigation.bar', position: 'start' },
        { id: 'ly.img.close.navigationBar', onClick: onClose }
      );

      // Set editor title (app-layer)
      cesdk.ui.updateOrderComponent(
        {
          in: 'ly.img.navigation.bar',
          match: { id: 'ly.img.title.navigationBar' }
        },
        { payload: { title } }
      );

      // Register save action (app-layer)
      cesdk.actions.register('saveScene', async () => {
        const scene = await cesdk.engine.scene.saveToString();
        onSave(scene);
        onClose();
      });

      // Set template variables (unified for both template and instance)
      cesdk.engine.variable.setString('FirstName', variables.firstName);
      cesdk.engine.variable.setString('LastName', variables.lastName);
      cesdk.engine.variable.setString('Department', variables.department);

      // Load scene and zoom to fit
      await cesdk.loadFromString(sceneString);
      cesdk.actions.run('zoom.toPage', { autoFit: true });
    },
    [type, title, sceneString, variables, onSave, onClose]
  );

  // Minimal config - license, baseURL only
  // Role and all other configuration is done via runtime APIs in init functions
  const cesdkConfig = useMemo<Configuration>(() => config, [config]);

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <CreativeEditor
          className={styles.editor}
          config={cesdkConfig}
          init={handleInit}
        />
      </div>
    </div>
  );
}
