/**
 * AI Photo Edit Plugin — In-Place AI Editing for the Current Photo
 *
 * Unlike the generic `AiApps` plugin used in Design/Video mode, a photo
 * editor already has **the** image on the canvas: a single-page Design scene
 * whose page fill is the imported photo. The user doesn't want to generate a
 * new image *next to* it — they want to transform the image in place.
 *
 * This plugin wires the `image2image` gateway providers directly via
 * `initializeProviders` (bypassing `AiApps` and `ImageGeneration`) so we can:
 *
 *   1. Auto-supply the current page image as `image_urls` — no picker.
 *   2. Use `userFlow: 'generation-only'` — skip placeholder block creation.
 *   3. Attach an `output.middleware` that writes the generated URL back to
 *      the page's `fill/image/sourceSet` (replaces the image in place).
 *   4. Disable the history grid — there's no gallery, only the canvas.
 *
 * Registers a single sparkle dock button ("AI Edit") that opens a panel
 * with the i2i provider's schema UI (prompt + optional style picker).
 *
 * @see https://img.ly/docs/cesdk/js/plugins/ai-generation/
 */

import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';
import CreativeEditorSDK from '@cesdk/cesdk-js';
import {
  CommonProperties,
  type Middleware,
  type Provider,
  initializeProviders
} from '@imgly/plugin-ai-generation-web';

import type { AiProviderMap } from './ai-providers';

const PLUGIN_ID = '@imgly/plugin-ai-photo-edit';
const PANEL_ID = PLUGIN_ID;
const DOCK_COMPONENT_ID = 'ly.img.ai.photoeditor.dock';
const DOCK_BUTTON_ID = 'ly.img.ai.photoeditor.button';

/**
 * Schema property keys that control the output image's shape. Different
 * gateway models use different names — `bfl/flux-2-edit` exposes `format`,
 * others expose `aspect_ratio`, `image_size`, explicit width/height, etc.
 * All of them are stripped from the photo-edit panel because the output
 * must match the input aspect to avoid letterboxing when written back
 * to the page fill.
 */
const OUTPUT_SHAPE_KEYS = new Set([
  'format',
  'aspect_ratio',
  'image_size',
  'size',
  'width',
  'height',
  'num_images',
  'num_outputs'
]);

/**
 * AI Photo Edit configuration plugin.
 *
 * Wires only `image2image` providers into a dedicated dock button + panel.
 * Text/video/audio providers in the map are ignored — a photo editor only
 * transforms the existing photo, it doesn't generate new content.
 */
export class AiPhotoEditConfig implements EditorPlugin {
  name = 'cesdk-ai-photo-edit';

  version = CreativeEditorSDK.version;

  private providers: AiProviderMap;

  constructor(providers: AiProviderMap) {
    this.providers = providers;
  }

