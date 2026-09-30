/**
 * Type definitions for PPTX Template Import Starterkit
 */
import type { Configuration } from '@cesdk/cesdk-js';
import type { LogMessage } from '@imgly/pptx-importer';

export type ProcessingStatus =
  | 'idle'
  | 'init'
  | 'fetching'
  | 'processing'
  | 'done'
  | 'error';

export interface ExampleFile {
  name: string;
  pptxUrl: string;
  thumbnailBaseUrl: string;
  previewUrl: string;
  alt: string;
}

export interface ProcessResult {
  imageUrl: string;
  sceneArchiveUrl: string;
  messages: LogMessage[];
  fileName: string;
}

export interface FileProcessingContextValue {
  status: ProcessingStatus;
  processMessage: string;
  isProcessing: boolean;
  currentFile: ExampleFile | null;
  result: ProcessResult | null;
  inferenceTime: number;
  error: Error | null;
  editorConfig: Configuration;
  processFile: (file: ExampleFile) => Promise<void>;
  processUploadedFile: (file: File) => Promise<void>;
  resetState: () => void;
}
