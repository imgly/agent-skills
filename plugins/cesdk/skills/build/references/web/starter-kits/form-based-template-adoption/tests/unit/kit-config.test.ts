import type CreativeEditorSDK from '@cesdk/cesdk-js';
import type { EditorPlugin } from '@cesdk/cesdk-js';
import { createApiSpy } from '@imgly/kit-test-harness/vitest';
import { beforeAll, describe, expect, it, vi } from 'vitest';

import { setupActions } from '../../src/imgly/config/actions';
import { initFormBasedTemplateAdoption } from '../../src/imgly';

const spy = createApiSpy<CreativeEditorSDK>();

beforeAll(async () => {
  vi.stubGlobal(
    'ResizeObserver',
    class {
      observe() {}
      disconnect() {}
    }
  );
  await initFormBasedTemplateAdoption(spy.api);

  const plugin = spy
    .callsTo('addPlugin')
    .map(({ args }) => args[0] as EditorPlugin)
    .find((added) => added.name === 'ly.img.form-based-template-adoption')!;
  await plugin.initialize({ cesdk: spy.api } as never);
});

function componentOrder(target: string): unknown[] {
  const calls = spy
    .callsTo('ui.setComponentOrder')
    .filter(({ args }) => (args[0] as { in: string }).in === target);
  return (calls.at(-1)?.args[1] as unknown[]) ?? [];
}

describe('FTA-U3 editor configuration', () => {
  it('opens the editor as a Creator in the light theme', () => {
    expect(spy.lastArgsOf('engine.editor.setRole')).toEqual(['Creator']);
    expect(spy.lastArgsOf('ui.setTheme')).toEqual(['light']);
  });

  it('turns off the dock and the page resize button', () => {
    const flags = new Map(
      spy.callsTo('feature.set').map(({ args }) => [args[0] as string, args[1]])
    );
    expect(flags.get('ly.img.dock')).toBe(false);
    expect(flags.get('ly.img.page.resize')).toBe(false);
  });

  it('empties the inspector bar, the dock and the canvas bar', () => {
    expect(componentOrder('ly.img.inspector.bar')).toEqual([]);
    expect(componentOrder('ly.img.dock')).toEqual([]);
    expect(componentOrder('ly.img.canvas.bar')).toEqual([]);
  });

  it('leaves only undo/redo and the two export actions in the navigation bar', () => {
    expect(componentOrder('ly.img.navigation.bar')).toEqual([
      'ly.img.undoRedo.navigationBar',
      'ly.img.spacer',
      {
        id: 'ly.img.actions.navigationBar',
        children: [
          'ly.img.exportImage.navigationBar',
          'ly.img.exportPDF.navigationBar'
        ]
      }
    ]);
  });

  it('denies canvas selection and stops mouse zoom and scroll', () => {
    expect(spy.lastArgsOf('engine.editor.setGlobalScope')).toEqual([
      'editor/select',
      'Deny'
    ]);
    const settings = new Map(
      spy
        .callsTo('engine.editor.setSetting')
        .map(({ args }) => [args[0] as string, args[1]])
    );
    expect(settings.get('mouse/enableZoom')).toBe(false);
    expect(settings.get('mouse/enableScroll')).toBe(false);
    expect(settings.get('page/title/show')).toBe(false);
  });

  it('opens its own panel and does not let the user close it', () => {
    expect(spy.lastArgsOf('ui.registerPanel')?.[0]).toBe('form-based-adaption');
    expect(spy.lastArgsOf('ui.openPanel')).toEqual([
      'form-based-adaption',
      { closableByUser: false }
    ]);
  });

  it('titles the panel in English and German', () => {
    const translations = spy.lastArgsOf('i18n.setTranslations')?.[0] as {
      en: Record<string, string>;
      de: Record<string, string>;
    };
    expect(translations.en['panel.form-based-adaption']).toBe('Edit Template');
    expect(translations.de['panel.form-based-adaption']).toBe(
      'Template bearbeiten'
    );
  });

  it('limits the demo asset sources to images', () => {
    const demo = spy
      .callsTo('addPlugin')
      .map(({ args }) => args[0] as { name?: string; config?: unknown })
      .find((plugin) => plugin.name === 'cesdk-demo-asset-sources');
    expect((demo?.config as { include: string[] }).include).toEqual([
      'ly.img.image.*'
    ]);
  });
});

describe('FTA-U3 asset-source registration', () => {
  it('requests every asset source before it waits for any of them', async () => {
    const requested: string[] = [];
    const pending: Array<() => void> = [];
    const addPlugin = (plugin: { name: string }) => {
      requested.push(plugin.name);
      return new Promise<void>((resolve) => pending.push(resolve));
    };
    const recorder = createApiSpy<CreativeEditorSDK>();
    const gated = new Proxy(recorder.api as object, {
      get: (target, key) =>
        key === 'addPlugin' ? addPlugin : Reflect.get(target, key)
    }) as CreativeEditorSDK;
    const settle = () => pending.splice(0).forEach((resolve) => resolve());

    const init = initFormBasedTemplateAdoption(gated);

    await vi.waitFor(() => expect(requested).toEqual(['cesdk-design-editor']));

    settle();
    await vi.waitFor(() => expect(requested).toHaveLength(15));
    expect(requested).not.toContain('ly.img.form-based-template-adoption');

    settle();
    await vi.waitFor(() => expect(requested).toHaveLength(16));
    settle();
    await init;
    expect(requested.at(-1)).toBe('ly.img.form-based-template-adoption');
  });
});

describe('FTA-U4 setupActions', () => {
  const actionsSpy = createApiSpy<CreativeEditorSDK>();
  setupActions(actionsSpy.api);
  const registered = actionsSpy
    .callsTo('actions.register')
    .map(({ args }) => args[0] as string);

  it('registers the five actions the kit ships', () => {
    expect(registered).toEqual([
      'saveScene',
      'exportDesign',
      'importScene',
      'exportScene',
      'uploadFile'
    ]);
  });
});
