/**
 * Autocaption Plugin Configuration
 *
 * Provides AI-powered caption generation using ElevenLabs Scribe V2
 * via the fal.ai proxy.
 *
 * @see https://img.ly/docs/cesdk/js/edit-video/add-captions-f67565/
 */

import AutocaptionPlugin from '@imgly/plugin-autocaption-web';
import { ElevenLabsScribeV2 } from '@imgly/plugin-autocaption-web/fal-ai';

/**
 * Proxy that adds your fal.ai key server-side. Set `VITE_AUTOCAPTION_PROXY_URL`
 * for production — the default is IMG.LY's rate-limited demo proxy.
 */
const AUTOCAPTION_PROXY_URL: string =
  import.meta.env.VITE_AUTOCAPTION_PROXY_URL ||
  'https://proxy.img.ly/api/proxy/falai';

/**
 * Create the autocaption plugin with configured provider.
 *
 * @returns The configured AutocaptionPlugin instance
 */
export function createAutocaptionPlugin() {
  return AutocaptionPlugin({
    provider: ElevenLabsScribeV2({
      proxyUrl: AUTOCAPTION_PROXY_URL
    })
  });
}
