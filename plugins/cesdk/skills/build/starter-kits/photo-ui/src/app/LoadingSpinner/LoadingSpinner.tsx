/**
 * Loading Spinner Component
 *
 * Simple loading spinner for async operations.
 */

import LoadingIcon from '../icons/LoadingSpinner.svg';
import classes from './LoadingSpinner.module.css';

export default function LoadingSpinner() {
  return (
    <div className={classes.wrapper}>
      <div className={classes.spinner}>
        <LoadingIcon />
      </div>
    </div>
  );
}