  async initialize({ cesdk }: EditorPluginContext) {
    if (!cesdk) return;

    const factories = this.providers.image2image ?? [];
    if (factories.length === 0) return;

    // `initializeProviders` renders a provider Select above the prompt
    // when more than one provider is initialized — but only when this
    // feature is enabled. `ImageGeneration` enables it as a side effect;
    // since we bypass that plugin, we need to enable it ourselves, or
    // users who select multiple models only ever see one of them.
    cesdk.feature.enable(
      'ly.img.plugin-ai-image-generation-web.providerSelect',
      true
    );

    // ------------------------------------------------------------------
    // Await the provider factories, then mutate each provider in place
    // to convert the normal "generate onto canvas" flow into an in-place
    // "edit the current photo" flow.
    // ------------------------------------------------------------------
    const providers = await Promise.all(
      factories.map(async (factory: any) => {
        const provider: Provider<'image', any, any> = await factory({ cesdk });
        customizeProviderForPhotoEdit(provider, cesdk);
        return provider;
      })
    );

    const result = await initializeProviders('image', providers, { cesdk }, {});

    // ------------------------------------------------------------------
    // Translations
    //
    // The CE.SDK builder treats every string passed as `label`,
    // `inputLabel`, or `placeholder` as an **i18n key**. So even the
    // literal copy we supply below needs to be registered — otherwise
    // each keystroke in the prompt re-renders the components and spams
    // `Missing translation key …` into the console.
    //
    // `renderStyleTransferProperty` has a similar quirk: it resolves
    // each style's `labelKey` into the English string (e.g. 'None')
    // and stores THAT literal as the rendered label, so we also
    // register self-referential entries for the style names.
    // ------------------------------------------------------------------
    cesdk.i18n.setTranslations({
      en: {
        [`panel.${PANEL_ID}`]: 'AI Edit',
        [`${PLUGIN_ID}.dock`]: 'AI Edit',

        // Prompt input (passed to CommonProperties.StyleTransfer below).
        [`${PLUGIN_ID}.prompt.label`]: 'Prompt',
        [`${PLUGIN_ID}.prompt.placeholder`]:
          'Describe how to transform the photo…',

        // Self-referential entries for style labels that the library
        // pre-resolves and then re-looks-up as keys.
        None: 'None',
        Anime: 'Anime',
        Cyberpunk: 'Cyberpunk',
        'Kodak 400': 'Kodak 400',
        Watercolor: 'Watercolor',
        'Dark Fantasy': 'Dark Fantasy',
        Vaporwave: 'Vaporwave',
        'Vector Flat': 'Vector Flat',
        '3D Animation': '3D Animation',
        'Ukiyo‑e': 'Ukiyo‑e',
        Surreal: 'Surreal',
        Steampunk: 'Steampunk',
        'Night Bokeh': 'Night Bokeh',
        'Pop Art': 'Pop Art'
      }
    });

    // ------------------------------------------------------------------
    // Panel hosting the schema-driven input UI
    // ------------------------------------------------------------------
    if (result.panel.builderRenderFunction != null) {
      cesdk.ui.registerPanel(PANEL_ID, result.panel.builderRenderFunction);
    }

    // ------------------------------------------------------------------
    // Dock button — single sparkle entry that toggles the panel.
    //
    // The `@imgly/Sparkle` icon is registered by `initializeProviders`
    // above (via `addIconSetOnce('@imgly/plugin-ai-generation', icons)`).
    // ------------------------------------------------------------------
    cesdk.ui.registerComponent(DOCK_COMPONENT_ID, ({ builder }) => {
      const isPanelOpen = cesdk.ui.isPanelOpen(PANEL_ID);

      builder.Button(DOCK_BUTTON_ID, {
        icon: '@imgly/Sparkle',
        label: `${PLUGIN_ID}.dock`,
        isSelected: isPanelOpen,
        onClick: () => {
          if (isPanelOpen) {
            cesdk.ui.closePanel(PANEL_ID);
          } else {
            cesdk.ui.openPanel(PANEL_ID);
          }
        }
      });
    });

    // Insert at the very start of the dock so AI Edit is the top tool,
    // above crop/adjust/filter/effects set up by PhotoEditorConfig.
    cesdk.ui.insertOrderComponent(
      { in: 'ly.img.dock', position: 'start' },
      { id: DOCK_COMPONENT_ID }
    );
  }
}

// ----------------------------------------------------------------------------
// Provider customization
// ----------------------------------------------------------------------------

/**
 * Mutates a gateway `image2image` provider into the shape the photo editor
 * needs. See the file-level comment for the rationale.
 *
 * NOTE: the gateway factory defines `panel.renderCustomProperty` as a
 * **getter** (populated asynchronously when the model schema loads). A plain
 * assignment would silently fail in strict mode, so we redefine the property
 * with `Object.defineProperty`. We don't need the schema-derived defaults —
 * the only renderer the gateway adds is the `image_urls` picker, which we're
 * replacing anyway.
 */
function customizeProviderForPhotoEdit(
  provider: Provider<'image', any, any>,
  cesdk: CreativeEditorSDK
): void {
  const panel = provider.input?.panel;
  if (panel == null || panel.type !== 'schema') return;

  // Insert `style` right after `prompt` so the style picker appears inline,
  // and drop any output-shape controls (format / aspect_ratio / size / …).
  //
  // For a photo editor the output always replaces the source image in
  // place, so letting the user pick a different aspect produces
  // letterboxed or distorted results. Dropping the key from the order
  // means its value never makes it into the request — i2i models default
  // to preserving the input aspect in that case.
  //
  // Do NOT filter `image_urls` out — the schema panel builds the submitted
  // input by iterating the order and collecting each property's getter,
  // so a key that isn't in the order never makes it into the request. Our
  // custom `image_urls` renderer below returns a getter without drawing
  // any UI, which gives us "no picker" without losing the value.
  panel.order = (defaultOrder: string[]) => {
    const filtered = defaultOrder.filter((key) => !OUTPUT_SHAPE_KEYS.has(key));
    const promptIndex = filtered.indexOf('prompt');
    if (promptIndex === -1) return [...filtered, 'style'];
    return [
      ...filtered.slice(0, promptIndex + 1),
      'style',
      ...filtered.slice(promptIndex + 1)
    ];
  };

  // Skip placeholder-block creation; the middleware handles result apply.
  panel.userFlow = 'generation-only';

  // Replace the schema-async getter with our custom renderers.
  Object.defineProperty(panel, 'renderCustomProperty', {
    configurable: true,
    enumerable: true,
    writable: true,
    value: {
      // Gateway i2i schema expects `image_urls: string[]`, but `processInput`
      // accepts a single string and normalizes/uploads it. We return the
      // current page's fill URL and render nothing.
      image_urls: () => () => ({
        id: 'image_urls',
        type: 'string' as const,
        value: getCurrentPageImageUri(cesdk) ?? ''
      }),

      // TextArea for `prompt` + a `style` picker whose value is appended to
      // the prompt before generation. The helper registers both keys.
      //
      // `inputLabel` and `placeholder` are fed straight to the builder as
      // translation keys — passing literals here would miss every lookup
      // and log `Missing translation key …` on each keystroke. Use the
      // keys registered in `initialize` instead.
      ...CommonProperties.StyleTransfer(provider.id, {
        cesdk,
        i18n: {
          prompt: {
            inputLabel: `${PLUGIN_ID}.prompt.label`,
            placeholder: `${PLUGIN_ID}.prompt.placeholder`
          }
        }
      })
    }
  });

  // Attach the apply-to-photo middleware as the outermost wrapper so it sees
  // the raw `result.url` before anything else can rewrite it. Keep any
  // existing middleware (the gateway factory leaves this empty today, but
  // downstream code may have appended something).
  const existing = provider.output.middleware ?? [];
  provider.output.middleware = [applyToPhotoMiddleware(cesdk), ...existing];

  // No history grid — the edited photo replaces the previous state on the
  // canvas, so there's nothing to pick from a gallery.
  provider.output.history = false;
}

