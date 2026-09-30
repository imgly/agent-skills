import type { CreativeEngine } from '@cesdk/cesdk-js';
import { describe, expect, it, vi } from 'vitest';

import {
  applyBackdropVariables,
  setupScene,
  type SetupSceneArea
} from '../../src/imgly/plugins/product-scene';

interface FakeOptions {
  scene?: number | null;
  pagesByName?: Record<string, number[]>;
  fill?: number;
}

/**
 * Every block call is a no-op returning a block id; only the lookups the scene
 * setup branches on answer for themselves.
 */
function fakeEngine({
  scene = 1,
  pagesByName = {},
  fill = 5
}: FakeOptions = {}) {
  const setMetadata = vi.fn();
  const setSourceSet = vi.fn();
  const create = vi.fn(() => 1);
  const block = new Proxy(
    {
      findByName: (name: string) => pagesByName[name] ?? [],
      findByKind: () => [] as number[],
      findByType: () => [] as number[],
      getFill: () => fill,
      setMetadata,
      setSourceSet
    } as Record<string, unknown>,
    { get: (target, name: string) => target[name] ?? (() => 7) }
  );
  const engine = {
    block,
    editor: { setSelectionEnabled: () => {} },
    scene: {
      get: () => scene,
      create,
      setDesignUnit: () => {}
    }
  } as unknown as CreativeEngine;
  return { engine, setMetadata, setSourceSet, create };
}

const area = (overrides: Partial<SetupSceneArea> = {}): SetupSceneArea =>
  ({
    id: 'front',
    pageSize: { width: 100, height: 200 },
    mockup: {
      images: [{ uri: 'https://cdn/{{color}}.png', width: 1, height: 1 }],
      printableAreaPx: { width: 10, height: 20, x: 0, y: 0 }
    },
    ...overrides
  }) as SetupSceneArea;

describe('TSD-U19 setupScene', () => {
  it('creates the scene when the engine holds none', () => {
    const { engine, create } = fakeEngine({
      scene: null,
      pagesByName: { front: [7] }
    });

    setupScene(engine, {
      areas: [area()],
      designUnit: 'Pixel'
    } as never);

    expect(create).toHaveBeenCalledWith('Free');
  });

  it('reuses the page an area already has and substitutes its backdrop variables', () => {
    const { engine, setMetadata } = fakeEngine({ pagesByName: { front: [7] } });

    setupScene(engine, {
      areas: [area()],
      designUnit: 'Pixel',
      variables: { color: 'black' }
    } as never);

    const [, , config] = setMetadata.mock.calls[0] as [number, string, string];
    expect(JSON.parse(config).images[0].uri).toBe('https://cdn/black.png');
  });

  it('keeps the mockup images as they are when the caller passes no variables', () => {
    const { engine, setMetadata } = fakeEngine({ pagesByName: { front: [7] } });

    setupScene(engine, {
      areas: [area()],
      designUnit: 'Pixel'
    } as never);

    const [, , config] = setMetadata.mock.calls[0] as [number, string, string];
    expect(JSON.parse(config).images[0].uri).toBe('https://cdn/{{color}}.png');
  });

  it.each([
    ['with variables', { color: 'black' }],
    ['without variables', undefined]
  ])(
    'writes an empty backdrop %s when the mockup names no image',
    (_name, variables) => {
      const { engine, setMetadata } = fakeEngine({
        pagesByName: { front: [7] }
      });

      setupScene(engine, {
        areas: [
          area({
            mockup: { printableAreaPx: { width: 10, height: 20, x: 0, y: 0 } }
          } as never)
        ],
        designUnit: 'Pixel',
        variables
      } as never);

      const [, , config] = setMetadata.mock.calls[0] as [
        number,
        string,
        string
      ];
      expect(JSON.parse(config).images).toEqual([]);
    }
  );

  it('skips an area that carries no mockup', () => {
    const { engine, setMetadata } = fakeEngine({ pagesByName: { front: [7] } });

    setupScene(engine, {
      areas: [area({ mockup: undefined })],
      designUnit: 'Pixel'
    } as never);

    expect(setMetadata).not.toHaveBeenCalled();
  });

  it('fails loudly when the engine cannot find the page it just named', () => {
    const { engine } = fakeEngine();

    expect(() =>
      setupScene(engine, {
        areas: [area()],
        designUnit: 'Pixel'
      } as never)
    ).toThrow('No page block found for area: front');
  });
});

describe('TSD-U20 applyBackdropVariables', () => {
  it('replaces the source set of the backdrop it finds', () => {
    const { engine, setSourceSet } = fakeEngine({
      pagesByName: { 'Backdrop-front': [9] }
    });

    applyBackdropVariables(engine, { color: 'black' }, [area()]);

    expect(setSourceSet).toHaveBeenCalledWith(
      5,
      'fill/image/sourceSet',
      expect.arrayContaining([
        expect.objectContaining({ uri: 'https://cdn/black.png' })
      ])
    );
  });

  it('leaves an area alone when it has no mockup images', () => {
    const { engine, setSourceSet } = fakeEngine({
      pagesByName: { 'Backdrop-front': [9] }
    });

    applyBackdropVariables(engine, { color: 'black' }, [
      area({ mockup: undefined })
    ]);

    expect(setSourceSet).not.toHaveBeenCalled();
  });

  it('leaves an area alone when the scene holds no backdrop for it', () => {
    const { engine, setSourceSet } = fakeEngine();

    applyBackdropVariables(engine, { color: 'black' }, [area()]);

    expect(setSourceSet).not.toHaveBeenCalled();
  });
});
