import { createApiSpy } from '@imgly/kit-test-harness/vitest';
import type CreativeEditorSDK from '@cesdk/cesdk-js';
import { describe, expect, it } from 'vitest';

import { setupActions } from '../../src/imgly/config/actions';
import { setupFeatures } from '../../src/imgly/config/features';
import { setupNavigationBar } from '../../src/imgly/config/ui/navigationBar';

type ComponentEntry = string | { id: string; children?: string[] };

describe('CM-U3 the editor config', () => {
  it('orders the navigation bar and puts both exports in the Actions dropdown', () => {
    const spy = createApiSpy<CreativeEditorSDK>();
    setupNavigationBar(spy.api);

    const [target, order] = spy.lastArgsOf('ui.setComponentOrder') as [
      { in: string },
      ComponentEntry[]
    ];
    expect(target).toEqual({ in: 'ly.img.navigation.bar' });
    expect(order.slice(0, 6)).toEqual([
      'ly.img.documentSettings.navigationBar',
      'ly.img.undoRedo.navigationBar',
      'ly.img.spacer',
      'ly.img.title.navigationBar',
      'ly.img.spacer',
      'ly.img.zoom.navigationBar'
    ]);
    expect(order.at(-1)).toEqual({
      id: 'ly.img.actions.navigationBar',
      children: [
        'ly.img.exportImage.navigationBar',
        'ly.img.exportPDF.navigationBar'
      ]
    });
  });

  it('registers the five actions the kit overrides', () => {
    const spy = createApiSpy<CreativeEditorSDK>();
    setupActions(spy.api);

    expect(
      spy
        .callsTo('actions.register')
        .map(({ args }) => args[0] as string)
        .sort()
    ).toEqual([
      'exportDesign',
      'exportScene',
      'importScene',
      'saveScene',
      'uploadFile'
    ]);
  });

  it('enables the design features once and no video feature', () => {
    const spy = createApiSpy<CreativeEditorSDK>();
    setupFeatures(spy.api);

    const enabled = spy.lastArgsOf('feature.enable')?.[0] as string[];
    expect(spy.callsTo('feature.enable')).toHaveLength(1);
    expect(spy.callsTo('feature.disable')).toHaveLength(0);
    expect(enabled).toEqual(
      expect.arrayContaining([
        'ly.img.navigation.bar',
        'ly.img.page.resize',
        'ly.img.text.edit'
      ])
    );
    expect(enabled.filter((id) => id.startsWith('ly.img.video'))).toEqual([]);
    const umbrellas = enabled.filter((feature) =>
      enabled.some((other) => other.startsWith(`${feature}.`))
    );
    expect(umbrellas).toEqual([]);
  });
});
