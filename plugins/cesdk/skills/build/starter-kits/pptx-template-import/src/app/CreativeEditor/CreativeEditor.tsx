/**
 * CreativeEditor - CE.SDK Editor full-screen view component
 * Uses the official @cesdk/cesdk-js/react wrapper
 */
import type CreativeEditorSDK from '@cesdk/cesdk-js';
import type { Configuration } from '@cesdk/cesdk-js';
import CreativeEditorComponent from '@cesdk/cesdk-js/react';
import { initPptxTemplateImportEditor } from '../../imgly';
import classes from './CreativeEditor.module.css';

interface CreativeEditorProps {
  sceneArchiveUrl: string;
  editorConfig: Configuration;
  closeEditor: () => void;
}

export function CreativeEditor({
  sceneArchiveUrl,
  editorConfig,
  closeEditor
}: CreativeEditorProps) {
  return (
    <div className={classes.fullscreenWrapper}>
      <div className={classes.cesdkContainer}>
        <CreativeEditorComponent
          config={editorConfig}
          init={async (cesdk: CreativeEditorSDK) => {
            // Debug access (remove in production)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (window as any).cesdk = cesdk;

            // Initialize the editor with PPTX template import configuration
            await initPptxTemplateImportEditor(cesdk);

            // Add back button to navigate back
            cesdk.ui.insertOrderComponent(
              { in: 'ly.img.navigation.bar', position: 'start' },
              { id: 'ly.img.close.navigationBar', onClick: closeEditor }
            );

            // Load the scene from the archive URL
            await cesdk.loadFromArchiveURL(sceneArchiveUrl);

            // Zoom auto-fit to page
            cesdk.actions.run('zoom.toPage', { autoFit: true });
          }}
          onError={(error) => {
            // eslint-disable-next-line no-console
            console.error('Failed to initialize CE.SDK:', error);
            closeEditor();
          }}
          width="100%"
          height="100%"
        />
      </div>
    </div>
  );
}
