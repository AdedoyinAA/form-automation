import type { Page } from "playwright";

export interface FormData {
    username: string;
    password: string;
    comments: string;
    checkboxes: string[];
    radio: string;
    multiple_select_values: string[];
    dropdown: string;
}
export abstract class FormHandler {
    protected page: Page;
    protected url: string;
    protected data: FormData;

    constructor(page: Page, url: string, data: FormData) {
        this.page = page;
        this.url = url;
        this.data = data;
    }

    abstract fillForm(): Promise<void>;

    abstract submit(): Promise<void>;

    abstract validateSubmission(): Promise<void>;
}
