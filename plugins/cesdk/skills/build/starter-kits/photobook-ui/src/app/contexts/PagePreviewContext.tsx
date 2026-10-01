import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import { useEngine } from './EngineContext';
import { useSinglePageMode } from './SinglePageModeContext';

interface PagePreviewContextType {
  pagePreviews: PagePreviews;
  enabled: boolean;
  setEnabled: (enabled: boolean) => void;
}

const PagePreviewContext = createContext<PagePreviewContextType | undefined>(
  undefined
);

interface PagePreviewProviderProps {
  children: React.ReactNode;
}

interface PagePreview {
  isDirty: boolean;
  path: string | null;
  isLoading: boolean;
}
type PagePreviews = Record<number, PagePreview>;

export function PagePreviewProvider({
  children
}: PagePreviewProviderProps): React.ReactNode {
  const { engine } = useEngine();
  const { currentPageBlockId, sortedPageIds } = useSinglePageMode();
  const [pagePreviews, setPagePreviews] = useState<PagePreviews>({});
  const [enabled, setEnabled] = useState<boolean>(false);
  const objectURLs = useRef<Record<number, string>>({});

  useEffect(() => {
    if (!currentPageBlockId) {
      return;
    }
    const unsubscribe = engine.editor.onHistoryUpdatedWithKind(() => {
      setPagePreviews((pagePreviews) => ({
        ...pagePreviews,
        [currentPageBlockId]: {
          ...pagePreviews[currentPageBlockId],
          isDirty: true,
          isLoading: false
        }
      }));
    });
    return () => {
      unsubscribe?.();
    };
  }, [engine, currentPageBlockId]);

  useEffect(
    function generatePreviewForNewPages() {
      if (!sortedPageIds) {
        return;
      }
      setPagePreviews((pagePreviews) => {
        const newPagePreviews: PagePreviews = {};
        Object.entries(pagePreviews).forEach(([pageIdStr, pagePreview]) => {
          const pageId = parseInt(pageIdStr, 10);
          const pageWasDeleted = !sortedPageIds.includes(pageId);
          if (pageWasDeleted) {
            if (pagePreview.path) {
              URL.revokeObjectURL(pagePreview.path);
            }
          } else {
            newPagePreviews[pageId] = pagePreview;
          }
        });
        sortedPageIds.forEach((pageId) => {
          const previewExists = pagePreviews[pageId];
          if (!previewExists) {
            newPagePreviews[pageId] = {
              isDirty: true,
              path: null,
              isLoading: false
            };
          }
        });
        return newPagePreviews;
      });
    },
    [sortedPageIds]
  );

  const pageIdPreviewsToGenerate = useMemo(
    () =>
      sortedPageIds?.filter(
        (id) =>
          pagePreviews[id] &&
          pagePreviews[id].isDirty &&
          !pagePreviews[id].isLoading
      ) || [],
    [sortedPageIds, pagePreviews]
  );

  useEffect(() => {
    const renderDirtyPreviews = async () => {
      pageIdPreviewsToGenerate.forEach((pageId) =>
        setPagePreviews((before) => ({
          ...before,
          [pageId]: { ...before[pageId], isLoading: true }
        }))
      );

      for (let index = 0; index < pageIdPreviewsToGenerate.length; index++) {
        const pageId = pageIdPreviewsToGenerate[index];
        await new Promise((resolve) => requestAnimationFrame(resolve));
        // Deleting a page while its preview is queued, or while it exports, is
        // a normal user action rather than a failure.
        if (!engine.block.isValid(pageId)) {
          continue;
        }
        let blob: Blob;
        try {
          blob = await engine.block.export(pageId, {
            mimeType: 'image/jpeg',
            jpegQuality: 0.5
          });
        } catch (error) {
          if (engine.block.isValid(pageId)) {
            throw error;
          }
          continue;
        }
        const stale = objectURLs.current[pageId];
        const path = URL.createObjectURL(blob);
        objectURLs.current[pageId] = path;
        setPagePreviews((before) => ({
          ...before,
          [pageId]: {
            ...before[pageId],
            path,
            isLoading: false,
            isDirty: false
          }
        }));
        // Revoking before React has swapped the <img> src leaves the old
        // element pointing at a URL the browser can no longer resolve.
        if (stale) {
          requestAnimationFrame(() => URL.revokeObjectURL(stale));
        }
      }
    };
    if (enabled && pageIdPreviewsToGenerate.length > 0) {
      renderDirtyPreviews();
    }
  }, [enabled, pageIdPreviewsToGenerate, sortedPageIds, engine]);

  const value = { pagePreviews, enabled, setEnabled };
  return (
    <PagePreviewContext.Provider value={value}>
      {children}
    </PagePreviewContext.Provider>
  );
}

export const usePagePreview = () => {
  const context = useContext(PagePreviewContext);
  if (context === undefined) {
    throw new Error('usePagePreview must be used within a PagePreviewProvider');
  }
  return context;
};
