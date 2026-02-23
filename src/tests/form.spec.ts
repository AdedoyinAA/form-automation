import { test } from "@playwright/test";
import { EvilTester } from "../pages/evilTester.js";
import { EVIL_TESTER_URL } from "../utils/config.js";

test("should successfully submit the HTML form.", async ({ page }) => {
    const evilTester = new EvilTester(page, EVIL_TESTER_URL, {
        username: "PlaywrightTestUser",
        password: "password123",
        comments: "Instamo technical assessment submission - Playwright test.",
        checkboxes: ["cb1", "cb2"],
        radio: "rd1",
        multiple_select_values: ["ms1", "ms2", "ms3"],
        dropdown: "dd2",
    });
    try {
        await evilTester.fillForm();
        await evilTester.submit();
        await evilTester.validateSubmission();
    } catch (error) {
        console.error("Test failed:", error);
        throw error;
    }
});
