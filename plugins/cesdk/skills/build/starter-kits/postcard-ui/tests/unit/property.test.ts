import type CreativeEngine from '@cesdk/engine';
import { describe, expect, it, vi } from 'vitest';
import { getProperty, setProperty } from '@/app/hooks/useSelectedProperty';

/** A recording stand-in for the engine's block API. */
function stubEngine(propertyType: string) {
  const block = {
    getPropertyType: vi.fn(() => propertyType),
    getFloat: vi.fn(() => 1),
    getDouble: vi.fn(() => 2),
    getInt: vi.fn(() => 3),
    getBool: vi.fn(() => true),
    getString: vi.fn(() => 'text'),
    getColor: vi.fn(() => ({ r: 1, g: 1, b: 1, a: 1 })),
    getEnum: vi.fn(() => 'Center'),
    setFloat: vi.fn(),
    setDouble: vi.fn(),
    setInt: vi.fn(),
    setBool: vi.fn(),
    setString: vi.fn(),
    setColor: vi.fn(),
    setEnum: vi.fn()
  };
  return { engine: { block } as unknown as CreativeEngine, block };
}

const CASES = [
  ['Float', 'getFloat', 'setFloat', 12] as const,
  ['Double', 'getDouble', 'setDouble', 1.5] as const,
  ['Int', 'getInt', 'setInt', 4] as const,
  ['Bool', 'getBool', 'setBool', true] as const,
  ['String', 'getString', 'setString', 'hello'] as const,
  ['Enum', 'getEnum', 'setEnum', 'Left'] as const
];

describe('PC-U6 getProperty and setProperty', () => {
  it.each(CASES)(
    'PC-U6 dispatches a %s property to its getter and setter',
    (type, getter, setter, value) => {
      const { engine, block } = stubEngine(type);

      expect(getProperty(engine, 7, 'some/property')).toBe(block[getter]());
      expect(block[getter]).toHaveBeenCalledWith(7, 'some/property');

      setProperty(engine, 7, 'some/property', value);
      expect(block[setter]).toHaveBeenCalledWith(7, 'some/property', value);
    }
  );

  it('PC-U6 dispatches a Color property by value', () => {
    const { engine, block } = stubEngine('Color');
    const color = { r: 0, g: 0.5, b: 1, a: 1 };

    expect(getProperty(engine, 7, 'fill/solid/color')).toEqual({
      r: 1,
      g: 1,
      b: 1,
      a: 1
    });
    setProperty(engine, 7, 'fill/solid/color', color);
    expect(block.setColor).toHaveBeenCalledWith(7, 'fill/solid/color', color);
  });

  it('PC-U6 is a silent no-op for a property type it does not handle', () => {
    const { engine, block } = stubEngine('Struct');

    expect(getProperty(engine, 7, 'other')).toBeUndefined();
    expect(setProperty(engine, 7, 'other', 1)).toBeUndefined();
    for (const method of Object.keys(block)) {
      if (method !== 'getPropertyType') {
        expect(block[method as keyof typeof block]).not.toHaveBeenCalled();
      }
    }
  });

  it('PC-U6 lets an engine error through rather than swallowing it', () => {
    const { engine, block } = stubEngine('Float');
    block.getFloat.mockImplementation(() => {
      throw new Error('Block 7 is unknown.');
    });

    expect(() => getProperty(engine, 7, 'some/property')).toThrow(
      'Block 7 is unknown.'
    );
  });
});
