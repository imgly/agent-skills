/**
 * useMockupRenderer Hook
 *
 * Manages mockup rendering with auto-refresh on design changes.
 * Uses event-driven updates instead of polling.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import type CreativeEditorSDK from '@cesdk/cesdk-js';

import {
  renderMockup,
  CLEAR_IMAGE,
  type RenderResult,
  type HeadlessEngineConfig
} from '../../imgly';
import {
  DEFAULT_EXPORT_HEIGHT,
  DEFAULT_EXPORT_WIDTH,
  DEFAULT_MAX_PLACEHOLDERS,
  DEFAULT_RENDER_DEBOUNCE_MS
} from '../../constants';
import { getMockupSceneUrl, getPlaceholderName } from '../utils';

interface UseMockupRendererOptions {
  designEngineRef: React.RefObject<CreativeEditorSDK | null>;
  config: HeadlessEngineConfig;
}

interface UseMockupRendererResult {
  mockupImageUrl: string | null;
  mockupSceneString: string | undefined;
  isLoading: boolean;
  isEngineReady: boolean;
  setEngineReady: () => void;
  renderMockupForProduct: (
    productKey: string,
    sceneString?: string
  ) => Promise<void>;
  updateMockupScene: (sceneString: string, productKey: string) => Promise<void>;
  resetMockupScene: () => void;
}

export function useMockupRenderer({
  designEngineRef,
  config
}: UseMockupRendererOptions): UseMockupRendererResult {
  // UI state
  const [mockupImageUrl, setMockupImageUrl] = useState<string | null>(null);
  const [mockupSceneString, setMockupSceneString] = useState<
    string | undefined
  >();
  const [isLoading, setIsLoading] = useState(true);
  const [isEngineReady, setIsEngineReady] = useState(false);

  // Internal refs
  const isRenderingRef = useRef(false);
  const pendingRenderRef = useRef(false);
  const productKeyRef = useRef('');
  const sceneStringRef = useRef<string | undefined>();
  const blobUrlsRef = useRef<string[]>([]);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  // Keep ref in sync with state
  sceneStringRef.current = mockupSceneString;

  /**
   * Builds placeholders object from exported design pages.
   */
  const buildPlaceholders = useCallback(async (cesdk: CreativeEditorSDK) => {
    if (!cesdk?.engine) return {};
    const pages = cesdk.engine.block.findByKind('page');

    const pageBlobs = await Promise.all(
      pages.map((id) =>
        cesdk.engine.block.export(id, {
          mimeType: 'image/png',
          targetWidth: DEFAULT_EXPORT_WIDTH,
          targetHeight: DEFAULT_EXPORT_HEIGHT
        })
      )
    );

    const placeholders: Record<string, Blob | string> = {};
    pageBlobs.forEach((blob, index) => {
      placeholders[getPlaceholderName(index)] = blob;
    });
    for (let i = pageBlobs.length; i < DEFAULT_MAX_PLACEHOLDERS; i++) {
      placeholders[getPlaceholderName(i)] = CLEAR_IMAGE;
    }

    return placeholders;
  }, []);

  /**
   * Executes the render operation.
   */
  const executeRender = useCallback(async () => {
    const cesdk = designEngineRef.current;
    if (!cesdk) return;

    isRenderingRef.current = true;
    setIsLoading(true);

    try {
      const placeholders = await buildPlaceholders(cesdk);
      const sceneSource = sceneStringRef.current
        ? { sceneString: sceneStringRef.current }
        : getMockupSceneUrl(productKeyRef.current);

      const result: RenderResult = await renderMockup(
        config,
        sceneSource,
        placeholders
      );

      blobUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
      blobUrlsRef.current = result.blobUrls;

      setMockupImageUrl(result.mockupUrl);
      setMockupSceneString(result.sceneString);
    } finally {
      setIsLoading(false);
      isRenderingRef.current = false;

      // Process any queued render
      if (pendingRenderRef.current) {
        pendingRenderRef.current = false;
        debounceRef.current = setTimeout(
          executeRender,
          DEFAULT_RENDER_DEBOUNCE_MS
        );
      }
    }
  }, [designEngineRef, config, buildPlaceholders]);

  /**
   * Schedules a debounced render.
   */
  const scheduleRender = useCallback(() => {
    if (isRenderingRef.current) {
      pendingRenderRef.current = true;
      return;
    }

    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(executeRender, DEFAULT_RENDER_DEBOUNCE_MS);
  }, [executeRender]);

  /**
   * Renders immediately (for product changes, initial load).
   */
  const render = useCallback(
    async (productKey: string, sceneString?: string) => {
      const cesdk = designEngineRef.current;
      if (!cesdk) return;

      clearTimeout(debounceRef.current);
      pendingRenderRef.current = false;

      productKeyRef.current = productKey;
      sceneStringRef.current = sceneString;

      if (isRenderingRef.current) {
        pendingRenderRef.current = true;
        return;
      }

      await executeRender();
    },
    [designEngineRef, executeRender]
  );

  // Subscribe to design changes when engine is ready
  useEffect(() => {
    if (!isEngineReady) return;

    const cesdk = designEngineRef.current;
    if (!cesdk) return;

    const unsubscribe = cesdk.engine.editor.onHistoryUpdated(scheduleRender);

    return () => {
      clearTimeout(debounceRef.current);
      unsubscribe();
    };
  }, [isEngineReady, designEngineRef, scheduleRender]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearTimeout(debounceRef.current);
      blobUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  const setEngineReady = useCallback(() => {
    setIsEngineReady(true);
  }, []);

  const updateMockupScene = useCallback(
    async (sceneString: string, productKey: string) => {
      setMockupSceneString(sceneString);
      await render(productKey, sceneString);
    },
    [render]
  );

  const resetMockupScene = useCallback(() => {
    setMockupSceneString(undefined);
  }, []);

  return {
    mockupImageUrl,
    mockupSceneString,
    isLoading,
    isEngineReady,
    setEngineReady,
    renderMockupForProduct: render,
    updateMockupScene,
    resetMockupScene
  };
}
