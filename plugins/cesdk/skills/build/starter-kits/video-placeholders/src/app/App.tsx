/**
 * CE.SDK Placeholders Video Editor - Main App Component
 *
 * Orchestrates the editor initialization and role switching.
 */

import { useCallback, useRef, useState } from 'react';
import CreativeEditor from '@cesdk/cesdk-js/react';
import type CreativeEditorSDK from '@cesdk/cesdk-js';
import type { Configuration } from '@cesdk/cesdk-js';

import {
  initVideoPlaceholdersCreatorEditor,
  initVideoPlaceholdersAdopterEditor
} from '../imgly';
import RoleSwitcher from './RoleSwitcher/RoleSwitcher';
import styles from './App.module.css';

// START_HIDDEN_BLOCK
import {
  reportDemoPhase,
  reportDemoLoadingState
} from '../../../shared/demo-preview/lifecycle';
// END_HIDDEN_BLOCK

// ============================================================================
// Types
// ============================================================================

// highlight-role-type
type Role = 'Creator' | 'Adopter';
// highlight-role-type

// highlight-props-type
interface AppProps {
  config: Configuration;
  sceneUrl: string;
}
// highlight-props-type

// ============================================================================
// App Component
// ============================================================================

export default function App({ config, sceneUrl }: AppProps) {
  const cesdkRef = useRef<CreativeEditorSDK | null>(null);
  const savedSceneStringRef = useRef<string | null>(null);
  const [role, setRole] = useState<Role>('Creator');
  const [editorKey, setEditorKey] = useState(0);

  // highlight-create-editor
  const handleInit = useCallback(
    async (cesdk: CreativeEditorSDK) => {
      // START_HIDDEN_BLOCK
      reportDemoPhase('created');
      // END_HIDDEN_BLOCK
      cesdkRef.current = cesdk;

      // Debug access (remove in production)
      (window as any).cesdk = cesdk;

      // highlight-init-by-role
      // Initialize with role-specific configuration
      // Each role uses a different config and runtime APIs
      if (role === 'Creator') {
        await initVideoPlaceholdersCreatorEditor(cesdk);
      } else {
        await initVideoPlaceholdersAdopterEditor(cesdk);
      }
      // highlight-init-by-role

      // Load scene: restore in-memory snapshot on role switch, otherwise load from URL on first mount
      const savedScene = savedSceneStringRef.current;
      if (savedScene) {
        try {
          await cesdk.engine.scene.load(savedScene);
        } catch {
          await cesdk.load(sceneUrl);
        }
        savedSceneStringRef.current = null;
      } else {
        await cesdk.load(sceneUrl);
      }

      // Zoom auto-fit to page
      cesdk.actions.run('zoom.toPage', { autoFit: true });
      // START_HIDDEN_BLOCK
      reportDemoPhase('ready');
      // END_HIDDEN_BLOCK
    },
    [role, sceneUrl]
  );
  // highlight-create-editor

  // highlight-role-switching
  const handleRoleChange = useCallback(async (newRole: Role) => {
    const cesdk = cesdkRef.current;
    if (cesdk) {
      try {
        savedSceneStringRef.current = await cesdk.engine.scene.saveToString();
      } catch {
        savedSceneStringRef.current = null;
      }
    }
    setRole(newRole);
    setEditorKey((prev) => prev + 1);
  }, []);
  // highlight-role-switching

  return (
    <div className={styles.app}>
      {/* highlight-role-switcher */}
      <RoleSwitcher value={role} onChange={handleRoleChange} />
      {/* highlight-role-switcher */}
      <div className={styles.editorWrapper}>
        <CreativeEditor
          key={editorKey}
          className={styles.editor}
          config={config}
          // START_HIDDEN_BLOCK
          onLoadingStateChange={reportDemoLoadingState}
          // END_HIDDEN_BLOCK
          init={handleInit}
        />
      </div>
    </div>
  );
}
