import { test, expect } from '@playwright/test';

test('demo test', async ({ page }) => {
    await page.goto('http://testpages.eviltester.com/pages/forms/html-form/');
    expect(await page.title()).toContain('HTML Form');
});