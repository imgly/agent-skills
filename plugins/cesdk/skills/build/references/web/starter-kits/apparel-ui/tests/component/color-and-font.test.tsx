// @vitest-environment jsdom
import type { Typeface } from '@cesdk/engine';
import {
  act,
  render,
  screen,
  userEvent
} from '@imgly/kit-test-harness/component';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ColorPicker } from '../../src/app/ui/ColorPicker/ColorPicker';
import FontPreview from '../../src/app/ui/FontPreview/FontPreview';

const TYPEFACE = {
  name: 'Oswald',
  fonts: [
    {
      uri: 'https://fonts.example/oswald-bold.ttf',
      weight: 'bold',
      style: 'normal'
    },
    {
      uri: 'https://fonts.example/oswald.ttf',
      weight: 'normal',
      style: 'normal'
    }
  ]
} as unknown as Typeface;

const BOLD_ONLY = {
  name: 'Heavy',
  fonts: [
    { uri: 'https://fonts.example/heavy.ttf', weight: 'bold', style: 'italic' }
  ]
} as unknown as Typeface;

describe('AP-C4 FontPreview', () => {
  it('AP-C4 picks the normal/normal font and declares its face', () => {
    const { container } = render(<FontPreview typeface={TYPEFACE} text="Ag" />);
    const css = container.querySelector('style')!.textContent!;
    expect(css).toContain('https://fonts.example/oswald.ttf');
    expect(css).toContain("font-family: 'Oswald'");
    expect(css).toContain('font-weight: normal');
    expect(screen.getByText('Ag')).toBeTruthy();
  });

  it('AP-C4 falls back to the first font when there is no normal one', () => {
    const { container } = render(<FontPreview typeface={BOLD_ONLY} />);
    expect(container.querySelector('style')!.textContent).toContain(
      'https://fonts.example/heavy.ttf'
    );
  });

  it('AP-C4 renders the typeface name when no text is given', () => {
    render(<FontPreview typeface={TYPEFACE} />);
    expect(screen.getByText('Oswald')).toBeTruthy();
  });
});

describe('AP-C5 ColorPicker', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  const panel = (container: HTMLElement) =>
    container.querySelector('[class*="pickerModal"]') as HTMLElement;

  it('AP-C5 opens the panel from the trigger and stops the click there', async () => {
    const outside = vi.fn();
    const { container } = render(
      <div onClick={outside}>
        <ColorPicker name="c" value="#ffffffff" onChange={vi.fn()}>
          <button>Pick color</button>
        </ColorPicker>
      </div>
    );
    expect(panel(container).style.display).toBe('none');

    await userEvent.click(screen.getByRole('button', { name: 'Pick color' }));
    expect(panel(container).style.display).toBe('block');
    expect(outside).not.toHaveBeenCalled();
  });

  it('AP-C5 reports a preset click', async () => {
    const onChange = vi.fn();
    render(
      <ColorPicker
        name="c"
        value="#ffffffff"
        presetColors={['#ff0000', '#00ff00']}
        onChange={onChange}
      >
        <button>Pick color</button>
      </ColorPicker>
    );
    const presets = screen
      .getAllByRole('button')
      .filter((button) => button.textContent === '');
    await userEvent.click(presets[0]);
    expect(onChange).toHaveBeenCalledWith('#ff0000');
  });

  it('AP-C5 debounces the follow-up callback to one call', async () => {
    vi.useFakeTimers();
    const onChangeDebounced = vi.fn();
    render(
      <ColorPicker
        name="c"
        value="#ffffffff"
        presetColors={['#ff0000', '#00ff00']}
        onChange={vi.fn()}
        onChangeDebounced={onChangeDebounced}
      >
        <button>Pick color</button>
      </ColorPicker>
    );
    const presets = screen
      .getAllByRole('button')
      .filter((button) => button.textContent === '');

    await act(async () => {
      presets[0].click();
      presets[1].click();
    });
    await act(async () => {
      vi.advanceTimersByTime(499);
    });
    expect(onChangeDebounced).not.toHaveBeenCalled();

    await act(async () => {
      vi.advanceTimersByTime(1);
    });
    expect(onChangeDebounced).toHaveBeenCalledTimes(1);
  });
});
