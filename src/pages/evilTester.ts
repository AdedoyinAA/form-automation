import type { Page } from "playwright";
import { expect } from "playwright/test";

// Define a type for form data
export interface FormData {
  username: string;
  password: string;
  comments: string;
  checkboxes: string[];
  radio: string;
  multiple_select_values: string[];
  dropdown: string;
}

export class EvilTester {
  constructor(private page: Page, private url: string, private data: FormData) {
  }


  async fillForm() {
    try {
        await this.page.goto(this.url);
      // Fill in text inputs
      await this.page.locator('input[name="username"]').fill(this.data.username);
      await this.page.locator('input[name="password"]').fill(this.data.password);
      await this.page.locator('textarea[name="comments"]').fill(this.data.comments);

      // Select checkboxes
      for (const value of this.data.checkboxes) {
        const checkboxSelector = `input[name="checkboxes[]"][value="${value}"]`;
        const checkbox = this.page.locator(checkboxSelector);
        if (await checkbox.isVisible()) {
          await checkbox.check();
        } else {
          console.warn(`Checkbox ${value} is not visible.`);
        }
      }

      // Select radio button
      const radioSelector = `input[name="radioval"][value="${this.data.radio}"]`;
      const radio = this.page.locator(radioSelector);
      if (await radio.isVisible()) {
        await radio.check();
      } else {
        console.warn(`Radio button ${this.data.radio} is not visible.`);
      }

      // Select multiple-select items
      await this.page.locator('select[name="multipleselect[]"]').selectOption(this.data.multiple_select_values);

      // Select dropdown item
      const dropdown = this.page.locator('select[name="dropdown"]');
      if (await dropdown.isVisible()) {
        await dropdown.selectOption(this.data.dropdown);
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
      await expect(explanation).toHaveText(/submitted/i, { timeout: 5000 });

      const usernameLocator = this.page.locator('#_valueusername');
      await expect(usernameLocator).toHaveText(this.data.username);

      const passwordLocator = this.page.locator('#_valuepassword');
      await expect(passwordLocator).toHaveText(this.data.password);

      const commentsLocator = this.page.locator('#_valuecomments');
      await expect(commentsLocator).toHaveText(this.data.comments);

      for (let i = 0; i < this.data.checkboxes.length; i++) {
        const value = this.data.checkboxes[i];
        const checkboxLocator = this.page.locator(`#_valuecheckboxes${i}`);
        await expect(checkboxLocator).toHaveText(value!);
      }

      const radioLocator = this.page.locator('#_valueradioval');
      await expect(radioLocator).toHaveText(this.data.radio);

      for (let i = 0; i < this.data.multiple_select_values.length; i++) {
        const value = this.data.multiple_select_values[i];
        const multiLocator = this.page.locator(`#_valuemultipleselect${i}`);
        await expect(multiLocator).toHaveText(value!);
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