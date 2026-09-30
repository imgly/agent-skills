// @vitest-environment jsdom
import { render, screen } from '@imgly/kit-test-harness/component';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import App from '../../src/app/App';
import { EMPLOYEES } from '../../src/app/constants';

const { loadTemplates, batchRender, reportDemoPhase } = vi.hoisted(() => ({
  loadTemplates: vi.fn(),
  batchRender: vi.fn(),
  reportDemoPhase: vi.fn()
}));

vi.mock('../../src/app/templates', () => ({ loadTemplates }));
vi.mock('../../src/imgly', () => ({ batchRender }));
vi.mock('../../../shared/demo-preview/lifecycle', () => ({
  reportDemoPhase
}));
// The modal mounts the editor component, which the browser suite already drives.
vi.mock('../../src/app/EditorModal/EditorModal', () => ({
  EditorModal: () => null
}));

const TEMPLATES = {
  portrait: {
    label: 'Portrait',
    sceneString: 'portrait-scene',
    previewImagePath: '/p.png',
    outputFormat: 'image/png',
    width: 100,
    height: 200
  }
};

describe('BIG-C2 App', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders one card per employee once the templates arrive', async () => {
    loadTemplates.mockResolvedValue(TEMPLATES);
    batchRender.mockImplementation(async (_scene: string, items: unknown[]) =>
      items.map(() => ({ blob: new Blob(['x']), sceneString: 'rendered' }))
    );
    globalThis.URL.createObjectURL = vi.fn(() => 'blob:card');

    render(<App config={{}} />);

    await vi.waitFor(() =>
      expect(screen.getAllByAltText('Portrait').length).toBeGreaterThan(0)
    );
    expect(batchRender).toHaveBeenCalledWith(
      'portrait-scene',
      expect.any(Array),
      expect.objectContaining({ mimeType: 'image/png' })
    );
    // No editor mounts until the visitor acts, so the shell is this demo's
    // end of loading.
    expect(reportDemoPhase.mock.calls.flat()).toEqual(['shell']);
  });

  it('renders each card from its own employee photo and texts', async () => {
    loadTemplates.mockResolvedValue(TEMPLATES);
    const rendered: Blob[] = [];
    batchRender.mockImplementation(async (_scene: string, items: unknown[]) =>
      items.map((_, index) => {
        rendered[index] = new Blob([`card-${index}`]);
        return { blob: rendered[index], sceneString: `scene-${index}` };
      })
    );
    const urls = new Map<Blob, string>();
    globalThis.URL.createObjectURL = vi.fn((blob: Blob) => {
      urls.set(blob, `blob:${urls.size}`);
      return urls.get(blob)!;
    });

    render(<App config={{}} />);
    await vi.waitFor(() =>
      expect(screen.getAllByText('Edit')).toHaveLength(EMPLOYEES.length + 1)
    );

    const [, items] = batchRender.mock.calls[0];
    expect(items).toEqual(
      EMPLOYEES.map((employee) => ({
        images: {
          Photo: expect.stringMatching(
            new RegExp(`/images/${employee.imagePath}$`)
          )
        },
        variables: {
          FirstName: employee.firstName,
          LastName: employee.lastName,
          Department: employee.department
        }
      }))
    );
    for (const [index, employee] of EMPLOYEES.entries()) {
      expect(
        screen
          .getByAltText(`${employee.firstName} ${employee.lastName}`)
          .getAttribute('src')
      ).toBe(urls.get(rendered[index]));
    }
  });

  it('reports templates it cannot load and stops the loading overlay', async () => {
    loadTemplates.mockRejectedValue(new Error('offline'));
    const consoleError = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    render(<App config={{}} />);

    await vi.waitFor(() =>
      expect(consoleError).toHaveBeenCalledWith(
        'Failed to initialize:',
        expect.any(Error)
      )
    );
    await vi.waitFor(() => expect(screen.queryByText(/Loading/i)).toBeNull());
    consoleError.mockRestore();
  });

  it('drops the templates that arrive after it unmounts', async () => {
    let resolveTemplates: (value: unknown) => void = () => {};
    loadTemplates.mockReturnValue(
      new Promise((resolve) => {
        resolveTemplates = resolve;
      })
    );

    const { unmount } = render(<App config={{}} />);
    await vi.waitFor(() => expect(loadTemplates).toHaveBeenCalledTimes(1));
    unmount();
    resolveTemplates({ portrait: { sceneString: 'scene' } });
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(batchRender).not.toHaveBeenCalled();
  });
});
