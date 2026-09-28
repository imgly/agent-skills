// @vitest-environment jsdom
import { act, waitFor } from '@imgly/kit-test-harness/component';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@google/model-viewer', () => ({}));

vi.mock('../../src/imgly', () => ({
  renderMockup: vi.fn(async () => ({
    mockupUrl: 'blob:mockup',
    sceneString: '<rendered/>',
    blobUrls: []
  })),
  disposeMockupRenderer: vi.fn(),
  init3dProductPreviewEditor: vi.fn(async () => undefined),
  CLEAR_IMAGE: 'ly.img.mockup/clear'
}));

vi.mock('@cesdk/cesdk-js/react', async () => {
  const { createElement } = await import('react');
  return { default: () => createElement('div', { 'data-testid': 'editor' }) };
});

beforeEach(() => {
  vi.resetModules();
});

afterEach(() => {
  document.getElementById('root')?.remove();
});

describe('P3D-C9 the entry point', () => {
  it('mounts the app into the root container the page ships', async () => {
    const container = document.createElement('div');
    container.id = 'root';
    document.body.append(container);

    await act(async () => {
      await import('../../src/index');
    });

    await waitFor(() => expect(container.childElementCount).toBe(1));
  });

  it('fails loudly when the page ships no root container', async () => {
    await expect(import('../../src/index')).rejects.toThrow(
      'Root container not found'
    );
  });
});
