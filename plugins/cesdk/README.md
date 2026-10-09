# IMG.LY SDK – Build Your Own Photo, Video & Design Editor

Build your own photo, video and design editor — white-label, embedded in your app — with the IMG.LY SDK (CreativeEditor SDK, CE.SDK). Skills scaffold, implement and document custom editing experiences and creative automation for Web, iOS, Android, Flutter and React Native.

Give your AI coding assistant expert-level knowledge of CreativeEditor SDK. Build photo editors, video editors, and design tools by describing what you want.

https://github.com/user-attachments/assets/d01073ca-4a6a-49eb-8155-faa25ff04595

## What Are Agent Skills?

[Agent Skills](https://agentskills.io) are portable knowledge packs that plug into AI coding assistants. By installing the CE.SDK plugin, you get:

- **Offline documentation**: All guides, API references, and best practices bundled locally — no external API calls
- **Guided code generation**: Build and explain skills that walk through CE.SDK implementation step by step
- **Autonomous scaffolding**: The build skill creates and verifies complete CE.SDK projects from starter kits

One plugin, `imgly-sdk`, covers:

- **Web** (React, Vue, Svelte, SvelteKit, Angular, Next.js, Nuxt.js, Vanilla JS, Electron, Node.js)
- **Swift** (iOS, macOS, Mac Catalyst)
- **Android** (Kotlin, Jetpack Compose)
- **Flutter** (Dart; `imgly_editor` and `imgly_camera`; native editor on iOS and Android)
- **React Native** (TypeScript; `@imgly/editor-react-native` and `@imgly/camera-react-native`; native editor on iOS and Android)

## Available Skills

| Skill | Description |
|-------|-------------|
| `docs` | Look up CE.SDK guides and API references for the detected platform and framework |
| `explain` | Explain how CE.SDK features work — concepts, architecture, workflows |
| `build` | Implement features and autonomously scaffold complete CE.SDK projects |

Each skill detects the platform and framework from the project and asks when a
project is ambiguous. The bundled content lives under each skill's
`references/` folder, one subfolder per platform and framework. Claude Code
additionally receives a thin optional `builder` adapter that delegates to the
same shared `build` skill. Codex uses the build skill directly.

## Setup Instructions

### Claude Code Plugin

Add the marketplace and install the plugin:

```bash
# Add the marketplace (one-time setup)
claude plugin marketplace add imgly/agent-skills

# Install the plugin
claude plugin install imgly-sdk@imgly
```

### Codex Plugin

Add the same marketplace and install the plugin in Codex:

```bash
# Add the marketplace (one-time setup)
codex plugin marketplace add imgly/agent-skills

# Install the plugin
codex plugin add imgly-sdk@imgly
```

### Installs from before the rename

The plugin used to be called `cesdk`. In Claude Code, an existing
`cesdk@imgly` install keeps updating through an alias entry for the same
plugin. Its skills now show as `/imgly-sdk:docs`, `/imgly-sdk:explain`, and
`/imgly-sdk:build`. New installs use `imgly-sdk@imgly`.

Codex cannot update a plugin under its old name, so an existing `cesdk@imgly`
install stays on its last version. Replace it:

```bash
codex plugin remove cesdk@imgly
codex plugin add imgly-sdk@imgly
```

### Vercel Skills CLI

Install using the [Vercel Skills CLI](https://github.com/vercel-labs/skills):

```bash
# Install all three skills for Claude Code
npx skills add imgly/agent-skills -a claude-code

# Other agents: change the -a value, e.g. codex or cursor
npx skills add imgly/agent-skills -a codex

# Install a single skill
npx skills add imgly/agent-skills --skill docs -a claude-code

# List the skills first
npx skills add imgly/agent-skills --list
```

Install all three skills: `build` and `explain` look up exact APIs in the `docs` skill's `references/` folders.

### Manual Copy

For any skills-compatible agent, copy skill folders directly from the [GitHub repository](https://github.com/imgly/agent-skills):

```bash
# Clone the repo
git clone https://github.com/imgly/agent-skills.git

# Copy a skill into your agent's skills directory
cp -r agent-skills/plugins/cesdk/skills/docs <skills-directory>/docs
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

| Channel | Branch | Matches engine dist-tag | Marketplace |
|---------|--------|-------------------------|-------------|
| Stable | `main` / `latest` | `latest` | `imgly` |
| Prerelease | `next` | `next` | `imgly-next` |
| Nightly | `dev` | `dev` | `imgly-dev` |

Each channel has its own marketplace name, so a prerelease or nightly
marketplace can be added while the stable one stays registered. The plugin is
`imgly-sdk` on every channel, so keep only one channel enabled: two enabled
copies hide each other's skills. For example, to switch from stable to the
prerelease:

```bash
# Claude Code (switch back with: claude plugin enable imgly-sdk@imgly)
claude plugin disable imgly-sdk@imgly
claude plugin marketplace add imgly/agent-skills@next
claude plugin install imgly-sdk@imgly-next

# Codex has no disable command, so remove the stable plugin
codex plugin remove imgly-sdk@imgly
codex plugin marketplace add imgly/agent-skills@next
codex plugin add imgly-sdk@imgly-next
```

A prerelease or nightly installed before the per-channel names is registered as
marketplace `imgly`. Adding the stable marketplace then fails, and Codex stops
updating that install. Remove it and add the channel again, for example for
nightly:

```bash
# Claude Code
claude plugin uninstall cesdk@imgly
claude plugin marketplace remove imgly
claude plugin marketplace add imgly/agent-skills@dev
claude plugin install imgly-sdk@imgly-dev

# Codex
codex plugin remove cesdk@imgly
codex plugin marketplace remove imgly
codex plugin marketplace add imgly/agent-skills@dev
codex plugin add imgly-sdk@imgly-dev
```

Published versions can also be pinned with an exact `v<version>` Git tag.
The bundled update workflow keeps channels separate and never replaces a pinned
version without an explicit request and approval.

## Usage

Ask naturally and let your assistant select the right skill. For explicit
selection, type `/` in Claude Code or `$` in Codex, then choose the matching
skill from the installed CE.SDK plugin.

```text
Use the docs skill to look up CE.SDK React configuration.
Use the build skill to add text overlays to images in my Vue app.
Use the build skill to create an iOS photo editor.
Use the docs skill to look up the Kotlin BlockApi.
Use the build skill to open the CE.SDK editor from my Flutter app.
Use the docs skill to look up openEditor in React Native.
Use the explain skill to describe how the block hierarchy works.
```

## How It Works

The docs skill routes to the platform and framework folder under
`skills/docs/references/`, where the complete CE.SDK guides and API references
live with a compressed index. Skills read directly from these local files —
no network access, no external services.

The build skill includes starter kit templates for common use cases like design
editors, video editors, and photo editors, per platform, and runnable examples
for the Flutter and React Native wrappers. It detects your project's platform
and framework and generates code that matches. A wrapper folder links the
bundled Swift and Android references for everything the wrapper leaves to
native code.

## License

MIT, except the wrapper package sources under
`skills/docs/references/{flutter,react-native}/native-bridge/`. Those are
IMG.LY SDK sources under the IMG.LY Terms of Service, in the license file
of each package folder.

---

[Terms of Service](https://img.ly/tos/) · [Privacy Policy](https://img.ly/privacy-policy/) · Support: [img.ly/support](https://img.ly/support)
