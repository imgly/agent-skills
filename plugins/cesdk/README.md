# CE.SDK — Claude Code Plugin

A unified Claude Code plugin for building applications with IMG.LY CreativeEditor SDK (CE.SDK) for **Web** platforms.

## Installation

```bash
claude plugin install cesdk@imgly
```

## Skills

| Skill | Purpose | Invocation |
|-------|---------|------------|
| `docs-react` | Look up CE.SDK React documentation | `/cesdk:docs-react [topic]` |
| `docs-vue` | Look up CE.SDK Vue.js documentation | `/cesdk:docs-vue [topic]` |
| `docs-svelte` | Look up CE.SDK Svelte documentation | `/cesdk:docs-svelte [topic]` |
| `docs-angular` | Look up CE.SDK Angular documentation | `/cesdk:docs-angular [topic]` |
| `docs-electron` | Look up CE.SDK Electron documentation | `/cesdk:docs-electron [topic]` |
| `docs-js` | Look up CE.SDK Vanilla JavaScript documentation | `/cesdk:docs-js [topic]` |
| `docs-node` | Look up CE.SDK Node.js documentation | `/cesdk:docs-node [topic]` |
| `docs-nuxtjs` | Look up CE.SDK Nuxt.js documentation | `/cesdk:docs-nuxtjs [topic]` |
| `docs-nextjs` | Look up CE.SDK Next.js documentation | `/cesdk:docs-nextjs [topic]` |
| `docs-sveltekit` | Look up CE.SDK SvelteKit documentation | `/cesdk:docs-sveltekit [topic]` |
| `build` | Build applications using CE.SDK with guided implementation | `/cesdk:build [feature]` |
| `explain` | Generate custom markdown explanations tailored to your question | `/cesdk:explain [topic]` |

## Agents

| Agent | Purpose |
|-------|---------|
| `builder` | Autonomous CE.SDK project builder — scaffolds complete web apps |

## Usage

### Look up documentation

```
/cesdk:docs-react configuration
```

### Build a feature

```
/cesdk:build add text overlays to images
```

### Get a custom explanation

```
/cesdk:explain how text layers work in the editor
```

## Documentation

All Web documentation is bundled as supporting files in `skills/docs-{platform}/` directories.
Each docs skill has a compressed documentation index and reads directly from the bundled files.
No external services or MCP servers are required.

## License

MIT
