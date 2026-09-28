// @vitest-environment jsdom
import type CreativeEditorSDK from '@cesdk/cesdk-js';
import {
  render,
  screen,
  userEvent,
  waitFor
} from '@imgly/kit-test-harness/component';
import { createApiSpy } from '@imgly/kit-test-harness/vitest';
import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('@cesdk/cesdk-js', () => ({ default: { version: '0.0.0-test' } }));

import { ColorPicker } from '../../src/app/ColorPicker/ColorPicker';
import { ThemingSidebar } from '../../src/app/ThemingSidebar';
import { COLOR_PRESETS, THEME_COLORS } from '../../src/app/theme-colors';

function themeStyle(): HTMLStyleElement | null {
  return document.getElementById(
    'cesdk-custom-theme'
  ) as HTMLStyleElement | null;
}

afterEach(() => {
  themeStyle()?.remove();
});

describe('THM-C1 ColorPicker', () => {
  it('opens and closes its picker from the trigger', async () => {
    const onOpenChange = vi.fn();
    render(
      <ColorPicker
        name="surfaceColor"
        label="Surface Background"
        value="#111111"
        onChange={vi.fn()}
        onOpenChange={onOpenChange}
      />
    );

    await userEvent.click(
      screen.getByLabelText('Surface Background picker', { selector: 'label' })
    );
    expect(onOpenChange).toHaveBeenLastCalledWith(true);
    await userEvent.click(
      screen.getByLabelText('Surface Background picker', { selector: 'label' })
    );
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
  });

  it('reports a preset colour and debounces the follow-up callback', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const onChange = vi.fn();
    const onChangeDebounced = vi.fn();
    render(
      <ColorPicker
        name="surfaceColor"
        label="Surface"
        value="#111111"
        presetColors={['#ff0000', '#00ff00']}
        onChange={onChange}
        onChangeDebounced={onChangeDebounced}
      />
    );

    await userEvent.click(screen.getByLabelText('Surface #ff0000'));
    expect(onChange).toHaveBeenCalledWith('#ff0000');
    expect(onChangeDebounced).not.toHaveBeenCalled();

    await vi.advanceTimersByTimeAsync(600);
    expect(onChangeDebounced).toHaveBeenCalledTimes(1);
    vi.useRealTimers();
  });

  it('ignores a click outside that the user did not make', async () => {
    const onOpenChange = vi.fn();
    render(
      <div>
        <span data-testid="outside">outside</span>
        <ColorPicker
          name="surfaceColor"
          label="Surface"
          value="#111111"
          open
          onChange={vi.fn()}
          onOpenChange={onOpenChange}
        />
      </div>
    );

    // Every event a test can dispatch is untrusted; the hook drops those on
    // purpose, so a synthetic click never closes the picker.
    await userEvent.click(screen.getByTestId('outside'));
    expect(onOpenChange).not.toHaveBeenCalled();

    await userEvent.click(screen.getByLabelText('Surface picker'));
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
  });

  it('labels its trigger and its presets from the name when no label is given', () => {
    render(
      <ColorPicker
        name="surfaceColor"
        value="#111111"
        presetColors={['#ff0000']}
        onChange={vi.fn()}
      />
    );

    expect(screen.getByLabelText('surfaceColor picker')).toBeTruthy();
    expect(screen.getByLabelText('surfaceColor #ff0000')).toBeTruthy();
  });

  it('renders a caller-supplied trigger and falls back to the name as a label', async () => {
    const onOpenChange = vi.fn();
    render(
      <ColorPicker
        name="accentColor"
        value="#111111"
        onChange={vi.fn()}
        onOpenChange={onOpenChange}
      >
        <button type="button">Pick</button>
      </ColorPicker>
    );

    expect(screen.getByLabelText('accentColor hex value')).toBeTruthy();
    await userEvent.click(screen.getByRole('button', { name: 'Pick' }));
    expect(onOpenChange).toHaveBeenLastCalledWith(true);
  });

  it('survives a change when the caller passes no debounced callback', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const onChange = vi.fn();
    render(
      <ColorPicker
        name="surfaceColor"
        label="Surface"
        value="#111111"
        presetColors={['#ff0000']}
        onChange={onChange}
      />
    );

    await userEvent.click(screen.getByLabelText('Surface #ff0000'));
    await vi.advanceTimersByTimeAsync(600);
    expect(onChange).toHaveBeenCalledWith('#ff0000');
    vi.useRealTimers();
  });
});

