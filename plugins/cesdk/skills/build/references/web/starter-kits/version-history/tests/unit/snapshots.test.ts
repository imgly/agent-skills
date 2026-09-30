import { describe, expect, it } from 'vitest';

import {
  addSnapshot,
  getInitialSceneUrl,
  getSnapshots,
  INITIAL_SNAPSHOTS,
  subscribeToSnapshots,
  type Snapshot
} from '../../src/imgly/snapshots';

describe('VH-U2 the seeded snapshots (Qase 2108)', () => {
  it('ships three snapshots, newest first', () => {
    expect(INITIAL_SNAPSHOTS).toHaveLength(3);
    expect(INITIAL_SNAPSHOTS.map((s) => s.userName)).toEqual([
      'Patrick S.',
      'Dustin K.',
      'Marius W.'
    ]);

    const timestamps = INITIAL_SNAPSHOTS.map((s) => Date.parse(s.createdAt));
    expect(timestamps[0]).toBeGreaterThan(timestamps[1]);
    expect(timestamps[1]).toBeGreaterThan(timestamps[2]);
  });

  it.each([1, 2, 3])('points snapshot %i at its own asset folder', (index) => {
    const snapshot = INITIAL_SNAPSHOTS[index - 1];
    expect(snapshot.thumbnailUrl).toContain(
      `/assets/snapshots/${index}/thumbnail.png`
    );
    expect(snapshot.sceneUrl).toContain(
      `/assets/snapshots/${index}/scene.scene`
    );
  });

  it('loads the newest snapshot at start-up', () => {
    expect(getInitialSceneUrl()).toBe(INITIAL_SNAPSHOTS[0].sceneUrl);
  });
});

describe('VH-U3 the snapshot store', () => {
  const added: Snapshot = {
    thumbnailUrl: 'blob:thumbnail',
    sceneUrl: 'blob:scene',
    createdAt: '2024-02-01T10:00:00.000Z',
    userName: 'Anonymous'
  };

  it('starts at the seeded snapshots, prepends and notifies', () => {
    expect(getSnapshots()).toEqual(INITIAL_SNAPSHOTS);

    const seen: number[] = [];
    const unsubscribe = subscribeToSnapshots(() =>
      seen.push(getSnapshots().length)
    );

    addSnapshot(added);
    expect(getSnapshots()[0]).toBe(added);
    expect(getSnapshots()).toHaveLength(4);
    expect(seen).toEqual([4]);

    unsubscribe();
    addSnapshot({ ...added, userName: 'Second' });
    expect(getSnapshots()).toHaveLength(5);
    expect(seen).toEqual([4]);
  });
});
