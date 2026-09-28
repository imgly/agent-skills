import { useState } from 'react';
import type { Configuration } from '@cesdk/engine';
import classes from './App.module.css';
import { EditorProvider } from './contexts/EditorContext';
import ApparelUI from './components/ApparelUI/ApparelUI';
import { EngineProvider } from './contexts/EngineContext';
import { SinglePageModeProvider } from './contexts/SinglePageModeContext';
import { SelectionProvider } from './contexts/UseSelection';
import { initApparelEditor } from '../imgly';
import type CreativeEngine from '@cesdk/engine';

interface AppProps {
  engineConfig: Partial<Configuration>;
}

const LoadingSpinner = () => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh'
    }}
  >
    <div>Loading...</div>
  </div>
);

const App = ({ engineConfig }: AppProps) => {
  const [engine, setEngine] = useState<CreativeEngine | null>(null);

  // Merge with required defaults
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
    <div className={classes.fullHeightWrapper}>
      <div className={classes.wrapper}>
        <div className={classes.innerWrapper}>
          <EngineProvider
            LoadingComponent={<LoadingSpinner />}
            config={config}
            configure={async (engine) => {
              setEngine(engine);
              await initApparelEditor(engine);
            }}
          >
            <SinglePageModeProvider
              defaultVerticalTextScrollEnabled={true}
              defaultPaddingBottom={92}
              defaultPaddingLeft={40}
              defaultPaddingRight={40}
              defaultPaddingTop={110}
              defaultRefocusCropModeEnabled={false}
              defaultTextScrollTopPadding={null}
              defaultTextScrollBottomPadding={null}
            >
              <EditorProvider>
                <SelectionProvider engine={engine}>
                  <ApparelUI />
                </SelectionProvider>
              </EditorProvider>
            </SinglePageModeProvider>
          </EngineProvider>
        </div>
      </div>
    </div>
  );
};

export default App;
