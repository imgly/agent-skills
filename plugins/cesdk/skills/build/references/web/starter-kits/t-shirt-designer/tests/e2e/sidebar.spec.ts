import { expect, test, type Kit } from '@imgly/kit-test-harness';
import {
  Designer,
  addTextToCurrentPage,
  blockPlacement,
  currentAreaId,
  pageInfo,
  sceneMetadata,
  visibleBackdrop
} from './designer';

const COLORS = [
  ['Black', 'rgb(0, 0, 0)'],
  ['Gray', 'rgb(146, 146, 146)'],
  ['White', 'rgb(255, 255, 255)'],
  ['Red', 'rgb(224, 45, 39)'],
  ['Orange', 'rgb(248, 141, 40)'],
  ['Yellow', 'rgb(247, 236, 30)'],
  ['Green', 'rgb(67, 211, 31)'],
  ['Cyan', 'rgb(31, 211, 202)'],
  ['Blue', 'rgb(31, 64, 211)'],
  ['Purple', 'rgb(229, 36, 239)']
];

test.describe('Start-up and the sidebar', () => {
  test('TSD-01 the editor opens on the white front', async ({ kit }) => {
    const designer = new Designer(kit.page);

    await expect(designer.area('Front')).toBeVisible();
    expect(await currentAreaId(kit)).toBe('front');
    const backdrop = await visibleBackdrop(kit);
    expect(backdrop!.name).toBe('Backdrop-front');
    expect(backdrop!.uri).toContain('white_front.png');
    expect(backdrop!.uri).not.toContain('{{');

    const pages = await pageInfo(kit);
    expect(pages.names).toEqual(['front', 'back']);
    expect(pages.width).toBeCloseTo(20, 5);
    expect(pages.designUnit).toBe('Inch');

    await expect(
      designer.sidebar.getByRole('heading', { name: 'Mens T-Shirt' })
    ).toBeVisible();
    await expect(
      designer.sidebar.getByRole('heading', { name: 'From 19,99 €' })
    ).toBeVisible();
    await expect(
      designer.sidebar.getByText('Apparel Essentials', { exact: true })
    ).toBeVisible();
    await expect(
      designer.sidebar.getByText('+ Additional Fees', { exact: true })
    ).toBeVisible();
  });

  test('TSD-02 four decorations, two of them disabled', async ({ kit }) => {
    const designer = new Designer(kit.page);

    for (const label of ['Front', 'Back']) {
      await expect(designer.area(label)).toBeEnabled();
    }
    for (const label of ['Left', 'Right']) {
      await expect(designer.area(label)).toBeDisabled();
    }
    await expect(designer.preview()).toHaveAttribute(
      'src',
      /white_front\.png$/
    );
    await expect(designer.sidebar.getByText('Width 249mm')).toBeVisible();
    await expect(designer.sidebar.getByText('Height 265mm')).toBeVisible();
    await expect(designer.sidebar.getByText('Digital Printing')).toBeVisible();
  });

  test('TSD-03 switching to Back', async ({ kit }) => {
    const designer = new Designer(kit.page);

    await designer.area('Back').click();

    await expect.poll(() => currentAreaId(kit)).toBe('back');
    expect((await visibleBackdrop(kit))!.name).toBe('Backdrop-back');
    await expect(designer.preview()).toHaveAttribute('src', /white_back\.png$/);
  });

  test('TSD-04 a disabled decoration cannot be selected', async ({ kit }) => {
    const designer = new Designer(kit.page);

    await designer.area('Left').click({ force: true });

    expect(await currentAreaId(kit)).toBe('front');
    expect((await visibleBackdrop(kit))!.name).toBe('Backdrop-front');
  });

  test('TSD-05 the colour swatches swap the mockup', async ({ kit }) => {
    const designer = new Designer(kit.page);

    for (const [label, background] of COLORS) {
      await expect(designer.swatch(label)).toHaveCSS(
        'background-color',
        background
      );
    }

    await designer.swatch('Blue').click();

    await expect
      .poll(async () => (await visibleBackdrop(kit))!.uri)
      .toContain('blue_front.png');
    await expect(designer.preview()).toHaveAttribute('src', /blue_front\.png$/);
    expect(await sceneMetadata<{ id: string }>(kit, 'color')).toMatchObject({
      id: 'blue'
    });
  });

  test('TSD-06 a colour change keeps the current area', async ({ kit }) => {
    const designer = new Designer(kit.page);

    await designer.area('Back').click();
    await expect.poll(() => currentAreaId(kit)).toBe('back');

    await designer.swatch('Red').click();

    await expect
      .poll(async () => (await visibleBackdrop(kit))!.uri)
      .toContain('red_back.png');
    expect(await currentAreaId(kit)).toBe('back');
    expect((await visibleBackdrop(kit))!.name).toBe('Backdrop-back');
  });
});

