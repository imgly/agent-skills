import { Typeface } from '@cesdk/engine';
import classNames from 'classnames';
import { useEffect, useState } from 'react';
import FontIcon from '@/app/icons/Font.svg';
import { useEngine } from '@/app/contexts/EngineContext';
import { findTypefaces } from '@/imgly/utils';
import FontPreview from '@/app/components/FontPreview/FontPreview';
import Dropdown from '@/app/components/Dropdown/Dropdown';
import classes from './TextFontDropdown.module.css';

const DROPDOWN_FONTS = [
  'Caveat',
  'Courier Prime',
  'Archivo',
  'Roboto',
  // Used as font for text inside the apparel scene template:
  'Oswald',
  'Parisienne'
];

interface TextFontDropdownProps {
  onSelect: (typeface: Typeface) => void;
  activeTypeface: Typeface | null;
}

const TextFontDropdown = ({
  onSelect,
  activeTypeface
}: TextFontDropdownProps) => {
  const [typefaces, setTypefaces] = useState<Typeface[]>([]);
  const { engine } = useEngine();

  useEffect(() => {
    findTypefaces(engine, DROPDOWN_FONTS).then(setTypefaces);
  }, [engine]);

  return (
    <Dropdown Icon={<FontIcon />} label="Font">
      {({ onClose }) => (
        <div className={classes.list}>
          {typefaces.map((typeface) => (
            <button
              key={typeface.name}
              className={classNames(classes.button, {
                [classes['button--active']]:
                  activeTypeface?.name === typeface.name
              })}
              onClick={() => {
                onSelect(typeface);
                onClose();
              }}
            >
              <FontPreview typeface={typeface} />
            </button>
          ))}
        </div>
      )}
    </Dropdown>
  );
};
export default TextFontDropdown;
