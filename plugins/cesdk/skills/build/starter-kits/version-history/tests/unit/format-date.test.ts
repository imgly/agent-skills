import { beforeAll, describe, expect, it } from 'vitest';

import { formatDate } from '../../src/imgly/utils';

// `formatDate` reads local time, so the seeded UTC timestamps only render as
// documented when the process runs in UTC (known issue 3).
beforeAll(() => {
  process.env.TZ = 'UTC';
});

describe('VH-U1 formatDate (Qase 2108)', () => {
  it('formats the seeded snapshot timestamps', () => {
    expect(formatDate('2023-11-30T08:00:00.000Z')).toEqual({
      dateLine: 'Nov 30th',
      timeLine: '08:00 am'
    });
    expect(formatDate('2023-11-29T14:00:00.000Z')).toEqual({
      dateLine: 'Nov 29th',
      timeLine: '02:00 pm'
    });
    expect(formatDate('2023-11-28T12:00:00.000Z')).toEqual({
      dateLine: 'Nov 28th',
      timeLine: '12:00 pm'
    });
  });

  it.each([
    ['2024-01-01T09:00:00.000Z', 'Jan 1st'],
    ['2024-01-02T09:00:00.000Z', 'Jan 2nd'],
    ['2024-01-03T09:00:00.000Z', 'Jan 3rd'],
    ['2024-01-04T09:00:00.000Z', 'Jan 4th'],
    ['2024-01-11T09:00:00.000Z', 'Jan 11th'],
    ['2024-01-12T09:00:00.000Z', 'Jan 12th'],
    ['2024-01-13T09:00:00.000Z', 'Jan 13th'],
    ['2024-01-21T09:00:00.000Z', 'Jan 21st'],
    ['2024-01-22T09:00:00.000Z', 'Jan 22nd'],
    ['2024-01-23T09:00:00.000Z', 'Jan 23rd'],
    ['2024-01-31T09:00:00.000Z', 'Jan 31st']
  ])('gives %s the ordinal in %s', (iso, dateLine) => {
    expect(formatDate(iso).dateLine).toBe(dateLine);
  });

  it('renders midnight and noon on the 12-hour clock', () => {
    expect(formatDate('2024-01-15T00:30:00.000Z').timeLine).toBe('12:30 am');
    expect(formatDate('2024-01-15T12:30:00.000Z').timeLine).toBe('12:30 pm');
  });
});
