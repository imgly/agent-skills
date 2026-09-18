import { describe, expect, it } from 'vitest';

import { EMPLOYEES } from '../../src/app/constants';

// BIG-U1: the six employee records the kit renders a card for.
describe('EMPLOYEES', () => {
  it('has six records with unique ids', () => {
    expect(EMPLOYEES).toHaveLength(6);
    expect(new Set(EMPLOYEES.map((e) => e.id)).size).toBe(6);
  });

  it.each(EMPLOYEES.map((e) => [e.id, e] as const))(
    '%s carries a first name, a last name and a department',
    (_id, employee) => {
      expect(employee.firstName).not.toBe('');
      expect(employee.lastName).not.toBe('');
      expect(employee.department).not.toBe('');
    }
  );

  it.each(EMPLOYEES.map((e) => [e.id, e.imagePath] as const))(
    "%s's imagePath %s is a bare png file name",
    (_id, imagePath) => {
      expect(imagePath).toMatch(/^[\w@.-]+\.png$/);
    }
  );
});
