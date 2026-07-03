/**
 * LoadingOverlay Component
 *
 * Full-screen loading indicator displayed during initialization.
 */

import styles from './LoadingOverlay.module.css';

export function LoadingOverlay() {
  return (
    <div className={styles.overlay}>
      <div className={styles.content}>
        <div className={styles.spinner} />
        <p className={styles.text}>Initializing...</p>
      </div>
    </div>
  );
}
