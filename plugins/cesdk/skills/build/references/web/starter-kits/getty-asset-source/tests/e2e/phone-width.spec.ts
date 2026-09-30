import {
  expectUsableAtPhoneWidth,
  PHONE_VIEWPORT,
  test
} from '@imgly/kit-test-harness';
import { mockProxy } from './getty-proxy';

test.use({ viewport: PHONE_VIEWPORT });

test('the kit is usable at phone width', async ({ kit }) => {
  await mockProxy(kit.page);
  await expectUsableAtPhoneWidth(kit.page);
});
