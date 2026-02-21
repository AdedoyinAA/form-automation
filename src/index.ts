import { chromium } from '@playwright/test';
import type { Browser, Page } from '@playwright/test';
import { EvilTester } from './pages/evilTester.js';
import type { FormData } from './pages/evilTester.js';
import { EVIL_TESTER_URL } from './utils/config.js';
import { Command } from 'commander';
import fs from 'fs/promises';
import path from 'path';

(async () => {
  const program = new Command();

  program
    .option('--headless <boolean>', 'Run in headless mode', 'false')
    .option('--slow-mo <number>', 'Slow down each action in ms', '1000')
    .option('--timeout <number>', 'Timeout for page actions in ms', '10000')
    .option('--auto-close <boolean>', 'Automatically close browser when done', 'true')
    .option('--data <path>', 'Path to JSON file containing form data', './samples/evilTesterFormData.json')
    .parse(process.argv);

  const options = program.opts();

  const HEADLESS_ARG = options.headless === 'true';
  const SLOW_MO_ARG = Number(options.slowMo);
  const TIMEOUT_ARG = Number(options.timeout);
  const AUTO_CLOSE = options.autoClose === 'true';
  const DATA_PATH = options.data;

  console.log(`Running script with args:
  Headless - ${HEADLESS_ARG}
  Slow mo (ms) - ${SLOW_MO_ARG}
  Timeout (ms) - ${TIMEOUT_ARG}
  Auto close - ${AUTO_CLOSE}
  Form data path - ${DATA_PATH}
  `);

  // Read the JSON file
  let formData: FormData;
  try {
    const jsonPath = path.resolve(DATA_PATH);
    const fileContents = await fs.readFile(jsonPath, 'utf-8');
    formData = JSON.parse(fileContents) as FormData;
  } catch (error) {
    console.error('Failed to read or parse form data JSON:', error);
    process.exit(1);
  }

  let browser: Browser | null = null;

  try {
    browser = await chromium.launch({
      headless: HEADLESS_ARG,
      slowMo: SLOW_MO_ARG
    });

    const context = await browser.newContext();
    const page: Page = await context.newPage();

    page.setDefaultTimeout(TIMEOUT_ARG);

    const evilTester = new EvilTester(page, EVIL_TESTER_URL, formData);

    await evilTester.fillForm();
    await evilTester.submit();
    await evilTester.validateSubmission();

    console.log('Form automation completed successfully!');

    if (!AUTO_CLOSE) {
      console.log('AUTO_CLOSE is false: keeping browser open. Press Ctrl+C to exit.');

      const startTime = Date.now();

      const interval = setInterval(() => {
        const elapsedMs = Date.now() - startTime;
        const elapsedSec = Math.floor(elapsedMs / 1000);
        console.log(`Browser still open... running for ${elapsedSec} seconds.`);
      }, 5000);

      await new Promise(() => {}); // infinite wait
      clearInterval(interval);
    }

  } catch (error) {
    console.error('Automation script failed: ', error);
  } finally {
    if (AUTO_CLOSE && browser) {
      await browser.close();
      console.log('Browser closed automatically.');
    }
  }
})();