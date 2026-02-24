# CE.SDK Agent Skills

Give your AI coding assistant expert-level knowledge of CreativeEditor SDK. Build photo editors, video editors, and design tools by describing what you want.

https://github.com/user-attachments/assets/d01073ca-4a6a-49eb-8155-faa25ff04595

## What Are Agent Skills?

[Agent Skills](https://agentskills.io) are portable knowledge packs that plug into AI coding assistants. By installing the CE.SDK skills, you get:

- **Offline documentation**: All guides, API references, and best practices bundled locally — no external API calls
- **Guided code generation**: Build and explain skills that walk through CE.SDK implementation step by step
- **Autonomous scaffolding**: A builder agent that creates complete CE.SDK projects from scratch

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
| `build` | Implement features, write code, and set up CE.SDK Web projects |
| `explain` | Explain how CE.SDK Web features work — concepts, architecture, workflows |

The plugin also includes a **builder** agent that autonomously scaffolds complete CE.SDK web applications — detecting your framework, applying starter kit templates, and implementing features end-to-end.

## Setup Instructions

### Claude Code Plugin

Add the marketplace and install the plugin:

```bash
# Add the marketplace (one-time setup)
claude plugin marketplace add imgly/agent-skills

# Install the plugin
claude plugin install cesdk@imgly
```

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

# Copy a specific skill into your Claude Code project
cp -r agent-skills/plugins/cesdk/skills/docs-react .claude/skills/cesdk-docs-react

# Or copy the builder agent
cp agent-skills/plugins/cesdk/agents/builder.md .claude/agents/cesdk-builder.md
```

## Usage

Once installed, invoke skills with slash commands in your AI coding assistant:

### Look up documentation

```
/cesdk:docs-react configuration
/cesdk:docs-vue getting started
/cesdk:docs-nextjs server-side rendering
```

### Build a feature

```
/cesdk:build add text overlays to images
/cesdk:build create a photo editor with filters
```

### Explain a concept

```
/cesdk:explain how the block hierarchy works
/cesdk:explain export pipeline and output formats
```

## How It Works

Each documentation skill bundles the complete CE.SDK guides and API references for its framework in a compressed index. Skills read directly from these local files — no external services or MCP servers are required.

The build skill includes starter kit templates for common use cases like design editors, video editors, and photo editors. It detects your project's framework and generates code accordingly.

## License

MIT
