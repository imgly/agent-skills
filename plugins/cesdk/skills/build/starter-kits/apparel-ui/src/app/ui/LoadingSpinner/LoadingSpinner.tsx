import styles from './LoadingSpinner.module.css';

const LoadingSpinner = () => {
  return <div className={styles.spinner} data-cy={'loading-spinner'} />;
};

export default LoadingSpinner;
