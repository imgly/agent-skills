import CreativeEngine from '@cesdk/engine';
import type { Configuration } from '@cesdk/engine';
import isEqual from 'lodash/isEqual';
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useSinglePageFocus } from '../hooks/UseSinglePageFocus';
import { caseAssetPath, initMobileEditor } from '../../imgly';


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
  const engineRef = useRef<CreativeEngine | null>(null);
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
      engineRef.current = engine;

      engine.editor.onStateChanged(() => editorUpdateCallbackRef.current());
      engine.event.subscribe([], (events: unknown[]) =>
        engineEventCallbackRef.current(events)
      );

      await initMobileEditor(engine, caseAssetPath('/social-media.scene'));

      setFocusEngine(engine);
      setFocusEnabled(true);
      setEngine(engine);
      setEngineIsLoaded(true);
    };
    loadEditor();

    return () => {
      mounted = false;
      // The effect runs once, so the `engine` state of that first render is
      // always null here. The ref is what holds the engine this effect created.
      if (engineRef.current) {
        engineRef.current.dispose();
        engineRef.current = null;
      }
      setEngineIsLoaded(false);
    };
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
