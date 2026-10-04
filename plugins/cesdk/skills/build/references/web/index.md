# CE.SDK Web Build Index

Detect the framework from `package.json`, read its build notes, then read
`common.md` for the shared workflow, pitfalls, output format, and starter kits.

Check dependencies in this order: `next` → Next.js, `nuxt` → Nuxt.js,
`@sveltejs/kit` → SvelteKit, `@angular/core` → Angular, `svelte` → Svelte,
`vue` → Vue.js, `react` → React, `electron` → Electron, `@cesdk/node` or a
server project → Node.js, none → Vanilla JS. No `package.json`, or several
frameworks in one repository: ask the user which framework to target.

| Framework | Build notes | Docs folder |
|-----------|-------------|-------------|
| React | `react.md` | `skills/docs/references/web/react/` |
| Vue.js | `vue.md` | `skills/docs/references/web/vue/` |
| Svelte | `svelte.md` | `skills/docs/references/web/svelte/` |
| Angular | `angular.md` | `skills/docs/references/web/angular/` |
| Electron | `electron.md` | `skills/docs/references/web/electron/` |
| Vanilla JavaScript | `js.md` | `skills/docs/references/web/js/` |
| Node.js | `node.md` | `skills/docs/references/web/node/` |
| Nuxt.js | `nuxtjs.md` | `skills/docs/references/web/nuxtjs/` |
| Next.js | `nextjs.md` | `skills/docs/references/web/nextjs/` |
| SvelteKit | `sveltekit.md` | `skills/docs/references/web/sveltekit/` |

- `common.md` — shared Web workflow, known pitfalls, output format, starter kits
- `starter-kits/` — Vite + TypeScript project templates listed in `common.md`
