/**
 * CE.SDK Product Editor - Download Link Component
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
        This is a demo. Download generated assets{' '}
        <button className={styles.link} onClick={onClick}>
          here
        </button>
        .
      </p>
    </section>
  );
}
