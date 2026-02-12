> This is one page of the CE.SDK React documentation. For a complete overview, see the [React Documentation Index](https://img.ly/react.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Automate Workflows](./automation.md) > [Batch Processing](./automation/batch-processing.md)

---

This guide shows you how to use CE.SDK to create and manage batch processing workflows in the browser. Batch processing automates creative operations at scale, from enabling template population and multi-format exports, to bulk transformations and production pipelines.

In the browser, batch processing means automating the same CreativeEngine workflow while the tab stays open. Instead of the user editing/exporting items one by one, your front-end:

1. Loops through a dataset.
2. Produces a series of outputs.

This guides helps you understand how the CE.SDK can work in a batch process workflow.

## What You’ll Learn

- Two different batch processing approaches:

  - Sequential
  - Parallel

- How to batch:

  - Templates population with data.
  - Exports to different formats (PNG, JPEG, PDF, MP4).
  - Thumbnails generation.

- How to optimize memory usage.

## Batch Processing Strategies

You can run batch operations in two ways:

- **Sequential:** a single engine loop.
- **Parallel:** multiple workers spinning up.

The following examples show both approaches when running a batch export in the browser:

<Tabs>
  <TabItem label="Sequential (single core)">
    ```ts

    // ... downloadBlob logic
    //Start the engine and download the scene
    const engine = await CreativeEngine.init({ license: LICENSE_KEY });

    for (const record of records) {
      await engine.scene.loadFromString(record.scene);
      const blob = await engine.block.export(engine.scene.getPages()[0], 'image/png');
      await downloadBlob(blob, `${record.id}.png`);
    }

    engine.dispose();

    ```

    1. `CreativeEngine.init` spins up a single engine instance for the tab.
    2. The loop iterates over the `record` dataset.
    3. The Engine loads the scene.
    4. The `export` call renders the first page as a PNG blob.
    5. The code disposes of the engine to free resources.
  </TabItem>

  <TabItem label="Parallel (2 cores)">
    ```ts
    const workers = [new Worker('worker.js'), new Worker('worker.js')];

    await Promise.all(
      records.map((record, idx) =>
        workers[idx % workers.length].postMessage({ type: 'PROCESS', record })
      )
    );

    ```

    In this code:

    1. 2 workers run in separate threads.
    2. Each worker receives a different data set.
    3. Each worker runs the heavier CreativeEngine work off the main thread.
    4. `Promise.all` waits for every worker call to finish before moving on.
  </TabItem>
</Tabs>

The following table summarizes the pros and cons of each approach:

| Approach | When to use | Pros | Cons |
| --- | --- | --- | --- |
| **Sequential** | - Default browser workload<br>- Small batch sizes</br>- Limited RAM on user devices | - Lower memory footprint<br>- Simpler code path</br>- Easy cleanup |- Slower total runtime<br>- UI can feel locked if not chunked</br> |
| **Parallel** | - Big datasets<br>Enough resources in user devices</br>| - Higher throughput<br>- Can keep UI responsive</br> | - More memory consumption per tab<br>Coordination complexity</br>- Throttling risk |

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
| PNG | `engine.block.export(block, 'image/png')` | [PNG](./export-save-publish/export/to-png.md)  |
| JPEG | `engine.block.export(block, 'image/jpeg', 0.95)` | [JPEG](./export-save-publish/export/to-jpeg.md) |
| PDF | `engine.block.export(block, 'application/pdf')` | [PDF](./export-save-publish/export/to-pdf.md) |
| MP4 | `engine.block.exportVideo(block, MimeType.Mp4)` | [MP4](./export-save-publish/export/to-mp4.md) |

Check all the export options in the [Export section](./export-save-publish/export/overview.md).

### Batch Thumbnail Generation from Static Scenes

The export feature allows you to automate thumbnails generation by tweaking the format and the size of the design, for example:

```ts
// Example: Real-time thumbnail generation
const thumbnailEngine = await CreativeEngine.init({ container: null });

async function generateThumbnail(sceneData) {
  await thumbnailEngine.scene.loadFromString(sceneData);
  const page = thumbnailEngine.scene.getPages()[0];

  // Generate small preview
  const thumbnail = await thumbnailEngine.block.export(page, 'image/jpeg', {
    targetWidth: 200,
    targetHeight: 200,
    quality: 0.7,
  });

  return thumbnail;
}

```

Read more about thumbnails generation in [the Engine guide](./engine-interface.md).

The CE.SDK also provides over 20 pre-designed text layouts to apply on thumbnails. Check the [relevant guide](./user-interface/customization/reference.md) to use them.

### Batch Thumbnail Generation from Video Scenes

Extract representative frames from videos efficiently, and automate this action using the dedicated CE.SDK features:

| Action | EngineAPI function | Related guide |
| --- | --- | --- |
| Load video source | `engine.scene.createFromVideo()` | [Create from Video](./create-video/control.md) |
| Seek to timestamp | `engine.block.setPlaybackTime()` | [Control Audio and Video](./create-video/control.md) |
| Export single frame | `engine.block.export(block, options)` | [To PNG](./export-save-publish/export/to-png.md) <br />[Text Designs](./user-interface/customization/reference.md) |
| Generate sequence thumbnails | `engine.block.generateVideoThumbnailSequence()` | [Trim Video Clips](./edit-video/trim.md) |
| Size thumbnails consistently | `targetWidth / targetHeight` export options | [To PNG](./export-save-publish/export/to-png.md) |

The following code shows how to **generate thumbnails from a video**:

```ts
import CreativeEngine from '@cesdk/engine';

const engine = await CreativeEngine.init({ license: LICENSE_KEY });
await engine.scene.loadFromURL('/assets/video-scene.scene');

const [page] = engine.scene.getPages();
const videoBlock = engine.block
  .getChildren(page)
  .find((child) => engine.block.getType(child) === 'video');

if (videoBlock) {
  const videoFill = engine.block.getFill(videoBlock);
  await engine.block.setPlaybackTime(videoFill, 4.2);

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
2. Seeks to 4.2 s.
3. Exports the page as a PNG.
4. Saves the thumbnail.

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
  engine = await CreativeEngine.init({ license: LICENSE_KEY });
  await engine.scene.loadFromURL('/assets/video-scene.scene');

  const [page] = engine.scene.getPages();
  if (!page) throw new Error('Scene has no pages.');

  const videoBlock = engine.block
    .getChildren(page)
    .find((child) => engine.block.getType(child) === 'video');
  if (!videoBlock) throw new Error('No video block found.');

  const videoFill = engine.block.getFill(videoBlock);
  if (!videoFill) throw new Error('Video block is missing its fill.');

  await engine.block.setPlaybackTime(videoFill, 4.2);

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
| Check file existence and accessibility | `await fs.promises.access(filePath, fs.constants.R_OK);` |
| Verify templates load correctly | `await engine.scene.loadFromURL(templateUrl);` |
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
- **Chunked processing**: split datasets into small slices (for example, 20 records) to avoid blocking the main thread.
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
| Performance bottlenecks  | Multiple | - Profile batch operations <br>- Identify slow operations</br>- Optimize export settings<br>- Reduce template complexity</br> |

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

- **[React Documentation Index](https://img.ly/react.md)** - Browse all React documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./react.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support