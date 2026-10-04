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
import { EditorProvider } from './contexts/EditorContext';
import { DEMO_ASSETS_BASE_URL } from '../imgly/demo-assets';
import { SelectionProvider } from './contexts/UseSelection';

import PhotoBookUI from './components/PhotoBookUI/PhotoBookUI';

import { initPhotobookEditor } from '../imgly';

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
              await initPhotobookEditor(engine, DEMO_ASSETS_BASE_URL);
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
