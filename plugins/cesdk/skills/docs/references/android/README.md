# CE.SDK Android Documentation

## Platform and Module Scope

Target Android projects written in Kotlin, including Jetpack Compose editor and
camera integrations plus direct engine workflows. Detect the active module from
`settings.gradle(.kts)`, `build.gradle(.kts)`,
`gradle/libs.versions.toml`, and Kotlin sources.

The bundled API corpus covers the first-party engine, editor, camera, and plugin
modules. Keep engine API work on `engine.dispatcher` (the main thread for
public engines), and use the `Editor` composable lifecycle unless the request
explicitly requires a custom engine surface.

## Source Priority

1. Use bundled Dokka API digests for exact Kotlin declarations and deprecations.
2. Use the Android guides on the docs site for integration workflows.
3. Cross-check the project's resolved Gradle dependency or IDE symbols when the
   installed CE.SDK version differs from this bundle.
4. Use pretrained knowledge only when the project and bundle do not answer.

If resolved project symbols disagree with a bundled digest, follow the installed
dependency and call out the version difference.

## Lookup Workflow

1. Resolve the active Gradle module and CE.SDK dependency version.
2. Search `android.md` in this folder and fetch the pages as described in
   Remote Documentation below.
3. For API lookup, open the linked module catalog in the API index, match the
   fully qualified type, and follow its digest link under `api/<module>/`,
   for example
   `api/engine/ly.img.engine/-block-api.md`.
4. Read the relevant guides for lifecycle, configuration-state, and
   threading constraints before proposing integration code.

## Remote Documentation

The guides are on the CE.SDK docs site, not in this bundle. The index files in
this folder list them:

- `android.md` lists every page of https://img.ly/docs/cesdk/dev/android/ with its title and link.

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
   `.md`. For example, `https://img.ly/docs/cesdk/dev/android/<path>-<id>/` becomes
   `https://img.ly/docs/cesdk/dev/android/<path>-<id>.md`. Use WebFetch. If WebFetch is not
   available (for example in Codex), use `curl -sL --compressed <url>`. If a
   page returns 404, it does not exist in that version: read that version's
   index, `<root>android.md`, instead.
4. **Answer from the fetched pages**, and cite their URLs. If neither a page nor
   the bundled API digests cover the request, say so instead of filling the gap
   with pre-trained knowledge.
5. **Full text, last resort**: `https://img.ly/docs/cesdk/android/llms-full.txt` holds all pages
   of the latest stable release in one file of several MB. Search it with
   `curl -sL --compressed <url> | grep -n "<keyword>"`. Do not read it in full.

## API Index

<-- IMGLY-TYPES-MD-START -->
[CE.SDK Android API Index]|root: ./api|

ly.img:camera:[catalog](api/indexes/camera.md)|digests:2|platforms:{android}
ly.img:camera-core:[catalog](api/indexes/camera-core.md)|digests:33|platforms:{android}
ly.img:editor:[catalog](api/indexes/editor.md)|digests:7|platforms:{android}
ly.img:editor-core:[catalog](api/indexes/editor-core.md)|digests:273|platforms:{android}
ly.img:engine:[catalog](api/indexes/engine.md)|digests:267|platforms:{android}
ly.img:engine-camera:[catalog](api/indexes/engine-camera.md)|digests:1|platforms:{android}
ly.img:plugin-ai-core:[catalog](api/indexes/plugin-ai-core.md)|digests:10|platforms:{android}
ly.img:plugin-ai-image-generation:[catalog](api/indexes/plugin-ai-image-generation.md)|digests:4|platforms:{android}
ly.img:plugin-background-removal:[catalog](api/indexes/plugin-background-removal.md)|digests:11|platforms:{android}
ly.img:plugin-background-removal-google:[catalog](api/indexes/plugin-background-removal-google.md)|digests:5|platforms:{android}
ly.img:plugin-background-removal-imgly:[catalog](api/indexes/plugin-background-removal-imgly.md)|digests:7|platforms:{android}
<-- IMGLY-TYPES-MD-END -->

## Related Skills

- Use the sibling `build` skill to implement or scaffold Android code.
- Use the sibling `explain` skill for a conceptual walkthrough.
