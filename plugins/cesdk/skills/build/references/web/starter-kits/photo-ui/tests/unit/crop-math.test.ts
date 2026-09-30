import { describe, expect, it } from 'vitest';

import {
  cropScaleRatioToZoomPercentage,
  degreesToRadians,
  radiansToDegree,
  zoomPercentageToCropScaleRatio
} from '../../src/imgly/crop-math';
import {
  INITIAL_LANDSCAPE_IMAGE_PATH,
  INITIAL_PORTRAIT_IMAGE_PATH,
  pickInitialImagePath
} from '../../src/imgly/photo-scene';

describe('PH-U3 crop math', () => {
  it('maps a ratio of 1 to no zoom', () => {
    expect(cropScaleRatioToZoomPercentage(1)).toBe(0);
    expect(zoomPercentageToCropScaleRatio(0)).toBe(1);
  });

  it.each([1, 10, 25, 50, 75, 99])(
    'round-trips %i %% through a crop scale ratio',
    (percentage) => {
      const ratio = zoomPercentageToCropScaleRatio(percentage);
      expect(cropScaleRatioToZoomPercentage(ratio)).toBe(percentage);
    }
  );

  it('clamps the upper end at 99.9 %, so 100 % never divides by zero', () => {
    expect(Number.isFinite(zoomPercentageToCropScaleRatio(100))).toBe(true);
    expect(zoomPercentageToCropScaleRatio(100)).toBe(
      zoomPercentageToCropScaleRatio(99.9)
    );
  });

  it('gives a finite ratio for a crop scale ratio of 0 (known issue 2)', () => {
    expect(Number.isFinite(cropScaleRatioToZoomPercentage(0))).toBe(true);
  });

  it.each([0, 45, 90, -44, 180, 359])(
    'round-trips %i degrees through radians',
    (degrees) => {
      expect(radiansToDegree(degreesToRadians(degrees))).toBe(degrees);
    }
  );

  it('rounds radians to whole degrees', () => {
    expect(radiansToDegree(Math.PI)).toBe(180);
    expect(radiansToDegree(0)).toBe(0);
  });
});

describe('PH-U3 the start-up photo follows the viewport', () => {
  it('picks the wide photo on a landscape viewport', () => {
    expect(pickInitialImagePath(1400, 900)).toBe(INITIAL_PORTRAIT_IMAGE_PATH);
  });

  it('picks the other photo on a portrait viewport', () => {
    expect(pickInitialImagePath(390, 844)).toBe(INITIAL_LANDSCAPE_IMAGE_PATH);
  });

  it('names both constants the wrong way round (known issue 10)', () => {
    expect(INITIAL_PORTRAIT_IMAGE_PATH).toMatch(/mountains\.jpg$/);
    expect(INITIAL_LANDSCAPE_IMAGE_PATH).toMatch(/woman\.jpg$/);
  });
});
