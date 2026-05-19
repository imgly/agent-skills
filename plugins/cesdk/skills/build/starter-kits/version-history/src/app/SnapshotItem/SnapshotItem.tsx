/**
 * CE.SDK Version History - Snapshot Item Component
 *
 * Renders a single snapshot entry with thumbnail, info, and load button.
 */

import { Snapshot } from '../types';
import { formatDate } from '../../imgly/utils';

interface SnapshotItemProps {
  snapshot: Snapshot;
  onLoad: () => void;
}

export function SnapshotItem({ snapshot, onLoad }: SnapshotItemProps) {
  const { dateLine, timeLine } = formatDate(snapshot.createdAt);

  return (
    <button className="snapshot-item" onClick={onLoad}>
      <img
        alt="Snapshot"
        src={snapshot.thumbnailUrl}
        className="snapshot-item-image"
      />
      <div className="snapshot-item-info">
        <span className="snapshot-item-name">{snapshot.userName}</span>
        <span className="snapshot-item-date">
          {dateLine}
          <br />
          {timeLine}
        </span>
      </div>
      <span className="snapshot-item-button">Load</span>
    </button>
  );
}
