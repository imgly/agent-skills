import {
  expectUsableAtPhoneWidth,
  PHONE_VIEWPORT,
  test
} from '@imgly/kit-test-harness';
import { mockUnsplashProxy } from './unsplash-proxy';

test.use({ viewport: PHONE_VIEWPORT });

test('the kit is usable at phone width', async ({ kit }) => {
  await mockUnsplashProxy(kit.page);
  await expectUsableAtPhoneWidth(kit.page);
});
