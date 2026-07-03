/**
 * CE.SDK T-Shirt Designer - Download Link Component
 *
 * Displays the demo download link for exporting assets.
 */

import styles from './DownloadLink.module.css';

interface DownloadLinkProps {
  onClick: () => void;
}

export function DownloadLink({ onClick }: DownloadLinkProps) {
  return (
    <section className={styles.section}>
      <p className={styles.text}>
        This is just a demo, but you can download the generated example assets{' '}
        <button className={styles.link} onClick={onClick}>
          here
        </button>
        .
      </p>
    </section>
  );
}
