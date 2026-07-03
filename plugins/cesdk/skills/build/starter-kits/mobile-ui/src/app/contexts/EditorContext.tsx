import CreativeEngine from '@cesdk/engine';
import type { Configuration } from '@cesdk/engine';
import isEqual from 'lodash/isEqual';
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useSinglePageFocus } from '../hooks/UseSinglePageFocus';
import { caseAssetPath } from '../../imgly/utils';
import { SelectionProvider } from '../hooks/UseSelection';
import {
  DemoAssetSources,
  StickerAssetSource,
  TypefaceAssetSource,
  UploadAssetSources,
  VectorShapeAssetSource
} from '@cesdk/cesdk-js/plugins';

interface SelectedBlock {
  id: number;
  type: string;
}

interface EditorContextType {
  engine: CreativeEngine | null;
  engineIsLoaded: boolean;
  editMode: string;
  localUploads: string[];
  setLocalUploads: React.Dispatch<React.SetStateAction<string[]>>;
  selectedBlocks: SelectedBlock[] | null;
  canUndo: boolean;
  canRedo: boolean;
  currentPageBlockId: number | undefined;
  setFocusEnabled: (enabled: boolean) => void;
  refocus: () => void;
  setZoomPaddingBottom: (padding: number) => void;
}

const EditorContext = createContext<EditorContextType | undefined>(undefined);

interface EditorProviderProps {
  children: React.ReactNode;
  engineConfig: Partial<Configuration>;
}

export const EditorProvider = ({
  children,
  engineConfig
}: EditorProviderProps) => {
  const [engineIsLoaded, setEngineIsLoaded] = useState(false);

  const [engine, setEngine] = useState<CreativeEngine | null>(null);

  const [localUploads, setLocalUploads] = useState<string[]>([]);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [editMode, setEditMode] = useState('Transform');
  const editorUpdateCallbackRef = useRef<() => void>(() => {});
  const engineEventCallbackRef = useRef<(events: unknown[]) => void>(() => {});
  const [selectedBlocks, setSelectedBlocks] = useState<SelectedBlock[] | null>(
    null
  );

  const {
    setEnabled: setFocusEnabled,
    setEngine: setFocusEngine,
    setZoomPaddingBottom,
    currentPageBlockId,
    refocus
  } = useSinglePageFocus({
    zoomPaddingBottomDefault: 8,
    zoomPaddingLeftDefault: 8,
    zoomPaddingRightDefault: 8,
    zoomPaddingTopDefault: 8
  });

  editorUpdateCallbackRef.current = () => {
    if (!engine) return;
    const newEditMode = engine.editor.getEditMode();
    if (!isEqual(newEditMode, editMode)) {
      setEditMode(newEditMode);
    }
  };
  engineEventCallbackRef.current = (events: unknown[]) => {
    if (engine && events.length > 0) {
      // Extract and store the currently selected block
      const newSelectedBlocks = engine.block.findAllSelected().map((id) => ({
        id,
        type: engine.block.getKind(id)
      }));
      if (!isEqual(newSelectedBlocks, selectedBlocks)) {
        setSelectedBlocks(newSelectedBlocks);
      }

      // Extract and store canUndo
      const newCanUndo = engine.editor.canUndo();
      if (newCanUndo !== canUndo) {
        setCanUndo(newCanUndo);
      }
      // Extract and store canRedo
      const newCanRedo = engine.editor.canRedo();
      if (newCanRedo !== canRedo) {
        setCanRedo(newCanRedo);
      }
    }
  };

  useEffect(() => {
    let mounted = true;
    const loadEditor = async () => {
      // Merge with required defaults
      const config: Partial<Configuration> = {
        baseURL: import.meta.env.VITE_IMGLY_LOCAL_ASSETS_URL,
        ...engineConfig,
        featureFlags: {
          preventScrolling: true,
          ...engineConfig.featureFlags
        }
      };

      const engine = await CreativeEngine.init(config);
      if (!mounted) {
        engine.dispose();
        return;
      }
      engine.editor.setSetting('mouse/enableScroll', false);
      engine.editor.setSetting('mouse/enableZoom', false);

      // Debug access in development
      if (import.meta.env.DEV) {
        (window as Window & { engine?: CreativeEngine }).engine = engine;
      }

      await engine.addPlugin(new TypefaceAssetSource());
      await engine.addPlugin(
        new VectorShapeAssetSource({
          include: ['ly.img.vector.shape.filled.*']
        })
      );
      await engine.addPlugin(new StickerAssetSource());
      await engine.addPlugin(
        new UploadAssetSources({
          include: ['ly.img.image.upload']
        })
      );
      await engine.addPlugin(
        new DemoAssetSources({
          include: ['ly.img.image.*']
        })
      );
      engine.editor.setSetting('page/title/show', false);
      engine.editor.onStateChanged(() => editorUpdateCallbackRef.current());
      engine.event.subscribe([], (events: unknown[]) =>
        engineEventCallbackRef.current(events)
      );
      await engine.scene.loadFromURL(caseAssetPath('/social-media.scene'));

      setFocusEngine(engine);
      setFocusEnabled(true);
      setEngine(engine);
      setEngineIsLoaded(true);
    };
    loadEditor();

    return () => {
      mounted = false;
      if (engine) {
        engine.dispose();
      }
      setEngineIsLoaded(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value: EditorContextType = {
    engine,
    engineIsLoaded,
    editMode,
    localUploads,
    setLocalUploads,
    selectedBlocks,
    canUndo,
    canRedo,
    currentPageBlockId,
    setFocusEnabled,
    refocus,
    setZoomPaddingBottom
  };
  return (
    <EditorContext.Provider value={value}>
      <SelectionProvider engine={engine}>{children}</SelectionProvider>
    </EditorContext.Provider>
  );
};

export const useEditor = () => {
  const context = useContext(EditorContext);
  if (context === undefined) {
    throw new Error('useEditor must be used within a EditorProvider');
  }
  return context;
};
