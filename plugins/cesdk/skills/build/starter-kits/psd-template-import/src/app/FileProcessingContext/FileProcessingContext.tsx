/**
 * FileProcessingContext - Manages PSD file processing state
 */
import type { Configuration } from '@cesdk/cesdk-js';
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState
} from 'react';
import { importPsdFile } from '../../imgly/plugins/psd-importer';
import type {
  ExampleFile,
  FileProcessingContextValue,
  ProcessingStatus,
  ProcessResult
} from '../types';

const STATUS_MESSAGES: Record<ProcessingStatus, string> = {
  idle: '',
  init: 'Initializing engine...',
  fetching: 'Loading PSD file...',
  processing: 'Processing PSD file...',
  done: '',
  error: 'Error: Failed to process PSD file'
};

const PROCESSING_STATUSES: ProcessingStatus[] = [
  'init',
  'fetching',
  'processing'
];

const FileProcessingContext = createContext<
  FileProcessingContextValue | undefined
>(undefined);

interface FileProcessingContextProviderProps {
  children: React.ReactNode;
  editorConfig: Configuration;
}

/**
 * Revokes object URLs from an import result to free memory.
 * Called at the app level when the result is no longer needed.
 */
function revokeImportResult(result: ProcessResult): void {
  URL.revokeObjectURL(result.imageUrl);
  URL.revokeObjectURL(result.sceneArchiveUrl);
}

export function FileProcessingContextProvider({
  children,
  editorConfig
}: FileProcessingContextProviderProps) {
  const [status, setStatus] = useState<ProcessingStatus>('idle');
  const [result, setResult] = useState<ProcessResult | null>(null);
  const [currentFile, setCurrentFile] = useState<ExampleFile | null>(null);
  const [inferenceTime, setInferenceTime] = useState(0);
  const [error, setError] = useState<Error | null>(null);

  const processMessage = useMemo(() => STATUS_MESSAGES[status], [status]);
  const isProcessing = useMemo(
    () => PROCESSING_STATUSES.includes(status),
    [status]
  );

  const resetState = useCallback(() => {
    // Revoke any existing URLs at the app level
    if (result) {
      revokeImportResult(result);
    }
    setStatus('idle');
    setCurrentFile(null);
    setResult(null);
    setInferenceTime(0);
    setError(null);
  }, [result]);

  const processPSDBlob = useCallback(
    async (blob: Blob, fileName: string) => {
      const startTime = Date.now();

      setStatus('init');
      setError(null);

      try {
        setStatus('processing');

        // Import PSD file using the functional API
        const importResult = await importPsdFile(blob, fileName, {
          license: editorConfig.license,
          baseURL: editorConfig.baseURL
        });

        // Calculate inference time
        const timeDiffInSeconds = (Date.now() - startTime) / 1000;
        setInferenceTime(timeDiffInSeconds);

        setResult(importResult);
        setStatus('done');
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Failed to process PSD file:', err);
        setError(err instanceof Error ? err : new Error('Unknown error'));
        setStatus('error');
        throw err;
      }
    },
    [editorConfig.baseURL]
  );

  const processFile = useCallback(
    async (file: ExampleFile) => {
      setCurrentFile(file);
      setStatus('fetching');

      try {
        const response = await fetch(file.psdUrl);
        const blob = await response.blob();
        await processPSDBlob(blob, file.name);
      } catch (err) {
        // Error already handled in processPSDBlob
        setStatus('idle');
      }
    },
    [processPSDBlob]
  );

  const processUploadedFile = useCallback(
    async (file: File) => {
      // Create a pseudo ExampleFile for uploaded files
      setCurrentFile({
        name: file.name,
        psdUrl: URL.createObjectURL(file),
        thumbnailBaseUrl: '',
        previewUrl: '',
        alt: file.name
      });

      setStatus('fetching');

      try {
        await processPSDBlob(file, file.name);
      } catch (err) {
        // Error already handled in processPSDBlob
        setStatus('idle');
      }
    },
    [processPSDBlob]
  );

  const value = useMemo(
    () => ({
      status,
      processMessage,
      isProcessing,
      currentFile,
      result,
      inferenceTime,
      error,
      editorConfig,
      processFile,
      processUploadedFile,
      resetState
    }),
    [
      status,
      processMessage,
      isProcessing,
      currentFile,
      result,
      inferenceTime,
      error,
      editorConfig,
      processFile,
      processUploadedFile,
      resetState
    ]
  );

  return (
    <FileProcessingContext.Provider value={value}>
      {children}
    </FileProcessingContext.Provider>
  );
}

export function useFileProcessing(): FileProcessingContextValue {
  const context = useContext(FileProcessingContext);
  if (context === undefined) {
    throw new Error(
      'useFileProcessing must be used within a FileProcessingContextProvider'
    );
  }
  return context;
}
