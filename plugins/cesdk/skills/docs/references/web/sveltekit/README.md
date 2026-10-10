# CE.SDK SvelteKit Documentation

Look up documentation for IMG.LY CreativeEditor SDK (SvelteKit).

## Remote Documentation

The guides are on the CE.SDK docs site, not in this bundle. The index files in
this folder list them:

- `sveltekit.md` lists every page of https://img.ly/docs/cesdk/dev/sveltekit/ with its title and link.

The links point to the docs of CE.SDK `1.85.0-nightly.20261010`, the version of this bundle,
under `https://img.ly/docs/cesdk/dev/`. The docs site keeps one copy per version, with the same
page paths:

| CE.SDK version | Docs root |
| --- | --- |
| Latest stable release | `https://img.ly/docs/cesdk/` |
| A stable release since 1.60 | `https://img.ly/docs/cesdk/archive/v<major>.<minor>/` |
| Latest release candidate | `https://img.ly/docs/cesdk/next/` |
| Latest nightly | `https://img.ly/docs/cesdk/dev/` |

1. **Check the version.** Read the CE.SDK version the project uses. If it is not
   `1.85.0-nightly.20261010`, replace `https://img.ly/docs/cesdk/dev/` in each link with the root of that
   version.
2. **Read the index** in this folder and pick the pages that match the query.
3. **Fetch each page as Markdown**: remove the trailing `/` from the link and add
   `.md`. For example, `https://img.ly/docs/cesdk/dev/sveltekit/<path>-<id>/` becomes
   `https://img.ly/docs/cesdk/dev/sveltekit/<path>-<id>.md`. Use WebFetch. If WebFetch is not
   available (for example in Codex), use `curl -sL --compressed <url>`. If a
   page returns 404, it does not exist in that version: read that version's
   index, `<root>sveltekit.md`, instead.
4. **Answer from the fetched pages**, and cite their URLs. If neither a page nor
   the bundled API digests cover the request, say so instead of filling the gap
   with pre-trained knowledge.
5. **Full text, last resort**: `https://img.ly/docs/cesdk/sveltekit/llms-full.txt` holds all pages
   of the latest stable release in one file of several MB. Search it with
   `curl -sL --compressed <url> | grep -n "<keyword>"`. Do not read it in full.

## Local Rules

Before setup, initialization, or common operations, read these files in this
folder. They list agent pitfalls that the docs site does not cover.

- `rules/asset-handling.md`
- `rules/common-pitfalls.md`
- `rules/content-fill-mode.md`
- `rules/silent-init-errors.md`
- `rules/verify-properties-before-use.md`

## API Lookup

For TypeScript API queries (method signatures, types, parameters):

Start with the bundled API digests. All Web frameworks share them in `../api/`.

1. **Module lookup**: Match the query to a module in the API index below and read
   `../api/<ModuleName>.md` (e.g. `../api/BlockAPI.md`).
2. **Method search**: Grep `../api/` for the method name.
3. **Common types**: Read `../api/types.md`.

The docs site has the full reference for this version:

- Editor API (`@cesdk/cesdk-js`): `https://img.ly/docs/cesdk/dev/sveltekit/api/cesdk-js.md`
- Engine API (`@cesdk/engine`): `https://img.ly/docs/cesdk/dev/sveltekit/api/engine.md`

Class and type pages follow the same `.md` rule, for example
`https://img.ly/docs/cesdk/dev/sveltekit/api/engine/classes/blockapi.md`.

**Tip**: Verify types against the TypeScript definitions. CE.SDK evolves rapidly
and type shapes may differ from pre-trained knowledge.

## API Index

<-- IMGLY-TYPES-MD-START -->
[CE.SDK Web API Index]|root: ../api

CreativeEngine:{asset,block,editor,event,scene,variable,actions,shortcuts,reactor,version,addPlugin,unstable_setVideoExportInactivityTimeout,unstable_setExportInactivityTimeout,addPostUpdateCallback,addPreUpdateCallback},... (+7)
BlockAPI:{export,getDominantColors,exportWithColorMask,exportVideo,exportAudio,loadFromString,loadFromArchiveURL,loadFromURL,saveToString,saveToArchive,create,createFill,getAudioTrackCountFromVideo,createAudioFromVideo,createAudiosFromVideo},... (+411)
AssetAPI:{registerApplyMiddleware,registerApplyToBlockMiddleware,addSource,addLocalSource,addLocalAssetSourceFromJSONString,addLocalAssetSourceFromJSONURI,removeSource,findAllSources,findAssets,fetchAsset,getGroups,getSupportedMimeTypes,getCredits,name,url},... (+14)
SceneAPI:{setCMYKProfile,setCMYKProfileFromData,getCMYKProfileInfo,removeCMYKProfile,getColorRenderingIntent,setColorRenderingIntent,isBlackPointCompensationEnabled,setBlackPointCompensationEnabled,load,loadFromString,loadFromURL,loadFromArchiveURL,saveToString,saveToArchive,create},... (+35)
EditorAPI:{unlockWithLicense,isCapabilitySupported,getCapabilityState,checkCapabilities,startTracking,setTrackingMetadata,getTrackingMetadata,trackEvent,getActiveLicense,getEngineVersion,onStateChanged,setEditMode,getEditMode,unstable_isInteractionHappening,hasSelectedVectorNode},... (+101)
EventAPI:{subscribe}
VariableAPI:{findAll,setString,getString,remove}
Types:{AnimationType,AssetResult,BlendMode,Color,ExportOptions,PropertyType,Scope,TextCase,VideoExportOptions}
<-- IMGLY-TYPES-MD-END -->

## Additional Triggers

This skill also covers queries about CE.SDK block types, asset sources, and feature capabilities.
It handles API method lookups — BlockAPI, SceneAPI, EditorAPI, AssetAPI, method signatures,
return types, and "engine.block" style queries.

## Related Skills

- Use `/imgly-sdk:build` when the user needs implementation help, not just docs
- Use `/imgly-sdk:explain` for conceptual explanations beyond what docs cover
