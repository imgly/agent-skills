/**
 * CE.SDK Product Editor - Main App Component
 *
 * Orchestrates product-specific React state (current product, selected color)
 * and drives the editor scene through the `product.*` actions registered by
 * the ProductBackdrop plugin.
 */

import { useEffect, useState, type ReactNode } from 'react';
import type CreativeEditorSDK from '@cesdk/cesdk-js';

import { initProductEditor } from '../imgly';

import {
  PRODUCT_SAMPLES,
  ProductConfig,
  ProductColor
} from './product-catalog';
import {
  setupSceneOptions,
  storeProductMetadata,
  readProductFromMetadata,
  downloadProductAssets
} from './utils/product';
import { Sidebar } from './Sidebar/Sidebar';
import styles from './App.module.css';

// ============================================================================
// Types
// ============================================================================

interface AppProps {
  cesdk: CreativeEditorSDK | null;
  children: ReactNode;
}

// ============================================================================
// App Component
// ============================================================================

export default function App({ cesdk, children }: AppProps) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [productId, setProductId] = useState('tshirt');
  const [color, setColor] = useState<ProductColor>(
    PRODUCT_SAMPLES[0].colors.find((color) => color.isDefault) ||
      PRODUCT_SAMPLES[0].colors[0]
  );

  // Initialize product scene when cesdk becomes available
  useEffect(() => {
    if (!cesdk || isInitialized) return;

    const initializeProduct = async () => {
      await initProductEditor(cesdk);

      const defaultProduct = PRODUCT_SAMPLES[0];
      const defaultColor =
        defaultProduct.colors.find((color) => color.isDefault) ||
        defaultProduct.colors[0];

      await cesdk.actions.run(
        'product.setupScene',
        setupSceneOptions(defaultProduct, defaultColor)
      );
      storeProductMetadata(cesdk, defaultProduct, defaultColor);

      await cesdk.actions.run('product.switchArea', defaultProduct.areas[0].id);

      setProductId(defaultProduct.id);
      setColor(defaultColor);
      setIsInitialized(true);
    };

    initializeProduct();
  }, [cesdk, isInitialized]);

  // ============================================================================
  // Callbacks
  // ============================================================================

  const handleProductChange = async (
    product: ProductConfig,
    newColor: ProductColor
  ) => {
    if (!cesdk) return;

    setProductId(product.id);
    setColor(newColor);

    const previousAreaId = (await cesdk.actions.run(
      'product.getVisibleAreaId'
    )) as string | null;

    await cesdk.actions.run(
      'product.setupScene',
      setupSceneOptions(product, newColor)
    );
    storeProductMetadata(cesdk, product, newColor);

    const enabledAreas = product.areas.filter((area) => !area.disabled);
    const targetAreaId =
      enabledAreas.find((area) => area.id === previousAreaId)?.id ??
      enabledAreas[0].id;
    await cesdk.actions.run('product.switchArea', targetAreaId);
  };

  const handleColorChange = async (newColor: ProductColor) => {
    if (!cesdk) return;

    const product =
      PRODUCT_SAMPLES.find((sample) => sample.id === productId) ??
      readProductFromMetadata(cesdk);
    if (!product) return;

    setColor(newColor);

    const enabledAreas = product.areas
      .filter((area) => !area.disabled)
      .map((area) => ({ id: area.id, mockup: area.mockup }));
    await cesdk.actions.run(
      'product.applyVariables',
      { color: newColor.id },
      enabledAreas
    );

    const scene = cesdk.engine.scene.get();
    if (scene != null) {
      cesdk.engine.block.setMetadata(scene, 'color', JSON.stringify(newColor));
    }

    const visibleAreaId = (await cesdk.actions.run(
      'product.getVisibleAreaId'
    )) as string | null;
    await cesdk.actions.run(
      'product.switchArea',
      visibleAreaId ?? product.areas[0].id
    );
  };

  const handleExportRequest = async () => {
    if (!cesdk) return;
    // Export every area to PDF + thumbnail, bundle with the scene archive
    // into a single .zip, and trigger a browser download.
    await downloadProductAssets(cesdk);
  };

  // ============================================================================
  // Render
  // ============================================================================

  return (
    <div className={styles.app}>
      {children}
      <Sidebar
        productId={productId}
        color={color}
        onProductChange={handleProductChange}
        onColorChange={handleColorChange}
        onExportRequest={handleExportRequest}
      />
    </div>
  );
}
