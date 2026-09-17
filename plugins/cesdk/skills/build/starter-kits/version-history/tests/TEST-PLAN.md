# Test plan: starterkit-version-history

Version 7, 7 Sep 2026. Status: implemented. 49 unit, component and headless tests and 6 browser tests run in `npm run ci` (exit 0). Merged coverage is lines 100 %, branches 100 %, functions 100 %.

## 1. Purpose

Verify that the Version History starter kit works as shipped: the History panel lists the seeded snapshots, Save Snapshot adds a new one with a thumbnail of the current design, and loading a snapshot puts that version back on the canvas.

## 2. Scope

In scope

- `src/imgly/history.ts` — `createSnapshot`: the thumbnail export and the scene blob URL
- `src/imgly/snapshots.ts` — the seeded snapshots and the store
- `src/imgly/utils.ts` — `formatDate`
- `src/imgly/index.ts` — `initVersionHistoryEditor` and `loadSnapshot`
- `src/app/App.tsx`, `HistoryPanel/`, `SnapshotItem/` — the panel, the save action, the load flow

Out of scope

- Export output, zoom auto-fit, scene loading. Engine behaviour; see section 10.
- The editor UI itself. Covered by the core editor suite.
- The demo site around the kit. Covered by the `cesdk_web_demos` suite. Qase 2075, 2076, 2077, 2078, 2079, 2094, 2103, 2458.

## 3. Test environment

- Headless: `@cesdk/node` through the shared harness engine helper. Node, no DOM. The three snapshot scenes load from `public/assets/snapshots/` over `file://`.
- Browser: Chrome, headless, 1400 × 900. Requests to `cdn.img.ly` fail the test.
- License: the shared test license (valid on hostname `localhost` only)
- Data: `public/assets/snapshots/{1,2,3}/scene.scene` and their thumbnails. Snapshot 1 is loaded at start-up.
- Time: unit tests that touch `formatDate` set `process.env.TZ = 'UTC'` in `beforeAll` (see known issue 3).
- The seeded scenes reference Poppins, SourceSerifPro and the emoji font on `cdn.img.ly`, so those two paths are on the kit's `cdnAllowlist`.

## 4. Approach

| Kind     | Tool                          | What it checks                                                     | Run                 |
| -------- | ----------------------------- | ------------------------------------------------------------------ | ------------------- |
| Static   | tsc, eslint, convention check | Types, deprecated APIs, kit folder shape                           | `npm run check:all` |
| Unit     | Vitest                        | Date formatting, the snapshot store, the editor config             | `npm run test:unit` |
| Headless | Vitest + `@cesdk/node`        | `createSnapshot` and the three seeded scenes against a real engine | `npm run test:unit` |
| Browser  | Playwright                    | The test cases in section 5.1                                      | `npm run test:e2e`  |

All four run in the kit's `ci` script. Browser tests use role and label locators only.

## 5. Test cases

Format: ID, Qase ids, title. Then steps and expected result.

### 5.1 Browser

Common precondition: the kit is open and the first snapshot has loaded on the canvas.

**VH-01 · Qase 2108 · Default state**
Steps: open the kit.
Expected: the History panel reads "3 Snapshots" and lists three entries, newest first: Patrick S., Dustin K., Marius W. Each shows a thumbnail and a Load button. The navigation bar shows a "Save Snapshot" button. No console errors. No engine asset from the CDN.
Note from the run: with a single child the Actions dropdown renders as that child, so the navigation bar carries a plain "Save Snapshot" button rather than a dropdown. The dates are rendered in local time (known issue 3), so the browser cases assert on the user names.

**VH-02 · Qase 2122, 2123 · Load a snapshot**
Steps: click the second entry, then the third, then the first.
Expected: each click replaces the canvas with that snapshot's design and zooms to fit the page. The panel keeps three entries and the count does not change.

