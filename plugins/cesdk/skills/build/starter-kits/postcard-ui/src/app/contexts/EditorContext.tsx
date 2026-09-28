import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';
import { useEngine } from '@/app/contexts/EngineContext';
import { POSTCARD_TEMPLATES } from '@/imgly/postcard-catalog';
import { useSinglePageMode } from '@/app/contexts/SinglePageModeContext';
import type { CompleteAssetResult, RGBAColor } from '@cesdk/engine';
import {
  findImageAssets as findImageAssetsQuery,
  hexToRgba
} from '@/imgly/utils';
import { DEMO_ASSETS_BASE_URL } from '@/imgly/demo-assets';
export { DEMO_ASSETS_BASE_URL };

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
  const { setCurrentPageBlockId, setEnabled, zoomToBlockId } =
    useSinglePageMode();

  useEffect(() => {
    if (!engineIsLoaded || engine.scene.get() === null) return;

    const pages = engine.scene.getPages();
    setCurrentPageBlockId(currentStep === 'Write' ? pages[1] : pages[0]);
  }, [engineIsLoaded, setCurrentPageBlockId, currentStep]);

  useEffect(() => {
    const loadPostcardTemplate = async () => {
      if (engineIsLoaded && postcardTemplate) {
        setEnabled(false);
        setSceneIsLoaded(false);
        try {
          await engine.scene.load(
            `${DEMO_ASSETS_BASE_URL}${postcardTemplate.scene}`
          );
          const pages = engine.scene.getPages();
          setEnabled(true);
          await setCurrentPageBlockId(pages[0]);
          // Reveal the canvas only once the initial zoom has actually finished.
          await zoomToBlockId(pages[0]);
          setSceneIsLoaded(true);
        } catch (error) {
          console.error(
            `Failed to load postcard template "${postcardTemplateId}" from ${postcardTemplate.scene}`,
            error
          );
        }
      }
    };
    loadPostcardTemplate();
  }, [engineIsLoaded, engine, postcardTemplate]);

  const findImageAssets = useCallback(
    () => findImageAssetsQuery(engine, postcardTemplate?.keyword),
    [engine, postcardTemplate]
  );

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
