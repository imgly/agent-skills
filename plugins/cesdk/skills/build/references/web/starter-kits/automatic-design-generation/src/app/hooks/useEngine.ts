/**
 * useEngine Hook
 *
 * Manages CE.SDK Engine lifecycle - initialization, video support detection, and cleanup.
 */

import { useEffect, useRef, useState } from 'react';

import type { Configuration } from '@cesdk/cesdk-js';
import CreativeEngine from '@cesdk/engine';

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
      // Initialize engine
      const engine = await CreativeEngine.init(config);

      // The engine measures the codecs and answers whether this browser can export video
      const isVideoSupported = await engine.actions.run(
        'video.encode.checkSupport'
      );

      // Checked after the last await, so an unmount during it still disposes the engine
      if (!mounted) {
        engine.dispose();
        return;
      }

      setVideoSupported(isVideoSupported);

      engineRef.current = engine;
      // START_HIDDEN_BLOCK
      (window as any).engine = engine;
      // END_HIDDEN_BLOCK

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
