import {
  expectUsableAtPhoneWidth,
  PHONE_VIEWPORT,
  test
} from '@imgly/kit-test-harness';
import { mockPexelsApi } from './pexels-api';

test.use({ viewport: PHONE_VIEWPORT });

test('the kit is usable at phone width', async ({ kit }) => {
  await mockPexelsApi(kit.page);
  await expectUsableAtPhoneWidth(kit.page);
});
