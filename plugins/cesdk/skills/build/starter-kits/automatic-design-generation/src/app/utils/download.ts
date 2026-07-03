import type { GeneratedAsset } from '../../imgly';

/**
 * Download an asset as a file
 */
export function downloadAsset(asset: GeneratedAsset): void {
  if (!asset.src) return;

  const extension = asset.type === 'image' ? 'png' : 'mp4';
  const filename = `${asset.label.replace(/ /g, '-').toLowerCase()}.${extension}`;

  const link = document.createElement('a');
  link.href = asset.src;
  link.download = filename;
  link.click();
}
