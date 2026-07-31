import { RGBAColor } from '@cesdk/engine';
import { useMemo } from 'react';
import { useEditor } from '@/app/contexts/EditorContext';
import { useSelectedProperty } from '@/app/hooks/useSelectedProperty';
import ColorSelect from '@/app/components/ColorSelect/ColorSelect';

const ChangeTextColorSecondary = () => {
  const { getColorPalette } = useEditor();
  const colorPalette = useMemo(() => getColorPalette(), [getColorPalette]);
  const [textColor, setTextColor] =
    useSelectedProperty<RGBAColor>('fill/solid/color');

  return (
    <ColorSelect
      onClick={setTextColor}
      activeColor={textColor ?? undefined}
      colorPalette={colorPalette}
    />
  );
};
export default ChangeTextColorSecondary;
