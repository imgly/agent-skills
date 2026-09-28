import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const holder = vi.hoisted(() => ({ engine: undefined as unknown }));

vi.mock('@cesdk/engine', () => ({
  default: { init: async () => holder.engine }
}));

const { disposeMockupRenderer, renderMockup } =
  await import('../../src/imgly/mockup');

const config = { license: 'test' };
let revoked: string[] = [];

interface FakeEngineOptions {
  scene?: number | null;
  exportFails?: boolean;
}

function fakeEngine({ scene = 1, exportFails = false }: FakeEngineOptions) {
  return {
    dispose: vi.fn(),
    scene: {
      load: vi.fn(async () => 1),
      saveToString: vi.fn(async () => '<scene/>'),
      get: vi.fn(() => scene)
    },
    block: {
      findByName: vi.fn(() => [7]),
      getFill: vi.fn(() => 8),
      setFillEnabled: vi.fn(),
      setString: vi.fn(),
      resetCrop: vi.fn(),
      export: vi.fn(async () => {
        if (exportFails) throw new Error('export failed');
        return new Blob(['png'], { type: 'image/png' });
      })
    }
  };
}

beforeEach(() => {
  revoked = [];
  let created = 0;
  URL.createObjectURL = vi.fn(() => `blob:${++created}`) as never;
  URL.revokeObjectURL = vi.fn((url: string) => {
    revoked.push(url);
  }) as never;
});

afterEach(() => {
  disposeMockupRenderer();
});

describe('PP-U16 renderMockup when the scene is gone', () => {
  it('reports the missing scene and releases the placeholder URLs it created', async () => {
    holder.engine = fakeEngine({ scene: null });

    await expect(
      renderMockup(config, 'mockup.scene', {
        'Image 1': new Blob(['a'], { type: 'image/png' })
      })
    ).rejects.toThrow('No scene loaded');
    expect(revoked).toEqual(['blob:1']);
  });
});

describe('PP-U17 renderMockup when the export fails', () => {
  it('releases the placeholder URLs and passes the engine error on', async () => {
    holder.engine = fakeEngine({ exportFails: true });

    await expect(
      renderMockup(
        config,
        { sceneString: '<scene/>' },
        {
          'Image 1': new Blob(['a'], { type: 'image/png' })
        }
      )
    ).rejects.toThrow('export failed');
    expect(revoked).toEqual(['blob:1']);
  });
});
