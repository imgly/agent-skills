import { chromium } from 'playwright';
import { spawn } from 'child_process';
import { mkdir, unlink } from 'fs/promises';
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

    const browser = await chromium.launch({ headless: true });
    const assetsDir = join(__dirname, '../../../documentation/src/content/docs/starterkits/pptx-template-import+pptx01/assets');

    // Ensure assets directory exists
    await mkdir(assetsDir, { recursive: true });

    // Capture light theme (initial upload screen)
    console.log('Capturing light theme...');
    const lightPage = await browser.newPage({
      viewport: { width: 1920, height: 1080 }
    });

    console.log(`Navigating to ${serverUrl}...`);
    await lightPage.goto(serverUrl, { waitUntil: 'networkidle' });

    console.log('Waiting for page to stabilize...');
    // For importer starterkits, just wait for the upload screen to render
    await lightPage.waitForTimeout(3000);

    const lightPngPath = join(assetsDir, 'browser.hero.png');
    const lightWebpPath = join(assetsDir, 'browser.hero.webp');
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

    await lightPage.close();

    // Capture dark theme (same as light for import screen - skip dark theme)
    console.log('Skipping dark theme for import screens (no theme toggle available)...');

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
