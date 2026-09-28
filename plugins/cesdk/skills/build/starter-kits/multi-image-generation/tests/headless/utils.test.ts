import type { CreativeEngine } from '@cesdk/cesdk-js';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { exportSceneAsImage, replaceImageByName } from '../../src/imgly/utils';
import { createKitEngine, demoImageURL, disposeKitEngine } from './fixtures';

const REPLACEMENT = () => demoImageURL('photo-scoop.png');

let engine: CreativeEngine;
let page: number;
let text: number;
let colorGraphic: number;
let picture: number;

beforeAll(async () => {
  engine = await createKitEngine();

  const scene = engine.scene.create();
  page = engine.block.create('page');
  engine.block.appendChild(scene, page);

  text = engine.block.create('text');
  engine.block.replaceText(text, 'Sample');
  engine.block.setName(text, 'JustText');
  engine.block.appendChild(page, text);

  colorGraphic = engine.block.create('graphic');
  engine.block.setShape(colorGraphic, engine.block.createShape('rect'));
  engine.block.setFill(colorGraphic, engine.block.createFill('color'));
  engine.block.setName(colorGraphic, 'ColorBox');
  engine.block.appendChild(page, colorGraphic);

  picture = engine.block.create('graphic');
  engine.block.setShape(picture, engine.block.createShape('rect'));
  const imageFill = engine.block.createFill('image');
  engine.block.setString(
    imageFill,
    'fill/image/imageFileURI',
    demoImageURL('photo-bean.png')
  );
  engine.block.setFill(picture, imageFill);
  engine.block.setName(picture, 'Picture');
  engine.block.appendChild(page, picture);
}, 180_000);

afterAll(disposeKitEngine);

describe('MIG-H8 replaceImageByName', () => {
  it('replaces the fill of an image block it finds by name', () => {
    replaceImageByName(engine, 'Picture', REPLACEMENT());

    const fill = engine.block.getFill(picture);
    expect(engine.block.getString(fill, 'fill/image/imageFileURI')).toBe(
      REPLACEMENT()
    );
    expect(engine.block.getContentFillMode(picture)).toBe('Cover');
  });

  it('does nothing for a block name that is not in the scene', () => {
    const before = engine.block.findAll().length;
    expect(() =>
      replaceImageByName(engine, 'Nope', REPLACEMENT())
    ).not.toThrow();
    expect(engine.block.findAll()).toHaveLength(before);
  });

  it('does nothing for a text block', () => {
    expect(() =>
      replaceImageByName(engine, 'JustText', REPLACEMENT())
    ).not.toThrow();
    expect(engine.block.getTextColors(text).length).toBeGreaterThan(0);
  });

  it('does nothing for a block whose fill is a colour fill', () => {
    expect(() =>
      replaceImageByName(engine, 'ColorBox', REPLACEMENT())
    ).not.toThrow();
    expect(engine.block.getType(engine.block.getFill(colorGraphic))).toBe(
      '//ly.img.ubq/fill/color'
    );
  });
});

describe('MIG-H8 exportSceneAsImage', () => {
  it('returns null when no scene is loaded', async () => {
    engine.block.destroy(engine.scene.get() as number);
    expect(engine.scene.get()).toBeNull();
    expect(await exportSceneAsImage(engine)).toBeNull();
  });
});