**VH-03 · Qase 2092 · Editing does not create history**
Steps: move a block on the canvas.
Expected: the canvas shows the change and the History panel still reads "3 Snapshots".

**VH-04 · Qase 2093, 2124 · Save a snapshot**
Steps: after VH-03, run Save Snapshot from the Actions dropdown.
Expected: a fourth entry appears at the top, named Anonymous, dated now, with a thumbnail of the edited design. The count reads "4 Snapshots". Loading it restores the edit; loading entry two still gives the seeded design.

**VH-05 · Qase 2125 · Snapshots are not persisted**
Steps: after VH-04, reload the page.
Expected: the panel is back to the three seeded snapshots and the canvas shows snapshot 1.

**VH-06 · Two snapshots in a row**
Steps: edit, Save Snapshot, edit again, Save Snapshot.
Expected: five entries, the two new ones distinct and in save order. (This is the case known issue 2 puts at risk.)
Note from the run: the case passes. Two clicks are always more than a millisecond apart, so the `createdAt` key never collides in practice; the issue stays open as a latent defect.

### 5.2 Headless

**VH-H1 · Qase 2108 · The seeded scenes load**
Steps: load each of the three snapshot scenes.
Expected: each loads, has one page, and exports a non-empty image. The three differ from each other.

**VH-H2 · Qase 2093 · createSnapshot**
Steps: load a scene, call `createSnapshot` with its scene string.
Expected: a `thumbnailUrl` resolving to a JPEG 168 px wide, and a `sceneUrl` resolving to a blob whose text is exactly the scene string passed in.
Note from the run: the export honours `targetWidth` and derives the height from the scene's aspect ratio, so the thumbnail is 168 × 210 for the seeded 4:5 pages, not 168 × 168.

**VH-H3 · createSnapshot with no scene**
Steps: call `createSnapshot` on an engine with no scene loaded.
Expected: rejects with "No scene available".

**VH-H4 · Qase 2123 · A snapshot round-trip**
Steps: load snapshot 1, change a block, save to a string, call `createSnapshot`, then load the resulting `sceneUrl` back.
Expected: the reloaded scene carries the change, and its thumbnail differs from snapshot 1's.

**VH-H5 · The thumbnail follows the design**
Steps: create a snapshot, change the page colour, create another.
Expected: the two thumbnails differ. Both are 168 px wide. Folded into VH-H4, which already has both snapshots in hand.

### 5.3 Unit

**VH-U1 · Qase 2108 · Date formatting** (`TZ=UTC`)
`formatDate('2023-11-30T08:00:00.000Z')` → `Nov 30th` / `08:00 am`. `2023-11-29T14:00:00.000Z` → `Nov 29th` / `02:00 pm`. Ordinals: 1st, 2nd, 3rd, 4th, 11th, 12th, 13th, 21st, 22nd, 23rd, 31st. Midnight gives `12:00 am` and noon `12:00 pm`.

**VH-U2 · The seeded snapshots**
Note from the run: no jsdom needed. The harness Vitest config substitutes a Node stand-in for `src/imgly/resolveAssetPath`, so `INITIAL_SNAPSHOTS` resolves against a fixed origin and the paths can be asserted directly.
`INITIAL_SNAPSHOTS` has three entries with descending `createdAt`, the user names Patrick S., Dustin K. and Marius W., and thumbnail and scene paths under `assets/snapshots/1`, `2` and `3`. `getInitialSceneUrl()` returns the first entry's `sceneUrl`.

**VH-U3 · The snapshot store**
`getSnapshots()` starts equal to `INITIAL_SNAPSHOTS`. `addSnapshot` prepends and notifies every subscriber. The function returned by `subscribeToSnapshots` removes that listener. (The app does not use this store; see known issue 1.)

