import { BaseFormPage } from './baseForm.js';
import type { Page } from "playwright";
import { expect } from "playwright/test";

export interface EvilTesterFormData {
    username: string;
    password: string;
    comments: string;
    checkboxes: string[];
    radio: string;
    multiple_select_values: string[];
    dropdown: string;
  }
export class EvilTester extends BaseFormPage<EvilTesterFormData> {
    private selectors = {
        username: 'input[name="username"]',
        password: 'input[name="password"]',
        comments: 'textarea[name="comments"]',
        checkboxes: 'input[name="checkboxes[]"]',
        radio: 'input[name="radioval"]',
        multipleSelect: 'select[name="multipleselect[]"]',
        dropdown: 'select[name="dropdown"]',
        submitButton: 'input[name="submitbutton"][value="submit"]'
      };
  constructor(page: Page, url: string, data: EvilTesterFormData) {
    super(page, url, data);
  }


  async fillForm() {
    try {
      await this.page.goto(this.url);

      // Fill in text inputs
      await this.page.locator(this.selectors.username).fill(this.data.username);
      await this.page.locator(this.selectors.password).fill(this.data.password);
      await this.page.locator(this.selectors.comments).fill(this.data.comments);

      // Checkboxes
      for (const value of this.data.checkboxes) {
        const checkboxLocator = `${this.selectors.checkboxes}[value="${value}"]`;
        if (await this.page.locator(checkboxLocator).isVisible()) {
          await this.page.locator(checkboxLocator).check();
        }
      }

      // Radio button
      const radioLocator = `${this.selectors.radio}[value="${this.data.radio}"]`;
      if (await this.page.locator(radioLocator).isVisible()) {
        await this.page.locator(radioLocator).check();
      }

      // Multiple select
      await this.page.locator(this.selectors.multipleSelect).selectOption(this.data.multiple_select_values);

      // Dropdown
      if (await this.page.locator(this.selectors.dropdown).isVisible()) {
        await this.page.locator(this.selectors.dropdown).selectOption(this.data.dropdown);
      }

    } catch (error) {
      console.error('Form filling failed: ', error);
      throw error;
    }
  }

  async submit() {
    try {
      await this.page.locator(this.selectors.submitButton).click();
    } catch (error) {
      console.error('Form submission failed: ', error);
      throw error;
    }
  }

  async validateSubmission() {
    try {
      const explanation = this.page.locator('div[class="explanation"]');
      await expect(explanation).toHaveText(/submitted/i, { timeout: 5000 });

      const usernameLocator = this.page.locator('#_valueusername');
      await expect(usernameLocator).toHaveText(this.data.username);

      const passwordLocator = this.page.locator('#_valuepassword');
      await expect(passwordLocator).toHaveText(this.data.password);

      const commentsLocator = this.page.locator('#_valuecomments');
      await expect(commentsLocator).toHaveText(this.data.comments);

      for (let i = 0; i < this.data.checkboxes.length; i++) {
        const checkboxLocator = this.page.locator(`#_valuecheckboxes${i}`);
        await expect(checkboxLocator).toHaveText(this.data.checkboxes[i]!);
      }

      const radioLocator = this.page.locator('#_valueradioval');
      await expect(radioLocator).toHaveText(this.data.radio);

      for (let i = 0; i < this.data.multiple_select_values.length; i++) {
        const multiLocator = this.page.locator(`#_valuemultipleselect${i}`);
        await expect(multiLocator).toHaveText(this.data.multiple_select_values[i]!);
      }

      const dropdownLocator = this.page.locator('#_valuedropdown');
      await expect(dropdownLocator).toHaveText(this.data.dropdown);

      console.log('All submitted fields verified successfully!');
    } catch (error) {
      console.error('Validation failed: ', error);
      throw error;
    }
  }
}