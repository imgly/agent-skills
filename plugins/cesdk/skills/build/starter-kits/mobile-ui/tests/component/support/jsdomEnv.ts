/**
 * The browser APIs this kit's components use that jsdom does not implement.
 * Importing this module installs them once for the test file.
 */
const observers = new Set<() => void>();

class ResizeObserverStub {
  constructor(private readonly callback: () => void) {}

  observe() {
    observers.add(this.callback);
  }

  unobserve() {
    observers.delete(this.callback);
  }

  disconnect() {
    observers.delete(this.callback);
  }
}

/** Run every live ResizeObserver callback, the way a layout change would. */
export const triggerResize = () => observers.forEach((callback) => callback());

class ImageStub {
  width = 320;

  height = 240;

  naturalWidth = 320;

  naturalHeight = 240;

  onload: (() => void) | null = null;

  onerror: ((error: unknown) => void) | null = null;

  set src(value: string) {
    queueMicrotask(() => {
      if (value === 'broken') {
        this.onerror?.(new Error('load failed'));
      } else {
        this.onload?.();
      }
    });
  }
}

globalThis.ResizeObserver ??= ResizeObserverStub as never;
globalThis.Image = ImageStub as never;

if (window.visualViewport == null) {
  Object.defineProperty(window, 'visualViewport', {
    configurable: true,
    value: Object.assign(new EventTarget(), { height: 600, width: 400 })
  });
}

window.URL.createObjectURL ??= (() => 'blob:upload') as never;
window.URL.revokeObjectURL ??= (() => undefined) as never;
