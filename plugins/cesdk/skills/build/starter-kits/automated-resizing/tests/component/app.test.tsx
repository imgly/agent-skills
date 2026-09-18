// @vitest-environment jsdom
import { render, screen, userEvent } from '@imgly/kit-test-harness/component';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import App from '../../src/app/App';
import { DEFAULT_SIZES } from '../../src/imgly/sizes';

const engine = {
  scene: {
    load: vi.fn(async () => 0),
    saveToString: vi.fn(async () => 'loaded-scene'),
    get: vi.fn(() => 1 as number | null)
  },
  block: { export: vi.fn(async () => new Blob(['x'])) }
};

const modal = {
  isOpen: false,
  scene: '',
  mode: 'design' as const,
  onSave: undefined,
  open: vi.fn(),
  close: vi.fn()
};

const templates = {
  templates: [{ id: 't1', sceneUrl: 'https://cdn.test/one.scene' }],
  selectedIndex: 0,
  selectedTemplate: { id: 't1', sceneUrl: 'https://cdn.test/one.scene' },
  select: vi.fn(),
  updateTemplate: vi.fn()
};

const variants = {
  variants: [],
  generate: vi.fn(),
  download: vi.fn(),
  updateVariant: vi.fn()
};

const engineHolder: { current: typeof engine | null } = { current: engine };

const reportDemoPhase = vi.hoisted(() => vi.fn());

vi.mock('../../src/app/hooks', () => ({
  useEngine: () => ({ engine: engineHolder.current, isReady: true }),
  useTemplates: () => templates,
  useEditorModal: () => modal,
  useVariants: () => variants
}));
vi.mock('../../src/app/EditorModal/EditorModal', () => ({
  EditorModal: () => null
}));
vi.mock('../../../shared/demo-preview/lifecycle', () => ({
  reportDemoPhase
}));
vi.mock('../../src/app/TemplateSection/TemplateSection', () => ({
  TemplateSection: ({
    onEdit,
    onGenerate
  }: {
    onEdit: (template: unknown) => void;
    onGenerate: () => void;
  }) => (
    <div>
      <button onClick={() => onEdit(templates.templates[0])}>edit</button>
      <button onClick={onGenerate}>generate</button>
    </div>
  )
}));
vi.mock('../../src/app/VariantsSection/VariantsSection', () => ({
  VariantsSection: ({ onEdit }: { onEdit: (variant: unknown) => void }) => (
    <div>
      <button
        onClick={() =>
          onEdit({ size: DEFAULT_SIZES[0], sceneString: 'variant-scene' })
        }
      >
        edit variant
      </button>
      <button onClick={() => onEdit({ size: DEFAULT_SIZES[0] })}>
        edit unsaved variant
      </button>
    </div>
  )
}));

describe('AR-C8 App', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    engineHolder.current = engine;
    engine.scene.get.mockReturnValue(1);
    globalThis.URL.createObjectURL = vi.fn(() => 'blob:preview');
  });

  it('loads a template that carries no scene before opening the editor', async () => {
    render(<App config={{}} />);

    // No editor mounts until the visitor acts, so the shell is this demo's
    // end of loading.
    expect(reportDemoPhase.mock.calls.flat()).toEqual(['shell']);

    await userEvent.click(screen.getByText('edit'));

    expect(engine.scene.load).toHaveBeenCalledWith(
      'https://cdn.test/one.scene'
    );
    expect(modal.open).toHaveBeenCalledWith(
      'loaded-scene',
      'advanced',
      expect.any(Function)
    );

    const onSave = modal.open.mock.calls[0][2] as (s: string) => Promise<void>;
    await onSave('edited-scene');

    expect(templates.updateTemplate).toHaveBeenCalledWith(
      templates.templates[0],
      'edited-scene',
      'blob:preview'
    );
    expect(modal.close).toHaveBeenCalledTimes(1);
  });

  it('reports a template that cannot be loaded instead of opening an empty editor', async () => {
    engine.scene.load.mockRejectedValueOnce(new Error('broken'));
    const consoleError = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    render(<App config={{}} />);

    await userEvent.click(screen.getByText('edit'));

    expect(consoleError).toHaveBeenCalledWith(
      'Failed to open template editor:',
      expect.any(Error)
    );
    expect(modal.open).not.toHaveBeenCalled();
    consoleError.mockRestore();
  });

  it('edits a variant and stores the rendered preview', async () => {
    render(<App config={{}} />);

    await userEvent.click(screen.getByText('edit variant'));
    const onSave = modal.open.mock.calls[0][2] as (s: string) => Promise<void>;
    await onSave('edited-variant');

    expect(variants.updateVariant).toHaveBeenCalledWith(
      DEFAULT_SIZES[0].id,
      'edited-variant',
      'blob:preview'
    );
  });

  it('skips a preview the engine cannot render and leaves the variant alone', async () => {
    engine.scene.get.mockReturnValue(null);
    render(<App config={{}} />);

    await userEvent.click(screen.getByText('edit variant'));
    const onSave = modal.open.mock.calls[0][2] as (s: string) => Promise<void>;
    await onSave('edited-variant');

    expect(variants.updateVariant).not.toHaveBeenCalled();
    expect(modal.close).toHaveBeenCalledTimes(1);
  });

  it('ignores an edit of a variant that has no scene', async () => {
    render(<App config={{}} />);

    await userEvent.click(screen.getByText('edit unsaved variant'));

    expect(modal.open).not.toHaveBeenCalled();
  });

  it('does nothing until the headless engine is ready', async () => {
    engineHolder.current = null;
    render(<App config={{}} />);

    await userEvent.click(screen.getByText('edit'));
    await userEvent.click(screen.getByText('edit variant'));
    const onSave = modal.open.mock.calls[0][2] as (s: string) => Promise<void>;
    await onSave('edited-variant');

    expect(engine.scene.load).not.toHaveBeenCalled();
    expect(variants.updateVariant).not.toHaveBeenCalled();
  });

  it('generates variants for the selected template', async () => {
    render(<App config={{}} />);

    await userEvent.click(screen.getByText('generate'));

    expect(variants.generate).toHaveBeenCalledWith(templates.selectedTemplate);
  });
});
