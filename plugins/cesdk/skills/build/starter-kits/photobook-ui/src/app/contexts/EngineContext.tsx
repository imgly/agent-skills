import CreativeEngine, { Configuration } from '@cesdk/engine';
import { createContext, useContext, useEffect, useState } from 'react';

interface EngineContextType {
  engine: CreativeEngine;
  isLoaded: boolean;
}

const EngineContext = createContext<EngineContextType | undefined>(undefined);

interface EngineProviderProps {
  children: React.ReactNode;
  config: Partial<Configuration>;
  configure?: (engine: CreativeEngine) => Promise<void>;
  LoadingComponent: React.ReactNode;
}

export function EngineProvider({
  children,
  config,
  configure,
  LoadingComponent = null
}: EngineProviderProps): React.ReactNode {
  const [engine, setEngine] = useState<CreativeEngine | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let localEngine: CreativeEngine;
    let mounted = true;

    const loadEngine = async () => {
      if (import.meta.env.CESDK_USE_LOCAL) {
        config.baseURL = import.meta.env.VITE_IMGLY_LOCAL_ASSETS_URL;
      }

      localEngine = await CreativeEngine.init(config);
      if (!mounted) {
        localEngine.dispose();
        return;
      }

      localEngine.editor.setSetting('mouse/enableScroll', false);
      localEngine.editor.setSetting('mouse/enableZoom', false);

      // Debug access (remove in production)
      (window as unknown as { cesdk: CreativeEngine }).cesdk = localEngine;

      if (configure) {
        await configure(localEngine);
      }

      setEngine(localEngine);
      setIsLoaded(true);
    };

    loadEngine();

    return () => {
      if (localEngine) {
        localEngine.dispose();
      }
      mounted = false;
      setIsLoaded(false);
    };
    // We do not want to rerender when the config changes. Config should never change!
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!engine) {
    return LoadingComponent;
  }

  const value = {
    engine,
    isLoaded
  };

  return (
    <EngineContext.Provider value={value}>
      {engine && children}
    </EngineContext.Provider>
  );
}

export function useEngine() {
  const context = useContext(EngineContext);
  if (context === undefined) {
    throw new Error('useEngine must be used within a EngineProvider');
  }
  return context;
}
