---
name: build
description: |
  Implement features and scaffold CE.SDK (IMG.LY CreativeEditor SDK) projects
  from bundled starter kits and examples on Web, Swift, Android, Flutter, and
  React Native. Use for "add", "build", "set up", "create an editor". Not for
  docs or explain.
argument-hint: "[feature or task]"
---

## Version Notice

> CE.SDK `1.85.0-nightly.20261005` · generated `2026-10-04` · plugin `cesdk`
> · canonical update source `imgly/agent-skills`.
>
> If this bundle is over six weeks old, or the user asks about updates, follow
> `references/update-check.md` once per task and reuse the result for all CE.SDK
> skills. Keep the check read-only. Never install, update, overwrite, or delete
> anything without explicit user approval. Continue with this bundle unless an
> update is approved.

# Build with CE.SDK

**Task**: $ARGUMENTS

Covers Web (React, Vue.js, Svelte, Angular, Electron, Vanilla JavaScript, Node.js, Nuxt.js, Next.js, SvelteKit); Flutter (Dart) on iOS and Android; React Native (TypeScript) on iOS and Android; Swift on iOS, macOS, and Mac Catalyst; Kotlin and Jetpack Compose on Android.

## Platform Detection

Detect the platform from the project files, then read the matching reference folder.

| Project files | Platform | Reference folder |
|---------------|----------|------------------|
| `pubspec.yaml` (its `android/` and `ios/` folders belong to the Flutter app) | Flutter (Dart; native editor on iOS and Android) | `references/flutter/` |
| `react-native` in `package.json` dependencies (its `android/` and `ios/` folders belong to the React Native app) | React Native (TypeScript; native editor on iOS and Android) | `references/react-native/` |
| `Package.swift`, `*.xcodeproj`, or `*.xcworkspace` | Swift (iOS, macOS, Mac Catalyst) | `references/swift/` |
| `build.gradle`, `build.gradle.kts`, or `settings.gradle*` | Android (Kotlin, Jetpack Compose) | `references/android/` |
| `package.json` | Web — pick the framework from its dependencies (table below) | `references/web/index.md` |

Match the rows in the order listed. A Flutter or React Native project also
holds `android/` and `ios/` folders, and a React Native project lists
`react` in `package.json`; those files belong to the wrapper app, so its row
wins over the Swift, Android, and Web rows.

### Web framework from `package.json` dependencies

Check in this order: `react-native` → React Native (the row above, not Web), then `next` → Next.js, `nuxt` → Nuxt.js, `@sveltejs/kit` → SvelteKit,
`@angular/core` → Angular, `svelte` → Svelte, `vue` → Vue.js, `react` → React,
`electron` → Electron, `@cesdk/node` or a server project → Node.js, none → Vanilla JS.

| Framework | Build notes |
|-----------|-------------|
| React | `references/web/react.md` |
| Vue.js | `references/web/vue.md` |
| Svelte | `references/web/svelte.md` |
| Angular | `references/web/angular.md` |
| Electron | `references/web/electron.md` |
| Vanilla JavaScript | `references/web/js.md` |
| Node.js | `references/web/node.md` |
| Nuxt.js | `references/web/nuxtjs.md` |
| Next.js | `references/web/nextjs.md` |
| SvelteKit | `references/web/sveltekit.md` |

A monorepo with several of these files or an empty folder is ambiguous: **ask the user which platform and framework to target**
instead of guessing. Never mix content from two platforms in one answer, except
that a Flutter or React Native answer adds the Swift and Kotlin code its native
mapping calls for.

## How to Use

1. Detect the platform and framework as above.
2. Web: read `references/web/index.md`, then the framework file it names and
   `references/web/common.md`. Every other platform: read `README.md` in its
   folder. These hold the implementation workflow, known pitfalls, the starter
   kit or example table, and the output format. Starter kits sit beside them
   under `starter-kits/`; the Flutter and React Native folders hold
   `examples/` instead.
3. Look up exact APIs, package names, and versions in the same platform and
   framework folder under `skills/docs/references/` before writing code.
4. Lead with complete, working code, then a short explanation and next steps.

## Related Skills

- Use `/cesdk:docs` to look up documentation and API reference
- Use `/cesdk:explain` to understand concepts before implementing
- Claude Code: the `builder` agent delegates autonomous scaffolding to this skill
