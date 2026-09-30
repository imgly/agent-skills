// @vitest-environment jsdom
import {
  act,
  render,
  screen,
  userEvent,
  waitFor
} from '@imgly/kit-test-harness/component';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { App, DEMO_ASSETS_BASE_URL } from '../../src/app/App';

const inits = vi.hoisted(() => ({
  autocaption: vi.fn(),
  blank: vi.fn(),
  import: vi.fn(),
  preCaptioned: vi.fn()
}));

// The editor component only hands the kit's `init` back to the test; mounting a
// real CE.SDK in jsdom is out of scope for a component test.
const editor = vi.hoisted(() => ({
  init: null as ((cesdk: unknown) => Promise<void>) | null,
  onLoadingStateChange: null as ((state: string) => void) | null
}));

vi.mock('../../src/imgly', () => ({
  initVideoCaptionsAutocaptionEditor: inits.autocaption,
  initVideoCaptionsBlankEditor: inits.blank,
  initVideoCaptionsImportEditor: inits.import,
  initVideoCaptionsPreCaptionedEditor: inits.preCaptioned
}));

vi.mock('@cesdk/cesdk-js/react', () => ({
  default: (props: {
    init: (cesdk: unknown) => Promise<void>;
    onLoadingStateChange?: (state: string) => void;
  }) => {
    editor.init = props.init;
    editor.onLoadingStateChange = props.onLoadingStateChange ?? null;
    return null;
  }
}));

const lifecycle = vi.hoisted(() => ({
  reportDemoPhase: vi.fn(),
  reportDemoLoadingState: vi.fn()
}));

vi.mock('../../../shared/demo-preview/lifecycle', () => lifecycle);

interface CloseComponent {
  id: string;
  onClick: () => void;
}

function createFakeCesdk(options: { captionTrack?: number[] } = {}) {
  const inserted: CloseComponent[] = [];
  const cesdk = {
    load: vi.fn(async () => undefined),
    actions: { run: vi.fn(async () => undefined) },
    i18n: { setTranslations: vi.fn() },
    ui: {
      insertOrderComponent: vi.fn(
        (_target: unknown, components: CloseComponent[]) => {
          inserted.push(...components);
        }
      ),
      openPanel: vi.fn()
    },
    engine: {
      scene: { getCurrentPage: vi.fn(() => 7) },
      block: {
        setPlaybackTime: vi.fn(),
        findByType: vi.fn(() => (options.captionTrack == null ? [] : [42])),
        findAllSelected: vi.fn(() => [1, 2]),
        setSelected: vi.fn(),
        getChildren: vi.fn(() => options.captionTrack ?? [])
      }
    }
  };
  return { cesdk, inserted };
}

const MODE_LABELS = [
  'AI Auto Captions',
  'Blank Video Editor',
  'Caption Import',
  'Pre-captioned Video'
];

// Every card names its Open Editor button the same, so the mode is picked by
// position; the heading lookup fails loudly if the card order ever changes.
async function openMode(label: string): Promise<void> {
  screen.getByRole('heading', { level: 5, name: label });
  await userEvent.click(
    screen.getAllByRole('button', { name: 'Open Editor' })[
      MODE_LABELS.indexOf(label)
    ]
  );
}

beforeEach(() => {
  editor.init = null;
  editor.onLoadingStateChange = null;
});

function phases(): string[] {
  return lifecycle.reportDemoPhase.mock.calls.map(([phase]) => phase as string);
}

afterEach(() => {
  vi.clearAllMocks();
});