**VH-U4 · Editor config**
Steps: call `setupFeatures`, `setupTranslations`, `setupActions` and `setupNavigationBar` with a recording double.
Expected: `setupFeatures` enables exactly the list `config/features.ts` names, in that order, and no video feature. `setupTranslations` sets `common.save` to "Save Snapshot" for `en`. The navigation bar order is document settings, undo/redo, spacer, title, spacer, zoom, preview, and an Actions dropdown whose only child is `ly.img.saveScene.navigationBar`. The dock lists the Elements, Upload, Image, Text, Shape and Sticker entries in that order.

**VH-U8 · removed.** `resolveAssetPath` is gone; `src/imgly/demo-assets.ts` derives the URL from `VITE_DEMO_ASSETS_BASE_URL` or the kit's own URL.

**KB-01 · unit · Keyboard catalog predicates**

`tests/unit/keyboard-catalog.test.ts` runs every `run` and `when` of `src/imgly/config/keyboard/catalogs/us-ansi.ts` against 1620 editor states (5 edit modes, 9 selections, 3 roles, features on and off, 3 vector states, page and no page) and asserts that none throws, that every shortcut activates in at least one state, and that every function `run` reaches `cesdk.actions.run`. Kit-owned: the kit decides which key does what and when it is live. The catalog measures 100 % lines, branches and functions.

## 6. Entry and exit criteria

Entry: engine and editor built; test license available; the shared kit test harness exists (headless engine helper, browser boot helper, console and network guards). The kit already sets `window.cesdk`.

Exit: every case in section 5 passes locally and in CI. `npm run ci` passes. The published kit contains no test files. A release run reports results to the Qase ids above.

## 7. Known issues found while writing this plan

Confirmed by reading the code. Confirm each with a test before fixing.

1. `snapshots.ts` exports a full store — `getSnapshots`, `addSnapshot`, `subscribeToSnapshots` and a module-level `snapshots` array — that nothing uses. `App.tsx` keeps its own React state instead. The module a customer is told to copy carries a second, dead source of truth for the same data.
2. `HistoryPanel` keys its rows by `snapshot.createdAt`. Two snapshots saved inside the same millisecond collide, and every seeded snapshot after the first save is compared against a timestamp string rather than an identity.
3. `formatDate` uses `getDate`, `getHours` and `getMinutes`, which are local-time. The seeded snapshots are stored as UTC, so the dates and times shown move with the viewer's time zone and the three seeded entries can read as the wrong day.
4. `createSnapshot` creates two blob URLs per save and nothing revokes either. Every Save Snapshot leaks a thumbnail and a scene blob for the life of the page.
5. `createSnapshot` takes a `cesdk` but uses only `cesdk.engine`, and it also takes `sceneString` even though it could serialise the scene itself. The wider type stops it being used with a headless engine without a cast.
6. `loadSnapshot` calls `enableZoomAutoFit` with six positional numbers and no explanation of what they are. The same kit's `App` uses `actions.run('zoom.toPage')` elsewhere for the same job.
7. `App.tsx` writes `snapshotsRef.current = snapshots` during render rather than in an effect.
8. Snapshots exist only in memory, which Qase 2125 treats as expected behaviour, but neither the README nor the UI says so.

### Coverage residue

None. Every executable line, branch and function of `src/**` is covered by the merged report.

## 8. Open questions

1. Issue 1: delete the unused store, or move the app onto it? Recommended: delete it. Not decided for S4, so the store is left in place and VH-U3 pins it. The React state in `App.tsx` is the working implementation, and a copyable module with two competing stores is worse than one with none.
2. Issue 5: change `createSnapshot(cesdk, sceneString)` to `createSnapshot(engine)`, serialising inside. Not decided for S4, so the signature is unchanged and the headless tests pass `{ engine }` with a cast. Recommended: yes — it removes a parameter, removes the cast the headless tests would need, and matches what the function actually does.
3. Issue 3 is user-visible: should the seeded dates render in UTC or in local time? Recommended: keep local time, which is what a real history panel wants, and pin `TZ=UTC` in the unit tests rather than changing the behaviour.
4. Issue 2: key the rows by an id rather than the timestamp. Recommended: yes, and it is what VH-06 exercises.

