import { useEffect, useRef, useState } from 'react';
import CreativeEngine from '@cesdk/engine';
import type { Configuration } from '@cesdk/cesdk-js';

import { DEFAULT_TEMPLATES } from '../constants';
import { resolveSceneUrl } from '../utils';

/**
 * Boots a headless `CreativeEngine` for variant generation.
 *
 */
export function useEngine(config: Partial<Configuration>) {
  const engineRef = useRef<CreativeEngine | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let disposed = false;

    CreativeEngine.init(config).then(async (engine) => {
      if (disposed) {
        engine.dispose();
        return;
      }
      engine.editor.setSetting('page/title/show', false);
      const template = DEFAULT_TEMPLATES[0];
      await engine.scene.loadFromURL(resolveSceneUrl(template.sceneUrl));
      engineRef.current = engine;
      setIsReady(true);
    });

    return () => {
      disposed = true;
      engineRef.current?.dispose();
      engineRef.current = null;
      setIsReady(false);
    };
  }, [config]);

  return {
    engine: engineRef.current,
    isReady
  };
}
