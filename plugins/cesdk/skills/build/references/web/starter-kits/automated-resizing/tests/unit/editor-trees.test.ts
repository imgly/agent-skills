import type CreativeEditorSDK from '@cesdk/cesdk-js';
import type { CreativeEngine, EditorPluginContext } from '@cesdk/cesdk-js';
import { createApiSpy } from '@imgly/kit-test-harness/vitest';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@cesdk/cesdk-js', () => ({ default: { version: 'test' } }));

import * as advancedActions from '../../src/imgly/config/advanced-editor/actions';
import { setupTranslations as advancedTranslations } from '../../src/imgly/config/advanced-editor/i18n';
import { usAnsiCatalog as advancedCatalog } from '../../src/imgly/config/advanced-editor/keyboard/catalogs/us-ansi';
import { setupKeyboardShortcuts as advancedShortcuts } from '../../src/imgly/config/advanced-editor/keyboard/keyboard';
import { AdvancedEditorConfig } from '../../src/imgly/config/advanced-editor/plugin';
import { setupSettings as advancedSettings } from '../../src/imgly/config/advanced-editor/settings';
import { setupUI as advancedUI } from '../../src/imgly/config/advanced-editor/ui';
import { setupCanvas as advancedCanvas } from '../../src/imgly/config/advanced-editor/ui/canvas';
import { setupComponents as advancedComponents } from '../../src/imgly/config/advanced-editor/ui/components';
import { setupDock as advancedDock } from '../../src/imgly/config/advanced-editor/ui/dock';
import { setupInspectorBar as advancedInspectorBar } from '../../src/imgly/config/advanced-editor/ui/inspectorBar';
import { setupPanels as advancedPanels } from '../../src/imgly/config/advanced-editor/ui/panel';
import { setupVideoTimeline as advancedVideoTimeline } from '../../src/imgly/config/advanced-editor/ui/videoTimeline';
import * as designActions from '../../src/imgly/config/design-editor/actions';
import { setupTranslations as designTranslations } from '../../src/imgly/config/design-editor/i18n';
import { usAnsiCatalog as designCatalog } from '../../src/imgly/config/design-editor/keyboard/catalogs/us-ansi';
import { setupKeyboardShortcuts as designShortcuts } from '../../src/imgly/config/design-editor/keyboard/keyboard';
import { DesignEditorConfig } from '../../src/imgly/config/design-editor/plugin';
import { setupSettings as designSettings } from '../../src/imgly/config/design-editor/settings';
import { setupUI as designUI } from '../../src/imgly/config/design-editor/ui';
import { setupCanvas as designCanvas } from '../../src/imgly/config/design-editor/ui/canvas';
import { setupComponents as designComponents } from '../../src/imgly/config/design-editor/ui/components';
import { setupDock as designDock } from '../../src/imgly/config/design-editor/ui/dock';
import { setupInspectorBar as designInspectorBar } from '../../src/imgly/config/design-editor/ui/inspectorBar';
import { setupPanels as designPanels } from '../../src/imgly/config/design-editor/ui/panel';
import { setupVideoTimeline as designVideoTimeline } from '../../src/imgly/config/design-editor/ui/videoTimeline';

type OrderTarget = { in: string; at?: string; when?: { editMode?: string } };

const TREES = [
  {
    name: 'the advanced editor',
    Config: AdvancedEditorConfig,
    pluginName: 'cesdk-advanced-editor',
    inspectorSide: 'right',
    hideDockLabels: true,
    catalog: advancedCatalog,
    setupActions: advancedActions.setupActions,
    setupCanvas: advancedCanvas,
    setupComponents: advancedComponents,
    setupDock: advancedDock,
    setupInspectorBar: advancedInspectorBar,
    setupPanels: advancedPanels,
    setupSettings: advancedSettings,
    setupShortcuts: advancedShortcuts,
    setupTranslations: advancedTranslations,
    setupUI: advancedUI,
    setupVideoTimeline: advancedVideoTimeline
  },
  {
    name: 'the design editor',
    Config: DesignEditorConfig,
    pluginName: 'cesdk-design-editor',
    inspectorSide: 'left',
    hideDockLabels: false,
    catalog: designCatalog,
    setupActions: designActions.setupActions,
    setupCanvas: designCanvas,
    setupComponents: designComponents,
    setupDock: designDock,
    setupInspectorBar: designInspectorBar,
    setupPanels: designPanels,
    setupSettings: designSettings,
    setupShortcuts: designShortcuts,
    setupTranslations: designTranslations,
    setupUI: designUI,
    setupVideoTimeline: designVideoTimeline
  }
] as const;

