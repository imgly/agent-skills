// @vitest-environment jsdom
import { render, screen } from '@imgly/kit-test-harness/component';
import { describe, expect, it, vi } from 'vitest';

// No colour is marked as the default, so the screen falls back to the first.
vi.mock('../../src/app/product-catalog', () => ({
  PRODUCT_SAMPLES: [
    {
      id: 'tshirt',
      label: 'Bare Shirt',
      unitPrice: 10,
      sizes: [{ id: 'M', label: 'M' }],
      areas: [{ id: 'front', label: 'Front', preview: '/front.png' }],
      colors: [
        { id: 'white', label: 'White', colorHex: '#ffffff' },
        { id: 'black', label: 'Black', colorHex: '#000000' }
      ]
    }
  ]
}));
vi.mock('../../src/imgly', () => ({ initTShirtDesigner: vi.fn() }));

import App from '../../src/app/App';

describe('TSD-C3 App without a default colour', () => {
  it('starts on the first colour of the catalogue', () => {
    render(
      <App cesdk={null}>
        <div data-testid="editor" />
      </App>
    );

    expect(screen.getByTestId('editor')).toBeTruthy();
    // The wrapper of the selected swatch carries the active class.
    expect(screen.getByTitle('White').parentElement?.className).toMatch(
      /active/
    );
    expect(screen.getByTitle('Black').parentElement?.className).not.toMatch(
      /active/
    );
  });
});
