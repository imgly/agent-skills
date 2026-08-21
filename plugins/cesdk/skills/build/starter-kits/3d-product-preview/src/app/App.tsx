/**
 * CE.SDK 3D Mockup Editor - Main Application Component
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import CreativeEditor from '@cesdk/cesdk-js/react';
import type CreativeEditorSDK from '@cesdk/cesdk-js';
import type { Configuration } from '@cesdk/cesdk-js';

import { init3dProductPreviewEditor, disposeMockupRenderer } from '../imgly';
import { useMockupRenderer } from './hooks/useMockupRenderer';
import { Topbar } from './Topbar/Topbar';
import { Mockup3DPreview } from './Mockup3DPreview/Mockup3DPreview';
import { PRODUCTS, getDesignSceneUrl, getModelUrl } from './constants';
import styles from './App.module.css';

// Default product to load on startup
const DEFAULT_PRODUCT_KEY = 'apparel';

interface AppProps {
  config: Configuration;
}

export default function App({ config }: AppProps) {
  const designEngineRef = useRef<CreativeEditorSDK | null>(null);

  const [currentProductKey, setCurrentProductKey] =
    useState(DEFAULT_PRODUCT_KEY);
  const [isProductSwitching, setIsProductSwitching] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const sceneLoadRef = useRef(0);

  // Mockup rendering - engine is lazily initialized inside renderMockup
  const {
    mockupImageUrl,
    isLoading,
    setEngineReady,
    renderMockupForProduct,
    resetMockupScene
  } = useMockupRenderer({ designEngineRef, config });

  // Use refs to keep callbacks stable for handleEditorInit
  const renderMockupForProductRef = useRef(renderMockupForProduct);
  renderMockupForProductRef.current = renderMockupForProduct;

  const setEngineReadyRef = useRef(setEngineReady);
  setEngineReadyRef.current = setEngineReady;

  // ============================================================================
  // Product Switching
  // ============================================================================

  const handleProductChange = useCallback(
    async (productKey: string) => {
      const designEngine = designEngineRef.current;
      if (!designEngine || productKey === currentProductKey) return;

      const sceneLoad = ++sceneLoadRef.current;
      setIsProductSwitching(true);
      setCurrentProductKey(productKey);
      resetMockupScene();

      try {
        const sceneUrl = getDesignSceneUrl(productKey);
        await designEngine.engine.scene.load(sceneUrl);
        if (sceneLoad !== sceneLoadRef.current) return;

        // Zoom to fit the first page
        await designEngine.actions.run('zoom.toPage', {
          page: 'first',
          autoFit: true
        });
        if (sceneLoad !== sceneLoadRef.current) return;

        await renderMockupForProduct(productKey, undefined);
      } finally {
        if (sceneLoad === sceneLoadRef.current) setIsProductSwitching(false);
      }
    },
    [currentProductKey, renderMockupForProduct, resetMockupScene]
  );

  // ============================================================================
  // Fullscreen Handler
  // ============================================================================

  const handleToggleFullscreen = useCallback(() => {
    setIsFullscreen((value) => !value);
  }, []);

  // ============================================================================
  // Editor Initialization
  // ============================================================================

  // Stable callback that doesn't change - uses refs for latest values
  const handleEditorInit = useCallback(
    async (cesdk: CreativeEditorSDK) => {
      designEngineRef.current = cesdk;

      const sceneLoad = ++sceneLoadRef.current;
      await init3dProductPreviewEditor(cesdk);

      await cesdk.load(getDesignSceneUrl(DEFAULT_PRODUCT_KEY));

      setEngineReadyRef.current();
      setIsInitializing(false);

      if (sceneLoad !== sceneLoadRef.current) return;

      // Zoom to fit the first page
      await cesdk.actions.run('zoom.toPage', { page: 'first', autoFit: true });
      if (sceneLoad !== sceneLoadRef.current) return;

      // Render initial mockup (engine initializes lazily on first render)
      await renderMockupForProductRef.current(DEFAULT_PRODUCT_KEY);
    },
    [] // Empty deps - uses refs for latest callbacks
  );

  // ============================================================================
  // Cleanup
  // ============================================================================

  useEffect(() => {
    return () => {
      disposeMockupRenderer();
    };
  }, []);

  // ============================================================================
  // Render
  // ============================================================================

  const product = PRODUCTS[currentProductKey];

  return (
    <div className={styles.app}>
      <Topbar
        currentProductKey={currentProductKey}
        onProductChange={handleProductChange}
        disabled={isProductSwitching || isInitializing}
      />

      <div className={styles.mainLayout}>
        <Mockup3DPreview
          mockupImageUrl={mockupImageUrl}
          modelUrl={getModelUrl(currentProductKey)}
          cameraOrbit={product.cameraOrbit}
          baseColorTextureIndex={product.baseColorTextureIndex}
          isLoading={isLoading}
          isFullscreen={isFullscreen}
          onToggleFullscreen={handleToggleFullscreen}
        />

        <div
          className={`${styles.editorWrapper} ${isFullscreen ? styles.hidden : ''}`}
        >
          <CreativeEditor
            className={styles.editor}
            config={config}
            init={handleEditorInit}
          />
        </div>
      </div>
    </div>
  );
}
