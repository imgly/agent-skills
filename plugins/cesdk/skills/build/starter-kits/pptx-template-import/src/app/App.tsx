/**
 * PPTX Template Import Starterkit - Main App Component
 */
import type { Configuration } from '@cesdk/cesdk-js';
import './app.css';
import { FileProcessingContextProvider } from './FileProcessingContext/FileProcessingContext';
import { FileProcessing } from './FileProcessing/FileProcessing';

// START_HIDDEN_BLOCK
import { useEffect } from 'react';
// END_HIDDEN_BLOCK
// START_HIDDEN_BLOCK
import { reportDemoPhase } from '../../../shared/demo-preview/lifecycle';
// END_HIDDEN_BLOCK

interface AppProps {
  editorConfig: Configuration;
}

export function App({ editorConfig }: AppProps) {
  // START_HIDDEN_BLOCK
  // The editor mounts only after the visitor acts, so the shell
  // being on screen is the end of this demo's automatic load.
  useEffect(() => {
    reportDemoPhase('shell');
  }, []);
  // END_HIDDEN_BLOCK
  return (
    <FileProcessingContextProvider editorConfig={editorConfig}>
      <FileProcessing />
    </FileProcessingContextProvider>
  );
}