## 9. Estimate

6 browser cases at about 10 s each: about 60 s on one worker. 5 headless cases at about 2 s: 10 s. Unit tests: under 1 s.

## 10. Boundary review

Rule used: the code that makes a decision owns the test for it. The kit decides the seeded snapshots, the thumbnail size and format, what a snapshot contains, the newest-first ordering, the date format, the "Save Snapshot" label and the single-entry Actions dropdown. The engine decides what an export contains and what loading a scene does.

Core behaviour this plan leans on, and where it is covered today:

| Behaviour                                                          | Owner  | Covered by                                                                                             |
| ------------------------------------------------------------------ | ------ | ------------------------------------------------------------------------------------------------------ |
| `block.export` honours `mimeType` and target size                  | engine | `engine/lib/test/api/ExportAPITest.cpp`                                                                |
| `scene.saveToString` / `scene.load` round-trip                     | engine | `engine/lib/test/api/LoadSceneAPITest.cpp` (`sceneStringRoundTrips`)                                   |
| Loading a scene from a URL                                         | engine | `engine/lib/test/api/LoadSceneAPITest.cpp` (`sceneFileURLRoundTrips`)                                  |
| `scene.enableZoomAutoFit` with the kit's six-argument padding form | engine | `engine/lib/test/api/SceneAPITest.cpp` (line 360 onward), `bindings/wasm/js_node/src/SceneAPI.test.ts` |
| `actions.register` overrides a built-in action                     | editor | `apps/cesdk_web/packages/cesdk/registerDefaultActions.test.ts`                                         |
| `i18n.setTranslations` overrides a built-in label                  | editor | `apps/cesdk_web/packages/cesdk/migrateI18nConfiguration.test.ts`                                       |
| `ui.setComponentOrder`, Actions dropdown children                  | editor | `apps/cesdk_web/packages/api/ui/UserInterfaceAPI.test.ts`                                              |
| Undo history does not change on a programmatic edit                | engine | `engine/lib/test/api/HistoryAPITest.cpp`                                                               |

No core coverage gap found for this kit.

## 11. Coverage pass

Cases added to close the merged-coverage gaps:

- **VH-U5 · unit · The actions the kit registers — every handler `setupActions` registers is invoked: `saveScene` downloads the saved scene as text, `exportDesign` downloads what `cesdk.utils.export` returned, `importScene` opens the picker for `.imgly,.scene,.zip`, revokes the blob URL on the success and on the failure path and then runs `zoom.toPage`, `exportScene` writes a JSON scene by default and a zip archive for `{ format: 'archive' }`, and `uploadFile` returns what `cesdk.utils.localUpload` returned**
- **VH-U6 · unit · DesignEditorConfig — `initialize` resets the editor, declares the editor compatibility version it was written for, then applies features, UI, actions, shortcuts, translations and engine settings; with no `cesdk` in the context it touches the engine not at all**
- **VH-U7 · unit · Video timeline scaffold — `setupVideoTimeline` makes no editor call, so the kit ships the timeline example unapplied**

Residue, measured and classified:

- **VH-C1 · component · the version history screen** — the panel lists the snapshots it starts with; `init` publishes `window.cesdk`, configures the editor, loads the initial scene and registers `saveScene`, which prepends a new snapshot; a click loads the snapshot it names and does nothing before the editor exists; `onError` logs the failed start-up; the screen reports the demo lifecycle to the host that embeds it, marking `created` then `ready` and handing the editor's loading state straight to the beacon.
- **VH-C2 · component · the history panel on its own** — a single snapshot counts in the singular and draws no divider, two draw one.

Residue: none from the asset base; `src/imgly/demo-assets.ts` is covered by the shared `tests/unit/demo-assets.test.ts`.
