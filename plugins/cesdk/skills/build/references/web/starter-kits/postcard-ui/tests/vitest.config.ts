import { defineKitVitestConfig } from '@imgly/kit-test-harness/vitest';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

const kitDir = fileURLToPath(new URL('..', import.meta.url));

const config = defineKitVitestConfig({
  kitDir,
  plugins: [
    react(),
    svgr({ svgrOptions: { exportType: 'default' }, include: '**/*.svg' })
  ]
});

// The kit's components import through the `@/` alias its vite.config.ts defines.
(config.resolve!.alias as { find: RegExp; replacement: string }[]).push({
  find: /^@\//,
  replacement: `${resolve(kitDir, 'src')}/`
});

export default config;