// ----------------------------------------------------------------------------
// Middleware & helpers
// ----------------------------------------------------------------------------

/**
 * Intercepts the i2i generate result and writes the returned URL back to
 * the current page's image fill, replacing the photo in place.
 *
 * Wraps the work in a `Pending` → `Ready` block state so CE.SDK shows its
 * standard generation shimmer on the page while the gateway is working.
 *
 * Writes via `setSourceSet` regardless of which shape held the original
 * image, normalizing scenes built with `createFromImage` (which stores
 * `fill/image/imageFileURI`) into the same shape downstream edits expect.
 */
function applyToPhotoMiddleware(
  cesdk: CreativeEditorSDK
): Middleware<any, any> {
  return async (input, options, next) => {
    const page = cesdk.engine.scene.getCurrentPage();
    if (page == null) return next(input, options);

    const fill = cesdk.engine.block.getFill(page);

    cesdk.engine.block.setState(page, { type: 'Pending', progress: 0 });
    try {
      const result = await next(input, options);

      // Async generators are a streaming flow (text) — not applicable here,
      // but guard anyway rather than reaching into a generator.
      if (result != null && typeof (result as any).url === 'string') {
        const nextUri = (result as any).url as string;
        const existing = cesdk.engine.block.getSourceSet(
          fill,
          'fill/image/sourceSet'
        )[0];
        // If the scene was built via `createFromImage`, sourceSet is empty
        // — fall back to the page's dimensions, which `createFromImage`
        // sizes to match the image.
        const nextSource =
          existing != null
            ? { ...existing, uri: nextUri }
            : {
                uri: nextUri,
                width: cesdk.engine.block.getWidth(page),
                height: cesdk.engine.block.getHeight(page)
              };
        cesdk.engine.block.setSourceSet(fill, 'fill/image/sourceSet', [
          nextSource
        ]);
        cesdk.engine.editor.addUndoStep();
      }

      return result;
    } finally {
      cesdk.engine.block.setState(page, { type: 'Ready' });
    }
  };
}

/**
 * Returns the current page's image fill URI, checking both storage shapes:
 *
 *   - `fill/image/sourceSet`   — used by scenes built with `setSourceSet`.
 *   - `fill/image/imageFileURI` — used by `cesdk.createFromImage(url)`.
 *
 * The gateway's `getBlockInput` feeds this URL to `getImageDimensionsFromURL`
 * to match placeholder dimensions, so returning an empty string would make
 * an `<img>.onerror` fire and the surrounding framework stringifies that
 * Event into the unhelpful `"[object Event]"` error.
 */
function getCurrentPageImageUri(cesdk: CreativeEditorSDK): string | undefined {
  try {
    const page = cesdk.engine.scene.getCurrentPage();
    if (page == null) return undefined;
    const fill = cesdk.engine.block.getFill(page);

    const sourceSet = cesdk.engine.block.getSourceSet(
      fill,
      'fill/image/sourceSet'
    );
    if (sourceSet[0]?.uri != null && sourceSet[0].uri !== '') {
      return sourceSet[0].uri;
    }

    const fileUri = cesdk.engine.block.getString(
      fill,
      'fill/image/imageFileURI'
    );
    return fileUri !== '' ? fileUri : undefined;
  } catch {
    return undefined;
  }
}
