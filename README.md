# Form Automation Script
This repository contains a Playwright-based automation script for submitting HTML forms. Currrently the only implemented form is [Testpages EvilTester](http://testpages.eviltester.com/pages/forms/html-form), but it can be extended for other forms. The entry point can read user input via command-line arguments for headless mode, slow motion, timeout, automatic closing of browser, JSON-based form data, and domain selection.

---

## Features
- Fill in text inputs, checkboxes, radio buttons, multiple selects, and dropdowns.
- Submit the form and validate that the submission was successful.
- Read form data from a JSON file.
- Configurable via command-line arguments.

---


## Form Handling Architecture
- The main interface for form handling can be found in the abstract class defined in the [FormHandler](./src/pages/formHandler.ts) class. 
- Concrete subclasses implement the logic for forms on a specific domain e.g. the `testpages.eviltester.com` domain's implementation can be found in the [EvilTester](./src/pages/evilTester.ts) class.
- The `FormHandler` class instantiated by the script is determined by the `--domain` flag.
  
---

## Prerequisites
- Node.js v25+
- Node Package Manager (npm)

---

## Installation
1. Clone the repository:
```bash
git clone https://github.com/AdedoyinAA/form-automation.git
cd form-automation
```
2. Install dependencies:
```bash
npm install
```

---

## Project Structure
<pre>
├─ samples/
│  └─ evilTesterFormData.json           # Sample form data
├─ src/
│  ├─ pages/
│  │  └─ evilTester.ts                  # Form automation class
│  │  └─ formHandler.ts                 # Form handler abstract class
│  ├─ utils/
│  │  └─ config.ts                      # Base URLs
│  ├─ tests/
│  │  └─ form.spec.ts                   # Playwright test file
│  └─ index.ts                          # Automation script and CLI entry point
├─ biome.json                           # Linter configuration
├─ package.json                         # Dependencies
├─ playwright.config.js                 # Playwright testing configuration
├─ tsconfig.json                        # Typescript configuration
└─ README.md                            # Documentation
</pre>

---

## Usage
1. Build the TypeScript code and run the automation script:
```bash
npm start -- [options]
```
### Command-Line Options
| **Option**               | **Description**                                            | **Default**                         |
| -----------------------  | ---------------------------------------------------------- | ----------------------------------- |
| `--headless <boolean>`   | Run browser in headless mode (`true`/`false`)              | `false`                             |
| `--slow-mo <number>`     | Slow down each browser action by milliseconds              | `1000`                              |
| `--timeout <number>`     | Timeout for page actions in milliseconds                   | `10000`                             |
| `--auto-close <boolean>` | Automatically close the browser when done (`true`/`false`). If `false` the browser remains open until the script is manually terminated. | `true`                              |
| `--data <path>`          | Path to a JSON file containing form data                   | `./samples/evilTesterFormData.json` |
| `--domain <string>`      | Domain of the form to automate                             | `testpages.eviltester.com`          |
### Example Command
This runs the code in demo mode (headed (browser open), slow motion):
```bash
npm start -- --headless=false --slow-mo=1250 --timeout=20000 --auto-close=false --data=./samples/evilTesterFormData.json --domain=testpages.eviltester.com
```

---

## Sample Form Data
Example of `evilTesterFormData.json` file:
```json
{
  "username": "TestUser",
  "password": "password123",
  "comments": "Instamo technical assessment submission.",
  "checkboxes": ["cb1", "cb3"],
  "radio": "rd1",
  "multiple_select_values": ["ms1", "ms3"],
  "dropdown": "dd2"
}
```

---

## Running Tests
To run the Playwright test:
```bash
npm test
```

---

## Linting and Formatting
- Lint the code:
```bash
npm run lint
```
- Fix linting issues:
```bash
npm run lint:fix
```
- Format code:
```bash
npm run fmt
```

---

