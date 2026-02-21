import type { Page } from "playwright";

export abstract class BaseFormPage<T> {
  protected page: Page;
  protected url: string;
  protected data: T;

  constructor(page: Page, url: string, data: T) {
    this.page = page;
    this.url = url;
    this.data = data;
  }

  abstract fillForm(): Promise<void>;

  abstract submit(): Promise<void>;

  abstract validateSubmission(): Promise<void>;
}