test.describe('Highlights', () => {
  /** The labels of the area buttons and swatches drawn as active. */
  async function highlighted(designer: Designer, kit: Kit) {
    await kit.page.mouse.move(0, 0);
    const areas = ['Front', 'Back', 'Left', 'Right'].map((label) =>
      designer.area(label)
    );
    const active: string[] = [];
    for (const area of areas) {
      const background = await area.evaluate(
        (button) => getComputedStyle(button).backgroundColor
      );
      if (background === 'rgb(22, 22, 23)') {
        active.push((await area.textContent()) ?? '');
      }
    }
    const swatches = await designer.sidebar
      .getByRole('heading', { name: 'Color' })
      .locator('xpath=following-sibling::div[1]')
      .locator('button')
      .evaluateAll((all) =>
        all
          .filter(
            (button) =>
              getComputedStyle(button.parentElement!).borderTopColor ===
              'rgb(0, 0, 0)'
          )
          .map((button) => button.getAttribute('title'))
      );
    return { areas: active, swatches };
  }

  test('TSD-14 only the area and colour shown are highlighted', async ({
    kit
  }) => {
    const designer = new Designer(kit.page);

    await expect
      .poll(() => highlighted(designer, kit))
      .toEqual({ areas: ['Front'], swatches: ['White'] });

    await designer.area('Back').click();
    await expect
      .poll(() => highlighted(designer, kit))
      .toEqual({ areas: ['Back'], swatches: ['White'] });

    for (const label of ['Purple', 'Black']) {
      await designer.swatch(label).click();
      await expect
        .poll(() => highlighted(designer, kit))
        .toEqual({ areas: ['Back'], swatches: [label] });
    }

    await designer.area('Front').click();
    await expect
      .poll(() => highlighted(designer, kit))
      .toEqual({ areas: ['Front'], swatches: ['Black'] });
  });
});

test.describe('Design content', () => {
  test('TSD-07 design content stays on its own area', async ({ kit }) => {
    const designer = new Designer(kit.page);

    const front = await addTextToCurrentPage(kit);
    await designer.area('Back').click();
    await expect.poll(() => currentAreaId(kit)).toBe('back');
    const back = await addTextToCurrentPage(kit);
    await designer.area('Front').click();
    await expect.poll(() => currentAreaId(kit)).toBe('front');

    expect((await blockPlacement(kit, front)).parent).toBe('front');
    expect((await blockPlacement(kit, back)).parent).toBe('back');
  });

  test('TSD-08 design content survives a colour change', async ({ kit }) => {
    const designer = new Designer(kit.page);

    const text = await addTextToCurrentPage(kit);
    const before = await blockPlacement(kit, text);

    await designer.swatch('Black').click();
    await expect
      .poll(async () => (await visibleBackdrop(kit))!.uri)
      .toContain('black_front.png');

    expect(await blockPlacement(kit, text)).toEqual(before);
  });
});
