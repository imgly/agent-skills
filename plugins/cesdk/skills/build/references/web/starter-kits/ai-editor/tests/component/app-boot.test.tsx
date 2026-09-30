// @vitest-environment jsdom
import {
  render,
  screen,
  userEvent,
  waitFor
} from '@imgly/kit-test-harness/component';
import type CreativeEditorSDK from '@cesdk/cesdk-js';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const probeAiCredentials = vi.fn();
const initAiDesignEditor = vi.fn(async () => {});
const initAiPhotoEditor = vi.fn(async () => {});
const initAiVideoEditor = vi.fn(async () => {});

vi.mock('../../src/app/ai-credentials', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../../src/app/ai-credentials')>()),
  probeAiCredentials,
  installAiCredentials: vi.fn()
}));

vi.mock('../../src/imgly', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../../src/imgly')>()),
  initAiDesignEditor,
  initAiPhotoEditor,
  initAiVideoEditor
}));

const lifecycle = vi.hoisted(() => ({
  reportDemoPhase: vi.fn(),
  reportDemoLoadingState: vi.fn()
}));

vi.mock('../../../shared/demo-preview/lifecycle', () => lifecycle);

/** The React wrapper mounts the real editor; the boot flow is what is tested. */
let lastInit: ((cesdk: CreativeEditorSDK) => Promise<void>) | undefined;
let lastLoadingStateChange: ((state: string) => void) | undefined;
vi.mock('@cesdk/cesdk-js/react', () => ({
  default: ({
    init,
    onLoadingStateChange
  }: {
    init: (cesdk: CreativeEditorSDK) => Promise<void>;
    onLoadingStateChange?: (state: string) => void;
  }) => {
    lastInit = init;
    lastLoadingStateChange = onLoadingStateChange;
    return <div data-testid="editor" />;
  }
}));

const App = (await import('../../src/app/App')).default;

function fakeEditor() {
  return {
    load: vi.fn(async () => {}),
    createFromImage: vi.fn(async () => {}),
    actions: { register: vi.fn() }
  } as unknown as CreativeEditorSDK;
}

beforeEach(() => {
  lastInit = undefined;
  lastLoadingStateChange = undefined;
  vi.clearAllMocks();
  window.history.replaceState({}, '', '/');
  probeAiCredentials.mockResolvedValue({
    status: 'ok',
    modelsByCapability: {}
  });
});

describe('AIE-C8 the boot flow', () => {
  it.each([
    [
      'missing credentials',
      { status: 'missing' },
      'Set up your IMG.LY API key'
    ],
    [
      'a rejected key',
      { status: 'invalid', mode: 'apiKey' },
      'Your API key was rejected'
    ]
  ])(
    'AIE-C8 shows the onboarding screen for %s',
    async (_case, probe, heading) => {
      probeAiCredentials.mockResolvedValue(probe);

      render(<App config={{}} />);

      expect(
        await screen.findByRole('heading', { name: heading })
      ).toBeDefined();
      expect(screen.queryByTestId('editor')).toBeNull();
    }
  );

  it('AIE-C8 mounts the editor once the credentials check out', async () => {
    render(<App config={{}} />);

    expect(await screen.findByTestId('editor')).toBeDefined();
  });

  it('AIE-C8 drops a probe that answers after the app is gone', async () => {
    let answer: (result: unknown) => void = () => {};
    probeAiCredentials.mockReturnValue(
      new Promise((resolve) => {
        answer = resolve;
      })
    );

    const { unmount } = render(<App config={{}} />);
    unmount();
    answer({ status: 'missing' });

    await waitFor(() => {
      expect(screen.queryByRole('heading')).toBeNull();
    });
  });
});

describe('AIE-C9 the editor the boot flow initializes', () => {
  it.each([
    ['Design', initAiDesignEditor, 'load'],
    ['Photo', initAiPhotoEditor, 'createFromImage'],
    ['Video', initAiVideoEditor, 'load']
  ])('AIE-C9 %s mode loads its own content', async (mode, init, method) => {
    window.history.replaceState({}, '', `/?mode=${mode}`);

    render(<App config={{}} />);
    await screen.findByTestId('editor');
    const editor = fakeEditor();
    await lastInit!(editor);

    expect(init).toHaveBeenCalledWith(editor, expect.any(Object));
    expect(
      (editor as unknown as Record<string, ReturnType<typeof vi.fn>>)[method]
    ).toHaveBeenCalled();
  });

  it('AIE-C9 falls back to the design editor for an unknown mode', async () => {
    window.history.replaceState({}, '', '/?mode=Sculpture');

    render(<App config={{}} />);
    await screen.findByTestId('editor');
    const editor = fakeEditor();
    await lastInit!(editor);

    expect(initAiDesignEditor).toHaveBeenCalledWith(editor, expect.any(Object));
  });

  it('AIE-C9 remembers the mode the user picks in the URL', async () => {
    render(<App config={{}} />);
    await screen.findByTestId('editor');

    await userEvent.click(screen.getByRole('button', { name: 'Photo' }));

    await waitFor(() => {
      expect(new URL(window.location.href).searchParams.get('mode')).toBe(
        'Photo'
      );
    });
  });
});

describe('AIE-C12 the demo lifecycle beacon', () => {
  it('AIE-C12 reports the phases around the editor it initializes', async () => {
    render(<App config={{}} />);
    await screen.findByTestId('editor');
    await lastInit!(fakeEditor());

    expect(
      lifecycle.reportDemoPhase.mock.calls.map(([phase]) => phase)
    ).toEqual(['created', 'ready']);
    expect(lastLoadingStateChange).toBe(lifecycle.reportDemoLoadingState);
  });
});

describe('AIE-C10 a gateway that cannot be reached', () => {
  it('AIE-C10 says so and still mounts the editor with no catalogue', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    probeAiCredentials.mockResolvedValue({
      status: 'unreachable',
      message: 'ECONNREFUSED'
    });

    render(<App config={{}} />);

    expect(await screen.findByTestId('editor')).toBeDefined();
    expect(warn).toHaveBeenCalledWith(
      '[ai-editor] gateway unreachable:',
      'ECONNREFUSED'
    );
    warn.mockRestore();
  });
});

describe('AIE-C11 switching mode before the editor exists', () => {
  it('AIE-C11 records the mode without touching the boot state', async () => {
    probeAiCredentials.mockResolvedValue({ status: 'missing' });
    render(<App config={{}} />);
    await screen.findByRole('heading', { name: 'Set up your IMG.LY API key' });

    await userEvent.click(screen.getByRole('button', { name: 'Video' }));

    await waitFor(() => {
      expect(new URL(window.location.href).searchParams.get('mode')).toBe(
        'Video'
      );
    });
    expect(screen.queryByTestId('editor')).toBeNull();
  });
});
