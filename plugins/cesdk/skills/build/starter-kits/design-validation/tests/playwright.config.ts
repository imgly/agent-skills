import { defineKitPlaywrightConfig } from '@imgly/kit-test-harness';
import { resolve } from 'node:path';

export default defineKitPlaywrightConfig({
  kitDir: resolve(__dirname, '..'),
  // The shipped scene stores an absolute cdn.img.ly URI for the TrashHand font.
  cdnAllowlist: [
    /cdn\.img\.ly\/assets\/v3\/ly\.img\.typeface\/fonts\/imgly_font_trash_hand\.ttf/
  ]
});
