/**
 * Decide which single block to keep when the engine reports a multi-selection.
 * Precondition: `selected` is non-empty.
 *
 * Prefers the block added last during the current pointer gesture (drag order,
 * reconstructed by the caller). Falls back to the newest block by diffing the
 * previous selection — which relies on `findAllSelected()` appending
 * newly-selected ids last.
 */
export function pickBlockToKeep(
  selected: number[],
  previousSelection: number[],
  lastAddedInGesture: number | undefined
): number {
  if (
    lastAddedInGesture !== undefined &&
    selected.includes(lastAddedInGesture)
  ) {
    return lastAddedInGesture;
  }
  const previous = new Set(previousSelection);
  const added = selected.filter((id) => !previous.has(id));
  const pool = added.length ? added : selected;
  return pool[pool.length - 1];
}