function run<T>(setup: (api: T) => void) {
  const spy = createApiSpy<T>();
  setup(spy.api);
  return spy;
}

function barFor(
  spy: ReturnType<typeof createApiSpy<CreativeEditorSDK>>,
  slot: string,
  editMode?: string
): unknown[] {
  const match = spy
    .callsTo('ui.setComponentOrder')
    .map(({ args }) => args as [OrderTarget, unknown[]])
    .find(
      ([target]) => target.in === slot && target.when?.editMode === editMode
    );
  if (match == null) {
    throw new Error(`No component order for ${slot} (editMode ${editMode})`);
  }
  return match[1];
}

describe.each(TREES)('AR-U5 $name', (tree) => {
  it('docks the asset library on the left and the inspector on its own side', () => {
    const spy = run<CreativeEditorSDK>(tree.setupPanels);
    const positions = new Map(
      spy
        .callsTo('ui.setPanelPosition')
        .map(({ args }) => [args[0] as string, args[1]])
    );
    expect(positions.get('//ly.img.panel/inspector')).toBe(tree.inspectorSide);
    expect(positions.get('//ly.img.panel/assetLibrary')).toBe('left');
  });

  it('positions the panels before it orders any component', () => {
    const paths = run<CreativeEditorSDK>(tree.setupUI).calls.map(
      ({ path }) => path
    );
    expect(paths.indexOf('ui.setPanelPosition')).toBeGreaterThanOrEqual(0);
    expect(paths.indexOf('ui.setPanelPosition')).toBeLessThan(
      paths.indexOf('ui.setComponentOrder')
    );
  });

  it('orders the same five bars', () => {
    const slots = new Set(
      run<CreativeEditorSDK>(tree.setupUI)
        .callsTo('ui.setComponentOrder')
        .map(({ args }) => (args[0] as OrderTarget).in)
    );
    expect([...slots].sort()).toEqual([
      'ly.img.canvas.bar',
      'ly.img.canvas.menu',
      'ly.img.dock',
      'ly.img.inspector.bar',
      'ly.img.navigation.bar'
    ]);
  });

  it('keeps the add-page button in a bottom canvas bar', () => {
    const spy = run<CreativeEditorSDK>(tree.setupCanvas);
    const [target, entries] = spy
      .callsTo('ui.setComponentOrder')
      .map(({ args }) => args as [OrderTarget, unknown[]])
      .find(([slot]) => slot.in === 'ly.img.canvas.bar') as [
      OrderTarget,
      unknown[]
    ];
    expect(target.at).toBe('bottom');
    expect(entries).toContain('ly.img.page.add.canvasBar');
  });

  it('offers the text and overlay controls in the canvas menus', () => {
    const spy = run<CreativeEditorSDK>(tree.setupCanvas);
    expect(barFor(spy, 'ly.img.canvas.menu', 'Transform')).toContain(
      'ly.img.delete.canvasMenu'
    );
    expect(barFor(spy, 'ly.img.canvas.menu', 'Text')).toContain(
      'ly.img.text.bold.canvasMenu'
    );
  });

  it('offers crop, fill and the inspector toggle in the Transform bar', () => {
    const spy = run<CreativeEditorSDK>(tree.setupInspectorBar);
    const entries = barFor(spy, 'ly.img.inspector.bar', 'Transform');
    expect(entries).toContain('ly.img.crop.inspectorBar');
    expect(entries).toContain('ly.img.fill.inspectorBar');
    expect(entries).toContain('ly.img.inspectorToggle.inspectorBar');
  });

  it('replaces the inspector bar with the crop controls while cropping', () => {
    const spy = run<CreativeEditorSDK>(tree.setupInspectorBar);
    expect(barFor(spy, 'ly.img.inspector.bar', 'Crop')).toEqual([
      'ly.img.cropControls.inspectorBar'
    ]);
  });

  it('sets its own dock label style', () => {
    const spy = run<CreativeEditorSDK>(tree.setupDock);
    const settings = new Map(
      spy
        .callsTo('engine.editor.setSetting')
        .map(({ args }) => [args[0] as string, args[1]])
    );
    expect(settings.get('dock/hideLabels')).toBe(tree.hideDockLabels);
    expect(barFor(spy, 'ly.img.dock').length).toBeGreaterThan(0);
  });

  it('writes the crop and page settings', () => {
    const settings = new Map(
      run<CreativeEngine>(tree.setupSettings)
        .callsTo('editor.setSetting')
        .map(({ args }) => [args[0] as string, args[1]])
    );
    expect(settings.get('doubleClickToCropEnabled')).toBe(true);
    expect(settings.get('page/title/show')).toBe(true);
  });

  it('registers no custom component, translation or timeline control', () => {
    expect(run<CreativeEditorSDK>(tree.setupComponents).calls).toEqual([]);
    expect(run<CreativeEditorSDK>(tree.setupTranslations).calls).toEqual([]);
    expect(run<CreativeEditorSDK>(tree.setupVideoTimeline).calls).toEqual([]);
  });

  it('installs its own US ANSI shortcut catalog unchanged', () => {
    const spy = run<CreativeEditorSDK>(tree.setupShortcuts);
    expect(spy.callsTo('shortcuts.set')).toHaveLength(1);
    expect(spy.lastArgsOf('shortcuts.set')?.[0]).toBe(tree.catalog);
  });

  it('is named for its tree and resets the editor before configuring it', async () => {
    const cesdk = createApiSpy<CreativeEditorSDK>();
    const engine = createApiSpy<CreativeEngine>();
    const plugin = new tree.Config();

    expect(plugin.name).toBe(tree.pluginName);
    expect(plugin.version).toBe('test');

    await plugin.initialize({
      cesdk: cesdk.api,
      engine: engine.api
    } as EditorPluginContext);

    expect(cesdk.calls.slice(0, 2).map(({ path }) => path)).toEqual([
      'resetEditor',
      'setEditorCompatibilityVersion'
    ]);
    expect(cesdk.callsTo('setEditorCompatibilityVersion')).toHaveLength(1);
    expect(cesdk.lastArgsOf('setEditorCompatibilityVersion')).toEqual(['test']);
    expect(cesdk.callsTo('feature.enable')).toHaveLength(1);
    expect(cesdk.callsTo('shortcuts.set')).toHaveLength(1);
    expect(engine.callsTo('editor.setSetting').length).toBeGreaterThan(0);
  });

  it('does nothing without an editor', async () => {
    const engine = createApiSpy<CreativeEngine>();
    await new tree.Config().initialize({
      engine: engine.api
    } as EditorPluginContext);
    expect(engine.calls).toEqual([]);
  });
});