describe('VCA-U14 opening and closing an editor', () => {
  it('mounts no editor until a mode is chosen', () => {
    render(<App editorConfig={{}} />);
    expect(editor.init).toBeNull();
  });

  it.each([
    ['AI Auto Captions', 'autocaption' as const, 'autocaption/scene.scene'],
    ['Caption Import', 'import' as const, 'captions/scene.scene'],
    [
      'Pre-captioned Video',
      'preCaptioned' as const,
      'captions-pre-captioned/scene.scene'
    ]
  ])(
    '%s runs its own configuration and loads its own scene',
    async (label, key, scene) => {
      render(<App editorConfig={{}} />);
      await openMode(label);
      await waitFor(() => expect(editor.init).not.toBeNull());

      const { cesdk } = createFakeCesdk({ captionTrack: [11, 12] });
      await act(async () => {
        await editor.init!(cesdk);
      });

      expect(inits[key]).toHaveBeenCalledTimes(1);
      expect(cesdk.load).toHaveBeenCalledWith(
        `${DEMO_ASSETS_BASE_URL}/assets/${scene}`
      );
      expect(cesdk.engine.block.setPlaybackTime).toHaveBeenCalledWith(7, 0);
      expect(cesdk.ui.openPanel).toHaveBeenCalledWith(
        '//ly.img.panel/inspector/caption'
      );
      expect((window as unknown as { cesdk: unknown }).cesdk).toBe(cesdk);
    }
  );

  it('reports the shell on mount, then the phases around the editor it opens', async () => {
    render(<App editorConfig={{}} />);
    expect(phases()).toEqual(['shell']);

    await openMode('Caption Import');
    await waitFor(() => expect(editor.init).not.toBeNull());

    const { cesdk } = createFakeCesdk({ captionTrack: [11, 12] });
    await act(async () => {
      await editor.init!(cesdk);
    });

    expect(phases()).toEqual(['shell', 'created', 'ready']);
    expect(editor.onLoadingStateChange).toBe(lifecycle.reportDemoLoadingState);
  });

  it('the blank mode creates a 1280 x 720 scene instead of loading one', async () => {
    render(<App editorConfig={{}} />);
    await openMode('Blank Video Editor');
    await waitFor(() => expect(editor.init).not.toBeNull());

    const { cesdk } = createFakeCesdk();
    await act(async () => {
      await editor.init!(cesdk);
    });

    expect(inits.blank).toHaveBeenCalledTimes(1);
    expect(cesdk.load).not.toHaveBeenCalled();
    expect(cesdk.actions.run).toHaveBeenCalledWith('scene.create', {
      page: { width: 1280, height: 720, unit: 'Pixel' }
    });
    expect(cesdk.i18n.setTranslations).toHaveBeenCalledWith({
      en: { 'actions.export.video': 'Export Video' }
    });
  });

  it('the pre-captioned mode selects the first caption and drops the rest', async () => {
    render(<App editorConfig={{}} />);
    await openMode('Pre-captioned Video');
    await waitFor(() => expect(editor.init).not.toBeNull());

    const { cesdk } = createFakeCesdk({ captionTrack: [11, 12] });
    await act(async () => {
      await editor.init!(cesdk);
    });

    expect(cesdk.engine.block.setSelected.mock.calls).toEqual([
      [1, false],
      [2, false],
      [11, true]
    ]);
  });

  it('the pre-captioned mode leaves the selection alone when the track is empty', async () => {
    render(<App editorConfig={{}} />);
    await openMode('Pre-captioned Video');
    await waitFor(() => expect(editor.init).not.toBeNull());

    const { cesdk } = createFakeCesdk({ captionTrack: [] });
    await act(async () => {
      await editor.init!(cesdk);
    });

    expect(cesdk.engine.block.setSelected.mock.calls).toEqual([
      [1, false],
      [2, false]
    ]);
  });

  it('skips the playback reset when the scene has no current page', async () => {
    render(<App editorConfig={{}} />);
    await openMode('AI Auto Captions');
    await waitFor(() => expect(editor.init).not.toBeNull());

    const { cesdk } = createFakeCesdk();
    cesdk.engine.scene.getCurrentPage = vi.fn(() => null as unknown as number);
    await act(async () => {
      await editor.init!(cesdk);
    });

    expect(cesdk.engine.block.setPlaybackTime).not.toHaveBeenCalled();
  });

  it.each(MODE_LABELS)(
    'the Close control %s inserts returns to the option list',
    async (label) => {
      const { container } = render(<App editorConfig={{}} />);
      await openMode(label);
      await waitFor(() => expect(editor.init).not.toBeNull());

      const { cesdk, inserted } = createFakeCesdk({ captionTrack: [11] });
      await act(async () => {
        await editor.init!(cesdk);
      });

      expect(inserted.map(({ id }) => id)).toEqual([
        'ly.img.close.navigationBar'
      ]);
      expect(cesdk.ui.insertOrderComponent.mock.calls[0][0]).toEqual({
        in: 'ly.img.navigation.bar',
        position: 'start'
      });
      expect(container.querySelector('.overlay')).not.toBeNull();

      await act(async () => {
        inserted[0].onClick();
      });
      await waitFor(() =>
        expect(container.querySelector('.overlay')).toBeNull()
      );
    }
  );
});

describe('VCA-U15 the overlay and the SRT download', () => {
  it('closes on a click outside the editor and stays open on one inside', async () => {
    const { container } = render(<App editorConfig={{}} />);
    await openMode('Blank Video Editor');
    await waitFor(() => expect(editor.init).not.toBeNull());

    const overlay = container.querySelector('.overlay') as HTMLElement;
    const wrapper = overlay.firstElementChild as HTMLElement;

    await userEvent.click(wrapper);
    expect(container.querySelector('.overlay')).not.toBeNull();

    await userEvent.click(overlay);
    await waitFor(() => expect(container.querySelector('.overlay')).toBeNull());
  });

  it('downloads the sample SRT through a generated link', async () => {
    render(<App editorConfig={{}} />);
    // The link never reaches the document, so the spy reads it off `this`.
    const clicked: Array<{ href: string; download: string }> = [];
    const click = vi
      .spyOn(HTMLAnchorElement.prototype, 'click')
      .mockImplementation(function spied(this: HTMLAnchorElement) {
        clicked.push({ href: this.href, download: this.download });
      });

    await userEvent.click(
      screen.getByRole('button', { name: 'Download .srt File' })
    );

    expect(click).toHaveBeenCalledTimes(1);
    expect(clicked).toEqual([
      {
        href: `${DEMO_ASSETS_BASE_URL}/assets/captions.srt`,
        download: 'captions.srt'
      }
    ]);
  });
});
