import { createApiSpy } from '@imgly/kit-test-harness/vitest';
import type { CreativeEngine, EditorPluginContext } from '@cesdk/cesdk-js';
import type CreativeEditorSDK from '@cesdk/cesdk-js';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@cesdk/cesdk-js', () => ({ default: { version: 'test' } }));

import { DEMO_ASSETS_BASE_URL } from '../../src/imgly/demo-assets';
import EXCLUSION_AREA_ASSETS from '../../src/imgly/plugins/exclusionArea/exclusion-areas.json';
import { ExclusionAreaAssetSource } from '../../src/imgly/plugins/exclusionArea/exclusionArea';

const SOURCE_ID = 'ly.img.exclusionArea';

let engine: ReturnType<typeof createApiSpy<CreativeEngine>>;
let cesdk: ReturnType<typeof createApiSpy<CreativeEditorSDK>>;

/** Runs the plugin against recording stubs, with `sources` already registered. */
async function initialize(
  sources: string[],
  { withEditor = true }: { withEditor?: boolean } = {}
) {
  engine = createApiSpy<CreativeEngine>({
    answers: { 'asset.findAllSources': () => sources }
  });
  cesdk = createApiSpy<CreativeEditorSDK>();
  await new ExclusionAreaAssetSource().initialize({
    engine: engine.api,
    cesdk: withEditor ? cesdk.api : null
  } as unknown as EditorPluginContext);
}

describe('PRP-U23 the exclusion area plugin', () => {
  beforeEach(async () => {
    await initialize([]);
  });

  it('registers the two shipped zones against the kit asset path', () => {
    const [contentJSON, basePath] =
      engine.lastArgsOf('asset.addLocalAssetSourceFromJSONString') ?? [];

    expect(JSON.parse(contentJSON as string)).toEqual(EXCLUSION_AREA_ASSETS);
    expect(basePath).toBe(`${DEMO_ASSETS_BASE_URL}/assets`);
  });

  it('enables only the exclusion area feature key', () => {
    expect(cesdk.callsTo('feature.enable').map(({ args }) => args)).toEqual([
      [['ly.img.page.printMarks.exclusionArea']]
    ]);
  });

  it('offers the zones as a two-column square library entry', () => {
    expect(cesdk.lastArgsOf('ui.addAssetLibraryEntry')).toEqual([
      {
        id: SOURCE_ID,
        sourceIds: [SOURCE_ID],
        previewLength: 3,
        gridColumns: 2,
        gridItemHeight: 'square',
        cardBackgroundPreferences: [{ path: 'meta.thumbUri', type: 'image' }]
      }
    ]);
  });

  it('puts its dock button above the layers spacer', () => {
    expect(cesdk.lastArgsOf('ui.insertOrderComponent')).toEqual([
      { in: 'ly.img.dock', before: 'ly.img.spacer.layers' },
      {
        id: 'ly.img.assetLibrary.dock',
        key: SOURCE_ID,
        icon: '@imgly/ForbiddenZone',
        label: 'libraries.ly.img.exclusionArea.label',
        entries: [SOURCE_ID]
      }
    ]);
  });

  it('carries the editor version, so a mismatch is visible', () => {
    const plugin = new ExclusionAreaAssetSource();

    expect(plugin.name).toBe('exclusion-area-asset-source');
    expect(plugin.version).toBe('test');
  });
});

describe('PRP-U23 the exclusion area plugin leaves a second run alone', () => {
  it('registers nothing once the source is there', async () => {
    await initialize([SOURCE_ID]);

    expect(engine.callsTo('asset.addLocalAssetSourceFromJSONString')).toEqual(
      []
    );
    expect(cesdk.calls).toEqual([]);
  });
});

describe('PRP-U23 the exclusion area plugin without an editor', () => {
  it('registers the source but adds no feature, library or dock entry', async () => {
    await initialize([], { withEditor: false });

    expect(
      engine.callsTo('asset.addLocalAssetSourceFromJSONString')
    ).toHaveLength(1);
    expect(cesdk.calls).toEqual([]);
  });
});
