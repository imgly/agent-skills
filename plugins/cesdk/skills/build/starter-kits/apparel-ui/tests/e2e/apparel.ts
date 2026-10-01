import type { Locator, Page } from '@playwright/test';

/**
 * The top bar's undo and redo buttons carry no accessible name (known issue 1),
 * so they are addressed by position: they are the first two buttons on the page.
 */
export const undoButton = (page: Page): Locator =>
  page.getByRole('button').nth(0);
export const redoButton = (page: Page): Locator =>
  page.getByRole('button').nth(1);

/**
 * The colour bar: the swatches followed by the picker trigger, in DOM order.
 * The swatches carry no accessible name either, so the bar is found through the
 * one control in it that has one, three levels up from the picker's trigger.
 */
export const colorBar = (page: Page): Locator =>
  page
    .getByRole('button', { name: 'Pick color' })
    .locator('xpath=ancestor::div[3]');

export const colorSwatch = (page: Page, index: number): Locator =>
  colorBar(page).getByRole('button').nth(index);

/** The six colours `getColorPalette` hardcodes, as the engine stores them. */
export const PALETTE = [
  '#ffffff',
  '#000000',
  '#ff3333',
  '#ffd333',
  '#00d8a4',
  '#335fff'
];
