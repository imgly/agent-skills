import { useEditor } from '@/app/contexts/EditorContext';
import { usePageSettings } from '@/app/contexts/PageSettingsContext';
import ColorDropdown from '@/app/components/ColorDropdown/ColorDropdown';
import { hexToRgba } from '@/imgly/utils';

const FrontPageToolbar = () => {
  const { postcardTemplate } = useEditor();
  const {
    frontAccentColor,
    setFrontAccentColor,
    frontBackgroundColor,
    setFrontBackgroundColor
  } = usePageSettings();

  // Template is undefined before a postcard is selected — nothing to render.
  if (!postcardTemplate) return null;

  return (
    <>
      <ColorDropdown
        label="Accent"
        colorPalette={postcardTemplate.colors.map(hexToRgba)}
        activeColor={frontAccentColor}
        onClick={setFrontAccentColor}
      />
      <ColorDropdown
        label="Background"
        colorPalette={postcardTemplate.colors.map(hexToRgba)}
        activeColor={frontBackgroundColor}
        onClick={setFrontBackgroundColor}
      />
    </>
  );
};
export default FrontPageToolbar;
