// @vitest-environment jsdom
import type { RGBAColor, Typeface } from '@cesdk/engine';
import {
  render,
  renderHook,
  screen,
  userEvent
} from '@imgly/kit-test-harness/component';
import { describe, expect, it, vi } from 'vitest';
import AlignmentSelect from '@/app/components/AlignmentSelect/AlignmentSelect';
import BlockBar from '@/app/components/BlockBar/BlockBar';
import { useBlockBar } from '@/app/components/BlockBarContext/BlockBarContext';
import ColorDropdown from '@/app/components/ColorDropdown/ColorDropdown';
import FontPreview from '@/app/components/FontPreview/FontPreview';
import IconButton from '@/app/components/IconButton/IconButton';
import ImageBarButton from '@/app/features/image/ImageBar/ImageBarButton';
import TextSizeDropdown from '@/app/features/text/TextSizeDropdown/TextSizeDropdown';

// The dropdowns subscribe to the engine canvas for touch events, and the
// adjustment bars report their height to the single-page-mode padding.
vi.mock('@/app/contexts/EngineContext', () => ({
  useEngine: () => ({ engine: { element: document.createElement('div') } })
}));
vi.mock('@/app/contexts/SinglePageModeContext', () => ({
  useSinglePageMode: () => ({
    setPaddingBottom: vi.fn(),
    defaultPaddingBottom: 92
  })
}));

// jsdom ships no ResizeObserver, which the adjustment bars observe themselves with.
vi.stubGlobal(
  'ResizeObserver',
  class {
    observe(): void {}
    unobserve(): void {}
    disconnect(): void {}
  }
);

const PALETTE: RGBAColor[] = [
  { r: 1, g: 0, b: 0, a: 1 },
  { r: 0, g: 1, b: 0, a: 1 }
];

const TYPEFACE = {
  name: 'Caveat',
  fonts: [
    {
      uri: 'https://fonts.example/caveat-bold.ttf',
      weight: 'bold',
      style: 'normal'
    },
    {
      uri: 'https://fonts.example/caveat.ttf',
      weight: 'normal',
      style: 'normal'
    }
  ]
} as unknown as Typeface;

describe('PC-C3 TextSizeDropdown and ColorDropdown', () => {
  it('PC-C3 offers S, M and L mapped to 14, 18 and 22', async () => {
    const onSelect = vi.fn();
    render(<TextSizeDropdown activeTextSize={18} onSelect={onSelect} />);

    await userEvent.click(screen.getByRole('button', { name: 'Size' }));
    for (const label of ['S', 'M', 'L']) {
      expect(screen.getByRole('button', { name: label })).toBeTruthy();
    }
    expect(screen.getByRole('button', { name: 'M' }).className).toContain(
      'item--active'
    );

    await userEvent.click(screen.getByRole('button', { name: 'S' }));
    expect(onSelect).toHaveBeenCalledWith(14);
  });

  it('PC-C3 renders the palette it is given and reports the clicked colour', async () => {
    const onClick = vi.fn();
    render(
      <ColorDropdown
        label="Accent"
        colorPalette={PALETTE}
        activeColor={PALETTE[1]}
        onClick={onClick}
      />
    );

    await userEvent.click(screen.getByRole('button', { name: 'Accent' }));
    const swatches = screen
      .getAllByRole('button')
      .filter((button) => button.className.includes('colorButton'));
    // Two palette colours plus the picker trigger.
    expect(swatches).toHaveLength(3);
    expect(swatches[1].className).toContain('colorButton--active');

    await userEvent.click(swatches[0]);
    expect(onClick).toHaveBeenCalledWith(PALETTE[0]);
  });
});

describe('PC-C4 AlignmentSelect and IconButton', () => {
  it('PC-C4 emits Left, Center and Right', async () => {
    const onClick = vi.fn();
    render(<AlignmentSelect activeAlignment="Center" onClick={onClick} />);

    for (const value of ['Left', 'Center', 'Right']) {
      await userEvent.click(screen.getByRole('button', { name: value }));
      expect(onClick).toHaveBeenCalledWith(value);
    }
    expect(screen.getByRole('button', { name: 'Center' }).className).toContain(
      'wrapper--active'
    );
  });

  it('PC-C4 renders the IconButton label only when children are given', () => {
    const { unmount } = render(<IconButton icon={<span />} />);
    expect(screen.getByRole('button').textContent).toBe('');
    unmount();

    render(
      <IconButton icon={<span />} isActive>
        Delete
      </IconButton>
    );
    const button = screen.getByRole('button', { name: 'Delete' });
    expect(button.className).toContain('wrapper--active');
  });
});

describe('PC-C5 BlockBar and BlockBarContext', () => {
  const ITEMS = [
    { id: 'one', label: 'One', Icon: <span />, Component: <p>panel one</p> },
    { id: 'two', label: 'Two', Icon: <span />, Component: <p>panel two</p> }
  ];

  it('PC-C5 renders only the selected item and deselects on a second click', async () => {
    render(<BlockBar items={ITEMS} />);
    expect(screen.queryByText('panel one')).toBeNull();

    await userEvent.click(screen.getByRole('button', { name: 'One' }));
    expect(screen.getByText('panel one')).toBeTruthy();
    expect(screen.queryByText('panel two')).toBeNull();

    await userEvent.click(screen.getByRole('button', { name: 'One' }));
    expect(screen.queryByText('panel one')).toBeNull();
  });

  it('PC-C5 throws when useBlockBar runs outside the provider', () => {
    expect(() => renderHook(() => useBlockBar())).toThrow(
      'useBlockBar must be used within a BlockBarProvider'
    );
  });
});

describe('PC-C6 FontPreview and ImageBarButton', () => {
  it('PC-C6 declares the normal face and renders the typeface name', () => {
    const { container } = render(<FontPreview typeface={TYPEFACE} />);
    const css = container.querySelector('style')!.textContent!;
    expect(css).toContain('https://fonts.example/caveat.ttf');
    expect(css).toContain("font-family: 'Caveat'");
    expect(screen.getByText('Caveat')).toBeTruthy();
  });

  it('PC-C6 disables the image button while its click is pending', async () => {
    let release: () => void = () => {};
    const onClick = vi.fn(
      () =>
        new Promise<void>((resolve) => {
          release = resolve;
        })
    );
    render(
      <ImageBarButton
        imageAsset={{ id: 'a', meta: { thumbUri: 'thumb.png' } } as never}
        onClick={onClick}
      />
    );

    const button = screen.getByRole('button', { name: 'sample asset' });
    await userEvent.click(button);
    expect(button.hasAttribute('disabled')).toBe(true);

    release();
    await vi.waitFor(() => expect(button.hasAttribute('disabled')).toBe(false));
  });
});
