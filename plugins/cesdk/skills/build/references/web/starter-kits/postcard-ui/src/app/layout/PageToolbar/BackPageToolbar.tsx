import { useMemo } from 'react';
import { usePageSettings } from '@/app/contexts/PageSettingsContext';
import ColorDropdown from '@/app/components/ColorDropdown/ColorDropdown';
import TextFontDropdown from '@/app/features/text/TextFontDropdown/TextFontDropdown';
import TextSizeDropdown from '@/app/features/text/TextSizeDropdown/TextSizeDropdown';
import { hexToRgba } from '@/imgly/utils';

const BackPageToolbar = () => {
  const {
    backGreetingsTextTypeface,
    setBackGreetingsTextTypeface,
    backGreetingsTextColor,
    setBackGreetingsTextColor,
    backGreetingsTextSize,
    setBackGreetingsTextSize
  } = usePageSettings();

  const palette = useMemo(
    () =>
      ['#263BAA', '#002094', '#001346', '#000514', '#000000'].map(hexToRgba),
    []
  );

  return (
    <>
      <TextFontDropdown
        activeTypeface={backGreetingsTextTypeface}
        onSelect={setBackGreetingsTextTypeface}
      />
      <ColorDropdown
        label="Color"
        colorPalette={palette}
        activeColor={backGreetingsTextColor}
        onClick={setBackGreetingsTextColor}
      />
      <TextSizeDropdown
        activeTextSize={backGreetingsTextSize}
        onSelect={setBackGreetingsTextSize}
      />
    </>
  );
};
export default BackPageToolbar;
