/**
 * LoadingScreen - Processing indicator component
 */
import { useEffect, useState } from 'react';
import { resolveAssetPath } from '../resolveAssetPath';
import classes from './LoadingScreen.module.css';

interface LoadingScreenProps {
  text: string;
  lastInferenceTime?: number;
}

export function LoadingScreen({ text, lastInferenceTime }: LoadingScreenProps) {
  const [stopwatch, setStopwatch] = useState(0);

  useEffect(() => {
    const startTime = Date.now();

    const timerInstance = setInterval(() => {
      setStopwatch((Date.now() - startTime) / 1000);
    }, 10);

    return () => clearInterval(timerInstance);
  }, []);

  return (
    <div className={classes.cardBlock}>
      <div className={classes.loadingScreen}>
        <img
          src={resolveAssetPath('/icons/spinner.svg')}
          alt="Loading"
          className={classes.spinner}
        />
        <p className={classes.processMessage}>{text}</p>
        <p className={classes.processStatus}>
          {stopwatch.toFixed(2)}s
          {lastInferenceTime && ` / ${lastInferenceTime.toFixed(2)}s`}
        </p>
      </div>
    </div>
  );
}
