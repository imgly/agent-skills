// @vitest-environment jsdom
import { describe, expect, it, vi } from 'vitest';

import {
  act,
  render,
  renderHook,
  screen,
  userEvent
} from '@imgly/kit-test-harness/component';

import { EditOverlay } from '../../src/app/EditOverlay/EditOverlay';
import { Spinner } from '../../src/app/Spinner/Spinner';
import { TemplateCard } from '../../src/app/TemplateCard/TemplateCard';
import { VariantCard } from '../../src/app/VariantCard/VariantCard';
import { useEditorModal, useTemplates } from '../../src/app/hooks';
import { DEFAULT_SIZES } from '../../src/imgly/sizes';

const [size] = DEFAULT_SIZES;

const template = {
  id: 'template-1',
  sceneUrl: 'https://cdn.test/one.scene',
  previewImagePath: 'https://cdn.test/one.png'
} as never;

describe('AR-C1 EditOverlay and Spinner', () => {
  it('reports the click and keeps it off the card behind it', async () => {
    const onClick = vi.fn();
    const onCard = vi.fn();
    render(
      <div onClick={onCard}>
        <EditOverlay onClick={onClick} />
      </div>
    );

    await userEvent.click(screen.getByRole('button', { name: 'Edit' }));

    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onCard).not.toHaveBeenCalled();
  });

  it('swallows the click when the caller registered no handler', async () => {
    const onCard = vi.fn();
    render(
      <div onClick={onCard}>
        <EditOverlay />
      </div>
    );

    await userEvent.click(screen.getByRole('button', { name: 'Edit' }));

    expect(onCard).not.toHaveBeenCalled();
  });

  it('renders the spinner as a bare element', () => {
    const { container } = render(<Spinner />);
    expect(container.firstElementChild?.tagName).toBe('DIV');
  });
});

describe('AR-C2 TemplateCard', () => {
  function mount(isSelected: boolean) {
    const onClick = vi.fn();
    const onEdit = vi.fn();
    render(
      <TemplateCard
        template={template}
        index={0}
        isSelected={isSelected}
        onClick={onClick}
        onEdit={onEdit}
      />
    );
    return { onClick, onEdit };
  }

  it('selects an unselected template and shows no edit overlay', async () => {
    const { onClick, onEdit } = mount(false);

    expect(screen.queryByRole('button', { name: 'Edit' })).toBeNull();
    await userEvent.click(screen.getByRole('img', { name: 'Template 1' }));

    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onEdit).not.toHaveBeenCalled();
  });

  it('edits the template that is already selected', async () => {
    const { onClick, onEdit } = mount(true);

    expect(screen.getByRole('button', { name: 'Edit' })).toBeTruthy();
    await userEvent.click(screen.getByRole('img', { name: 'Template 1' }));

    expect(onEdit).toHaveBeenCalledTimes(1);
    expect(onClick).not.toHaveBeenCalled();
  });
});

describe('AR-C3 VariantCard', () => {
  function mount(variant: { size: unknown; src?: string; isLoading: boolean }) {
    const onEdit = vi.fn();
    const onDownload = vi.fn();
    render(
      <VariantCard
        variant={variant as never}
        onEdit={onEdit}
        onDownload={onDownload}
      />
    );
    return { onEdit, onDownload };
  }

  it('names the size and its pixel dimensions', () => {
    mount({ size, isLoading: false });
    expect(screen.getByText(size.label)).toBeTruthy();
    expect(screen.getByText(`${size.width} × ${size.height} px`)).toBeTruthy();
  });

  it('offers neither editing nor downloading while the render runs', () => {
    mount({ size, src: 'blob:variant/1', isLoading: true });
    expect(screen.queryByRole('button', { name: 'Edit' })).toBeNull();
    expect(screen.queryByRole('button', { name: /Download/ })).toBeTruthy();
  });

  it('offers nothing at all before the first render finishes', () => {
    mount({ size, isLoading: false });
    expect(screen.queryByRole('button', { name: 'Edit' })).toBeNull();
    expect(screen.queryByRole('button', { name: /Download/ })).toBeNull();
  });

  it('reports edit and download once the variant carries an image', async () => {
    const { onEdit, onDownload } = mount({
      size,
      src: 'blob:variant/1',
      isLoading: false
    });

    await userEvent.click(screen.getByRole('button', { name: 'Edit' }));
    expect(onEdit).toHaveBeenCalledTimes(1);

    await userEvent.click(screen.getByRole('button', { name: /Download/ }));
    expect(onDownload).toHaveBeenCalledTimes(1);
  });
});

describe('AR-C4 useEditorModal', () => {
  it('opens on a scene and a mode, then closes without forgetting them', () => {
    const { result } = renderHook(() => useEditorModal());
    const onSave = vi.fn();

    expect(result.current.isOpen).toBe(false);

    act(() => result.current.open('{"scene":1}', 'design', onSave));
    expect(result.current).toMatchObject({
      isOpen: true,
      scene: '{"scene":1}',
      mode: 'design',
      onSave
    });

    act(() => result.current.close());
    expect(result.current.isOpen).toBe(false);
    expect(result.current.scene).toBe('{"scene":1}');
  });
});

describe('AR-C5 useTemplates', () => {
  it('starts on the first bundled template and moves the selection', () => {
    const { result } = renderHook(() => useTemplates());

    expect(result.current.templates.length).toBeGreaterThan(1);
    expect(result.current.selectedIndex).toBe(0);
    expect(result.current.selectedTemplate).toBe(result.current.templates[0]);

    act(() => result.current.select(1));
    expect(result.current.selectedTemplate).toBe(result.current.templates[1]);
  });

  it('stores an edited scene on the template it belongs to', () => {
    const { result } = renderHook(() => useTemplates());
    const [first, second] = result.current.templates;

    act(() => result.current.updateTemplate(first, '{"scene":1}'));

    expect(result.current.templates[0].sceneString).toBe('{"scene":1}');
    expect(result.current.templates[0].previewImagePath).toBe(
      first.previewImagePath
    );
    expect(result.current.templates[1]).toBe(second);
  });

  it('replaces the preview only when a new one is handed over', () => {
    const { result } = renderHook(() => useTemplates());

    act(() =>
      result.current.updateTemplate(
        result.current.templates[0],
        '{"scene":2}',
        'blob:preview/1'
      )
    );

    expect(result.current.templates[0].previewImagePath).toBe('blob:preview/1');
  });
});
