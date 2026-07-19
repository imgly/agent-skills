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

/**
 * Demo assets for this example (images, scenes, …) are loaded from
 * the IMG.LY CDN by default. To host them yourself, copy this kit's asset
 * folder to your own CDN or server and change this constant — or set it to
 * `''` and place the files in this app's `public/` directory. No trailing
 * slash.
 */
export const DEMO_ASSETS_BASE_URL: string =
  import.meta.env.VITE_DEMO_ASSETS_BASE_URL ||
  'https://staticimgly.com/imgly/cesdk-web-examples-data/0.1.0/starterkit-postcard-ui';

export const EditorProvider = ({ children }: { children: React.ReactNode }) => {
  const { engine, isLoaded: engineIsLoaded } = useEngine();
  const [sceneIsLoaded, setSceneIsLoaded] = useState(false);

  const [postcardTemplateId, setPostcardTemplateId] = useState<
    string | undefined
  >();
  const postcardTemplate = useMemo(
    () =>
      postcardTemplateId
        ? POSTCARD_TEMPLATES[
            postcardTemplateId as keyof typeof POSTCARD_TEMPLATES
          ]
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
        await engine.scene.loadFromURL(
          `${DEMO_ASSETS_BASE_URL}${postcardTemplate.scene}`
        );
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
