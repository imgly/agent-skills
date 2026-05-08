/**
 * Editor Context
 *
 * Manages the CE.SDK engine instance and scene state for the photo editor.
 * Provides access to engine, edit mode, image selection, and page focus utilities.
 */

import CreativeEngine from '@cesdk/engine';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode
} from 'react';
import { useSinglePageFocus } from '../../imgly/hooks/useSinglePageFocus';
import { getImageSize } from '../../imgly/engine-utils';

// Helper to convert relative paths to absolute URLs for the engine
// Uses import.meta.env.BASE_URL which is set by Vite during build based on --base flag.
const toAbsoluteUrl = (path: string): string => {
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  return new URL(import.meta.env.BASE_URL + path.slice(1), window.location.href)
    .href;
};

const INITIAL_PORTRAIT_IMAGE_PATH = toAbsoluteUrl('/images/mountains.jpg');
const INITIAL_LANDSCAPE_IMAGE_PATH = toAbsoluteUrl('/images/woman.jpg');
// For demonstration purposes we initially use either a portrait or a landscape image
const INITIAL_IMAGE_PATH =
  window.innerWidth / window.innerHeight > 1
    ? INITIAL_PORTRAIT_IMAGE_PATH
    : INITIAL_LANDSCAPE_IMAGE_PATH;

const ENABLE_AUTO_RECENTER = true;
export const CANVAS_COLOR = { r: 236, g: 236, b: 238 };
export const DEFAULT_HIGHLIGHT_COLOR = { r: 0, g: 0, b: 255 };

interface EditorContextValue {
  sceneIsLoaded: boolean;
  enableAutoRecenter: boolean;
  canRecenter: boolean;
  setCanRecenter: (can: boolean) => void;
  editMode: string;
  changeImage: (src: string, keepChanges: boolean) => Promise<void>;
  engine: CreativeEngine | null;
  engineIsLoaded: boolean;
  currentPageBlockId: number | undefined;
  refocus: () => void;
  setFocusEnabled: (enabled: boolean) => void;
  setZoomPaddingBottom: (padding: number) => void;
  selectedImageUrl: string;
}

const EditorContext = createContext<EditorContextValue | undefined>(undefined);

interface EditorProviderProps {
  children: ReactNode;
  engineConfig: {
    license?: string;
    baseURL?: string;
    featureFlags?: Record<string, string | boolean>;
  };
}

