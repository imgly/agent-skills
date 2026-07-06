import { CompleteAssetResult, RGBAColor } from '@cesdk/engine';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState
} from 'react';
import { useEngine } from './EngineContext';
import { useSinglePageMode } from './SinglePageModeContext';
import { usePagePreview } from './PagePreviewContext';
import { caseAssetPath } from '../util';

const template = {
  name: 'Example Photobook',
  colors: ['#DC1876', '#0027BC', '#E2701D', '#008625', '#7E18CE', '#5BB1A7'],
  preview: '/templates/example.png',
  scene: '/photobook.scene',
  keyword: 'family kids parents amusement'
};

function hexToRgba(hex: string): RGBAColor {
  if (hex.length === 2) {
    hex = hex.replace(/#([0-9a-fA-F])/g, '#$1$1$1$1$1$1');
  }
  if (hex.length === 4) {
    hex = hex.replace(
      /#([0-9a-fA-F])([0-9a-fA-F])([0-9a-fA-F])/g,
      '#$1$1$2$2$3$3'
    );
  }
  const alphaHex = hex.length === 9 ? hex.slice(7, 9) : 'FF';

  if (![7, 9].includes(hex.length)) {
    throw new Error(
      `hexToRgba expects a hex string of length 7 (including #).${hex}`
    );
  }

  return {
    r: parseInt(hex.slice(1, 3), 16) / 255,
    g: parseInt(hex.slice(3, 5), 16) / 255,
    b: parseInt(hex.slice(5, 7), 16) / 255,
    a: parseInt(alphaHex, 16) / 255
  };
}

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
    const loadTemplate = async () => {
      if (engineIsLoaded) {
        setEnabled(false);
        setSceneIsLoaded(false);

        // Load the photobook scene
        await engine.scene.loadFromURL(caseAssetPath(template.scene));

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
        setSceneIsLoaded(true);
      }
    };

    loadTemplate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
