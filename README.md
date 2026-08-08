# CE.SDK Agent Skills

Give your AI coding assistant expert-level knowledge of CreativeEditor SDK. Build photo editors, video editors, and design tools by describing what you want.

https://github.com/user-attachments/assets/d01073ca-4a6a-49eb-8155-faa25ff04595

## What Are Agent Skills?

[Agent Skills](https://agentskills.io) are portable knowledge packs that plug into AI coding assistants. By installing the CE.SDK skills, you get:

- **Offline documentation**: All guides, API references, and best practices bundled locally — no external API calls
- **Guided code generation**: Build and explain skills that walk through CE.SDK implementation step by step
- **Autonomous scaffolding**: The shared build skill creates and verifies complete CE.SDK projects from scratch

## Available Skills

| Skill | Description |
|-------|-------------|
| `docs-react` | Look up CE.SDK React reference guides and documentation |
| `docs-vue` | Look up CE.SDK Vue.js reference guides and documentation |
| `docs-svelte` | Look up CE.SDK Svelte reference guides and documentation |
| `docs-angular` | Look up CE.SDK Angular reference guides and documentation |
| `docs-electron` | Look up CE.SDK Electron reference guides and documentation |
| `docs-js` | Look up CE.SDK Vanilla JavaScript reference guides and documentation |
| `docs-node` | Look up CE.SDK Node.js reference guides and documentation |
| `docs-nuxtjs` | Look up CE.SDK Nuxt.js reference guides and documentation |
| `docs-nextjs` | Look up CE.SDK Next.js reference guides and documentation |
| `docs-sveltekit` | Look up CE.SDK SvelteKit reference guides and documentation |
| `build` | Implement features and autonomously scaffold complete CE.SDK Web projects |
| `explain` | Explain how CE.SDK Web features work — concepts, architecture, workflows |

Claude Code additionally receives a thin optional `builder` adapter that
delegates to the same shared `build` skill. Codex uses the build skill directly.

Separate native plugins provide the same portable `docs`, `explain`, and
`build` workflow:

| Plugin | Scope |
|---|---|
| `cesdk-swift` | Swift on iOS, macOS, and Mac Catalyst |
| `cesdk-android` | Kotlin and Jetpack Compose on Android |

## Setup Instructions

### Claude Code Plugin

Add the marketplace and install the plugin:

```bash
# Add the marketplace (one-time setup)
claude plugin marketplace add imgly/agent-skills

# Install the plugin
claude plugin install cesdk@imgly

# Install native plugins
claude plugin install cesdk-swift@imgly
claude plugin install cesdk-android@imgly
```

### Codex Plugin

Add the same marketplace and install the plugin in Codex:

```bash
# Add the marketplace (one-time setup)
codex plugin marketplace add imgly/agent-skills

# Install the plugin
codex plugin add cesdk@imgly

# Install native plugins
codex plugin add cesdk-swift@imgly
codex plugin add cesdk-android@imgly
```

### Xcode 27

Import `docs.skill`, `explain.skill`, or `build.skill` from
`xcode/cesdk-swift/` in Xcode's Agent Skills settings. Each archive is
self-contained.

### Vercel Skills CLI

Install using the [Vercel Skills CLI](https://github.com/vercel-labs/skills):

```bash
# Install all skills for Claude Code
npx skills add imgly/agent-skills -a claude-code

# Install a specific skill only
npx skills add imgly/agent-skills --skill docs-react -a claude-code

# List available skills first
npx skills add imgly/agent-skills --list
```

### Manual Copy

For any skills-compatible agent, copy skill folders directly from the [GitHub repository](https://github.com/imgly/agent-skills):

```bash
# Clone the repo
git clone https://github.com/imgly/agent-skills.git

# Copy a specific skill into your agent's skills directory
cp -r agent-skills/plugins/cesdk/skills/docs-react <skills-directory>/cesdk-docs-react

# Copy native documentation skills
cp -r agent-skills/plugins/cesdk-swift/skills/docs <skills-directory>/cesdk-swift-docs
cp -r agent-skills/plugins/cesdk-android/skills/docs <skills-directory>/cesdk-android-docs
```

## Keeping Skills Current

Every generated skill records its CE.SDK version, generation date, and plugin
identifier. When a bundle is over six weeks old, or when you ask about updates,
the assistant can compare it with the matching stable, prerelease, or nightly
IMG.LY channel. This check is read-only.

Before changing anything, the assistant must identify whether the active skill
came from Claude Code, Codex, the Skills CLI, a Git checkout, or a manual copy.
It reports unknown or ambiguous installations instead of guessing and requests
explicit approval for the exact update command and target.

## Release Channels

| Channel | Branch | Matches engine dist-tag |
|---------|--------|-------------------------|
| Stable | `main` / `latest` | `latest` |
| Prerelease | `next` | `next` |
| Nightly | `dev` | `dev` |

Published versions can also be pinned with an exact `v<version>` Git tag.
The bundled update workflow keeps channels separate and never replaces a pinned
version without an explicit request and approval.

## Usage

Ask naturally and let your assistant select the right skill. For explicit
selection, type `/` in Claude Code or `$` in Codex, then choose the matching
skill from the installed CE.SDK plugin.

### Look up documentation

```text
Use the docs-react skill to look up CE.SDK configuration.
Use the docs-vue skill for getting started.
Use the docs-nextjs skill to explain server-side rendering.
```

### Build a feature

```text
Use the build skill to add text overlays to images.
Use the build skill to create a photo editor with filters.
```

### Explain a concept

```text
Use the explain skill to describe how the block hierarchy works.
Use the explain skill to describe the export pipeline and output formats.
```

### Native development

```text
Use the cesdk-swift docs skill to look up IMGLYEngine asset sources.
Use the cesdk-swift build skill to create an iOS photo editor.
Use the cesdk-android docs skill to look up the Kotlin BlockApi.
Use the cesdk-android build skill to create an Android photo editor.
```

## How It Works

Each documentation skill bundles the complete CE.SDK guides and API references for its framework in a compressed index. Skills read directly from these local files — no external services or MCP servers are required.

The build skill includes starter kit templates for common use cases like design editors, video editors, and photo editors. It detects your project's framework and generates code accordingly.

## License

MIT
