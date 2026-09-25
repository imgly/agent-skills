/**
 * Moderation Result Item Component
 *
 * Displays a single moderation result with:
 * - Status indicator dot
 * - Item name
 * - Info icon with tooltip
 * - Select button
 */

import { useState } from 'react';

import type { ModerationResult } from '../../types';
import { resolveAssetPath } from '../../resolveAssetPath';
import { Tooltip } from './Tooltip';

interface ResultItemProps {
  result: ModerationResult;
  onSelect: (blockId: number) => void;
}

export function ResultItem({ result, onSelect }: ResultItemProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [referenceElement, setReferenceElement] =
    useState<HTMLSpanElement | null>(null);

  return (
    <div className="moderation-item" data-block-id={result.blockId}>
      <span className="moderation-item-name-wrapper">
        <span
          className={`moderation-status-dot moderation-status-dot--${result.state}`}
        />
        <span className="moderation-item-name">{result.name}</span>
        <span
          ref={setReferenceElement}
          className="moderation-info-icon"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          <img
            src={resolveAssetPath('/assets/icons/info.svg')}
            alt="Info"
            width="16"
            height="16"
          />
        </span>
        {showTooltip && referenceElement && (
          <Tooltip result={result} referenceElement={referenceElement} />
        )}
      </span>
      <button
        className="moderation-select-btn"
        onClick={() => onSelect(result.blockId)}
      >
        Select
      </button>
    </div>
  );
}
