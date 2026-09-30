/**
 * CE.SDK Version History - Utility Functions
 */

/**
 * Get ordinal suffix for a day number (1st, 2nd, 3rd, etc.)
 */
function getOrdinal(day: number): string {
  if (day > 3 && day < 21) return 'th';
  switch (day % 10) {
    case 1:
      return 'st';
    case 2:
      return 'nd';
    case 3:
      return 'rd';
    default:
      return 'th';
  }
}

/**
 * Format an ISO date string for display in the snapshot list.
 * Returns an object with dateLine (e.g., "Nov 27th") and timeLine (e.g., "03:28 pm").
 */
export function formatDate(isoString: string): {
  dateLine: string;
  timeLine: string;
} {
  const date = new Date(isoString);
  const month = date.toLocaleString('default', { month: 'short' });
  const day = date.getDate();
  const hour = date.getHours();
  const amPm = hour >= 12 ? 'pm' : 'am';
  const hour12 = hour % 12 || 12;
  const hour12String = hour12.toString().padStart(2, '0');
  const minute = date.getMinutes().toString().padStart(2, '0');

  return {
    dateLine: `${month} ${day}${getOrdinal(day)}`,
    timeLine: `${hour12String}:${minute} ${amPm}`
  };
}
