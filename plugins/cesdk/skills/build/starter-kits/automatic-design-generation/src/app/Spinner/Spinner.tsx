import styles from './Spinner.module.css';

export function Spinner() {
  return (
    <div className={styles.loadingSpinner}>
      <div className={styles.spinner} />
    </div>
  );
}
