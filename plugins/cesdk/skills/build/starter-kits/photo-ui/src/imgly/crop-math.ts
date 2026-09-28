/**
 * Crop Math
 *
 * Conversions between the engine's crop values and the values the crop sliders
 * show.
 */

/**
 * Transforms a cropScaleRatio into a percentage based zoom value
 * @param cropScaleRatio The CropScaleRatio of an image
 * @returns Percentage of the current zoom. 0% equals when no zoom applied. 100% when 'fully' zoomed in.
 */
export function cropScaleRatioToZoomPercentage(cropScaleRatio: number): number {
  if (cropScaleRatio <= 0) return 0;
  return Math.round((1 - 1 / cropScaleRatio) * 100);
}

/**
 * Transforms a percentage based zoom value back into a cropScaleRatio.
 */
export function zoomPercentageToCropScaleRatio(zoomPercentage: number): number {
  return -(100 / (Math.min(99.9, zoomPercentage) - 100));
}

export function radiansToDegree(radians: number): number {
  return Math.round(radians * (180 / Math.PI));
}

export function degreesToRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}