describe('THM-C2 ThemingSidebar', () => {
  function mount() {
    const spy = createApiSpy<CreativeEditorSDK>();
    render(<ThemingSidebar cesdk={spy.api} />);
    return spy;
  }

  it('starts on the dark theme at normal scale', () => {
    mount();
    expect(screen.getByRole('button', { name: 'Dark' }).className).toBe(
      'active'
    );
    expect(screen.getByRole('button', { name: 'Normal' }).className).toBe(
      'active'
    );
  });

  it('hands the theme and the scale to the editor', async () => {
    const spy = mount();

    await userEvent.click(screen.getByRole('button', { name: 'Light' }));
    expect(spy.lastArgsOf('ui.setTheme')).toEqual(['light']);

    await userEvent.click(screen.getByRole('button', { name: 'Large' }));
    expect(spy.lastArgsOf('ui.setScale')).toEqual(['large']);
  });

  it('does nothing when the editor is not ready yet', async () => {
    render(<ThemingSidebar cesdk={null} />);

    await userEvent.click(screen.getByRole('button', { name: 'Light' }));

    expect(screen.getByRole('button', { name: 'Dark' }).className).toBe(
      'active'
    );
  });

  it('writes a custom theme stylesheet once a colour is picked', async () => {
    mount();
    expect(themeStyle()).toBeNull();

    await userEvent.click(
      screen.getByLabelText(`Surface Background ${COLOR_PRESETS.surface[0]}`)
    );

    await waitFor(() => expect(themeStyle()).not.toBeNull());
    expect(themeStyle()?.textContent).toContain('.ubq-public {');
    expect(themeStyle()?.textContent).toContain('--ubq-');
  });

  it('drops the custom stylesheet again when the theme changes', async () => {
    mount();
    await userEvent.click(
      screen.getByLabelText(`Canvas Background ${COLOR_PRESETS.canvas[0]}`)
    );
    await waitFor(() => expect(themeStyle()).not.toBeNull());

    await userEvent.click(screen.getByRole('button', { name: 'Light' }));

    await waitFor(() => expect(themeStyle()).toBeNull());
  });

  it('shows the theme defaults until a colour is customised', async () => {
    mount();
    const surface = screen.getByLabelText('Surface Background picker', {
      selector: 'label'
    });
    const swatch = document.createElement('span');
    swatch.style.backgroundColor = THEME_COLORS.dark.surfaceColor;
    expect(
      (surface.querySelector('span') as HTMLElement).style.backgroundColor
    ).toBe(swatch.style.backgroundColor);
  });

  it('keeps only one colour picker open at a time', async () => {
    mount();
    const open = (label: string) =>
      userEvent.click(
        screen.getByLabelText(`${label} picker`, { selector: 'label' })
      );

    await open('Surface Background');
    await open('Accent');

    const modals = document.querySelectorAll('[class*="pickerModal"]');
    const visible = [...modals].filter(
      (node) => (node as HTMLElement).style.display === 'block'
    );
    expect(visible).toHaveLength(1);
  });

  it('takes a colour from every picker, not only the first', async () => {
    mount();

    for (const [label, presets] of [
      ['Surface Background', COLOR_PRESETS.surface],
      ['Canvas Background', COLOR_PRESETS.canvas],
      ['Active', COLOR_PRESETS.active],
      ['Accent', COLOR_PRESETS.accent]
    ] as const) {
      await userEvent.click(screen.getByLabelText(`${label} ${presets[0]}`));
    }

    await waitFor(() => expect(themeStyle()).not.toBeNull());
    expect(themeStyle()?.textContent).toContain('.ubq-public {');
  });

  it('closes the open picker when its own trigger is clicked again', async () => {
    mount();
    const trigger = () =>
      screen.getByLabelText('Active picker', { selector: 'label' });

    await userEvent.click(trigger());
    await userEvent.click(trigger());

    const modals = document.querySelectorAll('[class*="pickerModal"]');
    const visible = [...modals].filter(
      (node) => (node as HTMLElement).style.display === 'block'
    );
    expect(visible).toHaveLength(0);
  });

  it('keeps the scale and theme selection when the editor is missing', async () => {
    render(<ThemingSidebar cesdk={null} />);

    await userEvent.click(screen.getByRole('button', { name: 'Large' }));
    await userEvent.click(screen.getByRole('button', { name: 'Dark' }));

    expect(screen.getByRole('button', { name: 'Normal' }).className).toBe(
      'active'
    );
  });

  it('switches back to the dark theme and the normal scale', async () => {
    const spy = mount();

    await userEvent.click(screen.getByRole('button', { name: 'Light' }));
    await userEvent.click(screen.getByRole('button', { name: 'Dark' }));
    expect(spy.lastArgsOf('ui.setTheme')).toEqual(['dark']);

    await userEvent.click(screen.getByRole('button', { name: 'Large' }));
    await userEvent.click(screen.getByRole('button', { name: 'Normal' }));
    expect(spy.lastArgsOf('ui.setScale')).toEqual(['normal']);
  });

  it('opens and closes each picker from its own trigger', async () => {
    mount();
    const trigger = (label: string) =>
      screen.getByLabelText(`${label} picker`, { selector: 'label' });
    const visible = () =>
      [...document.querySelectorAll('[class*="pickerModal"]')].filter(
        (node) => (node as HTMLElement).style.display === 'block'
      ).length;

    await userEvent.click(trigger('Surface Background'));
    expect(visible()).toBe(1);
    await userEvent.click(trigger('Surface Background'));
    expect(visible()).toBe(0);

    await userEvent.click(trigger('Canvas Background'));
    expect(visible()).toBe(1);
  });
});
