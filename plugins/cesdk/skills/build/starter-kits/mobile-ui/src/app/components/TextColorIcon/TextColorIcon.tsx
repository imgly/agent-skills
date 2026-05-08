import { rgbaToHex } from '../../../imgly/ColorUtilities';
import { useSelectedProperty } from '../../hooks/UseSelectedProperty';
import classes from './TextColorIcon.module.css';

const TextColorIcon = () => {
  const [fillColor] = useSelectedProperty('fill/solid/color');

  return (
    <span
      className={classes.icon}
      style={{ backgroundColor: rgbaToHex(fillColor) }}
    />
  );
};
export default TextColorIcon;
