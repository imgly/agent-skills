/**
 * Editor Modal Component
 *
 * Full-screen CE.SDK editor view for editing individual assets.
 * Uses the official CreativeEditor React wrapper from @cesdk/cesdk-js/react.
 */

import { useCallback, useEffect } from 'react';

import type CreativeEditorSDK from '@cesdk/cesdk-js';
import CreativeEditor from '@cesdk/cesdk-js/react';

import type { Configuration } from '@cesdk/cesdk-js';

import {
  initDesignGenerationDesignEditor,
  initDesignGenerationVideoEditor,
  type GeneratedAsset
} from '../../imgly';

import styles from './EditorModal.module.css';

interface EditorModalProps {
  asset: GeneratedAsset;
  config: Configuration;
  onClose: () => void;
  onSave: (asset: GeneratedAsset) => void;
}

export function EditorModal({
  asset,
  config,
  onClose,
  onSave
}: EditorModalProps) {
  // Determine if this is a design (image) or video asset
  const isDesign = asset.type === 'image';

  // Init callback that initializes the editor
  const init = useCallback(
    async (cesdk: CreativeEditorSDK) => {
      // Skip if no scene to load
      if (!asset.sceneString) return;

      // Initialize with appropriate editor config
      if (isDesign) {
        await initDesignGenerationDesignEditor(cesdk);
      } else {
        await initDesignGenerationVideoEditor(cesdk);
      }

      // Register save action (app-layer callback)
      cesdk.actions.register('saveScene', async () => {
        const engine = cesdk.engine;
        const sceneString = await engine.scene.saveToString();

        const blob = isDesign
          ? await engine.block.export(engine.scene.get() as number, {
              mimeType: 'image/png',
              targetWidth: asset.width,
              targetHeight: asset.height
            })
          : await engine.block.exportVideo(
              engine.scene.getCurrentPage() as number,
              {
                mimeType: 'video/mp4',
                targetWidth: asset.width,
                targetHeight: asset.height
              }
            );

        const blobUrl = URL.createObjectURL(blob);
        onSave({
          ...asset,
          sceneString,
          src: blobUrl
        });
      });

      // Load scene and configure
      cesdk.engine.editor.setSetting('page/title/show', false);
      await cesdk.loadFromString(asset.sceneString);

      // Set the scene name
      const scene = cesdk.engine.scene.get();
      if (scene !== null) {
        cesdk.engine.block.setName(scene, asset.label);
      }

      cesdk.actions.run('zoom.toPage', { autoFit: true });

      // Add close button at the start of the navigation bar
      cesdk.ui.insertOrderComponent(
        { in: 'ly.img.navigation.bar', position: 'start' },
        {
          id: 'ly.img.close.navigationBar',
          onClick: () => onClose()
        }
      );
    },
    [asset, isDesign, onClose, onSave]
  );

  // Disable body scroll when modal is open
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  return (
    <div className={styles.editorView}>
      <CreativeEditor
        config={config}
        init={init}
        className={styles.cesdkContainer}
      />
    </div>
  );
}
