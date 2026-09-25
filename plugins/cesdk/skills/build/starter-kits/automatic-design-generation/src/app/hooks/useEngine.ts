/**
 * useEngine Hook
 *
 * Manages CE.SDK Engine lifecycle - initialization, video support detection, and cleanup.
 */

import { useEffect, useRef, useState } from 'react';

import type { Configuration } from '@cesdk/cesdk-js';
import CreativeEngine, { supportsVideoExport } from '@cesdk/engine';

interface UseEngineReturn {
  engine: CreativeEngine | null;
  isReady: boolean;
  videoSupported: boolean;
}

export function useEngine(config: Configuration): UseEngineReturn {
  const engineRef = useRef<CreativeEngine | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [videoSupported, setVideoSupported] = useState(true);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      // Check video export support
      const isVideoSupported = await supportsVideoExport();
      if (mounted) {
        setVideoSupported(isVideoSupported);
      }

      // Initialize engine
      const engine = await CreativeEngine.init(config);
      if (!mounted) {
        engine.dispose();
        return;
      }

      engineRef.current = engine;
      // Debug access (remove in production)
      (window as any).engine = engine;

      setIsReady(true);
    };

    init();

    return () => {
      mounted = false;
      if (engineRef.current) {
        engineRef.current.dispose();
        engineRef.current = null;
      }
    };
  }, []);

  return {
    engine: engineRef.current,
    isReady,
    videoSupported
  };
}
