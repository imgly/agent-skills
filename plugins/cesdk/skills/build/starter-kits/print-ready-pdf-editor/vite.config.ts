import { copyFileSync, existsSync, mkdirSync, readdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { defineConfig, type ResolvedConfig } from 'vite';

const __dirname = dirname(fileURLToPath(import.meta.url));

// The print-ready PDF plugin ships runtime assets (Ghostscript WASM and ICC
// color profiles) that it loads relative to its own module via
// `new URL(file, import.meta.url)`. Two things are needed so they resolve in a
// bundled build:
//   1. Exclude the plugin from dependency pre-bundling so Vite can emit the
//      statically-referenced `gs.wasm` as a build asset.
//   2. Copy the ICC profiles into the build output — their path is computed
//      dynamically, so Vite cannot detect and emit them automatically.
export default defineConfig({
  server: {
    port: 5173
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  },
  optimizeDeps: {
    exclude: ['@imgly/plugin-print-ready-pdfs-web']
  },
  plugins: [copyPrintReadyPdfAssets()]
});

/** Copy the plugin's ICC color profiles into the build's assets directory. */
function copyPrintReadyPdfAssets() {
  const ICC_PROFILES = [
    'ISOcoated_v2_eci.icc',
    'GRACoL2013_CRPC6.icc',
    'sRGB_IEC61966-2-1.icc'
  ];

  let resolvedConfig: ResolvedConfig | null = null;

  return {
    name: 'copy-print-ready-pdf-assets',
    apply: 'build' as const,
    configResolved(config: ResolvedConfig) {
      resolvedConfig = config;
    },
    closeBundle() {
      const pluginDist = resolvePluginDist();
      if (pluginDist == null || resolvedConfig == null) {
        // eslint-disable-next-line no-console
        console.warn(
          'Could not locate @imgly/plugin-print-ready-pdfs-web/dist; ICC profiles were not copied.'
        );
        return;
      }

      const targetDir = join(
        resolvedConfig.build.outDir,
        resolvedConfig.build.assetsDir
      );
      mkdirSync(targetDir, { recursive: true });

      ICC_PROFILES.forEach((file) => {
        const source = join(pluginDist, file);
        if (existsSync(source)) {
          copyFileSync(source, join(targetDir, file));
        } else {
          // eslint-disable-next-line no-console
          console.warn(`ICC profile not found in plugin dist: ${source}`);
        }
      });
    }
  };
}

/** Resolve the plugin's `dist` folder for both npm and pnpm layouts. */
function resolvePluginDist(): string | null {
  const npmDist = join(
    __dirname,
    'node_modules/@imgly/plugin-print-ready-pdfs-web/dist'
  );
  if (existsSync(npmDist)) return npmDist;

  const pnpmDir = join(__dirname, 'node_modules/.pnpm');
  if (existsSync(pnpmDir)) {
    const match = readdirSync(pnpmDir).find((pkg) =>
      pkg.startsWith('@imgly+plugin-print-ready-pdfs-web@')
    );
    if (match != null) {
      const pnpmDist = join(
        pnpmDir,
        match,
        'node_modules/@imgly/plugin-print-ready-pdfs-web/dist'
      );
      if (existsSync(pnpmDist)) return pnpmDist;
    }
  }

  return null;
}
