> This is one page of the CE.SDK React documentation. For a complete overview, see the [React Documentation Index](https://img.ly/docs/cesdk/react.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Automate Workflows](./automation.md) > [Batch Processing](./automation/batch-processing.md)

---

This guide shows you how to use CE.SDK to create and manage batch processing workflows in the browser. Batch processing automates creative operations at scale, from enabling template population and multi-format exports, to bulk transformations and production pipelines.

In the browser, batch processing means automating the same CreativeEngine workflow while the tab stays open. Instead of the user editing/exporting items one by one, your front-end:

1. Loops through a dataset.
2. Produces a series of outputs.

This guides helps you understand how the CE.SDK can work in a batch process workflow.

## What You’ll Learn

- Two different batch processing approaches:

  - On the main thread
  - In an export worker

- How to batch:

  - Templates population with data.
  - Exports to different formats (PNG, JPEG, PDF, MP4).
  - Thumbnails generation.

- How to optimize memory usage.

## Batch Processing Strategies

The Engine is single-threaded, so a second instance in the same tab shares the main thread and buys no parallelism. What you choose is where each export renders:

- **On the main thread:** a single Engine loop. Each export freezes the page while it renders.
- **In an export worker:** the same loop with the `exportWorker` feature flag on, so each export renders in a Web Worker and the page stays interactive.

The following examples show both approaches when running a batch export in the browser:

<Tabs>
  <TabItem label="On the main thread">
    ```ts
    import CreativeEngine from '@cesdk/engine';

    async function downloadBlob(blob, filename) {
      const url = URL.createObjectURL(blob);
      const link = Object.assign(document.createElement('a'), { href: url, download: filename });
      link.click();
      URL.revokeObjectURL(url);
    }

    const engine = await CreativeEngine.init({
      license: 'YOUR_CESDK_LICENSE_KEY',
    });

    for (const record of records) {
      await engine.scene.load(record.scene);
      const [page] = engine.scene.getPages();
      const blob = await engine.block.export(page, { mimeType: 'image/png' });
      await downloadBlob(blob, `${record.id}.png`);
    }

    engine.dispose();

    ```

    1. `CreativeEngine.init` spins up a single engine instance for the tab.
    2. The loop iterates over the `record` dataset.
    3. The Engine loads the scene.
    4. The `export` call renders the first page as a PNG blob, blocking the page until it returns.
    5. The code disposes of the engine to free resources.
  </TabItem>

  <TabItem label="In an export worker">
    ```ts
    import CreativeEngine from '@cesdk/engine';

    // downloadBlob as in the previous tab
    const engine = await CreativeEngine.init({
      license: 'YOUR_CESDK_LICENSE_KEY',
      featureFlags: { exportWorker: true },
    });

    for (const record of records) {
      await engine.scene.load(record.scene);
      const [page] = engine.scene.getPages();
      const blob = await engine.block.export(page, { mimeType: 'image/png' });
      await downloadBlob(blob, `${record.id}.png`);
    }

    engine.dispose();

    ```

    In this code:

    1. The `exportWorker` feature flag routes `block.export` into a Web Worker.
    2. The loop and `scene.load` still run on the main thread. Only the rendering moves.
    3. Each `export` call serializes the scene, starts a worker with its own Engine, and renders there, so the page stays interactive.

    Every call pays a worker startup and holds a second Engine in memory while it runs, so this buys responsiveness rather than throughput. Video and audio exports use a worker already, without the flag. For jobs that need several records rendering at once, run the Engine server-side with `@cesdk/node`, where each process gets its own thread.

    The worker loads its host script from `core.baseURL`, beside the wasm, and renders on an `OffscreenCanvas`. Copy that whole directory when you self-host, because a partial copy only fails once the flag is on.
  </TabItem>
</Tabs>

The following table summarizes the pros and cons of each approach:

| Approach | When to use | Pros | Cons |
| --- | --- | --- | --- |
| **Main thread** | - Small batch sizes<br />- Limited RAM on user devices<br />- No UI to keep responsive | - Lower memory footprint<br />- One Engine to start and dispose | - Each export freezes the page<br />- Long batches look like a hang |
| **Export worker** | - Batches run while the user keeps working<br />- Devices with RAM to spare | - The page stays interactive<br />- Same API, one flag to enable | - A worker starts per export<br />- A second Engine in memory per export<br />- No shorter total runtime |

## How To Batch Template Population

For this operation, you generate personalized outputs at scale by combining:

- Templates
- Structured data

### Set the Data Sources

Batch workflows can use a variety of data sources to populate a template, such as:

- CSV files with parsing libraries
- JSON from REST APIs
- Databases (SQL, NoSQL)
- Stream data

The following examples show how to set three different data sources:

<Tabs>
  <TabItem label="JSON file">
    ```ts
    await fetch('path/to/dataset.json').then((r) => r.json());

    ```
  </TabItem>

  <TabItem label="API">
    ```ts
    await fetch('https://api.example.com/dataset').then((r) => r.json());

    ```
  </TabItem>

  <TabItem label="Inline JavaScript object">
    ```ts
    // Define key variables
    let textVariables = {
      first_name: '',
      last_name: '',
      address: '',
      city: '',
    };

    ```
  </TabItem>
</Tabs>

### Update the Template

You can automate template population, update media, and show conditional content based on data. Find some examples in existing guides:

| Action | EngineAPI function | Related guide |
| --- | --- | --- |
| Set text variables | `engine.variable.setString(variableId, value)` | [Text Variables](./create-templates/add-dynamic-content/text-variables.md) |
| Update image fills | `engine.block.setString(block, 'fill/image/imageFileURI', url)` | [Insert Images](./insert-media/images.md) |
| Edit block properties | `engine.block.setFloat(block, key, value)` / `engine.block.setColor(block, key, color)` | [Apply Effects](./filters-and-effects/apply.md) |

### Batch Export the Design

The CE.SDK provides a set of format options when exporting the edited designs:

| Format | EngineAPI function | Related guide |
| --- | --- | --- |
| PNG | `engine.block.export(block, { mimeType: 'image/png' })` | [PNG](./export-save-publish/export/to-png.md)  |
| JPEG | `engine.block.export(block, { mimeType: 'image/jpeg', jpegQuality: 0.95 })` | [JPEG](./export-save-publish/export/to-jpeg.md) |
| PDF | `engine.block.export(block, { mimeType: 'application/pdf' })` | [PDF](./export-save-publish/export/to-pdf.md) |
| MP4 | `engine.block.exportVideo(block, { mimeType: 'video/mp4' })` | [MP4](./export-save-publish/export/to-mp4.md) |

Check all the export options in the [Export section](./export-save-publish/export/overview.md).

### Batch Thumbnail Generation from Static Scenes

The export feature allows you to automate thumbnails generation by tweaking the format and the size of the design, for example:

```ts
import CreativeEngine from '@cesdk/engine';

// CreativeEngine.init is already headless: it renders to its own canvas, which
// stays out of the DOM until you append engine.element. It still runs on the
// main thread, so enable the export worker to keep thumbnails off it.
const thumbnailEngine = await CreativeEngine.init({
  license: 'YOUR_CESDK_LICENSE_KEY',
  featureFlags: { exportWorker: true },
});

async function generateThumbnail(sceneData) {
  await thumbnailEngine.scene.load(sceneData);
  const [page] = thumbnailEngine.scene.getPages();

  // Generate small preview
  const thumbnail = await thumbnailEngine.block.export(page, {
    mimeType: 'image/jpeg',
    targetWidth: 200,
    targetHeight: 200,
    jpegQuality: 0.7,
  });

  return thumbnail;
}

```

Set `targetWidth` and `targetHeight` together, or neither applies. They define a box the render fills while keeping the page's aspect ratio, so a non-square page produces a thumbnail larger than 200×200 on one axis.

Read more about thumbnails generation in [the Engine guide](./engine-interface.md).

### Batch Thumbnail Generation from Video Scenes

Extract representative frames from videos efficiently, and automate this action using the dedicated CE.SDK features:

| Action | EngineAPI function | Related guide |
| --- | --- | --- |
| Load video source | `engine.scene.createFromVideo()` | [Create Videos Overview](./create-video/overview.md) |
| Seek to timestamp | `engine.block.setPlaybackTime()` on the page | [Control Audio and Video](./create-video/control.md) |
| Export single frame | `engine.block.export(block, options)` | [To PNG](./export-save-publish/export/to-png.md) |
| Generate sequence thumbnails | `engine.block.generateVideoThumbnailSequence()` | [Thumbnail Previews](./export-save-publish/thumbnail-previews.md) |
| Size thumbnails consistently | `targetWidth / targetHeight` export options | [To PNG](./export-save-publish/export/to-png.md) |

The following code shows how to **generate thumbnails from a video**:

```ts
import CreativeEngine from '@cesdk/engine';

const engine = await CreativeEngine.init({
  license: 'YOUR_CESDK_LICENSE_KEY',
});
await engine.scene.load('/assets/video-scene.imgly');

const [page] = engine.scene.getPages();
const videoBlock = engine.block
  .getChildren(page)
  .find(
    (child) =>
      engine.block.supportsFill(child) &&
      engine.block.getType(engine.block.getFill(child)) ===
        '//ly.img.ubq/fill/video'
  );

if (videoBlock) {
  // Decode the video before seeking, so the frame exists to render.
  await engine.block.forceLoadAVResource(engine.block.getFill(videoBlock));

  // Seek on the page: a fill's own playback time only drives rendering
  // under solo playback.
  engine.block.setPlaybackTime(page, 4.2);

  const thumbnail = await engine.block.export(page, {
    mimeType: 'image/png',
    targetWidth: 640,
    targetHeight: 360
  });

  await downloadBlob(thumbnail, 'scene-thumb.png');
}

engine.dispose();

```

The preceding code:

1. Loads a scene containing a video.
2. Finds the block whose fill is a video. `getType` returns the full type id, and video is a *fill* type, so there is no `video` block type to match on.
3. Waits for the video resource to decode.
4. Seeks the page to 4.2 s, which cascades the time down to the blocks it contains.
5. Exports the page as a PNG and saves the thumbnail.

## Optimize Memory Usage

Every export produces and accumulates:

- Blobs
- URLs
- Engine state

Proper **cleanup** ensures batch processes complete without resource exhaustion. Without proper cleanup, the browser might:

- Hits memory ceiling.
- Crash.
- Slow down.

Consider the following actions to **avoid exhausting the client**:

| Strategy | Code |
| --- | --- |
| Revoke blob URLs immediately after use | `URL.revokeObjectURL()` |
| Dispose engine instances when finished | `engine.dispose()` |
| Chunk large datasets into smaller batches |  |
| Consider garbage collection timing |  |

Treat cleanup as part of **each loop** iteration, by either:

- Freeing resources **after each item**.
- Chunking resources, by loading smaller parts of your datasets at a time.

> **Note:** To **handle large batches**, consider the following workflows:- Split into smaller chunks.
> - Log progress.
> - Monitor status.

## Apply Error Handling

Batch runs often work with **large records of data**. Some factors can make the job crash, such as:

- A malformed asset
- Timeouts

When your job encounters one of these errors, you can proactively **avoid the job’s failure** using the following patterns:

- Catch errors inside each loop iteration.
- Log failing records so you can retry them later.
- Decide whether to keep going or stop when an error happens.
- Collect a summary of all failures for post-run review.

For example, the preceding code to generate thumbnails now handles errors gracefully to avoid crashes:

```ts
import CreativeEngine from '@cesdk/engine';

let engine;
try {
  engine = await CreativeEngine.init({
    license: 'YOUR_CESDK_LICENSE_KEY',
  });
  await engine.scene.load('/assets/video-scene.imgly');

  const [page] = engine.scene.getPages();
  if (!page) throw new Error('Scene has no pages.');

  const videoBlock = engine.block
    .getChildren(page)
    .find(
      (child) =>
        engine.block.supportsFill(child) &&
        engine.block.getType(engine.block.getFill(child)) ===
          '//ly.img.ubq/fill/video'
    );
  if (!videoBlock) throw new Error('No video block found.');

  await engine.block.forceLoadAVResource(engine.block.getFill(videoBlock));
  engine.block.setPlaybackTime(page, 4.2);

  const thumbnail = await engine.block.export(page, {
    mimeType: 'image/png',
    targetWidth: 640,
    targetHeight: 360
  });

  await downloadBlob(thumbnail, 'scene-thumb.png');
} catch (error) {
  console.error('Failed to generate thumbnail', error);
} finally {
  engine?.dispose();
}

```

### Use Retry Logic

Some errors are temporary due to factors such as:

- Network hiccup
- Rate limits
- Busy CDN

To avoid saturating the related service, you can use smart retries after a short delay. If the error persist:

1. Double the delay.
2. Retry
3. Double again the delay exponentially after each retry.

This strategy allows you to identify temporary failures that could be resolved later.

For **API failures**, consider using circuit breaking patterns that:

- Pause the calls on repeated errors.
- Test again after a delay.

### Check the Input Data Before Processing

Lightweight checks can help you with:

- Catching bad inputs early.
- Preventing waste of time and compute on batches that’ll fail.

Add checks **before**:

- Launching the CE.SDK.
- Loading scenes.
- Exporting large scenes.

The following table contains some checks **examples**:

| Check | Example |
| --- | --- |
| Check input data structure | `if (!isValidRecord(record)) throw new Error('Invalid payload');` |
| Check the asset is reachable | `await fetch(assetUrl, { method: 'HEAD' });` |
| Verify templates load correctly | `await engine.scene.load(templateUrl);` |
| Use dry-run mode for testing | `if (options.dryRun) return simulate(record);` |

For example, the following **data validation function** checks:

- The record type
- The `id`
- The HTTPS template URL
- The presence of variants

It throws descriptive errors if any of these elements are missing.

```ts
function validateRecord(record) {
  if (typeof record !== 'object' || record === null) {
    throw new Error('Record must be an object');
  }
  if (typeof record.id !== 'string') {
    throw new Error('Missing record id');
  }
  if (!record.templateUrl?.startsWith('https://')) {
    throw new Error('Invalid template URL');
  }
  if (!Array.isArray(record.variants) || record.variants.length === 0) {
    throw new Error('Record requires at least one variant');
  }
  return true;
}
```

## Batch Process on Production

When running on production, enhance browser-based batch processes with architecture and UX decisions that help the user run the workflow, such as:

- **User-initiated batches**: keep work tied to explicit user actions; show confirmation dialogs for large jobs.
- **Chunked processing**: split datasets into small slices (for example, 20 records) and yield to the browser between slices. On the main thread this only spreads the freeze out, because each export still blocks for its own duration. Enable the `exportWorker` feature flag to remove the freeze itself.
- **Resource caps**: document safe limits (for example, 50–100 exports per session) and enforce them in the UI.
- **Persistence**: use `localStorage` or IndexedDB to cache progress so reloads can resume work.

### Monitor the Process

Give users visibility inside the tab and send lightweight telemetry upstream.

- Render UI elements that show the state, such as:

  - Progress bars
  - Per-item status chips

- Send `fetch` calls to your backend for:

  - Error logs
  - Aggregated stats

- When a chunk fails:

  1. Show in-app notifications/snackbars.
  2. Offer retries.

For example, the following code:

- Structures logging.
- Renders it with timestamps.

```ts
function reportBatchMetrics(batchMetrics) {
  const entry = {
    timestamp: new Date().toISOString(),
    ...batchMetrics,
  };
  console.table([entry]);
  return fetch('/api/logs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(entry),
  });
}

```

## Troubleshooting

| Issue                      | Cause                                      | Solution                                            |
| -------------------------- | ------------------------------------------ | --------------------------------------------------- |
| Out of memory errors       | Blob URLs not revoked, engine not disposed | Call `URL.revokeObjectURL()` and `engine.dispose()` |
| Slow processing speed      | Template loaded each iteration             | Load template once, modify variables only           |
| Items fail silently        | Missing error handling                     | Wrap processing in try-catch blocks                 |
| Inconsistent outputs       | Shared state between iterations            | Reset state or reload template each iteration       |
| Process hangs indefinitely | Uncaught promise rejection                 | Use error handling and timeouts                     |
| Performance bottlenecks  | Multiple | - Profile batch operations<br />- Identify slow operations<br />- Optimize export settings<br />- Reduce template complexity |

### Debugging Strategies

Effective troubleshooting techniques for batch processing in web apps include:

- Retry with small batches.
- Console log detailed error information.
- Isolate problematic items.

## Next Steps

- [Headless Mode](./concepts/headless-mode/browser.md) - Learn headless engine operation basics
- [Design Generation](./automation/design-generation.md) - Automate single design generation workflows
- [Export Designs](./export-save-publish/export/overview.md) - Deep dive into export options and formats
- [Text Variables](./create-templates/add-dynamic-content/text-variables.md) - Work with dynamic text content in templates
- [Source Sets](./import-media/source-sets.md) - Specify assets sources for each block.



---

## More Resources

- **[React Documentation Index](https://img.ly/docs/cesdk/react.md)** - Browse all React documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./react.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support