/**
 * CE.SDK Photobook UI - Main Application Component
 *
 * A complete custom photobook editor with multi-page navigation,
 * custom layouts, stickers, and full editing controls.
 */

import { useState } from 'react';
import type { Configuration } from '@cesdk/engine';

import { EngineProvider } from './contexts/EngineContext';
import { SinglePageModeProvider } from './contexts/SinglePageModeContext';
import { PagePreviewProvider } from './contexts/PagePreviewContext';
import { DEMO_ASSETS_BASE_URL, EditorProvider } from './contexts/EditorContext';
import { SelectionProvider } from './contexts/UseSelection';

import PhotoBookUI from './components/PhotoBookUI/PhotoBookUI';

import {
  PHOTOBOOK_LAYOUTS,
  PHOTOBOOK_STICKERS,
  createUnsplashSource,
  loadAssetSourceFromContentJSON
} from '../imgly';
import { createApplyLayoutAsset } from '../imgly/utils/apply-layout';
import { createImageColorsSource } from '../imgly/utils/imageColorsSource';

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

              // Add default asset sources via the engine-native asset API.
              // The engine resolves each `content.json` relative to `baseURL`.
              const baseURL = engine.getBaseURL();

              // Image colors: virtual source built from the scene's images.
              engine.asset.addSource(createImageColorsSource(engine));

              // Content sources loaded from bundled `content.json` files.
              await Promise.all(
                [
                  { id: 'ly.img.color.palette' },
                  { id: 'ly.img.typeface' },
                  // Text style presets live in three engine-side sources.
                  { id: 'ly.img.text' },
                  { id: 'ly.img.text.styles' },
                  { id: 'ly.img.text.curves' },
                  { id: 'ly.img.text.components' },
                  {
                    id: 'ly.img.vector.shape',
                    matcher: ['ly.img.vector.shape.filled.*']
                  }
                ].map(({ id, matcher }) =>
                  engine.asset.addLocalAssetSourceFromJSONURI(
                    `${baseURL}${id}/content.json`,
                    { matcher }
                  )
                )
              );

              // Local upload sources for images, videos, and audio.
              engine.asset.addLocalSource('ly.img.image.upload', [
                'image/jpeg',
                'image/png',
                'image/webp',
                'image/svg+xml',
                'image/bmp',
                'image/gif',
                'image/apng'
              ]);
              engine.asset.addLocalSource('ly.img.video.upload', [
                'application/json',
                'video/mp4',
                'video/quicktime',
                'video/webm',
                'video/matroska',
                'image/gif',
                'image/apng'
              ]);
              engine.asset.addLocalSource('ly.img.audio.upload', [
                'audio/mpeg',
                'audio/mp3',
                'audio/x-m4a',
                'audio/wav'
              ]);

              // Load custom assets
              loadAssetSourceFromContentJSON(
                engine,
                PHOTOBOOK_STICKERS,
                DEMO_ASSETS_BASE_URL
              );
              loadAssetSourceFromContentJSON(
                engine,
                PHOTOBOOK_LAYOUTS,
                DEMO_ASSETS_BASE_URL,
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
