import { useCallback, useState } from 'react';

type SaveHandler = (sceneString: string) => void | Promise<void>;

interface EditorModalState {
  isOpen: boolean;
  scene: string;
  mode: 'design' | 'advanced';
  onSave?: SaveHandler;
}

export function useEditorModal() {
  const [state, setState] = useState<EditorModalState>({
    isOpen: false,
    scene: '',
    mode: 'advanced'
  });

  const open = useCallback(
    (scene: string, mode: 'design' | 'advanced', onSave?: SaveHandler) => {
      setState({ isOpen: true, scene, mode, onSave });
    },
    []
  );

  const close = useCallback(() => {
    setState((prev) => ({ ...prev, isOpen: false }));
  }, []);

  return { ...state, open, close };
}
