import { chromium } from "@playwright/test";
import type { Browser, Page } from "@playwright/test";
import { EvilTester } from "./pages/evilTester.js";
import type { FormData } from "./pages/baseForm.js";
import { EVIL_TESTER_URL } from "./utils/config.js";
import { Command } from "commander";
import fs from "node:fs/promises";
import path from "node:path";

type FormHandler = {
    fillForm(): Promise<void>;
    submit(): Promise<void>;
    validateSubmission(): Promise<void>;
};

const main = async (): Promise<void> => {
    const program = new Command();

    program
        .option("--headless <boolean>", "Run in headless mode", "false")
        .option("--slow-mo <number>", "Slow down each action in ms", "1000")
        .option("--timeout <number>", "Timeout for page actions in ms", "10000")
        .option(
            "--auto-close <boolean>",
            "Automatically close browser when done",
            "true",
        )
        .option(
            "--data <path>",
            "Path to JSON file containing form data",
            "./samples/evilTesterFormData.json",
        )
        .option(
            "--domain <string>",
            "Domain of the form to automate",
            "testpages.eviltester.com",
        )
        .parse(process.argv);

    const options = program.opts();

    const HEADLESS_ARG = options.headless === "true";
    const SLOW_MO_ARG = Number(options.slowMo);
    const TIMEOUT_ARG = Number(options.timeout);
    const AUTO_CLOSE = options.autoClose === "true";
    const DATA_PATH = options.data;
    const DOMAIN = options.domain;

    console.log(`Running script with args:
Headless - ${HEADLESS_ARG}
Slow mo (ms) - ${SLOW_MO_ARG}
Timeout (ms) - ${TIMEOUT_ARG}
Auto close - ${AUTO_CLOSE}
Form data path - ${DATA_PATH}
Domain - ${DOMAIN}
`);

    // Read the JSON file
    let formData: FormData;
    try {
        const jsonPath = path.resolve(DATA_PATH);
        const fileContents = await fs.readFile(jsonPath, "utf-8");
        formData = JSON.parse(fileContents) as FormData;
    } catch (error) {
        console.error("Failed to read or parse form data JSON:", error);
        process.exit(1);
    }

    let browser: Browser | null = null;

    try {
        browser = await chromium.launch({
            headless: HEADLESS_ARG,
            slowMo: SLOW_MO_ARG,
        });

        const context = await browser.newContext();
        const page: Page = await context.newPage();
        page.setDefaultTimeout(TIMEOUT_ARG);

        // Instantiate the correct form handler based on domain argument
        let formHandler: FormHandler;

        switch (DOMAIN) {
            case "testpages.eviltester.com":
                formHandler = new EvilTester(page, EVIL_TESTER_URL, formData);
                break;
            default:
                throw new Error(
                    `Invalid domain: ${DOMAIN}. No form handler available for this domain.`,
                );
        }

        // Run script automation
        await formHandler.fillForm();
        await formHandler.submit();
        await formHandler.validateSubmission();

        console.log("Form automation completed successfully!");

        if (!AUTO_CLOSE) {
            console.log(
                "AUTO_CLOSE is false: keeping browser open. Press Ctrl+C to exit.",
            );

            const startTime = Date.now();

            const interval = setInterval(() => {
                const elapsedMs = Date.now() - startTime;
                const elapsedSec = Math.floor(elapsedMs / 1000);
                console.log(
                    `Browser still open... running for ${elapsedSec} seconds.`,
                );
            }, 5000);

            await new Promise(() => {}); 
            clearInterval(interval);
        }
    } catch (error) {
        console.error("Automation script failed: ", error);
        if (browser) {
            console.error("Error occured: ", error);
            await browser.close();
            process.exit(1);
        }
    } finally {
        if (AUTO_CLOSE && browser) {
            await browser.close();
            console.log("Browser closed automatically.");
        }
    }
};

main();
