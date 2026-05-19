/**
 * CE.SDK Version History - Snapshots Store
 *
 * A simple store for managing snapshot state. This module handles all snapshot
 * storage and notifies subscribers when snapshots change.
 *
 * This approach keeps all version history logic in the imgly/ module,
 * making the React components simple consumers of the state.
 */

import { Snapshot } from '../app/types';
import { resolveAssetPath } from './resolveAssetPath';

// ============================================================================
// Initial Snapshots Data (from CDN)
// ============================================================================

export const INITIAL_SNAPSHOTS: Snapshot[] = [
  {
    thumbnailUrl: resolveAssetPath('/assets/snapshots/1/thumbnail.png'),
    sceneUrl: resolveAssetPath('/assets/snapshots/1/scene.scene'),
    createdAt: '2023-11-30T08:00:00.000Z',
    userName: 'Patrick S.'
  },
  {
    thumbnailUrl: resolveAssetPath('/assets/snapshots/2/thumbnail.png'),
    sceneUrl: resolveAssetPath('/assets/snapshots/2/scene.scene'),
    createdAt: '2023-11-29T14:00:00.000Z',
    userName: 'Dustin K.'
  },
  {
    thumbnailUrl: resolveAssetPath('/assets/snapshots/3/thumbnail.png'),
    sceneUrl: resolveAssetPath('/assets/snapshots/3/scene.scene'),
    createdAt: '2023-11-28T12:00:00.000Z',
    userName: 'Marius W.'
  }
];

// ============================================================================
// Snapshots Store
// ============================================================================

/** Current snapshots array */
let snapshots: Snapshot[] = [...INITIAL_SNAPSHOTS];

/** Set of listener callbacks to notify on changes */
const listeners: Set<() => void> = new Set();

/**
 * Get the current snapshots array.
 *
 * @returns The current array of snapshots
 */
export function getSnapshots(): Snapshot[] {
  return snapshots;
}

/**
 * Get the initial scene URL to load.
 *
 * @returns The URL of the first snapshot's scene
 */
export function getInitialSceneUrl(): string {
  return INITIAL_SNAPSHOTS[0].sceneUrl;
}

/**
 * Add a new snapshot to the store.
 *
 * The new snapshot is prepended to the array (newest first).
 * All subscribers are notified of the change.
 *
 * @param snapshot - The snapshot to add
 */
export function addSnapshot(snapshot: Snapshot): void {
  snapshots = [snapshot, ...snapshots];
  listeners.forEach((listener) => listener());
}

/**
 * Subscribe to snapshot changes.
 *
 * The callback is invoked whenever snapshots are added or removed.
 * Returns an unsubscribe function.
 *
 * @param listener - Callback to invoke when snapshots change
 * @returns Unsubscribe function
 *
 * @example
 * ```typescript
 * const unsubscribe = subscribeToSnapshots(() => {
 *   console.log('Snapshots changed:', getSnapshots());
 * });
 *
 * // Later, when no longer needed:
 * unsubscribe();
 * ```
 */
export function subscribeToSnapshots(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
