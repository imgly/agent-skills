import { useEditor } from '../contexts/EditorContext';
import { usePageSettings } from '../contexts/PageSettingsContext';
import ColorDropdown from '../ColorDropdown/ColorDropdown';
import { hexToRgba } from '../../imgly/utils/ColorUtilities';

const FrontPageToolbar = () => {
  const { postcardTemplate } = useEditor();
  const {
    frontAccentColor,
    setFrontAccentColor,
    frontBackgroundColor,
    setFrontBackgroundColor
  } = usePageSettings();

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
