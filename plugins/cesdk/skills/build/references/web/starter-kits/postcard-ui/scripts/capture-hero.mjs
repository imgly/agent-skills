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
    const assetsDir = join(__dirname, '../../../documentation/src/content/docs/starterkits/postcard-ui+03mijr/assets');

    // Ensure assets directory exists
    await mkdir(assetsDir, { recursive: true });

    // Capture screenshot
    console.log('Capturing screenshot...');
    const page = await browser.newPage({
      viewport: { width: 1920, height: 1080 }
    });

    console.log(`Navigating to ${serverUrl}...`);
    await page.goto(serverUrl, { waitUntil: 'networkidle' });

    console.log('Waiting for CE.SDK engine to initialize...');
    // Wait for window.cesdk (the engine) to be available
    await page.waitForFunction(() => window.cesdk, { timeout: 60000 });
    console.log('Engine initialized, waiting for scene to load...');

    // Wait for scene to fully render
    await page.waitForTimeout(8000);

    const pngPath = join(assetsDir, 'browser.hero.png');
    const webpPath = join(assetsDir, 'browser.hero.webp');
    console.log(`Capturing screenshot...`);
    await page.screenshot({
      path: pngPath,
      fullPage: false,
      type: 'png'
    });
    console.log(`Converting to WebP...`);
    await sharp(pngPath)
      .webp({ quality: 85 })
      .toFile(webpPath);
    await unlink(pngPath);
    console.log('Screenshot captured successfully!');

    await page.close();
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
