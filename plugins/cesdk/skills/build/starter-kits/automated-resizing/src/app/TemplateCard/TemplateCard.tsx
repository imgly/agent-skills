import classNames from 'classnames';

import type { Template } from '../../imgly';
import { EditOverlay } from '../EditOverlay/EditOverlay';
import { resolveAssetPath } from '../utils';

import styles from './TemplateCard.module.css';

interface TemplateCardProps {
  template: Template;
  index: number;
  isSelected: boolean;
  onClick: () => void;
  onEdit: () => void;
}

export function TemplateCard({
  template,
  index,
  isSelected,
  onClick,
  onEdit
}: TemplateCardProps) {
  const handleClick = () => {
    if (isSelected) {
      onEdit();
    } else {
      onClick();
    }
  };

  return (
    <div
      className={classNames(styles.card, { [styles.selected]: isSelected })}
      onClick={handleClick}
    >
      <img
        src={resolveAssetPath(template.previewImagePath)}
        alt={`Template ${index + 1}`}
        className={styles.preview}
      />
      {isSelected && <EditOverlay onClick={onEdit} />}
    </div>
  );
}
