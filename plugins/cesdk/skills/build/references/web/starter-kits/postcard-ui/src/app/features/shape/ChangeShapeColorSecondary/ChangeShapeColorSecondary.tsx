import { RGBAColor } from '@cesdk/engine';
import { useMemo } from 'react';
import { useEditor } from '@/app/contexts/EditorContext';
import { useSelectedProperty } from '@/app/hooks/useSelectedProperty';
import ColorSelect from '@/app/components/ColorSelect/ColorSelect';

const ChangeShapeColorSecondary = () => {
  const { getColorPalette } = useEditor();
  const colorPalette = useMemo(() => getColorPalette(), [getColorPalette]);
  const [shapeColor, setShapeColor] =
    useSelectedProperty<RGBAColor>('fill/solid/color');

  return (
    <ColorSelect
      onClick={(color) => setShapeColor(color)}
      activeColor={shapeColor ?? undefined}
      colorPalette={colorPalette}
    />
  );
};
export default ChangeShapeColorSecondary;
