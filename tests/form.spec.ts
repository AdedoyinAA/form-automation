import { test } from "@playwright/test";
import { FormPage } from "../pages/formPage.js";
import dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({
    path: resolve(process.cwd(), '.env')
});

test('should successfully submit the HTML form.', async ({ page }) => {
    const formPage = new FormPage(page);
    try {
        await formPage.navigate();
        await formPage.fillForm();
        await formPage.submit();
        await formPage.validateSubmission();
    } catch (error) {
        console.error('Test failed:', error);
        throw error;
    }
    await page.waitForTimeout(10000)
});