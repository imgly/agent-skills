# IMG.LY Agent Skills

[![Version](https://img.shields.io/badge/version-1.68.0-blue)](https://github.com/imgly/agent-skills/releases) [![License: MIT](https://img.shields.io/badge/license-MIT-green)](https://opensource.org/licenses/MIT) [![img.ly](https://img.shields.io/badge/img.ly-CE.SDK-orange)](https://img.ly)

Agent skills and a Claude Code plugin for building applications with [IMG.LY CreativeEditor SDK](https://img.ly/docs/cesdk) (CE.SDK) on Web platforms.

## What's Inside

This repo is both a **Claude Code plugin marketplace** and a collection of **Agent Skills** that give AI coding assistants deep knowledge of CE.SDK — documentation, build guidance, and autonomous project scaffolding.

### Skills

| Skill | Description |
|-------|-------------|
| `docs-react` | Look up CE.SDK React reference guides and documentation |
| `docs-vue` | Look up CE.SDK Vue.js reference guides and documentation |
| `docs-svelte` | Look up CE.SDK Svelte reference guides and documentation |
| `docs-sveltekit` | Look up CE.SDK SvelteKit reference guides and documentation |
| `docs-angular` | Look up CE.SDK Angular reference guides and documentation |
| `docs-nextjs` | Look up CE.SDK Next.js reference guides and documentation |
| `docs-nuxtjs` | Look up CE.SDK Nuxt.js reference guides and documentation |
| `docs-electron` | Look up CE.SDK Electron reference guides and documentation |
| `docs-js` | Look up CE.SDK Vanilla JavaScript reference guides and documentation |
| `docs-node` | Look up CE.SDK Node.js reference guides and documentation |
| `build` | Implement features, write code, and set up CE.SDK Web projects |
| `explain` | Explain how CE.SDK Web features work — concepts, architecture, workflows |

### Agents

| Agent | Description |
|-------|-------------|
| `builder` | Autonomous CE.SDK project builder — scaffolds complete web apps using starter kit templates |

## Installation

### Method 1: Vercel Skills CLI

The fastest way to install using [`npx skills`](https://github.com/vercel-labs/skills):

```bash
# Install all skills for Claude Code
npx skills add imgly/agent-skills -a claude-code

# Install all skills globally
npx skills add imgly/agent-skills -g

# Install a specific skill only
npx skills add imgly/agent-skills --skill docs-react -a claude-code

# List available skills first
npx skills add imgly/agent-skills --list
```

### Method 2: Claude Code Plugin Marketplace

Install as a [Claude Code plugin](https://docs.anthropic.com/en/docs/claude-code/plugins):

```bash
# 1. Add the marketplace (one-time setup)
claude plugin marketplace add imgly/agent-skills

# 2. Install the plugin
claude plugin install cesdk@imgly
```

### Method 3: Manual Copy

For any skills-compatible agent, copy skill folders directly into your project:

```bash
# Clone the repo
git clone https://github.com/imgly/agent-skills.git

# Copy a specific skill into your Claude Code project
cp -r agent-skills/plugins/cesdk/skills/docs-react .claude/skills/cesdk-docs-react

# Or copy the agent
cp agent-skills/plugins/cesdk/agents/builder.md .claude/agents/cesdk-builder.md
```

## Usage Examples

### Look up framework-specific documentation

```
/cesdk:docs-react configuration
/cesdk:docs-vue getting started
/cesdk:docs-nextjs server-side rendering
```

### Build a feature with guided implementation

```
/cesdk:build add text overlays to images
/cesdk:build create a photo editor with filters
```

### Get explanations of CE.SDK concepts

```
/cesdk:explain how the block hierarchy works
/cesdk:explain export pipeline and output formats
```

### Use the builder agent for full project scaffolding

The `builder` agent autonomously creates complete CE.SDK web applications — it detects your framework, applies starter kit templates, and implements features end-to-end.

## How It Works

All documentation is bundled as supporting files inside each skill's directory (`skills/docs-{platform}/`). Each docs skill includes a compressed documentation index and reads directly from the bundled files. No external services or MCP servers are required.

## Links

- [CE.SDK Documentation](https://img.ly/docs/cesdk)
- [Agent Skills Specification](https://agentskills.io)
- [Claude Code Plugins](https://docs.anthropic.com/en/docs/claude-code/plugins)
- [Vercel Skills CLI](https://github.com/vercel-labs/skills)

## License

MIT
