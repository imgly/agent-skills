/**
 * CE.SDK Photobook UI - Main Application Component
 *
 * A complete custom photobook editor with multi-page navigation,
 * custom layouts, stickers, and full editing controls.
 */

import { useState } from 'react';
import type { Configuration } from '@cesdk/engine';
import {
  ImageColorsAssetSource,
  ColorPaletteAssetSource,
  TextAssetSource,
  TextComponentAssetSource,
  TypefaceAssetSource,
  UploadAssetSources,
  VectorShapeAssetSource
} from '@cesdk/cesdk-js/plugins';

import { EngineProvider } from './contexts/EngineContext';
import { SinglePageModeProvider } from './contexts/SinglePageModeContext';
import { PagePreviewProvider } from './contexts/PagePreviewContext';
import { EditorProvider } from './contexts/EditorContext';
import { SelectionProvider } from './contexts/UseSelection';

import PhotoBookUI from './components/PhotoBookUI/PhotoBookUI';

import {
  PHOTOBOOK_LAYOUTS,
  PHOTOBOOK_STICKERS,
  createUnsplashSource,
  loadAssetSourceFromContentJSON
} from '../imgly';
import { createApplyLayoutAsset } from '../imgly/utils/apply-layout';

import styles from './App.module.css';

interface AppProps {
  engineConfig: Partial<Configuration>;
}

// Loading component
function LoadingSpinner() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        fontSize: '18px',
        color: '#666'
      }}
    >
      Loading...
    </div>
  );
}

export default function App({ engineConfig }: AppProps) {
  const [engine, setEngine] = useState(null);

  const config: Partial<Configuration> = {
    baseURL: import.meta.env.VITE_IMGLY_LOCAL_ASSETS_URL,
    role: 'Adopter',
    ...engineConfig,
    featureFlags: {
      preventScrolling: true,
      ...engineConfig.featureFlags
    }
  };

  return (
    <div className={styles.fullHeightWrapper}>
      <div className={styles.wrapper}>
        <div className={styles.innerWrapper}>
          <EngineProvider
            LoadingComponent={<LoadingSpinner />}
            config={config}
            configure={async (engine) => {
              setEngine(engine);
              engine.editor.setSetting('page/title/show', false);
              engine.editor.setRole('Adopter');

              // Add asset sources
              await engine.addPlugin(new ImageColorsAssetSource());
              await engine.addPlugin(new ColorPaletteAssetSource());
              await engine.addPlugin(new TypefaceAssetSource());
              await engine.addPlugin(new TextAssetSource());
              await engine.addPlugin(new TextComponentAssetSource());
              await engine.addPlugin(
                new VectorShapeAssetSource({
                  include: ['ly.img.vector.shape.filled.*']
                })
              );
              await engine.addPlugin(
                new UploadAssetSources({
                  include: [
                    'ly.img.image.upload',
                    'ly.img.video.upload',
                    'ly.img.audio.upload'
                  ]
                })
              );

              // Load custom assets
              // Use absolute URL to avoid double-slash issues
              const baseUrl = new URL(
                import.meta.env.BASE_URL,
                window.location.origin
              ).href.replace(/\/$/, '');
              loadAssetSourceFromContentJSON(
                engine,
                PHOTOBOOK_STICKERS,
                baseUrl
              );
              loadAssetSourceFromContentJSON(
                engine,
                PHOTOBOOK_LAYOUTS,
                baseUrl,
                createApplyLayoutAsset(engine)
              );

              engine.editor.setGlobalScope('lifecycle/destroy', 'Defer');

              engine.asset.addSource(createUnsplashSource(engine));
            }}
          >
            <SinglePageModeProvider
              defaultVerticalTextScrollEnabled
              defaultPaddingBottom={92}
              defaultPaddingLeft={40}
              defaultPaddingRight={40}
              defaultPaddingTop={110}
              defaultRefocusCropModeEnabled={false}
              defaultTextScrollTopPadding={null}
              defaultTextScrollBottomPadding={null}
            >
              <PagePreviewProvider>
                <EditorProvider>
                  <SelectionProvider engine={engine}>
                    <PhotoBookUI />
                  </SelectionProvider>
                </EditorProvider>
              </PagePreviewProvider>
            </SinglePageModeProvider>
          </EngineProvider>
        </div>
      </div>
    </div>
  );
}
