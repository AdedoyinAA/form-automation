import { defineConfig } from "@playwright/test";

// Configuration for playwright tests
export default defineConfig({
    testDir: './src/tests',
    timeout: 30000,
    use: {
        headless: true,
        actionTimeout: 10000,
        navigationTimeout: 5000,
        launchOptions: {
            slowMo: 0
        }
    }
})