/**
 * FileProcessing - Screen orchestrator component
 */
import { useFileProcessing } from '../FileProcessingContext/FileProcessingContext';
import { FileSelection } from '../FileSelection/FileSelection';
import { LoadingScreen } from '../LoadingScreen/LoadingScreen';
import { ResultScreen } from '../ResultScreen/ResultScreen';
import classes from './FileProcessing.module.css';

export function FileProcessing() {
  const { currentFile, result, isProcessing, processMessage, inferenceTime } =
    useFileProcessing();

  return (
    <div className={classes.appContainer}>
      {!currentFile && <FileSelection />}
      {isProcessing && (
        <LoadingScreen
          text={processMessage}
          lastInferenceTime={inferenceTime > 0 ? inferenceTime : undefined}
        />
      )}
      {!!result && <ResultScreen />}
    </div>
  );
}
