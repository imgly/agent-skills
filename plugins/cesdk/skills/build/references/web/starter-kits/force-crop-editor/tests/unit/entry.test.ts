// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest';

const render = vi.fn();
const createRoot = vi.fn(() => ({ render }));

vi.mock('react-dom/client', () => ({ createRoot }));
vi.mock('../../src/app/App', () => ({ default: () => null }));

describe('FCE-U11 src/index.tsx', () => {
  beforeEach(() => {
    vi.resetModules();
    createRoot.mockClear();
    render.mockClear();
    document.body.innerHTML = '';
  });

  it('renders the app into the root container', async () => {
    const container = document.createElement('div');
    container.id = 'root';
    document.body.append(container);

    await import('../../src/index');

    expect(createRoot).toHaveBeenCalledWith(container);
    expect(render).toHaveBeenCalledTimes(1);
  });

  it('fails loudly when the page ships no root container', async () => {
    await expect(import('../../src/index')).rejects.toThrow(
      'Root container not found'
    );
    expect(createRoot).not.toHaveBeenCalled();
  });
});
