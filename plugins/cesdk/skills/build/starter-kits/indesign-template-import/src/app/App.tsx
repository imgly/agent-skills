/**
 * InDesign Template Import Starterkit - Main App Component
 */
import type { Configuration } from '@cesdk/cesdk-js';
import './app.css';
import { FileProcessingContextProvider } from './FileProcessingContext/FileProcessingContext';
import { FileProcessing } from './FileProcessing/FileProcessing';

interface AppProps {
  editorConfig: Configuration;
}

export function App({ editorConfig }: AppProps) {
  return (
    <FileProcessingContextProvider editorConfig={editorConfig}>
      <FileProcessing />
    </FileProcessingContextProvider>
  );
}
