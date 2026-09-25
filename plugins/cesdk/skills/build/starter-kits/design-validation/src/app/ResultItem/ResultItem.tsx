/**
 * Validation Result Item Component
 *
 * Displays a single validation result with status indicator and select button.
 */

import type { ValidationResult } from '../Sidebar/Sidebar';
import { resolveAssetPath } from '../resolveAssetPath';

import classes from './ResultItem.module.css';

const ICONS: Record<string, string> = {
  text: '/assets/icons/text.svg',
  image: '/assets/icons/image.svg',
  sticker: '/assets/icons/sticker.svg',
  default: '/assets/icons/shape.svg'
};

interface ResultItemProps {
  result: ValidationResult;
  blockDisplayName: string;
  onSelect: (blockId: number) => void;
}

export function ResultItem({
  result,
  blockDisplayName,
  onSelect
}: ResultItemProps) {
  const iconPath = ICONS[result.blockType] ?? ICONS.default;

  return (
    <div className={classes.item}>
      <div className={classes.itemHeader}>
        <span className={classes.nameWrapper}>
          <span className={`${classes.dot} ${classes[result.state]}`} />
          <span className={classes.name}>{result.validationName}</span>
        </span>
        <button
          className={classes.selectBtn}
          onClick={() => onSelect(result.blockId)}
        >
          Select
        </button>
      </div>
      <div className={classes.blockLabel}>
        <img
          src={resolveAssetPath(iconPath)}
          alt=""
          className={classes.blockIcon}
          width={16}
          height={16}
        />
        <span>{blockDisplayName}</span>
      </div>
    </div>
  );
}
