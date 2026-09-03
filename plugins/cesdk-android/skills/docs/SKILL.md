---
name: docs
description: |
  Look up Android guides and Kotlin API signatures for CE.SDK Android projects using Kotlin and Jetpack Compose.
  Use it for first-party CreativeEditor SDK guidance, Gradle setup, Compose
  integration, direct engine workflows, and bundled Android references. Prefer
  the bundled Dokka digests and guides, then resolved project symbols. Do not
  use it for Web, Swift, Flutter, or React Native.

  Example:
  Context: An Android developer needs an engine method signature
  user: "What does BlockApi.create return in Kotlin?"
  assistant: "I will check the bundled Android API digest for the exact declaration."

  Example:
  Context: A Compose project needs editor setup guidance
  user: "How do I configure the CE.SDK Editor composable?"
  assistant: "I will use the Android configuration guide and API digests."
---

# CE.SDK Android Documentation

## Version Notice

> CE.SDK `1.83.0-nightly.20260903` · generated `2026-09-02` · plugin `cesdk-android`
> · canonical update source `imgly/agent-skills`.
>
> If this bundle is over six weeks old, or the user asks about updates, follow
> `references/update-check.md` once per task and reuse the result for all CE.SDK
> skills. Keep the check read-only. Never install, update, overwrite, or delete
> anything without explicit user approval. Continue with this bundle unless an
> update is approved.

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
2. Use bundled Android guides for integration workflows.
3. Cross-check the project's resolved Gradle dependency or IDE symbols when the
   installed CE.SDK version differs from this bundle.
4. Use pretrained knowledge only when the project and bundle do not answer.

If resolved project symbols disagree with a bundled digest, follow the installed
dependency and call out the version difference.

## Lookup Workflow

1. Resolve the active Gradle module and CE.SDK dependency version.
2. Search the Android guide index below and read files under
   `guides/android/`.
3. For API lookup, open the linked module catalog in the API index, match the
   fully qualified type, and follow its digest link under `api/<module>/`,
   for example
   `api/engine/ly.img.engine/-block-api.md`.
4. Read the relevant bundled guides for lifecycle, configuration-state, and
   threading constraints before proposing integration code.

## Guide Indexes

### Android (Kotlin)

