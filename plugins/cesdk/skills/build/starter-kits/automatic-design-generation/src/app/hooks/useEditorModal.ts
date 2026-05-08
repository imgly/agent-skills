/**
 * useEditorModal Hook
 *
 * Manages the modal state for editing individual assets.
 */

import { useCallback, useState } from 'react';

import type { GeneratedAsset } from '../../imgly';

interface UseEditorModalResult {
  editingAsset: GeneratedAsset | null;
  openEditor: (asset: GeneratedAsset) => void;
  closeEditor: () => void;
  saveAndClose: (updatedAsset: GeneratedAsset) => void;
}

export function useEditorModal(
  onSave: (asset: GeneratedAsset) => void
): UseEditorModalResult {
  const [editingAsset, setEditingAsset] = useState<GeneratedAsset | null>(null);

  const openEditor = useCallback((asset: GeneratedAsset) => {
    setEditingAsset(asset);
  }, []);

  const closeEditor = useCallback(() => {
    setEditingAsset(null);
  }, []);

  const saveAndClose = useCallback(
    (updatedAsset: GeneratedAsset) => {
      onSave(updatedAsset);
      setEditingAsset(null);
    },
    [onSave]
  );

  return {
    editingAsset,
    openEditor,
    closeEditor,
    saveAndClose
  };
}
