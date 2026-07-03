import { useSinglePageMode } from '../../contexts/SinglePageModeContext';
import { useProperty } from '../../contexts/UseSelectedProperty';
import classes from './BackgroundColorIcon.module.css';

function BackgroundColorIcon() {
  const { currentPageBlockId } = useSinglePageMode();
  const [shapeColor] = useProperty(currentPageBlockId, 'fill/solid/color');
  const { r, g, b } = shapeColor ?? {
    r: 0,
    g: 0,
    b: 0
  };
  return (
    <span
      className={classes.icon}
      style={{ backgroundColor: `rgb(${r * 255},${g * 255},${b * 255})` }}
    />
  );
}
export default BackgroundColorIcon;
