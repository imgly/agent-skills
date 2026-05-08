import { resolveAssetPath } from '../utils';

import styles from './EditOverlay.module.css';

const EDIT_ICON_PATH = resolveAssetPath('icons/edit.svg');

interface EditOverlayProps {
  onClick?: (e: React.MouseEvent) => void;
}

export function EditOverlay({ onClick }: EditOverlayProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClick?.(e);
  };

  return (
    <div className={styles.overlay}>
      <button className={styles.button} onClick={handleClick}>
        <img src={EDIT_ICON_PATH} alt="" className={styles.icon} />
        <span>Edit</span>
      </button>
    </div>
  );
}
