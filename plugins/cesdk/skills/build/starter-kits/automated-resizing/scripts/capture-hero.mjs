import { chromium } from 'playwright';
import { spawn } from 'child_process';
import { copyFile, mkdir, unlink } from 'fs/promises';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __dirname = dirname(fileURLToPath(import.meta.url));

async function captureHero() {
  let serverProcess;
  let serverUrl;

  try {
    // Start the dev server
    console.log('Starting dev server...');
    serverProcess = spawn('npm', ['run', 'dev:local'], {
      stdio: 'pipe',
      shell: true
    });

    // Wait for server to start and detect the port
    serverUrl = await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Server failed to start within 30 seconds'));
      }, 30000);

      serverProcess.stdout.on('data', (data) => {
        const output = data.toString();
        console.log(output);

        // Match Vite's local server URL pattern
        const match = output.match(/Local:\s+(http:\/\/localhost:\d+)/);
        if (match) {
          clearTimeout(timeout);
          resolve(match[1]);
        }
      });

      serverProcess.stderr.on('data', (data) => {
        console.error(data.toString());
      });

      serverProcess.on('error', (err) => {
        clearTimeout(timeout);
        reject(err);
      });
    });

    console.log(`Server started at ${serverUrl}`);

    // Additional wait for server to be fully ready
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Use headless: false for debugging (change to true for CI)
    const browser = await chromium.launch({ headless: false });

    // Documentation assets directory
    const docsAssetsDir = join(__dirname, '../../../documentation/src/content/docs/starterkits/auto-resize+t2jxae/assets');
    // Root hero image for release
    const releaseHeroPath = join(__dirname, '../hero.webp');

    // Ensure assets directory exists
    await mkdir(docsAssetsDir, { recursive: true });

    // Capture light theme
    console.log('Capturing light theme...');
    const lightPage = await browser.newPage({
      viewport: { width: 1920, height: 1080 }
    });

    console.log(`Navigating to ${serverUrl}...`);
    await lightPage.goto(serverUrl, { waitUntil: 'networkidle' });

    console.log('Waiting for page to load...');
    // Wait for the template grid to be populated
    await lightPage.waitForSelector('#template-grid .template-card', { timeout: 30000 });
    console.log('Page loaded, clicking Generate button...');

    // Click the Generate button
    await lightPage.click('#generate-btn');

    console.log('Waiting for variants to be generated...');
    // Wait for at least one export image to appear (data-cy="export-image")
    await lightPage.waitForSelector('[data-cy="export-image"]', { timeout: 120000 });

    // Wait a bit more for all variants to complete and UI to stabilize
    console.log('Waiting for all exports to complete...');
    await lightPage.waitForTimeout(3000);

    const lightPngPath = join(docsAssetsDir, 'browser.hero.png');
    const lightWebpPath = join(docsAssetsDir, 'browser.hero.webp');
    console.log(`Capturing light theme screenshot...`);
    await lightPage.screenshot({
      path: lightPngPath,
      fullPage: false,
      type: 'png'
    });
    console.log(`Converting to WebP...`);
    await sharp(lightPngPath)
      .webp({ quality: 85 })
      .toFile(lightWebpPath);
    await unlink(lightPngPath);
    console.log('Light theme screenshot captured successfully!');

    // Copy to release folder as hero.webp
    console.log('Copying to release folder as hero.webp...');
    await copyFile(lightWebpPath, releaseHeroPath);
    console.log('Hero image copied to release folder!');

    await lightPage.close();

    // Capture dark theme (inject CSS to create dark mode effect)
    console.log('Capturing dark theme...');
    const darkPage = await browser.newPage({
      viewport: { width: 1920, height: 1080 }
    });

    console.log(`Navigating to ${serverUrl}...`);
    await darkPage.goto(serverUrl, { waitUntil: 'networkidle' });

    console.log('Waiting for page to load...');
    await darkPage.waitForSelector('#template-grid .template-card', { timeout: 30000 });

    // Click the Generate button
    await darkPage.click('#generate-btn');

    console.log('Waiting for variants to be generated...');
    await darkPage.waitForSelector('[data-cy="export-image"]', { timeout: 120000 });
    await darkPage.waitForTimeout(3000);

    // Inject dark theme CSS
    console.log('Injecting dark theme CSS...');
    await darkPage.addStyleTag({
      content: `
        :root {
          --color-bg: #1a1a1a !important;
          --color-surface: #2d2d2d !important;
          --color-text: #ffffff !important;
          --color-text-muted: rgba(255, 255, 255, 0.6) !important;
          --color-border: #404040 !important;
        }
        body {
          background: var(--color-bg) !important;
          color: var(--color-text) !important;
        }
        .template-card, .variant-card {
          background: var(--color-surface) !important;
          border-color: var(--color-border) !important;
        }
        .section-header h4 {
          color: var(--color-text) !important;
        }
        .description {
          color: var(--color-text-muted) !important;
        }
        .header-text h4, .header-text span {
          color: var(--color-text) !important;
        }
        .header-text span {
          color: var(--color-text-muted) !important;
        }
      `
    });
    await darkPage.waitForTimeout(500); // Wait for CSS to apply

    const darkPngPath = join(docsAssetsDir, 'browser.hero-dark.png');
    const darkWebpPath = join(docsAssetsDir, 'browser.hero-dark.webp');
    console.log(`Capturing dark theme screenshot...`);
    await darkPage.screenshot({
      path: darkPngPath,
      fullPage: false,
      type: 'png'
    });
    console.log(`Converting to WebP...`);
    await sharp(darkPngPath)
      .webp({ quality: 85 })
      .toFile(darkWebpPath);
    await unlink(darkPngPath);
    console.log('Dark theme screenshot captured successfully!');

    await darkPage.close();
    await browser.close();
  } finally {
    // Clean up - kill the server
    if (serverProcess) {
      console.log('Shutting down dev server...');
      serverProcess.kill();
    }
  }
}

captureHero().catch(console.error);
