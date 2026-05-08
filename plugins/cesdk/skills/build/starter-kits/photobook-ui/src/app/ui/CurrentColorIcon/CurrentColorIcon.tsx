import { rgbaToHex } from '../../contexts/color-utilities';
import { useSelectedProperty } from '../../contexts/UseSelectedProperty';
import classes from './CurrentColorIcon.module.css';

function CurrentColorIcon({ property = 'fill/solid/color' }) {
  const [color] = useSelectedProperty(property);

  return (
    <span
      className={classes.icon}
      style={{ backgroundColor: rgbaToHex(color) }}
    />
  );
}
export default CurrentColorIcon;
