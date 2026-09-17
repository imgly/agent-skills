/**
 * FileProcessing - Screen orchestrator component
 */
import { useFileProcessing } from '../FileProcessingContext/FileProcessingContext';
import { FileSelection } from '../FileSelection/FileSelection';
import { LoadingScreen } from '../LoadingScreen/LoadingScreen';
import { ResultScreen } from '../ResultScreen/ResultScreen';
import classes from './FileProcessing.module.css';

export function FileProcessing() {
  const {
    currentFile,
    result,
    status,
    isProcessing,
    processMessage,
    inferenceTime,
    processFile
  } = useFileProcessing();

  return (
    <div className={classes.appContainer}>
      {!currentFile && <FileSelection />}
      {isProcessing && (
        <LoadingScreen
          text={processMessage}
          lastInferenceTime={inferenceTime > 0 ? inferenceTime : undefined}
        />
      )}
      {status === 'error' && (
        <div className={classes.error} role="alert">
          <p className={classes.errorText}>Failed to import</p>
          <button
            className="btn btn-primary"
            onClick={() => currentFile && processFile(currentFile)}
          >
            Retry
          </button>
        </div>
      )}
      {!!result && <ResultScreen />}
    </div>
  );
}
