> This is one page of the CE.SDK Next.js documentation. For a complete overview, see the [Next.js Documentation Index](https://img.ly/docs/cesdk/nextjs.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Concepts](./concepts.md) > [Cross-Origin Resources (CORS)](./concepts/cors.md)

---

Serve your media with the CORS header CE.SDK needs, and find the file that
stops an export.

![The CE.SDK design editor showing an image loaded from a host that sends CORS headers](https://img.ly/docs/cesdk/./assets/browser.hero.webp)

> **Reading time:** 5 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/tags/release-1.85.0-nightly.20261008.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/release-1.85.0-nightly.20261008/guides-concepts-cors-browser)
>
> - [Open in StackBlitz](https://stackblitz.com/github/imgly/cesdk-web-examples/tree/v1.85.0-nightly.20261008/guides-concepts-cors-browser)
>
> - [Live demo](https://cdn.img.ly/demo/cesdk-web-examples/v1.85.0-nightly.20261008/examples/guides-concepts-cors-browser/index.html)

CE.SDK reads the bytes of every image, video, audio file and font it renders, with the browser's `fetch()` in CORS mode. When a file comes from a different origin than your editor, the browser hands the bytes to CE.SDK only if the response carries an `Access-Control-Allow-Origin` header that allows your editor's origin. Without it, the browser blocks the response, and the block that uses the file cannot load it.

```typescript file=@cesdk_web_examples/guides-concepts-cors-browser/browser.ts reference-only
import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';

import {
  DemoAssetSources,
  PagePresetsAssetSource,
  TextAssetSource,
  TypefaceAssetSource,
  UploadAssetSources
} from '@cesdk/cesdk-js/plugins';
import { DesignEditorConfig } from '@cesdk/core-configs-web/design-editor';
import packageJson from './package.json';

/**
 * CE.SDK Plugin: Cross-Origin Resources (CORS) Guide
 *
 * Loads an image from a host that sends CORS headers and reports blocks whose
 * file the browser blocked.
 */
class Example implements EditorPlugin {
  name = packageJson.name;

  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    await cesdk.addPlugin(new DesignEditorConfig());
    await cesdk.addPlugin(new PagePresetsAssetSource());
    await cesdk.addPlugin(new TextAssetSource());
    await cesdk.addPlugin(new TypefaceAssetSource());
    await cesdk.addPlugin(
      new UploadAssetSources({ include: ['ly.img.image.upload'] })
    );
    await cesdk.addPlugin(
      new DemoAssetSources({ include: ['ly.img.image.*'] })
    );

    await cesdk.actions.run('scene.create', {
      page: { width: 1200, height: 800, unit: 'Pixel' }
    });
    const engine = cesdk.engine;
    const page = engine.scene.getCurrentPage()!;

    cesdk.ui.insertOrderComponent(
      { in: 'ly.img.navigation.bar', position: 'end' },
      'ly.img.exportImage.navigationBar'
    );

    engine.block.onStateChanged([], (blocks) => {
      for (const block of blocks) {
        if (!engine.block.isValid(block)) continue;
        const state = engine.block.getState(block);
        if (state.type === 'Error' && state.error === 'FileFetch') {
          cesdk.ui.showNotification({
            type: 'error',
            message:
              'A file could not be loaded. Check the browser console for a CORS error.'
          });
        }
      }
    });

    const base = 'https://cdn.img.ly/assets/demo/v3/ly.img.image/images';
    const imageBlock = engine.block.create('graphic');
    engine.block.setShape(imageBlock, engine.block.createShape('rect'));
    const imageFill = engine.block.createFill('image');
    engine.block.setSourceSet(imageFill, 'fill/image/sourceSet', [
      { uri: `${base}/sample_1-512x341.jpg`, width: 512, height: 341 },
      { uri: `${base}/sample_1-1249x833.jpg`, width: 1249, height: 833 },
      { uri: `${base}/sample_1.jpg`, width: 2500, height: 1667 }
    ]);
    engine.block.setFill(imageBlock, imageFill);
    engine.block.setWidth(imageBlock, 1200);
    engine.block.setHeight(imageBlock, 800);
    engine.block.appendChild(page, imageBlock);
  }
}

export default Example;
```

This guide covers why a file can open in your browser but not in the editor, why an export can fail while the canvas looks fine, the server configuration that fixes both, and how to find the file that causes the error.

## Why a File Opens in the Browser but Not in the Editor

A plain `<img>` tag and a new browser tab show a cross-origin image without any CORS header. They only display the picture, so the browser does not check. CE.SDK needs the pixel data, so the browser checks the header on every file CE.SDK requests.

| How the file is loaded                                                          | Needs `Access-Control-Allow-Origin` |
| ------------------------------------------------------------------------------- | ----------------------------------- |
| A browser tab, an `<img>` tag without `crossorigin`, or a request from a server | No                                  |
| CE.SDK: images, videos, audio, fonts and asset library thumbnails               | Yes                                 |

A URL that works in your app is therefore no proof that it works in the editor.

## What Happens When the Header Is Missing

The block that uses the file shows an error placeholder on the canvas, and an export that contains the block fails:

- **The block state:** `engine.block.getState()` returns `{ type: 'Error', error: 'FileFetch' }`.
- **The export error:** `engine.block.export()` rejects with `The export was cancelled due to block <id> having an error: FILE_FETCH_FAILED (<url>)`. The editor's Export button shows a generic message instead: `We were unable to prepare your export due to insufficient resources.`
- **The browser console:** `Access to fetch at '<url>' from origin '<origin>' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.`

The example subscribes to state changes with `engine.block.onStateChanged()` and shows a notification for every block that enters this state.

```typescript highlight=highlight-report-errors
engine.block.onStateChanged([], (blocks) => {
  for (const block of blocks) {
    if (!engine.block.isValid(block)) continue;
    const state = engine.block.getState(block);
    if (state.type === 'Error' && state.error === 'FileFetch') {
      cesdk.ui.showNotification({
        type: 'error',
        message:
          'A file could not be loaded. Check the browser console for a CORS error.'
      });
    }
  }
});
```

## Why the Canvas Looks Fine but the Export Fails

An image fill can have a source set: several variants of one image at different sizes. The canvas loads the variant that fits the block's size on screen. The export loads the variant that fits the export size, which is usually a larger one. Each variant is a separate request, and each one needs the header.

```typescript highlight=highlight-source-set
const base = 'https://cdn.img.ly/assets/demo/v3/ly.img.image/images';
const imageBlock = engine.block.create('graphic');
engine.block.setShape(imageBlock, engine.block.createShape('rect'));
const imageFill = engine.block.createFill('image');
engine.block.setSourceSet(imageFill, 'fill/image/sourceSet', [
  { uri: `${base}/sample_1-512x341.jpg`, width: 512, height: 341 },
  { uri: `${base}/sample_1-1249x833.jpg`, width: 1249, height: 833 },
  { uri: `${base}/sample_1.jpg`, width: 2500, height: 1667 }
]);
engine.block.setFill(imageBlock, imageFill);
engine.block.setWidth(imageBlock, 1200);
engine.block.setHeight(imageBlock, 800);
engine.block.appendChild(page, imageBlock);
```

When the host of the small variant sends the header and the host of the large variant does not, the canvas can show the small variant, and the block then reports `Ready`. The export then requests the large variant, the browser blocks it, and the export fails with `FILE_FETCH_FAILED` and the URL of the large variant. Zooming in does not show the problem: the canvas keeps the small variant on screen when the large one fails.

## Fix It on the Server

The only header CE.SDK needs is `Access-Control-Allow-Origin` on the file's response. Set it to `*` for public files, or to the exact origin of your editor.

Send the header on every response, including responses to requests without an `Origin` header. Otherwise a plain `<img>` tag in your page can leave a cached copy without the header, and CE.SDK's request for the same URL gets that copy and fails. A server that echoes the request's `Origin` instead of a fixed value must also send `Vary: Origin`. Amazon S3 adds the header only when the request has an `Origin`, so there, add `crossorigin="anonymous"` to the `<img>` tags in your page that show the same URLs.

For NGINX:

```nginx
location /media/ {
  add_header Access-Control-Allow-Origin "https://editor.example.com";
}
```

For Apache, inside the `<Directory>` block of your media folder, with `mod_headers` enabled:

```apache
Header set Access-Control-Allow-Origin "https://editor.example.com"
```

For Amazon S3, in the bucket's CORS configuration:

```json
[
  {
    "AllowedOrigins": ["https://editor.example.com"],
    "AllowedMethods": ["GET", "HEAD"],
    "AllowedHeaders": ["*"]
  }
]
```

Check the result with `curl`, once for every variant of a source set:

```bash
curl -sI -H "Origin: https://editor.example.com" https://media.example.com/photo-2500.jpg | grep -i access-control-allow-origin
```

## Files on Hosts You Do Not Control

When a third-party host does not send the header, route its files through a proxy on your server. The proxy fetches the file on the server, where CORS does not apply, and answers with the header:

```javascript
import http from 'node:http';

const UPSTREAM = 'https://images.partner.example';
const EDITOR_ORIGIN = 'https://editor.example.com';

http
  .createServer(async (req, res) => {
    if (!req.url.startsWith('/')) {
      res.writeHead(400).end();
      return;
    }
    try {
      const upstream = await fetch(UPSTREAM + req.url);
      res.writeHead(upstream.status, {
        'Content-Type':
          upstream.headers.get('content-type') ?? 'application/octet-stream',
        'Access-Control-Allow-Origin': EDITOR_ORIGIN
      });
      res.end(Buffer.from(await upstream.arrayBuffer()));
    } catch {
      res.writeHead(502).end();
    }
  })
  .listen(3001);
```

The proxy only forwards paths to one fixed host, so it cannot be used to fetch arbitrary URLs. It loads each file into memory, which suits images and fonts. Served from your editor's own origin, the proxy needs no CORS header at all, because the browser does not check same-origin requests. The [Self-Hosted Model Proxy](./user-interface/ai-integration/proxy-server.md) guide uses the same pattern for AI providers.

Point CE.SDK at the proxy with a URI resolver, so the scene keeps its original URLs:

```javascript
engine.editor.setURIResolver((uri, defaultURIResolver) =>
  uri.startsWith('https://images.partner.example/')
    ? uri.replace('https://images.partner.example', 'https://proxy.example.com')
    : defaultURIResolver(uri)
);
```

See [URI Resolver](./open-the-editor/uri-resolver.md) for how the resolver works.

For production, copy the files to storage you control instead. CE.SDK's own assets default to the IMG.LY CDN, which sends the header. When you host them yourself as described in [Serve Assets](./serve-assets.md), give that host the header too.

## Sending Cookies with `web/fetchCredentials`

The `web/fetchCredentials` setting controls whether CE.SDK's requests carry cookies. It accepts the `fetch()` credentials modes `'omit'`, `'same-origin'` and `'include'`, and defaults to `'same-origin'`, so cross-origin requests carry no cookies. Set it to `'include'` only when your file server authenticates with cookies:

```typescript
engine.editor.setSetting('web/fetchCredentials', 'include');
```

The server must then answer with the exact origin of your editor, not `*`, and with `Access-Control-Allow-Credentials: true`. With `*`, the browser blocks the response and the console says `The value of the 'Access-Control-Allow-Origin' header in the response must not be the wildcard '*' when the request's credentials mode is 'include'.` The setting applies to every file CE.SDK loads for the scene and the asset library, including the default assets on the IMG.LY CDN, which answers with `*`, so host those assets yourself as well. See [Settings](./settings.md) for every setting.

## Troubleshooting

- **A block shows an error right after it is added:** open the console. A `blocked by CORS policy` message means the host needs the header. An HTTP status such as 404 or 403 means the URL or its access rights are wrong, not CORS.
- **The error seems to come from a file on the IMG.LY CDN:** the request's initiator chain in the Network panel runs through CE.SDK's own files, such as the engine file `cesdk-v<version>-<hash>.wasm`, which loads from the IMG.LY CDN unless you host it yourself. The blocked file is the URL in the console message.
- **The canvas looks fine, but the export fails with `FILE_FETCH_FAILED`:** the URL in the error is usually a source-set variant the canvas never loaded. Check the header on that URL.
- **An image works in your app but not in the editor:** your app shows it with a plain `<img>` tag, which needs no header. Add the header on the server, and check the note on cached copies in Fix It on the Server.
- **The console says the header must not be the wildcard `*`:** `web/fetchCredentials` is `'include'`. Answer with the exact origin and `Access-Control-Allow-Credentials: true`, or go back to `'same-origin'`.
- **`curl` returns the file, but the editor cannot load it:** `curl` does not enforce CORS. Send an `Origin` header with `curl` and look for `Access-Control-Allow-Origin` in the response.

To find the blocked request in the browser's developer tools:

1. Open the **Console** and filter for `CORS policy`. The message names the blocked URL and your editor's origin.
2. Open the **Network** panel, filter by the file's host, and select the request. Under **Response Headers**, look for `Access-Control-Allow-Origin`.
3. Repeat step 2 for every variant of a source set. `engine.editor.findAllMediaURIs()` lists the image, video and audio URLs of the scene, including every variant.
4. Turn on **Disable cache** and reload, to rule out a cached copy without the header.

## API Reference

| Method                                                   | Purpose                                                                                             |
| -------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| `engine.block.getState()`                                | Returns a block's state, `{ type: 'Error', error: 'FileFetch' }` when its file could not be fetched |
| `engine.block.onStateChanged()`                          | Calls back when the state of blocks changes                                                         |
| `engine.block.setSourceSet()`                            | Sets the variants of an image fill                                                                  |
| `engine.editor.findAllMediaURIs()`                       | Returns the image, video and audio URLs in the scene, including all source-set variants             |
| `engine.editor.setURIResolver()`                         | Rewrites the URLs CE.SDK requests, for example to a proxy                                           |
| `engine.editor.setSetting('web/fetchCredentials', mode)` | Sets whether requests carry cookies                                                                 |



---

## More Resources

- **[Next.js Documentation Index](https://img.ly/docs/cesdk/nextjs.md)** - Browse all Next.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./nextjs.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support