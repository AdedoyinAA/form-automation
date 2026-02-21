import dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({
    path: resolve(process.cwd(), '.env')
});

// Convert string value from env to boolean
const toBoolean = (value: string | undefined, defaultValue = false): boolean => {
    if (!value) return defaultValue;
    return value.toLowerCase() === 'true';
};

// Convert string value from env to a number
const toNumber = (value: string | undefined, defaultValue: number): number => {
    if (!value) return defaultValue;
    return Number(value);
};

// Browser configuration
export const HEADLESS = toBoolean(process.env.HEADLESS, false);
export const SLOW_MO = toNumber(process.env.SLOW_MO, 1000);

// Test timeouts
export const DEFAULT_TIMEOUT = toNumber(process.env.DEFAULT_TIMEOUT, 10000);
export const NAVIGATION_TIMEOUT = toNumber(process.env.NAVIGATION_TIMEOUT, 30000);

// URL
export const BASE_URL = process.env.BASE_URL || 'http://testpages.eviltester.com/pages/forms/html-form/';

// Form test data
export const TEST_DATA = {
    username: 'TestUser',
    password: 'password123',
    comments: 'Instamo technical assessment submission.',
    checkboxes: ['cb1', 'cb3'],
    radio: 'rd1',
    multiple_select_values: ['ms1', 'ms3'],
    dropdown: 'dd2'
};