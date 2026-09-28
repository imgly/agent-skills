import type { CreativeEngine } from '@cesdk/cesdk-js';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { applyRestaurantColors } from '../../src/imgly/generation';
import { hexToRgba } from '../../src/imgly/utils';
import {
  createKitEngine,
  demoImageURL,
  disposeKitEngine,
  testRestaurant
} from './fixtures';

const RESTAURANT = testRestaurant();
const PRIMARY = hexToRgba(RESTAURANT.primaryColor);
const SECONDARY = hexToRgba(RESTAURANT.secondaryColor);
const WHITE = { r: 1, g: 1, b: 1, a: 1 };
const BLACK = { r: 0, g: 0, b: 0, a: 1 };
const GREY = { r: 0.5, g: 0.5, b: 0.5, a: 1 };

type Rgba = { r: number; g: number; b: number; a: number };

let engine: CreativeEngine;
let whiteText: number;
let blackText: number;
let greyText: number;
let whiteFill: number;
let imageFill: number;

function expectColor(actual: Rgba, expected: Rgba): void {
  expect(actual.r).toBeCloseTo(expected.r, 5);
  expect(actual.g).toBeCloseTo(expected.g, 5);
  expect(actual.b).toBeCloseTo(expected.b, 5);
}

function textColor(block: number): Rgba {
  return engine.block.getTextColors(block)[0] as Rgba;
}

function colorFillValue(block: number): Rgba {
  return engine.block.getColor(
    engine.block.getFill(block),
    'fill/color/value'
  ) as Rgba;
}

function addText(page: number, color: Rgba): number {
  const block = engine.block.create('text');
  engine.block.replaceText(block, 'Sample');
  engine.block.setTextColor(block, color);
  engine.block.appendChild(page, block);
  return block;
}

function addGraphic(page: number, fill: number): number {
  const block = engine.block.create('graphic');
  engine.block.setShape(block, engine.block.createShape('rect'));
  engine.block.setFill(block, fill);
  engine.block.appendChild(page, block);
  return block;
}

beforeAll(async () => {
  engine = await createKitEngine();

  const scene = engine.scene.create();
  const page = engine.block.create('page');
  engine.block.appendChild(scene, page);

  whiteText = addText(page, WHITE);
  blackText = addText(page, BLACK);
  greyText = addText(page, GREY);

  const colorFill = engine.block.createFill('color');
  engine.block.setColor(colorFill, 'fill/color/value', WHITE);
  whiteFill = addGraphic(page, colorFill);

  const picture = engine.block.createFill('image');
  engine.block.setString(
    picture,
    'fill/image/imageFileURI',
    demoImageURL('photo-bean.png')
  );
  imageFill = addGraphic(page, picture);

  await applyRestaurantColors(engine, RESTAURANT);
}, 180_000);

afterAll(disposeKitEngine);

describe('MIG-H4 brand colours', () => {
  it('turns pure white text into the secondary colour', () => {
    expectColor(textColor(whiteText), SECONDARY);
  });

  it('turns pure black text into the primary colour', () => {
    expectColor(textColor(blackText), PRIMARY);
  });

  it('leaves a mid-grey text block alone', () => {
    expectColor(textColor(greyText), GREY);
  });

  it('turns a pure white colour fill into the secondary colour', () => {
    expectColor(colorFillValue(whiteFill), SECONDARY);
  });

  it('leaves an image fill alone', () => {
    const fill = engine.block.getFill(imageFill);
    expect(engine.block.getType(fill)).toBe('//ly.img.ubq/fill/image');
    expect(engine.block.getString(fill, 'fill/image/imageFileURI')).toBe(
      demoImageURL('photo-bean.png')
    );
  });

  it('sets the three variables even on a scene that uses none of them', () => {
    expect(engine.variable.getString('Name')).toBe(RESTAURANT.name);
    expect(engine.variable.getString('$$')).toBe(RESTAURANT.price);
    expect(engine.variable.getString('Count')).toBe(
      String(RESTAURANT.reviewCount)
    );
  });

  it('is idempotent: a second pass finds no white or black left to change', async () => {
    await applyRestaurantColors(engine, RESTAURANT);
    expectColor(textColor(whiteText), SECONDARY);
    expectColor(textColor(blackText), PRIMARY);
    expectColor(colorFillValue(whiteFill), SECONDARY);
  });
});
