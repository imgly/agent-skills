import { resolveAssetPath } from '../imgly/resolveAssetPath';

const WEIGHTS: Array<{ weight: number; file: string }> = [
  { weight: 400, file: 'IBMPlexSans-Regular.ttf' },
  { weight: 500, file: 'IBMPlexSans-Medium.ttf' },
  { weight: 600, file: 'IBMPlexSans-SemiBold.ttf' },
  { weight: 700, file: 'IBMPlexSans-Bold.ttf' }
];

export function injectFonts(): void {
  if (document.getElementById('photobook-ui-fonts') != null) return;

  const faces = WEIGHTS.map(
    ({ weight, file }) => `
@font-face {
  font-display: swap;
  font-family: 'IBM Plex Sans';
  font-style: normal;
  font-weight: ${weight};
  src: url('${resolveAssetPath(`/fonts/${file}`)}') format('truetype');
}`
  ).join('\n');

  const style = document.createElement('style');
  style.id = 'photobook-ui-fonts';
  style.textContent = `:root {
  --font-family-ibm-sans: 'IBM Plex Sans', SpockEss-Bold, sans-serif;
}
${faces}`;
  document.head.appendChild(style);
}
