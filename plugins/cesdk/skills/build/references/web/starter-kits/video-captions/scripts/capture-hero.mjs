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
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const browser = await chromium.launch({ headless: false });
    const assetsDir = join(
      __dirname,
      '../../../documentation/src/content/docs/starterkits/video-captions+vcap01/assets'
    );

    // Ensure assets directory exists
    await mkdir(assetsDir, { recursive: true });

    // Helper function to open editor and capture
    async function captureTheme(theme) {
      console.log(`\nCapturing ${theme} theme...`);
      const page = await browser.newPage({
        viewport: { width: 1920, height: 1080 }
      });

      console.log(`Navigating to ${serverUrl}...`);
      await page.goto(serverUrl, { waitUntil: 'networkidle' });

      // Wait for landing page to load
      await page.waitForSelector('[data-mode="pre-captioned"]', {
        timeout: 10000
      });
      console.log('Landing page loaded, clicking pre-captioned mode...');

      // Click the pre-captioned button to open editor
      await page.click('[data-mode="pre-captioned"]');

      // Wait for editor overlay to become visible
      await page.waitForSelector('#editor_overlay.visible', { timeout: 10000 });
      console.log('Editor overlay visible...');

      // Wait for window.cesdk to be available (up to 120 seconds)
      console.log('Waiting for CE.SDK to load...');
      await page.waitForFunction(() => window.cesdk?.ui, { timeout: 120000 });
      console.log('CE.SDK initialized, waiting for scene to stabilize...');
      await page.waitForTimeout(5000);

      // Set CE.SDK theme
      console.log(`Setting CE.SDK to ${theme} theme...`);
      await page.evaluate((t) => {
        window.cesdk.ui.setTheme(t);
      }, theme);
      await page.waitForTimeout(1000); // Wait for theme to apply

      // Take screenshot of the editor modal only
      const modal = await page.$('#editor_modal');
      const pngPath = join(
        assetsDir,
        theme === 'light' ? 'browser.hero.png' : 'browser.hero-dark.png'
      );
      const webpPath = join(
        assetsDir,
        theme === 'light' ? 'browser.hero.webp' : 'browser.hero-dark.webp'
      );

      console.log(`Capturing ${theme} theme screenshot...`);
      await modal.screenshot({
        path: pngPath,
        type: 'png'
      });

      console.log(`Converting to WebP...`);
      await sharp(pngPath).webp({ quality: 85 }).toFile(webpPath);
      await unlink(pngPath);
      console.log(`${theme} theme screenshot captured successfully!`);

      await page.close();
    }

    // Capture both themes
    await captureTheme('light');
    await captureTheme('dark');

    await browser.close();
    console.log('\nHero images captured successfully!');
  } finally {
    // Clean up - kill the server
    if (serverProcess) {
      console.log('Shutting down dev server...');
      serverProcess.kill();
    }
  }
}

captureHero().catch(console.error);
