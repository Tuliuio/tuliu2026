import { chromium } from './node_modules/playwright/index.mjs';

const browser = await chromium.launch();
const page = await browser.newPage();
await page.setViewportSize({ width: 1280, height: 900 });
await page.goto('http://localhost:8080', { waitUntil: 'networkidle' });

const height = await page.evaluate(() => document.body.scrollHeight);
for (let y = 0; y < height; y += 200) {
  await page.evaluate((y) => window.scrollTo(0, y), y);
  await page.waitForTimeout(120);
}
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(4000);
for (let y = 0; y < height; y += 200) {
  await page.evaluate((y) => window.scrollTo(0, y), y);
  await page.waitForTimeout(80);
}
await page.waitForTimeout(1000);
await page.screenshot({ path: '/tmp/candida-full.png', fullPage: true });
await browser.close();
console.log('Done');
