import AdjustmentsBar from '../../ui/AdjustmentsBar/AdjustmentsBar';
import { DEMO_ASSETS_BASE_URL } from '../../contexts/EditorContext';
import classes from './ThemeBar.module.css';

export const ALL_THEMES = [
  {
    id: 'jungle',
    defaultBGColor: '#008625',
    defaultTypeface: 'Aleo'
  },
  {
    id: 'sea',
    defaultBGColor: '#0027BC',
    defaultTypeface: 'Coiny'
  },
  {
    id: 'savanna',
    defaultBGColor: '#E2701D',
    defaultTypeface: 'Trash Hand'
  },
  {
    id: 'castle',
    defaultBGColor: '#DC1876',
    defaultTypeface: 'Elsie Swash Caps'
  }
].map(({ id, ...rest }) => ({
  id,
  label: `${id} Theme`,
  asset: {
    light: `${DEMO_ASSETS_BASE_URL}/themes/${id}-bg-light.svg`,
    dark: `${DEMO_ASSETS_BASE_URL}/themes/${id}-bg-dark.svg`,
    ...rest
  },
  Thumb: (
    <img
      src={`${DEMO_ASSETS_BASE_URL}/themes/${id}-preview.png`}
      alt={`${id} Theme`}
    />
  )
}));

function ThemeBar({ onClick }) {
  return (
    <AdjustmentsBar gap="md">
      {ALL_THEMES.map(({ id, Thumb, asset }) => (
        <button
          className={classes.button}
          key={id}
          onClick={() => onClick(asset)}
        >
          {Thumb}
        </button>
      ))}
    </AdjustmentsBar>
  );
}
export default ThemeBar;