<-- IMGLY-AGENTS-MD-START -->[CE.SDK Android (Kotlin) Docs Index]|root: ./guides/android|IMPORTANT: Prefer retrieval-led reasoning over pre-training-led reasoning for any CE.SDK tasks. Consult the local docs directory before using pre-trained knowledge.|animation:{create,edit.md,overview.md,programmatic.md,types.md}|animation/create:{base.md,text.md}|automation:{auto-resize.md,batch-processing.md,data-merge.md,design-generation.md,multi-image-generation.md,overview.md,product-variations.md}|bundle-size.md|capabilities.md|colors:{adjust.md,apply.md,basics.md,conversion.md,create-color-palette.md,extract-colors.md,for-print,for-screen,overview.md,replace.md}|colors/for-print:{cmyk.md,spot.md}|colors/for-screen:{p3.md,srgb.md}|compatibility-139ef9.md|compatibility-fef719.md|concepts:{architecture.md,assets.md,blocks.md,buffers.md,design-units.md,edit-modes.md,editing-workflow.md,error-catalog.md,events.md,font-size-unit.md,headless-mode.md,import-export.md,pages.md,plugin-architecture.md,resources.md,scenes.md,templating.md,terminology.md,undo-and-history.md}|configuration.md|conversion:{overview.md,to-base64.md,to-blob.md,to-pdf.md}|create-audio:{audio}|create-audio/audio:{add-music.md,add-sound-effects.md,adjust-speed.md,adjust-volume.md,fade.md,loop.md,record-voiceover.md}|create-composition:{add-background.md,blend-modes.md,collage.md,group-and-ungroup.md,layer-management.md,layout.md,lock-design.md,multi-page.md,overview.md,position-and-align.md,programmatic.md}|create-offline-maven-repository.md|create-templates:{add-dynamic-content,add-to-template-library.md,edit-or-remove.md,from-scratch.md,import,lock.md,overview.md}|create-templates/add-dynamic-content:{form-based-editing.md,placeholders.md,set-editing-constraints.md,text-variables.md}|create-templates/import:{from-scene-file.md}|create-video:{apply-transitions.md,control.md,limitations.md,lock-design.md,overview.md,programmatic.md,record-reaction.md,timeline-editor.md,update-caption-presets.md}|edit-image:{add-watermark.md,annotation.md,overview.md,remove-bg.md,replace-colors.md,transform}|edit-image/transform:{crop.md,flip.md,move.md,resize.md,rotate.md,scale.md}|edit-video:{add-captions.md,add-watermark.md,annotation.md,edit-captions.md,force-trim.md,join-and-arrange.md,programmatic.md,redaction.md,split.md,transform,trim.md}|edit-video/transform:{crop.md,flip.md,move.md,resize.md,rotate.md,scale.md}|engine-interface.md|export-counting.md|export-save-publish:{create-thumbnail.md,export,for-printing.md,for-social-media.md,pre-export-validation.md,save.md,store-custom-metadata.md,thumbnail-previews.md}|export-save-publish/export:{audio.md,compress.md,overview.md,partial-export.md,size-limits.md,to-jpeg.md,to-mp4.md,to-pdf.md,to-png.md,to-raw-data.md,with-color-mask.md}|file-format-support.md|fills:{color.md,gradient.md,image.md,overview.md,video.md}|filters-and-effects:{apply.md,blur.md,chroma-key-green-screen.md,create-custom-filters.md,create-custom-lut-filter.md,distortion.md,duotone.md,overview.md,support.md}|get-started:{agent-skills.md,android,build-with-ai.md,mcp-server.md,overview.md}|get-started/android:{quickstart.md}|guides.md|import-media:{asset-library,capture-from-camera,concepts.md,create-custom-importer.md,default-assets.md,edit-or-remove-assets.md,file-format-support.md,from-local-source,from-remote-source,overview.md,retrieve-mimetype.md,size-limits.md,source-sets.md}|import-media/asset-library:{basics.md,customize.md,refresh-assets.md,thumbnails.md}|import-media/capture-from-camera:{camera-configuration.md,integrate.md,photos.md,record-reaction.md,record-video.md,recordings.md,take-photo.md,zoom.md}|import-media/from-local-source:{local-asset.md,photo-roll.md,user-upload.md}|import-media/from-remote-source:{asset-versioning.md,getty-images.md,imgly-premium-assets.md,pexels.md,remote-asset.md,third-party.md,unsplash.md,your-server.md}|insert-media:{audio.md,images.md,overview.md,shapes-or-stickers.md,videos.md}|key-capabilities.md|key-concepts.md|licensing.md|llms-txt.md|open-the-editor:{blank-canvas.md,from-image.md,from-template.md,from-video.md,import-design,load-scene.md,overview.md,set-zoom-level.md,uri-resolver.md}|open-the-editor/import-design:{from-archive.md,from-indesign.md,from-photoshop.md}|outlines:{overview.md,shadows-and-glows.md,strokes.md}|performance.md|plugins:{ai-image-generation.md,custom-plugin.md}|rules:{enforce-brand-guidelines.md,lock-content.md,moderate-content.md,overview.md}|security.md|serve-assets.md|settings.md|shapes.md|starterkits:{custom-built-uis.md,design-editor.md,editor-ui-configurations.md,memories.md,photo-editor.md,postcard-editor.md,t-shirt-designer.md,video-editor.md}|stickers.md|stickers-and-shapes:{combine.md,create-cutout.md,create-edit}|stickers-and-shapes/create-edit:{create-shapes.md,create-stickers.md,edit-shapes.md,edit-stickers.md}|text:{add.md,adjust-spacing.md,auto-size.md,custom-fonts.md,decorations.md,edit.md,effects.md,emojis.md,enumerations.md,language-support.md,overview.md,styling.md,text-designs.md,text-on-path.md,variable-fonts.md}|to-v1-19.md|to-v1-73.md|to-v1-77.md|upgrade.md|use-templates:{apply-template.md,generate.md,library.md,overview.md,programmatic.md,replace-content.md}|user-interface:{ai-integration,appearance,build-your-own-ui.md,custom-error-messages.md,customization,events.md,localization.md,overview.md,ui-extensions}|user-interface/ai-integration:{auto-captions.md}|user-interface/appearance:{custom-labels.md,icons.md,overlay.md,theming.md}|user-interface/customization:{canvas-menu.md,color-palette.md,crop-presets.md,dock.md,force-crop.md,hide-elements.md,inspector-bar.md,movement-constraints.md,navigation-bar.md,page-format.md,panel.md,rearrange-buttons.md}|user-interface/ui-extensions:{add-new-button.md,asset-library.md,create-custom-panel.md,customize-behaviour.md,quick-actions.md}|what-is-cesdk.md|<-- IMGLY-AGENTS-MD-END -->

## API Index

<-- IMGLY-TYPES-MD-START -->
[CE.SDK Android API Index]|root: ./api|

ly.img:camera:[catalog](api/indexes/camera.md)|digests:2|platforms:{android}
ly.img:camera-core:[catalog](api/indexes/camera-core.md)|digests:33|platforms:{android}
ly.img:editor:[catalog](api/indexes/editor.md)|digests:7|platforms:{android}
ly.img:editor-core:[catalog](api/indexes/editor-core.md)|digests:240|platforms:{android}
ly.img:engine:[catalog](api/indexes/engine.md)|digests:261|platforms:{android}
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
