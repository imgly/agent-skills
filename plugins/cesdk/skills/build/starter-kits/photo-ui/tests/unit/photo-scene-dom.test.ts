// @vitest-environment jsdom
import type CreativeEngine from '@cesdk/engine';
import { afterEach, describe, expect, it } from 'vitest';

import { setImageSource } from '../../src/imgly/photo-scene';

const PAGE = 5;
const FILL = 6;

/** jsdom never fetches an `img`, so the measured size is driven from the setter. */
function stubImage(width: number, height: number): () => void {
  const original = Object.getOwnPropertyDescriptor(
    HTMLImageElement.prototype,
    'src'
  );
  Object.defineProperty(HTMLImageElement.prototype, 'src', {
    configurable: true,
    set(this: HTMLImageElement) {
      Object.defineProperty(this, 'naturalWidth', { value: width });
      Object.defineProperty(this, 'naturalHeight', { value: height });
      queueMicrotask(() => this.onload?.(new Event('load')));
    }
  });
  return () =>
    Object.defineProperty(HTMLImageElement.prototype, 'src', original!);
}

function createEngine() {
  const calls: { method: string; args: unknown[] }[] = [];
  const record =
    (method: string, result?: unknown) =>
    (...args: unknown[]) => {
      calls.push({ method, args });
      return result;
    };
  const engine = {
    editor: {
      setGlobalScope: record('setGlobalScope'),
      setSetting: record('setSetting')
    },
    block: {
      getFill: record('getFill', FILL),
      setWidth: record('setWidth'),
      setHeight: record('setHeight'),
      setString: record('setString'),
      resetCrop: record('resetCrop')
    }
  };
  return { api: engine as unknown as CreativeEngine, calls };
}

let restore = () => {};
afterEach(() => restore());

describe('PH-U11 setImageSource without a known size', () => {
  it('measures the photo in the browser and sizes the page to it', async () => {
    restore = stubImage(1200, 900);
    const engine = createEngine();

    await setImageSource(engine.api, PAGE, 'photo.jpg');

    const args = (method: string) =>
      engine.calls.filter((call) => call.method === method).map((c) => c.args);
    expect(args('setWidth')).toEqual([[PAGE, 1200]]);
    expect(args('setHeight')).toEqual([[PAGE, 900]]);
    expect(args('setString')).toEqual([
      [FILL, 'fill/image/imageFileURI', 'photo.jpg']
    ]);
    expect(args('setGlobalScope')).toEqual([
      ['design/arrange', 'Allow'],
      ['design/arrange', 'Deny']
    ]);
    expect(args('setSetting')).toEqual([['doubleClickToCropEnabled', false]]);
  });

  it('uses the size it is given instead of measuring', async () => {
    restore = stubImage(1200, 900);
    const engine = createEngine();

    await setImageSource(engine.api, PAGE, 'photo.jpg', {
      width: 640,
      height: 480
    });

    expect(
      engine.calls
        .filter((call) => call.method === 'setWidth')
        .map((c) => c.args)
    ).toEqual([[PAGE, 640]]);
  });
});
