import { createApiSpy } from '@imgly/kit-test-harness/vitest';
import type CreativeEditorSDK from '@cesdk/cesdk-js';
import { describe, expect, it, vi } from 'vitest';

import { setupComponents } from '../../src/imgly/config/ui/components';

const PRODUCT = {
  areas: [
    { id: 'front', label: 'Front' },
    { id: 'back', label: 'Back' },
    { id: 'sleeve', label: 'Sleeve', disabled: true }
  ]
};

interface BuilderCall {
  id: string;
  options: Record<string, any>;
}

interface EngineOptions {
  scene?: number | null;
  product?: unknown;
  currentPage?: number | null;
}

function render({
  scene = 1,
  product = PRODUCT,
  currentPage = 10
}: EngineOptions = {}) {
  const spy = createApiSpy<CreativeEditorSDK>();
  setupComponents(spy.api);
  const registration = spy
    .callsTo('ui.registerComponent')
    .find(({ args }) => args[0] === 'product-area-select');
  expect(registration).toBeDefined();

  const calls: BuilderCall[] = [];
  const record = (id: string, options: any) => {
    calls.push({ id, options: options ?? {} });
    options?.children?.();
  };
  const engine = {
    scene: {
      get: () => scene,
      getCurrentPage: () => currentPage
    },
    block: {
      hasMetadata: () => product != null,
      getMetadata: () => JSON.stringify(product),
      getName: () => 'back'
    }
  };
  (
    registration!.args[1] as (context: {
      builder: unknown;
      engine: unknown;
    }) => void
  )({
    builder: { ButtonGroup: record, Button: record },
    engine
  });
  return { calls, spy };
}

describe('PE-U12 the area selector', () => {
  it('offers one button per enabled area and marks the current one', () => {
    const { calls } = render();

    expect(calls.map((call) => call.id)).toEqual([
      'product-areas',
      'front',
      'back'
    ]);
    expect(calls[1].options.label).toBe('Front');
    expect(calls[1].options.isActive).toBe(false);
    expect(calls[2].options.isActive).toBe(true);
  });

  it('falls back to the first area when no page is current', () => {
    const { calls } = render({ currentPage: null });

    expect(calls[1].options.isActive).toBe(true);
    expect(calls[2].options.isActive).toBe(false);
  });

  it('renders nothing without a scene, without product metadata, or for one area', () => {
    expect(render({ scene: null }).calls).toEqual([]);
    expect(render({ product: null }).calls).toEqual([]);
    expect(
      render({ product: { areas: [{ id: 'front', label: 'Front' }] } }).calls
    ).toEqual([]);
  });

  it('switches the area on click', async () => {
    const { calls, spy } = render();

    calls[1].options.onClick();

    expect(spy.lastArgsOf('actions.run')).toEqual([
      'product.switchArea',
      'front'
    ]);
  });

  it('reports a failed area switch instead of leaving an unhandled rejection', async () => {
    const failure = new Error('no such area');
    const consoleError = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    const registered = new Map<string, unknown>();
    const noop = () => undefined;
    const ui = new Proxy({} as Record<string, unknown>, {
      get: (_target, key) =>
        key === 'registerComponent'
          ? (id: string, fn: unknown) => registered.set(id, fn)
          : noop
    });
    const cesdk = new Proxy({} as Record<string, unknown>, {
      get: (_target, key) => {
        if (key === 'ui') return ui;
        if (key === 'actions') return { run: () => Promise.reject(failure) };
        return new Proxy({} as Record<string, unknown>, { get: () => noop });
      }
    });

    setupComponents(cesdk as unknown as CreativeEditorSDK);
    const calls: BuilderCall[] = [];
    const record = (id: string, options: any) => {
      calls.push({ id, options: options ?? {} });
      options?.children?.();
    };
    (
      registered.get('product-area-select') as (context: {
        builder: unknown;
        engine: unknown;
      }) => void
    )({
      builder: { ButtonGroup: record, Button: record },
      engine: {
        scene: { get: () => 1, getCurrentPage: () => 10 },
        block: {
          hasMetadata: () => true,
          getMetadata: () => JSON.stringify(PRODUCT),
          getName: () => 'back'
        }
      }
    });

    calls[1].options.onClick();
    await vi.waitFor(() =>
      expect(consoleError).toHaveBeenCalledWith(
        '[area-select] product.switchArea error:',
        failure
      )
    );
    consoleError.mockRestore();
  });
});
