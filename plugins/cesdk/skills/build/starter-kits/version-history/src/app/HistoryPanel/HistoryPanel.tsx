/**
 * CE.SDK Version History - History Panel Component
 *
 * Displays the list of saved snapshots in a sidebar.
 */

import { Snapshot } from '../types';
import { SnapshotItem } from '../SnapshotItem/SnapshotItem';
import './HistoryPanel.css';

interface HistoryPanelProps {
  snapshots: Snapshot[];
  onLoadSnapshot: (snapshot: Snapshot) => void;
}

export function HistoryPanel({ snapshots, onLoadSnapshot }: HistoryPanelProps) {
  return (
    <div className="sidebar" id="sidebar">
      <div className="sidebar-header">
        <h2 className="sidebar-headline">History</h2>
        <span className="snapshot-count" id="snapshot-count">
          {snapshots.length} Snapshot{snapshots.length !== 1 ? 's' : ''}
        </span>
      </div>
      <div className="snapshot-list" id="snapshot-list">
        {snapshots.map((snapshot, index) => (
          <div key={snapshot.createdAt}>
            {index > 0 && <hr className="snapshot-divider" />}
            <SnapshotItem
              snapshot={snapshot}
              onLoad={() => onLoadSnapshot(snapshot)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
