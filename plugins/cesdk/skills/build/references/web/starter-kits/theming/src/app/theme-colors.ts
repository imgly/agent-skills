/**
 * Theming Sidebar - Colour Data
 *
 * The colours the sidebar shows for each built-in theme, and the presets
 * offered for each customisable colour.
 */

export type ColorType = 'surface' | 'canvas' | 'active' | 'accent';

export const THEME_COLORS = {
  light: {
    surfaceColor: '#D6DBE1',
    canvasColor: '#D6DBE1',
    activeColor: '#4E545A',
    accentColor: '#4260F5'
  },
  dark: {
    surfaceColor: '#121A21',
    canvasColor: '#121A21',
    activeColor: '#F5F5F5',
    accentColor: '#415AD3'
  }
};

export const COLOR_PRESETS: Record<ColorType, string[]> = {
  surface: ['#DCDFE1', '#230D38', '#242623', '#FCEFEB', '#060709'],
  canvas: ['#DCDFE1', '#230D38', '#242623', '#FCEFEB', '#060709'],
  active: ['#5D6266', '#D142A3', '#BBC6A4', '#F4BCAC', '#4D5E6D'],
  accent: ['#3E4044', '#66D3EB', '#F6CE4B', '#265E7A', '#D0FDEB']
};
