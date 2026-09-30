import {
  expectUsableAtPhoneWidth,
  PHONE_VIEWPORT,
  test
} from '@imgly/kit-test-harness';

test.use({ viewport: PHONE_VIEWPORT });

test('the kit is usable at phone width', async ({ kit }) => {
  await expectUsableAtPhoneWidth(kit.page, { actions: ['BG Removal'] });
});
