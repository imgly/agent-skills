/**
 * Mobile UI App Component
 *
 * Main application component that provides the EditorContext
 * and renders the MobileUI interface.
 */

import type { Configuration } from '@cesdk/engine';
import classes from './App.module.css';
import { EditorProvider } from './contexts/EditorContext';
import MobileUI from './components/MobileUI/MobileUI';

interface AppProps {
  engineConfig: Partial<Configuration>;
}

const App = ({ engineConfig }: AppProps) => {
  return (
    <EditorProvider engineConfig={engineConfig}>
      <div className={classes.fullHeightWrapper}>
        <div className={classes.wrapper}>
          <div className={classes.kioskWrapper}>
            <MobileUI />
          </div>
        </div>
      </div>
    </EditorProvider>
  );
};

export default App;
