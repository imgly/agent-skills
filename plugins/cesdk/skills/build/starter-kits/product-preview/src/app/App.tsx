/**
 * CE.SDK Mockup Editor - Main Application Component
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import CreativeEditor from '@cesdk/cesdk-js/react';
import type CreativeEditorSDK from '@cesdk/cesdk-js';
import type { Configuration } from '@cesdk/cesdk-js';

import {
  initProductPreviewDesignEditor,
  disposeMockupRenderer
} from '../imgly';
import { downloadMockup, getDesignSceneUrl } from './utils';
import { useMockupRenderer } from './hooks/useMockupRenderer';
import { Topbar } from './Topbar/Topbar';
import { Sidebar } from './Sidebar/Sidebar';
import styles from './App.module.css';

interface AppProps {
  config: Configuration;
}

export default function App({ config }: AppProps) {
  const designEngineRef = useRef<CreativeEditorSDK | null>(null);
  const designSceneStringRef = useRef<string | null>(null);
  const INITIAL_PRODUCT_KEY = 'postcard';

  const [currentProductKey, setCurrentProductKey] =
    useState(INITIAL_PRODUCT_KEY);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isProductSwitching, setIsProductSwitching] = useState(false);

  // Mockup rendering - engine is lazily initialized inside renderMockup
  const {
    mockupImageUrl,
    mockupSceneString,
    isLoading,
    setEngineReady,
    renderMockupForProduct,
    updateMockupScene,
    resetMockupScene
  } = useMockupRenderer({ designEngineRef, config });

  const renderMockupForProductRef = useRef(renderMockupForProduct);
  renderMockupForProductRef.current = renderMockupForProduct;

  const setEngineReadyRef = useRef(setEngineReady);
  setEngineReadyRef.current = setEngineReady;

  const mockupSceneStringRef = useRef<string | undefined>(mockupSceneString);
  mockupSceneStringRef.current = mockupSceneString;

  // ============================================================================
  // Product Switching
  // ============================================================================

  const handleProductChange = useCallback(
    async (productKey: string) => {
      const designEngine = designEngineRef.current;
      if (!designEngine || productKey === currentProductKey) return;

      setIsProductSwitching(true);
      setCurrentProductKey(productKey);
      resetMockupScene();
      designSceneStringRef.current = null;

      try {
        const sceneUrl = getDesignSceneUrl(productKey);
        await designEngine.engine.scene.loadFromURL(sceneUrl);

        // Zoom to fit the first page
        await designEngine.actions.run('zoom.toPage', {
          page: 'first',
          autoFit: true
        });

        await renderMockupForProduct(productKey, undefined);
      } finally {
        setIsProductSwitching(false);
      }
    },
    [currentProductKey, renderMockupForProduct, resetMockupScene]
  );

  // ============================================================================
  // Mockup Scene Save
  // ============================================================================

  const handleMockupSceneSave = useCallback(
    async (sceneString: string) => {
      await updateMockupScene(sceneString, currentProductKey);
    },
    [currentProductKey, updateMockupScene]
  );

  // ============================================================================
  // Download
  // ============================================================================

  const handleDownload = useCallback(() => {
    if (!mockupImageUrl) return;
    downloadMockup(mockupImageUrl, currentProductKey);
  }, [mockupImageUrl, currentProductKey]);

  // ============================================================================
  // Editor Initialization
  // ============================================================================

  const handleEditorInit = useCallback(async (cesdk: CreativeEditorSDK) => {
    designEngineRef.current = cesdk;

    await initProductPreviewDesignEditor(cesdk);

    const savedDesignScene = designSceneStringRef.current;
    if (savedDesignScene) {
      try {
        await cesdk.engine.scene.loadFromString(savedDesignScene);
      } catch {
        await cesdk.loadFromURL(getDesignSceneUrl(INITIAL_PRODUCT_KEY));
      }
    } else {
      await cesdk.loadFromURL(getDesignSceneUrl(INITIAL_PRODUCT_KEY));
    }

    // Zoom to fit the first page
    await cesdk.actions.run('zoom.toPage', { page: 'first', autoFit: true });

    setEngineReadyRef.current();

    await renderMockupForProductRef.current(
      INITIAL_PRODUCT_KEY,
      mockupSceneStringRef.current
    );
  }, []);

  // ============================================================================
  // Cleanup
  // ============================================================================

  useEffect(() => {
    return () => {
      disposeMockupRenderer();
    };
  }, []);

  // ============================================================================
  // Fullscreen Handler
  // ============================================================================

  const handleFullscreenChange = useCallback(async (fullscreen: boolean) => {
    if (fullscreen) {
      const cesdk = designEngineRef.current;
      if (cesdk) {
        try {
          designSceneStringRef.current =
            await cesdk.engine.scene.saveToString();
        } catch {
          designSceneStringRef.current = null;
        }
      }
      designEngineRef.current = null;
    }
    setIsFullscreen(fullscreen);
  }, []);

  // ============================================================================
  // Render
  // ============================================================================

  return (
    <div className={styles.app}>
      <Topbar
        currentProductKey={currentProductKey}
        onProductChange={handleProductChange}
        disabled={isProductSwitching}
      />

      <div
        className={`${styles.mainLayout} ${isFullscreen ? styles.fullscreenLayout : ''}`}
      >
        <Sidebar
          currentProductKey={currentProductKey}
          mockupImageUrl={mockupImageUrl}
          mockupSceneString={mockupSceneString}
          isLoading={isLoading}
          isFullscreen={isFullscreen}
          license={config.license}
          baseURL={config.baseURL}
          onFullscreenChange={handleFullscreenChange}
          onMockupSceneSave={handleMockupSceneSave}
          onDownload={handleDownload}
        />

        {!isFullscreen && (
          <div className={styles.editorWrapper}>
            <CreativeEditor
              className={styles.editor}
              config={config}
              init={handleEditorInit}
            />
          </div>
        )}
      </div>
    </div>
  );
}