export function EditorProvider({
  children,
  engineConfig
}: EditorProviderProps) {
  const enableAutoRecenter = ENABLE_AUTO_RECENTER;
  const [engineIsLoaded, setEngineIsLoaded] = useState(false);
  const [sceneIsLoaded, setSceneIsLoaded] = useState(false);
  const [engine, setEngine] = useState<CreativeEngine | null>(null);
  const [canRecenter, setCanRecenter] = useState(false);
  const [editMode, setEditMode] = useState('Transform');
  const [selectedImageUrl, setSelectedImageUrl] = useState(INITIAL_IMAGE_PATH);

  const {
    setEnabled: setFocusEnabled,
    setEngine: setFocusEngine,
    setZoomPaddingBottom,
    currentPageBlockId,
    refocus
  } = useSinglePageFocus({
    zoomPaddingBottomDefault: 80,
    zoomPaddingLeftDefault: 16,
    zoomPaddingRightDefault: 16,
    zoomPaddingTopDefault: 52
  });

  const editorUpdateCallbackRef = useRef(() => {});
  editorUpdateCallbackRef.current = () => {
    if (!engine) return;
    const newEditMode = engine.editor.getEditMode();
    if (editMode !== newEditMode) {
      setEditMode(newEditMode);
    }
  };

  const changeImage = useCallback(
    async (src: string, keepChanges: boolean) => {
      if (!engine) return;
      engine.editor.setEditMode('Transform');
      setEditMode('Transform');
      setSceneIsLoaded(false);
      setSelectedImageUrl(src);
      setFocusEnabled(false);
      // Let react render
      await new Promise((resolve) => setTimeout(resolve, 0));
      if (keepChanges) {
        await setImageSource(engine, engine.block.findByType('page')[0], src);
      } else {
        await setupPhotoScene(engine, src);
      }
      setSceneIsLoaded(true);
      setFocusEnabled(true);
      await new Promise((resolve) => setTimeout(resolve, 0));
      engine.block.setVisible(engine.block.findByType('page')[0], true);
    },
    [engine, setFocusEnabled]
  );

  useEffect(() => {
    let engineInstance: CreativeEngine;
    let mounted = true;

    const loadEditor = async () => {
      // Initialize engine with eager import (no dynamic import delay)
      engineInstance = await CreativeEngine.init(engineConfig);
      if (!mounted) {
        engineInstance.dispose();
        return;
      }

      // Configure engine settings
      engineInstance.editor.setSetting('mouse/enableScroll', false);
      engineInstance.editor.setSetting('mouse/enableZoom', false);
      engineInstance.editor.setSetting('page/title/show', false);

      // Debug access (remove in production)
      if (typeof window !== 'undefined') {
        (window as Window & { cesdk?: CreativeEngine }).cesdk = engineInstance;
      }

      // Set up state change listener
      engineInstance.editor.onStateChanged(() =>
        editorUpdateCallbackRef.current()
      );

      // Set up the photo scene immediately after engine init
      const initialImageUrl = INITIAL_IMAGE_PATH;
      await setupPhotoScene(engineInstance, initialImageUrl);

      if (!mounted) {
        engineInstance.dispose();
        return;
      }

      // Configure focus
      setFocusEngine(engineInstance);
      setFocusEnabled(true);

      // Allow React to render
      await new Promise((resolve) => setTimeout(resolve, 0));
      const page = engineInstance.block.findByType('page')[0];
      engineInstance.block.setVisible(page, true);

      // Update state
      setEngine(engineInstance);
      setEngineIsLoaded(true);
      setSceneIsLoaded(true);
    };

    loadEditor();

    return () => {
      mounted = false;
      engineInstance?.dispose();
      setEngineIsLoaded(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value: EditorContextValue = {
    sceneIsLoaded,
    enableAutoRecenter,
    canRecenter,
    setCanRecenter,
    editMode,
    changeImage,
    engine,
    engineIsLoaded,
    currentPageBlockId,
    refocus,
    setFocusEnabled,
    setZoomPaddingBottom,
    selectedImageUrl
  };

  return (
    <EditorContext.Provider value={value}>{children}</EditorContext.Provider>
  );
}

export function useEditor(): EditorContextValue {
  const context = useContext(EditorContext);
  if (context === undefined) {
    throw new Error('useEditor must be used within an EditorProvider');
  }
  return context;
}

/**
 * Setup a photo editing scene with a single page containing an image fill.
 */
async function setupPhotoScene(
  engine: CreativeEngine,
  src: string
): Promise<void> {
  engine.editor.setSetting('page/dimOutOfPageAreas', false);
  engine.editor.setSetting('highlightColor', { r: 1, g: 1, b: 1, a: 1 });
  engine.editor.setSetting('cropOverlayColor', { r: 1, g: 1, b: 1, a: 0.55 });
  engine.editor.setGlobalScope('design/arrange' as any, 'Allow');

  // We recreate the scene to discard all changes
  const existingScene = engine.scene.get();
  if (existingScene) await engine.block.destroy(existingScene);

  const scene = await engine.scene.create();
  engine.block.setEnum(scene, 'scene/designUnit', 'Pixel');

  const page = await engine.block.create('page');
  engine.block.setVisible(page, false);
  engine.block.setBool(page, 'page/marginEnabled', false);

  const fill = await engine.block.createFill('image');
  await engine.block.appendChild(scene, page);
  await engine.block.setFill(page, fill);

  await setImageSource(engine, page, src);
  await engine.block.setClipped(page, false);
}

/**
 * Set the image source on a page block.
 */
async function setImageSource(
  engine: CreativeEngine,
  pageBlock: number,
  imageSrc: string
): Promise<void> {
  engine.editor.setGlobalScope('design/arrange' as any, 'Allow');
  const imageFill = engine.block.getFill(pageBlock);
  const { height, width } = await getImageSize(imageSrc);
  engine.block.setWidth(pageBlock, width);
  engine.block.setHeight(pageBlock, height);
  await engine.block.setString(imageFill, 'fill/image/imageFileURI', imageSrc);
  engine.block.resetCrop(pageBlock);
  engine.editor.setGlobalScope('design/arrange' as any, 'Deny');
  engine.editor.setSetting('doubleClickToCropEnabled', false);
}
