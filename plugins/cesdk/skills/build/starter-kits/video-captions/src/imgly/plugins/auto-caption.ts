/**
 * Autocaption Plugin Configuration
 *
 * Provides AI-powered caption generation using ElevenLabs Scribe V2
 * via the fal.ai proxy.
 *
 * @see https://img.ly/docs/cesdk/plugins/autocaption/
 */

import AutocaptionPlugin from '@imgly/plugin-autocaption-web';
import { ElevenLabsScribeV2 } from '@imgly/plugin-autocaption-web/fal-ai';

let AUTOCAPTION_PROXY_URL = import.meta.env.VITE_AUTOCAPTION_PROXY_URL || '';

//START_HIDDEN_BLOCK
if (!AUTOCAPTION_PROXY_URL)
  AUTOCAPTION_PROXY_URL = 'https://proxy.img.ly/api/proxy/falai';
//END_HIDDEN_BLOCK

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
