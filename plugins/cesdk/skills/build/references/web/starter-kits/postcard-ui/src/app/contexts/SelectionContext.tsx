import type CreativeEngine from '@cesdk/engine';
import isEqual from 'lodash/isEqual';
import { createContext, useContext, useEffect, useState, useRef } from 'react';
import { pickBlockToKeep } from './selectionReconciliation';

interface SelectionContextType {
  selection: number[];
}
const SelectionContext = createContext<SelectionContextType | undefined>(
  undefined
);

interface SelectionProviderProps {
  children: React.ReactNode;
  // Engine may be null initially — the provider guards all engine usage with
  // an `if (engine)` check, so null is safe here.
  engine: CreativeEngine | null;
}

export const SelectionProvider = ({
  children,
  engine
}: SelectionProviderProps) => {
  const [selection, setSelection] = useState<number[]>(
    engine?.block.findAllSelected() ?? []
  );
  const isChanging = useRef(false);
  const previousSelection = useRef<number[]>(
    engine?.block.findAllSelected() ?? []
  );

  useEffect(() => {
    if (!engine) return;
    const canvas = engine.element;

    // onSelectionChanged has no payload and findAllSelected() is not in drag
    // order, so we reconstruct the order by tracking which block was added most
    // recently across a single pointer gesture.
    let isPointerDown = false;
    let rafId: number | undefined;
    let gestureSnapshot: number[] = [];
    let lastAddedInGesture: number | undefined;

    const reduceToSingleSelection = () => {
      const selected = engine.block.findAllSelected();
      if (selected.length <= 1) {
        previousSelection.current = selected;
        setSelection((prev) => (isEqual(prev, selected) ? prev : selected));
        return;
      }

      const keep = pickBlockToKeep(
        selected,
        previousSelection.current,
        lastAddedInGesture
      );

      isChanging.current = true;
      selected.forEach((id) => {
        if (id !== keep) engine.block.setSelected(id, false);
      });
      isChanging.current = false;

      previousSelection.current = [keep];
      setSelection((prev) => (isEqual(prev, [keep]) ? prev : [keep]));
    };

    const handleSelectionChanged = () => {
      if (isChanging.current) return;
      if (isPointerDown) {
        // Don't touch the selection mid-gesture (that fights the live marquee
        // and loops). Only record which block was added most recently.
        const selected = engine.block.findAllSelected();
        const snapshot = new Set(gestureSnapshot);
        const added = selected.filter((id) => !snapshot.has(id));
        if (added.length) lastAddedInGesture = added[added.length - 1];
        gestureSnapshot = selected;
        return;
      }
      reduceToSingleSelection();
    };

    const handlePointerDown = () => {
      isPointerDown = true;
      gestureSnapshot = engine.block.findAllSelected();
      lastAddedInGesture = undefined;
    };
    const handlePointerUp = () => {
      if (!isPointerDown) return;
      isPointerDown = false;
      // Let the engine finish applying the gesture's selection first.
      rafId = requestAnimationFrame(reduceToSingleSelection);
    };

    const unsubscribe = engine.block.onSelectionChanged(handleSelectionChanged);
    canvas?.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointerup', handlePointerUp);
    return () => {
      unsubscribe();
      canvas?.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);
      if (rafId !== undefined) cancelAnimationFrame(rafId);
    };
  }, [engine]);

  const value = {
    selection
  };

  return (
    <SelectionContext.Provider value={value}>
      {children}
    </SelectionContext.Provider>
  );
};

export const useSelection = () => {
  const context = useContext(SelectionContext);
  if (context === undefined) {
    throw new Error('useSelection must be used within a SelectionContext');
  }
  return context;
};
