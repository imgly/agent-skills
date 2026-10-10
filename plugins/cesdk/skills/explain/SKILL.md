---
name: explain
description: |
  Explain how the IMG.LY SDK (CE.SDK) works: scenes, blocks, pages, fills, effects,
  timeline, rendering, export, asset sources, plugins. Use for "how does X work / why"
  questions about the engine or editor architecture.
argument-hint: "[topic or question]"
---

## Version Notice

> CE.SDK `1.85.0-nightly.20261010` · generated `2026-10-10` · plugin `imgly-sdk`
> · canonical update source `imgly/agent-skills`.
>
> If this bundle is over six weeks old, or the user asks about updates, follow
> `references/update-check.md` once per task and reuse the result for all CE.SDK
> skills. Keep the check read-only. Never install, update, overwrite, or delete
> anything without explicit user approval. Continue with this bundle unless an
> update is approved.

# Explain CE.SDK

**Topic**: $ARGUMENTS

Covers Web (React, Vue.js, Svelte, Angular, Electron, Vanilla JavaScript, Node.js, Nuxt.js, Next.js, SvelteKit); Flutter (Dart) on iOS and Android; React Native (TypeScript) on iOS and Android; Swift on iOS, macOS, and Mac Catalyst; Kotlin and Jetpack Compose on Android.

## Platform Detection

Detect the platform from the project files, then read the matching reference folder.

| Project files | Platform | Reference folder |
|---------------|----------|------------------|
| `pubspec.yaml` (its `android/` and `ios/` folders belong to the Flutter app) | Flutter (Dart; native editor on iOS and Android) | `references/flutter/` |
| `react-native` in `package.json` dependencies (its `android/` and `ios/` folders belong to the React Native app) | React Native (TypeScript; native editor on iOS and Android) | `references/react-native/` |
| `Package.swift`, `*.xcodeproj`, or `*.xcworkspace` | Swift (iOS, macOS, Mac Catalyst) | `references/swift/` |
| `build.gradle`, `build.gradle.kts`, or `settings.gradle*` | Android (Kotlin, Jetpack Compose) | `references/android/` |
| `package.json` | Web — pick the framework from its dependencies (table below) | `references/web/` |

Match the rows in the order listed. A Flutter or React Native project also
holds `android/` and `ios/` folders, and a React Native project lists
`react` in `package.json`; those files belong to the wrapper app, so its row
wins over the Swift, Android, and Web rows.

### Web framework from `package.json` dependencies

Check in this order: `react-native` → React Native (the row above, not Web), then `next` → Next.js, `nuxt` → Nuxt.js, `@sveltejs/kit` → SvelteKit,
`@angular/core` → Angular, `svelte` → Svelte, `vue` → Vue.js, `react` → React,
`electron` → Electron, `@cesdk/node` or a server project → Node.js, none → Vanilla JS.

| Framework | Docs folder |
|-----------|-------------|
| React | `skills/docs/references/web/react/` |
| Vue.js | `skills/docs/references/web/vue/` |
| Svelte | `skills/docs/references/web/svelte/` |
| Angular | `skills/docs/references/web/angular/` |
| Electron | `skills/docs/references/web/electron/` |
| Vanilla JavaScript | `skills/docs/references/web/js/` |
| Node.js | `skills/docs/references/web/node/` |
| Nuxt.js | `skills/docs/references/web/nuxtjs/` |
| Next.js | `skills/docs/references/web/nextjs/` |
| SvelteKit | `skills/docs/references/web/sveltekit/` |

A monorepo with several of these files or an empty folder is ambiguous: **ask the user which platform and framework to target**
instead of guessing. Never mix content from two platforms in one answer, except
that a Flutter or React Native answer adds the Swift and Kotlin code its native
mapping calls for.

## How to Use

1. Detect the platform and framework as above.
2. Read `README.md` in the matching folder under this skill's `references/`.
   It holds the explanation guidelines and output format for that platform.
3. Ground the explanation in the documentation: follow `README.md` in the
   same platform and framework folder under `skills/docs/references/`.
4. Lead with the concept, then a complete example valid for the detected
   platform, then trade-offs and related topics.

## Related Skills

- Use `/imgly-sdk:docs` for source documentation and API reference
- Use `/imgly-sdk:build` when the user wants implementation, not just explanation
