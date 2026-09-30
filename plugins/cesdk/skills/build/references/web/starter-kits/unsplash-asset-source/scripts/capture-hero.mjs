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

    const browser = await chromium.launch({ headless: false });
    const assetsDir = join(__dirname, '../../../documentation/src/content/docs/starterkits/unsplash-editor+u5sp1h/assets');

    // Ensure assets directory exists
    await mkdir(assetsDir, { recursive: true });

    // Capture light theme
    console.log('Capturing light theme...');
    const lightPage = await browser.newPage({
      viewport: { width: 1920, height: 1080 }
    });

    console.log(`Navigating to ${serverUrl}...`);
    await lightPage.goto(serverUrl, { waitUntil: 'networkidle' });

    console.log('Waiting for CE.SDK to load...');
    // Wait for window.cesdk to be available (up to 60 seconds)
    await lightPage.waitForFunction(() => window.cesdk?.ui, { timeout: 60000 });
    console.log('CE.SDK initialized, waiting for scene to load...');

    // Wait for scene to be loaded (check for valid scene ID)
    await lightPage.waitForFunction(() => {
      try {
        const sceneId = window.cesdk.engine.scene.get();
        return sceneId !== null && sceneId !== undefined;
      } catch {
        return false;
      }
    }, { timeout: 60000 });
    console.log('Scene loaded, waiting for assets to render...');
    await lightPage.waitForTimeout(5000); // Give time for images to load and render

    // Set CE.SDK to light theme
    console.log('Setting CE.SDK to light theme...');
    await lightPage.evaluate(() => {
      window.cesdk.ui.setTheme('light');
    });
    await lightPage.waitForTimeout(2000); // Wait for theme and scene to fully render

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

    // Capture dark theme
    console.log('Capturing dark theme...');
    const darkPage = await browser.newPage({
      viewport: { width: 1920, height: 1080 }
    });

    console.log(`Navigating to ${serverUrl}...`);
    await darkPage.goto(serverUrl, { waitUntil: 'networkidle' });

    console.log('Waiting for CE.SDK to load...');
    // Wait for window.cesdk to be available (up to 60 seconds)
    await darkPage.waitForFunction(() => window.cesdk?.ui, { timeout: 60000 });
    console.log('CE.SDK initialized, waiting for scene to load...');

    // Wait for scene to be loaded (check for valid scene ID)
    await darkPage.waitForFunction(() => {
      try {
        const sceneId = window.cesdk.engine.scene.get();
        return sceneId !== null && sceneId !== undefined;
      } catch {
        return false;
      }
    }, { timeout: 60000 });
    console.log('Scene loaded, waiting for assets to render...');
    await darkPage.waitForTimeout(5000); // Give time for images to load and render

    // Set CE.SDK to dark theme
    console.log('Setting CE.SDK to dark theme...');
    await darkPage.evaluate(() => {
      window.cesdk.ui.setTheme('dark');
    });
    await darkPage.waitForTimeout(2000); // Wait for theme and scene to fully render

    const darkPngPath = join(assetsDir, 'browser.hero-dark.png');
    const darkWebpPath = join(assetsDir, 'browser.hero-dark.webp');
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

    // Copy light theme hero to starterkit directory
    const starterkitHeroPath = join(__dirname, '../hero.webp');
    console.log('Copying hero image to starterkit directory...');
    await sharp(lightWebpPath)
      .toFile(starterkitHeroPath);
    console.log('Starterkit hero image created!');
  } finally {
    // Clean up - kill the server
    if (serverProcess) {
      console.log('Shutting down dev server...');
      serverProcess.kill();
    }
  }
}

captureHero().catch(console.error);