describe.each(TREES)('AR-U6 the action handlers of $name', (tree) => {
  function handlers() {
    const spy = createApiSpy<CreativeEditorSDK>();
    tree.setupActions(spy.api);
    const byName = new Map(
      spy
        .callsTo('actions.register')
        .map(({ args }) => [
          args[0] as string,
          args[1] as (...params: never[]) => unknown
        ])
    );
    return { spy, byName };
  }

  it('saves the scene as plain text', async () => {
    const { spy, byName } = handlers();
    await byName.get('saveScene')?.();
    expect(spy.callsTo('engine.scene.saveToString')).toHaveLength(1);
    expect(spy.lastArgsOf('utils.downloadFile')?.[1]).toBe(
      'text/plain;charset=UTF-8'
    );
  });

  it('passes the caller export options straight through', async () => {
    const { spy, byName } = handlers();
    await (byName.get('exportDesign') as (o: unknown) => Promise<void>)({
      mimeType: 'image/png'
    });
    expect(spy.lastArgsOf('utils.export')?.[0]).toEqual({
      mimeType: 'image/png'
    });
  });

  it('imports a scene from a picked file and fits the first page', async () => {
    const { spy, byName } = handlers();
    const revoke = vi
      .spyOn(URL, 'revokeObjectURL')
      .mockImplementation(() => undefined);
    await byName.get('importScene')?.();
    expect(spy.lastArgsOf('utils.loadFile')?.[0]).toEqual({
      accept: '.imgly,.scene,.zip',
      returnType: 'objectURL'
    });
    expect(spy.callsTo('engine.scene.load')).toHaveLength(1);
    expect(revoke).toHaveBeenCalledTimes(1);
    revoke.mockRestore();
  });

  it('exports the scene as text by default and as a zip archive on request', async () => {
    const { spy, byName } = handlers();
    const exportScene = byName.get('exportScene') as (o: {
      format?: string;
    }) => Promise<void>;

    await exportScene({});
    expect(spy.lastArgsOf('utils.downloadFile')?.[1]).toBe(
      'text/plain;charset=UTF-8'
    );

    await exportScene({ format: 'archive' });
    expect(spy.lastArgsOf('utils.downloadFile')?.[1]).toBe('application/zip');
  });

  it('uploads through the editor local upload', () => {
    const { spy, byName } = handlers();
    (
      byName.get('uploadFile') as (
        file: unknown,
        onProgress: unknown,
        context: unknown
      ) => unknown
    )('file', 'onProgress', 'context');
    expect(spy.lastArgsOf('utils.localUpload')).toEqual(['file', 'context']);
  });
});
