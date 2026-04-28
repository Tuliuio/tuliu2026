import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const stories = [
  { name: 'story-1-dominios', title: 'Domínios e Websites' },
  { name: 'story-2-automacoes', title: 'Automações' },
  { name: 'story-3-agentes-ia', title: 'Agentes de IA' }
];

async function generateScreenshots() {
  const browser = await puppeteer.launch();
  const storiesDir = path.join(__dirname, 'stories');

  for (const story of stories) {
    try {
      const filePath = path.join(storiesDir, `${story.name}.html`);
      const outputPath = path.join(__dirname, `${story.name}-1080x1920.png`);

      const page = await browser.newPage();
      await page.setViewport({ width: 1080, height: 1920, deviceScaleFactor: 2 });
      await page.goto(`file://${filePath}`, { waitUntil: 'networkidle2' });
      await page.screenshot({ path: outputPath, fullPage: true });
      await page.close();

      console.log(`✓ Generated: ${story.name}-1080x1920.png`);
    } catch (error) {
      console.error(`✗ Error generating ${story.name}:`, error.message);
    }
  }

  await browser.close();
  console.log('\n✓ All stories generated successfully!');
}

generateScreenshots().catch(console.error);
