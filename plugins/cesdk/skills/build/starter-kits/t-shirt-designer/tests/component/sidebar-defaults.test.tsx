// @vitest-environment jsdom
import { render, screen } from '@imgly/kit-test-harness/component';
import { describe, expect, it, vi } from 'vitest';

// A catalogue entry may omit its price and its size list; the sidebar has to
// render a priced, empty cart rather than fail.
vi.mock('../../src/app/product-catalog', () => ({
  PRODUCT_SAMPLES: [
    {
      id: 'tshirt',
      label: 'Bare Shirt',
      areas: [{ id: 'front', label: 'Front', preview: '/front.png' }],
      colors: [{ id: 'white', label: 'White', colorHex: '#ffffff' }]
    }
  ]
}));

import { Sidebar } from '../../src/app/Sidebar/Sidebar';

describe('TSD-C2 Sidebar without a price or a size list', () => {
  it('prices the cart at zero and offers no sizes', () => {
    render(
      <Sidebar
        areaId="front"
        color={{ id: 'white', label: 'White', colorHex: '#ffffff' } as never}
        onAreaChange={vi.fn()}
        onColorChange={vi.fn()}
        onExportRequest={vi.fn()}
        onAddToCart={vi.fn()}
      />
    );

    expect(screen.getByText(/From 0,00/)).toBeTruthy();
    expect(screen.queryAllByRole('spinbutton')).toHaveLength(0);
  });
});
