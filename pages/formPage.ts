import type { Page } from "playwright";
import { expect } from "playwright/test";
import { TEST_DATA, BASE_URL } from "../utils/config.js";

export class FormPage {
    constructor(private page: Page) {}

    async navigate() {
        try {
            await this.page.goto(BASE_URL)
        } catch (error) {
            console.error('Navigation failed: ', error);
            throw error;
        }
    }

    async fillForm() {
        try {
            // Fill in text inputs
            await this.page.locator('input[name="username"]').fill(TEST_DATA.username)
            await this.page.locator('input[name="password"]').fill(TEST_DATA.password)
            await this.page.locator('textarea[name="comments"]').fill(TEST_DATA.comments)

            // Select checkboxes
            for (const value of TEST_DATA.checkboxes) {
                const checkboxSelector = `input[name="checkboxes[]"][value="${value}"]`;
                const checkbox = this.page.locator(checkboxSelector);
                if (await checkbox.isVisible()) {
                    await checkbox.check();
                } else {
                    console.warn(`Checkbox ${value} is not visible.`);
                }
            }

            // Select radio button
            const radioSelector = `input[name="radioval"][value="${TEST_DATA.radio}"]`;
            const radio = this.page.locator(radioSelector);
            if (await radio.isVisible()) {
                await radio.check()
            } else {
                console.warn(`Radio button ${TEST_DATA.radio} is not visible.`);
            }

            // Select multiple-select items
            await this.page.locator('select[name="multipleselect[]"]').selectOption(TEST_DATA.multiple_select_values);

            // Select dropdown item
            const dropdown = this.page.locator('select[name="dropdown"]');
            if (await dropdown.isVisible()) {
                await dropdown.selectOption(TEST_DATA.dropdown);
            } else {
                console.warn('Dropdown is not visible.');
            }
        } catch (error) {
            console.error('Form filling failed: ', error);
            throw error;
        }
    }

    async submit() {
        try {
            await this.page.locator('input[name="submitbutton"][value="submit"]').click();
        } catch (error) {
            console.error('Form submission failed: ', error);
            throw error;
        }
    }

    async validateSubmission() {
        try {
            const explanation = this.page.locator('div[class="explanation"]');
            await expect(explanation).toHaveText(/submitted/i, {timeout: 5000});
        } catch (error) {
            console.error('Validation failed: ', error)
            throw error;
        }
    }
}