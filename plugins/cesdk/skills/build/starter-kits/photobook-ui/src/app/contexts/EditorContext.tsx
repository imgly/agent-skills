import { CompleteAssetResult, RGBAColor } from '@cesdk/engine';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState
} from 'react';
import { hexToRgba } from './color-utilities';
import { useEngine } from './EngineContext';
import { useSinglePageMode } from './SinglePageModeContext';
import { usePagePreview } from './PagePreviewContext';
import { DEMO_ASSETS_BASE_URL } from '../../imgly/demo-assets';

// START_HIDDEN_BLOCK
import { reportDemoPhase } from '../../../../shared/demo-preview/lifecycle';
export { DEMO_ASSETS_BASE_URL };
// END_HIDDEN_BLOCK

const template = {
  name: 'Example Photobook',
  colors: ['#DC1876', '#0027BC', '#E2701D', '#008625', '#7E18CE', '#5BB1A7'],
  preview: '/templates/example.png',
  scene: '/photobook.scene',
  keyword: 'family kids parents amusement'
};

interface EditorContextType {
  sceneIsLoaded: boolean;
  findImageAssets: () => Promise<CompleteAssetResult[]>;
  getColorPalette: () => RGBAColor[];
}

const EditorContext = createContext<EditorContextType | undefined>(undefined);

export function EditorProvider({ children }: { children: React.ReactNode }) {
  const { engine, isLoaded: engineIsLoaded } = useEngine();
  const [sceneIsLoaded, setSceneIsLoaded] = useState(false);
  const { setCurrentPageBlockId, setEnabled } = useSinglePageMode();
  const { setEnabled: setPagePreviewsEnabled } = usePagePreview();

  useEffect(() => {
    let cancelled = false;
    const loadTemplate = async () => {
      if (engineIsLoaded) {
        setEnabled(false);
        setSceneIsLoaded(false);

        // Load the photobook scene
        await engine.scene.load(`${DEMO_ASSETS_BASE_URL}${template.scene}`);

        // Simulate that a user has replaced the placeholder images
        engine.block
          .findByKind('image')
          .filter((image) => {
            return !engine.block.isPlaceholderControlsOverlayEnabled(image);
          })
          .forEach((image) => {
            engine.block.setPlaceholderEnabled(image, false);
          });

        setPagePreviewsEnabled(true);
        const pages = engine.scene.getPages();
        setCurrentPageBlockId(pages[0]);
        setEnabled(true);

        // Wait for zoom to finish
        await new Promise((resolve) => setTimeout(resolve, 100));
        if (cancelled) return;
        setSceneIsLoaded(true);
        // START_HIDDEN_BLOCK
        reportDemoPhase('ready');
        // END_HIDDEN_BLOCK
      }
    };

    loadTemplate();
    return () => {
      cancelled = true;
    };
  }, [engineIsLoaded, engine]);

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
          query: 'Disneyland'
        }
      );
      unsplashAssets = unsplashResults.assets;
    }

    return [...uploadResults.assets.reverse(), ...unsplashAssets];
  }, [engine]);

  const getColorPalette = useCallback(
    () => [...template.colors].map((color) => hexToRgba(color)),
    []
  );

  const value = {
    sceneIsLoaded,
    getColorPalette,
    findImageAssets
  };

  return (
    <EditorContext.Provider value={value}>{children}</EditorContext.Provider>
  );
}

export function useEditor() {
  const context = useContext(EditorContext);
  if (context === undefined) {
    throw new Error('useEditor must be used within a EditorProvider');
  }
  return context;
}
