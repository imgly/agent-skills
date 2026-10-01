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


// ============================================================================
// Types
// ============================================================================

type Role = 'Creator' | 'Adopter';

interface AppProps {
  config: Configuration;
  sceneUrl: string;
}

// ============================================================================
// App Component
// ============================================================================

export default function App({ config, sceneUrl }: AppProps) {
  const cesdkRef = useRef<CreativeEditorSDK | null>(null);
  const savedSceneStringRef = useRef<string | null>(null);
  const [role, setRole] = useState<Role>('Creator');
  const [editorKey, setEditorKey] = useState(0);

  const handleInit = useCallback(
    async (cesdk: CreativeEditorSDK) => {
      cesdkRef.current = cesdk;


      // Initialize with role-specific configuration
      // Each role uses a different config and runtime APIs
      if (role === 'Creator') {
        await initVideoPlaceholdersCreatorEditor(cesdk);
      } else {
        await initVideoPlaceholdersAdopterEditor(cesdk);
      }

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
    },
    [role, sceneUrl]
  );

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
          init={handleInit}
        />
      </div>
    </div>
  );
}
