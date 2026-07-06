import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';
import { useEngine } from '../../imgly/contexts/EngineContext';
import { POSTCARD_TEMPLATES } from '../../imgly/postcard-catalog';
import { useSinglePageMode } from '../../imgly/contexts/SinglePageModeContext';
import type { CompleteAssetResult, RGBAColor } from '@cesdk/engine';
import { hexToRgba } from '../../imgly/utils/ColorUtilities';

export const ALL_STEPS = ['Style', 'Design', 'Write'] as const;
type Step = (typeof ALL_STEPS)[number];

interface EditorContextType {
  sceneIsLoaded: boolean;
  postcardTemplate:
    | (typeof POSTCARD_TEMPLATES)[keyof typeof POSTCARD_TEMPLATES]
    | undefined;
  postcardTemplateId: string | undefined;
  setPostcardTemplateId: (id: string) => void;
  currentStep: Step;
  setCurrentStep: (step: Step) => void;
  findImageAssets: () => Promise<CompleteAssetResult[]>;
  getColorPalette: () => RGBAColor[];
}

const EditorContext = createContext<EditorContextType | undefined>(undefined);

// Asset path helper for this starterkit - returns absolute URL for engine
// Uses import.meta.env.BASE_URL which is set by Vite during build
export const caseAssetPath = (path: string): string => {
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  return new URL(import.meta.env.BASE_URL + path.slice(1), window.location.href)
    .href;
};

export const EditorProvider = ({ children }: { children: React.ReactNode }) => {
  const { engine, isLoaded: engineIsLoaded } = useEngine();
  const [sceneIsLoaded, setSceneIsLoaded] = useState(false);

  const [postcardTemplateId, setPostcardTemplateId] = useState<
    string | undefined
  >();
  const postcardTemplate = useMemo(
    () =>
      postcardTemplateId
        ? POSTCARD_TEMPLATES[postcardTemplateId as keyof typeof POSTCARD_TEMPLATES]
        : undefined,
    [postcardTemplateId]
  );
  const [currentStep, setCurrentStep] = useState<(typeof ALL_STEPS)[number]>(
    ALL_STEPS[0]
  );
  const { setCurrentPageBlockId, setEnabled } = useSinglePageMode();

  useEffect(() => {
    if (!engineIsLoaded || engine.scene.get() === null) return;

    const pages = engine.scene.getPages();
    setCurrentPageBlockId(currentStep === 'Write' ? pages[1] : pages[0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [engineIsLoaded, setCurrentPageBlockId, currentStep]);

  useEffect(() => {
    const loadPostcardTemplate = async () => {
      if (engineIsLoaded && postcardTemplate) {
        setEnabled(false);
        setSceneIsLoaded(false);
        await engine.scene.loadFromURL(caseAssetPath(postcardTemplate.scene));
        const pages = engine.scene.getPages();
        setCurrentPageBlockId(pages[0]);
        setEnabled(true);
        // Wait for zoom to finish
        await new Promise((resolve) => setTimeout(resolve, 100));
        setSceneIsLoaded(true);
      }
    };
    loadPostcardTemplate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [engineIsLoaded, engine, postcardTemplate]);

  const findImageAssets = useCallback(async () => {
    const UPLOAD_ASSET_LIBRARY_ID = 'ly.img.image.upload';
    const UNSPLASH_ASSET_LIBRARY_ID = 'unsplash';

    const uploadResults = await engine.asset.findAssets(
      UPLOAD_ASSET_LIBRARY_ID,
      {
        page: 0,
        perPage: 9999
      }
    );

    // Only query unsplash if the source is registered
    const registeredSources = engine.asset.findAllSources();
    const hasUnsplash = registeredSources.includes(UNSPLASH_ASSET_LIBRARY_ID);

    let unsplashAssets: CompleteAssetResult[] = [];
    if (hasUnsplash) {
      const unsplashResults = await engine.asset.findAssets(
        UNSPLASH_ASSET_LIBRARY_ID,
        {
          page: 0,
          perPage: 10,
          query: postcardTemplate?.keyword
        }
      );
      unsplashAssets = unsplashResults.assets;
    }

    return [...uploadResults.assets.reverse(), ...unsplashAssets];
  }, [postcardTemplate, engine]);

  const getColorPalette = useCallback(
    () => postcardTemplate?.colors.map((color) => hexToRgba(color)) ?? [],
    [postcardTemplate]
  );

  const value = {
    sceneIsLoaded,
    postcardTemplate,
    postcardTemplateId,
    setPostcardTemplateId,
    getColorPalette,
    findImageAssets,
    currentStep,
    setCurrentStep
  };
  return (
    <EditorContext.Provider value={value}>{children}</EditorContext.Provider>
  );
};

export const useEditor = () => {
  const context = useContext(EditorContext);
  if (context === undefined) {
    throw new Error('useEditor must be used within a EditorProvider');
  }
  return context;
};
