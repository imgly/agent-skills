// @vitest-environment jsdom
import {
  fireEvent,
  render,
  screen,
  userEvent
} from '@imgly/kit-test-harness/component';
import { describe, expect, it, vi } from 'vitest';

import { AreaSelector } from '../../src/app/AreaSelector/AreaSelector';
import { Sidebar } from '../../src/app/Sidebar/Sidebar';
import { PRODUCT_SAMPLES } from '../../src/app/product-catalog';

const product = PRODUCT_SAMPLES[0];
const white = product.colors.find((color) => color.isDefault)!;

function renderSidebar(onAddToCart = vi.fn()) {
  render(
    <Sidebar
      areaId="front"
      color={white}
      onAreaChange={vi.fn()}
      onColorChange={vi.fn()}
      onExportRequest={vi.fn()}
      onAddToCart={onAddToCart}
    />
  );
  return onAddToCart;
}

const cartButton = () =>
  screen.getByRole('button', { name: /Add to Cart/ }) as HTMLButtonElement;
const quantityInputs = () => screen.getAllByRole('spinbutton');

describe('TSD-U5 cart maths', () => {
  it('starts with one M and one L and prices them', () => {
    renderSidebar();

    expect(
      quantityInputs().map((input) => (input as HTMLInputElement).value)
    ).toEqual(['0', '0', '1', '1', '0']);
    expect(cartButton().textContent).toBe('39,98 € • Add to Cart');
    expect(cartButton().disabled).toBe(false);
  });

  it('multiplies the unit price by the total quantity', async () => {
    const user = userEvent.setup();
    renderSidebar();

    await user.clear(quantityInputs()[4]);
    await user.type(quantityInputs()[4], '3');

    expect(cartButton().textContent).toBe('99,95 € • Add to Cart');
  });

  it('disables the cart at a total quantity of zero', async () => {
    const user = userEvent.setup();
    renderSidebar();

    for (const input of [quantityInputs()[2], quantityInputs()[3]]) {
      await user.clear(input);
    }

    expect(cartButton().textContent).toBe('0,00 € • Add to Cart');
    expect(cartButton().disabled).toBe(true);
  });

  it('reports the selection to its caller', async () => {
    const user = userEvent.setup();
    const onAddToCart = renderSidebar();

    await user.click(cartButton());

    expect(onAddToCart).toHaveBeenCalledTimes(1);
    const [payload] = onAddToCart.mock.calls[0];
    expect(payload.totalQuantity).toBe(2);
    expect(payload.totalPrice).toBeCloseTo(39.98, 5);
    expect(Object.fromEntries(payload.quantities)).toEqual({
      XS: 0,
      S: 0,
      M: 1,
      L: 1,
      XL: 0
    });
  });

  it('maps empty and negative input to zero', async () => {
    const user = userEvent.setup();
    renderSidebar();

    await user.clear(quantityInputs()[0]);
    await user.type(quantityInputs()[0], '-4');

    expect((quantityInputs()[0] as HTMLInputElement).value).toBe('4');
    expect(cartButton().textContent).toBe('119,94 € • Add to Cart');
  });
});

describe('TSD-U6 area preview URI', () => {
  it('substitutes the colour into the selected area image', () => {
    render(
      <AreaSelector
        areas={product.areas}
        selectedAreaId="back"
        colorId="blue"
        onSelect={vi.fn()}
      />
    );

    const preview = screen.getByRole('img', { name: 'blue t-shirt back' });
    expect(preview.getAttribute('src')).toContain('blue_back.png');
    expect(preview.getAttribute('src')).not.toContain('{{');
  });

  it('renders the disabled decorations and a preview with no src for them', () => {
    render(
      <AreaSelector
        areas={product.areas}
        selectedAreaId="left"
        colorId="white"
        onSelect={vi.fn()}
      />
    );

    expect(
      (screen.getByRole('button', { name: 'Left' }) as HTMLButtonElement)
        .disabled
    ).toBe(true);
    expect(
      (screen.getByRole('button', { name: 'Right' }) as HTMLButtonElement)
        .disabled
    ).toBe(true);
    // Test plan issue 4: an area with no mockup has no image to show.
    expect(
      screen
        .getByRole('img', { name: 'white t-shirt left' })
        .hasAttribute('src')
    ).toBe(false);
  });
});

describe('TSD-U12 the controls the sidebar reports from', () => {
  it('reports a click on an enabled area', async () => {
    const onSelect = vi.fn();
    render(
      <AreaSelector
        areas={product.areas}
        selectedAreaId="front"
        colorId="white"
        onSelect={onSelect}
      />
    );

    await userEvent.click(screen.getByRole('button', { name: 'Back' }));
    expect(onSelect).toHaveBeenCalledWith('back');
  });

  it('reports the colour a shopper picks', async () => {
    const onColorChange = vi.fn();
    render(
      <Sidebar
        areaId="front"
        color={white}
        onAreaChange={vi.fn()}
        onColorChange={onColorChange}
        onExportRequest={vi.fn()}
        onAddToCart={vi.fn()}
      />
    );

    await userEvent.click(screen.getByTitle('Blue'));

    expect(onColorChange).toHaveBeenCalledWith(
      product.colors.find((color) => color.id === 'blue')
    );
  });

  it('clamps a negative quantity to zero instead of discounting the cart', () => {
    renderSidebar();

    fireEvent.change(quantityInputs()[4], { target: { value: '-5' } });

    expect(cartButton().textContent).toBe('39,98 € • Add to Cart');
  });
});
