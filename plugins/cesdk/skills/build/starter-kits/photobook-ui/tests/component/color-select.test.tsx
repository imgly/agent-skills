// @vitest-environment jsdom
import { render, screen, userEvent } from '@imgly/kit-test-harness/component';
import type { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({ hex: '#abcd' }));

// The bundled picker only ever emits three- and six-digit hex, so the kit's own
// guard against a value it cannot parse needs a stand-in picker.
vi.mock('../../src/app/ui/ColorPicker/ColorPicker', () => ({
  default: ({ onChange }: { onChange: (value: string) => void }) => (
    <button type="button" onClick={() => onChange(mocks.hex)}>
      Report a colour
    </button>
  )
}));

// The bar measures the toolbar through the whole provider stack, which this
// case has no use for.
vi.mock('../../src/app/ui/AdjustmentsBar/AdjustmentsBar', () => ({
  default: ({ children }: { children: ReactNode }) => <div>{children}</div>
}));

vi.mock(
  '@cesdk/engine',
  async () => (await import('./support/engine-mock')).cesdkEngineModule
);

const { default: ColorSelect } =
  await import('../../src/app/ui/ColorSelect/ColorSelect');

async function reportColour(hex: string) {
  mocks.hex = hex;
  const onClick = vi.fn();
  render(<ColorSelect colorPalette={[]} onClick={onClick} />);
  await userEvent.click(
    screen.getByRole('button', { name: 'Report a colour' })
  );
  return onClick;
}

describe('PB-C76 the colour the picker reports', () => {
  it('reaches the caller when the kit can parse it', async () => {
    expect(await reportColour('#ff0000')).toHaveBeenCalledWith({
      r: 1,
      g: 0,
      b: 0,
      a: 1
    });
  });

  it('is dropped when the kit cannot parse it', async () => {
    expect(await reportColour('#abcd')).not.toHaveBeenCalled();
  });
});
