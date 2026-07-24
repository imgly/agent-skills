/**
 * CE.SDK Postcard UI - Main Application Component
 *
 * A custom postcard editor with front/back editing, stickers,
 * text, and image composition.
 */

import { useState } from 'react';
import type CreativeEngine from '@cesdk/engine';
import type { Configuration } from '@cesdk/engine';
import classes from './App.module.css';
import { EditorProvider } from './contexts/EditorContext';
import { PageSettingsProvider } from './contexts/PageSettingsContext';
import PostcardUI from '@/app/layout/PostcardUI/PostcardUI';
import { EngineProvider } from '@/app/contexts/EngineContext';
import { SinglePageModeProvider } from '@/app/contexts/SinglePageModeContext';
import { SelectionProvider } from '@/app/contexts/SelectionContext';
import LoadingSpinner from '@/app/components/LoadingSpinner/LoadingSpinner';
import { initPostcardEditor } from '@/imgly';

interface AppProps {
  engineConfig: Partial<Configuration>;
}

const App: React.FC<AppProps> = ({ engineConfig }) => {
  const [engine, setEngine] = useState<CreativeEngine | null>(null);

  // Merge with required defaults
  const config: Partial<Configuration> = {
    baseURL: import.meta.env.VITE_IMGLY_LOCAL_ASSETS_URL,
    ...engineConfig,
    featureFlags: {
      preventScrolling: true,
      ...engineConfig.featureFlags
    }
  };

  const configureEngine = async (engine: CreativeEngine) => {
    setEngine(engine);
    await initPostcardEditor(engine);
  };

  return (
    <div className={classes.fullHeightWrapper}>
      <div className={classes.wrapper}>
        <div className={classes.innerWrapper}>
          <EngineProvider
            LoadingComponent={<LoadingSpinner />}
            config={config}
            configure={configureEngine}
          >
            <SinglePageModeProvider
              defaultVerticalTextScrollEnabled={true}
              defaultRefocusCropModeEnabled={false}
              defaultTextScrollTopPadding={110}
              defaultTextScrollBottomPadding={92}
              defaultPaddingBottom={92}
              defaultPaddingLeft={40}
              defaultPaddingRight={40}
              defaultPaddingTop={110}
            >
              <EditorProvider>
                <PageSettingsProvider>
                  <SelectionProvider engine={engine}>
                    <PostcardUI />
                  </SelectionProvider>
                </PageSettingsProvider>
              </EditorProvider>
            </SinglePageModeProvider>
          </EngineProvider>
        </div>
      </div>
    </div>
  );
};

export default App;
