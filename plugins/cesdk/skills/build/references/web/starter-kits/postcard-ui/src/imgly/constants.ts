/** Block names authored into the postcard scene templates. UI drives blocks by these names. */
export const BLOCK_NAMES = {
  greeting: 'Greeting',
  accent: 'Accent',
  background: 'Background'
} as const;

/** Asset source ids registered on the engine. */
export const ASSET_SOURCES = {
  imageUpload: 'ly.img.image.upload',
  unsplash: 'unsplash',
  shape: 'ly.img.vector.shape',
  sticker: 'ly.img.sticker',
  typeface: 'ly.img.typeface',
  imageColors: 'ly.img.colors.imageColors'
} as const;

/** Typefaces surfaced in the font pickers. */
export const FONT_SUBSET = [
  'Caveat',
  'Courier Prime',
  'Archivo',
  'Roboto',
  'Oswald',
  'Parisienne',
  'Amatic SC',
  'Lobster Two',
  'Nixie One',
  'Quicksand',
  'Abril Fatface',
  'Yeseva One',
  'Notable'
] as const;
