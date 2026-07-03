import { rgbaToHex } from '../../../imgly/ColorUtilities';
import { useSelectedProperty } from '../../../imgly/UseSelectedProperty';
import classes from './CurrentColorIcon.module.css';

const CurrentColorIcon = ({ property = 'fill/solid/color' }) => {
  const [color] = useSelectedProperty(property);

  return (
    <span
      className={classes.icon}
      style={{ backgroundColor: rgbaToHex(color) }}
    />
  );
};
export default CurrentColorIcon;
