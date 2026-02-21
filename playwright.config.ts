import { defineConfig } from "@playwright/test";
import { HEADLESS, DEFAULT_TIMEOUT, NAVIGATION_TIMEOUT, SLOW_MO, BASE_URL } from "./utils/config.js";

// Configuration for playwright tests
export default defineConfig({
    testDir: './tests',
    timeout: 30000,
    use: {
        baseURL: BASE_URL,
        headless: HEADLESS,
        actionTimeout: DEFAULT_TIMEOUT,
        navigationTimeout: NAVIGATION_TIMEOUT,
        launchOptions: {
            slowMo: SLOW_MO
        }
    }
})