// @vitest-environment jsdom
import type CreativeEditorSDK from '@cesdk/cesdk-js';
import type { Configuration } from '@cesdk/cesdk-js';
import { render, screen, userEvent } from '@imgly/kit-test-harness/component';
import { createApiSpy } from '@imgly/kit-test-harness/vitest';
import { describe, expect, it, vi } from 'vitest';

const editor = vi.hoisted(() => ({
  init: undefined as undefined | ((cesdk: CreativeEditorSDK) => Promise<void>)
}));

vi.mock('@cesdk/cesdk-js', () => ({ default: { version: '0.0.0-test' } }));

vi.mock('@cesdk/cesdk-js/plugins', async () => {
  const { assetSourceStubs } = await import('../unit/plugin-stubs');
  return assetSourceStubs();
});

vi.mock('@cesdk/cesdk-js/react', () => ({
  CreativeEditor: (props: {
    init: (cesdk: CreativeEditorSDK) => Promise<void>;
  }) => {
    editor.init = props.init;
    return null;
  }
}));

import { App } from '../../src/app/App';
import { LocaleSwitcher, LOCALES } from '../../src/app/LocaleSwitcher';

describe('TI-C1 LocaleSwitcher', () => {
  it('renders one button per locale', () => {
    render(<LocaleSwitcher selectedLocale="en" onLocaleChange={vi.fn()} />);
    expect(LOCALES.map(({ label }) => label)).toEqual(['English', 'German']);
    expect(screen.getByRole('button', { name: 'English' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'German' })).toBeTruthy();
  });

  it('marks only the selected locale active', () => {
    render(<LocaleSwitcher selectedLocale="de" onLocaleChange={vi.fn()} />);
    expect(screen.getByRole('button', { name: 'German' }).className).toBe(
      'active'
    );
    expect(screen.getByRole('button', { name: 'English' }).className).toBe('');
  });

  it('reports the clicked locale, including the one already selected', async () => {
    const onLocaleChange = vi.fn();
    render(
      <LocaleSwitcher selectedLocale="en" onLocaleChange={onLocaleChange} />
    );
    await userEvent.click(screen.getByRole('button', { name: 'German' }));
    expect(onLocaleChange).toHaveBeenCalledWith('de');
    await userEvent.click(screen.getByRole('button', { name: 'English' }));
    expect(onLocaleChange).toHaveBeenLastCalledWith('en');
  });
});

describe('TI-C2 App', () => {
  async function mount() {
    render(<App editorConfig={{} as Configuration} />);
    const spy = createApiSpy<CreativeEditorSDK>();
    await editor.init?.(spy.api);
    return spy;
  }

  it('configures the editor and loads the demo scene on init', async () => {
    const spy = await mount();
    expect(spy.callsTo('addPlugin').length).toBeGreaterThan(0);
    expect(String(spy.lastArgsOf('load')?.[0])).toMatch(
      /\/assets\/example-1\.scene$/
    );
  });

  it('switches the locale through the i18n runtime API, not by remounting', async () => {
    const spy = await mount();
    const plugins = spy.callsTo('addPlugin').length;

    await userEvent.click(screen.getByRole('button', { name: 'German' }));

    expect(spy.lastArgsOf('i18n.setLocale')).toEqual(['de']);
    expect(spy.callsTo('addPlugin')).toHaveLength(plugins);
    expect(screen.getByRole('button', { name: 'German' }).className).toBe(
      'active'
    );
  });

  it('starts in German on a German browser', async () => {
    vi.spyOn(navigator, 'language', 'get').mockReturnValue('de-DE');
    const spy = await mount();

    expect(spy.lastArgsOf('i18n.setLocale')).toEqual(['de']);
    expect(screen.getByRole('button', { name: 'German' }).className).toBe(
      'active'
    );
  });

  it('still switches the button when the editor has not initialised yet', async () => {
    editor.init = undefined;
    render(<App editorConfig={{} as Configuration} />);

    await userEvent.click(screen.getByRole('button', { name: 'German' }));

    expect(screen.getByRole('button', { name: 'German' }).className).toBe(
      'active'
    );
  });
});
